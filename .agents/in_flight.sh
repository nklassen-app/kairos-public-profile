#!/bin/sh
# What is taken in this repo: every claude/ or gemini/ branch on GitHub that
# is not merged, with the files it touches. Read only. (.agents/HANDOFF.md, 2)
git fetch --prune --quiet origin || { echo "could not fetch: tell N."; exit 0; }
found=0
for b in $(git branch -r --no-merged origin/main | grep -E 'origin/(claude|gemini)/'); do
  files="$(git diff --name-only "origin/main...$b" | tr '\n' ' ')"
  [ -n "$files" ] || continue
  echo "$b: $files"; found=1
done
[ "$found" = 1 ] || echo "nothing in flight on GitHub"
