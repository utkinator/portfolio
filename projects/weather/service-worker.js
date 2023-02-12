"use strict";
var precacheConfig = [["/portfolio/projects/weather/index.html", "01769035f34266bfc51568db200ff465"], ["/portfolio/projects/weather/static/css/main.33379c7d.css", "2b02b2d42b4f6aa28fc82dde453c868a"], ["/portfolio/projects/weather/static/js/main.bc2588da.js", "296f7f91446d986efff6a585a9546ba2"], ["/portfolio/projects/weather/static/media/clouds.58fa4a2a.png", "58fa4a2a02be189969915805f304a796"], ["/portfolio/projects/weather/static/media/dust.da4b5fdf.png", "da4b5fdf02a5c88cb28bd870510a4144"], ["/portfolio/projects/weather/static/media/fog.8b5e8cef.png", "8b5e8cef3f72d6978f1688f6b32b553f"], ["/portfolio/projects/weather/static/media/hail.63af1bed.png", "63af1bed9e529390563591e0a58559fd"], ["/portfolio/projects/weather/static/media/hot.32831bf7.png", "32831bf7f91f8b4136c54d0b4ac62ca5"], ["/portfolio/projects/weather/static/media/rain.05fe7ffe.png", "05fe7ffe63c4216aa5aa3569c4319851"], ["/portfolio/projects/weather/static/media/snow.82d10435.png", "82d10435d12b27b518214676bbbc090e"], ["/portfolio/projects/weather/static/media/storm.3e588a0b.png", "3e588a0b749e241a7e2ba23088a04301"], ["/portfolio/projects/weather/static/media/sunny.0b797262.png", "0b7972622441fe4985277315d9d9b9bc"], ["/portfolio/projects/weather/static/media/thunderstorm-lightning.0d1b3d6a.png", "0d1b3d6ab4a5347b28a6ca5e09b0872e"], ["/portfolio/projects/weather/static/media/tornado.c6da4fd6.png", "c6da4fd6f280a27adbf822ee61ed8438"], ["/portfolio/projects/weather/static/media/weathericons-regular-webfont.1cd48d78.woff2", "1cd48d78f06d33973d9d761d426e69bf"], ["/portfolio/projects/weather/static/media/weathericons-regular-webfont.4618f0de.ttf", "4618f0de2a818e7ad3fe880e0b74d04a"], ["/portfolio/projects/weather/static/media/weathericons-regular-webfont.4b658767.eot", "4b658767da6bd92ce2addb3ce512784d"], ["/portfolio/projects/weather/static/media/weathericons-regular-webfont.8cac70eb.woff", "8cac70ebda3f23ce472110d9f21e8593"], ["/portfolio/projects/weather/static/media/weathericons-regular-webfont.ecaf8b48.svg", "ecaf8b481729b18f6a8494d9f691cdae"], ["/portfolio/projects/weather/static/media/wind.1ac706af.png", "1ac706afa037fc37f155c2a0d9e28f9b"]],
    cacheName = "sw-precache-v3-sw-precache-webpack-plugin-" + (self.registration ? self.registration.scope : ""),
    ignoreUrlParametersMatching = [/^utm_/], addDirectoryIndex = function (e, t) {
        var a = new URL(e);
        return "/" === a.pathname.slice(-1) && (a.pathname += t), a.toString()
    }, cleanResponse = function (t) {
        return t.redirected ? ("body" in t ? Promise.resolve(t.body) : t.blob()).then(function (e) {
            return new Response(e, {headers: t.headers, status: t.status, statusText: t.statusText})
        }) : Promise.resolve(t)
    }, createCacheKey = function (e, t, a, r) {
        var n = new URL(e);
        return r && n.pathname.match(r) || (n.search += (n.search ? "&" : "") + encodeURIComponent(t) + "=" + encodeURIComponent(a)), n.toString()
    }, isPathWhitelisted = function (e, t) {
        if (0 === e.length) return !0;
        var a = new URL(t).pathname;
        return e.some(function (e) {
            return a.match(e)
        })
    }, stripIgnoredUrlParameters = function (e, a) {
        var t = new URL(e);
        return t.hash = "", t.search = t.search.slice(1).split("&").map(function (e) {
            return e.split("=")
        }).filter(function (t) {
            return a.every(function (e) {
                return !e.test(t[0])
            })
        }).map(function (e) {
            return e.join("=")
        }).join("&"), t.toString()
    }, hashParamName = "_sw-precache", urlsToCacheKeys = new Map(precacheConfig.map(function (e) {
        var t = e[0], a = e[1], r = new URL(t, self.location), n = createCacheKey(r, hashParamName, a, /\.\w{8}\./);
        return [r.toString(), n]
    }));

function setOfCachedUrls(e) {
    return e.keys().then(function (e) {
        return e.map(function (e) {
            return e.url
        })
    }).then(function (e) {
        return new Set(e)
    })
}

self.addEventListener("install", function (e) {
    e.waitUntil(caches.open(cacheName).then(function (r) {
        return setOfCachedUrls(r).then(function (a) {
            return Promise.all(Array.from(urlsToCacheKeys.values()).map(function (t) {
                if (!a.has(t)) {
                    var e = new Request(t, {credentials: "same-origin"});
                    return fetch(e).then(function (e) {
                        if (!e.ok) throw new Error("Request for " + t + " returned a response with status " + e.status);
                        return cleanResponse(e).then(function (e) {
                            return r.put(t, e)
                        })
                    })
                }
            }))
        })
    }).then(function () {
        return self.skipWaiting()
    }))
}), self.addEventListener("activate", function (e) {
    var a = new Set(urlsToCacheKeys.values());
    e.waitUntil(caches.open(cacheName).then(function (t) {
        return t.keys().then(function (e) {
            return Promise.all(e.map(function (e) {
                if (!a.has(e.url)) return t.delete(e)
            }))
        })
    }).then(function () {
        return self.clients.claim()
    }))
}), self.addEventListener("fetch", function (t) {
    if ("GET" === t.request.method) {
        var e, a = stripIgnoredUrlParameters(t.request.url, ignoreUrlParametersMatching), r = "index.html";
        (e = urlsToCacheKeys.has(a)) || (a = addDirectoryIndex(a, r), e = urlsToCacheKeys.has(a));
        var n = "/portfolio/projects/weather/index.html";
        !e && "navigate" === t.request.mode && isPathWhitelisted(["^(?!\\/__).*"], t.request.url) && (a = new URL(n, self.location).toString(), e = urlsToCacheKeys.has(a)), e && t.respondWith(caches.open(cacheName).then(function (e) {
            return e.match(urlsToCacheKeys.get(a)).then(function (e) {
                if (e) return e;
                throw Error("The cached response that was expected is missing.")
            })
        }).catch(function (e) {
            return console.warn('Couldn\'t serve response for "%s" from cache: %O', t.request.url, e), fetch(t.request)
        }))
    }
});
