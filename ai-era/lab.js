"use strict";

/**
 * AI Era Digital Concept Lab — 2.5D Isometric Athenian Agora & Polis Controller
 * Self-contained, zero-dependency client-side controller.
 * Runs under CSP: script-src 'self'; connect-src 'none'.
 */
(function () {
  var BUILDINGS = {
    AGORA: {
      id: "AGORA",
      route: "/agora",
      title: "The Central Agora Basin",
      roleSubtitle: "Central Forum · The Panathenaic Way",
      thesis:
        "The civic heart of the Polis where the Panathenaic Way connects the southern harbor to the elevated sanctuaries.",
      prototype: "AGORA // 00 · The Panathenaic Way",
      pillar: "Central Forum & Wayfinder",
      x: 785,
      y: 412,
      camX: 0,
      camY: 0,
      zoom: 1,
      accent: "amber"
    },
    "EXP-01": {
      id: "EXP-01",
      route: "/strategist",
      landmark: "Acropolis",
      title: "The Strategist: The Next Gateway",
      roleSubtitle: "The Strategist: The Next Gateway",
      thesis:
        "Some thresholds only open one way. Humanity did not go back on agriculture, or the mechanical engine. I'm a historian by training, and I think we are standing in front of another oneway gateway. For decades innovation has felt like a Red Queen's Race: ever more effort to stay roughly where we are. Is AI the exit? I don't know yet. The Next Gateway is where I work on that question.",
      prototype: "EXP-01 // The Next Gateway",
      pillar: "The Strategist: The Next Gateway",
      x: 565,
      y: 235,
      camX: 185,
      camY: 145,
      zoom: 1.5,
      accent: "amber"
    },
    "EXP-02": {
      id: "EXP-02",
      route: "/builder",
      landmark: "Artisan Forge",
      title: "The Builder: Applied AI Ethics",
      roleSubtitle: "The Builder: Applied AI Ethics",
      thesis:
        "Most AI ethics tells you what not to build. I keep getting stuck on the question it leaves open: what is an ethical AI product good for? My working answer is that it should leave people with more agency, mastery, and judgment than they had before. In an era where AI can build anything, should we start focusing on products that foster internal goods? I test that answer with my students at CU Boulder and in my own product work. Here is where it stands, and where it still breaks.",
      prototype: "EXP-02 // Applied AI Ethics",
      pillar: "The Builder: Applied AI Ethics",
      x: 515,
      y: 425,
      camX: 215,
      camY: -10,
      zoom: 1.5,
      accent: "copper"
    },
    "EXP-03": {
      id: "EXP-03",
      route: "/philosopher",
      landmark: "Garden in the Citadel",
      title: "The Philosopher: Garden in the Citadel",
      roleSubtitle: "The Philosopher: Garden in the Citadel",
      thesis:
        "Stoicism has always been the philosophy of turbulent times. It was born as Alexander’s empire came apart, and Marcus Aurelius wrote his Meditations between plague and frontier wars. It is finding its readers again in the AI era. But the Stoicism most people meet is the inner citadel: the mind as a fortress nothing external can breach. I think that is only half the picture. A fortress protects; it doesn’t flourish. Flourishing comes from tending a garden inside the walls. What belongs in that garden is the question I keep bringing to the timeless works of stoic philosophy.",
      prototype: "EXP-03 // Garden in the Citadel",
      pillar: "The Philosopher: Garden in the Citadel",
      x: 1055,
      y: 385,
      camX: -195,
      camY: 25,
      zoom: 1.5,
      accent: "sage"
    },
    "EXP-04": {
      id: "EXP-04",
      route: "/practitioner",
      landmark: "Horologion",
      title: "The Practitioner: Kairos OS",
      roleSubtitle: "The Practitioner: Kairos OS",
      thesis:
        "The Greeks had two words for time. Chronos is the clock: schedules, backlogs, throughput. Kairos is the right moment, and the nerve to act on it. Machines are about to own Chronos. So what is left for us? My bet is two things. Commitment, because nothing is at stake for a machine. And curiosity, because if AI really is a gateway, nobody has a map of the far side, and exploring is the best thing we bring to it. Kairos OS is the system I’m building to test that bet on my own working days. Some of it works, some doesn’t yet. I write up both.",
      prototype: "EXP-04 // Kairos OS",
      pillar: "The Practitioner: Kairos OS",
      x: 865,
      y: 255,
      camX: -55,
      camY: 135,
      zoom: 1.5,
      accent: "cobalt"
    },
    HARBOR: {
      id: "HARBOR",
      route: "/about",
      landmark: "Harbor Stoa",
      title: "About Me",
      roleSubtitle: "About Me",
      thesis:
        "I’m Nikolaus Klassen. My path to the AI era started in the humanities, with a PhD in Classics and Cultural History studying how societies adapt old patterns of thought when their world shifts. Today, I’m a Technical Program Manager at Google, where I help build and deploy agentic AI systems. Between those two worlds, I teach Applied AI Ethics at CU Boulder. Across ancient texts, modern data pipelines, and autonomous agents, I’m drawn to the same underlying question: how do we turn raw information into knowledge we trust and act upon? This island is my workshop for thinking in public across all three roles.",
      prototype: "HARBOR // About Me",
      pillar: "About Me",
      x: 775,
      y: 625,
      camX: 15,
      camY: -155,
      zoom: 1.46,
      accent: "amber"
    }
  };

  var ROUTE_TO_BUILDING = {
    "/about": "HARBOR",
    "/builder": "EXP-02",
    "/strategist": "EXP-01",
    "/philosopher": "EXP-03",
    "/practitioner": "EXP-04"
  };

  var ROLE_ROUTES = {
    builder: {
      chamber: "EXP-02",
      route: "/builder",
      label: "Builder",
      chamberTitle: "Artisan Forge · /builder",
      rationale:
        "Routed to Artisan Forge (/builder — AI Ethics): equip Productive Friction cards to safeguard human agency."
    },
    strategist: {
      chamber: "EXP-01",
      route: "/strategist",
      label: "Strategist",
      chamberTitle: "Acropolis · /strategist",
      rationale:
        "Routed to Acropolis (/strategist — The Next Gateway): stress-test civilization metrics across AI gateways."
    },
    philosopher: {
      chamber: "EXP-03",
      route: "/philosopher",
      label: "Philosopher",
      chamberTitle: "Garden in the Citadel · /philosopher",
      rationale:
        "Routed to Garden in the Citadel (/philosopher — Reading Marcus): calibrate inner resilience in the East Cape Stoa."
    },
    leader: {
      chamber: "EXP-04",
      route: "/practitioner",
      label: "Overwhelmed Leader",
      chamberTitle: "Horologion · /practitioner",
      rationale:
        "Routed to Horologion (/practitioner — Kairos OS): convert draining maintenance into an 80/20 agentic quest."
    },
    practitioner: {
      chamber: "EXP-04",
      route: "/practitioner",
      label: "Practitioner",
      chamberTitle: "Horologion · /practitioner",
      rationale:
        "Routed to Horologion (/practitioner — Kairos OS): convert draining maintenance into an 80/20 agentic quest."
    }
  };

  var RED_QUEEN_CHOICES = {
    accelerate: {
      id: "accelerate",
      label: "Accelerate & Decentralize Compute",
      velocity: 94,
      cohesion: 42,
      trust: 48,
      verdict:
        "Breakthroughs in deterministic science surge, but social institutions fracture under unverified synthetic media."
    },
    ration: {
      id: "ration",
      label: "Impose Global Compute Rationing",
      velocity: 38,
      cohesion: 68,
      trust: 61,
      verdict:
        "Social shock slows down, yet the Red Queen's Race stalls critical energy and biomedical breakthroughs."
    },
    commons: {
      id: "commons",
      label: "Build Open Verification Commons",
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
      label: "Socratic Resistance Mode",
      scoreDelta: 32,
      guards: "Prevents skill atrophy by requiring the student's own hypothesis before hinting."
    },
    speedbump: {
      id: "speedbump",
      label: "Cognitive Load Speedbump",
      scoreDelta: 26,
      guards: "Slows premature delegation on high-stakes reasoning steps."
    },
    provenance: {
      id: "provenance",
      label: "Provenance & Uncertainty Watermark",
      scoreDelta: 24,
      guards: "Surfaces confidence boundaries to counter sycophantic authority."
    },
    cutoff: {
      id: "cutoff",
      label: "Hard Session Cutoff",
      scoreDelta: 30,
      guards: "Caps parasocial attachment and returns the learner to real-world practice."
    }
  };

  var CITADEL_TRAPS = {
    noise: {
      id: "noise",
      label: "External Noise (Outrage / Feed Velocity)",
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
        "60-Second Protocol: Separate the external reception of your work from the integrity of the next 25-minute block. Write down the single smallest testable step."
    },
    exhaustion: {
      id: "exhaustion",
      label: "Role Exhaustion (People Pleasing)",
      quote:
        "“If you seek tranquillity, do less. Or (more accurately) do what's essential—what the logos of a social being requires, and in the requisite way.” — Meditations 4.24",
      protocol:
        "60-Second Protocol: Identify one performative obligation on your list today. Convert it into an asynchronous 3-bullet update or decline it outright."
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

  function resolveBuildingId(idOrRoute) {
    if (!idOrRoute) {
      return null;
    }
    if (Object.prototype.hasOwnProperty.call(BUILDINGS, idOrRoute)) {
      return idOrRoute;
    }
    if (Object.prototype.hasOwnProperty.call(ROUTE_TO_BUILDING, idOrRoute)) {
      return ROUTE_TO_BUILDING[idOrRoute];
    }
    return null;
  }

  function createLabController() {
    var state = {
      mode: "lab",
      subview: "town",
      sky: "helios",
      experimentCount: 5,
      activeRole: null,
      activeChamber: "EXP-01",
      highlightedChamber: "EXP-01",
      hoveredBuilding: null,
      drawerOpen: false,
      explorerPos: { x: BUILDINGS.AGORA.x, y: BUILDINGS.AGORA.y },
      camera: { x: 0, y: 0, zoom: 1 },
      routeMessage:
        "Hover or click any landmark across the island, the Harbor Stoa (/about), or a role pill below to explore.",
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
      var activeBld = BUILDINGS[state.activeChamber] || BUILDINGS["EXP-01"];
      var previewId = state.drawerOpen
        ? state.activeChamber
        : state.hoveredBuilding || state.activeChamber;
      var previewBld = BUILDINGS[previewId] || activeBld;

      return {
        mode: state.mode,
        subview: state.subview,
        sky: state.sky,
        experimentCount: state.experimentCount,
        activeRole: state.activeRole,
        activeChamber: state.activeChamber,
        highlightedChamber: state.highlightedChamber,
        hoveredBuilding: state.hoveredBuilding,
        cardVisible: Boolean(state.drawerOpen || state.hoveredBuilding),
        drawerOpen: state.drawerOpen,
        explorerPos: { x: state.explorerPos.x, y: state.explorerPos.y },
        camera: { x: state.camera.x, y: state.camera.y, zoom: state.camera.zoom },
        buildingInfo: activeBld,
        previewInfo: previewBld,
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
      state.mode = "lab";
      state.subview = nextSubview;
      return getState();
    }

    function toggleSky() {
      state.sky = state.sky === "helios" ? "nyx" : "helios";
      return getState();
    }

    function hoverBuilding(idOrRoute) {
      var resolved = resolveBuildingId(idOrRoute);
      if (!resolved || resolved === "AGORA") {
        state.hoveredBuilding = null;
        return getState();
      }
      state.hoveredBuilding = resolved;
      state.highlightedChamber = resolved;
      if (!state.drawerOpen) {
        var bld = BUILDINGS[resolved];
        state.routeMessage =
          "Inspecting " + bld.title + " (" + bld.route + " · " + bld.roleSubtitle + "). Click Explore → to enter.";
      }
      return getState();
    }

    function resetCamera() {
      state.mode = "lab";
      state.subview = "town";
      state.activeRole = null;
      state.hoveredBuilding = null;
      state.drawerOpen = false;
      state.explorerPos = { x: BUILDINGS.AGORA.x, y: BUILDINGS.AGORA.y };
      state.camera = { x: 0, y: 0, zoom: 1 };
      state.routeMessage =
        "Overview of the Polis. Hover or click any landmark, the Harbor Stoa (/about), or a role pill to explore.";
      return getState();
    }

    function visitBuilding(idOrRoute) {
      var buildingId = resolveBuildingId(idOrRoute);
      if (!buildingId) {
        return getState();
      }
      if (buildingId === "AGORA") {
        return resetCamera();
      }
      var target = BUILDINGS[buildingId];
      state.mode = "lab";
      state.subview = "town";
      state.activeChamber = buildingId;
      state.highlightedChamber = buildingId;
      state.hoveredBuilding = buildingId;
      state.drawerOpen = true;
      state.explorerPos = { x: target.x, y: target.y };
      state.camera = { x: target.camX, y: target.camY, zoom: target.zoom };
      state.routeMessage =
        "Visiting " + target.title + " (" + target.route + " — " + target.roleSubtitle + ").";
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
      ROUTE_TO_BUILDING: ROUTE_TO_BUILDING,
      ROLE_ROUTES: ROLE_ROUTES,
      getState: getState,
      setMode: setMode,
      setSubview: setSubview,
      toggleSky: toggleSky,
      hoverBuilding: hoverBuilding,
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
    var visitButtons = doc.querySelectorAll("[data-visit-building]");
    var pathNodes = doc.querySelectorAll("[data-path-to]");
    var chamberPanels = doc.querySelectorAll("[data-chamber-panel]");
    var chamberCards = doc.querySelectorAll("[data-chamber-id]");
    var viewBlocks = doc.querySelectorAll("[data-view]");
    var subviewBlocks = doc.querySelectorAll("[data-subview]");
    var resetCamButtons = doc.querySelectorAll("[data-reset-camera]");
    var skyToggleBtn = doc.getElementById("sky-toggle-btn");
    var exploreBtn = doc.getElementById("inspector-explore-btn");

    var worldCameraGroup = doc.getElementById("world-camera");
    var explorerGroup = doc.getElementById("town-explorer");
    var inspectorDrawer = doc.getElementById("temple-inspector-drawer");
    var townTitleEl = doc.getElementById("town-hud-building");
    var cardRouteBadgeEl = doc.getElementById("inspector-route-badge");
    var cardRoleSubtitleEl = doc.getElementById("inspector-role-subtitle");
    var cardThesisEl = doc.getElementById("inspector-core-thesis");
    var routeStatusEl = doc.getElementById("router-telemetry-readout");
    var mapStageEl = doc.getElementById("polis-viewport");

    var rqButtons = doc.querySelectorAll("[data-rq-choice]");
    var frictionButtons = doc.querySelectorAll("[data-friction-card]");
    var citadelButtons = doc.querySelectorAll("[data-citadel-trap]");
    var forgeButtons = doc.querySelectorAll("[data-forge-lens]");

    var parallaxOffset = { x: 0, y: 0 };

    function updateCameraTransform() {
      if (!worldCameraGroup) {
        return;
      }
      var st = ctrl.getState();
      var tx = st.camera.x + parallaxOffset.x;
      var ty = st.camera.y + parallaxOffset.y;
      var sc = st.camera.zoom;
      worldCameraGroup.style.transform =
        "translate(" + tx + "px, " + ty + "px) scale(" + sc + ")";
    }

    function render() {
      var current = ctrl.getState();
      doc.body.setAttribute("data-lab-mode", current.mode);
      doc.body.setAttribute("data-subview-mode", current.subview);
      doc.body.setAttribute("data-sky", current.sky);

      if (skyToggleBtn) {
        skyToggleBtn.textContent = current.sky === "helios" ? "☀ Day" : "☾ Night";
      }

      for (var v = 0; v < viewBlocks.length; v++) {
        var block = viewBlocks[v];
        var viewType = block.getAttribute("data-view");
        var shouldHide = viewType !== current.mode;
        block.hidden = shouldHide;
        block.classList.toggle("hidden", shouldHide);
      }

      for (var sv = 0; sv < subviewBlocks.length; sv++) {
        var sBlock = subviewBlocks[sv];
        var sType = sBlock.getAttribute("data-subview");
        var hideSub = sType !== current.subview;
        sBlock.hidden = hideSub;
        sBlock.classList.toggle("hidden", hideSub);
      }

      for (var i = 0; i < modeButtons.length; i++) {
        var btn = modeButtons[i];
        var isActive = btn.getAttribute("data-mode-select") === current.mode;
        btn.setAttribute("aria-pressed", isActive ? "true" : "false");
        btn.classList.toggle("is-active", isActive);
      }

      for (var sb = 0; sb < subviewButtons.length; sb++) {
        var sBtn = subviewButtons[sb];
        var isSub =
          current.mode === "lab" &&
          sBtn.getAttribute("data-subview-select") === current.subview &&
          !(current.drawerOpen && current.activeChamber === "HARBOR");
        sBtn.setAttribute("aria-pressed", isSub ? "true" : "false");
        sBtn.classList.toggle("is-active", isSub);
      }

      for (var vb = 0; vb < visitButtons.length; vb++) {
        var vBtn = visitButtons[vb];
        var vTarget = vBtn.getAttribute("data-visit-building");
        var isVis =
          current.mode === "lab" &&
          current.drawerOpen &&
          current.activeChamber === vTarget;
        vBtn.setAttribute("aria-pressed", isVis ? "true" : "false");
        vBtn.classList.toggle("is-active", isVis);
      }

      for (var j = 0; j < roleButtons.length; j++) {
        var rBtn = roleButtons[j];
        var rActive = rBtn.getAttribute("data-role-select") === current.activeRole;
        rBtn.setAttribute("aria-pressed", rActive ? "true" : "false");
        rBtn.classList.toggle("is-active", rActive);
      }

      var focusTarget = current.drawerOpen
        ? current.activeChamber
        : current.hoveredBuilding;

      for (var b = 0; b < buildingNodes.length; b++) {
        var bNode = buildingNodes[b];
        var bId = bNode.getAttribute("data-building-id");
        var bActive = Boolean(focusTarget && bId === focusTarget);
        bNode.setAttribute("data-active", bActive ? "true" : "false");
      }

      for (var p = 0; p < pathNodes.length; p++) {
        var pNode = pathNodes[p];
        var pTarget = pNode.getAttribute("data-path-to");
        pNode.setAttribute(
          "data-active",
          Boolean(focusTarget && pTarget === focusTarget) ? "true" : "false"
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
          current.cardVisible ? "true" : "false"
        );
        inspectorDrawer.setAttribute(
          "data-expanded",
          current.drawerOpen ? "true" : "false"
        );
      }

      var info = current.previewInfo;
      if (townTitleEl && info) {
        townTitleEl.textContent = info.title;
      }
      if (cardRouteBadgeEl && info) {
        cardRouteBadgeEl.textContent = info.landmark
          ? info.landmark + " - " + info.route
          : info.route;
      }
      if (cardRoleSubtitleEl && info) {
        cardRoleSubtitleEl.textContent = info.roleSubtitle;
      }
      if (cardThesisEl && info) {
        cardThesisEl.textContent = info.thesis;
      }
      if (exploreBtn && info) {
        exploreBtn.setAttribute("data-explore-target", info.id);
        exploreBtn.textContent = current.drawerOpen
          ? "Exploring " + info.route + " · Interactive Chamber ↓"
          : "Explore " + info.route + " →";
      }

      for (var cp = 0; cp < chamberPanels.length; cp++) {
        var panel = chamberPanels[cp];
        var panelId = panel.getAttribute("data-chamber-panel");
        panel.hidden = !(info && panelId === info.id);
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
        var targetSub = ev.currentTarget.getAttribute("data-subview-select");
        if (targetSub === "town") {
          ctrl.resetCamera();
        } else {
          ctrl.setSubview(targetSub);
        }
        render();
      });
    }

    for (var vb = 0; vb < visitButtons.length; vb++) {
      visitButtons[vb].addEventListener("click", function (ev) {
        ctrl.visitBuilding(ev.currentTarget.getAttribute("data-visit-building"));
        render();
      });
    }

    if (exploreBtn) {
      exploreBtn.addEventListener("click", function (ev) {
        var targetId = ev.currentTarget.getAttribute("data-explore-target");
        ctrl.visitBuilding(targetId || ctrl.getState().previewInfo.id);
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
      buildingNodes[b].addEventListener("mouseenter", function (ev) {
        var bId = ev.currentTarget.getAttribute("data-building-id");
        if (bId && bId !== "AGORA") {
          ctrl.hoverBuilding(bId);
          render();
        }
      });
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

    if (mapStageEl && typeof mapStageEl.addEventListener === "function") {
      mapStageEl.addEventListener("mousemove", function (ev) {
        var rect = mapStageEl.getBoundingClientRect();
        if (!rect || !rect.width || !rect.height) return;
        var nx = (ev.clientX - rect.left) / rect.width - 0.5;
        var ny = (ev.clientY - rect.top) / rect.height - 0.5;
        parallaxOffset.x = Math.round(-nx * 22);
        parallaxOffset.y = Math.round(-ny * 14);
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
      ROUTE_TO_BUILDING: ROUTE_TO_BUILDING,
      ROLE_ROUTES: ROLE_ROUTES,
      createLabController: createLabController,
      bindDom: bindDom
    };
  }
})();
