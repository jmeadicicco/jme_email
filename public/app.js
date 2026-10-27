(() => {
  const inbox = document.querySelector(".inbox");
  const envelopeBtn = document.querySelector(".envelope-btn");
  const label = document.querySelector(".envelope-label");
  const status = document.getElementById("status-text");
  const message = document.getElementById("message");
  const dateField = document.getElementById("message-date");
  const sound = new Audio("media/youvegotmail.mp3");
  sound.preload = "auto";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const OPEN_DELAY_MS = 900;

  // RFC 822-style date, the way 90s mail clients showed it.
  function formatDate(d) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const pad = (n) => String(n).padStart(2, "0");
    const offset = -d.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const abs = Math.abs(offset);
    return `${days[d.getDay()]}, ${pad(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()} ` +
      `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ` +
      `${sign}${pad(Math.floor(abs / 60))}${pad(abs % 60)}`;
  }

  dateField.textContent = formatDate(new Date());

  function showMessage() {
    inbox.classList.remove("is-opening");
    inbox.classList.add("is-open", "is-read");
    label.textContent = "Read message again";
    status.textContent = "0 unread messages";
    message.hidden = false;
    if (!reducedMotion.matches) {
      message.classList.remove("is-popping");
      void message.offsetWidth;
      message.classList.add("is-popping");
    }
    message.querySelector(".message-body").focus();
  }

  function openEnvelope() {
    if (inbox.classList.contains("is-opening") || !message.hidden) return;

    sound.currentTime = 0;
    sound.play().catch(() => {});

    inbox.classList.remove("is-open");
    inbox.classList.add("is-opening");
    label.textContent = "Opening message…";

    setTimeout(showMessage, reducedMotion.matches ? 0 : OPEN_DELAY_MS);
  }

  function closeMessage() {
    message.hidden = true;
    message.classList.remove("is-popping");
    inbox.classList.remove("is-open");
    envelopeBtn.focus();
  }

  envelopeBtn.addEventListener("click", openEnvelope);

  message.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", closeMessage);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !message.hidden) closeMessage();
  });

  // Keep keyboard focus inside the open message window.
  message.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const focusables = [...message.querySelectorAll("a[href], button, [tabindex='0']")];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();
