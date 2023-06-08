import browser from 'webextension-polyfill';

const addScript = (url: string) => {
  const container = document.head || document.documentElement;
  const scriptTag = document.createElement('script');
  scriptTag.setAttribute('src', browser.runtime.getURL(url) + `?rd=${Math.random().toFixed(2)}`);
  container.appendChild(scriptTag);
  scriptTag.onload = () => scriptTag.remove();
};

addScript(`src/js/providers.js`);
