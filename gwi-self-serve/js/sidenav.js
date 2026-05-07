(function () {
  function setOpen(trigger, open) {
    var menuId = trigger.getAttribute('aria-controls');
    if (!menuId) return;
    var menu = document.getElementById(menuId);
    if (!menu) return;
    var block = trigger.closest('.ss-user-block');
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.hidden = !open;
    if (block) block.classList.toggle('ss-user-block--open', open);
  }

  function closeAllExcept(exceptTrigger) {
    document.querySelectorAll('.ss-user-trigger').forEach(function (t) {
      if (t !== exceptTrigger) setOpen(t, false);
    });
  }

  document.querySelectorAll('.ss-user-trigger').forEach(function (trigger) {
    var menuId = trigger.getAttribute('aria-controls');
    var menu = menuId ? document.getElementById(menuId) : null;
    if (!menu) return;

    setOpen(trigger, trigger.getAttribute('aria-expanded') === 'true');

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = trigger.getAttribute('aria-expanded') === 'true';
      if (!open) closeAllExcept(trigger);
      setOpen(trigger, !open);
    });
  });

  document.addEventListener('click', function () {
    closeAllExcept(null);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeAllExcept(null);
  });
})();
