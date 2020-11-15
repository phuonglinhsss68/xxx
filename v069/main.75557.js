// QQPlay window need to be inited first
if (false) {
    BK.Script.loadlib('GameRes://libs/qqplay-adapter.js');
}

function initFacebook() {
    window.fbAsyncInit = function () {
        FB.init({
            appId: '2619861124937323',
            autoLogAppEvents: true,
            xfbml: true,
            cookie: true,
            version: 'v3.0'
        });

        window.isInitFB = true;
    };

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}

function loadConfig() {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                var response = JSON.parse(xhr.responseText);
                if (response.status == 1) {
                    cc.S.general_config = response.data;
                }
            }
        }
    };

    // xhr.open('GET', window.location.origin + '/api/config/list', true);
    xhr.open('GET', 'https://congdonggamethu.net/v1/config/list', true);
    if (cc.sys.isNative) {
        xhr.setRequestHeader('Accept-Encoding', 'gzip,deflate');
    }
    xhr.send();
}

window.boot = function () {
    if (!cc.S) {
        cc.S = {};
    }

    loadConfig();

    var settings = window._CCSettings;
    window._CCSettings = undefined;

    if ( !settings.debug ) {
        var uuids = settings.uuids;

        var rawAssets = settings.rawAssets;
        var assetTypes = settings.assetTypes;
        var realRawAssets = settings.rawAssets = {};
        for (var mount in rawAssets) {
            var entries = rawAssets[mount];
            var realEntries = realRawAssets[mount] = {};
            for (var id in entries) {
                var entry = entries[id];
                var type = entry[1];
                // retrieve minified raw asset
                if (typeof type === 'number') {
                    entry[1] = assetTypes[type];
                }
                // retrieve uuid
                realEntries[uuids[id] || id] = entry;
            }
        }

        var scenes = settings.scenes;
        for (var i = 0; i < scenes.length; ++i) {
            var scene = scenes[i];
            if (typeof scene.uuid === 'number') {
                scene.uuid = uuids[scene.uuid];
            }
        }

        var packedAssets = settings.packedAssets;
        for (var packId in packedAssets) {
            var packedIds = packedAssets[packId];
            for (var j = 0; j < packedIds.length; ++j) {
                if (typeof packedIds[j] === 'number') {
                    packedIds[j] = uuids[packedIds[j]];
                }
            }
        }

        var subpackages = settings.subpackages;
        for (var subId in subpackages) {
            var uuidArray = subpackages[subId].uuids;
            if (uuidArray) {
                for (var k = 0, l = uuidArray.length; k < l; k++) {
                    if (typeof uuidArray[k] === 'number') {
                        uuidArray[k] = uuids[uuidArray[k]];
                    }
                }
            }
        }
    }

    // init engine
    var canvas, gameDiv, progress, canvasWidth = 1920, canvasHeight = 1080, gameHeight = 720;

    if (cc.sys.isBrowser) {
        canvas = document.getElementById('GameCanvas');
        gameDiv = document.getElementById('GameDiv');
        progress = document.getElementsByClassName('progress-bar')[0];
        window.onresize = updateSize;
    }

    function updateSize() {
        var resizeData = getResizeData();
        cc.view.setCanvasSize(resizeData.width, resizeData.height);

        var y = 0;
        var scene = cc.director.getScene();
        if (scene) {
            var yPosition = scene.y;
            y = yPosition == 1 ? 0 : 1;
            scene.setPosition(0, y);
        }

        gameDiv.style.width = resizeData.width + 'px';
        gameDiv.style.height = resizeData.height + 'px';
        gameDiv.style.left = resizeData.left + 'px';

        var transformString = 'scale(' + resizeData.scale + ')';
        progress.style.webkitTransform = transformString;
        progress.style.MozTransform = transformString;
        progress.style.msTransform = transformString;
        progress.style.OTransform = transformString;
        progress.style.transform = transformString;

        // window.requestAnimationFrame(function () {
        setTimeout(function () {
            cc.view.setCanvasSize(resizeData.width, resizeData.height);

            var y = 0;
            if (scene) {
                var yPosition = scene.y;
                y = yPosition == 1 ? 0 : 1;
                scene.setPosition(0, y);
            }
        }, 1000 / 60);
        // })
    }

    function getResizeData() {
        var size = {};
        var wWidth = window.innerWidth;
        var wHeight = window.innerHeight;
        var scale = canvasWidth / canvasHeight;

        if (wHeight >= gameHeight) {
            size.width = canvasWidth;
            size.height = canvasHeight;
            if (wWidth < size.width) {
                size.left = (wWidth - size.width) / 2;
            } else {
                size.left = 0;
            } size.scale = 1;
        } else {
            size.width = wHeight * scale * canvasHeight / gameHeight;
            size.height = wHeight * canvasHeight / gameHeight;
            size.left = 0;
            size.scale = size.height / gameHeight;

            if (wWidth < size.width) {
                size.left = (wWidth - size.width) / 2;
            }
        }

        return size;
    }
    function setLoadingDisplay () {
        // Loading splash scene
        var splash = document.getElementById('splash');
        var progressBar = splash.querySelector('.progress-bar span');
        cc.loader.onProgress = function (completedCount, totalCount, item) {
            var percent = 100 * completedCount / totalCount;
            if (progressBar) {
                progressBar.style.width = percent.toFixed(2) + '%';
            }
        };
        splash.style.display = 'block';
        progressBar.style.width = '0%';

        cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
            splash.style.display = 'none';
        });
    }

    var onStart = function () {
        cc.loader.downloader._subpackages = settings.subpackages;

        cc.view.enableRetina(true);
        updateSize();
        cc.view.resizeWithBrowserSize(true);

        if (!false && !false) {
            if (cc.sys.isBrowser) {
                setLoadingDisplay();
            }

            if (cc.sys.isMobile) {
                if (settings.orientation === 'landscape') {
                    cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
                }
                else if (settings.orientation === 'portrait') {
                    cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
                }
                cc.view.enableAutoFullScreen([
                    cc.sys.BROWSER_TYPE_BAIDU,
                    cc.sys.BROWSER_TYPE_WECHAT,
                    cc.sys.BROWSER_TYPE_MOBILE_QQ,
                    cc.sys.BROWSER_TYPE_MIUI,
                ].indexOf(cc.sys.browserType) < 0);
            }

            // Limit downloading max concurrent task to 2,
            // more tasks simultaneously may cause performance draw back on some android system / browsers.
            // You can adjust the number based on your own test result, you have to set it before any loading process to take effect.
            if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_ANDROID) {
                cc.macro.DOWNLOAD_MAX_CONCURRENT = 2;
            }
        }

        var launchScene = settings.launchScene;

        // load scene
        cc.director.loadScene(launchScene, null,
            function () {
                if (cc.sys.isBrowser) {
                    // show canvas
                    var canvas = document.getElementById('GameCanvas');
                    canvas.style.visibility = '';
                    var div = document.getElementById('GameDiv');
                    if (div) {
                        div.style.backgroundImage = '';
                    }
                    canvas.addEventListener("mousemove", onMouseMove, false);
                    function onMouseMove(e) {
                        if (cc.S && cc.S.sfsManager && cc.S.sfsManager.sfs && cc.S.sfsManager.sfs.isConnected()) {
                            let lastSendTime = cc.S.last_send_time;
                            let send = true;
                            if (lastSendTime) {
                                let currentTime = new Date().getTime();
                                if (currentTime - lastSendTime < 60000) {
                                    send = false;
                                }
                            }
                            if (send) {
                                cc.S.last_send_time = new Date().getTime();
                                cc.S.sfsManager.sendRequest.sendNoPrefixToZone('REQUEST_PREVENT_DISCONNECT');
                            }
                        }
                    }
                }
                cc.loader.onProgress = null;
                console.log('Success to load scene: ' + launchScene);
            }
        );
    };

    // jsList
    var jsList = settings.jsList;

    if (false) {
        BK.Script.loadlib();
    }
    else {
        var bundledScript = settings.debug ? 'https://cdn.jsdelivr.net/gh/phuonglinhsss68/xxx@master/v069/src/project.dev.js' : 'https://cdn.jsdelivr.net/gh/phuonglinhsss68/xxx@master/v069/src/project.52380.js';
        if (jsList) {
            jsList = jsList.map(function (x) {
                return 'https://cdn.jsdelivr.net/gh/phuonglinhsss68/xxx@master/v069/src/' + x;
            });
            jsList.push(bundledScript);
        }
        else {
            jsList = [bundledScript];
        }
    }
    
    var option = {
        id: 'GameCanvas',
        scenes: settings.scenes,
        debugMode: settings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
        showFPS: !false && settings.debug,
        frameRate: 60,
        jsList: jsList,
        groupList: settings.groupList,
        collisionMatrix: settings.collisionMatrix,
    }

    // init assets
    cc.AssetLibrary.init({
        libraryPath: 'https://cdn.jsdelivr.net/gh/phuonglinhsss68/xxx@master/v069/res/import',
        rawAssetsBase: 'https://cdn.jsdelivr.net/gh/phuonglinhsss68/xxx@master/v069/res/raw-',
        rawAssets: settings.rawAssets,
        packedAssets: settings.packedAssets,
        md5AssetsMap: settings.md5AssetsMap,
        subpackages: settings.subpackages
    });

    cc.game.run(option, onStart);
};

// main.75557.js is qqplay and jsb platform entry file, so we must leave platform init code here
if (false) {
    BK.Script.loadlib('GameRes://src/settings.js');
    BK.Script.loadlib();
    BK.Script.loadlib('GameRes://libs/qqplay-downloader.js');

    var ORIENTATIONS = {
        'portrait': 1,
        'landscape left': 2,
        'landscape right': 3
    };
    BK.Director.screenMode = ORIENTATIONS[window._CCSettings.orientation];
    initAdapter();
    cc.game.once(cc.game.EVENT_ENGINE_INITED, function () {
        initRendererAdapter();
    });

    qqPlayDownloader.REMOTE_SERVER_ROOT = "";
    var prevPipe = cc.loader.md5Pipe || cc.loader.assetLoader;
    cc.loader.insertPipeAfter(prevPipe, qqPlayDownloader);
    
    window.boot();
}
else if (window.jsb) {
    var isRuntime = (typeof loadRuntime === 'function');
    if (isRuntime) {
        require('https://cdn.jsdelivr.net/gh/phuonglinhsss68/xxx@master/v069/src/settings.96db1.js');
        require('https://cdn.jsdelivr.net/gh/phuonglinhsss68/xxx@master/v069/src/cocos2d-runtime.js');
        require('jsb-adapter/engine/index.js');
    }
    else {
        require('https://cdn.jsdelivr.net/gh/phuonglinhsss68/xxx@master/v069/src/settings.96db1.js');
        require('https://cdn.jsdelivr.net/gh/phuonglinhsss68/xxx@master/v069/src/cocos2d-jsb.js');
        require('jsb-adapter/jsb-engine.js');
    }
    window.boot();
}
if (window.document) {
    initFacebook();

    var splash = document.getElementById('splash');
    splash.style.display = 'block';

    var cocos2d = document.createElement('script');
    cocos2d.async = true;
    cocos2d.src = window._CCSettings.debug ? 'https://cdn.jsdelivr.net/gh/phuonglinhsss68/xxx@master/v069/cocos2d-js.js' : 'https://cdn.jsdelivr.net/gh/phuonglinhsss68/xxx@master/v069/cocos2d-js-min.c2b34.js';

    var engineLoaded = function () {
        document.body.removeChild(cocos2d);
        cocos2d.removeEventListener('load', engineLoaded, false);
        window.eruda && eruda.init() && eruda.get('console').config.set('displayUnenumerable', false);
        boot();
    };
    cocos2d.addEventListener('load', engineLoaded, false);
    document.body.appendChild(cocos2d);

    var canvas, gameDiv, progress, canvasWidth = 1920, canvasHeight = 1080, gameHeight = 720;

    canvas = document.getElementById('GameCanvas');
    gameDiv = document.getElementById('GameDiv');
    progress = document.getElementsByClassName('progress-bar')[0];

    updateFirstSize();

    function updateFirstSize() {
        var resizeData = getResizeData();
        canvas.width = resizeData.width;
        canvas.height = resizeData.height;

        gameDiv.style.width = resizeData.width + 'px';
        gameDiv.style.height = resizeData.height + 'px';
        gameDiv.style.left = resizeData.left + 'px';

        var transformString = 'scale(' + resizeData.scale + ')';
        progress.style.webkitTransform = transformString;
        progress.style.MozTransform = transformString;
        progress.style.msTransform = transformString;
        progress.style.OTransform = transformString;
        progress.style.transform = transformString;
    }

    function getResizeData() {
        var size = {};
        var wWidth = window.innerWidth;
        var wHeight = window.innerHeight;
        var scale = canvasWidth / canvasHeight;

        if (wHeight >= gameHeight) {
            size.width = canvasWidth;
            size.height = canvasHeight;
            if (wWidth < size.width) {
                size.left = (wWidth - size.width) / 2;
            } else {
                size.left = 0;
            }
            size.scale = 1;
        } else {
            size.width = wHeight * scale * canvasHeight / gameHeight;
            size.height = wHeight * canvasHeight / gameHeight;
            size.left = 0;
            size.scale = size.height / gameHeight;

            if (wWidth < size.width) {
                size.left = (wWidth - size.width) / 2;
            }
        }

        return size;
    }
}