// ==UserScript==
// @name     Outlook get one mail
// @version  1
// @grant    unsafeWindow
// @match    https://outlook.live.com/mail/*
// ==/UserScript==

/// GLOBALES
// selecteur pour un element dont la presence atteste qu'un mail est ouvert en lecture
const mailOpened = '[aria-label="Corps du message"]';
const refreshInterval = 200;
/// GLOBALES

const { document } = unsafeWindow;
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
}, refreshInterval);

setInterval(() => {
  const contenu = document.querySelector(mailOpened);
  if (!contenu) return;
  const mailId = Object.entries(document.querySelector('._2qM5JFJlSDFbw17aZw2PSp'))
    .find(([key]) => key.startsWith('__reactInternalInstance$'))[1]
    .memoizedProps.children[0].props.itemId.Id;
  logo.href = `https://outlook.live.com/mail/0/deeplink/read/${encodeURIComponent(mailId)}`;
}, refreshInterval);
