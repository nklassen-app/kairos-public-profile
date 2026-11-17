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
      href: "/strategist/",
      landmark: "Acropolis",
      tag: "Acropolis - /strategist",
      shortLabel: "The Next Gateway",
      title: "The Strategist: The Next Gateway",
      roleSubtitle: "The Strategist: The Next Gateway",
      body:
        "Some thresholds only open one way. Humanity did not go back on agriculture, or the mechanical engine. I'm a historian by training, and I think we are standing in front of another one-way gateway. For decades innovation has felt like a Red Queen's Race: ever more effort to stay roughly where we are. Is AI the exit? I don't know yet. The Next Gateway is where I work on that question.",
      thesis:
        "Some thresholds only open one way. Humanity did not go back on agriculture, or the mechanical engine. I'm a historian by training, and I think we are standing in front of another one-way gateway. For decades innovation has felt like a Red Queen's Race: ever more effort to stay roughly where we are. Is AI the exit? I don't know yet. The Next Gateway is where I work on that question.",
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
      href: "/builder/",
      landmark: "Artisan Forge",
      tag: "Artisan Forge - /builder",
      shortLabel: "Applied AI Ethics",
      title: "The Builder: Applied AI Ethics",
      roleSubtitle: "The Builder: Applied AI Ethics",
      body:
        "Most AI ethics tells you what not to build. I keep getting stuck on the question it leaves open: what is an ethical AI product good for? My working answer is that it should leave people with more agency, mastery, and judgment than they had before. In an era where AI can build anything, should we start focusing on products that foster internal goods? I test that answer with my students at CU Boulder and in my own product work. Here is where it stands, and where it still breaks.",
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
      href: "/philosopher/",
      landmark: "Garden in the Citadel",
      tag: "Garden in the Citadel - /philosopher",
      shortLabel: "Garden in the Citadel",
      title: "The Philosopher: Garden in the Citadel",
      roleSubtitle: "The Philosopher: Garden in the Citadel",
      body:
        "Stoicism has always been the philosophy of turbulent times. It was born as Alexander’s empire came apart, and Marcus Aurelius wrote his Meditations between plague and frontier wars. It is finding its readers again in the AI era. But the Stoicism most people meet is the inner citadel: the mind as a fortress nothing external can breach. I think that is only half the picture. A fortress protects; it doesn’t flourish. Flourishing comes from tending a garden inside the walls. What belongs in that garden is the question I keep bringing to the timeless works of Stoic philosophy.",
      thesis:
        "Stoicism has always been the philosophy of turbulent times. It was born as Alexander’s empire came apart, and Marcus Aurelius wrote his Meditations between plague and frontier wars. It is finding its readers again in the AI era. But the Stoicism most people meet is the inner citadel: the mind as a fortress nothing external can breach. I think that is only half the picture. A fortress protects; it doesn’t flourish. Flourishing comes from tending a garden inside the walls. What belongs in that garden is the question I keep bringing to the timeless works of Stoic philosophy.",
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
      href: "/practitioner/",
      landmark: "Horologion",
      tag: "Horologion - /practitioner",
      shortLabel: "Kairos OS",
      title: "The Practitioner: Kairos OS",
      roleSubtitle: "The Practitioner: Kairos OS",
      body:
        "The Greeks had two words for time. Chronos is the clock: schedules, backlogs, throughput. Kairos is the right moment, and the nerve to act on it. Machines are about to own Chronos. So what is left for us? My bet is two things. Commitment, because nothing is at stake for a machine. And curiosity, because if AI really is a gateway, nobody has a map of the far side, and exploring is the best thing we bring to it. Kairos OS is the system I’m building to test that bet on my own working days. Some of it works, some doesn’t yet. I write up both.",
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
      href: "/about/",
      landmark: "Harbor Stoa",
      tag: "Harbor Stoa - /about",
      shortLabel: "About Me",
      title: "Harbor Stoa: About Me",
      roleSubtitle: "Harbor Stoa: About Me",
      body:
        "I’m Nikolaus Klassen. My path to the AI era started in the humanities, with a PhD in Classics and Cultural History studying how societies adapt old patterns of thought when their world shifts. Today, I’m a Technical Program Manager at Google, where I help build and deploy agentic AI systems. Between those two worlds, I teach Applied AI Ethics at CU Boulder. Across ancient texts, modern data pipelines, and autonomous agents, I’m drawn to the same underlying question: how do we turn raw information into knowledge we trust and act upon? This island is my workshop for thinking in public across all three roles.",
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
    "/about/": "HARBOR",
    about: "HARBOR",
    "/builder": "EXP-02",
    "/builder/": "EXP-02",
    builder: "EXP-02",
    "/strategist": "EXP-01",
    "/strategist/": "EXP-01",
    strategist: "EXP-01",
    "/philosopher": "EXP-03",
    "/philosopher/": "EXP-03",
    philosopher: "EXP-03",
    "/practitioner": "EXP-04",
    "/practitioner/": "EXP-04",
    practitioner: "EXP-04"
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
      activeChamber: "EXP-01",
      highlightedChamber: "EXP-01",
      hoveredBuilding: null,
      drawerOpen: false,
      explorerPos: { x: BUILDINGS.AGORA.x, y: BUILDINGS.AGORA.y },
      camera: { x: 0, y: 0, zoom: 1 }
    };

    function getState() {
      var activeBld = BUILDINGS[state.activeChamber] || BUILDINGS["EXP-01"];
      var previewId = state.drawerOpen
        ? state.activeChamber
        : state.hoveredBuilding || state.activeChamber;
      var previewBld = BUILDINGS[previewId] || activeBld;

      return {
        mode: state.mode,
        subview: state.subview,
        sky: state.sky,
        activeChamber: state.activeChamber,
        highlightedChamber: state.highlightedChamber,
        hoveredBuilding: state.hoveredBuilding,
        cardVisible: Boolean(state.drawerOpen || state.hoveredBuilding),
        drawerOpen: state.drawerOpen,
        explorerPos: { x: state.explorerPos.x, y: state.explorerPos.y },
        camera: { x: state.camera.x, y: state.camera.y, zoom: state.camera.zoom },
        buildingInfo: activeBld,
        previewInfo: previewBld
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
      return getState();
    }

    function resetCamera() {
      state.mode = "lab";
      state.subview = "town";
      state.hoveredBuilding = null;
      state.drawerOpen = false;
      state.explorerPos = { x: BUILDINGS.AGORA.x, y: BUILDINGS.AGORA.y };
      state.camera = { x: 0, y: 0, zoom: 1 };
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
      return getState();
    }

    return {
      BUILDINGS: BUILDINGS,
      ROUTE_TO_BUILDING: ROUTE_TO_BUILDING,
      getState: getState,
      setMode: setMode,
      setSubview: setSubview,
      toggleSky: toggleSky,
      hoverBuilding: hoverBuilding,
      resetCamera: resetCamera,
      visitBuilding: visitBuilding
    };
  }

  function bindDom(doc) {
    if (!doc || !doc.body) {
      return;
    }
    var ctrl = createLabController();
    var modeButtons = doc.querySelectorAll("[data-mode-select]");
    var subviewButtons = doc.querySelectorAll("[data-subview-select]");
    var buildingNodes = doc.querySelectorAll("[data-building-id]");
    var visitButtons = doc.querySelectorAll("[data-visit-building]");
    var pathNodes = doc.querySelectorAll("[data-path-to]");
    var chamberCards = doc.querySelectorAll("[data-chamber-id]");
    var viewBlocks = doc.querySelectorAll("[data-view]");
    var subviewBlocks = doc.querySelectorAll("[data-subview]");
    var resetCamButtons = doc.querySelectorAll("[data-reset-camera]");
    var skyToggleBtn = doc.getElementById("sky-toggle-btn");

    var worldCameraGroup = doc.getElementById("world-camera");
    var explorerGroup = doc.getElementById("town-explorer");
    var inspectorDrawer = doc.getElementById("temple-inspector-drawer");
    var townTitleEl = doc.getElementById("town-hud-building");
    var cardRouteBadgeEl = doc.getElementById("inspector-route-badge");
    var cardThesisEl = doc.getElementById("inspector-core-thesis");
    var drawerLinkEl = doc.getElementById("drawer-link");
    var mapStageEl = doc.getElementById("polis-viewport");

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
        cardRouteBadgeEl.textContent =
          info.tag ||
          (info.landmark ? info.landmark + " - " + info.route : info.route);
      }
      if (cardThesisEl && info) {
        cardThesisEl.textContent = info.body || info.thesis;
      }
      if (drawerLinkEl && info) {
        drawerLinkEl.setAttribute("href", info.href || info.route + "/");
      }
      for (var k = 0; k < chamberCards.length; k++) {
        var card = chamberCards[k];
        var id = card.getAttribute("data-chamber-id");
        var isHighlighted = current.highlightedChamber === id;
        card.setAttribute("data-highlighted", isHighlighted ? "true" : "false");
      }
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

    // Visitors who ask for less motion get no mouse parallax (the CSS stops the rest).
    var reduceMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduceMotion && mapStageEl && typeof mapStageEl.addEventListener === "function") {
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
        if (ev.target && ev.target.closest && ev.target.closest("a")) {
          return;
        }
        var cid = ev.currentTarget.getAttribute("data-chamber-id");
        ctrl.visitBuilding(cid);
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
      createLabController: createLabController,
      bindDom: bindDom
    };
  }
})();
