/* ===== COOKIE CONSENT — assessment.kristinabachova.com =====
 * Self-contained: injects its own CSS, banner, and modal.
 * Manages consent for: strictly necessary and analytics (GA4).
 * Consent stored in localStorage under 'kb_cookie_consent'.
 */
(function () {
  'use strict';

  var GA_ID           = 'G-X9MEK87E4M';
  var CONSENT_KEY     = 'kb_cookie_consent';
  var CONSENT_VERSION = '1';

  /* ─── Storage helpers ─── */

  function getConsent() {
    try {
      var raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (data.version !== CONSENT_VERSION) return null;
      return data;
    } catch (e) { return null; }
  }

  function saveConsent(categories) {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({
        version:    CONSENT_VERSION,
        timestamp:  new Date().toISOString(),
        categories: categories
      }));
    } catch (e) {}
  }

  /* ─── GA4 loader ─── */

  function loadAnalytics() {
    if (document.getElementById('ga-script')) return;
    var s = document.createElement('script');
    s.id  = 'ga-script';
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    s.async = true;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  function applyConsent(categories) {
    if (categories.analytics) loadAnalytics();
  }

  /* ─── CSS injection ─── */

  function injectStyles() {
    if (document.getElementById('kb-consent-styles')) return;
    var css = [
      '#kb-cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#1A3D5C;color:#F4F1EB;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;box-shadow:0 -2px 12px rgba(0,0,0,.2);font-family:system-ui,sans-serif;font-size:14px;line-height:1.5;}',
      '#kb-cookie-banner p{margin:0;flex:1;min-width:200px;}',
      '#kb-cookie-banner a{color:#a8c8e8;text-underline-offset:3px;}',
      '.kb-banner-actions{display:flex;gap:8px;flex-shrink:0;flex-wrap:wrap;}',
      '.kb-btn{padding:8px 16px;border-radius:6px;border:none;cursor:pointer;font-size:13px;font-weight:600;transition:opacity .15s;}',
      '.kb-btn:hover{opacity:.85;}',
      '.kb-btn-primary{background:#2A5F8F;color:#fff;}',
      '.kb-btn-ghost{background:transparent;color:#F4F1EB;border:1px solid rgba(244,241,235,.4);}',
      '.kb-btn-ghost:hover{background:rgba(255,255,255,.1);}',
      '#kb-cookie-modal{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px;}',
      '#kb-cookie-modal[hidden]{display:none;}',
      '.kb-modal-box{background:#fff;border-radius:12px;max-width:480px;width:100%;padding:28px;box-shadow:0 8px 32px rgba(0,0,0,.2);font-family:system-ui,sans-serif;}',
      '.kb-modal-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}',
      '.kb-modal-header h2{margin:0;font-size:18px;color:#1A3D5C;}',
      '.kb-modal-close{background:none;border:none;font-size:22px;cursor:pointer;color:#6A7E90;line-height:1;padding:0 4px;}',
      '.kb-modal-intro{font-size:13px;color:#6A7E90;margin:0 0 20px;}',
      '.kb-modal-intro a{color:#2A5F8F;}',
      '.kb-category{border:1px solid #E8E3DA;border-radius:8px;padding:14px 16px;margin-bottom:10px;}',
      '.kb-category-header{display:flex;align-items:center;justify-content:space-between;gap:12px;}',
      '.kb-category-name{font-weight:600;font-size:14px;color:#1A3D5C;margin:0 0 2px;}',
      '.kb-category-desc{font-size:12px;color:#6A7E90;margin:0;}',
      '.kb-always-on{font-size:12px;color:#2A5F8F;font-weight:600;white-space:nowrap;}',
      '.kb-toggle{position:relative;display:inline-block;width:40px;height:22px;flex-shrink:0;}',
      '.kb-toggle input{opacity:0;width:0;height:0;position:absolute;}',
      '.kb-slider{position:absolute;inset:0;background:#D9D4C8;border-radius:22px;transition:.2s;cursor:pointer;}',
      '.kb-slider::before{content:"";position:absolute;width:16px;height:16px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.2s;}',
      '.kb-toggle input:checked+.kb-slider{background:#2A5F8F;}',
      '.kb-toggle input:checked+.kb-slider::before{transform:translateX(18px);}',
      '.kb-modal-footer{display:flex;gap:8px;justify-content:flex-end;margin-top:20px;flex-wrap:wrap;}',
    ].join('');
    var style = document.createElement('style');
    style.id   = 'kb-consent-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ─── HTML injection ─── */

  function injectHTML() {
    if (document.getElementById('kb-cookie-banner')) return;

    var bannerHTML = [
      '<div id="kb-cookie-banner" role="region" aria-label="Cookie consent">',
      '  <p>This site uses cookies. Analytics cookies (Google Analytics) are optional — they help me understand how the assessment is being used.</p>',
      '  <div class="kb-banner-actions">',
      '    <button type="button" class="kb-btn kb-btn-ghost js-kb-manage">Manage preferences</button>',
      '    <button type="button" class="kb-btn kb-btn-ghost js-kb-reject">Reject non-essential</button>',
      '    <button type="button" class="kb-btn kb-btn-primary js-kb-accept">Accept all</button>',
      '  </div>',
      '</div>',
      '<div id="kb-cookie-modal" role="dialog" aria-modal="true" aria-labelledby="kb-modal-title" hidden>',
      '  <div class="kb-modal-box">',
      '    <div class="kb-modal-header">',
      '      <h2 id="kb-modal-title">Cookie Preferences</h2>',
      '      <button type="button" class="kb-modal-close js-kb-close-modal" aria-label="Close">&times;</button>',
      '    </div>',
      '    <p class="kb-modal-intro">Choose which cookies you allow. See the full <a href="https://kristinabachova.com/#privacy-policy" target="_blank" rel="noopener">Privacy &amp; Cookie Policy</a>.</p>',
      '    <div class="kb-category">',
      '      <div class="kb-category-header">',
      '        <div><p class="kb-category-name">Strictly Necessary</p><p class="kb-category-desc">Required for the assessment to function — storing your answers and preferences. Cannot be disabled.</p></div>',
      '        <span class="kb-always-on">Always on</span>',
      '      </div>',
      '    </div>',
      '    <div class="kb-category">',
      '      <div class="kb-category-header">',
      '        <div><p class="kb-category-name">Analytics</p><p class="kb-category-desc">Google Analytics — helps me understand how the assessment is used (pages visited, drop-off points). No personal data is sent.</p></div>',
      '        <label class="kb-toggle" for="kb-consent-analytics" aria-label="Toggle analytics cookies">',
      '          <input type="checkbox" id="kb-consent-analytics" class="kb-toggle-input">',
      '          <span class="kb-slider"></span>',
      '        </label>',
      '      </div>',
      '    </div>',
      '    <div class="kb-modal-footer">',
      '      <button type="button" class="kb-btn kb-btn-ghost js-kb-reject">Reject non-essential</button>',
      '      <button type="button" class="kb-btn kb-btn-primary js-kb-save">Save preferences</button>',
      '    </div>',
      '  </div>',
      '</div>',
    ].join('\n');

    var wrapper = document.createElement('div');
    wrapper.innerHTML = bannerHTML;
    while (wrapper.firstChild) document.body.appendChild(wrapper.firstChild);
  }

  /* ─── Banner / modal helpers ─── */

  function hideBanner() {
    var b = document.getElementById('kb-cookie-banner');
    if (b) b.remove();
  }

  function showModal() {
    var m = document.getElementById('kb-cookie-modal');
    if (!m) return;
    m.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function hideModal() {
    var m = document.getElementById('kb-cookie-modal');
    if (!m) return;
    m.hidden = true;
    document.body.style.overflow = '';
  }

  function prefillModal() {
    var consent = getConsent();
    var chk = document.getElementById('kb-consent-analytics');
    if (chk && consent && consent.categories) {
      chk.checked = !!consent.categories.analytics;
    }
  }

  /* ─── Init ─── */

  function init() {
    var consent = getConsent();

    if (consent) {
      applyConsent(consent.categories);
      return;
    }

    injectStyles();
    injectHTML();

    /* Accept all */
    document.querySelectorAll('.js-kb-accept').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cats = { necessary: true, analytics: true };
        saveConsent(cats);
        applyConsent(cats);
        hideBanner();
        hideModal();
      });
    });

    /* Reject non-essential */
    document.querySelectorAll('.js-kb-reject').forEach(function (btn) {
      btn.addEventListener('click', function () {
        saveConsent({ necessary: true, analytics: false });
        hideBanner();
        hideModal();
      });
    });

    /* Open modal */
    document.querySelectorAll('.js-kb-manage').forEach(function (btn) {
      btn.addEventListener('click', function () {
        prefillModal();
        showModal();
      });
    });

    /* Save preferences */
    document.querySelectorAll('.js-kb-save').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var chk = document.getElementById('kb-consent-analytics');
        var cats = { necessary: true, analytics: chk ? chk.checked : false };
        saveConsent(cats);
        applyConsent(cats);
        hideBanner();
        hideModal();
      });
    });

    /* Close modal */
    document.querySelectorAll('.js-kb-close-modal').forEach(function (btn) {
      btn.addEventListener('click', hideModal);
    });

    var modal = document.getElementById('kb-cookie-modal');
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) hideModal();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hideModal();
    });
  }

  /* ─── Public API ─── */
  window.CookieConsent = {
    getConsent: getConsent,
    hasConsent: function (category) {
      var c = getConsent();
      return c ? !!c.categories[category] : false;
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
