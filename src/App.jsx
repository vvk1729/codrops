import { useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Demos from './pages/Demos.jsx'
import CodePage from './pages/Code.jsx'
import './App.css'

const IMG_BASE = 'https://tympanus.net/Development/3DCarousel/assets';

const scenes = [
  { id: 1, title: 'Haute Couture Nights — Paris', cells: [1, 2, 3, 4] },
  { id: 2, title: 'Vogue Evolution — New York City', cells: [13, 14, 15, 16] },
  { id: 3, title: 'Glamour in the Desert — Dubai', cells: [25, 26, 27, 28] },
  { id: 4, title: 'Chic Couture Runway — Milan', cells: [37, 38, 39, 40] },
  { id: 5, title: 'Style Showcase — London', cells: [49, 50, 51, 52, 53, 54], radius: 650 },
  { id: 6, title: 'Future Fashion Forward — Tokyo', cells: [61, 62, 63, 64] },
];

const previews = [
  {
    id: 1,
    title: 'Haute Couture Nights — Paris',
    images: [1,2,3,4,5,6,7,8,9,10,11,12],
    names: ['Kai Vega','Riven Juno','Lex Orion','Ash Kairos','Juno Sol','Soren Nyx','Quinn Axon','Zara Voss','Hale B.','Gundra Wex','Extra One','Extra Two']
  },
  {
    id: 2,
    title: 'Vogue Evolution — New York City',
    images: [13,14,15,16,17,18,19,22,21,22,23,24],
    names: ['Arlo Quinn','Vera Kline','Juno Vale','Ember Dash','Rylee Voss','Harlow Nova','Blake Lune','Zephyr Kade','Indigo Rae','Kairo Jett','Extra One','Extra Two']
  },
  {
    id: 3,
    title: 'Glamour in the Desert — Dubai',
    images: [25,26,27,28,29,30,31,32,33,34,35,36],
    names: ['Luca Raine','Rory Vale','Sable Zev','Ellis Nova','Wren Asher','Zane Sky','Rowan Juno','Fenix Blade','Alix Storm','Nova Ray','Extra One','Extra Two']
  },
  {
    id: 4,
    title: 'Chic Couture Runway — Milan',
    images: [37,38,39,40,41,42,43,44,45,46,47,48],
    names: ['Aeris Flint','Jett Voss','Caius Storm','Mira Celeste','Liam Ashford','Vega Dawn','Orion Phoenix','Rex Solara','Elara Finch','Zoe Star','Extra One','Extra Two']
  },
  {
    id: 5,
    title: 'Style Showcase — London',
    images: [49,50,51,52,53,54,55,56,57,58,59,60],
    names: ['Rylan Ash','Lyra Wren','Axel Orion','Nova Sky','Kael Dray','Vesper Quill','Lira Wilder','Indigo Raye','Juno Storm','Ollie Lune','Extra One','Extra Two']
  },
  {
    id: 6,
    title: 'Future Fashion Forward — Tokyo',
    images: [61,62,63,64,65,66,67,68,69,70,71,72],
    names: ['Corin Blaize','Tess Kade','Juno Hale','Coral Vale','Ari Lennox','Ronan Aster','Arius Quill','Rex Ember','Vega Ashford','Finn Fenix','Extra One','Extra Two']
  },
];

function App() {
  useEffect(() => {
    const { gsap, ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText } = window;
    if (!gsap) return;
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText);

    const preloadImages = (selector = '.grid__item-image') => new Promise((resolve) => {
      if (window.imagesLoaded) {
        window.imagesLoaded(document.querySelectorAll(selector), { background: true }, resolve);
      } else {
        resolve();
      }
    });

    const smoother = ScrollSmoother?.create?.({ smooth: 1, effects: true, normalizeScroll: true });
    const sceneWrapper = document.querySelector('.scene-wrapper');
    let isAnimating = false;
    const splitMap = new Map();

    const getCarouselCellTransforms = (count, radius) => {
      const angleStep = 360 / count;
      return Array.from({ length: count }, (_, i) => `rotateY(${i * angleStep}deg) translateZ(${radius}px)`);
    };

    const computeRadius = (wrapper) => {
      const base = parseFloat(wrapper?.dataset?.radius) || 500;
      // Optional: enable responsive fit by adding 'fit-viewport' to <body>
      if (document.body.classList.contains('fit-viewport')) {
        const maxByViewport = Math.max(360, window.innerWidth * 0.36);
        return Math.min(base, maxByViewport);
      }
      return base;
    };

    const setupCarouselCells = (carousel) => {
      const wrapper = carousel.closest('.scene');
      const radius = computeRadius(wrapper);
      const cells = carousel.querySelectorAll('.carousel__cell');
      const transforms = getCarouselCellTransforms(cells.length, radius);
      cells.forEach((cell, i) => (cell.style.transform = transforms[i]));
    };

    const animateChars = (chars, direction = 'in', opts = {}) => {
      const base = {
        autoAlpha: direction === 'in' ? 1 : 0,
        duration: 0.02,
        ease: 'none',
        stagger: { each: 0.04, from: direction === 'in' ? 'start' : 'end' },
        ...opts,
      };
      gsap.fromTo(chars, { autoAlpha: direction === 'in' ? 0 : 1 }, base);
    };

    const createScrollAnimation = (carousel) => {
      const wrapper = carousel.closest('.scene');
      const cards = carousel.querySelectorAll('.card');
      const titleSpan = wrapper.querySelector('.scene__title span');
      const split = splitMap.get(titleSpan);
      const chars = split?.chars || [];

      carousel._timeline = gsap.timeline({
        defaults: { ease: 'sine.inOut' },
        scrollTrigger: {
          trigger: wrapper,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      carousel._timeline
        .fromTo(carousel, { rotationY: 0 }, { rotationY: -180 }, 0)
        .fromTo(carousel, { rotationZ: 3, rotationX: 3 }, { rotationZ: -3, rotationX: -3 }, 0)
        .fromTo(cards, { filter: 'brightness(250%)' }, { filter: 'brightness(80%)', ease: 'power3' }, 0)
        .fromTo(cards, { rotationZ: 10 }, { rotationZ: -10, ease: 'none' }, 0);

      if (chars.length > 0) {
        animateChars(chars, 'in', {
          scrollTrigger: {
            trigger: wrapper,
            start: 'top center',
            toggleActions: 'play none none reverse',
          },
        });
      }
      return carousel._timeline;
    };

    const initTextsSplit = () => {
      document
        .querySelectorAll('.scene__title span, .preview__title span, .preview__close')
        .forEach((span) => {
          const split = SplitText.create(span, { type: 'chars', charsClass: 'char', autoSplit: true });
          splitMap.set(span, split);
        });
    };

    const animateGridItemIn = (el, dx, dy, rotationY, delay) => {
      gsap.fromTo(
        el,
        { transformOrigin: `% 50% ${dx > 0 ? -dx * 0.8 : dx * 0.8}px`, autoAlpha: 0, y: dy * 0.5, scale: 0.5, rotationY },
        { y: 0, scale: 1, rotationY: 0, autoAlpha: 1, duration: 0.4, ease: 'sine', delay: delay + 0.1 }
      );
      gsap.fromTo(el, { z: -3500 }, { z: 0, duration: 0.3, ease: 'expo', delay });
    };

    const animateGridItemOut = (el, dx, dy, rotationY, delay, isLast, onComplete) => {
      gsap.to(el, {
        startAt: { transformOrigin: `50% 50% ${dx > 0 ? -dx * 0.8 : dx * 0.8}px` },
        y: dy * 0.4,
        rotationY,
        scale: 0.4,
        autoAlpha: 0,
        duration: 0.4,
        ease: 'sine.in',
        delay,
      });
      gsap.to(el, { z: -3500, duration: 0.4, ease: 'expo.in', delay: delay + 0.9, onComplete: isLast ? onComplete : undefined });
    };

    const animateGridItems = ({ items, centerX, centerY, direction = 'in', onComplete }) => {
      const itemData = Array.from(items).map((el) => {
        const rect = el.getBoundingClientRect();
        const elCenterX = rect.left + rect.width / 2;
        const elCenterY = rect.top + rect.height / 2;
        const dx = centerX - elCenterX;
        const dy = centerY - elCenterY;
        const dist = Math.hypot(dx, dy);
        const isLeft = elCenterX < centerX;
        return { el, dx, dy, dist, isLeft };
      });
      const maxDist = Math.max(...itemData.map((d) => d.dist));
      const totalStagger = 0.025 * (itemData.length - 1);
      let latest = { delay: -1, el: null };
      itemData.forEach(({ el, dx, dy, dist, isLeft }) => {
        const norm = maxDist ? dist / maxDist : 0;
        const exponential = Math.pow(direction === 'in' ? 1 - norm : norm, 1);
        const delay = exponential * totalStagger;
        const rotationY = isLeft ? 100 : -100;
        if (direction === 'in') {
          animateGridItemIn(el, dx, dy, rotationY, delay);
        } else {
          if (delay > latest.delay) latest = { delay, el };
          animateGridItemOut(el, dx, dy, rotationY, delay, false, onComplete);
        }
      });
      if (direction === 'out' && latest.el) {
        const { el, dx, dy, isLeft } = itemData.find((d) => d.el === latest.el);
        const rotationY = isLeft ? 100 : -100;
        animateGridItemOut(el, dx, dy, rotationY, latest.delay, true, onComplete);
      }
    };

    const animatePreviewGridIn = (preview) => {
      const items = preview.querySelectorAll('.grid__item');
      gsap.set(items, { clearProps: 'all' });
      animateGridItems({ items, centerX: window.innerWidth / 2, centerY: window.innerHeight / 2, direction: 'in' });
    };

    const animatePreviewGridOut = (preview) => {
      const items = preview.querySelectorAll('.grid__item');
      const onComplete = () => gsap.set(preview, { pointerEvents: 'none', autoAlpha: 0 });
      animateGridItems({ items, centerX: window.innerWidth / 2, centerY: window.innerHeight / 2, direction: 'out', onComplete });
    };

    const getSceneElementsFromTitle = (titleEl) => {
      const wrapper = titleEl.closest('.scene');
      const carousel = wrapper?.querySelector('.carousel');
      const cards = carousel?.querySelectorAll('.card');
      const span = titleEl.querySelector('span');
      const chars = splitMap.get(span)?.chars || [];
      return { wrapper, carousel, cards, span, chars };
    };

    const getSceneElementsFromPreview = (previewEl) => {
      const previewId = `#${previewEl.id}`;
      const titleLink = document.querySelector(`.scene__title a[href="${previewId}"]`);
      const titleEl = titleLink?.closest('.scene__title');
      return { ...getSceneElementsFromTitle(titleEl), titleEl };
    };

    const getInterpolatedRotation = (progress) => ({
      rotationY: gsap.utils.interpolate(0, -180, progress),
      rotationX: gsap.utils.interpolate(3, -3, progress),
      rotationZ: gsap.utils.interpolate(3, -3, progress),
    });

    function preventScroll(e) { e.preventDefault(); }
    function preventArrowScroll(e) {
      const keys = ['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '];
      if (keys.includes(e.key)) e.preventDefault();
    }
    function lockUserScroll() {
      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
      window.addEventListener('keydown', preventArrowScroll, false);
    }
    function unlockUserScroll() {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventArrowScroll);
    }

    const activatePreviewFromCarousel = (e) => {
      e.preventDefault();
      if (isAnimating) return;
      isAnimating = true;
      const titleEl = e.currentTarget;
      const { wrapper, carousel, cards, chars } = getSceneElementsFromTitle(titleEl);
      // Store current scroll position before any animation
      const currentScrollY = window.scrollY;
      const previewSelector = titleEl.querySelector('a')?.getAttribute('href');
      const preview = document.querySelector(previewSelector);
      if (preview) preview.dataset.scrollPosition = currentScrollY;
      
      const offsetTop = wrapper.getBoundingClientRect().top + window.scrollY;
      const targetY = offsetTop - window.innerHeight / 2 + wrapper.offsetHeight / 2;
      ScrollTrigger.getAll().forEach((t) => t.disable(false));
      lockUserScroll();
      smoother?.paused?.(true);
      gsap
        .timeline({
          defaults: { duration: 1.5, ease: 'power2.inOut' },
          onComplete: () => {
            unlockUserScroll();
            isAnimating = false;
            ScrollTrigger.getAll().forEach((t) => t.enable());
          },
        })
        .to(chars, { autoAlpha: 0, duration: 0.02, ease: 'none', stagger: { each: 0.04, from: 'end' } }, 0)
        .to(carousel, { rotationX: 90, rotationY: -360, z: -2000 }, 0)
        .to(carousel, { duration: 2.5, ease: 'power3.inOut', z: 1500, rotationZ: 270, onComplete: () => gsap.set(sceneWrapper, { autoAlpha: 0 }) }, 0.7)
        .to(cards, { rotationZ: 0 }, 0)
        .add(() => {
          const previewSelector = titleEl.querySelector('a')?.getAttribute('href');
          const preview = document.querySelector(previewSelector);
          gsap.set(preview, { pointerEvents: 'auto', autoAlpha: 1 });
          animatePreviewGridIn(preview);
          preview && preview.querySelectorAll('.preview__title span, .preview__close').forEach((el) => {
            const chars = splitMap.get(el)?.chars || [];
            animateChars(chars, 'in');
          });
        }, '<+=1.9');
    };

    const deactivatePreviewToCarousel = (e) => {
      if (isAnimating) return;
      isAnimating = true;
      const preview = e.currentTarget.closest('.preview');
      if (!preview) return;
      const { carousel, cards, chars } = getSceneElementsFromPreview(preview);
      // Restore scroll position to maintain carousel position
      const savedScrollPosition = parseFloat(preview.dataset.scrollPosition) || window.scrollY;
      preview.querySelectorAll('.preview__title span, .preview__close').forEach((el) => {
        const chars = splitMap.get(el)?.chars || [];
        animateChars(chars, 'out');
      });
      animatePreviewGridOut(preview);
      gsap.set(sceneWrapper, { autoAlpha: 1 });
      const progress = 0.5;
      const { rotationX, rotationY, rotationZ } = getInterpolatedRotation(progress);
      gsap
        .timeline({ 
          delay: 0.7, 
          defaults: { duration: 1.3, ease: 'expo' }, 
          onComplete: () => { 
            smoother?.paused?.(false); 
            gsap.to(window, { duration: 0, scrollTo: savedScrollPosition });
            isAnimating = false; 
          } 
        })
        .fromTo(chars, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.02, ease: 'none', stagger: { each: 0.04, from: 'start' } })
        .fromTo(carousel, { z: -550, rotationX, rotationY: -720, rotationZ, yPercent: 300 }, { rotationY, yPercent: 0 }, 0)
        .fromTo(cards, { autoAlpha: 0 }, { autoAlpha: 1 }, 0.3);
    };

    const initEventListeners = () => {
      document.querySelectorAll('.scene__title').forEach((title) => title.addEventListener('click', activatePreviewFromCarousel));
      document.querySelectorAll('.preview__close').forEach((btn) => btn.addEventListener('click', deactivatePreviewToCarousel));
    };

    const initCarousels = () => {
      document.querySelectorAll('.carousel').forEach((carousel) => {
        setupCarouselCells(carousel);
        carousel._timeline = createScrollAnimation(carousel);
      });
    };

    const init = () => {
      initTextsSplit();
      initCarousels();
      initEventListeners();
      window.addEventListener('resize', ScrollTrigger.refresh);
      // Recompute cell positions on resize to keep sides visible at 100% zoom
      const onResizeRecalc = () => {
        document.querySelectorAll('.carousel').forEach((c) => setupCarouselCells(c));
      };
      window.addEventListener('resize', onResizeRecalc);
      // Store for cleanup
      window.__onResizeRecalc = onResizeRecalc;
    };

    preloadImages('.grid__item-image').then(() => {
      document.body.classList.remove('loading');
      init();
    });

    return () => {
      // Cleanup listeners and GSAP triggers on unmount
      document.querySelectorAll('.scene__title').forEach((title) => title.removeEventListener('click', activatePreviewFromCarousel));
      document.querySelectorAll('.preview__close').forEach((btn) => btn.removeEventListener('click', deactivatePreviewToCarousel));
      window.removeEventListener('resize', ScrollTrigger.refresh);
      if (window.__onResizeRecalc) {
        window.removeEventListener('resize', window.__onResizeRecalc);
        delete window.__onResizeRecalc;
      }
      window.gsap?.killTweensOf?.('*');
      window.gsap?.globalTimeline?.clear?.();
      window.ScrollTrigger?.getAll?.().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <header className="frame">
        <h1 className="frame__title">On-Scroll 3D Carousel</h1>
        <nav className="frame__links">
          <a className="line" href="https://tympanus.net/codrops/?p=93330" target="_self">Article</a>
          <a className="line" href="https://github.com/vvk1729/codrops" target="_self">Code</a>
          <a className="line" href="https://tympanus.net/codrops/hub/" target="_self">All demos</a>
        </nav>
        <nav className="frame__tags">
          <a className="line" href="https://tympanus.net/codrops/demos/?tag=3d">#3d</a>
          <a className="line" href="https://tympanus.net/codrops/demos/?tag=carousel">#carousel</a>
          <a className="line" href="https://tympanus.net/codrops/demos/?tag=page-transition">#page-transition</a>
        </nav>
        <div id="cdawrap">
          <small>
            <a href="https://bit.ly/codrops-diviai" target="_blank" rel="noreferrer">
              DIVI AI: ON DEMAND CONTENT<br />
              CREATION, CODE WRITING &amp;<br />
              IMAGE GENERATION.
            </a>
          </small>
        </div>
      </header>

      <Routes>
        <Route path="/" element={
          <>
            <main id="smooth-content">
              <div className="scene-wrapper">
                {scenes.map((scene, idx) => (
                  <div className="scene" id={`scene-${scene.id}`} key={scene.id} {...(scene.radius ? { 'data-radius': scene.radius } : {})}>
                    <h2 className="scene__title" data-speed="0.7">
                      <a href={`#preview-${scene.id}`}><span>{scene.title}</span></a>
                    </h2>
                    <div className="carousel">
                      {scene.cells.map((n, i) => (
                        <div className="carousel__cell" key={i}>
                          <div className="card" style={{ ['--img']: `url(${IMG_BASE}/img${n}.webp)` }}>
                            <div className="card__face card__face--front"></div>
                            <div className="card__face card__face--back"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </main>

            <div className="preview-wrapper">
              {previews.map((p) => (
                <div className="preview" id={`preview-${p.id}`} key={p.id}>
                  <header className="preview__header">
                    <h2 className="preview__title"><span>{p.title}</span></h2>
                    <button className="preview__close">Close ×</button>
                  </header>
                  <div className="grid">
                    {p.images.map((img, idx) => (
                      <figure className="grid__item" role="img" aria-labelledby={`caption${p.id}-${idx}`} key={idx}>
                        <div className="grid__item-image" style={{ backgroundImage: `url(${IMG_BASE}/img${img}.webp)` }}></div>
                        <figcaption className="grid__item-caption" id={`caption${p.id}-${idx}`}>
                          <h3>{p.names[idx] || ''}</h3>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        } />
        <Route path="/demos" element={<Demos />} />
        <Route path="/code" element={<CodePage />} />
      </Routes>
    </>
  );
}

export default App
