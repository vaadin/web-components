/*!
 * Quill Editor v1.3.6
 * https://quilljs.com/
 * Copyright (c) 2014, Jason Chen
 * Copyright (c) 2013, salesforce.com
 */
!(function (t, e) {
  t.Quill = e();
})(window, function () {
  return (function (t) {
    function e(r) {
      if (n[r]) return n[r].exports;
      var o = (n[r] = { i: r, l: !1, exports: {} });
      return t[r].call(o.exports, o, o.exports, e), (o.l = !0), o.exports;
    }
    var n = {};
    return (
      (e.m = t),
      (e.c = n),
      (e.d = function (t, n, r) {
        e.o(t, n) || Object.defineProperty(t, n, { configurable: !1, enumerable: !0, get: r });
      }),
      (e.n = function (t) {
        var n =
          t && t.__esModule
            ? function () {
                return t.default;
              }
            : function () {
                return t;
              };
        return e.d(n, 'a', n), n;
      }),
      (e.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
      }),
      (e.p = ''),
      e((e.s = 132))
    );
  })([
    function (t, e, n) {
      'use strict';
      Object.defineProperty(e, '__esModule', { value: !0 });
      var r = n(17),
        o = n(18),
        i = n(19),
        a = n(54),
        u = n(55),
        l = n(56),
        s = n(57),
        c = n(58),
        f = n(10),
        p = n(29),
        d = n(30),
        h = n(28),
        y = n(1),
        v = {
          Scope: y.Scope,
          create: y.create,
          find: y.find,
          query: y.query,
          register: y.register,
          Container: r.default,
          Format: o.default,
          Leaf: i.default,
          Embed: s.default,
          Scroll: a.default,
          Block: l.default,
          Inline: u.default,
          Text: c.default,
          Attributor: { Attribute: f.default, Class: p.default, Style: d.default, Store: h.default }
        };
      e.default = v;
    },
    function (t, e, n) {
      'use strict';
      function r(t, e) {
        var n = i(t);
        if (null == n) throw new l('Unable to create ' + t + ' blot');
        var r = n;
        return new r(t instanceof Node || t.nodeType === Node.TEXT_NODE ? t : r.create(e), e);
      }
      function o(t, n) {
        return (
          void 0 === n && (n = !1),
          null == t ? null : null != t[e.DATA_KEY] ? t[e.DATA_KEY].blot : n ? o(t.parentNode, n) : null
        );
      }
      function i(t, e) {
        void 0 === e && (e = d.ANY);
        var n;
        if ('string' == typeof t) n = p[t] || s[t];
        else if (t instanceof Text || t.nodeType === Node.TEXT_NODE) n = p.text;
        else if ('number' == typeof t) t & d.LEVEL & d.BLOCK ? (n = p.block) : t & d.LEVEL & d.INLINE && (n = p.inline);
        else if (t instanceof HTMLElement) {
          var r = (t.getAttribute('class') || '').split(/\s+/);
          for (var o in r) if ((n = c[r[o]])) break;
          n = n || f[t.tagName];
        }
        return null == n ? null : e & d.LEVEL & n.scope && e & d.TYPE & n.scope ? n : null;
      }
      function a() {
        for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
        if (t.length > 1)
          return t.map(function (t) {
            return a(t);
          });
        var n = t[0];
        if ('string' != typeof n.blotName && 'string' != typeof n.attrName) throw new l('Invalid definition');
        if ('abstract' === n.blotName) throw new l('Cannot register abstract class');
        if (((p[n.blotName || n.attrName] = n), 'string' == typeof n.keyName)) s[n.keyName] = n;
        else if ((null != n.className && (c[n.className] = n), null != n.tagName)) {
          Array.isArray(n.tagName)
            ? (n.tagName = n.tagName.map(function (t) {
                return t.toUpperCase();
              }))
            : (n.tagName = n.tagName.toUpperCase());
          var r = Array.isArray(n.tagName) ? n.tagName : [n.tagName];
          r.forEach(function (t) {
            (null != f[t] && null != n.className) || (f[t] = n);
          });
        }
        return n;
      }
      var u =
        (this && this.__extends) ||
        (function () {
          var t =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
            };
          return function (e, n) {
            function r() {
              this.constructor = e;
            }
            t(e, n), (e.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()));
          };
        })();
      Object.defineProperty(e, '__esModule', { value: !0 });
      var l = (function (t) {
        function e(e) {
          var n = this;
          return (
            (e = '[Parchment] ' + e), (n = t.call(this, e) || this), (n.message = e), (n.name = n.constructor.name), n
          );
        }
        return u(e, t), e;
      })(Error);
      e.ParchmentError = l;
      var s = {},
        c = {},
        f = {},
        p = {};
      e.DATA_KEY = '__blot';
      var d;
      !(function (t) {
        (t[(t.TYPE = 3)] = 'TYPE'),
          (t[(t.LEVEL = 12)] = 'LEVEL'),
          (t[(t.ATTRIBUTE = 13)] = 'ATTRIBUTE'),
          (t[(t.BLOT = 14)] = 'BLOT'),
          (t[(t.INLINE = 7)] = 'INLINE'),
          (t[(t.BLOCK = 11)] = 'BLOCK'),
          (t[(t.BLOCK_BLOT = 10)] = 'BLOCK_BLOT'),
          (t[(t.INLINE_BLOT = 6)] = 'INLINE_BLOT'),
          (t[(t.BLOCK_ATTRIBUTE = 9)] = 'BLOCK_ATTRIBUTE'),
          (t[(t.INLINE_ATTRIBUTE = 5)] = 'INLINE_ATTRIBUTE'),
          (t[(t.ANY = 15)] = 'ANY');
      })((d = e.Scope || (e.Scope = {}))),
        (e.create = r),
        (e.find = o),
        (e.query = i),
        (e.register = a);
    },
    function (t, e, n) {
      'use strict';
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function o(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function i(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function a(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      function u(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        return null == t
          ? e
          : ('function' == typeof t.formats && (e = (0, f.default)(e, t.formats())),
            null == t.parent || 'scroll' == t.parent.blotName || t.parent.statics.scope !== t.statics.scope
              ? e
              : u(t.parent, e));
      }
      Object.defineProperty(e, '__esModule', { value: !0 }), (e.default = e.BlockEmbed = e.bubbleFormats = void 0);
      var l = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        s = function t(e, n, r) {
          null === e && (e = Function.prototype);
          var o = Object.getOwnPropertyDescriptor(e, n);
          if (void 0 === o) {
            var i = Object.getPrototypeOf(e);
            return null === i ? void 0 : t(i, n, r);
          }
          if ('value' in o) return o.value;
          var a = o.get;
          if (void 0 !== a) return a.call(r);
        },
        c = n(3),
        f = r(c),
        p = n(5),
        d = r(p),
        h = n(0),
        y = r(h),
        v = n(15),
        b = r(v),
        g = n(4),
        m = r(g),
        _ = n(7),
        O = r(_),
        w = (function (t) {
          function e() {
            return o(this, e), i(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments));
          }
          return (
            a(e, t),
            l(e, [
              {
                key: 'attach',
                value: function () {
                  s(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'attach', this).call(this),
                    (this.attributes = new y.default.Attributor.Store(this.domNode));
                }
              },
              {
                key: 'delta',
                value: function () {
                  return new d.default().insert(this.value(), (0, f.default)(this.formats(), this.attributes.values()));
                }
              },
              {
                key: 'format',
                value: function (t, e) {
                  var n = y.default.query(t, y.default.Scope.BLOCK_ATTRIBUTE);
                  null != n && this.attributes.attribute(n, e);
                }
              },
              {
                key: 'formatAt',
                value: function (t, e, n, r) {
                  this.format(n, r);
                }
              },
              {
                key: 'insertAt',
                value: function (t, n, r) {
                  if ('string' == typeof n && n.endsWith('\n')) {
                    var o = y.default.create(E.blotName);
                    this.parent.insertBefore(o, 0 === t ? this : this.next), o.insertAt(0, n.slice(0, -1));
                  } else
                    s(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'insertAt', this).call(
                      this,
                      t,
                      n,
                      r
                    );
                }
              }
            ]),
            e
          );
        })(y.default.Embed);
      w.scope = y.default.Scope.BLOCK_BLOT;
      var E = (function (t) {
        function e(t) {
          o(this, e);
          var n = i(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t));
          return (n.cache = {}), n;
        }
        return (
          a(e, t),
          l(e, [
            {
              key: 'delta',
              value: function () {
                return (
                  null == this.cache.delta &&
                    (this.cache.delta = this.descendants(y.default.Leaf)
                      .reduce(function (t, e) {
                        return 0 === e.length() ? t : t.insert(e.value(), u(e));
                      }, new d.default())
                      .insert('\n', u(this))),
                  this.cache.delta
                );
              }
            },
            {
              key: 'deleteAt',
              value: function (t, n) {
                s(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'deleteAt', this).call(this, t, n),
                  (this.cache = {});
              }
            },
            {
              key: 'formatAt',
              value: function (t, n, r, o) {
                n <= 0 ||
                  (y.default.query(r, y.default.Scope.BLOCK)
                    ? t + n === this.length() && this.format(r, o)
                    : s(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'formatAt', this).call(
                        this,
                        t,
                        Math.min(n, this.length() - t - 1),
                        r,
                        o
                      ),
                  (this.cache = {}));
              }
            },
            {
              key: 'insertAt',
              value: function (t, n, r) {
                if (null != r)
                  return s(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'insertAt', this).call(
                    this,
                    t,
                    n,
                    r
                  );
                if (0 !== n.length) {
                  var o = n.split('\n'),
                    i = o.shift();
                  i.length > 0 &&
                    (t < this.length() - 1 || null == this.children.tail
                      ? s(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'insertAt', this).call(
                          this,
                          Math.min(t, this.length() - 1),
                          i
                        )
                      : this.children.tail.insertAt(this.children.tail.length(), i),
                    (this.cache = {}));
                  var a = this;
                  o.reduce(function (t, e) {
                    return (a = a.split(t, !0)), a.insertAt(0, e), e.length;
                  }, t + i.length);
                }
              }
            },
            {
              key: 'insertBefore',
              value: function (t, n) {
                var r = this.children.head;
                s(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'insertBefore', this).call(this, t, n),
                  r instanceof b.default && r.remove(),
                  (this.cache = {});
              }
            },
            {
              key: 'length',
              value: function () {
                return (
                  null == this.cache.length &&
                    (this.cache.length =
                      s(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'length', this).call(this) + 1),
                  this.cache.length
                );
              }
            },
            {
              key: 'moveChildren',
              value: function (t, n) {
                s(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'moveChildren', this).call(this, t, n),
                  (this.cache = {});
              }
            },
            {
              key: 'optimize',
              value: function (t) {
                s(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'optimize', this).call(this, t),
                  (this.cache = {});
              }
            },
            {
              key: 'path',
              value: function (t) {
                return s(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'path', this).call(this, t, !0);
              }
            },
            {
              key: 'removeChild',
              value: function (t) {
                s(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'removeChild', this).call(this, t),
                  (this.cache = {});
              }
            },
            {
              key: 'split',
              value: function (t) {
                var n = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                if (n && (0 === t || t >= this.length() - 1)) {
                  var r = this.clone();
                  return 0 === t
                    ? (this.parent.insertBefore(r, this), this)
                    : (this.parent.insertBefore(r, this.next), r);
                }
                var o = s(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'split', this).call(this, t, n);
                return (this.cache = {}), o;
              }
            }
          ]),
          e
        );
      })(y.default.Block);
      (E.blotName = 'block'),
        (E.tagName = 'P'),
        (E.defaultChild = 'break'),
        (E.allowedChildren = [m.default, y.default.Embed, O.default]),
        (e.bubbleFormats = u),
        (e.BlockEmbed = w),
        (e.default = E);
    },
    function (t, e) {
      'use strict';
      var n = Object.prototype.hasOwnProperty,
        r = Object.prototype.toString,
        o = Object.defineProperty,
        i = Object.getOwnPropertyDescriptor,
        a = function (t) {
          return 'function' == typeof Array.isArray ? Array.isArray(t) : '[object Array]' === r.call(t);
        },
        u = function (t) {
          if (!t || '[object Object]' !== r.call(t)) return !1;
          var e = n.call(t, 'constructor'),
            o = t.constructor && t.constructor.prototype && n.call(t.constructor.prototype, 'isPrototypeOf');
          if (t.constructor && !e && !o) return !1;
          var i;
          for (i in t);
          return void 0 === i || n.call(t, i);
        },
        l = function (t, e) {
          o && '__proto__' === e.name
            ? o(t, e.name, { enumerable: !0, configurable: !0, value: e.newValue, writable: !0 })
            : (t[e.name] = e.newValue);
        },
        s = function (t, e) {
          if ('__proto__' === e) {
            if (!n.call(t, e)) return;
            if (i) return i(t, e).value;
          }
          return t[e];
        };
      t.exports = function t() {
        var e,
          n,
          r,
          o,
          i,
          c,
          f = arguments[0],
          p = 1,
          d = arguments.length,
          h = !1;
        for (
          'boolean' == typeof f && ((h = f), (f = arguments[1] || {}), (p = 2)),
            (null == f || ('object' != typeof f && 'function' != typeof f)) && (f = {});
          p < d;
          ++p
        )
          if (null != (e = arguments[p]))
            for (n in e)
              (r = s(f, n)),
                (o = s(e, n)),
                f !== o &&
                  (h && o && (u(o) || (i = a(o)))
                    ? (i ? ((i = !1), (c = r && a(r) ? r : [])) : (c = r && u(r) ? r : {}),
                      l(f, { name: n, newValue: t(h, c, o) }))
                    : void 0 !== o && l(f, { name: n, newValue: o }));
        return f;
      };
    },
    function (t, e, n) {
      'use strict';
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function o(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function i(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function a(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      var u = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        l = function t(e, n, r) {
          null === e && (e = Function.prototype);
          var o = Object.getOwnPropertyDescriptor(e, n);
          if (void 0 === o) {
            var i = Object.getPrototypeOf(e);
            return null === i ? void 0 : t(i, n, r);
          }
          if ('value' in o) return o.value;
          var a = o.get;
          if (void 0 !== a) return a.call(r);
        },
        s = n(7),
        c = r(s),
        f = n(0),
        p = r(f),
        d = (function (t) {
          function e() {
            return o(this, e), i(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments));
          }
          return (
            a(e, t),
            u(
              e,
              [
                {
                  key: 'formatAt',
                  value: function (t, n, r, o) {
                    if (e.compare(this.statics.blotName, r) < 0 && p.default.query(r, p.default.Scope.BLOT)) {
                      var i = this.isolate(t, n);
                      o && i.wrap(r, o);
                    } else
                      l(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'formatAt', this).call(
                        this,
                        t,
                        n,
                        r,
                        o
                      );
                  }
                },
                {
                  key: 'optimize',
                  value: function (t) {
                    if (
                      (l(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'optimize', this).call(this, t),
                      this.parent instanceof e && e.compare(this.statics.blotName, this.parent.statics.blotName) > 0)
                    ) {
                      var n = this.parent.isolate(this.offset(), this.length());
                      this.moveChildren(n), n.wrap(this);
                    }
                  }
                }
              ],
              [
                {
                  key: 'compare',
                  value: function (t, n) {
                    var r = e.order.indexOf(t),
                      o = e.order.indexOf(n);
                    return r >= 0 || o >= 0 ? r - o : t === n ? 0 : t < n ? -1 : 1;
                  }
                }
              ]
            ),
            e
          );
        })(p.default.Inline);
      (d.allowedChildren = [d, p.default.Embed, c.default]),
        (d.order = ['cursor', 'inline', 'underline', 'strike', 'italic', 'bold', 'script', 'link', 'code']),
        (e.default = d);
    },
    function (t, e, n) {
      var r = n(60),
        o = n(11),
        i = n(3),
        a = n(23),
        u = String.fromCharCode(0),
        l = function (t) {
          Array.isArray(t) ? (this.ops = t) : null != t && Array.isArray(t.ops) ? (this.ops = t.ops) : (this.ops = []);
        };
      (l.prototype.insert = function (t, e) {
        var n = {};
        return 0 === t.length
          ? this
          : ((n.insert = t),
            null != e && 'object' == typeof e && Object.keys(e).length > 0 && (n.attributes = e),
            this.push(n));
      }),
        (l.prototype.delete = function (t) {
          return t <= 0 ? this : this.push({ delete: t });
        }),
        (l.prototype.retain = function (t, e) {
          if (t <= 0) return this;
          var n = { retain: t };
          return null != e && 'object' == typeof e && Object.keys(e).length > 0 && (n.attributes = e), this.push(n);
        }),
        (l.prototype.push = function (t) {
          var e = this.ops.length,
            n = this.ops[e - 1];
          if (((t = i(!0, {}, t)), 'object' == typeof n)) {
            if ('number' == typeof t.delete && 'number' == typeof n.delete)
              return (this.ops[e - 1] = { delete: n.delete + t.delete }), this;
            if ('number' == typeof n.delete && null != t.insert && ((e -= 1), 'object' != typeof (n = this.ops[e - 1])))
              return this.ops.unshift(t), this;
            if (o(t.attributes, n.attributes)) {
              if ('string' == typeof t.insert && 'string' == typeof n.insert)
                return (
                  (this.ops[e - 1] = { insert: n.insert + t.insert }),
                  'object' == typeof t.attributes && (this.ops[e - 1].attributes = t.attributes),
                  this
                );
              if ('number' == typeof t.retain && 'number' == typeof n.retain)
                return (
                  (this.ops[e - 1] = { retain: n.retain + t.retain }),
                  'object' == typeof t.attributes && (this.ops[e - 1].attributes = t.attributes),
                  this
                );
            }
          }
          return e === this.ops.length ? this.ops.push(t) : this.ops.splice(e, 0, t), this;
        }),
        (l.prototype.chop = function () {
          var t = this.ops[this.ops.length - 1];
          return t && t.retain && !t.attributes && this.ops.pop(), this;
        }),
        (l.prototype.filter = function (t) {
          return this.ops.filter(t);
        }),
        (l.prototype.forEach = function (t) {
          this.ops.forEach(t);
        }),
        (l.prototype.map = function (t) {
          return this.ops.map(t);
        }),
        (l.prototype.partition = function (t) {
          var e = [],
            n = [];
          return (
            this.forEach(function (r) {
              (t(r) ? e : n).push(r);
            }),
            [e, n]
          );
        }),
        (l.prototype.reduce = function (t, e) {
          return this.ops.reduce(t, e);
        }),
        (l.prototype.changeLength = function () {
          return this.reduce(function (t, e) {
            return e.insert ? t + a.length(e) : e.delete ? t - e.delete : t;
          }, 0);
        }),
        (l.prototype.length = function () {
          return this.reduce(function (t, e) {
            return t + a.length(e);
          }, 0);
        }),
        (l.prototype.slice = function (t, e) {
          (t = t || 0), 'number' != typeof e && (e = 1 / 0);
          for (var n = [], r = a.iterator(this.ops), o = 0; o < e && r.hasNext(); ) {
            var i;
            o < t ? (i = r.next(t - o)) : ((i = r.next(e - o)), n.push(i)), (o += a.length(i));
          }
          return new l(n);
        }),
        (l.prototype.compose = function (t) {
          var e = a.iterator(this.ops),
            n = a.iterator(t.ops),
            r = [],
            i = n.peek();
          if (null != i && 'number' == typeof i.retain && null == i.attributes) {
            for (var u = i.retain; 'insert' === e.peekType() && e.peekLength() <= u; )
              (u -= e.peekLength()), r.push(e.next());
            i.retain - u > 0 && n.next(i.retain - u);
          }
          for (var s = new l(r); e.hasNext() || n.hasNext(); )
            if ('insert' === n.peekType()) s.push(n.next());
            else if ('delete' === e.peekType()) s.push(e.next());
            else {
              var c = Math.min(e.peekLength(), n.peekLength()),
                f = e.next(c),
                p = n.next(c);
              if ('number' == typeof p.retain) {
                var d = {};
                'number' == typeof f.retain ? (d.retain = c) : (d.insert = f.insert);
                var h = a.attributes.compose(f.attributes, p.attributes, 'number' == typeof f.retain);
                if ((h && (d.attributes = h), s.push(d), !n.hasNext() && o(s.ops[s.ops.length - 1], d))) {
                  var y = new l(e.rest());
                  return s.concat(y).chop();
                }
              } else 'number' == typeof p.delete && 'number' == typeof f.retain && s.push(p);
            }
          return s.chop();
        }),
        (l.prototype.concat = function (t) {
          var e = new l(this.ops.slice());
          return t.ops.length > 0 && (e.push(t.ops[0]), (e.ops = e.ops.concat(t.ops.slice(1)))), e;
        }),
        (l.prototype.diff = function (t, e) {
          if (this.ops === t.ops) return new l();
          var n = [this, t].map(function (e) {
              return e
                .map(function (n) {
                  if (null != n.insert) return 'string' == typeof n.insert ? n.insert : u;
                  var r = e === t ? 'on' : 'with';
                  throw new Error('diff() called ' + r + ' non-document');
                })
                .join('');
            }),
            i = new l(),
            s = r(n[0], n[1], e),
            c = a.iterator(this.ops),
            f = a.iterator(t.ops);
          return (
            s.forEach(function (t) {
              for (var e = t[1].length; e > 0; ) {
                var n = 0;
                switch (t[0]) {
                  case r.INSERT:
                    (n = Math.min(f.peekLength(), e)), i.push(f.next(n));
                    break;
                  case r.DELETE:
                    (n = Math.min(e, c.peekLength())), c.next(n), i.delete(n);
                    break;
                  case r.EQUAL:
                    n = Math.min(c.peekLength(), f.peekLength(), e);
                    var u = c.next(n),
                      l = f.next(n);
                    o(u.insert, l.insert)
                      ? i.retain(n, a.attributes.diff(u.attributes, l.attributes))
                      : i.push(l).delete(n);
                }
                e -= n;
              }
            }),
            i.chop()
          );
        }),
        (l.prototype.eachLine = function (t, e) {
          e = e || '\n';
          for (var n = a.iterator(this.ops), r = new l(), o = 0; n.hasNext(); ) {
            if ('insert' !== n.peekType()) return;
            var i = n.peek(),
              u = a.length(i) - n.peekLength(),
              s = 'string' == typeof i.insert ? i.insert.indexOf(e, u) - u : -1;
            if (s < 0) r.push(n.next());
            else if (s > 0) r.push(n.next(s));
            else {
              if (!1 === t(r, n.next(1).attributes || {}, o)) return;
              (o += 1), (r = new l());
            }
          }
          r.length() > 0 && t(r, {}, o);
        }),
        (l.prototype.transform = function (t, e) {
          if (((e = !!e), 'number' == typeof t)) return this.transformPosition(t, e);
          for (var n = a.iterator(this.ops), r = a.iterator(t.ops), o = new l(); n.hasNext() || r.hasNext(); )
            if ('insert' !== n.peekType() || (!e && 'insert' === r.peekType()))
              if ('insert' === r.peekType()) o.push(r.next());
              else {
                var i = Math.min(n.peekLength(), r.peekLength()),
                  u = n.next(i),
                  s = r.next(i);
                if (u.delete) continue;
                s.delete ? o.push(s) : o.retain(i, a.attributes.transform(u.attributes, s.attributes, e));
              }
            else o.retain(a.length(n.next()));
          return o.chop();
        }),
        (l.prototype.transformPosition = function (t, e) {
          e = !!e;
          for (var n = a.iterator(this.ops), r = 0; n.hasNext() && r <= t; ) {
            var o = n.peekLength(),
              i = n.peekType();
            n.next(),
              'delete' !== i ? ('insert' === i && (r < t || !e) && (t += o), (r += o)) : (t -= Math.min(o, t - r));
          }
          return t;
        }),
        (t.exports = l);
    },
    function (t, e, n) {
      'use strict';
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function o(t, e, n) {
        return (
          e in t
            ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 })
            : (t[e] = n),
          t
        );
      }
      function i(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function a(t, e) {
        if (
          ((e = (0, A.default)(!0, { container: t, modules: { clipboard: !0, keyboard: !0, history: !0 } }, e)),
          e.theme && e.theme !== C.DEFAULTS.theme)
        ) {
          if (((e.theme = C.import('themes/' + e.theme)), null == e.theme))
            throw new Error('Invalid theme ' + e.theme + '. Did you register it?');
        } else e.theme = P.default;
        var n = (0, A.default)(!0, {}, e.theme.DEFAULTS);
        [n, e].forEach(function (t) {
          (t.modules = t.modules || {}),
            Object.keys(t.modules).forEach(function (e) {
              !0 === t.modules[e] && (t.modules[e] = {});
            });
        });
        var r = Object.keys(n.modules).concat(Object.keys(e.modules)),
          o = r.reduce(function (t, e) {
            var n = C.import('modules/' + e);
            return (
              null == n
                ? T.error('Cannot load ' + e + ' module. Are you sure you registered it?')
                : (t[e] = n.DEFAULTS || {}),
              t
            );
          }, {});
        return (
          null != e.modules &&
            e.modules.toolbar &&
            e.modules.toolbar.constructor !== Object &&
            (e.modules.toolbar = { container: e.modules.toolbar }),
          (e = (0, A.default)(!0, {}, C.DEFAULTS, { modules: o }, n, e)),
          ['bounds', 'container', 'scrollingContainer'].forEach(function (t) {
            'string' == typeof e[t] && (e[t] = document.querySelector(e[t]));
          }),
          (e.modules = Object.keys(e.modules).reduce(function (t, n) {
            return e.modules[n] && (t[n] = e.modules[n]), t;
          }, {})),
          e
        );
      }
      function u(t, e, n, r) {
        if (this.options.strict && !this.isEnabled() && e === g.default.sources.USER) return new h.default();
        var o = null == n ? null : this.getSelection(),
          i = this.editor.delta,
          a = t();
        if (
          (null != o &&
            (!0 === n && (n = o.index),
            null == r ? (o = s(o, a, e)) : 0 !== r && (o = s(o, n, r, e)),
            this.setSelection(o, g.default.sources.SILENT)),
          a.length() > 0)
        ) {
          var u,
            l = [g.default.events.TEXT_CHANGE, a, i, e];
          if (
            ((u = this.emitter).emit.apply(u, [g.default.events.EDITOR_CHANGE].concat(l)),
            e !== g.default.sources.SILENT)
          ) {
            var c;
            (c = this.emitter).emit.apply(c, l);
          }
        }
        return a;
      }
      function l(t, e, n, r, o) {
        var i = {};
        return (
          'number' == typeof t.index && 'number' == typeof t.length
            ? 'number' != typeof e
              ? ((o = r), (r = n), (n = e), (e = t.length), (t = t.index))
              : ((e = t.length), (t = t.index))
            : 'number' != typeof e && ((o = r), (r = n), (n = e), (e = 0)),
          'object' === (void 0 === n ? 'undefined' : c(n))
            ? ((i = n), (o = r))
            : 'string' == typeof n && (null != r ? (i[n] = r) : (o = n)),
          (o = o || g.default.sources.API),
          [t, e, i, o]
        );
      }
      function s(t, e, n, r) {
        if (null == t) return null;
        var o = void 0,
          i = void 0;
        if (e instanceof h.default) {
          var a = [t.index, t.index + t.length].map(function (t) {
              return e.transformPosition(t, r !== g.default.sources.USER);
            }),
            u = f(a, 2);
          (o = u[0]), (i = u[1]);
        } else {
          var l = [t.index, t.index + t.length].map(function (t) {
              return t < e || (t === e && r === g.default.sources.USER) ? t : n >= 0 ? t + n : Math.max(e, t + n);
            }),
            s = f(l, 2);
          (o = s[0]), (i = s[1]);
        }
        return new E.Range(o, i - o);
      }
      Object.defineProperty(e, '__esModule', { value: !0 }), (e.default = e.overload = e.expandConfig = void 0);
      var c =
          'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
            ? function (t) {
                return typeof t;
              }
            : function (t) {
                return t && 'function' == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype
                  ? 'symbol'
                  : typeof t;
              },
        f = (function () {
          function t(t, e) {
            var n = [],
              r = !0,
              o = !1,
              i = void 0;
            try {
              for (
                var a, u = t[Symbol.iterator]();
                !(r = (a = u.next()).done) && (n.push(a.value), !e || n.length !== e);
                r = !0
              );
            } catch (t) {
              (o = !0), (i = t);
            } finally {
              try {
                !r && u.return && u.return();
              } finally {
                if (o) throw i;
              }
            }
            return n;
          }
          return function (e, n) {
            if (Array.isArray(e)) return e;
            if (Symbol.iterator in Object(e)) return t(e, n);
            throw new TypeError('Invalid attempt to destructure non-iterable instance');
          };
        })(),
        p = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })();
      n(59);
      var d = n(5),
        h = r(d),
        y = n(72),
        v = r(y),
        b = n(14),
        g = r(b),
        m = n(9),
        _ = r(m),
        O = n(0),
        w = r(O),
        E = n(41),
        N = r(E),
        j = n(3),
        A = r(j),
        k = n(8),
        x = r(k),
        S = n(49),
        P = r(S),
        T = (0, x.default)('quill'),
        C = (function () {
          function t(e) {
            var n = this,
              r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
            if (
              (i(this, t), (this.options = a(e, r)), (this.container = this.options.container), null == this.container)
            )
              return T.error('Invalid Quill container', e);
            this.options.debug && t.debug(this.options.debug);
            var o = this.container.innerHTML.trim();
            this.container.classList.add('ql-container'),
              (this.container.innerHTML = ''),
              (this.container.__quill = this),
              (this.root = this.addContainer('ql-editor')),
              this.root.classList.add('ql-blank'),
              this.root.setAttribute('data-gramm', !1),
              (this.scrollingContainer = this.options.scrollingContainer || this.root),
              (this.emitter = new g.default()),
              (this.scroll = w.default.create(this.root, { emitter: this.emitter, whitelist: this.options.formats })),
              (this.editor = new v.default(this.scroll)),
              (this.selection = new N.default(this.scroll, this.emitter)),
              (this.theme = new this.options.theme(this, this.options)),
              (this.keyboard = this.theme.addModule('keyboard')),
              (this.clipboard = this.theme.addModule('clipboard')),
              (this.history = this.theme.addModule('history')),
              this.theme.init(),
              this.emitter.on(g.default.events.EDITOR_CHANGE, function (t) {
                t === g.default.events.TEXT_CHANGE && n.root.classList.toggle('ql-blank', n.editor.isBlank());
              }),
              this.emitter.on(g.default.events.SCROLL_UPDATE, function (t, e) {
                var r = n.selection.lastRange,
                  o = r && 0 === r.length ? r.index : void 0;
                u.call(
                  n,
                  function () {
                    return n.editor.update(null, e, o);
                  },
                  t
                );
              });
            var l = this.clipboard.convert(
              '<div class=\'ql-editor\' style="white-space: normal;">' + o + '<p><br></p></div>'
            );
            this.setContents(l),
              this.history.clear(),
              this.options.placeholder && this.root.setAttribute('data-placeholder', this.options.placeholder),
              this.options.readOnly && this.disable();
          }
          return (
            p(t, null, [
              {
                key: 'debug',
                value: function (t) {
                  !0 === t && (t = 'log'), x.default.level(t);
                }
              },
              {
                key: 'find',
                value: function (t) {
                  return t.__quill || w.default.find(t);
                }
              },
              {
                key: 'import',
                value: function (t) {
                  return (
                    null == this.imports[t] && T.error('Cannot import ' + t + '. Are you sure it was registered?'),
                    this.imports[t]
                  );
                }
              },
              {
                key: 'register',
                value: function (t, e) {
                  var n = this,
                    r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
                  if ('string' != typeof t) {
                    var o = t.attrName || t.blotName;
                    'string' == typeof o
                      ? this.register('formats/' + o, t, e)
                      : Object.keys(t).forEach(function (r) {
                          n.register(r, t[r], e);
                        });
                  } else
                    null == this.imports[t] || r || T.warn('Overwriting ' + t + ' with', e),
                      (this.imports[t] = e),
                      (t.startsWith('blots/') || t.startsWith('formats/')) && 'abstract' !== e.blotName
                        ? w.default.register(e)
                        : t.startsWith('modules') && 'function' == typeof e.register && e.register();
                }
              }
            ]),
            p(t, [
              {
                key: 'addContainer',
                value: function (t) {
                  var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
                  if ('string' == typeof t) {
                    var n = t;
                    (t = document.createElement('div')), t.classList.add(n);
                  }
                  return this.container.insertBefore(t, e), t;
                }
              },
              {
                key: 'blur',
                value: function () {
                  this.selection.setRange(null);
                }
              },
              {
                key: 'deleteText',
                value: function (t, e, n) {
                  var r = this,
                    o = l(t, e, n),
                    i = f(o, 4);
                  return (
                    (t = i[0]),
                    (e = i[1]),
                    (n = i[3]),
                    u.call(
                      this,
                      function () {
                        return r.editor.deleteText(t, e);
                      },
                      n,
                      t,
                      -1 * e
                    )
                  );
                }
              },
              {
                key: 'disable',
                value: function () {
                  this.enable(!1);
                }
              },
              {
                key: 'enable',
                value: function () {
                  var t = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
                  this.scroll.enable(t), this.container.classList.toggle('ql-disabled', !t);
                }
              },
              {
                key: 'focus',
                value: function () {
                  var t = this.scrollingContainer.scrollTop;
                  this.selection.focus(), (this.scrollingContainer.scrollTop = t), this.scrollIntoView();
                }
              },
              {
                key: 'format',
                value: function (t, e) {
                  var n = this,
                    r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : g.default.sources.API;
                  return u.call(
                    this,
                    function () {
                      var r = n.getSelection(!0),
                        i = new h.default();
                      if (null == r) return i;
                      if (w.default.query(t, w.default.Scope.BLOCK))
                        i = n.editor.formatLine(r.index, r.length, o({}, t, e));
                      else {
                        if (0 === r.length) return n.selection.format(t, e), i;
                        i = n.editor.formatText(r.index, r.length, o({}, t, e));
                      }
                      return n.setSelection(r, g.default.sources.SILENT), i;
                    },
                    r
                  );
                }
              },
              {
                key: 'formatLine',
                value: function (t, e, n, r, o) {
                  var i = this,
                    a = void 0,
                    s = l(t, e, n, r, o),
                    c = f(s, 4);
                  return (
                    (t = c[0]),
                    (e = c[1]),
                    (a = c[2]),
                    (o = c[3]),
                    u.call(
                      this,
                      function () {
                        return i.editor.formatLine(t, e, a);
                      },
                      o,
                      t,
                      0
                    )
                  );
                }
              },
              {
                key: 'formatText',
                value: function (t, e, n, r, o) {
                  var i = this,
                    a = void 0,
                    s = l(t, e, n, r, o),
                    c = f(s, 4);
                  return (
                    (t = c[0]),
                    (e = c[1]),
                    (a = c[2]),
                    (o = c[3]),
                    u.call(
                      this,
                      function () {
                        return i.editor.formatText(t, e, a);
                      },
                      o,
                      t,
                      0
                    )
                  );
                }
              },
              {
                key: 'getBounds',
                value: function (t) {
                  var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
                    n = void 0;
                  n =
                    'number' == typeof t ? this.selection.getBounds(t, e) : this.selection.getBounds(t.index, t.length);
                  var r = this.container.getBoundingClientRect();
                  return {
                    bottom: n.bottom - r.top,
                    height: n.height,
                    left: n.left - r.left,
                    right: n.right - r.left,
                    top: n.top - r.top,
                    width: n.width
                  };
                }
              },
              {
                key: 'getContents',
                value: function () {
                  var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
                    e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.getLength() - t,
                    n = l(t, e),
                    r = f(n, 2);
                  return (t = r[0]), (e = r[1]), this.editor.getContents(t, e);
                }
              },
              {
                key: 'getFormat',
                value: function () {
                  var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.getSelection(!0),
                    e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
                  return 'number' == typeof t ? this.editor.getFormat(t, e) : this.editor.getFormat(t.index, t.length);
                }
              },
              {
                key: 'getIndex',
                value: function (t) {
                  return t.offset(this.scroll);
                }
              },
              {
                key: 'getLength',
                value: function () {
                  return this.scroll.length();
                }
              },
              {
                key: 'getLeaf',
                value: function (t) {
                  return this.scroll.leaf(t);
                }
              },
              {
                key: 'getLine',
                value: function (t) {
                  return this.scroll.line(t);
                }
              },
              {
                key: 'getLines',
                value: function () {
                  var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
                    e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : Number.MAX_VALUE;
                  return 'number' != typeof t ? this.scroll.lines(t.index, t.length) : this.scroll.lines(t, e);
                }
              },
              {
                key: 'getModule',
                value: function (t) {
                  return this.theme.modules[t];
                }
              },
              {
                key: 'getSelection',
                value: function () {
                  return (
                    arguments.length > 0 && void 0 !== arguments[0] && arguments[0] && this.focus(),
                    this.update(),
                    this.selection.getRange()[0]
                  );
                }
              },
              {
                key: 'getText',
                value: function () {
                  var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
                    e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.getLength() - t,
                    n = l(t, e),
                    r = f(n, 2);
                  return (t = r[0]), (e = r[1]), this.editor.getText(t, e);
                }
              },
              {
                key: 'hasFocus',
                value: function () {
                  return this.selection.hasFocus();
                }
              },
              {
                key: 'insertEmbed',
                value: function (e, n, r) {
                  var o = this,
                    i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : t.sources.API;
                  return u.call(
                    this,
                    function () {
                      return o.editor.insertEmbed(e, n, r);
                    },
                    i,
                    e
                  );
                }
              },
              {
                key: 'insertText',
                value: function (t, e, n, r, o) {
                  var i = this,
                    a = void 0,
                    s = l(t, 0, n, r, o),
                    c = f(s, 4);
                  return (
                    (t = c[0]),
                    (a = c[2]),
                    (o = c[3]),
                    u.call(
                      this,
                      function () {
                        return i.editor.insertText(t, e, a);
                      },
                      o,
                      t,
                      e.length
                    )
                  );
                }
              },
              {
                key: 'isEnabled',
                value: function () {
                  return !this.container.classList.contains('ql-disabled');
                }
              },
              {
                key: 'off',
                value: function () {
                  return this.emitter.off.apply(this.emitter, arguments);
                }
              },
              {
                key: 'on',
                value: function () {
                  return this.emitter.on.apply(this.emitter, arguments);
                }
              },
              {
                key: 'once',
                value: function () {
                  return this.emitter.once.apply(this.emitter, arguments);
                }
              },
              {
                key: 'pasteHTML',
                value: function (t, e, n) {
                  this.clipboard.dangerouslyPasteHTML(t, e, n);
                }
              },
              {
                key: 'removeFormat',
                value: function (t, e, n) {
                  var r = this,
                    o = l(t, e, n),
                    i = f(o, 4);
                  return (
                    (t = i[0]),
                    (e = i[1]),
                    (n = i[3]),
                    u.call(
                      this,
                      function () {
                        return r.editor.removeFormat(t, e);
                      },
                      n,
                      t
                    )
                  );
                }
              },
              {
                key: 'scrollIntoView',
                value: function () {
                  this.selection.scrollIntoView(this.scrollingContainer);
                }
              },
              {
                key: 'setContents',
                value: function (t) {
                  var e = this,
                    n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : g.default.sources.API;
                  return u.call(
                    this,
                    function () {
                      t = new h.default(t);
                      var n = e.getLength(),
                        r = e.editor.deleteText(0, n),
                        o = e.editor.applyDelta(t),
                        i = o.ops[o.ops.length - 1];
                      return (
                        null != i &&
                          'string' == typeof i.insert &&
                          '\n' === i.insert[i.insert.length - 1] &&
                          (e.editor.deleteText(e.getLength() - 1, 1), o.delete(1)),
                        r.compose(o)
                      );
                    },
                    n
                  );
                }
              },
              {
                key: 'setSelection',
                value: function (e, n, r) {
                  if (null == e) this.selection.setRange(null, n || t.sources.API);
                  else {
                    var o = l(e, n, r),
                      i = f(o, 4);
                    (e = i[0]),
                      (n = i[1]),
                      (r = i[3]),
                      this.selection.setRange(new E.Range(e, n), r),
                      r !== g.default.sources.SILENT && this.selection.scrollIntoView(this.scrollingContainer);
                  }
                }
              },
              {
                key: 'setText',
                value: function (t) {
                  var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : g.default.sources.API,
                    n = new h.default().insert(t);
                  return this.setContents(n, e);
                }
              },
              {
                key: 'update',
                value: function () {
                  var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : g.default.sources.USER,
                    e = this.scroll.update(t);
                  return this.selection.update(t), e;
                }
              },
              {
                key: 'updateContents',
                value: function (t) {
                  var e = this,
                    n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : g.default.sources.API;
                  return u.call(
                    this,
                    function () {
                      return (t = new h.default(t)), e.editor.applyDelta(t, n);
                    },
                    n,
                    !0
                  );
                }
              }
            ]),
            t
          );
        })();
      (C.DEFAULTS = {
        bounds: null,
        formats: null,
        modules: {},
        placeholder: '',
        readOnly: !1,
        scrollingContainer: null,
        strict: !0,
        theme: 'default'
      }),
        (C.events = g.default.events),
        (C.sources = g.default.sources),
        (C.version = '1.3.6'),
        (C.imports = { delta: h.default, parchment: w.default, 'core/module': _.default, 'core/theme': P.default }),
        (e.expandConfig = a),
        (e.overload = l),
        (e.default = C);
    },
    function (t, e, n) {
      'use strict';
      function r(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function o(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function i(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      var a = n(0),
        u = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(a),
        l = (function (t) {
          function e() {
            return r(this, e), o(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments));
          }
          return i(e, t), e;
        })(u.default.Text);
      e.default = l;
    },
    function (t, e, n) {
      'use strict';
      function r(t) {
        if (i.indexOf(t) <= i.indexOf(a)) {
          for (var e, n = arguments.length, r = Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++) r[o - 1] = arguments[o];
          (e = console)[t].apply(e, r);
        }
      }
      function o(t) {
        return i.reduce(function (e, n) {
          return (e[n] = r.bind(console, n, t)), e;
        }, {});
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      var i = ['error', 'warn', 'log', 'info'],
        a = 'warn';
      (r.level = o.level =
        function (t) {
          a = t;
        }),
        (e.default = o);
    },
    function (t, e, n) {
      'use strict';
      function r(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      var o = function t(e) {
        var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        r(this, t), (this.quill = e), (this.options = n);
      };
      (o.DEFAULTS = {}), (e.default = o);
    },
    function (t, e, n) {
      'use strict';
      Object.defineProperty(e, '__esModule', { value: !0 });
      var r = n(1),
        o = (function () {
          function t(t, e, n) {
            void 0 === n && (n = {}), (this.attrName = t), (this.keyName = e);
            var o = r.Scope.TYPE & r.Scope.ATTRIBUTE;
            null != n.scope ? (this.scope = (n.scope & r.Scope.LEVEL) | o) : (this.scope = r.Scope.ATTRIBUTE),
              null != n.whitelist && (this.whitelist = n.whitelist);
          }
          return (
            (t.keys = function (t) {
              return [].map.call(t.attributes, function (t) {
                return t.name;
              });
            }),
            (t.prototype.add = function (t, e) {
              return !!this.canAdd(t, e) && (t.setAttribute(this.keyName, e), !0);
            }),
            (t.prototype.canAdd = function (t, e) {
              return (
                null != r.query(t, r.Scope.BLOT & (this.scope | r.Scope.TYPE)) &&
                (null == this.whitelist ||
                  ('string' == typeof e
                    ? this.whitelist.indexOf(e.replace(/["']/g, '')) > -1
                    : this.whitelist.indexOf(e) > -1))
              );
            }),
            (t.prototype.remove = function (t) {
              t.removeAttribute(this.keyName);
            }),
            (t.prototype.value = function (t) {
              var e = t.getAttribute(this.keyName);
              return this.canAdd(t, e) && e ? e : '';
            }),
            t
          );
        })();
      e.default = o;
    },
    function (t, e, n) {
      function r(t, e, n) {
        var r = n || {};
        return (
          !(r.strict ? !s(t, e) : t !== e) ||
          (!t || !e || ('object' != typeof t && 'object' != typeof e) ? (r.strict ? s(t, e) : t == e) : a(t, e, r))
        );
      }
      function o(t) {
        return null === t || void 0 === t;
      }
      function i(t) {
        return (
          !(!t || 'object' != typeof t || 'number' != typeof t.length) &&
          'function' == typeof t.copy &&
          'function' == typeof t.slice &&
          !(t.length > 0 && 'number' != typeof t[0])
        );
      }
      function a(t, e, n) {
        var a, s;
        if (typeof t != typeof e) return !1;
        if (o(t) || o(e)) return !1;
        if (t.prototype !== e.prototype) return !1;
        if (l(t) !== l(e)) return !1;
        var h = c(t),
          y = c(e);
        if (h !== y) return !1;
        if (h || y) return t.source === e.source && f(t) === f(e);
        if (p(t) && p(e)) return d.call(t) === d.call(e);
        var v = i(t),
          b = i(e);
        if (v !== b) return !1;
        if (v || b) {
          if (t.length !== e.length) return !1;
          for (a = 0; a < t.length; a++) if (t[a] !== e[a]) return !1;
          return !0;
        }
        if (typeof t != typeof e) return !1;
        try {
          var g = u(t),
            m = u(e);
        } catch (t) {
          return !1;
        }
        if (g.length !== m.length) return !1;
        for (g.sort(), m.sort(), a = g.length - 1; a >= 0; a--) if (g[a] != m[a]) return !1;
        for (a = g.length - 1; a >= 0; a--) if (((s = g[a]), !r(t[s], e[s], n))) return !1;
        return !0;
      }
      var u = n(31),
        l = n(62),
        s = n(66),
        c = n(68),
        f = n(69),
        p = n(71),
        d = Date.prototype.getTime;
      t.exports = r;
    },
    function (t, e, n) {
      'use strict';
      var r = n(31),
        o = 'function' == typeof Symbol && 'symbol' == typeof Symbol('foo'),
        i = Object.prototype.toString,
        a = Array.prototype.concat,
        u = Object.defineProperty,
        l = function (t) {
          return 'function' == typeof t && '[object Function]' === i.call(t);
        },
        s =
          u &&
          (function () {
            var t = {};
            try {
              u(t, 'x', { enumerable: !1, value: t });
              for (var e in t) return !1;
              return t.x === t;
            } catch (t) {
              return !1;
            }
          })(),
        c = function (t, e, n, r) {
          (!(e in t) || (l(r) && r())) &&
            (s ? u(t, e, { configurable: !0, enumerable: !1, value: n, writable: !0 }) : (t[e] = n));
        },
        f = function (t, e) {
          var n = arguments.length > 2 ? arguments[2] : {},
            i = r(e);
          o && (i = a.call(i, Object.getOwnPropertySymbols(e)));
          for (var u = 0; u < i.length; u += 1) c(t, i[u], e[i[u]], n[i[u]]);
        };
      (f.supportsDescriptors = !!s), (t.exports = f);
    },
    function (t, e, n) {
      'use strict';
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function o(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function i(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function a(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      Object.defineProperty(e, '__esModule', { value: !0 }), (e.default = e.Code = void 0);
      var u = (function () {
          function t(t, e) {
            var n = [],
              r = !0,
              o = !1,
              i = void 0;
            try {
              for (
                var a, u = t[Symbol.iterator]();
                !(r = (a = u.next()).done) && (n.push(a.value), !e || n.length !== e);
                r = !0
              );
            } catch (t) {
              (o = !0), (i = t);
            } finally {
              try {
                !r && u.return && u.return();
              } finally {
                if (o) throw i;
              }
            }
            return n;
          }
          return function (e, n) {
            if (Array.isArray(e)) return e;
            if (Symbol.iterator in Object(e)) return t(e, n);
            throw new TypeError('Invalid attempt to destructure non-iterable instance');
          };
        })(),
        l = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        s = function t(e, n, r) {
          null === e && (e = Function.prototype);
          var o = Object.getOwnPropertyDescriptor(e, n);
          if (void 0 === o) {
            var i = Object.getPrototypeOf(e);
            return null === i ? void 0 : t(i, n, r);
          }
          if ('value' in o) return o.value;
          var a = o.get;
          if (void 0 !== a) return a.call(r);
        },
        c = n(5),
        f = r(c),
        p = n(0),
        d = r(p),
        h = n(2),
        y = r(h),
        v = n(4),
        b = r(v),
        g = n(7),
        m = r(g),
        _ = (function (t) {
          function e() {
            return o(this, e), i(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments));
          }
          return a(e, t), e;
        })(b.default);
      (_.blotName = 'code'), (_.tagName = 'CODE');
      var O = (function (t) {
        function e() {
          return o(this, e), i(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments));
        }
        return (
          a(e, t),
          l(
            e,
            [
              {
                key: 'delta',
                value: function () {
                  var t = this,
                    e = this.domNode.textContent;
                  return (
                    e.endsWith('\n') && (e = e.slice(0, -1)),
                    e.split('\n').reduce(function (e, n) {
                      return e.insert(n).insert('\n', t.formats());
                    }, new f.default())
                  );
                }
              },
              {
                key: 'format',
                value: function (t, n) {
                  if (t !== this.statics.blotName || !n) {
                    var r = this.descendant(m.default, this.length() - 1),
                      o = u(r, 1),
                      i = o[0];
                    null != i && i.deleteAt(i.length() - 1, 1),
                      s(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'format', this).call(this, t, n);
                  }
                }
              },
              {
                key: 'formatAt',
                value: function (t, n, r, o) {
                  if (
                    0 !== n &&
                    null != d.default.query(r, d.default.Scope.BLOCK) &&
                    (r !== this.statics.blotName || o !== this.statics.formats(this.domNode))
                  ) {
                    var i = this.newlineIndex(t);
                    if (!(i < 0 || i >= t + n)) {
                      var a = this.newlineIndex(t, !0) + 1,
                        u = i - a + 1,
                        l = this.isolate(a, u),
                        s = l.next;
                      l.format(r, o), s instanceof e && s.formatAt(0, t - a + n - u, r, o);
                    }
                  }
                }
              },
              {
                key: 'insertAt',
                value: function (t, e, n) {
                  if (null == n) {
                    var r = this.descendant(m.default, t),
                      o = u(r, 2),
                      i = o[0],
                      a = o[1];
                    i.insertAt(a, e);
                  }
                }
              },
              {
                key: 'length',
                value: function () {
                  var t = this.domNode.textContent.length;
                  return this.domNode.textContent.endsWith('\n') ? t : t + 1;
                }
              },
              {
                key: 'newlineIndex',
                value: function (t) {
                  if (arguments.length > 1 && void 0 !== arguments[1] && arguments[1])
                    return this.domNode.textContent.slice(0, t).lastIndexOf('\n');
                  var e = this.domNode.textContent.slice(t).indexOf('\n');
                  return e > -1 ? t + e : -1;
                }
              },
              {
                key: 'optimize',
                value: function (t) {
                  this.domNode.textContent.endsWith('\n') || this.appendChild(d.default.create('text', '\n')),
                    s(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'optimize', this).call(this, t);
                  var n = this.next;
                  null != n &&
                    n.prev === this &&
                    n.statics.blotName === this.statics.blotName &&
                    this.statics.formats(this.domNode) === n.statics.formats(n.domNode) &&
                    (n.optimize(t), n.moveChildren(this), n.remove());
                }
              },
              {
                key: 'replace',
                value: function (t) {
                  s(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'replace', this).call(this, t),
                    [].slice.call(this.domNode.querySelectorAll('*')).forEach(function (t) {
                      var e = d.default.find(t);
                      null == e ? t.parentNode.removeChild(t) : e instanceof d.default.Embed ? e.remove() : e.unwrap();
                    });
                }
              }
            ],
            [
              {
                key: 'create',
                value: function (t) {
                  var n = s(e.__proto__ || Object.getPrototypeOf(e), 'create', this).call(this, t);
                  return n.setAttribute('spellcheck', !1), n;
                }
              },
              {
                key: 'formats',
                value: function () {
                  return !0;
                }
              }
            ]
          ),
          e
        );
      })(y.default);
      (O.blotName = 'code-block'), (O.tagName = 'PRE'), (O.TAB = '  '), (e.Code = _), (e.default = O);
    },
    function (t, e, n) {
      'use strict';
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function o(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function i(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function a(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      var u = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        l = function t(e, n, r) {
          null === e && (e = Function.prototype);
          var o = Object.getOwnPropertyDescriptor(e, n);
          if (void 0 === o) {
            var i = Object.getPrototypeOf(e);
            return null === i ? void 0 : t(i, n, r);
          }
          if ('value' in o) return o.value;
          var a = o.get;
          if (void 0 !== a) return a.call(r);
        },
        s = n(73),
        c = r(s),
        f = n(8),
        p = r(f),
        d = (0, p.default)('quill:events'),
        h = ['selectionchange', 'mousedown', 'mouseup', 'click'],
        y = [],
        v = 'getRootNode' in document;
      h.forEach(function (t) {
        document.addEventListener(t, function () {
          for (var t = arguments.length, e = Array(t), n = 0; n < t; n++) e[n] = arguments[n];
          y.forEach(function (t) {
            t.handleDOM.apply(t, e);
          });
        });
      });
      var b = (function (t) {
        function e() {
          o(this, e);
          var t = i(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this));
          return (t.listeners = {}), y.push(t), t.on('error', d.error), t;
        }
        return (
          a(e, t),
          u(e, [
            {
              key: 'emit',
              value: function () {
                d.log.apply(d, arguments),
                  l(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'emit', this).apply(this, arguments);
              }
            },
            {
              key: 'handleDOM',
              value: function (t) {
                for (var e = arguments.length, n = Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) n[r - 1] = arguments[r];
                var o = t.composedPath ? t.composedPath()[0] : t.target,
                  i = function (t, e) {
                    if (!v || e.getRootNode() === document) return t.contains(e);
                    for (; !t.contains(e); ) {
                      var n = e.getRootNode();
                      if (!n || !n.host) return !1;
                      e = n.host;
                    }
                    return !0;
                  };
                (this.listeners[t.type] || []).forEach(function (e) {
                  var r = e.node,
                    a = e.handler;
                  (o === r || i(r, o)) && a.apply(void 0, [t].concat(n));
                });
              }
            },
            {
              key: 'listenDOM',
              value: function (t, e, n) {
                this.listeners[t] || (this.listeners[t] = []), this.listeners[t].push({ node: e, handler: n });
              }
            }
          ]),
          e
        );
      })(c.default);
      (b.events = {
        EDITOR_CHANGE: 'editor-change',
        SCROLL_BEFORE_UPDATE: 'scroll-before-update',
        SCROLL_OPTIMIZE: 'scroll-optimize',
        SCROLL_UPDATE: 'scroll-update',
        SELECTION_CHANGE: 'selection-change',
        TEXT_CHANGE: 'text-change'
      }),
        (b.sources = { API: 'api', SILENT: 'silent', USER: 'user' }),
        (e.default = b);
    },
    function (t, e, n) {
      'use strict';
      function r(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function o(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function i(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      var a = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        u = function t(e, n, r) {
          null === e && (e = Function.prototype);
          var o = Object.getOwnPropertyDescriptor(e, n);
          if (void 0 === o) {
            var i = Object.getPrototypeOf(e);
            return null === i ? void 0 : t(i, n, r);
          }
          if ('value' in o) return o.value;
          var a = o.get;
          if (void 0 !== a) return a.call(r);
        },
        l = n(0),
        s = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(l),
        c = (function (t) {
          function e() {
            return r(this, e), o(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments));
          }
          return (
            i(e, t),
            a(
              e,
              [
                {
                  key: 'insertInto',
                  value: function (t, n) {
                    0 === t.children.length
                      ? u(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'insertInto', this).call(
                          this,
                          t,
                          n
                        )
                      : this.remove();
                  }
                },
                {
                  key: 'length',
                  value: function () {
                    return 0;
                  }
                },
                {
                  key: 'value',
                  value: function () {
                    return '';
                  }
                }
              ],
              [{ key: 'value', value: function () {} }]
            ),
            e
          );
        })(s.default.Embed);
      (c.blotName = 'break'), (c.tagName = 'BR'), (e.default = c);
    },
    function (t, e, n) {
      'use strict';
      function r(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function o(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function i(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      function a(t, e) {
        var n = document.createElement('a');
        n.href = t;
        var r = n.href.slice(0, n.href.indexOf(':'));
        return e.indexOf(r) > -1;
      }
      Object.defineProperty(e, '__esModule', { value: !0 }), (e.sanitize = e.default = void 0);
      var u = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        l = function t(e, n, r) {
          null === e && (e = Function.prototype);
          var o = Object.getOwnPropertyDescriptor(e, n);
          if (void 0 === o) {
            var i = Object.getPrototypeOf(e);
            return null === i ? void 0 : t(i, n, r);
          }
          if ('value' in o) return o.value;
          var a = o.get;
          if (void 0 !== a) return a.call(r);
        },
        s = n(4),
        c = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(s),
        f = (function (t) {
          function e() {
            return r(this, e), o(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments));
          }
          return (
            i(e, t),
            u(
              e,
              [
                {
                  key: 'format',
                  value: function (t, n) {
                    if (t !== this.statics.blotName || !n)
                      return l(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'format', this).call(
                        this,
                        t,
                        n
                      );
                    (n = this.constructor.sanitize(n)), this.domNode.setAttribute('href', n);
                  }
                }
              ],
              [
                {
                  key: 'create',
                  value: function (t) {
                    var n = l(e.__proto__ || Object.getPrototypeOf(e), 'create', this).call(this, t);
                    return (t = this.sanitize(t)), n.setAttribute('href', t), n.setAttribute('target', '_blank'), n;
                  }
                },
                {
                  key: 'formats',
                  value: function (t) {
                    return t.getAttribute('href');
                  }
                },
                {
                  key: 'sanitize',
                  value: function (t) {
                    return a(t, this.PROTOCOL_WHITELIST) ? t : this.SANITIZED_URL;
                  }
                }
              ]
            ),
            e
          );
        })(c.default);
      (f.blotName = 'link'),
        (f.tagName = 'A'),
        (f.SANITIZED_URL = 'about:blank'),
        (f.PROTOCOL_WHITELIST = ['http', 'https', 'mailto', 'tel']),
        (e.default = f),
        (e.sanitize = a);
    },
    function (t, e, n) {
      'use strict';
      function r(t) {
        var e = u.find(t);
        if (null == e)
          try {
            e = u.create(t);
          } catch (n) {
            (e = u.create(u.Scope.INLINE)),
              [].slice.call(t.childNodes).forEach(function (t) {
                e.domNode.appendChild(t);
              }),
              t.parentNode && t.parentNode.replaceChild(e.domNode, t),
              e.attach();
          }
        return e;
      }
      var o =
        (this && this.__extends) ||
        (function () {
          var t =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
            };
          return function (e, n) {
            function r() {
              this.constructor = e;
            }
            t(e, n), (e.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()));
          };
        })();
      Object.defineProperty(e, '__esModule', { value: !0 });
      var i = n(53),
        a = n(27),
        u = n(1),
        l = (function (t) {
          function e(e) {
            var n = t.call(this, e) || this;
            return n.build(), n;
          }
          return (
            o(e, t),
            (e.prototype.appendChild = function (t) {
              this.insertBefore(t);
            }),
            (e.prototype.attach = function () {
              t.prototype.attach.call(this),
                this.children.forEach(function (t) {
                  t.attach();
                });
            }),
            (e.prototype.build = function () {
              var t = this;
              (this.children = new i.default()),
                [].slice
                  .call(this.domNode.childNodes)
                  .reverse()
                  .forEach(function (e) {
                    try {
                      var n = r(e);
                      t.insertBefore(n, t.children.head || void 0);
                    } catch (t) {
                      if (t instanceof u.ParchmentError) return;
                      throw t;
                    }
                  });
            }),
            (e.prototype.deleteAt = function (t, e) {
              if (0 === t && e === this.length()) return this.remove();
              this.children.forEachAt(t, e, function (t, e, n) {
                t.deleteAt(e, n);
              });
            }),
            (e.prototype.descendant = function (t, n) {
              var r = this.children.find(n),
                o = r[0],
                i = r[1];
              return (null == t.blotName && t(o)) || (null != t.blotName && o instanceof t)
                ? [o, i]
                : o instanceof e
                ? o.descendant(t, i)
                : [null, -1];
            }),
            (e.prototype.descendants = function (t, n, r) {
              void 0 === n && (n = 0), void 0 === r && (r = Number.MAX_VALUE);
              var o = [],
                i = r;
              return (
                this.children.forEachAt(n, r, function (n, r, a) {
                  ((null == t.blotName && t(n)) || (null != t.blotName && n instanceof t)) && o.push(n),
                    n instanceof e && (o = o.concat(n.descendants(t, r, i))),
                    (i -= a);
                }),
                o
              );
            }),
            (e.prototype.detach = function () {
              this.children.forEach(function (t) {
                t.detach();
              }),
                t.prototype.detach.call(this);
            }),
            (e.prototype.formatAt = function (t, e, n, r) {
              this.children.forEachAt(t, e, function (t, e, o) {
                t.formatAt(e, o, n, r);
              });
            }),
            (e.prototype.insertAt = function (t, e, n) {
              var r = this.children.find(t),
                o = r[0],
                i = r[1];
              if (o) o.insertAt(i, e, n);
              else {
                var a = null == n ? u.create('text', e) : u.create(e, n);
                this.appendChild(a);
              }
            }),
            (e.prototype.insertBefore = function (t, e) {
              if (
                null != this.statics.allowedChildren &&
                !this.statics.allowedChildren.some(function (e) {
                  return t instanceof e;
                })
              )
                throw new u.ParchmentError('Cannot insert ' + t.statics.blotName + ' into ' + this.statics.blotName);
              t.insertInto(this, e);
            }),
            (e.prototype.length = function () {
              return this.children.reduce(function (t, e) {
                return t + e.length();
              }, 0);
            }),
            (e.prototype.moveChildren = function (t, e) {
              this.children.forEach(function (n) {
                t.insertBefore(n, e);
              });
            }),
            (e.prototype.optimize = function (e) {
              if ((t.prototype.optimize.call(this, e), 0 === this.children.length))
                if (null != this.statics.defaultChild) {
                  var n = u.create(this.statics.defaultChild);
                  this.appendChild(n), n.optimize(e);
                } else this.remove();
            }),
            (e.prototype.path = function (t, n) {
              void 0 === n && (n = !1);
              var r = this.children.find(t, n),
                o = r[0],
                i = r[1],
                a = [[this, t]];
              return o instanceof e ? a.concat(o.path(i, n)) : (null != o && a.push([o, i]), a);
            }),
            (e.prototype.removeChild = function (t) {
              this.children.remove(t);
            }),
            (e.prototype.replace = function (n) {
              n instanceof e && n.moveChildren(this), t.prototype.replace.call(this, n);
            }),
            (e.prototype.split = function (t, e) {
              if ((void 0 === e && (e = !1), !e)) {
                if (0 === t) return this;
                if (t === this.length()) return this.next;
              }
              var n = this.clone();
              return (
                this.parent.insertBefore(n, this.next),
                this.children.forEachAt(t, this.length(), function (t, r, o) {
                  (t = t.split(r, e)), n.appendChild(t);
                }),
                n
              );
            }),
            (e.prototype.unwrap = function () {
              this.moveChildren(this.parent, this.next), this.remove();
            }),
            (e.prototype.update = function (t, e) {
              var n = this,
                o = [],
                i = [];
              t.forEach(function (t) {
                t.target === n.domNode &&
                  'childList' === t.type &&
                  (o.push.apply(o, t.addedNodes), i.push.apply(i, t.removedNodes));
              }),
                i.forEach(function (t) {
                  if (
                    !(
                      null != t.parentNode &&
                      'IFRAME' !== t.tagName &&
                      document.body.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY
                    )
                  ) {
                    var e = u.find(t);
                    null != e && ((null != e.domNode.parentNode && e.domNode.parentNode !== n.domNode) || e.detach());
                  }
                }),
                o
                  .filter(function (t) {
                    return t.parentNode == n.domNode;
                  })
                  .sort(function (t, e) {
                    return t === e ? 0 : t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING ? 1 : -1;
                  })
                  .forEach(function (t) {
                    var e = null;
                    null != t.nextSibling && (e = u.find(t.nextSibling));
                    var o = r(t);
                    (o.next == e && null != o.next) ||
                      (null != o.parent && o.parent.removeChild(n), n.insertBefore(o, e || void 0));
                  });
            }),
            e
          );
        })(a.default);
      e.default = l;
    },
    function (t, e, n) {
      'use strict';
      var r =
        (this && this.__extends) ||
        (function () {
          var t =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
            };
          return function (e, n) {
            function r() {
              this.constructor = e;
            }
            t(e, n), (e.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()));
          };
        })();
      Object.defineProperty(e, '__esModule', { value: !0 });
      var o = n(10),
        i = n(28),
        a = n(17),
        u = n(1),
        l = (function (t) {
          function e(e) {
            var n = t.call(this, e) || this;
            return (n.attributes = new i.default(n.domNode)), n;
          }
          return (
            r(e, t),
            (e.formats = function (t) {
              return (
                'string' == typeof this.tagName || (Array.isArray(this.tagName) ? t.tagName.toLowerCase() : void 0)
              );
            }),
            (e.prototype.format = function (t, e) {
              var n = u.query(t);
              n instanceof o.default
                ? this.attributes.attribute(n, e)
                : e &&
                  (null == n || (t === this.statics.blotName && this.formats()[t] === e) || this.replaceWith(t, e));
            }),
            (e.prototype.formats = function () {
              var t = this.attributes.values(),
                e = this.statics.formats(this.domNode);
              return null != e && (t[this.statics.blotName] = e), t;
            }),
            (e.prototype.replaceWith = function (e, n) {
              var r = t.prototype.replaceWith.call(this, e, n);
              return this.attributes.copy(r), r;
            }),
            (e.prototype.update = function (e, n) {
              var r = this;
              t.prototype.update.call(this, e, n),
                e.some(function (t) {
                  return t.target === r.domNode && 'attributes' === t.type;
                }) && this.attributes.build();
            }),
            (e.prototype.wrap = function (n, r) {
              var o = t.prototype.wrap.call(this, n, r);
              return o instanceof e && o.statics.scope === this.statics.scope && this.attributes.move(o), o;
            }),
            e
          );
        })(a.default);
      e.default = l;
    },
    function (t, e, n) {
      'use strict';
      var r =
        (this && this.__extends) ||
        (function () {
          var t =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
            };
          return function (e, n) {
            function r() {
              this.constructor = e;
            }
            t(e, n), (e.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()));
          };
        })();
      Object.defineProperty(e, '__esModule', { value: !0 });
      var o = n(27),
        i = n(1),
        a = (function (t) {
          function e() {
            return (null !== t && t.apply(this, arguments)) || this;
          }
          return (
            r(e, t),
            (e.value = function (t) {
              return !0;
            }),
            (e.prototype.index = function (t, e) {
              return this.domNode === t || this.domNode.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY
                ? Math.min(e, 1)
                : -1;
            }),
            (e.prototype.position = function (t, e) {
              var n = [].indexOf.call(this.parent.domNode.childNodes, this.domNode);
              return t > 0 && (n += 1), [this.parent.domNode, n];
            }),
            (e.prototype.value = function () {
              var t;
              return (t = {}), (t[this.statics.blotName] = this.statics.value(this.domNode) || !0), t;
            }),
            (e.scope = i.Scope.INLINE_BLOT),
            e
          );
        })(o.default);
      e.default = a;
    },
    function (t, e, n) {
      'use strict';
      var r = n(33);
      t.exports = function () {
        return r() && !!Symbol.toStringTag;
      };
    },
    function (t, e, n) {
      'use strict';
      var r = n(64);
      t.exports = Function.prototype.bind || r;
    },
    function (t, e, n) {
      'use strict';
      var r = n(21),
        o = n(35),
        i = o('%Function.prototype.apply%'),
        a = o('%Function.prototype.call%'),
        u = o('%Reflect.apply%', !0) || r.call(a, i),
        l = o('%Object.getOwnPropertyDescriptor%', !0),
        s = o('%Object.defineProperty%', !0),
        c = o('%Math.max%');
      if (s)
        try {
          s({}, 'a', { value: 1 });
        } catch (t) {
          s = null;
        }
      t.exports = function (t) {
        var e = u(r, a, arguments);
        if (l && s) {
          l(e, 'length').configurable && s(e, 'length', { value: 1 + c(0, t.length - (arguments.length - 1)) });
        }
        return e;
      };
      var f = function () {
        return u(r, i, arguments);
      };
      s ? s(t.exports, 'apply', { value: f }) : (t.exports.apply = f);
    },
    function (t, e, n) {
      function r(t) {
        (this.ops = t), (this.index = 0), (this.offset = 0);
      }
      var o = n(11),
        i = n(3),
        a = {
          attributes: {
            compose: function (t, e, n) {
              'object' != typeof t && (t = {}), 'object' != typeof e && (e = {});
              var r = i(!0, {}, e);
              n ||
                (r = Object.keys(r).reduce(function (t, e) {
                  return null != r[e] && (t[e] = r[e]), t;
                }, {}));
              for (var o in t) void 0 !== t[o] && void 0 === e[o] && (r[o] = t[o]);
              return Object.keys(r).length > 0 ? r : void 0;
            },
            diff: function (t, e) {
              'object' != typeof t && (t = {}), 'object' != typeof e && (e = {});
              var n = Object.keys(t)
                .concat(Object.keys(e))
                .reduce(function (n, r) {
                  return o(t[r], e[r]) || (n[r] = void 0 === e[r] ? null : e[r]), n;
                }, {});
              return Object.keys(n).length > 0 ? n : void 0;
            },
            transform: function (t, e, n) {
              if ('object' != typeof t) return e;
              if ('object' == typeof e) {
                if (!n) return e;
                var r = Object.keys(e).reduce(function (n, r) {
                  return void 0 === t[r] && (n[r] = e[r]), n;
                }, {});
                return Object.keys(r).length > 0 ? r : void 0;
              }
            }
          },
          iterator: function (t) {
            return new r(t);
          },
          length: function (t) {
            return 'number' == typeof t.delete
              ? t.delete
              : 'number' == typeof t.retain
              ? t.retain
              : 'string' == typeof t.insert
              ? t.insert.length
              : 1;
          }
        };
      (r.prototype.hasNext = function () {
        return this.peekLength() < 1 / 0;
      }),
        (r.prototype.next = function (t) {
          t || (t = 1 / 0);
          var e = this.ops[this.index];
          if (e) {
            var n = this.offset,
              r = a.length(e);
            if (
              (t >= r - n ? ((t = r - n), (this.index += 1), (this.offset = 0)) : (this.offset += t),
              'number' == typeof e.delete)
            )
              return { delete: t };
            var o = {};
            return (
              e.attributes && (o.attributes = e.attributes),
              'number' == typeof e.retain
                ? (o.retain = t)
                : 'string' == typeof e.insert
                ? (o.insert = e.insert.substr(n, t))
                : (o.insert = e.insert),
              o
            );
          }
          return { retain: 1 / 0 };
        }),
        (r.prototype.peek = function () {
          return this.ops[this.index];
        }),
        (r.prototype.peekLength = function () {
          return this.ops[this.index] ? a.length(this.ops[this.index]) - this.offset : 1 / 0;
        }),
        (r.prototype.peekType = function () {
          return this.ops[this.index]
            ? 'number' == typeof this.ops[this.index].delete
              ? 'delete'
              : 'number' == typeof this.ops[this.index].retain
              ? 'retain'
              : 'insert'
            : 'retain';
        }),
        (r.prototype.rest = function () {
          if (this.hasNext()) {
            if (0 === this.offset) return this.ops.slice(this.index);
            var t = this.offset,
              e = this.index,
              n = this.next(),
              r = this.ops.slice(this.index);
            return (this.offset = t), (this.index = e), [n].concat(r);
          }
          return [];
        }),
        (t.exports = a);
    },
    function (t, e) {
      var n = (function () {
        'use strict';
        function t(t, e) {
          return null != e && t instanceof e;
        }
        function e(n, r, o, i, c) {
          function f(n, o) {
            if (null === n) return null;
            if (0 === o) return n;
            var y, v;
            if ('object' != typeof n) return n;
            if (t(n, u)) y = new u();
            else if (t(n, l)) y = new l();
            else if (t(n, s))
              y = new s(function (t, e) {
                n.then(
                  function (e) {
                    t(f(e, o - 1));
                  },
                  function (t) {
                    e(f(t, o - 1));
                  }
                );
              });
            else if (e.__isArray(n)) y = [];
            else if (e.__isRegExp(n)) (y = new RegExp(n.source, a(n))), n.lastIndex && (y.lastIndex = n.lastIndex);
            else if (e.__isDate(n)) y = new Date(n.getTime());
            else {
              if (h && Buffer.isBuffer(n))
                return (y = Buffer.allocUnsafe ? Buffer.allocUnsafe(n.length) : new Buffer(n.length)), n.copy(y), y;
              t(n, Error)
                ? (y = Object.create(n))
                : void 0 === i
                ? ((v = Object.getPrototypeOf(n)), (y = Object.create(v)))
                : ((y = Object.create(i)), (v = i));
            }
            if (r) {
              var b = p.indexOf(n);
              if (-1 != b) return d[b];
              p.push(n), d.push(y);
            }
            t(n, u) &&
              n.forEach(function (t, e) {
                var n = f(e, o - 1),
                  r = f(t, o - 1);
                y.set(n, r);
              }),
              t(n, l) &&
                n.forEach(function (t) {
                  var e = f(t, o - 1);
                  y.add(e);
                });
            for (var g in n) {
              var m;
              v && (m = Object.getOwnPropertyDescriptor(v, g)), (m && null == m.set) || (y[g] = f(n[g], o - 1));
            }
            if (Object.getOwnPropertySymbols)
              for (var _ = Object.getOwnPropertySymbols(n), g = 0; g < _.length; g++) {
                var O = _[g],
                  w = Object.getOwnPropertyDescriptor(n, O);
                (!w || w.enumerable || c) &&
                  ((y[O] = f(n[O], o - 1)), w.enumerable || Object.defineProperty(y, O, { enumerable: !1 }));
              }
            if (c)
              for (var E = Object.getOwnPropertyNames(n), g = 0; g < E.length; g++) {
                var N = E[g],
                  w = Object.getOwnPropertyDescriptor(n, N);
                (w && w.enumerable) || ((y[N] = f(n[N], o - 1)), Object.defineProperty(y, N, { enumerable: !1 }));
              }
            return y;
          }
          'object' == typeof r && ((o = r.depth), (i = r.prototype), (c = r.includeNonEnumerable), (r = r.circular));
          var p = [],
            d = [],
            h = 'undefined' != typeof Buffer;
          return void 0 === r && (r = !0), void 0 === o && (o = 1 / 0), f(n, o);
        }
        function n(t) {
          return Object.prototype.toString.call(t);
        }
        function r(t) {
          return 'object' == typeof t && '[object Date]' === n(t);
        }
        function o(t) {
          return 'object' == typeof t && '[object Array]' === n(t);
        }
        function i(t) {
          return 'object' == typeof t && '[object RegExp]' === n(t);
        }
        function a(t) {
          var e = '';
          return t.global && (e += 'g'), t.ignoreCase && (e += 'i'), t.multiline && (e += 'm'), e;
        }
        var u;
        try {
          u = Map;
        } catch (t) {
          u = function () {};
        }
        var l;
        try {
          l = Set;
        } catch (t) {
          l = function () {};
        }
        var s;
        try {
          s = Promise;
        } catch (t) {
          s = function () {};
        }
        return (
          (e.clonePrototype = function (t) {
            if (null === t) return null;
            var e = function () {};
            return (e.prototype = t), new e();
          }),
          (e.__objToStr = n),
          (e.__isDate = r),
          (e.__isArray = o),
          (e.__isRegExp = i),
          (e.__getRegExpFlags = a),
          e
        );
      })();
      'object' == typeof t && t.exports && (t.exports = n);
    },
    function (t, e, n) {
      'use strict';
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function o(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function i(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function a(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      var u = n(0),
        l = r(u),
        s = n(2),
        c = r(s),
        f = (function (t) {
          function e() {
            return o(this, e), i(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments));
          }
          return a(e, t), e;
        })(l.default.Container);
      (f.allowedChildren = [c.default, s.BlockEmbed, f]), (e.default = f);
    },
    function (t, e, n) {
      'use strict';
      function r(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function o(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function i(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      Object.defineProperty(e, '__esModule', { value: !0 }), (e.ColorStyle = e.ColorClass = e.ColorAttributor = void 0);
      var a = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        u = function t(e, n, r) {
          null === e && (e = Function.prototype);
          var o = Object.getOwnPropertyDescriptor(e, n);
          if (void 0 === o) {
            var i = Object.getPrototypeOf(e);
            return null === i ? void 0 : t(i, n, r);
          }
          if ('value' in o) return o.value;
          var a = o.get;
          if (void 0 !== a) return a.call(r);
        },
        l = n(0),
        s = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(l),
        c = (function (t) {
          function e() {
            return r(this, e), o(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments));
          }
          return (
            i(e, t),
            a(e, [
              {
                key: 'value',
                value: function (t) {
                  var n = u(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'value', this).call(this, t);
                  return n.startsWith('rgb(')
                    ? ((n = n.replace(/^[^\d]+/, '').replace(/[^\d]+$/, '')),
                      '#' +
                        n
                          .split(',')
                          .map(function (t) {
                            return ('00' + parseInt(t).toString(16)).slice(-2);
                          })
                          .join(''))
                    : n;
                }
              }
            ]),
            e
          );
        })(s.default.Attributor.Style),
        f = new s.default.Attributor.Class('color', 'ql-color', { scope: s.default.Scope.INLINE }),
        p = new c('color', 'color', { scope: s.default.Scope.INLINE });
      (e.ColorAttributor = c), (e.ColorClass = f), (e.ColorStyle = p);
    },
    function (t, e, n) {
      'use strict';
      Object.defineProperty(e, '__esModule', { value: !0 });
      var r = n(1),
        o = (function () {
          function t(t) {
            (this.domNode = t), (this.domNode[r.DATA_KEY] = { blot: this });
          }
          return (
            Object.defineProperty(t.prototype, 'statics', {
              get: function () {
                return this.constructor;
              },
              enumerable: !0,
              configurable: !0
            }),
            (t.create = function (t) {
              if (null == this.tagName) throw new r.ParchmentError('Blot definition missing tagName');
              var e;
              return (
                Array.isArray(this.tagName)
                  ? ('string' == typeof t && ((t = t.toUpperCase()), parseInt(t).toString() === t && (t = parseInt(t))),
                    (e =
                      'number' == typeof t
                        ? document.createElement(this.tagName[t - 1])
                        : this.tagName.indexOf(t) > -1
                        ? document.createElement(t)
                        : document.createElement(this.tagName[0])))
                  : (e = document.createElement(this.tagName)),
                this.className && e.classList.add(this.className),
                e
              );
            }),
            (t.prototype.attach = function () {
              null != this.parent && (this.scroll = this.parent.scroll);
            }),
            (t.prototype.clone = function () {
              var t = this.domNode.cloneNode(!1);
              return r.create(t);
            }),
            (t.prototype.detach = function () {
              null != this.parent && this.parent.removeChild(this), delete this.domNode[r.DATA_KEY];
            }),
            (t.prototype.deleteAt = function (t, e) {
              this.isolate(t, e).remove();
            }),
            (t.prototype.formatAt = function (t, e, n, o) {
              var i = this.isolate(t, e);
              if (null != r.query(n, r.Scope.BLOT) && o) i.wrap(n, o);
              else if (null != r.query(n, r.Scope.ATTRIBUTE)) {
                var a = r.create(this.statics.scope);
                i.wrap(a), a.format(n, o);
              }
            }),
            (t.prototype.insertAt = function (t, e, n) {
              var o = null == n ? r.create('text', e) : r.create(e, n),
                i = this.split(t);
              this.parent.insertBefore(o, i);
            }),
            (t.prototype.insertInto = function (t, e) {
              void 0 === e && (e = null), null != this.parent && this.parent.children.remove(this);
              var n = null;
              t.children.insertBefore(this, e),
                null != e && (n = e.domNode),
                (this.domNode.parentNode == t.domNode && this.domNode.nextSibling == n) ||
                  t.domNode.insertBefore(this.domNode, n),
                (this.parent = t),
                this.attach();
            }),
            (t.prototype.isolate = function (t, e) {
              var n = this.split(t);
              return n.split(e), n;
            }),
            (t.prototype.length = function () {
              return 1;
            }),
            (t.prototype.offset = function (t) {
              return (
                void 0 === t && (t = this.parent),
                null == this.parent || this == t ? 0 : this.parent.children.offset(this) + this.parent.offset(t)
              );
            }),
            (t.prototype.optimize = function (t) {
              null != this.domNode[r.DATA_KEY] && delete this.domNode[r.DATA_KEY].mutations;
            }),
            (t.prototype.remove = function () {
              null != this.domNode.parentNode && this.domNode.parentNode.removeChild(this.domNode), this.detach();
            }),
            (t.prototype.replace = function (t) {
              null != t.parent && (t.parent.insertBefore(this, t.next), t.remove());
            }),
            (t.prototype.replaceWith = function (t, e) {
              var n = 'string' == typeof t ? r.create(t, e) : t;
              return n.replace(this), n;
            }),
            (t.prototype.split = function (t, e) {
              return 0 === t ? this : this.next;
            }),
            (t.prototype.update = function (t, e) {}),
            (t.prototype.wrap = function (t, e) {
              var n = 'string' == typeof t ? r.create(t, e) : t;
              return null != this.parent && this.parent.insertBefore(n, this.next), n.appendChild(this), n;
            }),
            (t.blotName = 'abstract'),
            t
          );
        })();
      e.default = o;
    },
    function (t, e, n) {
      'use strict';
      Object.defineProperty(e, '__esModule', { value: !0 });
      var r = n(10),
        o = n(29),
        i = n(30),
        a = n(1),
        u = (function () {
          function t(t) {
            (this.attributes = {}), (this.domNode = t), this.build();
          }
          return (
            (t.prototype.attribute = function (t, e) {
              e
                ? t.add(this.domNode, e) &&
                  (null != t.value(this.domNode)
                    ? (this.attributes[t.attrName] = t)
                    : delete this.attributes[t.attrName])
                : (t.remove(this.domNode), delete this.attributes[t.attrName]);
            }),
            (t.prototype.build = function () {
              var t = this;
              this.attributes = {};
              var e = r.default.keys(this.domNode),
                n = o.default.keys(this.domNode),
                u = i.default.keys(this.domNode);
              e.concat(n)
                .concat(u)
                .forEach(function (e) {
                  var n = a.query(e, a.Scope.ATTRIBUTE);
                  n instanceof r.default && (t.attributes[n.attrName] = n);
                });
            }),
            (t.prototype.copy = function (t) {
              var e = this;
              Object.keys(this.attributes).forEach(function (n) {
                var r = e.attributes[n].value(e.domNode);
                t.format(n, r);
              });
            }),
            (t.prototype.move = function (t) {
              var e = this;
              this.copy(t),
                Object.keys(this.attributes).forEach(function (t) {
                  e.attributes[t].remove(e.domNode);
                }),
                (this.attributes = {});
            }),
            (t.prototype.values = function () {
              var t = this;
              return Object.keys(this.attributes).reduce(function (e, n) {
                return (e[n] = t.attributes[n].value(t.domNode)), e;
              }, {});
            }),
            t
          );
        })();
      e.default = u;
    },
    function (t, e, n) {
      'use strict';
      function r(t, e) {
        return (t.getAttribute('class') || '').split(/\s+/).filter(function (t) {
          return 0 === t.indexOf(e + '-');
        });
      }
      var o =
        (this && this.__extends) ||
        (function () {
          var t =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
            };
          return function (e, n) {
            function r() {
              this.constructor = e;
            }
            t(e, n), (e.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()));
          };
        })();
      Object.defineProperty(e, '__esModule', { value: !0 });
      var i = n(10),
        a = (function (t) {
          function e() {
            return (null !== t && t.apply(this, arguments)) || this;
          }
          return (
            o(e, t),
            (e.keys = function (t) {
              return (t.getAttribute('class') || '').split(/\s+/).map(function (t) {
                return t.split('-').slice(0, -1).join('-');
              });
            }),
            (e.prototype.add = function (t, e) {
              return !!this.canAdd(t, e) && (this.remove(t), t.classList.add(this.keyName + '-' + e), !0);
            }),
            (e.prototype.remove = function (t) {
              r(t, this.keyName).forEach(function (e) {
                t.classList.remove(e);
              }),
                0 === t.classList.length && t.removeAttribute('class');
            }),
            (e.prototype.value = function (t) {
              var e = r(t, this.keyName)[0] || '',
                n = e.slice(this.keyName.length + 1);
              return this.canAdd(t, n) ? n : '';
            }),
            e
          );
        })(i.default);
      e.default = a;
    },
    function (t, e, n) {
      'use strict';
      function r(t) {
        var e = t.split('-'),
          n = e
            .slice(1)
            .map(function (t) {
              return t[0].toUpperCase() + t.slice(1);
            })
            .join('');
        return e[0] + n;
      }
      var o =
        (this && this.__extends) ||
        (function () {
          var t =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
            };
          return function (e, n) {
            function r() {
              this.constructor = e;
            }
            t(e, n), (e.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()));
          };
        })();
      Object.defineProperty(e, '__esModule', { value: !0 });
      var i = n(10),
        a = (function (t) {
          function e() {
            return (null !== t && t.apply(this, arguments)) || this;
          }
          return (
            o(e, t),
            (e.keys = function (t) {
              return (t.getAttribute('style') || '').split(';').map(function (t) {
                return t.split(':')[0].trim();
              });
            }),
            (e.prototype.add = function (t, e) {
              return !!this.canAdd(t, e) && ((t.style[r(this.keyName)] = e), !0);
            }),
            (e.prototype.remove = function (t) {
              (t.style[r(this.keyName)] = ''), t.getAttribute('style') || t.removeAttribute('style');
            }),
            (e.prototype.value = function (t) {
              var e = t.style[r(this.keyName)];
              return this.canAdd(t, e) ? e : '';
            }),
            e
          );
        })(i.default);
      e.default = a;
    },
    function (t, e, n) {
      'use strict';
      var r = Array.prototype.slice,
        o = n(32),
        i = Object.keys,
        a = i
          ? function (t) {
              return i(t);
            }
          : n(61),
        u = Object.keys;
      (a.shim = function () {
        if (Object.keys) {
          (function () {
            var t = Object.keys(arguments);
            return t && t.length === arguments.length;
          })(1, 2) ||
            (Object.keys = function (t) {
              return u(o(t) ? r.call(t) : t);
            });
        } else Object.keys = a;
        return Object.keys || a;
      }),
        (t.exports = a);
    },
    function (t, e, n) {
      'use strict';
      var r = Object.prototype.toString;
      t.exports = function (t) {
        var e = r.call(t),
          n = '[object Arguments]' === e;
        return (
          n ||
            (n =
              '[object Array]' !== e &&
              null !== t &&
              'object' == typeof t &&
              'number' == typeof t.length &&
              t.length >= 0 &&
              '[object Function]' === r.call(t.callee)),
          n
        );
      };
    },
    function (t, e, n) {
      'use strict';
      t.exports = function () {
        if ('function' != typeof Symbol || 'function' != typeof Object.getOwnPropertySymbols) return !1;
        if ('symbol' == typeof Symbol.iterator) return !0;
        var t = {},
          e = Symbol('test'),
          n = Object(e);
        if ('string' == typeof e) return !1;
        if ('[object Symbol]' !== Object.prototype.toString.call(e)) return !1;
        if ('[object Symbol]' !== Object.prototype.toString.call(n)) return !1;
        t[e] = 42;
        for (e in t) return !1;
        if ('function' == typeof Object.keys && 0 !== Object.keys(t).length) return !1;
        if ('function' == typeof Object.getOwnPropertyNames && 0 !== Object.getOwnPropertyNames(t).length) return !1;
        var r = Object.getOwnPropertySymbols(t);
        if (1 !== r.length || r[0] !== e) return !1;
        if (!Object.prototype.propertyIsEnumerable.call(t, e)) return !1;
        if ('function' == typeof Object.getOwnPropertyDescriptor) {
          var o = Object.getOwnPropertyDescriptor(t, e);
          if (42 !== o.value || !0 !== o.enumerable) return !1;
        }
        return !0;
      };
    },
    function (t, e, n) {
      'use strict';
      var r = n(35),
        o = n(22),
        i = o(r('String.prototype.indexOf'));
      t.exports = function (t, e) {
        var n = r(t, !!e);
        return 'function' == typeof n && i(t, '.prototype.') > -1 ? o(n) : n;
      };
    },
    function (t, e, n) {
      'use strict';
      var r = SyntaxError,
        o = Function,
        i = TypeError,
        a = function (t) {
          try {
            return o('"use strict"; return (' + t + ').constructor;')();
          } catch (t) {}
        },
        u = Object.getOwnPropertyDescriptor;
      if (u)
        try {
          u({}, '');
        } catch (t) {
          u = null;
        }
      var l = function () {
          throw new i();
        },
        s = u
          ? (function () {
              try {
                return arguments.callee, l;
              } catch (t) {
                try {
                  return u(arguments, 'callee').get;
                } catch (t) {
                  return l;
                }
              }
            })()
          : l,
        c = n(63)(),
        f =
          Object.getPrototypeOf ||
          function (t) {
            return t.__proto__;
          },
        p = {},
        d = 'undefined' == typeof Uint8Array ? void 0 : f(Uint8Array),
        h = {
          '%AggregateError%': 'undefined' == typeof AggregateError ? void 0 : AggregateError,
          '%Array%': Array,
          '%ArrayBuffer%': 'undefined' == typeof ArrayBuffer ? void 0 : ArrayBuffer,
          '%ArrayIteratorPrototype%': c ? f([][Symbol.iterator]()) : void 0,
          '%AsyncFromSyncIteratorPrototype%': void 0,
          '%AsyncFunction%': p,
          '%AsyncGenerator%': p,
          '%AsyncGeneratorFunction%': p,
          '%AsyncIteratorPrototype%': p,
          '%Atomics%': 'undefined' == typeof Atomics ? void 0 : Atomics,
          '%BigInt%': 'undefined' == typeof BigInt ? void 0 : BigInt,
          '%Boolean%': Boolean,
          '%DataView%': 'undefined' == typeof DataView ? void 0 : DataView,
          '%Date%': Date,
          '%decodeURI%': decodeURI,
          '%decodeURIComponent%': decodeURIComponent,
          '%encodeURI%': encodeURI,
          '%encodeURIComponent%': encodeURIComponent,
          '%Error%': Error,
          '%eval%': eval,
          '%EvalError%': EvalError,
          '%Float32Array%': 'undefined' == typeof Float32Array ? void 0 : Float32Array,
          '%Float64Array%': 'undefined' == typeof Float64Array ? void 0 : Float64Array,
          '%FinalizationRegistry%': 'undefined' == typeof FinalizationRegistry ? void 0 : FinalizationRegistry,
          '%Function%': o,
          '%GeneratorFunction%': p,
          '%Int8Array%': 'undefined' == typeof Int8Array ? void 0 : Int8Array,
          '%Int16Array%': 'undefined' == typeof Int16Array ? void 0 : Int16Array,
          '%Int32Array%': 'undefined' == typeof Int32Array ? void 0 : Int32Array,
          '%isFinite%': isFinite,
          '%isNaN%': isNaN,
          '%IteratorPrototype%': c ? f(f([][Symbol.iterator]())) : void 0,
          '%JSON%': 'object' == typeof JSON ? JSON : void 0,
          '%Map%': 'undefined' == typeof Map ? void 0 : Map,
          '%MapIteratorPrototype%': 'undefined' != typeof Map && c ? f(new Map()[Symbol.iterator]()) : void 0,
          '%Math%': Math,
          '%Number%': Number,
          '%Object%': Object,
          '%parseFloat%': parseFloat,
          '%parseInt%': parseInt,
          '%Promise%': 'undefined' == typeof Promise ? void 0 : Promise,
          '%Proxy%': 'undefined' == typeof Proxy ? void 0 : Proxy,
          '%RangeError%': RangeError,
          '%ReferenceError%': ReferenceError,
          '%Reflect%': 'undefined' == typeof Reflect ? void 0 : Reflect,
          '%RegExp%': RegExp,
          '%Set%': 'undefined' == typeof Set ? void 0 : Set,
          '%SetIteratorPrototype%': 'undefined' != typeof Set && c ? f(new Set()[Symbol.iterator]()) : void 0,
          '%SharedArrayBuffer%': 'undefined' == typeof SharedArrayBuffer ? void 0 : SharedArrayBuffer,
          '%String%': String,
          '%StringIteratorPrototype%': c ? f(''[Symbol.iterator]()) : void 0,
          '%Symbol%': c ? Symbol : void 0,
          '%SyntaxError%': r,
          '%ThrowTypeError%': s,
          '%TypedArray%': d,
          '%TypeError%': i,
          '%Uint8Array%': 'undefined' == typeof Uint8Array ? void 0 : Uint8Array,
          '%Uint8ClampedArray%': 'undefined' == typeof Uint8ClampedArray ? void 0 : Uint8ClampedArray,
          '%Uint16Array%': 'undefined' == typeof Uint16Array ? void 0 : Uint16Array,
          '%Uint32Array%': 'undefined' == typeof Uint32Array ? void 0 : Uint32Array,
          '%URIError%': URIError,
          '%WeakMap%': 'undefined' == typeof WeakMap ? void 0 : WeakMap,
          '%WeakRef%': 'undefined' == typeof WeakRef ? void 0 : WeakRef,
          '%WeakSet%': 'undefined' == typeof WeakSet ? void 0 : WeakSet
        },
        y = function t(e) {
          var n;
          if ('%AsyncFunction%' === e) n = a('async function () {}');
          else if ('%GeneratorFunction%' === e) n = a('function* () {}');
          else if ('%AsyncGeneratorFunction%' === e) n = a('async function* () {}');
          else if ('%AsyncGenerator%' === e) {
            var r = t('%AsyncGeneratorFunction%');
            r && (n = r.prototype);
          } else if ('%AsyncIteratorPrototype%' === e) {
            var o = t('%AsyncGenerator%');
            o && (n = f(o.prototype));
          }
          return (h[e] = n), n;
        },
        v = {
          '%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
          '%ArrayPrototype%': ['Array', 'prototype'],
          '%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
          '%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
          '%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
          '%ArrayProto_values%': ['Array', 'prototype', 'values'],
          '%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
          '%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
          '%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
          '%BooleanPrototype%': ['Boolean', 'prototype'],
          '%DataViewPrototype%': ['DataView', 'prototype'],
          '%DatePrototype%': ['Date', 'prototype'],
          '%ErrorPrototype%': ['Error', 'prototype'],
          '%EvalErrorPrototype%': ['EvalError', 'prototype'],
          '%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
          '%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
          '%FunctionPrototype%': ['Function', 'prototype'],
          '%Generator%': ['GeneratorFunction', 'prototype'],
          '%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
          '%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
          '%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
          '%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
          '%JSONParse%': ['JSON', 'parse'],
          '%JSONStringify%': ['JSON', 'stringify'],
          '%MapPrototype%': ['Map', 'prototype'],
          '%NumberPrototype%': ['Number', 'prototype'],
          '%ObjectPrototype%': ['Object', 'prototype'],
          '%ObjProto_toString%': ['Object', 'prototype', 'toString'],
          '%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
          '%PromisePrototype%': ['Promise', 'prototype'],
          '%PromiseProto_then%': ['Promise', 'prototype', 'then'],
          '%Promise_all%': ['Promise', 'all'],
          '%Promise_reject%': ['Promise', 'reject'],
          '%Promise_resolve%': ['Promise', 'resolve'],
          '%RangeErrorPrototype%': ['RangeError', 'prototype'],
          '%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
          '%RegExpPrototype%': ['RegExp', 'prototype'],
          '%SetPrototype%': ['Set', 'prototype'],
          '%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
          '%StringPrototype%': ['String', 'prototype'],
          '%SymbolPrototype%': ['Symbol', 'prototype'],
          '%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
          '%TypedArrayPrototype%': ['TypedArray', 'prototype'],
          '%TypeErrorPrototype%': ['TypeError', 'prototype'],
          '%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
          '%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
          '%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
          '%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
          '%URIErrorPrototype%': ['URIError', 'prototype'],
          '%WeakMapPrototype%': ['WeakMap', 'prototype'],
          '%WeakSetPrototype%': ['WeakSet', 'prototype']
        },
        b = n(21),
        g = n(65),
        m = b.call(Function.call, Array.prototype.concat),
        _ = b.call(Function.apply, Array.prototype.splice),
        O = b.call(Function.call, String.prototype.replace),
        w = b.call(Function.call, String.prototype.slice),
        E = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g,
        N = /\\(\\)?/g,
        j = function (t) {
          var e = w(t, 0, 1),
            n = w(t, -1);
          if ('%' === e && '%' !== n) throw new r('invalid intrinsic syntax, expected closing `%`');
          if ('%' === n && '%' !== e) throw new r('invalid intrinsic syntax, expected opening `%`');
          var o = [];
          return (
            O(t, E, function (t, e, n, r) {
              o[o.length] = n ? O(r, N, '$1') : e || t;
            }),
            o
          );
        },
        A = function (t, e) {
          var n,
            o = t;
          if ((g(v, o) && ((n = v[o]), (o = '%' + n[0] + '%')), g(h, o))) {
            var a = h[o];
            if ((a === p && (a = y(o)), void 0 === a && !e))
              throw new i('intrinsic ' + t + ' exists, but is not available. Please file an issue!');
            return { alias: n, name: o, value: a };
          }
          throw new r('intrinsic ' + t + ' does not exist!');
        };
      t.exports = function (t, e) {
        if ('string' != typeof t || 0 === t.length) throw new i('intrinsic name must be a non-empty string');
        if (arguments.length > 1 && 'boolean' != typeof e) throw new i('"allowMissing" argument must be a boolean');
        var n = j(t),
          o = n.length > 0 ? n[0] : '',
          a = A('%' + o + '%', e),
          l = a.name,
          s = a.value,
          c = !1,
          f = a.alias;
        f && ((o = f[0]), _(n, m([0, 1], f)));
        for (var p = 1, d = !0; p < n.length; p += 1) {
          var y = n[p],
            v = w(y, 0, 1),
            b = w(y, -1);
          if (('"' === v || "'" === v || '`' === v || '"' === b || "'" === b || '`' === b) && v !== b)
            throw new r('property names with quotes must have matching quotes');
          if ((('constructor' !== y && d) || (c = !0), (o += '.' + y), (l = '%' + o + '%'), g(h, l))) s = h[l];
          else if (null != s) {
            if (!(y in s)) {
              if (!e) throw new i('base intrinsic for ' + t + ' exists, but the property is not available.');
              return;
            }
            if (u && p + 1 >= n.length) {
              var O = u(s, y);
              (d = !!O), (s = d && 'get' in O && !('originalValue' in O.get) ? O.get : s[y]);
            } else (d = g(s, y)), (s = s[y]);
            d && !c && (h[l] = s);
          }
        }
        return s;
      };
    },
    function (t, e, n) {
      'use strict';
      var r = function (t) {
        return t !== t;
      };
      t.exports = function (t, e) {
        return 0 === t && 0 === e ? 1 / t == 1 / e : t === e || !(!r(t) || !r(e));
      };
    },
    function (t, e, n) {
      'use strict';
      var r = n(36);
      t.exports = function () {
        return 'function' == typeof Object.is ? Object.is : r;
      };
    },
    function (t, e, n) {
      'use strict';
      var r = Object,
        o = TypeError;
      t.exports = function () {
        if (null != this && this !== r(this)) throw new o('RegExp.prototype.flags getter called on non-object');
        var t = '';
        return (
          this.global && (t += 'g'),
          this.ignoreCase && (t += 'i'),
          this.multiline && (t += 'm'),
          this.dotAll && (t += 's'),
          this.unicode && (t += 'u'),
          this.sticky && (t += 'y'),
          t
        );
      };
    },
    function (t, e, n) {
      'use strict';
      var r = n(38),
        o = n(12).supportsDescriptors,
        i = Object.getOwnPropertyDescriptor,
        a = TypeError;
      t.exports = function () {
        if (!o)
          throw new a('RegExp.prototype.flags requires a true ES5 environment that supports property descriptors');
        if ('gim' === /a/gim.flags) {
          var t = i(RegExp.prototype, 'flags');
          if (t && 'function' == typeof t.get && 'boolean' == typeof /a/.dotAll) return t.get;
        }
        return r;
      };
    },
    function (t, e, n) {
      'use strict';
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function o(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function i(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function a(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      var u = (function () {
          function t(t, e) {
            var n = [],
              r = !0,
              o = !1,
              i = void 0;
            try {
              for (
                var a, u = t[Symbol.iterator]();
                !(r = (a = u.next()).done) && (n.push(a.value), !e || n.length !== e);
                r = !0
              );
            } catch (t) {
              (o = !0), (i = t);
            } finally {
              try {
                !r && u.return && u.return();
              } finally {
                if (o) throw i;
              }
            }
            return n;
          }
          return function (e, n) {
            if (Array.isArray(e)) return e;
            if (Symbol.iterator in Object(e)) return t(e, n);
            throw new TypeError('Invalid attempt to destructure non-iterable instance');
          };
        })(),
        l = function t(e, n, r) {
          null === e && (e = Function.prototype);
          var o = Object.getOwnPropertyDescriptor(e, n);
          if (void 0 === o) {
            var i = Object.getPrototypeOf(e);
            return null === i ? void 0 : t(i, n, r);
          }
          if ('value' in o) return o.value;
          var a = o.get;
          if (void 0 !== a) return a.call(r);
        },
        s = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        c = n(0),
        f = r(c),
        p = n(7),
        d = r(p),
        h = (function (t) {
          function e(t, n) {
            o(this, e);
            var r = i(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t));
            return (
              (r.selection = n),
              (r.textNode = document.createTextNode(e.CONTENTS)),
              r.domNode.appendChild(r.textNode),
              (r._length = 0),
              r
            );
          }
          return (
            a(e, t),
            s(e, null, [{ key: 'value', value: function () {} }]),
            s(e, [
              {
                key: 'detach',
                value: function () {
                  null != this.parent && this.parent.removeChild(this);
                }
              },
              {
                key: 'format',
                value: function (t, n) {
                  if (0 !== this._length)
                    return l(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'format', this).call(
                      this,
                      t,
                      n
                    );
                  for (var r = this, o = 0; null != r && r.statics.scope !== f.default.Scope.BLOCK_BLOT; )
                    (o += r.offset(r.parent)), (r = r.parent);
                  null != r &&
                    ((this._length = e.CONTENTS.length),
                    r.optimize(),
                    r.formatAt(o, e.CONTENTS.length, t, n),
                    (this._length = 0));
                }
              },
              {
                key: 'index',
                value: function (t, n) {
                  return t === this.textNode
                    ? 0
                    : l(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'index', this).call(this, t, n);
                }
              },
              {
                key: 'length',
                value: function () {
                  return this._length;
                }
              },
              {
                key: 'position',
                value: function () {
                  return [this.textNode, this.textNode.data.length];
                }
              },
              {
                key: 'remove',
                value: function () {
                  l(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'remove', this).call(this),
                    (this.parent = null);
                }
              },
              {
                key: 'restore',
                value: function () {
                  if (!this.selection.composing && null != this.parent) {
                    var t = this.textNode,
                      n = this.selection.getNativeRange(),
                      r = void 0,
                      o = void 0,
                      i = void 0;
                    if (null != n && n.start.node === t && n.end.node === t) {
                      var a = [t, n.start.offset, n.end.offset];
                      (r = a[0]), (o = a[1]), (i = a[2]);
                    }
                    for (; null != this.domNode.lastChild && this.domNode.lastChild !== this.textNode; )
                      this.domNode.parentNode.insertBefore(this.domNode.lastChild, this.domNode);
                    if (this.textNode.data !== e.CONTENTS) {
                      var l = this.textNode.data.split(e.CONTENTS).join('');
                      this.next instanceof d.default
                        ? ((r = this.next.domNode), this.next.insertAt(0, l), (this.textNode.data = e.CONTENTS))
                        : ((this.textNode.data = l),
                          this.parent.insertBefore(f.default.create(this.textNode), this),
                          (this.textNode = document.createTextNode(e.CONTENTS)),
                          this.domNode.appendChild(this.textNode));
                    }
                    if ((this.remove(), null != o)) {
                      var s = [o, i].map(function (t) {
                          return Math.max(0, Math.min(r.data.length, t - 1));
                        }),
                        c = u(s, 2);
                      return (o = c[0]), (i = c[1]), { startNode: r, startOffset: o, endNode: r, endOffset: i };
                    }
                  }
                }
              },
              {
                key: 'update',
                value: function (t, e) {
                  var n = this;
                  if (
                    t.some(function (t) {
                      return 'characterData' === t.type && t.target === n.textNode;
                    })
                  ) {
                    var r = this.restore();
                    r && (e.range = r);
                  }
                }
              },
              {
                key: 'value',
                value: function () {
                  return '';
                }
              }
            ]),
            e
          );
        })(f.default.Embed);
      (h.blotName = 'cursor'),
        (h.className = 'ql-cursor'),
        (h.tagName = 'span'),
        (h.CONTENTS = '\ufeff'),
        (e.default = h);
    },
    function (t, e, n) {
      'use strict';
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function o(t) {
        if (Array.isArray(t)) {
          for (var e = 0, n = Array(t.length); e < t.length; e++) n[e] = t[e];
          return n;
        }
        return Array.from(t);
      }
      function i(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function a(t, e) {
        try {
          e.parentNode;
        } catch (t) {
          return !1;
        }
        return e instanceof Text && (e = e.parentNode), t.contains(e);
      }
      Object.defineProperty(e, '__esModule', { value: !0 }), (e.default = e.Range = void 0);
      var u = (function () {
          function t(t, e) {
            var n = [],
              r = !0,
              o = !1,
              i = void 0;
            try {
              for (
                var a, u = t[Symbol.iterator]();
                !(r = (a = u.next()).done) && (n.push(a.value), !e || n.length !== e);
                r = !0
              );
            } catch (t) {
              (o = !0), (i = t);
            } finally {
              try {
                !r && u.return && u.return();
              } finally {
                if (o) throw i;
              }
            }
            return n;
          }
          return function (e, n) {
            if (Array.isArray(e)) return e;
            if (Symbol.iterator in Object(e)) return t(e, n);
            throw new TypeError('Invalid attempt to destructure non-iterable instance');
          };
        })(),
        l = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        s = n(0),
        c = r(s),
        f = n(24),
        p = r(f),
        d = n(11),
        h = r(d),
        y = n(14),
        v = r(y),
        b = n(8),
        g = r(b),
        m = n(74),
        _ = (0, g.default)('quill:selection'),
        O = function t(e) {
          var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
          i(this, t), (this.index = e), (this.length = n);
        },
        w = (function () {
          function t(e, n) {
            var r = this;
            i(this, t),
              (this.emitter = n),
              (this.scroll = e),
              (this.composing = !1),
              (this.mouseDown = !1),
              (this.root = this.scroll.domNode),
              (this.rootDocument = this.root.getRootNode ? this.root.getRootNode() : document),
              (this.cursor = c.default.create('cursor', this)),
              (this.lastRange = this.savedRange = new O(0, 0)),
              this.handleComposition(),
              this.handleDragging(),
              this.emitter.listenDOM('selectionchange', document, function () {
                r.mouseDown || r.composing || setTimeout(r.update.bind(r, v.default.sources.USER), 1);
              }),
              this.emitter.on(v.default.events.SCROLL_BEFORE_UPDATE, function (t, e) {
                if (r.hasFocus()) {
                  var n = r.getNativeRange();
                  if (null != n) {
                    var o =
                      0 === n.start.offset &&
                      n.start.offset === n.end.offset &&
                      r.rootDocument.getSelection() instanceof m.ShadowSelection &&
                      e.some(function (t) {
                        return 'characterData' === t.type && '' === t.oldValue;
                      })
                        ? 1
                        : 0;
                    n.start.node !== r.cursor.textNode &&
                      r.emitter.once(v.default.events.SCROLL_UPDATE, function () {
                        try {
                          r.root.contains(n.start.node) &&
                            r.root.contains(n.end.node) &&
                            r.setNativeRange(n.start.node, n.start.offset + o, n.end.node, n.end.offset + o),
                            r.update(v.default.sources.SILENT);
                        } catch (t) {}
                      });
                  }
                }
              }),
              this.emitter.on(v.default.events.SCROLL_OPTIMIZE, function (t, e) {
                if (e.range) {
                  var n = e.range,
                    o = n.startNode,
                    i = n.startOffset,
                    a = n.endNode,
                    u = n.endOffset;
                  r.setNativeRange(o, i, a, u);
                }
              }),
              this.update(v.default.sources.SILENT);
          }
          return (
            l(t, [
              {
                key: 'handleComposition',
                value: function () {
                  var t = this;
                  this.root.addEventListener('compositionstart', function () {
                    t.composing = !0;
                  }),
                    this.root.addEventListener('compositionend', function () {
                      if (((t.composing = !1), t.cursor.parent)) {
                        var e = t.cursor.restore();
                        if (!e) return;
                        setTimeout(function () {
                          t.setNativeRange(e.startNode, e.startOffset, e.endNode, e.endOffset);
                        }, 1);
                      }
                    });
                }
              },
              {
                key: 'handleDragging',
                value: function () {
                  var t = this;
                  this.emitter.listenDOM('mousedown', document.body, function () {
                    t.mouseDown = !0;
                  }),
                    this.emitter.listenDOM('mouseup', document.body, function () {
                      (t.mouseDown = !1), t.update(v.default.sources.USER);
                    });
                }
              },
              {
                key: 'focus',
                value: function () {
                  this.hasFocus() || (this.root.focus(), this.setRange(this.savedRange));
                }
              },
              {
                key: 'format',
                value: function (t, e) {
                  if (null == this.scroll.whitelist || this.scroll.whitelist[t]) {
                    this.scroll.update();
                    var n = this.getNativeRange();
                    if (null != n && n.native.collapsed && !c.default.query(t, c.default.Scope.BLOCK)) {
                      if (n.start.node !== this.cursor.textNode) {
                        var r = c.default.find(n.start.node, !1);
                        if (null == r) return;
                        if (r instanceof c.default.Leaf) {
                          var o = r.split(n.start.offset);
                          r.parent.insertBefore(this.cursor, o);
                        } else r.insertBefore(this.cursor, n.start.node);
                        this.cursor.attach();
                      }
                      this.cursor.format(t, e),
                        this.scroll.optimize(),
                        this.setNativeRange(this.cursor.textNode, this.cursor.textNode.data.length),
                        this.update();
                    }
                  }
                }
              },
              {
                key: 'getBounds',
                value: function (t) {
                  var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
                    n = this.scroll.length();
                  (t = Math.min(t, n - 1)), (e = Math.min(t + e, n - 1) - t);
                  var r = void 0,
                    o = this.scroll.leaf(t),
                    i = u(o, 2),
                    a = i[0],
                    l = i[1];
                  if (null == a) return null;
                  var s = a.position(l, !0),
                    c = u(s, 2);
                  (r = c[0]), (l = c[1]);
                  var f = document.createRange();
                  if (e > 0) {
                    f.setStart(r, l);
                    var p = this.scroll.leaf(t + e),
                      d = u(p, 2);
                    if (((a = d[0]), (l = d[1]), null == a)) return null;
                    var h = a.position(l, !0),
                      y = u(h, 2);
                    return (r = y[0]), (l = y[1]), f.setEnd(r, l), f.getBoundingClientRect();
                  }
                  var v = 'left',
                    b = void 0;
                  return (
                    r instanceof Text
                      ? (l < r.data.length
                          ? (f.setStart(r, l), f.setEnd(r, l + 1))
                          : (f.setStart(r, l - 1), f.setEnd(r, l), (v = 'right')),
                        (b = f.getBoundingClientRect()))
                      : ((b = a.domNode.getBoundingClientRect()), l > 0 && (v = 'right')),
                    { bottom: b.top + b.height, height: b.height, left: b[v], right: b[v], top: b.top, width: 0 }
                  );
                }
              },
              {
                key: 'getNativeRange',
                value: function () {
                  var t = this.rootDocument.getSelection();
                  if (null == t || t.rangeCount <= 0) return null;
                  var e = t.getRangeAt(0);
                  if (null == e) return null;
                  var n = this.normalizeNative(e);
                  return _.info('getNativeRange', n), n;
                }
              },
              {
                key: 'getRange',
                value: function () {
                  var t = this.getNativeRange();
                  return null == t ? [null, null] : [this.normalizedToRange(t), t];
                }
              },
              {
                key: 'hasFocus',
                value: function () {
                  return this.rootDocument.activeElement === this.root;
                }
              },
              {
                key: 'normalizedToRange',
                value: function (t) {
                  var e = this,
                    n = [[t.start.node, t.start.offset]];
                  t.native.collapsed || n.push([t.end.node, t.end.offset]);
                  var r = n.map(function (t) {
                      var n = u(t, 2),
                        r = n[0],
                        o = n[1],
                        i = c.default.find(r, !0),
                        a = i.offset(e.scroll);
                      return 0 === o ? a : i instanceof c.default.Container ? a + i.length() : a + i.index(r, o);
                    }),
                    i = Math.min(Math.max.apply(Math, o(r)), this.scroll.length() - 1),
                    a = Math.min.apply(Math, [i].concat(o(r)));
                  return new O(a, i - a);
                }
              },
              {
                key: 'normalizeNative',
                value: function (t) {
                  if (!a(this.root, t.startContainer) || (!t.collapsed && !a(this.root, t.endContainer))) return null;
                  var e = {
                    start: { node: t.startContainer, offset: t.startOffset },
                    end: { node: t.endContainer, offset: t.endOffset },
                    native: t
                  };
                  return (
                    [e.start, e.end].forEach(function (t) {
                      for (var e = t.node, n = t.offset; !(e instanceof Text) && e.childNodes.length > 0; )
                        if (e.childNodes.length > n) (e = e.childNodes[n]), (n = 0);
                        else {
                          if (e.childNodes.length !== n) break;
                          (e = e.lastChild), (n = e instanceof Text ? e.data.length : e.childNodes.length + 1);
                        }
                      (t.node = e), (t.offset = n);
                    }),
                    e
                  );
                }
              },
              {
                key: 'rangeToNative',
                value: function (t) {
                  var e = this,
                    n = t.collapsed ? [t.index] : [t.index, t.index + t.length],
                    r = [],
                    o = this.scroll.length();
                  return (
                    n.forEach(function (t, n) {
                      t = Math.min(o - 1, t);
                      var i = void 0,
                        a = e.scroll.leaf(t),
                        l = u(a, 2),
                        s = l[0],
                        c = l[1],
                        f = s.position(c, 0 !== n),
                        p = u(f, 2);
                      (i = p[0]), (c = p[1]), r.push(i, c);
                    }),
                    r.length < 2 && (r = r.concat(r)),
                    r
                  );
                }
              },
              {
                key: 'scrollIntoView',
                value: function (t) {
                  var e = this.lastRange;
                  if (null != e) {
                    var n = this.getBounds(e.index, e.length);
                    if (null != n) {
                      var r = this.scroll.length() - 1,
                        o = this.scroll.line(Math.min(e.index, r)),
                        i = u(o, 1),
                        a = i[0],
                        l = a;
                      if (e.length > 0) {
                        var s = this.scroll.line(Math.min(e.index + e.length, r));
                        l = u(s, 1)[0];
                      }
                      if (null != a && null != l) {
                        var c = t.getBoundingClientRect();
                        n.top < c.top
                          ? (t.scrollTop -= c.top - n.top)
                          : n.bottom > c.bottom && (t.scrollTop += n.bottom - c.bottom);
                      }
                    }
                  }
                }
              },
              {
                key: 'setNativeRange',
                value: function (t, e) {
                  var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : t,
                    r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : e,
                    o = arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
                  if (
                    (_.info('setNativeRange', t, e, n, r),
                    null == t || (null != this.root.parentNode && null != t.parentNode && null != n.parentNode))
                  ) {
                    var i = this.rootDocument.getSelection();
                    if (null != i)
                      if (null != t) {
                        this.hasFocus() || this.root.focus();
                        var a = (this.getNativeRange() || {}).native;
                        if (
                          null == a ||
                          o ||
                          t !== a.startContainer ||
                          e !== a.startOffset ||
                          n !== a.endContainer ||
                          r !== a.endOffset
                        ) {
                          'BR' == t.tagName && ((e = [].indexOf.call(t.parentNode.childNodes, t)), (t = t.parentNode)),
                            'BR' == n.tagName &&
                              ((r = [].indexOf.call(n.parentNode.childNodes, n)), (n = n.parentNode));
                          var u = document.createRange();
                          u.setStart(t, e), u.setEnd(n, r), i.removeAllRanges(), i.addRange(u);
                        }
                      } else i.removeAllRanges(), this.root.blur(), document.body.focus();
                  }
                }
              },
              {
                key: 'setRange',
                value: function (t) {
                  var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
                    n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : v.default.sources.API;
                  if (('string' == typeof e && ((n = e), (e = !1)), _.info('setRange', t), null != t)) {
                    var r = this.rangeToNative(t);
                    this.setNativeRange.apply(this, o(r).concat([e]));
                  } else this.setNativeRange(null);
                  this.update(n);
                }
              },
              {
                key: 'update',
                value: function () {
                  var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : v.default.sources.USER,
                    e = this.lastRange,
                    n = this.getRange(),
                    r = u(n, 2),
                    o = r[0],
                    i = r[1];
                  if (
                    ((this.lastRange = o),
                    null != this.lastRange && (this.savedRange = this.lastRange),
                    !(0, h.default)(e, this.lastRange))
                  ) {
                    var a;
                    !this.composing &&
                      null != i &&
                      i.native.collapsed &&
                      i.start.node !== this.cursor.textNode &&
                      this.cursor.restore();
                    var l = [v.default.events.SELECTION_CHANGE, (0, p.default)(this.lastRange), (0, p.default)(e), t];
                    if (
                      ((a = this.emitter).emit.apply(a, [v.default.events.EDITOR_CHANGE].concat(l)),
                      t !== v.default.sources.SILENT)
                    ) {
                      var s;
                      (s = this.emitter).emit.apply(s, l);
                    }
                  }
                }
              }
            ]),
            t
          );
        })();
      (e.Range = O), (e.default = w);
    },
    function (t, e, n) {
      'use strict';
      Object.defineProperty(e, '__esModule', { value: !0 }), (e.AlignStyle = e.AlignClass = e.AlignAttribute = void 0);
      var r = n(0),
        o = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(r),
        i = { scope: o.default.Scope.BLOCK, whitelist: ['right', 'center', 'justify'] },
        a = new o.default.Attributor.Attribute('align', 'align', i),
        u = new o.default.Attributor.Class('align', 'ql-align', i),
        l = new o.default.Attributor.Style('align', 'text-align', i);
      (e.AlignAttribute = a), (e.AlignClass = u), (e.AlignStyle = l);
    },
    function (t, e, n) {
      'use strict';
      Object.defineProperty(e, '__esModule', { value: !0 }), (e.BackgroundStyle = e.BackgroundClass = void 0);
      var r = n(0),
        o = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(r),
        i = n(26),
        a = new o.default.Attributor.Class('background', 'ql-bg', { scope: o.default.Scope.INLINE }),
        u = new i.ColorAttributor('background', 'background-color', { scope: o.default.Scope.INLINE });
      (e.BackgroundClass = a), (e.BackgroundStyle = u);
    },
    function (t, e, n) {
      'use strict';
      Object.defineProperty(e, '__esModule', { value: !0 }),
        (e.DirectionStyle = e.DirectionClass = e.DirectionAttribute = void 0);
      var r = n(0),
        o = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(r),
        i = { scope: o.default.Scope.BLOCK, whitelist: ['rtl'] },
        a = new o.default.Attributor.Attribute('direction', 'dir', i),
        u = new o.default.Attributor.Class('direction', 'ql-direction', i),
        l = new o.default.Attributor.Style('direction', 'direction', i);
      (e.DirectionAttribute = a), (e.DirectionClass = u), (e.DirectionStyle = l);
    },
    function (t, e, n) {
      'use strict';
      function r(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function o(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function i(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      Object.defineProperty(e, '__esModule', { value: !0 }), (e.FontClass = e.FontStyle = void 0);
      var a = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        u = function t(e, n, r) {
          null === e && (e = Function.prototype);
          var o = Object.getOwnPropertyDescriptor(e, n);
          if (void 0 === o) {
            var i = Object.getPrototypeOf(e);
            return null === i ? void 0 : t(i, n, r);
          }
          if ('value' in o) return o.value;
          var a = o.get;
          if (void 0 !== a) return a.call(r);
        },
        l = n(0),
        s = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(l),
        c = { scope: s.default.Scope.INLINE, whitelist: ['serif', 'monospace'] },
        f = new s.default.Attributor.Class('font', 'ql-font', c),
        p = (function (t) {
          function e() {
            return r(this, e), o(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments));
          }
          return (
            i(e, t),
            a(e, [
              {
                key: 'value',
                value: function (t) {
                  return u(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'value', this)
                    .call(this, t)
                    .replace(/["']/g, '');
                }
              }
            ]),
            e
          );
        })(s.default.Attributor.Style),
        d = new p('font', 'font-family', c);
      (e.FontStyle = d), (e.FontClass = f);
    },
    function (t, e, n) {
      'use strict';
      Object.defineProperty(e, '__esModule', { value: !0 }), (e.SizeStyle = e.SizeClass = void 0);
      var r = n(0),
        o = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(r),
        i = new o.default.Attributor.Class('size', 'ql-size', {
          scope: o.default.Scope.INLINE,
          whitelist: ['small', 'large', 'huge']
        }),
        a = new o.default.Attributor.Style('size', 'font-size', {
          scope: o.default.Scope.INLINE,
          whitelist: ['10px', '18px', '32px']
        });
      (e.SizeClass = i), (e.SizeStyle = a);
    },
    function (t, e, n) {
      'use strict';
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function o(t, e, n) {
        return (
          e in t
            ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 })
            : (t[e] = n),
          t
        );
      }
      function i(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function a(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function u(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      function l(t, e) {
        var n,
          r = t === D.keys.LEFT ? 'prefix' : 'suffix';
        return (
          (n = { key: t, shiftKey: e, altKey: null }),
          o(n, r, /^$/),
          o(n, 'handler', function (n) {
            var r = n.index;
            t === D.keys.RIGHT && (r += n.length + 1);
            var o = this.quill.getLeaf(r);
            return (
              !(b(o, 1)[0] instanceof P.default.Embed) ||
              (t === D.keys.LEFT
                ? e
                  ? this.quill.setSelection(n.index - 1, n.length + 1, C.default.sources.USER)
                  : this.quill.setSelection(n.index - 1, C.default.sources.USER)
                : e
                ? this.quill.setSelection(n.index, n.length + 1, C.default.sources.USER)
                : this.quill.setSelection(n.index + n.length + 1, C.default.sources.USER),
              !1)
            );
          }),
          n
        );
      }
      function s(t, e) {
        if (!(0 === t.index || this.quill.getLength() <= 1)) {
          var n = this.quill.getLine(t.index),
            r = b(n, 1),
            o = r[0],
            i = {};
          if (0 === e.offset) {
            var a = this.quill.getLine(t.index - 1),
              u = b(a, 1),
              l = u[0];
            if (null != l && l.length() > 1) {
              var s = o.formats(),
                c = this.quill.getFormat(t.index - 1, 1);
              i = x.default.attributes.diff(s, c) || {};
            }
          }
          var f = /[\uD800-\uDBFF][\uDC00-\uDFFF]$/.test(e.prefix) ? 2 : 1;
          this.quill.deleteText(t.index - f, f, C.default.sources.USER),
            Object.keys(i).length > 0 && this.quill.formatLine(t.index - f, f, i, C.default.sources.USER),
            this.quill.focus();
        }
      }
      function c(t, e) {
        var n = /^[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(e.suffix) ? 2 : 1;
        if (!(t.index >= this.quill.getLength() - n)) {
          var r = {},
            o = 0,
            i = this.quill.getLine(t.index),
            a = b(i, 1),
            u = a[0];
          if (e.offset >= u.length() - 1) {
            var l = this.quill.getLine(t.index + 1),
              s = b(l, 1),
              c = s[0];
            if (c) {
              var f = u.formats(),
                p = this.quill.getFormat(t.index, 1);
              (r = x.default.attributes.diff(f, p) || {}), (o = c.length());
            }
          }
          this.quill.deleteText(t.index, n, C.default.sources.USER),
            Object.keys(r).length > 0 && this.quill.formatLine(t.index + o - 1, n, r, C.default.sources.USER);
        }
      }
      function f(t) {
        var e = this.quill.getLines(t),
          n = {};
        if (e.length > 1) {
          var r = e[0].formats(),
            o = e[e.length - 1].formats();
          n = x.default.attributes.diff(o, r) || {};
        }
        this.quill.deleteText(t, C.default.sources.USER),
          Object.keys(n).length > 0 && this.quill.formatLine(t.index, 1, n, C.default.sources.USER),
          this.quill.setSelection(t.index, C.default.sources.SILENT),
          this.quill.focus();
      }
      function p(t, e) {
        var n = this;
        t.length > 0 && this.quill.scroll.deleteAt(t.index, t.length);
        var r = Object.keys(e.format).reduce(function (t, n) {
          return P.default.query(n, P.default.Scope.BLOCK) && !Array.isArray(e.format[n]) && (t[n] = e.format[n]), t;
        }, {});
        this.quill.insertText(t.index, '\n', r, C.default.sources.USER),
          this.quill.setSelection(t.index + 1, C.default.sources.SILENT),
          this.quill.focus(),
          Object.keys(e.format).forEach(function (t) {
            null == r[t] &&
              (Array.isArray(e.format[t]) || ('link' !== t && n.quill.format(t, e.format[t], C.default.sources.USER)));
          });
      }
      function d(t) {
        return {
          key: D.keys.TAB,
          shiftKey: !t,
          format: { 'code-block': !0 },
          handler: function (e) {
            var n = P.default.query('code-block'),
              r = e.index,
              o = e.length,
              i = this.quill.scroll.descendant(n, r),
              a = b(i, 2),
              u = a[0],
              l = a[1];
            if (null != u) {
              var s = this.quill.getIndex(u),
                c = u.newlineIndex(l, !0) + 1,
                f = u.newlineIndex(s + l + o),
                p = u.domNode.textContent.slice(c, f).split('\n');
              (l = 0),
                p.forEach(function (e, i) {
                  t
                    ? (u.insertAt(c + l, n.TAB),
                      (l += n.TAB.length),
                      0 === i ? (r += n.TAB.length) : (o += n.TAB.length))
                    : e.startsWith(n.TAB) &&
                      (u.deleteAt(c + l, n.TAB.length),
                      (l -= n.TAB.length),
                      0 === i ? (r -= n.TAB.length) : (o -= n.TAB.length)),
                    (l += e.length + 1);
                }),
                this.quill.update(C.default.sources.USER),
                this.quill.setSelection(r, o, C.default.sources.SILENT);
            }
          }
        };
      }
      function h(t) {
        return {
          key: t[0].toUpperCase(),
          shortKey: !0,
          handler: function (e, n) {
            this.quill.format(t, !n.format[t], C.default.sources.USER);
          }
        };
      }
      function y(t) {
        if ('string' == typeof t || 'number' == typeof t) return y({ key: t });
        if (('object' === (void 0 === t ? 'undefined' : v(t)) && (t = (0, _.default)(t, !1)), 'string' == typeof t.key))
          if (null != D.keys[t.key.toUpperCase()]) t.key = D.keys[t.key.toUpperCase()];
          else {
            if (1 !== t.key.length) return null;
            t.key = t.key.toUpperCase().charCodeAt(0);
          }
        return t.shortKey && ((t[B] = t.shortKey), delete t.shortKey), t;
      }
      Object.defineProperty(e, '__esModule', { value: !0 }), (e.SHORTKEY = e.default = void 0);
      var v =
          'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
            ? function (t) {
                return typeof t;
              }
            : function (t) {
                return t && 'function' == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype
                  ? 'symbol'
                  : typeof t;
              },
        b = (function () {
          function t(t, e) {
            var n = [],
              r = !0,
              o = !1,
              i = void 0;
            try {
              for (
                var a, u = t[Symbol.iterator]();
                !(r = (a = u.next()).done) && (n.push(a.value), !e || n.length !== e);
                r = !0
              );
            } catch (t) {
              (o = !0), (i = t);
            } finally {
              try {
                !r && u.return && u.return();
              } finally {
                if (o) throw i;
              }
            }
            return n;
          }
          return function (e, n) {
            if (Array.isArray(e)) return e;
            if (Symbol.iterator in Object(e)) return t(e, n);
            throw new TypeError('Invalid attempt to destructure non-iterable instance');
          };
        })(),
        g = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        m = n(24),
        _ = r(m),
        O = n(11),
        w = r(O),
        E = n(3),
        N = r(E),
        j = n(5),
        A = r(j),
        k = n(23),
        x = r(k),
        S = n(0),
        P = r(S),
        T = n(6),
        C = r(T),
        L = n(8),
        R = r(L),
        I = n(9),
        q = r(I),
        M = (0, R.default)('quill:keyboard'),
        B = /Mac/i.test(navigator.platform) ? 'metaKey' : 'ctrlKey',
        D = (function (t) {
          function e(t, n) {
            i(this, e);
            var r = a(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n));
            return (
              (r.bindings = {}),
              Object.keys(r.options.bindings).forEach(function (e) {
                ('list autofill' !== e || null == t.scroll.whitelist || t.scroll.whitelist.list) &&
                  r.options.bindings[e] &&
                  r.addBinding(r.options.bindings[e]);
              }),
              r.addBinding({ key: e.keys.ENTER, shiftKey: null }, p),
              r.addBinding({ key: e.keys.ENTER, metaKey: null, ctrlKey: null, altKey: null }, function () {}),
              /Firefox/i.test(navigator.userAgent)
                ? (r.addBinding({ key: e.keys.BACKSPACE }, { collapsed: !0 }, s),
                  r.addBinding({ key: e.keys.DELETE }, { collapsed: !0 }, c))
                : (r.addBinding({ key: e.keys.BACKSPACE }, { collapsed: !0, prefix: /^.?$/ }, s),
                  r.addBinding({ key: e.keys.DELETE }, { collapsed: !0, suffix: /^.?$/ }, c)),
              r.addBinding({ key: e.keys.BACKSPACE }, { collapsed: !1 }, f),
              r.addBinding({ key: e.keys.DELETE }, { collapsed: !1 }, f),
              r.addBinding(
                { key: e.keys.BACKSPACE, altKey: null, ctrlKey: null, metaKey: null, shiftKey: null },
                { collapsed: !0, offset: 0 },
                s
              ),
              r.listen(),
              r
            );
          }
          return (
            u(e, t),
            g(e, null, [
              {
                key: 'match',
                value: function (t, e) {
                  return (
                    (e = y(e)),
                    !['altKey', 'ctrlKey', 'metaKey', 'shiftKey'].some(function (n) {
                      return !!e[n] !== t[n] && null !== e[n];
                    }) && e.key === (t.which || t.keyCode)
                  );
                }
              }
            ]),
            g(e, [
              {
                key: 'addBinding',
                value: function (t) {
                  var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
                    n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
                    r = y(t);
                  if (null == r || null == r.key) return M.warn('Attempted to add invalid keyboard binding', r);
                  'function' == typeof e && (e = { handler: e }),
                    'function' == typeof n && (n = { handler: n }),
                    (r = (0, N.default)(r, e, n)),
                    (this.bindings[r.key] = this.bindings[r.key] || []),
                    this.bindings[r.key].push(r);
                }
              },
              {
                key: 'listen',
                value: function () {
                  var t = this;
                  this.quill.root.addEventListener('keydown', function (n) {
                    if (!n.defaultPrevented) {
                      var r = n.which || n.keyCode,
                        o = (t.bindings[r] || []).filter(function (t) {
                          return e.match(n, t);
                        });
                      if (0 !== o.length) {
                        var i = t.quill.getSelection();
                        if (null != i && t.quill.hasFocus()) {
                          var a = t.quill.getLine(i.index),
                            u = b(a, 2),
                            l = u[0],
                            s = u[1],
                            c = t.quill.getLeaf(i.index),
                            f = b(c, 2),
                            p = f[0],
                            d = f[1],
                            h = 0 === i.length ? [p, d] : t.quill.getLeaf(i.index + i.length),
                            y = b(h, 2),
                            g = y[0],
                            m = y[1],
                            _ = p instanceof P.default.Text ? p.value().slice(0, d) : '',
                            O = g instanceof P.default.Text ? g.value().slice(m) : '',
                            E = {
                              collapsed: 0 === i.length,
                              empty: 0 === i.length && l.length() <= 1,
                              format: t.quill.getFormat(i),
                              offset: s,
                              prefix: _,
                              suffix: O
                            };
                          o.some(function (e) {
                            if (null != e.collapsed && e.collapsed !== E.collapsed) return !1;
                            if (null != e.empty && e.empty !== E.empty) return !1;
                            if (null != e.offset && e.offset !== E.offset) return !1;
                            if (Array.isArray(e.format)) {
                              if (
                                e.format.every(function (t) {
                                  return null == E.format[t];
                                })
                              )
                                return !1;
                            } else if (
                              'object' === v(e.format) &&
                              !Object.keys(e.format).every(function (t) {
                                return !0 === e.format[t]
                                  ? null != E.format[t]
                                  : !1 === e.format[t]
                                  ? null == E.format[t]
                                  : (0, w.default)(e.format[t], E.format[t]);
                              })
                            )
                              return !1;
                            return (
                              !(null != e.prefix && !e.prefix.test(E.prefix)) &&
                              !(null != e.suffix && !e.suffix.test(E.suffix)) &&
                              !0 !== e.handler.call(t, i, E)
                            );
                          }) && n.preventDefault();
                        }
                      }
                    }
                  });
                }
              }
            ]),
            e
          );
        })(q.default);
      (D.keys = { BACKSPACE: 8, TAB: 9, ENTER: 13, ESCAPE: 27, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, DELETE: 46 }),
        (D.DEFAULTS = {
          bindings: {
            bold: h('bold'),
            italic: h('italic'),
            underline: h('underline'),
            indent: {
              key: D.keys.TAB,
              format: ['blockquote', 'indent', 'list'],
              handler: function (t, e) {
                if (e.collapsed && 0 !== e.offset) return !0;
                this.quill.format('indent', '+1', C.default.sources.USER);
              }
            },
            outdent: {
              key: D.keys.TAB,
              shiftKey: !0,
              format: ['blockquote', 'indent', 'list'],
              handler: function (t, e) {
                if (e.collapsed && 0 !== e.offset) return !0;
                this.quill.format('indent', '-1', C.default.sources.USER);
              }
            },
            'outdent backspace': {
              key: D.keys.BACKSPACE,
              collapsed: !0,
              shiftKey: null,
              metaKey: null,
              ctrlKey: null,
              altKey: null,
              format: ['indent', 'list'],
              offset: 0,
              handler: function (t, e) {
                null != e.format.indent
                  ? this.quill.format('indent', '-1', C.default.sources.USER)
                  : null != e.format.list && this.quill.format('list', !1, C.default.sources.USER);
              }
            },
            'indent code-block': d(!0),
            'outdent code-block': d(!1),
            'remove tab': {
              key: D.keys.TAB,
              shiftKey: !0,
              collapsed: !0,
              prefix: /\t$/,
              handler: function (t) {
                this.quill.deleteText(t.index - 1, 1, C.default.sources.USER);
              }
            },
            tab: {
              key: D.keys.TAB,
              handler: function (t) {
                this.quill.history.cutoff();
                var e = new A.default().retain(t.index).delete(t.length).insert('\t');
                this.quill.updateContents(e, C.default.sources.USER),
                  this.quill.history.cutoff(),
                  this.quill.setSelection(t.index + 1, C.default.sources.SILENT);
              }
            },
            'list empty enter': {
              key: D.keys.ENTER,
              collapsed: !0,
              format: ['list'],
              empty: !0,
              handler: function (t, e) {
                this.quill.format('list', !1, C.default.sources.USER),
                  e.format.indent && this.quill.format('indent', !1, C.default.sources.USER);
              }
            },
            'checklist enter': {
              key: D.keys.ENTER,
              collapsed: !0,
              format: { list: 'checked' },
              handler: function (t) {
                var e = this.quill.getLine(t.index),
                  n = b(e, 2),
                  r = n[0],
                  o = n[1],
                  i = (0, N.default)({}, r.formats(), { list: 'checked' }),
                  a = new A.default()
                    .retain(t.index)
                    .insert('\n', i)
                    .retain(r.length() - o - 1)
                    .retain(1, { list: 'unchecked' });
                this.quill.updateContents(a, C.default.sources.USER),
                  this.quill.setSelection(t.index + 1, C.default.sources.SILENT),
                  this.quill.scrollIntoView();
              }
            },
            'header enter': {
              key: D.keys.ENTER,
              collapsed: !0,
              format: ['header'],
              suffix: /^$/,
              handler: function (t, e) {
                var n = this.quill.getLine(t.index),
                  r = b(n, 2),
                  o = r[0],
                  i = r[1],
                  a = new A.default()
                    .retain(t.index)
                    .insert('\n', e.format)
                    .retain(o.length() - i - 1)
                    .retain(1, { header: null });
                this.quill.updateContents(a, C.default.sources.USER),
                  this.quill.setSelection(t.index + 1, C.default.sources.SILENT),
                  this.quill.scrollIntoView();
              }
            },
            'list autofill': {
              key: ' ',
              collapsed: !0,
              format: { list: !1 },
              prefix: /^\s*?(\d+\.|-|\*|\[ ?\]|\[x\])$/,
              handler: function (t, e) {
                var n = e.prefix.length,
                  r = this.quill.getLine(t.index),
                  o = b(r, 2),
                  i = o[0],
                  a = o[1];
                if (a > n) return !0;
                var u = void 0;
                switch (e.prefix.trim()) {
                  case '[]':
                  case '[ ]':
                    u = 'unchecked';
                    break;
                  case '[x]':
                    u = 'checked';
                    break;
                  case '-':
                  case '*':
                    u = 'bullet';
                    break;
                  default:
                    u = 'ordered';
                }
                this.quill.insertText(t.index, ' ', C.default.sources.USER), this.quill.history.cutoff();
                var l = new A.default()
                  .retain(t.index - a)
                  .delete(n + 1)
                  .retain(i.length() - 2 - a)
                  .retain(1, { list: u });
                this.quill.updateContents(l, C.default.sources.USER),
                  this.quill.history.cutoff(),
                  this.quill.setSelection(t.index - n, C.default.sources.SILENT);
              }
            },
            'code exit': {
              key: D.keys.ENTER,
              collapsed: !0,
              format: ['code-block'],
              prefix: /\n\n$/,
              suffix: /^\s+$/,
              handler: function (t) {
                var e = this.quill.getLine(t.index),
                  n = b(e, 2),
                  r = n[0],
                  o = n[1],
                  i = new A.default()
                    .retain(t.index + r.length() - o - 2)
                    .retain(1, { 'code-block': null })
                    .delete(1);
                this.quill.updateContents(i, C.default.sources.USER);
              }
            },
            'embed left': l(D.keys.LEFT, !1),
            'embed left shift': l(D.keys.LEFT, !0),
            'embed right': l(D.keys.RIGHT, !1),
            'embed right shift': l(D.keys.RIGHT, !0)
          }
        }),
        (e.default = D),
        (e.SHORTKEY = B);
    },
    function (t, e, n) {
      'use strict';
      function r(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function o(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function i(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      var a = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        u = function t(e, n, r) {
          null === e && (e = Function.prototype);
          var o = Object.getOwnPropertyDescriptor(e, n);
          if (void 0 === o) {
            var i = Object.getPrototypeOf(e);
            return null === i ? void 0 : t(i, n, r);
          }
          if ('value' in o) return o.value;
          var a = o.get;
          if (void 0 !== a) return a.call(r);
        },
        l = n(4),
        s = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(l),
        c = (function (t) {
          function e() {
            return r(this, e), o(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments));
          }
          return (
            i(e, t),
            a(
              e,
              [
                {
                  key: 'optimize',
                  value: function (t) {
                    u(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'optimize', this).call(this, t),
                      this.domNode.tagName !== this.statics.tagName[0] && this.replaceWith(this.statics.blotName);
                  }
                }
              ],
              [
                {
                  key: 'create',
                  value: function () {
                    return u(e.__proto__ || Object.getPrototypeOf(e), 'create', this).call(this);
                  }
                },
                {
                  key: 'formats',
                  value: function () {
                    return !0;
                  }
                }
              ]
            ),
            e
          );
        })(s.default);
      (c.blotName = 'bold'), (c.tagName = ['STRONG', 'B']), (e.default = c);
    },
    function (t, e, n) {
      'use strict';
      function r(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      var o = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        i = (function () {
          function t(e, n) {
            r(this, t), (this.quill = e), (this.options = n), (this.modules = {});
          }
          return (
            o(t, [
              {
                key: 'init',
                value: function () {
                  var t = this;
                  Object.keys(this.options.modules).forEach(function (e) {
                    null == t.modules[e] && t.addModule(e);
                  });
                }
              },
              {
                key: 'addModule',
                value: function (t) {
                  var e = this.quill.constructor.import('modules/' + t);
                  return (this.modules[t] = new e(this.quill, this.options.modules[t] || {})), this.modules[t];
                }
              }
            ]),
            t
          );
        })();
      (i.DEFAULTS = { modules: {} }), (i.themes = { default: i }), (e.default = i);
    },
    function (t, e, n) {
      'use strict';
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function o(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function i(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function a(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      var u = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        l = function t(e, n, r) {
          null === e && (e = Function.prototype);
          var o = Object.getOwnPropertyDescriptor(e, n);
          if (void 0 === o) {
            var i = Object.getPrototypeOf(e);
            return null === i ? void 0 : t(i, n, r);
          }
          if ('value' in o) return o.value;
          var a = o.get;
          if (void 0 !== a) return a.call(r);
        },
        s = n(0),
        c = r(s),
        f = n(7),
        p = r(f),
        d = '\ufeff',
        h = (function (t) {
          function e(t) {
            o(this, e);
            var n = i(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t));
            return (
              (n.contentNode = document.createElement('span')),
              n.contentNode.setAttribute('contenteditable', !1),
              [].slice.call(n.domNode.childNodes).forEach(function (t) {
                n.contentNode.appendChild(t);
              }),
              (n.leftGuard = document.createTextNode(d)),
              (n.rightGuard = document.createTextNode(d)),
              n.domNode.appendChild(n.leftGuard),
              n.domNode.appendChild(n.contentNode),
              n.domNode.appendChild(n.rightGuard),
              n
            );
          }
          return (
            a(e, t),
            u(e, [
              {
                key: 'index',
                value: function (t, n) {
                  return t === this.leftGuard
                    ? 0
                    : t === this.rightGuard
                    ? 1
                    : l(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'index', this).call(this, t, n);
                }
              },
              {
                key: 'restore',
                value: function (t) {
                  var e = void 0,
                    n = void 0,
                    r = t.data.split(d).join('');
                  if (t === this.leftGuard)
                    if (this.prev instanceof p.default) {
                      var o = this.prev.length();
                      this.prev.insertAt(o, r), (e = { startNode: this.prev.domNode, startOffset: o + r.length });
                    } else
                      (n = document.createTextNode(r)),
                        this.parent.insertBefore(c.default.create(n), this),
                        (e = { startNode: n, startOffset: r.length });
                  else
                    t === this.rightGuard &&
                      (this.next instanceof p.default
                        ? (this.next.insertAt(0, r), (e = { startNode: this.next.domNode, startOffset: r.length }))
                        : ((n = document.createTextNode(r)),
                          this.parent.insertBefore(c.default.create(n), this.next),
                          (e = { startNode: n, startOffset: r.length })));
                  return (t.data = d), e;
                }
              },
              {
                key: 'update',
                value: function (t, e) {
                  var n = this;
                  t.forEach(function (t) {
                    if ('characterData' === t.type && (t.target === n.leftGuard || t.target === n.rightGuard)) {
                      var r = n.restore(t.target);
                      r && (e.range = r);
                    }
                  });
                }
              }
            ]),
            e
          );
        })(c.default.Embed);
      e.default = h;
    },
    ,
    function (t, e, n) {
      'use strict';
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      var o = n(0),
        i = r(o),
        a = n(6),
        u = r(a),
        l = n(2),
        s = r(l),
        c = n(15),
        f = r(c),
        p = n(25),
        d = r(p),
        h = n(40),
        y = r(h),
        v = n(50),
        b = r(v),
        g = n(4),
        m = r(g),
        _ = n(75),
        O = r(_),
        w = n(7),
        E = r(w),
        N = n(76),
        j = r(N),
        A = n(77),
        k = r(A),
        x = n(47),
        S = r(x);
      u.default.register({
        'blots/block': s.default,
        'blots/block/embed': l.BlockEmbed,
        'blots/break': f.default,
        'blots/container': d.default,
        'blots/cursor': y.default,
        'blots/embed': b.default,
        'blots/inline': m.default,
        'blots/scroll': O.default,
        'blots/text': E.default,
        'modules/clipboard': j.default,
        'modules/history': k.default,
        'modules/keyboard': S.default
      }),
        i.default.register(s.default, f.default, y.default, m.default, O.default, E.default),
        (e.default = u.default);
    },
    function (t, e, n) {
      'use strict';
      Object.defineProperty(e, '__esModule', { value: !0 });
      var r = (function () {
        function t() {
          (this.head = this.tail = null), (this.length = 0);
        }
        return (
          (t.prototype.append = function () {
            for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
            this.insertBefore(t[0], null), t.length > 1 && this.append.apply(this, t.slice(1));
          }),
          (t.prototype.contains = function (t) {
            for (var e, n = this.iterator(); (e = n()); ) if (e === t) return !0;
            return !1;
          }),
          (t.prototype.insertBefore = function (t, e) {
            t &&
              ((t.next = e),
              null != e
                ? ((t.prev = e.prev),
                  null != e.prev && (e.prev.next = t),
                  (e.prev = t),
                  e === this.head && (this.head = t))
                : null != this.tail
                ? ((this.tail.next = t), (t.prev = this.tail), (this.tail = t))
                : ((t.prev = null), (this.head = this.tail = t)),
              (this.length += 1));
          }),
          (t.prototype.offset = function (t) {
            for (var e = 0, n = this.head; null != n; ) {
              if (n === t) return e;
              (e += n.length()), (n = n.next);
            }
            return -1;
          }),
          (t.prototype.remove = function (t) {
            this.contains(t) &&
              (null != t.prev && (t.prev.next = t.next),
              null != t.next && (t.next.prev = t.prev),
              t === this.head && (this.head = t.next),
              t === this.tail && (this.tail = t.prev),
              (this.length -= 1));
          }),
          (t.prototype.iterator = function (t) {
            return (
              void 0 === t && (t = this.head),
              function () {
                var e = t;
                return null != t && (t = t.next), e;
              }
            );
          }),
          (t.prototype.find = function (t, e) {
            void 0 === e && (e = !1);
            for (var n, r = this.iterator(); (n = r()); ) {
              var o = n.length();
              if (t < o || (e && t === o && (null == n.next || 0 !== n.next.length()))) return [n, t];
              t -= o;
            }
            return [null, 0];
          }),
          (t.prototype.forEach = function (t) {
            for (var e, n = this.iterator(); (e = n()); ) t(e);
          }),
          (t.prototype.forEachAt = function (t, e, n) {
            if (!(e <= 0))
              for (
                var r, o = this.find(t), i = o[0], a = o[1], u = t - a, l = this.iterator(i);
                (r = l()) && u < t + e;

              ) {
                var s = r.length();
                t > u ? n(r, t - u, Math.min(e, u + s - t)) : n(r, 0, Math.min(s, t + e - u)), (u += s);
              }
          }),
          (t.prototype.map = function (t) {
            return this.reduce(function (e, n) {
              return e.push(t(n)), e;
            }, []);
          }),
          (t.prototype.reduce = function (t, e) {
            for (var n, r = this.iterator(); (n = r()); ) e = t(e, n);
            return e;
          }),
          t
        );
      })();
      e.default = r;
    },
    function (t, e, n) {
      'use strict';
      var r =
        (this && this.__extends) ||
        (function () {
          var t =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
            };
          return function (e, n) {
            function r() {
              this.constructor = e;
            }
            t(e, n), (e.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()));
          };
        })();
      Object.defineProperty(e, '__esModule', { value: !0 });
      var o = n(17),
        i = n(1),
        a = { attributes: !0, characterData: !0, characterDataOldValue: !0, childList: !0, subtree: !0 },
        u = (function (t) {
          function e(e) {
            var n = t.call(this, e) || this;
            return (
              (n.scroll = n),
              (n.observer = new MutationObserver(function (t) {
                n.update(t);
              })),
              n.observer.observe(n.domNode, a),
              n.attach(),
              n
            );
          }
          return (
            r(e, t),
            (e.prototype.detach = function () {
              t.prototype.detach.call(this), this.observer.disconnect();
            }),
            (e.prototype.deleteAt = function (e, n) {
              this.update(),
                0 === e && n === this.length()
                  ? this.children.forEach(function (t) {
                      t.remove();
                    })
                  : t.prototype.deleteAt.call(this, e, n);
            }),
            (e.prototype.formatAt = function (e, n, r, o) {
              this.update(), t.prototype.formatAt.call(this, e, n, r, o);
            }),
            (e.prototype.insertAt = function (e, n, r) {
              this.update(), t.prototype.insertAt.call(this, e, n, r);
            }),
            (e.prototype.optimize = function (e, n) {
              var r = this;
              void 0 === e && (e = []), void 0 === n && (n = {}), t.prototype.optimize.call(this, n);
              for (var a = [].slice.call(this.observer.takeRecords()); a.length > 0; ) e.push(a.pop());
              for (
                var u = function (t, e) {
                    void 0 === e && (e = !0),
                      null != t &&
                        t !== r &&
                        null != t.domNode.parentNode &&
                        (null == t.domNode[i.DATA_KEY].mutations && (t.domNode[i.DATA_KEY].mutations = []),
                        e && u(t.parent));
                  },
                  l = function (t) {
                    null != t.domNode[i.DATA_KEY] &&
                      null != t.domNode[i.DATA_KEY].mutations &&
                      (t instanceof o.default && t.children.forEach(l), t.optimize(n));
                  },
                  s = e,
                  c = 0;
                s.length > 0;
                c += 1
              ) {
                if (c >= 100) throw new Error('[Parchment] Maximum optimize iterations reached');
                for (
                  s.forEach(function (t) {
                    var e = i.find(t.target, !0);
                    null != e &&
                      (e.domNode === t.target &&
                        ('childList' === t.type
                          ? (u(i.find(t.previousSibling, !1)),
                            [].forEach.call(t.addedNodes, function (t) {
                              var e = i.find(t, !1);
                              u(e, !1),
                                e instanceof o.default &&
                                  e.children.forEach(function (t) {
                                    u(t, !1);
                                  });
                            }))
                          : 'attributes' === t.type && u(e.prev)),
                      u(e));
                  }),
                    this.children.forEach(l),
                    s = [].slice.call(this.observer.takeRecords()),
                    a = s.slice();
                  a.length > 0;

                )
                  e.push(a.pop());
              }
            }),
            (e.prototype.update = function (e, n) {
              var r = this;
              void 0 === n && (n = {}),
                (e = e || this.observer.takeRecords()),
                e
                  .map(function (t) {
                    var e = i.find(t.target, !0);
                    return null == e
                      ? null
                      : null == e.domNode[i.DATA_KEY].mutations
                      ? ((e.domNode[i.DATA_KEY].mutations = [t]), e)
                      : (e.domNode[i.DATA_KEY].mutations.push(t), null);
                  })
                  .forEach(function (t) {
                    null != t &&
                      t !== r &&
                      null != t.domNode[i.DATA_KEY] &&
                      t.update(t.domNode[i.DATA_KEY].mutations || [], n);
                  }),
                null != this.domNode[i.DATA_KEY].mutations &&
                  t.prototype.update.call(this, this.domNode[i.DATA_KEY].mutations, n),
                this.optimize(e, n);
            }),
            (e.blotName = 'scroll'),
            (e.defaultChild = 'block'),
            (e.scope = i.Scope.BLOCK_BLOT),
            (e.tagName = 'DIV'),
            e
          );
        })(o.default);
      e.default = u;
    },
    function (t, e, n) {
      'use strict';
      function r(t, e) {
        if (Object.keys(t).length !== Object.keys(e).length) return !1;
        for (var n in t) if (t[n] !== e[n]) return !1;
        return !0;
      }
      var o =
        (this && this.__extends) ||
        (function () {
          var t =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
            };
          return function (e, n) {
            function r() {
              this.constructor = e;
            }
            t(e, n), (e.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()));
          };
        })();
      Object.defineProperty(e, '__esModule', { value: !0 });
      var i = n(18),
        a = n(1),
        u = (function (t) {
          function e() {
            return (null !== t && t.apply(this, arguments)) || this;
          }
          return (
            o(e, t),
            (e.formats = function (n) {
              if (n.tagName !== e.tagName) return t.formats.call(this, n);
            }),
            (e.prototype.format = function (n, r) {
              var o = this;
              n !== this.statics.blotName || r
                ? t.prototype.format.call(this, n, r)
                : (this.children.forEach(function (t) {
                    t instanceof i.default || (t = t.wrap(e.blotName, !0)), o.attributes.copy(t);
                  }),
                  this.unwrap());
            }),
            (e.prototype.formatAt = function (e, n, r, o) {
              if (null != this.formats()[r] || a.query(r, a.Scope.ATTRIBUTE)) {
                this.isolate(e, n).format(r, o);
              } else t.prototype.formatAt.call(this, e, n, r, o);
            }),
            (e.prototype.optimize = function (n) {
              t.prototype.optimize.call(this, n);
              var o = this.formats();
              if (0 === Object.keys(o).length) return this.unwrap();
              var i = this.next;
              i instanceof e && i.prev === this && r(o, i.formats()) && (i.moveChildren(this), i.remove());
            }),
            (e.blotName = 'inline'),
            (e.scope = a.Scope.INLINE_BLOT),
            (e.tagName = 'SPAN'),
            e
          );
        })(i.default);
      e.default = u;
    },
    function (t, e, n) {
      'use strict';
      var r =
        (this && this.__extends) ||
        (function () {
          var t =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
            };
          return function (e, n) {
            function r() {
              this.constructor = e;
            }
            t(e, n), (e.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()));
          };
        })();
      Object.defineProperty(e, '__esModule', { value: !0 });
      var o = n(18),
        i = n(1),
        a = (function (t) {
          function e() {
            return (null !== t && t.apply(this, arguments)) || this;
          }
          return (
            r(e, t),
            (e.formats = function (n) {
              var r = i.query(e.blotName).tagName;
              if (n.tagName !== r) return t.formats.call(this, n);
            }),
            (e.prototype.format = function (n, r) {
              null != i.query(n, i.Scope.BLOCK) &&
                (n !== this.statics.blotName || r ? t.prototype.format.call(this, n, r) : this.replaceWith(e.blotName));
            }),
            (e.prototype.formatAt = function (e, n, r, o) {
              null != i.query(r, i.Scope.BLOCK) ? this.format(r, o) : t.prototype.formatAt.call(this, e, n, r, o);
            }),
            (e.prototype.insertAt = function (e, n, r) {
              if (null == r || null != i.query(n, i.Scope.INLINE)) t.prototype.insertAt.call(this, e, n, r);
              else {
                var o = this.split(e),
                  a = i.create(n, r);
                o.parent.insertBefore(a, o);
              }
            }),
            (e.prototype.update = function (e, n) {
              navigator.userAgent.match(/Trident/) ? this.build() : t.prototype.update.call(this, e, n);
            }),
            (e.blotName = 'block'),
            (e.scope = i.Scope.BLOCK_BLOT),
            (e.tagName = 'P'),
            e
          );
        })(o.default);
      e.default = a;
    },
    function (t, e, n) {
      'use strict';
      var r =
        (this && this.__extends) ||
        (function () {
          var t =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
            };
          return function (e, n) {
            function r() {
              this.constructor = e;
            }
            t(e, n), (e.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()));
          };
        })();
      Object.defineProperty(e, '__esModule', { value: !0 });
      var o = n(19),
        i = (function (t) {
          function e() {
            return (null !== t && t.apply(this, arguments)) || this;
          }
          return (
            r(e, t),
            (e.formats = function (t) {}),
            (e.prototype.format = function (e, n) {
              t.prototype.formatAt.call(this, 0, this.length(), e, n);
            }),
            (e.prototype.formatAt = function (e, n, r, o) {
              0 === e && n === this.length() ? this.format(r, o) : t.prototype.formatAt.call(this, e, n, r, o);
            }),
            (e.prototype.formats = function () {
              return this.statics.formats(this.domNode);
            }),
            e
          );
        })(o.default);
      e.default = i;
    },
    function (t, e, n) {
      'use strict';
      var r =
        (this && this.__extends) ||
        (function () {
          var t =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
            };
          return function (e, n) {
            function r() {
              this.constructor = e;
            }
            t(e, n), (e.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()));
          };
        })();
      Object.defineProperty(e, '__esModule', { value: !0 });
      var o = n(19),
        i = n(1),
        a = (function (t) {
          function e(e) {
            var n = t.call(this, e) || this;
            return (n.text = n.statics.value(n.domNode)), n;
          }
          return (
            r(e, t),
            (e.create = function (t) {
              return document.createTextNode(t);
            }),
            (e.value = function (t) {
              var e = t.data;
              return e.normalize && (e = e.normalize()), e;
            }),
            (e.prototype.deleteAt = function (t, e) {
              this.domNode.data = this.text = this.text.slice(0, t) + this.text.slice(t + e);
            }),
            (e.prototype.index = function (t, e) {
              return this.domNode === t ? e : -1;
            }),
            (e.prototype.insertAt = function (e, n, r) {
              null == r
                ? ((this.text = this.text.slice(0, e) + n + this.text.slice(e)), (this.domNode.data = this.text))
                : t.prototype.insertAt.call(this, e, n, r);
            }),
            (e.prototype.length = function () {
              return this.text.length;
            }),
            (e.prototype.optimize = function (n) {
              t.prototype.optimize.call(this, n),
                (this.text = this.statics.value(this.domNode)),
                0 === this.text.length
                  ? this.remove()
                  : this.next instanceof e &&
                    this.next.prev === this &&
                    (this.insertAt(this.length(), this.next.value()), this.next.remove());
            }),
            (e.prototype.position = function (t, e) {
              return void 0 === e && (e = !1), [this.domNode, t];
            }),
            (e.prototype.split = function (t, e) {
              if ((void 0 === e && (e = !1), !e)) {
                if (0 === t) return this;
                if (t === this.length()) return this.next;
              }
              var n = i.create(this.domNode.splitText(t));
              return this.parent.insertBefore(n, this.next), (this.text = this.statics.value(this.domNode)), n;
            }),
            (e.prototype.update = function (t, e) {
              var n = this;
              t.some(function (t) {
                return 'characterData' === t.type && t.target === n.domNode;
              }) && (this.text = this.statics.value(this.domNode));
            }),
            (e.prototype.value = function () {
              return this.text;
            }),
            (e.blotName = 'text'),
            (e.scope = i.Scope.INLINE_BLOT),
            e
          );
        })(o.default);
      e.default = a;
    },
    function (t, e, n) {
      'use strict';
      var r = document.createElement('div');
      if ((r.classList.toggle('test-class', !1), r.classList.contains('test-class'))) {
        var o = DOMTokenList.prototype.toggle;
        DOMTokenList.prototype.toggle = function (t, e) {
          return arguments.length > 1 && !this.contains(t) == !e ? e : o.call(this, t);
        };
      }
      String.prototype.startsWith ||
        (String.prototype.startsWith = function (t, e) {
          return (e = e || 0), this.substr(e, t.length) === t;
        }),
        String.prototype.endsWith ||
          (String.prototype.endsWith = function (t, e) {
            var n = this.toString();
            ('number' != typeof e || !isFinite(e) || Math.floor(e) !== e || e > n.length) && (e = n.length),
              (e -= t.length);
            var r = n.indexOf(t, e);
            return -1 !== r && r === e;
          }),
        Array.prototype.find ||
          Object.defineProperty(Array.prototype, 'find', {
            value: function (t) {
              if (null === this) throw new TypeError('Array.prototype.find called on null or undefined');
              if ('function' != typeof t) throw new TypeError('predicate must be a function');
              for (var e, n = Object(this), r = n.length >>> 0, o = arguments[1], i = 0; i < r; i++)
                if (((e = n[i]), t.call(o, e, i, n))) return e;
            }
          }),
        document.addEventListener('DOMContentLoaded', function () {
          document.execCommand('enableObjectResizing', !1, !1), document.execCommand('autoUrlDetect', !1, !1);
        });
    },
    function (t, e) {
      function n(t, e, n) {
        if (t == e) return t ? [[v, t]] : [];
        (n < 0 || t.length < n) && (n = null);
        var o = a(t, e),
          i = t.substring(0, o);
        (t = t.substring(o)), (e = e.substring(o)), (o = u(t, e));
        var l = t.substring(t.length - o);
        (t = t.substring(0, t.length - o)), (e = e.substring(0, e.length - o));
        var c = r(t, e);
        return i && c.unshift([v, i]), l && c.push([v, l]), s(c), null != n && (c = f(c, n)), (c = p(c));
      }
      function r(t, e) {
        var r;
        if (!t) return [[y, e]];
        if (!e) return [[h, t]];
        var i = t.length > e.length ? t : e,
          a = t.length > e.length ? e : t,
          u = i.indexOf(a);
        if (-1 != u)
          return (
            (r = [
              [y, i.substring(0, u)],
              [v, a],
              [y, i.substring(u + a.length)]
            ]),
            t.length > e.length && (r[0][0] = r[2][0] = h),
            r
          );
        if (1 == a.length)
          return [
            [h, t],
            [y, e]
          ];
        var s = l(t, e);
        if (s) {
          var c = s[0],
            f = s[1],
            p = s[2],
            d = s[3],
            b = s[4],
            g = n(c, p),
            m = n(f, d);
          return g.concat([[v, b]], m);
        }
        return o(t, e);
      }
      function o(t, e) {
        for (
          var n = t.length,
            r = e.length,
            o = Math.ceil((n + r) / 2),
            a = o,
            u = 2 * o,
            l = new Array(u),
            s = new Array(u),
            c = 0;
          c < u;
          c++
        )
          (l[c] = -1), (s[c] = -1);
        (l[a + 1] = 0), (s[a + 1] = 0);
        for (var f = n - r, p = f % 2 != 0, d = 0, v = 0, b = 0, g = 0, m = 0; m < o; m++) {
          for (var _ = -m + d; _ <= m - v; _ += 2) {
            var O,
              w = a + _;
            O = _ == -m || (_ != m && l[w - 1] < l[w + 1]) ? l[w + 1] : l[w - 1] + 1;
            for (var E = O - _; O < n && E < r && t.charAt(O) == e.charAt(E); ) O++, E++;
            if (((l[w] = O), O > n)) v += 2;
            else if (E > r) d += 2;
            else if (p) {
              var N = a + f - _;
              if (N >= 0 && N < u && -1 != s[N]) {
                var j = n - s[N];
                if (O >= j) return i(t, e, O, E);
              }
            }
          }
          for (var A = -m + b; A <= m - g; A += 2) {
            var j,
              N = a + A;
            j = A == -m || (A != m && s[N - 1] < s[N + 1]) ? s[N + 1] : s[N - 1] + 1;
            for (var k = j - A; j < n && k < r && t.charAt(n - j - 1) == e.charAt(r - k - 1); ) j++, k++;
            if (((s[N] = j), j > n)) g += 2;
            else if (k > r) b += 2;
            else if (!p) {
              var w = a + f - A;
              if (w >= 0 && w < u && -1 != l[w]) {
                var O = l[w],
                  E = a + O - w;
                if (((j = n - j), O >= j)) return i(t, e, O, E);
              }
            }
          }
        }
        return [
          [h, t],
          [y, e]
        ];
      }
      function i(t, e, r, o) {
        var i = t.substring(0, r),
          a = e.substring(0, o),
          u = t.substring(r),
          l = e.substring(o),
          s = n(i, a),
          c = n(u, l);
        return s.concat(c);
      }
      function a(t, e) {
        if (!t || !e || t.charAt(0) != e.charAt(0)) return 0;
        for (var n = 0, r = Math.min(t.length, e.length), o = r, i = 0; n < o; )
          t.substring(i, o) == e.substring(i, o) ? ((n = o), (i = n)) : (r = o), (o = Math.floor((r - n) / 2 + n));
        return o;
      }
      function u(t, e) {
        if (!t || !e || t.charAt(t.length - 1) != e.charAt(e.length - 1)) return 0;
        for (var n = 0, r = Math.min(t.length, e.length), o = r, i = 0; n < o; )
          t.substring(t.length - o, t.length - i) == e.substring(e.length - o, e.length - i)
            ? ((n = o), (i = n))
            : (r = o),
            (o = Math.floor((r - n) / 2 + n));
        return o;
      }
      function l(t, e) {
        function n(t, e, n) {
          for (
            var r, o, i, l, s = t.substring(n, n + Math.floor(t.length / 4)), c = -1, f = '';
            -1 != (c = e.indexOf(s, c + 1));

          ) {
            var p = a(t.substring(n), e.substring(c)),
              d = u(t.substring(0, n), e.substring(0, c));
            f.length < d + p &&
              ((f = e.substring(c - d, c) + e.substring(c, c + p)),
              (r = t.substring(0, n - d)),
              (o = t.substring(n + p)),
              (i = e.substring(0, c - d)),
              (l = e.substring(c + p)));
          }
          return 2 * f.length >= t.length ? [r, o, i, l, f] : null;
        }
        var r = t.length > e.length ? t : e,
          o = t.length > e.length ? e : t;
        if (r.length < 4 || 2 * o.length < r.length) return null;
        var i,
          l = n(r, o, Math.ceil(r.length / 4)),
          s = n(r, o, Math.ceil(r.length / 2));
        if (!l && !s) return null;
        i = s ? (l && l[4].length > s[4].length ? l : s) : l;
        var c, f, p, d;
        return (
          t.length > e.length
            ? ((c = i[0]), (f = i[1]), (p = i[2]), (d = i[3]))
            : ((p = i[0]), (d = i[1]), (c = i[2]), (f = i[3])),
          [c, f, p, d, i[4]]
        );
      }
      function s(t) {
        t.push([v, '']);
        for (var e, n = 0, r = 0, o = 0, i = '', l = ''; n < t.length; )
          switch (t[n][0]) {
            case y:
              o++, (l += t[n][1]), n++;
              break;
            case h:
              r++, (i += t[n][1]), n++;
              break;
            case v:
              r + o > 1
                ? (0 !== r &&
                    0 !== o &&
                    ((e = a(l, i)),
                    0 !== e &&
                      (n - r - o > 0 && t[n - r - o - 1][0] == v
                        ? (t[n - r - o - 1][1] += l.substring(0, e))
                        : (t.splice(0, 0, [v, l.substring(0, e)]), n++),
                      (l = l.substring(e)),
                      (i = i.substring(e))),
                    0 !== (e = u(l, i)) &&
                      ((t[n][1] = l.substring(l.length - e) + t[n][1]),
                      (l = l.substring(0, l.length - e)),
                      (i = i.substring(0, i.length - e)))),
                  0 === r
                    ? t.splice(n - o, r + o, [y, l])
                    : 0 === o
                    ? t.splice(n - r, r + o, [h, i])
                    : t.splice(n - r - o, r + o, [h, i], [y, l]),
                  (n = n - r - o + (r ? 1 : 0) + (o ? 1 : 0) + 1))
                : 0 !== n && t[n - 1][0] == v
                ? ((t[n - 1][1] += t[n][1]), t.splice(n, 1))
                : n++,
                (o = 0),
                (r = 0),
                (i = ''),
                (l = '');
          }
        '' === t[t.length - 1][1] && t.pop();
        var c = !1;
        for (n = 1; n < t.length - 1; )
          t[n - 1][0] == v &&
            t[n + 1][0] == v &&
            (t[n][1].substring(t[n][1].length - t[n - 1][1].length) == t[n - 1][1]
              ? ((t[n][1] = t[n - 1][1] + t[n][1].substring(0, t[n][1].length - t[n - 1][1].length)),
                (t[n + 1][1] = t[n - 1][1] + t[n + 1][1]),
                t.splice(n - 1, 1),
                (c = !0))
              : t[n][1].substring(0, t[n + 1][1].length) == t[n + 1][1] &&
                ((t[n - 1][1] += t[n + 1][1]),
                (t[n][1] = t[n][1].substring(t[n + 1][1].length) + t[n + 1][1]),
                t.splice(n + 1, 1),
                (c = !0))),
            n++;
        c && s(t);
      }
      function c(t, e) {
        if (0 === e) return [v, t];
        for (var n = 0, r = 0; r < t.length; r++) {
          var o = t[r];
          if (o[0] === h || o[0] === v) {
            var i = n + o[1].length;
            if (e === i) return [r + 1, t];
            if (e < i) {
              t = t.slice();
              var a = e - n,
                u = [o[0], o[1].slice(0, a)],
                l = [o[0], o[1].slice(a)];
              return t.splice(r, 1, u, l), [r + 1, t];
            }
            n = i;
          }
        }
        throw new Error('cursor_pos is out of bounds!');
      }
      function f(t, e) {
        var n = c(t, e),
          r = n[1],
          o = n[0],
          i = r[o],
          a = r[o + 1];
        if (null == i) return t;
        if (i[0] !== v) return t;
        if (null != a && i[1] + a[1] === a[1] + i[1]) return r.splice(o, 2, a, i), d(r, o, 2);
        if (null != a && 0 === a[1].indexOf(i[1])) {
          r.splice(o, 2, [a[0], i[1]], [0, i[1]]);
          var u = a[1].slice(i[1].length);
          return u.length > 0 && r.splice(o + 2, 0, [a[0], u]), d(r, o, 3);
        }
        return t;
      }
      function p(t) {
        for (
          var e = !1,
            n = function (t) {
              return t.charCodeAt(0) >= 56320 && t.charCodeAt(0) <= 57343;
            },
            r = 2;
          r < t.length;
          r += 1
        )
          t[r - 2][0] === v &&
            (function (t) {
              return t.charCodeAt(t.length - 1) >= 55296 && t.charCodeAt(t.length - 1) <= 56319;
            })(t[r - 2][1]) &&
            t[r - 1][0] === h &&
            n(t[r - 1][1]) &&
            t[r][0] === y &&
            n(t[r][1]) &&
            ((e = !0),
            (t[r - 1][1] = t[r - 2][1].slice(-1) + t[r - 1][1]),
            (t[r][1] = t[r - 2][1].slice(-1) + t[r][1]),
            (t[r - 2][1] = t[r - 2][1].slice(0, -1)));
        if (!e) return t;
        for (var o = [], r = 0; r < t.length; r += 1) t[r][1].length > 0 && o.push(t[r]);
        return o;
      }
      function d(t, e, n) {
        for (var r = e + n - 1; r >= 0 && r >= e - 1; r--)
          if (r + 1 < t.length) {
            var o = t[r],
              i = t[r + 1];
            o[0] === i[1] && t.splice(r, 2, [o[0], o[1] + i[1]]);
          }
        return t;
      }
      var h = -1,
        y = 1,
        v = 0,
        b = n;
      (b.INSERT = y), (b.DELETE = h), (b.EQUAL = v), (t.exports = b);
    },
    function (t, e, n) {
      'use strict';
      var r;
      if (!Object.keys) {
        var o = Object.prototype.hasOwnProperty,
          i = Object.prototype.toString,
          a = n(32),
          u = Object.prototype.propertyIsEnumerable,
          l = !u.call({ toString: null }, 'toString'),
          s = u.call(function () {}, 'prototype'),
          c = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
          ],
          f = function (t) {
            var e = t.constructor;
            return e && e.prototype === t;
          },
          p = {
            $applicationCache: !0,
            $console: !0,
            $external: !0,
            $frame: !0,
            $frameElement: !0,
            $frames: !0,
            $innerHeight: !0,
            $innerWidth: !0,
            $onmozfullscreenchange: !0,
            $onmozfullscreenerror: !0,
            $outerHeight: !0,
            $outerWidth: !0,
            $pageXOffset: !0,
            $pageYOffset: !0,
            $parent: !0,
            $scrollLeft: !0,
            $scrollTop: !0,
            $scrollX: !0,
            $scrollY: !0,
            $self: !0,
            $webkitIndexedDB: !0,
            $webkitStorageInfo: !0,
            $window: !0
          },
          d = (function () {
            if ('undefined' == typeof window) return !1;
            for (var t in window)
              try {
                if (!p['$' + t] && o.call(window, t) && null !== window[t] && 'object' == typeof window[t])
                  try {
                    f(window[t]);
                  } catch (t) {
                    return !0;
                  }
              } catch (t) {
                return !0;
              }
            return !1;
          })(),
          h = function (t) {
            if ('undefined' == typeof window || !d) return f(t);
            try {
              return f(t);
            } catch (t) {
              return !1;
            }
          };
        r = function (t) {
          var e = null !== t && 'object' == typeof t,
            n = '[object Function]' === i.call(t),
            r = a(t),
            u = e && '[object String]' === i.call(t),
            f = [];
          if (!e && !n && !r) throw new TypeError('Object.keys called on a non-object');
          var p = s && n;
          if (u && t.length > 0 && !o.call(t, 0)) for (var d = 0; d < t.length; ++d) f.push(String(d));
          if (r && t.length > 0) for (var y = 0; y < t.length; ++y) f.push(String(y));
          else for (var v in t) (p && 'prototype' === v) || !o.call(t, v) || f.push(String(v));
          if (l)
            for (var b = h(t), g = 0; g < c.length; ++g)
              (b && 'constructor' === c[g]) || !o.call(t, c[g]) || f.push(c[g]);
          return f;
        };
      }
      t.exports = r;
    },
    function (t, e, n) {
      'use strict';
      var r = n(20)(),
        o = n(34),
        i = o('Object.prototype.toString'),
        a = function (t) {
          return !(r && t && 'object' == typeof t && Symbol.toStringTag in t) && '[object Arguments]' === i(t);
        },
        u = function (t) {
          return (
            !!a(t) ||
            (null !== t &&
              'object' == typeof t &&
              'number' == typeof t.length &&
              t.length >= 0 &&
              '[object Array]' !== i(t) &&
              '[object Function]' === i(t.callee))
          );
        },
        l = (function () {
          return a(arguments);
        })();
      (a.isLegacyArguments = u), (t.exports = l ? a : u);
    },
    function (t, e, n) {
      'use strict';
      var r = 'undefined' != typeof Symbol && Symbol,
        o = n(33);
      t.exports = function () {
        return (
          'function' == typeof r &&
          'function' == typeof Symbol &&
          'symbol' == typeof r('foo') &&
          'symbol' == typeof Symbol('bar') &&
          o()
        );
      };
    },
    function (t, e, n) {
      'use strict';
      var r = Array.prototype.slice,
        o = Object.prototype.toString;
      t.exports = function (t) {
        var e = this;
        if ('function' != typeof e || '[object Function]' !== o.call(e))
          throw new TypeError('Function.prototype.bind called on incompatible ' + e);
        for (
          var n,
            i = r.call(arguments, 1),
            a = function () {
              if (this instanceof n) {
                var o = e.apply(this, i.concat(r.call(arguments)));
                return Object(o) === o ? o : this;
              }
              return e.apply(t, i.concat(r.call(arguments)));
            },
            u = Math.max(0, e.length - i.length),
            l = [],
            s = 0;
          s < u;
          s++
        )
          l.push('$' + s);
        if (
          ((n = Function('binder', 'return function (' + l.join(',') + '){ return binder.apply(this,arguments); }')(a)),
          e.prototype)
        ) {
          var c = function () {};
          (c.prototype = e.prototype), (n.prototype = new c()), (c.prototype = null);
        }
        return n;
      };
    },
    function (t, e, n) {
      'use strict';
      var r = n(21);
      t.exports = r.call(Function.call, Object.prototype.hasOwnProperty);
    },
    function (t, e, n) {
      'use strict';
      var r = n(12),
        o = n(22),
        i = n(36),
        a = n(37),
        u = n(67),
        l = o(a(), Object);
      r(l, { getPolyfill: a, implementation: i, shim: u }), (t.exports = l);
    },
    function (t, e, n) {
      'use strict';
      var r = n(37),
        o = n(12);
      t.exports = function () {
        var t = r();
        return (
          o(
            Object,
            { is: t },
            {
              is: function () {
                return Object.is !== t;
              }
            }
          ),
          t
        );
      };
    },
    function (t, e, n) {
      'use strict';
      var r,
        o,
        i,
        a,
        u = n(34),
        l = n(20)();
      if (l) {
        (r = u('Object.prototype.hasOwnProperty')), (o = u('RegExp.prototype.exec')), (i = {});
        var s = function () {
          throw i;
        };
        (a = { toString: s, valueOf: s }), 'symbol' == typeof Symbol.toPrimitive && (a[Symbol.toPrimitive] = s);
      }
      var c = u('Object.prototype.toString'),
        f = Object.getOwnPropertyDescriptor;
      t.exports = l
        ? function (t) {
            if (!t || 'object' != typeof t) return !1;
            var e = f(t, 'lastIndex');
            if (!e || !r(e, 'value')) return !1;
            try {
              o(t, a);
            } catch (t) {
              return t === i;
            }
          }
        : function (t) {
            return !(!t || ('object' != typeof t && 'function' != typeof t)) && '[object RegExp]' === c(t);
          };
    },
    function (t, e, n) {
      'use strict';
      var r = n(12),
        o = n(22),
        i = n(38),
        a = n(39),
        u = n(70),
        l = o(i);
      r(l, { getPolyfill: a, implementation: i, shim: u }), (t.exports = l);
    },
    function (t, e, n) {
      'use strict';
      var r = n(12).supportsDescriptors,
        o = n(39),
        i = Object.getOwnPropertyDescriptor,
        a = Object.defineProperty,
        u = TypeError,
        l = Object.getPrototypeOf,
        s = /a/;
      t.exports = function () {
        if (!r || !l)
          throw new u('RegExp.prototype.flags requires a true ES5 environment that supports property descriptors');
        var t = o(),
          e = l(s),
          n = i(e, 'flags');
        return (n && n.get === t) || a(e, 'flags', { configurable: !0, enumerable: !1, get: t }), t;
      };
    },
    function (t, e, n) {
      'use strict';
      var r = Date.prototype.getDay,
        o = function (t) {
          try {
            return r.call(t), !0;
          } catch (t) {
            return !1;
          }
        },
        i = Object.prototype.toString,
        a = n(20)();
      t.exports = function (t) {
        return 'object' == typeof t && null !== t && (a ? o(t) : '[object Date]' === i.call(t));
      };
    },
    function (t, e, n) {
      'use strict';
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function o(t, e, n) {
        return (
          e in t
            ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 })
            : (t[e] = n),
          t
        );
      }
      function i(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function a(t, e) {
        return Object.keys(e).reduce(function (n, r) {
          return null == t[r]
            ? n
            : (e[r] === t[r]
                ? (n[r] = e[r])
                : Array.isArray(e[r])
                ? e[r].indexOf(t[r]) < 0 && (n[r] = e[r].concat([t[r]]))
                : (n[r] = [e[r], t[r]]),
              n);
        }, {});
      }
      function u(t) {
        return t.reduce(function (t, e) {
          if (1 === e.insert) {
            var n = (0, A.default)(e.attributes);
            return delete n.image, t.insert({ image: e.attributes.image }, n);
          }
          if (
            (null == e.attributes ||
              (!0 !== e.attributes.list && !0 !== e.attributes.bullet) ||
              ((e = (0, A.default)(e)),
              e.attributes.list
                ? (e.attributes.list = 'ordered')
                : ((e.attributes.list = 'bullet'), delete e.attributes.bullet)),
            'string' == typeof e.insert)
          ) {
            var r = e.insert.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            return t.insert(r, e.attributes);
          }
          return t.push(e);
        }, new p.default());
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      var l =
          'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
            ? function (t) {
                return typeof t;
              }
            : function (t) {
                return t && 'function' == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype
                  ? 'symbol'
                  : typeof t;
              },
        s = (function () {
          function t(t, e) {
            var n = [],
              r = !0,
              o = !1,
              i = void 0;
            try {
              for (
                var a, u = t[Symbol.iterator]();
                !(r = (a = u.next()).done) && (n.push(a.value), !e || n.length !== e);
                r = !0
              );
            } catch (t) {
              (o = !0), (i = t);
            } finally {
              try {
                !r && u.return && u.return();
              } finally {
                if (o) throw i;
              }
            }
            return n;
          }
          return function (e, n) {
            if (Array.isArray(e)) return e;
            if (Symbol.iterator in Object(e)) return t(e, n);
            throw new TypeError('Invalid attempt to destructure non-iterable instance');
          };
        })(),
        c = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        f = n(5),
        p = r(f),
        d = n(23),
        h = r(d),
        y = n(0),
        v = r(y),
        b = n(13),
        g = r(b),
        m = n(40),
        _ = r(m),
        O = n(2),
        w = r(O),
        E = n(15),
        N = r(E),
        j = n(24),
        A = r(j),
        k = n(11),
        x = r(k),
        S = n(3),
        P = r(S),
        T = /^[ -~]*$/,
        C = (function () {
          function t(e) {
            i(this, t), (this.scroll = e), (this.delta = this.getDelta());
          }
          return (
            c(t, [
              {
                key: 'applyDelta',
                value: function (t) {
                  var e = this,
                    n = !1;
                  this.scroll.update();
                  var r = this.scroll.length();
                  return (
                    this.scroll.batchStart(),
                    (t = u(t)),
                    t.reduce(function (t, o) {
                      var i = o.retain || o.delete || o.insert.length || 1,
                        a = o.attributes || {};
                      if (null != o.insert) {
                        if ('string' == typeof o.insert) {
                          var u = o.insert;
                          u.endsWith('\n') && n && ((n = !1), (u = u.slice(0, -1))),
                            t >= r && !u.endsWith('\n') && (n = !0),
                            e.scroll.insertAt(t, u);
                          var c = e.scroll.line(t),
                            f = s(c, 2),
                            p = f[0],
                            d = f[1],
                            y = (0, P.default)({}, (0, O.bubbleFormats)(p));
                          if (p instanceof w.default) {
                            var b = p.descendant(v.default.Leaf, d),
                              g = s(b, 1),
                              m = g[0];
                            y = (0, P.default)(y, (0, O.bubbleFormats)(m));
                          }
                          a = h.default.attributes.diff(y, a) || {};
                        } else if ('object' === l(o.insert)) {
                          var _ = Object.keys(o.insert)[0];
                          if (null == _) return t;
                          e.scroll.insertAt(t, _, o.insert[_]);
                        }
                        r += i;
                      }
                      return (
                        Object.keys(a).forEach(function (n) {
                          e.scroll.formatAt(t, i, n, a[n]);
                        }),
                        t + i
                      );
                    }, 0),
                    t.reduce(function (t, n) {
                      return 'number' == typeof n.delete
                        ? (e.scroll.deleteAt(t, n.delete), t)
                        : t + (n.retain || n.insert.length || 1);
                    }, 0),
                    this.scroll.batchEnd(),
                    this.update(t)
                  );
                }
              },
              {
                key: 'deleteText',
                value: function (t, e) {
                  return this.scroll.deleteAt(t, e), this.update(new p.default().retain(t).delete(e));
                }
              },
              {
                key: 'formatLine',
                value: function (t, e) {
                  var n = this,
                    r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                  return (
                    this.scroll.update(),
                    Object.keys(r).forEach(function (o) {
                      if (null == n.scroll.whitelist || n.scroll.whitelist[o]) {
                        var i = n.scroll.lines(t, Math.max(e, 1)),
                          a = e;
                        i.forEach(function (e) {
                          var i = e.length();
                          if (e instanceof g.default) {
                            var u = t - e.offset(n.scroll),
                              l = e.newlineIndex(u + a) - u + 1;
                            e.formatAt(u, l, o, r[o]);
                          } else e.format(o, r[o]);
                          a -= i;
                        });
                      }
                    }),
                    this.scroll.optimize(),
                    this.update(new p.default().retain(t).retain(e, (0, A.default)(r)))
                  );
                }
              },
              {
                key: 'formatText',
                value: function (t, e) {
                  var n = this,
                    r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                  return (
                    Object.keys(r).forEach(function (o) {
                      n.scroll.formatAt(t, e, o, r[o]);
                    }),
                    this.update(new p.default().retain(t).retain(e, (0, A.default)(r)))
                  );
                }
              },
              {
                key: 'getContents',
                value: function (t, e) {
                  return this.delta.slice(t, t + e);
                }
              },
              {
                key: 'getDelta',
                value: function () {
                  return this.scroll.lines().reduce(function (t, e) {
                    return t.concat(e.delta());
                  }, new p.default());
                }
              },
              {
                key: 'getFormat',
                value: function (t) {
                  var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
                    n = [],
                    r = [];
                  0 === e
                    ? this.scroll.path(t).forEach(function (t) {
                        var e = s(t, 1),
                          o = e[0];
                        o instanceof w.default ? n.push(o) : o instanceof v.default.Leaf && r.push(o);
                      })
                    : ((n = this.scroll.lines(t, e)), (r = this.scroll.descendants(v.default.Leaf, t, e)));
                  var o = [n, r].map(function (t) {
                    if (0 === t.length) return {};
                    for (var e = (0, O.bubbleFormats)(t.shift()); Object.keys(e).length > 0; ) {
                      var n = t.shift();
                      if (null == n) return e;
                      e = a((0, O.bubbleFormats)(n), e);
                    }
                    return e;
                  });
                  return P.default.apply(P.default, o);
                }
              },
              {
                key: 'getText',
                value: function (t, e) {
                  return this.getContents(t, e)
                    .filter(function (t) {
                      return 'string' == typeof t.insert;
                    })
                    .map(function (t) {
                      return t.insert;
                    })
                    .join('');
                }
              },
              {
                key: 'insertEmbed',
                value: function (t, e, n) {
                  return this.scroll.insertAt(t, e, n), this.update(new p.default().retain(t).insert(o({}, e, n)));
                }
              },
              {
                key: 'insertText',
                value: function (t, e) {
                  var n = this,
                    r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                  return (
                    (e = e.replace(/\r\n/g, '\n').replace(/\r/g, '\n')),
                    this.scroll.insertAt(t, e),
                    Object.keys(r).forEach(function (o) {
                      n.scroll.formatAt(t, e.length, o, r[o]);
                    }),
                    this.update(new p.default().retain(t).insert(e, (0, A.default)(r)))
                  );
                }
              },
              {
                key: 'isBlank',
                value: function () {
                  if (0 == this.scroll.children.length) return !0;
                  if (this.scroll.children.length > 1) return !1;
                  var t = this.scroll.children.head;
                  return (
                    t.statics.blotName === w.default.blotName &&
                    !(t.children.length > 1) &&
                    t.children.head instanceof N.default
                  );
                }
              },
              {
                key: 'removeFormat',
                value: function (t, e) {
                  var n = this.getText(t, e),
                    r = this.scroll.line(t + e),
                    o = s(r, 2),
                    i = o[0],
                    a = o[1],
                    u = 0,
                    l = new p.default();
                  null != i &&
                    ((u = i instanceof g.default ? i.newlineIndex(a) - a + 1 : i.length() - a),
                    (l = i
                      .delta()
                      .slice(a, a + u - 1)
                      .insert('\n')));
                  var c = this.getContents(t, e + u),
                    f = c.diff(new p.default().insert(n).concat(l)),
                    d = new p.default().retain(t).concat(f);
                  return this.applyDelta(d);
                }
              },
              {
                key: 'update',
                value: function (t) {
                  var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
                    n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : void 0,
                    r = this.delta;
                  if (
                    1 === e.length &&
                    'characterData' === e[0].type &&
                    e[0].target.data.match(T) &&
                    v.default.find(e[0].target)
                  ) {
                    var o = v.default.find(e[0].target),
                      i = (0, O.bubbleFormats)(o),
                      a = o.offset(this.scroll),
                      u = e[0].oldValue.replace(_.default.CONTENTS, ''),
                      l = new p.default().insert(u),
                      s = new p.default().insert(o.value());
                    (t = new p.default()
                      .retain(a)
                      .concat(l.diff(s, n))
                      .reduce(function (t, e) {
                        return e.insert ? t.insert(e.insert, i) : t.push(e);
                      }, new p.default())),
                      (this.delta = r.compose(t));
                  } else
                    (this.delta = this.getDelta()),
                      (t && (0, x.default)(r.compose(t), this.delta)) || (t = r.diff(this.delta, n));
                  return t;
                }
              }
            ]),
            t
          );
        })();
      e.default = C;
    },
    function (t, e) {
      'use strict';
      function n() {}
      function r(t, e, n) {
        (this.fn = t), (this.context = e), (this.once = n || !1);
      }
      function o() {
        (this._events = new n()), (this._eventsCount = 0);
      }
      var i = Object.prototype.hasOwnProperty,
        a = '~';
      Object.create && ((n.prototype = Object.create(null)), new n().__proto__ || (a = !1)),
        (o.prototype.eventNames = function () {
          var t,
            e,
            n = [];
          if (0 === this._eventsCount) return n;
          for (e in (t = this._events)) i.call(t, e) && n.push(a ? e.slice(1) : e);
          return Object.getOwnPropertySymbols ? n.concat(Object.getOwnPropertySymbols(t)) : n;
        }),
        (o.prototype.listeners = function (t, e) {
          var n = a ? a + t : t,
            r = this._events[n];
          if (e) return !!r;
          if (!r) return [];
          if (r.fn) return [r.fn];
          for (var o = 0, i = r.length, u = new Array(i); o < i; o++) u[o] = r[o].fn;
          return u;
        }),
        (o.prototype.emit = function (t, e, n, r, o, i) {
          var u = a ? a + t : t;
          if (!this._events[u]) return !1;
          var l,
            s,
            c = this._events[u],
            f = arguments.length;
          if (c.fn) {
            switch ((c.once && this.removeListener(t, c.fn, void 0, !0), f)) {
              case 1:
                return c.fn.call(c.context), !0;
              case 2:
                return c.fn.call(c.context, e), !0;
              case 3:
                return c.fn.call(c.context, e, n), !0;
              case 4:
                return c.fn.call(c.context, e, n, r), !0;
              case 5:
                return c.fn.call(c.context, e, n, r, o), !0;
              case 6:
                return c.fn.call(c.context, e, n, r, o, i), !0;
            }
            for (s = 1, l = new Array(f - 1); s < f; s++) l[s - 1] = arguments[s];
            c.fn.apply(c.context, l);
          } else {
            var p,
              d = c.length;
            for (s = 0; s < d; s++)
              switch ((c[s].once && this.removeListener(t, c[s].fn, void 0, !0), f)) {
                case 1:
                  c[s].fn.call(c[s].context);
                  break;
                case 2:
                  c[s].fn.call(c[s].context, e);
                  break;
                case 3:
                  c[s].fn.call(c[s].context, e, n);
                  break;
                case 4:
                  c[s].fn.call(c[s].context, e, n, r);
                  break;
                default:
                  if (!l) for (p = 1, l = new Array(f - 1); p < f; p++) l[p - 1] = arguments[p];
                  c[s].fn.apply(c[s].context, l);
              }
          }
          return !0;
        }),
        (o.prototype.on = function (t, e, n) {
          var o = new r(e, n || this),
            i = a ? a + t : t;
          return (
            this._events[i]
              ? this._events[i].fn
                ? (this._events[i] = [this._events[i], o])
                : this._events[i].push(o)
              : ((this._events[i] = o), this._eventsCount++),
            this
          );
        }),
        (o.prototype.once = function (t, e, n) {
          var o = new r(e, n || this, !0),
            i = a ? a + t : t;
          return (
            this._events[i]
              ? this._events[i].fn
                ? (this._events[i] = [this._events[i], o])
                : this._events[i].push(o)
              : ((this._events[i] = o), this._eventsCount++),
            this
          );
        }),
        (o.prototype.removeListener = function (t, e, r, o) {
          var i = a ? a + t : t;
          if (!this._events[i]) return this;
          if (!e) return 0 == --this._eventsCount ? (this._events = new n()) : delete this._events[i], this;
          var u = this._events[i];
          if (u.fn)
            u.fn !== e ||
              (o && !u.once) ||
              (r && u.context !== r) ||
              (0 == --this._eventsCount ? (this._events = new n()) : delete this._events[i]);
          else {
            for (var l = 0, s = [], c = u.length; l < c; l++)
              (u[l].fn !== e || (o && !u[l].once) || (r && u[l].context !== r)) && s.push(u[l]);
            s.length
              ? (this._events[i] = 1 === s.length ? s[0] : s)
              : 0 == --this._eventsCount
              ? (this._events = new n())
              : delete this._events[i];
          }
          return this;
        }),
        (o.prototype.removeAllListeners = function (t) {
          var e;
          return (
            t
              ? ((e = a ? a + t : t),
                this._events[e] && (0 == --this._eventsCount ? (this._events = new n()) : delete this._events[e]))
              : ((this._events = new n()), (this._eventsCount = 0)),
            this
          );
        }),
        (o.prototype.off = o.prototype.removeListener),
        (o.prototype.addListener = o.prototype.on),
        (o.prototype.setMaxListeners = function () {
          return this;
        }),
        (o.prefixed = a),
        (o.EventEmitter = o),
        void 0 !== t && (t.exports = o);
    },
    function (t, e, n) {
      'use strict';
      function r(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function o() {
        for (var t = document.activeElement; ; ) {
          if (!(t && t.shadowRoot && t.shadowRoot.activeElement)) break;
          t = t.shadowRoot.activeElement;
        }
        return t;
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      var i = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        a = 'function' == typeof window.ShadowRoot.prototype.getSelection,
        u = window.InputEvent && 'function' == typeof window.InputEvent.prototype.getTargetRanges,
        l = window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
        s = !(!window.navigator.userAgent.match(/Trident/) || window.navigator.userAgent.match(/MSIE/)),
        c = window.navigator.userAgent.match(/Edge/),
        f = !1,
        p = (e.ShadowSelection = (function () {
          function t() {
            r(this, t), (this._ranges = []);
          }
          return (
            i(t, [
              {
                key: 'getRangeAt',
                value: function (t) {
                  return this._ranges[t];
                }
              },
              {
                key: 'addRange',
                value: function (t) {
                  if ((this._ranges.push(t), !f)) {
                    var e = window.getSelection();
                    e.removeAllRanges(), e.addRange(t);
                  }
                }
              },
              {
                key: 'removeAllRanges',
                value: function () {
                  this._ranges = [];
                }
              },
              {
                key: 'rangeCount',
                get: function () {
                  return this._ranges.length;
                }
              }
            ]),
            t
          );
        })());
      if (
        ((l || s || c) &&
          !a &&
          (window.ShadowRoot.prototype.getSelection = function () {
            return document.getSelection();
          }),
        !l && !a && u)
      ) {
        var d = new p();
        (window.ShadowRoot.prototype.getSelection = function () {
          return d;
        }),
          window.addEventListener(
            'selectionchange',
            function () {
              if (!f) {
                f = !0;
                var t = o();
                t && 'true' === t.getAttribute('contenteditable')
                  ? document.execCommand('indent')
                  : d.removeAllRanges(),
                  (f = !1);
              }
            },
            !0
          ),
          window.addEventListener(
            'beforeinput',
            function (t) {
              if (f) {
                var e = t.getTargetRanges(),
                  n = e[0],
                  r = new Range();
                r.setStart(n.startContainer, n.startOffset),
                  r.setEnd(n.endContainer, n.endOffset),
                  d.removeAllRanges(),
                  d.addRange(r),
                  t.preventDefault(),
                  t.stopImmediatePropagation();
              }
            },
            !0
          ),
          window.addEventListener(
            'selectstart',
            function () {
              d.removeAllRanges();
            },
            !0
          );
      }
    },
    function (t, e, n) {
      'use strict';
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function o(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function i(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function a(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      function u(t) {
        return t instanceof v.default || t instanceof y.BlockEmbed;
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      var l = (function () {
          function t(t, e) {
            var n = [],
              r = !0,
              o = !1,
              i = void 0;
            try {
              for (
                var a, u = t[Symbol.iterator]();
                !(r = (a = u.next()).done) && (n.push(a.value), !e || n.length !== e);
                r = !0
              );
            } catch (t) {
              (o = !0), (i = t);
            } finally {
              try {
                !r && u.return && u.return();
              } finally {
                if (o) throw i;
              }
            }
            return n;
          }
          return function (e, n) {
            if (Array.isArray(e)) return e;
            if (Symbol.iterator in Object(e)) return t(e, n);
            throw new TypeError('Invalid attempt to destructure non-iterable instance');
          };
        })(),
        s = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        c = function t(e, n, r) {
          null === e && (e = Function.prototype);
          var o = Object.getOwnPropertyDescriptor(e, n);
          if (void 0 === o) {
            var i = Object.getPrototypeOf(e);
            return null === i ? void 0 : t(i, n, r);
          }
          if ('value' in o) return o.value;
          var a = o.get;
          if (void 0 !== a) return a.call(r);
        },
        f = n(0),
        p = r(f),
        d = n(14),
        h = r(d),
        y = n(2),
        v = r(y),
        b = n(15),
        g = r(b),
        m = n(13),
        _ = r(m),
        O = n(25),
        w = r(O),
        E = (function (t) {
          function e(t, n) {
            o(this, e);
            var r = i(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t));
            return (
              (r.emitter = n.emitter),
              Array.isArray(n.whitelist) &&
                (r.whitelist = n.whitelist.reduce(function (t, e) {
                  return (t[e] = !0), t;
                }, {})),
              r.optimize(),
              r.enable(),
              r
            );
          }
          return (
            a(e, t),
            s(e, [
              {
                key: 'batchStart',
                value: function () {
                  this.batch = !0;
                }
              },
              {
                key: 'batchEnd',
                value: function () {
                  (this.batch = !1), this.optimize();
                }
              },
              {
                key: 'deleteAt',
                value: function (t, n) {
                  var r = this.line(t),
                    o = l(r, 2),
                    i = o[0],
                    a = o[1],
                    u = this.line(t + n),
                    s = l(u, 1),
                    f = s[0];
                  if (
                    (c(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'deleteAt', this).call(this, t, n),
                    null != f && i !== f && a > 0)
                  ) {
                    if (i instanceof y.BlockEmbed || f instanceof y.BlockEmbed) return void this.optimize();
                    if (i instanceof _.default) {
                      var p = i.newlineIndex(i.length(), !0);
                      if (p > -1 && (i = i.split(p + 1)) === f) return void this.optimize();
                    } else if (f instanceof _.default) {
                      var d = f.newlineIndex(0);
                      d > -1 && f.split(d + 1);
                    }
                    var h = f.children.head instanceof g.default ? null : f.children.head;
                    i.moveChildren(f, h), i.remove();
                  }
                  this.optimize();
                }
              },
              {
                key: 'enable',
                value: function () {
                  var t = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
                  this.domNode.setAttribute('contenteditable', t);
                }
              },
              {
                key: 'formatAt',
                value: function (t, n, r, o) {
                  (null == this.whitelist || this.whitelist[r]) &&
                    (c(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'formatAt', this).call(
                      this,
                      t,
                      n,
                      r,
                      o
                    ),
                    this.optimize());
                }
              },
              {
                key: 'insertAt',
                value: function (t, n, r) {
                  if (null == r || null == this.whitelist || this.whitelist[n]) {
                    if (t >= this.length())
                      if (null == r || null == p.default.query(n, p.default.Scope.BLOCK)) {
                        var o = p.default.create(this.statics.defaultChild);
                        this.appendChild(o), null == r && n.endsWith('\n') && (n = n.slice(0, -1)), o.insertAt(0, n, r);
                      } else {
                        var i = p.default.create(n, r);
                        this.appendChild(i);
                      }
                    else
                      c(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'insertAt', this).call(
                        this,
                        t,
                        n,
                        r
                      );
                    this.optimize();
                  }
                }
              },
              {
                key: 'insertBefore',
                value: function (t, n) {
                  if (t.statics.scope === p.default.Scope.INLINE_BLOT) {
                    var r = p.default.create(this.statics.defaultChild);
                    r.appendChild(t), (t = r);
                  }
                  c(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'insertBefore', this).call(this, t, n);
                }
              },
              {
                key: 'leaf',
                value: function (t) {
                  return this.path(t).pop() || [null, -1];
                }
              },
              {
                key: 'line',
                value: function (t) {
                  return t === this.length() ? this.line(t - 1) : this.descendant(u, t);
                }
              },
              {
                key: 'lines',
                value: function () {
                  var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
                    e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : Number.MAX_VALUE;
                  return (function t(e, n, r) {
                    var o = [],
                      i = r;
                    return (
                      e.children.forEachAt(n, r, function (e, n, r) {
                        u(e) ? o.push(e) : e instanceof p.default.Container && (o = o.concat(t(e, n, i))), (i -= r);
                      }),
                      o
                    );
                  })(this, t, e);
                }
              },
              {
                key: 'optimize',
                value: function () {
                  var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
                    n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                  !0 !== this.batch &&
                    (c(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'optimize', this).call(this, t, n),
                    t.length > 0 && this.emitter.emit(h.default.events.SCROLL_OPTIMIZE, t, n));
                }
              },
              {
                key: 'path',
                value: function (t) {
                  return c(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'path', this)
                    .call(this, t)
                    .slice(1);
                }
              },
              {
                key: 'update',
                value: function (t) {
                  if (!0 !== this.batch) {
                    var n = h.default.sources.USER;
                    'string' == typeof t && (n = t),
                      Array.isArray(t) || (t = this.observer.takeRecords()),
                      t.length > 0 && this.emitter.emit(h.default.events.SCROLL_BEFORE_UPDATE, n, t),
                      c(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'update', this).call(
                        this,
                        t.concat([])
                      ),
                      t.length > 0 && this.emitter.emit(h.default.events.SCROLL_UPDATE, n, t);
                  }
                }
              }
            ]),
            e
          );
        })(p.default.Scroll);
      (E.blotName = 'scroll'),
        (E.className = 'ql-editor'),
        (E.tagName = 'DIV'),
        (E.defaultChild = 'block'),
        (E.allowedChildren = [v.default, y.BlockEmbed, w.default]),
        (e.default = E);
    },
    function (t, e, n) {
      'use strict';
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function o(t, e, n) {
        return (
          e in t
            ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 })
            : (t[e] = n),
          t
        );
      }
      function i(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function a(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function u(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      function l(t, e, n) {
        return 'object' === (void 0 === e ? 'undefined' : w(e))
          ? Object.keys(e).reduce(function (t, n) {
              return l(t, n, e[n]);
            }, t)
          : t.reduce(function (t, r) {
              return r.attributes && r.attributes[e]
                ? t.push(r)
                : t.insert(r.insert, (0, A.default)({}, o({}, e, n), r.attributes));
            }, new x.default());
      }
      function s(t) {
        if (t.nodeType !== Node.ELEMENT_NODE) return {};
        return t['__ql-computed-style'] || (t['__ql-computed-style'] = window.getComputedStyle(t));
      }
      function c(t, e) {
        for (var n = '', r = t.ops.length - 1; r >= 0 && n.length < e.length; --r) {
          var o = t.ops[r];
          if ('string' != typeof o.insert) break;
          n = o.insert + n;
        }
        return n.slice(-1 * e.length) === e;
      }
      function f(t) {
        return 0 !== t.childNodes.length && ['block', 'list-item'].indexOf(s(t).display) > -1;
      }
      function p(t, e, n) {
        return t.nodeType === t.TEXT_NODE
          ? n.reduce(function (e, n) {
              return n(t, e);
            }, new x.default())
          : t.nodeType === t.ELEMENT_NODE
          ? [].reduce.call(
              t.childNodes || [],
              function (r, o) {
                var i = p(o, e, n);
                return (
                  o.nodeType === t.ELEMENT_NODE &&
                    ((i = e.reduce(function (t, e) {
                      return e(o, t);
                    }, i)),
                    (i = (o[H] || []).reduce(function (t, e) {
                      return e(o, t);
                    }, i))),
                  r.concat(i)
                );
              },
              new x.default()
            )
          : new x.default();
      }
      function d(t, e, n) {
        return l(n, t, !0);
      }
      function h(t, e) {
        var n = P.default.Attributor.Attribute.keys(t),
          r = P.default.Attributor.Class.keys(t),
          o = P.default.Attributor.Style.keys(t),
          i = {};
        return (
          n
            .concat(r)
            .concat(o)
            .forEach(function (e) {
              var n = P.default.query(e, P.default.Scope.ATTRIBUTE);
              (null != n && ((i[n.attrName] = n.value(t)), i[n.attrName])) ||
                ((n = Y[e]),
                null == n || (n.attrName !== e && n.keyName !== e) || (i[n.attrName] = n.value(t) || void 0),
                null == (n = V[e]) ||
                  (n.attrName !== e && n.keyName !== e) ||
                  ((n = V[e]), (i[n.attrName] = n.value(t) || void 0)));
            }),
          Object.keys(i).length > 0 && (e = l(e, i)),
          e
        );
      }
      function y(t, e) {
        var n = P.default.query(t);
        if (null == n) return e;
        if (n.prototype instanceof P.default.Embed) {
          var r = {},
            o = n.value(t);
          null != o && ((r[n.blotName] = o), (e = new x.default().insert(r, n.formats(t))));
        } else 'function' == typeof n.formats && (e = l(e, n.blotName, n.formats(t)));
        return e;
      }
      function v(t, e) {
        return c(e, '\n') || e.insert('\n'), e;
      }
      function b() {
        return new x.default();
      }
      function g(t, e) {
        var n = P.default.query(t);
        if (null == n || 'list-item' !== n.blotName || !c(e, '\n')) return e;
        for (var r = -1, o = t.parentNode; !o.classList.contains('ql-clipboard'); )
          'list' === (P.default.query(o) || {}).blotName && (r += 1), (o = o.parentNode);
        return r <= 0 ? e : e.compose(new x.default().retain(e.length() - 1).retain(1, { indent: r }));
      }
      function m(t, e) {
        return c(e, '\n') || ((f(t) || (e.length() > 0 && t.nextSibling && f(t.nextSibling))) && e.insert('\n')), e;
      }
      function _(t, e) {
        var n = {},
          r = t.style || {};
        return (
          r.fontStyle && 'italic' === s(t).fontStyle && (n.italic = !0),
          r.fontWeight && (s(t).fontWeight.startsWith('bold') || parseInt(s(t).fontWeight) >= 700) && (n.bold = !0),
          Object.keys(n).length > 0 && (e = l(e, n)),
          parseFloat(r.textIndent || 0) > 0 && (e = new x.default().insert('\t').concat(e)),
          e
        );
      }
      function O(t, e) {
        var n = t.data;
        if ('O:P' === t.parentNode.tagName) return e.insert(n.trim());
        if (0 === n.trim().length && t.parentNode.classList.contains('ql-clipboard')) return e;
        if (!s(t.parentNode).whiteSpace.startsWith('pre')) {
          var r = function (t, e) {
            return (e = e.replace(/[^\u00a0]/g, '')), e.length < 1 && t ? ' ' : e;
          };
          (n = n.replace(/\r\n/g, ' ').replace(/\n/g, ' ')),
            (n = n.replace(/\s\s+/g, r.bind(r, !0))),
            ((null == t.previousSibling && f(t.parentNode)) || (null != t.previousSibling && f(t.previousSibling))) &&
              (n = n.replace(/^\s+/, r.bind(r, !1))),
            ((null == t.nextSibling && f(t.parentNode)) || (null != t.nextSibling && f(t.nextSibling))) &&
              (n = n.replace(/\s+$/, r.bind(r, !1)));
        }
        return e.insert(n);
      }
      Object.defineProperty(e, '__esModule', { value: !0 }),
        (e.matchText = e.matchNewline = e.matchBlot = e.matchAttributor = e.default = void 0);
      var w =
          'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
            ? function (t) {
                return typeof t;
              }
            : function (t) {
                return t && 'function' == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype
                  ? 'symbol'
                  : typeof t;
              },
        E = (function () {
          function t(t, e) {
            var n = [],
              r = !0,
              o = !1,
              i = void 0;
            try {
              for (
                var a, u = t[Symbol.iterator]();
                !(r = (a = u.next()).done) && (n.push(a.value), !e || n.length !== e);
                r = !0
              );
            } catch (t) {
              (o = !0), (i = t);
            } finally {
              try {
                !r && u.return && u.return();
              } finally {
                if (o) throw i;
              }
            }
            return n;
          }
          return function (e, n) {
            if (Array.isArray(e)) return e;
            if (Symbol.iterator in Object(e)) return t(e, n);
            throw new TypeError('Invalid attempt to destructure non-iterable instance');
          };
        })(),
        N = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        j = n(3),
        A = r(j),
        k = n(5),
        x = r(k),
        S = n(0),
        P = r(S),
        T = n(6),
        C = r(T),
        L = n(8),
        R = r(L),
        I = n(9),
        q = r(I),
        M = n(42),
        B = n(43),
        D = n(13),
        U = r(D),
        F = n(26),
        K = n(44),
        z = n(45),
        W = n(46),
        G = (0, R.default)('quill:clipboard'),
        H = '__ql-matcher',
        $ = [
          [Node.TEXT_NODE, O],
          [Node.TEXT_NODE, m],
          ['br', v],
          [Node.ELEMENT_NODE, m],
          [Node.ELEMENT_NODE, y],
          [Node.ELEMENT_NODE, h],
          [Node.ELEMENT_NODE, _],
          ['li', g],
          ['b', d.bind(d, 'bold')],
          ['i', d.bind(d, 'italic')],
          ['style', b]
        ],
        Y = [M.AlignAttribute, K.DirectionAttribute].reduce(function (t, e) {
          return (t[e.keyName] = e), t;
        }, {}),
        V = [M.AlignStyle, B.BackgroundStyle, F.ColorStyle, K.DirectionStyle, z.FontStyle, W.SizeStyle].reduce(
          function (t, e) {
            return (t[e.keyName] = e), t;
          },
          {}
        ),
        X = (function (t) {
          function e(t, n) {
            i(this, e);
            var r = a(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n));
            return (
              r.quill.root.addEventListener('paste', r.onPaste.bind(r)),
              (r.container = r.quill.addContainer('ql-clipboard')),
              r.container.setAttribute('contenteditable', !0),
              r.container.setAttribute('tabindex', -1),
              (r.matchers = []),
              $.concat(r.options.matchers).forEach(function (t) {
                var e = E(t, 2),
                  n = e[0],
                  o = e[1];
                r.addMatcher(n, o);
              }),
              r
            );
          }
          return (
            u(e, t),
            N(e, [
              {
                key: 'addMatcher',
                value: function (t, e) {
                  this.matchers.push([t, e]);
                }
              },
              {
                key: 'convert',
                value: function (t) {
                  if ('string' == typeof t)
                    return (this.container.innerHTML = t.replace(/\>\r?\n +\</g, '><')), this.convert();
                  var e = this.quill.getFormat(this.quill.selection.savedRange.index);
                  if (e[U.default.blotName]) {
                    var n = this.container.innerText;
                    return (
                      (this.container.innerHTML = ''),
                      new x.default().insert(n, o({}, U.default.blotName, e[U.default.blotName]))
                    );
                  }
                  var r = this.prepareMatching(),
                    i = E(r, 2),
                    a = i[0],
                    u = i[1],
                    l = p(this.container, a, u);
                  return (
                    c(l, '\n') &&
                      null == l.ops[l.ops.length - 1].attributes &&
                      (l = l.compose(new x.default().retain(l.length() - 1).delete(1))),
                    G.log('convert', this.container.innerHTML, l),
                    (this.container.innerHTML = ''),
                    l
                  );
                }
              },
              {
                key: 'dangerouslyPasteHTML',
                value: function (t, e) {
                  var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : C.default.sources.API;
                  if ('string' == typeof t)
                    this.quill.setContents(this.convert(t), e), this.quill.setSelection(0, C.default.sources.SILENT);
                  else {
                    var r = this.convert(e);
                    this.quill.updateContents(new x.default().retain(t).concat(r), n),
                      this.quill.setSelection(t + r.length(), C.default.sources.SILENT);
                  }
                }
              },
              {
                key: 'onPaste',
                value: function (t) {
                  var e = this;
                  if (!t.defaultPrevented && this.quill.isEnabled()) {
                    var n = this.quill.getSelection(),
                      r = new x.default().retain(n.index),
                      o = this.quill.scrollingContainer.scrollTop;
                    this.container.focus(),
                      this.quill.selection.update(C.default.sources.SILENT),
                      setTimeout(function () {
                        (r = r.concat(e.convert()).delete(n.length)),
                          e.quill.updateContents(r, C.default.sources.USER),
                          e.quill.setSelection(r.length() - n.length, C.default.sources.SILENT),
                          (e.quill.scrollingContainer.scrollTop = o),
                          e.quill.focus();
                      }, 1);
                  }
                }
              },
              {
                key: 'prepareMatching',
                value: function () {
                  var t = this,
                    e = [],
                    n = [];
                  return (
                    this.matchers.forEach(function (r) {
                      var o = E(r, 2),
                        i = o[0],
                        a = o[1];
                      switch (i) {
                        case Node.TEXT_NODE:
                          n.push(a);
                          break;
                        case Node.ELEMENT_NODE:
                          e.push(a);
                          break;
                        default:
                          [].forEach.call(t.container.querySelectorAll(i), function (t) {
                            (t[H] = t[H] || []), t[H].push(a);
                          });
                      }
                    }),
                    [e, n]
                  );
                }
              }
            ]),
            e
          );
        })(q.default);
      (X.DEFAULTS = { matchers: [], matchVisual: !1 }),
        (e.default = X),
        (e.matchAttributor = h),
        (e.matchBlot = y),
        (e.matchNewline = m),
        (e.matchText = O);
    },
    function (t, e, n) {
      'use strict';
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function o(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function i(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function a(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      function u(t) {
        var e = t.ops[t.ops.length - 1];
        return (
          null != e &&
          (null != e.insert
            ? 'string' == typeof e.insert && e.insert.endsWith('\n')
            : null != e.attributes &&
              Object.keys(e.attributes).some(function (t) {
                return null != f.default.query(t, f.default.Scope.BLOCK);
              }))
        );
      }
      function l(t) {
        var e = t.reduce(function (t, e) {
            return (t += e.delete || 0);
          }, 0),
          n = t.length() - e;
        return u(t) && (n -= 1), n;
      }
      Object.defineProperty(e, '__esModule', { value: !0 }), (e.getLastChangeIndex = e.default = void 0);
      var s = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        c = n(0),
        f = r(c),
        p = n(6),
        d = r(p),
        h = n(9),
        y = r(h),
        v = (function (t) {
          function e(t, n) {
            o(this, e);
            var r = i(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n));
            return (
              (r.lastRecorded = 0),
              (r.ignoreChange = !1),
              r.clear(),
              r.quill.on(d.default.events.EDITOR_CHANGE, function (t, e, n, o) {
                t !== d.default.events.TEXT_CHANGE ||
                  r.ignoreChange ||
                  (r.options.userOnly && o !== d.default.sources.USER ? r.transform(e) : r.record(e, n));
              }),
              r.quill.keyboard.addBinding({ key: 'Z', shortKey: !0 }, r.undo.bind(r)),
              r.quill.keyboard.addBinding({ key: 'Z', shortKey: !0, shiftKey: !0 }, r.redo.bind(r)),
              /Win/i.test(navigator.platform) &&
                r.quill.keyboard.addBinding({ key: 'Y', shortKey: !0 }, r.redo.bind(r)),
              r
            );
          }
          return (
            a(e, t),
            s(e, [
              {
                key: 'change',
                value: function (t, e) {
                  if (0 !== this.stack[t].length) {
                    var n = this.stack[t].pop();
                    this.stack[e].push(n),
                      (this.lastRecorded = 0),
                      (this.ignoreChange = !0),
                      this.quill.updateContents(n[t], d.default.sources.USER),
                      (this.ignoreChange = !1);
                    var r = l(n[t]);
                    this.quill.setSelection(r);
                  }
                }
              },
              {
                key: 'clear',
                value: function () {
                  this.stack = { undo: [], redo: [] };
                }
              },
              {
                key: 'cutoff',
                value: function () {
                  this.lastRecorded = 0;
                }
              },
              {
                key: 'record',
                value: function (t, e) {
                  if (0 !== t.ops.length) {
                    this.stack.redo = [];
                    var n = this.quill.getContents().diff(e),
                      r = Date.now();
                    if (this.lastRecorded + this.options.delay > r && this.stack.undo.length > 0) {
                      var o = this.stack.undo.pop();
                      (n = n.compose(o.undo)), (t = o.redo.compose(t));
                    } else this.lastRecorded = r;
                    this.stack.undo.push({ redo: t, undo: n }),
                      this.stack.undo.length > this.options.maxStack && this.stack.undo.shift();
                  }
                }
              },
              {
                key: 'redo',
                value: function () {
                  this.change('redo', 'undo');
                }
              },
              {
                key: 'transform',
                value: function (t) {
                  this.stack.undo.forEach(function (e) {
                    (e.undo = t.transform(e.undo, !0)), (e.redo = t.transform(e.redo, !0));
                  }),
                    this.stack.redo.forEach(function (e) {
                      (e.undo = t.transform(e.undo, !0)), (e.redo = t.transform(e.redo, !0));
                    });
                }
              },
              {
                key: 'undo',
                value: function () {
                  this.change('undo', 'redo');
                }
              }
            ]),
            e
          );
        })(y.default);
      (v.DEFAULTS = { delay: 1e3, maxStack: 100, userOnly: !1 }), (e.default = v), (e.getLastChangeIndex = l);
    },
    function (t, e, n) {
      'use strict';
      function r(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function o(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function i(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      Object.defineProperty(e, '__esModule', { value: !0 }), (e.IndentClass = void 0);
      var a = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        u = function t(e, n, r) {
          null === e && (e = Function.prototype);
          var o = Object.getOwnPropertyDescriptor(e, n);
          if (void 0 === o) {
            var i = Object.getPrototypeOf(e);
            return null === i ? void 0 : t(i, n, r);
          }
          if ('value' in o) return o.value;
          var a = o.get;
          if (void 0 !== a) return a.call(r);
        },
        l = n(0),
        s = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(l),
        c = (function (t) {
          function e() {
            return r(this, e), o(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments));
          }
          return (
            i(e, t),
            a(e, [
              {
                key: 'add',
                value: function (t, n) {
                  if ('+1' === n || '-1' === n) {
                    var r = this.value(t) || 0;
                    n = '+1' === n ? r + 1 : r - 1;
                  }
                  return 0 === n
                    ? (this.remove(t), !0)
                    : u(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'add', this).call(this, t, n);
                }
              },
              {
                key: 'canAdd',
                value: function (t, n) {
                  return (
                    u(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'canAdd', this).call(this, t, n) ||
                    u(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'canAdd', this).call(
                      this,
                      t,
                      parseInt(n)
                    )
                  );
                }
              },
              {
                key: 'value',
                value: function (t) {
                  return (
                    parseInt(
                      u(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'value', this).call(this, t)
                    ) || void 0
                  );
                }
              }
            ]),
            e
          );
        })(s.default.Attributor.Class),
        f = new c('indent', 'ql-indent', { scope: s.default.Scope.BLOCK, whitelist: [1, 2, 3, 4, 5, 6, 7, 8] });
      e.IndentClass = f;
    },
    function (t, e, n) {
      'use strict';
      function r(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function o(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function i(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      var a = n(2),
        u = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(a),
        l = (function (t) {
          function e() {
            return r(this, e), o(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments));
          }
          return i(e, t), e;
        })(u.default);
      (l.blotName = 'blockquote'), (l.tagName = 'blockquote'), (e.default = l);
    },
    function (t, e, n) {
      'use strict';
      function r(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function o(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function i(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      var a = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        u = n(2),
        l = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(u),
        s = (function (t) {
          function e() {
            return r(this, e), o(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments));
          }
          return (
            i(e, t),
            a(e, null, [
              {
                key: 'formats',
                value: function (t) {
                  return this.tagName.indexOf(t.tagName) + 1;
                }
              }
            ]),
            e
          );
        })(l.default);
      (s.blotName = 'header'), (s.tagName = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']), (e.default = s);
    },
    function (t, e, n) {
      'use strict';
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function o(t, e, n) {
        return (
          e in t
            ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 })
            : (t[e] = n),
          t
        );
      }
      function i(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function a(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function u(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      Object.defineProperty(e, '__esModule', { value: !0 }), (e.default = e.ListItem = void 0);
      var l = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        s = function t(e, n, r) {
          null === e && (e = Function.prototype);
          var o = Object.getOwnPropertyDescriptor(e, n);
          if (void 0 === o) {
            var i = Object.getPrototypeOf(e);
            return null === i ? void 0 : t(i, n, r);
          }
          if ('value' in o) return o.value;
          var a = o.get;
          if (void 0 !== a) return a.call(r);
        },
        c = n(0),
        f = r(c),
        p = n(2),
        d = r(p),
        h = n(25),
        y = r(h),
        v = (function (t) {
          function e() {
            return i(this, e), a(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments));
          }
          return (
            u(e, t),
            l(
              e,
              [
                {
                  key: 'format',
                  value: function (t, n) {
                    t !== b.blotName || n
                      ? s(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'format', this).call(this, t, n)
                      : this.replaceWith(f.default.create(this.statics.scope));
                  }
                },
                {
                  key: 'remove',
                  value: function () {
                    null == this.prev && null == this.next
                      ? this.parent.remove()
                      : s(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'remove', this).call(this);
                  }
                },
                {
                  key: 'replaceWith',
                  value: function (t, n) {
                    return (
                      this.parent.isolate(this.offset(this.parent), this.length()),
                      t === this.parent.statics.blotName
                        ? (this.parent.replaceWith(t, n), this)
                        : (this.parent.unwrap(),
                          s(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'replaceWith', this).call(
                            this,
                            t,
                            n
                          ))
                    );
                  }
                }
              ],
              [
                {
                  key: 'formats',
                  value: function (t) {
                    return t.tagName === this.tagName
                      ? void 0
                      : s(e.__proto__ || Object.getPrototypeOf(e), 'formats', this).call(this, t);
                  }
                }
              ]
            ),
            e
          );
        })(d.default);
      (v.blotName = 'list-item'), (v.tagName = 'LI');
      var b = (function (t) {
        function e(t) {
          i(this, e);
          var n = a(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t)),
            r = function (e) {
              if (e.target.parentNode === t) {
                var r = n.statics.formats(t),
                  o = f.default.find(e.target);
                'checked' === r ? o.format('list', 'unchecked') : 'unchecked' === r && o.format('list', 'checked');
              }
            };
          return t.addEventListener('touchstart', r), t.addEventListener('mousedown', r), n;
        }
        return (
          u(e, t),
          l(e, null, [
            {
              key: 'create',
              value: function (t) {
                var n = 'ordered' === t ? 'OL' : 'UL',
                  r = s(e.__proto__ || Object.getPrototypeOf(e), 'create', this).call(this, n);
                return ('checked' !== t && 'unchecked' !== t) || r.setAttribute('data-checked', 'checked' === t), r;
              }
            },
            {
              key: 'formats',
              value: function (t) {
                return 'OL' === t.tagName
                  ? 'ordered'
                  : 'UL' === t.tagName
                  ? t.hasAttribute('data-checked')
                    ? 'true' === t.getAttribute('data-checked')
                      ? 'checked'
                      : 'unchecked'
                    : 'bullet'
                  : void 0;
              }
            }
          ]),
          l(e, [
            {
              key: 'format',
              value: function (t, e) {
                this.children.length > 0 && this.children.tail.format(t, e);
              }
            },
            {
              key: 'formats',
              value: function () {
                return o({}, this.statics.blotName, this.statics.formats(this.domNode));
              }
            },
            {
              key: 'insertBefore',
              value: function (t, n) {
                if (t instanceof v)
                  s(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'insertBefore', this).call(this, t, n);
                else {
                  var r = null == n ? this.length() : n.offset(this),
                    o = this.split(r);
                  o.parent.insertBefore(t, o);
                }
              }
            },
            {
              key: 'optimize',
              value: function (t) {
                s(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'optimize', this).call(this, t);
                var n = this.next;
                null != n &&
                  n.prev === this &&
                  n.statics.blotName === this.statics.blotName &&
                  n.domNode.tagName === this.domNode.tagName &&
                  n.domNode.getAttribute('data-checked') === this.domNode.getAttribute('data-checked') &&
                  (n.moveChildren(this), n.remove());
              }
            },
            {
              key: 'replace',
              value: function (t) {
                if (t.statics.blotName !== this.statics.blotName) {
                  var n = f.default.create(this.statics.defaultChild);
                  t.moveChildren(n), this.appendChild(n);
                }
                s(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'replace', this).call(this, t);
              }
            }
          ]),
          e
        );
      })(y.default);
      (b.blotName = 'list'),
        (b.scope = f.default.Scope.BLOCK_BLOT),
        (b.tagName = ['OL', 'UL']),
        (b.defaultChild = 'list-item'),
        (b.allowedChildren = [v]),
        (e.ListItem = v),
        (e.default = b);
    },
    function (t, e, n) {
      'use strict';
      function r(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function o(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function i(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      var a = n(48),
        u = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(a),
        l = (function (t) {
          function e() {
            return r(this, e), o(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments));
          }
          return i(e, t), e;
        })(u.default);
      (l.blotName = 'italic'), (l.tagName = ['EM', 'I']), (e.default = l);
    },
    function (t, e, n) {
      'use strict';
      function r(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function o(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function i(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      var a = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        u = function t(e, n, r) {
          null === e && (e = Function.prototype);
          var o = Object.getOwnPropertyDescriptor(e, n);
          if (void 0 === o) {
            var i = Object.getPrototypeOf(e);
            return null === i ? void 0 : t(i, n, r);
          }
          if ('value' in o) return o.value;
          var a = o.get;
          if (void 0 !== a) return a.call(r);
        },
        l = n(4),
        s = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(l),
        c = (function (t) {
          function e() {
            return r(this, e), o(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments));
          }
          return (
            i(e, t),
            a(e, null, [
              {
                key: 'create',
                value: function (t) {
                  return 'super' === t
                    ? document.createElement('sup')
                    : 'sub' === t
                    ? document.createElement('sub')
                    : u(e.__proto__ || Object.getPrototypeOf(e), 'create', this).call(this, t);
                }
              },
              {
                key: 'formats',
                value: function (t) {
                  return 'SUB' === t.tagName ? 'sub' : 'SUP' === t.tagName ? 'super' : void 0;
                }
              }
            ]),
            e
          );
        })(s.default);
      (c.blotName = 'script'), (c.tagName = ['SUB', 'SUP']), (e.default = c);
    },
    function (t, e, n) {
      'use strict';
      function r(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function o(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function i(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      var a = n(4),
        u = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(a),
        l = (function (t) {
          function e() {
            return r(this, e), o(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments));
          }
          return i(e, t), e;
        })(u.default);
      (l.blotName = 'strike'), (l.tagName = 'S'), (e.default = l);
    },
    function (t, e, n) {
      'use strict';
      function r(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function o(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function i(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      var a = n(4),
        u = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(a),
        l = (function (t) {
          function e() {
            return r(this, e), o(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments));
          }
          return i(e, t), e;
        })(u.default);
      (l.blotName = 'underline'), (l.tagName = 'U'), (e.default = l);
    },
    function (t, e, n) {
      'use strict';
      function r(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function o(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function i(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      var a = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        u = function t(e, n, r) {
          null === e && (e = Function.prototype);
          var o = Object.getOwnPropertyDescriptor(e, n);
          if (void 0 === o) {
            var i = Object.getPrototypeOf(e);
            return null === i ? void 0 : t(i, n, r);
          }
          if ('value' in o) return o.value;
          var a = o.get;
          if (void 0 !== a) return a.call(r);
        },
        l = n(0),
        s = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(l),
        c = n(16),
        f = ['alt', 'height', 'width'],
        p = (function (t) {
          function e() {
            return r(this, e), o(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments));
          }
          return (
            i(e, t),
            a(
              e,
              [
                {
                  key: 'format',
                  value: function (t, n) {
                    f.indexOf(t) > -1
                      ? n
                        ? this.domNode.setAttribute(t, n)
                        : this.domNode.removeAttribute(t)
                      : u(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'format', this).call(this, t, n);
                  }
                }
              ],
              [
                {
                  key: 'create',
                  value: function (t) {
                    var n = u(e.__proto__ || Object.getPrototypeOf(e), 'create', this).call(this, t);
                    return 'string' == typeof t && n.setAttribute('src', this.sanitize(t)), n;
                  }
                },
                {
                  key: 'formats',
                  value: function (t) {
                    return f.reduce(function (e, n) {
                      return t.hasAttribute(n) && (e[n] = t.getAttribute(n)), e;
                    }, {});
                  }
                },
                {
                  key: 'match',
                  value: function (t) {
                    return /\.(jpe?g|gif|png)$/.test(t) || /^data:image\/.+;base64/.test(t);
                  }
                },
                {
                  key: 'sanitize',
                  value: function (t) {
                    return (0, c.sanitize)(t, ['http', 'https', 'data']) ? t : '//:0';
                  }
                },
                {
                  key: 'value',
                  value: function (t) {
                    return t.getAttribute('src');
                  }
                }
              ]
            ),
            e
          );
        })(s.default.Embed);
      (p.blotName = 'image'), (p.tagName = 'IMG'), (e.default = p);
    },
    function (t, e, n) {
      'use strict';
      function r(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function o(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function i(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      var a = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        u = function t(e, n, r) {
          null === e && (e = Function.prototype);
          var o = Object.getOwnPropertyDescriptor(e, n);
          if (void 0 === o) {
            var i = Object.getPrototypeOf(e);
            return null === i ? void 0 : t(i, n, r);
          }
          if ('value' in o) return o.value;
          var a = o.get;
          if (void 0 !== a) return a.call(r);
        },
        l = n(2),
        s = n(16),
        c = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(s),
        f = ['height', 'width'],
        p = (function (t) {
          function e() {
            return r(this, e), o(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments));
          }
          return (
            i(e, t),
            a(
              e,
              [
                {
                  key: 'format',
                  value: function (t, n) {
                    f.indexOf(t) > -1
                      ? n
                        ? this.domNode.setAttribute(t, n)
                        : this.domNode.removeAttribute(t)
                      : u(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'format', this).call(this, t, n);
                  }
                }
              ],
              [
                {
                  key: 'create',
                  value: function (t) {
                    var n = u(e.__proto__ || Object.getPrototypeOf(e), 'create', this).call(this, t);
                    return (
                      n.setAttribute('frameborder', '0'),
                      n.setAttribute('allowfullscreen', !0),
                      n.setAttribute('src', this.sanitize(t)),
                      n
                    );
                  }
                },
                {
                  key: 'formats',
                  value: function (t) {
                    return f.reduce(function (e, n) {
                      return t.hasAttribute(n) && (e[n] = t.getAttribute(n)), e;
                    }, {});
                  }
                },
                {
                  key: 'sanitize',
                  value: function (t) {
                    return c.default.sanitize(t);
                  }
                },
                {
                  key: 'value',
                  value: function (t) {
                    return t.getAttribute('src');
                  }
                }
              ]
            ),
            e
          );
        })(l.BlockEmbed);
      (p.blotName = 'video'), (p.className = 'ql-video'), (p.tagName = 'IFRAME'), (e.default = p);
    },
    function (t, e, n) {
      'use strict';
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function o(t, e, n) {
        return (
          e in t
            ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 })
            : (t[e] = n),
          t
        );
      }
      function i(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      function a(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
      }
      function u(t, e) {
        if ('function' != typeof e && null !== e)
          throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 }
        })),
          e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
      }
      function l(t, e, n) {
        var r = document.createElement('button');
        r.setAttribute('type', 'button'), r.classList.add('ql-' + e), null != n && (r.value = n), t.appendChild(r);
      }
      function s(t, e) {
        Array.isArray(e[0]) || (e = [e]),
          e.forEach(function (e) {
            var n = document.createElement('span');
            n.classList.add('ql-formats'),
              e.forEach(function (t) {
                if ('string' == typeof t) l(n, t);
                else {
                  var e = Object.keys(t)[0],
                    r = t[e];
                  Array.isArray(r) ? c(n, e, r) : l(n, e, r);
                }
              }),
              t.appendChild(n);
          });
      }
      function c(t, e, n) {
        var r = document.createElement('select');
        r.classList.add('ql-' + e),
          n.forEach(function (t) {
            var e = document.createElement('option');
            !1 !== t ? e.setAttribute('value', t) : e.setAttribute('selected', 'selected'), r.appendChild(e);
          }),
          t.appendChild(r);
      }
      Object.defineProperty(e, '__esModule', { value: !0 }), (e.addControls = e.default = void 0);
      var f = (function () {
          function t(t, e) {
            var n = [],
              r = !0,
              o = !1,
              i = void 0;
            try {
              for (
                var a, u = t[Symbol.iterator]();
                !(r = (a = u.next()).done) && (n.push(a.value), !e || n.length !== e);
                r = !0
              );
            } catch (t) {
              (o = !0), (i = t);
            } finally {
              try {
                !r && u.return && u.return();
              } finally {
                if (o) throw i;
              }
            }
            return n;
          }
          return function (e, n) {
            if (Array.isArray(e)) return e;
            if (Symbol.iterator in Object(e)) return t(e, n);
            throw new TypeError('Invalid attempt to destructure non-iterable instance');
          };
        })(),
        p = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        d = n(5),
        h = r(d),
        y = n(0),
        v = r(y),
        b = n(6),
        g = r(b),
        m = n(8),
        _ = r(m),
        O = n(9),
        w = r(O),
        E = 'getRootNode' in document,
        N = (0, _.default)('quill:toolbar'),
        j = (function (t) {
          function e(t, n) {
            i(this, e);
            var r = a(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n));
            if (Array.isArray(r.options.container)) {
              var o = document.createElement('div');
              s(o, r.options.container), t.container.parentNode.insertBefore(o, t.container), (r.container = o);
            } else if ('string' == typeof r.options.container) {
              var u = E ? t.container.getRootNode() : document;
              r.container = u.querySelector(r.options.container);
            } else r.container = r.options.container;
            if (!(r.container instanceof HTMLElement)) {
              var l;
              return (l = N.error('Container required for toolbar', r.options)), a(r, l);
            }
            return (
              r.container.classList.add('ql-toolbar'),
              (r.controls = []),
              (r.handlers = {}),
              Object.keys(r.options.handlers).forEach(function (t) {
                r.addHandler(t, r.options.handlers[t]);
              }),
              [].forEach.call(r.container.querySelectorAll('button, select'), function (t) {
                r.attach(t);
              }),
              r.quill.on(g.default.events.EDITOR_CHANGE, function (t, e) {
                t === g.default.events.SELECTION_CHANGE && r.update(e);
              }),
              r.quill.on(g.default.events.SCROLL_OPTIMIZE, function () {
                var t = r.quill.selection.getRange(),
                  e = f(t, 1),
                  n = e[0];
                r.update(n);
              }),
              r
            );
          }
          return (
            u(e, t),
            p(e, [
              {
                key: 'addHandler',
                value: function (t, e) {
                  this.handlers[t] = e;
                }
              },
              {
                key: 'attach',
                value: function (t) {
                  var e = this,
                    n = [].find.call(t.classList, function (t) {
                      return 0 === t.indexOf('ql-');
                    });
                  if (n) {
                    if (
                      ((n = n.slice('ql-'.length)),
                      'BUTTON' === t.tagName && t.setAttribute('type', 'button'),
                      null == this.handlers[n])
                    ) {
                      if (null != this.quill.scroll.whitelist && null == this.quill.scroll.whitelist[n])
                        return void N.warn('ignoring attaching to disabled format', n, t);
                      if (null == v.default.query(n))
                        return void N.warn('ignoring attaching to nonexistent format', n, t);
                    }
                    var r = 'SELECT' === t.tagName ? 'change' : 'click';
                    t.addEventListener(r, function (r) {
                      var i = void 0;
                      if ('SELECT' === t.tagName) {
                        if (t.selectedIndex < 0) return;
                        var a = t.options[t.selectedIndex];
                        i = !a.hasAttribute('selected') && (a.value || !1);
                      } else (i = !t.classList.contains('ql-active') && (t.value || !t.hasAttribute('value'))), r.preventDefault();
                      e.quill.focus();
                      var u = e.quill.selection.getRange(),
                        l = f(u, 1),
                        s = l[0];
                      if (null != e.handlers[n]) e.handlers[n].call(e, i);
                      else if (v.default.query(n).prototype instanceof v.default.Embed) {
                        if (!(i = prompt('Enter ' + n))) return;
                        e.quill.updateContents(
                          new h.default().retain(s.index).delete(s.length).insert(o({}, n, i)),
                          g.default.sources.USER
                        );
                      } else e.quill.format(n, i, g.default.sources.USER);
                      e.update(s);
                    }),
                      this.controls.push([n, t]);
                  }
                }
              },
              {
                key: 'update',
                value: function (t) {
                  var e = null == t ? {} : this.quill.getFormat(t);
                  this.controls.forEach(function (n) {
                    var r = f(n, 2),
                      o = r[0],
                      i = r[1];
                    if ('SELECT' === i.tagName) {
                      var a = void 0;
                      if (null == t) a = null;
                      else if (null == e[o]) a = i.querySelector('option[selected]');
                      else if (!Array.isArray(e[o])) {
                        var u = e[o];
                        'string' == typeof u && (u = u.replace(/\"/g, '\\"')),
                          (a = i.querySelector('option[value="' + u + '"]'));
                      }
                      null == a ? ((i.value = ''), (i.selectedIndex = -1)) : (a.selected = !0);
                    } else if (null == t) i.classList.remove('ql-active');
                    else if (i.hasAttribute('value')) {
                      var l =
                        e[o] === i.getAttribute('value') ||
                        (null != e[o] && e[o].toString() === i.getAttribute('value')) ||
                        (null == e[o] && !i.getAttribute('value'));
                      i.classList.toggle('ql-active', l);
                    } else i.classList.toggle('ql-active', null != e[o]);
                  });
                }
              }
            ]),
            e
          );
        })(w.default);
      (j.DEFAULTS = {}),
        (j.DEFAULTS = {
          container: null,
          handlers: {
            clean: function () {
              var t = this,
                e = this.quill.getSelection();
              if (null != e)
                if (0 == e.length) {
                  var n = this.quill.getFormat();
                  Object.keys(n).forEach(function (e) {
                    null != v.default.query(e, v.default.Scope.INLINE) && t.quill.format(e, !1);
                  });
                } else this.quill.removeFormat(e, g.default.sources.USER);
            },
            direction: function (t) {
              var e = this.quill.getFormat().align;
              'rtl' === t && null == e
                ? this.quill.format('align', 'right', g.default.sources.USER)
                : t || 'right' !== e || this.quill.format('align', !1, g.default.sources.USER),
                this.quill.format('direction', t, g.default.sources.USER);
            },
            indent: function (t) {
              var e = this.quill.getSelection(),
                n = this.quill.getFormat(e),
                r = parseInt(n.indent || 0);
              if ('+1' === t || '-1' === t) {
                var o = '+1' === t ? 1 : -1;
                'rtl' === n.direction && (o *= -1), this.quill.format('indent', r + o, g.default.sources.USER);
              }
            },
            link: function (t) {
              !0 === t && (t = prompt('Enter link URL:')), this.quill.format('link', t, g.default.sources.USER);
            },
            list: function (t) {
              var e = this.quill.getSelection(),
                n = this.quill.getFormat(e);
              'check' === t
                ? 'checked' === n.list || 'unchecked' === n.list
                  ? this.quill.format('list', !1, g.default.sources.USER)
                  : this.quill.format('list', 'unchecked', g.default.sources.USER)
                : this.quill.format('list', t, g.default.sources.USER);
            }
          }
        }),
        (e.default = j),
        (e.addControls = s);
    },
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    function (t, e, n) {
      'use strict';
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      var o = n(52),
        i = r(o),
        a = n(42),
        u = n(44),
        l = n(78),
        s = n(79),
        c = r(s),
        f = n(80),
        p = r(f),
        d = n(81),
        h = r(d),
        y = n(43),
        v = n(26),
        b = n(45),
        g = n(46),
        m = n(48),
        _ = r(m),
        O = n(82),
        w = r(O),
        E = n(16),
        N = r(E),
        j = n(83),
        A = r(j),
        k = n(84),
        x = r(k),
        S = n(85),
        P = r(S),
        T = n(86),
        C = r(T),
        L = n(87),
        R = r(L),
        I = n(13),
        q = r(I),
        M = n(88),
        B = r(M);
      i.default.register(
        {
          'attributors/attribute/direction': u.DirectionAttribute,
          'attributors/class/align': a.AlignClass,
          'attributors/class/background': y.BackgroundClass,
          'attributors/class/color': v.ColorClass,
          'attributors/class/direction': u.DirectionClass,
          'attributors/class/font': b.FontClass,
          'attributors/class/size': g.SizeClass,
          'attributors/style/align': a.AlignStyle,
          'attributors/style/background': y.BackgroundStyle,
          'attributors/style/color': v.ColorStyle,
          'attributors/style/direction': u.DirectionStyle,
          'attributors/style/font': b.FontStyle,
          'attributors/style/size': g.SizeStyle
        },
        !0
      ),
        i.default.register(
          {
            'formats/align': a.AlignClass,
            'formats/direction': u.DirectionClass,
            'formats/indent': l.IndentClass,
            'formats/background': y.BackgroundStyle,
            'formats/color': v.ColorStyle,
            'formats/font': b.FontClass,
            'formats/size': g.SizeClass,
            'formats/blockquote': c.default,
            'formats/code-block': q.default,
            'formats/header': p.default,
            'formats/list': h.default,
            'formats/bold': _.default,
            'formats/code': I.Code,
            'formats/italic': w.default,
            'formats/link': N.default,
            'formats/script': A.default,
            'formats/strike': x.default,
            'formats/underline': P.default,
            'formats/image': C.default,
            'formats/video': R.default,
            'formats/list/item': d.ListItem,
            'modules/toolbar': B.default
          },
          !0
        ),
        (e.default = i.default);
    }
  ]).default;
});
//# sourceMappingURL=vaadin-quill.min.js.map
