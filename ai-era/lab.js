"use strict";

/**
 * AI Era Digital Concept Lab — Dynamic Ancient Greek Polis & Interactive Workbench
 * Inspired by Late Checkout's interactive world canvas, set in an illustrated
 * isometric Aegean Acropolis & Polis.
 * Runs under CSP: script-src 'self'; connect-src 'none'.
 */
(function () {
  var BUILDINGS = {
    AGORA: {
      id: "AGORA",
      title: "The Central Agora of Athens",
      prototype: "AGORA // 00 · The Sacred Way",
      pillar: "Central Forum & Wayfinder",
      coords: "ACROPOLIS // 00°C · CENTRAL AGORA",
      x: 800,
      y: 470,
      camX: 0,
      camY: 0,
      zoom: 1,
      accent: "amber"
    },
    "EXP-01": {
      id: "EXP-01",
      title: "The Tholos of Gateways",
      prototype: "EXP-01 // The Red Queen's Simulator",
      pillar: "The Next Gateway · Macro-History",
      coords: "ACROPOLIS // 315°NW · ASTROLABE THOLOS",
      x: 370,
      y: 250,
      camX: 290,
      camY: 145,
      zoom: 1.55,
      accent: "amber"
    },
    "EXP-02": {
      id: "EXP-02",
      title: "The Forge of Hephaestus",
      prototype: "EXP-02 // The Alignment Crucible",
      pillar: "AI Ethics as a Design Language",
      coords: "ACROPOLIS // 045°NE · CRUCIBLE STOA",
      x: 1230,
      y: 245,
      camX: -270,
      camY: 145,
      zoom: 1.55,
      accent: "copper"
    },
    "EXP-03": {
      id: "EXP-03",
      title: "The Stoic Peristyle Garden",
      prototype: "EXP-03 // The Citadel Diagnostic",
      pillar: "Garden in the Citadel · Inner Resilience",
      coords: "ACROPOLIS // 225°SW · SACRED GROVE",
      x: 355,
      y: 675,
      camX: 290,
      camY: -135,
      zoom: 1.55,
      accent: "sage"
    },
    "EXP-04": {
      id: "EXP-04",
      title: "The Archimedes Watermill & Tower",
      prototype: "EXP-04 // The Architect's Forge",
      pillar: "Workflow & Energy Architecture",
      coords: "ACROPOLIS // 135°SE · AUTOMATON BASTION",
      x: 1225,
      y: 670,
      camX: -270,
      camY: -135,
      zoom: 1.55,
      accent: "cobalt"
    }
  };

  var ROLE_ROUTES = {
    builder: {
      chamber: "EXP-02",
      label: "Builder",
      chamberTitle: "EXP-02 // The Forge of Hephaestus",
      rationale:
        "Camera & Explorer dispatched to the Northeast Forge: equip Productive Friction cards to protect human agency."
    },
    strategist: {
      chamber: "EXP-01",
      label: "Strategist",
      chamberTitle: "EXP-01 // The Tholos of Gateways",
      rationale:
        "Camera & Explorer dispatched to the Northwest Astrolabe Tholos: stress-test civilization metrics across AI gateways."
    },
    philosopher: {
      chamber: "EXP-03",
      label: "Philosopher",
      chamberTitle: "EXP-03 // The Stoic Peristyle Garden",
      rationale:
        "Camera & Explorer dispatched to the Southwest Peristyle Garden: calibrate cognitive friction against Marcus Aurelius."
    },
    leader: {
      chamber: "EXP-04",
      label: "Overwhelmed Leader",
      chamberTitle: "EXP-04 // The Archimedes Tower",
      rationale:
        "Camera & Explorer dispatched to the Southeast Automaton Tower: transmute draining maintenance into creative craft."
    }
  };

  var RED_QUEEN_CHOICES = {
    accelerate: {
      label: "Accelerate & Decentralize",
      velocity: 92,
      cohesion: 38,
      trust: 41,
      verdict:
        "Breakthroughs compound in deterministic domains (proteins, materials), but self-reflexive institutions fracture faster than norms adapt."
    },
    ration: {
      label: "Impose Compute Rationing",
      velocity: 44,
      cohesion: 71,
      trust: 64,
      verdict:
        "Social stability holds in the short term, but the Red Queen's Race stalls frontier discovery in energy and medicine."
    },
    commons: {
      label: "Build Verification Commons",
      velocity: 78,
      cohesion: 74,
      trust: 86,
      verdict:
        "Open provenance and participatory governance slightly temper raw speed while preserving high epistemic trust across the Polis."
    }
  };

  var FRICTION_CARDS = {
    socratic: {
      id: "socratic",
      title: "Socratic Resistance Mode",
      scoreDelta: 34,
      guards: "Prevents skill atrophy by requiring the student's own hypothesis before hinting."
    },
    speedbump: {
      id: "speedbump",
      title: "Cognitive Load Speedbump",
      scoreDelta: 26,
      guards: "Pauses instant generation on complex reasoning steps so human judgment leads."
    },
    provenance: {
      id: "provenance",
      title: "Provenance Watermark",
      scoreDelta: 22,
      guards: "Surfaces confidence bounds and primary sources to prevent blind deference."
    },
    cutoff: {
      id: "cutoff",
      title: "Hard Session Cutoff",
      scoreDelta: 28,
      guards: "Caps parasocial attachment and returns the learner to real-world practice."
    }
  };

  var CITADEL_TRAPS = {
    noise: {
      id: "noise",
      label: "External Noise (Outrage / Feed)",
      quote:
        "“You always own the option of having no opinion. There is never any need to get worked up or to trouble your soul about things you can't control.” — Meditations 6.52",
      protocol:
        "60-Second Protocol: Name one noisy headline pulling at your attention. Ask: 'Does this require a design decision from me today?' If not, close the loop and return to one concrete craft artifact."
    },
    anxiety: {
      id: "anxiety",
      label: "Outcome Anxiety (Future Tripping)",
      quote:
        "“Never let the future disturb you. You will meet it, if you have to, with the same weapons of reason which today arm you against the present.” — Meditations 7.8",
      protocol:
        "60-Second Protocol: Separate the external reception of your work from the internal quality of the next 30 minutes. Write down the smallest testable step you wholly control right now."
    },
    exhaustion: {
      id: "exhaustion",
      label: "Role Exhaustion (People Pleasing)",
      quote:
        "“How much time he gains who does not look to see what his neighbor says or does or thinks, but only at what he does himself, to make it just and reverent.” — Meditations 4.18",
      protocol:
        "60-Second Protocol: Identify one obligation you are carrying purely for appearances. Replace one reactive status reply today with 25 minutes of uninterrupted deep work."
    }
  };

  var FORGE_LENSES = {
    pioneer: {
      id: "pioneer",
      label: "The Pioneer",
      questTitle: "QUEST // Map the Uncharted Territory",
      automation80:
        "80% Delegated to Agent: Cluster the 30 routine stakeholder threads by underlying decision type and draft standard factual replies.",
      craft20:
        "20% Human Craft: Hand-write the single strategic memo that reframes the team's next frontier question."
    },
    dialectician: {
      id: "dialectician",
      label: "The Dialectician",
      questTitle: "QUEST // Extract the Core Tension",
      automation80:
        "80% Delegated to Agent: Distill raw meeting transcripts and scattered notes into a structured Thesis vs. Antithesis brief.",
      craft20:
        "20% Human Craft: Author the synthesis decision and resolve the trade-off with your team in person."
    },
    game: {
      id: "game",
      label: "The Game Designer",
      questTitle: "QUEST // Tune the Feedback Loop",
      automation80:
        "80% Delegated to Agent: Convert recurring status checklists into an automated telemetry table with clear pass/fail triggers.",
      craft20:
        "20% Human Craft: Design the incentive and learning loop that makes the team proud of the craft."
    }
  };

  function createLabController() {
    var state = {
      status: "ONLINE // V1.0",
      mode: "lab",
      subview: "town",
      sky: "helios", // 'helios' (Mediterranean Sunlit Day) or 'nyx' (Starlit Night)
      experimentCount: 4,
      activeRole: null,
      activeChamber: "EXP-01",
      highlightedChamber: "EXP-01",
      drawerOpen: false,
      explorerPos: { x: BUILDINGS.AGORA.x, y: BUILDINGS.AGORA.y },
      camera: { x: 0, y: 0, zoom: 1 },
      routeMessage:
        "Click any temple in the Polis (or choose your role) to fly the camera there and open its interactive chamber.",
      redQueenChoice: "commons",
      equippedFriction: ["socratic", "cutoff"],
      citadelTrap: "noise",
      forgeLens: "pioneer"
    };

    function computeExp02Score() {
      var base = 28;
      for (var i = 0; i < state.equippedFriction.length; i++) {
        var card = FRICTION_CARDS[state.equippedFriction[i]];
        if (card) {
          base += card.scoreDelta;
        }
      }
      return Math.min(98, base);
    }

    function getState() {
      var rq = RED_QUEEN_CHOICES[state.redQueenChoice] || RED_QUEEN_CHOICES.commons;
      var trap = CITADEL_TRAPS[state.citadelTrap] || CITADEL_TRAPS.noise;
      var lens = FORGE_LENSES[state.forgeLens] || FORGE_LENSES.pioneer;
      var bld = BUILDINGS[state.activeChamber] || BUILDINGS["EXP-01"];

      return {
        status: state.status,
        mode: state.mode,
        subview: state.subview,
        sky: state.sky,
        experimentCount: state.experimentCount,
        activeRole: state.activeRole,
        activeChamber: state.activeChamber,
        highlightedChamber: state.highlightedChamber,
        drawerOpen: state.drawerOpen,
        explorerPos: { x: state.explorerPos.x, y: state.explorerPos.y },
        camera: { x: state.camera.x, y: state.camera.y, zoom: state.camera.zoom },
        buildingInfo: bld,
        routeMessage: state.routeMessage,
        redQueen: {
          choice: state.redQueenChoice,
          label: rq.label,
          metrics: {
            velocity: rq.velocity,
            cohesion: rq.cohesion,
            trust: rq.trust
          },
          verdict: rq.verdict
        },
        crucible: {
          equipped: state.equippedFriction.slice(),
          deploymentScore: computeExp02Score()
        },
        citadel: {
          trap: state.citadelTrap,
          label: trap.label,
          quote: trap.quote,
          protocol: trap.protocol
        },
        forge: {
          lens: state.forgeLens,
          label: lens.label,
          questTitle: lens.questTitle,
          automation80: lens.automation80,
          craft20: lens.craft20
        }
      };
    }

    function setMode(nextMode) {
      if (nextMode !== "lab" && nextMode !== "lore") {
        return getState();
      }
      state.mode = nextMode;
      return getState();
    }

    function setSubview(nextSubview) {
      if (nextSubview !== "town" && nextSubview !== "cards") {
        return getState();
      }
      state.subview = nextSubview;
      return getState();
    }

    function toggleSky() {
      state.sky = state.sky === "helios" ? "nyx" : "helios";
      return getState();
    }

    function resetCamera() {
      state.activeRole = null;
      state.drawerOpen = false;
      state.explorerPos = { x: BUILDINGS.AGORA.x, y: BUILDINGS.AGORA.y };
      state.camera = { x: 0, y: 0, zoom: 1 };
      state.routeMessage =
        "Overview of the Full Polis. Click any temple, harbor stall, or role pill to zoom in.";
      return getState();
    }

    function visitBuilding(buildingId) {
      if (!buildingId || !Object.prototype.hasOwnProperty.call(BUILDINGS, buildingId)) {
        return getState();
      }
      if (buildingId === "AGORA") {
        return resetCamera();
      }
      var target = BUILDINGS[buildingId];
      state.activeChamber = buildingId;
      state.highlightedChamber = buildingId;
      state.drawerOpen = true;
      state.explorerPos = { x: target.x, y: target.y };
      state.camera = { x: target.camX, y: target.camY, zoom: target.zoom };
      state.routeMessage =
        "Entered " + target.title + " (" + target.coords + "). Workbench active.";
      return getState();
    }

    function selectRole(roleKey) {
      if (!roleKey || !Object.prototype.hasOwnProperty.call(ROLE_ROUTES, roleKey)) {
        return getState();
      }
      var route = ROLE_ROUTES[roleKey];
      state.activeRole = roleKey;
      visitBuilding(route.chamber);
      state.routeMessage = route.rationale;
      return getState();
    }

    function chooseRedQueenOption(optionKey) {
      if (Object.prototype.hasOwnProperty.call(RED_QUEEN_CHOICES, optionKey)) {
        state.redQueenChoice = optionKey;
      }
      return getState().redQueen;
    }

    function toggleFrictionCard(cardKey) {
      if (!Object.prototype.hasOwnProperty.call(FRICTION_CARDS, cardKey)) {
        return getState().crucible;
      }
      var idx = state.equippedFriction.indexOf(cardKey);
      if (idx >= 0) {
        if (state.equippedFriction.length > 1) {
          state.equippedFriction.splice(idx, 1);
        }
      } else {
        if (state.equippedFriction.length >= 2) {
          state.equippedFriction.shift();
        }
        state.equippedFriction.push(cardKey);
      }
      return getState().crucible;
    }

    function selectCitadelTrap(trapKey) {
      if (Object.prototype.hasOwnProperty.call(CITADEL_TRAPS, trapKey)) {
        state.citadelTrap = trapKey;
      }
      return getState().citadel;
    }

    function selectForgeLens(lensKey) {
      if (Object.prototype.hasOwnProperty.call(FORGE_LENSES, lensKey)) {
        state.forgeLens = lensKey;
      }
      return getState().forge;
    }

    return {
      BUILDINGS: BUILDINGS,
      ROLE_ROUTES: ROLE_ROUTES,
      getState: getState,
      setMode: setMode,
      setSubview: setSubview,
      toggleSky: toggleSky,
      resetCamera: resetCamera,
      visitBuilding: visitBuilding,
      selectRole: selectRole,
      chooseRedQueenOption: chooseRedQueenOption,
      toggleFrictionCard: toggleFrictionCard,
      selectCitadelTrap: selectCitadelTrap,
      selectForgeLens: selectForgeLens
    };
  }

  function bindDom(doc) {
    if (!doc || !doc.body) {
      return;
    }
    var ctrl = createLabController();
    var modeButtons = doc.querySelectorAll("[data-mode-select]");
    var subviewButtons = doc.querySelectorAll("[data-subview-select]");
    var roleButtons = doc.querySelectorAll("[data-role-select]");
    var buildingNodes = doc.querySelectorAll("[data-building-id]");
    var pathNodes = doc.querySelectorAll("[data-path-to]");
    var chamberPanels = doc.querySelectorAll("[data-chamber-panel]");
    var chamberCards = doc.querySelectorAll("[data-chamber-id]");
    var viewBlocks = doc.querySelectorAll("[data-view]");
    var subviewBlocks = doc.querySelectorAll("[data-subview]");
    var resetCamButtons = doc.querySelectorAll("[data-reset-camera]");
    var skyToggleBtn = doc.getElementById("sky-toggle-btn");

    var worldCameraGroup = doc.getElementById("world-camera");
    var explorerGroup = doc.getElementById("town-explorer");
    var inspectorDrawer = doc.getElementById("temple-inspector-drawer");
    var townCoordsEl = doc.getElementById("town-hud-coords");
    var townTitleEl = doc.getElementById("town-hud-building");
    var routeStatusEl = doc.getElementById("router-telemetry-readout");
    var modeTelemetryEl = doc.getElementById("telemetry-mode-readout");
    var mapStageEl = doc.getElementById("polis-viewport");

    var rqButtons = doc.querySelectorAll("[data-rq-choice]");
    var frictionButtons = doc.querySelectorAll("[data-friction-card]");
    var citadelButtons = doc.querySelectorAll("[data-citadel-trap]");
    var forgeButtons = doc.querySelectorAll("[data-forge-lens]");

    var parallaxOffset = { x: 0, y: 0 };

    function updateCameraTransform() {
      if (!worldCameraGroup) return;
      var st = ctrl.getState();
      var tx = st.camera.x + parallaxOffset.x;
      var ty = st.camera.y + parallaxOffset.y;
      var z = st.camera.zoom;
      worldCameraGroup.style.transform =
        "translate(" + tx + "px, " + ty + "px) scale(" + z + ")";
    }

    function render() {
      var current = ctrl.getState();
      doc.body.setAttribute("data-lab-mode", current.mode);
      doc.body.setAttribute("data-sky", current.sky);

      if (modeTelemetryEl) {
        modeTelemetryEl.textContent =
          current.mode === "lab" ? "MODE // PLAYABLE POLIS" : "MODE // MANIFESTO & LORE";
      }

      if (skyToggleBtn) {
        skyToggleBtn.textContent =
          current.sky === "helios" ? "☀ HELIOS DAY" : "☾ NYX NIGHT";
      }

      for (var v = 0; v < viewBlocks.length; v++) {
        var block = viewBlocks[v];
        block.hidden = block.getAttribute("data-view") !== current.mode;
      }

      for (var sv = 0; sv < subviewBlocks.length; sv++) {
        var sBlock = subviewBlocks[sv];
        sBlock.hidden = sBlock.getAttribute("data-subview") !== current.subview;
      }

      for (var i = 0; i < modeButtons.length; i++) {
        var btn = modeButtons[i];
        var isCurrent = btn.getAttribute("data-mode-select") === current.mode;
        btn.setAttribute("aria-pressed", isCurrent ? "true" : "false");
        btn.classList.toggle("is-active", isCurrent);
      }

      for (var sb = 0; sb < subviewButtons.length; sb++) {
        var sBtn = subviewButtons[sb];
        var isSub = sBtn.getAttribute("data-subview-select") === current.subview;
        sBtn.setAttribute("aria-pressed", isSub ? "true" : "false");
        sBtn.classList.toggle("is-active", isSub);
      }

      for (var j = 0; j < roleButtons.length; j++) {
        var rBtn = roleButtons[j];
        var rActive = rBtn.getAttribute("data-role-select") === current.activeRole;
        rBtn.setAttribute("aria-pressed", rActive ? "true" : "false");
        rBtn.classList.toggle("is-active", rActive);
      }

      for (var b = 0; b < buildingNodes.length; b++) {
        var bNode = buildingNodes[b];
        var bId = bNode.getAttribute("data-building-id");
        var bActive = current.drawerOpen && bId === current.activeChamber;
        bNode.setAttribute("data-active", bActive ? "true" : "false");
      }

      for (var p = 0; p < pathNodes.length; p++) {
        var pNode = pathNodes[p];
        var pTarget = pNode.getAttribute("data-path-to");
        pNode.setAttribute(
          "data-active",
          current.drawerOpen && pTarget === current.activeChamber ? "true" : "false"
        );
      }

      if (explorerGroup) {
        explorerGroup.setAttribute(
          "transform",
          "translate(" + current.explorerPos.x + ", " + current.explorerPos.y + ")"
        );
      }

      updateCameraTransform();

      if (inspectorDrawer) {
        inspectorDrawer.setAttribute(
          "data-open",
          current.drawerOpen ? "true" : "false"
        );
      }

      if (townCoordsEl && current.buildingInfo) {
        townCoordsEl.textContent = current.drawerOpen
          ? current.buildingInfo.coords
          : BUILDINGS.AGORA.coords;
      }
      if (townTitleEl && current.buildingInfo) {
        townTitleEl.textContent =
          "TEMPLE INTERIOR // " + current.buildingInfo.title.toUpperCase();
      }

      for (var cp = 0; cp < chamberPanels.length; cp++) {
        var panel = chamberPanels[cp];
        var panelId = panel.getAttribute("data-chamber-panel");
        panel.hidden = panelId !== current.activeChamber;
      }

      for (var k = 0; k < chamberCards.length; k++) {
        var card = chamberCards[k];
        var id = card.getAttribute("data-chamber-id");
        var isHighlighted = current.highlightedChamber === id;
        card.setAttribute("data-highlighted", isHighlighted ? "true" : "false");
      }

      if (routeStatusEl) {
        routeStatusEl.textContent = current.routeMessage;
      }

      // Render EXP-01 Red Queen Simulator state
      for (var rqi = 0; rqi < rqButtons.length; rqi++) {
        var rqBtn = rqButtons[rqi];
        var isRq = rqBtn.getAttribute("data-rq-choice") === current.redQueen.choice;
        rqBtn.setAttribute("aria-pressed", isRq ? "true" : "false");
        rqBtn.classList.toggle("is-active", isRq);
      }
      var vVal = doc.getElementById("rq-velocity-val");
      var cVal = doc.getElementById("rq-cohesion-val");
      var tVal = doc.getElementById("rq-trust-val");
      var vBar = doc.getElementById("rq-velocity-bar");
      var cBar = doc.getElementById("rq-cohesion-bar");
      var tBar = doc.getElementById("rq-trust-bar");
      var rqVerdict = doc.getElementById("rq-verdict-text");
      if (vVal) vVal.textContent = current.redQueen.metrics.velocity + "%";
      if (cVal) cVal.textContent = current.redQueen.metrics.cohesion + "%";
      if (tVal) tVal.textContent = current.redQueen.metrics.trust + "%";
      if (vBar) vBar.style.width = current.redQueen.metrics.velocity + "%";
      if (cBar) cBar.style.width = current.redQueen.metrics.cohesion + "%";
      if (tBar) tBar.style.width = current.redQueen.metrics.trust + "%";
      if (rqVerdict) rqVerdict.textContent = current.redQueen.verdict;

      // Render EXP-02 Alignment Crucible state
      var equipped = current.crucible.equipped;
      for (var fi = 0; fi < frictionButtons.length; fi++) {
        var fBtn = frictionButtons[fi];
        var fKey = fBtn.getAttribute("data-friction-card");
        var isEq = equipped.indexOf(fKey) >= 0;
        fBtn.setAttribute("aria-pressed", isEq ? "true" : "false");
        fBtn.classList.toggle("is-active", isEq);
      }
      var scoreEl = doc.getElementById("crucible-score-val");
      var guardEl = doc.getElementById("crucible-guard-readout");
      if (scoreEl) {
        scoreEl.textContent = current.crucible.deploymentScore + " / 100";
      }
      if (guardEl) {
        var summaries = [];
        for (var gi = 0; gi < equipped.length; gi++) {
          var fc = FRICTION_CARDS[equipped[gi]];
          if (fc) summaries.push(fc.guards);
        }
        guardEl.textContent = summaries.join(" ");
      }

      // Render EXP-03 Citadel Diagnostic state
      for (var ci = 0; ci < citadelButtons.length; ci++) {
        var cBtn = citadelButtons[ci];
        var isTrap = cBtn.getAttribute("data-citadel-trap") === current.citadel.trap;
        cBtn.setAttribute("aria-pressed", isTrap ? "true" : "false");
        cBtn.classList.toggle("is-active", isTrap);
      }
      var quoteEl = doc.getElementById("citadel-quote-text");
      var protoEl = doc.getElementById("citadel-protocol-text");
      if (quoteEl) quoteEl.textContent = current.citadel.quote;
      if (protoEl) protoEl.textContent = current.citadel.protocol;

      // Render EXP-04 Architect's Forge state
      for (var li = 0; li < forgeButtons.length; li++) {
        var lBtn = forgeButtons[li];
        var isLens = lBtn.getAttribute("data-forge-lens") === current.forge.lens;
        lBtn.setAttribute("aria-pressed", isLens ? "true" : "false");
        lBtn.classList.toggle("is-active", isLens);
      }
      var questEl = doc.getElementById("forge-quest-title");
      var autoEl = doc.getElementById("forge-auto-text");
      var craftEl = doc.getElementById("forge-craft-text");
      if (questEl) questEl.textContent = current.forge.questTitle;
      if (autoEl) autoEl.textContent = current.forge.automation80;
      if (craftEl) craftEl.textContent = current.forge.craft20;
    }

    for (var i = 0; i < modeButtons.length; i++) {
      modeButtons[i].addEventListener("click", function (ev) {
        ctrl.setMode(ev.currentTarget.getAttribute("data-mode-select"));
        render();
      });
    }

    for (var sb = 0; sb < subviewButtons.length; sb++) {
      subviewButtons[sb].addEventListener("click", function (ev) {
        ctrl.setSubview(ev.currentTarget.getAttribute("data-subview-select"));
        render();
      });
    }

    if (skyToggleBtn) {
      skyToggleBtn.addEventListener("click", function () {
        ctrl.toggleSky();
        render();
      });
    }

    for (var rc = 0; rc < resetCamButtons.length; rc++) {
      resetCamButtons[rc].addEventListener("click", function () {
        ctrl.resetCamera();
        render();
      });
    }

    for (var j = 0; j < roleButtons.length; j++) {
      roleButtons[j].addEventListener("click", function (ev) {
        ctrl.selectRole(ev.currentTarget.getAttribute("data-role-select"));
        render();
      });
    }

    for (var b = 0; b < buildingNodes.length; b++) {
      buildingNodes[b].addEventListener("click", function (ev) {
        ev.stopPropagation();
        ctrl.visitBuilding(ev.currentTarget.getAttribute("data-building-id"));
        render();
      });
      buildingNodes[b].addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          ctrl.visitBuilding(ev.currentTarget.getAttribute("data-building-id"));
          render();
        }
      });
    }

    // Subtle Late-Checkout-style mouse parallax over the Polis viewport
    if (mapStageEl && typeof mapStageEl.addEventListener === "function") {
      mapStageEl.addEventListener("mousemove", function (ev) {
        var rect = mapStageEl.getBoundingClientRect();
        if (!rect || !rect.width || !rect.height) return;
        var nx = (ev.clientX - rect.left) / rect.width - 0.5;
        var ny = (ev.clientY - rect.top) / rect.height - 0.5;
        parallaxOffset.x = Math.round(-nx * 28);
        parallaxOffset.y = Math.round(-ny * 18);
        updateCameraTransform();
      });
      mapStageEl.addEventListener("mouseleave", function () {
        parallaxOffset.x = 0;
        parallaxOffset.y = 0;
        updateCameraTransform();
      });
    }

    for (var k = 0; k < chamberCards.length; k++) {
      chamberCards[k].addEventListener("click", function (ev) {
        var cid = ev.currentTarget.getAttribute("data-chamber-id");
        ctrl.visitBuilding(cid);
        ctrl.setSubview("town");
        render();
      });
    }

    for (var rqi = 0; rqi < rqButtons.length; rqi++) {
      rqButtons[rqi].addEventListener("click", function (ev) {
        ctrl.chooseRedQueenOption(ev.currentTarget.getAttribute("data-rq-choice"));
        render();
      });
    }

    for (var fi = 0; fi < frictionButtons.length; fi++) {
      frictionButtons[fi].addEventListener("click", function (ev) {
        ctrl.toggleFrictionCard(ev.currentTarget.getAttribute("data-friction-card"));
        render();
      });
    }

    for (var ci = 0; ci < citadelButtons.length; ci++) {
      citadelButtons[ci].addEventListener("click", function (ev) {
        ctrl.selectCitadelTrap(ev.currentTarget.getAttribute("data-citadel-trap"));
        render();
      });
    }

    for (var li = 0; li < forgeButtons.length; li++) {
      forgeButtons[li].addEventListener("click", function (ev) {
        ctrl.selectForgeLens(ev.currentTarget.getAttribute("data-forge-lens"));
        render();
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
      BUILDINGS: BUILDINGS,
      ROLE_ROUTES: ROLE_ROUTES,
      createLabController: createLabController,
      bindDom: bindDom
    };
  }
})();
