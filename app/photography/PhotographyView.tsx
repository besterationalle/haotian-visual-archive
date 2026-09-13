"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./photography.module.css";

const ASSET_BASE_URL = process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? "";
const assetPath = (path: string) => `${ASSET_BASE_URL}${path}`;

type Photo = {
  src: string;
  alt: string;
  label: string;
};

const openingPhoto: Photo = {
  src: "/images/photography/everyday-drink-shop.jpg",
  alt: "A customer facing a brightly lit drink shop while a shopkeeper works behind the counter",
  label: "Everyday Relations · 01",
};

const everydayPhotos: Array<Photo & { placement: string }> = [
  {
    src: "/images/photography/everyday-fountain.jpg",
    alt: "People and dogs dispersed around a circular fountain in a city park",
    label: "Everyday Relations · 02",
    placement: styles.everydayWide,
  },
  {
    src: "/images/photography/everyday-temple.jpg",
    alt: "Visitors pausing, passing and looking inside a traditional temple hall",
    label: "Everyday Relations · 03",
    placement: styles.everydayPortraitLeft,
  },
  {
    src: "/images/photography/everyday-alley-dog.jpg",
    alt: "A white dog walking toward the camera through a narrow residential alley",
    label: "Everyday Relations · 04",
    placement: styles.everydayPortraitRight,
  },
  {
    src: "/images/photography/everyday-harbor.jpg",
    alt: "Seabirds flying between a shaded terrace and a busy waterfront",
    label: "Everyday Relations · 05",
    placement: styles.everydayHarbor,
  },
  {
    src: "/images/photography/everyday-children.jpg",
    alt: "Two children moving at different distances along a path through dense trees",
    label: "Everyday Relations · 06",
    placement: styles.everydayChildren,
  },
];

const transitionPhotos: Photo[] = [
  {
    src: "/images/photography/transition-coast.jpg",
    alt: "Fishers standing apart across dark coastal rocks beside a restless sea",
    label: "Between the series · 01",
  },
  {
    src: "/images/photography/transition-net.jpg",
    alt: "A fisher casting a wide net from a small boat on a still mountain lake",
    label: "Between the series · 02",
  },
];

const distancePhotos: Array<Photo & { placement: string }> = [
  {
    src: "/images/photography/distance-rest.jpg",
    alt: "A traveller resting beside a large backpack beneath an open blue sky",
    label: "At a Distance · 01",
    placement: styles.distanceLeft,
  },
  {
    src: "/images/photography/distance-moon-walk.jpg",
    alt: "A solitary figure walking along a grassland path beneath the moon at dusk",
    label: "At a Distance · 02",
    placement: styles.distanceRight,
  },
  {
    src: "/images/photography/distance-light.jpg",
    alt: "A small figure holding a bright light among dark folded landforms at twilight",
    label: "At a Distance · 03",
    placement: styles.distanceCenter,
  },
  {
    src: "/images/photography/distance-tents.jpg",
    alt: "Two tents beneath a star-filled sky in a broad grassland",
    label: "At a Distance · 04",
    placement: styles.distanceWide,
  },
  {
    src: "/images/hero-dog-desktop.jpg",
    alt: "A dog resting its paw on a timber fence and looking through an opening",
    label: "Encounter · Epilogue",
    placement: styles.distanceEpilogue,
  },
];

const allPhotos = [
  openingPhoto,
  ...everydayPhotos,
  ...transitionPhotos,
  ...distancePhotos,
];

export default function PhotographyView() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxOpen = lightboxIndex !== null;
  const mainRef = useRef<HTMLElement>(null);
  const openingRef = useRef<HTMLDivElement>(null);
  const openingStageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      root.querySelectorAll("[data-photo-reveal]").forEach((element) => {
        element.classList.add(styles.isVisible);
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.isVisible);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10%", threshold: 0.08 },
    );
    root.querySelectorAll("[data-photo-reveal]").forEach((element) => {
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const opening = openingRef.current;
    const stage = openingStageRef.current;
    if (!opening || !stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const bounds = stage.getBoundingClientRect();
      const range = Math.max(stage.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -bounds.top / range));
      opening.style.setProperty("--opening-scale", `${1 + progress * 0.075}`);
      opening.style.setProperty("--opening-image-y", `${progress * -2.8}vh`);
      opening.style.setProperty("--opening-dim", `${0.18 + progress * 0.42}`);
      opening.style.setProperty(
        "--opening-copy-opacity",
        `${Math.max(0, 1 - progress * 1.45)}`,
      );
      opening.style.setProperty("--opening-copy-y", `${progress * -72}px`);
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowLeft") {
        setLightboxIndex((current) =>
          current === null
            ? null
            : (current - 1 + allPhotos.length) % allPhotos.length,
        );
      }
      if (event.key === "ArrowRight") {
        setLightboxIndex((current) =>
          current === null ? null : (current + 1) % allPhotos.length,
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen]);

  const openPhoto = (photo: Photo) => {
    setLightboxIndex(allPhotos.findIndex((item) => item.src === photo.src));
  };

  const moveLightbox = (direction: number) => {
    setLightboxIndex((current) =>
      current === null
        ? null
        : (current + direction + allPhotos.length) % allPhotos.length,
    );
  };

  const renderPhoto = (photo: Photo, className: string) => (
    <figure
      className={`${styles.photoFrame} ${className}`}
      data-photo-reveal
      key={photo.src}
    >
      <button
        className={styles.photoButton}
        type="button"
        onClick={() => openPhoto(photo)}
        aria-label={`Open ${photo.label} in full screen`}
      >
        <img src={assetPath(photo.src)} alt={photo.alt} loading="lazy" />
      </button>
      <figcaption>{photo.label}</figcaption>
    </figure>
  );

  return (
    <main className={styles.page} ref={mainRef} id="top">
      <section className={styles.openingStage} ref={openingStageRef}>
        <div className={styles.opening} ref={openingRef}>
          <img
            className={styles.openingBackdrop}
            src={assetPath(openingPhoto.src)}
            alt=""
            aria-hidden="true"
          />
          <img
            className={styles.openingImage}
            src={assetPath(openingPhoto.src)}
            alt={openingPhoto.alt}
            fetchPriority="high"
          />
          <div className={styles.openingShade} aria-hidden="true" />
          <header className={styles.openingHeader}>
            <Link className={styles.identity} href="/">
              Haotian Zheng
            </Link>
            <nav className={styles.openingNav} aria-label="Photography navigation">
              <Link href="/#work">Work</Link>
              <Link href="/photography" aria-current="page">
                Photography
              </Link>
              <Link href="/#about">About</Link>
            </nav>
          </header>
          <div className={styles.openingCopy}>
            <p>Photography · Series 01</p>
            <h1>Everyday Relations</h1>
            <span>Gestures, routines and lives sharing the same frame.</span>
          </div>
          <a className={styles.openingCue} href="#everyday">
            Enter the series <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <header className={styles.archiveHeader}>
        <Link className={styles.identity} href="/">
          Haotian Zheng
        </Link>
        <nav className={styles.archiveNav} aria-label="Archive navigation">
          <Link href="/#work">Work</Link>
          <a href="#everyday" aria-current="page">
            Photography
          </a>
          <Link href="/#about">About</Link>
        </nav>
      </header>

      <section className={styles.everyday} id="everyday">
        <header className={styles.seriesHeading} data-photo-reveal>
          <p>01 / 02</p>
          <h2>Everyday Relations</h2>
          <span>
            Public life begins as a field of small gestures, crossings and
            temporary arrangements.
          </span>
        </header>
        <div className={styles.everydayGrid}>
          {everydayPhotos.map((photo) => renderPhoto(photo, photo.placement))}
        </div>
      </section>

      <section className={styles.transition} aria-label="Transition between series">
        {renderPhoto(transitionPhotos[0], styles.transitionCoast)}
        <p className={styles.transitionLine} data-photo-reveal>
          The crowd thins. The landscape grows.
        </p>
        {renderPhoto(transitionPhotos[1], styles.transitionNet)}
      </section>

      <section className={styles.distance} id="distance">
        <header className={styles.seriesHeading} data-photo-reveal>
          <p>02 / 02</p>
          <h2>At a Distance</h2>
          <span>
            Figures become measures of terrain, time and the space that remains
            between them.
          </span>
        </header>
        <div className={styles.distanceSequence}>
          {distancePhotos.map((photo) => renderPhoto(photo, photo.placement))}
        </div>
      </section>

      <footer className={styles.footer}>
        <a href="#top">Back to top ↑</a>
        <p>Haotian Zheng · Photography</p>
        <Link href="/">Return home</Link>
      </footer>

      {lightboxIndex !== null && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Full-screen photograph viewer"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            className={styles.lightboxClose}
            onClick={() => setLightboxIndex(null)}
            aria-label="Close full-screen photograph"
            autoFocus
          >
            Close
          </button>
          <button
            type="button"
            className={`${styles.lightboxArrow} ${styles.lightboxPrevious}`}
            onClick={(event) => {
              event.stopPropagation();
              moveLightbox(-1);
            }}
            aria-label="Previous photograph"
          >
            ←
          </button>
          <img
            src={assetPath(allPhotos[lightboxIndex].src)}
            alt={allPhotos[lightboxIndex].alt}
            onClick={(event) => event.stopPropagation()}
          />
          <p>{allPhotos[lightboxIndex].label}</p>
          <button
            type="button"
            className={`${styles.lightboxArrow} ${styles.lightboxNext}`}
            onClick={(event) => {
              event.stopPropagation();
              moveLightbox(1);
            }}
            aria-label="Next photograph"
          >
            →
          </button>
        </div>
      )}
    </main>
  );
}

