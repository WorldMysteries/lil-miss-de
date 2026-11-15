function initReadingProgress() {
  const bar = document.getElementById('readingProgressBar');
  if (!bar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
    bar.style.width = `${pct.toFixed(1)}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileNavDrawer');
  if (!btn || !drawer) return;

  const closeDrawer = () => {
    drawer.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  };

  btn.addEventListener('click', () => {
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    drawer.hidden = isExpanded;
    btn.setAttribute('aria-expanded', String(!isExpanded));
  });

  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });
}

function initTimelineFilters() {
  const buttons = document.querySelectorAll('.filter-btn[data-filter]');
  const cards = document.querySelectorAll('.timeline-card[data-phase]');
  if (!buttons.length || !cards.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selected = btn.getAttribute('data-filter');

      buttons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });

      cards.forEach((card) => {
        const phase = card.getAttribute('data-phase');
        card.hidden = selected !== 'all' && phase !== selected;
      });
    });
  });
}

function initRouteInspector() {
  const ROUTE_STOPS = {
    denver: {
      coords: '39.7392° N, 104.9903° W · 0 Meilen vom Start',
      title: 'Denver, Colorado — Abfahrt',
      desc: 'Am 25. März 1988 fuhr die achtzehnjährige Lisa Kimmell tagsüber von Denver aus nach Norden über die I-25 — in ihrem schwarzen Honda CR-X Si. Sie wollte nach Cody zu ihrem Freund Ed Yaroch und anschließend ihre Eltern in Billings besuchen.',
      status: 'Bestätigter Startpunkt',
      artifact: 'Aussagen der Angehörigen und Tankstellenquittungen'
    },
    orin: {
      coords: '42.6519° N, 105.1714° W · ~245 Meilen vom Start',
      title: 'Orin Junction, Wyoming — Letzte Begegnung',
      desc: 'Gegen 21:14 abends hielt Trooper Alan Konechny Lisa auf der I-25 wegen Geschwindigkeitsüberschreitung (88 mph) an. Die Dashcam nahm ihre ruhige Stimme auf — der letzte dokumentierte Kontakt mit Lisa.',
      status: 'Letzter bekannter Aufenthaltsort',
      artifact: 'Verkehrsstrafzettel und Aufzeichnung des Streifenwagens'
    },
    bridge: {
      coords: '42.7322° N, 106.5197° W · Raum Casper',
      title: 'Alte Government Bridge — Fundort',
      desc: 'Am 2. April 1988 entdeckte ein Fischer die Leiche Lisas im eiskalten Wasser des North Platte River. Der Täter brachte sie sechs Tage nach der Entführung hierher. Die hier sichergestellten biologischen Proben ermöglichten 2002 den DNA-Treffer.',
      status: 'Fundort (2. April 1988)',
      artifact: 'Tatortprotokolle und biologische CODIS-Proben'
    },
    moneta: {
      coords: '43.1627° N, 107.7215° W · Eatons Grundstück',
      title: 'Moneta, Fremont County — Verborgenes Autograb',
      desc: 'Ein abgelegenes Grundstück im semi-ariden Teil von Zentral-Wyoming. Im August 2002, nach dem DNA-Treffer mit Dale Wayne Eaton, gruben die Ermittler auf seinem Gelände den zersägten und vergrabenen schwarzen Honda CR-X mit dem Kennzeichen „LIL MISS“ aus.',
      status: 'Ort der Gefangenhaltung und des Autofunds (2002)',
      artifact: 'Der exhumierte Honda CR-X Si und der Schulbus'
    },
    cody: {
      coords: '44.5263° N, 109.0565° W · ~510 Meilen vom Start',
      title: 'Cody, Wyoming — Die nie erfolgte Ankunft',
      desc: 'Am Morgen des 26. März 1988 erschien Lisa nicht zur Verabredung in Cody. Nach dem besorgten Anruf ihres Freundes und ihrer Eltern begann eine groß angelegte Suche entlang aller Fernstraßen des Bundesstaats.',
      status: 'Zielort (nie erreicht)',
      artifact: 'Erste Vermisstenanzeige'
    }
  };

  const mapNodes = document.querySelectorAll('.map-node[data-stop]');
  const stopTabs = document.querySelectorAll('.stop-tab[data-stop]');
  const coordsEl = document.getElementById('stopCoords');
  const titleEl = document.getElementById('stopTitle');
  const descEl = document.getElementById('stopDesc');
  const statusEl = document.getElementById('stopStatus');
  const artifactEl = document.getElementById('stopArtifact');

  if (!coordsEl || !titleEl || !descEl || !statusEl || !artifactEl) return;

  const selectStop = (stopId) => {
    const stop = ROUTE_STOPS[stopId];
    if (!stop) return;

    coordsEl.textContent = stop.coords;
    titleEl.textContent = stop.title;
    descEl.textContent = stop.desc;
    statusEl.textContent = stop.status;
    artifactEl.textContent = stop.artifact;

    mapNodes.forEach((node) => {
      node.classList.toggle('is-selected', node.getAttribute('data-stop') === stopId);
    });

    stopTabs.forEach((tab) => {
      const active = tab.getAttribute('data-stop') === stopId;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });
  };

  mapNodes.forEach((node) => {
    node.addEventListener('click', () => {
      const id = node.getAttribute('data-stop');
      if (id) selectStop(id);
    });

    node.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const id = node.getAttribute('data-stop');
        if (id) selectStop(id);
      }
    });
  });

  stopTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const id = tab.getAttribute('data-stop');
      if (id) selectStop(id);
    });
  });
}

function initExhibitTabs() {
  const tabs = document.querySelectorAll('.exhibit-tab[data-exhibit]');
  const panels = document.querySelectorAll('.exhibit-panel');
  if (!tabs.length || !panels.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = `exhibit-${tab.getAttribute('data-exhibit')}`;

      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });

      panels.forEach((panel) => {
        const isTarget = panel.id === targetId;
        panel.hidden = !isTarget;
        panel.classList.toggle('is-active', isTarget);
      });
    });
  });
}

function initComparisonControls() {
  const buttons = document.querySelectorAll('.compare-btn[data-compare]');
  const table = document.getElementById('comparisonTable');
  if (!buttons.length || !table) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-compare');
      buttons.forEach((b) => b.classList.toggle('is-active', b === btn));

      table.classList.remove('mode-myths', 'mode-facts');
      if (mode === 'myths') table.classList.add('mode-myths');
      if (mode === 'facts') table.classList.add('mode-facts');
    });
  });
}

function initImageFallbackAndLightbox() {
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  let lastFocusedEl = null;

  const images = document.querySelectorAll('.archival-img');
  images.forEach((img) => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
    });

    if (img.classList.contains('zoomable-img') && modal && modalImg && modalCaption) {
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');

      const openModal = () => {
        lastFocusedEl = document.activeElement;
        modalImg.src = img.currentSrc || img.src;
        modalImg.alt = img.alt;
        modalCaption.textContent = img.getAttribute('data-caption') || img.alt;
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        if (closeBtn) closeBtn.focus();
      };

      img.addEventListener('click', openModal);
      img.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openModal();
        }
      });
    }
  });

  if (!modal || !closeBtn) return;

  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
      lastFocusedEl.focus();
    }
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });
}

function initScrollSpy() {
  const navLinks = document.querySelectorAll('.site-nav .nav-link');
  const sections = ['chronology', 'route', 'evidence', 'verdict']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!navLinks.length || !sections.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeId = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${activeId}`);
          });
        }
      });
    },
    { rootMargin: '-35% 0px -55% 0px' }
  );

  sections.forEach((sec) => observer.observe(sec));
}

function imageToDataUrl(img) {
  return new Promise((resolve) => {
    try {
      if (!img.complete || img.naturalWidth === 0) {
        resolve(null);
        return;
      }
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    } catch {
      resolve(null);
    }
  });
}

async function collectStylesText() {
  const chunks = [];
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  for (const link of links) {
    const href = link.getAttribute('href') || '';
    if (href.includes('fonts.googleapis.com')) continue;
    try {
      const res = await fetch(link.href);
      if (res.ok) chunks.push(await res.text());
    } catch {
      // Fallback to CSSOM rules if fetch fails
    }
  }
  if (!chunks.length) {
    for (const sheet of document.styleSheets) {
      try {
        if (!sheet.href || sheet.href.startsWith(window.location.origin)) {
          const rules = Array.from(sheet.cssRules).map((r) => r.cssText).join('\n');
          if (rules) chunks.push(rules);
        }
      } catch {
        // Ignore cross-origin stylesheets
      }
    }
  }
  return chunks.join('\n');
}

function buildInlineRuntimeScript() {
  return `(function () {
  var initReadingProgress = ${initReadingProgress.toString()};
  var initMobileMenu = ${initMobileMenu.toString()};
  var initTimelineFilters = ${initTimelineFilters.toString()};
  var initRouteInspector = ${initRouteInspector.toString()};
  var initExhibitTabs = ${initExhibitTabs.toString()};
  var initComparisonControls = ${initComparisonControls.toString()};
  var initImageFallbackAndLightbox = ${initImageFallbackAndLightbox.toString()};
  var initScrollSpy = ${initScrollSpy.toString()};
  document.addEventListener('DOMContentLoaded', function () {
    initReadingProgress();
    initMobileMenu();
    initTimelineFilters();
    initRouteInspector();
    initExhibitTabs();
    initComparisonControls();
    initImageFallbackAndLightbox();
    initScrollSpy();
  });
})();`;
}

function initStandaloneExport() {
  const btn = document.getElementById('downloadHtmlBtn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const originalLabel = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Datei wird vorbereitet...';

    try {
      const cssText = await collectStylesText();
      const liveImgs = Array.from(document.querySelectorAll('.archival-img'));
      const dataUrls = await Promise.all(liveImgs.map(imageToDataUrl));

      const clone = document.documentElement.cloneNode(true);

      // Remove external local stylesheet and module script links from clone
      clone.querySelectorAll('link[rel="stylesheet"]').forEach((el) => {
        const href = el.getAttribute('href') || '';
        if (!href.includes('fonts.googleapis.com')) el.remove();
      });
      clone.querySelectorAll('script[type="module"]').forEach((el) => el.remove());

      // Remove export button from the exported standalone copy
      const clonedExportBtn = clone.querySelector('#downloadHtmlBtn');
      if (clonedExportBtn) clonedExportBtn.remove();

      // Reset transient states in exported copy
      const clonedBar = clone.querySelector('#readingProgressBar');
      if (clonedBar) clonedBar.style.width = '0%';
      const clonedLightbox = clone.querySelector('#lightboxModal');
      if (clonedLightbox) clonedLightbox.setAttribute('hidden', '');
      const clonedDrawer = clone.querySelector('#mobileNavDrawer');
      if (clonedDrawer) clonedDrawer.setAttribute('hidden', '');

      // Embed images as base64 data URLs so the file works offline
      const clonedImgs = clone.querySelectorAll('.archival-img');
      clonedImgs.forEach((imgEl, idx) => {
        if (dataUrls[idx]) {
          imgEl.setAttribute('src', dataUrls[idx]);
        }
      });

      const head = clone.querySelector('head');
      if (head && cssText) {
        const styleEl = document.createElement('style');
        styleEl.textContent = cssText;
        head.appendChild(styleEl);
      }

      const body = clone.querySelector('body');
      if (body) {
        const scriptEl = document.createElement('script');
        scriptEl.textContent = buildInlineRuntimeScript();
        body.appendChild(scriptEl);
      }

      const htmlContent = '<!doctype html>\n' + clone.outerHTML;
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'lil-miss-archive.html';
      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } finally {
      btn.disabled = false;
      btn.textContent = originalLabel;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initReadingProgress();
  initMobileMenu();
  initTimelineFilters();
  initRouteInspector();
  initExhibitTabs();
  initComparisonControls();
  initImageFallbackAndLightbox();
  initScrollSpy();
  initStandaloneExport();
});
