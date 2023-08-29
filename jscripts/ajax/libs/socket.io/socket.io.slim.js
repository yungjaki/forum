/*!
 * Socket.IO v2.3.0
 * (c) 2014-2019 Guillermo Rauch
 * Released under the MIT License.
 */
!function(t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.io = e() : t.io = e()
}(this, function() {
    return function(t) {
        function e(n) {
            if (r[n])
                return r[n].exports;
            var o = r[n] = {
                exports: {},
                id: n,
                loaded: !1
            };
            return t[n].call(o.exports, o, o.exports, e),
            o.loaded = !0,
            o.exports
        }
        var r = {};
        return e.m = t,
        e.c = r,
        e.p = "",
        e(0)
    }([function(t, e, r) {
        "use strict";
        function n(t, e) {
            "object" === ("undefined" == typeof t ? "undefined" : o(t)) && (e = t,
            t = void 0),
            e = e || {};
            var r, n = i(t), s = n.source, p = n.id, h = n.path, u = c[p] && h in c[p].nsps, f = e.forceNew || e["force new connection"] || !1 === e.multiplex || u;
            return f ? r = a(s, e) : (c[p] || (c[p] = a(s, e)),
            r = c[p]),
            n.query && !e.query && (e.query = n.query),
            r.socket(n.path, e)
        }
        var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
          , i = r(1)
          , s = r(4)
          , a = r(9);
        r(3)("socket.io-client");
        t.exports = e = n;
        var c = e.managers = {};
        e.protocol = s.protocol,
        e.connect = n,
        e.Manager = r(9),
        e.Socket = r(33)
    }
    , function(t, e, r) {
        "use strict";
        function n(t, e) {
            var r = t;
            e = e || "undefined" != typeof location && location,
            null == t && (t = e.protocol + "//" + e.host),
            "string" == typeof t && ("/" === t.charAt(0) && (t = "/" === t.charAt(1) ? e.protocol + t : e.host + t),
            /^(https?|wss?):\/\//.test(t) || (t = "undefined" != typeof e ? e.protocol + "//" + t : "https://" + t),
            r = o(t)),
            r.port || (/^(http|ws)$/.test(r.protocol) ? r.port = "80" : /^(http|ws)s$/.test(r.protocol) && (r.port = "443")),
            r.path = r.path || "/";
            var n = r.host.indexOf(":") !== -1
              , i = n ? "[" + r.host + "]" : r.host;
            return r.id = r.protocol + "://" + i + ":" + r.port,
            r.href = r.protocol + "://" + i + (e && e.port === r.port ? "" : ":" + r.port),
            r
        }
        var o = r(2);
        r(3)("socket.io-client:url");
        t.exports = n
    }
    , function(t, e) {
        var r = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
          , n = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
        t.exports = function(t) {
            var e = t
              , o = t.indexOf("[")
              , i = t.indexOf("]");
            o != -1 && i != -1 && (t = t.substring(0, o) + t.substring(o, i).replace(/:/g, ";") + t.substring(i, t.length));
            for (var s = r.exec(t || ""), a = {}, c = 14; c--; )
                a[n[c]] = s[c] || "";
            return o != -1 && i != -1 && (a.source = e,
            a.host = a.host.substring(1, a.host.length - 1).replace(/;/g, ":"),
            a.authority = a.authority.replace("[", "").replace("]", "").replace(/;/g, ":"),
            a.ipv6uri = !0),
            a
        }
    }
    , function(t, e) {
        "use strict";
        t.exports = function() {
            return function() {}
        }
    }
    , function(t, e, r) {
        function n() {}
        function o(t) {
            var r = "" + t.type;
            if (e.BINARY_EVENT !== t.type && e.BINARY_ACK !== t.type || (r += t.attachments + "-"),
            t.nsp && "/" !== t.nsp && (r += t.nsp + ","),
            null != t.id && (r += t.id),
            null != t.data) {
                var n = i(t.data);
                if (n === !1)
                    return m;
                r += n
            }
            return r
        }
        function i(t) {
            try {
                return JSON.stringify(t)
            } catch (t) {
                return !1
            }
        }
        function s(t, e) {
            function r(t) {
                var r = l.deconstructPacket(t)
                  , n = o(r.packet)
                  , i = r.buffers;
                i.unshift(n),
                e(i)
            }
            l.removeBlobs(t, r)
        }
        function a() {
            this.reconstructor = null
        }
        function c(t) {
            var r = 0
              , n = {
                type: Number(t.charAt(0))
            };
            if (null == e.types[n.type])
                return u("unknown packet type " + n.type);
            if (e.BINARY_EVENT === n.type || e.BINARY_ACK === n.type) {
                for (var o = ""; "-" !== t.charAt(++r) && (o += t.charAt(r),
                r != t.length); )
                    ;
                if (o != Number(o) || "-" !== t.charAt(r))
                    throw new Error("Illegal attachments");
                n.attachments = Number(o)
            }
            if ("/" === t.charAt(r + 1))
                for (n.nsp = ""; ++r; ) {
                    var i = t.charAt(r);
                    if ("," === i)
                        break;
                    if (n.nsp += i,
                    r === t.length)
                        break
                }
            else
                n.nsp = "/";
            var s = t.charAt(r + 1);
            if ("" !== s && Number(s) == s) {
                for (n.id = ""; ++r; ) {
                    var i = t.charAt(r);
                    if (null == i || Number(i) != i) {
                        --r;
                        break
                    }
                    if (n.id += t.charAt(r),
                    r === t.length)
                        break
                }
                n.id = Number(n.id)
            }
            if (t.charAt(++r)) {
                var a = p(t.substr(r))
                  , c = a !== !1 && (n.type === e.ERROR || d(a));
                if (!c)
                    return u("invalid payload");
                n.data = a
            }
            return n
        }
        function p(t) {
            try {
                return JSON.parse(t)
            } catch (t) {
                return !1
            }
        }
        function h(t) {
            this.reconPack = t,
            this.buffers = []
        }
        function u(t) {
            return {
                type: e.ERROR,
                data: "parser error: " + t
            }
        }
        var f = (r(3)("socket.io-parser"),
        r(5))
          , l = r(6)
          , d = r(7)
          , y = r(8);
        e.protocol = 4,
        e.types = ["CONNECT", "DISCONNECT", "EVENT", "ACK", "ERROR", "BINARY_EVENT", "BINARY_ACK"],
        e.CONNECT = 0,
        e.DISCONNECT = 1,
        e.EVENT = 2,
        e.ACK = 3,
        e.ERROR = 4,
        e.BINARY_EVENT = 5,
        e.BINARY_ACK = 6,
        e.Encoder = n,
        e.Decoder = a;
        var m = e.ERROR + '"encode error"';
        n.prototype.encode = function(t, r) {
            if (e.BINARY_EVENT === t.type || e.BINARY_ACK === t.type)
                s(t, r);
            else {
                var n = o(t);
                r([n])
            }
        }
        ,
        f(a.prototype),
        a.prototype.add = function(t) {
            var r;
            if ("string" == typeof t)
                r = c(t),
                e.BINARY_EVENT === r.type || e.BINARY_ACK === r.type ? (this.reconstructor = new h(r),
                0 === this.reconstructor.reconPack.attachments && this.emit("decoded", r)) : this.emit("decoded", r);
            else {
                if (!y(t) && !t.base64)
                    throw new Error("Unknown type: " + t);
                if (!this.reconstructor)
                    throw new Error("got binary data when not reconstructing a packet");
                r = this.reconstructor.takeBinaryData(t),
                r && (this.reconstructor = null,
                this.emit("decoded", r))
            }
        }
        ,
        a.prototype.destroy = function() {
            this.reconstructor && this.reconstructor.finishedReconstruction()
        }
        ,
        h.prototype.takeBinaryData = function(t) {
            if (this.buffers.push(t),
            this.buffers.length === this.reconPack.attachments) {
                var e = l.reconstructPacket(this.reconPack, this.buffers);
                return this.finishedReconstruction(),
                e
            }
            return null
        }
        ,
        h.prototype.finishedReconstruction = function() {
            this.reconPack = null,
            this.buffers = []
        }
    }
    , function(t, e, r) {
        function n(t) {
            if (t)
                return o(t)
        }
        function o(t) {
            for (var e in n.prototype)
                t[e] = n.prototype[e];
            return t
        }
        t.exports = n,
        n.prototype.on = n.prototype.addEventListener = function(t, e) {
            return this._callbacks = this._callbacks || {},
            (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e),
            this
        }
        ,
        n.prototype.once = function(t, e) {
            function r() {
                this.off(t, r),
                e.apply(this, arguments)
            }
            return r.fn = e,
            this.on(t, r),
            this
        }
        ,
        n.prototype.off = n.prototype.removeListener = n.prototype.removeAllListeners = n.prototype.removeEventListener = function(t, e) {
            if (this._callbacks = this._callbacks || {},
            0 == arguments.length)
                return this._callbacks = {},
                this;
            var r = this._callbacks["$" + t];
            if (!r)
                return this;
            if (1 == arguments.length)
                return delete this._callbacks["$" + t],
                this;
            for (var n, o = 0; o < r.length; o++)
                if (n = r[o],
                n === e || n.fn === e) {
                    r.splice(o, 1);
                    break
                }
            return this
        }
        ,
        n.prototype.emit = function(t) {
            this._callbacks = this._callbacks || {};
            var e = [].slice.call(arguments, 1)
              , r = this._callbacks["$" + t];
            if (r) {
                r = r.slice(0);
                for (var n = 0, o = r.length; n < o; ++n)
                    r[n].apply(this, e)
            }
            return this
        }
        ,
        n.prototype.listeners = function(t) {
            return this._callbacks = this._callbacks || {},
            this._callbacks["$" + t] || []
        }
        ,
        n.prototype.hasListeners = function(t) {
            return !!this.listeners(t).length
        }
    }
    , function(t, e, r) {
        function n(t, e) {
            if (!t)
                return t;
            if (s(t)) {
                var r = {
                    _placeholder: !0,
                    num: e.length
                };
                return e.push(t),
                r
            }
            if (i(t)) {
                for (var o = new Array(t.length), a = 0; a < t.length; a++)
                    o[a] = n(t[a], e);
                return o
            }
            if ("object" == typeof t && !(t instanceof Date)) {
                var o = {};
                for (var c in t)
                    o[c] = n(t[c], e);
                return o
            }
            return t
        }
        function o(t, e) {
            if (!t)
                return t;
            if (t && t._placeholder)
                return e[t.num];
            if (i(t))
                for (var r = 0; r < t.length; r++)
                    t[r] = o(t[r], e);
            else if ("object" == typeof t)
                for (var n in t)
                    t[n] = o(t[n], e);
            return t
        }
        var i = r(7)
          , s = r(8)
          , a = Object.prototype.toString
          , c = "function" == typeof Blob || "undefined" != typeof Blob && "[object BlobConstructor]" === a.call(Blob)
          , p = "function" == typeof File || "undefined" != typeof File && "[object FileConstructor]" === a.call(File);
        e.deconstructPacket = function(t) {
            var e = []
              , r = t.data
              , o = t;
            return o.data = n(r, e),
            o.attachments = e.length,
            {
                packet: o,
                buffers: e
            }
        }
        ,
        e.reconstructPacket = function(t, e) {
            return t.data = o(t.data, e),
            t.attachments = void 0,
            t
        }
        ,
        e.removeBlobs = function(t, e) {
            function r(t, a, h) {
                if (!t)
                    return t;
                if (c && t instanceof Blob || p && t instanceof File) {
                    n++;
                    var u = new FileReader;
                    u.onload = function() {
                        h ? h[a] = this.result : o = this.result,
                        --n || e(o)
                    }
                    ,
                    u.readAsArrayBuffer(t)
                } else if (i(t))
                    for (var f = 0; f < t.length; f++)
                        r(t[f], f, t);
                else if ("object" == typeof t && !s(t))
                    for (var l in t)
                        r(t[l], l, t)
            }
            var n = 0
              , o = t;
            r(o),
            n || e(o)
        }
    }
    , function(t, e) {
        var r = {}.toString;
        t.exports = Array.isArray || function(t) {
            return "[object Array]" == r.call(t)
        }
    }
    , function(t, e) {
        function r(t) {
            return n && Buffer.isBuffer(t) || o && (t instanceof ArrayBuffer || i(t))
        }
        t.exports = r;
        var n = "function" == typeof Buffer && "function" == typeof Buffer.isBuffer
          , o = "function" == typeof ArrayBuffer
          , i = function(t) {
            return "function" == typeof ArrayBuffer.isView ? ArrayBuffer.isView(t) : t.buffer instanceof ArrayBuffer
        }
    }
    , function(t, e, r) {
        "use strict";
        function n(t, e) {
            if (!(this instanceof n))
                return new n(t,e);
            t && "object" === ("undefined" == typeof t ? "undefined" : o(t)) && (e = t,
            t = void 0),
            e = e || {},
            e.path = e.path || "/socket.io",
            this.nsps = {},
            this.subs = [],
            this.opts = e,
            this.reconnection(e.reconnection !== !1),
            this.reconnectionAttempts(e.reconnectionAttempts || 1 / 0),
            this.reconnectionDelay(e.reconnectionDelay || 1e3),
            this.reconnectionDelayMax(e.reconnectionDelayMax || 5e3),
            this.randomizationFactor(e.randomizationFactor || .5),
            this.backoff = new f({
                min: this.reconnectionDelay(),
                max: this.reconnectionDelayMax(),
                jitter: this.randomizationFactor()
            }),
            this.timeout(null == e.timeout ? 2e4 : e.timeout),
            this.readyState = "closed",
            this.uri = t,
            this.connecting = [],
            this.lastPing = null,
            this.encoding = !1,
            this.packetBuffer = [];
            var r = e.parser || c;
            this.encoder = new r.Encoder,
            this.decoder = new r.Decoder,
            this.autoConnect = e.autoConnect !== !1,
            this.autoConnect && this.open()
        }
        var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
          , i = r(10)
          , s = r(33)
          , a = r(5)
          , c = r(4)
          , p = r(35)
          , h = r(36)
          , u = (r(3)("socket.io-client:manager"),
        r(32))
          , f = r(37)
          , l = Object.prototype.hasOwnProperty;
        t.exports = n,
        n.prototype.emitAll = function() {
            this.emit.apply(this, arguments);
            for (var t in this.nsps)
                l.call(this.nsps, t) && this.nsps[t].emit.apply(this.nsps[t], arguments)
        }
        ,
        n.prototype.updateSocketIds = function() {
            for (var t in this.nsps)
                l.call(this.nsps, t) && (this.nsps[t].id = this.generateId(t))
        }
        ,
        n.prototype.generateId = function(t) {
            return ("/" === t ? "" : t + "#") + this.engine.id
        }
        ,
        a(n.prototype),
        n.prototype.reconnection = function(t) {
            return arguments.length ? (this._reconnection = !!t,
            this) : this._reconnection
        }
        ,
        n.prototype.reconnectionAttempts = function(t) {
            return arguments.length ? (this._reconnectionAttempts = t,
            this) : this._reconnectionAttempts
        }
        ,
        n.prototype.reconnectionDelay = function(t) {
            return arguments.length ? (this._reconnectionDelay = t,
            this.backoff && this.backoff.setMin(t),
            this) : this._reconnectionDelay
        }
        ,
        n.prototype.randomizationFactor = function(t) {
            return arguments.length ? (this._randomizationFactor = t,
            this.backoff && this.backoff.setJitter(t),
            this) : this._randomizationFactor
        }
        ,
        n.prototype.reconnectionDelayMax = function(t) {
            return arguments.length ? (this._reconnectionDelayMax = t,
            this.backoff && this.backoff.setMax(t),
            this) : this._reconnectionDelayMax
        }
        ,
        n.prototype.timeout = function(t) {
            return arguments.length ? (this._timeout = t,
            this) : this._timeout
        }
        ,
        n.prototype.maybeReconnectOnOpen = function() {
            !this.reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect()
        }
        ,
        n.prototype.open = n.prototype.connect = function(t, e) {
            if (~this.readyState.indexOf("open"))
                return this;
            this.engine = i(this.uri, this.opts);
            var r = this.engine
              , n = this;
            this.readyState = "opening",
            this.skipReconnect = !1;
            var o = p(r, "open", function() {
                n.onopen(),
                t && t()
            })
              , s = p(r, "error", function(e) {
                if (n.cleanup(),
                n.readyState = "closed",
                n.emitAll("connect_error", e),
                t) {
                    var r = new Error("Connection error");
                    r.data = e,
                    t(r)
                } else
                    n.maybeReconnectOnOpen()
            });
            if (!1 !== this._timeout) {
                var a = this._timeout
                  , c = setTimeout(function() {
                    o.destroy(),
                    r.close(),
                    r.emit("error", "timeout"),
                    n.emitAll("connect_timeout", a)
                }, a);
                this.subs.push({
                    destroy: function() {
                        clearTimeout(c)
                    }
                })
            }
            return this.subs.push(o),
            this.subs.push(s),
            this
        }
        ,
        n.prototype.onopen = function() {
            this.cleanup(),
            this.readyState = "open",
            this.emit("open");
            var t = this.engine;
            this.subs.push(p(t, "data", h(this, "ondata"))),
            this.subs.push(p(t, "ping", h(this, "onping"))),
            this.subs.push(p(t, "pong", h(this, "onpong"))),
            this.subs.push(p(t, "error", h(this, "onerror"))),
            this.subs.push(p(t, "close", h(this, "onclose"))),
            this.subs.push(p(this.decoder, "decoded", h(this, "ondecoded")))
        }
        ,
        n.prototype.onping = function() {
            this.lastPing = new Date,
            this.emitAll("ping")
        }
        ,
        n.prototype.onpong = function() {
            this.emitAll("pong", new Date - this.lastPing)
        }
        ,
        n.prototype.ondata = function(t) {
            this.decoder.add(t)
        }
        ,
        n.prototype.ondecoded = function(t) {
            this.emit("packet", t)
        }
        ,
        n.prototype.onerror = function(t) {
            this.emitAll("error", t)
        }
        ,
        n.prototype.socket = function(t, e) {
            function r() {
                ~u(o.connecting, n) || o.connecting.push(n)
            }
            var n = this.nsps[t];
            if (!n) {
                n = new s(this,t,e),
                this.nsps[t] = n;
                var o = this;
                n.on("connecting", r),
                n.on("connect", function() {
                    n.id = o.generateId(t)
                }),
                this.autoConnect && r()
            }
            return n
        }
        ,
        n.prototype.destroy = function(t) {
            var e = u(this.connecting, t);
            ~e && this.connecting.splice(e, 1),
            this.connecting.length || this.close()
        }
        ,
        n.prototype.packet = function(t) {
            var e = this;
            t.query && 0 === t.type && (t.nsp += "?" + t.query),
            e.encoding ? e.packetBuffer.push(t) : (e.encoding = !0,
            this.encoder.encode(t, function(r) {
                for (var n = 0; n < r.length; n++)
                    e.engine.write(r[n], t.options);
                e.encoding = !1,
                e.processPacketQueue()
            }))
        }
        ,
        n.prototype.processPacketQueue = function() {
            if (this.packetBuffer.length > 0 && !this.encoding) {
                var t = this.packetBuffer.shift();
                this.packet(t)
            }
        }
        ,
        n.prototype.cleanup = function() {
            for (var t = this.subs.length, e = 0; e < t; e++) {
                var r = this.subs.shift();
                r.destroy()
            }
            this.packetBuffer = [],
            this.encoding = !1,
            this.lastPing = null,
            this.decoder.destroy()
        }
        ,
        n.prototype.close = n.prototype.disconnect = function() {
            this.skipReconnect = !0,
            this.reconnecting = !1,
            "opening" === this.readyState && this.cleanup(),
            this.backoff.reset(),
            this.readyState = "closed",
            this.engine && this.engine.close()
        }
        ,
        n.prototype.onclose = function(t) {
            this.cleanup(),
            this.backoff.reset(),
            this.readyState = "closed",
            this.emit("close", t),
            this._reconnection && !this.skipReconnect && this.reconnect()
        }
        ,
        n.prototype.reconnect = function() {
            if (this.reconnecting || this.skipReconnect)
                return this;
            var t = this;
            if (this.backoff.attempts >= this._reconnectionAttempts)
                this.backoff.reset(),
                this.emitAll("reconnect_failed"),
                this.reconnecting = !1;
            else {
                var e = this.backoff.duration();
                this.reconnecting = !0;
                var r = setTimeout(function() {
                    t.skipReconnect || (t.emitAll("reconnect_attempt", t.backoff.attempts),
                    t.emitAll("reconnecting", t.backoff.attempts),
                    t.skipReconnect || t.open(function(e) {
                        e ? (t.reconnecting = !1,
                        t.reconnect(),
                        t.emitAll("reconnect_error", e.data)) : t.onreconnect()
                    }))
                }, e);
                this.subs.push({
                    destroy: function() {
                        clearTimeout(r)
                    }
                })
            }
        }
        ,
        n.prototype.onreconnect = function() {
            var t = this.backoff.attempts;
            this.reconnecting = !1,
            this.backoff.reset(),
            this.updateSocketIds(),
            this.emitAll("reconnect", t)
        }
    }
    , function(t, e, r) {
        t.exports = r(11),
        t.exports.parser = r(18)
    }
    , function(t, e, r) {
        function n(t, e) {
            return this instanceof n ? (e = e || {},
            t && "object" == typeof t && (e = t,
            t = null),
            t ? (t = p(t),
            e.hostname = t.host,
            e.secure = "https" === t.protocol || "wss" === t.protocol,
            e.port = t.port,
            t.query && (e.query = t.query)) : e.host && (e.hostname = p(e.host).host),
            this.secure = null != e.secure ? e.secure : "undefined" != typeof location && "https:" === location.protocol,
            e.hostname && !e.port && (e.port = this.secure ? "443" : "80"),
            this.agent = e.agent || !1,
            this.hostname = e.hostname || ("undefined" != typeof location ? location.hostname : "localhost"),
            this.port = e.port || ("undefined" != typeof location && location.port ? location.port : this.secure ? 443 : 80),
            this.query = e.query || {},
            "string" == typeof this.query && (this.query = h.decode(this.query)),
            this.upgrade = !1 !== e.upgrade,
            this.path = (e.path || "/engine.io").replace(/\/$/, "") + "/",
            this.forceJSONP = !!e.forceJSONP,
            this.jsonp = !1 !== e.jsonp,
            this.forceBase64 = !!e.forceBase64,
            this.enablesXDR = !!e.enablesXDR,
            this.withCredentials = !1 !== e.withCredentials,
            this.timestampParam = e.timestampParam || "t",
            this.timestampRequests = e.timestampRequests,
            this.transports = e.transports || ["polling", "websocket"],
            this.transportOptions = e.transportOptions || {},
            this.readyState = "",
            this.writeBuffer = [],
            this.prevBufferLen = 0,
            this.policyPort = e.policyPort || 843,
            this.rememberUpgrade = e.rememberUpgrade || !1,
            this.binaryType = null,
            this.onlyBinaryUpgrades = e.onlyBinaryUpgrades,
            this.perMessageDeflate = !1 !== e.perMessageDeflate && (e.perMessageDeflate || {}),
            !0 === this.perMessageDeflate && (this.perMessageDeflate = {}),
            this.perMessageDeflate && null == this.perMessageDeflate.threshold && (this.perMessageDeflate.threshold = 1024),
            this.pfx = e.pfx || null,
            this.key = e.key || null,
            this.passphrase = e.passphrase || null,
            this.cert = e.cert || null,
            this.ca = e.ca || null,
            this.ciphers = e.ciphers || null,
            this.rejectUnauthorized = void 0 === e.rejectUnauthorized || e.rejectUnauthorized,
            this.forceNode = !!e.forceNode,
            this.isReactNative = "undefined" != typeof navigator && "string" == typeof navigator.product && "reactnative" === navigator.product.toLowerCase(),
            ("undefined" == typeof self || this.isReactNative) && (e.extraHeaders && Object.keys(e.extraHeaders).length > 0 && (this.extraHeaders = e.extraHeaders),
            e.localAddress && (this.localAddress = e.localAddress)),
            this.id = null,
            this.upgrades = null,
            this.pingInterval = null,
            this.pingTimeout = null,
            this.pingIntervalTimer = null,
            this.pingTimeoutTimer = null,
            void this.open()) : new n(t,e)
        }
        function o(t) {
            var e = {};
            for (var r in t)
                t.hasOwnProperty(r) && (e[r] = t[r]);
            return e
        }
        var i = r(12)
          , s = r(5)
          , a = (r(3)("engine.io-client:socket"),
        r(32))
          , c = r(18)
          , p = r(2)
          , h = r(26);
        t.exports = n,
        n.priorWebsocketSuccess = !1,
        s(n.prototype),
        n.protocol = c.protocol,
        n.Socket = n,
        n.Transport = r(17),
        n.transports = r(12),
        n.parser = r(18),
        n.prototype.createTransport = function(t) {
            var e = o(this.query);
            e.EIO = c.protocol,
            e.transport = t;
            var r = this.transportOptions[t] || {};
            this.id && (e.sid = this.id);
            var n = new i[t]({
                query: e,
                socket: this,
                agent: r.agent || this.agent,
                hostname: r.hostname || this.hostname,
                port: r.port || this.port,
                secure: r.secure || this.secure,
                path: r.path || this.path,
                forceJSONP: r.forceJSONP || this.forceJSONP,
                jsonp: r.jsonp || this.jsonp,
                forceBase64: r.forceBase64 || this.forceBase64,
                enablesXDR: r.enablesXDR || this.enablesXDR,
                withCredentials: r.withCredentials || this.withCredentials,
                timestampRequests: r.timestampRequests || this.timestampRequests,
                timestampParam: r.timestampParam || this.timestampParam,
                policyPort: r.policyPort || this.policyPort,
                pfx: r.pfx || this.pfx,
                key: r.key || this.key,
                passphrase: r.passphrase || this.passphrase,
                cert: r.cert || this.cert,
                ca: r.ca || this.ca,
                ciphers: r.ciphers || this.ciphers,
                rejectUnauthorized: r.rejectUnauthorized || this.rejectUnauthorized,
                perMessageDeflate: r.perMessageDeflate || this.perMessageDeflate,
                extraHeaders: r.extraHeaders || this.extraHeaders,
                forceNode: r.forceNode || this.forceNode,
                localAddress: r.localAddress || this.localAddress,
                requestTimeout: r.requestTimeout || this.requestTimeout,
                protocols: r.protocols || void 0,
                isReactNative: this.isReactNative
            });
            return n
        }
        ,
        n.prototype.open = function() {
            var t;
            if (this.rememberUpgrade && n.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1)
                t = "websocket";
            else {
                if (0 === this.transports.length) {
                    var e = this;
                    return void setTimeout(function() {
                        e.emit("error", "No transports available")
                    }, 0)
                }
                t = this.transports[0]
            }
            this.readyState = "opening";
            try {
                t = this.createTransport(t)
            } catch (t) {
                return this.transports.shift(),
                void this.open()
            }
            t.open(),
            this.setTransport(t)
        }
        ,
        n.prototype.setTransport = function(t) {
            var e = this;
            this.transport && this.transport.removeAllListeners(),
            this.transport = t,
            t.on("drain", function() {
                e.onDrain()
            }).on("packet", function(t) {
                e.onPacket(t)
            }).on("error", function(t) {
                e.onError(t)
            }).on("close", function() {
                e.onClose("transport close")
            })
        }
        ,
        n.prototype.probe = function(t) {
            function e() {
                if (u.onlyBinaryUpgrades) {
                    var t = !this.supportsBinary && u.transport.supportsBinary;
                    h = h || t
                }
                h || (p.send([{
                    type: "ping",
                    data: "probe"
                }]),
                p.once("packet", function(t) {
                    if (!h)
                        if ("pong" === t.type && "probe" === t.data) {
                            if (u.upgrading = !0,
                            u.emit("upgrading", p),
                            !p)
                                return;
                            n.priorWebsocketSuccess = "websocket" === p.name,
                            u.transport.pause(function() {
                                h || "closed" !== u.readyState && (c(),
                                u.setTransport(p),
                                p.send([{
                                    type: "upgrade"
                                }]),
                                u.emit("upgrade", p),
                                p = null,
                                u.upgrading = !1,
                                u.flush())
                            })
                        } else {
                            var e = new Error("probe error");
                            e.transport = p.name,
                            u.emit("upgradeError", e)
                        }
                }))
            }
            function r() {
                h || (h = !0,
                c(),
                p.close(),
                p = null)
            }
            function o(t) {
                var e = new Error("probe error: " + t);
                e.transport = p.name,
                r(),
                u.emit("upgradeError", e)
            }
            function i() {
                o("transport closed")
            }
            function s() {
                o("socket closed")
            }
            function a(t) {
                p && t.name !== p.name && r()
            }
            function c() {
                p.removeListener("open", e),
                p.removeListener("error", o),
                p.removeListener("close", i),
                u.removeListener("close", s),
                u.removeListener("upgrading", a)
            }
            var p = this.createTransport(t, {
                probe: 1
            })
              , h = !1
              , u = this;
            n.priorWebsocketSuccess = !1,
            p.once("open", e),
            p.once("error", o),
            p.once("close", i),
            this.once("close", s),
            this.once("upgrading", a),
            p.open()
        }
        ,
        n.prototype.onOpen = function() {
            if (this.readyState = "open",
            n.priorWebsocketSuccess = "websocket" === this.transport.name,
            this.emit("open"),
            this.flush(),
            "open" === this.readyState && this.upgrade && this.transport.pause)
                for (var t = 0, e = this.upgrades.length; t < e; t++)
                    this.probe(this.upgrades[t])
        }
        ,
        n.prototype.onPacket = function(t) {
            if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState)
                switch (this.emit("packet", t),
                this.emit("heartbeat"),
                t.type) {
                case "open":
                    this.onHandshake(JSON.parse(t.data));
                    break;
                case "pong":
                    this.setPing(),
                    this.emit("pong");
                    break;
                case "error":
                    var e = new Error("server error");
                    e.code = t.data,
                    this.onError(e);
                    break;
                case "message":
                    this.emit("data", t.data),
                    this.emit("message", t.data)
                }
        }
        ,
        n.prototype.onHandshake = function(t) {
            this.emit("handshake", t),
            this.id = t.sid,
            this.transport.query.sid = t.sid,
            this.upgrades = this.filterUpgrades(t.upgrades),
            this.pingInterval = t.pingInterval,
            this.pingTimeout = t.pingTimeout,
            this.onOpen(),
            "closed" !== this.readyState && (this.setPing(),
            this.removeListener("heartbeat", this.onHeartbeat),
            this.on("heartbeat", this.onHeartbeat))
        }
        ,
        n.prototype.onHeartbeat = function(t) {
            clearTimeout(this.pingTimeoutTimer);
            var e = this;
            e.pingTimeoutTimer = setTimeout(function() {
                "closed" !== e.readyState && e.onClose("ping timeout")
            }, t || e.pingInterval + e.pingTimeout)
        }
        ,
        n.prototype.setPing = function() {
            var t = this;
            clearTimeout(t.pingIntervalTimer),
            t.pingIntervalTimer = setTimeout(function() {
                t.ping(),
                t.onHeartbeat(t.pingTimeout)
            }, t.pingInterval)
        }
        ,
        n.prototype.ping = function() {
            var t = this;
            this.sendPacket("ping", function() {
                t.emit("ping")
            })
        }
        ,
        n.prototype.onDrain = function() {
            this.writeBuffer.splice(0, this.prevBufferLen),
            this.prevBufferLen = 0,
            0 === this.writeBuffer.length ? this.emit("drain") : this.flush()
        }
        ,
        n.prototype.flush = function() {
            "closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (this.transport.send(this.writeBuffer),
            this.prevBufferLen = this.writeBuffer.length,
            this.emit("flush"))
        }
        ,
        n.prototype.write = n.prototype.send = function(t, e, r) {
            return this.sendPacket("message", t, e, r),
            this
        }
        ,
        n.prototype.sendPacket = function(t, e, r, n) {
            if ("function" == typeof e && (n = e,
            e = void 0),
            "function" == typeof r && (n = r,
            r = null),
            "closing" !== this.readyState && "closed" !== this.readyState) {
                r = r || {},
                r.compress = !1 !== r.compress;
                var o = {
                    type: t,
                    data: e,
                    options: r
                };
                this.emit("packetCreate", o),
                this.writeBuffer.push(o),
                n && this.once("flush", n),
                this.flush()
            }
        }
        ,
        n.prototype.close = function() {
            function t() {
                n.onClose("forced close"),
                n.transport.close()
            }
            function e() {
                n.removeListener("upgrade", e),
                n.removeListener("upgradeError", e),
                t()
            }
            function r() {
                n.once("upgrade", e),
                n.once("upgradeError", e)
            }
            if ("opening" === this.readyState || "open" === this.readyState) {
                this.readyState = "closing";
                var n = this;
                this.writeBuffer.length ? this.once("drain", function() {
                    this.upgrading ? r() : t()
                }) : this.upgrading ? r() : t()
            }
            return this
        }
        ,
        n.prototype.onError = function(t) {
            n.priorWebsocketSuccess = !1,
            this.emit("error", t),
            this.onClose("transport error", t)
        }
        ,
        n.prototype.onClose = function(t, e) {
            if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
                var r = this;
                clearTimeout(this.pingIntervalTimer),
                clearTimeout(this.pingTimeoutTimer),
                this.transport.removeAllListeners("close"),
                this.transport.close(),
                this.transport.removeAllListeners(),
                this.readyState = "closed",
                this.id = null,
                this.emit("close", t, e),
                r.writeBuffer = [],
                r.prevBufferLen = 0
            }
        }
        ,
        n.prototype.filterUpgrades = function(t) {
            for (var e = [], r = 0, n = t.length; r < n; r++)
                ~a(this.transports, t[r]) && e.push(t[r]);
            return e
        }
    }
    , function(t, e, r) {
        function n(t) {
            var e, r = !1, n = !1, a = !1 !== t.jsonp;
            if ("undefined" != typeof location) {
                var c = "https:" === location.protocol
                  , p = location.port;
                p || (p = c ? 443 : 80),
                r = t.hostname !== location.hostname || p !== t.port,
                n = t.secure !== c
            }
            if (t.xdomain = r,
            t.xscheme = n,
            e = new o(t),
            "open"in e && !t.forceJSONP)
                return new i(t);
            if (!a)
                throw new Error("JSONP disabled");
            return new s(t)
        }
        var o = r(13)
          , i = r(15)
          , s = r(29)
          , a = r(30);
        e.polling = n,
        e.websocket = a
    }
    , function(t, e, r) {
        var n = r(14);
        t.exports = function(t) {
            var e = t.xdomain
              , r = t.xscheme
              , o = t.enablesXDR;
            try {
                if ("undefined" != typeof XMLHttpRequest && (!e || n))
                    return new XMLHttpRequest
            } catch (t) {}
            try {
                if ("undefined" != typeof XDomainRequest && !r && o)
                    return new XDomainRequest
            } catch (t) {}
            if (!e)
                try {
                    return new (self[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")
                } catch (t) {}
        }
    }
    , function(t, e) {
        try {
            t.exports = "undefined" != typeof XMLHttpRequest && "withCredentials"in new XMLHttpRequest
        } catch (e) {
            t.exports = !1
        }
    }
    , function(t, e, r) {
        function n() {}
        function o(t) {
            if (c.call(this, t),
            this.requestTimeout = t.requestTimeout,
            this.extraHeaders = t.extraHeaders,
            "undefined" != typeof location) {
                var e = "https:" === location.protocol
                  , r = location.port;
                r || (r = e ? 443 : 80),
                this.xd = "undefined" != typeof location && t.hostname !== location.hostname || r !== t.port,
                this.xs = t.secure !== e
            }
        }
        function i(t) {
            this.method = t.method || "GET",
            this.uri = t.uri,
            this.xd = !!t.xd,
            this.xs = !!t.xs,
            this.async = !1 !== t.async,
            this.data = void 0 !== t.data ? t.data : null,
            this.agent = t.agent,
            this.isBinary = t.isBinary,
            this.supportsBinary = t.supportsBinary,
            this.enablesXDR = t.enablesXDR,
            this.withCredentials = t.withCredentials,
            this.requestTimeout = t.requestTimeout,
            this.pfx = t.pfx,
            this.key = t.key,
            this.passphrase = t.passphrase,
            this.cert = t.cert,
            this.ca = t.ca,
            this.ciphers = t.ciphers,
            this.rejectUnauthorized = t.rejectUnauthorized,
            this.extraHeaders = t.extraHeaders,
            this.create()
        }
        function s() {
            for (var t in i.requests)
                i.requests.hasOwnProperty(t) && i.requests[t].abort()
        }
        var a = r(13)
          , c = r(16)
          , p = r(5)
          , h = r(27);
        r(3)("engine.io-client:polling-xhr");
        if (t.exports = o,
        t.exports.Request = i,
        h(o, c),
        o.prototype.supportsBinary = !0,
        o.prototype.request = function(t) {
            return t = t || {},
            t.uri = this.uri(),
            t.xd = this.xd,
            t.xs = this.xs,
            t.agent = this.agent || !1,
            t.supportsBinary = this.supportsBinary,
            t.enablesXDR = this.enablesXDR,
            t.withCredentials = this.withCredentials,
            t.pfx = this.pfx,
            t.key = this.key,
            t.passphrase = this.passphrase,
            t.cert = this.cert,
            t.ca = this.ca,
            t.ciphers = this.ciphers,
            t.rejectUnauthorized = this.rejectUnauthorized,
            t.requestTimeout = this.requestTimeout,
            t.extraHeaders = this.extraHeaders,
            new i(t)
        }
        ,
        o.prototype.doWrite = function(t, e) {
            var r = "string" != typeof t && void 0 !== t
              , n = this.request({
                method: "POST",
                data: t,
                isBinary: r
            })
              , o = this;
            n.on("success", e),
            n.on("error", function(t) {
                o.onError("xhr post error", t)
            }),
            this.sendXhr = n
        }
        ,
        o.prototype.doPoll = function() {
            var t = this.request()
              , e = this;
            t.on("data", function(t) {
                e.onData(t)
            }),
            t.on("error", function(t) {
                e.onError("xhr poll error", t)
            }),
            this.pollXhr = t
        }
        ,
        p(i.prototype),
        i.prototype.create = function() {
            var t = {
                agent: this.agent,
                xdomain: this.xd,
                xscheme: this.xs,
                enablesXDR: this.enablesXDR
            };
            t.pfx = this.pfx,
            t.key = this.key,
            t.passphrase = this.passphrase,
            t.cert = this.cert,
            t.ca = this.ca,
            t.ciphers = this.ciphers,
            t.rejectUnauthorized = this.rejectUnauthorized;
            var e = this.xhr = new a(t)
              , r = this;
            try {
                e.open(this.method, this.uri, this.async);
                try {
                    if (this.extraHeaders) {
                        e.setDisableHeaderCheck && e.setDisableHeaderCheck(!0);
                        for (var n in this.extraHeaders)
                            this.extraHeaders.hasOwnProperty(n) && e.setRequestHeader(n, this.extraHeaders[n])
                    }
                } catch (t) {}
                if ("POST" === this.method)
                    try {
                        this.isBinary ? e.setRequestHeader("Content-type", "application/octet-stream") : e.setRequestHeader("Content-type", "text/plain;charset=UTF-8")
                    } catch (t) {}
                try {
                    e.setRequestHeader("Accept", "*/*")
                } catch (t) {}
                "withCredentials"in e && (e.withCredentials = this.withCredentials),
                this.requestTimeout && (e.timeout = this.requestTimeout),
                this.hasXDR() ? (e.onload = function() {
                    r.onLoad()
                }
                ,
                e.onerror = function() {
                    r.onError(e.responseText)
                }
                ) : e.onreadystatechange = function() {
                    if (2 === e.readyState)
                        try {
                            var t = e.getResponseHeader("Content-Type");
                            (r.supportsBinary && "application/octet-stream" === t || "application/octet-stream; charset=UTF-8" === t) && (e.responseType = "arraybuffer")
                        } catch (t) {}
                    4 === e.readyState && (200 === e.status || 1223 === e.status ? r.onLoad() : setTimeout(function() {
                        r.onError("number" == typeof e.status ? e.status : 0)
                    }, 0))
                }
                ,
                e.send(this.data)
            } catch (t) {
                return void setTimeout(function() {
                    r.onError(t)
                }, 0)
            }
            "undefined" != typeof document && (this.index = i.requestsCount++,
            i.requests[this.index] = this)
        }
        ,
        i.prototype.onSuccess = function() {
            this.emit("success"),
            this.cleanup()
        }
        ,
        i.prototype.onData = function(t) {
            this.emit("data", t),
            this.onSuccess()
        }
        ,
        i.prototype.onError = function(t) {
            this.emit("error", t),
            this.cleanup(!0)
        }
        ,
        i.prototype.cleanup = function(t) {
            if ("undefined" != typeof this.xhr && null !== this.xhr) {
                if (this.hasXDR() ? this.xhr.onload = this.xhr.onerror = n : this.xhr.onreadystatechange = n,
                t)
                    try {
                        this.xhr.abort()
                    } catch (t) {}
                "undefined" != typeof document && delete i.requests[this.index],
                this.xhr = null
            }
        }
        ,
        i.prototype.onLoad = function() {
            var t;
            try {
                var e;
                try {
                    e = this.xhr.getResponseHeader("Content-Type")
                } catch (t) {}
                t = "application/octet-stream" === e || "application/octet-stream; charset=UTF-8" === e ? this.xhr.response || this.xhr.responseText : this.xhr.responseText
            } catch (t) {
                this.onError(t)
            }
            null != t && this.onData(t)
        }
        ,
        i.prototype.hasXDR = function() {
            return "undefined" != typeof XDomainRequest && !this.xs && this.enablesXDR
        }
        ,
        i.prototype.abort = function() {
            this.cleanup()
        }
        ,
        i.requestsCount = 0,
        i.requests = {},
        "undefined" != typeof document)
            if ("function" == typeof attachEvent)
                attachEvent("onunload", s);
            else if ("function" == typeof addEventListener) {
                var u = "onpagehide"in self ? "pagehide" : "unload";
                addEventListener(u, s, !1)
            }
    }
    , function(t, e, r) {
        function n(t) {
            var e = t && t.forceBase64;
            p && !e || (this.supportsBinary = !1),
            o.call(this, t)
        }
        var o = r(17)
          , i = r(26)
          , s = r(18)
          , a = r(27)
          , c = r(28);
        r(3)("engine.io-client:polling");
        t.exports = n;
        var p = function() {
            var t = r(13)
              , e = new t({
                xdomain: !1
            });
            return null != e.responseType
        }();
        a(n, o),
        n.prototype.name = "polling",
        n.prototype.doOpen = function() {
            this.poll()
        }
        ,
        n.prototype.pause = function(t) {
            function e() {
                r.readyState = "paused",
                t()
            }
            var r = this;
            if (this.readyState = "pausing",
            this.polling || !this.writable) {
                var n = 0;
                this.polling && (n++,
                this.once("pollComplete", function() {
                    --n || e()
                })),
                this.writable || (n++,
                this.once("drain", function() {
                    --n || e()
                }))
            } else
                e()
        }
        ,
        n.prototype.poll = function() {
            this.polling = !0,
            this.doPoll(),
            this.emit("poll")
        }
        ,
        n.prototype.onData = function(t) {
            var e = this
              , r = function(t, r, n) {
                return "opening" === e.readyState && e.onOpen(),
                "close" === t.type ? (e.onClose(),
                !1) : void e.onPacket(t)
            };
            s.decodePayload(t, this.socket.binaryType, r),
            "closed" !== this.readyState && (this.polling = !1,
            this.emit("pollComplete"),
            "open" === this.readyState && this.poll())
        }
        ,
        n.prototype.doClose = function() {
            function t() {
                e.write([{
                    type: "close"
                }])
            }
            var e = this;
            "open" === this.readyState ? t() : this.once("open", t)
        }
        ,
        n.prototype.write = function(t) {
            var e = this;
            this.writable = !1;
            var r = function() {
                e.writable = !0,
                e.emit("drain")
            };
            s.encodePayload(t, this.supportsBinary, function(t) {
                e.doWrite(t, r)
            })
        }
        ,
        n.prototype.uri = function() {
            var t = this.query || {}
              , e = this.secure ? "https" : "http"
              , r = "";
            !1 !== this.timestampRequests && (t[this.timestampParam] = c()),
            this.supportsBinary || t.sid || (t.b64 = 1),
            t = i.encode(t),
            this.port && ("https" === e && 443 !== Number(this.port) || "http" === e && 80 !== Number(this.port)) && (r = ":" + this.port),
            t.length && (t = "?" + t);
            var n = this.hostname.indexOf(":") !== -1;
            return e + "://" + (n ? "[" + this.hostname + "]" : this.hostname) + r + this.path + t
        }
    }
    , function(t, e, r) {
        function n(t) {
            this.path = t.path,
            this.hostname = t.hostname,
            this.port = t.port,
            this.secure = t.secure,
            this.query = t.query,
            this.timestampParam = t.timestampParam,
            this.timestampRequests = t.timestampRequests,
            this.readyState = "",
            this.agent = t.agent || !1,
            this.socket = t.socket,
            this.enablesXDR = t.enablesXDR,
            this.withCredentials = t.withCredentials,
            this.pfx = t.pfx,
            this.key = t.key,
            this.passphrase = t.passphrase,
            this.cert = t.cert,
            this.ca = t.ca,
            this.ciphers = t.ciphers,
            this.rejectUnauthorized = t.rejectUnauthorized,
            this.forceNode = t.forceNode,
            this.isReactNative = t.isReactNative,
            this.extraHeaders = t.extraHeaders,
            this.localAddress = t.localAddress
        }
        var o = r(18)
          , i = r(5);
        t.exports = n,
        i(n.prototype),
        n.prototype.onError = function(t, e) {
            var r = new Error(t);
            return r.type = "TransportError",
            r.description = e,
            this.emit("error", r),
            this
        }
        ,
        n.prototype.open = function() {
            return "closed" !== this.readyState && "" !== this.readyState || (this.readyState = "opening",
            this.doOpen()),
            this
        }
        ,
        n.prototype.close = function() {
            return "opening" !== this.readyState && "open" !== this.readyState || (this.doClose(),
            this.onClose()),
            this
        }
        ,
        n.prototype.send = function(t) {
            if ("open" !== this.readyState)
                throw new Error("Transport not open");
            this.write(t)
        }
        ,
        n.prototype.onOpen = function() {
            this.readyState = "open",
            this.writable = !0,
            this.emit("open")
        }
        ,
        n.prototype.onData = function(t) {
            var e = o.decodePacket(t, this.socket.binaryType);
            this.onPacket(e)
        }
        ,
        n.prototype.onPacket = function(t) {
            this.emit("packet", t)
        }
        ,
        n.prototype.onClose = function() {
            this.readyState = "closed",
            this.emit("close")
        }
    }
    , function(t, e, r) {
        function n(t, r) {
            var n = "b" + e.packets[t.type] + t.data.data;
            return r(n)
        }
        function o(t, r, n) {
            if (!r)
                return e.encodeBase64Packet(t, n);
            var o = t.data
              , i = new Uint8Array(o)
              , s = new Uint8Array(1 + o.byteLength);
            s[0] = v[t.type];
            for (var a = 0; a < i.length; a++)
                s[a + 1] = i[a];
            return n(s.buffer)
        }
        function i(t, r, n) {
            if (!r)
                return e.encodeBase64Packet(t, n);
            var o = new FileReader;
            return o.onload = function() {
                e.encodePacket({
                    type: t.type,
                    data: o.result
                }, r, !0, n)
            }
            ,
            o.readAsArrayBuffer(t.data)
        }
        function s(t, r, n) {
            if (!r)
                return e.encodeBase64Packet(t, n);
            if (g)
                return i(t, r, n);
            var o = new Uint8Array(1);
            o[0] = v[t.type];
            var s = new w([o.buffer, t.data]);
            return n(s)
        }
        function a(t) {
            try {
                t = d.decode(t, {
                    strict: !1
                })
            } catch (t) {
                return !1
            }
            return t
        }
        function c(t, e, r) {
            for (var n = new Array(t.length), o = l(t.length, r), i = function(t, r, o) {
                e(r, function(e, r) {
                    n[t] = r,
                    o(e, n)
                })
            }, s = 0; s < t.length; s++)
                i(s, t[s], o)
        }
        var p, h = r(19), u = r(20), f = r(21), l = r(22), d = r(23);
        "undefined" != typeof ArrayBuffer && (p = r(24));
        var y = "undefined" != typeof navigator && /Android/i.test(navigator.userAgent)
          , m = "undefined" != typeof navigator && /PhantomJS/i.test(navigator.userAgent)
          , g = y || m;
        e.protocol = 3;
        var v = e.packets = {
            open: 0,
            close: 1,
            ping: 2,
            pong: 3,
            message: 4,
            upgrade: 5,
            noop: 6
        }
          , b = h(v)
          , k = {
            type: "error",
            data: "parser error"
        }
          , w = r(25);
        e.encodePacket = function(t, e, r, i) {
            "function" == typeof e && (i = e,
            e = !1),
            "function" == typeof r && (i = r,
            r = null);
            var a = void 0 === t.data ? void 0 : t.data.buffer || t.data;
            if ("undefined" != typeof ArrayBuffer && a instanceof ArrayBuffer)
                return o(t, e, i);
            if ("undefined" != typeof w && a instanceof w)
                return s(t, e, i);
            if (a && a.base64)
                return n(t, i);
            var c = v[t.type];
            return void 0 !== t.data && (c += r ? d.encode(String(t.data), {
                strict: !1
            }) : String(t.data)),
            i("" + c)
        }
        ,
        e.encodeBase64Packet = function(t, r) {
            var n = "b" + e.packets[t.type];
            if ("undefined" != typeof w && t.data instanceof w) {
                var o = new FileReader;
                return o.onload = function() {
                    var t = o.result.split(",")[1];
                    r(n + t)
                }
                ,
                o.readAsDataURL(t.data)
            }
            var i;
            try {
                i = String.fromCharCode.apply(null, new Uint8Array(t.data))
            } catch (e) {
                for (var s = new Uint8Array(t.data), a = new Array(s.length), c = 0; c < s.length; c++)
                    a[c] = s[c];
                i = String.fromCharCode.apply(null, a)
            }
            return n += btoa(i),
            r(n)
        }
        ,
        e.decodePacket = function(t, r, n) {
            if (void 0 === t)
                return k;
            if ("string" == typeof t) {
                if ("b" === t.charAt(0))
                    return e.decodeBase64Packet(t.substr(1), r);
                if (n && (t = a(t),
                t === !1))
                    return k;
                var o = t.charAt(0);
                return Number(o) == o && b[o] ? t.length > 1 ? {
                    type: b[o],
                    data: t.substring(1)
                } : {
                    type: b[o]
                } : k
            }
            var i = new Uint8Array(t)
              , o = i[0]
              , s = f(t, 1);
            return w && "blob" === r && (s = new w([s])),
            {
                type: b[o],
                data: s
            }
        }
        ,
        e.decodeBase64Packet = function(t, e) {
            var r = b[t.charAt(0)];
            if (!p)
                return {
                    type: r,
                    data: {
                        base64: !0,
                        data: t.substr(1)
                    }
                };
            var n = p.decode(t.substr(1));
            return "blob" === e && w && (n = new w([n])),
            {
                type: r,
                data: n
            }
        }
        ,
        e.encodePayload = function(t, r, n) {
            function o(t) {
                return t.length + ":" + t
            }
            function i(t, n) {
                e.encodePacket(t, !!s && r, !1, function(t) {
                    n(null, o(t))
                })
            }
            "function" == typeof r && (n = r,
            r = null);
            var s = u(t);
            return r && s ? w && !g ? e.encodePayloadAsBlob(t, n) : e.encodePayloadAsArrayBuffer(t, n) : t.length ? void c(t, i, function(t, e) {
                return n(e.join(""))
            }) : n("0:")
        }
        ,
        e.decodePayload = function(t, r, n) {
            if ("string" != typeof t)
                return e.decodePayloadAsBinary(t, r, n);
            "function" == typeof r && (n = r,
            r = null);
            var o;
            if ("" === t)
                return n(k, 0, 1);
            for (var i, s, a = "", c = 0, p = t.length; c < p; c++) {
                var h = t.charAt(c);
                if (":" === h) {
                    if ("" === a || a != (i = Number(a)))
                        return n(k, 0, 1);
                    if (s = t.substr(c + 1, i),
                    a != s.length)
                        return n(k, 0, 1);
                    if (s.length) {
                        if (o = e.decodePacket(s, r, !1),
                        k.type === o.type && k.data === o.data)
                            return n(k, 0, 1);
                        var u = n(o, c + i, p);
                        if (!1 === u)
                            return
                    }
                    c += i,
                    a = ""
                } else
                    a += h
            }
            return "" !== a ? n(k, 0, 1) : void 0
        }
        ,
        e.encodePayloadAsArrayBuffer = function(t, r) {
            function n(t, r) {
                e.encodePacket(t, !0, !0, function(t) {
                    return r(null, t)
                })
            }
            return t.length ? void c(t, n, function(t, e) {
                var n = e.reduce(function(t, e) {
                    var r;
                    return r = "string" == typeof e ? e.length : e.byteLength,
                    t + r.toString().length + r + 2
                }, 0)
                  , o = new Uint8Array(n)
                  , i = 0;
                return e.forEach(function(t) {
                    var e = "string" == typeof t
                      , r = t;
                    if (e) {
                        for (var n = new Uint8Array(t.length), s = 0; s < t.length; s++)
                            n[s] = t.charCodeAt(s);
                        r = n.buffer
                    }
                    e ? o[i++] = 0 : o[i++] = 1;
                    for (var a = r.byteLength.toString(), s = 0; s < a.length; s++)
                        o[i++] = parseInt(a[s]);
                    o[i++] = 255;
                    for (var n = new Uint8Array(r), s = 0; s < n.length; s++)
                        o[i++] = n[s]
                }),
                r(o.buffer)
            }) : r(new ArrayBuffer(0))
        }
        ,
        e.encodePayloadAsBlob = function(t, r) {
            function n(t, r) {
                e.encodePacket(t, !0, !0, function(t) {
                    var e = new Uint8Array(1);
                    if (e[0] = 1,
                    "string" == typeof t) {
                        for (var n = new Uint8Array(t.length), o = 0; o < t.length; o++)
                            n[o] = t.charCodeAt(o);
                        t = n.buffer,
                        e[0] = 0
                    }
                    for (var i = t instanceof ArrayBuffer ? t.byteLength : t.size, s = i.toString(), a = new Uint8Array(s.length + 1), o = 0; o < s.length; o++)
                        a[o] = parseInt(s[o]);
                    if (a[s.length] = 255,
                    w) {
                        var c = new w([e.buffer, a.buffer, t]);
                        r(null, c)
                    }
                })
            }
            c(t, n, function(t, e) {
                return r(new w(e))
            })
        }
        ,
        e.decodePayloadAsBinary = function(t, r, n) {
            "function" == typeof r && (n = r,
            r = null);
            for (var o = t, i = []; o.byteLength > 0; ) {
                for (var s = new Uint8Array(o), a = 0 === s[0], c = "", p = 1; 255 !== s[p]; p++) {
                    if (c.length > 310)
                        return n(k, 0, 1);
                    c += s[p]
                }
                o = f(o, 2 + c.length),
                c = parseInt(c);
                var h = f(o, 0, c);
                if (a)
                    try {
                        h = String.fromCharCode.apply(null, new Uint8Array(h))
                    } catch (t) {
                        var u = new Uint8Array(h);
                        h = "";
                        for (var p = 0; p < u.length; p++)
                            h += String.fromCharCode(u[p])
                    }
                i.push(h),
                o = f(o, c)
            }
            var l = i.length;
            i.forEach(function(t, o) {
                n(e.decodePacket(t, r, !0), o, l)
            })
        }
    }
    , function(t, e) {
        t.exports = Object.keys || function(t) {
            var e = []
              , r = Object.prototype.hasOwnProperty;
            for (var n in t)
                r.call(t, n) && e.push(n);
            return e
        }
    }
    , function(t, e, r) {
        function n(t) {
            if (!t || "object" != typeof t)
                return !1;
            if (o(t)) {
                for (var e = 0, r = t.length; e < r; e++)
                    if (n(t[e]))
                        return !0;
                return !1
            }
            if ("function" == typeof Buffer && Buffer.isBuffer && Buffer.isBuffer(t) || "function" == typeof ArrayBuffer && t instanceof ArrayBuffer || s && t instanceof Blob || a && t instanceof File)
                return !0;
            if (t.toJSON && "function" == typeof t.toJSON && 1 === arguments.length)
                return n(t.toJSON(), !0);
            for (var i in t)
                if (Object.prototype.hasOwnProperty.call(t, i) && n(t[i]))
                    return !0;
            return !1
        }
        var o = r(7)
          , i = Object.prototype.toString
          , s = "function" == typeof Blob || "undefined" != typeof Blob && "[object BlobConstructor]" === i.call(Blob)
          , a = "function" == typeof File || "undefined" != typeof File && "[object FileConstructor]" === i.call(File);
        t.exports = n
    }
    , function(t, e) {
        t.exports = function(t, e, r) {
            var n = t.byteLength;
            if (e = e || 0,
            r = r || n,
            t.slice)
                return t.slice(e, r);
            if (e < 0 && (e += n),
            r < 0 && (r += n),
            r > n && (r = n),
            e >= n || e >= r || 0 === n)
                return new ArrayBuffer(0);
            for (var o = new Uint8Array(t), i = new Uint8Array(r - e), s = e, a = 0; s < r; s++,
            a++)
                i[a] = o[s];
            return i.buffer
        }
    }
    , function(t, e) {
        function r(t, e, r) {
            function o(t, n) {
                if (o.count <= 0)
                    throw new Error("after called too many times");
                --o.count,
                t ? (i = !0,
                e(t),
                e = r) : 0 !== o.count || i || e(null, n)
            }
            var i = !1;
            return r = r || n,
            o.count = t,
            0 === t ? e() : o
        }
        function n() {}
        t.exports = r
    }
    , function(t, e) {
        function r(t) {
            for (var e, r, n = [], o = 0, i = t.length; o < i; )
                e = t.charCodeAt(o++),
                e >= 55296 && e <= 56319 && o < i ? (r = t.charCodeAt(o++),
                56320 == (64512 & r) ? n.push(((1023 & e) << 10) + (1023 & r) + 65536) : (n.push(e),
                o--)) : n.push(e);
            return n
        }
        function n(t) {
            for (var e, r = t.length, n = -1, o = ""; ++n < r; )
                e = t[n],
                e > 65535 && (e -= 65536,
                o += d(e >>> 10 & 1023 | 55296),
                e = 56320 | 1023 & e),
                o += d(e);
            return o
        }
        function o(t, e) {
            if (t >= 55296 && t <= 57343) {
                if (e)
                    throw Error("Lone surrogate U+" + t.toString(16).toUpperCase() + " is not a scalar value");
                return !1
            }
            return !0
        }
        function i(t, e) {
            return d(t >> e & 63 | 128)
        }
        function s(t, e) {
            if (0 == (4294967168 & t))
                return d(t);
            var r = "";
            return 0 == (4294965248 & t) ? r = d(t >> 6 & 31 | 192) : 0 == (4294901760 & t) ? (o(t, e) || (t = 65533),
            r = d(t >> 12 & 15 | 224),
            r += i(t, 6)) : 0 == (4292870144 & t) && (r = d(t >> 18 & 7 | 240),
            r += i(t, 12),
            r += i(t, 6)),
            r += d(63 & t | 128)
        }
        function a(t, e) {
            e = e || {};
            for (var n, o = !1 !== e.strict, i = r(t), a = i.length, c = -1, p = ""; ++c < a; )
                n = i[c],
                p += s(n, o);
            return p
        }
        function c() {
            if (l >= f)
                throw Error("Invalid byte index");
            var t = 255 & u[l];
            if (l++,
            128 == (192 & t))
                return 63 & t;
            throw Error("Invalid continuation byte")
        }
        function p(t) {
            var e, r, n, i, s;
            if (l > f)
                throw Error("Invalid byte index");
            if (l == f)
                return !1;
            if (e = 255 & u[l],
            l++,
            0 == (128 & e))
                return e;
            if (192 == (224 & e)) {
                if (r = c(),
                s = (31 & e) << 6 | r,
                s >= 128)
                    return s;
                throw Error("Invalid continuation byte")
            }
            if (224 == (240 & e)) {
                if (r = c(),
                n = c(),
                s = (15 & e) << 12 | r << 6 | n,
                s >= 2048)
                    return o(s, t) ? s : 65533;
                throw Error("Invalid continuation byte")
            }
            if (240 == (248 & e) && (r = c(),
            n = c(),
            i = c(),
            s = (7 & e) << 18 | r << 12 | n << 6 | i,
            s >= 65536 && s <= 1114111))
                return s;
            throw Error("Invalid UTF-8 detected")
        }
        function h(t, e) {
            e = e || {};
            var o = !1 !== e.strict;
            u = r(t),
            f = u.length,
            l = 0;
            for (var i, s = []; (i = p(o)) !== !1; )
                s.push(i);
            return n(s)
        }
        /*! https://mths.be/utf8js v2.1.2 by @mathias */
        var u, f, l, d = String.fromCharCode;
        t.exports = {
            version: "2.1.2",
            encode: a,
            decode: h
        }
    }
    , function(t, e) {
        !function() {
            "use strict";
            for (var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", r = new Uint8Array(256), n = 0; n < t.length; n++)
                r[t.charCodeAt(n)] = n;
            e.encode = function(e) {
                var r, n = new Uint8Array(e), o = n.length, i = "";
                for (r = 0; r < o; r += 3)
                    i += t[n[r] >> 2],
                    i += t[(3 & n[r]) << 4 | n[r + 1] >> 4],
                    i += t[(15 & n[r + 1]) << 2 | n[r + 2] >> 6],
                    i += t[63 & n[r + 2]];
                return o % 3 === 2 ? i = i.substring(0, i.length - 1) + "=" : o % 3 === 1 && (i = i.substring(0, i.length - 2) + "=="),
                i
            }
            ,
            e.decode = function(t) {
                var e, n, o, i, s, a = .75 * t.length, c = t.length, p = 0;
                "=" === t[t.length - 1] && (a--,
                "=" === t[t.length - 2] && a--);
                var h = new ArrayBuffer(a)
                  , u = new Uint8Array(h);
                for (e = 0; e < c; e += 4)
                    n = r[t.charCodeAt(e)],
                    o = r[t.charCodeAt(e + 1)],
                    i = r[t.charCodeAt(e + 2)],
                    s = r[t.charCodeAt(e + 3)],
                    u[p++] = n << 2 | o >> 4,
                    u[p++] = (15 & o) << 4 | i >> 2,
                    u[p++] = (3 & i) << 6 | 63 & s;
                return h
            }
        }()
    }
    , function(t, e) {
        function r(t) {
            return t.map(function(t) {
                if (t.buffer instanceof ArrayBuffer) {
                    var e = t.buffer;
                    if (t.byteLength !== e.byteLength) {
                        var r = new Uint8Array(t.byteLength);
                        r.set(new Uint8Array(e,t.byteOffset,t.byteLength)),
                        e = r.buffer
                    }
                    return e
                }
                return t
            })
        }
        function n(t, e) {
            e = e || {};
            var n = new i;
            return r(t).forEach(function(t) {
                n.append(t)
            }),
            e.type ? n.getBlob(e.type) : n.getBlob()
        }
        function o(t, e) {
            return new Blob(r(t),e || {})
        }
        var i = "undefined" != typeof i ? i : "undefined" != typeof WebKitBlobBuilder ? WebKitBlobBuilder : "undefined" != typeof MSBlobBuilder ? MSBlobBuilder : "undefined" != typeof MozBlobBuilder && MozBlobBuilder
          , s = function() {
            try {
                var t = new Blob(["hi"]);
                return 2 === t.size
            } catch (t) {
                return !1
            }
        }()
          , a = s && function() {
            try {
                var t = new Blob([new Uint8Array([1, 2])]);
                return 2 === t.size
            } catch (t) {
                return !1
            }
        }()
          , c = i && i.prototype.append && i.prototype.getBlob;
        "undefined" != typeof Blob && (n.prototype = Blob.prototype,
        o.prototype = Blob.prototype),
        t.exports = function() {
            return s ? a ? Blob : o : c ? n : void 0
        }()
    }
    , function(t, e) {
        e.encode = function(t) {
            var e = "";
            for (var r in t)
                t.hasOwnProperty(r) && (e.length && (e += "&"),
                e += encodeURIComponent(r) + "=" + encodeURIComponent(t[r]));
            return e
        }
        ,
        e.decode = function(t) {
            for (var e = {}, r = t.split("&"), n = 0, o = r.length; n < o; n++) {
                var i = r[n].split("=");
                e[decodeURIComponent(i[0])] = decodeURIComponent(i[1])
            }
            return e
        }
    }
    , function(t, e) {
        t.exports = function(t, e) {
            var r = function() {};
            r.prototype = e.prototype,
            t.prototype = new r,
            t.prototype.constructor = t
        }
    }
    , function(t, e) {
        "use strict";
        function r(t) {
            var e = "";
            do
                e = s[t % a] + e,
                t = Math.floor(t / a);
            while (t > 0);
            return e
        }
        function n(t) {
            var e = 0;
            for (h = 0; h < t.length; h++)
                e = e * a + c[t.charAt(h)];
            return e
        }
        function o() {
            var t = r(+new Date);
            return t !== i ? (p = 0,
            i = t) : t + "." + r(p++)
        }
        for (var i, s = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), a = 64, c = {}, p = 0, h = 0; h < a; h++)
            c[s[h]] = h;
        o.encode = r,
        o.decode = n,
        t.exports = o
    }
    , function(t, e, r) {
        (function(e) {
            function n() {}
            function o() {
                return "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof e ? e : {}
            }
            function i(t) {
                if (s.call(this, t),
                this.query = this.query || {},
                !c) {
                    var e = o();
                    c = e.___eio = e.___eio || []
                }
                this.index = c.length;
                var r = this;
                c.push(function(t) {
                    r.onData(t)
                }),
                this.query.j = this.index,
                "function" == typeof addEventListener && addEventListener("beforeunload", function() {
                    r.script && (r.script.onerror = n)
                }, !1)
            }
            var s = r(16)
              , a = r(27);
            t.exports = i;
            var c, p = /\n/g, h = /\\n/g;
            a(i, s),
            i.prototype.supportsBinary = !1,
            i.prototype.doClose = function() {
                this.script && (this.script.parentNode.removeChild(this.script),
                this.script = null),
                this.form && (this.form.parentNode.removeChild(this.form),
                this.form = null,
                this.iframe = null),
                s.prototype.doClose.call(this)
            }
            ,
            i.prototype.doPoll = function() {
                var t = this
                  , e = document.createElement("script");
                this.script && (this.script.parentNode.removeChild(this.script),
                this.script = null),
                e.async = !0,
                e.src = this.uri(),
                e.onerror = function(e) {
                    t.onError("jsonp poll error", e)
                }
                ;
                var r = document.getElementsByTagName("script")[0];
                r ? r.parentNode.insertBefore(e, r) : (document.head || document.body).appendChild(e),
                this.script = e;
                var n = "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent);
                n && setTimeout(function() {
                    var t = document.createElement("iframe");
                    document.body.appendChild(t),
                    document.body.removeChild(t)
                }, 100)
            }
            ,
            i.prototype.doWrite = function(t, e) {
                function r() {
                    n(),
                    e()
                }
                function n() {
                    if (o.iframe)
                        try {
                            o.form.removeChild(o.iframe)
                        } catch (t) {
                            o.onError("jsonp polling iframe removal error", t)
                        }
                    try {
                        var t = '<iframe src="javascript:0" name="' + o.iframeId + '">';
                        i = document.createElement(t)
                    } catch (t) {
                        i = document.createElement("iframe"),
                        i.name = o.iframeId,
                        i.src = "javascript:0"
                    }
                    i.id = o.iframeId,
                    o.form.appendChild(i),
                    o.iframe = i
                }
                var o = this;
                if (!this.form) {
                    var i, s = document.createElement("form"), a = document.createElement("textarea"), c = this.iframeId = "eio_iframe_" + this.index;
                    s.className = "socketio",
                    s.style.position = "absolute",
                    s.style.top = "-1000px",
                    s.style.left = "-1000px",
                    s.target = c,
                    s.method = "POST",
                    s.setAttribute("accept-charset", "utf-8"),
                    a.name = "d",
                    s.appendChild(a),
                    document.body.appendChild(s),
                    this.form = s,
                    this.area = a
                }
                this.form.action = this.uri(),
                n(),
                t = t.replace(h, "\\\n"),
                this.area.value = t.replace(p, "\\n");
                try {
                    this.form.submit()
                } catch (t) {}
                this.iframe.attachEvent ? this.iframe.onreadystatechange = function() {
                    "complete" === o.iframe.readyState && r()
                }
                : this.iframe.onload = r
            }
        }
        ).call(e, function() {
            return this
        }())
    }
    , function(t, e, r) {
        function n(t) {
            var e = t && t.forceBase64;
            e && (this.supportsBinary = !1),
            this.perMessageDeflate = t.perMessageDeflate,
            this.usingBrowserWebSocket = o && !t.forceNode,
            this.protocols = t.protocols,
            this.usingBrowserWebSocket || (u = i),
            s.call(this, t)
        }
        var o, i, s = r(17), a = r(18), c = r(26), p = r(27), h = r(28);
        r(3)("engine.io-client:websocket");
        if ("undefined" != typeof WebSocket ? o = WebSocket : "undefined" != typeof self && (o = self.WebSocket || self.MozWebSocket),
        "undefined" == typeof window)
            try {
                i = r(31)
            } catch (t) {}
        var u = o || i;
        t.exports = n,
        p(n, s),
        n.prototype.name = "websocket",
        n.prototype.supportsBinary = !0,
        n.prototype.doOpen = function() {
            if (this.check()) {
                var t = this.uri()
                  , e = this.protocols
                  , r = {
                    agent: this.agent,
                    perMessageDeflate: this.perMessageDeflate
                };
                r.pfx = this.pfx,
                r.key = this.key,
                r.passphrase = this.passphrase,
                r.cert = this.cert,
                r.ca = this.ca,
                r.ciphers = this.ciphers,
                r.rejectUnauthorized = this.rejectUnauthorized,
                this.extraHeaders && (r.headers = this.extraHeaders),
                this.localAddress && (r.localAddress = this.localAddress);
                try {
                    this.ws = this.usingBrowserWebSocket && !this.isReactNative ? e ? new u(t,e) : new u(t) : new u(t,e,r)
                } catch (t) {
                    return this.emit("error", t)
                }
                void 0 === this.ws.binaryType && (this.supportsBinary = !1),
                this.ws.supports && this.ws.supports.binary ? (this.supportsBinary = !0,
                this.ws.binaryType = "nodebuffer") : this.ws.binaryType = "arraybuffer",
                this.addEventListeners()
            }
        }
        ,
        n.prototype.addEventListeners = function() {
            var t = this;
            this.ws.onopen = function() {
                t.onOpen()
            }
            ,
            this.ws.onclose = function() {
                t.onClose()
            }
            ,
            this.ws.onmessage = function(e) {
                t.onData(e.data)
            }
            ,
            this.ws.onerror = function(e) {
                t.onError("websocket error", e)
            }
        }
        ,
        n.prototype.write = function(t) {
            function e() {
                r.emit("flush"),
                setTimeout(function() {
                    r.writable = !0,
                    r.emit("drain")
                }, 0)
            }
            var r = this;
            this.writable = !1;
            for (var n = t.length, o = 0, i = n; o < i; o++)
                !function(t) {
                    a.encodePacket(t, r.supportsBinary, function(o) {
                        if (!r.usingBrowserWebSocket) {
                            var i = {};
                            if (t.options && (i.compress = t.options.compress),
                            r.perMessageDeflate) {
                                var s = "string" == typeof o ? Buffer.byteLength(o) : o.length;
                                s < r.perMessageDeflate.threshold && (i.compress = !1)
                            }
                        }
                        try {
                            r.usingBrowserWebSocket ? r.ws.send(o) : r.ws.send(o, i)
                        } catch (t) {}
                        --n || e()
                    })
                }(t[o])
        }
        ,
        n.prototype.onClose = function() {
            s.prototype.onClose.call(this)
        }
        ,
        n.prototype.doClose = function() {
            "undefined" != typeof this.ws && this.ws.close()
        }
        ,
        n.prototype.uri = function() {
            var t = this.query || {}
              , e = this.secure ? "wss" : "ws"
              , r = "";
            this.port && ("wss" === e && 443 !== Number(this.port) || "ws" === e && 80 !== Number(this.port)) && (r = ":" + this.port),
            this.timestampRequests && (t[this.timestampParam] = h()),
            this.supportsBinary || (t.b64 = 1),
            t = c.encode(t),
            t.length && (t = "?" + t);
            var n = this.hostname.indexOf(":") !== -1;
            return e + "://" + (n ? "[" + this.hostname + "]" : this.hostname) + r + this.path + t
        }
        ,
        n.prototype.check = function() {
            return !(!u || "__initialize"in u && this.name === n.prototype.name)
        }
    }
    , function(t, e) {}
    , function(t, e) {
        var r = [].indexOf;
        t.exports = function(t, e) {
            if (r)
                return t.indexOf(e);
            for (var n = 0; n < t.length; ++n)
                if (t[n] === e)
                    return n;
            return -1
        }
    }
    , function(t, e, r) {
        "use strict";
        function n(t, e, r) {
            this.io = t,
            this.nsp = e,
            this.json = this,
            this.ids = 0,
            this.acks = {},
            this.receiveBuffer = [],
            this.sendBuffer = [],
            this.connected = !1,
            this.disconnected = !0,
            this.flags = {},
            r && r.query && (this.query = r.query),
            this.io.autoConnect && this.open()
        }
        var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
          , i = r(4)
          , s = r(5)
          , a = r(34)
          , c = r(35)
          , p = r(36)
          , h = (r(3)("socket.io-client:socket"),
        r(26))
          , u = r(20);
        t.exports = e = n;
        var f = {
            connect: 1,
            connect_error: 1,
            connect_timeout: 1,
            connecting: 1,
            disconnect: 1,
            error: 1,
            reconnect: 1,
            reconnect_attempt: 1,
            reconnect_failed: 1,
            reconnect_error: 1,
            reconnecting: 1,
            ping: 1,
            pong: 1
        }
          , l = s.prototype.emit;
        s(n.prototype),
        n.prototype.subEvents = function() {
            if (!this.subs) {
                var t = this.io;
                this.subs = [c(t, "open", p(this, "onopen")), c(t, "packet", p(this, "onpacket")), c(t, "close", p(this, "onclose"))]
            }
        }
        ,
        n.prototype.open = n.prototype.connect = function() {
            return this.connected ? this : (this.subEvents(),
            this.io.open(),
            "open" === this.io.readyState && this.onopen(),
            this.emit("connecting"),
            this)
        }
        ,
        n.prototype.send = function() {
            var t = a(arguments);
            return t.unshift("message"),
            this.emit.apply(this, t),
            this
        }
        ,
        n.prototype.emit = function(t) {
            if (f.hasOwnProperty(t))
                return l.apply(this, arguments),
                this;
            var e = a(arguments)
              , r = {
                type: (void 0 !== this.flags.binary ? this.flags.binary : u(e)) ? i.BINARY_EVENT : i.EVENT,
                data: e
            };
            return r.options = {},
            r.options.compress = !this.flags || !1 !== this.flags.compress,
            "function" == typeof e[e.length - 1] && (this.acks[this.ids] = e.pop(),
            r.id = this.ids++),
            this.connected ? this.packet(r) : this.sendBuffer.push(r),
            this.flags = {},
            this
        }
        ,
        n.prototype.packet = function(t) {
            t.nsp = this.nsp,
            this.io.packet(t)
        }
        ,
        n.prototype.onopen = function() {
            if ("/" !== this.nsp)
                if (this.query) {
                    var t = "object" === o(this.query) ? h.encode(this.query) : this.query;
                    this.packet({
                        type: i.CONNECT,
                        query: t
                    })
                } else
                    this.packet({
                        type: i.CONNECT
                    })
        }
        ,
        n.prototype.onclose = function(t) {
            this.connected = !1,
            this.disconnected = !0,
            delete this.id,
            this.emit("disconnect", t)
        }
        ,
        n.prototype.onpacket = function(t) {
            var e = t.nsp === this.nsp
              , r = t.type === i.ERROR && "/" === t.nsp;
            if (e || r)
                switch (t.type) {
                case i.CONNECT:
                    this.onconnect();
                    break;
                case i.EVENT:
                    this.onevent(t);
                    break;
                case i.BINARY_EVENT:
                    this.onevent(t);
                    break;
                case i.ACK:
                    this.onack(t);
                    break;
                case i.BINARY_ACK:
                    this.onack(t);
                    break;
                case i.DISCONNECT:
                    this.ondisconnect();
                    break;
                case i.ERROR:
                    this.emit("error", t.data)
                }
        }
        ,
        n.prototype.onevent = function(t) {
            var e = t.data || [];
            null != t.id && e.push(this.ack(t.id)),
            this.connected ? l.apply(this, e) : this.receiveBuffer.push(e)
        }
        ,
        n.prototype.ack = function(t) {
            var e = this
              , r = !1;
            return function() {
                if (!r) {
                    r = !0;
                    var n = a(arguments);
                    e.packet({
                        type: u(n) ? i.BINARY_ACK : i.ACK,
                        id: t,
                        data: n
                    })
                }
            }
        }
        ,
        n.prototype.onack = function(t) {
            var e = this.acks[t.id];
            "function" == typeof e && (e.apply(this, t.data),
            delete this.acks[t.id])
        }
        ,
        n.prototype.onconnect = function() {
            this.connected = !0,
            this.disconnected = !1,
            this.emit("connect"),
            this.emitBuffered()
        }
        ,
        n.prototype.emitBuffered = function() {
            var t;
            for (t = 0; t < this.receiveBuffer.length; t++)
                l.apply(this, this.receiveBuffer[t]);
            for (this.receiveBuffer = [],
            t = 0; t < this.sendBuffer.length; t++)
                this.packet(this.sendBuffer[t]);
            this.sendBuffer = []
        }
        ,
        n.prototype.ondisconnect = function() {
            this.destroy(),
            this.onclose("io server disconnect")
        }
        ,
        n.prototype.destroy = function() {
            if (this.subs) {
                for (var t = 0; t < this.subs.length; t++)
                    this.subs[t].destroy();
                this.subs = null
            }
            this.io.destroy(this)
        }
        ,
        n.prototype.close = n.prototype.disconnect = function() {
            return this.connected && this.packet({
                type: i.DISCONNECT
            }),
            this.destroy(),
            this.connected && this.onclose("io client disconnect"),
            this
        }
        ,
        n.prototype.compress = function(t) {
            return this.flags.compress = t,
            this
        }
        ,
        n.prototype.binary = function(t) {
            return this.flags.binary = t,
            this
        }
    }
    , function(t, e) {
        function r(t, e) {
            var r = [];
            e = e || 0;
            for (var n = e || 0; n < t.length; n++)
                r[n - e] = t[n];
            return r
        }
        t.exports = r
    }
    , function(t, e) {
        "use strict";
        function r(t, e, r) {
            return t.on(e, r),
            {
                destroy: function() {
                    t.removeListener(e, r)
                }
            }
        }
        t.exports = r
    }
    , function(t, e) {
        var r = [].slice;
        t.exports = function(t, e) {
            if ("string" == typeof e && (e = t[e]),
            "function" != typeof e)
                throw new Error("bind() requires a function");
            var n = r.call(arguments, 2);
            return function() {
                return e.apply(t, n.concat(r.call(arguments)))
            }
        }
    }
    , function(t, e) {
        function r(t) {
            t = t || {},
            this.ms = t.min || 100,
            this.max = t.max || 1e4,
            this.factor = t.factor || 2,
            this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0,
            this.attempts = 0
        }
        t.exports = r,
        r.prototype.duration = function() {
            var t = this.ms * Math.pow(this.factor, this.attempts++);
            if (this.jitter) {
                var e = Math.random()
                  , r = Math.floor(e * this.jitter * t);
                t = 0 == (1 & Math.floor(10 * e)) ? t - r : t + r
            }
            return 0 | Math.min(t, this.max)
        }
        ,
        r.prototype.reset = function() {
            this.attempts = 0
        }
        ,
        r.prototype.setMin = function(t) {
            this.ms = t
        }
        ,
        r.prototype.setMax = function(t) {
            this.max = t
        }
        ,
        r.prototype.setJitter = function(t) {
            this.jitter = t
        }
    }
    ])
});
//# sourceMappingURL=socket.io.slim.js.map