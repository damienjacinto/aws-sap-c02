/* Flashcards: turns the ??? info|warning|tip blocks of flashcards.md into a shuffled deck. */
(function () {
  "use strict";

  var TYPES = { info: "Service", warning: "Warning", tip: "Tip" };

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function collect(app) {
    var cards = [];
    var source = null;
    var n = app.nextElementSibling;
    while (n) {
      if (n.tagName === "H2") {
        var a = n.querySelector("a[href]:not(.headerlink)");
        source = a ? { href: a.getAttribute("href"), title: a.textContent } : null;
      } else if (n.tagName === "DETAILS") {
        var type = Object.keys(TYPES).filter(function (t) { return n.classList.contains(t); })[0];
        var summary = n.querySelector("summary");
        if (type && summary) {
          var back = document.createElement("div");
          Array.prototype.forEach.call(n.childNodes, function (c) {
            if (c !== summary) back.appendChild(c.cloneNode(true));
          });
          cards.push({ type: type, front: summary.innerHTML, back: back.innerHTML, source: source });
        }
      }
      n.style.display = "none"; // Material styles <details>, so [hidden] alone is not enough
      n = n.nextElementSibling;
    }
    return cards;
  }

  function init() {
    var app = document.getElementById("fc-app");
    if (!app || app.dataset.ready) return;
    app.dataset.ready = "1";

    var cards = collect(app);
    if (!cards.length) return;

    var touch = window.matchMedia("(pointer: coarse)").matches;
    app.innerHTML =
      '<div class="fc-bar">' +
        '<span class="fc-count"></span>' +
        '<span class="fc-missed"></span>' +
        '<button type="button" class="fc-btn fc-shuffle">Shuffle</button>' +
      "</div>" +
      '<div class="fc-card" tabindex="0" role="button" aria-live="polite">' +
        '<span class="fc-type"></span>' +
        '<div class="fc-front"></div>' +
        '<div class="fc-back" hidden></div>' +
        '<div class="fc-hint"></div>' +
      "</div>" +
      '<div class="fc-controls">' +
        '<button type="button" class="fc-btn fc-prev" aria-label="Previous">◀<span class="fc-label"> Prev</span></button>' +
        '<button type="button" class="fc-btn fc-miss">↺ Missed</button>' +
        '<button type="button" class="fc-btn fc-next" aria-label="Next"><span class="fc-label">Next </span>▶</button>' +
      "</div>" +
      '<p class="fc-keys">' +
        (touch
          ? "Tap the card to flip · swipe ← → to move"
          : "<kbd>Space</kbd> flip · <kbd>←</kbd> <kbd>→</kbd> move · <kbd>M</kbd> missed") +
      "</p>";

    var $ = function (s) { return app.querySelector(s); };
    var card = $(".fc-card"), front = $(".fc-front"), back = $(".fc-back"),
        type = $(".fc-type"), hint = $(".fc-hint"), count = $(".fc-count"), missedEl = $(".fc-missed");

    var deck, pos, flipped, missed;

    function start() {
      deck = shuffle(cards.map(function (_, i) { return i; }));
      pos = 0; missed = 0;
      render();
    }

    function render() {
      var c = cards[deck[pos]];
      flipped = false;
      card.className = "fc-card fc-" + c.type;
      type.textContent = TYPES[c.type];
      front.innerHTML = c.front;
      back.innerHTML = c.back +
        (c.source ? '<p class="fc-source"><a href="' + c.source.href + '">Go deeper: ' + c.source.title + " →</a></p>" : "");
      back.hidden = true;
      hint.textContent = touch ? "Tap to reveal" : "Click or press Space to reveal";
      hint.hidden = false;
      count.textContent = (pos + 1) + " / " + deck.length;
      missedEl.textContent = missed ? "Missed: " + missed : "";
      $(".fc-prev").disabled = pos === 0;
    }

    function flip() {
      flipped = !flipped;
      back.hidden = !flipped;
      hint.hidden = flipped;
      card.classList.toggle("fc-flipped", flipped);
    }

    function next() {
      if (pos < deck.length - 1) { pos++; render(); }
      else { count.textContent = "Done: " + deck.length + " cards" + (missed ? ", " + missed + " missed" : "") + ". Shuffle to restart."; }
    }

    function prev() { if (pos > 0) { pos--; render(); } }

    function miss() {
      missed++;
      var remaining = deck.length - pos - 1;
      var offset = Math.min(remaining, 3 + Math.floor(Math.random() * 4));
      deck.splice(pos + 1 + offset, 0, deck[pos]);
      next();
    }

    card.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      flip();
    });
    $(".fc-next").addEventListener("click", next);
    $(".fc-prev").addEventListener("click", prev);
    $(".fc-miss").addEventListener("click", miss);
    $(".fc-shuffle").addEventListener("click", start);

    document.addEventListener("keydown", function (e) {
      if (!document.body.contains(app)) return;
      var t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (t && t.tagName === "BUTTON" && (e.key === " " || e.key === "Enter")) return; // let the button act
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
      else if (e.key === "ArrowRight") { next(); }
      else if (e.key === "ArrowLeft") { prev(); }
      else if (e.key === "m" || e.key === "M") { miss(); }
    });

    var x0 = null, y0 = null;
    card.addEventListener("touchstart", function (e) {
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    card.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        e.preventDefault(); // no click → no flip
        if (dx < 0) next(); else prev();
      }
    });

    start();
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(init);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
