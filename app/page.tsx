"use client";

import { useEffect, useRef, useState } from "react";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const ASSET_BASE_URL = process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? "";
const assetPath = (path: string) => `${ASSET_BASE_URL}${path}`;

const SLIDES = [
  {
    desktop: "/images/hero-dog-desktop.jpg",
    mobile: "/images/hero-dog-mobile.jpg",
    alt: "A dog resting its paw on a timber fence and looking through an opening beside a grey wall",
    label: "Photography · Encounters",
  },
  {
    desktop: "/images/hero.jpg",
    alt: "An elevated architectural view of a timber community arranged around planted courtyards",
    label: "Architecture · Community",
  },
  {
    desktop: "/images/photography/everyday-fountain.jpg",
    alt: "People and dogs dispersed around a circular fountain in a city park",
    label: "Photography · Everyday Relations",
  },
];

const Arrow = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    className="arrow-icon"
  >
    <path d="M12 4v15M6.5 13.5 12 19l5.5-5.5" />
  </svg>
);

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [workVisible, setWorkVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const heroStageRef = useRef<HTMLDivElement>(null);
  const workRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % SLIDES.length);
    }, 8000);
    return () => window.clearInterval(timer);
  }, [playing, activeSlide]);

  useEffect(() => {
    const target = workRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWorkVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const stage = heroStageRef.current;
    if (!hero || !stage) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    let frame = 0;
    const updateScrollResponse = () => {
      frame = 0;
      const bounds = stage.getBoundingClientRect();
      const scrollRange = Math.max(stage.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(
        1,
        Math.max(0, -bounds.top / scrollRange),
      );

      hero.style.setProperty("--hero-media-y", `${progress * -3.5}vh`);
      hero.style.setProperty("--hero-media-scale", `${1 + progress * 0.095}`);
      hero.style.setProperty(
        "--hero-media-brightness",
        `${1 - progress * 0.35}`,
      );
      hero.style.setProperty(
        "--hero-interface-opacity",
        `${Math.max(0, 1 - progress * 1.55)}`,
      );
      hero.style.setProperty("--hero-header-y", `${progress * -54}px`);
      hero.style.setProperty("--hero-caption-y", `${progress * -96}px`);
      hero.style.setProperty("--hero-controls-y", `${progress * -46}px`);
      hero.style.setProperty("--hero-inset", `${progress * 2.4}vw`);
      hero.style.setProperty("--hero-bottom-inset", `${progress * 3.5}vh`);
      hero.style.setProperty("--hero-radius", `${progress * 42}px`);
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScrollResponse);
    };

    updateScrollResponse();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const moveSlide = (direction: number) => {
    setActiveSlide(
      (current) => (current + direction + SLIDES.length) % SLIDES.length,
    );
  };

  return (
    <main id="top">
      <div className="hero-stage" ref={heroStageRef}>
        <section className="hero" aria-labelledby="site-title" ref={heroRef}>
        <div className="hero-media" aria-live="polite">
          {SLIDES.map((slide, index) => (
            <picture
              className={
                "hero-slide " + (index === activeSlide ? "is-active" : "")
              }
              aria-hidden={index !== activeSlide}
              key={slide.desktop}
            >
              {slide.mobile && (
                <source
                  media="(max-width: 720px)"
                  srcSet={assetPath(slide.mobile)}
                />
              )}
              <img
                className="hero-image"
                src={assetPath(slide.desktop)}
                alt={index === activeSlide ? slide.alt : ""}
                fetchPriority={index === 0 ? "high" : "auto"}
              />
            </picture>
          ))}
        </div>
        <div className="hero-shade" aria-hidden="true" />

        <header className="site-header">
          <a className="identity" href="#top" id="site-title">
            Haotian Zheng
          </a>
          <nav aria-label="Main navigation">
            <a href="#work">Work</a>
            <a href={`${BASE_PATH}/photography/`}>Photography</a>
            <a href="#about">About</a>
          </nav>
        </header>

        <div className="hero-caption">
          <p className="hero-label" key={activeSlide}>
            {SLIDES[activeSlide].label}
          </p>
          <h1>
            Visual studies of space,
            <br />
            matter and everyday life.
          </h1>
        </div>

        <div className="hero-controls" aria-label="Featured image controls">
          <div className="slide-actions">
            <button
              type="button"
              onClick={() => moveSlide(-1)}
              aria-label="Previous image"
            >
              ←
            </button>
            <span className="slide-count" aria-live="polite">
              0{activeSlide + 1} <i>/</i> 0{SLIDES.length}
            </span>
            <button
              type="button"
              onClick={() => moveSlide(1)}
              aria-label="Next image"
            >
              →
            </button>
            <button
              className="play-toggle"
              type="button"
              onClick={() => setPlaying((current) => !current)}
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
              aria-pressed={!playing}
            >
              {playing ? "Ⅱ" : "▶"}
            </button>
          </div>
          <span className="progress-track" aria-hidden="true">
            <span
              className={
                "progress-fill " + (playing ? "is-playing" : "is-paused")
              }
              key={activeSlide}
            />
          </span>
        </div>

          <a className="scroll-cue" href="#work" aria-label="Scroll to selected work">
            <span>Explore</span>
            <Arrow />
          </a>
        </section>
      </div>

      <section
        className={"introduction " + (workVisible ? "is-visible" : "")}
        id="work"
        aria-labelledby="selected-title"
        ref={workRef}
      >
        <p className="eyebrow">Selected work · 2022—2026</p>
        <h2 id="selected-title">
          An evolving archive of architecture, images and experiments.
        </h2>
        <div className="index-grid">
          <a href="#architecture" className="index-item" id="architecture">
            <img
              className="index-image"
              src={assetPath("/images/architecture-cover.png")}
              alt="Exploded architectural drawing in white on a black background"
              loading="lazy"
            />
            <span className="index-shade" aria-hidden="true" />
            <span className="index-number">01</span>
            <div className="index-copy">
              <h3>Architecture</h3>
              <p>Projects, spaces and material investigations</p>
            </div>
            <span className="index-arrow">↗</span>
          </a>
          <a
            href={`${BASE_PATH}/photography/`}
            className="index-item"
            id="photography"
          >
            <img
              className="index-image"
              src={assetPath("/images/photography/everyday-fountain.jpg")}
              alt="People and dogs dispersed around a circular fountain in a city park"
              loading="lazy"
            />
            <span className="index-shade" aria-hidden="true" />
            <span className="index-number">02</span>
            <div className="index-copy">
              <h3>Photography</h3>
              <p>Observations of cities, people and distance</p>
            </div>
            <span className="index-arrow">↗</span>
          </a>
        </div>
      </section>

      <footer id="about">
        <p>Haotian Zheng</p>
        <p>Architectural designer &amp; photographer</p>
        <a
          href="https://www.instagram.com/Besterationalle"
          target="_blank"
          rel="noreferrer"
        >
          Instagram
        </a>
      </footer>
    </main>
  );
}

