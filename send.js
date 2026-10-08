// Sends one push message to every subscribed device. Runs inside GitHub Actions.
const webpush = require('web-push');
// Secrets pasted into GitHub often carry a stray space, line break or quote; strip anything that is not part of a URL-safe base64 key.
const clean = v => String(v || '').replace(/[^A-Za-z0-9_-]/g, '');
const PUB = clean(process.env.VAPID_PUBLIC), PRIV = clean(process.env.VAPID_PRIVATE);
console.log('public key length ' + PUB.length + ' (should be 87), private key length ' + PRIV.length + ' (should be 43)');
webpush.setVapidDetails('https://akshatsmodi.github.io/Treezy-Team/', PUB, PRIV);
let subs = []; try { subs = JSON.parse(process.env.SUBS || '[]'); } catch (e) {}
const msg = JSON.stringify({ title: process.env.TITLE || 'TREEZY TEAM', body: process.env.BODY || '' });
Promise.allSettled(subs.map(s => webpush.sendNotification(s, msg, { TTL: 3600, urgency: 'high' })))
  .then(r => {
    r.forEach((x, i) => { if (x.status === 'rejected') console.log('device ' + (i + 1) + ' failed: ' + (x.reason && (x.reason.statusCode + ' ' + (x.reason.body || x.reason.message)))); });
    console.log('sent ' + r.filter(x => x.status === 'fulfilled').length + ' of ' + r.length);
  });
