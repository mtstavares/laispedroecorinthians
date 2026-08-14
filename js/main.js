(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const setupLetterOpening = () => {
    const body = document.body;
    const envelope = document.querySelector(".envelope");
    const tribute = document.querySelector(".tribute");
    const openButton = document.querySelector("[data-letter-open]");
    const heroTitle = document.querySelector("#hero-title");

    if (!envelope || !tribute || !openButton || !heroTitle) return;

    const TRANSITION_FALLBACK_MS = 2100;
    let isOpening = false;

    const waitForEnvelopeExit = () =>
      new Promise((resolve) => {
        let fallback;

        const finish = () => {
          envelope.removeEventListener("transitionend", handleTransitionEnd);
          envelope.removeEventListener("animationend", handleAnimationEnd);
          window.clearTimeout(fallback);
          resolve();
        };

        const handleTransitionEnd = (event) => {
          if (event.target === envelope && event.propertyName === "opacity") {
            finish();
          }
        };

        const handleAnimationEnd = (event) => {
          if (event.target === envelope && event.animationName === "exit-envelope") {
            finish();
          }
        };

        envelope.addEventListener("transitionend", handleTransitionEnd);
        envelope.addEventListener("animationend", handleAnimationEnd);
        fallback = window.setTimeout(finish, TRANSITION_FALLBACK_MS);
      });

    openButton.addEventListener(
      "click",
      async () => {
        if (isOpening) return;

        isOpening = true;
        openButton.disabled = true;
        body.classList.replace("letter-closed", "letter-opening");

        if (reduceMotion.matches) {
          await new Promise((resolve) => window.requestAnimationFrame(resolve));
        } else {
          await waitForEnvelopeExit();
        }

        tribute.removeAttribute("inert");
        tribute.removeAttribute("aria-hidden");
        body.classList.replace("letter-opening", "letter-open");
        window.scrollTo(0, 0);
        await new Promise((resolve) =>
          window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)),
        );
        heroTitle.focus({ preventScroll: true });
      },
      { once: true },
    );
  };

  const setupReveals = () => {
    if (reduceMotion.matches || !("IntersectionObserver" in window)) return;

    const revealGroups = [
      [".hero .eyebrow, .hero h1, .photo-story, .hero__note"],
      [".section-heading, .music-card"],
      [".relationship__phrase, .heart-arrow"],
    ];
    const elements = revealGroups.flatMap(([selector]) => [
      ...document.querySelectorAll(selector),
    ]);

    if (!elements.length) return;

    document.body.classList.add("motion-ready");
    elements.forEach((element, index) => {
      element.classList.add("reveal-item");
      element.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));
  };

  setupLetterOpening();
  setupReveals();

  const player = document.querySelector("[data-audio-player]");

  if (!player) return;

  let activeTrack = null;

  const setPlayingState = (track, isPlaying) => {
    const button = track.querySelector("[data-play]");
    const title = track.querySelector("h3")?.textContent?.trim() || "esta música";

    track.classList.toggle("is-playing", isPlaying);
    button.setAttribute("aria-pressed", String(isPlaying));
    button.setAttribute(
      "aria-label",
      `${isPlaying ? "Pausar" : "Reproduzir"} ${title}`,
    );
  };

  const stopTrack = (track) => {
    if (!track) return;

    const audio = track.querySelector("audio");
    audio.pause();
    setPlayingState(track, false);

    if (activeTrack === track) activeTrack = null;
  };

  player.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-play]");
    if (!button || !player.contains(button)) return;

    const track = button.closest("[data-track]");
    const audio = track.querySelector("audio");

    if (activeTrack === track && !audio.paused) {
      stopTrack(track);
      return;
    }

    if (activeTrack && activeTrack !== track) stopTrack(activeTrack);

    activeTrack = track;
    setPlayingState(track, true);

    try {
      await audio.play();
    } catch {
      setPlayingState(track, false);
      if (activeTrack === track) activeTrack = null;
    }
  });

  player.addEventListener(
    "ended",
    (event) => {
      const track = event.target.closest("[data-track]");
      if (track) stopTrack(track);
    },
    true,
  );

  player.addEventListener(
    "pause",
    (event) => {
      const track = event.target.closest("[data-track]");
      if (track && track === activeTrack) {
        setPlayingState(track, false);
        activeTrack = null;
      }
    },
    true,
  );

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && activeTrack) stopTrack(activeTrack);
  });

  window.addEventListener("pagehide", () => {
    if (activeTrack) stopTrack(activeTrack);
  });
})();
