// Sends one push message to every subscribed device. Runs inside GitHub Actions.
const webpush = require('web-push');
webpush.setVapidDetails('https://akshatsmodi.github.io/Treezy-Team/', process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE);
let subs = []; try { subs = JSON.parse(process.env.SUBS || '[]'); } catch (e) {}
const msg = JSON.stringify({ title: process.env.TITLE || 'TREEZY TEAM', body: process.env.BODY || '' });
Promise.allSettled(subs.map(s => webpush.sendNotification(s, msg, { TTL: 3600, urgency: 'high' })))
  .then(r => console.log('sent ' + r.filter(x => x.status === 'fulfilled').length + ' of ' + r.length));
