/**
 * Shared nav + footer for multi-page AgenticOps site.
 * Set <body data-ao-page="home|services|method|proof|trust|about|contact">
 */
(function () {
  var PAGE = document.body.getAttribute('data-ao-page') || 'home';

  var NAV_ITEMS = [
    ['home', '/', 'Home'],
    ['services', '/services.html', 'Services'],
    ['method', '/method.html', 'Method'],
    ['proof', '/proof.html', 'Proof'],
    ['trust', '/trust.html', 'Trust'],
    ['about', '/about.html', 'About']
  ];

  function navLinksHtml() {
    var parts = [];
    for (var i = 0; i < NAV_ITEMS.length; i++) {
      var id = NAV_ITEMS[i][0];
      var href = NAV_ITEMS[i][1];
      var label = NAV_ITEMS[i][2];
      var active = id === PAGE ? ' ao-nav-link-active' : '';
      parts.push(
        '<a class="ao-nav-link' + active + '" href="' + href + '">' + label + '</a>'
      );
    }
    var ctaClass = 'ao-nav-cta';
    if (PAGE === 'contact') ctaClass += ' ao-nav-link-active';
    parts.push(
      '<a class="' + ctaClass + '" href="/contact.html">Start a Pilot</a>'
    );
    return parts.join('');
  }

  function headerHtml() {
    return (
      '<div class="ao-wrap ao-nav-inner">' +
      '<a class="ao-brand" href="/" aria-label="AgenticOps home">' +
      '<img class="ao-brand-mark" src="/logo.svg" alt="" width="56" height="56" loading="eager" />' +
      '<span class="ao-brand-stack">' +
      '<span class="ao-brand-name">AgenticOps</span>' +
      '<span class="ao-brand-domain">agenticop.io</span>' +
      '</span></a>' +
      '<nav class="ao-nav-links" aria-label="Primary">' +
      navLinksHtml() +
      '</nav></div>'
    );
  }

  function footerHtml() {
    var year = new Date().getFullYear();
    var link = function (id, href, label) {
      var active = id === PAGE ? ' ao-footer-link-active' : '';
      return '<a class="ao-footer-link' + active + '" href="' + href + '">' + label + '</a>';
    };
    return (
      '<div class="ao-wrap ao-footer-inner">' +
      '<div class="ao-footer-brand">' +
      '<img class="ao-footer-mark" src="/logo.svg" alt="" width="48" height="48" loading="lazy" />' +
      '<span class="ao-brand-stack">' +
      '<span class="ao-brand-name ao-brand-name--footer">AgenticOps</span>' +
      '<span class="ao-brand-domain">agenticop.io</span>' +
      '</span></div>' +
      '<nav class="ao-footer-links" aria-label="Footer">' +
      link('home', '/', 'Home') +
      link('services', '/services.html', 'Services') +
      link('method', '/method.html', 'Method') +
      link('proof', '/proof.html', 'Proof') +
      link('trust', '/trust.html', 'Trust') +
      link('about', '/about.html', 'About') +
      link('contact', '/contact.html', 'Contact') +
      '<a href="https://wisptools.io" target="_blank" rel="noopener">wisptools.io</a>' +
      '<a href="https://github.com/theorem6" target="_blank" rel="noopener">GitHub</a>' +
      '<a href="https://www.linkedin.com/in/vibe-architect/" target="_blank" rel="noopener">LinkedIn</a>' +
      '</nav>' +
      '<p class="ao-footer-fine">© <span id="ao-year">' +
      year +
      '</span> AgenticOps. Agents explore. Chrysalis proves. You ship.</p>' +
      '</div>'
    );
  }

  function inject() {
    var navEl = document.getElementById('ao-site-nav');
    var footEl = document.getElementById('ao-site-footer');
    if (navEl) navEl.innerHTML = headerHtml();
    if (footEl) footEl.innerHTML = footerHtml();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
