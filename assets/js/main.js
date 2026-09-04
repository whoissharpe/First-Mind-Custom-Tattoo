/* Firstmind Custom Tattoo - progressive enhancement only.
   No scroll listeners anywhere: IntersectionObserver does the work. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- year ------------------------------------------------------- */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- nav state via a sentinel, not a scroll handler ------------- */
  (function navState() {
    var top = document.getElementById("top");
    if (!top || !("IntersectionObserver" in window)) return;
    var sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:120px;height:1px;width:1px;pointer-events:none";
    top.appendChild(sentinel);
    new IntersectionObserver(function (es) {
      document.body.classList.toggle("is-scrolled", !es[0].isIntersecting);
    }, { threshold: 0 }).observe(sentinel);
  })();

  /* ---------- scroll reveal ---------------------------------------------- */
  (function reveal() {
    var items = document.querySelectorAll(".rise");
    if (!("IntersectionObserver" in window) || reduce.matches) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  })();

  /* ---------- mobile menu ------------------------------------------------ */
  (function menu() {
    var burger = document.querySelector(".burger");
    var sheet = document.getElementById("sheet");
    if (!burger || !sheet) return;
    sheet.hidden = false;

    function set(open) {
      document.body.classList.toggle("menu-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.documentElement.style.overflow = open ? "hidden" : "";
      if (open) sheet.querySelector("a").focus();
    }
    burger.addEventListener("click", function () {
      set(!document.body.classList.contains("menu-open"));
    });
    sheet.addEventListener("click", function (e) {
      if (e.target.tagName === "A") set(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
        set(false); burger.focus();
      }
    });
  })();

  /* ---------- gallery lightbox ------------------------------------------- */
  (function lightbox() {
    var box = document.getElementById("lbox");
    var tiles = Array.prototype.slice.call(document.querySelectorAll(".tile"));
    if (!box || !tiles.length) return;
    box.hidden = false;

    var img = document.getElementById("lboxImg");
    var cap = document.getElementById("lboxCap");
    var opener = null;
    var i = 0;

    function show(n) {
      i = (n + tiles.length) % tiles.length;
      var src = tiles[i].querySelector("img");
      var text = tiles[i].querySelector("figcaption").textContent.trim();
      img.src = src.getAttribute("src");
      img.alt = src.getAttribute("alt");
      cap.textContent = text;
    }
    function open(n) {
      opener = document.activeElement;
      show(n);
      box.dataset.open = "true";
      document.documentElement.style.overflow = "hidden";
      box.querySelector('[data-lb="close"]').focus();
    }
    function close() {
      box.dataset.open = "false";
      document.documentElement.style.overflow = "";
      if (opener) opener.focus();
    }

    tiles.forEach(function (t, n) {
      t.addEventListener("click", function () { open(n); });
    });

    box.addEventListener("click", function (e) {
      var act = e.target.closest("[data-lb]");
      if (act) {
        if (act.dataset.lb === "close") close();
        if (act.dataset.lb === "prev") show(i - 1);
        if (act.dataset.lb === "next") show(i + 1);
        return;
      }
      if (e.target === box || e.target.classList.contains("lbox__stage")) close();
    });

    document.addEventListener("keydown", function (e) {
      if (box.dataset.open !== "true") return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(i - 1);
      if (e.key === "ArrowRight") show(i + 1);
    });
  })();

  /* ---------- booking form ----------------------------------------------
     No backend on a static host. The form validates, then hands a fully
     written email to the visitor's mail client. To post to a real endpoint
     instead, set data-endpoint on the form and the fetch path below runs.  */
  (function booking() {
    var form = document.getElementById("bookForm");
    if (!form) return;

    var SHOP_EMAIL = "firstmindartemporium@gmail.com";

    function fieldOf(el) { return el.closest(".field"); }
    function setErr(el, msg) {
      var f = fieldOf(el);
      var slot = form.querySelector('[data-err="' + el.id + '"]');
      f.dataset.invalid = msg ? "true" : "false";
      el.setAttribute("aria-invalid", msg ? "true" : "false");
      if (slot) slot.textContent = msg || "";
    }

    function validate() {
      var ok = true;
      var name = form.elements.name;
      var email = form.elements.email;
      var idea = form.elements.idea;

      setErr(name, name.value.trim() ? "" : (ok = false, "Tell us who you are."));
      var mail = email.value.trim();
      setErr(email, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail) ? "" : (ok = false, "We need a working email to reply to."));
      setErr(idea, idea.value.trim().length >= 12 ? "" : (ok = false, "A sentence or two about the idea, please."));
      return ok;
    }

    ["name", "email", "idea"].forEach(function (n) {
      var el = form.elements[n];
      el.addEventListener("input", function () {
        if (fieldOf(el).dataset.invalid === "true") validate();
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) {
        form.dataset.state = "";
        var bad = form.querySelector('.field[data-invalid="true"] input, .field[data-invalid="true"] textarea');
        if (bad) bad.focus();
        return;
      }

      var d = form.elements;
      var body = [
        "Name: " + d.name.value.trim(),
        "Email: " + d.email.value.trim(),
        "Phone: " + (d.phone.value.trim() || "not given"),
        "Artist: " + d.artist.value,
        "Placement: " + (d.placement.value.trim() || "not given"),
        "Rough size: " + (d.size.value.trim() || "not given"),
        "",
        "The idea:",
        d.idea.value.trim()
      ].join("\n");

      var endpoint = form.dataset.endpoint;
      form.dataset.state = "sending";

      if (endpoint) {
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ subject: "Consult request from the website", body: body })
        }).then(function (r) {
          form.dataset.state = r.ok ? "sent" : "error";
          if (r.ok) form.reset();
        }).catch(function () { form.dataset.state = "error"; });
        return;
      }

      try {
        window.location.href = "mailto:" + SHOP_EMAIL +
          "?subject=" + encodeURIComponent("Consult request: " + d.name.value.trim()) +
          "&body=" + encodeURIComponent(body);
        setTimeout(function () { form.dataset.state = "sent"; }, 900);
      } catch (err) {
        form.dataset.state = "error";
      }
    });
  })();
})();
