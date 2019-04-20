const {
    ipcRenderer,
    webFrame,
    shell
} = require('electron');

const el = {
    prefButton: '.page-root .settings',
    prefDialog: '.settings-stream.popup',
    mute: '.page-root .volume',
    play: '.page-station .player-controls__play',
    next: '.page-station .slider__item_next',
    prev: '.page-station .slider__item_prev',
    like: '.page-root .d-like_theme-player',
    dislike: '.page-root .dislike_theme-player',
    activeStation: '.page-index .station_playing'
};

function exec(command) {
    webFrame.executeJavaScript(`if (!window.a) a = new Mu.Adapter(); ${command};`);
}

function click(s) {
    const e = document.querySelector(s);
    if (e) {
        e.click();
    }
}

ipcRenderer.on('play', () => exec('a.togglePause()'));
ipcRenderer.on('next', () => exec('a.next()'));
ipcRenderer.on('prev', () => exec('a.prev()'));
ipcRenderer.on('like', () => click(el.like));
ipcRenderer.on('dislike', () => click(el.dislike));
ipcRenderer.on('mute', () => exec('a.mute()'));
ipcRenderer.on('HQ', () => exec('a.toggleHQ()'));

document.onreadystatechange = () => {
    //Remove href to yandex
    $('div.footer__left').find('.link').removeAttr('href');
    $('div.nav__level').find('.footer__static-text').find('.link').removeAttr('href');
}

document.addEventListener("DOMContentLoaded", () => {
    if (/radio/.test(location.origin)) {
        initRadio();
    } else {
        initMusic();
    }
});

function initRadio() {
    // Add selector
    addSelector('', 'no__active');

    // Add href to GitHub
    // let cloneFooterElement = null;
    $('div.footer__right').find('div').each((i, e) => {
        $(e).css('display', 'none');
    })

    let appendElement = $('<div class="footer__static-text"><a class="link link_pale">GitHub</a></div>').click(() => {
        shell.openExternal('https://github.com/dedpnd/yaradio-yamusic');
    });
    $('div.footer__right').append(appendElement);

    //Add HQ
    let HQElement = $('<div class="hqRadio__icon" title="Включить высокое качество"></div>').click(() => {
        exec('a.toggleHQ()');
    })
    $('div.head__right').prepend(HQElement);
}

function initMusic() {
    // Add selector
    addSelector('no__active', '');

    // Hide Overlay
    // document.querySelector(".deco-button-overlay").click();
}

function addSelector(yarClass, yamClass) {
    let divBlock = document.createElement("div");
    divBlock.className = 'block-selector';

    if (yamClass) {
        divBlock.style.left = '5rem'
    }

    let pageRoot = document.querySelector('.page-root');

    // For ya-music because overlay playlist
    if(pageRoot.querySelector('.head.deco-pane')){
        pageRoot.insertBefore(divBlock, pageRoot.querySelector('.head').nextSibling);
        return
    }
    pageRoot.insertBefore(divBlock, pageRoot.querySelector('.overlay'));
}
