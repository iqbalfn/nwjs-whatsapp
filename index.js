Message = {
    title: null,
    onChange(title) {
        Message.title = title
        let re = /\(([0-9]+)\)/
        let match = title.match(re)
        Tray.setIcon(!!match)

        if (match) {
            Win.obj.setBadgeLabel(match[1])
            Win.obj.requestAttention(match[1])
        }
    },
    init() {
        setInterval(e => {
            if (Win.obj.title != Message.title) {
                Message.onChange(Win.obj.title)
            }
        }, 1000)
    }
}
Tray = {
    obj: null,

    addListener(tray) {
        tray.on('click', e => {
            Win.obj.show()
        })
    },

    init() {
        Tray.obj = new nw.Tray({
            title: 'WhatsApp',
            icon: 'icons/tray.png'
        })

        var menu = new nw.Menu()
        menu.append(new nw.MenuItem({
            type: 'normal',
            label: 'Quit WhatsApp',
            click() {
                Win.obj.close(true)
            }
        }))
        Tray.obj.menu = menu

        Tray.addListener(Tray.obj)
    },

    setIcon(active) {
        let icon = 'icons/tray'
        if (active)
            icon += '-notif'
        icon += '.png'
        Tray.obj.icon = icon
    }
}

Win = {
    obj: null,
    URL: 'https://web.whatsapp.com/',

    addListener(win) {
        win.on('close', e => {
            win.hide()
        })
    },

    init() {
        nw.Window.open(Win.URL, win => {
            Win.obj = win
            win.show()
            Win.addListener(win)
        })
    }
}

Wa = {
    addListener() {
        nw.App.on('open', e => {
            if (Win.obj) {
                Win.obj.show()
            }
        })
    },
    init() {
        Win.init()
        Tray.init()
        Message.init()

        Wa.addListener()
    }
}

Wa.init()
