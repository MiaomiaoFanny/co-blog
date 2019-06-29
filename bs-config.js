
/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 browser-sync start --directory 251 --server
 browser-sync start --directory --server
 browser-sync start --config bs-config.js
 browser-sync start --config bs-config.js --directory
 */
module.exports = {
    "ui": {
        "port": 3002//默认3001, UI & UI External port > BrowserSync manage
    },
    "files": false,
    // files: "dist/*, dist/*/*", // 监听的文件, 以gulpfile.js所在目录为根目录, 字符串或数组
    "watchEvents": [
        "change"
    ],
    "watch": false,
    "ignore": [],
    "single": false,
    "watchOptions": {
        "ignoreInitial": true
    },
    "server": "251",
    // server: {baseDir: './dist } // 静态服务器模式, 启动静态服务器, 默认打开dist/index.html
    "proxy": false,
    // proxy: 'localhost:8888', // 代理服务器模式, 将要代理的服务器地址
    "port": 3000,//默认3000, Local & External port > watching the proxy or server
    "middleware": false,
    "serveStatic": [],
    "ghostMode": {
        "clicks": true,
        "scroll": true,
        "location": true,
        "forms": {
            "submit": true,
            "inputs": true,
            "toggles": true
        }
    },
    "logLevel": "info",
    "logPrefix": "Browsersync",//log 前缀
    "logConnections": false,
    "logFileChanges": true,
    "logSnippet": true,
    "rewriteRules": [],
    "open": "local",
    "browser": "default",
    // browser: ['chrome', 'firefox', 'iexplore'],
    // phostMode: { //不同浏览器的镜像动作, 同时点击,滚动等
    //     clicks: true,
    //     scroll: true
    //   },
    "cors": false,
    "xip": false,
    "hostnameSuffix": false,
    "reloadOnRestart": false,
    "notify": true,
    "scrollProportionally": true,
    "scrollThrottle": 0,
    "scrollRestoreTechnique": "window.name",
    "scrollElements": [],
    "scrollElementMapping": [],
    "reloadDelay": 0,
    "reloadDebounce": 500,
    "reloadThrottle": 0,
    "plugins": [],
    "injectChanges": true,
    "startPath": null,
    "minify": true,
    "host": "192.168.1.11",//默认null External: http://192.168.1.11:3000
    "localOnly": false,
    "codeSync": true,
    "timestamps": true,
    "clientEvents": [
        "scroll",
        "scroll:element",
        "input:text",
        "input:toggles",
        "form:submit",
        "form:reset",
        "click"
    ],
    "socket": {
        "socketIoOptions": {
            "log": false
        },
        "socketIoClientConfig": {
            "reconnectionAttempts": 50
        },
        "path": "/browser-sync/socket.io",
        "clientPath": "/browser-sync",
        "namespace": "/browser-sync",
        "clients": {
            "heartbeatTimeout": 5000
        }
    },
    "tagNames": {
        "less": "link",
        "scss": "link",
        "css": "link",
        "jpg": "img",
        "jpeg": "img",
        "png": "img",
        "svg": "img",
        "gif": "img",
        "js": "script"
    },
    "injectNotification": false
};