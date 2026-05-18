(function () {
  var STORAGE_KEY = 'ss-sidenav-collapsed';

  function setUserMenuOpen(trigger, open) {
    var menuId = trigger.getAttribute('aria-controls');
    if (!menuId) return;
    var menu = document.getElementById(menuId);
    if (!menu) return;
    var block = trigger.closest('.ss-user-block');
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.hidden = !open;
    if (block) block.classList.toggle('ss-user-block--open', open);
  }

  function closeAllUserMenus(exceptTrigger) {
    document.querySelectorAll('.ss-user-trigger').forEach(function (t) {
      if (t !== exceptTrigger) setUserMenuOpen(t, false);
    });
  }

  function bindUserMenus(root) {
    root.querySelectorAll('.ss-user-trigger').forEach(function (trigger) {
      var menuId = trigger.getAttribute('aria-controls');
      var menu = menuId ? document.getElementById(menuId) : null;
      if (!menu) return;

      setUserMenuOpen(trigger, trigger.getAttribute('aria-expanded') === 'true');

      menu.addEventListener('click', function (e) {
        e.stopPropagation();
      });

      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = trigger.getAttribute('aria-expanded') === 'true';
        if (!open) closeAllUserMenus(trigger);
        setUserMenuOpen(trigger, !open);
      });
    });
  }

  function setCollapsed(sidenav, collapsed) {
    sidenav.classList.toggle('ss-sidenav--collapsed', collapsed);
    var toggle = sidenav.querySelector('.ss-sidenav__toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      toggle.setAttribute(
        'aria-label',
        collapsed ? 'Expand sidebar' : 'Collapse sidebar'
      );
    }
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
    } catch (e) {
      /* ignore */
    }
  }

  function bindCollapse(sidenav) {
    var toggle = sidenav.querySelector('.ss-sidenav__toggle');
    if (!toggle) return;

    var stored;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      stored = null;
    }
    if (stored === '1') setCollapsed(sidenav, true);

    toggle.addEventListener('click', function () {
      setCollapsed(sidenav, !sidenav.classList.contains('ss-sidenav--collapsed'));
    });

    sidenav.querySelectorAll('.ss-nav-item--recents-shortcut').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (sidenav.classList.contains('ss-sidenav--collapsed')) {
          setCollapsed(sidenav, false);
        }
      });
    });
  }

  function bindChatItems(sidenav) {
    sidenav.querySelectorAll('.ss-sidenav__chat-item').forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        sidenav.querySelectorAll('.ss-sidenav__chat-item--active').forEach(function (el) {
          el.classList.remove('ss-sidenav__chat-item--active');
          el.removeAttribute('aria-current');
          var indicator = el.querySelector('.ss-sidenav__chat-indicator');
          if (indicator) indicator.remove();
        });
        item.classList.add('ss-sidenav__chat-item--active');
        item.setAttribute('aria-current', 'page');
        if (!item.querySelector('.ss-sidenav__chat-indicator')) {
          var bar = document.createElement('span');
          bar.className = 'ss-sidenav__chat-indicator';
          bar.setAttribute('aria-hidden', 'true');
          var text = item.querySelector('.ss-sidenav__chat-text');
          if (text) item.insertBefore(bar, text);
        }
      });
    });
  }

  function bindRecents(sidenav) {
    var section = sidenav.querySelector('.ss-sidenav__recents');
    var recentsToggle = sidenav.querySelector('.ss-sidenav__recents-toggle');
    if (!section || !recentsToggle) return;

    recentsToggle.addEventListener('click', function () {
      var open = recentsToggle.getAttribute('aria-expanded') === 'true';
      recentsToggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      section.classList.toggle('ss-sidenav__recents--closed', open);
    });
  }

  function initSidenav(sidenav) {
    bindCollapse(sidenav);
    bindRecents(sidenav);
    bindChatItems(sidenav);
    bindUserMenus(sidenav);
  }

  function boot() {
    var sidenav = document.getElementById('ss-sidenav');
    if (sidenav) initSidenav(sidenav);
  }

  document.addEventListener('click', function () {
    closeAllUserMenus(null);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeAllUserMenus(null);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
