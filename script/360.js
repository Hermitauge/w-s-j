! function (e, t) {
    if ("function" == typeof define && define.amd) define(["exports", "module"], t);
    else if ("undefined" != typeof exports && "undefined" != typeof module) t(exports, module);
    else {
      var n = {
        exports: {}
      };
      t(n.exports, n), e.Impetus = n.exports
    }
  }(this, function (e, t) {
    "use strict";
    
    function n(e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    
    function o() {
      var e = !1;
      try {
        var t = Object.defineProperty({}, "passive", {
          get: function () {
            e = !0
          }
        });
        window.addEventListener("test", null, t)
      } catch (e) {}
      return o = function () {
        return e
      }, e
    }
    var i = .04
      , u = .11;
    window.addEventListener("touchmove", function () {});
    var r = function e(t) {
      function r() {
        document.removeEventListener("touchmove", v, !!o() && {
          passive: !1
        }), document.removeEventListener("touchend", m), document.removeEventListener("touchcancel", l), document.removeEventListener("mousemove", v, !!
        o() && {
            passive: !1
          }), document.removeEventListener("mouseup", m)
      }
      
      function c() {
        r(), document.addEventListener("touchmove", v, !!o() && {
          passive: !1
        }), document.addEventListener("touchend", m), document.addEventListener("touchcancel", l), document.addEventListener("mousemove", v, !!o() && {
          passive: !1
        }), document.addEventListener("mouseup", m)
      }
      
      function d() {
        g.call(M, H, J)
      }
      
      function a(e) {
        if ("touchmove" === e.type || "touchstart" === e.type || "touchend" === e.type) {
          var t = e.targetTouches[0] || e.changedTouches[0];
          return {
            x: t.clientX
            , y: t.clientY
            , id: t.identifier
          }
        }
        return {
          x: e.clientX
          , y: e.clientY
          , id: null
        }
      }
      
      function f(e) {
        var t = a(e);
        Q || W || (Q = !0, Z = !1, C = t.id, V = k = t.x, j = z = t.y, $ = [], h(V, j), c())
      }
      
      function v(e) {
        e.preventDefault();
        var t = a(e);
        Q && t.id === C && (k = t.x, z = t.y, h(V, j), x())
      }
      
      function m(e) {
        var t = a(e);
        Q && t.id === C && l()
      }
      
      function l() {
        Q = !1, h(V, j), E(), r()
      }
      
      function h(e, t) {
        for (var n = Date.now(); $.length > 0 && !(n - $[0].time <= 100);) $.shift();
        $.push({
          x: e
          , y: t
          , time: n
        })
      }
      
      function p() {
        var e = k - V
          , t = z - j;
        if (H += e * B, J += t * B, P) {
          var n = w();
          0 !== n.x && (H -= e * y(n.x) * B), 0 !== n.y && (J -= t * y(n.y) * B)
        } else w(!0);
        d(), V = k, j = z, N = !1
      }
      
      function y(e) {
        return 5e-6 * Math.pow(e, 2) + 1e-4 * e + .55
      }
      
      function x() {
        N || s(p), N = !0
      }
      
      function w(e) {
        var t = 0
          , n = 0;
        return void 0 !== S && H < S ? t = S - H : void 0 !== D && H > D && (t = D - H), void 0 !== R && J < R ? n = R - J : void 0 !== U && J > U && (n = U -
          J), e && (0 !== t && (H = t > 0 ? S : D), 0 !== n && (J = n > 0 ? R : U)), {
          x: t
          , y: n
          , inBounds: 0 === t && 0 === n
        }
      }
      
      function E() {
        var e = $[0]
          , t = $[$.length - 1]
          , n = t.x - e.x
          , o = t.y - e.y
          , i = t.time - e.time
          , u = i / 15 / B;
        O = n / u || 0, G = o / u || 0;
        var r = w();
        (Math.abs(O) > 1 || Math.abs(G) > 1 || !r.inBounds) && (Z = !0, s(L))
      }
      
      function L() {
        if (Z) {
          O *= X, G *= X, H += O, J += G;
          var e = w();
          if (Math.abs(O) > K || Math.abs(G) > K || !e.inBounds) {
            if (P) {
              if (0 !== e.x)
                if (e.x * O <= 0) O += e.x * i;
                else {
                  var t = e.x > 0 ? 2.5 : -2.5;
                  O = (e.x + t) * u
                } if (0 !== e.y)
                if (e.y * G <= 0) G += e.y * i;
                else {
                  var t = e.y > 0 ? 2.5 : -2.5;
                  G = (e.y + t) * u
                }
            } else 0 !== e.x && (H = e.x > 0 ? S : D, O = 0), 0 !== e.y && (J = e.y > 0 ? R : U, G = 0);
            d(), s(L)
          } else Z = !1
        }
      }
      var b = t.source
        , M = void 0 === b ? document : b
        , g = t.update
        , T = t.multiplier
        , B = void 0 === T ? 1 : T
        , q = t.friction
        , X = void 0 === q ? .92 : q
        , Y = t.initialValues
        , A = t.boundX
        , F = t.boundY
        , I = t.bounce
        , P = void 0 === I || I;
      n(this, e);
      var S, D, R, U, V, j, k, z, C, O, G, H = 0
        , J = 0
        , K = .3 * B
        , N = !1
        , Q = !1
        , W = !1
        , Z = !1
        , $ = [];
      ! function () {
        if (!(M = "string" == typeof M ? document.querySelector(M) : M)) throw new Error("IMPETUS: source not found.");
        if (!g) throw new Error("IMPETUS: update function not defined.");
        Y && (Y[0] && (H = Y[0]), Y[1] && (J = Y[1]), d()), A && (S = A[0], D = A[1]), F && (R = F[0], U = F[1]), M.addEventListener("touchstart", f), M
          .addEventListener("mousedown", f)
      }(), this.destroy = function () {
        return M.removeEventListener("touchstart", f), M.removeEventListener("mousedown", f), r(), null
      }, this.pause = function () {
        r(), Q = !1, W = !0
      }, this.resume = function () {
        W = !1
      }, this.setValues = function (e, t) {
        "number" == typeof e && (H = e), "number" == typeof t && (J = t)
      }, this.setMultiplier = function (e) {
        B = e, K = .3 * B
      }, this.setBoundX = function (e) {
        S = e[0], D = e[1]
      }, this.setBoundY = function (e) {
        R = e[0], U = e[1]
      }
    };
    t.exports = r;
    var s = function () {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (e) {
        window.setTimeout(e, 1e3 / 60)
      }
    }()
  });
  export default Impetus;