(() => {
  var Ug = Object.create;
  var As = Object.defineProperty;
  var Bg = Object.getOwnPropertyDescriptor;
  var qg = Object.getOwnPropertyNames;
  var Hg = Object.getPrototypeOf;
  var jg = Object.prototype.hasOwnProperty;
  var Lt = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
  var Lg = (e, t, n, a) => {
    if (t && typeof t === "object" || typeof t === "function") {
      for (let l of qg(t))
        if (!jg.call(e, l) && l !== n)
          As(e, l, { get: () => t[l], enumerable: !(a = Bg(t, l)) || a.enumerable });
    }
    return e;
  };
  var Aa = (e, t, n) => (n = e != null ? Ug(Hg(e)) : {}, Lg(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    t || !e || !e.__esModule ? As(n, "default", { value: e, enumerable: true }) : n,
    e
  ));

  // ../../.npm-global/lib/node_modules/react-dom/node_modules/scheduler/cjs/scheduler.production.js
  var Os = Lt((Ae) => {
    "use strict";
    function Au(e, t) {
      var n = e.length;
      e.push(t);
      e: for (; 0 < n; ) {
        var a = n - 1 >>> 1, l = e[a];
        if (0 < Mi(l, t))
          e[a] = t, e[n] = l, n = a;
        else break e;
      }
    }
    function Gt(e) {
      return 0 === e.length ? null : e[0];
    }
    function _i(e) {
      if (0 === e.length) return null;
      var t = e[0], n = e.pop();
      if (n !== t) {
        e[0] = n;
        e: for (var a = 0, l = e.length, i = l >>> 1; a < i; ) {
          var u = 2 * (a + 1) - 1, c = e[u], r = u + 1, g = e[r];
          if (0 > Mi(c, n))
            r < l && 0 > Mi(g, c) ? (e[a] = g, e[r] = n, a = r) : (e[a] = c, e[u] = n, a = u);
          else if (r < l && 0 > Mi(g, n))
            e[a] = g, e[r] = n, a = r;
          else break e;
        }
      }
      return t;
    }
    function Mi(e, t) {
      var n = e.sortIndex - t.sortIndex;
      return 0 !== n ? n : e.id - t.id;
    }
    Ae.unstable_now = void 0;
    if ("object" === typeof performance && "function" === typeof performance.now) {
      Es = performance;
      Ae.unstable_now = function() {
        return Es.now();
      };
    } else {
      xu = Date, Cs = xu.now();
      Ae.unstable_now = function() {
        return xu.now() - Cs;
      };
    }
    var Es;
    var xu;
    var Cs;
    var $t = [];
    var zn = [];
    var Gg = 1;
    var zt = null;
    var $e = 3;
    var Eu = false;
    var bl = false;
    var xl = false;
    var Cu = false;
    var Ds = "function" === typeof setTimeout ? setTimeout : null;
    var Ns = "function" === typeof clearTimeout ? clearTimeout : null;
    var Ts = "undefined" !== typeof setImmediate ? setImmediate : null;
    function Ri(e) {
      for (var t = Gt(zn); null !== t; ) {
        if (null === t.callback) _i(zn);
        else if (t.startTime <= e)
          _i(zn), t.sortIndex = t.expirationTime, Au($t, t);
        else break;
        t = Gt(zn);
      }
    }
    function Tu(e) {
      xl = false;
      Ri(e);
      if (!bl)
        if (null !== Gt($t))
          bl = true, Ca || (Ca = true, Ea());
        else {
          var t = Gt(zn);
          null !== t && ku(Tu, t.startTime - e);
        }
    }
    var Ca = false;
    var Sl = -1;
    var Ms = 5;
    var Rs = -1;
    function _s() {
      return Cu ? true : Ae.unstable_now() - Rs < Ms ? false : true;
    }
    function Su() {
      Cu = false;
      if (Ca) {
        var e = Ae.unstable_now();
        Rs = e;
        var t = true;
        try {
          e: {
            bl = false;
            xl && (xl = false, Ns(Sl), Sl = -1);
            Eu = true;
            var n = $e;
            try {
              t: {
                Ri(e);
                for (zt = Gt($t); null !== zt && !(zt.expirationTime > e && _s()); ) {
                  var a = zt.callback;
                  if ("function" === typeof a) {
                    zt.callback = null;
                    $e = zt.priorityLevel;
                    var l = a(
                      zt.expirationTime <= e
                    );
                    e = Ae.unstable_now();
                    if ("function" === typeof l) {
                      zt.callback = l;
                      Ri(e);
                      t = true;
                      break t;
                    }
                    zt === Gt($t) && _i($t);
                    Ri(e);
                  } else _i($t);
                  zt = Gt($t);
                }
                if (null !== zt) t = true;
                else {
                  var i = Gt(zn);
                  null !== i && ku(
                    Tu,
                    i.startTime - e
                  );
                  t = false;
                }
              }
              break e;
            } finally {
              zt = null, $e = n, Eu = false;
            }
            t = void 0;
          }
        } finally {
          t ? Ea() : Ca = false;
        }
      }
    }
    var Ea;
    if ("function" === typeof Ts)
      Ea = function() {
        Ts(Su);
      };
    else if ("undefined" !== typeof MessageChannel) {
      zu = new MessageChannel(), ks = zu.port2;
      zu.port1.onmessage = Su;
      Ea = function() {
        ks.postMessage(null);
      };
    } else
      Ea = function() {
        Ds(Su, 0);
      };
    var zu;
    var ks;
    function ku(e, t) {
      Sl = Ds(function() {
        e(Ae.unstable_now());
      }, t);
    }
    Ae.unstable_IdlePriority = 5;
    Ae.unstable_ImmediatePriority = 1;
    Ae.unstable_LowPriority = 4;
    Ae.unstable_NormalPriority = 3;
    Ae.unstable_Profiling = null;
    Ae.unstable_UserBlockingPriority = 2;
    Ae.unstable_cancelCallback = function(e) {
      e.callback = null;
    };
    Ae.unstable_forceFrameRate = function(e) {
      0 > e || 125 < e ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : Ms = 0 < e ? Math.floor(1e3 / e) : 5;
    };
    Ae.unstable_getCurrentPriorityLevel = function() {
      return $e;
    };
    Ae.unstable_next = function(e) {
      switch ($e) {
        case 1:
        case 2:
        case 3:
          var t = 3;
          break;
        default:
          t = $e;
      }
      var n = $e;
      $e = t;
      try {
        return e();
      } finally {
        $e = n;
      }
    };
    Ae.unstable_requestPaint = function() {
      Cu = true;
    };
    Ae.unstable_runWithPriority = function(e, t) {
      switch (e) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          e = 3;
      }
      var n = $e;
      $e = e;
      try {
        return t();
      } finally {
        $e = n;
      }
    };
    Ae.unstable_scheduleCallback = function(e, t, n) {
      var a = Ae.unstable_now();
      "object" === typeof n && null !== n ? (n = n.delay, n = "number" === typeof n && 0 < n ? a + n : a) : n = a;
      switch (e) {
        case 1:
          var l = -1;
          break;
        case 2:
          l = 250;
          break;
        case 5:
          l = 1073741823;
          break;
        case 4:
          l = 1e4;
          break;
        default:
          l = 5e3;
      }
      l = n + l;
      e = {
        id: Gg++,
        callback: t,
        priorityLevel: e,
        startTime: n,
        expirationTime: l,
        sortIndex: -1
      };
      n > a ? (e.sortIndex = n, Au(zn, e), null === Gt($t) && e === Gt(zn) && (xl ? (Ns(Sl), Sl = -1) : xl = true, ku(Tu, n - a))) : (e.sortIndex = l, Au($t, e), bl || Eu || (bl = true, Ca || (Ca = true, Ea())));
      return e;
    };
    Ae.unstable_shouldYield = _s;
    Ae.unstable_wrapCallback = function(e) {
      var t = $e;
      return function() {
        var n = $e;
        $e = t;
        try {
          return e.apply(this, arguments);
        } finally {
          $e = n;
        }
      };
    };
  });

  // ../../.npm-global/lib/node_modules/react-dom/node_modules/scheduler/index.js
  var Us = Lt((fy, ws) => {
    "use strict";
    if (true) {
      ws.exports = Os();
    } else {
      ws.exports = null;
    }
  });

  // ../../.npm-global/lib/node_modules/react/cjs/react.production.js
  var Qs = Lt((X) => {
    "use strict";
    var Mu = /* @__PURE__ */ Symbol.for("react.transitional.element");
    var Yg = /* @__PURE__ */ Symbol.for("react.portal");
    var Vg = /* @__PURE__ */ Symbol.for("react.fragment");
    var Fg = /* @__PURE__ */ Symbol.for("react.strict_mode");
    var Xg = /* @__PURE__ */ Symbol.for("react.profiler");
    var Qg = /* @__PURE__ */ Symbol.for("react.consumer");
    var Zg = /* @__PURE__ */ Symbol.for("react.context");
    var Jg = /* @__PURE__ */ Symbol.for("react.forward_ref");
    var Kg = /* @__PURE__ */ Symbol.for("react.suspense");
    var Wg = /* @__PURE__ */ Symbol.for("react.memo");
    var Ls = /* @__PURE__ */ Symbol.for("react.lazy");
    var $g = /* @__PURE__ */ Symbol.for("react.activity");
    var Bs = Symbol.iterator;
    function Ig(e) {
      if (null === e || "object" !== typeof e) return null;
      e = Bs && e[Bs] || e["@@iterator"];
      return "function" === typeof e ? e : null;
    }
    var Gs = {
      isMounted: function() {
        return false;
      },
      enqueueForceUpdate: function() {
      },
      enqueueReplaceState: function() {
      },
      enqueueSetState: function() {
      }
    };
    var Ys = Object.assign;
    var Vs = {};
    function ka(e, t, n) {
      this.props = e;
      this.context = t;
      this.refs = Vs;
      this.updater = n || Gs;
    }
    ka.prototype.isReactComponent = {};
    ka.prototype.setState = function(e, t) {
      if ("object" !== typeof e && "function" !== typeof e && null != e)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables."
        );
      this.updater.enqueueSetState(this, e, t, "setState");
    };
    ka.prototype.forceUpdate = function(e) {
      this.updater.enqueueForceUpdate(this, e, "forceUpdate");
    };
    function Fs() {
    }
    Fs.prototype = ka.prototype;
    function Ru(e, t, n) {
      this.props = e;
      this.context = t;
      this.refs = Vs;
      this.updater = n || Gs;
    }
    var _u = Ru.prototype = new Fs();
    _u.constructor = Ru;
    Ys(_u, ka.prototype);
    _u.isPureReactComponent = true;
    var qs = Array.isArray;
    function Nu() {
    }
    var be = { H: null, A: null, T: null, S: null };
    var Xs = Object.prototype.hasOwnProperty;
    function Ou(e, t, n) {
      var a = n.ref;
      return {
        $$typeof: Mu,
        type: e,
        key: t,
        ref: void 0 !== a ? a : null,
        props: n
      };
    }
    function Pg(e, t) {
      return Ou(e.type, t, e.props);
    }
    function wu(e) {
      return "object" === typeof e && null !== e && e.$$typeof === Mu;
    }
    function e1(e) {
      var t = { "=": "=0", ":": "=2" };
      return "$" + e.replace(/[=:]/g, function(n) {
        return t[n];
      });
    }
    var Hs = /\/+/g;
    function Du(e, t) {
      return "object" === typeof e && null !== e && null != e.key ? e1("" + e.key) : t.toString(36);
    }
    function t1(e) {
      switch (e.status) {
        case "fulfilled":
          return e.value;
        case "rejected":
          throw e.reason;
        default:
          switch ("string" === typeof e.status ? e.then(Nu, Nu) : (e.status = "pending", e.then(
            function(t) {
              "pending" === e.status && (e.status = "fulfilled", e.value = t);
            },
            function(t) {
              "pending" === e.status && (e.status = "rejected", e.reason = t);
            }
          )), e.status) {
            case "fulfilled":
              return e.value;
            case "rejected":
              throw e.reason;
          }
      }
      throw e;
    }
    function Ta(e, t, n, a, l) {
      var i = typeof e;
      if ("undefined" === i || "boolean" === i) e = null;
      var u = false;
      if (null === e) u = true;
      else
        switch (i) {
          case "bigint":
          case "string":
          case "number":
            u = true;
            break;
          case "object":
            switch (e.$$typeof) {
              case Mu:
              case Yg:
                u = true;
                break;
              case Ls:
                return u = e._init, Ta(
                  u(e._payload),
                  t,
                  n,
                  a,
                  l
                );
            }
        }
      if (u)
        return l = l(e), u = "" === a ? "." + Du(e, 0) : a, qs(l) ? (n = "", null != u && (n = u.replace(Hs, "$&/") + "/"), Ta(l, t, n, "", function(g) {
          return g;
        })) : null != l && (wu(l) && (l = Pg(
          l,
          n + (null == l.key || e && e.key === l.key ? "" : ("" + l.key).replace(
            Hs,
            "$&/"
          ) + "/") + u
        )), t.push(l)), 1;
      u = 0;
      var c = "" === a ? "." : a + ":";
      if (qs(e))
        for (var r = 0; r < e.length; r++)
          a = e[r], i = c + Du(a, r), u += Ta(
            a,
            t,
            n,
            i,
            l
          );
      else if (r = Ig(e), "function" === typeof r)
        for (e = r.call(e), r = 0; !(a = e.next()).done; )
          a = a.value, i = c + Du(a, r++), u += Ta(
            a,
            t,
            n,
            i,
            l
          );
      else if ("object" === i) {
        if ("function" === typeof e.then)
          return Ta(
            t1(e),
            t,
            n,
            a,
            l
          );
        t = String(e);
        throw Error(
          "Objects are not valid as a React child (found: " + ("[object Object]" === t ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead."
        );
      }
      return u;
    }
    function Oi(e, t, n) {
      if (null == e) return e;
      var a = [], l = 0;
      Ta(e, a, "", "", function(i) {
        return t.call(n, i, l++);
      });
      return a;
    }
    function n1(e) {
      if (-1 === e._status) {
        var t = e._result;
        t = t();
        t.then(
          function(n) {
            if (0 === e._status || -1 === e._status)
              e._status = 1, e._result = n;
          },
          function(n) {
            if (0 === e._status || -1 === e._status)
              e._status = 2, e._result = n;
          }
        );
        -1 === e._status && (e._status = 0, e._result = t);
      }
      if (1 === e._status) return e._result.default;
      throw e._result;
    }
    var js = "function" === typeof reportError ? reportError : function(e) {
      if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
        var t = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: "object" === typeof e && null !== e && "string" === typeof e.message ? String(e.message) : String(e),
          error: e
        });
        if (!window.dispatchEvent(t)) return;
      } else if ("object" === typeof process && "function" === typeof process.emit) {
        process.emit("uncaughtException", e);
        return;
      }
      console.error(e);
    };
    var a1 = {
      map: Oi,
      forEach: function(e, t, n) {
        Oi(
          e,
          function() {
            t.apply(this, arguments);
          },
          n
        );
      },
      count: function(e) {
        var t = 0;
        Oi(e, function() {
          t++;
        });
        return t;
      },
      toArray: function(e) {
        return Oi(e, function(t) {
          return t;
        }) || [];
      },
      only: function(e) {
        if (!wu(e))
          throw Error(
            "React.Children.only expected to receive a single React element child."
          );
        return e;
      }
    };
    X.Activity = $g;
    X.Children = a1;
    X.Component = ka;
    X.Fragment = Vg;
    X.Profiler = Xg;
    X.PureComponent = Ru;
    X.StrictMode = Fg;
    X.Suspense = Kg;
    X.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = be;
    X.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function(e) {
        return be.H.useMemoCache(e);
      }
    };
    X.cache = function(e) {
      return function() {
        return e.apply(null, arguments);
      };
    };
    X.cacheSignal = function() {
      return null;
    };
    X.cloneElement = function(e, t, n) {
      if (null === e || void 0 === e)
        throw Error(
          "The argument must be a React element, but you passed " + e + "."
        );
      var a = Ys({}, e.props), l = e.key;
      if (null != t)
        for (i in void 0 !== t.key && (l = "" + t.key), t)
          !Xs.call(t, i) || "key" === i || "__self" === i || "__source" === i || "ref" === i && void 0 === t.ref || (a[i] = t[i]);
      var i = arguments.length - 2;
      if (1 === i) a.children = n;
      else if (1 < i) {
        for (var u = Array(i), c = 0; c < i; c++)
          u[c] = arguments[c + 2];
        a.children = u;
      }
      return Ou(e.type, l, a);
    };
    X.createContext = function(e) {
      e = {
        $$typeof: Zg,
        _currentValue: e,
        _currentValue2: e,
        _threadCount: 0,
        Provider: null,
        Consumer: null
      };
      e.Provider = e;
      e.Consumer = {
        $$typeof: Qg,
        _context: e
      };
      return e;
    };
    X.createElement = function(e, t, n) {
      var a, l = {}, i = null;
      if (null != t)
        for (a in void 0 !== t.key && (i = "" + t.key), t)
          Xs.call(t, a) && "key" !== a && "__self" !== a && "__source" !== a && (l[a] = t[a]);
      var u = arguments.length - 2;
      if (1 === u) l.children = n;
      else if (1 < u) {
        for (var c = Array(u), r = 0; r < u; r++)
          c[r] = arguments[r + 2];
        l.children = c;
      }
      if (e && e.defaultProps)
        for (a in u = e.defaultProps, u)
          void 0 === l[a] && (l[a] = u[a]);
      return Ou(e, i, l);
    };
    X.createRef = function() {
      return { current: null };
    };
    X.forwardRef = function(e) {
      return { $$typeof: Jg, render: e };
    };
    X.isValidElement = wu;
    X.lazy = function(e) {
      return {
        $$typeof: Ls,
        _payload: { _status: -1, _result: e },
        _init: n1
      };
    };
    X.memo = function(e, t) {
      return {
        $$typeof: Wg,
        type: e,
        compare: void 0 === t ? null : t
      };
    };
    X.startTransition = function(e) {
      var t = be.T, n = {};
      be.T = n;
      try {
        var a = e(), l = be.S;
        null !== l && l(n, a);
        "object" === typeof a && null !== a && "function" === typeof a.then && a.then(Nu, js);
      } catch (i) {
        js(i);
      } finally {
        null !== t && null !== n.types && (t.types = n.types), be.T = t;
      }
    };
    X.unstable_useCacheRefresh = function() {
      return be.H.useCacheRefresh();
    };
    X.use = function(e) {
      return be.H.use(e);
    };
    X.useActionState = function(e, t, n) {
      return be.H.useActionState(e, t, n);
    };
    X.useCallback = function(e, t) {
      return be.H.useCallback(e, t);
    };
    X.useContext = function(e) {
      return be.H.useContext(e);
    };
    X.useDebugValue = function() {
    };
    X.useDeferredValue = function(e, t) {
      return be.H.useDeferredValue(e, t);
    };
    X.useEffect = function(e, t) {
      return be.H.useEffect(e, t);
    };
    X.useEffectEvent = function(e) {
      return be.H.useEffectEvent(e);
    };
    X.useId = function() {
      return be.H.useId();
    };
    X.useImperativeHandle = function(e, t, n) {
      return be.H.useImperativeHandle(e, t, n);
    };
    X.useInsertionEffect = function(e, t) {
      return be.H.useInsertionEffect(e, t);
    };
    X.useLayoutEffect = function(e, t) {
      return be.H.useLayoutEffect(e, t);
    };
    X.useMemo = function(e, t) {
      return be.H.useMemo(e, t);
    };
    X.useOptimistic = function(e, t) {
      return be.H.useOptimistic(e, t);
    };
    X.useReducer = function(e, t, n) {
      return be.H.useReducer(e, t, n);
    };
    X.useRef = function(e) {
      return be.H.useRef(e);
    };
    X.useState = function(e) {
      return be.H.useState(e);
    };
    X.useSyncExternalStore = function(e, t, n) {
      return be.H.useSyncExternalStore(
        e,
        t,
        n
      );
    };
    X.useTransition = function() {
      return be.H.useTransition();
    };
    X.version = "19.2.5";
  });

  // ../../.npm-global/lib/node_modules/react/index.js
  var wi = Lt((py, Zs) => {
    "use strict";
    if (true) {
      Zs.exports = Qs();
    } else {
      Zs.exports = null;
    }
  });

  // ../../.npm-global/lib/node_modules/react-dom/cjs/react-dom.production.js
  var Ks = Lt((Pe) => {
    "use strict";
    var l1 = wi();
    function Js(e) {
      var t = "https://react.dev/errors/" + e;
      if (1 < arguments.length) {
        t += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var n = 2; n < arguments.length; n++)
          t += "&args[]=" + encodeURIComponent(arguments[n]);
      }
      return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    function An() {
    }
    var Ie = {
      d: {
        f: An,
        r: function() {
          throw Error(Js(522));
        },
        D: An,
        C: An,
        L: An,
        m: An,
        X: An,
        S: An,
        M: An
      },
      p: 0,
      findDOMNode: null
    };
    var i1 = /* @__PURE__ */ Symbol.for("react.portal");
    function o1(e, t, n) {
      var a = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
      return {
        $$typeof: i1,
        key: null == a ? null : "" + a,
        children: e,
        containerInfo: t,
        implementation: n
      };
    }
    var zl = l1.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function Ui(e, t) {
      if ("font" === e) return "";
      if ("string" === typeof t)
        return "use-credentials" === t ? t : "";
    }
    Pe.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Ie;
    Pe.createPortal = function(e, t) {
      var n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
      if (!t || 1 !== t.nodeType && 9 !== t.nodeType && 11 !== t.nodeType)
        throw Error(Js(299));
      return o1(e, t, null, n);
    };
    Pe.flushSync = function(e) {
      var t = zl.T, n = Ie.p;
      try {
        if (zl.T = null, Ie.p = 2, e) return e();
      } finally {
        zl.T = t, Ie.p = n, Ie.d.f();
      }
    };
    Pe.preconnect = function(e, t) {
      "string" === typeof e && (t ? (t = t.crossOrigin, t = "string" === typeof t ? "use-credentials" === t ? t : "" : void 0) : t = null, Ie.d.C(e, t));
    };
    Pe.prefetchDNS = function(e) {
      "string" === typeof e && Ie.d.D(e);
    };
    Pe.preinit = function(e, t) {
      if ("string" === typeof e && t && "string" === typeof t.as) {
        var n = t.as, a = Ui(n, t.crossOrigin), l = "string" === typeof t.integrity ? t.integrity : void 0, i = "string" === typeof t.fetchPriority ? t.fetchPriority : void 0;
        "style" === n ? Ie.d.S(
          e,
          "string" === typeof t.precedence ? t.precedence : void 0,
          {
            crossOrigin: a,
            integrity: l,
            fetchPriority: i
          }
        ) : "script" === n && Ie.d.X(e, {
          crossOrigin: a,
          integrity: l,
          fetchPriority: i,
          nonce: "string" === typeof t.nonce ? t.nonce : void 0
        });
      }
    };
    Pe.preinitModule = function(e, t) {
      if ("string" === typeof e)
        if ("object" === typeof t && null !== t) {
          if (null == t.as || "script" === t.as) {
            var n = Ui(
              t.as,
              t.crossOrigin
            );
            Ie.d.M(e, {
              crossOrigin: n,
              integrity: "string" === typeof t.integrity ? t.integrity : void 0,
              nonce: "string" === typeof t.nonce ? t.nonce : void 0
            });
          }
        } else null == t && Ie.d.M(e);
    };
    Pe.preload = function(e, t) {
      if ("string" === typeof e && "object" === typeof t && null !== t && "string" === typeof t.as) {
        var n = t.as, a = Ui(n, t.crossOrigin);
        Ie.d.L(e, n, {
          crossOrigin: a,
          integrity: "string" === typeof t.integrity ? t.integrity : void 0,
          nonce: "string" === typeof t.nonce ? t.nonce : void 0,
          type: "string" === typeof t.type ? t.type : void 0,
          fetchPriority: "string" === typeof t.fetchPriority ? t.fetchPriority : void 0,
          referrerPolicy: "string" === typeof t.referrerPolicy ? t.referrerPolicy : void 0,
          imageSrcSet: "string" === typeof t.imageSrcSet ? t.imageSrcSet : void 0,
          imageSizes: "string" === typeof t.imageSizes ? t.imageSizes : void 0,
          media: "string" === typeof t.media ? t.media : void 0
        });
      }
    };
    Pe.preloadModule = function(e, t) {
      if ("string" === typeof e)
        if (t) {
          var n = Ui(t.as, t.crossOrigin);
          Ie.d.m(e, {
            as: "string" === typeof t.as && "script" !== t.as ? t.as : void 0,
            crossOrigin: n,
            integrity: "string" === typeof t.integrity ? t.integrity : void 0
          });
        } else Ie.d.m(e);
    };
    Pe.requestFormReset = function(e) {
      Ie.d.r(e);
    };
    Pe.unstable_batchedUpdates = function(e, t) {
      return e(t);
    };
    Pe.useFormState = function(e, t, n) {
      return zl.H.useFormState(e, t, n);
    };
    Pe.useFormStatus = function() {
      return zl.H.useHostTransitionStatus();
    };
    Pe.version = "19.2.5";
  });

  // ../../.npm-global/lib/node_modules/react-dom/index.js
  var Is = Lt((my, $s) => {
    "use strict";
    function Ws() {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
        return;
      }
      if (false) {
        throw new Error("^_^");
      }
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Ws);
      } catch (e) {
        console.error(e);
      }
    }
    if (true) {
      Ws();
      $s.exports = Ks();
    } else {
      $s.exports = null;
    }
  });

  // ../../.npm-global/lib/node_modules/react-dom/cjs/react-dom-client.production.js
  var fg = Lt((uu) => {
    "use strict";
    var je = Us();
    var Cd = wi();
    var u1 = Is();
    function A(e) {
      var t = "https://react.dev/errors/" + e;
      if (1 < arguments.length) {
        t += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var n = 2; n < arguments.length; n++)
          t += "&args[]=" + encodeURIComponent(arguments[n]);
      }
      return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    function Td(e) {
      return !(!e || 1 !== e.nodeType && 9 !== e.nodeType && 11 !== e.nodeType);
    }
    function ci(e) {
      var t = e, n = e;
      if (e.alternate) for (; t.return; ) t = t.return;
      else {
        e = t;
        do
          t = e, 0 !== (t.flags & 4098) && (n = t.return), e = t.return;
        while (e);
      }
      return 3 === t.tag ? n : null;
    }
    function kd(e) {
      if (13 === e.tag) {
        var t = e.memoizedState;
        null === t && (e = e.alternate, null !== e && (t = e.memoizedState));
        if (null !== t) return t.dehydrated;
      }
      return null;
    }
    function Dd(e) {
      if (31 === e.tag) {
        var t = e.memoizedState;
        null === t && (e = e.alternate, null !== e && (t = e.memoizedState));
        if (null !== t) return t.dehydrated;
      }
      return null;
    }
    function Ps(e) {
      if (ci(e) !== e)
        throw Error(A(188));
    }
    function c1(e) {
      var t = e.alternate;
      if (!t) {
        t = ci(e);
        if (null === t) throw Error(A(188));
        return t !== e ? null : e;
      }
      for (var n = e, a = t; ; ) {
        var l = n.return;
        if (null === l) break;
        var i = l.alternate;
        if (null === i) {
          a = l.return;
          if (null !== a) {
            n = a;
            continue;
          }
          break;
        }
        if (l.child === i.child) {
          for (i = l.child; i; ) {
            if (i === n) return Ps(l), e;
            if (i === a) return Ps(l), t;
            i = i.sibling;
          }
          throw Error(A(188));
        }
        if (n.return !== a.return) n = l, a = i;
        else {
          for (var u = false, c = l.child; c; ) {
            if (c === n) {
              u = true;
              n = l;
              a = i;
              break;
            }
            if (c === a) {
              u = true;
              a = l;
              n = i;
              break;
            }
            c = c.sibling;
          }
          if (!u) {
            for (c = i.child; c; ) {
              if (c === n) {
                u = true;
                n = i;
                a = l;
                break;
              }
              if (c === a) {
                u = true;
                a = i;
                n = l;
                break;
              }
              c = c.sibling;
            }
            if (!u) throw Error(A(189));
          }
        }
        if (n.alternate !== a) throw Error(A(190));
      }
      if (3 !== n.tag) throw Error(A(188));
      return n.stateNode.current === n ? e : t;
    }
    function Nd(e) {
      var t = e.tag;
      if (5 === t || 26 === t || 27 === t || 6 === t) return e;
      for (e = e.child; null !== e; ) {
        t = Nd(e);
        if (null !== t) return t;
        e = e.sibling;
      }
      return null;
    }
    var ze = Object.assign;
    var r1 = /* @__PURE__ */ Symbol.for("react.element");
    var Bi = /* @__PURE__ */ Symbol.for("react.transitional.element");
    var Ml = /* @__PURE__ */ Symbol.for("react.portal");
    var Oa = /* @__PURE__ */ Symbol.for("react.fragment");
    var Md = /* @__PURE__ */ Symbol.for("react.strict_mode");
    var gc = /* @__PURE__ */ Symbol.for("react.profiler");
    var Rd = /* @__PURE__ */ Symbol.for("react.consumer");
    var on = /* @__PURE__ */ Symbol.for("react.context");
    var rr = /* @__PURE__ */ Symbol.for("react.forward_ref");
    var mc = /* @__PURE__ */ Symbol.for("react.suspense");
    var hc = /* @__PURE__ */ Symbol.for("react.suspense_list");
    var sr = /* @__PURE__ */ Symbol.for("react.memo");
    var En = /* @__PURE__ */ Symbol.for("react.lazy");
    var yc = /* @__PURE__ */ Symbol.for("react.activity");
    var s1 = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel");
    var ef = Symbol.iterator;
    function Al(e) {
      if (null === e || "object" !== typeof e) return null;
      e = ef && e[ef] || e["@@iterator"];
      return "function" === typeof e ? e : null;
    }
    var f1 = /* @__PURE__ */ Symbol.for("react.client.reference");
    function vc(e) {
      if (null == e) return null;
      if ("function" === typeof e)
        return e.$$typeof === f1 ? null : e.displayName || e.name || null;
      if ("string" === typeof e) return e;
      switch (e) {
        case Oa:
          return "Fragment";
        case gc:
          return "Profiler";
        case Md:
          return "StrictMode";
        case mc:
          return "Suspense";
        case hc:
          return "SuspenseList";
        case yc:
          return "Activity";
      }
      if ("object" === typeof e)
        switch (e.$$typeof) {
          case Ml:
            return "Portal";
          case on:
            return e.displayName || "Context";
          case Rd:
            return (e._context.displayName || "Context") + ".Consumer";
          case rr:
            var t = e.render;
            e = e.displayName;
            e || (e = t.displayName || t.name || "", e = "" !== e ? "ForwardRef(" + e + ")" : "ForwardRef");
            return e;
          case sr:
            return t = e.displayName || null, null !== t ? t : vc(e.type) || "Memo";
          case En:
            t = e._payload;
            e = e._init;
            try {
              return vc(e(t));
            } catch (n) {
            }
        }
      return null;
    }
    var Rl = Array.isArray;
    var G = Cd.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    var ie = u1.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    var aa = {
      pending: false,
      data: null,
      method: null,
      action: null
    };
    var bc = [];
    var wa = -1;
    function Qt(e) {
      return { current: e };
    }
    function Ve(e) {
      0 > wa || (e.current = bc[wa], bc[wa] = null, wa--);
    }
    function ye(e, t) {
      wa++;
      bc[wa] = e.current;
      e.current = t;
    }
    var Xt = Qt(null);
    var Jl = Qt(null);
    var Un = Qt(null);
    var ho = Qt(null);
    function yo(e, t) {
      ye(Un, t);
      ye(Jl, e);
      ye(Xt, null);
      switch (t.nodeType) {
        case 9:
        case 11:
          e = (e = t.documentElement) ? (e = e.namespaceURI) ? cd(e) : 0 : 0;
          break;
        default:
          if (e = t.tagName, t = t.namespaceURI)
            t = cd(t), e = $p(t, e);
          else
            switch (e) {
              case "svg":
                e = 1;
                break;
              case "math":
                e = 2;
                break;
              default:
                e = 0;
            }
      }
      Ve(Xt);
      ye(Xt, e);
    }
    function Ia() {
      Ve(Xt);
      Ve(Jl);
      Ve(Un);
    }
    function xc(e) {
      null !== e.memoizedState && ye(ho, e);
      var t = Xt.current;
      var n = $p(t, e.type);
      t !== n && (ye(Jl, e), ye(Xt, n));
    }
    function vo(e) {
      Jl.current === e && (Ve(Xt), Ve(Jl));
      ho.current === e && (Ve(ho), ii._currentValue = aa);
    }
    var Uu;
    var tf;
    function Pn(e) {
      if (void 0 === Uu)
        try {
          throw Error();
        } catch (n) {
          var t = n.stack.trim().match(/\n( *(at )?)/);
          Uu = t && t[1] || "";
          tf = -1 < n.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < n.stack.indexOf("@") ? "@unknown:0:0" : "";
        }
      return "\n" + Uu + e + tf;
    }
    var Bu = false;
    function qu(e, t) {
      if (!e || Bu) return "";
      Bu = true;
      var n = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        var a = {
          DetermineComponentFrameRoot: function() {
            try {
              if (t) {
                var v = function() {
                  throw Error();
                };
                Object.defineProperty(v.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                });
                if ("object" === typeof Reflect && Reflect.construct) {
                  try {
                    Reflect.construct(v, []);
                  } catch (y) {
                    var p = y;
                  }
                  Reflect.construct(e, [], v);
                } else {
                  try {
                    v.call();
                  } catch (y) {
                    p = y;
                  }
                  e.call(v.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (y) {
                  p = y;
                }
                (v = e()) && "function" === typeof v.catch && v.catch(function() {
                });
              }
            } catch (y) {
              if (y && p && "string" === typeof y.stack)
                return [y.stack, p.stack];
            }
            return [null, null];
          }
        };
        a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var l = Object.getOwnPropertyDescriptor(
          a.DetermineComponentFrameRoot,
          "name"
        );
        l && l.configurable && Object.defineProperty(
          a.DetermineComponentFrameRoot,
          "name",
          { value: "DetermineComponentFrameRoot" }
        );
        var i = a.DetermineComponentFrameRoot(), u = i[0], c = i[1];
        if (u && c) {
          var r = u.split("\n"), g = c.split("\n");
          for (l = a = 0; a < r.length && !r[a].includes("DetermineComponentFrameRoot"); )
            a++;
          for (; l < g.length && !g[l].includes(
            "DetermineComponentFrameRoot"
          ); )
            l++;
          if (a === r.length || l === g.length)
            for (a = r.length - 1, l = g.length - 1; 1 <= a && 0 <= l && r[a] !== g[l]; )
              l--;
          for (; 1 <= a && 0 <= l; a--, l--)
            if (r[a] !== g[l]) {
              if (1 !== a || 1 !== l) {
                do
                  if (a--, l--, 0 > l || r[a] !== g[l]) {
                    var m = "\n" + r[a].replace(" at new ", " at ");
                    e.displayName && m.includes("<anonymous>") && (m = m.replace("<anonymous>", e.displayName));
                    return m;
                  }
                while (1 <= a && 0 <= l);
              }
              break;
            }
        }
      } finally {
        Bu = false, Error.prepareStackTrace = n;
      }
      return (n = e ? e.displayName || e.name : "") ? Pn(n) : "";
    }
    function d1(e, t) {
      switch (e.tag) {
        case 26:
        case 27:
        case 5:
          return Pn(e.type);
        case 16:
          return Pn("Lazy");
        case 13:
          return e.child !== t && null !== t ? Pn("Suspense Fallback") : Pn("Suspense");
        case 19:
          return Pn("SuspenseList");
        case 0:
        case 15:
          return qu(e.type, false);
        case 11:
          return qu(e.type.render, false);
        case 1:
          return qu(e.type, true);
        case 31:
          return Pn("Activity");
        default:
          return "";
      }
    }
    function nf(e) {
      try {
        var t = "", n = null;
        do
          t += d1(e, n), n = e, e = e.return;
        while (e);
        return t;
      } catch (a) {
        return "\nError generating stack: " + a.message + "\n" + a.stack;
      }
    }
    var Sc = Object.prototype.hasOwnProperty;
    var fr = je.unstable_scheduleCallback;
    var Hu = je.unstable_cancelCallback;
    var p1 = je.unstable_shouldYield;
    var g1 = je.unstable_requestPaint;
    var mt = je.unstable_now;
    var m1 = je.unstable_getCurrentPriorityLevel;
    var _d = je.unstable_ImmediatePriority;
    var Od = je.unstable_UserBlockingPriority;
    var bo = je.unstable_NormalPriority;
    var h1 = je.unstable_LowPriority;
    var wd = je.unstable_IdlePriority;
    var y1 = je.log;
    var v1 = je.unstable_setDisableYieldValue;
    var ri = null;
    var ht = null;
    function Mn(e) {
      "function" === typeof y1 && v1(e);
      if (ht && "function" === typeof ht.setStrictMode)
        try {
          ht.setStrictMode(ri, e);
        } catch (t) {
        }
    }
    var yt = Math.clz32 ? Math.clz32 : S1;
    var b1 = Math.log;
    var x1 = Math.LN2;
    function S1(e) {
      e >>>= 0;
      return 0 === e ? 32 : 31 - (b1(e) / x1 | 0) | 0;
    }
    var qi = 256;
    var Hi = 262144;
    var ji = 4194304;
    function ea(e) {
      var t = e & 42;
      if (0 !== t) return t;
      switch (e & -e) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 4;
        case 8:
          return 8;
        case 16:
          return 16;
        case 32:
          return 32;
        case 64:
          return 64;
        case 128:
          return 128;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
          return e & 261888;
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return e & 3932160;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return e & 62914560;
        case 67108864:
          return 67108864;
        case 134217728:
          return 134217728;
        case 268435456:
          return 268435456;
        case 536870912:
          return 536870912;
        case 1073741824:
          return 0;
        default:
          return e;
      }
    }
    function Xo(e, t, n) {
      var a = e.pendingLanes;
      if (0 === a) return 0;
      var l = 0, i = e.suspendedLanes, u = e.pingedLanes;
      e = e.warmLanes;
      var c = a & 134217727;
      0 !== c ? (a = c & ~i, 0 !== a ? l = ea(a) : (u &= c, 0 !== u ? l = ea(u) : n || (n = c & ~e, 0 !== n && (l = ea(n))))) : (c = a & ~i, 0 !== c ? l = ea(c) : 0 !== u ? l = ea(u) : n || (n = a & ~e, 0 !== n && (l = ea(n))));
      return 0 === l ? 0 : 0 !== t && t !== l && 0 === (t & i) && (i = l & -l, n = t & -t, i >= n || 32 === i && 0 !== (n & 4194048)) ? t : l;
    }
    function si(e, t) {
      return 0 === (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t);
    }
    function z1(e, t) {
      switch (e) {
        case 1:
        case 2:
        case 4:
        case 8:
        case 64:
          return t + 250;
        case 16:
        case 32:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return t + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return -1;
        case 67108864:
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
          return -1;
        default:
          return -1;
      }
    }
    function Ud() {
      var e = ji;
      ji <<= 1;
      0 === (ji & 62914560) && (ji = 4194304);
      return e;
    }
    function ju(e) {
      for (var t = [], n = 0; 31 > n; n++) t.push(e);
      return t;
    }
    function fi(e, t) {
      e.pendingLanes |= t;
      268435456 !== t && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
    }
    function A1(e, t, n, a, l, i) {
      var u = e.pendingLanes;
      e.pendingLanes = n;
      e.suspendedLanes = 0;
      e.pingedLanes = 0;
      e.warmLanes = 0;
      e.expiredLanes &= n;
      e.entangledLanes &= n;
      e.errorRecoveryDisabledLanes &= n;
      e.shellSuspendCounter = 0;
      var c = e.entanglements, r = e.expirationTimes, g = e.hiddenUpdates;
      for (n = u & ~n; 0 < n; ) {
        var m = 31 - yt(n), v = 1 << m;
        c[m] = 0;
        r[m] = -1;
        var p = g[m];
        if (null !== p)
          for (g[m] = null, m = 0; m < p.length; m++) {
            var y = p[m];
            null !== y && (y.lane &= -536870913);
          }
        n &= ~v;
      }
      0 !== a && Bd(e, a, 0);
      0 !== i && 0 === l && 0 !== e.tag && (e.suspendedLanes |= i & ~(u & ~t));
    }
    function Bd(e, t, n) {
      e.pendingLanes |= t;
      e.suspendedLanes &= ~t;
      var a = 31 - yt(t);
      e.entangledLanes |= t;
      e.entanglements[a] = e.entanglements[a] | 1073741824 | n & 261930;
    }
    function qd(e, t) {
      var n = e.entangledLanes |= t;
      for (e = e.entanglements; n; ) {
        var a = 31 - yt(n), l = 1 << a;
        l & t | e[a] & t && (e[a] |= t);
        n &= ~l;
      }
    }
    function Hd(e, t) {
      var n = t & -t;
      n = 0 !== (n & 42) ? 1 : dr(n);
      return 0 !== (n & (e.suspendedLanes | t)) ? 0 : n;
    }
    function dr(e) {
      switch (e) {
        case 2:
          e = 1;
          break;
        case 8:
          e = 4;
          break;
        case 32:
          e = 16;
          break;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          e = 128;
          break;
        case 268435456:
          e = 134217728;
          break;
        default:
          e = 0;
      }
      return e;
    }
    function pr(e) {
      e &= -e;
      return 2 < e ? 8 < e ? 0 !== (e & 134217727) ? 32 : 268435456 : 8 : 2;
    }
    function jd() {
      var e = ie.p;
      if (0 !== e) return e;
      e = window.event;
      return void 0 === e ? 32 : cg(e.type);
    }
    function af(e, t) {
      var n = ie.p;
      try {
        return ie.p = e, t();
      } finally {
        ie.p = n;
      }
    }
    var Jn = Math.random().toString(36).slice(2);
    var Ze = "__reactFiber$" + Jn;
    var ct = "__reactProps$" + Jn;
    var rl = "__reactContainer$" + Jn;
    var zc = "__reactEvents$" + Jn;
    var E1 = "__reactListeners$" + Jn;
    var C1 = "__reactHandles$" + Jn;
    var lf = "__reactResources$" + Jn;
    var di = "__reactMarker$" + Jn;
    function gr(e) {
      delete e[Ze];
      delete e[ct];
      delete e[zc];
      delete e[E1];
      delete e[C1];
    }
    function Ua(e) {
      var t = e[Ze];
      if (t) return t;
      for (var n = e.parentNode; n; ) {
        if (t = n[rl] || n[Ze]) {
          n = t.alternate;
          if (null !== t.child || null !== n && null !== n.child)
            for (e = pd(e); null !== e; ) {
              if (n = e[Ze]) return n;
              e = pd(e);
            }
          return t;
        }
        e = n;
        n = e.parentNode;
      }
      return null;
    }
    function sl(e) {
      if (e = e[Ze] || e[rl]) {
        var t = e.tag;
        if (5 === t || 6 === t || 13 === t || 31 === t || 26 === t || 27 === t || 3 === t)
          return e;
      }
      return null;
    }
    function _l(e) {
      var t = e.tag;
      if (5 === t || 26 === t || 27 === t || 6 === t) return e.stateNode;
      throw Error(A(33));
    }
    function Xa(e) {
      var t = e[lf];
      t || (t = e[lf] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() });
      return t;
    }
    function Ye(e) {
      e[di] = true;
    }
    var Ld = /* @__PURE__ */ new Set();
    var Gd = {};
    function pa(e, t) {
      Pa(e, t);
      Pa(e + "Capture", t);
    }
    function Pa(e, t) {
      Gd[e] = t;
      for (e = 0; e < t.length; e++)
        Ld.add(t[e]);
    }
    var T1 = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
    );
    var of = {};
    var uf = {};
    function k1(e) {
      if (Sc.call(uf, e))
        return true;
      if (Sc.call(of, e)) return false;
      if (T1.test(e))
        return uf[e] = true;
      of[e] = true;
      return false;
    }
    function eo(e, t, n) {
      if (k1(t))
        if (null === n) e.removeAttribute(t);
        else {
          switch (typeof n) {
            case "undefined":
            case "function":
            case "symbol":
              e.removeAttribute(t);
              return;
            case "boolean":
              var a = t.toLowerCase().slice(0, 5);
              if ("data-" !== a && "aria-" !== a) {
                e.removeAttribute(t);
                return;
              }
          }
          e.setAttribute(t, "" + n);
        }
    }
    function Li(e, t, n) {
      if (null === n) e.removeAttribute(t);
      else {
        switch (typeof n) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            e.removeAttribute(t);
            return;
        }
        e.setAttribute(t, "" + n);
      }
    }
    function It(e, t, n, a) {
      if (null === a) e.removeAttribute(n);
      else {
        switch (typeof a) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            e.removeAttribute(n);
            return;
        }
        e.setAttributeNS(t, n, "" + a);
      }
    }
    function Et(e) {
      switch (typeof e) {
        case "bigint":
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return e;
        default:
          return "";
      }
    }
    function Yd(e) {
      var t = e.type;
      return (e = e.nodeName) && "input" === e.toLowerCase() && ("checkbox" === t || "radio" === t);
    }
    function D1(e, t, n) {
      var a = Object.getOwnPropertyDescriptor(
        e.constructor.prototype,
        t
      );
      if (!e.hasOwnProperty(t) && "undefined" !== typeof a && "function" === typeof a.get && "function" === typeof a.set) {
        var l = a.get, i = a.set;
        Object.defineProperty(e, t, {
          configurable: true,
          get: function() {
            return l.call(this);
          },
          set: function(u) {
            n = "" + u;
            i.call(this, u);
          }
        });
        Object.defineProperty(e, t, {
          enumerable: a.enumerable
        });
        return {
          getValue: function() {
            return n;
          },
          setValue: function(u) {
            n = "" + u;
          },
          stopTracking: function() {
            e._valueTracker = null;
            delete e[t];
          }
        };
      }
    }
    function Ac(e) {
      if (!e._valueTracker) {
        var t = Yd(e) ? "checked" : "value";
        e._valueTracker = D1(
          e,
          t,
          "" + e[t]
        );
      }
    }
    function Vd(e) {
      if (!e) return false;
      var t = e._valueTracker;
      if (!t) return true;
      var n = t.getValue();
      var a = "";
      e && (a = Yd(e) ? e.checked ? "true" : "false" : e.value);
      e = a;
      return e !== n ? (t.setValue(e), true) : false;
    }
    function xo(e) {
      e = e || ("undefined" !== typeof document ? document : void 0);
      if ("undefined" === typeof e) return null;
      try {
        return e.activeElement || e.body;
      } catch (t) {
        return e.body;
      }
    }
    var N1 = /[\n"\\]/g;
    function kt(e) {
      return e.replace(
        N1,
        function(t) {
          return "\\" + t.charCodeAt(0).toString(16) + " ";
        }
      );
    }
    function Ec(e, t, n, a, l, i, u, c) {
      e.name = "";
      null != u && "function" !== typeof u && "symbol" !== typeof u && "boolean" !== typeof u ? e.type = u : e.removeAttribute("type");
      if (null != t)
        if ("number" === u) {
          if (0 === t && "" === e.value || e.value != t)
            e.value = "" + Et(t);
        } else
          e.value !== "" + Et(t) && (e.value = "" + Et(t));
      else
        "submit" !== u && "reset" !== u || e.removeAttribute("value");
      null != t ? Cc(e, u, Et(t)) : null != n ? Cc(e, u, Et(n)) : null != a && e.removeAttribute("value");
      null == l && null != i && (e.defaultChecked = !!i);
      null != l && (e.checked = l && "function" !== typeof l && "symbol" !== typeof l);
      null != c && "function" !== typeof c && "symbol" !== typeof c && "boolean" !== typeof c ? e.name = "" + Et(c) : e.removeAttribute("name");
    }
    function Fd(e, t, n, a, l, i, u, c) {
      null != i && "function" !== typeof i && "symbol" !== typeof i && "boolean" !== typeof i && (e.type = i);
      if (null != t || null != n) {
        if (!("submit" !== i && "reset" !== i || void 0 !== t && null !== t)) {
          Ac(e);
          return;
        }
        n = null != n ? "" + Et(n) : "";
        t = null != t ? "" + Et(t) : n;
        c || t === e.value || (e.value = t);
        e.defaultValue = t;
      }
      a = null != a ? a : l;
      a = "function" !== typeof a && "symbol" !== typeof a && !!a;
      e.checked = c ? e.checked : !!a;
      e.defaultChecked = !!a;
      null != u && "function" !== typeof u && "symbol" !== typeof u && "boolean" !== typeof u && (e.name = u);
      Ac(e);
    }
    function Cc(e, t, n) {
      "number" === t && xo(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
    }
    function Qa(e, t, n, a) {
      e = e.options;
      if (t) {
        t = {};
        for (var l = 0; l < n.length; l++)
          t["$" + n[l]] = true;
        for (n = 0; n < e.length; n++)
          l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && a && (e[n].defaultSelected = true);
      } else {
        n = "" + Et(n);
        t = null;
        for (l = 0; l < e.length; l++) {
          if (e[l].value === n) {
            e[l].selected = true;
            a && (e[l].defaultSelected = true);
            return;
          }
          null !== t || e[l].disabled || (t = e[l]);
        }
        null !== t && (t.selected = true);
      }
    }
    function Xd(e, t, n) {
      if (null != t && (t = "" + Et(t), t !== e.value && (e.value = t), null == n)) {
        e.defaultValue !== t && (e.defaultValue = t);
        return;
      }
      e.defaultValue = null != n ? "" + Et(n) : "";
    }
    function Qd(e, t, n, a) {
      if (null == t) {
        if (null != a) {
          if (null != n) throw Error(A(92));
          if (Rl(a)) {
            if (1 < a.length) throw Error(A(93));
            a = a[0];
          }
          n = a;
        }
        null == n && (n = "");
        t = n;
      }
      n = Et(t);
      e.defaultValue = n;
      a = e.textContent;
      a === n && "" !== a && null !== a && (e.value = a);
      Ac(e);
    }
    function el(e, t) {
      if (t) {
        var n = e.firstChild;
        if (n && n === e.lastChild && 3 === n.nodeType) {
          n.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }
    var M1 = new Set(
      "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
        " "
      )
    );
    function cf(e, t, n) {
      var a = 0 === t.indexOf("--");
      null == n || "boolean" === typeof n || "" === n ? a ? e.setProperty(t, "") : "float" === t ? e.cssFloat = "" : e[t] = "" : a ? e.setProperty(t, n) : "number" !== typeof n || 0 === n || M1.has(t) ? "float" === t ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
    }
    function Zd(e, t, n) {
      if (null != t && "object" !== typeof t)
        throw Error(A(62));
      e = e.style;
      if (null != n) {
        for (var a in n)
          !n.hasOwnProperty(a) || null != t && t.hasOwnProperty(a) || (0 === a.indexOf("--") ? e.setProperty(a, "") : "float" === a ? e.cssFloat = "" : e[a] = "");
        for (var l in t)
          a = t[l], t.hasOwnProperty(l) && n[l] !== a && cf(e, l, a);
      } else
        for (var i in t)
          t.hasOwnProperty(i) && cf(e, i, t[i]);
    }
    function mr(e) {
      if (-1 === e.indexOf("-")) return false;
      switch (e) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return false;
        default:
          return true;
      }
    }
    var R1 = /* @__PURE__ */ new Map([
      ["acceptCharset", "accept-charset"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
      ["crossOrigin", "crossorigin"],
      ["accentHeight", "accent-height"],
      ["alignmentBaseline", "alignment-baseline"],
      ["arabicForm", "arabic-form"],
      ["baselineShift", "baseline-shift"],
      ["capHeight", "cap-height"],
      ["clipPath", "clip-path"],
      ["clipRule", "clip-rule"],
      ["colorInterpolation", "color-interpolation"],
      ["colorInterpolationFilters", "color-interpolation-filters"],
      ["colorProfile", "color-profile"],
      ["colorRendering", "color-rendering"],
      ["dominantBaseline", "dominant-baseline"],
      ["enableBackground", "enable-background"],
      ["fillOpacity", "fill-opacity"],
      ["fillRule", "fill-rule"],
      ["floodColor", "flood-color"],
      ["floodOpacity", "flood-opacity"],
      ["fontFamily", "font-family"],
      ["fontSize", "font-size"],
      ["fontSizeAdjust", "font-size-adjust"],
      ["fontStretch", "font-stretch"],
      ["fontStyle", "font-style"],
      ["fontVariant", "font-variant"],
      ["fontWeight", "font-weight"],
      ["glyphName", "glyph-name"],
      ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
      ["glyphOrientationVertical", "glyph-orientation-vertical"],
      ["horizAdvX", "horiz-adv-x"],
      ["horizOriginX", "horiz-origin-x"],
      ["imageRendering", "image-rendering"],
      ["letterSpacing", "letter-spacing"],
      ["lightingColor", "lighting-color"],
      ["markerEnd", "marker-end"],
      ["markerMid", "marker-mid"],
      ["markerStart", "marker-start"],
      ["overlinePosition", "overline-position"],
      ["overlineThickness", "overline-thickness"],
      ["paintOrder", "paint-order"],
      ["panose-1", "panose-1"],
      ["pointerEvents", "pointer-events"],
      ["renderingIntent", "rendering-intent"],
      ["shapeRendering", "shape-rendering"],
      ["stopColor", "stop-color"],
      ["stopOpacity", "stop-opacity"],
      ["strikethroughPosition", "strikethrough-position"],
      ["strikethroughThickness", "strikethrough-thickness"],
      ["strokeDasharray", "stroke-dasharray"],
      ["strokeDashoffset", "stroke-dashoffset"],
      ["strokeLinecap", "stroke-linecap"],
      ["strokeLinejoin", "stroke-linejoin"],
      ["strokeMiterlimit", "stroke-miterlimit"],
      ["strokeOpacity", "stroke-opacity"],
      ["strokeWidth", "stroke-width"],
      ["textAnchor", "text-anchor"],
      ["textDecoration", "text-decoration"],
      ["textRendering", "text-rendering"],
      ["transformOrigin", "transform-origin"],
      ["underlinePosition", "underline-position"],
      ["underlineThickness", "underline-thickness"],
      ["unicodeBidi", "unicode-bidi"],
      ["unicodeRange", "unicode-range"],
      ["unitsPerEm", "units-per-em"],
      ["vAlphabetic", "v-alphabetic"],
      ["vHanging", "v-hanging"],
      ["vIdeographic", "v-ideographic"],
      ["vMathematical", "v-mathematical"],
      ["vectorEffect", "vector-effect"],
      ["vertAdvY", "vert-adv-y"],
      ["vertOriginX", "vert-origin-x"],
      ["vertOriginY", "vert-origin-y"],
      ["wordSpacing", "word-spacing"],
      ["writingMode", "writing-mode"],
      ["xmlnsXlink", "xmlns:xlink"],
      ["xHeight", "x-height"]
    ]);
    var _1 = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function to(e) {
      return _1.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
    }
    function un() {
    }
    var Tc = null;
    function hr(e) {
      e = e.target || e.srcElement || window;
      e.correspondingUseElement && (e = e.correspondingUseElement);
      return 3 === e.nodeType ? e.parentNode : e;
    }
    var Ba = null;
    var Za = null;
    function rf(e) {
      var t = sl(e);
      if (t && (e = t.stateNode)) {
        var n = e[ct] || null;
        e: switch (e = t.stateNode, t.type) {
          case "input":
            Ec(
              e,
              n.value,
              n.defaultValue,
              n.defaultValue,
              n.checked,
              n.defaultChecked,
              n.type,
              n.name
            );
            t = n.name;
            if ("radio" === n.type && null != t) {
              for (n = e; n.parentNode; ) n = n.parentNode;
              n = n.querySelectorAll(
                'input[name="' + kt(
                  "" + t
                ) + '"][type="radio"]'
              );
              for (t = 0; t < n.length; t++) {
                var a = n[t];
                if (a !== e && a.form === e.form) {
                  var l = a[ct] || null;
                  if (!l) throw Error(A(90));
                  Ec(
                    a,
                    l.value,
                    l.defaultValue,
                    l.defaultValue,
                    l.checked,
                    l.defaultChecked,
                    l.type,
                    l.name
                  );
                }
              }
              for (t = 0; t < n.length; t++)
                a = n[t], a.form === e.form && Vd(a);
            }
            break e;
          case "textarea":
            Xd(e, n.value, n.defaultValue);
            break e;
          case "select":
            t = n.value, null != t && Qa(e, !!n.multiple, t, false);
        }
      }
    }
    var Lu = false;
    function Jd(e, t, n) {
      if (Lu) return e(t, n);
      Lu = true;
      try {
        var a = e(t);
        return a;
      } finally {
        if (Lu = false, null !== Ba || null !== Za) {
          if (au(), Ba && (t = Ba, e = Za, Za = Ba = null, rf(t), e))
            for (t = 0; t < e.length; t++) rf(e[t]);
        }
      }
    }
    function Kl(e, t) {
      var n = e.stateNode;
      if (null === n) return null;
      var a = n[ct] || null;
      if (null === a) return null;
      n = a[t];
      e: switch (t) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          (a = !a.disabled) || (e = e.type, a = !("button" === e || "input" === e || "select" === e || "textarea" === e));
          e = !a;
          break e;
        default:
          e = false;
      }
      if (e) return null;
      if (n && "function" !== typeof n)
        throw Error(
          A(231, t, typeof n)
        );
      return n;
    }
    var dn = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement);
    var kc = false;
    if (dn)
      try {
        Da = {};
        Object.defineProperty(Da, "passive", {
          get: function() {
            kc = true;
          }
        });
        window.addEventListener("test", Da, Da);
        window.removeEventListener("test", Da, Da);
      } catch (e) {
        kc = false;
      }
    var Da;
    var Rn = null;
    var yr = null;
    var no = null;
    function Kd() {
      if (no) return no;
      var e, t = yr, n = t.length, a, l = "value" in Rn ? Rn.value : Rn.textContent, i = l.length;
      for (e = 0; e < n && t[e] === l[e]; e++) ;
      var u = n - e;
      for (a = 1; a <= u && t[n - a] === l[i - a]; a++) ;
      return no = l.slice(e, 1 < a ? 1 - a : void 0);
    }
    function ao(e) {
      var t = e.keyCode;
      "charCode" in e ? (e = e.charCode, 0 === e && 13 === t && (e = 13)) : e = t;
      10 === e && (e = 13);
      return 32 <= e || 13 === e ? e : 0;
    }
    function Gi() {
      return true;
    }
    function sf() {
      return false;
    }
    function rt(e) {
      function t(n, a, l, i, u) {
        this._reactName = n;
        this._targetInst = l;
        this.type = a;
        this.nativeEvent = i;
        this.target = u;
        this.currentTarget = null;
        for (var c in e)
          e.hasOwnProperty(c) && (n = e[c], this[c] = n ? n(i) : i[c]);
        this.isDefaultPrevented = (null != i.defaultPrevented ? i.defaultPrevented : false === i.returnValue) ? Gi : sf;
        this.isPropagationStopped = sf;
        return this;
      }
      ze(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = true;
          var n = this.nativeEvent;
          n && (n.preventDefault ? n.preventDefault() : "unknown" !== typeof n.returnValue && (n.returnValue = false), this.isDefaultPrevented = Gi);
        },
        stopPropagation: function() {
          var n = this.nativeEvent;
          n && (n.stopPropagation ? n.stopPropagation() : "unknown" !== typeof n.cancelBubble && (n.cancelBubble = true), this.isPropagationStopped = Gi);
        },
        persist: function() {
        },
        isPersistent: Gi
      });
      return t;
    }
    var ga = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    };
    var Qo = rt(ga);
    var pi = ze({}, ga, { view: 0, detail: 0 });
    var O1 = rt(pi);
    var Gu;
    var Yu;
    var El;
    var Zo = ze({}, pi, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: vr,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return void 0 === e.relatedTarget ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        if ("movementX" in e) return e.movementX;
        e !== El && (El && "mousemove" === e.type ? (Gu = e.screenX - El.screenX, Yu = e.screenY - El.screenY) : Yu = Gu = 0, El = e);
        return Gu;
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Yu;
      }
    });
    var ff = rt(Zo);
    var w1 = ze({}, Zo, { dataTransfer: 0 });
    var U1 = rt(w1);
    var B1 = ze({}, pi, { relatedTarget: 0 });
    var Vu = rt(B1);
    var q1 = ze({}, ga, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    });
    var H1 = rt(q1);
    var j1 = ze({}, ga, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    });
    var L1 = rt(j1);
    var G1 = ze({}, ga, { data: 0 });
    var df = rt(G1);
    var Y1 = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified"
    };
    var V1 = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta"
    };
    var F1 = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function X1(e) {
      var t = this.nativeEvent;
      return t.getModifierState ? t.getModifierState(e) : (e = F1[e]) ? !!t[e] : false;
    }
    function vr() {
      return X1;
    }
    var Q1 = ze({}, pi, {
      key: function(e) {
        if (e.key) {
          var t = Y1[e.key] || e.key;
          if ("Unidentified" !== t) return t;
        }
        return "keypress" === e.type ? (e = ao(e), 13 === e ? "Enter" : String.fromCharCode(e)) : "keydown" === e.type || "keyup" === e.type ? V1[e.keyCode] || "Unidentified" : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: vr,
      charCode: function(e) {
        return "keypress" === e.type ? ao(e) : 0;
      },
      keyCode: function(e) {
        return "keydown" === e.type || "keyup" === e.type ? e.keyCode : 0;
      },
      which: function(e) {
        return "keypress" === e.type ? ao(e) : "keydown" === e.type || "keyup" === e.type ? e.keyCode : 0;
      }
    });
    var Z1 = rt(Q1);
    var J1 = ze({}, Zo, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0
    });
    var pf = rt(J1);
    var K1 = ze({}, pi, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: vr
    });
    var W1 = rt(K1);
    var $1 = ze({}, ga, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    });
    var I1 = rt($1);
    var P1 = ze({}, Zo, {
      deltaX: function(e) {
        return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
      },
      deltaY: function(e) {
        return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
      },
      deltaZ: 0,
      deltaMode: 0
    });
    var em = rt(P1);
    var tm = ze({}, ga, {
      newState: 0,
      oldState: 0
    });
    var nm = rt(tm);
    var am = [9, 13, 27, 32];
    var br = dn && "CompositionEvent" in window;
    var Ul = null;
    dn && "documentMode" in document && (Ul = document.documentMode);
    var lm = dn && "TextEvent" in window && !Ul;
    var Wd = dn && (!br || Ul && 8 < Ul && 11 >= Ul);
    var gf = String.fromCharCode(32);
    var mf = false;
    function $d(e, t) {
      switch (e) {
        case "keyup":
          return -1 !== am.indexOf(t.keyCode);
        case "keydown":
          return 229 !== t.keyCode;
        case "keypress":
        case "mousedown":
        case "focusout":
          return true;
        default:
          return false;
      }
    }
    function Id(e) {
      e = e.detail;
      return "object" === typeof e && "data" in e ? e.data : null;
    }
    var qa = false;
    function im(e, t) {
      switch (e) {
        case "compositionend":
          return Id(t);
        case "keypress":
          if (32 !== t.which) return null;
          mf = true;
          return gf;
        case "textInput":
          return e = t.data, e === gf && mf ? null : e;
        default:
          return null;
      }
    }
    function om(e, t) {
      if (qa)
        return "compositionend" === e || !br && $d(e, t) ? (e = Kd(), no = yr = Rn = null, qa = false, e) : null;
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
            if (t.char && 1 < t.char.length)
              return t.char;
            if (t.which) return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return Wd && "ko" !== t.locale ? null : t.data;
        default:
          return null;
      }
    }
    var um = {
      color: true,
      date: true,
      datetime: true,
      "datetime-local": true,
      email: true,
      month: true,
      number: true,
      password: true,
      range: true,
      search: true,
      tel: true,
      text: true,
      time: true,
      url: true,
      week: true
    };
    function hf(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return "input" === t ? !!um[e.type] : "textarea" === t ? true : false;
    }
    function Pd(e, t, n, a) {
      Ba ? Za ? Za.push(a) : Za = [a] : Ba = a;
      t = Ho(t, "onChange");
      0 < t.length && (n = new Qo(
        "onChange",
        "change",
        null,
        n,
        a
      ), e.push({ event: n, listeners: t }));
    }
    var Bl = null;
    var Wl = null;
    function cm(e) {
      Jp(e, 0);
    }
    function Jo(e) {
      var t = _l(e);
      if (Vd(t)) return e;
    }
    function yf(e, t) {
      if ("change" === e) return t;
    }
    var e0 = false;
    if (dn) {
      if (dn) {
        Vi = "oninput" in document;
        if (!Vi) {
          Fu = document.createElement("div");
          Fu.setAttribute("oninput", "return;");
          Vi = "function" === typeof Fu.oninput;
        }
        Yi = Vi;
      } else Yi = false;
      e0 = Yi && (!document.documentMode || 9 < document.documentMode);
    }
    var Yi;
    var Vi;
    var Fu;
    function vf() {
      Bl && (Bl.detachEvent("onpropertychange", t0), Wl = Bl = null);
    }
    function t0(e) {
      if ("value" === e.propertyName && Jo(Wl)) {
        var t = [];
        Pd(
          t,
          Wl,
          e,
          hr(e)
        );
        Jd(cm, t);
      }
    }
    function rm(e, t, n) {
      "focusin" === e ? (vf(), Bl = t, Wl = n, Bl.attachEvent("onpropertychange", t0)) : "focusout" === e && vf();
    }
    function sm(e) {
      if ("selectionchange" === e || "keyup" === e || "keydown" === e)
        return Jo(Wl);
    }
    function fm(e, t) {
      if ("click" === e) return Jo(t);
    }
    function dm(e, t) {
      if ("input" === e || "change" === e)
        return Jo(t);
    }
    function pm(e, t) {
      return e === t && (0 !== e || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var bt = "function" === typeof Object.is ? Object.is : pm;
    function $l(e, t) {
      if (bt(e, t)) return true;
      if ("object" !== typeof e || null === e || "object" !== typeof t || null === t)
        return false;
      var n = Object.keys(e), a = Object.keys(t);
      if (n.length !== a.length) return false;
      for (a = 0; a < n.length; a++) {
        var l = n[a];
        if (!Sc.call(t, l) || !bt(e[l], t[l]))
          return false;
      }
      return true;
    }
    function bf(e) {
      for (; e && e.firstChild; ) e = e.firstChild;
      return e;
    }
    function xf(e, t) {
      var n = bf(e);
      e = 0;
      for (var a; n; ) {
        if (3 === n.nodeType) {
          a = e + n.textContent.length;
          if (e <= t && a >= t)
            return { node: n, offset: t - e };
          e = a;
        }
        e: {
          for (; n; ) {
            if (n.nextSibling) {
              n = n.nextSibling;
              break e;
            }
            n = n.parentNode;
          }
          n = void 0;
        }
        n = bf(n);
      }
    }
    function n0(e, t) {
      return e && t ? e === t ? true : e && 3 === e.nodeType ? false : t && 3 === t.nodeType ? n0(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : false : false;
    }
    function a0(e) {
      e = null != e && null != e.ownerDocument && null != e.ownerDocument.defaultView ? e.ownerDocument.defaultView : window;
      for (var t = xo(e.document); t instanceof e.HTMLIFrameElement; ) {
        try {
          var n = "string" === typeof t.contentWindow.location.href;
        } catch (a) {
          n = false;
        }
        if (n) e = t.contentWindow;
        else break;
        t = xo(e.document);
      }
      return t;
    }
    function xr(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && ("input" === t && ("text" === e.type || "search" === e.type || "tel" === e.type || "url" === e.type || "password" === e.type) || "textarea" === t || "true" === e.contentEditable);
    }
    var gm = dn && "documentMode" in document && 11 >= document.documentMode;
    var Ha = null;
    var Dc = null;
    var ql = null;
    var Nc = false;
    function Sf(e, t, n) {
      var a = n.window === n ? n.document : 9 === n.nodeType ? n : n.ownerDocument;
      Nc || null == Ha || Ha !== xo(a) || (a = Ha, "selectionStart" in a && xr(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
        anchorNode: a.anchorNode,
        anchorOffset: a.anchorOffset,
        focusNode: a.focusNode,
        focusOffset: a.focusOffset
      }), ql && $l(ql, a) || (ql = a, a = Ho(Dc, "onSelect"), 0 < a.length && (t = new Qo(
        "onSelect",
        "select",
        null,
        t,
        n
      ), e.push({ event: t, listeners: a }), t.target = Ha)));
    }
    function In(e, t) {
      var n = {};
      n[e.toLowerCase()] = t.toLowerCase();
      n["Webkit" + e] = "webkit" + t;
      n["Moz" + e] = "moz" + t;
      return n;
    }
    var ja = {
      animationend: In("Animation", "AnimationEnd"),
      animationiteration: In("Animation", "AnimationIteration"),
      animationstart: In("Animation", "AnimationStart"),
      transitionrun: In("Transition", "TransitionRun"),
      transitionstart: In("Transition", "TransitionStart"),
      transitioncancel: In("Transition", "TransitionCancel"),
      transitionend: In("Transition", "TransitionEnd")
    };
    var Xu = {};
    var l0 = {};
    dn && (l0 = document.createElement("div").style, "AnimationEvent" in window || (delete ja.animationend.animation, delete ja.animationiteration.animation, delete ja.animationstart.animation), "TransitionEvent" in window || delete ja.transitionend.transition);
    function ma(e) {
      if (Xu[e]) return Xu[e];
      if (!ja[e]) return e;
      var t = ja[e], n;
      for (n in t)
        if (t.hasOwnProperty(n) && n in l0)
          return Xu[e] = t[n];
      return e;
    }
    var i0 = ma("animationend");
    var o0 = ma("animationiteration");
    var u0 = ma("animationstart");
    var mm = ma("transitionrun");
    var hm = ma("transitionstart");
    var ym = ma("transitioncancel");
    var c0 = ma("transitionend");
    var r0 = /* @__PURE__ */ new Map();
    var Mc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " "
    );
    Mc.push("scrollEnd");
    function qt(e, t) {
      r0.set(e, t);
      pa(t, [e]);
    }
    var So = "function" === typeof reportError ? reportError : function(e) {
      if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
        var t = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: "object" === typeof e && null !== e && "string" === typeof e.message ? String(e.message) : String(e),
          error: e
        });
        if (!window.dispatchEvent(t)) return;
      } else if ("object" === typeof process && "function" === typeof process.emit) {
        process.emit("uncaughtException", e);
        return;
      }
      console.error(e);
    };
    var At = [];
    var La = 0;
    var Sr = 0;
    function Ko() {
      for (var e = La, t = Sr = La = 0; t < e; ) {
        var n = At[t];
        At[t++] = null;
        var a = At[t];
        At[t++] = null;
        var l = At[t];
        At[t++] = null;
        var i = At[t];
        At[t++] = null;
        if (null !== a && null !== l) {
          var u = a.pending;
          null === u ? l.next = l : (l.next = u.next, u.next = l);
          a.pending = l;
        }
        0 !== i && s0(n, l, i);
      }
    }
    function Wo(e, t, n, a) {
      At[La++] = e;
      At[La++] = t;
      At[La++] = n;
      At[La++] = a;
      Sr |= a;
      e.lanes |= a;
      e = e.alternate;
      null !== e && (e.lanes |= a);
    }
    function zr(e, t, n, a) {
      Wo(e, t, n, a);
      return zo(e);
    }
    function ha(e, t) {
      Wo(e, null, null, t);
      return zo(e);
    }
    function s0(e, t, n) {
      e.lanes |= n;
      var a = e.alternate;
      null !== a && (a.lanes |= n);
      for (var l = false, i = e.return; null !== i; )
        i.childLanes |= n, a = i.alternate, null !== a && (a.childLanes |= n), 22 === i.tag && (e = i.stateNode, null === e || e._visibility & 1 || (l = true)), e = i, i = i.return;
      return 3 === e.tag ? (i = e.stateNode, l && null !== t && (l = 31 - yt(n), e = i.hiddenUpdates, a = e[l], null === a ? e[l] = [t] : a.push(t), t.lane = n | 536870912), i) : null;
    }
    function zo(e) {
      if (50 < Ql)
        throw Ql = 0, $c = null, Error(A(185));
      for (var t = e.return; null !== t; )
        e = t, t = e.return;
      return 3 === e.tag ? e.stateNode : null;
    }
    var Ga = {};
    function vm(e, t, n, a) {
      this.tag = e;
      this.key = n;
      this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
      this.index = 0;
      this.refCleanup = this.ref = null;
      this.pendingProps = t;
      this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
      this.mode = a;
      this.subtreeFlags = this.flags = 0;
      this.deletions = null;
      this.childLanes = this.lanes = 0;
      this.alternate = null;
    }
    function pt(e, t, n, a) {
      return new vm(e, t, n, a);
    }
    function Ar(e) {
      e = e.prototype;
      return !(!e || !e.isReactComponent);
    }
    function rn(e, t) {
      var n = e.alternate;
      null === n ? (n = pt(
        e.tag,
        t,
        e.key,
        e.mode
      ), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null);
      n.flags = e.flags & 65011712;
      n.childLanes = e.childLanes;
      n.lanes = e.lanes;
      n.child = e.child;
      n.memoizedProps = e.memoizedProps;
      n.memoizedState = e.memoizedState;
      n.updateQueue = e.updateQueue;
      t = e.dependencies;
      n.dependencies = null === t ? null : { lanes: t.lanes, firstContext: t.firstContext };
      n.sibling = e.sibling;
      n.index = e.index;
      n.ref = e.ref;
      n.refCleanup = e.refCleanup;
      return n;
    }
    function f0(e, t) {
      e.flags &= 65011714;
      var n = e.alternate;
      null === n ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = null === t ? null : {
        lanes: t.lanes,
        firstContext: t.firstContext
      });
      return e;
    }
    function lo(e, t, n, a, l, i) {
      var u = 0;
      a = e;
      if ("function" === typeof e) Ar(e) && (u = 1);
      else if ("string" === typeof e)
        u = Sh(
          e,
          n,
          Xt.current
        ) ? 26 : "html" === e || "head" === e || "body" === e ? 27 : 5;
      else
        e: switch (e) {
          case yc:
            return e = pt(31, n, t, l), e.elementType = yc, e.lanes = i, e;
          case Oa:
            return la(n.children, l, i, t);
          case Md:
            u = 8;
            l |= 24;
            break;
          case gc:
            return e = pt(12, n, t, l | 2), e.elementType = gc, e.lanes = i, e;
          case mc:
            return e = pt(13, n, t, l), e.elementType = mc, e.lanes = i, e;
          case hc:
            return e = pt(19, n, t, l), e.elementType = hc, e.lanes = i, e;
          default:
            if ("object" === typeof e && null !== e)
              switch (e.$$typeof) {
                case on:
                  u = 10;
                  break e;
                case Rd:
                  u = 9;
                  break e;
                case rr:
                  u = 11;
                  break e;
                case sr:
                  u = 14;
                  break e;
                case En:
                  u = 16;
                  a = null;
                  break e;
              }
            u = 29;
            n = Error(
              A(130, null === e ? "null" : typeof e, "")
            );
            a = null;
        }
      t = pt(u, n, t, l);
      t.elementType = e;
      t.type = a;
      t.lanes = i;
      return t;
    }
    function la(e, t, n, a) {
      e = pt(7, e, a, t);
      e.lanes = n;
      return e;
    }
    function Qu(e, t, n) {
      e = pt(6, e, null, t);
      e.lanes = n;
      return e;
    }
    function d0(e) {
      var t = pt(18, null, null, 0);
      t.stateNode = e;
      return t;
    }
    function Zu(e, t, n) {
      t = pt(
        4,
        null !== e.children ? e.children : [],
        e.key,
        t
      );
      t.lanes = n;
      t.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        implementation: e.implementation
      };
      return t;
    }
    var zf = /* @__PURE__ */ new WeakMap();
    function Dt(e, t) {
      if ("object" === typeof e && null !== e) {
        var n = zf.get(e);
        if (void 0 !== n) return n;
        t = {
          value: e,
          source: t,
          stack: nf(t)
        };
        zf.set(e, t);
        return t;
      }
      return {
        value: e,
        source: t,
        stack: nf(t)
      };
    }
    var Ya = [];
    var Va = 0;
    var Ao = null;
    var Il = 0;
    var Ct = [];
    var Tt = 0;
    var Fn = null;
    var Yt = 1;
    var Vt = "";
    function an(e, t) {
      Ya[Va++] = Il;
      Ya[Va++] = Ao;
      Ao = e;
      Il = t;
    }
    function p0(e, t, n) {
      Ct[Tt++] = Yt;
      Ct[Tt++] = Vt;
      Ct[Tt++] = Fn;
      Fn = e;
      var a = Yt;
      e = Vt;
      var l = 32 - yt(a) - 1;
      a &= ~(1 << l);
      n += 1;
      var i = 32 - yt(t) + l;
      if (30 < i) {
        var u = l - l % 5;
        i = (a & (1 << u) - 1).toString(32);
        a >>= u;
        l -= u;
        Yt = 1 << 32 - yt(t) + l | n << l | a;
        Vt = i + e;
      } else
        Yt = 1 << i | n << l | a, Vt = e;
    }
    function Er(e) {
      null !== e.return && (an(e, 1), p0(e, 1, 0));
    }
    function Cr(e) {
      for (; e === Ao; )
        Ao = Ya[--Va], Ya[Va] = null, Il = Ya[--Va], Ya[Va] = null;
      for (; e === Fn; )
        Fn = Ct[--Tt], Ct[Tt] = null, Vt = Ct[--Tt], Ct[Tt] = null, Yt = Ct[--Tt], Ct[Tt] = null;
    }
    function g0(e, t) {
      Ct[Tt++] = Yt;
      Ct[Tt++] = Vt;
      Ct[Tt++] = Fn;
      Yt = t.id;
      Vt = t.overflow;
      Fn = e;
    }
    var Je = null;
    var Se = null;
    var P = false;
    var Bn = null;
    var Nt = false;
    var Rc = Error(A(519));
    function Xn(e) {
      var t = Error(
        A(
          418,
          1 < arguments.length && void 0 !== arguments[1] && arguments[1] ? "text" : "HTML",
          ""
        )
      );
      Pl(Dt(t, e));
      throw Rc;
    }
    function Af(e) {
      var t = e.stateNode, n = e.type, a = e.memoizedProps;
      t[Ze] = e;
      t[ct] = a;
      switch (n) {
        case "dialog":
          K("cancel", t);
          K("close", t);
          break;
        case "iframe":
        case "object":
        case "embed":
          K("load", t);
          break;
        case "video":
        case "audio":
          for (n = 0; n < ai.length; n++)
            K(ai[n], t);
          break;
        case "source":
          K("error", t);
          break;
        case "img":
        case "image":
        case "link":
          K("error", t);
          K("load", t);
          break;
        case "details":
          K("toggle", t);
          break;
        case "input":
          K("invalid", t);
          Fd(
            t,
            a.value,
            a.defaultValue,
            a.checked,
            a.defaultChecked,
            a.type,
            a.name,
            true
          );
          break;
        case "select":
          K("invalid", t);
          break;
        case "textarea":
          K("invalid", t), Qd(t, a.value, a.defaultValue, a.children);
      }
      n = a.children;
      "string" !== typeof n && "number" !== typeof n && "bigint" !== typeof n || t.textContent === "" + n || true === a.suppressHydrationWarning || Wp(t.textContent, n) ? (null != a.popover && (K("beforetoggle", t), K("toggle", t)), null != a.onScroll && K("scroll", t), null != a.onScrollEnd && K("scrollend", t), null != a.onClick && (t.onclick = un), t = true) : t = false;
      t || Xn(e, true);
    }
    function Ef(e) {
      for (Je = e.return; Je; )
        switch (Je.tag) {
          case 5:
          case 31:
          case 13:
            Nt = false;
            return;
          case 27:
          case 3:
            Nt = true;
            return;
          default:
            Je = Je.return;
        }
    }
    function Na(e) {
      if (e !== Je) return false;
      if (!P) return Ef(e), P = true, false;
      var t = e.tag, n;
      if (n = 3 !== t && 27 !== t) {
        if (n = 5 === t)
          n = e.type, n = !("form" !== n && "button" !== n) || nr(e.type, e.memoizedProps);
        n = !n;
      }
      n && Se && Xn(e);
      Ef(e);
      if (13 === t) {
        e = e.memoizedState;
        e = null !== e ? e.dehydrated : null;
        if (!e) throw Error(A(317));
        Se = dd(e);
      } else if (31 === t) {
        e = e.memoizedState;
        e = null !== e ? e.dehydrated : null;
        if (!e) throw Error(A(317));
        Se = dd(e);
      } else
        27 === t ? (t = Se, Kn(e.type) ? (e = or, or = null, Se = e) : Se = t) : Se = Je ? Rt(e.stateNode.nextSibling) : null;
      return true;
    }
    function ca() {
      Se = Je = null;
      P = false;
    }
    function Ju() {
      var e = Bn;
      null !== e && (null === ot ? ot = e : ot.push.apply(
        ot,
        e
      ), Bn = null);
      return e;
    }
    function Pl(e) {
      null === Bn ? Bn = [e] : Bn.push(e);
    }
    var _c = Qt(null);
    var ya = null;
    var cn = null;
    function Tn(e, t, n) {
      ye(_c, t._currentValue);
      t._currentValue = n;
    }
    function sn(e) {
      e._currentValue = _c.current;
      Ve(_c);
    }
    function Oc(e, t, n) {
      for (; null !== e; ) {
        var a = e.alternate;
        (e.childLanes & t) !== t ? (e.childLanes |= t, null !== a && (a.childLanes |= t)) : null !== a && (a.childLanes & t) !== t && (a.childLanes |= t);
        if (e === n) break;
        e = e.return;
      }
    }
    function wc(e, t, n, a) {
      var l = e.child;
      null !== l && (l.return = e);
      for (; null !== l; ) {
        var i = l.dependencies;
        if (null !== i) {
          var u = l.child;
          i = i.firstContext;
          e: for (; null !== i; ) {
            var c = i;
            i = l;
            for (var r = 0; r < t.length; r++)
              if (c.context === t[r]) {
                i.lanes |= n;
                c = i.alternate;
                null !== c && (c.lanes |= n);
                Oc(
                  i.return,
                  n,
                  e
                );
                a || (u = null);
                break e;
              }
            i = c.next;
          }
        } else if (18 === l.tag) {
          u = l.return;
          if (null === u) throw Error(A(341));
          u.lanes |= n;
          i = u.alternate;
          null !== i && (i.lanes |= n);
          Oc(u, n, e);
          u = null;
        } else u = l.child;
        if (null !== u) u.return = l;
        else
          for (u = l; null !== u; ) {
            if (u === e) {
              u = null;
              break;
            }
            l = u.sibling;
            if (null !== l) {
              l.return = u.return;
              u = l;
              break;
            }
            u = u.return;
          }
        l = u;
      }
    }
    function fl(e, t, n, a) {
      e = null;
      for (var l = t, i = false; null !== l; ) {
        if (!i) {
          if (0 !== (l.flags & 524288)) i = true;
          else if (0 !== (l.flags & 262144)) break;
        }
        if (10 === l.tag) {
          var u = l.alternate;
          if (null === u) throw Error(A(387));
          u = u.memoizedProps;
          if (null !== u) {
            var c = l.type;
            bt(l.pendingProps.value, u.value) || (null !== e ? e.push(c) : e = [c]);
          }
        } else if (l === ho.current) {
          u = l.alternate;
          if (null === u) throw Error(A(387));
          u.memoizedState.memoizedState !== l.memoizedState.memoizedState && (null !== e ? e.push(ii) : e = [ii]);
        }
        l = l.return;
      }
      null !== e && wc(
        t,
        e,
        n,
        a
      );
      t.flags |= 262144;
    }
    function Eo(e) {
      for (e = e.firstContext; null !== e; ) {
        if (!bt(
          e.context._currentValue,
          e.memoizedValue
        ))
          return true;
        e = e.next;
      }
      return false;
    }
    function ra(e) {
      ya = e;
      cn = null;
      e = e.dependencies;
      null !== e && (e.firstContext = null);
    }
    function Ke(e) {
      return m0(ya, e);
    }
    function Fi(e, t) {
      null === ya && ra(e);
      return m0(e, t);
    }
    function m0(e, t) {
      var n = t._currentValue;
      t = { context: t, memoizedValue: n, next: null };
      if (null === cn) {
        if (null === e) throw Error(A(308));
        cn = t;
        e.dependencies = { lanes: 0, firstContext: t };
        e.flags |= 524288;
      } else cn = cn.next = t;
      return n;
    }
    var bm = "undefined" !== typeof AbortController ? AbortController : function() {
      var e = [], t = this.signal = {
        aborted: false,
        addEventListener: function(n, a) {
          e.push(a);
        }
      };
      this.abort = function() {
        t.aborted = true;
        e.forEach(function(n) {
          return n();
        });
      };
    };
    var xm = je.unstable_scheduleCallback;
    var Sm = je.unstable_NormalPriority;
    var Oe = {
      $$typeof: on,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0
    };
    function Tr() {
      return {
        controller: new bm(),
        data: /* @__PURE__ */ new Map(),
        refCount: 0
      };
    }
    function gi(e) {
      e.refCount--;
      0 === e.refCount && xm(Sm, function() {
        e.controller.abort();
      });
    }
    var Hl = null;
    var Uc = 0;
    var tl = 0;
    var Ja = null;
    function zm(e, t) {
      if (null === Hl) {
        var n = Hl = [];
        Uc = 0;
        tl = $r();
        Ja = {
          status: "pending",
          value: void 0,
          then: function(a) {
            n.push(a);
          }
        };
      }
      Uc++;
      t.then(Cf, Cf);
      return t;
    }
    function Cf() {
      if (0 === --Uc && null !== Hl) {
        null !== Ja && (Ja.status = "fulfilled");
        var e = Hl;
        Hl = null;
        tl = 0;
        Ja = null;
        for (var t = 0; t < e.length; t++) (0, e[t])();
      }
    }
    function Am(e, t) {
      var n = [], a = {
        status: "pending",
        value: null,
        reason: null,
        then: function(l) {
          n.push(l);
        }
      };
      e.then(
        function() {
          a.status = "fulfilled";
          a.value = t;
          for (var l = 0; l < n.length; l++) (0, n[l])(t);
        },
        function(l) {
          a.status = "rejected";
          a.reason = l;
          for (l = 0; l < n.length; l++)
            (0, n[l])(void 0);
        }
      );
      return a;
    }
    var Tf = G.S;
    G.S = function(e, t) {
      Np = mt();
      "object" === typeof t && null !== t && "function" === typeof t.then && zm(e, t);
      null !== Tf && Tf(e, t);
    };
    var ia = Qt(null);
    function kr() {
      var e = ia.current;
      return null !== e ? e : me.pooledCache;
    }
    function io(e, t) {
      null === t ? ye(ia, ia.current) : ye(ia, t.pool);
    }
    function h0() {
      var e = kr();
      return null === e ? null : { parent: Oe._currentValue, pool: e };
    }
    var dl = Error(A(460));
    var Dr = Error(A(474));
    var $o = Error(A(542));
    var Co = { then: function() {
    } };
    function kf(e) {
      e = e.status;
      return "fulfilled" === e || "rejected" === e;
    }
    function y0(e, t, n) {
      n = e[n];
      void 0 === n ? e.push(t) : n !== t && (t.then(un, un), t = n);
      switch (t.status) {
        case "fulfilled":
          return t.value;
        case "rejected":
          throw e = t.reason, Nf(e), e;
        default:
          if ("string" === typeof t.status) t.then(un, un);
          else {
            e = me;
            if (null !== e && 100 < e.shellSuspendCounter)
              throw Error(A(482));
            e = t;
            e.status = "pending";
            e.then(
              function(a) {
                if ("pending" === t.status) {
                  var l = t;
                  l.status = "fulfilled";
                  l.value = a;
                }
              },
              function(a) {
                if ("pending" === t.status) {
                  var l = t;
                  l.status = "rejected";
                  l.reason = a;
                }
              }
            );
          }
          switch (t.status) {
            case "fulfilled":
              return t.value;
            case "rejected":
              throw e = t.reason, Nf(e), e;
          }
          oa = t;
          throw dl;
      }
    }
    function ta(e) {
      try {
        var t = e._init;
        return t(e._payload);
      } catch (n) {
        if (null !== n && "object" === typeof n && "function" === typeof n.then)
          throw oa = n, dl;
        throw n;
      }
    }
    var oa = null;
    function Df() {
      if (null === oa) throw Error(A(459));
      var e = oa;
      oa = null;
      return e;
    }
    function Nf(e) {
      if (e === dl || e === $o)
        throw Error(A(483));
    }
    var Ka = null;
    var ei = 0;
    function Xi(e) {
      var t = ei;
      ei += 1;
      null === Ka && (Ka = []);
      return y0(Ka, e, t);
    }
    function Cl(e, t) {
      t = t.props.ref;
      e.ref = void 0 !== t ? t : null;
    }
    function Qi(e, t) {
      if (t.$$typeof === r1)
        throw Error(A(525));
      e = Object.prototype.toString.call(t);
      throw Error(
        A(
          31,
          "[object Object]" === e ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
        )
      );
    }
    function v0(e) {
      function t(f, d) {
        if (e) {
          var h = f.deletions;
          null === h ? (f.deletions = [d], f.flags |= 16) : h.push(d);
        }
      }
      function n(f, d) {
        if (!e) return null;
        for (; null !== d; )
          t(f, d), d = d.sibling;
        return null;
      }
      function a(f) {
        for (var d = /* @__PURE__ */ new Map(); null !== f; )
          null !== f.key ? d.set(f.key, f) : d.set(f.index, f), f = f.sibling;
        return d;
      }
      function l(f, d) {
        f = rn(f, d);
        f.index = 0;
        f.sibling = null;
        return f;
      }
      function i(f, d, h) {
        f.index = h;
        if (!e)
          return f.flags |= 1048576, d;
        h = f.alternate;
        if (null !== h)
          return h = h.index, h < d ? (f.flags |= 67108866, d) : h;
        f.flags |= 67108866;
        return d;
      }
      function u(f) {
        e && null === f.alternate && (f.flags |= 67108866);
        return f;
      }
      function c(f, d, h, b) {
        if (null === d || 6 !== d.tag)
          return d = Qu(h, f.mode, b), d.return = f, d;
        d = l(d, h);
        d.return = f;
        return d;
      }
      function r(f, d, h, b) {
        var k = h.type;
        if (k === Oa)
          return m(
            f,
            d,
            h.props.children,
            b,
            h.key
          );
        if (null !== d && (d.elementType === k || "object" === typeof k && null !== k && k.$$typeof === En && ta(k) === d.type))
          return d = l(d, h.props), Cl(d, h), d.return = f, d;
        d = lo(
          h.type,
          h.key,
          h.props,
          null,
          f.mode,
          b
        );
        Cl(d, h);
        d.return = f;
        return d;
      }
      function g(f, d, h, b) {
        if (null === d || 4 !== d.tag || d.stateNode.containerInfo !== h.containerInfo || d.stateNode.implementation !== h.implementation)
          return d = Zu(h, f.mode, b), d.return = f, d;
        d = l(d, h.children || []);
        d.return = f;
        return d;
      }
      function m(f, d, h, b, k) {
        if (null === d || 7 !== d.tag)
          return d = la(
            h,
            f.mode,
            b,
            k
          ), d.return = f, d;
        d = l(d, h);
        d.return = f;
        return d;
      }
      function v(f, d, h) {
        if ("string" === typeof d && "" !== d || "number" === typeof d || "bigint" === typeof d)
          return d = Qu(
            "" + d,
            f.mode,
            h
          ), d.return = f, d;
        if ("object" === typeof d && null !== d) {
          switch (d.$$typeof) {
            case Bi:
              return h = lo(
                d.type,
                d.key,
                d.props,
                null,
                f.mode,
                h
              ), Cl(h, d), h.return = f, h;
            case Ml:
              return d = Zu(
                d,
                f.mode,
                h
              ), d.return = f, d;
            case En:
              return d = ta(d), v(f, d, h);
          }
          if (Rl(d) || Al(d))
            return d = la(
              d,
              f.mode,
              h,
              null
            ), d.return = f, d;
          if ("function" === typeof d.then)
            return v(f, Xi(d), h);
          if (d.$$typeof === on)
            return v(
              f,
              Fi(f, d),
              h
            );
          Qi(f, d);
        }
        return null;
      }
      function p(f, d, h, b) {
        var k = null !== d ? d.key : null;
        if ("string" === typeof h && "" !== h || "number" === typeof h || "bigint" === typeof h)
          return null !== k ? null : c(f, d, "" + h, b);
        if ("object" === typeof h && null !== h) {
          switch (h.$$typeof) {
            case Bi:
              return h.key === k ? r(f, d, h, b) : null;
            case Ml:
              return h.key === k ? g(f, d, h, b) : null;
            case En:
              return h = ta(h), p(f, d, h, b);
          }
          if (Rl(h) || Al(h))
            return null !== k ? null : m(f, d, h, b, null);
          if ("function" === typeof h.then)
            return p(
              f,
              d,
              Xi(h),
              b
            );
          if (h.$$typeof === on)
            return p(
              f,
              d,
              Fi(f, h),
              b
            );
          Qi(f, h);
        }
        return null;
      }
      function y(f, d, h, b, k) {
        if ("string" === typeof b && "" !== b || "number" === typeof b || "bigint" === typeof b)
          return f = f.get(h) || null, c(d, f, "" + b, k);
        if ("object" === typeof b && null !== b) {
          switch (b.$$typeof) {
            case Bi:
              return f = f.get(
                null === b.key ? h : b.key
              ) || null, r(d, f, b, k);
            case Ml:
              return f = f.get(
                null === b.key ? h : b.key
              ) || null, g(d, f, b, k);
            case En:
              return b = ta(b), y(
                f,
                d,
                h,
                b,
                k
              );
          }
          if (Rl(b) || Al(b))
            return f = f.get(h) || null, m(d, f, b, k, null);
          if ("function" === typeof b.then)
            return y(
              f,
              d,
              h,
              Xi(b),
              k
            );
          if (b.$$typeof === on)
            return y(
              f,
              d,
              h,
              Fi(d, b),
              k
            );
          Qi(d, b);
        }
        return null;
      }
      function T(f, d, h, b) {
        for (var k = null, D = null, E = d, j = d = 0, L = null; null !== E && j < h.length; j++) {
          E.index > j ? (L = E, E = null) : L = E.sibling;
          var q = p(
            f,
            E,
            h[j],
            b
          );
          if (null === q) {
            null === E && (E = L);
            break;
          }
          e && E && null === q.alternate && t(f, E);
          d = i(q, d, j);
          null === D ? k = q : D.sibling = q;
          D = q;
          E = L;
        }
        if (j === h.length)
          return n(f, E), P && an(f, j), k;
        if (null === E) {
          for (; j < h.length; j++)
            E = v(f, h[j], b), null !== E && (d = i(
              E,
              d,
              j
            ), null === D ? k = E : D.sibling = E, D = E);
          P && an(f, j);
          return k;
        }
        for (E = a(E); j < h.length; j++)
          L = y(
            E,
            f,
            j,
            h[j],
            b
          ), null !== L && (e && null !== L.alternate && E.delete(
            null === L.key ? j : L.key
          ), d = i(
            L,
            d,
            j
          ), null === D ? k = L : D.sibling = L, D = L);
        e && E.forEach(function(Y) {
          return t(f, Y);
        });
        P && an(f, j);
        return k;
      }
      function z(f, d, h, b) {
        if (null == h) throw Error(A(151));
        for (var k = null, D = null, E = d, j = d = 0, L = null, q = h.next(); null !== E && !q.done; j++, q = h.next()) {
          E.index > j ? (L = E, E = null) : L = E.sibling;
          var Y = p(f, E, q.value, b);
          if (null === Y) {
            null === E && (E = L);
            break;
          }
          e && E && null === Y.alternate && t(f, E);
          d = i(Y, d, j);
          null === D ? k = Y : D.sibling = Y;
          D = Y;
          E = L;
        }
        if (q.done)
          return n(f, E), P && an(f, j), k;
        if (null === E) {
          for (; !q.done; j++, q = h.next())
            q = v(f, q.value, b), null !== q && (d = i(q, d, j), null === D ? k = q : D.sibling = q, D = q);
          P && an(f, j);
          return k;
        }
        for (E = a(E); !q.done; j++, q = h.next())
          q = y(E, f, j, q.value, b), null !== q && (e && null !== q.alternate && E.delete(null === q.key ? j : q.key), d = i(q, d, j), null === D ? k = q : D.sibling = q, D = q);
        e && E.forEach(function(Ue) {
          return t(f, Ue);
        });
        P && an(f, j);
        return k;
      }
      function U(f, d, h, b) {
        "object" === typeof h && null !== h && h.type === Oa && null === h.key && (h = h.props.children);
        if ("object" === typeof h && null !== h) {
          switch (h.$$typeof) {
            case Bi:
              e: {
                for (var k = h.key; null !== d; ) {
                  if (d.key === k) {
                    k = h.type;
                    if (k === Oa) {
                      if (7 === d.tag) {
                        n(
                          f,
                          d.sibling
                        );
                        b = l(
                          d,
                          h.props.children
                        );
                        b.return = f;
                        f = b;
                        break e;
                      }
                    } else if (d.elementType === k || "object" === typeof k && null !== k && k.$$typeof === En && ta(k) === d.type) {
                      n(
                        f,
                        d.sibling
                      );
                      b = l(d, h.props);
                      Cl(b, h);
                      b.return = f;
                      f = b;
                      break e;
                    }
                    n(f, d);
                    break;
                  } else t(f, d);
                  d = d.sibling;
                }
                h.type === Oa ? (b = la(
                  h.props.children,
                  f.mode,
                  b,
                  h.key
                ), b.return = f, f = b) : (b = lo(
                  h.type,
                  h.key,
                  h.props,
                  null,
                  f.mode,
                  b
                ), Cl(b, h), b.return = f, f = b);
              }
              return u(f);
            case Ml:
              e: {
                for (k = h.key; null !== d; ) {
                  if (d.key === k)
                    if (4 === d.tag && d.stateNode.containerInfo === h.containerInfo && d.stateNode.implementation === h.implementation) {
                      n(
                        f,
                        d.sibling
                      );
                      b = l(d, h.children || []);
                      b.return = f;
                      f = b;
                      break e;
                    } else {
                      n(f, d);
                      break;
                    }
                  else t(f, d);
                  d = d.sibling;
                }
                b = Zu(h, f.mode, b);
                b.return = f;
                f = b;
              }
              return u(f);
            case En:
              return h = ta(h), U(
                f,
                d,
                h,
                b
              );
          }
          if (Rl(h))
            return T(
              f,
              d,
              h,
              b
            );
          if (Al(h)) {
            k = Al(h);
            if ("function" !== typeof k) throw Error(A(150));
            h = k.call(h);
            return z(
              f,
              d,
              h,
              b
            );
          }
          if ("function" === typeof h.then)
            return U(
              f,
              d,
              Xi(h),
              b
            );
          if (h.$$typeof === on)
            return U(
              f,
              d,
              Fi(f, h),
              b
            );
          Qi(f, h);
        }
        return "string" === typeof h && "" !== h || "number" === typeof h || "bigint" === typeof h ? (h = "" + h, null !== d && 6 === d.tag ? (n(f, d.sibling), b = l(d, h), b.return = f, f = b) : (n(f, d), b = Qu(h, f.mode, b), b.return = f, f = b), u(f)) : n(f, d);
      }
      return function(f, d, h, b) {
        try {
          ei = 0;
          var k = U(
            f,
            d,
            h,
            b
          );
          Ka = null;
          return k;
        } catch (E) {
          if (E === dl || E === $o) throw E;
          var D = pt(29, E, null, f.mode);
          D.lanes = b;
          D.return = f;
          return D;
        } finally {
        }
      };
    }
    var sa = v0(true);
    var b0 = v0(false);
    var Cn = false;
    function Nr(e) {
      e.updateQueue = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: { pending: null, lanes: 0, hiddenCallbacks: null },
        callbacks: null
      };
    }
    function Bc(e, t) {
      e = e.updateQueue;
      t.updateQueue === e && (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        callbacks: null
      });
    }
    function qn(e) {
      return { lane: e, tag: 0, payload: null, callback: null, next: null };
    }
    function Hn(e, t, n) {
      var a = e.updateQueue;
      if (null === a) return null;
      a = a.shared;
      if (0 !== (le & 2)) {
        var l = a.pending;
        null === l ? t.next = t : (t.next = l.next, l.next = t);
        a.pending = t;
        t = zo(e);
        s0(e, null, n);
        return t;
      }
      Wo(e, a, t, n);
      return zo(e);
    }
    function jl(e, t, n) {
      t = t.updateQueue;
      if (null !== t && (t = t.shared, 0 !== (n & 4194048))) {
        var a = t.lanes;
        a &= e.pendingLanes;
        n |= a;
        t.lanes = n;
        qd(e, n);
      }
    }
    function Ku(e, t) {
      var n = e.updateQueue, a = e.alternate;
      if (null !== a && (a = a.updateQueue, n === a)) {
        var l = null, i = null;
        n = n.firstBaseUpdate;
        if (null !== n) {
          do {
            var u = {
              lane: n.lane,
              tag: n.tag,
              payload: n.payload,
              callback: null,
              next: null
            };
            null === i ? l = i = u : i = i.next = u;
            n = n.next;
          } while (null !== n);
          null === i ? l = i = t : i = i.next = t;
        } else l = i = t;
        n = {
          baseState: a.baseState,
          firstBaseUpdate: l,
          lastBaseUpdate: i,
          shared: a.shared,
          callbacks: a.callbacks
        };
        e.updateQueue = n;
        return;
      }
      e = n.lastBaseUpdate;
      null === e ? n.firstBaseUpdate = t : e.next = t;
      n.lastBaseUpdate = t;
    }
    var qc = false;
    function Ll() {
      if (qc) {
        var e = Ja;
        if (null !== e) throw e;
      }
    }
    function Gl(e, t, n, a) {
      qc = false;
      var l = e.updateQueue;
      Cn = false;
      var i = l.firstBaseUpdate, u = l.lastBaseUpdate, c = l.shared.pending;
      if (null !== c) {
        l.shared.pending = null;
        var r = c, g = r.next;
        r.next = null;
        null === u ? i = g : u.next = g;
        u = r;
        var m = e.alternate;
        null !== m && (m = m.updateQueue, c = m.lastBaseUpdate, c !== u && (null === c ? m.firstBaseUpdate = g : c.next = g, m.lastBaseUpdate = r));
      }
      if (null !== i) {
        var v = l.baseState;
        u = 0;
        m = g = r = null;
        c = i;
        do {
          var p = c.lane & -536870913, y = p !== c.lane;
          if (y ? (I & p) === p : (a & p) === p) {
            0 !== p && p === tl && (qc = true);
            null !== m && (m = m.next = {
              lane: 0,
              tag: c.tag,
              payload: c.payload,
              callback: null,
              next: null
            });
            e: {
              var T = e, z = c;
              p = t;
              var U = n;
              switch (z.tag) {
                case 1:
                  T = z.payload;
                  if ("function" === typeof T) {
                    v = T.call(U, v, p);
                    break e;
                  }
                  v = T;
                  break e;
                case 3:
                  T.flags = T.flags & -65537 | 128;
                case 0:
                  T = z.payload;
                  p = "function" === typeof T ? T.call(U, v, p) : T;
                  if (null === p || void 0 === p) break e;
                  v = ze({}, v, p);
                  break e;
                case 2:
                  Cn = true;
              }
            }
            p = c.callback;
            null !== p && (e.flags |= 64, y && (e.flags |= 8192), y = l.callbacks, null === y ? l.callbacks = [p] : y.push(p));
          } else
            y = {
              lane: p,
              tag: c.tag,
              payload: c.payload,
              callback: c.callback,
              next: null
            }, null === m ? (g = m = y, r = v) : m = m.next = y, u |= p;
          c = c.next;
          if (null === c)
            if (c = l.shared.pending, null === c)
              break;
            else
              y = c, c = y.next, y.next = null, l.lastBaseUpdate = y, l.shared.pending = null;
        } while (1);
        null === m && (r = v);
        l.baseState = r;
        l.firstBaseUpdate = g;
        l.lastBaseUpdate = m;
        null === i && (l.shared.lanes = 0);
        Zn |= u;
        e.lanes = u;
        e.memoizedState = v;
      }
    }
    function x0(e, t) {
      if ("function" !== typeof e)
        throw Error(A(191, e));
      e.call(t);
    }
    function S0(e, t) {
      var n = e.callbacks;
      if (null !== n)
        for (e.callbacks = null, e = 0; e < n.length; e++)
          x0(n[e], t);
    }
    var nl = Qt(null);
    var To = Qt(0);
    function Mf(e, t) {
      e = hn;
      ye(To, e);
      ye(nl, t);
      hn = e | t.baseLanes;
    }
    function Hc() {
      ye(To, hn);
      ye(nl, nl.current);
    }
    function Mr() {
      hn = To.current;
      Ve(nl);
      Ve(To);
    }
    var xt = Qt(null);
    var Mt = null;
    function kn(e) {
      var t = e.alternate;
      ye(ke, ke.current & 1);
      ye(xt, e);
      null === Mt && (null === t || null !== nl.current ? Mt = e : null !== t.memoizedState && (Mt = e));
    }
    function jc(e) {
      ye(ke, ke.current);
      ye(xt, e);
      null === Mt && (Mt = e);
    }
    function z0(e) {
      22 === e.tag ? (ye(ke, ke.current), ye(xt, e), null === Mt && (Mt = e)) : Dn(e);
    }
    function Dn() {
      ye(ke, ke.current);
      ye(xt, xt.current);
    }
    function dt(e) {
      Ve(xt);
      Mt === e && (Mt = null);
      Ve(ke);
    }
    var ke = Qt(0);
    function ko(e) {
      for (var t = e; null !== t; ) {
        if (13 === t.tag) {
          var n = t.memoizedState;
          if (null !== n && (n = n.dehydrated, null === n || lr(n) || ir(n)))
            return t;
        } else if (19 === t.tag && ("forwards" === t.memoizedProps.revealOrder || "backwards" === t.memoizedProps.revealOrder || "unstable_legacy-backwards" === t.memoizedProps.revealOrder || "together" === t.memoizedProps.revealOrder)) {
          if (0 !== (t.flags & 128)) return t;
        } else if (null !== t.child) {
          t.child.return = t;
          t = t.child;
          continue;
        }
        if (t === e) break;
        for (; null === t.sibling; ) {
          if (null === t.return || t.return === e) return null;
          t = t.return;
        }
        t.sibling.return = t.return;
        t = t.sibling;
      }
      return null;
    }
    var pn = 0;
    var Q = null;
    var pe = null;
    var Re = null;
    var Do = false;
    var Wa = false;
    var fa = false;
    var No = 0;
    var ti = 0;
    var $a = null;
    var Em = 0;
    function Ce() {
      throw Error(A(321));
    }
    function Rr(e, t) {
      if (null === t) return false;
      for (var n = 0; n < t.length && n < e.length; n++)
        if (!bt(e[n], t[n])) return false;
      return true;
    }
    function _r(e, t, n, a, l, i) {
      pn = i;
      Q = t;
      t.memoizedState = null;
      t.updateQueue = null;
      t.lanes = 0;
      G.H = null === e || null === e.memoizedState ? P0 : Vr;
      fa = false;
      i = n(a, l);
      fa = false;
      Wa && (i = E0(
        t,
        n,
        a,
        l
      ));
      A0(e);
      return i;
    }
    function A0(e) {
      G.H = ni;
      var t = null !== pe && null !== pe.next;
      pn = 0;
      Re = pe = Q = null;
      Do = false;
      ti = 0;
      $a = null;
      if (t) throw Error(A(300));
      null === e || we || (e = e.dependencies, null !== e && Eo(e) && (we = true));
    }
    function E0(e, t, n, a) {
      Q = e;
      var l = 0;
      do {
        Wa && ($a = null);
        ti = 0;
        Wa = false;
        if (25 <= l) throw Error(A(301));
        l += 1;
        Re = pe = null;
        if (null != e.updateQueue) {
          var i = e.updateQueue;
          i.lastEffect = null;
          i.events = null;
          i.stores = null;
          null != i.memoCache && (i.memoCache.index = 0);
        }
        G.H = ep;
        i = t(n, a);
      } while (Wa);
      return i;
    }
    function Cm() {
      var e = G.H, t = e.useState()[0];
      t = "function" === typeof t.then ? mi(t) : t;
      e = e.useState()[0];
      (null !== pe ? pe.memoizedState : null) !== e && (Q.flags |= 1024);
      return t;
    }
    function Or() {
      var e = 0 !== No;
      No = 0;
      return e;
    }
    function wr(e, t, n) {
      t.updateQueue = e.updateQueue;
      t.flags &= -2053;
      e.lanes &= ~n;
    }
    function Ur(e) {
      if (Do) {
        for (e = e.memoizedState; null !== e; ) {
          var t = e.queue;
          null !== t && (t.pending = null);
          e = e.next;
        }
        Do = false;
      }
      pn = 0;
      Re = pe = Q = null;
      Wa = false;
      ti = No = 0;
      $a = null;
    }
    function et() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      null === Re ? Q.memoizedState = Re = e : Re = Re.next = e;
      return Re;
    }
    function De() {
      if (null === pe) {
        var e = Q.alternate;
        e = null !== e ? e.memoizedState : null;
      } else e = pe.next;
      var t = null === Re ? Q.memoizedState : Re.next;
      if (null !== t)
        Re = t, pe = e;
      else {
        if (null === e) {
          if (null === Q.alternate)
            throw Error(A(467));
          throw Error(A(310));
        }
        pe = e;
        e = {
          memoizedState: pe.memoizedState,
          baseState: pe.baseState,
          baseQueue: pe.baseQueue,
          queue: pe.queue,
          next: null
        };
        null === Re ? Q.memoizedState = Re = e : Re = Re.next = e;
      }
      return Re;
    }
    function Io() {
      return { lastEffect: null, events: null, stores: null, memoCache: null };
    }
    function mi(e) {
      var t = ti;
      ti += 1;
      null === $a && ($a = []);
      e = y0($a, e, t);
      t = Q;
      null === (null === Re ? t.memoizedState : Re.next) && (t = t.alternate, G.H = null === t || null === t.memoizedState ? P0 : Vr);
      return e;
    }
    function Po(e) {
      if (null !== e && "object" === typeof e) {
        if ("function" === typeof e.then) return mi(e);
        if (e.$$typeof === on) return Ke(e);
      }
      throw Error(A(438, String(e)));
    }
    function Br(e) {
      var t = null, n = Q.updateQueue;
      null !== n && (t = n.memoCache);
      if (null == t) {
        var a = Q.alternate;
        null !== a && (a = a.updateQueue, null !== a && (a = a.memoCache, null != a && (t = {
          data: a.data.map(function(l) {
            return l.slice();
          }),
          index: 0
        })));
      }
      null == t && (t = { data: [], index: 0 });
      null === n && (n = Io(), Q.updateQueue = n);
      n.memoCache = t;
      n = t.data[t.index];
      if (void 0 === n)
        for (n = t.data[t.index] = Array(e), a = 0; a < e; a++)
          n[a] = s1;
      t.index++;
      return n;
    }
    function gn(e, t) {
      return "function" === typeof t ? t(e) : t;
    }
    function oo(e) {
      var t = De();
      return qr(t, pe, e);
    }
    function qr(e, t, n) {
      var a = e.queue;
      if (null === a) throw Error(A(311));
      a.lastRenderedReducer = n;
      var l = e.baseQueue, i = a.pending;
      if (null !== i) {
        if (null !== l) {
          var u = l.next;
          l.next = i.next;
          i.next = u;
        }
        t.baseQueue = l = i;
        a.pending = null;
      }
      i = e.baseState;
      if (null === l) e.memoizedState = i;
      else {
        t = l.next;
        var c = u = null, r = null, g = t, m = false;
        do {
          var v = g.lane & -536870913;
          if (v !== g.lane ? (I & v) === v : (pn & v) === v) {
            var p = g.revertLane;
            if (0 === p)
              null !== r && (r = r.next = {
                lane: 0,
                revertLane: 0,
                gesture: null,
                action: g.action,
                hasEagerState: g.hasEagerState,
                eagerState: g.eagerState,
                next: null
              }), v === tl && (m = true);
            else if ((pn & p) === p) {
              g = g.next;
              p === tl && (m = true);
              continue;
            } else
              v = {
                lane: 0,
                revertLane: g.revertLane,
                gesture: null,
                action: g.action,
                hasEagerState: g.hasEagerState,
                eagerState: g.eagerState,
                next: null
              }, null === r ? (c = r = v, u = i) : r = r.next = v, Q.lanes |= p, Zn |= p;
            v = g.action;
            fa && n(i, v);
            i = g.hasEagerState ? g.eagerState : n(i, v);
          } else
            p = {
              lane: v,
              revertLane: g.revertLane,
              gesture: g.gesture,
              action: g.action,
              hasEagerState: g.hasEagerState,
              eagerState: g.eagerState,
              next: null
            }, null === r ? (c = r = p, u = i) : r = r.next = p, Q.lanes |= v, Zn |= v;
          g = g.next;
        } while (null !== g && g !== t);
        null === r ? u = i : r.next = c;
        if (!bt(i, e.memoizedState) && (we = true, m && (n = Ja, null !== n)))
          throw n;
        e.memoizedState = i;
        e.baseState = u;
        e.baseQueue = r;
        a.lastRenderedState = i;
      }
      null === l && (a.lanes = 0);
      return [e.memoizedState, a.dispatch];
    }
    function Wu(e) {
      var t = De(), n = t.queue;
      if (null === n) throw Error(A(311));
      n.lastRenderedReducer = e;
      var a = n.dispatch, l = n.pending, i = t.memoizedState;
      if (null !== l) {
        n.pending = null;
        var u = l = l.next;
        do
          i = e(i, u.action), u = u.next;
        while (u !== l);
        bt(i, t.memoizedState) || (we = true);
        t.memoizedState = i;
        null === t.baseQueue && (t.baseState = i);
        n.lastRenderedState = i;
      }
      return [i, a];
    }
    function C0(e, t, n) {
      var a = Q, l = De(), i = P;
      if (i) {
        if (void 0 === n) throw Error(A(407));
        n = n();
      } else n = t();
      var u = !bt(
        (pe || l).memoizedState,
        n
      );
      u && (l.memoizedState = n, we = true);
      l = l.queue;
      Hr(D0.bind(null, a, l, e), [
        e
      ]);
      if (l.getSnapshot !== t || u || null !== Re && Re.memoizedState.tag & 1) {
        a.flags |= 2048;
        al(
          9,
          { destroy: void 0 },
          k0.bind(
            null,
            a,
            l,
            n,
            t
          ),
          null
        );
        if (null === me) throw Error(A(349));
        i || 0 !== (pn & 127) || T0(a, t, n);
      }
      return n;
    }
    function T0(e, t, n) {
      e.flags |= 16384;
      e = { getSnapshot: t, value: n };
      t = Q.updateQueue;
      null === t ? (t = Io(), Q.updateQueue = t, t.stores = [e]) : (n = t.stores, null === n ? t.stores = [e] : n.push(e));
    }
    function k0(e, t, n, a) {
      t.value = n;
      t.getSnapshot = a;
      N0(t) && M0(e);
    }
    function D0(e, t, n) {
      return n(function() {
        N0(t) && M0(e);
      });
    }
    function N0(e) {
      var t = e.getSnapshot;
      e = e.value;
      try {
        var n = t();
        return !bt(e, n);
      } catch (a) {
        return true;
      }
    }
    function M0(e) {
      var t = ha(e, 2);
      null !== t && ut(t, e, 2);
    }
    function Lc(e) {
      var t = et();
      if ("function" === typeof e) {
        var n = e;
        e = n();
        if (fa) {
          Mn(true);
          try {
            n();
          } finally {
            Mn(false);
          }
        }
      }
      t.memoizedState = t.baseState = e;
      t.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: gn,
        lastRenderedState: e
      };
      return t;
    }
    function R0(e, t, n, a) {
      e.baseState = n;
      return qr(
        e,
        pe,
        "function" === typeof a ? a : gn
      );
    }
    function Tm(e, t, n, a, l) {
      if (tu(e)) throw Error(A(485));
      e = t.action;
      if (null !== e) {
        var i = {
          payload: l,
          action: e,
          next: null,
          isTransition: true,
          status: "pending",
          value: null,
          reason: null,
          listeners: [],
          then: function(u) {
            i.listeners.push(u);
          }
        };
        null !== G.T ? n(true) : i.isTransition = false;
        a(i);
        n = t.pending;
        null === n ? (i.next = t.pending = i, _0(t, i)) : (i.next = n.next, t.pending = n.next = i);
      }
    }
    function _0(e, t) {
      var n = t.action, a = t.payload, l = e.state;
      if (t.isTransition) {
        var i = G.T, u = {};
        G.T = u;
        try {
          var c = n(l, a), r = G.S;
          null !== r && r(u, c);
          Rf(e, t, c);
        } catch (g) {
          Gc(e, t, g);
        } finally {
          null !== i && null !== u.types && (i.types = u.types), G.T = i;
        }
      } else
        try {
          i = n(l, a), Rf(e, t, i);
        } catch (g) {
          Gc(e, t, g);
        }
    }
    function Rf(e, t, n) {
      null !== n && "object" === typeof n && "function" === typeof n.then ? n.then(
        function(a) {
          _f(e, t, a);
        },
        function(a) {
          return Gc(e, t, a);
        }
      ) : _f(e, t, n);
    }
    function _f(e, t, n) {
      t.status = "fulfilled";
      t.value = n;
      O0(t);
      e.state = n;
      t = e.pending;
      null !== t && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, _0(e, n)));
    }
    function Gc(e, t, n) {
      var a = e.pending;
      e.pending = null;
      if (null !== a) {
        a = a.next;
        do
          t.status = "rejected", t.reason = n, O0(t), t = t.next;
        while (t !== a);
      }
      e.action = null;
    }
    function O0(e) {
      e = e.listeners;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
    function w0(e, t) {
      return t;
    }
    function Of(e, t) {
      if (P) {
        var n = me.formState;
        if (null !== n) {
          e: {
            var a = Q;
            if (P) {
              if (Se) {
                t: {
                  var l = Se;
                  for (var i = Nt; 8 !== l.nodeType; ) {
                    if (!i) {
                      l = null;
                      break t;
                    }
                    l = Rt(
                      l.nextSibling
                    );
                    if (null === l) {
                      l = null;
                      break t;
                    }
                  }
                  i = l.data;
                  l = "F!" === i || "F" === i ? l : null;
                }
                if (l) {
                  Se = Rt(
                    l.nextSibling
                  );
                  a = "F!" === l.data;
                  break e;
                }
              }
              Xn(a);
            }
            a = false;
          }
          a && (t = n[0]);
        }
      }
      n = et();
      n.memoizedState = n.baseState = t;
      a = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: w0,
        lastRenderedState: t
      };
      n.queue = a;
      n = W0.bind(
        null,
        Q,
        a
      );
      a.dispatch = n;
      a = Lc(false);
      i = Yr.bind(
        null,
        Q,
        false,
        a.queue
      );
      a = et();
      l = {
        state: t,
        dispatch: null,
        action: e,
        pending: null
      };
      a.queue = l;
      n = Tm.bind(
        null,
        Q,
        l,
        i,
        n
      );
      l.dispatch = n;
      a.memoizedState = e;
      return [t, n, false];
    }
    function wf(e) {
      var t = De();
      return U0(t, pe, e);
    }
    function U0(e, t, n) {
      t = qr(
        e,
        t,
        w0
      )[0];
      e = oo(gn)[0];
      if ("object" === typeof t && null !== t && "function" === typeof t.then)
        try {
          var a = mi(t);
        } catch (u) {
          if (u === dl) throw $o;
          throw u;
        }
      else a = t;
      t = De();
      var l = t.queue, i = l.dispatch;
      n !== t.memoizedState && (Q.flags |= 2048, al(
        9,
        { destroy: void 0 },
        km.bind(null, l, n),
        null
      ));
      return [a, i, e];
    }
    function km(e, t) {
      e.action = t;
    }
    function Uf(e) {
      var t = De(), n = pe;
      if (null !== n)
        return U0(t, n, e);
      De();
      t = t.memoizedState;
      n = De();
      var a = n.queue.dispatch;
      n.memoizedState = e;
      return [t, a, false];
    }
    function al(e, t, n, a) {
      e = { tag: e, create: n, deps: a, inst: t, next: null };
      t = Q.updateQueue;
      null === t && (t = Io(), Q.updateQueue = t);
      n = t.lastEffect;
      null === n ? t.lastEffect = e.next = e : (a = n.next, n.next = e, e.next = a, t.lastEffect = e);
      return e;
    }
    function B0() {
      return De().memoizedState;
    }
    function uo(e, t, n, a) {
      var l = et();
      Q.flags |= e;
      l.memoizedState = al(
        1 | t,
        { destroy: void 0 },
        n,
        void 0 === a ? null : a
      );
    }
    function eu(e, t, n, a) {
      var l = De();
      a = void 0 === a ? null : a;
      var i = l.memoizedState.inst;
      null !== pe && null !== a && Rr(a, pe.memoizedState.deps) ? l.memoizedState = al(t, i, n, a) : (Q.flags |= e, l.memoizedState = al(
        1 | t,
        i,
        n,
        a
      ));
    }
    function Bf(e, t) {
      uo(8390656, 8, e, t);
    }
    function Hr(e, t) {
      eu(2048, 8, e, t);
    }
    function Dm(e) {
      Q.flags |= 4;
      var t = Q.updateQueue;
      if (null === t)
        t = Io(), Q.updateQueue = t, t.events = [e];
      else {
        var n = t.events;
        null === n ? t.events = [e] : n.push(e);
      }
    }
    function q0(e) {
      var t = De().memoizedState;
      Dm({ ref: t, nextImpl: e });
      return function() {
        if (0 !== (le & 2)) throw Error(A(440));
        return t.impl.apply(void 0, arguments);
      };
    }
    function H0(e, t) {
      return eu(4, 2, e, t);
    }
    function j0(e, t) {
      return eu(4, 4, e, t);
    }
    function L0(e, t) {
      if ("function" === typeof t) {
        e = e();
        var n = t(e);
        return function() {
          "function" === typeof n ? n() : t(null);
        };
      }
      if (null !== t && void 0 !== t)
        return e = e(), t.current = e, function() {
          t.current = null;
        };
    }
    function G0(e, t, n) {
      n = null !== n && void 0 !== n ? n.concat([e]) : null;
      eu(4, 4, L0.bind(null, t, e), n);
    }
    function jr() {
    }
    function Y0(e, t) {
      var n = De();
      t = void 0 === t ? null : t;
      var a = n.memoizedState;
      if (null !== t && Rr(t, a[1]))
        return a[0];
      n.memoizedState = [e, t];
      return e;
    }
    function V0(e, t) {
      var n = De();
      t = void 0 === t ? null : t;
      var a = n.memoizedState;
      if (null !== t && Rr(t, a[1]))
        return a[0];
      a = e();
      if (fa) {
        Mn(true);
        try {
          e();
        } finally {
          Mn(false);
        }
      }
      n.memoizedState = [a, t];
      return a;
    }
    function Lr(e, t, n) {
      if (void 0 === n || 0 !== (pn & 1073741824) && 0 === (I & 261930))
        return e.memoizedState = t;
      e.memoizedState = n;
      e = Rp();
      Q.lanes |= e;
      Zn |= e;
      return n;
    }
    function F0(e, t, n, a) {
      if (bt(n, t)) return n;
      if (null !== nl.current)
        return e = Lr(e, n, a), bt(e, t) || (we = true), e;
      if (0 === (pn & 42) || 0 !== (pn & 1073741824) && 0 === (I & 261930))
        return we = true, e.memoizedState = n;
      e = Rp();
      Q.lanes |= e;
      Zn |= e;
      return t;
    }
    function X0(e, t, n, a, l) {
      var i = ie.p;
      ie.p = 0 !== i && 8 > i ? i : 8;
      var u = G.T, c = {};
      G.T = c;
      Yr(e, false, t, n);
      try {
        var r = l(), g = G.S;
        null !== g && g(c, r);
        if (null !== r && "object" === typeof r && "function" === typeof r.then) {
          var m = Am(
            r,
            a
          );
          Yl(
            e,
            t,
            m,
            vt(e)
          );
        } else
          Yl(
            e,
            t,
            a,
            vt(e)
          );
      } catch (v) {
        Yl(
          e,
          t,
          { then: function() {
          }, status: "rejected", reason: v },
          vt()
        );
      } finally {
        ie.p = i, null !== u && null !== c.types && (u.types = c.types), G.T = u;
      }
    }
    function Nm() {
    }
    function Yc(e, t, n, a) {
      if (5 !== e.tag) throw Error(A(476));
      var l = Q0(e).queue;
      X0(
        e,
        l,
        t,
        aa,
        null === n ? Nm : function() {
          Z0(e);
          return n(a);
        }
      );
    }
    function Q0(e) {
      var t = e.memoizedState;
      if (null !== t) return t;
      t = {
        memoizedState: aa,
        baseState: aa,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: gn,
          lastRenderedState: aa
        },
        next: null
      };
      var n = {};
      t.next = {
        memoizedState: n,
        baseState: n,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: gn,
          lastRenderedState: n
        },
        next: null
      };
      e.memoizedState = t;
      e = e.alternate;
      null !== e && (e.memoizedState = t);
      return t;
    }
    function Z0(e) {
      var t = Q0(e);
      null === t.next && (t = e.alternate.memoizedState);
      Yl(
        e,
        t.next.queue,
        {},
        vt()
      );
    }
    function Gr() {
      return Ke(ii);
    }
    function J0() {
      return De().memoizedState;
    }
    function K0() {
      return De().memoizedState;
    }
    function Mm(e) {
      for (var t = e.return; null !== t; ) {
        switch (t.tag) {
          case 24:
          case 3:
            var n = vt();
            e = qn(n);
            var a = Hn(t, e, n);
            null !== a && (ut(a, t, n), jl(a, t, n));
            t = { cache: Tr() };
            e.payload = t;
            return;
        }
        t = t.return;
      }
    }
    function Rm(e, t, n) {
      var a = vt();
      n = {
        lane: a,
        revertLane: 0,
        gesture: null,
        action: n,
        hasEagerState: false,
        eagerState: null,
        next: null
      };
      tu(e) ? $0(t, n) : (n = zr(e, t, n, a), null !== n && (ut(n, e, a), I0(n, t, a)));
    }
    function W0(e, t, n) {
      var a = vt();
      Yl(e, t, n, a);
    }
    function Yl(e, t, n, a) {
      var l = {
        lane: a,
        revertLane: 0,
        gesture: null,
        action: n,
        hasEagerState: false,
        eagerState: null,
        next: null
      };
      if (tu(e)) $0(t, l);
      else {
        var i = e.alternate;
        if (0 === e.lanes && (null === i || 0 === i.lanes) && (i = t.lastRenderedReducer, null !== i))
          try {
            var u = t.lastRenderedState, c = i(u, n);
            l.hasEagerState = true;
            l.eagerState = c;
            if (bt(c, u))
              return Wo(e, t, l, 0), null === me && Ko(), false;
          } catch (r) {
          } finally {
          }
        n = zr(e, t, l, a);
        if (null !== n)
          return ut(n, e, a), I0(n, t, a), true;
      }
      return false;
    }
    function Yr(e, t, n, a) {
      a = {
        lane: 2,
        revertLane: $r(),
        gesture: null,
        action: a,
        hasEagerState: false,
        eagerState: null,
        next: null
      };
      if (tu(e)) {
        if (t) throw Error(A(479));
      } else
        t = zr(
          e,
          n,
          a,
          2
        ), null !== t && ut(t, e, 2);
    }
    function tu(e) {
      var t = e.alternate;
      return e === Q || null !== t && t === Q;
    }
    function $0(e, t) {
      Wa = Do = true;
      var n = e.pending;
      null === n ? t.next = t : (t.next = n.next, n.next = t);
      e.pending = t;
    }
    function I0(e, t, n) {
      if (0 !== (n & 4194048)) {
        var a = t.lanes;
        a &= e.pendingLanes;
        n |= a;
        t.lanes = n;
        qd(e, n);
      }
    }
    var ni = {
      readContext: Ke,
      use: Po,
      useCallback: Ce,
      useContext: Ce,
      useEffect: Ce,
      useImperativeHandle: Ce,
      useLayoutEffect: Ce,
      useInsertionEffect: Ce,
      useMemo: Ce,
      useReducer: Ce,
      useRef: Ce,
      useState: Ce,
      useDebugValue: Ce,
      useDeferredValue: Ce,
      useTransition: Ce,
      useSyncExternalStore: Ce,
      useId: Ce,
      useHostTransitionStatus: Ce,
      useFormState: Ce,
      useActionState: Ce,
      useOptimistic: Ce,
      useMemoCache: Ce,
      useCacheRefresh: Ce
    };
    ni.useEffectEvent = Ce;
    var P0 = {
      readContext: Ke,
      use: Po,
      useCallback: function(e, t) {
        et().memoizedState = [
          e,
          void 0 === t ? null : t
        ];
        return e;
      },
      useContext: Ke,
      useEffect: Bf,
      useImperativeHandle: function(e, t, n) {
        n = null !== n && void 0 !== n ? n.concat([e]) : null;
        uo(
          4194308,
          4,
          L0.bind(null, t, e),
          n
        );
      },
      useLayoutEffect: function(e, t) {
        return uo(4194308, 4, e, t);
      },
      useInsertionEffect: function(e, t) {
        uo(4, 2, e, t);
      },
      useMemo: function(e, t) {
        var n = et();
        t = void 0 === t ? null : t;
        var a = e();
        if (fa) {
          Mn(true);
          try {
            e();
          } finally {
            Mn(false);
          }
        }
        n.memoizedState = [a, t];
        return a;
      },
      useReducer: function(e, t, n) {
        var a = et();
        if (void 0 !== n) {
          var l = n(t);
          if (fa) {
            Mn(true);
            try {
              n(t);
            } finally {
              Mn(false);
            }
          }
        } else l = t;
        a.memoizedState = a.baseState = l;
        e = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: l
        };
        a.queue = e;
        e = e.dispatch = Rm.bind(
          null,
          Q,
          e
        );
        return [a.memoizedState, e];
      },
      useRef: function(e) {
        var t = et();
        e = { current: e };
        return t.memoizedState = e;
      },
      useState: function(e) {
        e = Lc(e);
        var t = e.queue, n = W0.bind(null, Q, t);
        t.dispatch = n;
        return [e.memoizedState, n];
      },
      useDebugValue: jr,
      useDeferredValue: function(e, t) {
        var n = et();
        return Lr(n, e, t);
      },
      useTransition: function() {
        var e = Lc(false);
        e = X0.bind(
          null,
          Q,
          e.queue,
          true,
          false
        );
        et().memoizedState = e;
        return [false, e];
      },
      useSyncExternalStore: function(e, t, n) {
        var a = Q, l = et();
        if (P) {
          if (void 0 === n)
            throw Error(A(407));
          n = n();
        } else {
          n = t();
          if (null === me)
            throw Error(A(349));
          0 !== (I & 127) || T0(a, t, n);
        }
        l.memoizedState = n;
        var i = { value: n, getSnapshot: t };
        l.queue = i;
        Bf(D0.bind(null, a, i, e), [
          e
        ]);
        a.flags |= 2048;
        al(
          9,
          { destroy: void 0 },
          k0.bind(
            null,
            a,
            i,
            n,
            t
          ),
          null
        );
        return n;
      },
      useId: function() {
        var e = et(), t = me.identifierPrefix;
        if (P) {
          var n = Vt;
          var a = Yt;
          n = (a & ~(1 << 32 - yt(a) - 1)).toString(32) + n;
          t = "_" + t + "R_" + n;
          n = No++;
          0 < n && (t += "H" + n.toString(32));
          t += "_";
        } else
          n = Em++, t = "_" + t + "r_" + n.toString(32) + "_";
        return e.memoizedState = t;
      },
      useHostTransitionStatus: Gr,
      useFormState: Of,
      useActionState: Of,
      useOptimistic: function(e) {
        var t = et();
        t.memoizedState = t.baseState = e;
        var n = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null
        };
        t.queue = n;
        t = Yr.bind(
          null,
          Q,
          true,
          n
        );
        n.dispatch = t;
        return [e, t];
      },
      useMemoCache: Br,
      useCacheRefresh: function() {
        return et().memoizedState = Mm.bind(
          null,
          Q
        );
      },
      useEffectEvent: function(e) {
        var t = et(), n = { impl: e };
        t.memoizedState = n;
        return function() {
          if (0 !== (le & 2))
            throw Error(A(440));
          return n.impl.apply(void 0, arguments);
        };
      }
    };
    var Vr = {
      readContext: Ke,
      use: Po,
      useCallback: Y0,
      useContext: Ke,
      useEffect: Hr,
      useImperativeHandle: G0,
      useInsertionEffect: H0,
      useLayoutEffect: j0,
      useMemo: V0,
      useReducer: oo,
      useRef: B0,
      useState: function() {
        return oo(gn);
      },
      useDebugValue: jr,
      useDeferredValue: function(e, t) {
        var n = De();
        return F0(
          n,
          pe.memoizedState,
          e,
          t
        );
      },
      useTransition: function() {
        var e = oo(gn)[0], t = De().memoizedState;
        return [
          "boolean" === typeof e ? e : mi(e),
          t
        ];
      },
      useSyncExternalStore: C0,
      useId: J0,
      useHostTransitionStatus: Gr,
      useFormState: wf,
      useActionState: wf,
      useOptimistic: function(e, t) {
        var n = De();
        return R0(n, pe, e, t);
      },
      useMemoCache: Br,
      useCacheRefresh: K0
    };
    Vr.useEffectEvent = q0;
    var ep = {
      readContext: Ke,
      use: Po,
      useCallback: Y0,
      useContext: Ke,
      useEffect: Hr,
      useImperativeHandle: G0,
      useInsertionEffect: H0,
      useLayoutEffect: j0,
      useMemo: V0,
      useReducer: Wu,
      useRef: B0,
      useState: function() {
        return Wu(gn);
      },
      useDebugValue: jr,
      useDeferredValue: function(e, t) {
        var n = De();
        return null === pe ? Lr(n, e, t) : F0(
          n,
          pe.memoizedState,
          e,
          t
        );
      },
      useTransition: function() {
        var e = Wu(gn)[0], t = De().memoizedState;
        return [
          "boolean" === typeof e ? e : mi(e),
          t
        ];
      },
      useSyncExternalStore: C0,
      useId: J0,
      useHostTransitionStatus: Gr,
      useFormState: Uf,
      useActionState: Uf,
      useOptimistic: function(e, t) {
        var n = De();
        if (null !== pe)
          return R0(n, pe, e, t);
        n.baseState = e;
        return [e, n.queue.dispatch];
      },
      useMemoCache: Br,
      useCacheRefresh: K0
    };
    ep.useEffectEvent = q0;
    function $u(e, t, n, a) {
      t = e.memoizedState;
      n = n(a, t);
      n = null === n || void 0 === n ? t : ze({}, t, n);
      e.memoizedState = n;
      0 === e.lanes && (e.updateQueue.baseState = n);
    }
    var Vc = {
      enqueueSetState: function(e, t, n) {
        e = e._reactInternals;
        var a = vt(), l = qn(a);
        l.payload = t;
        void 0 !== n && null !== n && (l.callback = n);
        t = Hn(e, l, a);
        null !== t && (ut(t, e, a), jl(t, e, a));
      },
      enqueueReplaceState: function(e, t, n) {
        e = e._reactInternals;
        var a = vt(), l = qn(a);
        l.tag = 1;
        l.payload = t;
        void 0 !== n && null !== n && (l.callback = n);
        t = Hn(e, l, a);
        null !== t && (ut(t, e, a), jl(t, e, a));
      },
      enqueueForceUpdate: function(e, t) {
        e = e._reactInternals;
        var n = vt(), a = qn(n);
        a.tag = 2;
        void 0 !== t && null !== t && (a.callback = t);
        t = Hn(e, a, n);
        null !== t && (ut(t, e, n), jl(t, e, n));
      }
    };
    function qf(e, t, n, a, l, i, u) {
      e = e.stateNode;
      return "function" === typeof e.shouldComponentUpdate ? e.shouldComponentUpdate(a, i, u) : t.prototype && t.prototype.isPureReactComponent ? !$l(n, a) || !$l(l, i) : true;
    }
    function Hf(e, t, n, a) {
      e = t.state;
      "function" === typeof t.componentWillReceiveProps && t.componentWillReceiveProps(n, a);
      "function" === typeof t.UNSAFE_componentWillReceiveProps && t.UNSAFE_componentWillReceiveProps(n, a);
      t.state !== e && Vc.enqueueReplaceState(t, t.state, null);
    }
    function da(e, t) {
      var n = t;
      if ("ref" in t) {
        n = {};
        for (var a in t)
          "ref" !== a && (n[a] = t[a]);
      }
      if (e = e.defaultProps) {
        n === t && (n = ze({}, n));
        for (var l in e)
          void 0 === n[l] && (n[l] = e[l]);
      }
      return n;
    }
    function tp(e) {
      So(e);
    }
    function np(e) {
      console.error(e);
    }
    function ap(e) {
      So(e);
    }
    function Mo(e, t) {
      try {
        var n = e.onUncaughtError;
        n(t.value, { componentStack: t.stack });
      } catch (a) {
        setTimeout(function() {
          throw a;
        });
      }
    }
    function jf(e, t, n) {
      try {
        var a = e.onCaughtError;
        a(n.value, {
          componentStack: n.stack,
          errorBoundary: 1 === t.tag ? t.stateNode : null
        });
      } catch (l) {
        setTimeout(function() {
          throw l;
        });
      }
    }
    function Fc(e, t, n) {
      n = qn(n);
      n.tag = 3;
      n.payload = { element: null };
      n.callback = function() {
        Mo(e, t);
      };
      return n;
    }
    function lp(e) {
      e = qn(e);
      e.tag = 3;
      return e;
    }
    function ip(e, t, n, a) {
      var l = n.type.getDerivedStateFromError;
      if ("function" === typeof l) {
        var i = a.value;
        e.payload = function() {
          return l(i);
        };
        e.callback = function() {
          jf(t, n, a);
        };
      }
      var u = n.stateNode;
      null !== u && "function" === typeof u.componentDidCatch && (e.callback = function() {
        jf(t, n, a);
        "function" !== typeof l && (null === jn ? jn = /* @__PURE__ */ new Set([this]) : jn.add(this));
        var c = a.stack;
        this.componentDidCatch(a.value, {
          componentStack: null !== c ? c : ""
        });
      });
    }
    function _m(e, t, n, a, l) {
      n.flags |= 32768;
      if (null !== a && "object" === typeof a && "function" === typeof a.then) {
        t = n.alternate;
        null !== t && fl(
          t,
          n,
          l,
          true
        );
        n = xt.current;
        if (null !== n) {
          switch (n.tag) {
            case 31:
            case 13:
              return null === Mt ? Uo() : null === n.alternate && 0 === Te && (Te = 3), n.flags &= -257, n.flags |= 65536, n.lanes = l, a === Co ? n.flags |= 16384 : (t = n.updateQueue, null === t ? n.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), cc(e, a, l)), false;
            case 22:
              return n.flags |= 65536, a === Co ? n.flags |= 16384 : (t = n.updateQueue, null === t ? (t = {
                transitions: null,
                markerInstances: null,
                retryQueue: /* @__PURE__ */ new Set([a])
              }, n.updateQueue = t) : (n = t.retryQueue, null === n ? t.retryQueue = /* @__PURE__ */ new Set([a]) : n.add(a)), cc(e, a, l)), false;
          }
          throw Error(A(435, n.tag));
        }
        cc(e, a, l);
        Uo();
        return false;
      }
      if (P)
        return t = xt.current, null !== t ? (0 === (t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = l, a !== Rc && (e = Error(A(422), { cause: a }), Pl(Dt(e, n)))) : (a !== Rc && (t = Error(A(423), {
          cause: a
        }), Pl(
          Dt(t, n)
        )), e = e.current.alternate, e.flags |= 65536, l &= -l, e.lanes |= l, a = Dt(a, n), l = Fc(
          e.stateNode,
          a,
          l
        ), Ku(e, l), 4 !== Te && (Te = 2)), false;
      var i = Error(A(520), { cause: a });
      i = Dt(i, n);
      null === Xl ? Xl = [i] : Xl.push(i);
      4 !== Te && (Te = 2);
      if (null === t) return true;
      a = Dt(a, n);
      n = t;
      do {
        switch (n.tag) {
          case 3:
            return n.flags |= 65536, e = l & -l, n.lanes |= e, e = Fc(n.stateNode, a, e), Ku(n, e), false;
          case 1:
            if (t = n.type, i = n.stateNode, 0 === (n.flags & 128) && ("function" === typeof t.getDerivedStateFromError || null !== i && "function" === typeof i.componentDidCatch && (null === jn || !jn.has(i))))
              return n.flags |= 65536, l &= -l, n.lanes |= l, l = lp(l), ip(
                l,
                e,
                n,
                a
              ), Ku(n, l), false;
        }
        n = n.return;
      } while (null !== n);
      return false;
    }
    var Fr = Error(A(461));
    var we = false;
    function Qe(e, t, n, a) {
      t.child = null === e ? b0(t, null, n, a) : sa(
        t,
        e.child,
        n,
        a
      );
    }
    function Lf(e, t, n, a, l) {
      n = n.render;
      var i = t.ref;
      if ("ref" in a) {
        var u = {};
        for (var c in a)
          "ref" !== c && (u[c] = a[c]);
      } else u = a;
      ra(t);
      a = _r(
        e,
        t,
        n,
        u,
        i,
        l
      );
      c = Or();
      if (null !== e && !we)
        return wr(e, t, l), mn(e, t, l);
      P && c && Er(t);
      t.flags |= 1;
      Qe(e, t, a, l);
      return t.child;
    }
    function Gf(e, t, n, a, l) {
      if (null === e) {
        var i = n.type;
        if ("function" === typeof i && !Ar(i) && void 0 === i.defaultProps && null === n.compare)
          return t.tag = 15, t.type = i, op(
            e,
            t,
            i,
            a,
            l
          );
        e = lo(
          n.type,
          null,
          a,
          t,
          t.mode,
          l
        );
        e.ref = t.ref;
        e.return = t;
        return t.child = e;
      }
      i = e.child;
      if (!Xr(e, l)) {
        var u = i.memoizedProps;
        n = n.compare;
        n = null !== n ? n : $l;
        if (n(u, a) && e.ref === t.ref)
          return mn(e, t, l);
      }
      t.flags |= 1;
      e = rn(i, a);
      e.ref = t.ref;
      e.return = t;
      return t.child = e;
    }
    function op(e, t, n, a, l) {
      if (null !== e) {
        var i = e.memoizedProps;
        if ($l(i, a) && e.ref === t.ref)
          if (we = false, t.pendingProps = a = i, Xr(e, l))
            0 !== (e.flags & 131072) && (we = true);
          else
            return t.lanes = e.lanes, mn(e, t, l);
      }
      return Xc(
        e,
        t,
        n,
        a,
        l
      );
    }
    function up(e, t, n, a) {
      var l = a.children, i = null !== e ? e.memoizedState : null;
      null === e && null === t.stateNode && (t.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      });
      if ("hidden" === a.mode) {
        if (0 !== (t.flags & 128)) {
          i = null !== i ? i.baseLanes | n : n;
          if (null !== e) {
            a = t.child = e.child;
            for (l = 0; null !== a; )
              l = l | a.lanes | a.childLanes, a = a.sibling;
            a = l & ~i;
          } else a = 0, t.child = null;
          return Yf(
            e,
            t,
            i,
            n,
            a
          );
        }
        if (0 !== (n & 536870912))
          t.memoizedState = { baseLanes: 0, cachePool: null }, null !== e && io(
            t,
            null !== i ? i.cachePool : null
          ), null !== i ? Mf(t, i) : Hc(), z0(t);
        else
          return a = t.lanes = 536870912, Yf(
            e,
            t,
            null !== i ? i.baseLanes | n : n,
            n,
            a
          );
      } else
        null !== i ? (io(t, i.cachePool), Mf(t, i), Dn(t), t.memoizedState = null) : (null !== e && io(t, null), Hc(), Dn(t));
      Qe(e, t, l, n);
      return t.child;
    }
    function Ol(e, t) {
      null !== e && 22 === e.tag || null !== t.stateNode || (t.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      });
      return t.sibling;
    }
    function Yf(e, t, n, a, l) {
      var i = kr();
      i = null === i ? null : { parent: Oe._currentValue, pool: i };
      t.memoizedState = {
        baseLanes: n,
        cachePool: i
      };
      null !== e && io(t, null);
      Hc();
      z0(t);
      null !== e && fl(e, t, a, true);
      t.childLanes = l;
      return null;
    }
    function co(e, t) {
      t = Ro(
        { mode: t.mode, children: t.children },
        e.mode
      );
      t.ref = e.ref;
      e.child = t;
      t.return = e;
      return t;
    }
    function Vf(e, t, n) {
      sa(t, e.child, null, n);
      e = co(t, t.pendingProps);
      e.flags |= 2;
      dt(t);
      t.memoizedState = null;
      return e;
    }
    function Om(e, t, n) {
      var a = t.pendingProps, l = 0 !== (t.flags & 128);
      t.flags &= -129;
      if (null === e) {
        if (P) {
          if ("hidden" === a.mode)
            return e = co(t, a), t.lanes = 536870912, Ol(null, e);
          jc(t);
          (e = Se) ? (e = Pp(
            e,
            Nt
          ), e = null !== e && "&" === e.data ? e : null, null !== e && (t.memoizedState = {
            dehydrated: e,
            treeContext: null !== Fn ? { id: Yt, overflow: Vt } : null,
            retryLane: 536870912,
            hydrationErrors: null
          }, n = d0(e), n.return = t, t.child = n, Je = t, Se = null)) : e = null;
          if (null === e) throw Xn(t);
          t.lanes = 536870912;
          return null;
        }
        return co(t, a);
      }
      var i = e.memoizedState;
      if (null !== i) {
        var u = i.dehydrated;
        jc(t);
        if (l)
          if (t.flags & 256)
            t.flags &= -257, t = Vf(
              e,
              t,
              n
            );
          else if (null !== t.memoizedState)
            t.child = e.child, t.flags |= 128, t = null;
          else throw Error(A(558));
        else if (we || fl(e, t, n, false), l = 0 !== (n & e.childLanes), we || l) {
          a = me;
          if (null !== a && (u = Hd(a, n), 0 !== u && u !== i.retryLane))
            throw i.retryLane = u, ha(e, u), ut(a, e, u), Fr;
          Uo();
          t = Vf(
            e,
            t,
            n
          );
        } else
          e = i.treeContext, Se = Rt(u.nextSibling), Je = t, P = true, Bn = null, Nt = false, null !== e && g0(t, e), t = co(t, a), t.flags |= 4096;
        return t;
      }
      e = rn(e.child, {
        mode: a.mode,
        children: a.children
      });
      e.ref = t.ref;
      t.child = e;
      e.return = t;
      return e;
    }
    function ro(e, t) {
      var n = t.ref;
      if (null === n)
        null !== e && null !== e.ref && (t.flags |= 4194816);
      else {
        if ("function" !== typeof n && "object" !== typeof n)
          throw Error(A(284));
        if (null === e || e.ref !== n)
          t.flags |= 4194816;
      }
    }
    function Xc(e, t, n, a, l) {
      ra(t);
      n = _r(
        e,
        t,
        n,
        a,
        void 0,
        l
      );
      a = Or();
      if (null !== e && !we)
        return wr(e, t, l), mn(e, t, l);
      P && a && Er(t);
      t.flags |= 1;
      Qe(e, t, n, l);
      return t.child;
    }
    function Ff(e, t, n, a, l, i) {
      ra(t);
      t.updateQueue = null;
      n = E0(
        t,
        a,
        n,
        l
      );
      A0(e);
      a = Or();
      if (null !== e && !we)
        return wr(e, t, i), mn(e, t, i);
      P && a && Er(t);
      t.flags |= 1;
      Qe(e, t, n, i);
      return t.child;
    }
    function Xf(e, t, n, a, l) {
      ra(t);
      if (null === t.stateNode) {
        var i = Ga, u = n.contextType;
        "object" === typeof u && null !== u && (i = Ke(u));
        i = new n(a, i);
        t.memoizedState = null !== i.state && void 0 !== i.state ? i.state : null;
        i.updater = Vc;
        t.stateNode = i;
        i._reactInternals = t;
        i = t.stateNode;
        i.props = a;
        i.state = t.memoizedState;
        i.refs = {};
        Nr(t);
        u = n.contextType;
        i.context = "object" === typeof u && null !== u ? Ke(u) : Ga;
        i.state = t.memoizedState;
        u = n.getDerivedStateFromProps;
        "function" === typeof u && ($u(
          t,
          n,
          u,
          a
        ), i.state = t.memoizedState);
        "function" === typeof n.getDerivedStateFromProps || "function" === typeof i.getSnapshotBeforeUpdate || "function" !== typeof i.UNSAFE_componentWillMount && "function" !== typeof i.componentWillMount || (u = i.state, "function" === typeof i.componentWillMount && i.componentWillMount(), "function" === typeof i.UNSAFE_componentWillMount && i.UNSAFE_componentWillMount(), u !== i.state && Vc.enqueueReplaceState(i, i.state, null), Gl(t, a, i, l), Ll(), i.state = t.memoizedState);
        "function" === typeof i.componentDidMount && (t.flags |= 4194308);
        a = true;
      } else if (null === e) {
        i = t.stateNode;
        var c = t.memoizedProps, r = da(n, c);
        i.props = r;
        var g = i.context, m = n.contextType;
        u = Ga;
        "object" === typeof m && null !== m && (u = Ke(m));
        var v = n.getDerivedStateFromProps;
        m = "function" === typeof v || "function" === typeof i.getSnapshotBeforeUpdate;
        c = t.pendingProps !== c;
        m || "function" !== typeof i.UNSAFE_componentWillReceiveProps && "function" !== typeof i.componentWillReceiveProps || (c || g !== u) && Hf(
          t,
          i,
          a,
          u
        );
        Cn = false;
        var p = t.memoizedState;
        i.state = p;
        Gl(t, a, i, l);
        Ll();
        g = t.memoizedState;
        c || p !== g || Cn ? ("function" === typeof v && ($u(
          t,
          n,
          v,
          a
        ), g = t.memoizedState), (r = Cn || qf(
          t,
          n,
          r,
          a,
          p,
          g,
          u
        )) ? (m || "function" !== typeof i.UNSAFE_componentWillMount && "function" !== typeof i.componentWillMount || ("function" === typeof i.componentWillMount && i.componentWillMount(), "function" === typeof i.UNSAFE_componentWillMount && i.UNSAFE_componentWillMount()), "function" === typeof i.componentDidMount && (t.flags |= 4194308)) : ("function" === typeof i.componentDidMount && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = g), i.props = a, i.state = g, i.context = u, a = r) : ("function" === typeof i.componentDidMount && (t.flags |= 4194308), a = false);
      } else {
        i = t.stateNode;
        Bc(e, t);
        u = t.memoizedProps;
        m = da(n, u);
        i.props = m;
        v = t.pendingProps;
        p = i.context;
        g = n.contextType;
        r = Ga;
        "object" === typeof g && null !== g && (r = Ke(g));
        c = n.getDerivedStateFromProps;
        (g = "function" === typeof c || "function" === typeof i.getSnapshotBeforeUpdate) || "function" !== typeof i.UNSAFE_componentWillReceiveProps && "function" !== typeof i.componentWillReceiveProps || (u !== v || p !== r) && Hf(
          t,
          i,
          a,
          r
        );
        Cn = false;
        p = t.memoizedState;
        i.state = p;
        Gl(t, a, i, l);
        Ll();
        var y = t.memoizedState;
        u !== v || p !== y || Cn || null !== e && null !== e.dependencies && Eo(e.dependencies) ? ("function" === typeof c && ($u(
          t,
          n,
          c,
          a
        ), y = t.memoizedState), (m = Cn || qf(
          t,
          n,
          m,
          a,
          p,
          y,
          r
        ) || null !== e && null !== e.dependencies && Eo(e.dependencies)) ? (g || "function" !== typeof i.UNSAFE_componentWillUpdate && "function" !== typeof i.componentWillUpdate || ("function" === typeof i.componentWillUpdate && i.componentWillUpdate(a, y, r), "function" === typeof i.UNSAFE_componentWillUpdate && i.UNSAFE_componentWillUpdate(
          a,
          y,
          r
        )), "function" === typeof i.componentDidUpdate && (t.flags |= 4), "function" === typeof i.getSnapshotBeforeUpdate && (t.flags |= 1024)) : ("function" !== typeof i.componentDidUpdate || u === e.memoizedProps && p === e.memoizedState || (t.flags |= 4), "function" !== typeof i.getSnapshotBeforeUpdate || u === e.memoizedProps && p === e.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = y), i.props = a, i.state = y, i.context = r, a = m) : ("function" !== typeof i.componentDidUpdate || u === e.memoizedProps && p === e.memoizedState || (t.flags |= 4), "function" !== typeof i.getSnapshotBeforeUpdate || u === e.memoizedProps && p === e.memoizedState || (t.flags |= 1024), a = false);
      }
      i = a;
      ro(e, t);
      a = 0 !== (t.flags & 128);
      i || a ? (i = t.stateNode, n = a && "function" !== typeof n.getDerivedStateFromError ? null : i.render(), t.flags |= 1, null !== e && a ? (t.child = sa(
        t,
        e.child,
        null,
        l
      ), t.child = sa(
        t,
        null,
        n,
        l
      )) : Qe(e, t, n, l), t.memoizedState = i.state, e = t.child) : e = mn(
        e,
        t,
        l
      );
      return e;
    }
    function Qf(e, t, n, a) {
      ca();
      t.flags |= 256;
      Qe(e, t, n, a);
      return t.child;
    }
    var Iu = {
      dehydrated: null,
      treeContext: null,
      retryLane: 0,
      hydrationErrors: null
    };
    function Pu(e) {
      return { baseLanes: e, cachePool: h0() };
    }
    function ec(e, t, n) {
      e = null !== e ? e.childLanes & ~n : 0;
      t && (e |= gt);
      return e;
    }
    function cp(e, t, n) {
      var a = t.pendingProps, l = false, i = 0 !== (t.flags & 128), u;
      (u = i) || (u = null !== e && null === e.memoizedState ? false : 0 !== (ke.current & 2));
      u && (l = true, t.flags &= -129);
      u = 0 !== (t.flags & 32);
      t.flags &= -33;
      if (null === e) {
        if (P) {
          l ? kn(t) : Dn(t);
          (e = Se) ? (e = Pp(
            e,
            Nt
          ), e = null !== e && "&" !== e.data ? e : null, null !== e && (t.memoizedState = {
            dehydrated: e,
            treeContext: null !== Fn ? { id: Yt, overflow: Vt } : null,
            retryLane: 536870912,
            hydrationErrors: null
          }, n = d0(e), n.return = t, t.child = n, Je = t, Se = null)) : e = null;
          if (null === e) throw Xn(t);
          ir(e) ? t.lanes = 32 : t.lanes = 536870912;
          return null;
        }
        var c = a.children;
        a = a.fallback;
        if (l)
          return Dn(t), l = t.mode, c = Ro(
            { mode: "hidden", children: c },
            l
          ), a = la(
            a,
            l,
            n,
            null
          ), c.return = t, a.return = t, c.sibling = a, t.child = c, a = t.child, a.memoizedState = Pu(n), a.childLanes = ec(
            e,
            u,
            n
          ), t.memoizedState = Iu, Ol(null, a);
        kn(t);
        return Qc(t, c);
      }
      var r = e.memoizedState;
      if (null !== r && (c = r.dehydrated, null !== c)) {
        if (i)
          t.flags & 256 ? (kn(t), t.flags &= -257, t = tc(
            e,
            t,
            n
          )) : null !== t.memoizedState ? (Dn(t), t.child = e.child, t.flags |= 128, t = null) : (Dn(t), c = a.fallback, l = t.mode, a = Ro(
            { mode: "visible", children: a.children },
            l
          ), c = la(
            c,
            l,
            n,
            null
          ), c.flags |= 2, a.return = t, c.return = t, a.sibling = c, t.child = a, sa(
            t,
            e.child,
            null,
            n
          ), a = t.child, a.memoizedState = Pu(n), a.childLanes = ec(
            e,
            u,
            n
          ), t.memoizedState = Iu, t = Ol(null, a));
        else if (kn(t), ir(c)) {
          u = c.nextSibling && c.nextSibling.dataset;
          if (u) var g = u.dgst;
          u = g;
          a = Error(A(419));
          a.stack = "";
          a.digest = u;
          Pl({ value: a, source: null, stack: null });
          t = tc(
            e,
            t,
            n
          );
        } else if (we || fl(e, t, n, false), u = 0 !== (n & e.childLanes), we || u) {
          u = me;
          if (null !== u && (a = Hd(u, n), 0 !== a && a !== r.retryLane))
            throw r.retryLane = a, ha(e, a), ut(u, e, a), Fr;
          lr(c) || Uo();
          t = tc(
            e,
            t,
            n
          );
        } else
          lr(c) ? (t.flags |= 192, t.child = e.child, t = null) : (e = r.treeContext, Se = Rt(
            c.nextSibling
          ), Je = t, P = true, Bn = null, Nt = false, null !== e && g0(t, e), t = Qc(
            t,
            a.children
          ), t.flags |= 4096);
        return t;
      }
      if (l)
        return Dn(t), c = a.fallback, l = t.mode, r = e.child, g = r.sibling, a = rn(r, {
          mode: "hidden",
          children: a.children
        }), a.subtreeFlags = r.subtreeFlags & 65011712, null !== g ? c = rn(
          g,
          c
        ) : (c = la(
          c,
          l,
          n,
          null
        ), c.flags |= 2), c.return = t, a.return = t, a.sibling = c, t.child = a, Ol(null, a), a = t.child, c = e.child.memoizedState, null === c ? c = Pu(n) : (l = c.cachePool, null !== l ? (r = Oe._currentValue, l = l.parent !== r ? { parent: r, pool: r } : l) : l = h0(), c = {
          baseLanes: c.baseLanes | n,
          cachePool: l
        }), a.memoizedState = c, a.childLanes = ec(
          e,
          u,
          n
        ), t.memoizedState = Iu, Ol(e.child, a);
      kn(t);
      n = e.child;
      e = n.sibling;
      n = rn(n, {
        mode: "visible",
        children: a.children
      });
      n.return = t;
      n.sibling = null;
      null !== e && (u = t.deletions, null === u ? (t.deletions = [e], t.flags |= 16) : u.push(e));
      t.child = n;
      t.memoizedState = null;
      return n;
    }
    function Qc(e, t) {
      t = Ro(
        { mode: "visible", children: t },
        e.mode
      );
      t.return = e;
      return e.child = t;
    }
    function Ro(e, t) {
      e = pt(22, e, null, t);
      e.lanes = 0;
      return e;
    }
    function tc(e, t, n) {
      sa(t, e.child, null, n);
      e = Qc(
        t,
        t.pendingProps.children
      );
      e.flags |= 2;
      t.memoizedState = null;
      return e;
    }
    function Zf(e, t, n) {
      e.lanes |= t;
      var a = e.alternate;
      null !== a && (a.lanes |= t);
      Oc(e.return, t, n);
    }
    function nc(e, t, n, a, l, i) {
      var u = e.memoizedState;
      null === u ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: a,
        tail: n,
        tailMode: l,
        treeForkCount: i
      } : (u.isBackwards = t, u.rendering = null, u.renderingStartTime = 0, u.last = a, u.tail = n, u.tailMode = l, u.treeForkCount = i);
    }
    function rp(e, t, n) {
      var a = t.pendingProps, l = a.revealOrder, i = a.tail;
      a = a.children;
      var u = ke.current, c = 0 !== (u & 2);
      c ? (u = u & 1 | 2, t.flags |= 128) : u &= 1;
      ye(ke, u);
      Qe(e, t, a, n);
      a = P ? Il : 0;
      if (!c && null !== e && 0 !== (e.flags & 128))
        e: for (e = t.child; null !== e; ) {
          if (13 === e.tag)
            null !== e.memoizedState && Zf(e, n, t);
          else if (19 === e.tag)
            Zf(e, n, t);
          else if (null !== e.child) {
            e.child.return = e;
            e = e.child;
            continue;
          }
          if (e === t) break e;
          for (; null === e.sibling; ) {
            if (null === e.return || e.return === t)
              break e;
            e = e.return;
          }
          e.sibling.return = e.return;
          e = e.sibling;
        }
      switch (l) {
        case "forwards":
          n = t.child;
          for (l = null; null !== n; )
            e = n.alternate, null !== e && null === ko(e) && (l = n), n = n.sibling;
          n = l;
          null === n ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null);
          nc(
            t,
            false,
            l,
            n,
            i,
            a
          );
          break;
        case "backwards":
        case "unstable_legacy-backwards":
          n = null;
          l = t.child;
          for (t.child = null; null !== l; ) {
            e = l.alternate;
            if (null !== e && null === ko(e)) {
              t.child = l;
              break;
            }
            e = l.sibling;
            l.sibling = n;
            n = l;
            l = e;
          }
          nc(
            t,
            true,
            n,
            null,
            i,
            a
          );
          break;
        case "together":
          nc(
            t,
            false,
            null,
            null,
            void 0,
            a
          );
          break;
        default:
          t.memoizedState = null;
      }
      return t.child;
    }
    function mn(e, t, n) {
      null !== e && (t.dependencies = e.dependencies);
      Zn |= t.lanes;
      if (0 === (n & t.childLanes))
        if (null !== e) {
          if (fl(
            e,
            t,
            n,
            false
          ), 0 === (n & t.childLanes))
            return null;
        } else return null;
      if (null !== e && t.child !== e.child)
        throw Error(A(153));
      if (null !== t.child) {
        e = t.child;
        n = rn(e, e.pendingProps);
        t.child = n;
        for (n.return = t; null !== e.sibling; )
          e = e.sibling, n = n.sibling = rn(e, e.pendingProps), n.return = t;
        n.sibling = null;
      }
      return t.child;
    }
    function Xr(e, t) {
      if (0 !== (e.lanes & t)) return true;
      e = e.dependencies;
      return null !== e && Eo(e) ? true : false;
    }
    function wm(e, t, n) {
      switch (t.tag) {
        case 3:
          yo(t, t.stateNode.containerInfo);
          Tn(t, Oe, e.memoizedState.cache);
          ca();
          break;
        case 27:
        case 5:
          xc(t);
          break;
        case 4:
          yo(t, t.stateNode.containerInfo);
          break;
        case 10:
          Tn(
            t,
            t.type,
            t.memoizedProps.value
          );
          break;
        case 31:
          if (null !== t.memoizedState)
            return t.flags |= 128, jc(t), null;
          break;
        case 13:
          var a = t.memoizedState;
          if (null !== a) {
            if (null !== a.dehydrated)
              return kn(t), t.flags |= 128, null;
            if (0 !== (n & t.child.childLanes))
              return cp(e, t, n);
            kn(t);
            e = mn(
              e,
              t,
              n
            );
            return null !== e ? e.sibling : null;
          }
          kn(t);
          break;
        case 19:
          var l = 0 !== (e.flags & 128);
          a = 0 !== (n & t.childLanes);
          a || (fl(
            e,
            t,
            n,
            false
          ), a = 0 !== (n & t.childLanes));
          if (l) {
            if (a)
              return rp(
                e,
                t,
                n
              );
            t.flags |= 128;
          }
          l = t.memoizedState;
          null !== l && (l.rendering = null, l.tail = null, l.lastEffect = null);
          ye(ke, ke.current);
          if (a) break;
          else return null;
        case 22:
          return t.lanes = 0, up(
            e,
            t,
            n,
            t.pendingProps
          );
        case 24:
          Tn(t, Oe, e.memoizedState.cache);
      }
      return mn(e, t, n);
    }
    function sp(e, t, n) {
      if (null !== e)
        if (e.memoizedProps !== t.pendingProps)
          we = true;
        else {
          if (!Xr(e, n) && 0 === (t.flags & 128))
            return we = false, wm(
              e,
              t,
              n
            );
          we = 0 !== (e.flags & 131072) ? true : false;
        }
      else
        we = false, P && 0 !== (t.flags & 1048576) && p0(t, Il, t.index);
      t.lanes = 0;
      switch (t.tag) {
        case 16:
          e: {
            var a = t.pendingProps;
            e = ta(t.elementType);
            t.type = e;
            if ("function" === typeof e)
              Ar(e) ? (a = da(e, a), t.tag = 1, t = Xf(
                null,
                t,
                e,
                a,
                n
              )) : (t.tag = 0, t = Xc(
                null,
                t,
                e,
                a,
                n
              ));
            else {
              if (void 0 !== e && null !== e) {
                var l = e.$$typeof;
                if (l === rr) {
                  t.tag = 11;
                  t = Lf(
                    null,
                    t,
                    e,
                    a,
                    n
                  );
                  break e;
                } else if (l === sr) {
                  t.tag = 14;
                  t = Gf(
                    null,
                    t,
                    e,
                    a,
                    n
                  );
                  break e;
                }
              }
              t = vc(e) || e;
              throw Error(A(306, t, ""));
            }
          }
          return t;
        case 0:
          return Xc(
            e,
            t,
            t.type,
            t.pendingProps,
            n
          );
        case 1:
          return a = t.type, l = da(
            a,
            t.pendingProps
          ), Xf(
            e,
            t,
            a,
            l,
            n
          );
        case 3:
          e: {
            yo(
              t,
              t.stateNode.containerInfo
            );
            if (null === e) throw Error(A(387));
            a = t.pendingProps;
            var i = t.memoizedState;
            l = i.element;
            Bc(e, t);
            Gl(t, a, null, n);
            var u = t.memoizedState;
            a = u.cache;
            Tn(t, Oe, a);
            a !== i.cache && wc(
              t,
              [Oe],
              n,
              true
            );
            Ll();
            a = u.element;
            if (i.isDehydrated)
              if (i = {
                element: a,
                isDehydrated: false,
                cache: u.cache
              }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
                t = Qf(
                  e,
                  t,
                  a,
                  n
                );
                break e;
              } else if (a !== l) {
                l = Dt(
                  Error(A(424)),
                  t
                );
                Pl(l);
                t = Qf(
                  e,
                  t,
                  a,
                  n
                );
                break e;
              } else {
                e = t.stateNode.containerInfo;
                switch (e.nodeType) {
                  case 9:
                    e = e.body;
                    break;
                  default:
                    e = "HTML" === e.nodeName ? e.ownerDocument.body : e;
                }
                Se = Rt(e.firstChild);
                Je = t;
                P = true;
                Bn = null;
                Nt = true;
                n = b0(
                  t,
                  null,
                  a,
                  n
                );
                for (t.child = n; n; )
                  n.flags = n.flags & -3 | 4096, n = n.sibling;
              }
            else {
              ca();
              if (a === l) {
                t = mn(
                  e,
                  t,
                  n
                );
                break e;
              }
              Qe(e, t, a, n);
            }
            t = t.child;
          }
          return t;
        case 26:
          return ro(e, t), null === e ? (n = md(
            t.type,
            null,
            t.pendingProps,
            null
          )) ? t.memoizedState = n : P || (n = t.type, e = t.pendingProps, a = jo(
            Un.current
          ).createElement(n), a[Ze] = t, a[ct] = e, We(a, n, e), Ye(a), t.stateNode = a) : t.memoizedState = md(
            t.type,
            e.memoizedProps,
            t.pendingProps,
            e.memoizedState
          ), null;
        case 27:
          return xc(t), null === e && P && (a = t.stateNode = eg(
            t.type,
            t.pendingProps,
            Un.current
          ), Je = t, Nt = true, l = Se, Kn(t.type) ? (or = l, Se = Rt(a.firstChild)) : Se = l), Qe(
            e,
            t,
            t.pendingProps.children,
            n
          ), ro(e, t), null === e && (t.flags |= 4194304), t.child;
        case 5:
          if (null === e && P) {
            if (l = a = Se)
              a = ch(
                a,
                t.type,
                t.pendingProps,
                Nt
              ), null !== a ? (t.stateNode = a, Je = t, Se = Rt(a.firstChild), Nt = false, l = true) : l = false;
            l || Xn(t);
          }
          xc(t);
          l = t.type;
          i = t.pendingProps;
          u = null !== e ? e.memoizedProps : null;
          a = i.children;
          nr(l, i) ? a = null : null !== u && nr(l, u) && (t.flags |= 32);
          null !== t.memoizedState && (l = _r(
            e,
            t,
            Cm,
            null,
            null,
            n
          ), ii._currentValue = l);
          ro(e, t);
          Qe(e, t, a, n);
          return t.child;
        case 6:
          if (null === e && P) {
            if (e = n = Se)
              n = rh(
                n,
                t.pendingProps,
                Nt
              ), null !== n ? (t.stateNode = n, Je = t, Se = null, e = true) : e = false;
            e || Xn(t);
          }
          return null;
        case 13:
          return cp(e, t, n);
        case 4:
          return yo(
            t,
            t.stateNode.containerInfo
          ), a = t.pendingProps, null === e ? t.child = sa(
            t,
            null,
            a,
            n
          ) : Qe(e, t, a, n), t.child;
        case 11:
          return Lf(
            e,
            t,
            t.type,
            t.pendingProps,
            n
          );
        case 7:
          return Qe(
            e,
            t,
            t.pendingProps,
            n
          ), t.child;
        case 8:
          return Qe(
            e,
            t,
            t.pendingProps.children,
            n
          ), t.child;
        case 12:
          return Qe(
            e,
            t,
            t.pendingProps.children,
            n
          ), t.child;
        case 10:
          return a = t.pendingProps, Tn(t, t.type, a.value), Qe(e, t, a.children, n), t.child;
        case 9:
          return l = t.type._context, a = t.pendingProps.children, ra(t), l = Ke(l), a = a(l), t.flags |= 1, Qe(e, t, a, n), t.child;
        case 14:
          return Gf(
            e,
            t,
            t.type,
            t.pendingProps,
            n
          );
        case 15:
          return op(
            e,
            t,
            t.type,
            t.pendingProps,
            n
          );
        case 19:
          return rp(e, t, n);
        case 31:
          return Om(e, t, n);
        case 22:
          return up(
            e,
            t,
            n,
            t.pendingProps
          );
        case 24:
          return ra(t), a = Ke(Oe), null === e ? (l = kr(), null === l && (l = me, i = Tr(), l.pooledCache = i, i.refCount++, null !== i && (l.pooledCacheLanes |= n), l = i), t.memoizedState = { parent: a, cache: l }, Nr(t), Tn(t, Oe, l)) : (0 !== (e.lanes & n) && (Bc(e, t), Gl(t, null, null, n), Ll()), l = e.memoizedState, i = t.memoizedState, l.parent !== a ? (l = { parent: a, cache: a }, t.memoizedState = l, 0 === t.lanes && (t.memoizedState = t.updateQueue.baseState = l), Tn(t, Oe, a)) : (a = i.cache, Tn(t, Oe, a), a !== l.cache && wc(
            t,
            [Oe],
            n,
            true
          ))), Qe(
            e,
            t,
            t.pendingProps.children,
            n
          ), t.child;
        case 29:
          throw t.pendingProps;
      }
      throw Error(A(156, t.tag));
    }
    function Pt(e) {
      e.flags |= 4;
    }
    function ac(e, t, n, a, l) {
      if (t = 0 !== (e.mode & 32)) t = false;
      if (t) {
        if (e.flags |= 16777216, (l & 335544128) === l)
          if (e.stateNode.complete) e.flags |= 8192;
          else if (wp()) e.flags |= 8192;
          else
            throw oa = Co, Dr;
      } else e.flags &= -16777217;
    }
    function Jf(e, t) {
      if ("stylesheet" !== t.type || 0 !== (t.state.loading & 4))
        e.flags &= -16777217;
      else if (e.flags |= 16777216, !ag(t))
        if (wp()) e.flags |= 8192;
        else
          throw oa = Co, Dr;
    }
    function Zi(e, t) {
      null !== t && (e.flags |= 4);
      e.flags & 16384 && (t = 22 !== e.tag ? Ud() : 536870912, e.lanes |= t, ll |= t);
    }
    function Tl(e, t) {
      if (!P)
        switch (e.tailMode) {
          case "hidden":
            t = e.tail;
            for (var n = null; null !== t; )
              null !== t.alternate && (n = t), t = t.sibling;
            null === n ? e.tail = null : n.sibling = null;
            break;
          case "collapsed":
            n = e.tail;
            for (var a = null; null !== n; )
              null !== n.alternate && (a = n), n = n.sibling;
            null === a ? t || null === e.tail ? e.tail = null : e.tail.sibling = null : a.sibling = null;
        }
    }
    function xe(e) {
      var t = null !== e.alternate && e.alternate.child === e.child, n = 0, a = 0;
      if (t)
        for (var l = e.child; null !== l; )
          n |= l.lanes | l.childLanes, a |= l.subtreeFlags & 65011712, a |= l.flags & 65011712, l.return = e, l = l.sibling;
      else
        for (l = e.child; null !== l; )
          n |= l.lanes | l.childLanes, a |= l.subtreeFlags, a |= l.flags, l.return = e, l = l.sibling;
      e.subtreeFlags |= a;
      e.childLanes = n;
      return t;
    }
    function Um(e, t, n) {
      var a = t.pendingProps;
      Cr(t);
      switch (t.tag) {
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return xe(t), null;
        case 1:
          return xe(t), null;
        case 3:
          n = t.stateNode;
          a = null;
          null !== e && (a = e.memoizedState.cache);
          t.memoizedState.cache !== a && (t.flags |= 2048);
          sn(Oe);
          Ia();
          n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null);
          if (null === e || null === e.child)
            Na(t) ? Pt(t) : null === e || e.memoizedState.isDehydrated && 0 === (t.flags & 256) || (t.flags |= 1024, Ju());
          xe(t);
          return null;
        case 26:
          var l = t.type, i = t.memoizedState;
          null === e ? (Pt(t), null !== i ? (xe(t), Jf(t, i)) : (xe(t), ac(
            t,
            l,
            null,
            a,
            n
          ))) : i ? i !== e.memoizedState ? (Pt(t), xe(t), Jf(t, i)) : (xe(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== a && Pt(t), xe(t), ac(
            t,
            l,
            e,
            a,
            n
          ));
          return null;
        case 27:
          vo(t);
          n = Un.current;
          l = t.type;
          if (null !== e && null != t.stateNode)
            e.memoizedProps !== a && Pt(t);
          else {
            if (!a) {
              if (null === t.stateNode)
                throw Error(A(166));
              xe(t);
              return null;
            }
            e = Xt.current;
            Na(t) ? Af(t, e) : (e = eg(l, a, n), t.stateNode = e, Pt(t));
          }
          xe(t);
          return null;
        case 5:
          vo(t);
          l = t.type;
          if (null !== e && null != t.stateNode)
            e.memoizedProps !== a && Pt(t);
          else {
            if (!a) {
              if (null === t.stateNode)
                throw Error(A(166));
              xe(t);
              return null;
            }
            i = Xt.current;
            if (Na(t))
              Af(t, i);
            else {
              var u = jo(
                Un.current
              );
              switch (i) {
                case 1:
                  i = u.createElementNS(
                    "http://www.w3.org/2000/svg",
                    l
                  );
                  break;
                case 2:
                  i = u.createElementNS(
                    "http://www.w3.org/1998/Math/MathML",
                    l
                  );
                  break;
                default:
                  switch (l) {
                    case "svg":
                      i = u.createElementNS(
                        "http://www.w3.org/2000/svg",
                        l
                      );
                      break;
                    case "math":
                      i = u.createElementNS(
                        "http://www.w3.org/1998/Math/MathML",
                        l
                      );
                      break;
                    case "script":
                      i = u.createElement("div");
                      i.innerHTML = "<script><\/script>";
                      i = i.removeChild(
                        i.firstChild
                      );
                      break;
                    case "select":
                      i = "string" === typeof a.is ? u.createElement("select", {
                        is: a.is
                      }) : u.createElement("select");
                      a.multiple ? i.multiple = true : a.size && (i.size = a.size);
                      break;
                    default:
                      i = "string" === typeof a.is ? u.createElement(l, { is: a.is }) : u.createElement(l);
                  }
              }
              i[Ze] = t;
              i[ct] = a;
              e: for (u = t.child; null !== u; ) {
                if (5 === u.tag || 6 === u.tag)
                  i.appendChild(u.stateNode);
                else if (4 !== u.tag && 27 !== u.tag && null !== u.child) {
                  u.child.return = u;
                  u = u.child;
                  continue;
                }
                if (u === t) break e;
                for (; null === u.sibling; ) {
                  if (null === u.return || u.return === t)
                    break e;
                  u = u.return;
                }
                u.sibling.return = u.return;
                u = u.sibling;
              }
              t.stateNode = i;
              e: switch (We(i, l, a), l) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  a = !!a.autoFocus;
                  break e;
                case "img":
                  a = true;
                  break e;
                default:
                  a = false;
              }
              a && Pt(t);
            }
          }
          xe(t);
          ac(
            t,
            t.type,
            null === e ? null : e.memoizedProps,
            t.pendingProps,
            n
          );
          return null;
        case 6:
          if (e && null != t.stateNode)
            e.memoizedProps !== a && Pt(t);
          else {
            if ("string" !== typeof a && null === t.stateNode)
              throw Error(A(166));
            e = Un.current;
            if (Na(t)) {
              e = t.stateNode;
              n = t.memoizedProps;
              a = null;
              l = Je;
              if (null !== l)
                switch (l.tag) {
                  case 27:
                  case 5:
                    a = l.memoizedProps;
                }
              e[Ze] = t;
              e = e.nodeValue === n || null !== a && true === a.suppressHydrationWarning || Wp(e.nodeValue, n) ? true : false;
              e || Xn(t, true);
            } else
              e = jo(e).createTextNode(
                a
              ), e[Ze] = t, t.stateNode = e;
          }
          xe(t);
          return null;
        case 31:
          n = t.memoizedState;
          if (null === e || null !== e.memoizedState) {
            a = Na(t);
            if (null !== n) {
              if (null === e) {
                if (!a) throw Error(A(318));
                e = t.memoizedState;
                e = null !== e ? e.dehydrated : null;
                if (!e) throw Error(A(557));
                e[Ze] = t;
              } else
                ca(), 0 === (t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
              xe(t);
              e = false;
            } else
              n = Ju(), null !== e && null !== e.memoizedState && (e.memoizedState.hydrationErrors = n), e = true;
            if (!e) {
              if (t.flags & 256)
                return dt(t), t;
              dt(t);
              return null;
            }
            if (0 !== (t.flags & 128))
              throw Error(A(558));
          }
          xe(t);
          return null;
        case 13:
          a = t.memoizedState;
          if (null === e || null !== e.memoizedState && null !== e.memoizedState.dehydrated) {
            l = Na(t);
            if (null !== a && null !== a.dehydrated) {
              if (null === e) {
                if (!l) throw Error(A(318));
                l = t.memoizedState;
                l = null !== l ? l.dehydrated : null;
                if (!l) throw Error(A(317));
                l[Ze] = t;
              } else
                ca(), 0 === (t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
              xe(t);
              l = false;
            } else
              l = Ju(), null !== e && null !== e.memoizedState && (e.memoizedState.hydrationErrors = l), l = true;
            if (!l) {
              if (t.flags & 256)
                return dt(t), t;
              dt(t);
              return null;
            }
          }
          dt(t);
          if (0 !== (t.flags & 128))
            return t.lanes = n, t;
          n = null !== a;
          e = null !== e && null !== e.memoizedState;
          n && (a = t.child, l = null, null !== a.alternate && null !== a.alternate.memoizedState && null !== a.alternate.memoizedState.cachePool && (l = a.alternate.memoizedState.cachePool.pool), i = null, null !== a.memoizedState && null !== a.memoizedState.cachePool && (i = a.memoizedState.cachePool.pool), i !== l && (a.flags |= 2048));
          n !== e && n && (t.child.flags |= 8192);
          Zi(t, t.updateQueue);
          xe(t);
          return null;
        case 4:
          return Ia(), null === e && Ir(t.stateNode.containerInfo), xe(t), null;
        case 10:
          return sn(t.type), xe(t), null;
        case 19:
          Ve(ke);
          a = t.memoizedState;
          if (null === a) return xe(t), null;
          l = 0 !== (t.flags & 128);
          i = a.rendering;
          if (null === i)
            if (l) Tl(a, false);
            else {
              if (0 !== Te || null !== e && 0 !== (e.flags & 128))
                for (e = t.child; null !== e; ) {
                  i = ko(e);
                  if (null !== i) {
                    t.flags |= 128;
                    Tl(a, false);
                    e = i.updateQueue;
                    t.updateQueue = e;
                    Zi(t, e);
                    t.subtreeFlags = 0;
                    e = n;
                    for (n = t.child; null !== n; )
                      f0(n, e), n = n.sibling;
                    ye(
                      ke,
                      ke.current & 1 | 2
                    );
                    P && an(t, a.treeForkCount);
                    return t.child;
                  }
                  e = e.sibling;
                }
              null !== a.tail && mt() > Oo && (t.flags |= 128, l = true, Tl(a, false), t.lanes = 4194304);
            }
          else {
            if (!l)
              if (e = ko(i), null !== e) {
                if (t.flags |= 128, l = true, e = e.updateQueue, t.updateQueue = e, Zi(t, e), Tl(a, true), null === a.tail && "hidden" === a.tailMode && !i.alternate && !P)
                  return xe(t), null;
              } else
                2 * mt() - a.renderingStartTime > Oo && 536870912 !== n && (t.flags |= 128, l = true, Tl(a, false), t.lanes = 4194304);
            a.isBackwards ? (i.sibling = t.child, t.child = i) : (e = a.last, null !== e ? e.sibling = i : t.child = i, a.last = i);
          }
          if (null !== a.tail)
            return e = a.tail, a.rendering = e, a.tail = e.sibling, a.renderingStartTime = mt(), e.sibling = null, n = ke.current, ye(
              ke,
              l ? n & 1 | 2 : n & 1
            ), P && an(t, a.treeForkCount), e;
          xe(t);
          return null;
        case 22:
        case 23:
          return dt(t), Mr(), a = null !== t.memoizedState, null !== e ? null !== e.memoizedState !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? 0 !== (n & 536870912) && 0 === (t.flags & 128) && (xe(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : xe(t), n = t.updateQueue, null !== n && Zi(t, n.retryQueue), n = null, null !== e && null !== e.memoizedState && null !== e.memoizedState.cachePool && (n = e.memoizedState.cachePool.pool), a = null, null !== t.memoizedState && null !== t.memoizedState.cachePool && (a = t.memoizedState.cachePool.pool), a !== n && (t.flags |= 2048), null !== e && Ve(ia), null;
        case 24:
          return n = null, null !== e && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), sn(Oe), xe(t), null;
        case 25:
          return null;
        case 30:
          return null;
      }
      throw Error(A(156, t.tag));
    }
    function Bm(e, t) {
      Cr(t);
      switch (t.tag) {
        case 1:
          return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 3:
          return sn(Oe), Ia(), e = t.flags, 0 !== (e & 65536) && 0 === (e & 128) ? (t.flags = e & -65537 | 128, t) : null;
        case 26:
        case 27:
        case 5:
          return vo(t), null;
        case 31:
          if (null !== t.memoizedState) {
            dt(t);
            if (null === t.alternate)
              throw Error(A(340));
            ca();
          }
          e = t.flags;
          return e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 13:
          dt(t);
          e = t.memoizedState;
          if (null !== e && null !== e.dehydrated) {
            if (null === t.alternate)
              throw Error(A(340));
            ca();
          }
          e = t.flags;
          return e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 19:
          return Ve(ke), null;
        case 4:
          return Ia(), null;
        case 10:
          return sn(t.type), null;
        case 22:
        case 23:
          return dt(t), Mr(), null !== e && Ve(ia), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 24:
          return sn(Oe), null;
        case 25:
          return null;
        default:
          return null;
      }
    }
    function fp(e, t) {
      Cr(t);
      switch (t.tag) {
        case 3:
          sn(Oe);
          Ia();
          break;
        case 26:
        case 27:
        case 5:
          vo(t);
          break;
        case 4:
          Ia();
          break;
        case 31:
          null !== t.memoizedState && dt(t);
          break;
        case 13:
          dt(t);
          break;
        case 19:
          Ve(ke);
          break;
        case 10:
          sn(t.type);
          break;
        case 22:
        case 23:
          dt(t);
          Mr();
          null !== e && Ve(ia);
          break;
        case 24:
          sn(Oe);
      }
    }
    function hi(e, t) {
      try {
        var n = t.updateQueue, a = null !== n ? n.lastEffect : null;
        if (null !== a) {
          var l = a.next;
          n = l;
          do {
            if ((n.tag & e) === e) {
              a = void 0;
              var i = n.create, u = n.inst;
              a = i();
              u.destroy = a;
            }
            n = n.next;
          } while (n !== l);
        }
      } catch (c) {
        fe(t, t.return, c);
      }
    }
    function Qn(e, t, n) {
      try {
        var a = t.updateQueue, l = null !== a ? a.lastEffect : null;
        if (null !== l) {
          var i = l.next;
          a = i;
          do {
            if ((a.tag & e) === e) {
              var u = a.inst, c = u.destroy;
              if (void 0 !== c) {
                u.destroy = void 0;
                l = t;
                var r = n, g = c;
                try {
                  g();
                } catch (m) {
                  fe(
                    l,
                    r,
                    m
                  );
                }
              }
            }
            a = a.next;
          } while (a !== i);
        }
      } catch (m) {
        fe(t, t.return, m);
      }
    }
    function dp(e) {
      var t = e.updateQueue;
      if (null !== t) {
        var n = e.stateNode;
        try {
          S0(t, n);
        } catch (a) {
          fe(e, e.return, a);
        }
      }
    }
    function pp(e, t, n) {
      n.props = da(
        e.type,
        e.memoizedProps
      );
      n.state = e.memoizedState;
      try {
        n.componentWillUnmount();
      } catch (a) {
        fe(e, t, a);
      }
    }
    function Vl(e, t) {
      try {
        var n = e.ref;
        if (null !== n) {
          switch (e.tag) {
            case 26:
            case 27:
            case 5:
              var a = e.stateNode;
              break;
            case 30:
              a = e.stateNode;
              break;
            default:
              a = e.stateNode;
          }
          "function" === typeof n ? e.refCleanup = n(a) : n.current = a;
        }
      } catch (l) {
        fe(e, t, l);
      }
    }
    function Ft(e, t) {
      var n = e.ref, a = e.refCleanup;
      if (null !== n)
        if ("function" === typeof a)
          try {
            a();
          } catch (l) {
            fe(e, t, l);
          } finally {
            e.refCleanup = null, e = e.alternate, null != e && (e.refCleanup = null);
          }
        else if ("function" === typeof n)
          try {
            n(null);
          } catch (l) {
            fe(e, t, l);
          }
        else n.current = null;
    }
    function gp(e) {
      var t = e.type, n = e.memoizedProps, a = e.stateNode;
      try {
        e: switch (t) {
          case "button":
          case "input":
          case "select":
          case "textarea":
            n.autoFocus && a.focus();
            break e;
          case "img":
            n.src ? a.src = n.src : n.srcSet && (a.srcset = n.srcSet);
        }
      } catch (l) {
        fe(e, e.return, l);
      }
    }
    function lc(e, t, n) {
      try {
        var a = e.stateNode;
        nh(a, e.type, n, t);
        a[ct] = t;
      } catch (l) {
        fe(e, e.return, l);
      }
    }
    function mp(e) {
      return 5 === e.tag || 3 === e.tag || 26 === e.tag || 27 === e.tag && Kn(e.type) || 4 === e.tag;
    }
    function ic(e) {
      e: for (; ; ) {
        for (; null === e.sibling; ) {
          if (null === e.return || mp(e.return)) return null;
          e = e.return;
        }
        e.sibling.return = e.return;
        for (e = e.sibling; 5 !== e.tag && 6 !== e.tag && 18 !== e.tag; ) {
          if (27 === e.tag && Kn(e.type)) continue e;
          if (e.flags & 2) continue e;
          if (null === e.child || 4 === e.tag) continue e;
          else e.child.return = e, e = e.child;
        }
        if (!(e.flags & 2)) return e.stateNode;
      }
    }
    function Zc(e, t, n) {
      var a = e.tag;
      if (5 === a || 6 === a)
        e = e.stateNode, t ? (9 === n.nodeType ? n.body : "HTML" === n.nodeName ? n.ownerDocument.body : n).insertBefore(e, t) : (t = 9 === n.nodeType ? n.body : "HTML" === n.nodeName ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, null !== n && void 0 !== n || null !== t.onclick || (t.onclick = un));
      else if (4 !== a && (27 === a && Kn(e.type) && (n = e.stateNode, t = null), e = e.child, null !== e))
        for (Zc(e, t, n), e = e.sibling; null !== e; )
          Zc(e, t, n), e = e.sibling;
    }
    function _o(e, t, n) {
      var a = e.tag;
      if (5 === a || 6 === a)
        e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
      else if (4 !== a && (27 === a && Kn(e.type) && (n = e.stateNode), e = e.child, null !== e))
        for (_o(e, t, n), e = e.sibling; null !== e; )
          _o(e, t, n), e = e.sibling;
    }
    function hp(e) {
      var t = e.stateNode, n = e.memoizedProps;
      try {
        for (var a = e.type, l = t.attributes; l.length; )
          t.removeAttributeNode(l[0]);
        We(t, a, n);
        t[Ze] = e;
        t[ct] = n;
      } catch (i) {
        fe(e, e.return, i);
      }
    }
    var ln = false;
    var _e = false;
    var oc = false;
    var Kf = "function" === typeof WeakSet ? WeakSet : Set;
    var Ge = null;
    function qm(e, t) {
      e = e.containerInfo;
      er = Vo;
      e = a0(e);
      if (xr(e)) {
        if ("selectionStart" in e)
          var n = {
            start: e.selectionStart,
            end: e.selectionEnd
          };
        else
          e: {
            n = (n = e.ownerDocument) && n.defaultView || window;
            var a = n.getSelection && n.getSelection();
            if (a && 0 !== a.rangeCount) {
              n = a.anchorNode;
              var l = a.anchorOffset, i = a.focusNode;
              a = a.focusOffset;
              try {
                n.nodeType, i.nodeType;
              } catch (z) {
                n = null;
                break e;
              }
              var u = 0, c = -1, r = -1, g = 0, m = 0, v = e, p = null;
              t: for (; ; ) {
                for (var y; ; ) {
                  v !== n || 0 !== l && 3 !== v.nodeType || (c = u + l);
                  v !== i || 0 !== a && 3 !== v.nodeType || (r = u + a);
                  3 === v.nodeType && (u += v.nodeValue.length);
                  if (null === (y = v.firstChild)) break;
                  p = v;
                  v = y;
                }
                for (; ; ) {
                  if (v === e) break t;
                  p === n && ++g === l && (c = u);
                  p === i && ++m === a && (r = u);
                  if (null !== (y = v.nextSibling)) break;
                  v = p;
                  p = v.parentNode;
                }
                v = y;
              }
              n = -1 === c || -1 === r ? null : { start: c, end: r };
            } else n = null;
          }
        n = n || { start: 0, end: 0 };
      } else n = null;
      tr = { focusedElem: e, selectionRange: n };
      Vo = false;
      for (Ge = t; null !== Ge; )
        if (t = Ge, e = t.child, 0 !== (t.subtreeFlags & 1028) && null !== e)
          e.return = t, Ge = e;
        else
          for (; null !== Ge; ) {
            t = Ge;
            i = t.alternate;
            e = t.flags;
            switch (t.tag) {
              case 0:
                if (0 !== (e & 4) && (e = t.updateQueue, e = null !== e ? e.events : null, null !== e))
                  for (n = 0; n < e.length; n++)
                    l = e[n], l.ref.impl = l.nextImpl;
                break;
              case 11:
              case 15:
                break;
              case 1:
                if (0 !== (e & 1024) && null !== i) {
                  e = void 0;
                  n = t;
                  l = i.memoizedProps;
                  i = i.memoizedState;
                  a = n.stateNode;
                  try {
                    var T = da(
                      n.type,
                      l
                    );
                    e = a.getSnapshotBeforeUpdate(
                      T,
                      i
                    );
                    a.__reactInternalSnapshotBeforeUpdate = e;
                  } catch (z) {
                    fe(
                      n,
                      n.return,
                      z
                    );
                  }
                }
                break;
              case 3:
                if (0 !== (e & 1024)) {
                  if (e = t.stateNode.containerInfo, n = e.nodeType, 9 === n)
                    ar(e);
                  else if (1 === n)
                    switch (e.nodeName) {
                      case "HEAD":
                      case "HTML":
                      case "BODY":
                        ar(e);
                        break;
                      default:
                        e.textContent = "";
                    }
                }
                break;
              case 5:
              case 26:
              case 27:
              case 6:
              case 4:
              case 17:
                break;
              default:
                if (0 !== (e & 1024)) throw Error(A(163));
            }
            e = t.sibling;
            if (null !== e) {
              e.return = t.return;
              Ge = e;
              break;
            }
            Ge = t.return;
          }
    }
    function yp(e, t, n) {
      var a = n.flags;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          tn(e, n);
          a & 4 && hi(5, n);
          break;
        case 1:
          tn(e, n);
          if (a & 4)
            if (e = n.stateNode, null === t)
              try {
                e.componentDidMount();
              } catch (u) {
                fe(n, n.return, u);
              }
            else {
              var l = da(
                n.type,
                t.memoizedProps
              );
              t = t.memoizedState;
              try {
                e.componentDidUpdate(
                  l,
                  t,
                  e.__reactInternalSnapshotBeforeUpdate
                );
              } catch (u) {
                fe(
                  n,
                  n.return,
                  u
                );
              }
            }
          a & 64 && dp(n);
          a & 512 && Vl(n, n.return);
          break;
        case 3:
          tn(e, n);
          if (a & 64 && (e = n.updateQueue, null !== e)) {
            t = null;
            if (null !== n.child)
              switch (n.child.tag) {
                case 27:
                case 5:
                  t = n.child.stateNode;
                  break;
                case 1:
                  t = n.child.stateNode;
              }
            try {
              S0(e, t);
            } catch (u) {
              fe(n, n.return, u);
            }
          }
          break;
        case 27:
          null === t && a & 4 && hp(n);
        case 26:
        case 5:
          tn(e, n);
          null === t && a & 4 && gp(n);
          a & 512 && Vl(n, n.return);
          break;
        case 12:
          tn(e, n);
          break;
        case 31:
          tn(e, n);
          a & 4 && xp(e, n);
          break;
        case 13:
          tn(e, n);
          a & 4 && Sp(e, n);
          a & 64 && (e = n.memoizedState, null !== e && (e = e.dehydrated, null !== e && (n = Qm.bind(
            null,
            n
          ), sh(e, n))));
          break;
        case 22:
          a = null !== n.memoizedState || ln;
          if (!a) {
            t = null !== t && null !== t.memoizedState || _e;
            l = ln;
            var i = _e;
            ln = a;
            (_e = t) && !i ? nn(
              e,
              n,
              0 !== (n.subtreeFlags & 8772)
            ) : tn(e, n);
            ln = l;
            _e = i;
          }
          break;
        case 30:
          break;
        default:
          tn(e, n);
      }
    }
    function vp(e) {
      var t = e.alternate;
      null !== t && (e.alternate = null, vp(t));
      e.child = null;
      e.deletions = null;
      e.sibling = null;
      5 === e.tag && (t = e.stateNode, null !== t && gr(t));
      e.stateNode = null;
      e.return = null;
      e.dependencies = null;
      e.memoizedProps = null;
      e.memoizedState = null;
      e.pendingProps = null;
      e.stateNode = null;
      e.updateQueue = null;
    }
    var Ee = null;
    var it = false;
    function en(e, t, n) {
      for (n = n.child; null !== n; )
        bp(e, t, n), n = n.sibling;
    }
    function bp(e, t, n) {
      if (ht && "function" === typeof ht.onCommitFiberUnmount)
        try {
          ht.onCommitFiberUnmount(ri, n);
        } catch (i) {
        }
      switch (n.tag) {
        case 26:
          _e || Ft(n, t);
          en(
            e,
            t,
            n
          );
          n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
          break;
        case 27:
          _e || Ft(n, t);
          var a = Ee, l = it;
          Kn(n.type) && (Ee = n.stateNode, it = false);
          en(
            e,
            t,
            n
          );
          Zl(n.stateNode);
          Ee = a;
          it = l;
          break;
        case 5:
          _e || Ft(n, t);
        case 6:
          a = Ee;
          l = it;
          Ee = null;
          en(
            e,
            t,
            n
          );
          Ee = a;
          it = l;
          if (null !== Ee)
            if (it)
              try {
                (9 === Ee.nodeType ? Ee.body : "HTML" === Ee.nodeName ? Ee.ownerDocument.body : Ee).removeChild(n.stateNode);
              } catch (i) {
                fe(
                  n,
                  t,
                  i
                );
              }
            else
              try {
                Ee.removeChild(n.stateNode);
              } catch (i) {
                fe(
                  n,
                  t,
                  i
                );
              }
          break;
        case 18:
          null !== Ee && (it ? (e = Ee, sd(
            9 === e.nodeType ? e.body : "HTML" === e.nodeName ? e.ownerDocument.body : e,
            n.stateNode
          ), cl(e)) : sd(Ee, n.stateNode));
          break;
        case 4:
          a = Ee;
          l = it;
          Ee = n.stateNode.containerInfo;
          it = true;
          en(
            e,
            t,
            n
          );
          Ee = a;
          it = l;
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          Qn(2, n, t);
          _e || Qn(4, n, t);
          en(
            e,
            t,
            n
          );
          break;
        case 1:
          _e || (Ft(n, t), a = n.stateNode, "function" === typeof a.componentWillUnmount && pp(
            n,
            t,
            a
          ));
          en(
            e,
            t,
            n
          );
          break;
        case 21:
          en(
            e,
            t,
            n
          );
          break;
        case 22:
          _e = (a = _e) || null !== n.memoizedState;
          en(
            e,
            t,
            n
          );
          _e = a;
          break;
        default:
          en(
            e,
            t,
            n
          );
      }
    }
    function xp(e, t) {
      if (null === t.memoizedState && (e = t.alternate, null !== e && (e = e.memoizedState, null !== e))) {
        e = e.dehydrated;
        try {
          cl(e);
        } catch (n) {
          fe(t, t.return, n);
        }
      }
    }
    function Sp(e, t) {
      if (null === t.memoizedState && (e = t.alternate, null !== e && (e = e.memoizedState, null !== e && (e = e.dehydrated, null !== e))))
        try {
          cl(e);
        } catch (n) {
          fe(t, t.return, n);
        }
    }
    function Hm(e) {
      switch (e.tag) {
        case 31:
        case 13:
        case 19:
          var t = e.stateNode;
          null === t && (t = e.stateNode = new Kf());
          return t;
        case 22:
          return e = e.stateNode, t = e._retryCache, null === t && (t = e._retryCache = new Kf()), t;
        default:
          throw Error(A(435, e.tag));
      }
    }
    function Ji(e, t) {
      var n = Hm(e);
      t.forEach(function(a) {
        if (!n.has(a)) {
          n.add(a);
          var l = Zm.bind(null, e, a);
          a.then(l, l);
        }
      });
    }
    function at(e, t) {
      var n = t.deletions;
      if (null !== n)
        for (var a = 0; a < n.length; a++) {
          var l = n[a], i = e, u = t, c = u;
          e: for (; null !== c; ) {
            switch (c.tag) {
              case 27:
                if (Kn(c.type)) {
                  Ee = c.stateNode;
                  it = false;
                  break e;
                }
                break;
              case 5:
                Ee = c.stateNode;
                it = false;
                break e;
              case 3:
              case 4:
                Ee = c.stateNode.containerInfo;
                it = true;
                break e;
            }
            c = c.return;
          }
          if (null === Ee) throw Error(A(160));
          bp(i, u, l);
          Ee = null;
          it = false;
          i = l.alternate;
          null !== i && (i.return = null);
          l.return = null;
        }
      if (t.subtreeFlags & 13886)
        for (t = t.child; null !== t; )
          zp(t, e), t = t.sibling;
    }
    var Bt = null;
    function zp(e, t) {
      var n = e.alternate, a = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          at(t, e);
          lt(e);
          a & 4 && (Qn(3, e, e.return), hi(3, e), Qn(5, e, e.return));
          break;
        case 1:
          at(t, e);
          lt(e);
          a & 512 && (_e || null === n || Ft(n, n.return));
          a & 64 && ln && (e = e.updateQueue, null !== e && (a = e.callbacks, null !== a && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = null === n ? a : n.concat(a))));
          break;
        case 26:
          var l = Bt;
          at(t, e);
          lt(e);
          a & 512 && (_e || null === n || Ft(n, n.return));
          if (a & 4) {
            var i = null !== n ? n.memoizedState : null;
            a = e.memoizedState;
            if (null === n)
              if (null === a)
                if (null === e.stateNode) {
                  e: {
                    a = e.type;
                    n = e.memoizedProps;
                    l = l.ownerDocument || l;
                    t: switch (a) {
                      case "title":
                        i = l.getElementsByTagName("title")[0];
                        if (!i || i[di] || i[Ze] || "http://www.w3.org/2000/svg" === i.namespaceURI || i.hasAttribute("itemprop"))
                          i = l.createElement(a), l.head.insertBefore(
                            i,
                            l.querySelector("head > title")
                          );
                        We(i, a, n);
                        i[Ze] = e;
                        Ye(i);
                        a = i;
                        break e;
                      case "link":
                        var u = yd(
                          "link",
                          "href",
                          l
                        ).get(a + (n.href || ""));
                        if (u) {
                          for (var c = 0; c < u.length; c++)
                            if (i = u[c], i.getAttribute("href") === (null == n.href || "" === n.href ? null : n.href) && i.getAttribute("rel") === (null == n.rel ? null : n.rel) && i.getAttribute("title") === (null == n.title ? null : n.title) && i.getAttribute("crossorigin") === (null == n.crossOrigin ? null : n.crossOrigin)) {
                              u.splice(c, 1);
                              break t;
                            }
                        }
                        i = l.createElement(a);
                        We(i, a, n);
                        l.head.appendChild(i);
                        break;
                      case "meta":
                        if (u = yd(
                          "meta",
                          "content",
                          l
                        ).get(a + (n.content || ""))) {
                          for (c = 0; c < u.length; c++)
                            if (i = u[c], i.getAttribute("content") === (null == n.content ? null : "" + n.content) && i.getAttribute("name") === (null == n.name ? null : n.name) && i.getAttribute("property") === (null == n.property ? null : n.property) && i.getAttribute("http-equiv") === (null == n.httpEquiv ? null : n.httpEquiv) && i.getAttribute("charset") === (null == n.charSet ? null : n.charSet)) {
                              u.splice(c, 1);
                              break t;
                            }
                        }
                        i = l.createElement(a);
                        We(i, a, n);
                        l.head.appendChild(i);
                        break;
                      default:
                        throw Error(A(468, a));
                    }
                    i[Ze] = e;
                    Ye(i);
                    a = i;
                  }
                  e.stateNode = a;
                } else
                  vd(
                    l,
                    e.type,
                    e.stateNode
                  );
              else
                e.stateNode = hd(
                  l,
                  a,
                  e.memoizedProps
                );
            else
              i !== a ? (null === i ? null !== n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n)) : i.count--, null === a ? vd(
                l,
                e.type,
                e.stateNode
              ) : hd(
                l,
                a,
                e.memoizedProps
              )) : null === a && null !== e.stateNode && lc(
                e,
                e.memoizedProps,
                n.memoizedProps
              );
          }
          break;
        case 27:
          at(t, e);
          lt(e);
          a & 512 && (_e || null === n || Ft(n, n.return));
          null !== n && a & 4 && lc(
            e,
            e.memoizedProps,
            n.memoizedProps
          );
          break;
        case 5:
          at(t, e);
          lt(e);
          a & 512 && (_e || null === n || Ft(n, n.return));
          if (e.flags & 32) {
            l = e.stateNode;
            try {
              el(l, "");
            } catch (T) {
              fe(e, e.return, T);
            }
          }
          a & 4 && null != e.stateNode && (l = e.memoizedProps, lc(
            e,
            l,
            null !== n ? n.memoizedProps : l
          ));
          a & 1024 && (oc = true);
          break;
        case 6:
          at(t, e);
          lt(e);
          if (a & 4) {
            if (null === e.stateNode)
              throw Error(A(162));
            a = e.memoizedProps;
            n = e.stateNode;
            try {
              n.nodeValue = a;
            } catch (T) {
              fe(e, e.return, T);
            }
          }
          break;
        case 3:
          po = null;
          l = Bt;
          Bt = Lo(t.containerInfo);
          at(t, e);
          Bt = l;
          lt(e);
          if (a & 4 && null !== n && n.memoizedState.isDehydrated)
            try {
              cl(t.containerInfo);
            } catch (T) {
              fe(e, e.return, T);
            }
          oc && (oc = false, Ap(e));
          break;
        case 4:
          a = Bt;
          Bt = Lo(
            e.stateNode.containerInfo
          );
          at(t, e);
          lt(e);
          Bt = a;
          break;
        case 12:
          at(t, e);
          lt(e);
          break;
        case 31:
          at(t, e);
          lt(e);
          a & 4 && (a = e.updateQueue, null !== a && (e.updateQueue = null, Ji(e, a)));
          break;
        case 13:
          at(t, e);
          lt(e);
          e.child.flags & 8192 && null !== e.memoizedState !== (null !== n && null !== n.memoizedState) && (nu = mt());
          a & 4 && (a = e.updateQueue, null !== a && (e.updateQueue = null, Ji(e, a)));
          break;
        case 22:
          l = null !== e.memoizedState;
          var r = null !== n && null !== n.memoizedState, g = ln, m = _e;
          ln = g || l;
          _e = m || r;
          at(t, e);
          _e = m;
          ln = g;
          lt(e);
          if (a & 8192)
            e: for (t = e.stateNode, t._visibility = l ? t._visibility & -2 : t._visibility | 1, l && (null === n || r || ln || _e || na(e)), n = null, t = e; ; ) {
              if (5 === t.tag || 26 === t.tag) {
                if (null === n) {
                  r = n = t;
                  try {
                    if (i = r.stateNode, l)
                      u = i.style, "function" === typeof u.setProperty ? u.setProperty("display", "none", "important") : u.display = "none";
                    else {
                      c = r.stateNode;
                      var v = r.memoizedProps.style, p = void 0 !== v && null !== v && v.hasOwnProperty("display") ? v.display : null;
                      c.style.display = null == p || "boolean" === typeof p ? "" : ("" + p).trim();
                    }
                  } catch (T) {
                    fe(r, r.return, T);
                  }
                }
              } else if (6 === t.tag) {
                if (null === n) {
                  r = t;
                  try {
                    r.stateNode.nodeValue = l ? "" : r.memoizedProps;
                  } catch (T) {
                    fe(r, r.return, T);
                  }
                }
              } else if (18 === t.tag) {
                if (null === n) {
                  r = t;
                  try {
                    var y = r.stateNode;
                    l ? fd(y, true) : fd(r.stateNode, false);
                  } catch (T) {
                    fe(r, r.return, T);
                  }
                }
              } else if ((22 !== t.tag && 23 !== t.tag || null === t.memoizedState || t === e) && null !== t.child) {
                t.child.return = t;
                t = t.child;
                continue;
              }
              if (t === e) break e;
              for (; null === t.sibling; ) {
                if (null === t.return || t.return === e) break e;
                n === t && (n = null);
                t = t.return;
              }
              n === t && (n = null);
              t.sibling.return = t.return;
              t = t.sibling;
            }
          a & 4 && (a = e.updateQueue, null !== a && (n = a.retryQueue, null !== n && (a.retryQueue = null, Ji(e, n))));
          break;
        case 19:
          at(t, e);
          lt(e);
          a & 4 && (a = e.updateQueue, null !== a && (e.updateQueue = null, Ji(e, a)));
          break;
        case 30:
          break;
        case 21:
          break;
        default:
          at(t, e), lt(e);
      }
    }
    function lt(e) {
      var t = e.flags;
      if (t & 2) {
        try {
          for (var n, a = e.return; null !== a; ) {
            if (mp(a)) {
              n = a;
              break;
            }
            a = a.return;
          }
          if (null == n) throw Error(A(160));
          switch (n.tag) {
            case 27:
              var l = n.stateNode, i = ic(e);
              _o(e, i, l);
              break;
            case 5:
              var u = n.stateNode;
              n.flags & 32 && (el(u, ""), n.flags &= -33);
              var c = ic(e);
              _o(e, c, u);
              break;
            case 3:
            case 4:
              var r = n.stateNode.containerInfo, g = ic(e);
              Zc(
                e,
                g,
                r
              );
              break;
            default:
              throw Error(A(161));
          }
        } catch (m) {
          fe(e, e.return, m);
        }
        e.flags &= -3;
      }
      t & 4096 && (e.flags &= -4097);
    }
    function Ap(e) {
      if (e.subtreeFlags & 1024)
        for (e = e.child; null !== e; ) {
          var t = e;
          Ap(t);
          5 === t.tag && t.flags & 1024 && t.stateNode.reset();
          e = e.sibling;
        }
    }
    function tn(e, t) {
      if (t.subtreeFlags & 8772)
        for (t = t.child; null !== t; )
          yp(e, t.alternate, t), t = t.sibling;
    }
    function na(e) {
      for (e = e.child; null !== e; ) {
        var t = e;
        switch (t.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            Qn(4, t, t.return);
            na(t);
            break;
          case 1:
            Ft(t, t.return);
            var n = t.stateNode;
            "function" === typeof n.componentWillUnmount && pp(
              t,
              t.return,
              n
            );
            na(t);
            break;
          case 27:
            Zl(t.stateNode);
          case 26:
          case 5:
            Ft(t, t.return);
            na(t);
            break;
          case 22:
            null === t.memoizedState && na(t);
            break;
          case 30:
            na(t);
            break;
          default:
            na(t);
        }
        e = e.sibling;
      }
    }
    function nn(e, t, n) {
      n = n && 0 !== (t.subtreeFlags & 8772);
      for (t = t.child; null !== t; ) {
        var a = t.alternate, l = e, i = t, u = i.flags;
        switch (i.tag) {
          case 0:
          case 11:
          case 15:
            nn(
              l,
              i,
              n
            );
            hi(4, i);
            break;
          case 1:
            nn(
              l,
              i,
              n
            );
            a = i;
            l = a.stateNode;
            if ("function" === typeof l.componentDidMount)
              try {
                l.componentDidMount();
              } catch (g) {
                fe(a, a.return, g);
              }
            a = i;
            l = a.updateQueue;
            if (null !== l) {
              var c = a.stateNode;
              try {
                var r = l.shared.hiddenCallbacks;
                if (null !== r)
                  for (l.shared.hiddenCallbacks = null, l = 0; l < r.length; l++)
                    x0(r[l], c);
              } catch (g) {
                fe(a, a.return, g);
              }
            }
            n && u & 64 && dp(i);
            Vl(i, i.return);
            break;
          case 27:
            hp(i);
          case 26:
          case 5:
            nn(
              l,
              i,
              n
            );
            n && null === a && u & 4 && gp(i);
            Vl(i, i.return);
            break;
          case 12:
            nn(
              l,
              i,
              n
            );
            break;
          case 31:
            nn(
              l,
              i,
              n
            );
            n && u & 4 && xp(l, i);
            break;
          case 13:
            nn(
              l,
              i,
              n
            );
            n && u & 4 && Sp(l, i);
            break;
          case 22:
            null === i.memoizedState && nn(
              l,
              i,
              n
            );
            Vl(i, i.return);
            break;
          case 30:
            break;
          default:
            nn(
              l,
              i,
              n
            );
        }
        t = t.sibling;
      }
    }
    function Qr(e, t) {
      var n = null;
      null !== e && null !== e.memoizedState && null !== e.memoizedState.cachePool && (n = e.memoizedState.cachePool.pool);
      e = null;
      null !== t.memoizedState && null !== t.memoizedState.cachePool && (e = t.memoizedState.cachePool.pool);
      e !== n && (null != e && e.refCount++, null != n && gi(n));
    }
    function Zr(e, t) {
      e = null;
      null !== t.alternate && (e = t.alternate.memoizedState.cache);
      t = t.memoizedState.cache;
      t !== e && (t.refCount++, null != e && gi(e));
    }
    function Ut(e, t, n, a) {
      if (t.subtreeFlags & 10256)
        for (t = t.child; null !== t; )
          Ep(
            e,
            t,
            n,
            a
          ), t = t.sibling;
    }
    function Ep(e, t, n, a) {
      var l = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          Ut(
            e,
            t,
            n,
            a
          );
          l & 2048 && hi(9, t);
          break;
        case 1:
          Ut(
            e,
            t,
            n,
            a
          );
          break;
        case 3:
          Ut(
            e,
            t,
            n,
            a
          );
          l & 2048 && (e = null, null !== t.alternate && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, null != e && gi(e)));
          break;
        case 12:
          if (l & 2048) {
            Ut(
              e,
              t,
              n,
              a
            );
            e = t.stateNode;
            try {
              var i = t.memoizedProps, u = i.id, c = i.onPostCommit;
              "function" === typeof c && c(
                u,
                null === t.alternate ? "mount" : "update",
                e.passiveEffectDuration,
                -0
              );
            } catch (r) {
              fe(t, t.return, r);
            }
          } else
            Ut(
              e,
              t,
              n,
              a
            );
          break;
        case 31:
          Ut(
            e,
            t,
            n,
            a
          );
          break;
        case 13:
          Ut(
            e,
            t,
            n,
            a
          );
          break;
        case 23:
          break;
        case 22:
          i = t.stateNode;
          u = t.alternate;
          null !== t.memoizedState ? i._visibility & 2 ? Ut(
            e,
            t,
            n,
            a
          ) : Fl(e, t) : i._visibility & 2 ? Ut(
            e,
            t,
            n,
            a
          ) : (i._visibility |= 2, Ra(
            e,
            t,
            n,
            a,
            0 !== (t.subtreeFlags & 10256) || false
          ));
          l & 2048 && Qr(u, t);
          break;
        case 24:
          Ut(
            e,
            t,
            n,
            a
          );
          l & 2048 && Zr(t.alternate, t);
          break;
        default:
          Ut(
            e,
            t,
            n,
            a
          );
      }
    }
    function Ra(e, t, n, a, l) {
      l = l && (0 !== (t.subtreeFlags & 10256) || false);
      for (t = t.child; null !== t; ) {
        var i = e, u = t, c = n, r = a, g = u.flags;
        switch (u.tag) {
          case 0:
          case 11:
          case 15:
            Ra(
              i,
              u,
              c,
              r,
              l
            );
            hi(8, u);
            break;
          case 23:
            break;
          case 22:
            var m = u.stateNode;
            null !== u.memoizedState ? m._visibility & 2 ? Ra(
              i,
              u,
              c,
              r,
              l
            ) : Fl(
              i,
              u
            ) : (m._visibility |= 2, Ra(
              i,
              u,
              c,
              r,
              l
            ));
            l && g & 2048 && Qr(
              u.alternate,
              u
            );
            break;
          case 24:
            Ra(
              i,
              u,
              c,
              r,
              l
            );
            l && g & 2048 && Zr(u.alternate, u);
            break;
          default:
            Ra(
              i,
              u,
              c,
              r,
              l
            );
        }
        t = t.sibling;
      }
    }
    function Fl(e, t) {
      if (t.subtreeFlags & 10256)
        for (t = t.child; null !== t; ) {
          var n = e, a = t, l = a.flags;
          switch (a.tag) {
            case 22:
              Fl(n, a);
              l & 2048 && Qr(
                a.alternate,
                a
              );
              break;
            case 24:
              Fl(n, a);
              l & 2048 && Zr(a.alternate, a);
              break;
            default:
              Fl(n, a);
          }
          t = t.sibling;
        }
    }
    var wl = 8192;
    function Ma(e, t, n) {
      if (e.subtreeFlags & wl)
        for (e = e.child; null !== e; )
          Cp(
            e,
            t,
            n
          ), e = e.sibling;
    }
    function Cp(e, t, n) {
      switch (e.tag) {
        case 26:
          Ma(
            e,
            t,
            n
          );
          e.flags & wl && null !== e.memoizedState && zh(
            n,
            Bt,
            e.memoizedState,
            e.memoizedProps
          );
          break;
        case 5:
          Ma(
            e,
            t,
            n
          );
          break;
        case 3:
        case 4:
          var a = Bt;
          Bt = Lo(e.stateNode.containerInfo);
          Ma(
            e,
            t,
            n
          );
          Bt = a;
          break;
        case 22:
          null === e.memoizedState && (a = e.alternate, null !== a && null !== a.memoizedState ? (a = wl, wl = 16777216, Ma(
            e,
            t,
            n
          ), wl = a) : Ma(
            e,
            t,
            n
          ));
          break;
        default:
          Ma(
            e,
            t,
            n
          );
      }
    }
    function Tp(e) {
      var t = e.alternate;
      if (null !== t && (e = t.child, null !== e)) {
        t.child = null;
        do
          t = e.sibling, e.sibling = null, e = t;
        while (null !== e);
      }
    }
    function kl(e) {
      var t = e.deletions;
      if (0 !== (e.flags & 16)) {
        if (null !== t)
          for (var n = 0; n < t.length; n++) {
            var a = t[n];
            Ge = a;
            Dp(
              a,
              e
            );
          }
        Tp(e);
      }
      if (e.subtreeFlags & 10256)
        for (e = e.child; null !== e; )
          kp(e), e = e.sibling;
    }
    function kp(e) {
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          kl(e);
          e.flags & 2048 && Qn(9, e, e.return);
          break;
        case 3:
          kl(e);
          break;
        case 12:
          kl(e);
          break;
        case 22:
          var t = e.stateNode;
          null !== e.memoizedState && t._visibility & 2 && (null === e.return || 13 !== e.return.tag) ? (t._visibility &= -3, so(e)) : kl(e);
          break;
        default:
          kl(e);
      }
    }
    function so(e) {
      var t = e.deletions;
      if (0 !== (e.flags & 16)) {
        if (null !== t)
          for (var n = 0; n < t.length; n++) {
            var a = t[n];
            Ge = a;
            Dp(
              a,
              e
            );
          }
        Tp(e);
      }
      for (e = e.child; null !== e; ) {
        t = e;
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            Qn(8, t, t.return);
            so(t);
            break;
          case 22:
            n = t.stateNode;
            n._visibility & 2 && (n._visibility &= -3, so(t));
            break;
          default:
            so(t);
        }
        e = e.sibling;
      }
    }
    function Dp(e, t) {
      for (; null !== Ge; ) {
        var n = Ge;
        switch (n.tag) {
          case 0:
          case 11:
          case 15:
            Qn(8, n, t);
            break;
          case 23:
          case 22:
            if (null !== n.memoizedState && null !== n.memoizedState.cachePool) {
              var a = n.memoizedState.cachePool.pool;
              null != a && a.refCount++;
            }
            break;
          case 24:
            gi(n.memoizedState.cache);
        }
        a = n.child;
        if (null !== a) a.return = n, Ge = a;
        else
          e: for (n = e; null !== Ge; ) {
            a = Ge;
            var l = a.sibling, i = a.return;
            vp(a);
            if (a === n) {
              Ge = null;
              break e;
            }
            if (null !== l) {
              l.return = i;
              Ge = l;
              break e;
            }
            Ge = i;
          }
      }
    }
    var jm = {
      getCacheForType: function(e) {
        var t = Ke(Oe), n = t.data.get(e);
        void 0 === n && (n = e(), t.data.set(e, n));
        return n;
      },
      cacheSignal: function() {
        return Ke(Oe).controller.signal;
      }
    };
    var Lm = "function" === typeof WeakMap ? WeakMap : Map;
    var le = 0;
    var me = null;
    var W = null;
    var I = 0;
    var se = 0;
    var ft = null;
    var _n = false;
    var pl = false;
    var Jr = false;
    var hn = 0;
    var Te = 0;
    var Zn = 0;
    var ua = 0;
    var Kr = 0;
    var gt = 0;
    var ll = 0;
    var Xl = null;
    var ot = null;
    var Jc = false;
    var nu = 0;
    var Np = 0;
    var Oo = Infinity;
    var wo = null;
    var jn = null;
    var He = 0;
    var Ln = null;
    var il = null;
    var fn = 0;
    var Kc = 0;
    var Wc = null;
    var Mp = null;
    var Ql = 0;
    var $c = null;
    function vt() {
      return 0 !== (le & 2) && 0 !== I ? I & -I : null !== G.T ? $r() : jd();
    }
    function Rp() {
      if (0 === gt)
        if (0 === (I & 536870912) || P) {
          var e = Hi;
          Hi <<= 1;
          0 === (Hi & 3932160) && (Hi = 262144);
          gt = e;
        } else gt = 536870912;
      e = xt.current;
      null !== e && (e.flags |= 32);
      return gt;
    }
    function ut(e, t, n) {
      if (e === me && (2 === se || 9 === se) || null !== e.cancelPendingCommit)
        ol(e, 0), On(
          e,
          I,
          gt,
          false
        );
      fi(e, n);
      if (0 === (le & 2) || e !== me)
        e === me && (0 === (le & 2) && (ua |= n), 4 === Te && On(
          e,
          I,
          gt,
          false
        )), Zt(e);
    }
    function _p(e, t, n) {
      if (0 !== (le & 6)) throw Error(A(327));
      var a = !n && 0 === (t & 127) && 0 === (t & e.expiredLanes) || si(e, t), l = a ? Vm(e, t) : uc(e, t, true), i = a;
      do {
        if (0 === l) {
          pl && !a && On(e, t, 0, false);
          break;
        } else {
          n = e.current.alternate;
          if (i && !Gm(n)) {
            l = uc(e, t, false);
            i = false;
            continue;
          }
          if (2 === l) {
            i = t;
            if (e.errorRecoveryDisabledLanes & i)
              var u = 0;
            else
              u = e.pendingLanes & -536870913, u = 0 !== u ? u : u & 536870912 ? 536870912 : 0;
            if (0 !== u) {
              t = u;
              e: {
                var c = e;
                l = Xl;
                var r = c.current.memoizedState.isDehydrated;
                r && (ol(c, u).flags |= 256);
                u = uc(
                  c,
                  u,
                  false
                );
                if (2 !== u) {
                  if (Jr && !r) {
                    c.errorRecoveryDisabledLanes |= i;
                    ua |= i;
                    l = 4;
                    break e;
                  }
                  i = ot;
                  ot = l;
                  null !== i && (null === ot ? ot = i : ot.push.apply(
                    ot,
                    i
                  ));
                }
                l = u;
              }
              i = false;
              if (2 !== l) continue;
            }
          }
          if (1 === l) {
            ol(e, 0);
            On(e, t, 0, true);
            break;
          }
          e: {
            a = e;
            i = l;
            switch (i) {
              case 0:
              case 1:
                throw Error(A(345));
              case 4:
                if ((t & 4194048) !== t) break;
              case 6:
                On(
                  a,
                  t,
                  gt,
                  !_n
                );
                break e;
              case 2:
                ot = null;
                break;
              case 3:
              case 5:
                break;
              default:
                throw Error(A(329));
            }
            if ((t & 62914560) === t && (l = nu + 300 - mt(), 10 < l)) {
              On(
                a,
                t,
                gt,
                !_n
              );
              if (0 !== Xo(a, 0, true)) break e;
              fn = t;
              a.timeoutHandle = Ip(
                Wf.bind(
                  null,
                  a,
                  n,
                  ot,
                  wo,
                  Jc,
                  t,
                  gt,
                  ua,
                  ll,
                  _n,
                  i,
                  "Throttled",
                  -0,
                  0
                ),
                l
              );
              break e;
            }
            Wf(
              a,
              n,
              ot,
              wo,
              Jc,
              t,
              gt,
              ua,
              ll,
              _n,
              i,
              null,
              -0,
              0
            );
          }
        }
        break;
      } while (1);
      Zt(e);
    }
    function Wf(e, t, n, a, l, i, u, c, r, g, m, v, p, y) {
      e.timeoutHandle = -1;
      v = t.subtreeFlags;
      if (v & 8192 || 16785408 === (v & 16785408)) {
        v = {
          stylesheets: null,
          count: 0,
          imgCount: 0,
          imgBytes: 0,
          suspenseyImages: [],
          waitingForImages: true,
          waitingForViewTransition: false,
          unsuspend: un
        };
        Cp(
          t,
          i,
          v
        );
        var T = (i & 62914560) === i ? nu - mt() : (i & 4194048) === i ? Np - mt() : 0;
        T = Ah(
          v,
          T
        );
        if (null !== T) {
          fn = i;
          e.cancelPendingCommit = T(
            If.bind(
              null,
              e,
              t,
              i,
              n,
              a,
              l,
              u,
              c,
              r,
              m,
              v,
              null,
              p,
              y
            )
          );
          On(e, i, u, !g);
          return;
        }
      }
      If(
        e,
        t,
        i,
        n,
        a,
        l,
        u,
        c,
        r
      );
    }
    function Gm(e) {
      for (var t = e; ; ) {
        var n = t.tag;
        if ((0 === n || 11 === n || 15 === n) && t.flags & 16384 && (n = t.updateQueue, null !== n && (n = n.stores, null !== n)))
          for (var a = 0; a < n.length; a++) {
            var l = n[a], i = l.getSnapshot;
            l = l.value;
            try {
              if (!bt(i(), l)) return false;
            } catch (u) {
              return false;
            }
          }
        n = t.child;
        if (t.subtreeFlags & 16384 && null !== n)
          n.return = t, t = n;
        else {
          if (t === e) break;
          for (; null === t.sibling; ) {
            if (null === t.return || t.return === e) return true;
            t = t.return;
          }
          t.sibling.return = t.return;
          t = t.sibling;
        }
      }
      return true;
    }
    function On(e, t, n, a) {
      t &= ~Kr;
      t &= ~ua;
      e.suspendedLanes |= t;
      e.pingedLanes &= ~t;
      a && (e.warmLanes |= t);
      a = e.expirationTimes;
      for (var l = t; 0 < l; ) {
        var i = 31 - yt(l), u = 1 << i;
        a[i] = -1;
        l &= ~u;
      }
      0 !== n && Bd(e, n, t);
    }
    function au() {
      return 0 === (le & 6) ? (yi(0, false), false) : true;
    }
    function Wr() {
      if (null !== W) {
        if (0 === se)
          var e = W.return;
        else
          e = W, cn = ya = null, Ur(e), Ka = null, ei = 0, e = W;
        for (; null !== e; )
          fp(e.alternate, e), e = e.return;
        W = null;
      }
    }
    function ol(e, t) {
      var n = e.timeoutHandle;
      -1 !== n && (e.timeoutHandle = -1, ih(n));
      n = e.cancelPendingCommit;
      null !== n && (e.cancelPendingCommit = null, n());
      fn = 0;
      Wr();
      me = e;
      W = n = rn(e.current, null);
      I = t;
      se = 0;
      ft = null;
      _n = false;
      pl = si(e, t);
      Jr = false;
      ll = gt = Kr = ua = Zn = Te = 0;
      ot = Xl = null;
      Jc = false;
      0 !== (t & 8) && (t |= t & 32);
      var a = e.entangledLanes;
      if (0 !== a)
        for (e = e.entanglements, a &= t; 0 < a; ) {
          var l = 31 - yt(a), i = 1 << l;
          t |= e[l];
          a &= ~i;
        }
      hn = t;
      Ko();
      return n;
    }
    function Op(e, t) {
      Q = null;
      G.H = ni;
      t === dl || t === $o ? (t = Df(), se = 3) : t === Dr ? (t = Df(), se = 4) : se = t === Fr ? 8 : null !== t && "object" === typeof t && "function" === typeof t.then ? 6 : 1;
      ft = t;
      null === W && (Te = 1, Mo(
        e,
        Dt(t, e.current)
      ));
    }
    function wp() {
      var e = xt.current;
      return null === e ? true : (I & 4194048) === I ? null === Mt ? true : false : (I & 62914560) === I || 0 !== (I & 536870912) ? e === Mt : false;
    }
    function Up() {
      var e = G.H;
      G.H = ni;
      return null === e ? ni : e;
    }
    function Bp() {
      var e = G.A;
      G.A = jm;
      return e;
    }
    function Uo() {
      Te = 4;
      _n || (I & 4194048) !== I && null !== xt.current || (pl = true);
      0 === (Zn & 134217727) && 0 === (ua & 134217727) || null === me || On(
        me,
        I,
        gt,
        false
      );
    }
    function uc(e, t, n) {
      var a = le;
      le |= 2;
      var l = Up(), i = Bp();
      if (me !== e || I !== t)
        wo = null, ol(e, t);
      t = false;
      var u = Te;
      e: do
        try {
          if (0 !== se && null !== W) {
            var c = W, r = ft;
            switch (se) {
              case 8:
                Wr();
                u = 6;
                break e;
              case 3:
              case 2:
              case 9:
              case 6:
                null === xt.current && (t = true);
                var g = se;
                se = 0;
                ft = null;
                Fa(e, c, r, g);
                if (n && pl) {
                  u = 0;
                  break e;
                }
                break;
              default:
                g = se, se = 0, ft = null, Fa(e, c, r, g);
            }
          }
          Ym();
          u = Te;
          break;
        } catch (m) {
          Op(e, m);
        }
      while (1);
      t && e.shellSuspendCounter++;
      cn = ya = null;
      le = a;
      G.H = l;
      G.A = i;
      null === W && (me = null, I = 0, Ko());
      return u;
    }
    function Ym() {
      for (; null !== W; ) qp(W);
    }
    function Vm(e, t) {
      var n = le;
      le |= 2;
      var a = Up(), l = Bp();
      me !== e || I !== t ? (wo = null, Oo = mt() + 500, ol(e, t)) : pl = si(
        e,
        t
      );
      e: do
        try {
          if (0 !== se && null !== W) {
            t = W;
            var i = ft;
            t: switch (se) {
              case 1:
                se = 0;
                ft = null;
                Fa(e, t, i, 1);
                break;
              case 2:
              case 9:
                if (kf(i)) {
                  se = 0;
                  ft = null;
                  $f(t);
                  break;
                }
                t = function() {
                  2 !== se && 9 !== se || me !== e || (se = 7);
                  Zt(e);
                };
                i.then(t, t);
                break e;
              case 3:
                se = 7;
                break e;
              case 4:
                se = 5;
                break e;
              case 7:
                kf(i) ? (se = 0, ft = null, $f(t)) : (se = 0, ft = null, Fa(e, t, i, 7));
                break;
              case 5:
                var u = null;
                switch (W.tag) {
                  case 26:
                    u = W.memoizedState;
                  case 5:
                  case 27:
                    var c = W;
                    if (u ? ag(u) : c.stateNode.complete) {
                      se = 0;
                      ft = null;
                      var r = c.sibling;
                      if (null !== r) W = r;
                      else {
                        var g = c.return;
                        null !== g ? (W = g, lu(g)) : W = null;
                      }
                      break t;
                    }
                }
                se = 0;
                ft = null;
                Fa(e, t, i, 5);
                break;
              case 6:
                se = 0;
                ft = null;
                Fa(e, t, i, 6);
                break;
              case 8:
                Wr();
                Te = 6;
                break e;
              default:
                throw Error(A(462));
            }
          }
          Fm();
          break;
        } catch (m) {
          Op(e, m);
        }
      while (1);
      cn = ya = null;
      G.H = a;
      G.A = l;
      le = n;
      if (null !== W) return 0;
      me = null;
      I = 0;
      Ko();
      return Te;
    }
    function Fm() {
      for (; null !== W && !p1(); )
        qp(W);
    }
    function qp(e) {
      var t = sp(e.alternate, e, hn);
      e.memoizedProps = e.pendingProps;
      null === t ? lu(e) : W = t;
    }
    function $f(e) {
      var t = e;
      var n = t.alternate;
      switch (t.tag) {
        case 15:
        case 0:
          t = Ff(
            n,
            t,
            t.pendingProps,
            t.type,
            void 0,
            I
          );
          break;
        case 11:
          t = Ff(
            n,
            t,
            t.pendingProps,
            t.type.render,
            t.ref,
            I
          );
          break;
        case 5:
          Ur(t);
        default:
          fp(n, t), t = W = f0(t, hn), t = sp(n, t, hn);
      }
      e.memoizedProps = e.pendingProps;
      null === t ? lu(e) : W = t;
    }
    function Fa(e, t, n, a) {
      cn = ya = null;
      Ur(t);
      Ka = null;
      ei = 0;
      var l = t.return;
      try {
        if (_m(
          e,
          l,
          t,
          n,
          I
        )) {
          Te = 1;
          Mo(
            e,
            Dt(n, e.current)
          );
          W = null;
          return;
        }
      } catch (i) {
        if (null !== l) throw W = l, i;
        Te = 1;
        Mo(
          e,
          Dt(n, e.current)
        );
        W = null;
        return;
      }
      if (t.flags & 32768) {
        if (P || 1 === a) e = true;
        else if (pl || 0 !== (I & 536870912))
          e = false;
        else if (_n = e = true, 2 === a || 9 === a || 3 === a || 6 === a)
          a = xt.current, null !== a && 13 === a.tag && (a.flags |= 16384);
        Hp(t, e);
      } else lu(t);
    }
    function lu(e) {
      var t = e;
      do {
        if (0 !== (t.flags & 32768)) {
          Hp(
            t,
            _n
          );
          return;
        }
        e = t.return;
        var n = Um(
          t.alternate,
          t,
          hn
        );
        if (null !== n) {
          W = n;
          return;
        }
        t = t.sibling;
        if (null !== t) {
          W = t;
          return;
        }
        W = t = e;
      } while (null !== t);
      0 === Te && (Te = 5);
    }
    function Hp(e, t) {
      do {
        var n = Bm(e.alternate, e);
        if (null !== n) {
          n.flags &= 32767;
          W = n;
          return;
        }
        n = e.return;
        null !== n && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null);
        if (!t && (e = e.sibling, null !== e)) {
          W = e;
          return;
        }
        W = e = n;
      } while (null !== e);
      Te = 6;
      W = null;
    }
    function If(e, t, n, a, l, i, u, c, r) {
      e.cancelPendingCommit = null;
      do
        iu();
      while (0 !== He);
      if (0 !== (le & 6)) throw Error(A(327));
      if (null !== t) {
        if (t === e.current) throw Error(A(177));
        i = t.lanes | t.childLanes;
        i |= Sr;
        A1(
          e,
          n,
          i,
          u,
          c,
          r
        );
        e === me && (W = me = null, I = 0);
        il = t;
        Ln = e;
        fn = n;
        Kc = i;
        Wc = l;
        Mp = a;
        0 !== (t.subtreeFlags & 10256) || 0 !== (t.flags & 10256) ? (e.callbackNode = null, e.callbackPriority = 0, Jm(bo, function() {
          Vp();
          return null;
        })) : (e.callbackNode = null, e.callbackPriority = 0);
        a = 0 !== (t.flags & 13878);
        if (0 !== (t.subtreeFlags & 13878) || a) {
          a = G.T;
          G.T = null;
          l = ie.p;
          ie.p = 2;
          u = le;
          le |= 4;
          try {
            qm(e, t, n);
          } finally {
            le = u, ie.p = l, G.T = a;
          }
        }
        He = 1;
        jp();
        Lp();
        Gp();
      }
    }
    function jp() {
      if (1 === He) {
        He = 0;
        var e = Ln, t = il, n = 0 !== (t.flags & 13878);
        if (0 !== (t.subtreeFlags & 13878) || n) {
          n = G.T;
          G.T = null;
          var a = ie.p;
          ie.p = 2;
          var l = le;
          le |= 4;
          try {
            zp(t, e);
            var i = tr, u = a0(e.containerInfo), c = i.focusedElem, r = i.selectionRange;
            if (u !== c && c && c.ownerDocument && n0(
              c.ownerDocument.documentElement,
              c
            )) {
              if (null !== r && xr(c)) {
                var g = r.start, m = r.end;
                void 0 === m && (m = g);
                if ("selectionStart" in c)
                  c.selectionStart = g, c.selectionEnd = Math.min(
                    m,
                    c.value.length
                  );
                else {
                  var v = c.ownerDocument || document, p = v && v.defaultView || window;
                  if (p.getSelection) {
                    var y = p.getSelection(), T = c.textContent.length, z = Math.min(r.start, T), U = void 0 === r.end ? z : Math.min(r.end, T);
                    !y.extend && z > U && (u = U, U = z, z = u);
                    var f = xf(
                      c,
                      z
                    ), d = xf(
                      c,
                      U
                    );
                    if (f && d && (1 !== y.rangeCount || y.anchorNode !== f.node || y.anchorOffset !== f.offset || y.focusNode !== d.node || y.focusOffset !== d.offset)) {
                      var h = v.createRange();
                      h.setStart(f.node, f.offset);
                      y.removeAllRanges();
                      z > U ? (y.addRange(h), y.extend(d.node, d.offset)) : (h.setEnd(d.node, d.offset), y.addRange(h));
                    }
                  }
                }
              }
              v = [];
              for (y = c; y = y.parentNode; )
                1 === y.nodeType && v.push({
                  element: y,
                  left: y.scrollLeft,
                  top: y.scrollTop
                });
              "function" === typeof c.focus && c.focus();
              for (c = 0; c < v.length; c++) {
                var b = v[c];
                b.element.scrollLeft = b.left;
                b.element.scrollTop = b.top;
              }
            }
            Vo = !!er;
            tr = er = null;
          } finally {
            le = l, ie.p = a, G.T = n;
          }
        }
        e.current = t;
        He = 2;
      }
    }
    function Lp() {
      if (2 === He) {
        He = 0;
        var e = Ln, t = il, n = 0 !== (t.flags & 8772);
        if (0 !== (t.subtreeFlags & 8772) || n) {
          n = G.T;
          G.T = null;
          var a = ie.p;
          ie.p = 2;
          var l = le;
          le |= 4;
          try {
            yp(e, t.alternate, t);
          } finally {
            le = l, ie.p = a, G.T = n;
          }
        }
        He = 3;
      }
    }
    function Gp() {
      if (4 === He || 3 === He) {
        He = 0;
        g1();
        var e = Ln, t = il, n = fn, a = Mp;
        0 !== (t.subtreeFlags & 10256) || 0 !== (t.flags & 10256) ? He = 5 : (He = 0, il = Ln = null, Yp(e, e.pendingLanes));
        var l = e.pendingLanes;
        0 === l && (jn = null);
        pr(n);
        t = t.stateNode;
        if (ht && "function" === typeof ht.onCommitFiberRoot)
          try {
            ht.onCommitFiberRoot(
              ri,
              t,
              void 0,
              128 === (t.current.flags & 128)
            );
          } catch (r) {
          }
        if (null !== a) {
          t = G.T;
          l = ie.p;
          ie.p = 2;
          G.T = null;
          try {
            for (var i = e.onRecoverableError, u = 0; u < a.length; u++) {
              var c = a[u];
              i(c.value, {
                componentStack: c.stack
              });
            }
          } finally {
            G.T = t, ie.p = l;
          }
        }
        0 !== (fn & 3) && iu();
        Zt(e);
        l = e.pendingLanes;
        0 !== (n & 261930) && 0 !== (l & 42) ? e === $c ? Ql++ : (Ql = 0, $c = e) : Ql = 0;
        yi(0, false);
      }
    }
    function Yp(e, t) {
      0 === (e.pooledCacheLanes &= t) && (t = e.pooledCache, null != t && (e.pooledCache = null, gi(t)));
    }
    function iu() {
      jp();
      Lp();
      Gp();
      return Vp();
    }
    function Vp() {
      if (5 !== He) return false;
      var e = Ln, t = Kc;
      Kc = 0;
      var n = pr(fn), a = G.T, l = ie.p;
      try {
        ie.p = 32 > n ? 32 : n;
        G.T = null;
        n = Wc;
        Wc = null;
        var i = Ln, u = fn;
        He = 0;
        il = Ln = null;
        fn = 0;
        if (0 !== (le & 6)) throw Error(A(331));
        var c = le;
        le |= 4;
        kp(i.current);
        Ep(
          i,
          i.current,
          u,
          n
        );
        le = c;
        yi(0, false);
        if (ht && "function" === typeof ht.onPostCommitFiberRoot)
          try {
            ht.onPostCommitFiberRoot(ri, i);
          } catch (r) {
          }
        return true;
      } finally {
        ie.p = l, G.T = a, Yp(e, t);
      }
    }
    function Pf(e, t, n) {
      t = Dt(n, t);
      t = Fc(e.stateNode, t, 2);
      e = Hn(e, t, 2);
      null !== e && (fi(e, 2), Zt(e));
    }
    function fe(e, t, n) {
      if (3 === e.tag)
        Pf(e, e, n);
      else
        for (; null !== t; ) {
          if (3 === t.tag) {
            Pf(
              t,
              e,
              n
            );
            break;
          } else if (1 === t.tag) {
            var a = t.stateNode;
            if ("function" === typeof t.type.getDerivedStateFromError || "function" === typeof a.componentDidCatch && (null === jn || !jn.has(a))) {
              e = Dt(n, e);
              n = lp(2);
              a = Hn(t, n, 2);
              null !== a && (ip(
                n,
                a,
                t,
                e
              ), fi(a, 2), Zt(a));
              break;
            }
          }
          t = t.return;
        }
    }
    function cc(e, t, n) {
      var a = e.pingCache;
      if (null === a) {
        a = e.pingCache = new Lm();
        var l = /* @__PURE__ */ new Set();
        a.set(t, l);
      } else
        l = a.get(t), void 0 === l && (l = /* @__PURE__ */ new Set(), a.set(t, l));
      l.has(n) || (Jr = true, l.add(n), e = Xm.bind(null, e, t, n), t.then(e, e));
    }
    function Xm(e, t, n) {
      var a = e.pingCache;
      null !== a && a.delete(t);
      e.pingedLanes |= e.suspendedLanes & n;
      e.warmLanes &= ~n;
      me === e && (I & n) === n && (4 === Te || 3 === Te && (I & 62914560) === I && 300 > mt() - nu ? 0 === (le & 2) && ol(e, 0) : Kr |= n, ll === I && (ll = 0));
      Zt(e);
    }
    function Fp(e, t) {
      0 === t && (t = Ud());
      e = ha(e, t);
      null !== e && (fi(e, t), Zt(e));
    }
    function Qm(e) {
      var t = e.memoizedState, n = 0;
      null !== t && (n = t.retryLane);
      Fp(e, n);
    }
    function Zm(e, t) {
      var n = 0;
      switch (e.tag) {
        case 31:
        case 13:
          var a = e.stateNode;
          var l = e.memoizedState;
          null !== l && (n = l.retryLane);
          break;
        case 19:
          a = e.stateNode;
          break;
        case 22:
          a = e.stateNode._retryCache;
          break;
        default:
          throw Error(A(314));
      }
      null !== a && a.delete(t);
      Fp(e, n);
    }
    function Jm(e, t) {
      return fr(e, t);
    }
    var Bo = null;
    var _a = null;
    var Ic = false;
    var qo = false;
    var rc = false;
    var wn = 0;
    function Zt(e) {
      e !== _a && null === e.next && (null === _a ? Bo = _a = e : _a = _a.next = e);
      qo = true;
      Ic || (Ic = true, Wm());
    }
    function yi(e, t) {
      if (!rc && qo) {
        rc = true;
        do {
          var n = false;
          for (var a = Bo; null !== a; ) {
            if (!t)
              if (0 !== e) {
                var l = a.pendingLanes;
                if (0 === l) var i = 0;
                else {
                  var u = a.suspendedLanes, c = a.pingedLanes;
                  i = (1 << 31 - yt(42 | e) + 1) - 1;
                  i &= l & ~(u & ~c);
                  i = i & 201326741 ? i & 201326741 | 1 : i ? i | 2 : 0;
                }
                0 !== i && (n = true, ed(a, i));
              } else
                i = I, i = Xo(
                  a,
                  a === me ? i : 0,
                  null !== a.cancelPendingCommit || -1 !== a.timeoutHandle
                ), 0 === (i & 3) || si(a, i) || (n = true, ed(a, i));
            a = a.next;
          }
        } while (n);
        rc = false;
      }
    }
    function Km() {
      Xp();
    }
    function Xp() {
      qo = Ic = false;
      var e = 0;
      0 !== wn && lh() && (e = wn);
      for (var t = mt(), n = null, a = Bo; null !== a; ) {
        var l = a.next, i = Qp(a, t);
        if (0 === i)
          a.next = null, null === n ? Bo = l : n.next = l, null === l && (_a = n);
        else if (n = a, 0 !== e || 0 !== (i & 3))
          qo = true;
        a = l;
      }
      0 !== He && 5 !== He || yi(e, false);
      0 !== wn && (wn = 0);
    }
    function Qp(e, t) {
      for (var n = e.suspendedLanes, a = e.pingedLanes, l = e.expirationTimes, i = e.pendingLanes & -62914561; 0 < i; ) {
        var u = 31 - yt(i), c = 1 << u, r = l[u];
        if (-1 === r) {
          if (0 === (c & n) || 0 !== (c & a))
            l[u] = z1(c, t);
        } else r <= t && (e.expiredLanes |= c);
        i &= ~c;
      }
      t = me;
      n = I;
      n = Xo(
        e,
        e === t ? n : 0,
        null !== e.cancelPendingCommit || -1 !== e.timeoutHandle
      );
      a = e.callbackNode;
      if (0 === n || e === t && (2 === se || 9 === se) || null !== e.cancelPendingCommit)
        return null !== a && null !== a && Hu(a), e.callbackNode = null, e.callbackPriority = 0;
      if (0 === (n & 3) || si(e, n)) {
        t = n & -n;
        if (t === e.callbackPriority) return t;
        null !== a && Hu(a);
        switch (pr(n)) {
          case 2:
          case 8:
            n = Od;
            break;
          case 32:
            n = bo;
            break;
          case 268435456:
            n = wd;
            break;
          default:
            n = bo;
        }
        a = Zp.bind(null, e);
        n = fr(n, a);
        e.callbackPriority = t;
        e.callbackNode = n;
        return t;
      }
      null !== a && null !== a && Hu(a);
      e.callbackPriority = 2;
      e.callbackNode = null;
      return 2;
    }
    function Zp(e, t) {
      if (0 !== He && 5 !== He)
        return e.callbackNode = null, e.callbackPriority = 0, null;
      var n = e.callbackNode;
      if (iu() && e.callbackNode !== n)
        return null;
      var a = I;
      a = Xo(
        e,
        e === me ? a : 0,
        null !== e.cancelPendingCommit || -1 !== e.timeoutHandle
      );
      if (0 === a) return null;
      _p(e, a, t);
      Qp(e, mt());
      return null != e.callbackNode && e.callbackNode === n ? Zp.bind(null, e) : null;
    }
    function ed(e, t) {
      if (iu()) return null;
      _p(e, t, true);
    }
    function Wm() {
      oh(function() {
        0 !== (le & 6) ? fr(
          _d,
          Km
        ) : Xp();
      });
    }
    function $r() {
      if (0 === wn) {
        var e = tl;
        0 === e && (e = qi, qi <<= 1, 0 === (qi & 261888) && (qi = 256));
        wn = e;
      }
      return wn;
    }
    function td(e) {
      return null == e || "symbol" === typeof e || "boolean" === typeof e ? null : "function" === typeof e ? e : to("" + e);
    }
    function nd(e, t) {
      var n = t.ownerDocument.createElement("input");
      n.name = t.name;
      n.value = t.value;
      e.id && n.setAttribute("form", e.id);
      t.parentNode.insertBefore(n, t);
      e = new FormData(e);
      n.parentNode.removeChild(n);
      return e;
    }
    function $m(e, t, n, a, l) {
      if ("submit" === t && n && n.stateNode === l) {
        var i = td(
          (l[ct] || null).action
        ), u = a.submitter;
        u && (t = (t = u[ct] || null) ? td(t.formAction) : u.getAttribute("formAction"), null !== t && (i = t, u = null));
        var c = new Qo(
          "action",
          "action",
          null,
          a,
          l
        );
        e.push({
          event: c,
          listeners: [
            {
              instance: null,
              listener: function() {
                if (a.defaultPrevented) {
                  if (0 !== wn) {
                    var r = u ? nd(l, u) : new FormData(l);
                    Yc(
                      n,
                      {
                        pending: true,
                        data: r,
                        method: l.method,
                        action: i
                      },
                      null,
                      r
                    );
                  }
                } else
                  "function" === typeof i && (c.preventDefault(), r = u ? nd(l, u) : new FormData(l), Yc(
                    n,
                    {
                      pending: true,
                      data: r,
                      method: l.method,
                      action: i
                    },
                    i,
                    r
                  ));
              },
              currentTarget: l
            }
          ]
        });
      }
    }
    for (Ki = 0; Ki < Mc.length; Ki++) {
      Wi = Mc[Ki], ad = Wi.toLowerCase(), ld = Wi[0].toUpperCase() + Wi.slice(1);
      qt(
        ad,
        "on" + ld
      );
    }
    var Wi;
    var ad;
    var ld;
    var Ki;
    qt(i0, "onAnimationEnd");
    qt(o0, "onAnimationIteration");
    qt(u0, "onAnimationStart");
    qt("dblclick", "onDoubleClick");
    qt("focusin", "onFocus");
    qt("focusout", "onBlur");
    qt(mm, "onTransitionRun");
    qt(hm, "onTransitionStart");
    qt(ym, "onTransitionCancel");
    qt(c0, "onTransitionEnd");
    Pa("onMouseEnter", ["mouseout", "mouseover"]);
    Pa("onMouseLeave", ["mouseout", "mouseover"]);
    Pa("onPointerEnter", ["pointerout", "pointerover"]);
    Pa("onPointerLeave", ["pointerout", "pointerover"]);
    pa(
      "onChange",
      "change click focusin focusout input keydown keyup selectionchange".split(" ")
    );
    pa(
      "onSelect",
      "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
        " "
      )
    );
    pa("onBeforeInput", [
      "compositionend",
      "keypress",
      "textInput",
      "paste"
    ]);
    pa(
      "onCompositionEnd",
      "compositionend focusout keydown keypress keyup mousedown".split(" ")
    );
    pa(
      "onCompositionStart",
      "compositionstart focusout keydown keypress keyup mousedown".split(" ")
    );
    pa(
      "onCompositionUpdate",
      "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
    );
    var ai = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " "
    );
    var Im = new Set(
      "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(ai)
    );
    function Jp(e, t) {
      t = 0 !== (t & 4);
      for (var n = 0; n < e.length; n++) {
        var a = e[n], l = a.event;
        a = a.listeners;
        e: {
          var i = void 0;
          if (t)
            for (var u = a.length - 1; 0 <= u; u--) {
              var c = a[u], r = c.instance, g = c.currentTarget;
              c = c.listener;
              if (r !== i && l.isPropagationStopped())
                break e;
              i = c;
              l.currentTarget = g;
              try {
                i(l);
              } catch (m) {
                So(m);
              }
              l.currentTarget = null;
              i = r;
            }
          else
            for (u = 0; u < a.length; u++) {
              c = a[u];
              r = c.instance;
              g = c.currentTarget;
              c = c.listener;
              if (r !== i && l.isPropagationStopped())
                break e;
              i = c;
              l.currentTarget = g;
              try {
                i(l);
              } catch (m) {
                So(m);
              }
              l.currentTarget = null;
              i = r;
            }
        }
      }
    }
    function K(e, t) {
      var n = t[zc];
      void 0 === n && (n = t[zc] = /* @__PURE__ */ new Set());
      var a = e + "__bubble";
      n.has(a) || (Kp(t, e, 2, false), n.add(a));
    }
    function sc(e, t, n) {
      var a = 0;
      t && (a |= 4);
      Kp(
        n,
        e,
        a,
        t
      );
    }
    var $i = "_reactListening" + Math.random().toString(36).slice(2);
    function Ir(e) {
      if (!e[$i]) {
        e[$i] = true;
        Ld.forEach(function(n) {
          "selectionchange" !== n && (Im.has(n) || sc(n, false, e), sc(n, true, e));
        });
        var t = 9 === e.nodeType ? e : e.ownerDocument;
        null === t || t[$i] || (t[$i] = true, sc("selectionchange", false, t));
      }
    }
    function Kp(e, t, n, a) {
      switch (cg(t)) {
        case 2:
          var l = Th;
          break;
        case 8:
          l = kh;
          break;
        default:
          l = ns;
      }
      n = l.bind(
        null,
        t,
        n,
        e
      );
      l = void 0;
      !kc || "touchstart" !== t && "touchmove" !== t && "wheel" !== t || (l = true);
      a ? void 0 !== l ? e.addEventListener(t, n, {
        capture: true,
        passive: l
      }) : e.addEventListener(t, n, true) : void 0 !== l ? e.addEventListener(t, n, {
        passive: l
      }) : e.addEventListener(t, n, false);
    }
    function fc(e, t, n, a, l) {
      var i = a;
      if (0 === (t & 1) && 0 === (t & 2) && null !== a)
        e: for (; ; ) {
          if (null === a) return;
          var u = a.tag;
          if (3 === u || 4 === u) {
            var c = a.stateNode.containerInfo;
            if (c === l) break;
            if (4 === u)
              for (u = a.return; null !== u; ) {
                var r = u.tag;
                if ((3 === r || 4 === r) && u.stateNode.containerInfo === l)
                  return;
                u = u.return;
              }
            for (; null !== c; ) {
              u = Ua(c);
              if (null === u) return;
              r = u.tag;
              if (5 === r || 6 === r || 26 === r || 27 === r) {
                a = i = u;
                continue e;
              }
              c = c.parentNode;
            }
          }
          a = a.return;
        }
      Jd(function() {
        var g = i, m = hr(n), v = [];
        e: {
          var p = r0.get(e);
          if (void 0 !== p) {
            var y = Qo, T = e;
            switch (e) {
              case "keypress":
                if (0 === ao(n)) break e;
              case "keydown":
              case "keyup":
                y = Z1;
                break;
              case "focusin":
                T = "focus";
                y = Vu;
                break;
              case "focusout":
                T = "blur";
                y = Vu;
                break;
              case "beforeblur":
              case "afterblur":
                y = Vu;
                break;
              case "click":
                if (2 === n.button) break e;
              case "auxclick":
              case "dblclick":
              case "mousedown":
              case "mousemove":
              case "mouseup":
              case "mouseout":
              case "mouseover":
              case "contextmenu":
                y = ff;
                break;
              case "drag":
              case "dragend":
              case "dragenter":
              case "dragexit":
              case "dragleave":
              case "dragover":
              case "dragstart":
              case "drop":
                y = U1;
                break;
              case "touchcancel":
              case "touchend":
              case "touchmove":
              case "touchstart":
                y = W1;
                break;
              case i0:
              case o0:
              case u0:
                y = H1;
                break;
              case c0:
                y = I1;
                break;
              case "scroll":
              case "scrollend":
                y = O1;
                break;
              case "wheel":
                y = em;
                break;
              case "copy":
              case "cut":
              case "paste":
                y = L1;
                break;
              case "gotpointercapture":
              case "lostpointercapture":
              case "pointercancel":
              case "pointerdown":
              case "pointermove":
              case "pointerout":
              case "pointerover":
              case "pointerup":
                y = pf;
                break;
              case "toggle":
              case "beforetoggle":
                y = nm;
            }
            var z = 0 !== (t & 4), U = !z && ("scroll" === e || "scrollend" === e), f = z ? null !== p ? p + "Capture" : null : p;
            z = [];
            for (var d = g, h; null !== d; ) {
              var b = d;
              h = b.stateNode;
              b = b.tag;
              5 !== b && 26 !== b && 27 !== b || null === h || null === f || (b = Kl(d, f), null != b && z.push(
                li(d, b, h)
              ));
              if (U) break;
              d = d.return;
            }
            0 < z.length && (p = new y(
              p,
              T,
              null,
              n,
              m
            ), v.push({ event: p, listeners: z }));
          }
        }
        if (0 === (t & 7)) {
          e: {
            p = "mouseover" === e || "pointerover" === e;
            y = "mouseout" === e || "pointerout" === e;
            if (p && n !== Tc && (T = n.relatedTarget || n.fromElement) && (Ua(T) || T[rl]))
              break e;
            if (y || p) {
              p = m.window === m ? m : (p = m.ownerDocument) ? p.defaultView || p.parentWindow : window;
              if (y) {
                if (T = n.relatedTarget || n.toElement, y = g, T = T ? Ua(T) : null, null !== T && (U = ci(T), z = T.tag, T !== U || 5 !== z && 27 !== z && 6 !== z))
                  T = null;
              } else y = null, T = g;
              if (y !== T) {
                z = ff;
                b = "onMouseLeave";
                f = "onMouseEnter";
                d = "mouse";
                if ("pointerout" === e || "pointerover" === e)
                  z = pf, b = "onPointerLeave", f = "onPointerEnter", d = "pointer";
                U = null == y ? p : _l(y);
                h = null == T ? p : _l(T);
                p = new z(
                  b,
                  d + "leave",
                  y,
                  n,
                  m
                );
                p.target = U;
                p.relatedTarget = h;
                b = null;
                Ua(m) === g && (z = new z(
                  f,
                  d + "enter",
                  T,
                  n,
                  m
                ), z.target = h, z.relatedTarget = U, b = z);
                U = b;
                if (y && T)
                  t: {
                    z = Pm;
                    f = y;
                    d = T;
                    h = 0;
                    for (b = f; b; b = z(b))
                      h++;
                    b = 0;
                    for (var k = d; k; k = z(k))
                      b++;
                    for (; 0 < h - b; )
                      f = z(f), h--;
                    for (; 0 < b - h; )
                      d = z(d), b--;
                    for (; h--; ) {
                      if (f === d || null !== d && f === d.alternate) {
                        z = f;
                        break t;
                      }
                      f = z(f);
                      d = z(d);
                    }
                    z = null;
                  }
                else z = null;
                null !== y && id(
                  v,
                  p,
                  y,
                  z,
                  false
                );
                null !== T && null !== U && id(
                  v,
                  U,
                  T,
                  z,
                  true
                );
              }
            }
          }
          e: {
            p = g ? _l(g) : window;
            y = p.nodeName && p.nodeName.toLowerCase();
            if ("select" === y || "input" === y && "file" === p.type)
              var D = yf;
            else if (hf(p))
              if (e0)
                D = dm;
              else {
                D = sm;
                var E = rm;
              }
            else
              y = p.nodeName, !y || "input" !== y.toLowerCase() || "checkbox" !== p.type && "radio" !== p.type ? g && mr(g.elementType) && (D = yf) : D = fm;
            if (D && (D = D(e, g))) {
              Pd(
                v,
                D,
                n,
                m
              );
              break e;
            }
            E && E(e, p, g);
            "focusout" === e && g && "number" === p.type && null != g.memoizedProps.value && Cc(p, "number", p.value);
          }
          E = g ? _l(g) : window;
          switch (e) {
            case "focusin":
              if (hf(E) || "true" === E.contentEditable)
                Ha = E, Dc = g, ql = null;
              break;
            case "focusout":
              ql = Dc = Ha = null;
              break;
            case "mousedown":
              Nc = true;
              break;
            case "contextmenu":
            case "mouseup":
            case "dragend":
              Nc = false;
              Sf(v, n, m);
              break;
            case "selectionchange":
              if (gm) break;
            case "keydown":
            case "keyup":
              Sf(v, n, m);
          }
          var j;
          if (br)
            e: {
              switch (e) {
                case "compositionstart":
                  var L = "onCompositionStart";
                  break e;
                case "compositionend":
                  L = "onCompositionEnd";
                  break e;
                case "compositionupdate":
                  L = "onCompositionUpdate";
                  break e;
              }
              L = void 0;
            }
          else
            qa ? $d(e, n) && (L = "onCompositionEnd") : "keydown" === e && 229 === n.keyCode && (L = "onCompositionStart");
          L && (Wd && "ko" !== n.locale && (qa || "onCompositionStart" !== L ? "onCompositionEnd" === L && qa && (j = Kd()) : (Rn = m, yr = "value" in Rn ? Rn.value : Rn.textContent, qa = true)), E = Ho(g, L), 0 < E.length && (L = new df(
            L,
            e,
            null,
            n,
            m
          ), v.push({ event: L, listeners: E }), j ? L.data = j : (j = Id(n), null !== j && (L.data = j))));
          if (j = lm ? im(e, n) : om(e, n))
            L = Ho(g, "onBeforeInput"), 0 < L.length && (E = new df(
              "onBeforeInput",
              "beforeinput",
              null,
              n,
              m
            ), v.push({
              event: E,
              listeners: L
            }), E.data = j);
          $m(
            v,
            e,
            g,
            n,
            m
          );
        }
        Jp(v, t);
      });
    }
    function li(e, t, n) {
      return {
        instance: e,
        listener: t,
        currentTarget: n
      };
    }
    function Ho(e, t) {
      for (var n = t + "Capture", a = []; null !== e; ) {
        var l = e, i = l.stateNode;
        l = l.tag;
        5 !== l && 26 !== l && 27 !== l || null === i || (l = Kl(e, n), null != l && a.unshift(
          li(e, l, i)
        ), l = Kl(e, t), null != l && a.push(
          li(e, l, i)
        ));
        if (3 === e.tag) return a;
        e = e.return;
      }
      return [];
    }
    function Pm(e) {
      if (null === e) return null;
      do
        e = e.return;
      while (e && 5 !== e.tag && 27 !== e.tag);
      return e ? e : null;
    }
    function id(e, t, n, a, l) {
      for (var i = t._reactName, u = []; null !== n && n !== a; ) {
        var c = n, r = c.alternate, g = c.stateNode;
        c = c.tag;
        if (null !== r && r === a) break;
        5 !== c && 26 !== c && 27 !== c || null === g || (r = g, l ? (g = Kl(n, i), null != g && u.unshift(
          li(n, g, r)
        )) : l || (g = Kl(n, i), null != g && u.push(
          li(n, g, r)
        )));
        n = n.return;
      }
      0 !== u.length && e.push({ event: t, listeners: u });
    }
    var eh = /\r\n?/g;
    var th = /\u0000|\uFFFD/g;
    function od(e) {
      return ("string" === typeof e ? e : "" + e).replace(eh, "\n").replace(th, "");
    }
    function Wp(e, t) {
      t = od(t);
      return od(e) === t ? true : false;
    }
    function de(e, t, n, a, l, i) {
      switch (n) {
        case "children":
          "string" === typeof a ? "body" === t || "textarea" === t && "" === a || el(e, a) : ("number" === typeof a || "bigint" === typeof a) && "body" !== t && el(e, "" + a);
          break;
        case "className":
          Li(e, "class", a);
          break;
        case "tabIndex":
          Li(e, "tabindex", a);
          break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
          Li(e, n, a);
          break;
        case "style":
          Zd(e, a, i);
          break;
        case "data":
          if ("object" !== t) {
            Li(e, "data", a);
            break;
          }
        case "src":
        case "href":
          if ("" === a && ("a" !== t || "href" !== n)) {
            e.removeAttribute(n);
            break;
          }
          if (null == a || "function" === typeof a || "symbol" === typeof a || "boolean" === typeof a) {
            e.removeAttribute(n);
            break;
          }
          a = to("" + a);
          e.setAttribute(n, a);
          break;
        case "action":
        case "formAction":
          if ("function" === typeof a) {
            e.setAttribute(
              n,
              "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
            );
            break;
          } else
            "function" === typeof i && ("formAction" === n ? ("input" !== t && de(e, t, "name", l.name, l, null), de(
              e,
              t,
              "formEncType",
              l.formEncType,
              l,
              null
            ), de(
              e,
              t,
              "formMethod",
              l.formMethod,
              l,
              null
            ), de(
              e,
              t,
              "formTarget",
              l.formTarget,
              l,
              null
            )) : (de(e, t, "encType", l.encType, l, null), de(e, t, "method", l.method, l, null), de(e, t, "target", l.target, l, null)));
          if (null == a || "symbol" === typeof a || "boolean" === typeof a) {
            e.removeAttribute(n);
            break;
          }
          a = to("" + a);
          e.setAttribute(n, a);
          break;
        case "onClick":
          null != a && (e.onclick = un);
          break;
        case "onScroll":
          null != a && K("scroll", e);
          break;
        case "onScrollEnd":
          null != a && K("scrollend", e);
          break;
        case "dangerouslySetInnerHTML":
          if (null != a) {
            if ("object" !== typeof a || !("__html" in a))
              throw Error(A(61));
            n = a.__html;
            if (null != n) {
              if (null != l.children) throw Error(A(60));
              e.innerHTML = n;
            }
          }
          break;
        case "multiple":
          e.multiple = a && "function" !== typeof a && "symbol" !== typeof a;
          break;
        case "muted":
          e.muted = a && "function" !== typeof a && "symbol" !== typeof a;
          break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "defaultValue":
        case "defaultChecked":
        case "innerHTML":
        case "ref":
          break;
        case "autoFocus":
          break;
        case "xlinkHref":
          if (null == a || "function" === typeof a || "boolean" === typeof a || "symbol" === typeof a) {
            e.removeAttribute("xlink:href");
            break;
          }
          n = to("" + a);
          e.setAttributeNS(
            "http://www.w3.org/1999/xlink",
            "xlink:href",
            n
          );
          break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
          null != a && "function" !== typeof a && "symbol" !== typeof a ? e.setAttribute(n, "" + a) : e.removeAttribute(n);
          break;
        case "inert":
        case "allowFullScreen":
        case "async":
        case "autoPlay":
        case "controls":
        case "default":
        case "defer":
        case "disabled":
        case "disablePictureInPicture":
        case "disableRemotePlayback":
        case "formNoValidate":
        case "hidden":
        case "loop":
        case "noModule":
        case "noValidate":
        case "open":
        case "playsInline":
        case "readOnly":
        case "required":
        case "reversed":
        case "scoped":
        case "seamless":
        case "itemScope":
          a && "function" !== typeof a && "symbol" !== typeof a ? e.setAttribute(n, "") : e.removeAttribute(n);
          break;
        case "capture":
        case "download":
          true === a ? e.setAttribute(n, "") : false !== a && null != a && "function" !== typeof a && "symbol" !== typeof a ? e.setAttribute(n, a) : e.removeAttribute(n);
          break;
        case "cols":
        case "rows":
        case "size":
        case "span":
          null != a && "function" !== typeof a && "symbol" !== typeof a && !isNaN(a) && 1 <= a ? e.setAttribute(n, a) : e.removeAttribute(n);
          break;
        case "rowSpan":
        case "start":
          null == a || "function" === typeof a || "symbol" === typeof a || isNaN(a) ? e.removeAttribute(n) : e.setAttribute(n, a);
          break;
        case "popover":
          K("beforetoggle", e);
          K("toggle", e);
          eo(e, "popover", a);
          break;
        case "xlinkActuate":
          It(
            e,
            "http://www.w3.org/1999/xlink",
            "xlink:actuate",
            a
          );
          break;
        case "xlinkArcrole":
          It(
            e,
            "http://www.w3.org/1999/xlink",
            "xlink:arcrole",
            a
          );
          break;
        case "xlinkRole":
          It(
            e,
            "http://www.w3.org/1999/xlink",
            "xlink:role",
            a
          );
          break;
        case "xlinkShow":
          It(
            e,
            "http://www.w3.org/1999/xlink",
            "xlink:show",
            a
          );
          break;
        case "xlinkTitle":
          It(
            e,
            "http://www.w3.org/1999/xlink",
            "xlink:title",
            a
          );
          break;
        case "xlinkType":
          It(
            e,
            "http://www.w3.org/1999/xlink",
            "xlink:type",
            a
          );
          break;
        case "xmlBase":
          It(
            e,
            "http://www.w3.org/XML/1998/namespace",
            "xml:base",
            a
          );
          break;
        case "xmlLang":
          It(
            e,
            "http://www.w3.org/XML/1998/namespace",
            "xml:lang",
            a
          );
          break;
        case "xmlSpace":
          It(
            e,
            "http://www.w3.org/XML/1998/namespace",
            "xml:space",
            a
          );
          break;
        case "is":
          eo(e, "is", a);
          break;
        case "innerText":
        case "textContent":
          break;
        default:
          if (!(2 < n.length) || "o" !== n[0] && "O" !== n[0] || "n" !== n[1] && "N" !== n[1])
            n = R1.get(n) || n, eo(e, n, a);
      }
    }
    function Pc(e, t, n, a, l, i) {
      switch (n) {
        case "style":
          Zd(e, a, i);
          break;
        case "dangerouslySetInnerHTML":
          if (null != a) {
            if ("object" !== typeof a || !("__html" in a))
              throw Error(A(61));
            n = a.__html;
            if (null != n) {
              if (null != l.children) throw Error(A(60));
              e.innerHTML = n;
            }
          }
          break;
        case "children":
          "string" === typeof a ? el(e, a) : ("number" === typeof a || "bigint" === typeof a) && el(e, "" + a);
          break;
        case "onScroll":
          null != a && K("scroll", e);
          break;
        case "onScrollEnd":
          null != a && K("scrollend", e);
          break;
        case "onClick":
          null != a && (e.onclick = un);
          break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "innerHTML":
        case "ref":
          break;
        case "innerText":
        case "textContent":
          break;
        default:
          if (!Gd.hasOwnProperty(n))
            e: {
              if ("o" === n[0] && "n" === n[1] && (l = n.endsWith("Capture"), t = n.slice(2, l ? n.length - 7 : void 0), i = e[ct] || null, i = null != i ? i[n] : null, "function" === typeof i && e.removeEventListener(t, i, l), "function" === typeof a)) {
                "function" !== typeof i && null !== i && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n));
                e.addEventListener(t, a, l);
                break e;
              }
              n in e ? e[n] = a : true === a ? e.setAttribute(n, "") : eo(e, n, a);
            }
      }
    }
    function We(e, t, n) {
      switch (t) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
          break;
        case "img":
          K("error", e);
          K("load", e);
          var a = false, l = false, i;
          for (i in n)
            if (n.hasOwnProperty(i)) {
              var u = n[i];
              if (null != u)
                switch (i) {
                  case "src":
                    a = true;
                    break;
                  case "srcSet":
                    l = true;
                    break;
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw Error(A(137, t));
                  default:
                    de(e, t, i, u, n, null);
                }
            }
          l && de(e, t, "srcSet", n.srcSet, n, null);
          a && de(e, t, "src", n.src, n, null);
          return;
        case "input":
          K("invalid", e);
          var c = i = u = l = null, r = null, g = null;
          for (a in n)
            if (n.hasOwnProperty(a)) {
              var m = n[a];
              if (null != m)
                switch (a) {
                  case "name":
                    l = m;
                    break;
                  case "type":
                    u = m;
                    break;
                  case "checked":
                    r = m;
                    break;
                  case "defaultChecked":
                    g = m;
                    break;
                  case "value":
                    i = m;
                    break;
                  case "defaultValue":
                    c = m;
                    break;
                  case "children":
                  case "dangerouslySetInnerHTML":
                    if (null != m)
                      throw Error(A(137, t));
                    break;
                  default:
                    de(e, t, a, m, n, null);
                }
            }
          Fd(
            e,
            i,
            c,
            r,
            g,
            u,
            l,
            false
          );
          return;
        case "select":
          K("invalid", e);
          a = u = i = null;
          for (l in n)
            if (n.hasOwnProperty(l) && (c = n[l], null != c))
              switch (l) {
                case "value":
                  i = c;
                  break;
                case "defaultValue":
                  u = c;
                  break;
                case "multiple":
                  a = c;
                default:
                  de(e, t, l, c, n, null);
              }
          t = i;
          n = u;
          e.multiple = !!a;
          null != t ? Qa(e, !!a, t, false) : null != n && Qa(e, !!a, n, true);
          return;
        case "textarea":
          K("invalid", e);
          i = l = a = null;
          for (u in n)
            if (n.hasOwnProperty(u) && (c = n[u], null != c))
              switch (u) {
                case "value":
                  a = c;
                  break;
                case "defaultValue":
                  l = c;
                  break;
                case "children":
                  i = c;
                  break;
                case "dangerouslySetInnerHTML":
                  if (null != c) throw Error(A(91));
                  break;
                default:
                  de(e, t, u, c, n, null);
              }
          Qd(e, a, l, i);
          return;
        case "option":
          for (r in n)
            if (n.hasOwnProperty(r) && (a = n[r], null != a))
              switch (r) {
                case "selected":
                  e.selected = a && "function" !== typeof a && "symbol" !== typeof a;
                  break;
                default:
                  de(e, t, r, a, n, null);
              }
          return;
        case "dialog":
          K("beforetoggle", e);
          K("toggle", e);
          K("cancel", e);
          K("close", e);
          break;
        case "iframe":
        case "object":
          K("load", e);
          break;
        case "video":
        case "audio":
          for (a = 0; a < ai.length; a++)
            K(ai[a], e);
          break;
        case "image":
          K("error", e);
          K("load", e);
          break;
        case "details":
          K("toggle", e);
          break;
        case "embed":
        case "source":
        case "link":
          K("error", e), K("load", e);
        case "area":
        case "base":
        case "br":
        case "col":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "track":
        case "wbr":
        case "menuitem":
          for (g in n)
            if (n.hasOwnProperty(g) && (a = n[g], null != a))
              switch (g) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(A(137, t));
                default:
                  de(e, t, g, a, n, null);
              }
          return;
        default:
          if (mr(t)) {
            for (m in n)
              n.hasOwnProperty(m) && (a = n[m], void 0 !== a && Pc(
                e,
                t,
                m,
                a,
                n,
                void 0
              ));
            return;
          }
      }
      for (c in n)
        n.hasOwnProperty(c) && (a = n[c], null != a && de(e, t, c, a, n, null));
    }
    function nh(e, t, n, a) {
      switch (t) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
          break;
        case "input":
          var l = null, i = null, u = null, c = null, r = null, g = null, m = null;
          for (y in n) {
            var v = n[y];
            if (n.hasOwnProperty(y) && null != v)
              switch (y) {
                case "checked":
                  break;
                case "value":
                  break;
                case "defaultValue":
                  r = v;
                default:
                  a.hasOwnProperty(y) || de(e, t, y, null, a, v);
              }
          }
          for (var p in a) {
            var y = a[p];
            v = n[p];
            if (a.hasOwnProperty(p) && (null != y || null != v))
              switch (p) {
                case "type":
                  i = y;
                  break;
                case "name":
                  l = y;
                  break;
                case "checked":
                  g = y;
                  break;
                case "defaultChecked":
                  m = y;
                  break;
                case "value":
                  u = y;
                  break;
                case "defaultValue":
                  c = y;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (null != y)
                    throw Error(A(137, t));
                  break;
                default:
                  y !== v && de(
                    e,
                    t,
                    p,
                    y,
                    a,
                    v
                  );
              }
          }
          Ec(
            e,
            u,
            c,
            r,
            g,
            m,
            i,
            l
          );
          return;
        case "select":
          y = u = c = p = null;
          for (i in n)
            if (r = n[i], n.hasOwnProperty(i) && null != r)
              switch (i) {
                case "value":
                  break;
                case "multiple":
                  y = r;
                default:
                  a.hasOwnProperty(i) || de(
                    e,
                    t,
                    i,
                    null,
                    a,
                    r
                  );
              }
          for (l in a)
            if (i = a[l], r = n[l], a.hasOwnProperty(l) && (null != i || null != r))
              switch (l) {
                case "value":
                  p = i;
                  break;
                case "defaultValue":
                  c = i;
                  break;
                case "multiple":
                  u = i;
                default:
                  i !== r && de(
                    e,
                    t,
                    l,
                    i,
                    a,
                    r
                  );
              }
          t = c;
          n = u;
          a = y;
          null != p ? Qa(e, !!n, p, false) : !!a !== !!n && (null != t ? Qa(e, !!n, t, true) : Qa(e, !!n, n ? [] : "", false));
          return;
        case "textarea":
          y = p = null;
          for (c in n)
            if (l = n[c], n.hasOwnProperty(c) && null != l && !a.hasOwnProperty(c))
              switch (c) {
                case "value":
                  break;
                case "children":
                  break;
                default:
                  de(e, t, c, null, a, l);
              }
          for (u in a)
            if (l = a[u], i = n[u], a.hasOwnProperty(u) && (null != l || null != i))
              switch (u) {
                case "value":
                  p = l;
                  break;
                case "defaultValue":
                  y = l;
                  break;
                case "children":
                  break;
                case "dangerouslySetInnerHTML":
                  if (null != l) throw Error(A(91));
                  break;
                default:
                  l !== i && de(e, t, u, l, a, i);
              }
          Xd(e, p, y);
          return;
        case "option":
          for (var T in n)
            if (p = n[T], n.hasOwnProperty(T) && null != p && !a.hasOwnProperty(T))
              switch (T) {
                case "selected":
                  e.selected = false;
                  break;
                default:
                  de(
                    e,
                    t,
                    T,
                    null,
                    a,
                    p
                  );
              }
          for (r in a)
            if (p = a[r], y = n[r], a.hasOwnProperty(r) && p !== y && (null != p || null != y))
              switch (r) {
                case "selected":
                  e.selected = p && "function" !== typeof p && "symbol" !== typeof p;
                  break;
                default:
                  de(
                    e,
                    t,
                    r,
                    p,
                    a,
                    y
                  );
              }
          return;
        case "img":
        case "link":
        case "area":
        case "base":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "source":
        case "track":
        case "wbr":
        case "menuitem":
          for (var z in n)
            p = n[z], n.hasOwnProperty(z) && null != p && !a.hasOwnProperty(z) && de(e, t, z, null, a, p);
          for (g in a)
            if (p = a[g], y = n[g], a.hasOwnProperty(g) && p !== y && (null != p || null != y))
              switch (g) {
                case "children":
                case "dangerouslySetInnerHTML":
                  if (null != p)
                    throw Error(A(137, t));
                  break;
                default:
                  de(
                    e,
                    t,
                    g,
                    p,
                    a,
                    y
                  );
              }
          return;
        default:
          if (mr(t)) {
            for (var U in n)
              p = n[U], n.hasOwnProperty(U) && void 0 !== p && !a.hasOwnProperty(U) && Pc(
                e,
                t,
                U,
                void 0,
                a,
                p
              );
            for (m in a)
              p = a[m], y = n[m], !a.hasOwnProperty(m) || p === y || void 0 === p && void 0 === y || Pc(
                e,
                t,
                m,
                p,
                a,
                y
              );
            return;
          }
      }
      for (var f in n)
        p = n[f], n.hasOwnProperty(f) && null != p && !a.hasOwnProperty(f) && de(e, t, f, null, a, p);
      for (v in a)
        p = a[v], y = n[v], !a.hasOwnProperty(v) || p === y || null == p && null == y || de(e, t, v, p, a, y);
    }
    function ud(e) {
      switch (e) {
        case "css":
        case "script":
        case "font":
        case "img":
        case "image":
        case "input":
        case "link":
          return true;
        default:
          return false;
      }
    }
    function ah() {
      if ("function" === typeof performance.getEntriesByType) {
        for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), a = 0; a < n.length; a++) {
          var l = n[a], i = l.transferSize, u = l.initiatorType, c = l.duration;
          if (i && c && ud(u)) {
            u = 0;
            c = l.responseEnd;
            for (a += 1; a < n.length; a++) {
              var r = n[a], g = r.startTime;
              if (g > c) break;
              var m = r.transferSize, v = r.initiatorType;
              m && ud(v) && (r = r.responseEnd, u += m * (r < c ? 1 : (c - g) / (r - g)));
            }
            --a;
            t += 8 * (i + u) / (l.duration / 1e3);
            e++;
            if (10 < e) break;
          }
        }
        if (0 < e) return t / e / 1e6;
      }
      return navigator.connection && (e = navigator.connection.downlink, "number" === typeof e) ? e : 5;
    }
    var er = null;
    var tr = null;
    function jo(e) {
      return 9 === e.nodeType ? e : e.ownerDocument;
    }
    function cd(e) {
      switch (e) {
        case "http://www.w3.org/2000/svg":
          return 1;
        case "http://www.w3.org/1998/Math/MathML":
          return 2;
        default:
          return 0;
      }
    }
    function $p(e, t) {
      if (0 === e)
        switch (t) {
          case "svg":
            return 1;
          case "math":
            return 2;
          default:
            return 0;
        }
      return 1 === e && "foreignObject" === t ? 0 : e;
    }
    function nr(e, t) {
      return "textarea" === e || "noscript" === e || "string" === typeof t.children || "number" === typeof t.children || "bigint" === typeof t.children || "object" === typeof t.dangerouslySetInnerHTML && null !== t.dangerouslySetInnerHTML && null != t.dangerouslySetInnerHTML.__html;
    }
    var dc = null;
    function lh() {
      var e = window.event;
      if (e && "popstate" === e.type) {
        if (e === dc) return false;
        dc = e;
        return true;
      }
      dc = null;
      return false;
    }
    var Ip = "function" === typeof setTimeout ? setTimeout : void 0;
    var ih = "function" === typeof clearTimeout ? clearTimeout : void 0;
    var rd = "function" === typeof Promise ? Promise : void 0;
    var oh = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof rd ? function(e) {
      return rd.resolve(null).then(e).catch(uh);
    } : Ip;
    function uh(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function Kn(e) {
      return "head" === e;
    }
    function sd(e, t) {
      var n = t, a = 0;
      do {
        var l = n.nextSibling;
        e.removeChild(n);
        if (l && 8 === l.nodeType)
          if (n = l.data, "/$" === n || "/&" === n) {
            if (0 === a) {
              e.removeChild(l);
              cl(t);
              return;
            }
            a--;
          } else if ("$" === n || "$?" === n || "$~" === n || "$!" === n || "&" === n)
            a++;
          else if ("html" === n)
            Zl(e.ownerDocument.documentElement);
          else if ("head" === n) {
            n = e.ownerDocument.head;
            Zl(n);
            for (var i = n.firstChild; i; ) {
              var u = i.nextSibling, c = i.nodeName;
              i[di] || "SCRIPT" === c || "STYLE" === c || "LINK" === c && "stylesheet" === i.rel.toLowerCase() || n.removeChild(i);
              i = u;
            }
          } else
            "body" === n && Zl(e.ownerDocument.body);
        n = l;
      } while (n);
      cl(t);
    }
    function fd(e, t) {
      var n = e;
      e = 0;
      do {
        var a = n.nextSibling;
        1 === n.nodeType ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", "" === n.getAttribute("style") && n.removeAttribute("style")) : 3 === n.nodeType && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || "");
        if (a && 8 === a.nodeType)
          if (n = a.data, "/$" === n)
            if (0 === e) break;
            else e--;
          else
            "$" !== n && "$?" !== n && "$~" !== n && "$!" !== n || e++;
        n = a;
      } while (n);
    }
    function ar(e) {
      var t = e.firstChild;
      t && 10 === t.nodeType && (t = t.nextSibling);
      for (; t; ) {
        var n = t;
        t = t.nextSibling;
        switch (n.nodeName) {
          case "HTML":
          case "HEAD":
          case "BODY":
            ar(n);
            gr(n);
            continue;
          case "SCRIPT":
          case "STYLE":
            continue;
          case "LINK":
            if ("stylesheet" === n.rel.toLowerCase()) continue;
        }
        e.removeChild(n);
      }
    }
    function ch(e, t, n, a) {
      for (; 1 === e.nodeType; ) {
        var l = n;
        if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
          if (!a && ("INPUT" !== e.nodeName || "hidden" !== e.type))
            break;
        } else if (!a)
          if ("input" === t && "hidden" === e.type) {
            var i = null == l.name ? null : "" + l.name;
            if ("hidden" === l.type && e.getAttribute("name") === i)
              return e;
          } else return e;
        else if (!e[di])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              i = e.getAttribute("rel");
              if ("stylesheet" === i && e.hasAttribute("data-precedence"))
                break;
              else if (i !== l.rel || e.getAttribute("href") !== (null == l.href || "" === l.href ? null : l.href) || e.getAttribute("crossorigin") !== (null == l.crossOrigin ? null : l.crossOrigin) || e.getAttribute("title") !== (null == l.title ? null : l.title))
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              i = e.getAttribute("src");
              if ((i !== (null == l.src ? null : l.src) || e.getAttribute("type") !== (null == l.type ? null : l.type) || e.getAttribute("crossorigin") !== (null == l.crossOrigin ? null : l.crossOrigin)) && i && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                break;
              return e;
            default:
              return e;
          }
        e = Rt(e.nextSibling);
        if (null === e) break;
      }
      return null;
    }
    function rh(e, t, n) {
      if ("" === t) return null;
      for (; 3 !== e.nodeType; ) {
        if ((1 !== e.nodeType || "INPUT" !== e.nodeName || "hidden" !== e.type) && !n)
          return null;
        e = Rt(e.nextSibling);
        if (null === e) return null;
      }
      return e;
    }
    function Pp(e, t) {
      for (; 8 !== e.nodeType; ) {
        if ((1 !== e.nodeType || "INPUT" !== e.nodeName || "hidden" !== e.type) && !t)
          return null;
        e = Rt(e.nextSibling);
        if (null === e) return null;
      }
      return e;
    }
    function lr(e) {
      return "$?" === e.data || "$~" === e.data;
    }
    function ir(e) {
      return "$!" === e.data || "$?" === e.data && "loading" !== e.ownerDocument.readyState;
    }
    function sh(e, t) {
      var n = e.ownerDocument;
      if ("$~" === e.data) e._reactRetry = t;
      else if ("$?" !== e.data || "loading" !== n.readyState)
        t();
      else {
        var a = function() {
          t();
          n.removeEventListener("DOMContentLoaded", a);
        };
        n.addEventListener("DOMContentLoaded", a);
        e._reactRetry = a;
      }
    }
    function Rt(e) {
      for (; null != e; e = e.nextSibling) {
        var t = e.nodeType;
        if (1 === t || 3 === t) break;
        if (8 === t) {
          t = e.data;
          if ("$" === t || "$!" === t || "$?" === t || "$~" === t || "&" === t || "F!" === t || "F" === t)
            break;
          if ("/$" === t || "/&" === t) return null;
        }
      }
      return e;
    }
    var or = null;
    function dd(e) {
      e = e.nextSibling;
      for (var t = 0; e; ) {
        if (8 === e.nodeType) {
          var n = e.data;
          if ("/$" === n || "/&" === n) {
            if (0 === t)
              return Rt(e.nextSibling);
            t--;
          } else
            "$" !== n && "$!" !== n && "$?" !== n && "$~" !== n && "&" !== n || t++;
        }
        e = e.nextSibling;
      }
      return null;
    }
    function pd(e) {
      e = e.previousSibling;
      for (var t = 0; e; ) {
        if (8 === e.nodeType) {
          var n = e.data;
          if ("$" === n || "$!" === n || "$?" === n || "$~" === n || "&" === n) {
            if (0 === t) return e;
            t--;
          } else "/$" !== n && "/&" !== n || t++;
        }
        e = e.previousSibling;
      }
      return null;
    }
    function eg(e, t, n) {
      t = jo(n);
      switch (e) {
        case "html":
          e = t.documentElement;
          if (!e) throw Error(A(452));
          return e;
        case "head":
          e = t.head;
          if (!e) throw Error(A(453));
          return e;
        case "body":
          e = t.body;
          if (!e) throw Error(A(454));
          return e;
        default:
          throw Error(A(451));
      }
    }
    function Zl(e) {
      for (var t = e.attributes; t.length; )
        e.removeAttributeNode(t[0]);
      gr(e);
    }
    var _t = /* @__PURE__ */ new Map();
    var gd = /* @__PURE__ */ new Set();
    function Lo(e) {
      return "function" === typeof e.getRootNode ? e.getRootNode() : 9 === e.nodeType ? e : e.ownerDocument;
    }
    var yn = ie.d;
    ie.d = {
      f: fh,
      r: dh,
      D: ph,
      C: gh,
      L: mh,
      m: hh,
      X: vh,
      S: yh,
      M: bh
    };
    function fh() {
      var e = yn.f(), t = au();
      return e || t;
    }
    function dh(e) {
      var t = sl(e);
      null !== t && 5 === t.tag && "form" === t.type ? Z0(t) : yn.r(e);
    }
    var gl = "undefined" === typeof document ? null : document;
    function tg(e, t, n) {
      var a = gl;
      if (a && "string" === typeof t && t) {
        var l = kt(t);
        l = 'link[rel="' + e + '"][href="' + l + '"]';
        "string" === typeof n && (l += '[crossorigin="' + n + '"]');
        gd.has(l) || (gd.add(l), e = { rel: e, crossOrigin: n, href: t }, null === a.querySelector(l) && (t = a.createElement("link"), We(t, "link", e), Ye(t), a.head.appendChild(t)));
      }
    }
    function ph(e) {
      yn.D(e);
      tg("dns-prefetch", e, null);
    }
    function gh(e, t) {
      yn.C(e, t);
      tg("preconnect", e, t);
    }
    function mh(e, t, n) {
      yn.L(e, t, n);
      var a = gl;
      if (a && e && t) {
        var l = 'link[rel="preload"][as="' + kt(t) + '"]';
        "image" === t ? n && n.imageSrcSet ? (l += '[imagesrcset="' + kt(
          n.imageSrcSet
        ) + '"]', "string" === typeof n.imageSizes && (l += '[imagesizes="' + kt(
          n.imageSizes
        ) + '"]')) : l += '[href="' + kt(e) + '"]' : l += '[href="' + kt(e) + '"]';
        var i = l;
        switch (t) {
          case "style":
            i = ul(e);
            break;
          case "script":
            i = ml(e);
        }
        _t.has(i) || (e = ze(
          {
            rel: "preload",
            href: "image" === t && n && n.imageSrcSet ? void 0 : e,
            as: t
          },
          n
        ), _t.set(i, e), null !== a.querySelector(l) || "style" === t && a.querySelector(vi(i)) || "script" === t && a.querySelector(bi(i)) || (t = a.createElement("link"), We(t, "link", e), Ye(t), a.head.appendChild(t)));
      }
    }
    function hh(e, t) {
      yn.m(e, t);
      var n = gl;
      if (n && e) {
        var a = t && "string" === typeof t.as ? t.as : "script", l = 'link[rel="modulepreload"][as="' + kt(a) + '"][href="' + kt(e) + '"]', i = l;
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            i = ml(e);
        }
        if (!_t.has(i) && (e = ze({ rel: "modulepreload", href: e }, t), _t.set(i, e), null === n.querySelector(l))) {
          switch (a) {
            case "audioworklet":
            case "paintworklet":
            case "serviceworker":
            case "sharedworker":
            case "worker":
            case "script":
              if (n.querySelector(bi(i)))
                return;
          }
          a = n.createElement("link");
          We(a, "link", e);
          Ye(a);
          n.head.appendChild(a);
        }
      }
    }
    function yh(e, t, n) {
      yn.S(e, t, n);
      var a = gl;
      if (a && e) {
        var l = Xa(a).hoistableStyles, i = ul(e);
        t = t || "default";
        var u = l.get(i);
        if (!u) {
          var c = { loading: 0, preload: null };
          if (u = a.querySelector(
            vi(i)
          ))
            c.loading = 5;
          else {
            e = ze(
              { rel: "stylesheet", href: e, "data-precedence": t },
              n
            );
            (n = _t.get(i)) && Pr(e, n);
            var r = u = a.createElement("link");
            Ye(r);
            We(r, "link", e);
            r._p = new Promise(function(g, m) {
              r.onload = g;
              r.onerror = m;
            });
            r.addEventListener("load", function() {
              c.loading |= 1;
            });
            r.addEventListener("error", function() {
              c.loading |= 2;
            });
            c.loading |= 4;
            fo(u, t, a);
          }
          u = {
            type: "stylesheet",
            instance: u,
            count: 1,
            state: c
          };
          l.set(i, u);
        }
      }
    }
    function vh(e, t) {
      yn.X(e, t);
      var n = gl;
      if (n && e) {
        var a = Xa(n).hoistableScripts, l = ml(e), i = a.get(l);
        i || (i = n.querySelector(bi(l)), i || (e = ze({ src: e, async: true }, t), (t = _t.get(l)) && es(e, t), i = n.createElement("script"), Ye(i), We(i, "link", e), n.head.appendChild(i)), i = {
          type: "script",
          instance: i,
          count: 1,
          state: null
        }, a.set(l, i));
      }
    }
    function bh(e, t) {
      yn.M(e, t);
      var n = gl;
      if (n && e) {
        var a = Xa(n).hoistableScripts, l = ml(e), i = a.get(l);
        i || (i = n.querySelector(bi(l)), i || (e = ze({ src: e, async: true, type: "module" }, t), (t = _t.get(l)) && es(e, t), i = n.createElement("script"), Ye(i), We(i, "link", e), n.head.appendChild(i)), i = {
          type: "script",
          instance: i,
          count: 1,
          state: null
        }, a.set(l, i));
      }
    }
    function md(e, t, n, a) {
      var l = (l = Un.current) ? Lo(l) : null;
      if (!l) throw Error(A(446));
      switch (e) {
        case "meta":
        case "title":
          return null;
        case "style":
          return "string" === typeof n.precedence && "string" === typeof n.href ? (t = ul(n.href), n = Xa(
            l
          ).hoistableStyles, a = n.get(t), a || (a = {
            type: "style",
            instance: null,
            count: 0,
            state: null
          }, n.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
        case "link":
          if ("stylesheet" === n.rel && "string" === typeof n.href && "string" === typeof n.precedence) {
            e = ul(n.href);
            var i = Xa(
              l
            ).hoistableStyles, u = i.get(e);
            u || (l = l.ownerDocument || l, u = {
              type: "stylesheet",
              instance: null,
              count: 0,
              state: { loading: 0, preload: null }
            }, i.set(e, u), (i = l.querySelector(
              vi(e)
            )) && !i._p && (u.instance = i, u.state.loading = 5), _t.has(e) || (n = {
              rel: "preload",
              as: "style",
              href: n.href,
              crossOrigin: n.crossOrigin,
              integrity: n.integrity,
              media: n.media,
              hrefLang: n.hrefLang,
              referrerPolicy: n.referrerPolicy
            }, _t.set(e, n), i || xh(
              l,
              e,
              n,
              u.state
            )));
            if (t && null === a)
              throw Error(A(528, ""));
            return u;
          }
          if (t && null !== a)
            throw Error(A(529, ""));
          return null;
        case "script":
          return t = n.async, n = n.src, "string" === typeof n && t && "function" !== typeof t && "symbol" !== typeof t ? (t = ml(n), n = Xa(
            l
          ).hoistableScripts, a = n.get(t), a || (a = {
            type: "script",
            instance: null,
            count: 0,
            state: null
          }, n.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
        default:
          throw Error(A(444, e));
      }
    }
    function ul(e) {
      return 'href="' + kt(e) + '"';
    }
    function vi(e) {
      return 'link[rel="stylesheet"][' + e + "]";
    }
    function ng(e) {
      return ze({}, e, {
        "data-precedence": e.precedence,
        precedence: null
      });
    }
    function xh(e, t, n, a) {
      e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? a.loading = 1 : (t = e.createElement("link"), a.preload = t, t.addEventListener("load", function() {
        return a.loading |= 1;
      }), t.addEventListener("error", function() {
        return a.loading |= 2;
      }), We(t, "link", n), Ye(t), e.head.appendChild(t));
    }
    function ml(e) {
      return '[src="' + kt(e) + '"]';
    }
    function bi(e) {
      return "script[async]" + e;
    }
    function hd(e, t, n) {
      t.count++;
      if (null === t.instance)
        switch (t.type) {
          case "style":
            var a = e.querySelector(
              'style[data-href~="' + kt(n.href) + '"]'
            );
            if (a)
              return t.instance = a, Ye(a), a;
            var l = ze({}, n, {
              "data-href": n.href,
              "data-precedence": n.precedence,
              href: null,
              precedence: null
            });
            a = (e.ownerDocument || e).createElement(
              "style"
            );
            Ye(a);
            We(a, "style", l);
            fo(a, n.precedence, e);
            return t.instance = a;
          case "stylesheet":
            l = ul(n.href);
            var i = e.querySelector(
              vi(l)
            );
            if (i)
              return t.state.loading |= 4, t.instance = i, Ye(i), i;
            a = ng(n);
            (l = _t.get(l)) && Pr(a, l);
            i = (e.ownerDocument || e).createElement("link");
            Ye(i);
            var u = i;
            u._p = new Promise(function(c, r) {
              u.onload = c;
              u.onerror = r;
            });
            We(i, "link", a);
            t.state.loading |= 4;
            fo(i, n.precedence, e);
            return t.instance = i;
          case "script":
            i = ml(n.src);
            if (l = e.querySelector(
              bi(i)
            ))
              return t.instance = l, Ye(l), l;
            a = n;
            if (l = _t.get(i))
              a = ze({}, n), es(a, l);
            e = e.ownerDocument || e;
            l = e.createElement("script");
            Ye(l);
            We(l, "link", a);
            e.head.appendChild(l);
            return t.instance = l;
          case "void":
            return null;
          default:
            throw Error(A(443, t.type));
        }
      else
        "stylesheet" === t.type && 0 === (t.state.loading & 4) && (a = t.instance, t.state.loading |= 4, fo(a, n.precedence, e));
      return t.instance;
    }
    function fo(e, t, n) {
      for (var a = n.querySelectorAll(
        'link[rel="stylesheet"][data-precedence],style[data-precedence]'
      ), l = a.length ? a[a.length - 1] : null, i = l, u = 0; u < a.length; u++) {
        var c = a[u];
        if (c.dataset.precedence === t) i = c;
        else if (i !== l) break;
      }
      i ? i.parentNode.insertBefore(e, i.nextSibling) : (t = 9 === n.nodeType ? n.head : n, t.insertBefore(e, t.firstChild));
    }
    function Pr(e, t) {
      null == e.crossOrigin && (e.crossOrigin = t.crossOrigin);
      null == e.referrerPolicy && (e.referrerPolicy = t.referrerPolicy);
      null == e.title && (e.title = t.title);
    }
    function es(e, t) {
      null == e.crossOrigin && (e.crossOrigin = t.crossOrigin);
      null == e.referrerPolicy && (e.referrerPolicy = t.referrerPolicy);
      null == e.integrity && (e.integrity = t.integrity);
    }
    var po = null;
    function yd(e, t, n) {
      if (null === po) {
        var a = /* @__PURE__ */ new Map();
        var l = po = /* @__PURE__ */ new Map();
        l.set(n, a);
      } else
        l = po, a = l.get(n), a || (a = /* @__PURE__ */ new Map(), l.set(n, a));
      if (a.has(e)) return a;
      a.set(e, null);
      n = n.getElementsByTagName(e);
      for (l = 0; l < n.length; l++) {
        var i = n[l];
        if (!(i[di] || i[Ze] || "link" === e && "stylesheet" === i.getAttribute("rel")) && "http://www.w3.org/2000/svg" !== i.namespaceURI) {
          var u = i.getAttribute(t) || "";
          u = e + u;
          var c = a.get(u);
          c ? c.push(i) : a.set(u, [i]);
        }
      }
      return a;
    }
    function vd(e, t, n) {
      e = e.ownerDocument || e;
      e.head.insertBefore(
        n,
        "title" === t ? e.querySelector("head > title") : null
      );
    }
    function Sh(e, t, n) {
      if (1 === n || null != t.itemProp) return false;
      switch (e) {
        case "meta":
        case "title":
          return true;
        case "style":
          if ("string" !== typeof t.precedence || "string" !== typeof t.href || "" === t.href)
            break;
          return true;
        case "link":
          if ("string" !== typeof t.rel || "string" !== typeof t.href || "" === t.href || t.onLoad || t.onError)
            break;
          switch (t.rel) {
            case "stylesheet":
              return e = t.disabled, "string" === typeof t.precedence && null == e;
            default:
              return true;
          }
        case "script":
          if (t.async && "function" !== typeof t.async && "symbol" !== typeof t.async && !t.onLoad && !t.onError && t.src && "string" === typeof t.src)
            return true;
      }
      return false;
    }
    function ag(e) {
      return "stylesheet" === e.type && 0 === (e.state.loading & 3) ? false : true;
    }
    function zh(e, t, n, a) {
      if ("stylesheet" === n.type && ("string" !== typeof a.media || false !== matchMedia(a.media).matches) && 0 === (n.state.loading & 4)) {
        if (null === n.instance) {
          var l = ul(a.href), i = t.querySelector(
            vi(l)
          );
          if (i) {
            t = i._p;
            null !== t && "object" === typeof t && "function" === typeof t.then && (e.count++, e = Go.bind(e), t.then(e, e));
            n.state.loading |= 4;
            n.instance = i;
            Ye(i);
            return;
          }
          i = t.ownerDocument || t;
          a = ng(a);
          (l = _t.get(l)) && Pr(a, l);
          i = i.createElement("link");
          Ye(i);
          var u = i;
          u._p = new Promise(function(c, r) {
            u.onload = c;
            u.onerror = r;
          });
          We(i, "link", a);
          n.instance = i;
        }
        null === e.stylesheets && (e.stylesheets = /* @__PURE__ */ new Map());
        e.stylesheets.set(n, t);
        (t = n.state.preload) && 0 === (n.state.loading & 3) && (e.count++, n = Go.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
      }
    }
    var pc = 0;
    function Ah(e, t) {
      e.stylesheets && 0 === e.count && go(e, e.stylesheets);
      return 0 < e.count || 0 < e.imgCount ? function(n) {
        var a = setTimeout(function() {
          e.stylesheets && go(e, e.stylesheets);
          if (e.unsuspend) {
            var i = e.unsuspend;
            e.unsuspend = null;
            i();
          }
        }, 6e4 + t);
        0 < e.imgBytes && 0 === pc && (pc = 62500 * ah());
        var l = setTimeout(
          function() {
            e.waitingForImages = false;
            if (0 === e.count && (e.stylesheets && go(e, e.stylesheets), e.unsuspend)) {
              var i = e.unsuspend;
              e.unsuspend = null;
              i();
            }
          },
          (e.imgBytes > pc ? 50 : 800) + t
        );
        e.unsuspend = n;
        return function() {
          e.unsuspend = null;
          clearTimeout(a);
          clearTimeout(l);
        };
      } : null;
    }
    function Go() {
      this.count--;
      if (0 === this.count && (0 === this.imgCount || !this.waitingForImages)) {
        if (this.stylesheets) go(this, this.stylesheets);
        else if (this.unsuspend) {
          var e = this.unsuspend;
          this.unsuspend = null;
          e();
        }
      }
    }
    var Yo = null;
    function go(e, t) {
      e.stylesheets = null;
      null !== e.unsuspend && (e.count++, Yo = /* @__PURE__ */ new Map(), t.forEach(Eh, e), Yo = null, Go.call(e));
    }
    function Eh(e, t) {
      if (!(t.state.loading & 4)) {
        var n = Yo.get(e);
        if (n) var a = n.get(null);
        else {
          n = /* @__PURE__ */ new Map();
          Yo.set(e, n);
          for (var l = e.querySelectorAll(
            "link[data-precedence],style[data-precedence]"
          ), i = 0; i < l.length; i++) {
            var u = l[i];
            if ("LINK" === u.nodeName || "not all" !== u.getAttribute("media"))
              n.set(u.dataset.precedence, u), a = u;
          }
          a && n.set(null, a);
        }
        l = t.instance;
        u = l.getAttribute("data-precedence");
        i = n.get(u) || a;
        i === a && n.set(null, l);
        n.set(u, l);
        this.count++;
        a = Go.bind(this);
        l.addEventListener("load", a);
        l.addEventListener("error", a);
        i ? i.parentNode.insertBefore(l, i.nextSibling) : (e = 9 === e.nodeType ? e.head : e, e.insertBefore(l, e.firstChild));
        t.state.loading |= 4;
      }
    }
    var ii = {
      $$typeof: on,
      Provider: null,
      Consumer: null,
      _currentValue: aa,
      _currentValue2: aa,
      _threadCount: 0
    };
    function Ch(e, t, n, a, l, i, u, c, r) {
      this.tag = 1;
      this.containerInfo = e;
      this.pingCache = this.current = this.pendingChildren = null;
      this.timeoutHandle = -1;
      this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null;
      this.callbackPriority = 0;
      this.expirationTimes = ju(-1);
      this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
      this.entanglements = ju(0);
      this.hiddenUpdates = ju(null);
      this.identifierPrefix = a;
      this.onUncaughtError = l;
      this.onCaughtError = i;
      this.onRecoverableError = u;
      this.pooledCache = null;
      this.pooledCacheLanes = 0;
      this.formState = r;
      this.incompleteTransitions = /* @__PURE__ */ new Map();
    }
    function lg(e, t, n, a, l, i, u, c, r, g, m, v) {
      e = new Ch(
        e,
        t,
        n,
        u,
        r,
        g,
        m,
        v,
        c
      );
      t = 1;
      true === i && (t |= 24);
      i = pt(3, null, null, t);
      e.current = i;
      i.stateNode = e;
      t = Tr();
      t.refCount++;
      e.pooledCache = t;
      t.refCount++;
      i.memoizedState = {
        element: a,
        isDehydrated: n,
        cache: t
      };
      Nr(i);
      return e;
    }
    function ig(e) {
      if (!e) return Ga;
      e = Ga;
      return e;
    }
    function og(e, t, n, a, l, i) {
      l = ig(l);
      null === a.context ? a.context = l : a.pendingContext = l;
      a = qn(t);
      a.payload = { element: n };
      i = void 0 === i ? null : i;
      null !== i && (a.callback = i);
      n = Hn(e, a, t);
      null !== n && (ut(n, e, t), jl(n, e, t));
    }
    function bd(e, t) {
      e = e.memoizedState;
      if (null !== e && null !== e.dehydrated) {
        var n = e.retryLane;
        e.retryLane = 0 !== n && n < t ? n : t;
      }
    }
    function ts(e, t) {
      bd(e, t);
      (e = e.alternate) && bd(e, t);
    }
    function ug(e) {
      if (13 === e.tag || 31 === e.tag) {
        var t = ha(e, 67108864);
        null !== t && ut(t, e, 67108864);
        ts(e, 67108864);
      }
    }
    function xd(e) {
      if (13 === e.tag || 31 === e.tag) {
        var t = vt();
        t = dr(t);
        var n = ha(e, t);
        null !== n && ut(n, e, t);
        ts(e, t);
      }
    }
    var Vo = true;
    function Th(e, t, n, a) {
      var l = G.T;
      G.T = null;
      var i = ie.p;
      try {
        ie.p = 2, ns(e, t, n, a);
      } finally {
        ie.p = i, G.T = l;
      }
    }
    function kh(e, t, n, a) {
      var l = G.T;
      G.T = null;
      var i = ie.p;
      try {
        ie.p = 8, ns(e, t, n, a);
      } finally {
        ie.p = i, G.T = l;
      }
    }
    function ns(e, t, n, a) {
      if (Vo) {
        var l = ur(a);
        if (null === l)
          fc(
            e,
            t,
            a,
            Fo,
            n
          ), Sd(e, a);
        else if (Nh(
          l,
          e,
          t,
          n,
          a
        ))
          a.stopPropagation();
        else if (Sd(e, a), t & 4 && -1 < Dh.indexOf(e)) {
          for (; null !== l; ) {
            var i = sl(l);
            if (null !== i)
              switch (i.tag) {
                case 3:
                  i = i.stateNode;
                  if (i.current.memoizedState.isDehydrated) {
                    var u = ea(i.pendingLanes);
                    if (0 !== u) {
                      var c = i;
                      c.pendingLanes |= 2;
                      for (c.entangledLanes |= 2; u; ) {
                        var r = 1 << 31 - yt(u);
                        c.entanglements[1] |= r;
                        u &= ~r;
                      }
                      Zt(i);
                      0 === (le & 6) && (Oo = mt() + 500, yi(0, false));
                    }
                  }
                  break;
                case 31:
                case 13:
                  c = ha(i, 2), null !== c && ut(c, i, 2), au(), ts(i, 2);
              }
            i = ur(a);
            null === i && fc(
              e,
              t,
              a,
              Fo,
              n
            );
            if (i === l) break;
            l = i;
          }
          null !== l && a.stopPropagation();
        } else
          fc(
            e,
            t,
            a,
            null,
            n
          );
      }
    }
    function ur(e) {
      e = hr(e);
      return as(e);
    }
    var Fo = null;
    function as(e) {
      Fo = null;
      e = Ua(e);
      if (null !== e) {
        var t = ci(e);
        if (null === t) e = null;
        else {
          var n = t.tag;
          if (13 === n) {
            e = kd(t);
            if (null !== e) return e;
            e = null;
          } else if (31 === n) {
            e = Dd(t);
            if (null !== e) return e;
            e = null;
          } else if (3 === n) {
            if (t.stateNode.current.memoizedState.isDehydrated)
              return 3 === t.tag ? t.stateNode.containerInfo : null;
            e = null;
          } else t !== e && (e = null);
        }
      }
      Fo = e;
      return null;
    }
    function cg(e) {
      switch (e) {
        case "beforetoggle":
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "toggle":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return 2;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return 8;
        case "message":
          switch (m1()) {
            case _d:
              return 2;
            case Od:
              return 8;
            case bo:
            case h1:
              return 32;
            case wd:
              return 268435456;
            default:
              return 32;
          }
        default:
          return 32;
      }
    }
    var cr = false;
    var Gn = null;
    var Yn = null;
    var Vn = null;
    var oi = /* @__PURE__ */ new Map();
    var ui = /* @__PURE__ */ new Map();
    var Nn = [];
    var Dh = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
      " "
    );
    function Sd(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          Gn = null;
          break;
        case "dragenter":
        case "dragleave":
          Yn = null;
          break;
        case "mouseover":
        case "mouseout":
          Vn = null;
          break;
        case "pointerover":
        case "pointerout":
          oi.delete(t.pointerId);
          break;
        case "gotpointercapture":
        case "lostpointercapture":
          ui.delete(t.pointerId);
      }
    }
    function Dl(e, t, n, a, l, i) {
      if (null === e || e.nativeEvent !== i)
        return e = {
          blockedOn: t,
          domEventName: n,
          eventSystemFlags: a,
          nativeEvent: i,
          targetContainers: [l]
        }, null !== t && (t = sl(t), null !== t && ug(t)), e;
      e.eventSystemFlags |= a;
      t = e.targetContainers;
      null !== l && -1 === t.indexOf(l) && t.push(l);
      return e;
    }
    function Nh(e, t, n, a, l) {
      switch (t) {
        case "focusin":
          return Gn = Dl(
            Gn,
            e,
            t,
            n,
            a,
            l
          ), true;
        case "dragenter":
          return Yn = Dl(
            Yn,
            e,
            t,
            n,
            a,
            l
          ), true;
        case "mouseover":
          return Vn = Dl(
            Vn,
            e,
            t,
            n,
            a,
            l
          ), true;
        case "pointerover":
          var i = l.pointerId;
          oi.set(
            i,
            Dl(
              oi.get(i) || null,
              e,
              t,
              n,
              a,
              l
            )
          );
          return true;
        case "gotpointercapture":
          return i = l.pointerId, ui.set(
            i,
            Dl(
              ui.get(i) || null,
              e,
              t,
              n,
              a,
              l
            )
          ), true;
      }
      return false;
    }
    function rg(e) {
      var t = Ua(e.target);
      if (null !== t) {
        var n = ci(t);
        if (null !== n) {
          if (t = n.tag, 13 === t) {
            if (t = kd(n), null !== t) {
              e.blockedOn = t;
              af(e.priority, function() {
                xd(n);
              });
              return;
            }
          } else if (31 === t) {
            if (t = Dd(n), null !== t) {
              e.blockedOn = t;
              af(e.priority, function() {
                xd(n);
              });
              return;
            }
          } else if (3 === t && n.stateNode.current.memoizedState.isDehydrated) {
            e.blockedOn = 3 === n.tag ? n.stateNode.containerInfo : null;
            return;
          }
        }
      }
      e.blockedOn = null;
    }
    function mo(e) {
      if (null !== e.blockedOn) return false;
      for (var t = e.targetContainers; 0 < t.length; ) {
        var n = ur(e.nativeEvent);
        if (null === n) {
          n = e.nativeEvent;
          var a = new n.constructor(
            n.type,
            n
          );
          Tc = a;
          n.target.dispatchEvent(a);
          Tc = null;
        } else
          return t = sl(n), null !== t && ug(t), e.blockedOn = n, false;
        t.shift();
      }
      return true;
    }
    function zd(e, t, n) {
      mo(e) && n.delete(t);
    }
    function Mh() {
      cr = false;
      null !== Gn && mo(Gn) && (Gn = null);
      null !== Yn && mo(Yn) && (Yn = null);
      null !== Vn && mo(Vn) && (Vn = null);
      oi.forEach(zd);
      ui.forEach(zd);
    }
    function Ii(e, t) {
      e.blockedOn === t && (e.blockedOn = null, cr || (cr = true, je.unstable_scheduleCallback(
        je.unstable_NormalPriority,
        Mh
      )));
    }
    var Pi = null;
    function Ad(e) {
      Pi !== e && (Pi = e, je.unstable_scheduleCallback(
        je.unstable_NormalPriority,
        function() {
          Pi === e && (Pi = null);
          for (var t = 0; t < e.length; t += 3) {
            var n = e[t], a = e[t + 1], l = e[t + 2];
            if ("function" !== typeof a)
              if (null === as(a || n))
                continue;
              else break;
            var i = sl(n);
            null !== i && (e.splice(t, 3), t -= 3, Yc(
              i,
              {
                pending: true,
                data: l,
                method: n.method,
                action: a
              },
              a,
              l
            ));
          }
        }
      ));
    }
    function cl(e) {
      function t(r) {
        return Ii(r, e);
      }
      null !== Gn && Ii(Gn, e);
      null !== Yn && Ii(Yn, e);
      null !== Vn && Ii(Vn, e);
      oi.forEach(t);
      ui.forEach(t);
      for (var n = 0; n < Nn.length; n++) {
        var a = Nn[n];
        a.blockedOn === e && (a.blockedOn = null);
      }
      for (; 0 < Nn.length && (n = Nn[0], null === n.blockedOn); )
        rg(n), null === n.blockedOn && Nn.shift();
      n = (e.ownerDocument || e).$$reactFormReplay;
      if (null != n)
        for (a = 0; a < n.length; a += 3) {
          var l = n[a], i = n[a + 1], u = l[ct] || null;
          if ("function" === typeof i)
            u || Ad(n);
          else if (u) {
            var c = null;
            if (i && i.hasAttribute("formAction"))
              if (l = i, u = i[ct] || null)
                c = u.formAction;
              else {
                if (null !== as(l)) continue;
              }
            else c = u.action;
            "function" === typeof c ? n[a + 1] = c : (n.splice(a, 3), a -= 3);
            Ad(n);
          }
        }
    }
    function sg() {
      function e(i) {
        i.canIntercept && "react-transition" === i.info && i.intercept({
          handler: function() {
            return new Promise(function(u) {
              return l = u;
            });
          },
          focusReset: "manual",
          scroll: "manual"
        });
      }
      function t() {
        null !== l && (l(), l = null);
        a || setTimeout(n, 20);
      }
      function n() {
        if (!a && !navigation.transition) {
          var i = navigation.currentEntry;
          i && null != i.url && navigation.navigate(i.url, {
            state: i.getState(),
            info: "react-transition",
            history: "replace"
          });
        }
      }
      if ("object" === typeof navigation) {
        var a = false, l = null;
        navigation.addEventListener("navigate", e);
        navigation.addEventListener("navigatesuccess", t);
        navigation.addEventListener("navigateerror", t);
        setTimeout(n, 100);
        return function() {
          a = true;
          navigation.removeEventListener("navigate", e);
          navigation.removeEventListener("navigatesuccess", t);
          navigation.removeEventListener("navigateerror", t);
          null !== l && (l(), l = null);
        };
      }
    }
    function ls(e) {
      this._internalRoot = e;
    }
    ou.prototype.render = ls.prototype.render = function(e) {
      var t = this._internalRoot;
      if (null === t) throw Error(A(409));
      var n = t.current, a = vt();
      og(n, a, e, t, null, null);
    };
    ou.prototype.unmount = ls.prototype.unmount = function() {
      var e = this._internalRoot;
      if (null !== e) {
        this._internalRoot = null;
        var t = e.containerInfo;
        og(e.current, 2, null, e, null, null);
        au();
        t[rl] = null;
      }
    };
    function ou(e) {
      this._internalRoot = e;
    }
    ou.prototype.unstable_scheduleHydration = function(e) {
      if (e) {
        var t = jd();
        e = { blockedOn: null, target: e, priority: t };
        for (var n = 0; n < Nn.length && 0 !== t && t < Nn[n].priority; n++) ;
        Nn.splice(n, 0, e);
        0 === n && rg(e);
      }
    };
    var Ed = Cd.version;
    if ("19.2.5" !== Ed)
      throw Error(
        A(
          527,
          Ed,
          "19.2.5"
        )
      );
    ie.findDOMNode = function(e) {
      var t = e._reactInternals;
      if (void 0 === t) {
        if ("function" === typeof e.render)
          throw Error(A(188));
        e = Object.keys(e).join(",");
        throw Error(A(268, e));
      }
      e = c1(t);
      e = null !== e ? Nd(e) : null;
      e = null === e ? null : e.stateNode;
      return e;
    };
    var Rh = {
      bundleType: 0,
      version: "19.2.5",
      rendererPackageName: "react-dom",
      currentDispatcherRef: G,
      reconcilerVersion: "19.2.5"
    };
    if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
      Nl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!Nl.isDisabled && Nl.supportsFiber)
        try {
          ri = Nl.inject(
            Rh
          ), ht = Nl;
        } catch (e) {
        }
    }
    var Nl;
    uu.createRoot = function(e, t) {
      if (!Td(e)) throw Error(A(299));
      var n = false, a = "", l = tp, i = np, u = ap;
      null !== t && void 0 !== t && (true === t.unstable_strictMode && (n = true), void 0 !== t.identifierPrefix && (a = t.identifierPrefix), void 0 !== t.onUncaughtError && (l = t.onUncaughtError), void 0 !== t.onCaughtError && (i = t.onCaughtError), void 0 !== t.onRecoverableError && (u = t.onRecoverableError));
      t = lg(
        e,
        1,
        false,
        null,
        null,
        n,
        a,
        null,
        l,
        i,
        u,
        sg
      );
      e[rl] = t.current;
      Ir(e);
      return new ls(t);
    };
    uu.hydrateRoot = function(e, t, n) {
      if (!Td(e)) throw Error(A(299));
      var a = false, l = "", i = tp, u = np, c = ap, r = null;
      null !== n && void 0 !== n && (true === n.unstable_strictMode && (a = true), void 0 !== n.identifierPrefix && (l = n.identifierPrefix), void 0 !== n.onUncaughtError && (i = n.onUncaughtError), void 0 !== n.onCaughtError && (u = n.onCaughtError), void 0 !== n.onRecoverableError && (c = n.onRecoverableError), void 0 !== n.formState && (r = n.formState));
      t = lg(
        e,
        1,
        true,
        t,
        null != n ? n : null,
        a,
        l,
        r,
        i,
        u,
        c,
        sg
      );
      t.context = ig(null);
      n = t.current;
      a = vt();
      a = dr(a);
      l = qn(a);
      l.callback = null;
      Hn(n, l, a);
      n = a;
      t.current.lanes = n;
      fi(t, n);
      Zt(t);
      e[rl] = t.current;
      Ir(e);
      return new ou(t);
    };
    uu.version = "19.2.5";
  });

  // ../../.npm-global/lib/node_modules/react-dom/client.js
  var gg = Lt((yy, pg) => {
    "use strict";
    function dg() {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
        return;
      }
      if (false) {
        throw new Error("^_^");
      }
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(dg);
      } catch (e) {
        console.error(e);
      }
    }
    if (true) {
      dg();
      pg.exports = fg();
    } else {
      pg.exports = null;
    }
  });

  // ../../.npm-global/lib/node_modules/react/cjs/react-jsx-runtime.production.js
  var hg = Lt((cu) => {
    "use strict";
    var _h = /* @__PURE__ */ Symbol.for("react.transitional.element");
    var Oh = /* @__PURE__ */ Symbol.for("react.fragment");
    function mg(e, t, n) {
      var a = null;
      void 0 !== n && (a = "" + n);
      void 0 !== t.key && (a = "" + t.key);
      if ("key" in t) {
        n = {};
        for (var l in t)
          "key" !== l && (n[l] = t[l]);
      } else n = t;
      t = n.ref;
      return {
        $$typeof: _h,
        type: e,
        key: a,
        ref: void 0 !== t ? t : null,
        props: n
      };
    }
    cu.Fragment = Oh;
    cu.jsx = mg;
    cu.jsxs = mg;
  });

  // ../../.npm-global/lib/node_modules/react/jsx-runtime.js
  var xi = Lt((by, yg) => {
    "use strict";
    if (true) {
      yg.exports = hg();
    } else {
      yg.exports = null;
    }
  });

  // entry.jsx
  var Eg = Aa(gg());

  // AlerteApp.jsx
  var S = Aa(wi());
  var o = Aa(xi());
  var s = {
    orange: "#F97316",
    orangeL: "#FFF7ED",
    orangeD: "#C2410C",
    green: "#16A34A",
    greenL: "#F0FDF4",
    white: "#FFFFFF",
    off: "#FAFAF9",
    surf: "#F5F5F4",
    surfH: "#E7E5E4",
    ink: "#1C1917",
    muted: "#78716C",
    faint: "#A8A29E",
    border: "rgba(0,0,0,0.07)"
  };
  var Sg = ["Yopougon", "Cocody", "Abobo", "Adjam\xE9", "Plateau", "Marcory", "Treichville", "Port-Bou\xEBt", "Koumassi", "Att\xE9coub\xE9", "Songon", "Anyama", "Bouak\xE9", "Daloa", "San-P\xE9dro", "Yamoussoukro", "Korhogo", "Man", "Abengourou", "Divo", "Gagnoa", "Odienn\xE9", "Bondoukou", "S\xE9gu\xE9la", "Duekou\xE9", "Touba", "Ferkess\xE9dougou", "Bouna", "Agboville", "Sassandra", "Grand-Bassam", "Aboisso", "Soubr\xE9", "Guiglo", "Issia", "Sinfra", "Dimbokro", "Bangolo", "Vavoua", "Bongouanou", "Ti\xE9bissou", "Zu\xE9noula", "Boundiali", "Danan\xE9", "Lakota", "Grand-Lahou", "Jacqueville", "Adzop\xE9", "Agnibil\xE9krou", "Akoup\xE9", "Bocanda", "Daoukro", "Guitry", "Katiola", "Mankono", "M\xE9agui", "Oum\xE9", "Tabou", "Tingrela"];
  var wh = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800&display=swap');
@font-face{font-family:'Plus Jakarta Sans';font-style:normal;font-weight:700 800;font-display:swap;src:local('Plus Jakarta Sans')}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--eo:cubic-bezier(0.25,0.46,0.45,0.94);--eio:cubic-bezier(0.77,0,0.175,1);--esp:cubic-bezier(0.34,1.56,0.64,1);--or:#F97316;--gr:#16A34A}
body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:#F5F5F4;min-height:100vh;min-height:100dvh;display:flex;align-items:flex-start;justify-content:center;padding:0}
.shell{width:100%;max-width:430px;min-height:100vh;min-height:100dvh;background:#FAFAF9;border-radius:0;overflow:hidden;box-shadow:none;display:flex;flex-direction:column;position:relative}
@media(min-width:480px){body{padding:2rem 1rem;background:#E5E7EB}
.shell{border-radius:40px;min-height:auto;box-shadow:0 32px 80px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.06)}
}
@media(max-width:380px){.scrttl{font-size:17px!important}
.user-name{font-size:18px!important}
.grid{grid-template-columns:1fr 1fr!important}
.qa{grid-template-columns:repeat(2,1fr)!important}
}
.sbar{display:flex;align-items:center;justify-content:space-between;padding:14px 28px 0;font-size:12px;font-weight:600;color:#1C1917}
.scr{display:none;flex:1;flex-direction:column;opacity:0;transform:translateX(20px);transition:opacity 280ms var(--eo),transform 280ms var(--eo)}
.scr.on{display:flex;opacity:1;transform:translateX(0)}
.splash{background:linear-gradient(160deg,#1C1917 0%,#292524 60%,#1C1917 100%);min-height:100vh;align-items:center;justify-content:center;flex-direction:column;padding:3rem 2rem}
.orb{width:120px;height:120px;border-radius:50%;background:conic-gradient(from 0deg,#F97316,#16A34A,#fff,#F97316);display:flex;align-items:center;justify-content:center;position:relative;animation:spin 8s linear infinite;margin-bottom:2rem}
.orb::after{content:'';position:absolute;inset:3px;border-radius:50%;background:#1C1917}
.orb-txt{position:relative;z-index:1;font-family:'Sora',sans-serif;font-size:28px;font-weight:800;color:#fff;letter-spacing:-1px}
@keyframes spin{to{transform:rotate(360deg)}
}
.stitle{font-family:'Sora',sans-serif;font-size:38px;font-weight:800;color:#fff;letter-spacing:-2px;text-align:center;line-height:1;margin-bottom:.5rem}
.stitle span{color:var(--or)}
.stag{font-size:15px;color:rgba(255,255,255,.5);text-align:center;margin-bottom:3rem}
.flag{display:flex;gap:5px;margin-bottom:3rem}
.fs{width:28px;height:6px;border-radius:3px}
.btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:16px 24px;border-radius:16px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;border:none;transition:transform 140ms var(--eo),box-shadow 140ms var(--eo),background 180ms ease;-webkit-tap-highlight-color:transparent;width:100%;letter-spacing:.2px}
.btn:active{transform:scale(.97)}
@media(hover:hover)and(pointer:fine){.btn:hover{transform:translateY(-1px)}
}
.btn-p{background:var(--or);color:#fff;box-shadow:0 8px 24px rgba(249,115,22,.35)}
.btn-s{background:rgba(255,255,255,.08);color:rgba(255,255,255,.85);border:1px solid rgba(255,255,255,.12)}
.btn-g{background:#F5F5F4;color:#1C1917}
.btn-gr{background:var(--gr);color:#fff;box-shadow:0 8px 24px rgba(22,163,74,.3)}
.btn-pu{background:#7C3AED;color:#fff;box-shadow:0 8px 24px rgba(124,58,237,.3)}
.bnav{display:flex;background:rgba(255,255,255,.95);backdrop-filter:blur(12px);border-top:1px solid rgba(0,0,0,.07);padding:10px 8px 18px;gap:4px;position:sticky;bottom:0}
.ni{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 4px;border-radius:14px;cursor:pointer;border:none;background:transparent;transition:background 180ms ease,transform 140ms var(--eo);-webkit-tap-highlight-color:transparent}
.ni:active{transform:scale(.93)}
.ni.a{background:#FFF7ED}
.ni.a .nlb{color:var(--or)}
.nlb{font-size:10px;font-weight:600;color:#A8A29E;transition:color 180ms ease}
.hdr{padding:24px 24px 0;display:flex;align-items:center;justify-content:space-between}
.av{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--or),#FB923C);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;color:#fff;border:none;cursor:pointer;transition:transform 140ms var(--esp)}
.av:active{transform:scale(.9)}
.bnr{margin:20px 20px 0;background:linear-gradient(135deg,#1C1917 0%,#292524 100%);border-radius:24px;padding:20px;position:relative;overflow:hidden}
.bnr::before{content:'';position:absolute;top:-30px;right:-20px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,rgba(249,115,22,.25) 0%,transparent 70%)}
.bl{font-size:11px;font-weight:700;color:var(--or);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px}
.bt{font-family:'Sora',sans-serif;font-size:18px;font-weight:800;color:#fff;letter-spacing:-.5px}
.bd{font-size:12px;color:rgba(255,255,255,.5);margin-top:4px;margin-bottom:14px;line-height:1.5}
.sbb{display:inline-flex;align-items:center;gap:6px;background:var(--or);color:#fff;font-size:13px;font-weight:700;padding:10px 18px;border-radius:12px;border:none;cursor:pointer;transition:transform 140ms var(--eo),box-shadow 140ms ease;box-shadow:0 4px 16px rgba(249,115,22,.4);font-family:'Plus Jakarta Sans',sans-serif}
.sbb:active{transform:scale(.96)}
.sh{padding:20px 24px 10px;display:flex;align-items:center;justify-content:space-between}
.stl{font-size:15px;font-weight:700;color:#1C1917}
.sea{font-size:12px;font-weight:600;color:var(--or);background:none;border:none;cursor:pointer}
.grid{padding:0 20px;display:grid;grid-template-columns:1fr 1fr;gap:12px}
.fc{border-radius:22px;padding:18px 16px;cursor:pointer;border:none;text-align:left;transition:transform 180ms var(--eo),box-shadow 180ms ease;position:relative;overflow:hidden;-webkit-tap-highlight-color:transparent}
.fc:active{transform:scale(.96)}
@media(hover:hover)and(pointer:fine){.fc:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.12)}
}
.fc.or{background:linear-gradient(145deg,#FFF7ED,#FFEDD5)}
.fc.gn{background:linear-gradient(145deg,#F0FDF4,#DCFCE7)}
.fc.dk{background:linear-gradient(145deg,#1C1917,#292524);grid-column:span 2;display:flex;align-items:center;gap:16px}
.fc.wh{background:#fff;border:1px solid rgba(0,0,0,.07)}
.icw{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:12px;flex-shrink:0}
.icw.or-bg{background:rgba(249,115,22,.15)}
.icw.gn-bg{background:rgba(22,163,74,.15)}
.icw.wh-bg{background:rgba(255,255,255,.12)}
.icw.sf-bg{background:#F5F5F4}
.icw.pu-bg{background:rgba(124,58,237,.15)}
.cn{font-size:13px;font-weight:700;color:#1C1917;margin-bottom:4px;line-height:1.2}
.cn.lt{color:#fff}
.cs{font-size:11px;color:#78716C;line-height:1.4}
.cs.lt{color:rgba(255,255,255,.5)}
.bg{display:inline-flex;align-items:center;font-size:10px;font-weight:700;padding:3px 8px;border-radius:8px;margin-bottom:8px;letter-spacing:.5px}
.bg-or{background:rgba(249,115,22,.12);color:var(--or)}
.bg-gn{background:rgba(22,163,74,.12);color:var(--gr)}
.bg-wh{background:rgba(255,255,255,.1);color:rgba(255,255,255,.8)}
.bg-pu{background:rgba(124,58,237,.12);color:#7C3AED}
.qa{padding:0 20px;display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.qb{display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 8px;border-radius:18px;background:#fff;border:1px solid rgba(0,0,0,.07);cursor:pointer;transition:transform 140ms var(--eo),box-shadow 140ms ease;-webkit-tap-highlight-color:transparent}
.qb:active{transform:scale(.93)}
@media(hover:hover)and(pointer:fine){.qb:hover{box-shadow:0 6px 20px rgba(0,0,0,.08);transform:translateY(-2px)}
}
.ql{font-size:10px;font-weight:700;color:#78716C;text-align:center;line-height:1.3}
.scrhdr{display:flex;align-items:center;gap:12px;padding:20px 24px 16px}
.bk{width:38px;height:38px;border-radius:12px;background:#F5F5F4;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform 140ms var(--eo);-webkit-tap-highlight-color:transparent}
.bk:active{transform:scale(.9)}
.scrttl{font-family:'Sora',sans-serif;font-size:20px;font-weight:800;color:#1C1917;letter-spacing:-.5px}
.vhero{margin:0 20px 20px;background:linear-gradient(145deg,#7C2D12,#9A3412);border-radius:28px;padding:28px 24px;position:relative;overflow:hidden;text-align:center}
.vhero::before{content:'';position:absolute;top:-40px;left:50%;transform:translateX(-50%);width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(249,115,22,.2) 0%,transparent 70%)}
.pr{width:100px;height:100px;border-radius:50%;background:rgba(249,115,22,.15);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;position:relative}
.pr::before,.pr::after{content:'';position:absolute;inset:-10px;border-radius:50%;border:2px solid rgba(249,115,22,.3);animation:po 2s ease-out infinite}
.pr::after{animation-delay:.7s;inset:-20px;border-color:rgba(249,115,22,.15)}
@keyframes po{0%{transform:scale(.9);opacity:1}
100%{transform:scale(1.3);opacity:0}
}
.pi{width:64px;height:64px;border-radius:50%;background:var(--or);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(249,115,22,.5)}
.hl{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:6px}
.ht{font-family:'Sora',sans-serif;font-size:22px;font-weight:800;color:#fff;letter-spacing:-.5px;margin-bottom:6px}
.hd{font-size:12px;color:rgba(255,255,255,.5);line-height:1.5}
.cl{padding:0 20px;display:flex;flex-direction:column;gap:8px}
.ci{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:18px;padding:14px 16px;cursor:pointer;transition:transform 140ms var(--eo);-webkit-tap-highlight-color:transparent}
.ci:active{transform:scale(.98)}
.cav{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;color:#fff;flex-shrink:0}
.cst{margin-left:auto;display:flex;align-items:center;gap:4px}
.sd{width:7px;height:7px;border-radius:50%;background:var(--gr);animation:bk 2s ease infinite}
@keyframes bk{0%,100%{opacity:1}
50%{opacity:.4}
}
@keyframes shk{0%,100%{transform:translateX(0)}
20%{transform:translateX(-8px)}
40%{transform:translateX(8px)}
60%{transform:translateX(-6px)}
80%{transform:translateX(6px)}
}
.trg{padding:20px}
.tb{width:100%;padding:18px;background:linear-gradient(135deg,#EF4444,#DC2626);border:none;border-radius:20px;font-family:'Sora',sans-serif;font-size:17px;font-weight:800;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 8px 28px rgba(239,68,68,.4);transition:transform 200ms var(--esp),box-shadow 200ms ease;-webkit-tap-highlight-color:transparent}
.tb:active{transform:scale(.96);box-shadow:0 4px 16px rgba(239,68,68,.3)}
.ahero{margin:0 20px 20px;background:linear-gradient(145deg,#1E1B4B,#312E81);border-radius:28px;padding:28px 24px;position:relative;overflow:hidden;text-align:center}
.ai{width:72px;height:72px;border-radius:50%;background:#7C3AED;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;box-shadow:0 8px 24px rgba(124,58,237,.5)}
.tgr{display:flex;align-items:center;justify-content:space-between;background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:16px;padding:14px 16px;margin:0 20px 10px}
.tsw{width:48px;height:28px;border-radius:14px;border:none;cursor:pointer;transition:background 200ms ease;position:relative;flex-shrink:0}
.tsw.on{background:var(--gr)}
.tsw.off{background:#E7E5E4}
.tth{position:absolute;top:3px;width:22px;height:22px;border-radius:50%;background:#fff;transition:left 200ms var(--esp);box-shadow:0 2px 6px rgba(0,0,0,.15)}
.tth.on{left:23px}
.tth.off{left:3px}
.sbox{background:#F5F3FF;border:1.5px solid rgba(124,58,237,.2);border-radius:16px;padding:16px;margin-bottom:10px}
.arc{width:calc(100% - 40px);background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:18px;padding:16px;display:flex;align-items:center;gap:14px;margin:0 20px 16px}
.ab{height:6px;border-radius:3px;background:#E7E5E4;margin-top:8px;overflow:hidden}
.af{height:100%;border-radius:3px;background:var(--or);animation:fi 1s var(--eo) .3s backwards}
@keyframes fi{from{width:0}
}
.tl{padding:0 20px;display:flex;flex-direction:column;gap:8px}
.ti{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:16px;padding:14px 16px;cursor:pointer;transition:transform 140ms var(--eo);-webkit-tap-highlight-color:transparent}
.ti:active{transform:scale(.98)}
.tc{width:24px;height:24px;border-radius:8px;border:2px solid #E7E5E4;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:border-color 180ms ease,background 180ms ease}
.tc.dn{background:var(--gr);border-color:var(--gr)}
.tt{font-size:14px;font-weight:600;color:#1C1917;flex:1}
.tt.dn{text-decoration:line-through;color:#A8A29E}
.ttm{font-size:11px;font-weight:700;color:var(--or);background:#FFF7ED;padding:3px 8px;border-radius:8px}
.atb{margin:12px 20px 0;padding:16px;background:#F5F5F4;border:1.5px dashed #E7E5E4;border-radius:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-size:14px;font-weight:600;color:#78716C;transition:background 180ms ease,border-color 180ms ease;-webkit-tap-highlight-color:transparent;font-family:'Plus Jakarta Sans',sans-serif}
.atb:hover{background:#FFEDD5;border-color:var(--or);color:var(--or)}
.wahero{margin:0 20px 16px;background:linear-gradient(145deg,#064E3B,#065F46);border-radius:24px;padding:20px}
.wai{width:48px;height:48px;border-radius:16px;background:#25D366;display:flex;align-items:center;justify-content:center}
.qal{padding:0 20px;display:flex;flex-direction:column;gap:8px}
.qai{background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:16px;overflow:hidden}
.qaq{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;cursor:pointer}
.qach{font-size:12px;color:#A8A29E;transition:transform 200ms ease}
.qach.op{transform:rotate(180deg)}
.qaa{font-size:13px;color:#78716C;padding:0 16px 14px;line-height:1.5}
.inf{padding:0 20px;display:flex;flex-direction:column;gap:10px}
.ic{border-radius:22px;padding:18px;cursor:pointer;transition:transform 180ms var(--eo),box-shadow 180ms ease;-webkit-tap-highlight-color:transparent;border:none;text-align:left;width:100%}
.ic:active{transform:scale(.97)}
.icr{display:flex;align-items:center;gap:12px;margin-bottom:10px}
.ici{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ic.mt{background:#EFF6FF;color:#1D4ED8}
.ic.ef{background:#FFF7ED;color:#C2410C}
.ic.in{background:#FFF1F2;color:#BE123C}
.rpt{padding:0 20px;display:flex;flex-direction:column;gap:10px}
.mu{display:flex;gap:8px}
.mb{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;background:#F5F5F4;border:1.5px dashed #E7E5E4;border-radius:14px;cursor:pointer;transition:background 180ms ease,border-color 180ms ease;font-family:'Plus Jakarta Sans',sans-serif}
.mb:hover{background:#FFF7ED;border-color:var(--or)}
.mb span{font-size:11px;font-weight:600;color:#78716C}
.lb{display:flex;align-items:center;gap:8px;background:#ECFDF5;border:1px solid rgba(22,163,74,.2);border-radius:12px;padding:12px 14px}
.isc{flex:1;overflow-y:auto;padding:0 20px}
.isc::-webkit-scrollbar{display:none}
.fst{font-size:12px;font-weight:700;color:#78716C;letter-spacing:.8px;text-transform:uppercase;margin:20px 0 10px}
.ig{display:flex;flex-direction:column;gap:10px;margin-bottom:4px}
.if{display:flex;align-items:center;gap:10px;background:#fff;border:1.5px solid rgba(0,0,0,.07);border-radius:14px;padding:14px 16px;transition:border-color 180ms ease,box-shadow 180ms ease}
.if:focus-within{border-color:var(--or);box-shadow:0 0 0 3px rgba(249,115,22,.1)}
.if input,.if textarea,.if select{flex:1;border:none;outline:none;background:transparent;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:500;color:#1C1917;resize:none;appearance:none}
.if input::placeholder,.if textarea::placeholder{color:#A8A29E}
.ps{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px}
.po{border:2px solid rgba(0,0,0,.07);border-radius:18px;padding:14px;cursor:pointer;transition:border-color 200ms ease,background 200ms ease,transform 140ms var(--eo);background:#fff;text-align:center;-webkit-tap-highlight-color:transparent;font-family:'Plus Jakarta Sans',sans-serif}
.po:active{transform:scale(.97)}
.po.sel{border-color:var(--or);background:#FFF7ED}
.po.sel-g{border-color:var(--gr);background:#F0FDF4}
.cgu{flex:1;overflow-y:auto;padding:0 20px 20px}
.cgu::-webkit-scrollbar{display:none}
.pm{padding:0 20px;display:flex;flex-direction:column;gap:8px}
.pmi{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:14px;padding:14px 16px;cursor:pointer;transition:background 140ms ease;-webkit-tap-highlight-color:transparent;font-family:'Plus Jakarta Sans',sans-serif}
.pmi:active{background:#F5F5F4}
.scrl{flex:1;overflow-y:auto;padding-bottom:8px}
.scrl::-webkit-scrollbar{display:none}
.si{opacity:0;transform:translateY(12px);animation:stin 320ms var(--eo) forwards}
@keyframes stin{to{opacity:1;transform:translateY(0)}
}
@keyframes pulse-bar{from{transform:scaleY(.4)}
to{transform:scaleY(1.4)}
}

`;
  var _ = ({ n: e, s: t = 20, c: n = "currentColor", w: a = 2 }) => {
    const l = {
      shield: /* @__PURE__ */ (0, o.jsx)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, o.jsx)("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }) }),
      calendar: /* @__PURE__ */ (0, o.jsxs)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ (0, o.jsx)("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2" }),
        /* @__PURE__ */ (0, o.jsx)("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
        /* @__PURE__ */ (0, o.jsx)("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
        /* @__PURE__ */ (0, o.jsx)("line", { x1: "3", y1: "10", x2: "21", y2: "10" })
      ] }),
      phone: /* @__PURE__ */ (0, o.jsx)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, o.jsx)("path", { d: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" }) }),
      bell: /* @__PURE__ */ (0, o.jsxs)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ (0, o.jsx)("path", { d: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" }),
        /* @__PURE__ */ (0, o.jsx)("path", { d: "M13.73 21a2 2 0 01-3.46 0" })
      ] }),
      home: /* @__PURE__ */ (0, o.jsxs)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ (0, o.jsx)("path", { d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" }),
        /* @__PURE__ */ (0, o.jsx)("polyline", { points: "9,22 9,12 15,12 15,22" })
      ] }),
      user: /* @__PURE__ */ (0, o.jsxs)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ (0, o.jsx)("path", { d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" }),
        /* @__PURE__ */ (0, o.jsx)("circle", { cx: "12", cy: "7", r: "4" })
      ] }),
      alert: /* @__PURE__ */ (0, o.jsxs)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ (0, o.jsx)("path", { d: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" }),
        /* @__PURE__ */ (0, o.jsx)("line", { x1: "12", y1: "9", x2: "12", y2: "13" }),
        /* @__PURE__ */ (0, o.jsx)("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })
      ] }),
      lock: /* @__PURE__ */ (0, o.jsxs)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ (0, o.jsx)("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2" }),
        /* @__PURE__ */ (0, o.jsx)("path", { d: "M7 11V7a5 5 0 0110 0v4" })
      ] }),
      mic: /* @__PURE__ */ (0, o.jsxs)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ (0, o.jsx)("path", { d: "M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" }),
        /* @__PURE__ */ (0, o.jsx)("path", { d: "M19 10v2a7 7 0 01-14 0v-2" }),
        /* @__PURE__ */ (0, o.jsx)("line", { x1: "12", y1: "19", x2: "12", y2: "23" }),
        /* @__PURE__ */ (0, o.jsx)("line", { x1: "8", y1: "23", x2: "16", y2: "23" })
      ] }),
      cloud: /* @__PURE__ */ (0, o.jsx)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, o.jsx)("path", { d: "M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" }) }),
      building: /* @__PURE__ */ (0, o.jsxs)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ (0, o.jsx)("rect", { x: "1", y: "3", width: "15", height: "18" }),
        /* @__PURE__ */ (0, o.jsx)("path", { d: "M16 8h4l3 3v10h-7V8z" }),
        /* @__PURE__ */ (0, o.jsx)("line", { x1: "5", y1: "8", x2: "5.01", y2: "8" }),
        /* @__PURE__ */ (0, o.jsx)("line", { x1: "10", y1: "8", x2: "10.01", y2: "8" })
      ] }),
      fire: /* @__PURE__ */ (0, o.jsx)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, o.jsx)("path", { d: "M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-7 7 7 7 0 01-4.5-12.5" }) }),
      plus: /* @__PURE__ */ (0, o.jsxs)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ (0, o.jsx)("line", { x1: "12", y1: "5", x2: "12", y2: "19" }),
        /* @__PURE__ */ (0, o.jsx)("line", { x1: "5", y1: "12", x2: "19", y2: "12" })
      ] }),
      check: /* @__PURE__ */ (0, o.jsx)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a + 0.5, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, o.jsx)("polyline", { points: "20,6 9,17 4,12" }) }),
      arrow: /* @__PURE__ */ (0, o.jsxs)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ (0, o.jsx)("line", { x1: "5", y1: "12", x2: "19", y2: "12" }),
        /* @__PURE__ */ (0, o.jsx)("polyline", { points: "12,5 19,12 12,19" })
      ] }),
      back: /* @__PURE__ */ (0, o.jsx)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, o.jsx)("polyline", { points: "15,18 9,12 15,6" }) }),
      mail: /* @__PURE__ */ (0, o.jsxs)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ (0, o.jsx)("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }),
        /* @__PURE__ */ (0, o.jsx)("polyline", { points: "22,6 12,13 2,6" })
      ] }),
      eye: /* @__PURE__ */ (0, o.jsxs)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ (0, o.jsx)("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
        /* @__PURE__ */ (0, o.jsx)("circle", { cx: "12", cy: "12", r: "3" })
      ] }),
      star: /* @__PURE__ */ (0, o.jsx)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, o.jsx)("polygon", { points: "12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" }) }),
      wa: /* @__PURE__ */ (0, o.jsxs)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: n, children: [
        /* @__PURE__ */ (0, o.jsx)("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" }),
        /* @__PURE__ */ (0, o.jsx)("path", { d: "M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413A11.815 11.815 0 0012.05 0z" })
      ] }),
      camera: /* @__PURE__ */ (0, o.jsxs)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ (0, o.jsx)("path", { d: "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" }),
        /* @__PURE__ */ (0, o.jsx)("circle", { cx: "12", cy: "13", r: "4" })
      ] }),
      video: /* @__PURE__ */ (0, o.jsxs)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ (0, o.jsx)("polygon", { points: "23,7 16,12 23,17 23,7" }),
        /* @__PURE__ */ (0, o.jsx)("rect", { x: "1", y: "5", width: "15", height: "14", rx: "2" })
      ] }),
      pin: /* @__PURE__ */ (0, o.jsxs)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ (0, o.jsx)("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" }),
        /* @__PURE__ */ (0, o.jsx)("circle", { cx: "12", cy: "10", r: "3" })
      ] }),
      send: /* @__PURE__ */ (0, o.jsxs)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ (0, o.jsx)("line", { x1: "22", y1: "2", x2: "11", y2: "13" }),
        /* @__PURE__ */ (0, o.jsx)("polygon", { points: "22,2 15,22 11,13 2,9 22,2" })
      ] }),
      file: /* @__PURE__ */ (0, o.jsxs)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ (0, o.jsx)("path", { d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" }),
        /* @__PURE__ */ (0, o.jsx)("polyline", { points: "14,2 14,8 20,8" })
      ] }),
      chevd: /* @__PURE__ */ (0, o.jsx)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, o.jsx)("polyline", { points: "6,9 12,15 18,9" }) }),
      settings: /* @__PURE__ */ (0, o.jsxs)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ (0, o.jsx)("circle", { cx: "12", cy: "12", r: "3" }),
        /* @__PURE__ */ (0, o.jsx)("path", { d: "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" })
      ] }),
      help: /* @__PURE__ */ (0, o.jsxs)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ (0, o.jsx)("circle", { cx: "12", cy: "12", r: "10" }),
        /* @__PURE__ */ (0, o.jsx)("path", { d: "M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" }),
        /* @__PURE__ */ (0, o.jsx)("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })
      ] }),
      shield2: /* @__PURE__ */ (0, o.jsxs)("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: n, strokeWidth: a, strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ (0, o.jsx)("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }),
        /* @__PURE__ */ (0, o.jsx)("polyline", { points: "9,12 11,14 15,10" })
      ] })
    };
    return l[e] || null;
  };
  var hl = ({ a: e, go: t }) => {
    const n = [
      { id: "home", ic: "home", lb: "Accueil" },
      { id: "violence", ic: "shield", lb: "Violence" },
      { id: "profil", ic: "user", lb: "Profil" }
    ];
    return /* @__PURE__ */ (0, o.jsx)("nav", { className: "bnav", children: n.map((a) => /* @__PURE__ */ (0, o.jsxs)("button", { className: `ni ${e === a.id ? "a" : ""}`, onClick: () => t(a.id), children: [
      /* @__PURE__ */ (0, o.jsx)("span", { style: { width: 24, height: 24, display: "flex", transform: e === a.id ? "scale(1.15)" : "scale(1)" }, children: /* @__PURE__ */ (0, o.jsx)(_, { n: a.ic, s: 22, c: e === a.id ? "#F97316" : "#A8A29E", w: e === a.id ? 2.2 : 1.8 }) }),
      /* @__PURE__ */ (0, o.jsx)("span", { className: "nlb", children: a.lb })
    ] }, a.id)) });
  };
  var Uh = ({ go: e, userInfo: t = {}, onAcces: n }) => {
    const [a, l] = (0, S.useState)("");
    const [i, u] = (0, S.useState)("");
    const [c, r] = (0, S.useState)(false);
    const [g, m] = (0, S.useState)(false);
    const v = (t.nm || "").split(" ")[0] || "";
    const p = (t.nm || "?").split(" ").map((z) => z[0] || "").join("").slice(0, 2).toUpperCase() || "??";
    (0, S.useEffect)(() => {
      try {
        if (window.PublicKeyCredential) window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then((z) => r(z)).catch(() => {
        });
      } catch (z) {
      }
    }, []);
    const y = (z) => {
      l(z);
      u("");
      if (z.length === 6) {
        setTimeout(() => {
          if (!t.pin || z === t.pin) {
            n ? n() : e("home");
          } else {
            u("Code d'acc\xE8s incorrect. R\xE9essayez.");
            m(true);
            setTimeout(() => {
              m(false);
              l("");
            }, 420);
          }
        }, 300);
      }
    };
    const T = async () => {
      try {
        const z = await navigator.credentials.get({ publicKey: { challenge: new Uint8Array(32), timeout: 3e4, userVerification: "required" } });
        if (z) {
          n ? n() : e("home");
        }
      } catch (z) {
        u("Empreinte non reconnue. Utilisez votre code.");
      }
    };
    return /* @__PURE__ */ (0, o.jsxs)("div", { className: "scr on", style: { display: "flex", flexDirection: "column" }, children: [
      /* @__PURE__ */ (0, o.jsxs)("div", { style: { background: "linear-gradient(160deg,#1C1917,#292524)", padding: "40px 28px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }, children: [
        /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#F97316,#FB923C)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "#fff" }, children: p }),
        /* @__PURE__ */ (0, o.jsx)("p", { style: { fontFamily: "Sora,sans-serif", fontSize: 20, fontWeight: 800, color: "#fff" }, children: v ? `Bonjour ${v} \u{1F44B}` : "Bon retour \u{1F44B}" }),
        /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, color: "rgba(255,255,255,.5)" }, children: "Saisissez votre code d'acc\xE8s" })
      ] }),
      /* @__PURE__ */ (0, o.jsxs)("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 32, padding: "32px 24px" }, children: [
        /* @__PURE__ */ (0, o.jsx)("div", { style: { display: "flex", gap: 10, marginBottom: 24, animation: g ? "shk 380ms ease" : "none" }, children: [0, 1, 2, 3, 4, 5].map((z) => /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 46, height: 54, borderRadius: 12, border: `2px solid ${i ? "#DC2626" : a.length > z ? s.orange : s.surfH}`, background: i ? "#FFF1F2" : a.length > z ? s.orangeL : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }, children: a.length > z && /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 12, height: 12, borderRadius: "50%", background: i ? "#DC2626" : s.orange } }) }, z)) }),
        /* @__PURE__ */ (0, o.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, width: 240, marginBottom: 20 }, children: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "\u232B"].map((z, U) => /* @__PURE__ */ (0, o.jsx)("button", { onClick: () => {
          if (z === "\u232B") y(a.slice(0, -1));
          else if (z && a.length < 6) y(a + z);
        }, style: { height: 56, borderRadius: 14, border: "none", cursor: z ? "pointer" : "default", background: z ? z === "\u232B" ? "#FFF1F2" : "#fff" : "transparent", fontSize: z === "\u232B" ? 20 : 22, fontWeight: 700, color: z === "\u232B" ? "#DC2626" : s.ink, fontFamily: "Sora,sans-serif", boxShadow: z && z !== "\u232B" ? "0 2px 8px rgba(0,0,0,.06)" : void 0 }, children: z }, U)) }),
        i && /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, color: "#DC2626", fontWeight: 600, marginBottom: 12, textAlign: "center" }, children: i }),
        c && /* @__PURE__ */ (0, o.jsxs)("button", { onClick: T, style: { display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 14, border: `1px solid ${s.border}`, background: "#fff", cursor: "pointer", fontFamily: "Plus Jakarta Sans", marginBottom: 16, fontSize: 13, fontWeight: 700, color: s.ink }, children: [
          /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 22 }, children: "\u{1F446}" }),
          "Utiliser l'empreinte digitale"
        ] }),
        /* @__PURE__ */ (0, o.jsx)("button", { onClick: () => e("login"), style: { background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, color: s.faint, fontFamily: "Plus Jakarta Sans" }, children: "Se connecter avec un autre compte" })
      ] })
    ] });
  };
  var Bh = ({ go: e, userInfo: t = {}, onAcces: n }) => {
    if (t.nm && t.ph) {
      return /* @__PURE__ */ (0, o.jsx)(Uh, { go: e, userInfo: t, onAcces: n });
    }
    return /* @__PURE__ */ (0, o.jsxs)("div", { className: "scr on splash", style: { display: "flex" }, children: [
      /* @__PURE__ */ (0, o.jsx)("div", { className: "orb", children: /* @__PURE__ */ (0, o.jsx)("span", { className: "orb-txt", children: "A" }) }),
      /* @__PURE__ */ (0, o.jsxs)("h1", { className: "stitle", children: [
        "ALERTE",
        /* @__PURE__ */ (0, o.jsx)("br", {}),
        /* @__PURE__ */ (0, o.jsx)("span", { children: "CI" })
      ] }),
      /* @__PURE__ */ (0, o.jsx)("p", { className: "stag", children: "Votre s\xE9curit\xE9, notre priorit\xE9" }),
      /* @__PURE__ */ (0, o.jsxs)("div", { className: "flag", children: [
        /* @__PURE__ */ (0, o.jsx)("div", { className: "fs", style: { background: "#F97316" } }),
        /* @__PURE__ */ (0, o.jsx)("div", { className: "fs", style: { background: "#FFFFFF" } }),
        /* @__PURE__ */ (0, o.jsx)("div", { className: "fs", style: { background: "#16A34A" } })
      ] }),
      /* @__PURE__ */ (0, o.jsxs)("div", { style: { width: "100%", display: "flex", flexDirection: "column", gap: 10 }, children: [
        /* @__PURE__ */ (0, o.jsxs)("button", { className: "btn btn-p", onClick: () => e("signup"), children: [
          "Cr\xE9er un compte ",
          /* @__PURE__ */ (0, o.jsx)(_, { n: "arrow", s: 16, c: "#fff" })
        ] }),
        /* @__PURE__ */ (0, o.jsx)("button", { className: "btn btn-s", onClick: () => e("login"), children: "Se connecter" })
      ] }),
      /* @__PURE__ */ (0, o.jsx)("p", { style: { marginTop: 24, fontSize: 11, color: "rgba(255,255,255,.25)", textAlign: "center" }, children: "C\xF4te d'Ivoire \xB7 iOS & Android" })
    ] });
  };
  var zg = [];
  var Ot = "https://dgwxyhtmuighwknchrae.supabase.co";
  var vg = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnd3h5aHRtdWlnaHdrbmNocmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNDY5MDAsImV4cCI6MjA5NzgyMjkwMH0.JJyoRXBqQYedgRbU_HdJEMyTo4xYtWH0HBSVdollAJ8";
  var qh = 24 * 60 * 60 * 1e3;
  var fs = (e) => `u${String(e).replace(/\D/g, "")}@alerteci.app`;
  var ds = (e, t) => `CI!${t}.${String(e).replace(/\D/g, "")}`;
  var Jt = (e) => ({
    "Content-Type": "application/json",
    "apikey": vg,
    "Authorization": `Bearer ${e || vg}`
  });
  var Si = null;
  var va = () => {
    if (Si) return Si;
    try {
      Si = window.localStorage.getItem("alerteci_cloud_token") || null;
    } catch (e) {
    }
    return Si;
  };
  var ps = (e) => {
    Si = e || null;
    try {
      if (e) window.localStorage.setItem("alerteci_cloud_token", e);
      else window.localStorage.removeItem("alerteci_cloud_token");
    } catch (t) {
    }
  };
  async function Hh() {
    try {
      const e = window.localStorage.getItem("alerteci_session_user");
      const t = e ? JSON.parse(e) : null;
      if (!t || !t.ph || !t.pin) return null;
      const n = await fetch(`${Ot}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: Jt(),
        body: JSON.stringify({ email: fs(t.ph), password: ds(t.ph, t.pin) })
      });
      if (!n.ok) return null;
      const a = await n.json();
      if (a.access_token) {
        ps(a.access_token);
        return a.access_token;
      }
      return null;
    } catch (e) {
      return null;
    }
  }
  async function gs(e, t) {
    try {
      const n = await fetch(`${Ot}/rest/v1/${e}`, { headers: Jt(t || va()) });
      if (!n.ok) return null;
      return await n.json();
    } catch (n) {
      return null;
    }
  }
  async function ms(e, t, n, a) {
    try {
      const l = await fetch(`${Ot}/rest/v1/${e}`, {
        method: "POST",
        headers: { ...Jt(n || va()), "Prefer": "return=representation" },
        body: JSON.stringify(t)
      });
      if (l.status === 401 && !a) {
        const u = await Hh();
        if (u) return ms(e, t, u, true);
      }
      if (!l.ok) return null;
      const i = await l.json();
      return Array.isArray(i) ? i[0] : i;
    } catch (l) {
      return null;
    }
  }
  async function jh(e) {
    try {
      const t = await fetch(`${Ot}/auth/v1/signup`, {
        method: "POST",
        headers: Jt(),
        body: JSON.stringify({
          email: fs(e.ph),
          password: ds(e.ph, e.pin),
          data: { nm: e.nm || "", plan: e.plan || "gratuit", commune: e.commune || "" }
        })
      });
      const n = await t.json();
      const a = n.user && n.user.id ? n.user.id : n.id;
      if (!a) return null;
      if (n.access_token) ps(n.access_token);
      const l = n.access_token || null;
      const i = e.plan === "premium" ? "premium" : "gratuit";
      const u = await gs(`forfaits?slug=eq.${i}&select=id`, l);
      await ms("profiles", {
        id: a,
        nom: e.nm,
        telephone: e.ph,
        email: e.mail || null,
        commune: e.commune || null,
        forfait_id: u && u[0] ? u[0].id : null,
        statut: "actif"
      }, l);
      return true;
    } catch (t) {
      return null;
    }
  }
  async function Lh(e, t) {
    try {
      const n = await fetch(`${Ot}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: Jt(),
        body: JSON.stringify({ email: fs(e), password: ds(e, t) })
      });
      if (!n.ok) return null;
      const a = await n.json();
      const l = a.user && a.user.id;
      if (!l || !a.access_token) return null;
      ps(a.access_token);
      const i = a.user && a.user.user_metadata || {};
      const u = await gs(`profiles?id=eq.${l}&select=*,forfaits(slug)`, a.access_token);
      const c = u && u[0];
      if (c && c.statut === "suspendu") return { suspendu: true };
      const r = c && c.forfaits && c.forfaits.slug === "premium" ? "premium" : i.plan === "premium" ? "premium" : "gratuit";
      const g = {
        nm: c && c.nom || i.nm || "",
        ph: e,
        mail: c && c.email || "",
        commune: c && c.commune || i.commune || "",
        pin: t,
        plan: r,
        id: `acc-${Date.now()}`,
        creeLe: Date.now()
      };
      Gh(g);
      return g;
    } catch (n) {
      return null;
    }
  }
  function Gh(e) {
    try {
      const t = window.localStorage.getItem("alerteci_comptes");
      const n = t ? JSON.parse(t) : [];
      if (!n.some((a) => a.ph === e.ph)) {
        n.push(e);
        window.localStorage.setItem("alerteci_comptes", JSON.stringify(n));
      }
    } catch (t) {
    }
  }
  var Wn = (e) => String(e || "").replace(/\D/g, "").slice(-10);
  var zi = null;
  function bg() {
    return zi;
  }
  async function fu(e) {
    try {
      const t = await fetch(`${Ot}/rest/v1/diffusions`, {
        method: "POST",
        headers: { ...Jt(va()), "Prefer": "return=minimal" },
        body: JSON.stringify({ payload: { ...e, urgence: true } })
      });
      let n = "";
      if (!t.ok) {
        try {
          const a = await t.json();
          n = a && (a.message || a.hint || a.details) || "Erreur HTTP " + t.status;
        } catch (a) {
          n = "Erreur HTTP " + t.status;
        }
      }
      zi = { ts: Date.now(), ok: t.ok, code: t.status, msg: n };
      return zi;
    } catch (t) {
      zi = { ts: Date.now(), ok: false, code: 0, msg: "Pas de connexion internet" };
      return zi;
    }
  }
  async function Yh(e) {
    const t = Wn(e);
    if (!t) return [];
    const n = new Date(Date.now() - qh).toISOString();
    const a = await gs(`diffusions?select=payload,created_at&created_at=gte.${encodeURIComponent(n)}&order=created_at.desc&limit=300`);
    if (!a) return [];
    return a.map((l) => l.payload).filter((l) => l && l.urgence === true && Array.isArray(l.cibles) && l.cibles.map(Wn).includes(t));
  }
  var vn = null;
  var us = () => {
    const [e, t] = (0, S.useState)(() => /* @__PURE__ */ new Date());
    (0, S.useEffect)(() => {
      const n = setInterval(() => t(/* @__PURE__ */ new Date()), 1e3);
      return () => clearInterval(n);
    }, []);
    return /* @__PURE__ */ (0, o.jsx)(o.Fragment, { children: e.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) });
  };
  var is = Promise.resolve();
  function du(e) {
    is = is.then(() => new Promise((t) => setTimeout(t, 700))).then(() => e()).catch(() => {
    });
    return is;
  }
  function Ei() {
    if (!vn || vn.state === "closed") {
      try {
        vn = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        vn = null;
      }
    }
    return vn;
  }
  function Ag() {
    const e = Ei();
    if (!e) return;
    try {
      if (e.state === "suspended") e.resume();
      const t = e.createOscillator(), n = e.createGain();
      n.gain.value = 1e-4;
      t.connect(n);
      n.connect(e.destination);
      t.start();
      t.stop(e.currentTime + 0.02);
    } catch (t) {
    }
  }
  if (typeof window !== "undefined") {
    ["touchstart", "pointerdown", "click"].forEach((e) => {
      try {
        window.addEventListener(e, Ag, { passive: true });
      } catch (t) {
      }
    });
  }
  var Ai = [];
  function Vh(e, t) {
    try {
      const n = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications;
      if (!n) return;
      const a = [];
      for (let l = 0; l < 450; l++) {
        a.push({
          id: 9e8 + Math.floor(Math.random() * 9e7),
          title: e,
          body: t,
          channelId: "sirene_urgence",
          schedule: { at: new Date(Date.now() + 300 + l * 4e3), allowWhileIdle: true }
        });
      }
      Ai = a.map((l) => l.id);
      du(() => n.createChannel({ id: "sirene_urgence", name: "Sir\xE8ne d'urgence", description: "Alarme sonore des alertes", importance: 5, visibility: 1, vibration: true, lights: true }));
      du(() => n.schedule({ notifications: a }));
    } catch (n) {
    }
  }
  function Fh() {
    try {
      const e = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications;
      if (!e || !Ai.length) return;
      const t = Ai.map((n) => ({ id: n }));
      Ai = [];
      du(() => e.cancel({ notifications: t }));
    } catch (e) {
      Ai = [];
    }
  }
  var $n = null;
  var os = null;
  var ru = null;
  var su = null;
  var cs = null;
  var rs = null;
  var xg = null;
  var ss = null;
  var tt = null;
  function Xh() {
    try {
      const e = 22050, t = Math.floor(e * 2);
      const n = new Int16Array(t);
      let a = 0;
      for (let r = 0; r < t; r++) {
        const g = r / e;
        const m = 900 + 300 * Math.sin(2 * Math.PI * 2 * g);
        a += 2 * Math.PI * m / e;
        let v = Math.sign(Math.sin(a)) * 0.85;
        if (r < 220) v *= r / 220;
        if (r > t - 220) v *= (t - r) / 220;
        n[r] = Math.max(-32767, Math.min(32767, Math.floor(v * 32767)));
      }
      const l = n.length * 2;
      const i = new ArrayBuffer(44 + l), u = new DataView(i);
      const c = (r, g) => {
        for (let m = 0; m < g.length; m++) u.setUint8(r + m, g.charCodeAt(m));
      };
      c(0, "RIFF");
      u.setUint32(4, 36 + l, true);
      c(8, "WAVE");
      c(12, "fmt ");
      u.setUint32(16, 16, true);
      u.setUint16(20, 1, true);
      u.setUint16(22, 1, true);
      u.setUint32(24, e, true);
      u.setUint32(28, e * 2, true);
      u.setUint16(32, 2, true);
      u.setUint16(34, 16, true);
      c(36, "data");
      u.setUint32(40, l, true);
      new Int16Array(i, 44).set(n);
      return URL.createObjectURL(new Blob([i], { type: "audio/wav" }));
    } catch (e) {
      return null;
    }
  }
  function Ci(e) {
    ba();
    try {
      _stopperMicroEcoute && _stopperMicroEcoute();
    } catch (l) {
    }
    try {
      const l = Xh();
      if (l) {
        tt = new Audio(l);
        tt.loop = true;
        tt.volume = 1;
        const i = () => {
          try {
            const r = tt.play();
            if (r && r.catch) r.catch(() => {
            });
          } catch (r) {
          }
        };
        i();
        let u = 0;
        const c = setInterval(() => {
          u++;
          if (!tt || u > 60) {
            clearInterval(c);
            return;
          }
          if (tt.paused) i();
        }, 500);
        tt._retry = c;
      }
    } catch (l) {
    }
    let t = null;
    try {
      t = new (window.AudioContext || window.webkitAudioContext)();
    } catch (l) {
      t = null;
    }
    vn = t;
    const n = () => {
      if (!t || $n) return;
      try {
        if (t.state === "suspended") t.resume();
      } catch (l) {
      }
      try {
        const l = t.createDynamicsCompressor();
        l.threshold.value = -6;
        l.knee.value = 0;
        l.ratio.value = 20;
        l.attack.value = 0;
        l.release.value = 0.05;
        l.connect(t.destination);
        const i = t.createGain();
        i.gain.value = 0.8;
        i.connect(l);
        const u = t.createOscillator();
        u.type = "square";
        u.frequency.value = 1200;
        const c = t.createOscillator();
        c.type = "triangle";
        c.frequency.value = 2;
        const r = t.createGain();
        r.gain.value = 300;
        c.connect(r);
        r.connect(u.frequency);
        u.connect(i);
        u.start();
        c.start();
        $n = u;
        ru = i;
        su = c;
      } catch (l) {
      }
    };
    n();
    cs = setInterval(() => {
      try {
        if (t && t.state === "suspended") t.resume();
      } catch (l) {
      }
      if (!$n) n();
      if (tt && tt.paused) {
        try {
          tt.play().catch(() => {
          });
        } catch (l) {
        }
      }
    }, 800);
    const a = () => {
      try {
        navigator.vibrate && navigator.vibrate([600, 150, 600, 150, 900]);
      } catch (l) {
      }
    };
    a();
    rs = setInterval(a, 2500);
    if (e && window.speechSynthesis) {
      const l = () => {
        try {
          window.speechSynthesis.cancel();
          const i = new SpeechSynthesisUtterance(e);
          i.lang = "fr-FR";
          i.rate = 0.95;
          i.volume = 1;
          i.pitch = 1;
          window.speechSynthesis.speak(i);
        } catch (i) {
        }
      };
      setTimeout(l, 1500);
      ss = setInterval(l, 9e3);
    }
    Vh("\u{1F6A8} ALERTE EN COURS", e || "Une personne est en danger. Ouvrez Alerte CI !");
  }
  function ba() {
    Fh();
    try {
      clearTimeout(xg);
      xg = null;
    } catch (e) {
    }
    try {
      clearInterval(ss);
      ss = null;
    } catch (e) {
    }
    try {
      window.speechSynthesis && window.speechSynthesis.cancel();
    } catch (e) {
    }
    try {
      clearInterval(cs);
      cs = null;
    } catch (e) {
    }
    try {
      clearInterval(rs);
      rs = null;
    } catch (e) {
    }
    try {
      navigator.vibrate && navigator.vibrate(0);
    } catch (e) {
    }
    try {
      if (tt) {
        clearInterval(tt._retry);
        tt.pause();
        tt.src = "";
      }
      tt = null;
    } catch (e) {
    }
    try {
      $n && $n.stop();
    } catch (e) {
    }
    try {
      os && os.stop();
    } catch (e) {
    }
    try {
      su && su.stop();
    } catch (e) {
    }
    try {
      ru && ru.disconnect();
    } catch (e) {
    }
    $n = null;
    os = null;
    su = null;
    ru = null;
    try {
      vn && vn.close();
    } catch (e) {
    }
    vn = null;
  }
  function Qh(e, t) {
    if (!e || !t) return;
    ms("device_tokens", { token: e, telephone: Wn(t), plateforme: "android" }).then(() => {
    }).catch(() => {
    });
  }
  function Zh(e) {
    try {
      const t = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.PushNotifications;
      if (!t || !e) return;
      du(() => t.requestPermissions()).then((n) => {
        if (!n) return;
        if (n.receive !== "granted") return;
        t.addListener("registration", (a) => Qh(a.value, e));
        t.addListener("pushNotificationReceived", (a) => {
          try {
            const l = a && a.data || {};
            if (l.type === "urgence" || l.urgence === "true" || l.urgence === true) Ci();
          } catch (l) {
          }
        });
        t.register();
      }).catch(() => {
      });
    } catch (t) {
    }
  }
  var Jh = ({ go: e, goBack: t, setPlan: n, setUserInfo: a, userInfo: l = {}, comptesInscrits: i = [] }) => {
    const [u, c] = (0, S.useState)("");
    const [r, g] = (0, S.useState)("");
    const [m, v] = (0, S.useState)("");
    const [p, y] = (0, S.useState)(false);
    const [T, z] = (0, S.useState)(null);
    const [U, f] = (0, S.useState)("");
    const [d, h] = (0, S.useState)("");
    const [b] = (0, S.useState)("1234");
    const [k, D] = (0, S.useState)("");
    const [E, j] = (0, S.useState)("");
    const [L, q] = (0, S.useState)("");
    const [Y, Ue] = (0, S.useState)(false);
    const [Le, st] = (0, S.useState)(0);
    const B = (0, S.useRef)(null);
    const $ = () => {
      st(60);
      clearInterval(B.current);
      B.current = setInterval(() => {
        st((O) => {
          if (O <= 1) {
            clearInterval(B.current);
            return 0;
          }
          return O - 1;
        });
      }, 1e3);
    };
    const J = () => {
      if (U.length < 10) {
        q("Saisissez un num\xE9ro valide \xE0 10 chiffres.");
        return;
      }
      q("");
      Ue(true);
      setTimeout(() => {
        Ue(false);
        z("saisir_code");
        $();
        wt();
      }, 1200);
    };
    const he = () => {
      if (d !== b) {
        q("Code incorrect. V\xE9rifiez le SMS re\xE7u et r\xE9essayez.");
        return;
      }
      q("");
      z("nouveau_pin");
    };
    const Ne = () => {
      if (k.length < 6) {
        q("Le code d'acc\xE8s doit contenir 6 chiffres.");
        return;
      }
      if (k !== E) {
        q("Les codes ne correspondent pas.");
        return;
      }
      q("");
      y(true);
      setTimeout(() => {
        y(false);
        z("succes");
        wt();
      }, 1e3);
    };
    const V = (O) => {
      if (u.length < 10 || O.length < 6) {
        v("V\xE9rifiez votre num\xE9ro et votre code d'acc\xE8s.");
        return;
      }
      const H = i.find((re) => re.ph === u && re.pin === O);
      if (H) {
        v("");
        y(true);
        n && n(H.plan === "premium" ? "premium" : "gratuit");
        a && a(H);
        setTimeout(() => {
          y(false);
          e("home");
        }, 1e3);
        return;
      }
      const ce = zg.find((re) => re.ph === u && re.pin === O);
      if (ce) {
        v("");
        y(true);
        n && n(ce.badge === "PREMIUM" ? "premium" : "gratuit");
        a && a({ nm: ce.label, ph: ce.ph, mail: "", commune: "", pin: ce.pin, plan: ce.badge === "PREMIUM" ? "premium" : "gratuit" });
        setTimeout(() => {
          y(false);
          e(ce.target);
        }, 1e3);
      } else {
        v("");
        y(true);
        Lh(u, O).then((re) => {
          y(false);
          if (!re) {
            v("Num\xE9ro ou code d'acc\xE8s incorrect.");
            g("");
            return;
          }
          if (re.suspendu) {
            v("Ce compte a \xE9t\xE9 suspendu. Contactez le support.");
            g("");
            return;
          }
          n && n(re.plan === "premium" ? "premium" : "gratuit");
          a && a(re);
          e("home");
        });
      }
    };
    const Ht = (O) => {
      g(O);
      v("");
      if (O.length === 6) setTimeout(() => V(O), 150);
    };
    if (T) return /* @__PURE__ */ (0, o.jsxs)("div", { className: "scr on", style: { display: "flex", flexDirection: "column" }, children: [
      /* @__PURE__ */ (0, o.jsxs)("div", { style: { background: "linear-gradient(160deg,#1C1917,#292524)", padding: "36px 28px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }, children: [
        /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 52, height: 52, borderRadius: 16, background: "rgba(249,115,22,.15)", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ (0, o.jsx)(_, { n: "lock", s: 26, c: s.orange }) }),
        /* @__PURE__ */ (0, o.jsx)("p", { style: { fontFamily: "Sora,sans-serif", fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-.3px" }, children: T === "succes" ? "Code d'acc\xE8s r\xE9initialis\xE9 \u2713" : "R\xE9cup\xE9ration du compte" }),
        T !== "succes" && /* @__PURE__ */ (0, o.jsx)("div", { style: { display: "flex", alignItems: "center", gap: 6, marginTop: 4 }, children: ["saisir_num", "saisir_code", "nouveau_pin"].map((O, H) => /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
          /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 24, height: 24, borderRadius: "50%", background: ["saisir_num", "saisir_code", "nouveau_pin"].indexOf(T) >= H ? s.orange : "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff" }, children: H + 1 }),
          H < 2 && /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 20, height: 2, borderRadius: 1, background: ["saisir_num", "saisir_code", "nouveau_pin"].indexOf(T) > H ? "rgba(249,115,22,.6)" : "rgba(255,255,255,.15)" } })
        ] }, H)) }),
        /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 12, color: "rgba(255,255,255,.5)", textAlign: "center" }, children: [
          T === "saisir_num" && "\xC9tape 1 \xB7 Entrez votre num\xE9ro enregistr\xE9",
          T === "saisir_code" && `\xC9tape 2 \xB7 Code envoy\xE9 au ${U}`,
          T === "nouveau_pin" && "\xC9tape 3 \xB7 Choisissez un nouveau code d'acc\xE8s",
          T === "succes" && "Votre compte est de nouveau accessible"
        ] })
      ] }),
      /* @__PURE__ */ (0, o.jsxs)("div", { className: "isc", style: { flex: 1 }, children: [
        T === "saisir_num" && /* @__PURE__ */ (0, o.jsxs)("div", { style: { paddingTop: 20, display: "flex", flexDirection: "column", gap: 10 }, children: [
          /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 13, color: s.muted, lineHeight: 1.5, marginBottom: 4 }, children: "Saisissez le num\xE9ro de t\xE9l\xE9phone associ\xE9 \xE0 votre compte. Vous recevrez un code par SMS." }),
          /* @__PURE__ */ (0, o.jsxs)("div", { className: "if", style: { border: `1.5px solid ${U.length === 10 ? "rgba(22,163,74,.4)" : s.border}` }, children: [
            /* @__PURE__ */ (0, o.jsx)(_, { n: "phone", s: 18, c: s.faint }),
            /* @__PURE__ */ (0, o.jsx)(
              "input",
              {
                type: "tel",
                value: U,
                onChange: (O) => {
                  f(O.target.value.replace(/\D/g, "").slice(0, 10));
                  q("");
                },
                placeholder: "Num\xE9ro de t\xE9l\xE9phone (10 chiffres)",
                maxLength: 10,
                style: { letterSpacing: U.length > 0 ? "1px" : "normal" }
              }
            ),
            U.length === 10 && /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 12, color: s.green, fontWeight: 700 }, children: "\u2713" })
          ] }),
          L && /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, color: "#DC2626", fontWeight: 600, paddingLeft: 4 }, children: L }),
          /* @__PURE__ */ (0, o.jsx)(
            "button",
            {
              className: "btn btn-p",
              style: { opacity: U.length === 10 && !Y ? 1 : 0.5 },
              disabled: U.length < 10 || Y,
              onClick: J,
              children: Y ? /* @__PURE__ */ (0, o.jsxs)(o.Fragment, { children: [
                /* @__PURE__ */ (0, o.jsx)("span", { style: { display: "inline-block", animation: "spin 1s linear infinite" }, children: "\u27F3" }),
                " Envoi du code..."
              ] }) : /* @__PURE__ */ (0, o.jsx)(o.Fragment, { children: "\u{1F4F1} Envoyer le code SMS" })
            }
          )
        ] }),
        T === "saisir_code" && /* @__PURE__ */ (0, o.jsxs)("div", { style: { paddingTop: 20, display: "flex", flexDirection: "column", gap: 10 }, children: [
          /* @__PURE__ */ (0, o.jsxs)("div", { style: { background: s.greenL, border: "1px solid rgba(22,163,74,.2)", borderRadius: 14, padding: "12px 14px" }, children: [
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, fontWeight: 700, color: s.green, marginBottom: 3 }, children: "\u{1F4F2} Code envoy\xE9 !" }),
            /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 12, color: s.muted, lineHeight: 1.5 }, children: [
              "Un code \xE0 4 chiffres a \xE9t\xE9 envoy\xE9 au ",
              /* @__PURE__ */ (0, o.jsx)("strong", { style: { color: s.ink }, children: U })
            ] })
          ] }),
          /* @__PURE__ */ (0, o.jsx)("div", { style: { display: "flex", justifyContent: "center", gap: 10, padding: "8px 0" }, children: [0, 1, 2, 3].map((O) => /* @__PURE__ */ (0, o.jsx)(
            "input",
            {
              id: `code-${O}`,
              type: "tel",
              maxLength: 1,
              value: d[O] || "",
              onChange: (H) => {
                const ce = H.target.value.replace(/\D/g, "");
                const re = d.split("");
                re[O] = ce;
                const Fe = re.join("").slice(0, 4);
                h(Fe);
                q("");
                if (ce && O < 3) document.getElementById(`code-${O + 1}`)?.focus();
              },
              onKeyDown: (H) => {
                if (H.key === "Backspace" && !d[O] && O > 0) document.getElementById(`code-${O - 1}`)?.focus();
              },
              style: {
                width: 56,
                height: 64,
                borderRadius: 14,
                border: `2px solid ${d.length > O ? s.orange : s.surfH}`,
                textAlign: "center",
                fontSize: 28,
                fontWeight: 800,
                color: s.ink,
                fontFamily: "Sora,sans-serif",
                outline: "none",
                background: "#fff"
              }
            },
            O
          )) }),
          L && /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, color: "#DC2626", fontWeight: 600, textAlign: "center" }, children: L }),
          /* @__PURE__ */ (0, o.jsxs)(
            "button",
            {
              className: "btn btn-p",
              style: { opacity: d.length === 4 ? 1 : 0.5 },
              disabled: d.length < 4,
              onClick: he,
              children: [
                "V\xE9rifier le code ",
                /* @__PURE__ */ (0, o.jsx)(_, { n: "arrow", s: 16, c: "#fff" })
              ]
            }
          ),
          /* @__PURE__ */ (0, o.jsx)(
            "button",
            {
              style: { background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, color: Le > 0 ? s.faint : s.orange, fontFamily: "Plus Jakarta Sans", textAlign: "center" },
              disabled: Le > 0,
              onClick: () => {
                h("");
                q("");
                J();
              },
              children: Le > 0 ? `Renvoyer le code (${Le}s)` : "Renvoyer le code"
            }
          )
        ] }),
        T === "nouveau_pin" && /* @__PURE__ */ (0, o.jsxs)("div", { style: { paddingTop: 20, display: "flex", flexDirection: "column", gap: 14 }, children: [
          /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 13, color: s.muted, lineHeight: 1.5, marginBottom: 4 }, children: "Choisissez un nouveau code d'acc\xE8s \xE0 6 chiffres. C'est ce code qui vous servira d\xE9sormais \xE0 vous connecter." }),
          /* @__PURE__ */ (0, o.jsxs)("div", { children: [
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 11, fontWeight: 700, color: s.muted, marginBottom: 8, textAlign: "center" }, children: "Nouveau code" }),
            /* @__PURE__ */ (0, o.jsx)("div", { style: { display: "flex", justifyContent: "center", gap: 8 }, children: [0, 1, 2, 3, 4, 5].map((O) => /* @__PURE__ */ (0, o.jsx)(
              "input",
              {
                id: `newpin-${O}`,
                type: "password",
                inputMode: "numeric",
                maxLength: 1,
                value: k[O] || "",
                onChange: (H) => {
                  const ce = H.target.value.replace(/\D/g, "").slice(0, 1);
                  const re = k.split("");
                  re[O] = ce;
                  const Fe = re.join("").slice(0, 6);
                  D(Fe);
                  q("");
                  if (ce && O < 5) document.getElementById(`newpin-${O + 1}`)?.focus();
                },
                onKeyDown: (H) => {
                  if (H.key === "Backspace" && !k[O] && O > 0) document.getElementById(`newpin-${O - 1}`)?.focus();
                },
                style: { width: 42, height: 50, borderRadius: 12, border: `2px solid ${k.length > O ? s.orange : s.surfH}`, textAlign: "center", fontSize: 20, fontWeight: 800, fontFamily: "Sora,sans-serif", color: s.ink, outline: "none", background: "#fff" }
              },
              O
            )) })
          ] }),
          /* @__PURE__ */ (0, o.jsxs)("div", { children: [
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 11, fontWeight: 700, color: s.muted, marginBottom: 8, textAlign: "center" }, children: "Confirmer le code" }),
            /* @__PURE__ */ (0, o.jsx)("div", { style: { display: "flex", justifyContent: "center", gap: 8 }, children: [0, 1, 2, 3, 4, 5].map((O) => /* @__PURE__ */ (0, o.jsx)(
              "input",
              {
                id: `newpinc-${O}`,
                type: "password",
                inputMode: "numeric",
                maxLength: 1,
                value: E[O] || "",
                onChange: (H) => {
                  const ce = H.target.value.replace(/\D/g, "").slice(0, 1);
                  const re = E.split("");
                  re[O] = ce;
                  const Fe = re.join("").slice(0, 6);
                  j(Fe);
                  q("");
                  if (ce && O < 5) document.getElementById(`newpinc-${O + 1}`)?.focus();
                },
                onKeyDown: (H) => {
                  if (H.key === "Backspace" && !E[O] && O > 0) document.getElementById(`newpinc-${O - 1}`)?.focus();
                },
                style: { width: 42, height: 50, borderRadius: 12, border: `2px solid ${E.length > O ? E === k.slice(0, E.length) ? s.green : "#DC2626" : s.surfH}`, textAlign: "center", fontSize: 20, fontWeight: 800, fontFamily: "Sora,sans-serif", color: s.ink, outline: "none", background: "#fff" }
              },
              O
            )) })
          ] }),
          L && /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, color: "#DC2626", fontWeight: 600, textAlign: "center" }, children: L }),
          /* @__PURE__ */ (0, o.jsx)(
            "button",
            {
              className: "btn btn-p",
              style: { opacity: k.length === 6 && k === E && !p ? 1 : 0.5 },
              disabled: k.length < 6 || k !== E || p,
              onClick: Ne,
              children: p ? /* @__PURE__ */ (0, o.jsxs)(o.Fragment, { children: [
                /* @__PURE__ */ (0, o.jsx)("span", { style: { display: "inline-block", animation: "spin 1s linear infinite" }, children: "\u27F3" }),
                " Enregistrement..."
              ] }) : /* @__PURE__ */ (0, o.jsxs)(o.Fragment, { children: [
                /* @__PURE__ */ (0, o.jsx)(_, { n: "check", s: 16, c: "#fff" }),
                "Enregistrer le code d'acc\xE8s"
              ] })
            }
          )
        ] }),
        T === "succes" && /* @__PURE__ */ (0, o.jsxs)("div", { style: { paddingTop: 20, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }, children: [
          /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 72, height: 72, borderRadius: "50%", background: s.green, display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ (0, o.jsx)(_, { n: "check", s: 34, c: "#fff" }) }),
          /* @__PURE__ */ (0, o.jsx)("p", { style: { fontFamily: "Sora,sans-serif", fontSize: 18, fontWeight: 800, color: s.ink }, children: "Code d'acc\xE8s modifi\xE9 !" }),
          /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 13, color: s.muted, lineHeight: 1.6 }, children: "Votre code d'acc\xE8s a \xE9t\xE9 r\xE9initialis\xE9 avec succ\xE8s. Vous pouvez maintenant vous connecter avec votre nouveau code \xE0 6 chiffres." }),
          /* @__PURE__ */ (0, o.jsxs)("button", { className: "btn btn-p", onClick: () => {
            z(null);
            h("");
            D("");
            j("");
            f("");
          }, children: [
            "Se connecter ",
            /* @__PURE__ */ (0, o.jsx)(_, { n: "arrow", s: 16, c: "#fff" })
          ] })
        ] }),
        T !== "succes" && /* @__PURE__ */ (0, o.jsxs)("button", { onClick: () => {
          if (T === "saisir_num") {
            z(null);
            q("");
          } else if (T === "saisir_code") {
            z("saisir_num");
            h("");
            q("");
          } else if (T === "nouveau_pin") {
            z("saisir_code");
            D("");
            j("");
            q("");
          }
        }, style: { background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, color: s.muted, fontFamily: "Plus Jakarta Sans", display: "flex", alignItems: "center", gap: 6, marginTop: 8, padding: "8px 0" }, children: [
          /* @__PURE__ */ (0, o.jsx)(_, { n: "back", s: 14, c: s.muted }),
          "Retour"
        ] }),
        /* @__PURE__ */ (0, o.jsx)("div", { style: { height: 24 } })
      ] })
    ] });
    return /* @__PURE__ */ (0, o.jsxs)("div", { className: "scr on", style: { display: "flex", flexDirection: "column" }, children: [
      /* @__PURE__ */ (0, o.jsxs)("div", { style: { background: "linear-gradient(160deg,#1C1917,#292524)", padding: "36px 28px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }, children: [
        /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 60, height: 60, borderRadius: "50%", background: "conic-gradient(from 0deg,#F97316,#16A34A,#fff,#F97316)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }, children: /* @__PURE__ */ (0, o.jsx)("div", { style: { position: "absolute", inset: 3, borderRadius: "50%", background: "#1C1917", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ (0, o.jsx)("span", { style: { fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 17, color: "#fff" }, children: "A" }) }) }),
        /* @__PURE__ */ (0, o.jsx)("p", { style: { fontFamily: "Sora,sans-serif", fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-.5px" }, children: "Bon retour \u{1F44B}" }),
        /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, color: "rgba(255,255,255,.5)", textAlign: "center" }, children: "Connectez-vous avec votre num\xE9ro et votre code d'acc\xE8s" })
      ] }),
      /* @__PURE__ */ (0, o.jsxs)("div", { className: "isc", style: { flex: 1, paddingBottom: 0 }, children: [
        /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 12, marginTop: 20, marginBottom: 16 }, children: [
          /* @__PURE__ */ (0, o.jsx)("div", { style: { flex: 1, height: 1, background: s.surfH } }),
          /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 11, color: s.faint, fontWeight: 600 }, children: "Connexion" }),
          /* @__PURE__ */ (0, o.jsx)("div", { style: { flex: 1, height: 1, background: s.surfH } })
        ] }),
        /* @__PURE__ */ (0, o.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }, children: /* @__PURE__ */ (0, o.jsxs)("div", { className: "if", children: [
          /* @__PURE__ */ (0, o.jsx)(_, { n: "phone", s: 18, c: s.faint }),
          /* @__PURE__ */ (0, o.jsx)(
            "input",
            {
              type: "tel",
              value: u,
              onChange: (O) => {
                c(O.target.value.replace(/\D/g, "").slice(0, 10));
                v("");
              },
              placeholder: "Num\xE9ro de t\xE9l\xE9phone (10 chiffres)",
              maxLength: 10,
              style: { letterSpacing: u.length > 0 ? "1px" : "normal" }
            }
          ),
          u.length === 10 && /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 12, color: s.green, fontWeight: 700 }, children: "\u2713" })
        ] }) }),
        /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 11, fontWeight: 700, color: s.muted, marginBottom: 8, textAlign: "center" }, children: "Code d'acc\xE8s (6 chiffres)" }),
        /* @__PURE__ */ (0, o.jsx)("div", { style: { display: "flex", justifyContent: "center", gap: 8, marginBottom: 14 }, children: [0, 1, 2, 3, 4, 5].map((O) => /* @__PURE__ */ (0, o.jsx)(
          "input",
          {
            id: `loginpin-${O}`,
            type: "password",
            inputMode: "numeric",
            maxLength: 1,
            value: r[O] || "",
            onChange: (H) => {
              const ce = H.target.value.replace(/\D/g, "").slice(0, 1);
              const re = r.split("");
              re[O] = ce;
              const Fe = re.join("").slice(0, 6);
              Ht(Fe);
              if (ce && O < 5) document.getElementById(`loginpin-${O + 1}`)?.focus();
            },
            onKeyDown: (H) => {
              if (H.key === "Backspace" && !r[O] && O > 0) document.getElementById(`loginpin-${O - 1}`)?.focus();
            },
            style: { width: 42, height: 50, borderRadius: 12, border: `2px solid ${r.length > O ? s.orange : s.surfH}`, textAlign: "center", fontSize: 20, fontWeight: 800, fontFamily: "Sora,sans-serif", color: s.ink, outline: "none", background: "#fff" }
          },
          O
        )) }),
        /* @__PURE__ */ (0, o.jsx)(
          "button",
          {
            onClick: () => {
              z("saisir_num");
              f(u);
              q("");
            },
            style: { background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, color: s.orange, fontFamily: "Plus Jakarta Sans", marginBottom: 14, display: "block", textAlign: "right", width: "100%" },
            children: "Code d'acc\xE8s oubli\xE9 ?"
          }
        ),
        m && /* @__PURE__ */ (0, o.jsx)("div", { style: { background: "#FFF1F2", border: "1px solid rgba(190,18,60,.2)", borderRadius: 12, padding: "10px 14px", marginBottom: 12 }, children: /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, color: "#BE123C", fontWeight: 600 }, children: m }) }),
        /* @__PURE__ */ (0, o.jsx)("button", { className: "btn btn-p", onClick: () => V(r), style: { opacity: p ? 0.7 : 1 }, children: p ? /* @__PURE__ */ (0, o.jsxs)(o.Fragment, { children: [
          /* @__PURE__ */ (0, o.jsx)("span", { style: { display: "inline-block", animation: "spin 1s linear infinite" }, children: "\u27F3" }),
          " Connexion..."
        ] }) : /* @__PURE__ */ (0, o.jsxs)(o.Fragment, { children: [
          "Se connecter ",
          /* @__PURE__ */ (0, o.jsx)(_, { n: "arrow", s: 16, c: "#fff" })
        ] }) }),
        /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }, children: [
          /* @__PURE__ */ (0, o.jsx)("div", { style: { flex: 1, height: 1, background: s.surfH } }),
          /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 11, color: s.faint, fontWeight: 600 }, children: "Pas encore de compte ?" }),
          /* @__PURE__ */ (0, o.jsx)("div", { style: { flex: 1, height: 1, background: s.surfH } })
        ] }),
        /* @__PURE__ */ (0, o.jsx)("button", { className: "btn btn-g", onClick: () => e("signup"), children: "Cr\xE9er un compte" }),
        /* @__PURE__ */ (0, o.jsx)("div", { style: { height: 24 } })
      ] })
    ] });
  };
  var Kh = ({ onClose: e, onPay: t }) => /* @__PURE__ */ (0, o.jsx)("div", { style: { position: "absolute", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 99, display: "flex", alignItems: "flex-end" }, onClick: e, children: /* @__PURE__ */ (0, o.jsxs)("div", { style: { width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "28px 24px 32px", animation: "stin 280ms var(--eo)" }, onClick: (n) => n.stopPropagation(), children: [
    /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 40, height: 4, borderRadius: 2, background: s.surfH, margin: "0 auto 20px" } }),
    /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 56, height: 56, borderRadius: 16, background: s.orangeL, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 28 }, children: "\u2B50" }),
    /* @__PURE__ */ (0, o.jsx)("p", { style: { fontFamily: "Sora,sans-serif", fontSize: 20, fontWeight: 800, color: s.ink, textAlign: "center", marginBottom: 8 }, children: "Fonctionnalit\xE9 Premium" }),
    /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 13, color: s.muted, textAlign: "center", lineHeight: 1.6, marginBottom: 20 }, children: "Cette rubrique est r\xE9serv\xE9e aux abonn\xE9s Premium." }),
    /* @__PURE__ */ (0, o.jsx)("div", { style: { background: s.surf, borderRadius: 14, padding: "12px 14px", marginBottom: 18 }, children: [{ ic: "\u2B50", lb: "Forfait annuel", px: "3 000 FCFA / an" }, { ic: "\u{1F504}", lb: "Forfait mensuel", px: "1 000 FCFA / mois" }].map((n, a) => /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "4px 0" }, children: [
      /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 18 }, children: n.ic }),
      /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 13, fontWeight: 600, color: s.ink, flex: 1 }, children: n.lb }),
      /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 12, fontWeight: 700, color: s.orange }, children: n.px })
    ] }, a)) }),
    /* @__PURE__ */ (0, o.jsxs)("button", { className: "btn btn-p", onClick: t, children: [
      "S'abonner ",
      /* @__PURE__ */ (0, o.jsx)(_, { n: "arrow", s: 16, c: "#fff" })
    ] }),
    /* @__PURE__ */ (0, o.jsx)("button", { className: "btn btn-g", style: { marginTop: 8 }, onClick: e, children: "Plus tard" })
  ] }) });
  var Wh = ({ go: e, plan: t = "gratuit", userInfo: n = {}, essai: a = null }) => {
    const [l, i] = (0, S.useState)(false);
    const u = (m) => ({ animationDelay: `${m * 60}ms` });
    const c = n.nm || "Bienvenue";
    const r = c.split(" ").map((m) => m[0] || "").join("").slice(0, 2).toUpperCase() || "??";
    const g = (m) => {
      const v = ["violence", "enlevement"];
      if (t === "gratuit" && v.includes(m)) {
        i(true);
      } else {
        e(m);
      }
    };
    return /* @__PURE__ */ (0, o.jsxs)("div", { className: "scr on", style: { display: "flex", position: "relative" }, children: [
      l && /* @__PURE__ */ (0, o.jsx)(Kh, { onClose: () => i(false), onPay: () => {
        i(false);
        e("paiement");
      } }),
      /* @__PURE__ */ (0, o.jsxs)("div", { className: "scrl", children: [
        /* @__PURE__ */ (0, o.jsxs)("div", { className: "hdr", children: [
          /* @__PURE__ */ (0, o.jsxs)("div", { children: [
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 13, color: s.muted, fontWeight: 500 }, children: "Bonjour \u{1F44B}" }),
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontFamily: "Sora,sans-serif", fontSize: 22, fontWeight: 800, color: s.ink, letterSpacing: "-.5px", marginTop: 2 }, children: c })
          ] }),
          /* @__PURE__ */ (0, o.jsx)("button", { className: "av", onClick: () => e("profil"), children: r })
        ] }),
        t === "gratuit" && /* @__PURE__ */ (0, o.jsx)("div", { className: "si", style: u(0), children: /* @__PURE__ */ (0, o.jsxs)("div", { className: "bnr", children: [
          /* @__PURE__ */ (0, o.jsx)("p", { className: "bl", children: "\u2726 FORFAIT GRATUIT" }),
          /* @__PURE__ */ (0, o.jsx)("p", { className: "bt", children: "Passez au Premium" }),
          /* @__PURE__ */ (0, o.jsx)("p", { className: "bd", children: "Acc\xE9dez \xE0 Alerte Violence et \xE0 Alerte Enl\xE8vement \u2014 3 000 FCFA/an." }),
          /* @__PURE__ */ (0, o.jsxs)("button", { className: "sbb", onClick: () => e("paiement"), children: [
            "S'abonner ",
            /* @__PURE__ */ (0, o.jsx)(_, { n: "arrow", s: 14, c: "#fff" })
          ] })
        ] }) }),
        t === "premium" && a && a.actif && /* @__PURE__ */ (0, o.jsxs)("div", { className: "si", style: { ...u(0), margin: "16px 20px 0", background: "linear-gradient(135deg,#7C2D12,#C2410C)", borderRadius: 24, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }, children: [
          /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 24 }, children: "\u{1F381}" }),
          /* @__PURE__ */ (0, o.jsxs)("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.75)", textTransform: "uppercase", letterSpacing: "1px" }, children: "Essai gratuit actif" }),
            /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 14, fontWeight: 800, color: "#fff", marginTop: 2 }, children: [
              a.joursRestants <= 1 ? "Dernier jour" : `Encore ${a.joursRestants} jours`,
              " d'acc\xE8s \xE0 Alerte Violence et Alerte Enl\xE8vement"
            ] }),
            /* @__PURE__ */ (0, o.jsxs)("button", { className: "sbb", style: { marginTop: 8, background: "rgba(255,255,255,.18)" }, onClick: () => e("paiement"), children: [
              "S'abonner maintenant ",
              /* @__PURE__ */ (0, o.jsx)(_, { n: "arrow", s: 14, c: "#fff" })
            ] })
          ] })
        ] }),
        t === "premium" && (!a || !a.actif) && /* @__PURE__ */ (0, o.jsxs)("div", { className: "si", style: { ...u(0), margin: "16px 20px 0", background: "linear-gradient(135deg,#064E3B,#065F46)", borderRadius: 24, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }, children: [
          /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 24 }, children: "\u2B50" }),
          /* @__PURE__ */ (0, o.jsxs)("div", { children: [
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.6)", textTransform: "uppercase", letterSpacing: "1px" }, children: "Forfait Premium actif" }),
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 14, fontWeight: 800, color: "#fff", marginTop: 2 }, children: "Acc\xE8s complet \xE0 Alerte Violence et Alerte Enl\xE8vement" })
          ] })
        ] }),
        /* @__PURE__ */ (0, o.jsx)("div", { className: "sh", style: { marginTop: 8 }, children: /* @__PURE__ */ (0, o.jsx)("span", { className: "stl", children: "Acc\xE8s rapide" }) }),
        /* @__PURE__ */ (0, o.jsx)("div", { className: "qa", children: [
          {
            sc: "violence",
            lock: t === "gratuit",
            bg: t === "gratuit" ? "linear-gradient(135deg,#94A3B8,#64748B)" : "linear-gradient(135deg,#FF6B35,#F97316)",
            svg: /* @__PURE__ */ (0, o.jsxs)("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", children: [
              /* @__PURE__ */ (0, o.jsx)("path", { d: "M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17a1 1 0 001 1h6a1 1 0 001-1v-2.26C17.81 13.47 19 11.38 19 9c0-3.87-3.13-7-7-7z", fill: "#fff", opacity: ".9" }),
              /* @__PURE__ */ (0, o.jsx)("path", { d: "M9 21h6M10 18v3M14 18v3", stroke: "#fff", strokeWidth: "1.5", strokeLinecap: "round" })
            ] }),
            lb: "Alerte\nViolence"
          },
          {
            sc: "enlevement",
            lock: t === "gratuit",
            bg: t === "gratuit" ? "linear-gradient(135deg,#94A3B8,#64748B)" : "linear-gradient(135deg,#7C3AED,#5B21B6)",
            svg: /* @__PURE__ */ (0, o.jsxs)("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", children: [
              /* @__PURE__ */ (0, o.jsx)("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z", fill: "#fff", opacity: ".9" }),
              /* @__PURE__ */ (0, o.jsx)("circle", { cx: "12", cy: "10", r: "3", fill: "#5B21B6" })
            ] }),
            lb: "Alerte\nEnl\xE8vement"
          }
        ].map((m, v) => /* @__PURE__ */ (0, o.jsxs)(
          "button",
          {
            className: "qb si",
            style: {
              ...u(v + 1),
              position: "relative",
              background: m.bg,
              borderRadius: 18,
              padding: "16px 10px 12px",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              boxShadow: `0 4px 14px ${m.lock ? "rgba(100,116,139,.3)" : "rgba(0,0,0,.12)"}`
            },
            onClick: () => g(m.sc),
            children: [
              /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center" }, children: m.svg }),
              /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 11, fontWeight: 700, color: "#fff", textAlign: "center", lineHeight: 1.3, whiteSpace: "pre-line", opacity: 0.95 }, children: m.lb }),
              m.lock && /* @__PURE__ */ (0, o.jsx)("div", { style: { position: "absolute", top: 6, right: 6, width: 18, height: 18, borderRadius: "50%", background: "rgba(0,0,0,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }, children: "\u{1F512}" })
            ]
          },
          v
        )) }),
        /* @__PURE__ */ (0, o.jsx)("div", { style: { height: 20 } })
      ] }),
      /* @__PURE__ */ (0, o.jsx)(hl, { a: "home", go: e })
    ] });
  };
  var $h = ({ go: e, goBack: t, userInfo: n = {} }) => {
    const a = n.nm && n.nm.trim() ? n.nm.trim() : "l'utilisateur";
    const [l, i] = (0, S.useState)(false);
    const [u, c] = (0, S.useState)(false);
    const [r, g] = (0, S.useState)(false);
    const [m, v] = (0, S.useState)(null);
    const p = (0, S.useRef)(null);
    const y = (0, S.useRef)(null);
    const T = (0, S.useRef)(null);
    const [z, U] = (0, S.useState)(null);
    const [f, d] = (0, S.useState)(false);
    const [h, b] = (0, S.useState)(false);
    const k = (0, S.useRef)(null);
    (0, S.useEffect)(() => {
      if (navigator.geolocation) {
        d(true);
        navigator.geolocation.getCurrentPosition(
          (x) => {
            U({ lat: x.coords.latitude, lng: x.coords.longitude, acc: Math.round(x.coords.accuracy) });
            d(false);
          },
          () => {
            d(false);
          },
          { timeout: 1e4, enableHighAccuracy: true }
        );
      }
    }, []);
    (0, S.useEffect)(() => {
      if (h && l) {
        k.current = setInterval(() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (x) => U({ lat: x.coords.latitude, lng: x.coords.longitude, acc: Math.round(x.coords.accuracy) }),
              () => {
              },
              { timeout: 5e3, enableHighAccuracy: true, maximumAge: 0 }
            );
          }
        }, 1e4);
      } else {
        clearInterval(k.current);
      }
      return () => clearInterval(k.current);
    }, [h, l]);
    const D = () => {
      try {
        const C = Ei();
        if (!C) return;
        try {
          if (C.state === "suspended") C.resume();
        } catch (R) {
        }
        const w = C.createDynamicsCompressor();
        w.threshold.value = -6;
        w.knee.value = 0;
        w.ratio.value = 20;
        w.attack.value = 0;
        w.release.value = 0.05;
        w.connect(C.destination);
        const M = (R) => {
          [[1400, 0], [1402, 0], [1398, 0], [1e3, 0], [1002, 0]].forEach(([F]) => {
            [
              [1400, R, 0.05],
              [1e3, R + 0.1, 0.05],
              [1400, R + 0.2, 0.05],
              [1e3, R + 0.3, 0.05],
              [1400, R + 0.4, 0.05],
              [1e3, R + 0.5, 0.05],
              [1400, R + 0.6, 0.05],
              [1e3, R + 0.7, 0.05]
            ];
          });
          [
            [1400, R, 0.05],
            [1e3, R + 0.1, 0.05],
            [1400, R + 0.2, 0.05],
            [1e3, R + 0.3, 0.05],
            [1400, R + 0.4, 0.05],
            [1e3, R + 0.5, 0.05],
            [1400, R + 0.6, 0.05],
            [1e3, R + 0.7, 0.05]
          ].forEach(([F, ue, ne]) => {
            const ee = C.createOscillator(), ge = C.createGain();
            ee.connect(ge);
            ge.connect(w);
            ee.type = "square";
            ee.frequency.value = F;
            ge.gain.setValueAtTime(0, C.currentTime + ue);
            ge.gain.linearRampToValueAtTime(1, C.currentTime + ue + 2e-3);
            ge.gain.linearRampToValueAtTime(0, C.currentTime + ue + ne);
            ee.start(C.currentTime + ue);
            ee.stop(C.currentTime + ue + ne + 2e-3);
            const Me = C.createOscillator(), te = C.createGain();
            Me.connect(te);
            te.connect(w);
            Me.type = "sawtooth";
            Me.frequency.value = F * 1.002;
            te.gain.setValueAtTime(0, C.currentTime + ue);
            te.gain.linearRampToValueAtTime(0.8, C.currentTime + ue + 2e-3);
            te.gain.linearRampToValueAtTime(0, C.currentTime + ue + ne);
            Me.start(C.currentTime + ue);
            Me.stop(C.currentTime + ue + ne + 2e-3);
          });
        };
        for (let R = 0; R < 4; R++) M(R * 0.85);
      } catch (C) {
      }
      if (navigator.vibrate) {
        navigator.vibrate([300, 100, 300, 100, 600, 200, 300, 100, 300, 100, 600]);
      }
      const x = (C) => {
        try {
          const w = C ? `\u{1F4CD} GPS : ${C.lat.toFixed(5)}, ${C.lng.toFixed(5)} (\xB1${C.acc}m)` : "\u{1F4CD} Position GPS non disponible";
          new Notification("\u{1F6A8} ALERTE CI \u2014 URGENCE", {
            body: `\u26A0\uFE0F ${a} EST EN DANGER !
Appellez-la imm\xE9diatement.
${w}`,
            icon: "/favicon.ico",
            badge: "/favicon.ico",
            tag: "alerte-violence",
            requireInteraction: true,
            silent: false
          });
        } catch (w) {
        }
      };
      if (typeof Notification !== "undefined") {
        if (Notification.permission === "granted") {
          x(null);
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((C) => {
            if (C === "granted") x(null);
          });
        }
      }
      setTimeout(() => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const C = `Alerte urgente ! ${a} est en danger ! Appelez-la imm\xE9diatement !`;
        const w = new SpeechSynthesisUtterance(C);
        const M = window.speechSynthesis.getVoices();
        const R = M.find((F) => F.lang === "fr-FR" && F.name.toLowerCase().includes("google")) || M.find((F) => F.lang === "fr-FR" && !F.name.toLowerCase().includes("compact")) || M.find((F) => F.lang.startsWith("fr")) || M[0];
        if (R) w.voice = R;
        w.lang = "fr-FR";
        w.rate = 0.82;
        w.pitch = 0.9;
        w.volume = 1;
        window.speechSynthesis.speak(w);
      }, 900);
    };
    const [E, j] = (0, S.useState)(() => {
      try {
        const x = window.localStorage.getItem("alerteci_contacts_violence");
        return x ? JSON.parse(x) : [];
      } catch (x) {
        return [];
      }
    });
    (0, S.useEffect)(() => {
      try {
        window.localStorage.setItem("alerteci_contacts_violence", JSON.stringify(E));
      } catch (x) {
      }
    }, [E]);
    const [L, q] = (0, S.useState)(false);
    const [Y, Ue] = (0, S.useState)(null);
    const Le = ["#F97316", "#3B82F6", "#16A34A", "#8B5CF6", "#EC4899", "#EF4444"];
    const [st, B] = (0, S.useState)(null);
    const $ = () => {
      if (!Y || !Y.nm.trim() || Y.ph.length < 10) return;
      const x = Y.nm.trim().split(" ").map((R) => R[0]).join("").slice(0, 2).toUpperCase();
      const C = Le[Y.idx !== void 0 ? Y.idx % Le.length : E.length % Le.length];
      if (Y.idx !== void 0) {
        j((R) => R.map((F, ue) => ue === Y.idx ? { nm: Y.nm.trim(), ph: Y.ph, c: C, in: x } : F));
      } else {
        if (E.length >= 3) return;
        j((R) => [...R, { nm: Y.nm.trim(), ph: Y.ph, c: C, in: x }]);
      }
      const w = Y.nm.trim();
      const M = () => {
        try {
          new Notification("\u{1F6E1}\uFE0F ALERTE CI \u2014 Contact d'urgence", {
            body: `Bonjour ${w} ! Vous avez \xE9t\xE9 d\xE9sign\xE9(e) contact d'urgence par ${a}. Vous recevrez une alerte imm\xE9diate en cas de danger.`,
            tag: `urgence-violence-${Y.ph}`,
            requireInteraction: true
          });
        } catch (R) {
        }
      };
      if (typeof Notification !== "undefined") {
        if (Notification.permission === "granted") M();
        else if (Notification.permission !== "denied") Notification.requestPermission().then((R) => {
          if (R === "granted") M();
        });
      }
      Ue(null);
      B(w);
      setTimeout(() => B(null), 3500);
      wt();
    };
    const J = (x) => {
      j((C) => C.filter((w, M) => M !== x));
    };
    const he = (0, S.useRef)(null);
    const Ne = (0, S.useRef)(null);
    (0, S.useEffect)(() => {
      if (!l) return;
      const x = setInterval(() => {
        const C = bg();
        if (C && !C.ok && he.current) V(Ne.current);
      }, 1e4);
      return () => clearInterval(x);
    }, [l]);
    const V = (x) => {
      if (x) Ne.current = x;
      if (x) U(x);
      if (!he.current) he.current = `urg-${Date.now()}`;
      fu({
        type: "violence",
        alerteId: he.current,
        victime: { nm: a, ph: n.ph || "" },
        cibles: E.map((C) => C.ph),
        gps: x || null,
        lienMaps: x ? `https://maps.google.com/?q=${x.lat},${x.lng}` : null,
        ts: Date.now()
      });
    };
    const Ht = () => {
      try {
        window.speechSynthesis && window.speechSynthesis.cancel();
      } catch (x) {
      }
      clearInterval(y.current);
      clearInterval(k.current);
      p.current && p.current.stop();
      if (he.current) {
        fu({
          type: "violence",
          fin: true,
          alerteId: he.current,
          victime: { nm: a, ph: n.ph || "" },
          cibles: E.map((x) => x.ph),
          ts: Date.now()
        });
        he.current = null;
      }
      i(false);
      g(false);
      b(false);
      v(null);
    };
    const O = () => {
      i(true);
      g(true);
      b(true);
      d(true);
      const x = (C) => {
        d(false);
        V(C);
        y.current = setInterval(() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (w) => V({
                lat: w.coords.latitude,
                lng: w.coords.longitude,
                acc: Math.round(w.coords.accuracy)
              }),
              () => V(null),
              // envoie sans position si GPS indisponible
              { timeout: 5e3, enableHighAccuracy: true, maximumAge: 0 }
            );
          } else {
            V(null);
          }
        }, 3e4);
      };
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (C) => {
            const w = {
              lat: C.coords.latitude,
              lng: C.coords.longitude,
              acc: Math.round(C.coords.accuracy)
            };
            x(w);
          },
          () => {
            x(null);
          },
          { timeout: 8e3, enableHighAccuracy: true, maximumAge: 0 }
        );
      } else {
        x(null);
      }
    };
    const [H, ce] = (0, S.useState)(() => {
      const x = (C) => {
        try {
          const w = window.localStorage.getItem("alerteci_cri_" + C);
          if (!w) return null;
          const M = JSON.parse(w);
          if (!M || !M.b64) return null;
          return { url: M.b64, duree: M.duree || 1, empreinte: M.empreinte || null };
        } catch (w) {
          return null;
        }
      };
      return [x(0), x(1)];
    });
    const [re, Fe] = (0, S.useState)(null);
    const [Ti, N] = (0, S.useState)(false);
    const Z = (0, S.useRef)(null);
    const ae = (0, S.useRef)([]);
    const oe = (0, S.useRef)(null);
    const Be = (0, S.useRef)(0);
    const [yl, xa] = (0, S.useState)(["", ""]);
    const [oy, Tg] = (0, S.useState)([false, false]);
    const [pu, gu] = (0, S.useState)(null);
    const vl = (0, S.useRef)(null);
    const [kg, Sa] = (0, S.useState)(false);
    const Dg = async (x) => {
      Sa(false);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
        Sa(true);
        return;
      }
      za();
      Fe(x);
      N(false);
      let C;
      const w = setTimeout(() => {
        N(false);
        Fe((ne) => ne === x ? null : ne);
        Sa(true);
        try {
          oe.current && oe.current.getTracks().forEach((ne) => ne.stop());
        } catch (ne) {
        }
      }, 12e3);
      try {
        C = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (ne) {
        clearTimeout(w);
        N(false);
        Fe(null);
        Sa(true);
        return;
      }
      clearTimeout(w);
      oe.current = C;
      N(true);
      ae.current = [];
      Be.current = Date.now();
      const M = [];
      let R = null, F = null;
      try {
        R = Ei();
        if (R && R.state === "suspended") R.resume();
        const ne = R.createMediaStreamSource(C);
        const ee = R.createAnalyser();
        ee.fftSize = 1024;
        ee.smoothingTimeConstant = 0.3;
        ne.connect(ee);
        const ge = new Uint8Array(ee.frequencyBinCount);
        const Me = new Uint8Array(ee.frequencyBinCount);
        const te = () => {
          ee.getByteTimeDomainData(ge);
          let qe = 0;
          for (let Xe = 0; Xe < ge.length; Xe++) {
            const ve = (ge[Xe] - 128) / 128;
            qe += ve * ve;
          }
          if (Math.sqrt(qe / ge.length) >= 0.1) {
            ee.getByteFrequencyData(Me);
            const Xe = 32, ve = Math.floor(Me.length / Xe), nt = [];
            for (let Kt = 0; Kt < Xe; Kt++) {
              let Wt = 0;
              for (let bu = 0; bu < ve; bu++) Wt += Me[Kt * ve + bu];
              nt.push(Wt / ve);
            }
            M.push(nt);
          }
          F = requestAnimationFrame(te);
        };
        F = requestAnimationFrame(te);
      } catch (ne) {
      }
      let ue;
      try {
        ue = new window.MediaRecorder(C);
      } catch (ne) {
        C.getTracks().forEach((ee) => ee.stop());
        N(false);
        Fe(null);
        Sa(true);
        return;
      }
      ue.ondataavailable = (ne) => {
        if (ne.data && ne.data.size > 0) ae.current.push(ne.data);
      };
      ue.onstop = () => {
        try {
          cancelAnimationFrame(F);
        } catch (te) {
        }
        const ne = Math.max(0.1, (Date.now() - Be.current) / 1e3);
        const ee = new Blob(ae.current, { type: ue.mimeType || "audio/webm" });
        const ge = URL.createObjectURL(ee);
        let Me = null;
        if (M.length >= 3) {
          const te = M[0].length;
          const qe = new Array(te).fill(0);
          M.forEach((ve) => {
            for (let nt = 0; nt < te; nt++) qe[nt] += ve[nt];
          });
          for (let ve = 0; ve < te; ve++) qe[ve] /= M.length;
          const Xe = qe.reduce((ve, nt) => ve + nt, 0) || 1;
          Me = qe.map((ve) => ve / Xe);
        }
        ce((te) => {
          const qe = [...te];
          qe[x] = { url: ge, duree: ne, empreinte: Me };
          return qe;
        });
        try {
          const te = new FileReader();
          te.onload = () => {
            try {
              const qe = "alerteci_cri_" + x;
              window.localStorage.setItem(qe, JSON.stringify({ b64: te.result, duree: ne, empreinte: Me }));
            } catch (qe) {
            }
          };
          te.readAsDataURL(ee);
        } catch (te) {
        }
        N(false);
        Fe(null);
        try {
          C.getTracks().forEach((te) => te.stop());
        } catch (te) {
        }
        wt();
      };
      Z.current = ue;
      try {
        ue.start();
        setTimeout(() => {
          try {
            if (ue.state === "recording") ue.stop();
          } catch (ne) {
          }
        }, 5e3);
      } catch (ne) {
        C.getTracks().forEach((ee) => ee.stop());
        N(false);
        Fe(null);
        Sa(true);
      }
    };
    const uy = (x) => {
      try {
        if (Z.current && Z.current.state === "recording") Z.current.stop();
      } catch (C) {
      }
    };
    const cy = (x) => {
      const C = yl[x].trim().toLowerCase();
      if (!C) return;
      ce((w) => {
        const M = [...w];
        M[x] = { texte: C };
        return M;
      });
      xa((w) => {
        const M = [...w];
        M[x] = "";
        return M;
      });
      Tg((w) => {
        const M = [...w];
        M[x] = false;
        return M;
      });
      wt();
    };
    const Ng = () => {
      try {
        Z.current && Z.current.state === "recording" && Z.current.stop();
      } catch (x) {
      }
      try {
        oe.current && oe.current.getTracks().forEach((x) => x.stop());
      } catch (x) {
      }
      N(false);
      Fe(null);
    };
    const bn = (0, S.useRef)(false);
    const [jt, Mg] = (0, S.useState)(() => {
      try {
        const x = window.localStorage.getItem("alerteci_detection_vocale");
        return x === null ? true : x === "1";
      } catch (x) {
        return true;
      }
    });
    (0, S.useEffect)(() => {
      try {
        window.localStorage.setItem("alerteci_detection_vocale", jt ? "1" : "0");
      } catch (x) {
      }
    }, [jt]);
    const ys = (0, S.useRef)(null);
    const vs = (0, S.useRef)(null);
    const ki = (0, S.useRef)(null);
    const Di = (0, S.useRef)(null);
    const mu = (0, S.useRef)(null);
    const xn = (0, S.useRef)(0);
    const Sn = (0, S.useRef)([]);
    const [hu, Ni] = (0, S.useState)("");
    const [yu, vu] = (0, S.useState)(false);
    const [bs, Rg] = (0, S.useState)([]);
    const [St, xs] = (0, S.useState)(null);
    (0, S.useEffect)(() => {
      if (!l) {
        xs(null);
        return;
      }
      const x = () => {
        const w = bg();
        if (w) xs({ ...w });
      };
      x();
      const C = setInterval(x, 2e3);
      return () => clearInterval(C);
    }, [l]);
    const _g = [
      /* Cri aigu type « AAAAH ! » — énergie concentrée 700 Hz – 3 kHz */
      [0.03, 0.085, 0.13, 0.15, 0.14, 0.115, 0.09, 0.07, 0.05, 0.035, 0.026, 0.02, 0.015, 0.011, 8e-3, 6e-3, 5e-3, 4e-3, 3e-3, 2e-3, 2e-3, 1e-3, 1e-3, 1e-3, 0, 0, 0, 0, 0, 0, 0, 0],
      /* Appel puissant type « AU SECOURS ! » — énergie large 300 Hz – 2 kHz */
      [0.08, 0.145, 0.15, 0.125, 0.1, 0.08, 0.062, 0.048, 0.038, 0.03, 0.024, 0.019, 0.015, 0.012, 0.01, 8e-3, 6e-3, 5e-3, 4e-3, 3e-3, 3e-3, 2e-3, 2e-3, 2e-3, 1e-3, 1e-3, 1e-3, 1e-3, 0, 0, 0, 0]
    ];
    const Og = (x, C) => {
      if (!x || !C || x.length !== C.length) return 0;
      const w = x.length;
      let M = 0, R = 0;
      for (let ee = 0; ee < w; ee++) {
        M += x[ee];
        R += C[ee];
      }
      M /= w;
      R /= w;
      let F = 0, ue = 0, ne = 0;
      for (let ee = 0; ee < w; ee++) {
        const ge = x[ee] - M, Me = C[ee] - R;
        F += ge * Me;
        ue += ge * ge;
        ne += Me * Me;
      }
      if (ue < 1e-9 || ne < 1e-9) return 0;
      return F / Math.sqrt(ue * ne);
    };
    const wg = (x) => {
      if (!x.length) return null;
      const C = x[0].length;
      const w = new Array(C).fill(0);
      x.forEach((R) => {
        for (let F = 0; F < C; F++) w[F] += R[F];
      });
      for (let R = 0; R < C; R++) w[R] /= x.length;
      const M = w.reduce((R, F) => R + F, 0) || 1;
      return w.map((R) => R / M);
    };
    const Ss = async () => {
      if (bn.current) return;
      Ni("");
      bn.current = true;
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        Ni("Le micro n'est pas accessible sur cet appareil.");
        c(false);
        bn.current = false;
        return;
      }
      let x;
      try {
        x = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      } catch (te) {
        Ni("Micro refus\xE9. Autorisez le microphone dans les r\xE9glages pour activer la protection vocale.");
        c(false);
        bn.current = false;
        return;
      }
      ki.current = x;
      const C = Ei();
      if (!C) {
        Ni("Analyse audio indisponible sur cet appareil.");
        c(false);
        bn.current = false;
        try {
          x.getTracks().forEach((te) => te.stop());
        } catch (te) {
        }
        return;
      }
      ys.current = C;
      try {
        if (C.state === "suspended") await C.resume();
      } catch (te) {
      }
      const w = C.createMediaStreamSource(x);
      Di.current = w;
      const M = C.createAnalyser();
      M.fftSize = 1024;
      M.smoothingTimeConstant = 0.3;
      w.connect(M);
      vs.current = M;
      c(true);
      xn.current = 0;
      Sn.current = [];
      const R = new Uint8Array(M.frequencyBinCount);
      const F = new Uint8Array(M.frequencyBinCount);
      const ue = 0.13;
      const ne = 5;
      const ee = 0.45;
      const ge = () => {
        M.getByteFrequencyData(F);
        const te = 32, qe = Math.floor(F.length / te), Xe = [];
        for (let ve = 0; ve < te; ve++) {
          let nt = 0;
          for (let Kt = 0; Kt < qe; Kt++) nt += F[ve * qe + Kt];
          Xe.push(nt / qe);
        }
        return Xe;
      };
      const Me = () => {
        if (!bn.current) {
          return;
        }
        M.getByteTimeDomainData(R);
        let te = 0;
        for (let Xe = 0; Xe < R.length; Xe++) {
          const ve = (R[Xe] - 128) / 128;
          te += ve * ve;
        }
        const qe = Math.sqrt(te / R.length);
        if (qe >= ue) {
          xn.current++;
          Sn.current.push(ge());
          if (Sn.current.length > 40) Sn.current.shift();
          if (xn.current >= ne && !l) {
            const Xe = [
              ..._g,
              ...(zs.current || []).filter((Wt) => Wt && Wt.empreinte).map((Wt) => Wt.empreinte)
            ];
            const ve = wg(Sn.current);
            const nt = Math.max(...Xe.map((Wt) => Og(ve, Wt)));
            const Kt = nt >= ee;
            if (Kt) {
              za();
              O();
              return;
            }
            xn.current = 0;
            Sn.current = [];
          }
        } else {
          xn.current = Math.max(0, xn.current - 1);
          if (xn.current === 0) Sn.current = [];
        }
        mu.current = requestAnimationFrame(Me);
      };
      mu.current = requestAnimationFrame(Me);
    };
    const za = () => {
      bn.current = false;
      try {
        cancelAnimationFrame(mu.current);
      } catch (x) {
      }
      try {
        ki.current && ki.current.getTracks().forEach((x) => x.stop());
      } catch (x) {
      }
      try {
        Di.current && Di.current.disconnect();
      } catch (x) {
      }
      ys.current = null;
      vs.current = null;
      ki.current = null;
      Di.current = null;
      xn.current = 0;
      Sn.current = [];
      c(false);
    };
    const zs = (0, S.useRef)(null);
    (0, S.useEffect)(() => {
      zs.current = H;
    }, [H]);
    (0, S.useEffect)(() => {
      _stopperMicroEcoute = za;
      if (!jt) {
        za();
        return;
      }
      const x = () => {
        try {
          return !!$n;
        } catch (M) {
          return false;
        }
      };
      const C = setInterval(() => {
        if (jt && !bn.current && !l && re === null && !x()) {
          Ss();
        }
      }, 2500);
      const w = setTimeout(() => {
        if (jt && !l && re === null && !x()) Ss();
      }, 600);
      return () => {
        clearInterval(C);
        clearTimeout(w);
        _stopperMicroEcoute = null;
        za();
      };
    }, [l, re, jt]);
    (0, S.useEffect)(() => () => {
      clearInterval(y.current);
      window.speechSynthesis && window.speechSynthesis.cancel();
      p.current && p.current.stop();
      try {
        Z.current && Z.current.state === "recording" && Z.current.stop();
      } catch (x) {
      }
      try {
        oe.current && oe.current.getTracks().forEach((x) => x.stop());
      } catch (x) {
      }
    }, []);
    return /* @__PURE__ */ (0, o.jsxs)("div", { className: "scr on", style: { display: "flex", position: "relative" }, children: [
      m && /* @__PURE__ */ (0, o.jsx)("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 99, display: "flex", flexDirection: "column", animation: "stin 200ms var(--eo)" }, children: /* @__PURE__ */ (0, o.jsxs)("div", { style: { background: "linear-gradient(160deg,#0F0F1A,#1A0A0A)", flex: 1, display: "flex", flexDirection: "column", padding: "14px 28px 0" }, children: [
        /* @__PURE__ */ (0, o.jsx)("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.7)", marginBottom: 24 }, children: /* @__PURE__ */ (0, o.jsx)("span", { children: /* @__PURE__ */ (0, o.jsx)(us, {}) }) }),
        /* @__PURE__ */ (0, o.jsxs)("div", { style: { textAlign: "center", marginBottom: 20 }, children: [
          /* @__PURE__ */ (0, o.jsx)("p", { style: { fontFamily: "Sora,sans-serif", fontSize: 48, fontWeight: 800, color: "#fff", letterSpacing: "-2px" }, children: /* @__PURE__ */ (0, o.jsx)(us, {}) }),
          /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 13, color: "rgba(255,255,255,.55)", marginTop: 4 }, children: (/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) })
        ] }),
        /* @__PURE__ */ (0, o.jsxs)("div", { style: { background: "rgba(220,38,38,.96)", borderRadius: 20, padding: "0", overflow: "hidden" }, children: [
          /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "10px 16px 8px", borderBottom: "1px solid rgba(255,255,255,.15)" }, children: [
            /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 15 }, children: "\u{1F6A8}" }),
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,.9)", textTransform: "uppercase", letterSpacing: "1px" }, children: "ALERTE CI \u2014 URGENCE" }),
            /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 8, height: 8, borderRadius: "50%", background: "#fff", animation: "bk 0.8s ease infinite", marginLeft: "auto" } })
          ] }),
          /* @__PURE__ */ (0, o.jsxs)("div", { style: { padding: "14px 16px" }, children: [
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontFamily: "Sora,sans-serif", fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 6 }, children: "\u{1F198} ALERTE RE\xC7UE \u2014 URGENCE" }),
            /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.9)", lineHeight: 1.5, marginBottom: 10 }, children: [
              /* @__PURE__ */ (0, o.jsx)("strong", { style: { color: "#FFE4E4" }, children: a }),
              " est en danger !",
              /* @__PURE__ */ (0, o.jsx)("br", {}),
              "Appelez-la imm\xE9diatement."
            ] }),
            /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12, background: "rgba(0,0,0,.2)", borderRadius: 10, padding: "8px 12px" }, children: [
              /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 30, height: 30, borderRadius: "50%", background: m.c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0 }, children: m.in }),
              /* @__PURE__ */ (0, o.jsxs)("div", { children: [
                /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 10, color: "rgba(255,255,255,.6)" }, children: "Notification re\xE7ue par" }),
                /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, fontWeight: 700, color: "#fff" }, children: m.nm })
              ] })
            ] }),
            z && /* @__PURE__ */ (0, o.jsx)("div", { style: { marginBottom: 10 }, children: /* @__PURE__ */ (0, o.jsxs)(
              "a",
              {
                href: `https://www.google.com/maps?q=${z.lat},${z.lng}&z=17&hl=fr`,
                target: "_blank",
                rel: "noopener noreferrer",
                style: { display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: "rgba(22,163,74,.7)", borderRadius: 10, textDecoration: "none" },
                children: [
                  /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 12 }, children: "\u{1F4CD}" }),
                  /* @__PURE__ */ (0, o.jsxs)("span", { style: { fontSize: 11, fontWeight: 700, color: "#fff" }, children: [
                    "GPS : ",
                    z.lat.toFixed(4),
                    "\xB0, ",
                    z.lng.toFixed(4),
                    "\xB0 \xB7 Voir Maps"
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }, children: [
              /* @__PURE__ */ (0, o.jsxs)(
                "a",
                {
                  href: `tel:${E.find((x) => x.in === m.in)?.ph || ""}`,
                  style: { padding: "12px", borderRadius: 12, background: "#fff", color: "#DC2626", fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textDecoration: "none" },
                  children: [
                    /* @__PURE__ */ (0, o.jsx)(_, { n: "phone", s: 15, c: "#DC2626" }),
                    "Appeler"
                  ]
                }
              ),
              /* @__PURE__ */ (0, o.jsx)(
                "button",
                {
                  onClick: () => v(null),
                  style: { padding: "12px", borderRadius: 12, border: "1px solid rgba(255,255,255,.25)", background: "rgba(255,255,255,.1)", color: "#fff", fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 700, cursor: "pointer" },
                  children: "Fermer"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, o.jsx)("p", { style: { textAlign: "center", fontSize: 11, color: "rgba(255,255,255,.3)", padding: "20px 0", marginTop: "auto" }, children: "Glissez vers le haut pour d\xE9verrouiller" })
      ] }) }),
      /* @__PURE__ */ (0, o.jsxs)("div", { className: "scrl", children: [
        /* @__PURE__ */ (0, o.jsxs)("div", { className: "scrhdr", children: [
          /* @__PURE__ */ (0, o.jsx)("button", { className: "bk", onClick: t, children: /* @__PURE__ */ (0, o.jsx)(_, { n: "back", s: 18, c: l ? "#DC2626" : s.ink }) }),
          /* @__PURE__ */ (0, o.jsx)("p", { className: "scrttl", style: { color: l ? "#DC2626" : s.ink }, children: l ? "\u{1F534} ALARME ACTIVE" : "Alerte Violence" })
        ] }),
        l && /* @__PURE__ */ (0, o.jsxs)("div", { style: { margin: "0 20px 12px", background: "linear-gradient(135deg,#EF4444,#DC2626)", borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, animation: "stin 300ms var(--eo)" }, children: [
          /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, animation: "po 1.2s ease-out infinite" }, children: /* @__PURE__ */ (0, o.jsx)(_, { n: "alert", s: 20, c: "#fff" }) }),
          /* @__PURE__ */ (0, o.jsxs)("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 13, fontWeight: 800, color: "#fff" }, children: "\u{1F50A} ALARME EN COURS" }),
            /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 11, color: "rgba(255,255,255,.85)", marginTop: 2 }, children: [
              '"Alerte urgente ! ',
              a,
              ' est en danger !"'
            ] })
          ] }),
          /* @__PURE__ */ (0, o.jsx)(
            "button",
            {
              onClick: () => V(),
              style: { fontSize: 10, fontWeight: 700, color: "#fff", background: "rgba(255,255,255,.2)", border: "none", borderRadius: 10, padding: "5px 10px", cursor: "pointer", fontFamily: "Plus Jakarta Sans", flexShrink: 0 },
              children: "Voir notif contact"
            }
          )
        ] }),
        /* @__PURE__ */ (0, o.jsxs)("div", { className: "vhero", style: { background: l ? "linear-gradient(145deg,#7F1D1D,#991B1B)" : "linear-gradient(145deg,#7C2D12,#9A3412)" }, children: [
          /* @__PURE__ */ (0, o.jsx)("div", { className: "pr", children: /* @__PURE__ */ (0, o.jsx)("div", { className: "pi", style: { background: l ? "#DC2626" : s.orange }, children: /* @__PURE__ */ (0, o.jsx)(_, { n: "mic", s: 28, c: "#fff" }) }) }),
          /* @__PURE__ */ (0, o.jsx)("p", { className: "hl", children: u ? "\u{1F399}\uFE0F \xC9COUTE ACTIVE \u2014 micro ouvert" : "Signal vocal configur\xE9" }),
          /* @__PURE__ */ (0, o.jsx)("p", { className: "ht", children: l ? "\u26A1 Contacts alert\xE9s" : "Pr\xEAte \xE0 vous prot\xE9ger" }),
          /* @__PURE__ */ (0, o.jsx)("p", { className: "hd", children: l ? St && !St.ok ? `\u26A0\uFE0F PROBL\xC8ME DE TRANSMISSION \u2014 vos contacts n'ont PAS encore re\xE7u l'alerte.` : `Vos contacts d'urgence re\xE7oivent l'alerte dans leur application.` : `Activez l'\xE9coute automatique ou d\xE9clenchez manuellement. Message vocal : "Alerte urgente ! ${a} est en danger !"` })
        ] }),
        !l && /* @__PURE__ */ (0, o.jsxs)("div", { style: { margin: "0 20px 12px", background: "#fff", border: `1px solid ${s.border}`, borderRadius: 16, padding: "14px 16px" }, children: [
          /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, fontWeight: 800, color: s.ink, marginBottom: 4 }, children: "\u{1F399}\uFE0F Mes cris de d\xE9tresse" }),
          /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 11, color: s.muted, marginBottom: 8, lineHeight: 1.5 }, children: [
            "L'application reconna\xEEt d\xE9j\xE0 ",
            /* @__PURE__ */ (0, o.jsx)("strong", { children: "2 cris de d\xE9tresse par d\xE9faut" }),
            " (cri aigu, appel puissant). Vous pouvez y ajouter vos 2 propres cris (5s max chacun) pour une reconnaissance encore plus fiable. ",
            /* @__PURE__ */ (0, o.jsx)("strong", { children: "Seuls ces cris d\xE9clenchent l'alerte" }),
            " \u2014 silencieusement ici, avec sir\xE8ne chez vos contacts d'urgence."
          ] }),
          /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", gap: 6, marginBottom: 12 }, children: [
            /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 10, fontWeight: 800, background: s.greenL, color: "#166534", borderRadius: 8, padding: "4px 8px" }, children: "\u2705 Cri aigu (d\xE9faut)" }),
            /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 10, fontWeight: 800, background: s.greenL, color: "#166534", borderRadius: 8, padding: "4px 8px" }, children: "\u2705 Appel fort (d\xE9faut)" })
          ] }),
          /* @__PURE__ */ (0, o.jsx)("audio", { ref: vl, style: { display: "none" }, onEnded: () => gu(null) }),
          /* @__PURE__ */ (0, o.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [0, 1].map((x) => /* @__PURE__ */ (0, o.jsxs)("div", { style: { background: s.surf, borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }, children: [
            /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 32, height: 32, borderRadius: "50%", background: H[x] ? s.greenL : s.orangeL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }, children: H[x] ? "\u2705" : "\u{1F3A4}" }),
            /* @__PURE__ */ (0, o.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [
              /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 11, fontWeight: 700, color: s.muted, textTransform: "uppercase", letterSpacing: ".5px" }, children: [
                "Cri ",
                x + 1
              ] }),
              H[x] ? H[x].url ? /* @__PURE__ */ (0, o.jsxs)(
                "button",
                {
                  onClick: () => {
                    if (!vl.current) return;
                    if (pu === x) {
                      vl.current.pause();
                      gu(null);
                    } else {
                      vl.current.src = H[x].url;
                      vl.current.play().catch(() => {
                      });
                      gu(x);
                    }
                  },
                  style: { display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "Plus Jakarta Sans" },
                  children: [
                    /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 13 }, children: pu === x ? "\u23F8" : "\u25B6\uFE0F" }),
                    /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 12, fontWeight: 700, color: s.green }, children: pu === x ? "Lecture..." : `Note vocale \xB7 ${H[x].duree.toFixed(1)}s` })
                  ]
                }
              ) : /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 12, fontWeight: 700, color: s.green, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
                '"',
                H[x].texte,
                '"'
              ] }) : /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 11, color: s.faint }, children: "Non enregistr\xE9" })
            ] }),
            re === x ? /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
              /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 8, height: 8, borderRadius: "50%", background: "#EF4444", animation: "bk 0.6s ease infinite" } }),
              /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 11, fontWeight: 700, color: "#EF4444" }, children: Ti ? "\u{1F399}\uFE0F Enregistrement..." : "\u23F3 Pr\xE9paration micro..." }),
              /* @__PURE__ */ (0, o.jsx)(
                "button",
                {
                  onClick: Ng,
                  style: {
                    fontSize: 10,
                    fontWeight: 700,
                    color: s.faint,
                    background: "#fff",
                    border: `1px solid ${s.border}`,
                    borderRadius: 8,
                    padding: "3px 8px",
                    cursor: "pointer",
                    fontFamily: "Plus Jakarta Sans"
                  },
                  children: "\u2715"
                }
              )
            ] }) : /* @__PURE__ */ (0, o.jsx)(
              "button",
              {
                onClick: () => Dg(x),
                style: { fontSize: 11, fontWeight: 700, color: H[x] ? s.orange : "#fff", background: H[x] ? s.orangeL : s.orange, border: "none", borderRadius: 10, padding: "6px 12px", cursor: "pointer", fontFamily: "Plus Jakarta Sans", flexShrink: 0 },
                children: H[x] ? "\u{1F504} R\xE9-enreg." : "\u{1F3A4} Enregistrer"
              }
            ),
            kg && /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", alignItems: "flex-start", gap: 8, marginTop: 6, background: "#FFF7ED", border: "1px solid rgba(249,115,22,.25)", borderRadius: 12, padding: "10px 12px", animation: "stin 200ms var(--eo)" }, children: [
              /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 14, flexShrink: 0 }, children: "\u{1F3A4}" }),
              /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 11, color: "#9A3412", lineHeight: 1.5, fontWeight: 600 }, children: [
                "Le microphone n'est pas accessible. L'enregistrement du cri est ",
                /* @__PURE__ */ (0, o.jsx)("strong", { children: "vocal" }),
                " : autorisez le micro quand votre t\xE9l\xE9phone le demande (ou dans R\xE9glages \u2192 Applications \u2192 Alerte CI \u2192 Autorisations), puis r\xE9essayez."
              ] })
            ] })
          ] }, x)) }),
          H.filter(Boolean).length === 0 && /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 10, color: s.faint, marginTop: 8, textAlign: "center" }, children: "\u2139\uFE0F Sans cri enregistr\xE9, l'alerte se d\xE9clenche sur les mots-cl\xE9s par d\xE9faut (au secours, aide, danger...)" })
        ] }),
        l && St && /* @__PURE__ */ (0, o.jsxs)("div", { style: {
          margin: "0 20px 12px",
          background: St.ok ? "#F0FDF4" : "#FEF2F2",
          border: `1.5px solid ${St.ok ? "rgba(22,163,74,.4)" : "#FCA5A5"}`,
          borderRadius: 14,
          padding: "12px 14px"
        }, children: [
          /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, fontWeight: 800, color: St.ok ? "#166534" : "#B91C1C", marginBottom: St.ok ? 4 : 4 }, children: St.ok ? "\u2713 Alerte transmise au serveur" : "\u2717 L'alerte N'A PAS pu \xEAtre transmise" }),
          St.ok && /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 10, color: "#166534", lineHeight: 1.5 }, children: [
            "La sir\xE8ne sonne sur le t\xE9l\xE9phone de vos contacts qui ont l'application ",
            /* @__PURE__ */ (0, o.jsx)("strong", { children: "install\xE9e, connect\xE9e \xE0 leur num\xE9ro, et ouverte" }),
            ". Chacun doit avoir cr\xE9\xE9 son compte avec le num\xE9ro que vous avez enregistr\xE9."
          ] }),
          !St.ok && /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 11, color: "#B91C1C", lineHeight: 1.5, fontFamily: "monospace" }, children: [
            "Raison : ",
            St.msg,
            " (code ",
            St.code,
            ") \u2014 nouvel essai automatique toutes les 10 s."
          ] })
        ] }),
        !l && /* @__PURE__ */ (0, o.jsxs)(o.Fragment, { children: [
          /* @__PURE__ */ (0, o.jsxs)("div", { style: { margin: "0 20px 12px", background: "#fff", border: `1px solid ${u ? "rgba(22,163,74,.3)" : s.border}`, borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }, children: [
            /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 40, height: 40, borderRadius: 12, background: u ? s.greenL : s.surf, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: /* @__PURE__ */ (0, o.jsx)(_, { n: "mic", s: 20, c: u ? s.green : s.faint }) }),
            /* @__PURE__ */ (0, o.jsxs)("div", { style: { flex: 1 }, children: [
              /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 13, fontWeight: 700, color: s.ink }, children: "D\xE9tection vocale automatique" }),
              /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 11, color: jt ? u ? s.green : hu ? "#DC2626" : s.muted : s.muted, marginTop: 2 }, children: !jt ? "D\xE9sactiv\xE9e \u2014 activez pour d\xE9clencher l'alarme sur un cri" : hu ? hu : u ? "\u{1F7E2} Micro actif \u2014 un cri reconnu d\xE9clenche l'alarme" : "\u23F3 Activation en cours\u2026" })
            ] }),
            /* @__PURE__ */ (0, o.jsx)(
              "button",
              {
                onClick: () => {
                  Mg((x) => {
                    const C = !x;
                    if (!C) za();
                    return C;
                  });
                },
                "aria-label": "Activer ou d\xE9sactiver la d\xE9tection vocale",
                style: {
                  width: 52,
                  height: 30,
                  borderRadius: 15,
                  border: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                  padding: 0,
                  background: jt ? s.green : "#D6D3D1",
                  position: "relative",
                  transition: "background 200ms"
                },
                children: /* @__PURE__ */ (0, o.jsx)("span", { style: {
                  position: "absolute",
                  top: 3,
                  left: jt ? 25 : 3,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 200ms",
                  boxShadow: "0 1px 3px rgba(0,0,0,.3)"
                } })
              }
            )
          ] }),
          /* @__PURE__ */ (0, o.jsxs)("div", { style: { margin: "12px 20px 0", background: "#FFF7ED", border: "1.5px solid #FDBA74", borderRadius: 16, padding: "12px 14px" }, children: [
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, fontWeight: 800, color: "#9A3412", marginBottom: 6 }, children: "\u{1F50A} Tester la sir\xE8ne sur ce t\xE9l\xE9phone" }),
            /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 11, color: "#9A3412", opacity: 0.8, lineHeight: 1.5, marginBottom: 10 }, children: [
              "Appuyez, puis montez le ",
              /* @__PURE__ */ (0, o.jsx)("strong", { children: "volume" }),
              " avec les touches sur le c\xF4t\xE9 du t\xE9l\xE9phone pendant que la sir\xE8ne joue. C'est ce volume (multim\xE9dia) qu'utilisent les alertes."
            ] }),
            /* @__PURE__ */ (0, o.jsx)(
              "button",
              {
                onClick: () => {
                  if (yu) {
                    ba();
                    vu(false);
                  } else {
                    vu(true);
                    Ci();
                    setTimeout(() => {
                      ba();
                      vu(false);
                    }, 1e4);
                  }
                },
                style: {
                  width: "100%",
                  padding: "12px",
                  borderRadius: 12,
                  border: "none",
                  cursor: "pointer",
                  background: yu ? "#DC2626" : "linear-gradient(135deg,#F97316,#EA580C)",
                  fontFamily: "Plus Jakarta Sans",
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#fff"
                },
                children: yu ? "\u23F9 Arr\xEAter le test" : "\u25B6\uFE0E Lancer le test sir\xE8ne (10 s)"
              }
            )
          ] }),
          /* @__PURE__ */ (0, o.jsxs)("div", { style: { margin: "12px 20px 0", background: "#fff", border: `1.5px solid ${s.border}`, borderRadius: 16, padding: "12px 14px" }, children: [
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, fontWeight: 800, color: s.ink, marginBottom: 8 }, children: "\u{1F9EA} Diagnostic complet de la cha\xEEne d'alerte" }),
            /* @__PURE__ */ (0, o.jsx)(
              "button",
              {
                onClick: async () => {
                  const x = [];
                  const C = () => Rg([...x]);
                  x.push({ l: "1. Son du t\xE9l\xE9phone", ok: null, d: "Sir\xE8ne en cours 3 s\u2026 l'entendez-vous ?" });
                  C();
                  try {
                    Ci();
                  } catch (M) {
                  }
                  await new Promise((M) => setTimeout(M, 3e3));
                  try {
                    ba();
                  } catch (M) {
                  }
                  x[0] = { l: "1. Son du t\xE9l\xE9phone", ok: "?", d: "Si vous n'avez RIEN entendu : montez le volume multim\xE9dia (touches c\xF4t\xE9) et relancez." };
                  C();
                  x.push({ l: "2. Connexion internet", ok: null, d: "v\xE9rification\u2026" });
                  C();
                  let w = false;
                  try {
                    const M = await fetch(Ot + "/auth/v1/health", { method: "GET" });
                    w = M.status > 0;
                  } catch (M) {
                  }
                  if (!w) {
                    try {
                      const M = await fetch(Ot + "/rest/v1/", { method: "GET" });
                      w = M.status > 0;
                    } catch (M) {
                    }
                  }
                  x[1] = { l: "2. Connexion internet", ok: w, d: w ? "Le t\xE9l\xE9phone atteint le serveur." : "AUCUNE connexion au serveur \u2014 v\xE9rifiez internet/donn\xE9es mobiles." };
                  C();
                  x.push({ l: "3. Envoi d'alerte au serveur", ok: null, d: "test d'\xE9criture\u2026" });
                  C();
                  try {
                    const M = await fetch(Ot + "/rest/v1/diffusions", {
                      method: "POST",
                      headers: { ...Jt(va()), "Prefer": "return=minimal" },
                      body: JSON.stringify({ payload: { diag: true, urgence: false, cibles: [], ts: Date.now() } })
                    });
                    if (M.ok) x[2] = { l: "3. Envoi d'alerte au serveur", ok: true, d: "Le serveur accepte les alertes (code " + M.status + ")." };
                    else {
                      let R = "Erreur HTTP " + M.status;
                      try {
                        const F = await M.json();
                        R = F && (F.message || F.hint || F.details) || R;
                      } catch (F) {
                      }
                      x[2] = { l: "3. Envoi d'alerte au serveur", ok: false, d: "REFUS\xC9 : " + R + " (code " + M.status + ")" };
                    }
                  } catch (M) {
                    x[2] = { l: "3. Envoi d'alerte au serveur", ok: false, d: "\xC9chec r\xE9seau pendant l'envoi." };
                  }
                  C();
                  x.push({ l: "4. R\xE9ception des alertes", ok: null, d: "test de lecture\u2026" });
                  C();
                  try {
                    const M = await fetch(Ot + "/rest/v1/diffusions?select=id&order=created_at.desc&limit=1", { headers: Jt(va()) });
                    if (M.ok) {
                      const R = await M.json();
                      x[3] = { l: "4. R\xE9ception des alertes", ok: true, d: "Lecture OK (" + (Array.isArray(R) ? R.length : 0) + " alerte(s) visibles)." };
                    } else {
                      let R = "Erreur HTTP " + M.status;
                      try {
                        const F = await M.json();
                        R = F && (F.message || F.hint || F.details) || R;
                      } catch (F) {
                      }
                      x[3] = { l: "4. R\xE9ception des alertes", ok: false, d: "REFUS\xC9 : " + R };
                    }
                  } catch (M) {
                    x[3] = { l: "4. R\xE9ception des alertes", ok: false, d: "\xC9chec r\xE9seau pendant la lecture." };
                  }
                  C();
                  x.push({
                    l: "5. Mes contacts d'urgence",
                    ok: E.length > 0,
                    d: E.length ? E.map((M) => `${M.nm} \u2192 ${Wn(M.ph)}`).join(" \xB7 ") : "AUCUN contact enregistr\xE9 \u2014 l'alerte n'a personne \xE0 faire sonner !"
                  });
                  C();
                  x.push({ l: "6. Test aller-retour complet", ok: null, d: "envoi d'une alerte-test \xE0 votre propre num\xE9ro\u2026" });
                  C();
                  try {
                    const M = Wn(n.ph);
                    const R = "diagtest-" + Date.now();
                    await fetch(Ot + "/rest/v1/diffusions", {
                      method: "POST",
                      headers: { ...Jt(va()), "Prefer": "return=minimal" },
                      body: JSON.stringify({ payload: { type: "violence", diagtest: true, urgence: true, alerteId: R, victime: { nm: "Test", ph: "0000000000" }, cibles: [M], ts: Date.now() } })
                    });
                    await new Promise((ge) => setTimeout(ge, 1500));
                    const F = new Date(Date.now() - 36e5).toISOString();
                    const ue = await fetch(Ot + "/rest/v1/diffusions?select=payload&created_at=gte." + encodeURIComponent(F) + "&order=created_at.desc&limit=50", { headers: Jt(va()) });
                    const ne = ue.ok ? await ue.json() : [];
                    const ee = (ne || []).map((ge) => ge.payload).find((ge) => ge && ge.alerteId === R && Array.isArray(ge.cibles) && ge.cibles.map(Wn).includes(M));
                    if (ee) {
                      x[5] = { l: "6. Test aller-retour complet", ok: true, d: "PARFAIT : une alerte ciblant votre num\xE9ro part et revient correctement. La transmission fonctionne de bout en bout. Le contact doit juste avoir l'app OUVERTE." };
                    } else {
                      x[5] = { l: "6. Test aller-retour complet", ok: false, d: "L'alerte-test n'est pas revenue filtr\xE9e sur votre num\xE9ro. Probl\xE8me de lecture/format des cibles." };
                    }
                  } catch (M) {
                    x[5] = { l: "6. Test aller-retour complet", ok: false, d: "\xC9chec pendant le test aller-retour." };
                  }
                  C();
                },
                style: {
                  width: "100%",
                  padding: "12px",
                  borderRadius: 12,
                  border: "none",
                  cursor: "pointer",
                  background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
                  fontFamily: "Plus Jakarta Sans",
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#fff"
                },
                children: "\u25B6\uFE0E Lancer le diagnostic"
              }
            ),
            bs.length > 0 && /* @__PURE__ */ (0, o.jsxs)("div", { style: { marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }, children: [
              bs.map((x, C) => /* @__PURE__ */ (0, o.jsxs)("div", { style: {
                background: x.ok === true ? "#F0FDF4" : x.ok === false ? "#FEF2F2" : s.surf,
                border: `1px solid ${x.ok === true ? "rgba(22,163,74,.3)" : x.ok === false ? "#FCA5A5" : s.border}`,
                borderRadius: 10,
                padding: "8px 10px"
              }, children: [
                /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 11, fontWeight: 800, color: x.ok === true ? "#166534" : x.ok === false ? "#B91C1C" : s.ink }, children: [
                  x.ok === true ? "\u2713 " : x.ok === false ? "\u2717 " : "\u23F3 ",
                  x.l
                ] }),
                /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 10, color: s.muted, lineHeight: 1.5, fontFamily: "monospace", wordBreak: "break-word" }, children: x.d })
              ] }, C)),
              /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 10, color: s.muted, textAlign: "center", marginTop: 2 }, children: "\u{1F4F8} Envoyez une capture de ce panneau pour identifier le blocage exact." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, o.jsxs)("div", { className: "sh", children: [
          /* @__PURE__ */ (0, o.jsx)("span", { className: "stl", children: "Mes contacts d'urgence" }),
          E.length < 3 && /* @__PURE__ */ (0, o.jsx)("button", { className: "sea", onClick: () => Ue({ nm: "", ph: "" }), children: "+ Ajouter" })
        ] }),
        Y && /* @__PURE__ */ (0, o.jsxs)("div", { style: { margin: "0 20px 12px", background: "#fff", border: `1.5px solid ${s.orange}`, borderRadius: 16, padding: "16px", animation: "stin 250ms var(--eo)" }, children: [
          /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 13, fontWeight: 800, color: s.ink, marginBottom: 12 }, children: Y.idx !== void 0 ? "\u270F\uFE0F Modifier le contact" : "\u2795 Ajouter un contact" }),
          /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
            /* @__PURE__ */ (0, o.jsxs)("div", { className: "if", children: [
              /* @__PURE__ */ (0, o.jsx)(_, { n: "user", s: 16, c: s.faint }),
              /* @__PURE__ */ (0, o.jsx)(
                "input",
                {
                  value: Y.nm,
                  onChange: (x) => Ue((C) => ({ ...C, nm: x.target.value })),
                  placeholder: "Nom et pr\xE9nom",
                  style: { fontSize: 14 }
                }
              )
            ] }),
            /* @__PURE__ */ (0, o.jsxs)("div", { className: "if", style: { border: `1.5px solid ${Y.ph?.length === 10 ? "rgba(22,163,74,.4)" : s.border}` }, children: [
              /* @__PURE__ */ (0, o.jsx)(_, { n: "phone", s: 16, c: s.faint }),
              /* @__PURE__ */ (0, o.jsx)(
                "input",
                {
                  type: "tel",
                  value: Y.ph,
                  maxLength: 10,
                  onChange: (x) => Ue((C) => ({ ...C, ph: x.target.value.replace(/\D/g, "").slice(0, 10) })),
                  placeholder: "Num\xE9ro (10 chiffres CI)",
                  style: { fontSize: 14, letterSpacing: "1px" }
                }
              ),
              Y.ph?.length === 10 && /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 12, color: s.green, fontWeight: 700 }, children: "\u2713" })
            ] })
          ] }),
          /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: 12 }, children: [
            /* @__PURE__ */ (0, o.jsxs)(
              "button",
              {
                className: "btn btn-p",
                style: { flex: 1, opacity: Y.nm?.trim() && Y.ph?.length === 10 ? 1 : 0.5 },
                disabled: !Y.nm?.trim() || Y.ph?.length < 10,
                onClick: $,
                children: [
                  /* @__PURE__ */ (0, o.jsx)(_, { n: "check", s: 14, c: "#fff" }),
                  "Enregistrer"
                ]
              }
            ),
            /* @__PURE__ */ (0, o.jsx)("button", { className: "btn btn-g", style: { flex: 1 }, onClick: () => Ue(null), children: "Annuler" })
          ] })
        ] }),
        /* @__PURE__ */ (0, o.jsxs)("div", { className: "cl", children: [
          E.length === 0 && /* @__PURE__ */ (0, o.jsx)("div", { style: { margin: "0 20px 12px", background: s.surf, borderRadius: 14, padding: "20px", textAlign: "center" }, children: /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 13, color: s.muted }, children: [
            "Aucun contact d'urgence.",
            /* @__PURE__ */ (0, o.jsx)("br", {}),
            "Ajoutez jusqu'\xE0 3 contacts."
          ] }) }),
          E.length === 0 && !Y && /* @__PURE__ */ (0, o.jsxs)("div", { style: { margin: "0 20px 8px", background: s.surf, borderRadius: 14, padding: "22px 20px", textAlign: "center" }, children: [
            /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 28 }, children: "\u{1F6E1}\uFE0F" }),
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 13, fontWeight: 700, color: s.ink, marginTop: 10, marginBottom: 4 }, children: "Aucun contact d'urgence" }),
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, color: s.muted, lineHeight: 1.5 }, children: "Ajoutez jusqu'\xE0 3 contacts qui recevront l'alerte en cas de danger." }),
            /* @__PURE__ */ (0, o.jsxs)(
              "button",
              {
                className: "btn btn-p",
                style: { marginTop: 14 },
                onClick: () => Ue({ nm: "", ph: "" }),
                children: [
                  /* @__PURE__ */ (0, o.jsx)(_, { n: "plus", s: 14, c: "#fff" }),
                  "Ajouter un contact"
                ]
              }
            )
          ] }),
          E.map((x, C) => /* @__PURE__ */ (0, o.jsxs)("div", { className: "ci si", style: { animationDelay: `${C * 60}ms`, flexDirection: "column", padding: 0, gap: 0, overflow: "hidden" }, children: [
            /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "13px 16px" }, children: [
              /* @__PURE__ */ (0, o.jsx)("div", { className: "cav", style: { background: x.c }, children: x.in }),
              /* @__PURE__ */ (0, o.jsxs)("div", { style: { flex: 1 }, children: [
                /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 14, fontWeight: 700, color: s.ink }, children: x.nm }),
                /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, color: s.muted, marginTop: 1 }, children: x.ph })
              ] }),
              /* @__PURE__ */ (0, o.jsx)("div", { className: "cst", children: r ? /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 11, fontWeight: 700, color: "#DC2626", background: "#FFF1F2", padding: "3px 8px", borderRadius: 20 }, children: "\u26A1 Alert\xE9" }) : /* @__PURE__ */ (0, o.jsxs)(o.Fragment, { children: [
                /* @__PURE__ */ (0, o.jsx)("div", { className: "sd" }),
                /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 11, fontWeight: 600, color: s.green }, children: "Actif" })
              ] }) })
            ] }),
            !l && /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", borderTop: `1px solid ${s.border}` }, children: [
              /* @__PURE__ */ (0, o.jsx)(
                "button",
                {
                  onClick: () => Ue({ idx: C, nm: x.nm, ph: x.ph }),
                  style: { flex: 1, padding: "9px", border: "none", cursor: "pointer", background: s.orangeL, fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 700, color: s.orange, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 },
                  children: "\u270F\uFE0F Modifier"
                }
              ),
              /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 1, background: s.border } }),
              /* @__PURE__ */ (0, o.jsx)(
                "button",
                {
                  onClick: () => J(C),
                  style: { flex: 1, padding: "9px", border: "none", cursor: "pointer", background: "#FFF1F2", fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 700, color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 },
                  children: "\u{1F5D1}\uFE0F Retirer"
                }
              )
            ] })
          ] }, C))
        ] }),
        E.length < 3 && !Y && /* @__PURE__ */ (0, o.jsxs)("button", { className: "atb", onClick: () => Ue({ nm: "", ph: "" }), children: [
          /* @__PURE__ */ (0, o.jsx)(_, { n: "plus", s: 18, c: s.muted }),
          "Ajouter un contact (",
          E.length,
          "/3)"
        ] }),
        /* @__PURE__ */ (0, o.jsx)("div", { className: "trg", children: !l ? /* @__PURE__ */ (0, o.jsxs)(o.Fragment, { children: [
          /* @__PURE__ */ (0, o.jsxs)("button", { className: "tb", onClick: O, children: [
            /* @__PURE__ */ (0, o.jsx)(_, { n: "alert", s: 22, c: "#fff" }),
            "D\xE9clencher l'alarme"
          ] }),
          /* @__PURE__ */ (0, o.jsx)("p", { style: { textAlign: "center", fontSize: 11, color: s.faint, marginTop: 8 }, children: "Appuyez pour d\xE9clencher manuellement" })
        ] }) : /* @__PURE__ */ (0, o.jsxs)(o.Fragment, { children: [
          /* @__PURE__ */ (0, o.jsxs)(
            "button",
            {
              className: "tb",
              style: { background: "linear-gradient(135deg,#374151,#1F2937)" },
              onClick: Ht,
              children: [
                /* @__PURE__ */ (0, o.jsx)(_, { n: "check", s: 22, c: "#fff" }),
                "\u23F9 Arr\xEAter l'alarme"
              ]
            }
          ),
          /* @__PURE__ */ (0, o.jsx)("p", { style: { textAlign: "center", fontSize: 11, color: "#EF4444", marginTop: 8, fontWeight: 700 }, children: "Appuyez pour mettre fin \xE0 l'alerte" })
        ] }) })
      ] }),
      /* @__PURE__ */ (0, o.jsx)(hl, { a: "violence", go: e })
    ] });
  };
  var Ih = ({ go: e, goBack: t, userInfo: n = {}, partagesGps: a = [], demarrerPartageGps: l, arreterPartageGps: i, majPositionGps: u }) => {
    const c = n.nm && n.nm.trim() ? n.nm.trim() : "l'utilisateur";
    const [r, g] = (0, S.useState)(() => {
      try {
        const N = window.localStorage.getItem("alerteci_contacts_enlevement");
        return N ? JSON.parse(N) : [];
      } catch (N) {
        return [];
      }
    });
    (0, S.useEffect)(() => {
      try {
        window.localStorage.setItem("alerteci_contacts_enlevement", JSON.stringify(r));
      } catch (N) {
      }
    }, [r]);
    const [m, v] = (0, S.useState)(null);
    const p = ["#7C3AED", "#2563EB", "#16A34A", "#F97316", "#EC4899", "#0EA5E9"];
    const [y, T] = (0, S.useState)(null);
    const [z, U] = (0, S.useState)(false);
    const [f, d] = (0, S.useState)(null);
    const [h, b] = (0, S.useState)("");
    const k = (0, S.useRef)(null);
    const D = (0, S.useRef)(`moi-${Date.now()}`);
    const [E, j] = (0, S.useState)(null);
    const [L, q] = (0, S.useState)(false);
    const [Y, Ue] = (0, S.useState)(false);
    const Le = (0, S.useRef)(null);
    const st = (0, S.useRef)(null);
    const B = (0, S.useRef)([]);
    const $ = (0, S.useRef)(0);
    const J = (0, S.useRef)(null);
    const he = () => {
      if (!m || !m.nm.trim() || m.ph.length < 10) return;
      const N = m.nm.trim().split(" ").map((Be) => Be[0]).join("").slice(0, 2).toUpperCase();
      const Z = p[m.idx !== void 0 ? m.idx % p.length : r.length % p.length];
      if (m.idx !== void 0) {
        g((Be) => Be.map((yl, xa) => xa === m.idx ? { nm: m.nm.trim(), ph: m.ph, c: Z, in: N } : yl));
      } else {
        if (r.length >= 3) return;
        g((Be) => [...Be, { nm: m.nm.trim(), ph: m.ph, c: Z, in: N }]);
      }
      const ae = m.nm.trim();
      const oe = () => {
        try {
          new Notification("\u{1F198} ALERTE CI \u2014 Contact disparition", {
            body: `Bonjour ${ae} ! Vous avez \xE9t\xE9 d\xE9sign\xE9(e) contact de confiance par ${c} pour le suivi en cas de disparition. Vous recevrez sa position GPS en direct si le partage est activ\xE9.`,
            tag: `enlevement-${m.ph}`,
            requireInteraction: true
          });
        } catch (Be) {
        }
      };
      if (typeof Notification !== "undefined") {
        if (Notification.permission === "granted") oe();
        else if (Notification.permission !== "denied") Notification.requestPermission().then((Be) => {
          if (Be === "granted") oe();
        });
      }
      v(null);
      T(ae);
      setTimeout(() => T(null), 3500);
      wt();
    };
    const Ne = (N) => g((Z) => Z.filter((ae, oe) => oe !== N));
    const V = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
        return;
      }
      q(true);
      let N;
      const Z = setTimeout(() => {
        q(false);
        try {
          st.current && st.current.getTracks().forEach((oe) => oe.stop());
        } catch (oe) {
        }
      }, 4e3);
      try {
        N = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (oe) {
        clearTimeout(Z);
        q(false);
        return;
      }
      clearTimeout(Z);
      st.current = N;
      B.current = [];
      $.current = Date.now();
      let ae;
      try {
        ae = new window.MediaRecorder(N);
      } catch (oe) {
        N.getTracks().forEach((Be) => Be.stop());
        q(false);
        return;
      }
      ae.ondataavailable = (oe) => {
        if (oe.data && oe.data.size > 0) B.current.push(oe.data);
      };
      ae.onstop = () => {
        const oe = Math.max(0.1, (Date.now() - $.current) / 1e3);
        const Be = new Blob(B.current, { type: ae.mimeType || "audio/webm" });
        const yl = URL.createObjectURL(Be);
        j({ url: yl, duree: oe });
        q(false);
        try {
          N.getTracks().forEach((xa) => xa.stop());
        } catch (xa) {
        }
        wt();
      };
      Le.current = ae;
      try {
        ae.start();
        setTimeout(() => {
          try {
            if (ae.state === "recording") ae.stop();
          } catch (oe) {
          }
        }, 5e3);
      } catch (oe) {
        N.getTracks().forEach((Be) => Be.stop());
        q(false);
      }
    };
    const Ht = () => {
      try {
        Le.current && Le.current.state === "recording" && Le.current.stop();
      } catch (N) {
      }
      try {
        st.current && st.current.getTracks().forEach((N) => N.stop());
      } catch (N) {
      }
      q(false);
    };
    const O = (0, S.useRef)(0);
    const H = (0, S.useRef)(null);
    const ce = (N) => {
      const Z = Date.now();
      if (Z - O.current < 1e4 && N) return;
      O.current = Z;
      fu({
        type: "gps",
        alerteId: D.current,
        victime: { nm: c, ph: n.ph || "" },
        cibles: r.map((ae) => ae.ph),
        gps: N ? { lat: N.lat, lng: N.lng, precision: N.precision } : null,
        lienMaps: N ? `https://maps.google.com/?q=${N.lat},${N.lng}` : null,
        ts: Z
      });
    };
    const re = () => {
      b("");
      U(true);
      l && l(D.current, c);
      wt();
      O.current = 0;
      ce(null);
      O.current = 0;
      const N = (Z) => {
        const ae = {
          lat: Z.coords.latitude,
          lng: Z.coords.longitude,
          precision: Math.round(Z.coords.accuracy || 0),
          ts: Date.now()
        };
        b("");
        d(ae);
        u && u(D.current, {
          id: D.current,
          nom: c,
          ph: n.ph || "",
          lat: ae.lat,
          lng: ae.lng,
          precision: ae.precision,
          ts: ae.ts,
          contacts: r.map((oe) => oe.nm),
          noteVocale: E
        });
        ce(ae);
      };
      if (navigator.geolocation) {
        k.current = navigator.geolocation.watchPosition(
          N,
          () => {
            b("Recherche de position en cours\u2026 Si votre t\xE9l\xE9phone demande l'autorisation de localisation, acceptez-la : le partage d\xE9marrera tout seul.");
          },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 15e3 }
        );
        H.current = setInterval(() => {
          navigator.geolocation.getCurrentPosition(N, () => {
          }, { enableHighAccuracy: true, timeout: 8e3, maximumAge: 0 });
        }, 1e4);
      } else {
        b("Recherche de position en cours\u2026 Le lien sera transmis \xE0 vos contacts d\xE8s qu'une position est disponible.");
      }
    };
    const Fe = () => {
      if (k.current !== null) {
        try {
          navigator.geolocation.clearWatch(k.current);
        } catch (N) {
        }
        k.current = null;
      }
      clearInterval(H.current);
      fu({
        type: "gps",
        fin: true,
        alerteId: D.current,
        victime: { nm: c, ph: n.ph || "" },
        cibles: r.map((N) => N.ph),
        ts: Date.now()
      });
      D.current = `moi-${Date.now()}`;
      b("");
      U(false);
      i && i(D.current);
    };
    (0, S.useEffect)(() => () => {
      if (k.current !== null) {
        try {
          navigator.geolocation.clearWatch(k.current);
        } catch (N) {
        }
      }
      clearInterval(H.current);
      try {
        Le.current && Le.current.state === "recording" && Le.current.stop();
      } catch (N) {
      }
      try {
        st.current && st.current.getTracks().forEach((N) => N.stop());
      } catch (N) {
      }
    }, []);
    const Ti = f ? Math.max(0, Math.round((Date.now() - f.ts) / 1e3)) : null;
    return /* @__PURE__ */ (0, o.jsxs)("div", { className: "scr on", style: { display: "flex" }, children: [
      /* @__PURE__ */ (0, o.jsxs)("div", { className: "scrl", children: [
        /* @__PURE__ */ (0, o.jsxs)("div", { className: "scrhdr", children: [
          /* @__PURE__ */ (0, o.jsx)("button", { className: "bk", onClick: t, children: /* @__PURE__ */ (0, o.jsx)(_, { n: "back", s: 18, c: z ? "#7C3AED" : s.ink }) }),
          /* @__PURE__ */ (0, o.jsx)("p", { className: "scrttl", style: { color: z ? "#7C3AED" : s.ink }, children: z ? "\u{1F7E3} PARTAGE GPS ACTIF" : "Alerte Enl\xE8vement" })
        ] }),
        /* @__PURE__ */ (0, o.jsxs)("div", { className: "vhero", style: { background: z ? "linear-gradient(145deg,#4C1D95,#6D28D9)" : "linear-gradient(145deg,#312E81,#4338CA)" }, children: [
          /* @__PURE__ */ (0, o.jsx)("div", { className: "pr", children: /* @__PURE__ */ (0, o.jsx)("div", { className: "pi", style: { background: z ? "#7C3AED" : "#4F46E5" }, children: /* @__PURE__ */ (0, o.jsx)(_, { n: "pin", s: 28, c: "#fff" }) }) }),
          /* @__PURE__ */ (0, o.jsx)("p", { className: "hl", children: z ? "\u{1F4CD} Position partag\xE9e en direct" : "Suivi GPS contre les disparitions" }),
          /* @__PURE__ */ (0, o.jsx)("p", { className: "ht", children: z ? "Vos contacts vous suivent en temps r\xE9el" : "Pr\xEAt \xE0 activer le partage" }),
          /* @__PURE__ */ (0, o.jsx)("p", { className: "hd", children: z ? `Votre position se met \xE0 jour automatiquement et s'affiche en direct chez vos ${r.length || 3} contacts de confiance, qui voient votre d\xE9placement \xE0 chaque actualisation GPS.` : "En cas de disparition ou d'enl\xE8vement pr\xE9sum\xE9, activez le partage : votre position GPS sera envoy\xE9e en direct \xE0 vos contacts de confiance et se mettra \xE0 jour automatiquement." })
        ] }),
        h && /* @__PURE__ */ (0, o.jsxs)("div", { style: { margin: "0 20px 12px", background: "#FFF7ED", border: "1px solid rgba(249,115,22,.25)", borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 8 }, children: [
          /* @__PURE__ */ (0, o.jsx)("span", { style: { display: "inline-block", width: 14, height: 14, border: "2px solid rgba(249,115,22,.4)", borderTopColor: "#F97316", borderRadius: "50%", animation: "spin 1s linear infinite", flexShrink: 0 } }),
          /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, color: "#9A3412", fontWeight: 600, lineHeight: 1.5 }, children: h })
        ] }),
        z && f && /* @__PURE__ */ (0, o.jsxs)("div", { style: { margin: "0 20px 12px", background: "#fff", border: "1.5px solid rgba(124,58,237,.25)", borderRadius: 16, padding: "14px 16px" }, children: [
          /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }, children: [
            /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 10, height: 10, borderRadius: "50%", background: "#7C3AED", animation: "bk 1.4s ease infinite", flexShrink: 0 } }),
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, fontWeight: 800, color: s.ink }, children: "Position actuelle" }),
            /* @__PURE__ */ (0, o.jsx)("span", { style: { marginLeft: "auto", fontSize: 10, fontWeight: 700, color: s.muted }, children: Ti < 5 ? "\xC0 l'instant" : `Il y a ${Ti}s` })
          ] }),
          /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }, children: [
            /* @__PURE__ */ (0, o.jsxs)("div", { style: { background: s.surf, borderRadius: 10, padding: "8px 10px" }, children: [
              /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 9, fontWeight: 700, color: s.faint, textTransform: "uppercase" }, children: "Latitude" }),
              /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 13, fontWeight: 700, color: s.ink, fontFamily: "monospace" }, children: f.lat.toFixed(5) })
            ] }),
            /* @__PURE__ */ (0, o.jsxs)("div", { style: { background: s.surf, borderRadius: 10, padding: "8px 10px" }, children: [
              /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 9, fontWeight: 700, color: s.faint, textTransform: "uppercase" }, children: "Longitude" }),
              /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 13, fontWeight: 700, color: s.ink, fontFamily: "monospace" }, children: f.lng.toFixed(5) })
            ] })
          ] }),
          /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 11, color: s.muted }, children: [
            "Pr\xE9cision \u2248 ",
            f.precision,
            "m \xB7 Mise \xE0 jour automatique \xE0 chaque d\xE9placement"
          ] }),
          /* @__PURE__ */ (0, o.jsx)("audio", { ref: J, style: { display: "none" }, onEnded: () => Ue(false) }),
          /* @__PURE__ */ (0, o.jsxs)("div", { style: { marginTop: 10, paddingTop: 10, borderTop: `1px solid ${s.border}` }, children: [
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 10, fontWeight: 700, color: s.faint, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 6 }, children: "\u{1F399}\uFE0F Note vocale de signalement" }),
            L ? /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, background: "#FFF1F2", borderRadius: 10, padding: "8px 10px" }, children: [
              /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 8, height: 8, borderRadius: "50%", background: "#EF4444", animation: "bk 0.6s ease infinite", flexShrink: 0 } }),
              /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 12, fontWeight: 700, color: "#EF4444", flex: 1 }, children: "\u{1F399}\uFE0F Enregistrement..." }),
              /* @__PURE__ */ (0, o.jsx)(
                "button",
                {
                  onClick: Ht,
                  style: { fontSize: 10, fontWeight: 700, color: s.faint, background: "#fff", border: `1px solid ${s.border}`, borderRadius: 8, padding: "3px 8px", cursor: "pointer", fontFamily: "Plus Jakarta Sans" },
                  children: "\u2715"
                }
              )
            ] }) : E ? /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
              /* @__PURE__ */ (0, o.jsxs)(
                "button",
                {
                  onClick: () => {
                    if (!J.current) return;
                    if (Y) {
                      J.current.pause();
                      Ue(false);
                    } else {
                      J.current.src = E.url;
                      J.current.play().catch(() => {
                      });
                      Ue(true);
                    }
                  },
                  style: { display: "flex", alignItems: "center", gap: 6, background: "#F5F3FF", border: "none", borderRadius: 10, padding: "7px 12px", cursor: "pointer", fontFamily: "Plus Jakarta Sans", flex: 1 },
                  children: [
                    /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 13 }, children: Y ? "\u23F8" : "\u25B6\uFE0F" }),
                    /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 12, fontWeight: 700, color: "#7C3AED" }, children: Y ? "Lecture..." : `Note vocale \xB7 ${E.duree.toFixed(1)}s` })
                  ]
                }
              ),
              /* @__PURE__ */ (0, o.jsx)(
                "button",
                {
                  onClick: V,
                  style: { fontSize: 11, fontWeight: 700, color: "#7C3AED", background: "#F5F3FF", border: "none", borderRadius: 10, padding: "7px 10px", cursor: "pointer", fontFamily: "Plus Jakarta Sans", flexShrink: 0 },
                  children: "\u{1F504}"
                }
              )
            ] }) : /* @__PURE__ */ (0, o.jsxs)(
              "button",
              {
                onClick: V,
                style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", background: "#F5F3FF", border: "none", borderRadius: 10, padding: "9px", cursor: "pointer", fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 700, color: "#7C3AED" },
                children: [
                  /* @__PURE__ */ (0, o.jsx)(_, { n: "mic", s: 14, c: "#7C3AED" }),
                  " Enregistrer une note vocale (5s max)"
                ]
              }
            ),
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 10, color: s.faint, marginTop: 6, lineHeight: 1.4 }, children: "D\xE9crivez la situation \xE0 voix haute \u2014 cette note est envoy\xE9e avec votre position \xE0 vos 3 contacts de confiance." })
          ] }),
          /* @__PURE__ */ (0, o.jsxs)(
            "a",
            {
              href: `https://www.google.com/maps?q=${f.lat},${f.lng}`,
              target: "_blank",
              rel: "noreferrer",
              style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 10, padding: "9px", borderRadius: 10, background: "#F5F3FF", color: "#7C3AED", fontSize: 12, fontWeight: 700, textDecoration: "none", fontFamily: "Plus Jakarta Sans" },
              children: [
                /* @__PURE__ */ (0, o.jsx)(_, { n: "pin", s: 14, c: "#7C3AED" }),
                " Voir sur la carte"
              ]
            }
          ),
          /* @__PURE__ */ (0, o.jsxs)("div", { style: { marginTop: 10, paddingTop: 10, borderTop: `1px solid ${s.border}` }, children: [
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 10, fontWeight: 700, color: s.faint, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 6 }, children: "\u{1F4E4} Envoyer le lien de suivi aux contacts" }),
            r.length === 0 ? /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 11, color: s.muted, lineHeight: 1.4 }, children: "Ajoutez vos contacts de confiance ci-dessous : vous pourrez leur envoyer le lien Google Maps de votre position en un appui." }) : /* @__PURE__ */ (0, o.jsxs)(o.Fragment, { children: [
              r.map((N, Z) => {
                const ae = `https://www.google.com/maps?q=${f.lat},${f.lng}`;
                const oe = `\u{1F198} ALERTE CI \u2014 ${c} partage sa position GPS en direct. Suivez sa position sur Google Maps : ${ae}`;
                const Be = `225${String(N.ph).replace(/\D/g, "")}`;
                return /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }, children: [
                  /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 28, height: 28, borderRadius: 9, background: N.c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff", flexShrink: 0 }, children: N.in }),
                  /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 12, fontWeight: 700, color: s.ink, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: N.nm }),
                  /* @__PURE__ */ (0, o.jsx)(
                    "a",
                    {
                      href: `sms:${N.ph}?&body=${encodeURIComponent(oe)}`,
                      style: { fontSize: 11, fontWeight: 700, color: "#7C3AED", background: "#F5F3FF", borderRadius: 9, padding: "6px 10px", textDecoration: "none", fontFamily: "Plus Jakarta Sans", flexShrink: 0 },
                      children: "\u{1F4AC} SMS"
                    }
                  ),
                  /* @__PURE__ */ (0, o.jsx)(
                    "a",
                    {
                      href: `https://wa.me/${Be}?text=${encodeURIComponent(oe)}`,
                      target: "_blank",
                      rel: "noreferrer",
                      style: { fontSize: 11, fontWeight: 700, color: "#16A34A", background: s.greenL, borderRadius: 9, padding: "6px 10px", textDecoration: "none", fontFamily: "Plus Jakarta Sans", flexShrink: 0 },
                      children: "\u{1F7E2} WhatsApp"
                    }
                  )
                ] }, Z);
              }),
              /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 10, color: s.faint, marginTop: 4, lineHeight: 1.4 }, children: "Le lien envoy\xE9 contient votre position au moment de l'envoi \u2014 renvoyez-le apr\xE8s un d\xE9placement pour actualiser le suivi chez vos contacts." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, o.jsx)("div", { style: { padding: "0 20px 12px" }, children: !z ? /* @__PURE__ */ (0, o.jsxs)("button", { className: "btn btn-p", style: { background: "linear-gradient(135deg,#7C3AED,#6D28D9)" }, onClick: re, children: [
          /* @__PURE__ */ (0, o.jsx)(_, { n: "pin", s: 16, c: "#fff" }),
          "Activer le partage GPS en direct"
        ] }) : /* @__PURE__ */ (0, o.jsxs)("button", { className: "btn btn-g", onClick: Fe, children: [
          /* @__PURE__ */ (0, o.jsx)(_, { n: "check", s: 16, c: s.ink }),
          "Arr\xEAter le partage"
        ] }) }),
        y && /* @__PURE__ */ (0, o.jsxs)("div", { style: { margin: "0 20px 12px", background: s.greenL, border: "1px solid rgba(22,163,74,.25)", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, animation: "stin 280ms var(--eo)" }, children: [
          /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 18 }, children: "\u2705" }),
          /* @__PURE__ */ (0, o.jsxs)("div", { children: [
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 13, fontWeight: 700, color: s.green }, children: "Notification envoy\xE9e" }),
            /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 11, color: s.muted, marginTop: 1 }, children: [
              /* @__PURE__ */ (0, o.jsx)("strong", { children: y }),
              " a \xE9t\xE9 d\xE9sign\xE9(e) contact de confiance pour le suivi GPS."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, o.jsxs)("div", { className: "sh", children: [
          /* @__PURE__ */ (0, o.jsx)("span", { className: "stl", children: "Mes contacts de confiance" }),
          r.length < 3 && /* @__PURE__ */ (0, o.jsx)("button", { className: "sea", onClick: () => v({ nm: "", ph: "" }), children: "+ Ajouter" })
        ] }),
        m && /* @__PURE__ */ (0, o.jsxs)("div", { style: {
          margin: "0 20px 12px",
          background: "#fff",
          border: "1.5px solid #7C3AED",
          borderRadius: 16,
          padding: "16px",
          animation: "stin 250ms var(--eo)"
        }, children: [
          /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 13, fontWeight: 800, color: s.ink, marginBottom: 12 }, children: m.idx !== void 0 ? "\u270F\uFE0F Modifier le contact" : "\u2795 Ajouter un contact de confiance" }),
          /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: [
            /* @__PURE__ */ (0, o.jsxs)("div", { className: "if", children: [
              /* @__PURE__ */ (0, o.jsx)(_, { n: "user", s: 16, c: s.faint }),
              /* @__PURE__ */ (0, o.jsx)(
                "input",
                {
                  value: m.nm,
                  onChange: (N) => v((Z) => ({ ...Z, nm: N.target.value })),
                  placeholder: "Nom et pr\xE9nom",
                  autoFocus: true,
                  style: { fontSize: 14 }
                }
              )
            ] }),
            /* @__PURE__ */ (0, o.jsxs)("div", { className: "if", style: { border: `1.5px solid ${m.ph?.length === 10 ? "rgba(22,163,74,.4)" : s.border}` }, children: [
              /* @__PURE__ */ (0, o.jsx)(_, { n: "phone", s: 16, c: s.faint }),
              /* @__PURE__ */ (0, o.jsx)(
                "input",
                {
                  type: "tel",
                  value: m.ph,
                  maxLength: 10,
                  onChange: (N) => v((Z) => ({ ...Z, ph: N.target.value.replace(/\D/g, "").slice(0, 10) })),
                  placeholder: "Num\xE9ro CI (10 chiffres)",
                  style: { fontSize: 14, letterSpacing: "1px" }
                }
              ),
              m.ph?.length === 10 && /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 12, color: s.green, fontWeight: 700 }, children: "\u2713" })
            ] })
          ] }),
          /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: 12 }, children: [
            /* @__PURE__ */ (0, o.jsxs)(
              "button",
              {
                className: "btn btn-p",
                style: { flex: 1, background: "linear-gradient(135deg,#7C3AED,#6D28D9)", opacity: m.nm?.trim() && m.ph?.length === 10 ? 1 : 0.5 },
                disabled: !m.nm?.trim() || m.ph?.length < 10,
                onClick: he,
                children: [
                  /* @__PURE__ */ (0, o.jsx)(_, { n: "check", s: 14, c: "#fff" }),
                  "Enregistrer"
                ]
              }
            ),
            /* @__PURE__ */ (0, o.jsx)("button", { className: "btn btn-g", style: { flex: 1 }, onClick: () => v(null), children: "Annuler" })
          ] })
        ] }),
        /* @__PURE__ */ (0, o.jsxs)("div", { className: "cl", children: [
          r.length === 0 && !m && /* @__PURE__ */ (0, o.jsxs)("div", { style: { margin: "0 20px 12px", background: s.surf, borderRadius: 14, padding: "24px 20px", textAlign: "center" }, children: [
            /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 28 }, children: "\u{1F198}" }),
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 13, fontWeight: 700, color: s.ink, marginTop: 10, marginBottom: 4 }, children: "Aucun contact de confiance" }),
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, color: s.muted, lineHeight: 1.5 }, children: "Ajoutez jusqu'\xE0 3 contacts qui recevront votre position GPS en direct en cas de disparition." }),
            /* @__PURE__ */ (0, o.jsxs)(
              "button",
              {
                className: "btn btn-p",
                style: { marginTop: 14, background: "linear-gradient(135deg,#7C3AED,#6D28D9)" },
                onClick: () => v({ nm: "", ph: "" }),
                children: [
                  /* @__PURE__ */ (0, o.jsx)(_, { n: "plus", s: 14, c: "#fff" }),
                  "Ajouter un contact"
                ]
              }
            )
          ] }),
          r.map((N, Z) => /* @__PURE__ */ (0, o.jsxs)("div", { className: "ci si", style: { animationDelay: `${Z * 60}ms` }, children: [
            /* @__PURE__ */ (0, o.jsx)("div", { className: "cav", style: { background: N.c }, children: N.in }),
            /* @__PURE__ */ (0, o.jsxs)("div", { style: { flex: 1 }, children: [
              /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 14, fontWeight: 700, color: s.ink }, children: N.nm }),
              /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, color: s.muted, marginTop: 1 }, children: N.ph })
            ] }),
            /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", gap: 6 }, children: [
              /* @__PURE__ */ (0, o.jsx)(
                "button",
                {
                  onClick: () => v({ idx: Z, nm: N.nm, ph: N.ph }),
                  style: { width: 30, height: 30, borderRadius: 8, border: "none", cursor: "pointer", background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center" },
                  children: "\u270F\uFE0F"
                }
              ),
              /* @__PURE__ */ (0, o.jsx)(
                "button",
                {
                  onClick: () => Ne(Z),
                  style: { width: 30, height: 30, borderRadius: 8, border: "none", cursor: "pointer", background: "#FFF1F2", display: "flex", alignItems: "center", justifyContent: "center" },
                  children: "\u{1F5D1}\uFE0F"
                }
              )
            ] })
          ] }, Z))
        ] }),
        a.filter((N) => N.id !== D.current).length > 0 && /* @__PURE__ */ (0, o.jsxs)(o.Fragment, { children: [
          /* @__PURE__ */ (0, o.jsx)("div", { className: "sh", style: { marginTop: 4 }, children: /* @__PURE__ */ (0, o.jsx)("span", { className: "stl", children: "Positions re\xE7ues en direct" }) }),
          /* @__PURE__ */ (0, o.jsx)("div", { style: { padding: "0 20px 8px", display: "flex", flexDirection: "column", gap: 10 }, children: a.filter((N) => N.id !== D.current).map((N, Z) => {
            const ae = Math.max(0, Math.round((Date.now() - N.ts) / 1e3));
            return /* @__PURE__ */ (0, o.jsxs)("div", { className: "si", style: { animationDelay: `${Z * 60}ms`, background: "#fff", border: "1.5px solid rgba(124,58,237,.2)", borderRadius: 16, padding: "14px 16px" }, children: [
              /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }, children: [
                /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 10, height: 10, borderRadius: "50%", background: "#7C3AED", animation: "bk 1.4s ease infinite", flexShrink: 0 } }),
                /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 13, fontWeight: 800, color: s.ink }, children: N.nom }),
                /* @__PURE__ */ (0, o.jsx)("span", { style: { marginLeft: "auto", fontSize: 10, fontWeight: 700, color: ae < 30 ? s.green : s.muted }, children: ae < 5 ? "\xC0 l'instant" : `Il y a ${ae}s` })
              ] }),
              /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 11, color: s.muted, marginBottom: 8 }, children: [
                "Position synchronis\xE9e automatiquement \xB7 pr\xE9cision \u2248 ",
                N.precision,
                "m"
              ] }),
              N.noteVocale && /* @__PURE__ */ (0, o.jsxs)(
                "button",
                {
                  onClick: () => {
                    if (!J.current) return;
                    J.current.src = N.noteVocale.url;
                    J.current.play().catch(() => {
                    });
                  },
                  style: { display: "flex", alignItems: "center", gap: 6, width: "100%", background: "#FFF7ED", border: "none", borderRadius: 10, padding: "8px 10px", cursor: "pointer", fontFamily: "Plus Jakarta Sans", marginBottom: 8 },
                  children: [
                    /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 13 }, children: "\u25B6\uFE0F" }),
                    /* @__PURE__ */ (0, o.jsxs)("span", { style: { fontSize: 12, fontWeight: 700, color: s.orange }, children: [
                      "\xC9couter la note vocale \xB7 ",
                      N.noteVocale.duree.toFixed(1),
                      "s"
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ (0, o.jsxs)(
                "a",
                {
                  href: `https://www.google.com/maps?q=${N.lat},${N.lng}`,
                  target: "_blank",
                  rel: "noreferrer",
                  style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px", borderRadius: 10, background: "#F5F3FF", color: "#7C3AED", fontSize: 12, fontWeight: 700, textDecoration: "none", fontFamily: "Plus Jakarta Sans" },
                  children: [
                    /* @__PURE__ */ (0, o.jsx)(_, { n: "pin", s: 14, c: "#7C3AED" }),
                    " Suivre sur la carte"
                  ]
                }
              )
            ] }, N.id);
          }) })
        ] }),
        /* @__PURE__ */ (0, o.jsx)("div", { style: { padding: "8px 20px 20px" }, children: /* @__PURE__ */ (0, o.jsxs)("div", { style: { background: "#F5F3FF", border: "1px solid rgba(124,58,237,.2)", borderRadius: 14, padding: "12px 14px" }, children: [
          /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, fontWeight: 700, color: "#7C3AED", marginBottom: 4 }, children: "\u2139\uFE0F Comment \xE7a marche" }),
          /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, color: s.muted, lineHeight: 1.5 }, children: "Une fois activ\xE9, le partage GPS envoie automatiquement votre position \xE0 vos contacts \xE0 chaque d\xE9placement d\xE9tect\xE9 \u2014 aucune action de votre part n'est requise. Chez vos contacts, la position affich\xE9e se synchronise et s'actualise d\xE8s qu'ils ouvrent ou rafra\xEEchissent l'\xE9cran." })
        ] }) })
      ] }),
      /* @__PURE__ */ (0, o.jsx)(hl, { a: "enlevement", go: e })
    ] });
  };
  var wt = () => {
    try {
      const e = Ei();
      if (!e) return;
      try {
        if (e.state === "suspended") e.resume();
      } catch (n) {
      }
      const t = [[880, 0, 80], [1100, 90, 80], [1320, 180, 120]];
      t.forEach(([n, a, l]) => {
        const i = e.createOscillator(), u = e.createGain();
        i.connect(u);
        u.connect(e.destination);
        i.type = "sine";
        i.frequency.value = n;
        u.gain.setValueAtTime(0, e.currentTime + a / 1e3);
        u.gain.linearRampToValueAtTime(0.18, e.currentTime + a / 1e3 + 0.01);
        u.gain.linearRampToValueAtTime(0, e.currentTime + (a + l) / 1e3);
        i.start(e.currentTime + a / 1e3);
        i.stop(e.currentTime + (a + l) / 1e3);
      });
    } catch (e) {
    }
  };
  var Ph = ({ go: e, goBack: t, onSuccess: n }) => {
    const [a, l] = (0, S.useState)(null);
    const [i, u] = (0, S.useState)("annuel");
    const [c, r] = (0, S.useState)(false);
    const [g, m] = (0, S.useState)("");
    const [v, p] = (0, S.useState)("");
    const y = i === "annuel" ? "3 000 FCFA / an" : "1 000 FCFA / mois";
    const T = i === "annuel" ? "3 000 FCFA" : "1 000 FCFA";
    const z = ["orange", "mtn", "moov", "wave"].includes(a);
    const U = () => {
      p("");
      if (z) {
        if (g.length < 10) {
          p("Veuillez saisir votre num\xE9ro Mobile Money (10 chiffres CI).");
          return;
        }
      }
      wt();
      r(true);
    };
    if (c) return /* @__PURE__ */ (0, o.jsxs)("div", { className: "scr on", style: { display: "flex", flexDirection: "column" }, children: [
      /* @__PURE__ */ (0, o.jsxs)("div", { className: "scrhdr", children: [
        /* @__PURE__ */ (0, o.jsx)("button", { className: "bk", onClick: t, children: /* @__PURE__ */ (0, o.jsx)(_, { n: "back", s: 18, c: s.ink }) }),
        /* @__PURE__ */ (0, o.jsx)("p", { className: "scrttl", children: "Paiement" })
      ] }),
      /* @__PURE__ */ (0, o.jsxs)("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px", textAlign: "center" }, children: [
        /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 80, height: 80, borderRadius: "50%", background: s.green, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }, children: /* @__PURE__ */ (0, o.jsx)(_, { n: "check", s: 36, c: "#fff" }) }),
        /* @__PURE__ */ (0, o.jsx)("p", { style: { fontFamily: "Sora,sans-serif", fontSize: 22, fontWeight: 800, color: s.ink, letterSpacing: "-.5px", marginBottom: 10 }, children: "Abonnement activ\xE9 !" }),
        /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 14, color: s.muted, lineHeight: 1.6, marginBottom: 28 }, children: "Votre forfait Premium ALERTE CI est maintenant actif. Profitez de toutes les fonctionnalit\xE9s." }),
        /* @__PURE__ */ (0, o.jsxs)("button", { className: "btn btn-p", onClick: () => n ? n() : e("home"), children: [
          "Acc\xE9der \xE0 l'application ",
          /* @__PURE__ */ (0, o.jsx)(_, { n: "arrow", s: 16, c: "#fff" })
        ] })
      ] })
    ] });
    return /* @__PURE__ */ (0, o.jsx)("div", { className: "scr on", style: { display: "flex" }, children: /* @__PURE__ */ (0, o.jsxs)("div", { className: "isc", style: { paddingTop: 0 }, children: [
      /* @__PURE__ */ (0, o.jsxs)("div", { className: "scrhdr", style: { padding: "20px 24px 16px" }, children: [
        /* @__PURE__ */ (0, o.jsx)("button", { className: "bk", onClick: t, children: /* @__PURE__ */ (0, o.jsx)(_, { n: "back", s: 18, c: s.ink }) }),
        /* @__PURE__ */ (0, o.jsx)("p", { className: "scrttl", children: "Paiement Premium" })
      ] }),
      /* @__PURE__ */ (0, o.jsx)("div", { style: { margin: "0 20px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }, children: [{ id: "annuel", lb: "Annuel", prix: "3 000 FCFA", eco: "Le plus \xE9conomique" }, { id: "mensuel", lb: "Mensuel", prix: "1 000 FCFA", eco: "Sans engagement" }].map((f) => /* @__PURE__ */ (0, o.jsxs)(
        "button",
        {
          onClick: () => u(f.id),
          style: { padding: "14px 12px", borderRadius: 18, border: `2px solid ${i === f.id ? s.orange : "rgba(0,0,0,.07)"}`, background: i === f.id ? s.orangeL : "#fff", cursor: "pointer", fontFamily: "Plus Jakarta Sans", textAlign: "center", position: "relative" },
          children: [
            f.id === "annuel" && /* @__PURE__ */ (0, o.jsx)("span", { style: { position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", fontSize: 9, fontWeight: 800, background: s.orange, color: "#fff", padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap" }, children: "\u2B50 MEILLEUR CHOIX" }),
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 16, fontWeight: 800, color: i === f.id ? s.orange : s.ink, letterSpacing: "-.5px" }, children: f.prix }),
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 11, fontWeight: 700, color: i === f.id ? s.orange : s.muted, marginTop: 2 }, children: f.lb }),
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 10, color: s.faint, marginTop: 2 }, children: f.eco })
          ]
        },
        f.id
      )) }),
      /* @__PURE__ */ (0, o.jsxs)("div", { style: { margin: "0 20px 20px", background: "linear-gradient(135deg,#1C1917,#292524)", borderRadius: 22, padding: "20px" }, children: [
        /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 11, fontWeight: 700, color: s.orange, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }, children: [
          "\u2726 FORFAIT PREMIUM \u2014 ",
          i === "annuel" ? "ANNUEL" : "MENSUEL"
        ] }),
        /* @__PURE__ */ (0, o.jsx)("p", { style: { fontFamily: "Sora,sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-1px" }, children: y }),
        /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 4 }, children: "Acc\xE8s complet \xB7 Alerte Violence \xB7 Alerte Enl\xE8vement" }),
        /* @__PURE__ */ (0, o.jsx)("div", { style: { marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }, children: ["Alerte Violence", "Alerte Enl\xE8vement"].map((f, d) => /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: "rgba(249,115,22,.15)", color: s.orange }, children: f }, d)) })
      ] }),
      /* @__PURE__ */ (0, o.jsx)("p", { className: "fst", style: { padding: "0 20px" }, children: "Choisir le mode de paiement" }),
      /* @__PURE__ */ (0, o.jsxs)("div", { style: { padding: "0 20px", display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }, children: [
        [
          { id: "orange", label: "Orange Money", color: "#FF6200", logo: "\u{1F7E0}" },
          { id: "mtn", label: "MTN Mobile Money", color: "#FFCC00", logo: "\u{1F7E1}" },
          { id: "moov", label: "Moov Money", color: "#00AEEF", logo: "\u{1F537}" },
          { id: "wave", label: "Wave CI", color: "#1A73E8", logo: "\u{1F535}" }
        ].map((f) => /* @__PURE__ */ (0, o.jsxs)(
          "button",
          {
            onClick: () => {
              l(f.id);
              p("");
            },
            style: { display: "flex", alignItems: "center", gap: 14, background: "#fff", border: `2px solid ${a === f.id ? f.color : "rgba(0,0,0,.07)"}`, borderRadius: 16, padding: "14px 16px", cursor: "pointer", fontFamily: "Plus Jakarta Sans", transform: a === f.id ? "scale(1.01)" : "scale(1)" },
            children: [
              /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 28 }, children: f.logo }),
              /* @__PURE__ */ (0, o.jsxs)("div", { style: { flex: 1, textAlign: "left" }, children: [
                /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 14, fontWeight: 700, color: s.ink }, children: f.label }),
                /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 11, color: s.muted, marginTop: 2 }, children: "Paiement instantan\xE9 \xB7 Num\xE9ro CI 10 chiffres" })
              ] }),
              /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 20, height: 20, borderRadius: "50%", border: `2px solid ${a === f.id ? f.color : s.surfH}`, background: a === f.id ? f.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: a === f.id && /* @__PURE__ */ (0, o.jsx)(_, { n: "check", s: 11, c: "#fff" }) })
            ]
          },
          f.id
        )),
        z && /* @__PURE__ */ (0, o.jsx)("div", { style: { animation: "stin 280ms var(--eo)" }, children: /* @__PURE__ */ (0, o.jsxs)("div", { className: "if", style: { border: `1.5px solid ${g.length === 10 ? "rgba(22,163,74,.4)" : s.border}` }, children: [
          /* @__PURE__ */ (0, o.jsx)(_, { n: "phone", s: 18, c: s.faint }),
          /* @__PURE__ */ (0, o.jsx)(
            "input",
            {
              type: "tel",
              value: g,
              onChange: (f) => m(f.target.value.replace(/\D/g, "").slice(0, 10)),
              placeholder: "Num\xE9ro Mobile Money (10 chiffres CI) *",
              maxLength: 10,
              style: { letterSpacing: g.length > 0 ? "1px" : "normal" }
            }
          ),
          g.length === 10 ? /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 12, color: s.green, fontWeight: 700 }, children: "\u2713" }) : /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 9, fontWeight: 700, color: "#DC2626", flexShrink: 0 }, children: "Requis" })
        ] }) }),
        v && /* @__PURE__ */ (0, o.jsx)("div", { style: { background: "#FFF1F2", border: "1px solid rgba(220,38,38,.2)", borderRadius: 12, padding: "10px 14px" }, children: /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 12, color: "#DC2626", fontWeight: 600 }, children: [
          "\u26A0\uFE0F ",
          v
        ] }) })
      ] }),
      /* @__PURE__ */ (0, o.jsx)("div", { style: { padding: "12px 20px 8px" }, children: /* @__PURE__ */ (0, o.jsxs)(
        "button",
        {
          className: "btn btn-p",
          style: { opacity: a ? 1 : 0.5 },
          disabled: !a,
          onClick: U,
          children: [
            "Payer ",
            T,
            " ",
            /* @__PURE__ */ (0, o.jsx)(_, { n: "arrow", s: 16, c: "#fff" })
          ]
        }
      ) }),
      /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 11, color: s.faint, textAlign: "center", paddingBottom: 20 }, children: "\u{1F512} Paiement chiffr\xE9 et s\xE9curis\xE9 \xB7 1 compte = 1 appareil" })
    ] }) });
  };
  var ey = ({ go: e, goBack: t, onSignup: n, userInfo: a = {}, comptesInscrits: l = [] }) => {
    const [i, u] = (0, S.useState)("premium");
    const [c, r] = (0, S.useState)(false);
    const [g, m] = (0, S.useState)("");
    const [v, p] = (0, S.useState)("");
    const [y, T] = (0, S.useState)("");
    const [z, U] = (0, S.useState)("");
    const [f, d] = (0, S.useState)("");
    const h = v.length === 10 && (zg.some((b) => b.ph === v) || l.some((b) => b.ph === v));
    return /* @__PURE__ */ (0, o.jsxs)("div", { className: "scr on", style: { display: "flex" }, children: [
      /* @__PURE__ */ (0, o.jsxs)("div", { className: "scrhdr", children: [
        /* @__PURE__ */ (0, o.jsx)("button", { className: "bk", onClick: t, children: /* @__PURE__ */ (0, o.jsx)(_, { n: "back", s: 18, c: s.ink }) }),
        /* @__PURE__ */ (0, o.jsx)("p", { className: "scrttl", children: "Cr\xE9er un compte" })
      ] }),
      /* @__PURE__ */ (0, o.jsxs)("div", { className: "isc", children: [
        /* @__PURE__ */ (0, o.jsx)("p", { className: "fst", style: { marginTop: 0 }, children: "Informations personnelles" }),
        /* @__PURE__ */ (0, o.jsxs)("div", { className: "ig", children: [
          /* @__PURE__ */ (0, o.jsxs)("div", { className: "if si", style: { animationDelay: "0ms" }, children: [
            /* @__PURE__ */ (0, o.jsx)(_, { n: "user", s: 18, c: s.faint }),
            /* @__PURE__ */ (0, o.jsx)("input", { type: "text", value: g, onChange: (b) => m(b.target.value), placeholder: "Nom et pr\xE9nom *" })
          ] }),
          /* @__PURE__ */ (0, o.jsxs)("div", { className: "if si", style: { animationDelay: "60ms" }, children: [
            /* @__PURE__ */ (0, o.jsx)(_, { n: "phone", s: 18, c: s.faint }),
            /* @__PURE__ */ (0, o.jsx)("input", { type: "tel", value: v, onChange: (b) => p(b.target.value.replace(/\D/g, "").slice(0, 10)), placeholder: "0X XX XX XX XX (10 chiffres CI) *", maxLength: 10 }),
            v.length === 10 && !h && /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 11, color: s.green, fontWeight: 700 }, children: "\u2713" })
          ] }),
          h && /* @__PURE__ */ (0, o.jsxs)("div", { style: { background: "#FFF7ED", border: "1.5px solid rgba(249,115,22,.3)", borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 10, animation: "stin 200ms var(--eo)" }, children: [
            /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 18, flexShrink: 0 }, children: "\u2139\uFE0F" }),
            /* @__PURE__ */ (0, o.jsxs)("div", { style: { flex: 1 }, children: [
              /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, fontWeight: 800, color: s.orange, marginBottom: 3 }, children: "Ce num\xE9ro est d\xE9j\xE0 inscrit" }),
              /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 11, color: s.muted, lineHeight: 1.5, marginBottom: 8 }, children: "Un compte ALERTE CI existe d\xE9j\xE0 avec ce num\xE9ro de t\xE9l\xE9phone. Connectez-vous avec votre code d'acc\xE8s au lieu de cr\xE9er un nouveau compte." }),
              /* @__PURE__ */ (0, o.jsx)(
                "button",
                {
                  onClick: () => e("login"),
                  style: { fontSize: 12, fontWeight: 700, color: "#fff", background: s.orange, border: "none", borderRadius: 10, padding: "7px 14px", cursor: "pointer", fontFamily: "Plus Jakarta Sans" },
                  children: "Se connecter \u2192"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, o.jsxs)("div", { className: "if si", style: { animationDelay: "120ms" }, children: [
            /* @__PURE__ */ (0, o.jsx)(_, { n: "mail", s: 18, c: s.faint }),
            /* @__PURE__ */ (0, o.jsx)("input", { type: "email", value: y, onChange: (b) => T(b.target.value), placeholder: "Adresse email (facultatif)" }),
            /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 9, fontWeight: 700, color: s.faint, background: s.surf, padding: "2px 6px", borderRadius: 8, flexShrink: 0 }, children: "Optionnel" })
          ] }),
          /* @__PURE__ */ (0, o.jsxs)("div", { className: "if si", style: { animationDelay: "180ms" }, children: [
            /* @__PURE__ */ (0, o.jsx)(_, { n: "pin", s: 18, c: s.faint }),
            /* @__PURE__ */ (0, o.jsxs)("select", { value: z, onChange: (b) => U(b.target.value), style: { flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15, fontWeight: 500, color: s.ink, appearance: "none" }, children: [
              /* @__PURE__ */ (0, o.jsx)("option", { value: "", children: "Commune de r\xE9sidence" }),
              Sg.map((b) => /* @__PURE__ */ (0, o.jsx)("option", { children: b }, b))
            ] })
          ] }),
          /* @__PURE__ */ (0, o.jsxs)("div", { className: "if si", style: { animationDelay: "240ms", flexDirection: "column", alignItems: "stretch", gap: 8, background: "transparent", border: "none", padding: 0 }, children: [
            /* @__PURE__ */ (0, o.jsx)("p", { className: "fst", style: { paddingTop: 4 }, children: "Cr\xE9ez votre code d'acc\xE8s (6 chiffres) *" }),
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 11, color: s.muted, textAlign: "center", marginTop: -6, marginBottom: 4, lineHeight: 1.5 }, children: "Ce code remplace le mot de passe : il vous servira d\xE9sormais, avec votre num\xE9ro, \xE0 vous reconnecter \xE0 votre compte." }),
            /* @__PURE__ */ (0, o.jsx)("div", { style: { display: "flex", gap: 8, justifyContent: "center" }, children: [0, 1, 2, 3, 4, 5].map((b) => /* @__PURE__ */ (0, o.jsx)(
              "input",
              {
                id: `pw-${b}`,
                type: "password",
                inputMode: "numeric",
                maxLength: 1,
                value: f[b] || "",
                onChange: (k) => {
                  const D = k.target.value.replace(/\D/g, "").slice(0, 1);
                  const E = f.split("");
                  E[b] = D;
                  const j = E.join("").slice(0, 6);
                  d(j);
                  if (D && b < 5) document.getElementById(`pw-${b + 1}`)?.focus();
                },
                onKeyDown: (k) => {
                  if (k.key === "Backspace" && !f[b] && b > 0) document.getElementById(`pw-${b - 1}`)?.focus();
                },
                style: {
                  width: 44,
                  height: 52,
                  borderRadius: 12,
                  border: `2px solid ${f.length > b ? s.orange : s.surfH}`,
                  textAlign: "center",
                  fontSize: 22,
                  fontWeight: 800,
                  fontFamily: "Sora,sans-serif",
                  color: s.ink,
                  outline: "none",
                  background: "#fff",
                  transition: "border-color 180ms ease"
                }
              },
              b
            )) }),
            f.length > 0 && f.length < 6 && /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 11, color: s.faint, textAlign: "center" }, children: [
              6 - f.length,
              " chiffre(s) restant(s)"
            ] }),
            f.length === 6 && /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 11, color: s.green, fontWeight: 700, textAlign: "center" }, children: "\u2713 Code complet \u2014 retenez-le bien, il vous servira \xE0 chaque connexion" })
          ] })
        ] }),
        /* @__PURE__ */ (0, o.jsx)("p", { className: "fst", children: "Choisir un forfait" }),
        /* @__PURE__ */ (0, o.jsxs)("div", { style: { background: s.orangeL, border: "1px solid rgba(249,115,22,.2)", borderRadius: 14, padding: "12px 14px", marginBottom: 12, display: "flex", alignItems: "flex-start", gap: 10 }, children: [
          /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 18, flexShrink: 0 }, children: "\u{1F381}" }),
          /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 12, color: s.muted, lineHeight: 1.5 }, children: [
            /* @__PURE__ */ (0, o.jsx)("strong", { style: { color: s.orange }, children: "1 mois d'essai Premium offert" }),
            " d\xE8s la cr\xE9ation de votre compte, quel que soit le forfait choisi ci-dessous. Acc\xE8s complet \xE0 Alerte Violence et Alerte Enl\xE8vement pendant 30 jours."
          ] })
        ] }),
        /* @__PURE__ */ (0, o.jsxs)("div", { className: "ps", children: [
          /* @__PURE__ */ (0, o.jsxs)("button", { className: `po ${i === "free" ? "sel-g" : ""}`, onClick: () => u("free"), children: [
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 22, marginBottom: 6 }, children: "\u{1F7E2}" }),
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 13, fontWeight: 700, color: s.ink }, children: "Gratuit" }),
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 11, fontWeight: 600, color: s.green, marginTop: 3 }, children: "0 FCFA" })
          ] }),
          /* @__PURE__ */ (0, o.jsxs)("button", { className: `po ${i === "premium" ? "sel" : ""}`, onClick: () => u("premium"), children: [
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 22, marginBottom: 6 }, children: "\u2B50" }),
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 13, fontWeight: 700, color: s.ink }, children: "Premium" }),
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 11, fontWeight: 600, color: s.orange, marginTop: 3 }, children: "3 000 FCFA/an" })
          ] })
        ] }),
        /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "4px 0" }, children: [
          /* @__PURE__ */ (0, o.jsx)("button", { onClick: () => r((b) => !b), style: { width: 22, height: 22, borderRadius: 6, border: `2px solid ${c ? s.orange : s.surfH}`, background: c ? s.orange : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }, children: c && /* @__PURE__ */ (0, o.jsx)(_, { n: "check", s: 13, c: "#fff" }) }),
          /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 12, color: s.muted }, children: [
            "J'accepte les ",
            /* @__PURE__ */ (0, o.jsx)("button", { onClick: () => e("cgu"), style: { background: "none", border: "none", cursor: "pointer", color: s.orange, fontWeight: 700, fontSize: 12, fontFamily: "inherit" }, children: "Conditions d'utilisation" }),
            " et la politique de confidentialit\xE9"
          ] })
        ] }),
        /* @__PURE__ */ (0, o.jsx)("div", { style: { marginBottom: 8 }, children: /* @__PURE__ */ (0, o.jsxs)(
          "button",
          {
            className: "btn btn-p",
            onClick: () => {
              n && n({ nm: g.trim(), ph: v, mail: y, commune: z, pin: f, plan: i === "premium" ? "premium" : "gratuit" });
              if (i === "premium") e("paiement");
              else e("home");
            },
            style: { opacity: c && g.trim() && v.length === 10 && f.length === 6 && !h ? 1 : 0.5 },
            disabled: !c || !g.trim() || v.length < 10 || f.length < 6 || h,
            children: [
              i === "premium" ? "Continuer vers le paiement" : "Cr\xE9er mon compte",
              " ",
              /* @__PURE__ */ (0, o.jsx)(_, { n: "arrow", s: 16, c: "#fff" })
            ]
          }
        ) }),
        /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 11, color: s.faint, textAlign: "center", paddingBottom: 16 }, children: "1 compte = 1 appareil \xB7 Connexion par code d'acc\xE8s uniquement" })
      ] })
    ] });
  };
  var ty = ({ go: e, goBack: t }) => /* @__PURE__ */ (0, o.jsxs)("div", { className: "scr on", style: { display: "flex" }, children: [
    /* @__PURE__ */ (0, o.jsxs)("div", { className: "scrhdr", children: [
      /* @__PURE__ */ (0, o.jsx)("button", { className: "bk", onClick: t, children: /* @__PURE__ */ (0, o.jsx)(_, { n: "back", s: 18, c: s.ink }) }),
      /* @__PURE__ */ (0, o.jsx)("p", { className: "scrttl", children: "Conditions d'utilisation" })
    ] }),
    /* @__PURE__ */ (0, o.jsxs)("div", { className: "cgu", children: [
      /* @__PURE__ */ (0, o.jsxs)("div", { style: { background: s.orangeL, borderRadius: 16, padding: "14px 16px", marginBottom: 20, border: "1px solid rgba(249,115,22,.2)" }, children: [
        /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 13, fontWeight: 700, color: s.orange }, children: "ALERTE CI \u2014 C\xF4te d'Ivoire" }),
        /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 11, color: s.muted, marginTop: 4 }, children: "Derni\xE8re mise \xE0 jour : Juin 2025" })
      ] }),
      [
        { t: "1. Objet de l'application", p: "ALERTE CI est une application mobile destin\xE9e aux r\xE9sidents de C\xF4te d'Ivoire, offrant des services de s\xE9curit\xE9 personnelle en cas de violence ou de disparition. L'application est disponible sur iOS et Android." },
        { t: "2. Compte unique par appareil", p: "Chaque compte ALERTE CI est strictement li\xE9 \xE0 un seul appareil \xE0 la fois. Toute tentative de connexion simultan\xE9e sur deux appareils entra\xEEnera la d\xE9connexion automatique du premier appareil." },
        { t: "3. Forfaits et abonnements", p: "L'application propose un mois d'essai gratuit \xE0 la cr\xE9ation du compte, donnant acc\xE8s \xE0 Alerte Violence et Alerte Enl\xE8vement. Pass\xE9 ce d\xE9lai, un abonnement est n\xE9cessaire pour continuer \xE0 y acc\xE9der (3 000 FCFA/an ou 1 000 FCFA/mois). Le paiement s'effectue via Mobile Money, Wave CI ou carte bancaire." },
        { t: "4. Utilisation responsable", p: "L'utilisateur s'engage \xE0 utiliser l'application de mani\xE8re responsable. Tout abus, fausse alerte ou utilisation malveillante pourra entra\xEEner la suspension du compte." },
        { t: "5. Donn\xE9es personnelles et protection de la vie priv\xE9e", p: "ALERTE CI collecte uniquement les donn\xE9es n\xE9cessaires au fonctionnement du service : nom, num\xE9ro de t\xE9l\xE9phone (10 chiffres CI), commune, email (facultatif) et localisation GPS \u2014 cette derni\xE8re n'\xE9tant activ\xE9e que lors d'un signalement d'urgence ou d'un partage de position volontaire (Alerte Enl\xE8vement). Ces donn\xE9es sont conserv\xE9es de fa\xE7on s\xE9curis\xE9e et ne sont jamais vendues \xE0 des tiers ni utilis\xE9es \xE0 des fins publicitaires. Elles sont partag\xE9es uniquement avec les contacts de confiance explicitement d\xE9sign\xE9s par l'utilisateur. Conform\xE9ment \xE0 la r\xE9glementation ivoirienne sur la protection des donn\xE9es \xE0 caract\xE8re personnel, l'utilisateur dispose \xE0 tout moment d'un droit d'acc\xE8s, de rectification et de suppression de ses donn\xE9es, exer\xE7able depuis Mon Profil ou aupr\xE8s du support ALERTE CI. Les notes vocales et signalements expirent et sont supprim\xE9s automatiquement apr\xE8s 24 heures, sauf n\xE9cessit\xE9 l\xE9gale de conservation plus longue." },
        { t: "6. Modification des CGU", p: "ALERTE CI se r\xE9serve le droit de modifier les pr\xE9sentes conditions \xE0 tout moment. Les utilisateurs seront notifi\xE9s par notification push en cas de modification substantielle." }
      ].map((n, a) => /* @__PURE__ */ (0, o.jsxs)("div", { style: { marginBottom: 20 }, children: [
        /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 14, fontWeight: 700, color: s.ink, marginBottom: 8 }, children: n.t }),
        /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 13, color: s.muted, lineHeight: 1.6 }, children: n.p })
      ] }, a)),
      /* @__PURE__ */ (0, o.jsxs)("button", { className: "btn btn-p", style: { marginBottom: 8 }, onClick: t, children: [
        "J'ai compris ",
        /* @__PURE__ */ (0, o.jsx)(_, { n: "check", s: 16, c: "#fff" })
      ] })
    ] })
  ] });
  var ny = ({ go: e, goBack: t }) => {
    const [n, a] = (0, S.useState)(null);
    const l = [
      { q: "Comment fonctionne l'Alerte Violence ?", a: "Vous enregistrez un signal vocal unique dans l'app. Quand l'application d\xE9tecte ce signal, elle d\xE9clenche une alarme et notifie vos 3 contacts d'urgence simultan\xE9ment." },
      { q: "Mes contacts doivent-ils avoir l'application ?", a: "Pour l'Alerte Violence et l'Alerte Enl\xE8vement, vos contacts re\xE7oivent une simple notification \u2014 ils n'ont pas besoin d'installer l'application." },
      { q: "Peut-on avoir 2 appareils connect\xE9s en m\xEAme temps ?", a: "Non. ALERTE CI est limit\xE9 \xE0 1 appareil par compte. Si vous vous connectez sur un nouvel appareil, l'ancien sera automatiquement d\xE9connect\xE9." },
      { q: "L'essai gratuit, comment \xE7a marche ?", a: "D\xE8s la cr\xE9ation de votre compte, vous b\xE9n\xE9ficiez d'un mois d'acc\xE8s Premium gratuit \xE0 Alerte Violence et Alerte Enl\xE8vement. Pass\xE9 ce d\xE9lai, un abonnement est n\xE9cessaire pour continuer \xE0 y acc\xE9der." },
      { q: "Comment payer l'abonnement annuel ?", a: "Le paiement s'effectue directement dans l'application via Mobile Money (Orange, MTN), Wave CI, Moov Money ou carte bancaire Visa/Mastercard. Forfait annuel : 3 000 FCFA/an (ou 1 000 FCFA/mois)." },
      { q: "Les num\xE9ros CI sont \xE0 combien de chiffres ?", a: "Les num\xE9ros ivoiriens sont \xE0 10 chiffres (ex: 0700000000). L'application accepte uniquement les formats valides \xE0 10 chiffres." },
      { q: "La localisation GPS est-elle toujours active ?", a: "Non. La localisation GPS n'est activ\xE9e que lors d'une Alerte Violence ou d'un partage de position (Alerte Enl\xE8vement)." },
      { q: "L'application fonctionne-t-elle sans connexion ?", a: "Certaines fonctionnalit\xE9s n\xE9cessitent internet. L'alerte violence peut fonctionner en mode d\xE9grad\xE9 via SMS si configur\xE9." },
      { q: "Comment contacter le support ALERTE CI ?", a: "Via la rubrique 'Aide & Support' dans votre profil, par email ou via notre WhatsApp officiel disponible sur la page \xC0 propos." }
    ];
    return /* @__PURE__ */ (0, o.jsxs)("div", { className: "scr on", style: { display: "flex" }, children: [
      /* @__PURE__ */ (0, o.jsxs)("div", { className: "scrl", children: [
        /* @__PURE__ */ (0, o.jsxs)("div", { className: "scrhdr", children: [
          /* @__PURE__ */ (0, o.jsx)("button", { className: "bk", onClick: t, children: /* @__PURE__ */ (0, o.jsx)(_, { n: "back", s: 18, c: s.ink }) }),
          /* @__PURE__ */ (0, o.jsx)("p", { className: "scrttl", children: "Questions fr\xE9quentes" })
        ] }),
        /* @__PURE__ */ (0, o.jsx)("div", { style: { padding: "0 20px 12px" }, children: /* @__PURE__ */ (0, o.jsxs)("div", { className: "if", children: [
          /* @__PURE__ */ (0, o.jsx)(_, { n: "help", s: 18, c: s.faint }),
          /* @__PURE__ */ (0, o.jsx)("input", { placeholder: "Rechercher une question..." })
        ] }) }),
        /* @__PURE__ */ (0, o.jsx)("div", { className: "qal", children: l.map((i, u) => /* @__PURE__ */ (0, o.jsxs)("div", { className: "qai si", style: { animationDelay: `${u * 30}ms` }, children: [
          /* @__PURE__ */ (0, o.jsxs)("div", { className: "qaq", onClick: () => a(n === u ? null : u), children: [
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 13, fontWeight: 600, color: s.ink, flex: 1, lineHeight: 1.4 }, children: i.q }),
            /* @__PURE__ */ (0, o.jsx)("span", { className: `qach ${n === u ? "op" : ""}`, children: /* @__PURE__ */ (0, o.jsx)(_, { n: "chevd", s: 16, c: s.faint }) })
          ] }),
          n === u && /* @__PURE__ */ (0, o.jsx)("p", { className: "qaa", children: i.a })
        ] }, u)) }),
        /* @__PURE__ */ (0, o.jsx)("div", { style: { height: 24 } })
      ] }),
      /* @__PURE__ */ (0, o.jsx)(hl, { a: "profil", go: e })
    ] });
  };
  var ay = ({ go: e, goBack: t, userInfo: n = {}, setUserInfo: a, plan: l = "gratuit", setPlan: i, seDeconnecter: u }) => {
    const [c, r] = (0, S.useState)(false);
    const [g, m] = (0, S.useState)({
      nm: n.nm || "",
      ph: n.ph || "",
      mail: n.mail || "",
      commune: n.commune || ""
    });
    const [v, p] = (0, S.useState)({ ...g });
    const [y, T] = (0, S.useState)(false);
    (0, S.useEffect)(() => {
      const D = { nm: n.nm || "", ph: n.ph || "", mail: n.mail || "", commune: n.commune || "" };
      m(D);
      p(D);
    }, [n.nm, n.ph]);
    const z = () => {
      m({ ...v });
      a && a((D) => ({ ...D, ...v }));
      T(true);
      wt();
      setTimeout(() => {
        T(false);
        r(false);
      }, 1200);
    };
    const U = n.plan || l;
    const f = U === "premium" ? "PREMIUM" : "GRATUIT";
    const d = U === "premium" ? s.orange : s.green;
    const h = (g.nm || "?").split(" ").map((D) => D[0] || "").join("").slice(0, 2).toUpperCase() || "??";
    const [b, k] = (0, S.useState)(false);
    return /* @__PURE__ */ (0, o.jsxs)("div", { className: "scr on", style: { display: "flex", position: "relative" }, children: [
      b && /* @__PURE__ */ (0, o.jsx)(
        "div",
        {
          style: { position: "absolute", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 99, display: "flex", alignItems: "flex-end" },
          onClick: () => k(false),
          children: /* @__PURE__ */ (0, o.jsxs)(
            "div",
            {
              style: { width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "20px 24px 36px", animation: "stin 280ms var(--eo)" },
              onClick: (D) => D.stopPropagation(),
              children: [
                /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 36, height: 4, borderRadius: 2, background: s.surfH, margin: "0 auto 20px" } }),
                /* @__PURE__ */ (0, o.jsx)("p", { style: { fontFamily: "Sora,sans-serif", fontSize: 18, fontWeight: 800, color: s.ink, textAlign: "center", marginBottom: 6, letterSpacing: "-.3px" }, children: "\u2B50 G\xE9rer mon Abonnement" }),
                /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 12, color: s.muted, textAlign: "center", marginBottom: 20 }, children: [
                  "Forfait actuel : ",
                  /* @__PURE__ */ (0, o.jsxs)("strong", { style: { color: d }, children: [
                    "FORFAIT ",
                    f
                  ] })
                ] }),
                /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: [
                  /* @__PURE__ */ (0, o.jsxs)(
                    "button",
                    {
                      onClick: () => {
                        k(false);
                        e("paiement");
                      },
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "16px",
                        borderRadius: 16,
                        border: `2px solid ${U === "premium" ? s.orange : "rgba(0,0,0,.07)"}`,
                        background: U === "premium" ? s.orangeL : "#fff",
                        cursor: "pointer",
                        fontFamily: "Plus Jakarta Sans"
                      },
                      children: [
                        /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 24 }, children: "\u2B50" }),
                        /* @__PURE__ */ (0, o.jsxs)("div", { style: { flex: 1, textAlign: "left" }, children: [
                          /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 14, fontWeight: 800, color: s.ink }, children: "Premium Annuel" }),
                          /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, color: s.muted, marginTop: 2 }, children: "Alerte Violence \xB7 Alerte Enl\xE8vement \xB7 3 000 FCFA/an" })
                        ] }),
                        U === "premium" && /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 10, fontWeight: 800, color: s.orange, background: s.orangeL, padding: "3px 8px", borderRadius: 20 }, children: "Actif" }),
                        /* @__PURE__ */ (0, o.jsx)(_, { n: "arrow", s: 14, c: s.faint })
                      ]
                    }
                  ),
                  /* @__PURE__ */ (0, o.jsxs)(
                    "button",
                    {
                      onClick: () => {
                        k(false);
                        e("paiement");
                      },
                      style: { display: "flex", alignItems: "center", gap: 12, padding: "16px", borderRadius: 16, border: "2px solid rgba(0,0,0,.07)", background: "#fff", cursor: "pointer", fontFamily: "Plus Jakarta Sans" },
                      children: [
                        /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 24 }, children: "\u{1F504}" }),
                        /* @__PURE__ */ (0, o.jsxs)("div", { style: { flex: 1, textAlign: "left" }, children: [
                          /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 14, fontWeight: 800, color: s.ink }, children: "Premium Mensuel" }),
                          /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, color: s.muted, marginTop: 2 }, children: "Sans engagement \xB7 1 000 FCFA/mois" })
                        ] }),
                        /* @__PURE__ */ (0, o.jsx)(_, { n: "arrow", s: 14, c: s.faint })
                      ]
                    }
                  ),
                  /* @__PURE__ */ (0, o.jsxs)(
                    "button",
                    {
                      onClick: () => {
                        a && a((D) => ({ ...D, plan: "gratuit" }));
                        i && i("gratuit");
                        k(false);
                        wt();
                      },
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "16px",
                        borderRadius: 16,
                        border: `2px solid ${U === "gratuit" ? "rgba(22,163,74,.4)" : "rgba(0,0,0,.07)"}`,
                        background: U === "gratuit" ? s.greenL : "#fff",
                        cursor: "pointer",
                        fontFamily: "Plus Jakarta Sans"
                      },
                      children: [
                        /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 24 }, children: "\u{1F7E2}" }),
                        /* @__PURE__ */ (0, o.jsxs)("div", { style: { flex: 1, textAlign: "left" }, children: [
                          /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 14, fontWeight: 800, color: s.ink }, children: "Forfait Gratuit" }),
                          /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, color: s.muted, marginTop: 2 }, children: "Alerte Violence et Alerte Enl\xE8vement verrouill\xE9es \xB7 0 FCFA" })
                        ] }),
                        U === "gratuit" && /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 10, fontWeight: 800, color: s.green, background: s.greenL, padding: "3px 8px", borderRadius: 20 }, children: "Actif" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ (0, o.jsx)(
                  "button",
                  {
                    className: "btn btn-g",
                    style: { marginTop: 14 },
                    onClick: () => k(false),
                    children: "Fermer"
                  }
                )
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ (0, o.jsxs)("div", { className: "scrl", children: [
        /* @__PURE__ */ (0, o.jsxs)("div", { style: { padding: "24px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
          /* @__PURE__ */ (0, o.jsx)("p", { style: { fontFamily: "Sora,sans-serif", fontSize: 22, fontWeight: 800, color: s.ink, letterSpacing: "-.5px" }, children: "Mon profil" }),
          !c && /* @__PURE__ */ (0, o.jsx)(
            "button",
            {
              onClick: () => {
                p({ ...g });
                r(true);
              },
              style: { fontSize: 12, fontWeight: 700, color: s.orange, background: s.orangeL, border: "none", borderRadius: 10, padding: "7px 14px", cursor: "pointer" },
              children: "\u270F\uFE0F Modifier"
            }
          )
        ] }),
        /* @__PURE__ */ (0, o.jsxs)("div", { style: { padding: "20px 20px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }, children: [
          /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#F97316,#FB923C)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#fff" }, children: h }),
          !c && (g.nm ? /* @__PURE__ */ (0, o.jsx)("p", { style: { fontFamily: "Sora,sans-serif", fontSize: 20, fontWeight: 800, color: s.ink, letterSpacing: "-.5px" }, children: g.nm }) : /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 13, color: s.muted }, children: "Nom non renseign\xE9" })),
          /* @__PURE__ */ (0, o.jsxs)("span", { className: "bg bg-or", style: { background: d + "18", color: d }, children: [
            "FORFAIT ",
            f
          ] })
        ] }),
        /* @__PURE__ */ (0, o.jsx)("div", { className: "pm", children: c ? (
          /* ── MODE ÉDITION ── */
          /* @__PURE__ */ (0, o.jsxs)(o.Fragment, { children: [
            /* @__PURE__ */ (0, o.jsx)("p", { className: "fst", style: { marginTop: 0 }, children: "Modifier mes informations" }),
            /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: [
              /* @__PURE__ */ (0, o.jsxs)("div", { className: "if", children: [
                /* @__PURE__ */ (0, o.jsx)(_, { n: "user", s: 18, c: s.faint }),
                /* @__PURE__ */ (0, o.jsx)(
                  "input",
                  {
                    value: v.nm,
                    onChange: (D) => p((E) => ({ ...E, nm: D.target.value })),
                    placeholder: "Nom et pr\xE9nom"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, o.jsxs)("div", { className: "if", children: [
                /* @__PURE__ */ (0, o.jsx)(_, { n: "phone", s: 18, c: s.faint }),
                /* @__PURE__ */ (0, o.jsx)(
                  "input",
                  {
                    type: "tel",
                    value: v.ph,
                    onChange: (D) => p((E) => ({ ...E, ph: D.target.value })),
                    placeholder: "T\xE9l\xE9phone (10 chiffres)",
                    maxLength: 10
                  }
                )
              ] }),
              /* @__PURE__ */ (0, o.jsxs)("div", { className: "if", children: [
                /* @__PURE__ */ (0, o.jsx)(_, { n: "mail", s: 18, c: s.faint }),
                /* @__PURE__ */ (0, o.jsx)(
                  "input",
                  {
                    type: "email",
                    value: v.mail,
                    onChange: (D) => p((E) => ({ ...E, mail: D.target.value })),
                    placeholder: "Email (facultatif)"
                  }
                ),
                /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 9, fontWeight: 700, color: s.faint, background: s.surf, padding: "2px 6px", borderRadius: 8, flexShrink: 0 }, children: "Optionnel" })
              ] }),
              /* @__PURE__ */ (0, o.jsxs)("div", { className: "if", children: [
                /* @__PURE__ */ (0, o.jsx)(_, { n: "pin", s: 18, c: s.faint }),
                /* @__PURE__ */ (0, o.jsx)(
                  "select",
                  {
                    value: v.commune,
                    onChange: (D) => p((E) => ({ ...E, commune: D.target.value })),
                    style: { flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15, fontWeight: 500, color: s.ink, appearance: "none" },
                    children: Sg.map((D) => /* @__PURE__ */ (0, o.jsx)("option", { children: D }, D))
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", gap: 10, marginTop: 4 }, children: [
              /* @__PURE__ */ (0, o.jsx)("button", { className: "btn btn-g", style: { flex: 1 }, onClick: () => r(false), children: "Annuler" }),
              /* @__PURE__ */ (0, o.jsx)("button", { className: "btn btn-p", style: { flex: 1, opacity: y ? 1 : 1 }, onClick: z, children: y ? /* @__PURE__ */ (0, o.jsxs)(o.Fragment, { children: [
                /* @__PURE__ */ (0, o.jsx)(_, { n: "check", s: 16, c: "#fff" }),
                "Enregistr\xE9 !"
              ] }) : /* @__PURE__ */ (0, o.jsxs)(o.Fragment, { children: [
                /* @__PURE__ */ (0, o.jsx)(_, { n: "check", s: 16, c: "#fff" }),
                "Sauvegarder"
              ] }) })
            ] })
          ] })
        ) : (
          /* ── MODE LECTURE ── */
          /* @__PURE__ */ (0, o.jsxs)(o.Fragment, { children: [
            /* @__PURE__ */ (0, o.jsx)("p", { className: "fst", style: { marginTop: 0 }, children: "Informations personnelles" }),
            [
              { ic: "user", label: "Nom complet", val: g.nm, fallback: "Non renseign\xE9" },
              { ic: "phone", label: "T\xE9l\xE9phone", val: g.ph, fallback: "Non renseign\xE9" },
              { ic: "mail", label: "Email", val: g.mail, fallback: "Non renseign\xE9" },
              { ic: "pin", label: "Commune", val: g.commune, fallback: "Non renseign\xE9e" }
            ].map((D, E) => /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 12, background: "#fff", border: `1px solid ${s.border}`, borderRadius: 14, padding: "14px 16px" }, children: [
              /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 36, height: 36, borderRadius: 10, background: D.val ? s.orangeL : s.surf, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: /* @__PURE__ */ (0, o.jsx)(_, { n: D.ic, s: 17, c: D.val ? s.orange : s.faint }) }),
              /* @__PURE__ */ (0, o.jsxs)("div", { style: { flex: 1 }, children: [
                /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 11, fontWeight: 700, color: s.faint, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 2 }, children: D.label }),
                /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 14, fontWeight: D.val ? 600 : 400, color: D.val ? s.ink : s.faint }, children: D.val || D.fallback })
              ] }),
              D.val && /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 12, color: s.green }, children: "\u2713" })
            ] }, E)),
            /* @__PURE__ */ (0, o.jsx)("div", { style: { height: 8 } }),
            [
              { ic: "settings", lb: "Param\xE8tres", sc: "parametres" },
              { ic: "help", lb: "FAQ \u2014 Questions fr\xE9quentes", sc: "faq" },
              { ic: "file", lb: "Conditions d'utilisation", sc: "cgu" },
              { ic: "shield2", lb: "Politique de confidentialit\xE9", sc: "cgu" }
            ].map((D, E) => /* @__PURE__ */ (0, o.jsxs)("button", { className: "pmi", onClick: () => D.sc && e(D.sc), children: [
              /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 34, height: 34, borderRadius: 10, background: s.surf, display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ (0, o.jsx)(_, { n: D.ic, s: 17, c: s.muted }) }),
              /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 14, fontWeight: 600, color: s.ink, flex: 1, textAlign: "left" }, children: D.lb }),
              /* @__PURE__ */ (0, o.jsx)(_, { n: "arrow", s: 14, c: s.faint })
            ] }, E)),
            /* @__PURE__ */ (0, o.jsx)("div", { style: { height: 4 } }),
            /* @__PURE__ */ (0, o.jsx)(
              "button",
              {
                className: "btn btn-p",
                style: { background: U === "premium" ? "linear-gradient(135deg,#7C3AED,#8B5CF6)" : void 0 },
                onClick: () => k(true),
                children: "\u2B50 G\xE9rer mon Abonnement"
              }
            ),
            /* @__PURE__ */ (0, o.jsx)("button", { className: "btn btn-g", onClick: () => {
              u ? u() : e("splash");
            }, children: "Se d\xE9connecter" })
          ] })
        ) }),
        /* @__PURE__ */ (0, o.jsx)("div", { style: { height: 24 } })
      ] }),
      /* @__PURE__ */ (0, o.jsx)(hl, { a: "profil", go: e })
    ] });
  };
  var ly = ({ go: e, goBack: t }) => {
    const [n, a] = (0, S.useState)(true);
    const [l, i] = (0, S.useState)(true);
    const [u, c] = (0, S.useState)(false);
    const [r, g] = (0, S.useState)("fr");
    return /* @__PURE__ */ (0, o.jsxs)("div", { className: "scr on", style: { display: "flex" }, children: [
      /* @__PURE__ */ (0, o.jsxs)("div", { className: "scrl", children: [
        /* @__PURE__ */ (0, o.jsxs)("div", { className: "scrhdr", children: [
          /* @__PURE__ */ (0, o.jsx)("button", { className: "bk", onClick: t, children: /* @__PURE__ */ (0, o.jsx)(_, { n: "back", s: 18, c: s.ink }) }),
          /* @__PURE__ */ (0, o.jsx)("p", { className: "scrttl", children: "Param\xE8tres" })
        ] }),
        /* @__PURE__ */ (0, o.jsxs)("div", { className: "pm", children: [
          /* @__PURE__ */ (0, o.jsx)("p", { className: "fst", style: { marginTop: 0 }, children: "Notifications" }),
          [
            { lb: "Son de notification", sub: "Jouer un son \xE0 chaque alerte", val: n, set: a },
            { lb: "Notifications push", sub: "Recevoir les alertes en arri\xE8re-plan", val: l, set: i }
          ].map((m, v) => /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: `1px solid ${s.border}`, borderRadius: 14, padding: "14px 16px" }, children: [
            /* @__PURE__ */ (0, o.jsxs)("div", { children: [
              /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 14, fontWeight: 600, color: s.ink }, children: m.lb }),
              /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 11, color: s.muted, marginTop: 2 }, children: m.sub })
            ] }),
            /* @__PURE__ */ (0, o.jsx)("button", { className: `tsw ${m.val ? "on" : "off"}`, onClick: () => {
              m.set((p) => !p);
              wt();
            }, children: /* @__PURE__ */ (0, o.jsx)("div", { className: `tth ${m.val ? "on" : "off"}` }) })
          ] }, v)),
          /* @__PURE__ */ (0, o.jsx)("p", { className: "fst", children: "Affichage" }),
          /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: `1px solid ${s.border}`, borderRadius: 14, padding: "14px 16px" }, children: [
            /* @__PURE__ */ (0, o.jsxs)("div", { children: [
              /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 14, fontWeight: 600, color: s.ink }, children: "Mode sombre" }),
              /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 11, color: s.muted, marginTop: 2 }, children: "Th\xE8me fonc\xE9 pour l'interface" })
            ] }),
            /* @__PURE__ */ (0, o.jsx)("button", { className: `tsw ${u ? "on" : "off"}`, onClick: () => c((m) => !m), children: /* @__PURE__ */ (0, o.jsx)("div", { className: `tth ${u ? "on" : "off"}` }) })
          ] }),
          /* @__PURE__ */ (0, o.jsx)("p", { className: "fst", children: "Langue" }),
          /* @__PURE__ */ (0, o.jsx)("div", { style: { display: "flex", gap: 8 }, children: [{ id: "fr", lb: "Fran\xE7ais" }, { id: "dj", lb: "Dioula" }, { id: "en", lb: "English" }].map((m) => /* @__PURE__ */ (0, o.jsx)(
            "button",
            {
              onClick: () => g(m.id),
              style: { flex: 1, padding: "12px 6px", borderRadius: 12, border: `2px solid ${r === m.id ? s.orange : s.border}`, background: r === m.id ? s.orangeL : "#fff", cursor: "pointer", fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 700, color: r === m.id ? s.orange : s.muted },
              children: m.lb
            },
            m.id
          )) }),
          /* @__PURE__ */ (0, o.jsx)("p", { className: "fst", children: "Compte" }),
          /* @__PURE__ */ (0, o.jsxs)("button", { className: "pmi", onClick: () => e("profil"), children: [
            /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 34, height: 34, borderRadius: 10, background: s.surf, display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ (0, o.jsx)(_, { n: "user", s: 17, c: s.muted }) }),
            /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 14, fontWeight: 600, color: s.ink, flex: 1, textAlign: "left" }, children: "Modifier mes informations" }),
            /* @__PURE__ */ (0, o.jsx)(_, { n: "arrow", s: 14, c: s.faint })
          ] }),
          /* @__PURE__ */ (0, o.jsxs)("button", { className: "pmi", onClick: () => e("cgu"), children: [
            /* @__PURE__ */ (0, o.jsx)("div", { style: { width: 34, height: 34, borderRadius: 10, background: s.surf, display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ (0, o.jsx)(_, { n: "file", s: 17, c: s.muted }) }),
            /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 14, fontWeight: 600, color: s.ink, flex: 1, textAlign: "left" }, children: "Conditions d'utilisation" }),
            /* @__PURE__ */ (0, o.jsx)(_, { n: "arrow", s: 14, c: s.faint })
          ] }),
          /* @__PURE__ */ (0, o.jsx)("div", { style: { height: 4 } }),
          /* @__PURE__ */ (0, o.jsx)("button", { className: "btn btn-g", onClick: () => e("splash"), style: { color: "#DC2626" }, children: "Supprimer mon compte" }),
          /* @__PURE__ */ (0, o.jsx)("div", { style: { height: 20 } })
        ] })
      ] }),
      /* @__PURE__ */ (0, o.jsx)(hl, { a: "profil", go: e })
    ] });
  };
  function hs() {
    const [e, t] = (0, S.useState)(["splash"]);
    const n = e[e.length - 1];
    const [a, l] = (0, S.useState)(() => {
      try {
        return window.localStorage.getItem("alerteci_session_plan") || "gratuit";
      } catch (B) {
        return "gratuit";
      }
    });
    const [i, u] = (0, S.useState)(() => {
      try {
        const B = window.localStorage.getItem("alerteci_session_user");
        return B ? JSON.parse(B) : { nm: "", ph: "", mail: "", commune: "", plan: "gratuit" };
      } catch (B) {
        return { nm: "", ph: "", mail: "", commune: "", plan: "gratuit" };
      }
    });
    (0, S.useEffect)(() => {
      try {
        window.localStorage.setItem("alerteci_session_plan", a);
      } catch (B) {
      }
    }, [a]);
    (0, S.useEffect)(() => {
      try {
        window.localStorage.setItem("alerteci_session_user", JSON.stringify(i));
      } catch (B) {
      }
    }, [i]);
    (0, S.useEffect)(() => {
      if (!i.ph) return;
      const B = setTimeout(() => Zh(i.ph), 5e3);
      return () => clearTimeout(B);
    }, [i.ph]);
    const c = (B) => {
      const $ = ["splash", "home"];
      if ($.includes(B)) {
        t([B]);
      } else {
        t((J) => [...J, B]);
      }
    };
    const r = () => {
      t((B) => {
        if (B.length <= 1) return B;
        return B.slice(0, -1);
      });
    };
    const g = 30 * 24 * 60 * 60 * 1e3;
    const m = (() => {
      if (!i.creeLe) return { actif: false, joursRestants: 0 };
      const B = Date.now() - i.creeLe;
      const $ = g - B;
      if ($ <= 0) return { actif: false, joursRestants: 0 };
      return { actif: true, joursRestants: Math.max(1, Math.ceil($ / (24 * 60 * 60 * 1e3))) };
    })();
    const v = a === "premium" ? "premium" : m.actif ? "premium" : "gratuit";
    const [p, y] = (0, S.useState)(null);
    const T = (0, S.useRef)(/* @__PURE__ */ new Set());
    const z = (0, S.useRef)(/* @__PURE__ */ new Set());
    const U = (0, S.useRef)(/* @__PURE__ */ new Set());
    const [f, d] = (0, S.useState)([]);
    (0, S.useEffect)(() => {
      let B = true;
      const $ = async () => {
        if (i.ph) {
          const he = await Yh(i.ph);
          if (B && he.length) {
            const Ne = {};
            he.forEach((V) => {
              if (!V.alerteId) return;
              const Ht = Ne[V.alerteId];
              if (!Ht || (V.ts || 0) > (Ht.ts || 0)) Ne[V.alerteId] = V;
            });
            Object.values(Ne).forEach((V) => {
              if (V.fin) {
                T.current.add(V.alerteId);
                z.current.add(V.alerteId);
                ba();
                y((H) => H && H.alerteId === V.alerteId ? null : H);
                return;
              }
              if (Wn(V.victime && V.victime.ph) === Wn(i.ph)) return;
              if (U.current.has(V.alerteId)) return;
              const Ht = T.current.has(V.alerteId);
              const O = z.current.has(V.alerteId);
              if (!Ht) {
                T.current.add(V.alerteId);
                if (V.gps) d([{ lat: V.gps.lat, lng: V.gps.lng, ts: V.ts || Date.now() }]);
                y(V);
                if (!O) {
                  const H = V.victime && V.victime.nm || "Un proche";
                  Ci(V.type === "gps" ? `${H} partage sa position avec vous. Suivez son d\xE9placement dans l'application.` : `Alerte ! ${H} est en danger ! ${H} est en danger !`);
                }
              } else {
                if (V.gps) d((H) => {
                  const ce = H[H.length - 1];
                  if (ce && ce.lat === V.gps.lat && ce.lng === V.gps.lng) return H;
                  return [...H.slice(-49), { lat: V.gps.lat, lng: V.gps.lng, ts: V.ts || Date.now() }];
                });
                y((H) => H && H.alerteId === V.alerteId ? V : H);
              }
            });
          }
        }
      };
      $();
      const J = setInterval($, 3e3);
      return () => {
        B = false;
        clearInterval(J);
      };
    }, [i.ph]);
    (0, S.useEffect)(() => {
      try {
        window.history.pushState({ alerteci: true }, "");
        window.history.pushState({ alerteci: true }, "");
      } catch ($) {
      }
      const B = () => {
        t(($) => {
          if ($.length <= 1) return $;
          const J = $.slice(0, -1);
          const he = J[J.length - 1];
          if (he === "splash") return ["home"];
          return J;
        });
        try {
          window.history.pushState({ alerteci: true }, "");
        } catch ($) {
        }
      };
      window.addEventListener("popstate", B);
      return () => window.removeEventListener("popstate", B);
    }, [i.plan]);
    const [h, b] = (0, S.useState)([]);
    const k = (B, $) => {
      b((J) => J.some((he) => he.id === B) ? J : [...J, { id: B, nom: $, lat: null, lng: null, precision: null, ts: Date.now(), contacts: [] }]);
    };
    const D = (B, $) => {
      b((J) => {
        const he = J.some((Ne) => Ne.id === B);
        if (he) return J.map((Ne) => Ne.id === B ? { ...Ne, ...$ } : Ne);
        return [...J, $];
      });
    };
    const E = (B) => {
      b(($) => $.filter((J) => J.id !== B));
    };
    const [j, L] = (0, S.useState)(() => {
      try {
        const B = window.localStorage.getItem("alerteci_comptes");
        return B ? JSON.parse(B) : [];
      } catch (B) {
        return [];
      }
    });
    (0, S.useEffect)(() => {
      try {
        window.localStorage.setItem("alerteci_comptes", JSON.stringify(j));
      } catch (B) {
      }
    }, [j]);
    const q = (B) => {
      const $ = { ...B, id: `acc-${Date.now()}`, creeLe: Date.now() };
      L((J) => [...J, $]);
      u($);
      l(B.plan);
      jh($).then((J) => {
        if (J && J.id) {
          L((he) => he.map((Ne) => Ne.id === $.id ? { ...Ne, cloudId: J.id } : Ne));
          u((he) => he.id === $.id ? { ...he, cloudId: J.id } : he);
        }
      }).catch(() => {
      });
    };
    const Y = () => {
      u({ nm: "", ph: "", mail: "", commune: "", plan: "gratuit" });
      l("gratuit");
      c("splash");
    };
    const Ue = () => {
      l("premium");
      u((B) => ({ ...B, plan: "premium" }));
      c("home");
    };
    const Le = () => c("home");
    const st = {
      splash: /* @__PURE__ */ (0, o.jsx)(Bh, { go: c, userInfo: i, onAcces: Le }),
      login: /* @__PURE__ */ (0, o.jsx)(Jh, { go: c, goBack: r, setPlan: l, setUserInfo: u, userInfo: i, comptesInscrits: j }),
      home: /* @__PURE__ */ (0, o.jsx)(Wh, { go: c, plan: v, userInfo: i, essai: m }),
      violence: /* @__PURE__ */ (0, o.jsx)($h, { go: c, goBack: r, userInfo: i }),
      enlevement: /* @__PURE__ */ (0, o.jsx)(Ih, { go: c, goBack: r, userInfo: i, partagesGps: h, demarrerPartageGps: k, arreterPartageGps: E, majPositionGps: D }),
      signup: /* @__PURE__ */ (0, o.jsx)(ey, { go: c, goBack: r, onSignup: q, userInfo: i, comptesInscrits: j }),
      paiement: /* @__PURE__ */ (0, o.jsx)(Ph, { go: c, goBack: r, onSuccess: Ue }),
      parametres: /* @__PURE__ */ (0, o.jsx)(ly, { go: c, goBack: r }),
      cgu: /* @__PURE__ */ (0, o.jsx)(ty, { go: c, goBack: r }),
      faq: /* @__PURE__ */ (0, o.jsx)(ny, { go: c, goBack: r }),
      profil: /* @__PURE__ */ (0, o.jsx)(ay, { go: c, goBack: r, userInfo: i, setUserInfo: u, plan: v, setPlan: l, seDeconnecter: Y })
    };
    return /* @__PURE__ */ (0, o.jsxs)(o.Fragment, { children: [
      /* @__PURE__ */ (0, o.jsx)("style", { dangerouslySetInnerHTML: { __html: wh } }),
      /* @__PURE__ */ (0, o.jsxs)("div", { className: "shell", children: [
        /* @__PURE__ */ (0, o.jsx)("div", { className: "sbar", children: /* @__PURE__ */ (0, o.jsx)("span", { children: /* @__PURE__ */ (0, o.jsx)(us, {}) }) }),
        p && /* @__PURE__ */ (0, o.jsx)("div", { onClick: () => {
          try {
            Ag();
            if (!$n && !z.current.has(p.alerteId)) Ci();
          } catch (B) {
          }
        }, style: {
          position: "absolute",
          inset: 0,
          zIndex: 300,
          display: "flex",
          flexDirection: "column",
          background: p.type === "gps" ? "linear-gradient(165deg,#2E1065,#4C1D95)" : "linear-gradient(165deg,#450A0A,#7F1D1D)",
          animation: "stin 250ms var(--esp)",
          overflowY: "auto"
        }, children: /* @__PURE__ */ (0, o.jsxs)("div", { style: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "28px 24px", gap: 14 }, children: [
          /* @__PURE__ */ (0, o.jsxs)("div", { style: { textAlign: "center" }, children: [
            /* @__PURE__ */ (0, o.jsx)("div", { style: {
              width: 72,
              height: 72,
              borderRadius: "50%",
              margin: "0 auto 14px",
              background: "rgba(255,255,255,.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              animation: "bk 0.9s ease infinite"
            }, children: p.type === "gps" ? "\u{1F4CD}" : "\u{1F6A8}" }),
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontFamily: "Sora,sans-serif", fontSize: 21, fontWeight: 800, color: "#fff", letterSpacing: "-.4px", marginBottom: 6 }, children: p.type === "gps" ? "SUIVI DE POSITION EN DIRECT" : "ALERTE URGENCE" }),
            /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 14, color: "rgba(255,255,255,.85)", fontWeight: 700, lineHeight: 1.5 }, children: p.type === "gps" ? /* @__PURE__ */ (0, o.jsxs)(o.Fragment, { children: [
              /* @__PURE__ */ (0, o.jsx)("strong", { style: { color: "#DDD6FE" }, children: p.victime && p.victime.nm || "Un proche" }),
              " partage sa position avec vous suite \xE0 un risque de disparition."
            ] }) : /* @__PURE__ */ (0, o.jsxs)(o.Fragment, { children: [
              /* @__PURE__ */ (0, o.jsx)("strong", { style: { color: "#FECACA" }, children: p.victime && p.victime.nm || "Un proche" }),
              " est en danger !",
              /* @__PURE__ */ (0, o.jsx)("br", {}),
              "Appelez imm\xE9diatement."
            ] }) })
          ] }),
          p.victime && p.victime.ph && /* @__PURE__ */ (0, o.jsxs)(
            "a",
            {
              href: `tel:${p.victime.ph}`,
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                background: "#16A34A",
                borderRadius: 16,
                padding: "16px",
                textDecoration: "none",
                boxShadow: "0 8px 24px rgba(22,163,74,.4)"
              },
              children: [
                /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 18 }, children: "\u{1F4DE}" }),
                /* @__PURE__ */ (0, o.jsxs)("span", { style: { fontSize: 15, fontWeight: 800, color: "#fff", fontFamily: "Sora,sans-serif" }, children: [
                  "APPELER ",
                  (p.victime.nm || "").split(" ")[0].toUpperCase(),
                  " \xB7 ",
                  p.victime.ph
                ] })
              ]
            }
          ),
          /* @__PURE__ */ (0, o.jsxs)("div", { style: { background: "rgba(0,0,0,.25)", borderRadius: 16, padding: "14px 16px" }, children: [
            /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }, children: [
              "\u{1F4CD} Position ",
              p.gps ? "en direct" : ""
            ] }),
            p.gps ? /* @__PURE__ */ (0, o.jsxs)(o.Fragment, { children: [
              /* @__PURE__ */ (0, o.jsxs)("div", { style: { borderRadius: 14, overflow: "hidden", marginBottom: 10, border: "2px solid rgba(255,255,255,.2)", background: "#1A1A2E", position: "relative", height: 170 }, children: [
                /* @__PURE__ */ (0, o.jsx)(
                  "iframe",
                  {
                    title: "Position en direct",
                    width: "100%",
                    height: "170",
                    frameBorder: "0",
                    scrolling: "no",
                    style: { border: 0, display: "block" },
                    src: `https://www.openstreetmap.org/export/embed.html?bbox=${p.gps.lng - 4e-3}%2C${p.gps.lat - 3e-3}%2C${p.gps.lng + 4e-3}%2C${p.gps.lat + 3e-3}&layer=mapnik&marker=${p.gps.lat}%2C${p.gps.lng}`
                  }
                ),
                /* @__PURE__ */ (0, o.jsxs)("div", { style: { position: "absolute", top: 8, left: 8, background: "rgba(220,38,38,.95)", borderRadius: 20, padding: "4px 10px", display: "flex", alignItems: "center", gap: 6, pointerEvents: "none" }, children: [
                  /* @__PURE__ */ (0, o.jsx)("span", { style: { width: 7, height: 7, borderRadius: "50%", background: "#fff", animation: "bk 1s ease infinite" } }),
                  /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 10, fontWeight: 800, color: "#fff" }, children: "EN DIRECT" })
                ] })
              ] }),
              /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }, children: [
                /* @__PURE__ */ (0, o.jsxs)("div", { children: [
                  /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 9, color: "rgba(255,255,255,.5)", fontWeight: 700 }, children: "LATITUDE" }),
                  /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: "monospace" }, children: p.gps.lat.toFixed(5) })
                ] }),
                /* @__PURE__ */ (0, o.jsxs)("div", { children: [
                  /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 9, color: "rgba(255,255,255,.5)", fontWeight: 700 }, children: "LONGITUDE" }),
                  /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: "monospace" }, children: p.gps.lng.toFixed(5) })
                ] })
              ] }),
              p.lienMaps && /* @__PURE__ */ (0, o.jsxs)(
                "a",
                {
                  href: p.lienMaps,
                  target: "_blank",
                  rel: "noreferrer",
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: "rgba(255,255,255,.95)",
                    borderRadius: 12,
                    padding: "12px",
                    textDecoration: "none",
                    marginBottom: 10
                  },
                  children: [
                    /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 15 }, children: "\u{1F5FA}\uFE0F" }),
                    /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 13, fontWeight: 800, color: "#1C1917" }, children: "Ouvrir dans Google Maps" })
                  ]
                }
              ),
              f.length > 1 && /* @__PURE__ */ (0, o.jsxs)("div", { style: { marginTop: 4 }, children: [
                /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }, children: [
                  "\u{1F553} Historique du trajet (",
                  f.length,
                  " points)"
                ] }),
                /* @__PURE__ */ (0, o.jsx)("div", { style: { maxHeight: 120, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }, children: f.slice().reverse().map((B, $) => /* @__PURE__ */ (0, o.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.06)", borderRadius: 8, padding: "6px 10px" }, children: [
                  /* @__PURE__ */ (0, o.jsx)("span", { style: { width: 6, height: 6, borderRadius: "50%", background: $ === 0 ? "#22C55E" : "rgba(255,255,255,.4)", flexShrink: 0 } }),
                  /* @__PURE__ */ (0, o.jsxs)("span", { style: { fontSize: 11, color: "rgba(255,255,255,.85)", fontFamily: "monospace", flex: 1 }, children: [
                    B.lat.toFixed(5),
                    ", ",
                    B.lng.toFixed(5)
                  ] }),
                  /* @__PURE__ */ (0, o.jsx)("span", { style: { fontSize: 10, color: "rgba(255,255,255,.5)" }, children: new Date(B.ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) })
                ] }, $)) })
              ] }),
              /* @__PURE__ */ (0, o.jsxs)("p", { style: { fontSize: 10, color: "rgba(255,255,255,.45)", marginTop: 8, textAlign: "center" }, children: [
                "Derni\xE8re position ",
                new Date(p.ts || Date.now()).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
                " \xB7 mise \xE0 jour automatique"
              ] })
            ] }) : /* @__PURE__ */ (0, o.jsx)("p", { style: { fontSize: 12, color: "rgba(255,255,255,.7)", lineHeight: 1.5 }, children: "Recherche de la position en cours\u2026 Le lien s'affichera ici automatiquement d\xE8s qu'elle est disponible." })
          ] }),
          !(p && z.current.has(p.alerteId)) && /* @__PURE__ */ (0, o.jsx)(
            "button",
            {
              onClick: () => {
                if (p && p.alerteId) z.current.add(p.alerteId);
                ba();
                if (p && p.type !== "gps") y(null);
                else y((B) => B ? { ...B } : B);
              },
              style: {
                background: "rgba(255,255,255,.14)",
                border: "1.5px solid rgba(255,255,255,.3)",
                borderRadius: 14,
                padding: "13px",
                cursor: "pointer",
                color: "#fff",
                fontSize: 13,
                fontWeight: 800,
                fontFamily: "Plus Jakarta Sans"
              },
              children: "\u2713 J'ai pris connaissance \u2014 arr\xEAter l'alarme"
            }
          ),
          p && p.type === "gps" && /* @__PURE__ */ (0, o.jsx)(
            "button",
            {
              onClick: () => {
                if (p.alerteId) {
                  U.current.add(p.alerteId);
                  z.current.add(p.alerteId);
                }
                ba();
                y(null);
                d([]);
              },
              style: {
                background: "transparent",
                border: "1.5px solid rgba(255,255,255,.25)",
                borderRadius: 14,
                padding: "11px",
                cursor: "pointer",
                color: "rgba(255,255,255,.75)",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "Plus Jakarta Sans",
                marginTop: 8
              },
              children: "\u2715 Fermer le suivi de position"
            }
          )
        ] }) }),
        st[n]
      ] })
    ] });
  }

  // entry.jsx
  var Cg = Aa(xi());
  var iy = (0, Eg.createRoot)(document.getElementById("root"));
  iy.render(/* @__PURE__ */ (0, Cg.jsx)(hs, {}));
})();
/*! Bundled license information:

scheduler/cjs/scheduler.production.js:
  (**
   * @license React
   * scheduler.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.production.js:
  (**
   * @license React
   * react-dom.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom-client.production.js:
  (**
   * @license React
   * react-dom-client.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.js:
  (**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
