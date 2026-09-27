(function () {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");
  const overlay = document.querySelector(".nav-overlay");
  const year = document.querySelector("#year");
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  const skillRoot = document.querySelector("#skill-groups");

  const skills = [
    {
      title: "Automation",
      items: ["Selenium (Java)", "TestNG", "Cypress", "Playwright"],
    },
    {
      title: "Quality layers",
      items: ["API testing", "SQL testing", "Microservices", "Migration testing"],
    },
    {
      title: "Delivery",
      items: ["Jenkins CI/CD", "Page objects", "Data-driven tests", "AI-assisted testing"],
    },
  ];

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  if (skillRoot) {
    skillRoot.innerHTML = skills
      .map(function (group) {
        const chips = group.items
          .map(function (item) {
            return '<span class="chip">' + item + "</span>";
          })
          .join("");

        return (
          '<article class="skill-group"><h3>' +
          group.title +
          '</h3><div class="chips">' +
          chips +
          "</div></article>"
        );
      })
      .join("");
  }

  function isDesktop() {
    return window.matchMedia("(min-width: 901px)").matches;
  }

  function setMenu(open) {
    if (!toggle || !nav || !overlay) return;

    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
    overlay.hidden = !open;
    document.body.classList.toggle("nav-open", open);
  }

  function closeMenu() {
    setMenu(false);
  }

  if (toggle && nav && overlay) {
    toggle.addEventListener("click", function () {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      setMenu(open);
    });

    overlay.addEventListener("click", closeMenu);

    const links = nav.querySelectorAll("a");
    links.forEach(function (link) {
      link.addEventListener("click", function () {
        if (!isDesktop()) {
          closeMenu();
        }
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (isDesktop()) {
        closeMenu();
      }
    });
  }

  const sections = document.querySelectorAll("main section[id]");

  function headerOffset() {
    return header ? header.getBoundingClientRect().height + 8 : 0;
  }

  function onScroll() {
    const navLinks = document.querySelectorAll(".site-nav a");
    const probe = headerOffset() + 4;
    let current = "";

    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= probe) {
        current = section.id;
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute("href");
      link.classList.toggle("is-active", href === "#" + current);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      const id = anchor.getAttribute("href").slice(1);
      const target = document.getElementById(id) || (id === "top" ? document.body : null);
      if (!target) {
        return;
      }
      event.preventDefault();
      const top =
        id === "top"
          ? 0
          : target.getBoundingClientRect().top + window.scrollY - headerOffset();
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  if (form && status) {
    function showError(name, message) {
      const el = form.querySelector('[data-for="' + name + '"]');
      if (el) {
        el.textContent = message;
      }
    }

    function clearErrors() {
      form.querySelectorAll(".field-error").forEach(function (el) {
        el.textContent = "";
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors();
      status.textContent = "";

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const message = String(data.get("message") || "").trim();
      let valid = true;

      if (name.length < 2) {
        showError("name", "Please enter your name.");
        valid = false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError("email", "Please enter a valid email.");
        valid = false;
      }
      if (message.length < 10) {
        showError("message", "Please add a bit more detail.");
        valid = false;
      }

      if (!valid) {
        status.textContent = "Fix the highlighted fields and try again.";
        return;
      }

      const composed =
        "Hi Lakshya,\n\n" + message + "\n\n— " + name + "\n" + email;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(composed).then(
          function () {
            status.textContent = "Message copied. Open LinkedIn and paste it into a note.";
          },
          function () {
            status.textContent = "Message is ready. Copy it and send via LinkedIn.";
          }
        );
      } else {
        status.textContent = "Message is ready. Copy it and send via LinkedIn.";
      }

      form.reset();
    });
  }
})();
