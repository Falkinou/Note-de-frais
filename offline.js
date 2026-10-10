(function () {
  'use strict';
  const version = document.querySelector('meta[name="application-version"]').content;
  let state = {status: 'preparing', completed: 0, total: 0}, registration, listener, wasControlled = false;
  function update(value) { state = { ...state, ...value }; if (listener) listener(state); }
  function ask(type) { (navigator.serviceWorker.controller || registration?.active)?.postMessage({ type }); }
  async function retry() {
    if (!('serviceWorker' in navigator)) return;
    update({status: 'preparing'});
    try {
      registration = await navigator.serviceWorker.register('./sw.js', {updateViaCache: 'none'});
      if (registration.active && !registration.installing) ask('PREPARE_OFFLINE');
      await registration.update();
    } catch (_) { update({status: 'error'}); }
  }
  function start(onChange, onUpdate) {
    listener = onChange;
    if (!('serviceWorker' in navigator)) { update({status: 'unavailable'}); return; }
    wasControlled = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data?.type !== 'OFFLINE_STATUS') return;
      const data = event.data;
      update({status: data.version !== version && data.status === 'ready' ? 'updating' : data.status, completed: data.completed, total: data.total});
    });
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (wasControlled) onUpdate();
      wasControlled = true; ask('OFFLINE_STATUS');
    });
    const connection = () => { if (listener) listener(state); if (navigator.onLine && ['incomplete', 'error'].includes(state.status)) void retry(); };
    window.addEventListener('online', connection); window.addEventListener('offline', connection);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) { ask('OFFLINE_STATUS'); registration?.update().catch(() => {}); } });
    navigator.serviceWorker.register('./sw.js', {updateViaCache: 'none'}).then(value => {
      registration = value; ask('OFFLINE_STATUS');
      function watch(worker) { worker?.addEventListener('statechange', () => { if (worker.state === 'redundant') update({status: 'error'}); }); }
      watch(value.installing); value.addEventListener('updatefound', () => watch(value.installing));
    }).catch(() => update({status: 'error'}));
  }
  window.StampfelOffline = {start, retry, version, snapshot: () => state};
})();
