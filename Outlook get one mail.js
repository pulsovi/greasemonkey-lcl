// ==UserScript==
// @name     Outlook get one mail
// @version  1
// @grant    unsafeWindow
// @match    https://outlook.live.com/mail/*
// ==/UserScript==

/// GLOBALES
// selecteur pour un element dont la presence atteste qu'un mail est ouvert en lecture
const mailOpened = '[aria-label="Corps du message"]';
const globalMailContainer = '[aria-label="Volet de lecture"]'

/// GLOBALES

console.log("refresh start");
const { document } = unsafeWindow;
setInterval(refresh, 200);

const logo = document.body.appendChild(document.createElement('a'));
logo.style.display = 'block';
logo.style.width = '10px';
logo.style.height = '10px';
logo.style.background = 'red';
logo.style.position = 'absolute';
logo.style.top = 0;
logo.style.right = '13px';
logo.style.border = 'solid white 1px';
logo.className = 'greasemonkey-one-mail';
setInterval(() => {
  const contenu = document.querySelector(mailOpened);
  logo.style.background = contenu ? 'green' : 'red';
}, 200);

function refresh () {
  let mailId = 'unknown';
  const contenu = document.querySelector(mailOpened);
  if (!contenu) return;
  const instance = contenu[Object.keys(contenu).find(key => key.startsWith('__reactInternalInstance'))];
  if (!instance) return;
  const jobId = { finish: false };
  race(instance, jobId, 'root').then(id => { mailId = id; });
  logo.href = `https://outlook.live.com/mail/0/deeplink/read/${encodeURIComponent(mailId)}`;
}

async function race (instance, jobId) {
  await sleep(0);
  if (jobId.finish) return null;
  const keys = Object.keys(instance);
  if (keys.includes('firstItemId')) {
    jobId.finish = true;
    return instance.firstItemId;
  }
  return Promise.race(keys
    .filter(key => typeof key === 'number' ||
      'props,child,pendingProps,children,viewState'.split(',').includes(key))
    .map(key => race(instance[key], jobId)));
}

function sleep (ms) {
  return new Promise(rs => setTimeout(rs, ms));
}
