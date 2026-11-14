"use strict";

/**
 * AI Era Digital Concept Lab — Stage 1 Controller
 * Self-contained, zero-dependency client-side controller.
 * Runs under CSP: script-src 'self'; connect-src 'none'.
 */
(function () {
  var ROLE_ROUTES = {
    builder: {
      chamber: "EXP-02",
      label: "Builder",
      chamberTitle: "EXP-02 // The Alignment Crucible",
      rationale:
        "Routed to Tactical Product Ethics: test how Productive Friction preserves user agency, mastery, and participation."
    },
    strategist: {
      chamber: "EXP-01",
      label: "Strategist",
      chamberTitle: "EXP-01 // The Red Queen's Simulator",
      rationale:
        "Routed to Grand Narratives & Macro-History: stress-test technological gateways against social cohesion and epistemic trust."
    },
    philosopher: {
      chamber: "EXP-03",
      label: "Philosopher",
      chamberTitle: "EXP-03 // The Citadel Diagnostic",
      rationale:
        "Routed to Stoic Coping & Inner Citadel: calibrate present mental friction against classical principles."
    },
    leader: {
      chamber: "EXP-04",
      label: "Overwhelmed Leader",
      chamberTitle: "EXP-04 // The Architect's Forge",
      rationale:
        "Routed to AI-Native Workflow & Energy Architecture: transmute draining maintenance into pioneering creation."
    }
  };

  function createLabController() {
    var state = {
      status: "ONLINE // V1.0",
      mode: "lab",
      experimentCount: 4,
      activeRole: null,
      highlightedChamber: null,
      routeMessage:
        "Select your current role or state above to calibrate the workbench and highlight your starting chamber."
    };

    function getState() {
      return {
        status: state.status,
        mode: state.mode,
        experimentCount: state.experimentCount,
        activeRole: state.activeRole,
        highlightedChamber: state.highlightedChamber,
        routeMessage: state.routeMessage
      };
    }

    function setMode(nextMode) {
      if (nextMode !== "lab" && nextMode !== "lore") {
        return getState();
      }
      state.mode = nextMode;
      return getState();
    }

    function selectRole(roleKey) {
      if (!roleKey || !Object.prototype.hasOwnProperty.call(ROLE_ROUTES, roleKey)) {
        state.activeRole = null;
        state.highlightedChamber = null;
        state.routeMessage =
          "Select your current role or state above to calibrate the workbench and highlight your starting chamber.";
        return getState();
      }
      var route = ROLE_ROUTES[roleKey];
      if (state.activeRole === roleKey) {
        state.activeRole = null;
        state.highlightedChamber = null;
        state.routeMessage =
          "All 04 chambers unlocked. Pick a role above to isolate a recommended starting experiment.";
        return getState();
      }
      state.activeRole = roleKey;
      state.highlightedChamber = route.chamber;
      state.routeMessage = route.rationale;
      return getState();
    }

    return {
      ROLE_ROUTES: ROLE_ROUTES,
      getState: getState,
      setMode: setMode,
      selectRole: selectRole
    };
  }

  function bindDom(doc) {
    if (!doc || !doc.body) {
      return;
    }
    var ctrl = createLabController();
    var modeButtons = doc.querySelectorAll("[data-mode-select]");
    var roleButtons = doc.querySelectorAll("[data-role-select]");
    var chamberCards = doc.querySelectorAll("[data-chamber-id]");
    var viewBlocks = doc.querySelectorAll("[data-view]");
    var routeStatusEl = doc.getElementById("router-telemetry-readout");
    var routeTargetBadgeEl = doc.getElementById("router-target-badge");
    var modeTelemetryEl = doc.getElementById("telemetry-mode-readout");

    function render() {
      var current = ctrl.getState();
      doc.body.setAttribute("data-lab-mode", current.mode);

      if (modeTelemetryEl) {
        modeTelemetryEl.textContent =
          current.mode === "lab" ? "MODE // PLAYABLE LAB" : "MODE // MANIFESTO & LORE";
      }

      for (var v = 0; v < viewBlocks.length; v++) {
        var block = viewBlocks[v];
        var viewMode = block.getAttribute("data-view");
        block.hidden = viewMode !== current.mode;
      }

      for (var i = 0; i < modeButtons.length; i++) {
        var btn = modeButtons[i];
        var targetMode = btn.getAttribute("data-mode-select");
        var isCurrent = targetMode === current.mode;
        btn.setAttribute("aria-pressed", isCurrent ? "true" : "false");
        btn.classList.toggle("is-active", isCurrent);
      }

      for (var j = 0; j < roleButtons.length; j++) {
        var rBtn = roleButtons[j];
        var rKey = rBtn.getAttribute("data-role-select");
        var rActive = rKey === current.activeRole;
        rBtn.setAttribute("aria-pressed", rActive ? "true" : "false");
        rBtn.classList.toggle("is-active", rActive);
      }

      for (var k = 0; k < chamberCards.length; k++) {
        var card = chamberCards[k];
        var id = card.getAttribute("data-chamber-id");
        var isHighlighted = current.highlightedChamber === id;
        var isDimmed =
          Boolean(current.highlightedChamber) && current.highlightedChamber !== id;
        card.setAttribute("data-highlighted", isHighlighted ? "true" : "false");
        card.setAttribute("data-dimmed", isDimmed ? "true" : "false");
      }

      if (routeStatusEl) {
        routeStatusEl.textContent = current.routeMessage;
      }
      if (routeTargetBadgeEl) {
        if (current.activeRole && ROLE_ROUTES[current.activeRole]) {
          routeTargetBadgeEl.textContent =
            "TARGET -> " + ROLE_ROUTES[current.activeRole].chamberTitle;
          routeTargetBadgeEl.hidden = false;
        } else {
          routeTargetBadgeEl.textContent = "TARGET -> ALL CHAMBERS (04)";
          routeTargetBadgeEl.hidden = false;
        }
      }
    }

    for (var i = 0; i < modeButtons.length; i++) {
      modeButtons[i].addEventListener("click", function (ev) {
        var targetMode = ev.currentTarget.getAttribute("data-mode-select");
        ctrl.setMode(targetMode);
        render();
      });
    }

    for (var j = 0; j < roleButtons.length; j++) {
      roleButtons[j].addEventListener("click", function (ev) {
        var roleKey = ev.currentTarget.getAttribute("data-role-select");
        var nextState = ctrl.selectRole(roleKey);
        render();
        if (nextState.highlightedChamber) {
          var targetCard = doc.querySelector(
            '[data-chamber-id="' + nextState.highlightedChamber + '"]'
          );
          if (targetCard && typeof targetCard.scrollIntoView === "function") {
            targetCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }
      });
    }

    render();
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        bindDom(document);
      });
    } else {
      bindDom(document);
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      ROLE_ROUTES: ROLE_ROUTES,
      createLabController: createLabController,
      bindDom: bindDom
    };
  }
})();
