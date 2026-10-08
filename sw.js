// Receives push messages from the server and shows them as system notifications, even when the app is closed.
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));
self.addEventListener('push', e => {
  let d = {}; try { d = e.data.json(); } catch (x) {}
  e.waitUntil(self.registration.showNotification(d.title || 'TREEZY TEAM', {
    body: d.body || '', icon: 'icon-192.png', badge: 'icon-192.png', tag: 'treezy', renotify: true
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(l => {
    for (const c of l) if ('focus' in c) return c.focus();
    return clients.openWindow('./');
  }));
});

// A fetch handler is what makes browsers treat the site as an installable app. It just passes requests through.
self.addEventListener('fetch', () => {});
