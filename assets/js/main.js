/* =========================================================
   ICCCE 2026 — shared behaviour
   Header/footer injection · active nav · mobile menu · countdown
   ========================================================= */
(function () {
  "use strict";

  var SUBMIT_URL = "#";          // Confconnect portal — single source of truth for ALL "Submit Paper" buttons site-wide. Update this one line when the portal opens.
  var PAPER_TEMPLATE = "assets/templates/Publisher-Paper-Template.docx";
  var PPT_TEMPLATE   = "assets/templates/ICCCE-Presentation-Template.ppt";
  var CONF_DATE = "2026-11-21T09:00:00+05:30";
  var EMAIL = "iccceconferences@gmail.com";

  // ---- Navigation model ----
  var NAV = [
    { label: "Home", href: "index.html", page: "home" },
    { label: "Conference", page: "conference", children: [
      { label: "Committee",        href: "committee.html",        page: "committee" },
      { label: "Speakers",         href: "speakers.html",         page: "speakers" },
      { label: "Past Editions",    href: "past-editions.html",    page: "past-editions" },
      { label: "Notable Visitors", href: "notable-visitors.html", page: "notable-visitors" }
    ]},
    { label: "Contributing", page: "contributing", children: [
      { label: "Call for Papers", href: "call-for-papers.html", page: "call-for-papers" }
    ]},
    { label: "Registration", page: "registration", children: [
      { label: "Registration & Fees", href: "registration.html", page: "registration" },
      { label: "Manuscript Template", href: PAPER_TEMPLATE },
      { label: "Presentation Template", href: PPT_TEMPLATE }
    ]},
    { label: "Contact", href: "contact.html", page: "contact" }
  ];

  var current = document.body.getAttribute("data-page") || "";

  function isActive(item) {
    if (item.page && item.page === current) return true;
    if (item.children) {
      for (var i = 0; i < item.children.length; i++) {
        if (item.children[i].page === current) return true;
      }
    }
    return false;
  }

  // ---- Build header ----
  function buildHeader() {
    var items = NAV.map(function (item) {
      var active = isActive(item) ? " is-active" : "";
      if (item.children) {
        var sub = item.children.map(function (c) {
          var ext = (c.href && c.href.indexOf("http") === 0) ? ' target="_blank" rel="noopener"' : "";
          return '<li><a href="' + c.href + '"' + ext + '>' + c.label + "</a></li>";
        }).join("");
        return '<li class="nav__item nav__item--has-menu">' +
                 '<button class="nav__link' + active + '" aria-haspopup="true" aria-expanded="false">' +
                   item.label + '<span class="nav__caret">▾</span></button>' +
                 '<ul class="nav__sub">' + sub + "</ul></li>";
      }
      return '<li class="nav__item"><a class="nav__link' + active + '" href="' + item.href + '">' + item.label + "</a></li>";
    }).join("");

    return '' +
      '<a class="skip-link" href="#main">Skip to content</a>' +
      '<header class="site-header"><nav class="nav" aria-label="Primary">' +
        '<a class="brand" href="index.html" aria-label="ICCCE 2026 — home">' +
          '<img class="brand__logo" src="assets/img/logo-mark.svg" alt="" width="38" height="38" />' +
          '<span class="brand__mark">ICCC<b>E</b></span>' +
          '<span class="brand__year">2026</span>' +
        '</a>' +
        '<ul class="nav__menu">' + items +
          '<li class="nav__item nav__cta"><a class="btn btn--primary btn--arrow js-submit" href="' + SUBMIT_URL + '">Submit Paper</a></li>' +
        '</ul>' +
        '<button class="nav__toggle" aria-label="Toggle menu" aria-expanded="false">' +
          '<span></span><span></span><span></span></button>' +
      "</nav></header>";
  }

  // ---- Build footer ----
  function buildFooter() {
    var y = new Date().getFullYear();
    return '' +
    '<footer class="site-footer"><div class="container">' +
      '<div class="footer-grid">' +
        '<div class="footer-brand">' +
          '<span class="footer-brand__lockup"><img class="brand__logo" src="assets/img/logo-mark.svg" alt="" width="40" height="40" /><span class="brand__mark">ICCC<b>E</b> 2026</span></span>' +
          '<p>9th International Conference on Communications and Cyber-Physical Engineering.</p>' +
        "</div>" +
        '<div><h4>Conference</h4><ul class="footer-links">' +
          '<li><a href="committee.html">Committee</a></li>' +
          '<li><a href="speakers.html">Speakers</a></li>' +
          '<li><a href="past-editions.html">Past Editions</a></li>' +
          '<li><a href="notable-visitors.html">Notable Visitors</a></li>' +
        "</ul></div>" +
        '<div><h4>Participate</h4><ul class="footer-links">' +
          '<li><a href="call-for-papers.html">Call for Papers</a></li>' +
          '<li><a href="registration.html">Registration</a></li>' +
          '<li><a class="js-submit" href="' + SUBMIT_URL + '">Submit Paper</a></li>' +
          '<li><a href="contact.html">Contact</a></li>' +
        "</ul></div>" +
        '<div><h4>Venue</h4><ul class="footer-links">' +
          "<li>Vignan's Institute of Management and Technology for Women</li>" +
          "<li>Hyderabad, Telangana, India</li>" +
          '<li><a href="mailto:' + EMAIL + '">' + EMAIL + "</a></li>" +
        "</ul></div>" +
      "</div>" +
      '<div class="footer-bottom">' +
        "<span>© " + y + " ICCCE. All rights reserved.</span>" +
        "<span>November 21–22, 2026 · Hyderabad, India</span>" +
      "</div>" +
    "</div></footer>";
  }

  // ---- Submit-paper links (single source of truth: SUBMIT_URL) ----
  // Points every element with class "js-submit" — inline page buttons plus the
  // injected header/footer CTAs — at SUBMIT_URL, so the whole site updates from one line.
  function wireSubmitLinks() {
    var isExternal = SUBMIT_URL.indexOf("http") === 0;
    var links = document.querySelectorAll(".js-submit");
    for (var i = 0; i < links.length; i++) {
      links[i].setAttribute("href", SUBMIT_URL);
      if (isExternal) {
        links[i].setAttribute("target", "_blank");
        links[i].setAttribute("rel", "noopener");
      }
    }
  }

  // ---- Mobile menu ----
  function wireMenu() {
    var nav = document.querySelector(".nav");
    var toggle = document.querySelector(".nav__toggle");
    if (!nav || !toggle) return;
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // On mobile, tapping a dropdown trigger toggles its submenu
    document.querySelectorAll(".nav__item--has-menu > .nav__link").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        if (window.matchMedia("(max-width: 860px)").matches) {
          e.preventDefault();
          var sub = btn.nextElementSibling;
          if (sub) sub.style.display = (sub.style.display === "block") ? "none" : "block";
        }
      });
    });
  }

  // ---- Countdown ----
  function wireCountdown() {
    var el = document.getElementById("countdown");
    if (!el) return;
    var target = new Date(CONF_DATE).getTime();
    function pad(n) { return (n < 10 ? "0" : "") + n; }
    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {
        el.innerHTML = '<div class="countdown__done">// The conference is underway. Welcome to ICCCE 2026.</div>';
        return;
      }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      var units = [["Days", d], ["Hours", h], ["Minutes", m], ["Seconds", s]];
      el.innerHTML = units.map(function (u) {
        return '<div class="countdown__unit"><div class="countdown__num">' + pad(u[1]) +
               '</div><div class="countdown__label">' + u[0] + "</div></div>";
      }).join("");
      requestAnimationFrame(function () {}); // keep paint smooth
    }
    tick();
    setInterval(tick, 1000);
  }

  // ---- Inject ----
  document.addEventListener("DOMContentLoaded", function () {
    var h = document.getElementById("site-header");
    var f = document.getElementById("site-footer");
    if (h) h.outerHTML = buildHeader();
    if (f) f.outerHTML = buildFooter();
    wireSubmitLinks();
    wireMenu();
    wireCountdown();
  });
})();

/* Signal-wave signature injection (kept in one place, reused on all pages) */
(function () {
  "use strict";
  var SVG =
    '<svg class="wave-svg" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" style="width:100%;height:100%">' +
      '<path class="wave-path wave-path--3" d="M 0 260.0 L 10 271.9 L 20 283.0 L 30 292.5 L 40 299.8 L 50 304.4 L 60 306.0 L 70 304.4 L 80 299.8 L 90 292.5 L 100 283.0 L 110 271.9 L 120 260.0 L 130 248.1 L 140 237.0 L 150 227.5 L 160 220.2 L 170 215.6 L 180 214.0 L 190 215.6 L 200 220.2 L 210 227.5 L 220 237.0 L 230 248.1 L 240 260.0 L 250 271.9 L 260 283.0 L 270 292.5 L 280 299.8 L 290 304.4 L 300 306.0 L 310 304.4 L 320 299.8 L 330 292.5 L 340 283.0 L 350 271.9 L 360 260.0 L 370 248.1 L 380 237.0 L 390 227.5 L 400 220.2 L 410 215.6 L 420 214.0 L 430 215.6 L 440 220.2 L 450 227.5 L 460 237.0 L 470 248.1 L 480 260.0 L 490 271.9 L 500 283.0 L 510 292.5 L 520 299.8 L 530 304.4 L 540 306.0 L 550 304.4 L 560 299.8 L 570 292.5 L 580 283.0 L 590 271.9 L 600 260.0 L 610 248.1 L 620 237.0 L 630 227.5 L 640 220.2 L 650 215.6 L 660 214.0 L 670 215.6 L 680 220.2 L 690 227.5 L 700 237.0 L 710 248.1 L 720 260.0 L 730 271.9 L 740 283.0 L 750 292.5 L 760 299.8 L 770 304.4 L 780 306.0 L 790 304.4 L 800 299.8 L 810 292.5 L 820 283.0 L 830 271.9 L 840 260.0 L 850 248.1 L 860 237.0 L 870 227.5 L 880 220.2 L 890 215.6 L 900 214.0 L 910 215.6 L 920 220.2 L 930 227.5 L 940 237.0 L 950 248.1 L 960 260.0 L 970 271.9 L 980 283.0 L 990 292.5 L 1000 299.8 L 1010 304.4 L 1020 306.0 L 1030 304.4 L 1040 299.8 L 1050 292.5 L 1060 283.0 L 1070 271.9 L 1080 260.0 L 1090 248.1 L 1100 237.0 L 1110 227.5 L 1120 220.2 L 1130 215.6 L 1140 214.0 L 1150 215.6 L 1160 220.2 L 1170 227.5 L 1180 237.0 L 1190 248.1 L 1200 260.0 L 1210 271.9 L 1220 283.0 L 1230 292.5 L 1240 299.8 L 1250 304.4 L 1260 306.0 L 1270 304.4 L 1280 299.8 L 1290 292.5 L 1300 283.0 L 1310 271.9 L 1320 260.0 L 1330 248.1 L 1340 237.0 L 1350 227.5 L 1360 220.2 L 1370 215.6 L 1380 214.0 L 1390 215.6 L 1400 220.2 L 1410 227.5 L 1420 237.0 L 1430 248.1 L 1440 260.0 L 1450 271.9 L 1460 283.0 L 1470 292.5 L 1480 299.8 L 1490 304.4 L 1500 306.0 L 1510 304.4 L 1520 299.8 L 1530 292.5 L 1540 283.0 L 1550 271.9 L 1560 260.0 L 1570 248.1 L 1580 237.0 L 1590 227.5 L 1600 220.2 L 1610 215.6 L 1620 214.0 L 1630 215.6 L 1640 220.2 L 1650 227.5 L 1660 237.0 L 1670 248.1 L 1680 260.0"/>' +
      '<path class="wave-path wave-path--2" d="M 0 330.0 L 10 335.7 L 20 341.0 L 30 345.6 L 40 349.1 L 50 351.3 L 60 352.0 L 70 351.3 L 80 349.1 L 90 345.6 L 100 341.0 L 110 335.7 L 120 330.0 L 130 324.3 L 140 319.0 L 150 314.4 L 160 310.9 L 170 308.7 L 180 308.0 L 190 308.7 L 200 310.9 L 210 314.4 L 220 319.0 L 230 324.3 L 240 330.0 L 250 335.7 L 260 341.0 L 270 345.6 L 280 349.1 L 290 351.3 L 300 352.0 L 310 351.3 L 320 349.1 L 330 345.6 L 340 341.0 L 350 335.7 L 360 330.0 L 370 324.3 L 380 319.0 L 390 314.4 L 400 310.9 L 410 308.7 L 420 308.0 L 430 308.7 L 440 310.9 L 450 314.4 L 460 319.0 L 470 324.3 L 480 330.0 L 490 335.7 L 500 341.0 L 510 345.6 L 520 349.1 L 530 351.3 L 540 352.0 L 550 351.3 L 560 349.1 L 570 345.6 L 580 341.0 L 590 335.7 L 600 330.0 L 610 324.3 L 620 319.0 L 630 314.4 L 640 310.9 L 650 308.7 L 660 308.0 L 670 308.7 L 680 310.9 L 690 314.4 L 700 319.0 L 710 324.3 L 720 330.0 L 730 335.7 L 740 341.0 L 750 345.6 L 760 349.1 L 770 351.3 L 780 352.0 L 790 351.3 L 800 349.1 L 810 345.6 L 820 341.0 L 830 335.7 L 840 330.0 L 850 324.3 L 860 319.0 L 870 314.4 L 880 310.9 L 890 308.7 L 900 308.0 L 910 308.7 L 920 310.9 L 930 314.4 L 940 319.0 L 950 324.3 L 960 330.0 L 970 335.7 L 980 341.0 L 990 345.6 L 1000 349.1 L 1010 351.3 L 1020 352.0 L 1030 351.3 L 1040 349.1 L 1050 345.6 L 1060 341.0 L 1070 335.7 L 1080 330.0 L 1090 324.3 L 1100 319.0 L 1110 314.4 L 1120 310.9 L 1130 308.7 L 1140 308.0 L 1150 308.7 L 1160 310.9 L 1170 314.4 L 1180 319.0 L 1190 324.3 L 1200 330.0 L 1210 335.7 L 1220 341.0 L 1230 345.6 L 1240 349.1 L 1250 351.3 L 1260 352.0 L 1270 351.3 L 1280 349.1 L 1290 345.6 L 1300 341.0 L 1310 335.7 L 1320 330.0 L 1330 324.3 L 1340 319.0 L 1350 314.4 L 1360 310.9 L 1370 308.7 L 1380 308.0 L 1390 308.7 L 1400 310.9 L 1410 314.4 L 1420 319.0 L 1430 324.3 L 1440 330.0 L 1450 335.7 L 1460 341.0 L 1470 345.6 L 1480 349.1 L 1490 351.3 L 1500 352.0 L 1510 351.3 L 1520 349.1 L 1530 345.6 L 1540 341.0 L 1550 335.7 L 1560 330.0 L 1570 324.3 L 1580 319.0 L 1590 314.4 L 1600 310.9 L 1610 308.7 L 1620 308.0 L 1630 308.7 L 1640 310.9 L 1650 314.4 L 1660 319.0 L 1670 324.3 L 1680 330.0"/>' +
      '<path class="wave-path wave-path--1" d="M 0 300.0 L 10 308.8 L 20 317.0 L 30 324.0 L 40 329.4 L 50 332.8 L 60 334.0 L 70 332.8 L 80 329.4 L 90 324.0 L 100 317.0 L 110 308.8 L 120 300.0 L 130 291.2 L 140 283.0 L 150 276.0 L 160 270.6 L 170 267.2 L 180 266.0 L 190 267.2 L 200 270.6 L 210 276.0 L 220 283.0 L 230 291.2 L 240 300.0 L 250 308.8 L 260 317.0 L 270 324.0 L 280 329.4 L 290 332.8 L 300 334.0 L 310 332.8 L 320 329.4 L 330 324.0 L 340 317.0 L 350 308.8 L 360 300.0 L 370 291.2 L 380 283.0 L 390 276.0 L 400 270.6 L 410 267.2 L 420 266.0 L 430 267.2 L 440 270.6 L 450 276.0 L 460 283.0 L 470 291.2 L 480 300.0 L 490 308.8 L 500 317.0 L 510 324.0 L 520 329.4 L 530 332.8 L 540 334.0 L 550 332.8 L 560 329.4 L 570 324.0 L 580 317.0 L 590 308.8 L 600 300.0 L 610 291.2 L 620 283.0 L 630 276.0 L 640 270.6 L 650 267.2 L 660 266.0 L 670 267.2 L 680 270.6 L 690 276.0 L 700 283.0 L 710 291.2 L 720 300.0 L 730 308.8 L 740 317.0 L 750 324.0 L 760 329.4 L 770 332.8 L 780 334.0 L 790 332.8 L 800 329.4 L 810 324.0 L 820 317.0 L 830 308.8 L 840 300.0 L 850 291.2 L 860 283.0 L 870 276.0 L 880 270.6 L 890 267.2 L 900 266.0 L 910 267.2 L 920 270.6 L 930 276.0 L 940 283.0 L 950 291.2 L 960 300.0 L 970 308.8 L 980 317.0 L 990 324.0 L 1000 329.4 L 1010 332.8 L 1020 334.0 L 1030 332.8 L 1040 329.4 L 1050 324.0 L 1060 317.0 L 1070 308.8 L 1080 300.0 L 1090 291.2 L 1100 283.0 L 1110 276.0 L 1120 270.6 L 1130 267.2 L 1140 266.0 L 1150 267.2 L 1160 270.6 L 1170 276.0 L 1180 283.0 L 1190 291.2 L 1200 300.0 L 1210 308.8 L 1220 317.0 L 1230 324.0 L 1240 329.4 L 1250 332.8 L 1260 334.0 L 1270 332.8 L 1280 329.4 L 1290 324.0 L 1300 317.0 L 1310 308.8 L 1320 300.0 L 1330 291.2 L 1340 283.0 L 1350 276.0 L 1360 270.6 L 1370 267.2 L 1380 266.0 L 1390 267.2 L 1400 270.6 L 1410 276.0 L 1420 283.0 L 1430 291.2 L 1440 300.0 L 1450 308.8 L 1460 317.0 L 1470 324.0 L 1480 329.4 L 1490 332.8 L 1500 334.0 L 1510 332.8 L 1520 329.4 L 1530 324.0 L 1540 317.0 L 1550 308.8 L 1560 300.0 L 1570 291.2 L 1580 283.0 L 1590 276.0 L 1600 270.6 L 1610 267.2 L 1620 266.0 L 1630 267.2 L 1640 270.6 L 1650 276.0 L 1660 283.0 L 1670 291.2 L 1680 300.0"/>' +
      '<circle class="wave-node wave-node--pulse" cx="240" cy="266" r="4"/>' +
      '<circle class="wave-node wave-node--pulse" cx="600" cy="334" r="4" style="animation-delay:.8s"/>' +
      '<circle class="wave-node wave-node--pulse" cx="960" cy="214" r="4" style="animation-delay:1.6s"/>' +
      '<circle class="wave-node wave-node--pulse" cx="1320" cy="306" r="4" style="animation-delay:2.4s"/>' +
    '</svg>';
  document.addEventListener("DOMContentLoaded", function () {
    var hosts = document.querySelectorAll(".js-wave");
    for (var i = 0; i < hosts.length; i++) { hosts[i].innerHTML = SVG; }
  });
})();
