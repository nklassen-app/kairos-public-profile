#!/bin/sh
# What is taken in this repo: every branch on GitHub whose content is not on
# main, with the files it touches. Read only. (.agents/HANDOFF.md, 2)
# "Not on main" is tested by merging, not by counting commits: after a
# squash merge a branch is still ahead in commits with nothing left to add.
git fetch --prune --quiet origin || { echo "could not fetch: tell N."; exit 0; }
main_tree="$(git rev-parse 'origin/main^{tree}')"
found=0
for b in $(git for-each-ref --format='%(refname:short)' refs/remotes/origin | grep -v -E '^origin(/main|/HEAD)?$'); do
  merged="$(git merge-tree --write-tree origin/main "$b" 2>/dev/null | head -1)"
  [ "$merged" = "$main_tree" ] && continue
  echo "$b: $(git diff --name-only "origin/main...$b" | tr '\n' ' ')"; found=1
done
[ "$found" = 1 ] || echo "nothing in flight on GitHub"
