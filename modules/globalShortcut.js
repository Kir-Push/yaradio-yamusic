const {
  globalShortcut
} = require('electron');

function shortcutTpl(win) {
  return [{
      accelerator: 'shift+F1',
      func: () => win.send('play'),
    },
    {
      accelerator: 'shift+F3',
      func: () => win.send('next'),
    },
    {
      accelerator: 'shift+F2',
      func: () => win.send('prev'),
    },
    {
      accelerator: 'shift+F6',
      func: () => win.send('mute'),
    },
     {
      accelerator: 'shift+F5',
      func: () => win.send('like'),
    },
     {
      accelerator: 'shift+F4',
      func: () => win.send('dislike'),
    },
    
  ]
}

exports.init = (win, app) => {
  const tplShortcut = shortcutTpl(win);

  tplShortcut.forEach((e)=>{
    globalShortcut.register(e.accelerator, e.func)
  })

  app.on('will-quit', () => {
    // Unregister all shortcuts.
    globalShortcut.unregisterAll()
  })
}
