(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/events/events.js
  var require_events = __commonJS({
    "node_modules/events/events.js"(exports, module) {
      "use strict";
      var R = typeof Reflect === "object" ? Reflect : null;
      var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
        return Function.prototype.apply.call(target, receiver, args);
      };
      var ReflectOwnKeys;
      if (R && typeof R.ownKeys === "function") {
        ReflectOwnKeys = R.ownKeys;
      } else if (Object.getOwnPropertySymbols) {
        ReflectOwnKeys = function ReflectOwnKeys2(target) {
          return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
        };
      } else {
        ReflectOwnKeys = function ReflectOwnKeys2(target) {
          return Object.getOwnPropertyNames(target);
        };
      }
      function ProcessEmitWarning(warning) {
        if (console && console.warn) console.warn(warning);
      }
      var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
        return value !== value;
      };
      function EventEmitter2() {
        EventEmitter2.init.call(this);
      }
      module.exports = EventEmitter2;
      module.exports.once = once;
      EventEmitter2.EventEmitter = EventEmitter2;
      EventEmitter2.prototype._events = void 0;
      EventEmitter2.prototype._eventsCount = 0;
      EventEmitter2.prototype._maxListeners = void 0;
      var defaultMaxListeners = 10;
      function checkListener(listener) {
        if (typeof listener !== "function") {
          throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
        }
      }
      Object.defineProperty(EventEmitter2, "defaultMaxListeners", {
        enumerable: true,
        get: function() {
          return defaultMaxListeners;
        },
        set: function(arg) {
          if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
            throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
          }
          defaultMaxListeners = arg;
        }
      });
      EventEmitter2.init = function() {
        if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
        }
        this._maxListeners = this._maxListeners || void 0;
      };
      EventEmitter2.prototype.setMaxListeners = function setMaxListeners(n) {
        if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
          throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
        }
        this._maxListeners = n;
        return this;
      };
      function _getMaxListeners(that) {
        if (that._maxListeners === void 0)
          return EventEmitter2.defaultMaxListeners;
        return that._maxListeners;
      }
      EventEmitter2.prototype.getMaxListeners = function getMaxListeners() {
        return _getMaxListeners(this);
      };
      EventEmitter2.prototype.emit = function emit(type2) {
        var args = [];
        for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
        var doError = type2 === "error";
        var events = this._events;
        if (events !== void 0)
          doError = doError && events.error === void 0;
        else if (!doError)
          return false;
        if (doError) {
          var er;
          if (args.length > 0)
            er = args[0];
          if (er instanceof Error) {
            throw er;
          }
          var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
          err.context = er;
          throw err;
        }
        var handler = events[type2];
        if (handler === void 0)
          return false;
        if (typeof handler === "function") {
          ReflectApply(handler, this, args);
        } else {
          var len = handler.length;
          var listeners = arrayClone(handler, len);
          for (var i = 0; i < len; ++i)
            ReflectApply(listeners[i], this, args);
        }
        return true;
      };
      function _addListener(target, type2, listener, prepend) {
        var m2;
        var events;
        var existing;
        checkListener(listener);
        events = target._events;
        if (events === void 0) {
          events = target._events = /* @__PURE__ */ Object.create(null);
          target._eventsCount = 0;
        } else {
          if (events.newListener !== void 0) {
            target.emit(
              "newListener",
              type2,
              listener.listener ? listener.listener : listener
            );
            events = target._events;
          }
          existing = events[type2];
        }
        if (existing === void 0) {
          existing = events[type2] = listener;
          ++target._eventsCount;
        } else {
          if (typeof existing === "function") {
            existing = events[type2] = prepend ? [listener, existing] : [existing, listener];
          } else if (prepend) {
            existing.unshift(listener);
          } else {
            existing.push(listener);
          }
          m2 = _getMaxListeners(target);
          if (m2 > 0 && existing.length > m2 && !existing.warned) {
            existing.warned = true;
            var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type2) + " listeners added. Use emitter.setMaxListeners() to increase limit");
            w.name = "MaxListenersExceededWarning";
            w.emitter = target;
            w.type = type2;
            w.count = existing.length;
            ProcessEmitWarning(w);
          }
        }
        return target;
      }
      EventEmitter2.prototype.addListener = function addListener(type2, listener) {
        return _addListener(this, type2, listener, false);
      };
      EventEmitter2.prototype.on = EventEmitter2.prototype.addListener;
      EventEmitter2.prototype.prependListener = function prependListener(type2, listener) {
        return _addListener(this, type2, listener, true);
      };
      function onceWrapper() {
        if (!this.fired) {
          this.target.removeListener(this.type, this.wrapFn);
          this.fired = true;
          if (arguments.length === 0)
            return this.listener.call(this.target);
          return this.listener.apply(this.target, arguments);
        }
      }
      function _onceWrap(target, type2, listener) {
        var state = { fired: false, wrapFn: void 0, target, type: type2, listener };
        var wrapped = onceWrapper.bind(state);
        wrapped.listener = listener;
        state.wrapFn = wrapped;
        return wrapped;
      }
      EventEmitter2.prototype.once = function once2(type2, listener) {
        checkListener(listener);
        this.on(type2, _onceWrap(this, type2, listener));
        return this;
      };
      EventEmitter2.prototype.prependOnceListener = function prependOnceListener(type2, listener) {
        checkListener(listener);
        this.prependListener(type2, _onceWrap(this, type2, listener));
        return this;
      };
      EventEmitter2.prototype.removeListener = function removeListener(type2, listener) {
        var list, events, position, i, originalListener;
        checkListener(listener);
        events = this._events;
        if (events === void 0)
          return this;
        list = events[type2];
        if (list === void 0)
          return this;
        if (list === listener || list.listener === listener) {
          if (--this._eventsCount === 0)
            this._events = /* @__PURE__ */ Object.create(null);
          else {
            delete events[type2];
            if (events.removeListener)
              this.emit("removeListener", type2, list.listener || listener);
          }
        } else if (typeof list !== "function") {
          position = -1;
          for (i = list.length - 1; i >= 0; i--) {
            if (list[i] === listener || list[i].listener === listener) {
              originalListener = list[i].listener;
              position = i;
              break;
            }
          }
          if (position < 0)
            return this;
          if (position === 0)
            list.shift();
          else {
            spliceOne(list, position);
          }
          if (list.length === 1)
            events[type2] = list[0];
          if (events.removeListener !== void 0)
            this.emit("removeListener", type2, originalListener || listener);
        }
        return this;
      };
      EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
      EventEmitter2.prototype.removeAllListeners = function removeAllListeners(type2) {
        var listeners, events, i;
        events = this._events;
        if (events === void 0)
          return this;
        if (events.removeListener === void 0) {
          if (arguments.length === 0) {
            this._events = /* @__PURE__ */ Object.create(null);
            this._eventsCount = 0;
          } else if (events[type2] !== void 0) {
            if (--this._eventsCount === 0)
              this._events = /* @__PURE__ */ Object.create(null);
            else
              delete events[type2];
          }
          return this;
        }
        if (arguments.length === 0) {
          var keys = Object.keys(events);
          var key;
          for (i = 0; i < keys.length; ++i) {
            key = keys[i];
            if (key === "removeListener") continue;
            this.removeAllListeners(key);
          }
          this.removeAllListeners("removeListener");
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
          return this;
        }
        listeners = events[type2];
        if (typeof listeners === "function") {
          this.removeListener(type2, listeners);
        } else if (listeners !== void 0) {
          for (i = listeners.length - 1; i >= 0; i--) {
            this.removeListener(type2, listeners[i]);
          }
        }
        return this;
      };
      function _listeners(target, type2, unwrap) {
        var events = target._events;
        if (events === void 0)
          return [];
        var evlistener = events[type2];
        if (evlistener === void 0)
          return [];
        if (typeof evlistener === "function")
          return unwrap ? [evlistener.listener || evlistener] : [evlistener];
        return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
      }
      EventEmitter2.prototype.listeners = function listeners(type2) {
        return _listeners(this, type2, true);
      };
      EventEmitter2.prototype.rawListeners = function rawListeners(type2) {
        return _listeners(this, type2, false);
      };
      EventEmitter2.listenerCount = function(emitter, type2) {
        if (typeof emitter.listenerCount === "function") {
          return emitter.listenerCount(type2);
        } else {
          return listenerCount.call(emitter, type2);
        }
      };
      EventEmitter2.prototype.listenerCount = listenerCount;
      function listenerCount(type2) {
        var events = this._events;
        if (events !== void 0) {
          var evlistener = events[type2];
          if (typeof evlistener === "function") {
            return 1;
          } else if (evlistener !== void 0) {
            return evlistener.length;
          }
        }
        return 0;
      }
      EventEmitter2.prototype.eventNames = function eventNames() {
        return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
      };
      function arrayClone(arr, n) {
        var copy = new Array(n);
        for (var i = 0; i < n; ++i)
          copy[i] = arr[i];
        return copy;
      }
      function spliceOne(list, index2) {
        for (; index2 + 1 < list.length; index2++)
          list[index2] = list[index2 + 1];
        list.pop();
      }
      function unwrapListeners(arr) {
        var ret = new Array(arr.length);
        for (var i = 0; i < ret.length; ++i) {
          ret[i] = arr[i].listener || arr[i];
        }
        return ret;
      }
      function once(emitter, name) {
        return new Promise(function(resolve, reject) {
          function errorListener(err) {
            emitter.removeListener(name, resolver);
            reject(err);
          }
          function resolver() {
            if (typeof emitter.removeListener === "function") {
              emitter.removeListener("error", errorListener);
            }
            resolve([].slice.call(arguments));
          }
          ;
          eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
          if (name !== "error") {
            addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
          }
        });
      }
      function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
        if (typeof emitter.on === "function") {
          eventTargetAgnosticAddListener(emitter, "error", handler, flags);
        }
      }
      function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
        if (typeof emitter.on === "function") {
          if (flags.once) {
            emitter.once(name, listener);
          } else {
            emitter.on(name, listener);
          }
        } else if (typeof emitter.addEventListener === "function") {
          emitter.addEventListener(name, function wrapListener(arg) {
            if (flags.once) {
              emitter.removeEventListener(name, wrapListener);
            }
            listener(arg);
          });
        } else {
          throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
        }
      }
    }
  });

  // assets/data/property-nodes.json
  var property_nodes_default = [
    {
      id: "efficient",
      label: "Efficient",
      size: 40,
      color: "#dcf1ff",
      qualityType: "property",
      page: "/tag-efficient"
    },
    {
      id: "flexible",
      label: "Flexible",
      size: 40,
      color: "#dcf1ff",
      qualityType: "property",
      page: "/tag-flexible"
    },
    {
      id: "operable",
      label: "Operable",
      size: 40,
      color: "#dcf1ff",
      qualityType: "property",
      page: "/tag-operable"
    },
    {
      id: "reliable",
      label: "Reliable",
      size: 40,
      color: "#dcf1ff",
      qualityType: "property",
      page: "/tag-reliable"
    },
    {
      id: "safe",
      label: "Safe",
      size: 40,
      color: "#dcf1ff",
      qualityType: "property",
      page: "/tag-safe"
    },
    {
      id: "secure",
      label: "Secure",
      size: 40,
      color: "#dcf1ff",
      qualityType: "property",
      page: "/tag-secure"
    },
    {
      id: "suitable",
      label: "Suitable",
      size: 40,
      color: "#dcf1ff",
      qualityType: "property",
      page: "/tag-suitable"
    },
    {
      id: "usable",
      label: "Usable",
      size: 40,
      color: "#dcf1ff",
      qualityType: "property",
      page: "/tag-usable"
    }
  ];

  // assets/data/nodes.json
  var nodes_default = [
    {
      id: "access-control",
      label: "Access Control",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/access-control"
    },
    {
      id: "access-control-is-enforced",
      label: "Access control is enforced",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/access-control-is-enforced"
    },
    {
      id: "access-control-via-sso",
      label: "Access Control via SSO",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/access-control-via-sso"
    },
    {
      id: "access-find-function-quickly",
      label: "Access find function in three seconds",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/access-find-function-quickly"
    },
    {
      id: "accessibility",
      label: "Accessibility",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/accessibility"
    },
    {
      id: "accessible-user-interface",
      label: "Accessible User Interface",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/accessible-user-interface"
    },
    {
      id: "accountability",
      label: "Accountability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/accountability"
    },
    {
      id: "accuracy",
      label: "Accuracy",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/accuracy"
    },
    {
      id: "accurate-estimate-of-insurance-rate",
      label: "Accurate estimate of insurance contract rate",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/accurate-estimate-of-insurance-rate"
    },
    {
      id: "adaptability",
      label: "Adaptability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/adaptability"
    },
    {
      id: "add-new-product",
      label: "Add new product under 60 minutes",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/add-new-product"
    },
    {
      id: "affordability",
      label: "Affordability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/affordability"
    },
    {
      id: "affordable-crm",
      label: "Affordable CRM (customer relationship management)",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/affordable-crm"
    },
    {
      id: "agility",
      label: "Agility",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/agility"
    },
    {
      id: "analysability",
      label: "Analysability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/analysability"
    },
    {
      id: "anticipated-workplace-environment",
      label: "Anticipated Workplace Environment",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/anticipated-workplace-environment"
    },
    {
      id: "appearance",
      label: "Appearance",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/appearance"
    },
    {
      id: "appearance-requirements",
      label: "Appearance of mobile UI",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/appearance-requirements"
    },
    {
      id: "appropriateness-recognizability",
      label: "Appropriateness recognizability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/appropriateness-recognizability"
    },
    {
      id: "assess-impact-of-proposed-change",
      label: "Assess impact of proposed change",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/assess-impact-of-proposed-change"
    },
    {
      id: "attractiveness",
      label: "Attractiveness",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/attractiveness"
    },
    {
      id: "auditability",
      label: "Auditability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/auditability"
    },
    {
      id: "authenticity",
      label: "Authenticity",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/authenticity"
    },
    {
      id: "authenticity-of-digital-document",
      label: "Authenticity of a digital document",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/authenticity-of-digital-document"
    },
    {
      id: "autonomy",
      label: "Autonomy",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/autonomy"
    },
    {
      id: "availability",
      label: "Availability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/availability"
    },
    {
      id: "available-7-24-99",
      label: "Available 7x24 with 99% uptime",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/available-7-24-99"
    },
    {
      id: "avoid-common-vulnerabilities",
      label: "Avoid common vulnerabilities",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/avoid-common-vulnerabilities"
    },
    {
      id: "backup-patient-monitoring-sensor",
      label: "Backup patient monitoring sensor takes over",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/backup-patient-monitoring-sensor"
    },
    {
      id: "backward-compatibility",
      label: "Backward compatibility",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/backward-compatibility"
    },
    {
      id: "budget-constraint-library-update",
      label: "Budget constrained library update",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/budget-constraint-library-update"
    },
    {
      id: "budget-constraint",
      label: "Budget constraint",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/budget-constraint"
    },
    {
      id: "capacity",
      label: "Capacity",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/capacity"
    },
    {
      id: "capacity-to-process-sensor-inputs",
      label: "Capacity to process 1000 sensor inputs per minute",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/capacity-to-process-sensor-inputs"
    },
    {
      id: "carbon-emission-efficiency",
      label: "Carbon Emission Efficiency",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/carbon-emission-efficiency"
    },
    {
      id: "change-failure-rate",
      label: "Change failure rate",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/change-failure-rate"
    },
    {
      id: "changeability",
      label: "Changeability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/changeability"
    },
    {
      id: "clarity",
      label: "Clarity",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/clarity"
    },
    {
      id: "clarity-in-technical-documentation",
      label: "Clarity in technical documentation",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/clarity-in-technical-documentation"
    },
    {
      id: "co-existence",
      label: "Co-existence",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/co-existence"
    },
    {
      id: "code-complexity",
      label: "Code Complexity",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/code-complexity"
    },
    {
      id: "code-readability",
      label: "Code Readability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/code-readability"
    },
    {
      id: "coherence",
      label: "Coherence",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/coherence"
    },
    {
      id: "cohesion",
      label: "Cohesion",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/cohesion"
    },
    {
      id: "communicability",
      label: "Communicability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/communicability"
    },
    {
      id: "compatibility",
      label: "Compatibility",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/compatibility"
    },
    {
      id: "compatible-with-5-battery-providers",
      label: "Compatible with 5 different battery providers",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/compatible-with-5-battery-providers"
    },
    {
      id: "compliance",
      label: "Compliance",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/compliance"
    },
    {
      id: "compliance-with-ui-styleguide",
      label: "Compliance with UI styleguide",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/compliance-with-ui-styleguide"
    },
    {
      id: "compliance-to-wcag",
      label: "Compliance with WCAG accessibility guidelines",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/compliance-to-wcag"
    },
    {
      id: "composability",
      label: "Composability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/composability"
    },
    {
      id: "conciseness",
      label: "Conciseness",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/conciseness"
    },
    {
      id: "confidentiality",
      label: "Confidentiality",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/confidentiality"
    },
    {
      id: "confidentiality-by-multitenance",
      label: "Confidentiality by multi-tenancy",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/confidentiality-by-multitenance"
    },
    {
      id: "configurability",
      label: "Configurability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/configurability"
    },
    {
      id: "configurable-ui-theme",
      label: "Configurable UI theme",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/configurable-ui-theme"
    },
    {
      id: "consistency",
      label: "Consistency",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/consistency"
    },
    {
      id: "consistent-keyboard-shortcuts",
      label: "Consistent keyboard shortcuts",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/consistent-keyboard-shortcuts"
    },
    {
      id: "controllability",
      label: "Controllability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/controllability"
    },
    {
      id: "convenience",
      label: "Convenience",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/convenience"
    },
    {
      id: "convenient-online-banking",
      label: "Convenient online banking",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/convenient-online-banking"
    },
    {
      id: "core-functions-on-mac-win-linux",
      label: "Core functions can be used on multiple OSs",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/core-functions-on-mac-win-linux"
    },
    {
      id: "correctness",
      label: "Correctness",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/correctness"
    },
    {
      id: "cost",
      label: "Cost",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/cost"
    },
    {
      id: "credibility",
      label: "Credibility",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/credibility"
    },
    {
      id: "cultural-sensitivity-in-content",
      label: "Cultural Sensitivity in Content",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/cultural-sensitivity-in-content"
    },
    {
      id: "customizability",
      label: "Customizability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/customizability"
    },
    {
      id: "cyber-security",
      label: "Cyber Security",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/cyber-security"
    },
    {
      id: "cycle-time",
      label: "Cycle time",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/cycle-time"
    },
    {
      id: "data-throughput-for-visual-test-system",
      label: "Data Throughput for Visual Test System",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/data-throughput-for-visual-test-system"
    },
    {
      id: "dependability",
      label: "Dependability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/dependability"
    },
    {
      id: "deployability",
      label: "Deployability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/deployability"
    },
    {
      id: "deployment-frequency",
      label: "Deployment frequency",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/deployment-frequency"
    },
    {
      id: "detailed-audit-log",
      label: "Detailed audit log",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/detailed-audit-log"
    },
    {
      id: "detect-inconsistent-user-input",
      label: "Detect inconsistent user input",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/detect-inconsistent-user-input"
    },
    {
      id: "devops-metrics",
      label: "Devops-Metrics",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/devops-metrics"
    },
    {
      id: "display-data-based-on-context",
      label: "Display Data Based on Context",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/display-data-based-on-context"
    },
    {
      id: "DORA-metrics",
      label: "DORA Metrics",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/DORA-metrics"
    },
    {
      id: "ease-of-use",
      label: "Ease of Use",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/ease-of-use"
    },
    {
      id: "change-cloud-provider",
      label: "Easily change cloud provider",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/change-cloud-provider"
    },
    {
      id: "understandable-acceptance-tests",
      label: "Easily understandable acceptance test cases",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/understandable-acceptance-tests"
    },
    {
      id: "understandable-generated-code",
      label: "Easily understandable generated code",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/understandable-generated-code"
    },
    {
      id: "easy-ui",
      label: "Easy UI",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/easy-ui"
    },
    {
      id: "effectiveness",
      label: "Effectiveness",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/effectiveness"
    },
    {
      id: "efficiency",
      label: "Efficiency",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/efficiency"
    },
    {
      id: "luggage-routing",
      label: "Efficient change of business rules",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/luggage-routing"
    },
    {
      id: "efficient-generation-of-test-data",
      label: "Efficient generation of test data",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/efficient-generation-of-test-data"
    },
    {
      id: "efficient-save-function",
      label: "Efficient save function",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/efficient-save-function"
    },
    {
      id: "annual-tax-update",
      label: "Efficient update of annual accounting report",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/annual-tax-update"
    },
    {
      id: "elasticity",
      label: "Elasticity",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/elasticity"
    },
    {
      id: "employee-attempts-to-modify-pay-rate",
      label: "Employee attempts to modify pay rate",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/employee-attempts-to-modify-pay-rate"
    },
    {
      id: "encrypted-storage",
      label: "Encrypted storage",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/encrypted-storage"
    },
    {
      id: "energy-efficiency",
      label: "Energy Efficiency",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/energy-efficiency"
    },
    {
      id: "every-data-modification-is-logged",
      label: "Every data modification is logged",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/every-data-modification-is-logged"
    },
    {
      id: "expected-physical-environment",
      label: "Expected physical environment",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/expected-physical-environment"
    },
    {
      id: "explainability",
      label: "Explainability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/explainability"
    },
    {
      id: "expressive-error-messages",
      label: "Expressive error messages",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/expressive-error-messages"
    },
    {
      id: "extensibility",
      label: "Extensibility",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/extensibility"
    },
    {
      id: "fail-safe",
      label: "Fail safe",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/fail-safe"
    },
    {
      id: "fast-accurate-sensor",
      label: "Fast and accurate sensor",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/fast-accurate-sensor"
    },
    {
      id: "fast-creation-of-sales-report",
      label: "Fast creation of sales report",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/fast-creation-of-sales-report"
    },
    {
      id: "fast-deployment",
      label: "Fast deployment",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/fast-deployment"
    },
    {
      id: "fast-rollout-of-changes",
      label: "Fast rollout of changes",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/fast-rollout-of-changes"
    },
    {
      id: "fast-startup-time",
      label: "Fast startup time (less than 90 sec)",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/fast-startup-time"
    },
    {
      id: "fault-isolation",
      label: "Fault isolation",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/fault-isolation"
    },
    {
      id: "fault-tolerance",
      label: "Fault tolerance",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/fault-tolerance"
    },
    {
      id: "faultlessness",
      label: "Faultlessness",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/faultlessness"
    },
    {
      id: "features",
      label: "Features",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/features"
    },
    {
      id: "flexibility",
      label: "Flexibility",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/flexibility"
    },
    {
      id: "functional-appropriateness",
      label: "Functional Appropriateness",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/functional-appropriateness"
    },
    {
      id: "functional-completeness",
      label: "Functional completeness",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/functional-completeness"
    },
    {
      id: "functional-correctness",
      label: "Functional correctness",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/functional-correctness"
    },
    {
      id: "functional-suitability",
      label: "Functional suitability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/functional-suitability"
    },
    {
      id: "functionality",
      label: "Functionality",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/functionality"
    },
    {
      id: "global-explainability",
      label: "Global Explainability",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/global-explainability"
    },
    {
      id: "good-code-readability-score",
      label: "Good code readability score",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/good-code-readability-score"
    },
    {
      id: "graceful-degradation",
      label: "Graceful degradation",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/graceful-degradation"
    },
    {
      id: "handle-sudden-increase-in-traffic",
      label: "Handle sudden increase in traffic",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/handle-sudden-increase-in-traffic"
    },
    {
      id: "hazard-warning",
      label: "Hazard warning",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/hazard-warning"
    },
    {
      id: "high-availability",
      label: "High availability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/high-availability"
    },
    {
      id: "i18n",
      label: "i18n (Internationalization)",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/i18n"
    },
    {
      id: "immunity",
      label: "Immunity",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/immunity"
    },
    {
      id: "inclusive-user-testing",
      label: "Inclusive User Testing",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/inclusive-user-testing"
    },
    {
      id: "inclusivity",
      label: "Inclusivity",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/inclusivity"
    },
    {
      id: "independence",
      label: "Independence",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/independence"
    },
    {
      id: "independent-enhancement-of-subsystem",
      label: "Independent enhancement of subsystem",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/independent-enhancement-of-subsystem"
    },
    {
      id: "independent-replacement-of-subsystem",
      label: "Independent replacement of subsystem",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/independent-replacement-of-subsystem"
    },
    {
      id: "information-security",
      label: "Information Security",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/information-security"
    },
    {
      id: "installability",
      label: "Installability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/installability"
    },
    {
      id: "integrity",
      label: "Integrity",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/integrity"
    },
    {
      id: "interaction-capability",
      label: "Interaction capability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/interaction-capability"
    },
    {
      id: "internationalization",
      label: "Internationalization",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/internationalization"
    },
    {
      id: "interoperability",
      label: "Interoperability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/interoperability"
    },
    {
      id: "interoperable-with-java-12",
      label: "Interoperable with Java 12",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/interoperable-with-java-12"
    },
    {
      id: "interruptable-backend-process",
      label: "Interruptable backend process",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/interruptable-backend-process"
    },
    {
      id: "intrusion-detection",
      label: "Intrusion Detection",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/intrusion-detection"
    },
    {
      id: "intrusion-prevention",
      label: "Intrusion Prevention",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/intrusion-prevention"
    },
    {
      id: "jitter",
      label: "Jitter",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/jitter"
    },
    {
      id: "keep-data-on-error",
      label: "Keep data on error",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/keep-data-on-error"
    },
    {
      id: "latency",
      label: "Latency",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/latency"
    },
    {
      id: "lead-time-for-changes",
      label: "Lead time for changes",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/lead-time-for-changes"
    },
    {
      id: "learnability",
      label: "Learnability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/learnability"
    },
    {
      id: "legal-requirements",
      label: "Legal Requirements",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/legal-requirements"
    },
    {
      id: "legibility",
      label: "Legibility",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/legibility"
    },
    {
      id: "local-explainability",
      label: "Local Explainability",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/local-explainability"
    },
    {
      id: "localizability",
      label: "Localizability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/localizability"
    },
    {
      id: "localizable-to-n-languages",
      label: "Localizable to several languages",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/localizable-to-n-languages"
    },
    {
      id: "longevity",
      label: "Longevity",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/longevity"
    },
    {
      id: "loose-coupling",
      label: "Loose Coupling",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/loose-coupling"
    },
    {
      id: "low-change-failure-rate",
      label: "Low change-failure rate",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/low-change-failure-rate"
    },
    {
      id: "low-effort-deployment",
      label: "Low effort deployment",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/low-effort-deployment"
    },
    {
      id: "low-impact-diagnosis",
      label: "Low impact diagnosis",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/low-impact-diagnosis"
    },
    {
      id: "query-execution-management",
      label: "Low-overhead query execution measurement",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/query-execution-management"
    },
    {
      id: "maintainability",
      label: "Maintainability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/maintainability"
    },
    {
      id: "maintainable-checking-strategy",
      label: "Maintainable checking strategies",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/maintainable-checking-strategy"
    },
    {
      id: "mean-time-between-failures",
      label: "Mean time between failures",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/mean-time-between-failures"
    },
    {
      id: "mean-time-to-recovery",
      label: "Mean time to recovery",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/mean-time-to-recovery"
    },
    {
      id: "memory-usage",
      label: "Memory usage",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/memory-usage"
    },
    {
      id: "minimize-jitter",
      label: "Minimize jitter in real-time data streaming",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/minimize-jitter"
    },
    {
      id: "modifiability",
      label: "Modifiability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/modifiability"
    },
    {
      id: "modular-system-for-data-analysis",
      label: "Modular System for Data Analysis",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/modular-system-for-data-analysis"
    },
    {
      id: "modularity",
      label: "Modularity",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/modularity"
    },
    {
      id: "multilinguality-support",
      label: "Multilinguality Support",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/multilinguality-support"
    },
    {
      id: "near-instant-search-results",
      label: "Near instant search results",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/near-instant-search-results"
    },
    {
      id: "new-features-introduct-no-bugs",
      label: "New Features Introduce No Bugs",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/new-features-introduct-no-bugs"
    },
    {
      id: "learnability-find-article",
      label: "New users learn to find articles on their own",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/learnability-find-article"
    },
    {
      id: "non-repudiation",
      label: "Non-repudiation",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/non-repudiation"
    },
    {
      id: "observability",
      label: "Observability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/observability"
    },
    {
      id: "only-authenticated-users-can-access",
      label: "Only authenticated users can access data",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/only-authenticated-users-can-access"
    },
    {
      id: "operability",
      label: "Operability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/operability"
    },
    {
      id: "operational-environment-requirements",
      label: "Operational and Environment Requirements",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/operational-environment-requirements"
    },
    {
      id: "operational-constraint",
      label: "Operational constraint",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/operational-constraint"
    },
    {
      id: "order-queue",
      label: "Order queue",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/order-queue"
    },
    {
      id: "parallel-data-modification",
      label: "Parallel Data Modification",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/parallel-data-modification"
    },
    {
      id: "patient-safety",
      label: "Patient Safety",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/patient-safety"
    },
    {
      id: "performance",
      label: "Performance",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/performance"
    },
    {
      id: "performance-efficiency",
      label: "Performance Efficiency",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/performance-efficiency"
    },
    {
      id: "personalization",
      label: "Personalization",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/personalization"
    },
    {
      id: "portability",
      label: "Portability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/portability"
    },
    {
      id: "portable-business-data-checker",
      label: "Portable Business Data Checker",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/portable-business-data-checker"
    },
    {
      id: "high-precision-calculation",
      label: "Precise calculation of gamma coefficient",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/high-precision-calculation"
    },
    {
      id: "preciseness",
      label: "Preciseness",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/preciseness"
    },
    {
      id: "precision",
      label: "Precision",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/precision"
    },
    {
      id: "precise-vehicle-orientation-gps",
      label: "Precision of vehicle's orientation",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/precise-vehicle-orientation-gps"
    },
    {
      id: "predictability",
      label: "Predictability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/predictability"
    },
    {
      id: "privacy",
      label: "Privacy",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/privacy"
    },
    {
      id: "profitability",
      label: "Profitability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/profitability"
    },
    {
      id: "protect-data-by-security-procols",
      label: "Protect Data by Establishing Security Protocols",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/protect-data-by-security-procols"
    },
    {
      id: "quick-unit-tests",
      label: "Quick unit tests",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/quick-unit-tests"
    },
    {
      id: "quickly-locate-bugs",
      label: "Quickly locate bugs",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/quickly-locate-bugs"
    },
    {
      id: "readability",
      label: "Readability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/readability"
    },
    {
      id: "recognize-assistive-technology",
      label: "Recognize Assistive Technologies",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/recognize-assistive-technology"
    },
    {
      id: "recoverability",
      label: "Recoverability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/recoverability"
    },
    {
      id: "recovery-time",
      label: "Recovery time",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/recovery-time"
    },
    {
      id: "reduce-energy-consumption-with-new-version",
      label: "Reduce energy consumption with every new version",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/reduce-energy-consumption-with-new-version"
    },
    {
      id: "releasability",
      label: "Releasability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/releasability"
    },
    {
      id: "reliability",
      label: "Reliability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/reliability"
    },
    {
      id: "reliable-backup-and-restore",
      label: "Reliable Backup and Restore",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/reliable-backup-and-restore"
    },
    {
      id: "reliable-erh-system",
      label: "Reliable ERH System",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/reliable-erh-system"
    },
    {
      id: "replaceability",
      label: "Replaceability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/replaceability"
    },
    {
      id: "reproducibility",
      label: "Reproducibility",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/reproducibility"
    },
    {
      id: "resilience",
      label: "Resilience",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/resilience"
    },
    {
      id: "resistance",
      label: "Resistance",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/resistance"
    },
    {
      id: "resource-efficiency",
      label: "Resource efficiency",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/resource-efficiency"
    },
    {
      id: "resource-utilization",
      label: "Resource utilization",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/resource-utilization"
    },
    {
      id: "respond-to-15000-requests-per-workday",
      label: "Respond to 15000 requests per workday",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/respond-to-15000-requests-per-workday"
    },
    {
      id: "response-time",
      label: "Response Time",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/response-time"
    },
    {
      id: "response-time-for-image-rendering",
      label: "Response time for image rendering",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/response-time-for-image-rendering"
    },
    {
      id: "responsiveness",
      label: "Responsiveness",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/responsiveness"
    },
    {
      id: "restore-filter-after-log-in",
      label: "Restore Filter after Log In",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/restore-filter-after-log-in"
    },
    {
      id: "mttr-12h",
      label: "Restored to fully functional state 12h after complete failure",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/mttr-12h"
    },
    {
      id: "restricted-memory",
      label: "Restricted Memory",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/restricted-memory"
    },
    {
      id: "reusability",
      label: "Reusability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/reusability"
    },
    {
      id: "risk-identification",
      label: "Risk identification",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/risk-identification"
    },
    {
      id: "robustness",
      label: "Robustness",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/robustness"
    },
    {
      id: "rollout-new-feature",
      label: "Rollout of a new feature",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/rollout-new-feature"
    },
    {
      id: "safe-integration",
      label: "Safe integration",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/safe-integration"
    },
    {
      id: "safety",
      label: "Safety",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/safety"
    },
    {
      id: "carbon-efficiency-save",
      label: "Save at least 20% of carbon emissions with every new version",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/carbon-efficiency-save"
    },
    {
      id: "scalability",
      label: "Scalability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/scalability"
    },
    {
      id: "scale-up-in-2-minutes",
      label: "Scale up in 2 Minutes",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/scale-up-in-2-minutes"
    },
    {
      id: "securability",
      label: "Securability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/securability"
    },
    {
      id: "security",
      label: "Security",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/security"
    },
    {
      id: "self-containedness",
      label: "Self-containedness",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/self-containedness"
    },
    {
      id: "self-descriptiveness",
      label: "Self-descriptiveness",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/self-descriptiveness"
    },
    {
      id: "server-fails-operation-without-downtime",
      label: "Server fails, system continues to operate without downtime",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/server-fails-operation-without-downtime"
    },
    {
      id: "shutdown-to-safe-state",
      label: "Severe errors are detected and the system shuts down into safe state",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/shutdown-to-safe-state"
    },
    {
      id: "simplicity",
      label: "Simplicity",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/simplicity"
    },
    {
      id: "speed",
      label: "Speed",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/speed"
    },
    {
      id: "speed-to-market",
      label: "Speed to Market",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/speed-to-market"
    },
    {
      id: "stability",
      label: "Stability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/stability"
    },
    {
      id: "standard-compliance",
      label: "Standard Compliance",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/standard-compliance"
    },
    {
      id: "startup-time",
      label: "Startup Time",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/startup-time"
    },
    {
      id: "suitability",
      label: "Suitability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/suitability"
    },
    {
      id: "sustainability",
      label: "Sustainability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/sustainability"
    },
    {
      id: "long-running-without-reboot",
      label: "System can run >12h without re-booting the operating system",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/long-running-without-reboot"
    },
    {
      id: "system-runs-offline",
      label: "System runs offline",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/system-runs-offline"
    },
    {
      id: "test-coverage",
      label: "Test Coverage",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/test-coverage"
    },
    {
      id: "test-with-path-coverage-30min",
      label: "Test with path coverage in 30min",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/test-with-path-coverage-30min"
    },
    {
      id: "testability",
      label: "Testability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/testability"
    },
    {
      id: "throughput",
      label: "Throughput",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/throughput"
    },
    {
      id: "time-behaviour",
      label: "Time behaviour",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/time-behaviour"
    },
    {
      id: "time-to-market",
      label: "Time to Market",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/time-to-market"
    },
    {
      id: "timeliness",
      label: "Timeliness",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/timeliness"
    },
    {
      id: "traceability",
      label: "Traceability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/traceability"
    },
    {
      id: "transparency",
      label: "Transparency",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/transparency"
    },
    {
      id: "unavailability-max-2-minutes",
      label: "Unavailable for max 2 minutes",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/unavailability-max-2-minutes"
    },
    {
      id: "understandability",
      label: "Understandability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/understandability"
    },
    {
      id: "up-to-date-api",
      label: "Up to date API",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/up-to-date-api"
    },
    {
      id: "upgradeability",
      label: "Upgradeability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/upgradeability"
    },
    {
      id: "usability",
      label: "Usability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/usability"
    },
    {
      id: "usable-despite-color-blindness",
      label: "Usable Despite Color Blindness",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/usable-despite-color-blindness"
    },
    {
      id: "usable-on-factory-floor",
      label: "Usable on Factory Floor",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/usable-on-factory-floor"
    },
    {
      id: "usable-with-gloves",
      label: "Usable With Gloves",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/usable-with-gloves"
    },
    {
      id: "user-assistance",
      label: "User assistance",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/user-assistance"
    },
    {
      id: "user-engagement",
      label: "User engagement",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/user-engagement"
    },
    {
      id: "user-error-protection",
      label: "User error protection",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/user-error-protection"
    },
    {
      id: "user-experience",
      label: "User experience",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/user-experience"
    },
    {
      id: "user-interface-aesthetics",
      label: "User interface aesthetics",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/user-interface-aesthetics"
    },
    {
      id: "user-interface-works-with-current-browsers",
      label: "User Interface can be used in Current Browsers",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/user-interface-works-with-current-browsers"
    },
    {
      id: "user-tries-primary-function",
      label: "User tries to achieve primary function",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/user-tries-primary-function"
    },
    {
      id: "accurate-vehicle-position-gps",
      label: "Vehicle's position validity influences accuracy",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/accurate-vehicle-position-gps"
    },
    {
      id: "versatility",
      label: "Versatility",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/versatility"
    },
    {
      id: "vulnerability",
      label: "Vulnerability",
      size: 25,
      color: "#dcf1ff",
      qualityType: "quality",
      page: "/qualities/vulnerability"
    },
    {
      id: "withstand-ddos-attack",
      label: "Withstand DDoS Attack",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/withstand-ddos-attack"
    },
    {
      id: "zero-knowledge-data-storage",
      label: "Zero-knowledge data storage",
      size: 15,
      color: "#ceffce",
      qualityType: "requirement",
      page: "/requirements/zero-knowledge-data-storage"
    }
  ];

  // assets/data/edges.json
  var edges_default = [
    {
      source: "access-control",
      target: "secure"
    },
    {
      source: "access-control",
      target: "security"
    },
    {
      source: "access-control",
      target: "accessibility"
    },
    {
      source: "access-control",
      target: "confidentiality"
    },
    {
      source: "access-control",
      target: "privacy"
    },
    {
      source: "access-control",
      target: "intrusion-detection"
    },
    {
      source: "access-control",
      target: "intrusion-prevention"
    },
    {
      source: "access-control-is-enforced",
      target: "access-control"
    },
    {
      source: "access-control-is-enforced",
      target: "auditability"
    },
    {
      source: "access-control-via-sso",
      target: "access-control"
    },
    {
      source: "access-control-via-sso",
      target: "auditability"
    },
    {
      source: "access-find-function-quickly",
      target: "usability"
    },
    {
      source: "access-find-function-quickly",
      target: "user-experience"
    },
    {
      source: "access-find-function-quickly",
      target: "ease-of-use"
    },
    {
      source: "access-find-function-quickly",
      target: "convenience"
    },
    {
      source: "access-find-function-quickly",
      target: "interaction-capability"
    },
    {
      source: "accessibility",
      target: "usable"
    },
    {
      source: "accessibility",
      target: "usability"
    },
    {
      source: "accessibility",
      target: "inclusivity"
    },
    {
      source: "accessibility",
      target: "interaction-capability"
    },
    {
      source: "accessible-user-interface",
      target: "usability"
    },
    {
      source: "accessible-user-interface",
      target: "inclusivity"
    },
    {
      source: "accessible-user-interface",
      target: "compliance"
    },
    {
      source: "accessible-user-interface",
      target: "accessibility"
    },
    {
      source: "accessible-user-interface",
      target: "interaction-capability"
    },
    {
      source: "accountability",
      target: "secure"
    },
    {
      source: "accountability",
      target: "authenticity"
    },
    {
      source: "accountability",
      target: "security"
    },
    {
      source: "accountability",
      target: "non-repudiation"
    },
    {
      source: "accuracy",
      target: "reliable"
    },
    {
      source: "accuracy",
      target: "usable"
    },
    {
      source: "accuracy",
      target: "correctness"
    },
    {
      source: "accuracy",
      target: "preciseness"
    },
    {
      source: "accurate-estimate-of-insurance-rate",
      target: "accuracy"
    },
    {
      source: "accurate-estimate-of-insurance-rate",
      target: "preciseness"
    },
    {
      source: "accurate-estimate-of-insurance-rate",
      target: "precision"
    },
    {
      source: "accurate-estimate-of-insurance-rate",
      target: "reliability"
    },
    {
      source: "accurate-estimate-of-insurance-rate",
      target: "functional-correctness"
    },
    {
      source: "accurate-estimate-of-insurance-rate",
      target: "interaction-capability"
    },
    {
      source: "accurate-vehicle-position-gps",
      target: "preciseness"
    },
    {
      source: "accurate-vehicle-position-gps",
      target: "precision"
    },
    {
      source: "accurate-vehicle-position-gps",
      target: "reliability"
    },
    {
      source: "accurate-vehicle-position-gps",
      target: "functional-correctness"
    },
    {
      source: "adaptability",
      target: "flexible"
    },
    {
      source: "adaptability",
      target: "usable"
    },
    {
      source: "adaptability",
      target: "changeability"
    },
    {
      source: "adaptability",
      target: "configurability"
    },
    {
      source: "adaptability",
      target: "maintainability"
    },
    {
      source: "adaptability",
      target: "flexibility"
    },
    {
      source: "adaptability",
      target: "usability"
    },
    {
      source: "adaptability",
      target: "scalability"
    },
    {
      source: "adaptability",
      target: "elasticity"
    },
    {
      source: "add-new-product",
      target: "efficiency"
    },
    {
      source: "add-new-product",
      target: "usability"
    },
    {
      source: "add-new-product",
      target: "extensibility"
    },
    {
      source: "affordability",
      target: "suitable"
    },
    {
      source: "affordability",
      target: "usable"
    },
    {
      source: "affordability",
      target: "efficient"
    },
    {
      source: "affordability",
      target: "budget-constraint"
    },
    {
      source: "affordability",
      target: "cost"
    },
    {
      source: "affordability",
      target: "changeability"
    },
    {
      source: "affordable-crm",
      target: "affordability"
    },
    {
      source: "affordable-crm",
      target: "cost"
    },
    {
      source: "affordable-crm",
      target: "budget-constraint"
    },
    {
      source: "affordable-crm",
      target: "profitability"
    },
    {
      source: "agility",
      target: "flexible"
    },
    {
      source: "agility",
      target: "flexibility"
    },
    {
      source: "agility",
      target: "changeability"
    },
    {
      source: "agility",
      target: "adaptability"
    },
    {
      source: "agility",
      target: "modifiability"
    },
    {
      source: "agility",
      target: "modularity"
    },
    {
      source: "analysability",
      target: "flexible"
    },
    {
      source: "analysability",
      target: "flexibility"
    },
    {
      source: "analysability",
      target: "maintainability"
    },
    {
      source: "analysability",
      target: "modifiability"
    },
    {
      source: "analysability",
      target: "testability"
    },
    {
      source: "annual-tax-update",
      target: "efficiency"
    },
    {
      source: "annual-tax-update",
      target: "maintainability"
    },
    {
      source: "annual-tax-update",
      target: "changeability"
    },
    {
      source: "anticipated-workplace-environment",
      target: "usable"
    },
    {
      source: "anticipated-workplace-environment",
      target: "functional-appropriateness"
    },
    {
      source: "appearance",
      target: "usable"
    },
    {
      source: "appearance",
      target: "ease-of-use"
    },
    {
      source: "appearance",
      target: "learnability"
    },
    {
      source: "appearance",
      target: "self-descriptiveness"
    },
    {
      source: "appearance",
      target: "user-interface-aesthetics"
    },
    {
      source: "appearance",
      target: "attractiveness"
    },
    {
      source: "appearance-requirements",
      target: "appearance"
    },
    {
      source: "appearance-requirements",
      target: "usability"
    },
    {
      source: "appearance-requirements",
      target: "consistency"
    },
    {
      source: "appearance-requirements",
      target: "user-interface-aesthetics"
    },
    {
      source: "appearance-requirements",
      target: "interaction-capability"
    },
    {
      source: "appropriateness-recognizability",
      target: "usable"
    },
    {
      source: "appropriateness-recognizability",
      target: "operable"
    },
    {
      source: "appropriateness-recognizability",
      target: "usability"
    },
    {
      source: "appropriateness-recognizability",
      target: "attractiveness"
    },
    {
      source: "appropriateness-recognizability",
      target: "operability"
    },
    {
      source: "appropriateness-recognizability",
      target: "user-error-protection"
    },
    {
      source: "appropriateness-recognizability",
      target: "user-engagement"
    },
    {
      source: "assess-impact-of-proposed-change",
      target: "analysability"
    },
    {
      source: "assess-impact-of-proposed-change",
      target: "reliability"
    },
    {
      source: "attractiveness",
      target: "usable"
    },
    {
      source: "attractiveness",
      target: "usability"
    },
    {
      source: "attractiveness",
      target: "clarity"
    },
    {
      source: "attractiveness",
      target: "user-interface-aesthetics"
    },
    {
      source: "attractiveness",
      target: "user-experience"
    },
    {
      source: "attractiveness",
      target: "user-assistance"
    },
    {
      source: "auditability",
      target: "operable"
    },
    {
      source: "auditability",
      target: "transparency"
    },
    {
      source: "auditability",
      target: "traceability"
    },
    {
      source: "auditability",
      target: "operability"
    },
    {
      source: "auditability",
      target: "observability"
    },
    {
      source: "auditability",
      target: "devops-metrics"
    },
    {
      source: "authenticity",
      target: "secure"
    },
    {
      source: "authenticity",
      target: "integrity"
    },
    {
      source: "authenticity",
      target: "security"
    },
    {
      source: "authenticity",
      target: "non-repudiation"
    },
    {
      source: "authenticity-of-digital-document",
      target: "authenticity"
    },
    {
      source: "authenticity-of-digital-document",
      target: "integrity"
    },
    {
      source: "autonomy",
      target: "operable"
    },
    {
      source: "autonomy",
      target: "suitable"
    },
    {
      source: "availability",
      target: "reliable"
    },
    {
      source: "availability",
      target: "usable"
    },
    {
      source: "availability",
      target: "high-availability"
    },
    {
      source: "availability",
      target: "robustness"
    },
    {
      source: "availability",
      target: "reliability"
    },
    {
      source: "availability",
      target: "usability"
    },
    {
      source: "availability",
      target: "fault-tolerance"
    },
    {
      source: "availability",
      target: "recoverability"
    },
    {
      source: "availability",
      target: "dependability"
    },
    {
      source: "availability",
      target: "faultlessness"
    },
    {
      source: "availability",
      target: "recovery-time"
    },
    {
      source: "available-7-24-99",
      target: "availability"
    },
    {
      source: "available-7-24-99",
      target: "high-availability"
    },
    {
      source: "available-7-24-99",
      target: "reliability"
    },
    {
      source: "available-7-24-99",
      target: "operability"
    },
    {
      source: "available-7-24-99",
      target: "user-error-protection"
    },
    {
      source: "available-7-24-99",
      target: "interaction-capability"
    },
    {
      source: "avoid-common-vulnerabilities",
      target: "vulnerability"
    },
    {
      source: "backup-patient-monitoring-sensor",
      target: "safety"
    },
    {
      source: "backup-patient-monitoring-sensor",
      target: "efficiency"
    },
    {
      source: "backup-patient-monitoring-sensor",
      target: "reliability"
    },
    {
      source: "backup-patient-monitoring-sensor",
      target: "patient-safety"
    },
    {
      source: "backward-compatibility",
      target: "usable"
    },
    {
      source: "backward-compatibility",
      target: "operable"
    },
    {
      source: "backward-compatibility",
      target: "reliable"
    },
    {
      source: "backward-compatibility",
      target: "portability"
    },
    {
      source: "backward-compatibility",
      target: "flexibility"
    },
    {
      source: "backward-compatibility",
      target: "compatibility"
    },
    {
      source: "budget-constraint",
      target: "suitable"
    },
    {
      source: "budget-constraint",
      target: "efficient"
    },
    {
      source: "budget-constraint",
      target: "affordability"
    },
    {
      source: "budget-constraint",
      target: "cost"
    },
    {
      source: "budget-constraint-library-update",
      target: "affordability"
    },
    {
      source: "budget-constraint-library-update",
      target: "cost"
    },
    {
      source: "budget-constraint-library-update",
      target: "budget-constraint"
    },
    {
      source: "budget-constraint-library-update",
      target: "time-to-market"
    },
    {
      source: "capacity",
      target: "efficient"
    },
    {
      source: "capacity",
      target: "reliable"
    },
    {
      source: "capacity",
      target: "efficiency"
    },
    {
      source: "capacity",
      target: "resource-efficiency"
    },
    {
      source: "capacity-to-process-sensor-inputs",
      target: "time-behaviour"
    },
    {
      source: "capacity-to-process-sensor-inputs",
      target: "speed"
    },
    {
      source: "capacity-to-process-sensor-inputs",
      target: "performance"
    },
    {
      source: "carbon-efficiency-save",
      target: "efficiency"
    },
    {
      source: "carbon-efficiency-save",
      target: "carbon-emission-efficiency"
    },
    {
      source: "carbon-efficiency-save",
      target: "energy-efficiency"
    },
    {
      source: "carbon-emission-efficiency",
      target: "efficient"
    },
    {
      source: "carbon-emission-efficiency",
      target: "sustainability"
    },
    {
      source: "carbon-emission-efficiency",
      target: "energy-efficiency"
    },
    {
      source: "change-cloud-provider",
      target: "flexibility"
    },
    {
      source: "change-cloud-provider",
      target: "maintainability"
    },
    {
      source: "change-cloud-provider",
      target: "adaptability"
    },
    {
      source: "change-failure-rate",
      target: "operable"
    },
    {
      source: "change-failure-rate",
      target: "controllability"
    },
    {
      source: "change-failure-rate",
      target: "operability"
    },
    {
      source: "change-failure-rate",
      target: "testability"
    },
    {
      source: "change-failure-rate",
      target: "analysability"
    },
    {
      source: "change-failure-rate",
      target: "deployability"
    },
    {
      source: "change-failure-rate",
      target: "devops-metrics"
    },
    {
      source: "changeability",
      target: "flexible"
    },
    {
      source: "changeability",
      target: "flexibility"
    },
    {
      source: "changeability",
      target: "adaptability"
    },
    {
      source: "changeability",
      target: "modifiability"
    },
    {
      source: "changeability",
      target: "configurability"
    },
    {
      source: "changeability",
      target: "modularity"
    },
    {
      source: "clarity",
      target: "usable"
    },
    {
      source: "clarity",
      target: "reliable"
    },
    {
      source: "clarity",
      target: "coherence"
    },
    {
      source: "clarity",
      target: "transparency"
    },
    {
      source: "clarity",
      target: "understandability"
    },
    {
      source: "clarity",
      target: "legibility"
    },
    {
      source: "clarity-in-technical-documentation",
      target: "clarity"
    },
    {
      source: "clarity-in-technical-documentation",
      target: "coherence"
    },
    {
      source: "clarity-in-technical-documentation",
      target: "understandability"
    },
    {
      source: "clarity-in-technical-documentation",
      target: "legibility"
    },
    {
      source: "co-existence",
      target: "flexible"
    },
    {
      source: "co-existence",
      target: "compatibility"
    },
    {
      source: "co-existence",
      target: "interoperability"
    },
    {
      source: "code-complexity",
      target: "efficient"
    },
    {
      source: "code-complexity",
      target: "understandability"
    },
    {
      source: "code-complexity",
      target: "legibility"
    },
    {
      source: "code-complexity",
      target: "clarity"
    },
    {
      source: "code-complexity",
      target: "conciseness"
    },
    {
      source: "code-complexity",
      target: "consistency"
    },
    {
      source: "code-complexity",
      target: "readability"
    },
    {
      source: "code-readability",
      target: "usable"
    },
    {
      source: "code-readability",
      target: "efficient"
    },
    {
      source: "code-readability",
      target: "understandability"
    },
    {
      source: "code-readability",
      target: "legibility"
    },
    {
      source: "code-readability",
      target: "clarity"
    },
    {
      source: "code-readability",
      target: "conciseness"
    },
    {
      source: "code-readability",
      target: "consistency"
    },
    {
      source: "code-readability",
      target: "readability"
    },
    {
      source: "coherence",
      target: "usable"
    },
    {
      source: "coherence",
      target: "efficient"
    },
    {
      source: "coherence",
      target: "consistency"
    },
    {
      source: "cohesion",
      target: "efficient"
    },
    {
      source: "cohesion",
      target: "flexible"
    },
    {
      source: "cohesion",
      target: "suitable"
    },
    {
      source: "cohesion",
      target: "coherence"
    },
    {
      source: "cohesion",
      target: "modularity"
    },
    {
      source: "communicability",
      target: "usable"
    },
    {
      source: "communicability",
      target: "usability"
    },
    {
      source: "communicability",
      target: "learnability"
    },
    {
      source: "communicability",
      target: "understandability"
    },
    {
      source: "communicability",
      target: "user-error-protection"
    },
    {
      source: "communicability",
      target: "ease-of-use"
    },
    {
      source: "compatibility",
      target: "usable"
    },
    {
      source: "compatibility",
      target: "operable"
    },
    {
      source: "compatibility",
      target: "reliable"
    },
    {
      source: "compatibility",
      target: "portability"
    },
    {
      source: "compatibility",
      target: "flexibility"
    },
    {
      source: "compatibility",
      target: "backward-compatibility"
    },
    {
      source: "compatible-with-5-battery-providers",
      target: "flexibility"
    },
    {
      source: "compatible-with-5-battery-providers",
      target: "adaptability"
    },
    {
      source: "compatible-with-5-battery-providers",
      target: "interoperability"
    },
    {
      source: "compatible-with-5-battery-providers",
      target: "compatibility"
    },
    {
      source: "compliance",
      target: "secure"
    },
    {
      source: "compliance",
      target: "safe"
    },
    {
      source: "compliance",
      target: "usable"
    },
    {
      source: "compliance",
      target: "reliable"
    },
    {
      source: "compliance",
      target: "efficient"
    },
    {
      source: "compliance",
      target: "suitable"
    },
    {
      source: "compliance",
      target: "security"
    },
    {
      source: "compliance",
      target: "safety"
    },
    {
      source: "compliance",
      target: "usability"
    },
    {
      source: "compliance",
      target: "reliability"
    },
    {
      source: "compliance",
      target: "efficiency"
    },
    {
      source: "compliance",
      target: "testability"
    },
    {
      source: "compliance-to-wcag",
      target: "accessibility"
    },
    {
      source: "compliance-to-wcag",
      target: "user-experience"
    },
    {
      source: "compliance-to-wcag",
      target: "user-assistance"
    },
    {
      source: "compliance-to-wcag",
      target: "interaction-capability"
    },
    {
      source: "compliance-with-ui-styleguide",
      target: "usability"
    },
    {
      source: "compliance-with-ui-styleguide",
      target: "user-experience"
    },
    {
      source: "compliance-with-ui-styleguide",
      target: "compliance"
    },
    {
      source: "compliance-with-ui-styleguide",
      target: "interaction-capability"
    },
    {
      source: "composability",
      target: "flexible"
    },
    {
      source: "composability",
      target: "modularity"
    },
    {
      source: "composability",
      target: "autonomy"
    },
    {
      source: "composability",
      target: "reusability"
    },
    {
      source: "composability",
      target: "interoperability"
    },
    {
      source: "conciseness",
      target: "usable"
    },
    {
      source: "conciseness",
      target: "efficient"
    },
    {
      source: "conciseness",
      target: "understandability"
    },
    {
      source: "confidentiality",
      target: "secure"
    },
    {
      source: "confidentiality",
      target: "integrity"
    },
    {
      source: "confidentiality",
      target: "accountability"
    },
    {
      source: "confidentiality-by-multitenance",
      target: "confidentiality"
    },
    {
      source: "confidentiality-by-multitenance",
      target: "security"
    },
    {
      source: "confidentiality-by-multitenance",
      target: "privacy"
    },
    {
      source: "configurability",
      target: "flexible"
    },
    {
      source: "configurability",
      target: "usable"
    },
    {
      source: "configurability",
      target: "flexibility"
    },
    {
      source: "configurability",
      target: "changeability"
    },
    {
      source: "configurability",
      target: "adaptability"
    },
    {
      source: "configurability",
      target: "modifiability"
    },
    {
      source: "configurability",
      target: "versatility"
    },
    {
      source: "configurable-ui-theme",
      target: "flexibility"
    },
    {
      source: "configurable-ui-theme",
      target: "changeability"
    },
    {
      source: "configurable-ui-theme",
      target: "adaptability"
    },
    {
      source: "configurable-ui-theme",
      target: "configurability"
    },
    {
      source: "configurable-ui-theme",
      target: "customizability"
    },
    {
      source: "consistency",
      target: "usable"
    },
    {
      source: "consistency",
      target: "efficient"
    },
    {
      source: "consistency",
      target: "understandability"
    },
    {
      source: "consistency",
      target: "coherence"
    },
    {
      source: "consistent-keyboard-shortcuts",
      target: "usability"
    },
    {
      source: "consistent-keyboard-shortcuts",
      target: "consistency"
    },
    {
      source: "consistent-keyboard-shortcuts",
      target: "user-experience"
    },
    {
      source: "consistent-keyboard-shortcuts",
      target: "user-assistance"
    },
    {
      source: "consistent-keyboard-shortcuts",
      target: "interaction-capability"
    },
    {
      source: "controllability",
      target: "usable"
    },
    {
      source: "controllability",
      target: "operable"
    },
    {
      source: "controllability",
      target: "usability"
    },
    {
      source: "convenience",
      target: "usable"
    },
    {
      source: "convenience",
      target: "usability"
    },
    {
      source: "convenience",
      target: "ease-of-use"
    },
    {
      source: "convenience",
      target: "user-assistance"
    },
    {
      source: "convenient-online-banking",
      target: "user-experience"
    },
    {
      source: "convenient-online-banking",
      target: "convenience"
    },
    {
      source: "convenient-online-banking",
      target: "interaction-capability"
    },
    {
      source: "convenient-online-banking",
      target: "clarity"
    },
    {
      source: "convenient-online-banking",
      target: "ease-of-use"
    },
    {
      source: "core-functions-on-mac-win-linux",
      target: "flexibility"
    },
    {
      source: "core-functions-on-mac-win-linux",
      target: "portability"
    },
    {
      source: "core-functions-on-mac-win-linux",
      target: "compatibility"
    },
    {
      source: "core-functions-on-mac-win-linux",
      target: "interaction-capability"
    },
    {
      source: "correctness",
      target: "usable"
    },
    {
      source: "correctness",
      target: "reliable"
    },
    {
      source: "correctness",
      target: "suitable"
    },
    {
      source: "correctness",
      target: "usability"
    },
    {
      source: "correctness",
      target: "functionality"
    },
    {
      source: "correctness",
      target: "functional-suitability"
    },
    {
      source: "correctness",
      target: "functional-correctness"
    },
    {
      source: "cost",
      target: "suitable"
    },
    {
      source: "cost",
      target: "efficient"
    },
    {
      source: "cost",
      target: "budget-constraint"
    },
    {
      source: "cost",
      target: "affordability"
    },
    {
      source: "credibility",
      target: "reliable"
    },
    {
      source: "credibility",
      target: "accountability"
    },
    {
      source: "credibility",
      target: "usability"
    },
    {
      source: "credibility",
      target: "user-engagement"
    },
    {
      source: "cultural-sensitivity-in-content",
      target: "usability"
    },
    {
      source: "cultural-sensitivity-in-content",
      target: "inclusivity"
    },
    {
      source: "cultural-sensitivity-in-content",
      target: "internationalization"
    },
    {
      source: "cultural-sensitivity-in-content",
      target: "interaction-capability"
    },
    {
      source: "customizability",
      target: "flexible"
    },
    {
      source: "customizability",
      target: "usable"
    },
    {
      source: "customizability",
      target: "configurability"
    },
    {
      source: "customizability",
      target: "flexibility"
    },
    {
      source: "customizability",
      target: "adaptability"
    },
    {
      source: "customizability",
      target: "changeability"
    },
    {
      source: "cyber-security",
      target: "secure"
    },
    {
      source: "cyber-security",
      target: "security"
    },
    {
      source: "cyber-security",
      target: "information-security"
    },
    {
      source: "cyber-security",
      target: "authenticity"
    },
    {
      source: "cyber-security",
      target: "confidentiality"
    },
    {
      source: "cycle-time",
      target: "operable"
    },
    {
      source: "cycle-time",
      target: "suitable"
    },
    {
      source: "cycle-time",
      target: "efficient"
    },
    {
      source: "cycle-time",
      target: "controllability"
    },
    {
      source: "cycle-time",
      target: "testability"
    },
    {
      source: "cycle-time",
      target: "deployability"
    },
    {
      source: "cycle-time",
      target: "devops-metrics"
    },
    {
      source: "cycle-time",
      target: "lead-time-for-changes"
    },
    {
      source: "data-throughput-for-visual-test-system",
      target: "throughput"
    },
    {
      source: "data-throughput-for-visual-test-system",
      target: "efficiency"
    },
    {
      source: "data-throughput-for-visual-test-system",
      target: "performance"
    },
    {
      source: "data-throughput-for-visual-test-system",
      target: "capacity"
    },
    {
      source: "dependability",
      target: "reliable"
    },
    {
      source: "dependability",
      target: "availability"
    },
    {
      source: "dependability",
      target: "robustness"
    },
    {
      source: "dependability",
      target: "fault-tolerance"
    },
    {
      source: "dependability",
      target: "reliability"
    },
    {
      source: "deployability",
      target: "operable"
    },
    {
      source: "deployability",
      target: "suitable"
    },
    {
      source: "deployability",
      target: "releasability"
    },
    {
      source: "deployability",
      target: "operability"
    },
    {
      source: "deployability",
      target: "testability"
    },
    {
      source: "deployability",
      target: "analysability"
    },
    {
      source: "deployability",
      target: "devops-metrics"
    },
    {
      source: "deployment-frequency",
      target: "operable"
    },
    {
      source: "deployment-frequency",
      target: "suitable"
    },
    {
      source: "deployment-frequency",
      target: "controllability"
    },
    {
      source: "deployment-frequency",
      target: "operability"
    },
    {
      source: "deployment-frequency",
      target: "testability"
    },
    {
      source: "deployment-frequency",
      target: "analysability"
    },
    {
      source: "deployment-frequency",
      target: "deployability"
    },
    {
      source: "deployment-frequency",
      target: "devops-metrics"
    },
    {
      source: "deployment-frequency",
      target: "releasability"
    },
    {
      source: "detailed-audit-log",
      target: "accountability"
    },
    {
      source: "detect-inconsistent-user-input",
      target: "usability"
    },
    {
      source: "detect-inconsistent-user-input",
      target: "consistency"
    },
    {
      source: "detect-inconsistent-user-input",
      target: "user-experience"
    },
    {
      source: "detect-inconsistent-user-input",
      target: "user-assistance"
    },
    {
      source: "detect-inconsistent-user-input",
      target: "interaction-capability"
    },
    {
      source: "devops-metrics",
      target: "operable"
    },
    {
      source: "devops-metrics",
      target: "controllability"
    },
    {
      source: "devops-metrics",
      target: "operability"
    },
    {
      source: "devops-metrics",
      target: "testability"
    },
    {
      source: "devops-metrics",
      target: "analysability"
    },
    {
      source: "devops-metrics",
      target: "deployability"
    },
    {
      source: "display-data-based-on-context",
      target: "adaptability"
    },
    {
      source: "display-data-based-on-context",
      target: "functional-appropriateness"
    },
    {
      source: "DORA-metrics",
      target: "operable"
    },
    {
      source: "DORA-metrics",
      target: "devops-metrics"
    },
    {
      source: "DORA-metrics",
      target: "deployability"
    },
    {
      source: "DORA-metrics",
      target: "deployment-frequency"
    },
    {
      source: "DORA-metrics",
      target: "operability"
    },
    {
      source: "ease-of-use",
      target: "operable"
    },
    {
      source: "ease-of-use",
      target: "usable"
    },
    {
      source: "ease-of-use",
      target: "attractiveness"
    },
    {
      source: "ease-of-use",
      target: "operability"
    },
    {
      source: "ease-of-use",
      target: "user-error-protection"
    },
    {
      source: "ease-of-use",
      target: "user-engagement"
    },
    {
      source: "ease-of-use",
      target: "user-experience"
    },
    {
      source: "ease-of-use",
      target: "user-interface-aesthetics"
    },
    {
      source: "ease-of-use",
      target: "user-assistance"
    },
    {
      source: "ease-of-use",
      target: "usability"
    },
    {
      source: "easy-ui",
      target: "ease-of-use"
    },
    {
      source: "easy-ui",
      target: "user-experience"
    },
    {
      source: "easy-ui",
      target: "usability"
    },
    {
      source: "easy-ui",
      target: "interaction-capability"
    },
    {
      source: "effectiveness",
      target: "efficient"
    },
    {
      source: "effectiveness",
      target: "efficiency"
    },
    {
      source: "efficiency",
      target: "efficient"
    },
    {
      source: "efficiency",
      target: "performance"
    },
    {
      source: "efficiency",
      target: "effectiveness"
    },
    {
      source: "efficient",
      target: "quality-root"
    },
    {
      source: "efficient-generation-of-test-data",
      target: "efficiency"
    },
    {
      source: "efficient-generation-of-test-data",
      target: "time-behaviour"
    },
    {
      source: "efficient-generation-of-test-data",
      target: "capacity"
    },
    {
      source: "efficient-save-function",
      target: "efficiency"
    },
    {
      source: "efficient-save-function",
      target: "time-behaviour"
    },
    {
      source: "efficient-save-function",
      target: "capacity"
    },
    {
      source: "elasticity",
      target: "flexible"
    },
    {
      source: "elasticity",
      target: "adaptability"
    },
    {
      source: "elasticity",
      target: "scalability"
    },
    {
      source: "elasticity",
      target: "flexibility"
    },
    {
      source: "employee-attempts-to-modify-pay-rate",
      target: "security"
    },
    {
      source: "employee-attempts-to-modify-pay-rate",
      target: "privacy"
    },
    {
      source: "employee-attempts-to-modify-pay-rate",
      target: "traceability"
    },
    {
      source: "employee-attempts-to-modify-pay-rate",
      target: "integrity"
    },
    {
      source: "encrypted-storage",
      target: "confidentiality"
    },
    {
      source: "encrypted-storage",
      target: "security"
    },
    {
      source: "encrypted-storage",
      target: "privacy"
    },
    {
      source: "energy-efficiency",
      target: "efficient"
    },
    {
      source: "energy-efficiency",
      target: "carbon-emission-efficiency"
    },
    {
      source: "energy-efficiency",
      target: "sustainability"
    },
    {
      source: "every-data-modification-is-logged",
      target: "security"
    },
    {
      source: "every-data-modification-is-logged",
      target: "privacy"
    },
    {
      source: "every-data-modification-is-logged",
      target: "traceability"
    },
    {
      source: "every-data-modification-is-logged",
      target: "recoverability"
    },
    {
      source: "expected-physical-environment",
      target: "suitable"
    },
    {
      source: "expected-physical-environment",
      target: "operable"
    },
    {
      source: "expected-physical-environment",
      target: "anticipated-workplace-environment"
    },
    {
      source: "explainability",
      target: "safe"
    },
    {
      source: "explainability",
      target: "suitable"
    },
    {
      source: "explainability",
      target: "accountability"
    },
    {
      source: "explainability",
      target: "analysability"
    },
    {
      source: "explainability",
      target: "clarity"
    },
    {
      source: "expressive-error-messages",
      target: "usability"
    },
    {
      source: "expressive-error-messages",
      target: "user-experience"
    },
    {
      source: "expressive-error-messages",
      target: "fault-isolation"
    },
    {
      source: "expressive-error-messages",
      target: "graceful-degradation"
    },
    {
      source: "expressive-error-messages",
      target: "hazard-warning"
    },
    {
      source: "expressive-error-messages",
      target: "user-assistance"
    },
    {
      source: "expressive-error-messages",
      target: "interaction-capability"
    },
    {
      source: "extensibility",
      target: "flexible"
    },
    {
      source: "extensibility",
      target: "adaptability"
    },
    {
      source: "extensibility",
      target: "modifiability"
    },
    {
      source: "extensibility",
      target: "changeability"
    },
    {
      source: "extensibility",
      target: "flexibility"
    },
    {
      source: "fail-safe",
      target: "safe"
    },
    {
      source: "fail-safe",
      target: "reliable"
    },
    {
      source: "fail-safe",
      target: "safety"
    },
    {
      source: "fail-safe",
      target: "robustness"
    },
    {
      source: "fast-accurate-sensor",
      target: "efficiency"
    },
    {
      source: "fast-accurate-sensor",
      target: "preciseness"
    },
    {
      source: "fast-accurate-sensor",
      target: "accuracy"
    },
    {
      source: "fast-creation-of-sales-report",
      target: "efficiency"
    },
    {
      source: "fast-creation-of-sales-report",
      target: "performance"
    },
    {
      source: "fast-creation-of-sales-report",
      target: "time-behaviour"
    },
    {
      source: "fast-creation-of-sales-report",
      target: "speed"
    },
    {
      source: "fast-creation-of-sales-report",
      target: "responsiveness"
    },
    {
      source: "fast-deployment",
      target: "time-behaviour"
    },
    {
      source: "fast-deployment",
      target: "operability"
    },
    {
      source: "fast-deployment",
      target: "deployment-frequency"
    },
    {
      source: "fast-deployment",
      target: "extensibility"
    },
    {
      source: "fast-deployment",
      target: "lead-time-for-changes"
    },
    {
      source: "fast-deployment",
      target: "cycle-time"
    },
    {
      source: "fast-rollout-of-changes",
      target: "efficiency"
    },
    {
      source: "fast-rollout-of-changes",
      target: "operability"
    },
    {
      source: "fast-rollout-of-changes",
      target: "speed"
    },
    {
      source: "fast-rollout-of-changes",
      target: "time-to-market"
    },
    {
      source: "fast-rollout-of-changes",
      target: "speed-to-market"
    },
    {
      source: "fast-startup-time",
      target: "time-behaviour"
    },
    {
      source: "fast-startup-time",
      target: "speed"
    },
    {
      source: "fast-startup-time",
      target: "performance"
    },
    {
      source: "fast-startup-time",
      target: "startup-time"
    },
    {
      source: "fast-startup-time",
      target: "elasticity"
    },
    {
      source: "fast-startup-time",
      target: "scalability"
    },
    {
      source: "fault-isolation",
      target: "safe"
    },
    {
      source: "fault-isolation",
      target: "reliable"
    },
    {
      source: "fault-isolation",
      target: "safety"
    },
    {
      source: "fault-isolation",
      target: "fail-safe"
    },
    {
      source: "fault-isolation",
      target: "fault-tolerance"
    },
    {
      source: "fault-isolation",
      target: "faultlessness"
    },
    {
      source: "fault-isolation",
      target: "risk-identification"
    },
    {
      source: "fault-isolation",
      target: "hazard-warning"
    },
    {
      source: "fault-tolerance",
      target: "reliable"
    },
    {
      source: "fault-tolerance",
      target: "usable"
    },
    {
      source: "fault-tolerance",
      target: "robustness"
    },
    {
      source: "fault-tolerance",
      target: "reliability"
    },
    {
      source: "fault-tolerance",
      target: "usability"
    },
    {
      source: "fault-tolerance",
      target: "availability"
    },
    {
      source: "fault-tolerance",
      target: "recoverability"
    },
    {
      source: "fault-tolerance",
      target: "faultlessness"
    },
    {
      source: "fault-tolerance",
      target: "graceful-degradation"
    },
    {
      source: "faultlessness",
      target: "reliable"
    },
    {
      source: "faultlessness",
      target: "usable"
    },
    {
      source: "faultlessness",
      target: "secure"
    },
    {
      source: "faultlessness",
      target: "dependability"
    },
    {
      source: "faultlessness",
      target: "reliability"
    },
    {
      source: "faultlessness",
      target: "availability"
    },
    {
      source: "features",
      target: "usable"
    },
    {
      source: "features",
      target: "functionality"
    },
    {
      source: "features",
      target: "functional-completeness"
    },
    {
      source: "features",
      target: "usability"
    },
    {
      source: "features",
      target: "functional-suitability"
    },
    {
      source: "flexibility",
      target: "flexible"
    },
    {
      source: "flexibility",
      target: "maintainability"
    },
    {
      source: "flexibility",
      target: "modularity"
    },
    {
      source: "flexibility",
      target: "adaptability"
    },
    {
      source: "flexibility",
      target: "configurability"
    },
    {
      source: "flexibility",
      target: "changeability"
    },
    {
      source: "flexibility",
      target: "agility"
    },
    {
      source: "flexible",
      target: "quality-root"
    },
    {
      source: "functional-appropriateness",
      target: "usable"
    },
    {
      source: "functional-appropriateness",
      target: "reliable"
    },
    {
      source: "functional-appropriateness",
      target: "suitable"
    },
    {
      source: "functional-appropriateness",
      target: "usability"
    },
    {
      source: "functional-appropriateness",
      target: "functionality"
    },
    {
      source: "functional-appropriateness",
      target: "functional-suitability"
    },
    {
      source: "functional-appropriateness",
      target: "suitability"
    },
    {
      source: "functional-completeness",
      target: "usable"
    },
    {
      source: "functional-completeness",
      target: "reliable"
    },
    {
      source: "functional-completeness",
      target: "suitable"
    },
    {
      source: "functional-completeness",
      target: "usability"
    },
    {
      source: "functional-completeness",
      target: "functionality"
    },
    {
      source: "functional-completeness",
      target: "functional-suitability"
    },
    {
      source: "functional-completeness",
      target: "correctness"
    },
    {
      source: "functional-correctness",
      target: "usable"
    },
    {
      source: "functional-correctness",
      target: "reliable"
    },
    {
      source: "functional-correctness",
      target: "suitable"
    },
    {
      source: "functional-correctness",
      target: "usability"
    },
    {
      source: "functional-correctness",
      target: "functionality"
    },
    {
      source: "functional-correctness",
      target: "functional-suitability"
    },
    {
      source: "functional-correctness",
      target: "correctness"
    },
    {
      source: "functional-suitability",
      target: "usable"
    },
    {
      source: "functional-suitability",
      target: "reliable"
    },
    {
      source: "functional-suitability",
      target: "suitable"
    },
    {
      source: "functional-suitability",
      target: "usability"
    },
    {
      source: "functional-suitability",
      target: "functionality"
    },
    {
      source: "functional-suitability",
      target: "functional-completeness"
    },
    {
      source: "functional-suitability",
      target: "suitability"
    },
    {
      source: "functionality",
      target: "usable"
    },
    {
      source: "functionality",
      target: "reliable"
    },
    {
      source: "functionality",
      target: "suitable"
    },
    {
      source: "functionality",
      target: "usability"
    },
    {
      source: "functionality",
      target: "functional-suitability"
    },
    {
      source: "functionality",
      target: "functional-correctness"
    },
    {
      source: "functionality",
      target: "functional-completeness"
    },
    {
      source: "global-explainability",
      target: "explainability"
    },
    {
      source: "good-code-readability-score",
      target: "readability"
    },
    {
      source: "good-code-readability-score",
      target: "legibility"
    },
    {
      source: "good-code-readability-score",
      target: "code-readability"
    },
    {
      source: "good-code-readability-score",
      target: "code-complexity"
    },
    {
      source: "graceful-degradation",
      target: "reliable"
    },
    {
      source: "graceful-degradation",
      target: "usable"
    },
    {
      source: "graceful-degradation",
      target: "robustness"
    },
    {
      source: "graceful-degradation",
      target: "reliability"
    },
    {
      source: "graceful-degradation",
      target: "usability"
    },
    {
      source: "graceful-degradation",
      target: "availability"
    },
    {
      source: "graceful-degradation",
      target: "recoverability"
    },
    {
      source: "graceful-degradation",
      target: "faultlessness"
    },
    {
      source: "graceful-degradation",
      target: "fault-tolerance"
    },
    {
      source: "handle-sudden-increase-in-traffic",
      target: "resilience"
    },
    {
      source: "handle-sudden-increase-in-traffic",
      target: "reliability"
    },
    {
      source: "handle-sudden-increase-in-traffic",
      target: "elasticity"
    },
    {
      source: "handle-sudden-increase-in-traffic",
      target: "scalability"
    },
    {
      source: "hazard-warning",
      target: "safe"
    },
    {
      source: "hazard-warning",
      target: "reliable"
    },
    {
      source: "hazard-warning",
      target: "safety"
    },
    {
      source: "hazard-warning",
      target: "robustness"
    },
    {
      source: "high-availability",
      target: "reliable"
    },
    {
      source: "high-availability",
      target: "usable"
    },
    {
      source: "high-availability",
      target: "availability"
    },
    {
      source: "high-availability",
      target: "robustness"
    },
    {
      source: "high-availability",
      target: "reliability"
    },
    {
      source: "high-availability",
      target: "usability"
    },
    {
      source: "high-availability",
      target: "fault-tolerance"
    },
    {
      source: "high-availability",
      target: "recoverability"
    },
    {
      source: "high-availability",
      target: "dependability"
    },
    {
      source: "high-availability",
      target: "faultlessness"
    },
    {
      source: "high-availability",
      target: "recovery-time"
    },
    {
      source: "high-precision-calculation",
      target: "reliability"
    },
    {
      source: "high-precision-calculation",
      target: "preciseness"
    },
    {
      source: "high-precision-calculation",
      target: "accuracy"
    },
    {
      source: "high-precision-calculation",
      target: "correctness"
    },
    {
      source: "i18n",
      target: "usable"
    },
    {
      source: "i18n",
      target: "usability"
    },
    {
      source: "i18n",
      target: "adaptability"
    },
    {
      source: "i18n",
      target: "configurability"
    },
    {
      source: "i18n",
      target: "ease-of-use"
    },
    {
      source: "i18n",
      target: "modifiability"
    },
    {
      source: "i18n",
      target: "user-assistance"
    },
    {
      source: "i18n",
      target: "user-experience"
    },
    {
      source: "immunity",
      target: "secure"
    },
    {
      source: "immunity",
      target: "reliable"
    },
    {
      source: "immunity",
      target: "vulnerability"
    },
    {
      source: "immunity",
      target: "intrusion-detection"
    },
    {
      source: "immunity",
      target: "intrusion-prevention"
    },
    {
      source: "inclusive-user-testing",
      target: "usability"
    },
    {
      source: "inclusive-user-testing",
      target: "inclusivity"
    },
    {
      source: "inclusive-user-testing",
      target: "interaction-capability"
    },
    {
      source: "inclusivity",
      target: "usable"
    },
    {
      source: "inclusivity",
      target: "usability"
    },
    {
      source: "inclusivity",
      target: "functionality"
    },
    {
      source: "inclusivity",
      target: "attractiveness"
    },
    {
      source: "inclusivity",
      target: "user-error-protection"
    },
    {
      source: "inclusivity",
      target: "ease-of-use"
    },
    {
      source: "independence",
      target: "flexible"
    },
    {
      source: "independence",
      target: "maintainability"
    },
    {
      source: "independence",
      target: "modularity"
    },
    {
      source: "independence",
      target: "adaptability"
    },
    {
      source: "independence",
      target: "configurability"
    },
    {
      source: "independence",
      target: "changeability"
    },
    {
      source: "independence",
      target: "agility"
    },
    {
      source: "independence",
      target: "flexibility"
    },
    {
      source: "independent-enhancement-of-subsystem",
      target: "efficiency"
    },
    {
      source: "independent-enhancement-of-subsystem",
      target: "maintainability"
    },
    {
      source: "independent-enhancement-of-subsystem",
      target: "changeability"
    },
    {
      source: "independent-enhancement-of-subsystem",
      target: "adaptability"
    },
    {
      source: "independent-enhancement-of-subsystem",
      target: "agility"
    },
    {
      source: "independent-replacement-of-subsystem",
      target: "adaptability"
    },
    {
      source: "independent-replacement-of-subsystem",
      target: "agility"
    },
    {
      source: "independent-replacement-of-subsystem",
      target: "changeability"
    },
    {
      source: "independent-replacement-of-subsystem",
      target: "efficiency"
    },
    {
      source: "independent-replacement-of-subsystem",
      target: "maintainability"
    },
    {
      source: "information-security",
      target: "secure"
    },
    {
      source: "information-security",
      target: "reliable"
    },
    {
      source: "information-security",
      target: "integrity"
    },
    {
      source: "information-security",
      target: "availability"
    },
    {
      source: "information-security",
      target: "non-repudiation"
    },
    {
      source: "information-security",
      target: "confidentiality"
    },
    {
      source: "information-security",
      target: "accountability"
    },
    {
      source: "information-security",
      target: "authenticity"
    },
    {
      source: "information-security",
      target: "resistance"
    },
    {
      source: "information-security",
      target: "cyber-security"
    },
    {
      source: "installability",
      target: "operable"
    },
    {
      source: "installability",
      target: "flexible"
    },
    {
      source: "installability",
      target: "maintainability"
    },
    {
      source: "installability",
      target: "analysability"
    },
    {
      source: "installability",
      target: "operability"
    },
    {
      source: "installability",
      target: "deployability"
    },
    {
      source: "integrity",
      target: "secure"
    },
    {
      source: "integrity",
      target: "confidentiality"
    },
    {
      source: "integrity",
      target: "security"
    },
    {
      source: "interaction-capability",
      target: "usable"
    },
    {
      source: "interaction-capability",
      target: "operable"
    },
    {
      source: "interaction-capability",
      target: "usability"
    },
    {
      source: "interaction-capability",
      target: "functionality"
    },
    {
      source: "interaction-capability",
      target: "inclusivity"
    },
    {
      source: "interaction-capability",
      target: "attractiveness"
    },
    {
      source: "interaction-capability",
      target: "operability"
    },
    {
      source: "interaction-capability",
      target: "user-error-protection"
    },
    {
      source: "interaction-capability",
      target: "user-engagement"
    },
    {
      source: "interaction-capability",
      target: "ease-of-use"
    },
    {
      source: "internationalization",
      target: "flexible"
    },
    {
      source: "internationalization",
      target: "usable"
    },
    {
      source: "internationalization",
      target: "localizability"
    },
    {
      source: "internationalization",
      target: "adaptability"
    },
    {
      source: "internationalization",
      target: "modifiability"
    },
    {
      source: "internationalization",
      target: "maintainability"
    },
    {
      source: "internationalization",
      target: "internationalization"
    },
    {
      source: "interoperability",
      target: "usable"
    },
    {
      source: "interoperability",
      target: "operable"
    },
    {
      source: "interoperability",
      target: "co-existence"
    },
    {
      source: "interoperability",
      target: "compatibility"
    },
    {
      source: "interoperable-with-java-12",
      target: "compatibility"
    },
    {
      source: "interoperable-with-java-12",
      target: "interoperability"
    },
    {
      source: "interoperable-with-java-12",
      target: "backward-compatibility"
    },
    {
      source: "interruptable-backend-process",
      target: "usability"
    },
    {
      source: "interruptable-backend-process",
      target: "user-experience"
    },
    {
      source: "interruptable-backend-process",
      target: "time-behaviour"
    },
    {
      source: "interruptable-backend-process",
      target: "interaction-capability"
    },
    {
      source: "intrusion-detection",
      target: "secure"
    },
    {
      source: "intrusion-detection",
      target: "intrusion-prevention"
    },
    {
      source: "intrusion-prevention",
      target: "secure"
    },
    {
      source: "intrusion-prevention",
      target: "intrusion-detection"
    },
    {
      source: "jitter",
      target: "efficient"
    },
    {
      source: "jitter",
      target: "performance"
    },
    {
      source: "jitter",
      target: "latency"
    },
    {
      source: "jitter",
      target: "predictability"
    },
    {
      source: "keep-data-on-error",
      target: "reliability"
    },
    {
      source: "keep-data-on-error",
      target: "robustness"
    },
    {
      source: "keep-data-on-error",
      target: "ease-of-use"
    },
    {
      source: "keep-data-on-error",
      target: "user-experience"
    },
    {
      source: "keep-data-on-error",
      target: "interaction-capability"
    },
    {
      source: "latency",
      target: "efficient"
    },
    {
      source: "latency",
      target: "usable"
    },
    {
      source: "latency",
      target: "operable"
    },
    {
      source: "latency",
      target: "performance"
    },
    {
      source: "latency",
      target: "time-behaviour"
    },
    {
      source: "lead-time-for-changes",
      target: "operable"
    },
    {
      source: "lead-time-for-changes",
      target: "controllability"
    },
    {
      source: "lead-time-for-changes",
      target: "operability"
    },
    {
      source: "lead-time-for-changes",
      target: "testability"
    },
    {
      source: "lead-time-for-changes",
      target: "deployability"
    },
    {
      source: "learnability",
      target: "usable"
    },
    {
      source: "learnability",
      target: "operable"
    },
    {
      source: "learnability",
      target: "usability"
    },
    {
      source: "learnability",
      target: "user-error-protection"
    },
    {
      source: "learnability",
      target: "user-engagement"
    },
    {
      source: "learnability",
      target: "conciseness"
    },
    {
      source: "learnability",
      target: "understandability"
    },
    {
      source: "learnability-find-article",
      target: "usability"
    },
    {
      source: "learnability-find-article",
      target: "user-experience"
    },
    {
      source: "legal-requirements",
      target: "usable"
    },
    {
      source: "legal-requirements",
      target: "operable"
    },
    {
      source: "legal-requirements",
      target: "accountability"
    },
    {
      source: "legal-requirements",
      target: "adaptability"
    },
    {
      source: "legal-requirements",
      target: "operational-constraint"
    },
    {
      source: "legal-requirements",
      target: "correctness"
    },
    {
      source: "legibility",
      target: "usable"
    },
    {
      source: "legibility",
      target: "usability"
    },
    {
      source: "legibility",
      target: "understandability"
    },
    {
      source: "local-explainability",
      target: "explainability"
    },
    {
      source: "localizability",
      target: "flexible"
    },
    {
      source: "localizability",
      target: "usable"
    },
    {
      source: "localizability",
      target: "localizability"
    },
    {
      source: "localizability",
      target: "adaptability"
    },
    {
      source: "localizability",
      target: "modifiability"
    },
    {
      source: "localizability",
      target: "maintainability"
    },
    {
      source: "localizability",
      target: "internationalization"
    },
    {
      source: "localizable-to-n-languages",
      target: "flexibility"
    },
    {
      source: "localizable-to-n-languages",
      target: "maintainability"
    },
    {
      source: "localizable-to-n-languages",
      target: "modifiability"
    },
    {
      source: "localizable-to-n-languages",
      target: "adaptability"
    },
    {
      source: "localizable-to-n-languages",
      target: "accessibility"
    },
    {
      source: "localizable-to-n-languages",
      target: "localizability"
    },
    {
      source: "localizable-to-n-languages",
      target: "internationalization"
    },
    {
      source: "long-running-without-reboot",
      target: "mean-time-between-failures"
    },
    {
      source: "long-running-without-reboot",
      target: "stability"
    },
    {
      source: "long-running-without-reboot",
      target: "reliability"
    },
    {
      source: "long-running-without-reboot",
      target: "availability"
    },
    {
      source: "long-running-without-reboot",
      target: "high-availability"
    },
    {
      source: "longevity",
      target: "reliable"
    },
    {
      source: "longevity",
      target: "flexible"
    },
    {
      source: "longevity",
      target: "reliability"
    },
    {
      source: "longevity",
      target: "adaptability"
    },
    {
      source: "longevity",
      target: "modifiability"
    },
    {
      source: "loose-coupling",
      target: "efficient"
    },
    {
      source: "loose-coupling",
      target: "flexible"
    },
    {
      source: "loose-coupling",
      target: "suitable"
    },
    {
      source: "loose-coupling",
      target: "coherence"
    },
    {
      source: "loose-coupling",
      target: "modularity"
    },
    {
      source: "loose-coupling",
      target: "cohesion"
    },
    {
      source: "low-change-failure-rate",
      target: "change-failure-rate"
    },
    {
      source: "low-change-failure-rate",
      target: "reliability"
    },
    {
      source: "low-effort-deployment",
      target: "compatibility"
    },
    {
      source: "low-effort-deployment",
      target: "interoperability"
    },
    {
      source: "low-effort-deployment",
      target: "portability"
    },
    {
      source: "low-impact-diagnosis",
      target: "efficiency"
    },
    {
      source: "low-impact-diagnosis",
      target: "time-behaviour"
    },
    {
      source: "low-impact-diagnosis",
      target: "resource-efficiency"
    },
    {
      source: "luggage-routing",
      target: "flexibility"
    },
    {
      source: "luggage-routing",
      target: "changeability"
    },
    {
      source: "luggage-routing",
      target: "adaptability"
    },
    {
      source: "luggage-routing",
      target: "configurability"
    },
    {
      source: "maintainability",
      target: "flexible"
    },
    {
      source: "maintainability",
      target: "flexibility"
    },
    {
      source: "maintainability",
      target: "adaptability"
    },
    {
      source: "maintainability",
      target: "changeability"
    },
    {
      source: "maintainability",
      target: "configurability"
    },
    {
      source: "maintainability",
      target: "modularity"
    },
    {
      source: "maintainable-checking-strategy",
      target: "efficiency"
    },
    {
      source: "maintainable-checking-strategy",
      target: "maintainability"
    },
    {
      source: "mean-time-between-failures",
      target: "operable"
    },
    {
      source: "mean-time-between-failures",
      target: "controllability"
    },
    {
      source: "mean-time-between-failures",
      target: "operability"
    },
    {
      source: "mean-time-between-failures",
      target: "testability"
    },
    {
      source: "mean-time-between-failures",
      target: "analysability"
    },
    {
      source: "mean-time-between-failures",
      target: "devops-metrics"
    },
    {
      source: "mean-time-between-failures",
      target: "mean-time-to-recovery"
    },
    {
      source: "mean-time-to-recovery",
      target: "operable"
    },
    {
      source: "mean-time-to-recovery",
      target: "suitable"
    },
    {
      source: "mean-time-to-recovery",
      target: "controllability"
    },
    {
      source: "mean-time-to-recovery",
      target: "operability"
    },
    {
      source: "mean-time-to-recovery",
      target: "testability"
    },
    {
      source: "mean-time-to-recovery",
      target: "analysability"
    },
    {
      source: "mean-time-to-recovery",
      target: "deployability"
    },
    {
      source: "mean-time-to-recovery",
      target: "devops-metrics"
    },
    {
      source: "memory-usage",
      target: "efficient"
    },
    {
      source: "memory-usage",
      target: "efficiency"
    },
    {
      source: "memory-usage",
      target: "capacity"
    },
    {
      source: "memory-usage",
      target: "time-behaviour"
    },
    {
      source: "memory-usage",
      target: "resource-utilization"
    },
    {
      source: "minimize-jitter",
      target: "jitter"
    },
    {
      source: "minimize-jitter",
      target: "predictability"
    },
    {
      source: "minimize-jitter",
      target: "latency"
    },
    {
      source: "modifiability",
      target: "flexible"
    },
    {
      source: "modifiability",
      target: "flexibility"
    },
    {
      source: "modifiability",
      target: "adaptability"
    },
    {
      source: "modifiability",
      target: "changeability"
    },
    {
      source: "modifiability",
      target: "configurability"
    },
    {
      source: "modular-system-for-data-analysis",
      target: "composability"
    },
    {
      source: "modular-system-for-data-analysis",
      target: "modularity"
    },
    {
      source: "modular-system-for-data-analysis",
      target: "stability"
    },
    {
      source: "modularity",
      target: "flexible"
    },
    {
      source: "modularity",
      target: "flexibility"
    },
    {
      source: "modularity",
      target: "adaptability"
    },
    {
      source: "modularity",
      target: "changeability"
    },
    {
      source: "modularity",
      target: "configurability"
    },
    {
      source: "modularity",
      target: "maintainability"
    },
    {
      source: "modularity",
      target: "modifiability"
    },
    {
      source: "modularity",
      target: "composability"
    },
    {
      source: "mttr-12h",
      target: "availability"
    },
    {
      source: "mttr-12h",
      target: "high-availability"
    },
    {
      source: "mttr-12h",
      target: "reliability"
    },
    {
      source: "mttr-12h",
      target: "operability"
    },
    {
      source: "mttr-12h",
      target: "mean-time-to-recovery"
    },
    {
      source: "mttr-12h",
      target: "interaction-capability"
    },
    {
      source: "multilinguality-support",
      target: "usability"
    },
    {
      source: "multilinguality-support",
      target: "inclusivity"
    },
    {
      source: "multilinguality-support",
      target: "accessibility"
    },
    {
      source: "multilinguality-support",
      target: "interaction-capability"
    },
    {
      source: "near-instant-search-results",
      target: "efficiency"
    },
    {
      source: "near-instant-search-results",
      target: "performance"
    },
    {
      source: "near-instant-search-results",
      target: "time-behaviour"
    },
    {
      source: "near-instant-search-results",
      target: "speed"
    },
    {
      source: "near-instant-search-results",
      target: "interaction-capability"
    },
    {
      source: "new-features-introduct-no-bugs",
      target: "predictability"
    },
    {
      source: "new-features-introduct-no-bugs",
      target: "reliability"
    },
    {
      source: "new-features-introduct-no-bugs",
      target: "changeability"
    },
    {
      source: "non-repudiation",
      target: "secure"
    },
    {
      source: "non-repudiation",
      target: "integrity"
    },
    {
      source: "non-repudiation",
      target: "authenticity"
    },
    {
      source: "non-repudiation",
      target: "security"
    },
    {
      source: "non-repudiation",
      target: "accountability"
    },
    {
      source: "observability",
      target: "operable"
    },
    {
      source: "observability",
      target: "analysability"
    },
    {
      source: "observability",
      target: "testability"
    },
    {
      source: "only-authenticated-users-can-access",
      target: "confidentiality"
    },
    {
      source: "only-authenticated-users-can-access",
      target: "security"
    },
    {
      source: "only-authenticated-users-can-access",
      target: "privacy"
    },
    {
      source: "operability",
      target: "usable"
    },
    {
      source: "operability",
      target: "operable"
    },
    {
      source: "operability",
      target: "usability"
    },
    {
      source: "operability",
      target: "user-error-protection"
    },
    {
      source: "operability",
      target: "controllability"
    },
    {
      source: "operability",
      target: "robustness"
    },
    {
      source: "operable",
      target: "quality-root"
    },
    {
      source: "operational-constraint",
      target: "safe"
    },
    {
      source: "operational-constraint",
      target: "reliable"
    },
    {
      source: "operational-constraint",
      target: "availability"
    },
    {
      source: "operational-constraint",
      target: "robustness"
    },
    {
      source: "operational-constraint",
      target: "flexibility"
    },
    {
      source: "operational-constraint",
      target: "safety"
    },
    {
      source: "operational-environment-requirements",
      target: "operable"
    },
    {
      source: "operational-environment-requirements",
      target: "expected-physical-environment"
    },
    {
      source: "operational-environment-requirements",
      target: "operational-constraint"
    },
    {
      source: "order-queue",
      target: "fault-tolerance"
    },
    {
      source: "order-queue",
      target: "recoverability"
    },
    {
      source: "parallel-data-modification",
      target: "performance"
    },
    {
      source: "patient-safety",
      target: "safe"
    },
    {
      source: "patient-safety",
      target: "reliable"
    },
    {
      source: "patient-safety",
      target: "secure"
    },
    {
      source: "patient-safety",
      target: "safety"
    },
    {
      source: "patient-safety",
      target: "robustness"
    },
    {
      source: "performance",
      target: "efficient"
    },
    {
      source: "performance",
      target: "efficiency"
    },
    {
      source: "performance",
      target: "resource-efficiency"
    },
    {
      source: "performance",
      target: "speed"
    },
    {
      source: "performance-efficiency",
      target: "efficient"
    },
    {
      source: "performance-efficiency",
      target: "efficiency"
    },
    {
      source: "performance-efficiency",
      target: "resource-efficiency"
    },
    {
      source: "performance-efficiency",
      target: "speed"
    },
    {
      source: "performance-efficiency",
      target: "performance"
    },
    {
      source: "personalization",
      target: "flexible"
    },
    {
      source: "personalization",
      target: "customizability"
    },
    {
      source: "portability",
      target: "flexible"
    },
    {
      source: "portability",
      target: "operable"
    },
    {
      source: "portability",
      target: "compatibility"
    },
    {
      source: "portability",
      target: "flexibility"
    },
    {
      source: "portability",
      target: "installability"
    },
    {
      source: "portability",
      target: "interoperability"
    },
    {
      source: "portability",
      target: "maintainability"
    },
    {
      source: "portability",
      target: "configurability"
    },
    {
      source: "portability",
      target: "replaceability"
    },
    {
      source: "portable-business-data-checker",
      target: "portability"
    },
    {
      source: "portable-business-data-checker",
      target: "adaptability"
    },
    {
      source: "portable-business-data-checker",
      target: "flexibility"
    },
    {
      source: "precise-vehicle-orientation-gps",
      target: "accuracy"
    },
    {
      source: "precise-vehicle-orientation-gps",
      target: "preciseness"
    },
    {
      source: "precise-vehicle-orientation-gps",
      target: "precision"
    },
    {
      source: "precise-vehicle-orientation-gps",
      target: "reliability"
    },
    {
      source: "precise-vehicle-orientation-gps",
      target: "functional-correctness"
    },
    {
      source: "preciseness",
      target: "reliable"
    },
    {
      source: "preciseness",
      target: "usable"
    },
    {
      source: "preciseness",
      target: "correctness"
    },
    {
      source: "preciseness",
      target: "accuracy"
    },
    {
      source: "precision",
      target: "reliable"
    },
    {
      source: "precision",
      target: "usable"
    },
    {
      source: "precision",
      target: "correctness"
    },
    {
      source: "precision",
      target: "accuracy"
    },
    {
      source: "precision",
      target: "preciseness"
    },
    {
      source: "predictability",
      target: "reliable"
    },
    {
      source: "predictability",
      target: "reliability"
    },
    {
      source: "predictability",
      target: "correctness"
    },
    {
      source: "privacy",
      target: "secure"
    },
    {
      source: "privacy",
      target: "security"
    },
    {
      source: "privacy",
      target: "confidentiality"
    },
    {
      source: "profitability",
      target: "efficient"
    },
    {
      source: "profitability",
      target: "time-to-market"
    },
    {
      source: "profitability",
      target: "budget-constraint"
    },
    {
      source: "profitability",
      target: "cost"
    },
    {
      source: "profitability",
      target: "affordability"
    },
    {
      source: "protect-data-by-security-procols",
      target: "safety"
    },
    {
      source: "protect-data-by-security-procols",
      target: "cyber-security"
    },
    {
      source: "protect-data-by-security-procols",
      target: "security"
    },
    {
      source: "protect-data-by-security-procols",
      target: "information-security"
    },
    {
      source: "protect-data-by-security-procols",
      target: "patient-safety"
    },
    {
      source: "query-execution-management",
      target: "efficiency"
    },
    {
      source: "query-execution-management",
      target: "time-behaviour"
    },
    {
      source: "query-execution-management",
      target: "memory-usage"
    },
    {
      source: "query-execution-management",
      target: "resource-efficiency"
    },
    {
      source: "query-execution-management",
      target: "resource-utilization"
    },
    {
      source: "quick-unit-tests",
      target: "testability"
    },
    {
      source: "quickly-locate-bugs",
      target: "efficiency"
    },
    {
      source: "quickly-locate-bugs",
      target: "maintainability"
    },
    {
      source: "readability",
      target: "usable"
    },
    {
      source: "readability",
      target: "usability"
    },
    {
      source: "readability",
      target: "understandability"
    },
    {
      source: "readability",
      target: "legibility"
    },
    {
      source: "readability",
      target: "code-readability"
    },
    {
      source: "recognize-assistive-technology",
      target: "usability"
    },
    {
      source: "recognize-assistive-technology",
      target: "inclusivity"
    },
    {
      source: "recognize-assistive-technology",
      target: "accessibility"
    },
    {
      source: "recognize-assistive-technology",
      target: "interaction-capability"
    },
    {
      source: "recoverability",
      target: "reliable"
    },
    {
      source: "recoverability",
      target: "usable"
    },
    {
      source: "recoverability",
      target: "robustness"
    },
    {
      source: "recoverability",
      target: "reliability"
    },
    {
      source: "recoverability",
      target: "usability"
    },
    {
      source: "recoverability",
      target: "availability"
    },
    {
      source: "recoverability",
      target: "faultlessness"
    },
    {
      source: "recoverability",
      target: "fault-tolerance"
    },
    {
      source: "recovery-time",
      target: "reliable"
    },
    {
      source: "recovery-time",
      target: "recoverability"
    },
    {
      source: "recovery-time",
      target: "fault-tolerance"
    },
    {
      source: "recovery-time",
      target: "availability"
    },
    {
      source: "recovery-time",
      target: "resilience"
    },
    {
      source: "recovery-time",
      target: "high-availability"
    },
    {
      source: "reduce-energy-consumption-with-new-version",
      target: "sustainability"
    },
    {
      source: "reduce-energy-consumption-with-new-version",
      target: "carbon-emission-efficiency"
    },
    {
      source: "reduce-energy-consumption-with-new-version",
      target: "energy-efficiency"
    },
    {
      source: "releasability",
      target: "operable"
    },
    {
      source: "releasability",
      target: "efficient"
    },
    {
      source: "releasability",
      target: "operability"
    },
    {
      source: "releasability",
      target: "deployability"
    },
    {
      source: "releasability",
      target: "deployment-frequency"
    },
    {
      source: "reliability",
      target: "reliable"
    },
    {
      source: "reliability",
      target: "availability"
    },
    {
      source: "reliability",
      target: "robustness"
    },
    {
      source: "reliability",
      target: "fault-tolerance"
    },
    {
      source: "reliability",
      target: "dependability"
    },
    {
      source: "reliability",
      target: "resilience"
    },
    {
      source: "reliable",
      target: "quality-root"
    },
    {
      source: "reliable-backup-and-restore",
      target: "patient-safety"
    },
    {
      source: "reliable-backup-and-restore",
      target: "safety"
    },
    {
      source: "reliable-backup-and-restore",
      target: "reliability"
    },
    {
      source: "reliable-backup-and-restore",
      target: "availability"
    },
    {
      source: "reliable-erh-system",
      target: "patient-safety"
    },
    {
      source: "reliable-erh-system",
      target: "safety"
    },
    {
      source: "reliable-erh-system",
      target: "reliability"
    },
    {
      source: "reliable-erh-system",
      target: "efficiency"
    },
    {
      source: "reliable-erh-system",
      target: "availability"
    },
    {
      source: "replaceability",
      target: "operable"
    },
    {
      source: "replaceability",
      target: "flexible"
    },
    {
      source: "replaceability",
      target: "installability"
    },
    {
      source: "replaceability",
      target: "analysability"
    },
    {
      source: "replaceability",
      target: "operability"
    },
    {
      source: "replaceability",
      target: "deployability"
    },
    {
      source: "reproducibility",
      target: "usable"
    },
    {
      source: "reproducibility",
      target: "consistency"
    },
    {
      source: "reproducibility",
      target: "understandability"
    },
    {
      source: "resilience",
      target: "reliable"
    },
    {
      source: "resilience",
      target: "secure"
    },
    {
      source: "resilience",
      target: "availability"
    },
    {
      source: "resistance",
      target: "secure"
    },
    {
      source: "resistance",
      target: "integrity"
    },
    {
      source: "resistance",
      target: "security"
    },
    {
      source: "resistance",
      target: "dependability"
    },
    {
      source: "resistance",
      target: "fault-tolerance"
    },
    {
      source: "resistance",
      target: "recoverability"
    },
    {
      source: "resource-efficiency",
      target: "efficient"
    },
    {
      source: "resource-efficiency",
      target: "efficiency"
    },
    {
      source: "resource-efficiency",
      target: "resource-utilization"
    },
    {
      source: "resource-efficiency",
      target: "performance"
    },
    {
      source: "resource-utilization",
      target: "efficient"
    },
    {
      source: "resource-utilization",
      target: "efficiency"
    },
    {
      source: "resource-utilization",
      target: "resource-efficiency"
    },
    {
      source: "resource-utilization",
      target: "speed"
    },
    {
      source: "resource-utilization",
      target: "performance"
    },
    {
      source: "resource-utilization",
      target: "time-behaviour"
    },
    {
      source: "resource-utilization",
      target: "memory-usage"
    },
    {
      source: "respond-to-15000-requests-per-workday",
      target: "capacity"
    },
    {
      source: "respond-to-15000-requests-per-workday",
      target: "resource-efficiency"
    },
    {
      source: "response-time",
      target: "efficient"
    },
    {
      source: "response-time",
      target: "performance"
    },
    {
      source: "response-time",
      target: "speed"
    },
    {
      source: "response-time",
      target: "time-behaviour"
    },
    {
      source: "response-time-for-image-rendering",
      target: "response-time"
    },
    {
      source: "response-time-for-image-rendering",
      target: "efficiency"
    },
    {
      source: "response-time-for-image-rendering",
      target: "performance"
    },
    {
      source: "response-time-for-image-rendering",
      target: "time-behaviour"
    },
    {
      source: "response-time-for-image-rendering",
      target: "speed"
    },
    {
      source: "response-time-for-image-rendering",
      target: "responsiveness"
    },
    {
      source: "responsiveness",
      target: "usable"
    },
    {
      source: "responsiveness",
      target: "efficient"
    },
    {
      source: "responsiveness",
      target: "response-time"
    },
    {
      source: "responsiveness",
      target: "usability"
    },
    {
      source: "responsiveness",
      target: "user-experience"
    },
    {
      source: "restore-filter-after-log-in",
      target: "functional-appropriateness"
    },
    {
      source: "restricted-memory",
      target: "efficiency"
    },
    {
      source: "restricted-memory",
      target: "resource-efficiency"
    },
    {
      source: "restricted-memory",
      target: "memory-usage"
    },
    {
      source: "reusability",
      target: "flexible"
    },
    {
      source: "reusability",
      target: "flexibility"
    },
    {
      source: "reusability",
      target: "adaptability"
    },
    {
      source: "reusability",
      target: "changeability"
    },
    {
      source: "reusability",
      target: "configurability"
    },
    {
      source: "reusability",
      target: "maintainability"
    },
    {
      source: "reusability",
      target: "modifiability"
    },
    {
      source: "risk-identification",
      target: "safe"
    },
    {
      source: "risk-identification",
      target: "reliable"
    },
    {
      source: "risk-identification",
      target: "safety"
    },
    {
      source: "risk-identification",
      target: "analysability"
    },
    {
      source: "robustness",
      target: "reliable"
    },
    {
      source: "robustness",
      target: "resilience"
    },
    {
      source: "robustness",
      target: "dependability"
    },
    {
      source: "robustness",
      target: "reliability"
    },
    {
      source: "rollout-new-feature",
      target: "agility"
    },
    {
      source: "rollout-new-feature",
      target: "changeability"
    },
    {
      source: "rollout-new-feature",
      target: "maintainability"
    },
    {
      source: "safe",
      target: "quality-root"
    },
    {
      source: "safe-integration",
      target: "safe"
    },
    {
      source: "safe-integration",
      target: "reliable"
    },
    {
      source: "safe-integration",
      target: "safety"
    },
    {
      source: "safe-integration",
      target: "robustness"
    },
    {
      source: "safety",
      target: "safe"
    },
    {
      source: "safety",
      target: "reliable"
    },
    {
      source: "safety",
      target: "secure"
    },
    {
      source: "safety",
      target: "availability"
    },
    {
      source: "safety",
      target: "robustness"
    },
    {
      source: "scalability",
      target: "flexible"
    },
    {
      source: "scalability",
      target: "adaptability"
    },
    {
      source: "scalability",
      target: "elasticity"
    },
    {
      source: "scalability",
      target: "performance"
    },
    {
      source: "scale-up-in-2-minutes",
      target: "elasticity"
    },
    {
      source: "scale-up-in-2-minutes",
      target: "scalability"
    },
    {
      source: "scale-up-in-2-minutes",
      target: "performance"
    },
    {
      source: "securability",
      target: "secure"
    },
    {
      source: "securability",
      target: "security"
    },
    {
      source: "secure",
      target: "quality-root"
    },
    {
      source: "security",
      target: "secure"
    },
    {
      source: "security",
      target: "reliable"
    },
    {
      source: "security",
      target: "integrity"
    },
    {
      source: "security",
      target: "availability"
    },
    {
      source: "security",
      target: "non-repudiation"
    },
    {
      source: "security",
      target: "confidentiality"
    },
    {
      source: "security",
      target: "accountability"
    },
    {
      source: "security",
      target: "authenticity"
    },
    {
      source: "security",
      target: "resistance"
    },
    {
      source: "self-containedness",
      target: "flexible"
    },
    {
      source: "self-containedness",
      target: "flexibility"
    },
    {
      source: "self-containedness",
      target: "adaptability"
    },
    {
      source: "self-containedness",
      target: "changeability"
    },
    {
      source: "self-containedness",
      target: "configurability"
    },
    {
      source: "self-containedness",
      target: "maintainability"
    },
    {
      source: "self-containedness",
      target: "modifiability"
    },
    {
      source: "self-containedness",
      target: "modularity"
    },
    {
      source: "self-descriptiveness",
      target: "usable"
    },
    {
      source: "self-descriptiveness",
      target: "usability"
    },
    {
      source: "self-descriptiveness",
      target: "user-assistance"
    },
    {
      source: "self-descriptiveness",
      target: "user-experience"
    },
    {
      source: "self-descriptiveness",
      target: "learnability"
    },
    {
      source: "self-descriptiveness",
      target: "conciseness"
    },
    {
      source: "server-fails-operation-without-downtime",
      target: "reliability"
    },
    {
      source: "server-fails-operation-without-downtime",
      target: "availability"
    },
    {
      source: "server-fails-operation-without-downtime",
      target: "high-availability"
    },
    {
      source: "server-fails-operation-without-downtime",
      target: "fault-tolerance"
    },
    {
      source: "server-fails-operation-without-downtime",
      target: "stability"
    },
    {
      source: "shutdown-to-safe-state",
      target: "dependability"
    },
    {
      source: "shutdown-to-safe-state",
      target: "safety"
    },
    {
      source: "shutdown-to-safe-state",
      target: "operability"
    },
    {
      source: "shutdown-to-safe-state",
      target: "fail-safe"
    },
    {
      source: "shutdown-to-safe-state",
      target: "reliability"
    },
    {
      source: "simplicity",
      target: "efficient"
    },
    {
      source: "simplicity",
      target: "usable"
    },
    {
      source: "simplicity",
      target: "efficiency"
    },
    {
      source: "simplicity",
      target: "modularity"
    },
    {
      source: "speed",
      target: "efficient"
    },
    {
      source: "speed",
      target: "efficiency"
    },
    {
      source: "speed",
      target: "performance"
    },
    {
      source: "speed",
      target: "performance"
    },
    {
      source: "speed",
      target: "time-behaviour"
    },
    {
      source: "speed-to-market",
      target: "efficient"
    },
    {
      source: "speed-to-market",
      target: "flexibility"
    },
    {
      source: "speed-to-market",
      target: "efficiency"
    },
    {
      source: "speed-to-market",
      target: "deployment-frequency"
    },
    {
      source: "speed-to-market",
      target: "extensibility"
    },
    {
      source: "speed-to-market",
      target: "lead-time-for-changes"
    },
    {
      source: "speed-to-market",
      target: "cycle-time"
    },
    {
      source: "stability",
      target: "reliable"
    },
    {
      source: "stability",
      target: "reliability"
    },
    {
      source: "stability",
      target: "adaptability"
    },
    {
      source: "stability",
      target: "changeability"
    },
    {
      source: "standard-compliance",
      target: "secure"
    },
    {
      source: "standard-compliance",
      target: "safe"
    },
    {
      source: "standard-compliance",
      target: "usable"
    },
    {
      source: "standard-compliance",
      target: "reliable"
    },
    {
      source: "standard-compliance",
      target: "efficient"
    },
    {
      source: "standard-compliance",
      target: "suitable"
    },
    {
      source: "standard-compliance",
      target: "compliance"
    },
    {
      source: "startup-time",
      target: "efficient"
    },
    {
      source: "startup-time",
      target: "efficiency"
    },
    {
      source: "startup-time",
      target: "performance"
    },
    {
      source: "startup-time",
      target: "performance"
    },
    {
      source: "startup-time",
      target: "time-behaviour"
    },
    {
      source: "suitability",
      target: "usable"
    },
    {
      source: "suitability",
      target: "reliable"
    },
    {
      source: "suitability",
      target: "suitable"
    },
    {
      source: "suitability",
      target: "usability"
    },
    {
      source: "suitability",
      target: "functionality"
    },
    {
      source: "suitability",
      target: "functional-completeness"
    },
    {
      source: "suitable",
      target: "quality-root"
    },
    {
      source: "sustainability",
      target: "efficient"
    },
    {
      source: "sustainability",
      target: "reliable"
    },
    {
      source: "sustainability",
      target: "energy-efficiency"
    },
    {
      source: "sustainability",
      target: "carbon-emission-efficiency"
    },
    {
      source: "system-runs-offline",
      target: "reliability"
    },
    {
      source: "system-runs-offline",
      target: "autonomy"
    },
    {
      source: "test-coverage",
      target: "suitable"
    },
    {
      source: "test-coverage",
      target: "flexible"
    },
    {
      source: "test-coverage",
      target: "maintainability"
    },
    {
      source: "test-coverage",
      target: "flexibility"
    },
    {
      source: "test-coverage",
      target: "modifiability"
    },
    {
      source: "test-coverage",
      target: "analysability"
    },
    {
      source: "test-coverage",
      target: "testability"
    },
    {
      source: "test-with-path-coverage-30min",
      target: "testability"
    },
    {
      source: "test-with-path-coverage-30min",
      target: "risk-identification"
    },
    {
      source: "test-with-path-coverage-30min",
      target: "cycle-time"
    },
    {
      source: "testability",
      target: "suitable"
    },
    {
      source: "testability",
      target: "flexible"
    },
    {
      source: "testability",
      target: "maintainability"
    },
    {
      source: "testability",
      target: "flexibility"
    },
    {
      source: "testability",
      target: "modifiability"
    },
    {
      source: "testability",
      target: "analysability"
    },
    {
      source: "throughput",
      target: "efficient"
    },
    {
      source: "throughput",
      target: "performance"
    },
    {
      source: "throughput",
      target: "efficiency"
    },
    {
      source: "throughput",
      target: "speed"
    },
    {
      source: "time-behaviour",
      target: "efficient"
    },
    {
      source: "time-behaviour",
      target: "efficiency"
    },
    {
      source: "time-behaviour",
      target: "resource-efficiency"
    },
    {
      source: "time-behaviour",
      target: "speed"
    },
    {
      source: "time-behaviour",
      target: "performance"
    },
    {
      source: "time-to-market",
      target: "efficient"
    },
    {
      source: "time-to-market",
      target: "flexibility"
    },
    {
      source: "time-to-market",
      target: "efficiency"
    },
    {
      source: "time-to-market",
      target: "deployment-frequency"
    },
    {
      source: "time-to-market",
      target: "extensibility"
    },
    {
      source: "time-to-market",
      target: "lead-time-for-changes"
    },
    {
      source: "time-to-market",
      target: "cycle-time"
    },
    {
      source: "timeliness",
      target: "efficient"
    },
    {
      source: "timeliness",
      target: "efficiency"
    },
    {
      source: "timeliness",
      target: "performance"
    },
    {
      source: "timeliness",
      target: "response-time"
    },
    {
      source: "timeliness",
      target: "speed"
    },
    {
      source: "traceability",
      target: "reliable"
    },
    {
      source: "traceability",
      target: "operable"
    },
    {
      source: "traceability",
      target: "devops-metrics"
    },
    {
      source: "traceability",
      target: "operability"
    },
    {
      source: "traceability",
      target: "testability"
    },
    {
      source: "transparency",
      target: "reliable"
    },
    {
      source: "transparency",
      target: "clarity"
    },
    {
      source: "transparency",
      target: "understandability"
    },
    {
      source: "transparency",
      target: "usability"
    },
    {
      source: "unavailability-max-2-minutes",
      target: "availability"
    },
    {
      source: "unavailability-max-2-minutes",
      target: "reliability"
    },
    {
      source: "understandability",
      target: "usable"
    },
    {
      source: "understandability",
      target: "operable"
    },
    {
      source: "understandability",
      target: "usability"
    },
    {
      source: "understandability",
      target: "self-descriptiveness"
    },
    {
      source: "understandability",
      target: "user-assistance"
    },
    {
      source: "understandability",
      target: "user-experience"
    },
    {
      source: "understandability",
      target: "learnability"
    },
    {
      source: "understandability",
      target: "conciseness"
    },
    {
      source: "understandable-acceptance-tests",
      target: "efficiency"
    },
    {
      source: "understandable-acceptance-tests",
      target: "maintainability"
    },
    {
      source: "understandable-acceptance-tests",
      target: "suitability"
    },
    {
      source: "understandable-acceptance-tests",
      target: "consistency"
    },
    {
      source: "understandable-acceptance-tests",
      target: "interaction-capability"
    },
    {
      source: "understandable-generated-code",
      target: "legibility"
    },
    {
      source: "understandable-generated-code",
      target: "code-readability"
    },
    {
      source: "understandable-generated-code",
      target: "readability"
    },
    {
      source: "understandable-generated-code",
      target: "maintainability"
    },
    {
      source: "understandable-generated-code",
      target: "understandability"
    },
    {
      source: "understandable-generated-code",
      target: "interaction-capability"
    },
    {
      source: "up-to-date-api",
      target: "reliability"
    },
    {
      source: "up-to-date-api",
      target: "accuracy"
    },
    {
      source: "up-to-date-api",
      target: "correctness"
    },
    {
      source: "upgradeability",
      target: "flexible"
    },
    {
      source: "upgradeability",
      target: "operable"
    },
    {
      source: "upgradeability",
      target: "flexibility"
    },
    {
      source: "upgradeability",
      target: "operability"
    },
    {
      source: "upgradeability",
      target: "predictability"
    },
    {
      source: "upgradeability",
      target: "releasability"
    },
    {
      source: "upgradeability",
      target: "installability"
    },
    {
      source: "usability",
      target: "usable"
    },
    {
      source: "usability",
      target: "operable"
    },
    {
      source: "usability",
      target: "functionality"
    },
    {
      source: "usability",
      target: "attractiveness"
    },
    {
      source: "usability",
      target: "operability"
    },
    {
      source: "usability",
      target: "user-error-protection"
    },
    {
      source: "usability",
      target: "user-engagement"
    },
    {
      source: "usability",
      target: "ease-of-use"
    },
    {
      source: "usability",
      target: "inclusivity"
    },
    {
      source: "usable",
      target: "quality-root"
    },
    {
      source: "usable-despite-color-blindness",
      target: "usability"
    },
    {
      source: "usable-despite-color-blindness",
      target: "user-experience"
    },
    {
      source: "usable-despite-color-blindness",
      target: "compliance"
    },
    {
      source: "usable-despite-color-blindness",
      target: "accessibility"
    },
    {
      source: "usable-despite-color-blindness",
      target: "inclusivity"
    },
    {
      source: "usable-despite-color-blindness",
      target: "interaction-capability"
    },
    {
      source: "usable-on-factory-floor",
      target: "anticipated-workplace-environment"
    },
    {
      source: "usable-on-factory-floor",
      target: "usability"
    },
    {
      source: "usable-on-factory-floor",
      target: "interaction-capability"
    },
    {
      source: "usable-with-gloves",
      target: "usability"
    },
    {
      source: "usable-with-gloves",
      target: "user-experience"
    },
    {
      source: "usable-with-gloves",
      target: "compliance"
    },
    {
      source: "usable-with-gloves",
      target: "interaction-capability"
    },
    {
      source: "user-assistance",
      target: "usable"
    },
    {
      source: "user-assistance",
      target: "usability"
    },
    {
      source: "user-assistance",
      target: "user-error-protection"
    },
    {
      source: "user-assistance",
      target: "user-engagement"
    },
    {
      source: "user-engagement",
      target: "usable"
    },
    {
      source: "user-engagement",
      target: "usability"
    },
    {
      source: "user-error-protection",
      target: "usable"
    },
    {
      source: "user-error-protection",
      target: "operable"
    },
    {
      source: "user-error-protection",
      target: "usability"
    },
    {
      source: "user-error-protection",
      target: "operability"
    },
    {
      source: "user-error-protection",
      target: "robustness"
    },
    {
      source: "user-experience",
      target: "usable"
    },
    {
      source: "user-experience",
      target: "usability"
    },
    {
      source: "user-experience",
      target: "user-interface-aesthetics"
    },
    {
      source: "user-experience",
      target: "user-error-protection"
    },
    {
      source: "user-experience",
      target: "accessibility"
    },
    {
      source: "user-interface-aesthetics",
      target: "usable"
    },
    {
      source: "user-interface-aesthetics",
      target: "usability"
    },
    {
      source: "user-interface-works-with-current-browsers",
      target: "flexibility"
    },
    {
      source: "user-interface-works-with-current-browsers",
      target: "portability"
    },
    {
      source: "user-interface-works-with-current-browsers",
      target: "compatibility"
    },
    {
      source: "user-interface-works-with-current-browsers",
      target: "interoperability"
    },
    {
      source: "user-interface-works-with-current-browsers",
      target: "interaction-capability"
    },
    {
      source: "user-tries-primary-function",
      target: "functional-appropriateness"
    },
    {
      source: "user-tries-primary-function",
      target: "functional-completeness"
    },
    {
      source: "user-tries-primary-function",
      target: "user-experience"
    },
    {
      source: "user-tries-primary-function",
      target: "appropriateness-recognizability"
    },
    {
      source: "user-tries-primary-function",
      target: "interaction-capability"
    },
    {
      source: "versatility",
      target: "flexible"
    },
    {
      source: "versatility",
      target: "suitable"
    },
    {
      source: "versatility",
      target: "flexibility"
    },
    {
      source: "versatility",
      target: "adaptability"
    },
    {
      source: "vulnerability",
      target: "secure"
    },
    {
      source: "vulnerability",
      target: "reliable"
    },
    {
      source: "vulnerability",
      target: "reliability"
    },
    {
      source: "vulnerability",
      target: "availability"
    },
    {
      source: "vulnerability",
      target: "fault-tolerance"
    },
    {
      source: "vulnerability",
      target: "immunity"
    },
    {
      source: "withstand-ddos-attack",
      target: "resilience"
    },
    {
      source: "withstand-ddos-attack",
      target: "reliability"
    },
    {
      source: "withstand-ddos-attack",
      target: "availability"
    },
    {
      source: "withstand-ddos-attack",
      target: "high-availability"
    },
    {
      source: "withstand-ddos-attack",
      target: "recoverability"
    },
    {
      source: "withstand-ddos-attack",
      target: "intrusion-detection"
    },
    {
      source: "withstand-ddos-attack",
      target: "resistance"
    },
    {
      source: "zero-knowledge-data-storage",
      target: "confidentiality"
    },
    {
      source: "zero-knowledge-data-storage",
      target: "security"
    },
    {
      source: "zero-knowledge-data-storage",
      target: "privacy"
    }
  ];

  // src/graphs/GraphDataProvider.js
  var GraphDataProvider = class {
    /**
     * @param {Array} propertyNodes - Property nodes data
     * @param {Array} nodes - Quality and requirement nodes data
     * @param {Array} edges - Edge data
     */
    constructor(propertyNodes, nodes, edges) {
      this.propertyNodes = propertyNodes;
      this.nodes = nodes;
      this.edges = edges;
      this.filteredPropertyNodes = propertyNodes;
      this.filteredNodes = nodes;
      this.filteredEdges = edges;
    }
    /**
     * Get the current data
     * @returns {Object} Object with propertyNodes, nodes, and edges
     */
    getData() {
      return {
        propertyNodes: this.filteredPropertyNodes,
        nodes: this.filteredNodes,
        edges: this.filteredEdges
      };
    }
    /**
     * Reset the filter to show all data
     */
    resetFilter() {
      this.filteredPropertyNodes = this.propertyNodes;
      this.filteredNodes = this.nodes;
      this.filteredEdges = this.edges;
    }
    /**
     * Filter the data based on a search term
     * @param {string} filterTerm - The search term to filter by
     * @returns {Object} Object with filtered propertyNodes, nodes, and edges
     */
    filterByTerm(filterTerm) {
      if (!filterTerm || filterTerm.trim() === "") {
        this.resetFilter();
        return this.getData();
      }
      const lowerFilterTerm = filterTerm.toLowerCase();
      const filteredNodes = this.nodes.filter(
        (node) => node.label.toLowerCase().includes(lowerFilterTerm)
      );
      const filteredNodeIds = new Set(filteredNodes.map((node) => node.id));
      const connectedNodeIds = /* @__PURE__ */ new Set();
      this.edges.forEach((edge) => {
        if (filteredNodeIds.has(edge.source)) {
          connectedNodeIds.add(edge.target);
        }
        if (filteredNodeIds.has(edge.target)) {
          connectedNodeIds.add(edge.source);
        }
      });
      const requirementNodeIds = /* @__PURE__ */ new Set();
      const allRequirementNodes = this.nodes.filter(
        (node) => node.qualityType === "requirement"
      );
      allRequirementNodes.forEach((reqNode) => {
        let isConnected = filteredNodeIds.has(reqNode.id) || connectedNodeIds.has(reqNode.id);
        if (!isConnected) {
          const connectedToReq = /* @__PURE__ */ new Set();
          this.edges.forEach((edge) => {
            if (edge.source === reqNode.id) {
              connectedToReq.add(edge.target);
            }
            if (edge.target === reqNode.id) {
              connectedToReq.add(edge.source);
            }
          });
          connectedToReq.forEach((nodeId) => {
            if (filteredNodeIds.has(nodeId) || connectedNodeIds.has(nodeId)) {
              isConnected = true;
            }
          });
        }
        if (isConnected) {
          requirementNodeIds.add(reqNode.id);
        }
      });
      const allVisibleNodeIds = /* @__PURE__ */ new Set([
        ...filteredNodeIds,
        ...connectedNodeIds,
        ...requirementNodeIds
      ]);
      allVisibleNodeIds.add("quality-root");
      const visiblePropertyNodeIds = /* @__PURE__ */ new Set();
      this.propertyNodes.forEach((propNode) => {
        let hasVisibleNeighbor = false;
        this.edges.forEach((edge) => {
          if (edge.source === propNode.id && edge.target !== "quality-root" && allVisibleNodeIds.has(edge.target)) {
            hasVisibleNeighbor = true;
          }
          if (edge.target === propNode.id && edge.source !== "quality-root" && allVisibleNodeIds.has(edge.source)) {
            hasVisibleNeighbor = true;
          }
        });
        if (hasVisibleNeighbor) {
          visiblePropertyNodeIds.add(propNode.id);
          allVisibleNodeIds.add(propNode.id);
        }
      });
      this.filteredNodes = this.nodes.filter(
        (node) => allVisibleNodeIds.has(node.id)
      );
      this.filteredEdges = this.edges.filter((edge) => {
        return allVisibleNodeIds.has(edge.source) && allVisibleNodeIds.has(edge.target);
      });
      this.filteredPropertyNodes = this.propertyNodes.filter(
        (node) => visiblePropertyNodeIds.has(node.id)
      );
      return this.getData();
    }
    /**
     * Prepare data for the home graph (only include root and property nodes)
     * @returns {Object} Object with prepared propertyNodes, nodes, and edges
     */
    prepareHomeGraphData() {
      const rootNode = this.nodes.find((node) => node.id === "quality-root");
      const homeNodes = rootNode ? [rootNode] : [];
      const homeEdges = this.edges.filter((edge) => {
        return edge.source === "quality-root" && this.propertyNodes.some((node) => node.id === edge.target) || edge.target === "quality-root" && this.propertyNodes.some((node) => node.id === edge.source);
      });
      return {
        propertyNodes: this.propertyNodes,
        nodes: homeNodes,
        edges: homeEdges
      };
    }
  };

  // node_modules/graphology/dist/graphology.mjs
  var import_events = __toESM(require_events(), 1);
  function assignPolyfill() {
    const target = arguments[0];
    for (let i = 1, l = arguments.length; i < l; i++) {
      if (!arguments[i]) continue;
      for (const k in arguments[i]) target[k] = arguments[i][k];
    }
    return target;
  }
  var assign = assignPolyfill;
  if (typeof Object.assign === "function") assign = Object.assign;
  function getMatchingEdge(graph, source, target, type2) {
    const sourceData = graph._nodes.get(source);
    let edge = null;
    if (!sourceData) return edge;
    if (type2 === "mixed") {
      edge = sourceData.out && sourceData.out[target] || sourceData.undirected && sourceData.undirected[target];
    } else if (type2 === "directed") {
      edge = sourceData.out && sourceData.out[target];
    } else {
      edge = sourceData.undirected && sourceData.undirected[target];
    }
    return edge;
  }
  function isPlainObject(value) {
    return typeof value === "object" && value !== null;
  }
  function isEmpty(o) {
    let k;
    for (k in o) return false;
    return true;
  }
  function privateProperty(target, name, value) {
    Object.defineProperty(target, name, {
      enumerable: false,
      configurable: false,
      writable: true,
      value
    });
  }
  function readOnlyProperty(target, name, value) {
    const descriptor = {
      enumerable: true,
      configurable: true
    };
    if (typeof value === "function") {
      descriptor.get = value;
    } else {
      descriptor.value = value;
      descriptor.writable = false;
    }
    Object.defineProperty(target, name, descriptor);
  }
  function validateHints(hints) {
    if (!isPlainObject(hints)) return false;
    if (hints.attributes && !Array.isArray(hints.attributes)) return false;
    return true;
  }
  function incrementalIdStartingFromRandomByte() {
    let i = Math.floor(Math.random() * 256) & 255;
    return () => {
      return i++;
    };
  }
  function chain() {
    const iterables = arguments;
    let current = null;
    let i = -1;
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        let step = null;
        do {
          if (current === null) {
            i++;
            if (i >= iterables.length) return { done: true };
            current = iterables[i][Symbol.iterator]();
          }
          step = current.next();
          if (step.done) {
            current = null;
            continue;
          }
          break;
        } while (true);
        return step;
      }
    };
  }
  function emptyIterator() {
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        return { done: true };
      }
    };
  }
  var GraphError = class extends Error {
    constructor(message) {
      super();
      this.name = "GraphError";
      this.message = message;
    }
  };
  var InvalidArgumentsGraphError = class _InvalidArgumentsGraphError extends GraphError {
    constructor(message) {
      super(message);
      this.name = "InvalidArgumentsGraphError";
      if (typeof Error.captureStackTrace === "function")
        Error.captureStackTrace(
          this,
          _InvalidArgumentsGraphError.prototype.constructor
        );
    }
  };
  var NotFoundGraphError = class _NotFoundGraphError extends GraphError {
    constructor(message) {
      super(message);
      this.name = "NotFoundGraphError";
      if (typeof Error.captureStackTrace === "function")
        Error.captureStackTrace(this, _NotFoundGraphError.prototype.constructor);
    }
  };
  var UsageGraphError = class _UsageGraphError extends GraphError {
    constructor(message) {
      super(message);
      this.name = "UsageGraphError";
      if (typeof Error.captureStackTrace === "function")
        Error.captureStackTrace(this, _UsageGraphError.prototype.constructor);
    }
  };
  function MixedNodeData(key, attributes) {
    this.key = key;
    this.attributes = attributes;
    this.clear();
  }
  MixedNodeData.prototype.clear = function() {
    this.inDegree = 0;
    this.outDegree = 0;
    this.undirectedDegree = 0;
    this.undirectedLoops = 0;
    this.directedLoops = 0;
    this.in = {};
    this.out = {};
    this.undirected = {};
  };
  function DirectedNodeData(key, attributes) {
    this.key = key;
    this.attributes = attributes;
    this.clear();
  }
  DirectedNodeData.prototype.clear = function() {
    this.inDegree = 0;
    this.outDegree = 0;
    this.directedLoops = 0;
    this.in = {};
    this.out = {};
  };
  function UndirectedNodeData(key, attributes) {
    this.key = key;
    this.attributes = attributes;
    this.clear();
  }
  UndirectedNodeData.prototype.clear = function() {
    this.undirectedDegree = 0;
    this.undirectedLoops = 0;
    this.undirected = {};
  };
  function EdgeData(undirected, key, source, target, attributes) {
    this.key = key;
    this.attributes = attributes;
    this.undirected = undirected;
    this.source = source;
    this.target = target;
  }
  EdgeData.prototype.attach = function() {
    let outKey = "out";
    let inKey = "in";
    if (this.undirected) outKey = inKey = "undirected";
    const source = this.source.key;
    const target = this.target.key;
    this.source[outKey][target] = this;
    if (this.undirected && source === target) return;
    this.target[inKey][source] = this;
  };
  EdgeData.prototype.attachMulti = function() {
    let outKey = "out";
    let inKey = "in";
    const source = this.source.key;
    const target = this.target.key;
    if (this.undirected) outKey = inKey = "undirected";
    const adj = this.source[outKey];
    const head = adj[target];
    if (typeof head === "undefined") {
      adj[target] = this;
      if (!(this.undirected && source === target)) {
        this.target[inKey][source] = this;
      }
      return;
    }
    head.previous = this;
    this.next = head;
    adj[target] = this;
    this.target[inKey][source] = this;
  };
  EdgeData.prototype.detach = function() {
    const source = this.source.key;
    const target = this.target.key;
    let outKey = "out";
    let inKey = "in";
    if (this.undirected) outKey = inKey = "undirected";
    delete this.source[outKey][target];
    delete this.target[inKey][source];
  };
  EdgeData.prototype.detachMulti = function() {
    const source = this.source.key;
    const target = this.target.key;
    let outKey = "out";
    let inKey = "in";
    if (this.undirected) outKey = inKey = "undirected";
    if (this.previous === void 0) {
      if (this.next === void 0) {
        delete this.source[outKey][target];
        delete this.target[inKey][source];
      } else {
        this.next.previous = void 0;
        this.source[outKey][target] = this.next;
        this.target[inKey][source] = this.next;
      }
    } else {
      this.previous.next = this.next;
      if (this.next !== void 0) {
        this.next.previous = this.previous;
      }
    }
  };
  var NODE = 0;
  var SOURCE = 1;
  var TARGET = 2;
  var OPPOSITE = 3;
  function findRelevantNodeData(graph, method, mode, nodeOrEdge, nameOrEdge, add1, add2) {
    let nodeData, edgeData, arg1, arg2;
    nodeOrEdge = "" + nodeOrEdge;
    if (mode === NODE) {
      nodeData = graph._nodes.get(nodeOrEdge);
      if (!nodeData)
        throw new NotFoundGraphError(
          `Graph.${method}: could not find the "${nodeOrEdge}" node in the graph.`
        );
      arg1 = nameOrEdge;
      arg2 = add1;
    } else if (mode === OPPOSITE) {
      nameOrEdge = "" + nameOrEdge;
      edgeData = graph._edges.get(nameOrEdge);
      if (!edgeData)
        throw new NotFoundGraphError(
          `Graph.${method}: could not find the "${nameOrEdge}" edge in the graph.`
        );
      const source = edgeData.source.key;
      const target = edgeData.target.key;
      if (nodeOrEdge === source) {
        nodeData = edgeData.target;
      } else if (nodeOrEdge === target) {
        nodeData = edgeData.source;
      } else {
        throw new NotFoundGraphError(
          `Graph.${method}: the "${nodeOrEdge}" node is not attached to the "${nameOrEdge}" edge (${source}, ${target}).`
        );
      }
      arg1 = add1;
      arg2 = add2;
    } else {
      edgeData = graph._edges.get(nodeOrEdge);
      if (!edgeData)
        throw new NotFoundGraphError(
          `Graph.${method}: could not find the "${nodeOrEdge}" edge in the graph.`
        );
      if (mode === SOURCE) {
        nodeData = edgeData.source;
      } else {
        nodeData = edgeData.target;
      }
      arg1 = nameOrEdge;
      arg2 = add1;
    }
    return [nodeData, arg1, arg2];
  }
  function attachNodeAttributeGetter(Class, method, mode) {
    Class.prototype[method] = function(nodeOrEdge, nameOrEdge, add1) {
      const [data, name] = findRelevantNodeData(
        this,
        method,
        mode,
        nodeOrEdge,
        nameOrEdge,
        add1
      );
      return data.attributes[name];
    };
  }
  function attachNodeAttributesGetter(Class, method, mode) {
    Class.prototype[method] = function(nodeOrEdge, nameOrEdge) {
      const [data] = findRelevantNodeData(
        this,
        method,
        mode,
        nodeOrEdge,
        nameOrEdge
      );
      return data.attributes;
    };
  }
  function attachNodeAttributeChecker(Class, method, mode) {
    Class.prototype[method] = function(nodeOrEdge, nameOrEdge, add1) {
      const [data, name] = findRelevantNodeData(
        this,
        method,
        mode,
        nodeOrEdge,
        nameOrEdge,
        add1
      );
      return data.attributes.hasOwnProperty(name);
    };
  }
  function attachNodeAttributeSetter(Class, method, mode) {
    Class.prototype[method] = function(nodeOrEdge, nameOrEdge, add1, add2) {
      const [data, name, value] = findRelevantNodeData(
        this,
        method,
        mode,
        nodeOrEdge,
        nameOrEdge,
        add1,
        add2
      );
      data.attributes[name] = value;
      this.emit("nodeAttributesUpdated", {
        key: data.key,
        type: "set",
        attributes: data.attributes,
        name
      });
      return this;
    };
  }
  function attachNodeAttributeUpdater(Class, method, mode) {
    Class.prototype[method] = function(nodeOrEdge, nameOrEdge, add1, add2) {
      const [data, name, updater] = findRelevantNodeData(
        this,
        method,
        mode,
        nodeOrEdge,
        nameOrEdge,
        add1,
        add2
      );
      if (typeof updater !== "function")
        throw new InvalidArgumentsGraphError(
          `Graph.${method}: updater should be a function.`
        );
      const attributes = data.attributes;
      const value = updater(attributes[name]);
      attributes[name] = value;
      this.emit("nodeAttributesUpdated", {
        key: data.key,
        type: "set",
        attributes: data.attributes,
        name
      });
      return this;
    };
  }
  function attachNodeAttributeRemover(Class, method, mode) {
    Class.prototype[method] = function(nodeOrEdge, nameOrEdge, add1) {
      const [data, name] = findRelevantNodeData(
        this,
        method,
        mode,
        nodeOrEdge,
        nameOrEdge,
        add1
      );
      delete data.attributes[name];
      this.emit("nodeAttributesUpdated", {
        key: data.key,
        type: "remove",
        attributes: data.attributes,
        name
      });
      return this;
    };
  }
  function attachNodeAttributesReplacer(Class, method, mode) {
    Class.prototype[method] = function(nodeOrEdge, nameOrEdge, add1) {
      const [data, attributes] = findRelevantNodeData(
        this,
        method,
        mode,
        nodeOrEdge,
        nameOrEdge,
        add1
      );
      if (!isPlainObject(attributes))
        throw new InvalidArgumentsGraphError(
          `Graph.${method}: provided attributes are not a plain object.`
        );
      data.attributes = attributes;
      this.emit("nodeAttributesUpdated", {
        key: data.key,
        type: "replace",
        attributes: data.attributes
      });
      return this;
    };
  }
  function attachNodeAttributesMerger(Class, method, mode) {
    Class.prototype[method] = function(nodeOrEdge, nameOrEdge, add1) {
      const [data, attributes] = findRelevantNodeData(
        this,
        method,
        mode,
        nodeOrEdge,
        nameOrEdge,
        add1
      );
      if (!isPlainObject(attributes))
        throw new InvalidArgumentsGraphError(
          `Graph.${method}: provided attributes are not a plain object.`
        );
      assign(data.attributes, attributes);
      this.emit("nodeAttributesUpdated", {
        key: data.key,
        type: "merge",
        attributes: data.attributes,
        data: attributes
      });
      return this;
    };
  }
  function attachNodeAttributesUpdater(Class, method, mode) {
    Class.prototype[method] = function(nodeOrEdge, nameOrEdge, add1) {
      const [data, updater] = findRelevantNodeData(
        this,
        method,
        mode,
        nodeOrEdge,
        nameOrEdge,
        add1
      );
      if (typeof updater !== "function")
        throw new InvalidArgumentsGraphError(
          `Graph.${method}: provided updater is not a function.`
        );
      data.attributes = updater(data.attributes);
      this.emit("nodeAttributesUpdated", {
        key: data.key,
        type: "update",
        attributes: data.attributes
      });
      return this;
    };
  }
  var NODE_ATTRIBUTES_METHODS = [
    {
      name: (element) => `get${element}Attribute`,
      attacher: attachNodeAttributeGetter
    },
    {
      name: (element) => `get${element}Attributes`,
      attacher: attachNodeAttributesGetter
    },
    {
      name: (element) => `has${element}Attribute`,
      attacher: attachNodeAttributeChecker
    },
    {
      name: (element) => `set${element}Attribute`,
      attacher: attachNodeAttributeSetter
    },
    {
      name: (element) => `update${element}Attribute`,
      attacher: attachNodeAttributeUpdater
    },
    {
      name: (element) => `remove${element}Attribute`,
      attacher: attachNodeAttributeRemover
    },
    {
      name: (element) => `replace${element}Attributes`,
      attacher: attachNodeAttributesReplacer
    },
    {
      name: (element) => `merge${element}Attributes`,
      attacher: attachNodeAttributesMerger
    },
    {
      name: (element) => `update${element}Attributes`,
      attacher: attachNodeAttributesUpdater
    }
  ];
  function attachNodeAttributesMethods(Graph3) {
    NODE_ATTRIBUTES_METHODS.forEach(function({ name, attacher }) {
      attacher(Graph3, name("Node"), NODE);
      attacher(Graph3, name("Source"), SOURCE);
      attacher(Graph3, name("Target"), TARGET);
      attacher(Graph3, name("Opposite"), OPPOSITE);
    });
  }
  function attachEdgeAttributeGetter(Class, method, type2) {
    Class.prototype[method] = function(element, name) {
      let data;
      if (this.type !== "mixed" && type2 !== "mixed" && type2 !== this.type)
        throw new UsageGraphError(
          `Graph.${method}: cannot find this type of edges in your ${this.type} graph.`
        );
      if (arguments.length > 2) {
        if (this.multi)
          throw new UsageGraphError(
            `Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`
          );
        const source = "" + element;
        const target = "" + name;
        name = arguments[2];
        data = getMatchingEdge(this, source, target, type2);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`
          );
      } else {
        if (type2 !== "mixed")
          throw new UsageGraphError(
            `Graph.${method}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`
          );
        element = "" + element;
        data = this._edges.get(element);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find the "${element}" edge in the graph.`
          );
      }
      return data.attributes[name];
    };
  }
  function attachEdgeAttributesGetter(Class, method, type2) {
    Class.prototype[method] = function(element) {
      let data;
      if (this.type !== "mixed" && type2 !== "mixed" && type2 !== this.type)
        throw new UsageGraphError(
          `Graph.${method}: cannot find this type of edges in your ${this.type} graph.`
        );
      if (arguments.length > 1) {
        if (this.multi)
          throw new UsageGraphError(
            `Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`
          );
        const source = "" + element, target = "" + arguments[1];
        data = getMatchingEdge(this, source, target, type2);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`
          );
      } else {
        if (type2 !== "mixed")
          throw new UsageGraphError(
            `Graph.${method}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`
          );
        element = "" + element;
        data = this._edges.get(element);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find the "${element}" edge in the graph.`
          );
      }
      return data.attributes;
    };
  }
  function attachEdgeAttributeChecker(Class, method, type2) {
    Class.prototype[method] = function(element, name) {
      let data;
      if (this.type !== "mixed" && type2 !== "mixed" && type2 !== this.type)
        throw new UsageGraphError(
          `Graph.${method}: cannot find this type of edges in your ${this.type} graph.`
        );
      if (arguments.length > 2) {
        if (this.multi)
          throw new UsageGraphError(
            `Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`
          );
        const source = "" + element;
        const target = "" + name;
        name = arguments[2];
        data = getMatchingEdge(this, source, target, type2);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`
          );
      } else {
        if (type2 !== "mixed")
          throw new UsageGraphError(
            `Graph.${method}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`
          );
        element = "" + element;
        data = this._edges.get(element);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find the "${element}" edge in the graph.`
          );
      }
      return data.attributes.hasOwnProperty(name);
    };
  }
  function attachEdgeAttributeSetter(Class, method, type2) {
    Class.prototype[method] = function(element, name, value) {
      let data;
      if (this.type !== "mixed" && type2 !== "mixed" && type2 !== this.type)
        throw new UsageGraphError(
          `Graph.${method}: cannot find this type of edges in your ${this.type} graph.`
        );
      if (arguments.length > 3) {
        if (this.multi)
          throw new UsageGraphError(
            `Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`
          );
        const source = "" + element;
        const target = "" + name;
        name = arguments[2];
        value = arguments[3];
        data = getMatchingEdge(this, source, target, type2);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`
          );
      } else {
        if (type2 !== "mixed")
          throw new UsageGraphError(
            `Graph.${method}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`
          );
        element = "" + element;
        data = this._edges.get(element);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find the "${element}" edge in the graph.`
          );
      }
      data.attributes[name] = value;
      this.emit("edgeAttributesUpdated", {
        key: data.key,
        type: "set",
        attributes: data.attributes,
        name
      });
      return this;
    };
  }
  function attachEdgeAttributeUpdater(Class, method, type2) {
    Class.prototype[method] = function(element, name, updater) {
      let data;
      if (this.type !== "mixed" && type2 !== "mixed" && type2 !== this.type)
        throw new UsageGraphError(
          `Graph.${method}: cannot find this type of edges in your ${this.type} graph.`
        );
      if (arguments.length > 3) {
        if (this.multi)
          throw new UsageGraphError(
            `Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`
          );
        const source = "" + element;
        const target = "" + name;
        name = arguments[2];
        updater = arguments[3];
        data = getMatchingEdge(this, source, target, type2);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`
          );
      } else {
        if (type2 !== "mixed")
          throw new UsageGraphError(
            `Graph.${method}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`
          );
        element = "" + element;
        data = this._edges.get(element);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find the "${element}" edge in the graph.`
          );
      }
      if (typeof updater !== "function")
        throw new InvalidArgumentsGraphError(
          `Graph.${method}: updater should be a function.`
        );
      data.attributes[name] = updater(data.attributes[name]);
      this.emit("edgeAttributesUpdated", {
        key: data.key,
        type: "set",
        attributes: data.attributes,
        name
      });
      return this;
    };
  }
  function attachEdgeAttributeRemover(Class, method, type2) {
    Class.prototype[method] = function(element, name) {
      let data;
      if (this.type !== "mixed" && type2 !== "mixed" && type2 !== this.type)
        throw new UsageGraphError(
          `Graph.${method}: cannot find this type of edges in your ${this.type} graph.`
        );
      if (arguments.length > 2) {
        if (this.multi)
          throw new UsageGraphError(
            `Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`
          );
        const source = "" + element;
        const target = "" + name;
        name = arguments[2];
        data = getMatchingEdge(this, source, target, type2);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`
          );
      } else {
        if (type2 !== "mixed")
          throw new UsageGraphError(
            `Graph.${method}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`
          );
        element = "" + element;
        data = this._edges.get(element);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find the "${element}" edge in the graph.`
          );
      }
      delete data.attributes[name];
      this.emit("edgeAttributesUpdated", {
        key: data.key,
        type: "remove",
        attributes: data.attributes,
        name
      });
      return this;
    };
  }
  function attachEdgeAttributesReplacer(Class, method, type2) {
    Class.prototype[method] = function(element, attributes) {
      let data;
      if (this.type !== "mixed" && type2 !== "mixed" && type2 !== this.type)
        throw new UsageGraphError(
          `Graph.${method}: cannot find this type of edges in your ${this.type} graph.`
        );
      if (arguments.length > 2) {
        if (this.multi)
          throw new UsageGraphError(
            `Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`
          );
        const source = "" + element, target = "" + attributes;
        attributes = arguments[2];
        data = getMatchingEdge(this, source, target, type2);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`
          );
      } else {
        if (type2 !== "mixed")
          throw new UsageGraphError(
            `Graph.${method}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`
          );
        element = "" + element;
        data = this._edges.get(element);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find the "${element}" edge in the graph.`
          );
      }
      if (!isPlainObject(attributes))
        throw new InvalidArgumentsGraphError(
          `Graph.${method}: provided attributes are not a plain object.`
        );
      data.attributes = attributes;
      this.emit("edgeAttributesUpdated", {
        key: data.key,
        type: "replace",
        attributes: data.attributes
      });
      return this;
    };
  }
  function attachEdgeAttributesMerger(Class, method, type2) {
    Class.prototype[method] = function(element, attributes) {
      let data;
      if (this.type !== "mixed" && type2 !== "mixed" && type2 !== this.type)
        throw new UsageGraphError(
          `Graph.${method}: cannot find this type of edges in your ${this.type} graph.`
        );
      if (arguments.length > 2) {
        if (this.multi)
          throw new UsageGraphError(
            `Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`
          );
        const source = "" + element, target = "" + attributes;
        attributes = arguments[2];
        data = getMatchingEdge(this, source, target, type2);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`
          );
      } else {
        if (type2 !== "mixed")
          throw new UsageGraphError(
            `Graph.${method}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`
          );
        element = "" + element;
        data = this._edges.get(element);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find the "${element}" edge in the graph.`
          );
      }
      if (!isPlainObject(attributes))
        throw new InvalidArgumentsGraphError(
          `Graph.${method}: provided attributes are not a plain object.`
        );
      assign(data.attributes, attributes);
      this.emit("edgeAttributesUpdated", {
        key: data.key,
        type: "merge",
        attributes: data.attributes,
        data: attributes
      });
      return this;
    };
  }
  function attachEdgeAttributesUpdater(Class, method, type2) {
    Class.prototype[method] = function(element, updater) {
      let data;
      if (this.type !== "mixed" && type2 !== "mixed" && type2 !== this.type)
        throw new UsageGraphError(
          `Graph.${method}: cannot find this type of edges in your ${this.type} graph.`
        );
      if (arguments.length > 2) {
        if (this.multi)
          throw new UsageGraphError(
            `Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`
          );
        const source = "" + element, target = "" + updater;
        updater = arguments[2];
        data = getMatchingEdge(this, source, target, type2);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`
          );
      } else {
        if (type2 !== "mixed")
          throw new UsageGraphError(
            `Graph.${method}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`
          );
        element = "" + element;
        data = this._edges.get(element);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find the "${element}" edge in the graph.`
          );
      }
      if (typeof updater !== "function")
        throw new InvalidArgumentsGraphError(
          `Graph.${method}: provided updater is not a function.`
        );
      data.attributes = updater(data.attributes);
      this.emit("edgeAttributesUpdated", {
        key: data.key,
        type: "update",
        attributes: data.attributes
      });
      return this;
    };
  }
  var EDGE_ATTRIBUTES_METHODS = [
    {
      name: (element) => `get${element}Attribute`,
      attacher: attachEdgeAttributeGetter
    },
    {
      name: (element) => `get${element}Attributes`,
      attacher: attachEdgeAttributesGetter
    },
    {
      name: (element) => `has${element}Attribute`,
      attacher: attachEdgeAttributeChecker
    },
    {
      name: (element) => `set${element}Attribute`,
      attacher: attachEdgeAttributeSetter
    },
    {
      name: (element) => `update${element}Attribute`,
      attacher: attachEdgeAttributeUpdater
    },
    {
      name: (element) => `remove${element}Attribute`,
      attacher: attachEdgeAttributeRemover
    },
    {
      name: (element) => `replace${element}Attributes`,
      attacher: attachEdgeAttributesReplacer
    },
    {
      name: (element) => `merge${element}Attributes`,
      attacher: attachEdgeAttributesMerger
    },
    {
      name: (element) => `update${element}Attributes`,
      attacher: attachEdgeAttributesUpdater
    }
  ];
  function attachEdgeAttributesMethods(Graph3) {
    EDGE_ATTRIBUTES_METHODS.forEach(function({ name, attacher }) {
      attacher(Graph3, name("Edge"), "mixed");
      attacher(Graph3, name("DirectedEdge"), "directed");
      attacher(Graph3, name("UndirectedEdge"), "undirected");
    });
  }
  var EDGES_ITERATION = [
    {
      name: "edges",
      type: "mixed"
    },
    {
      name: "inEdges",
      type: "directed",
      direction: "in"
    },
    {
      name: "outEdges",
      type: "directed",
      direction: "out"
    },
    {
      name: "inboundEdges",
      type: "mixed",
      direction: "in"
    },
    {
      name: "outboundEdges",
      type: "mixed",
      direction: "out"
    },
    {
      name: "directedEdges",
      type: "directed"
    },
    {
      name: "undirectedEdges",
      type: "undirected"
    }
  ];
  function forEachSimple(breakable, object, callback, avoid) {
    let shouldBreak = false;
    for (const k in object) {
      if (k === avoid) continue;
      const edgeData = object[k];
      shouldBreak = callback(
        edgeData.key,
        edgeData.attributes,
        edgeData.source.key,
        edgeData.target.key,
        edgeData.source.attributes,
        edgeData.target.attributes,
        edgeData.undirected
      );
      if (breakable && shouldBreak) return edgeData.key;
    }
    return;
  }
  function forEachMulti(breakable, object, callback, avoid) {
    let edgeData, source, target;
    let shouldBreak = false;
    for (const k in object) {
      if (k === avoid) continue;
      edgeData = object[k];
      do {
        source = edgeData.source;
        target = edgeData.target;
        shouldBreak = callback(
          edgeData.key,
          edgeData.attributes,
          source.key,
          target.key,
          source.attributes,
          target.attributes,
          edgeData.undirected
        );
        if (breakable && shouldBreak) return edgeData.key;
        edgeData = edgeData.next;
      } while (edgeData !== void 0);
    }
    return;
  }
  function createIterator(object, avoid) {
    const keys = Object.keys(object);
    const l = keys.length;
    let edgeData;
    let i = 0;
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        do {
          if (!edgeData) {
            if (i >= l) return { done: true };
            const k = keys[i++];
            if (k === avoid) {
              edgeData = void 0;
              continue;
            }
            edgeData = object[k];
          } else {
            edgeData = edgeData.next;
          }
        } while (!edgeData);
        return {
          done: false,
          value: {
            edge: edgeData.key,
            attributes: edgeData.attributes,
            source: edgeData.source.key,
            target: edgeData.target.key,
            sourceAttributes: edgeData.source.attributes,
            targetAttributes: edgeData.target.attributes,
            undirected: edgeData.undirected
          }
        };
      }
    };
  }
  function forEachForKeySimple(breakable, object, k, callback) {
    const edgeData = object[k];
    if (!edgeData) return;
    const sourceData = edgeData.source;
    const targetData = edgeData.target;
    if (callback(
      edgeData.key,
      edgeData.attributes,
      sourceData.key,
      targetData.key,
      sourceData.attributes,
      targetData.attributes,
      edgeData.undirected
    ) && breakable)
      return edgeData.key;
  }
  function forEachForKeyMulti(breakable, object, k, callback) {
    let edgeData = object[k];
    if (!edgeData) return;
    let shouldBreak = false;
    do {
      shouldBreak = callback(
        edgeData.key,
        edgeData.attributes,
        edgeData.source.key,
        edgeData.target.key,
        edgeData.source.attributes,
        edgeData.target.attributes,
        edgeData.undirected
      );
      if (breakable && shouldBreak) return edgeData.key;
      edgeData = edgeData.next;
    } while (edgeData !== void 0);
    return;
  }
  function createIteratorForKey(object, k) {
    let edgeData = object[k];
    if (edgeData.next !== void 0) {
      return {
        [Symbol.iterator]() {
          return this;
        },
        next() {
          if (!edgeData) return { done: true };
          const value = {
            edge: edgeData.key,
            attributes: edgeData.attributes,
            source: edgeData.source.key,
            target: edgeData.target.key,
            sourceAttributes: edgeData.source.attributes,
            targetAttributes: edgeData.target.attributes,
            undirected: edgeData.undirected
          };
          edgeData = edgeData.next;
          return {
            done: false,
            value
          };
        }
      };
    }
    let done = false;
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        if (done === true) return { done: true };
        done = true;
        return {
          done: false,
          value: {
            edge: edgeData.key,
            attributes: edgeData.attributes,
            source: edgeData.source.key,
            target: edgeData.target.key,
            sourceAttributes: edgeData.source.attributes,
            targetAttributes: edgeData.target.attributes,
            undirected: edgeData.undirected
          }
        };
      }
    };
  }
  function createEdgeArray(graph, type2) {
    if (graph.size === 0) return [];
    if (type2 === "mixed" || type2 === graph.type) {
      return Array.from(graph._edges.keys());
    }
    const size = type2 === "undirected" ? graph.undirectedSize : graph.directedSize;
    const list = new Array(size), mask = type2 === "undirected";
    const iterator = graph._edges.values();
    let i = 0;
    let step, data;
    while (step = iterator.next(), step.done !== true) {
      data = step.value;
      if (data.undirected === mask) list[i++] = data.key;
    }
    return list;
  }
  function forEachEdge(breakable, graph, type2, callback) {
    if (graph.size === 0) return;
    const shouldFilter = type2 !== "mixed" && type2 !== graph.type;
    const mask = type2 === "undirected";
    let step, data;
    let shouldBreak = false;
    const iterator = graph._edges.values();
    while (step = iterator.next(), step.done !== true) {
      data = step.value;
      if (shouldFilter && data.undirected !== mask) continue;
      const { key, attributes, source, target } = data;
      shouldBreak = callback(
        key,
        attributes,
        source.key,
        target.key,
        source.attributes,
        target.attributes,
        data.undirected
      );
      if (breakable && shouldBreak) return key;
    }
    return;
  }
  function createEdgeIterator(graph, type2) {
    if (graph.size === 0) return emptyIterator();
    const shouldFilter = type2 !== "mixed" && type2 !== graph.type;
    const mask = type2 === "undirected";
    const iterator = graph._edges.values();
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        let step, data;
        while (true) {
          step = iterator.next();
          if (step.done) return step;
          data = step.value;
          if (shouldFilter && data.undirected !== mask) continue;
          break;
        }
        const value = {
          edge: data.key,
          attributes: data.attributes,
          source: data.source.key,
          target: data.target.key,
          sourceAttributes: data.source.attributes,
          targetAttributes: data.target.attributes,
          undirected: data.undirected
        };
        return { value, done: false };
      }
    };
  }
  function forEachEdgeForNode(breakable, multi, type2, direction, nodeData, callback) {
    const fn = multi ? forEachMulti : forEachSimple;
    let found;
    if (type2 !== "undirected") {
      if (direction !== "out") {
        found = fn(breakable, nodeData.in, callback);
        if (breakable && found) return found;
      }
      if (direction !== "in") {
        found = fn(
          breakable,
          nodeData.out,
          callback,
          !direction ? nodeData.key : void 0
        );
        if (breakable && found) return found;
      }
    }
    if (type2 !== "directed") {
      found = fn(breakable, nodeData.undirected, callback);
      if (breakable && found) return found;
    }
    return;
  }
  function createEdgeArrayForNode(multi, type2, direction, nodeData) {
    const edges = [];
    forEachEdgeForNode(false, multi, type2, direction, nodeData, function(key) {
      edges.push(key);
    });
    return edges;
  }
  function createEdgeIteratorForNode(type2, direction, nodeData) {
    let iterator = emptyIterator();
    if (type2 !== "undirected") {
      if (direction !== "out" && typeof nodeData.in !== "undefined")
        iterator = chain(iterator, createIterator(nodeData.in));
      if (direction !== "in" && typeof nodeData.out !== "undefined")
        iterator = chain(
          iterator,
          createIterator(nodeData.out, !direction ? nodeData.key : void 0)
        );
    }
    if (type2 !== "directed" && typeof nodeData.undirected !== "undefined") {
      iterator = chain(iterator, createIterator(nodeData.undirected));
    }
    return iterator;
  }
  function forEachEdgeForPath(breakable, type2, multi, direction, sourceData, target, callback) {
    const fn = multi ? forEachForKeyMulti : forEachForKeySimple;
    let found;
    if (type2 !== "undirected") {
      if (typeof sourceData.in !== "undefined" && direction !== "out") {
        found = fn(breakable, sourceData.in, target, callback);
        if (breakable && found) return found;
      }
      if (typeof sourceData.out !== "undefined" && direction !== "in" && (direction || sourceData.key !== target)) {
        found = fn(breakable, sourceData.out, target, callback);
        if (breakable && found) return found;
      }
    }
    if (type2 !== "directed") {
      if (typeof sourceData.undirected !== "undefined") {
        found = fn(breakable, sourceData.undirected, target, callback);
        if (breakable && found) return found;
      }
    }
    return;
  }
  function createEdgeArrayForPath(type2, multi, direction, sourceData, target) {
    const edges = [];
    forEachEdgeForPath(
      false,
      type2,
      multi,
      direction,
      sourceData,
      target,
      function(key) {
        edges.push(key);
      }
    );
    return edges;
  }
  function createEdgeIteratorForPath(type2, direction, sourceData, target) {
    let iterator = emptyIterator();
    if (type2 !== "undirected") {
      if (typeof sourceData.in !== "undefined" && direction !== "out" && target in sourceData.in)
        iterator = chain(iterator, createIteratorForKey(sourceData.in, target));
      if (typeof sourceData.out !== "undefined" && direction !== "in" && target in sourceData.out && (direction || sourceData.key !== target))
        iterator = chain(iterator, createIteratorForKey(sourceData.out, target));
    }
    if (type2 !== "directed") {
      if (typeof sourceData.undirected !== "undefined" && target in sourceData.undirected)
        iterator = chain(
          iterator,
          createIteratorForKey(sourceData.undirected, target)
        );
    }
    return iterator;
  }
  function attachEdgeArrayCreator(Class, description) {
    const { name, type: type2, direction } = description;
    Class.prototype[name] = function(source, target) {
      if (type2 !== "mixed" && this.type !== "mixed" && type2 !== this.type)
        return [];
      if (!arguments.length) return createEdgeArray(this, type2);
      if (arguments.length === 1) {
        source = "" + source;
        const nodeData = this._nodes.get(source);
        if (typeof nodeData === "undefined")
          throw new NotFoundGraphError(
            `Graph.${name}: could not find the "${source}" node in the graph.`
          );
        return createEdgeArrayForNode(
          this.multi,
          type2 === "mixed" ? this.type : type2,
          direction,
          nodeData
        );
      }
      if (arguments.length === 2) {
        source = "" + source;
        target = "" + target;
        const sourceData = this._nodes.get(source);
        if (!sourceData)
          throw new NotFoundGraphError(
            `Graph.${name}:  could not find the "${source}" source node in the graph.`
          );
        if (!this._nodes.has(target))
          throw new NotFoundGraphError(
            `Graph.${name}:  could not find the "${target}" target node in the graph.`
          );
        return createEdgeArrayForPath(
          type2,
          this.multi,
          direction,
          sourceData,
          target
        );
      }
      throw new InvalidArgumentsGraphError(
        `Graph.${name}: too many arguments (expecting 0, 1 or 2 and got ${arguments.length}).`
      );
    };
  }
  function attachForEachEdge(Class, description) {
    const { name, type: type2, direction } = description;
    const forEachName = "forEach" + name[0].toUpperCase() + name.slice(1, -1);
    Class.prototype[forEachName] = function(source, target, callback) {
      if (type2 !== "mixed" && this.type !== "mixed" && type2 !== this.type) return;
      if (arguments.length === 1) {
        callback = source;
        return forEachEdge(false, this, type2, callback);
      }
      if (arguments.length === 2) {
        source = "" + source;
        callback = target;
        const nodeData = this._nodes.get(source);
        if (typeof nodeData === "undefined")
          throw new NotFoundGraphError(
            `Graph.${forEachName}: could not find the "${source}" node in the graph.`
          );
        return forEachEdgeForNode(
          false,
          this.multi,
          type2 === "mixed" ? this.type : type2,
          direction,
          nodeData,
          callback
        );
      }
      if (arguments.length === 3) {
        source = "" + source;
        target = "" + target;
        const sourceData = this._nodes.get(source);
        if (!sourceData)
          throw new NotFoundGraphError(
            `Graph.${forEachName}:  could not find the "${source}" source node in the graph.`
          );
        if (!this._nodes.has(target))
          throw new NotFoundGraphError(
            `Graph.${forEachName}:  could not find the "${target}" target node in the graph.`
          );
        return forEachEdgeForPath(
          false,
          type2,
          this.multi,
          direction,
          sourceData,
          target,
          callback
        );
      }
      throw new InvalidArgumentsGraphError(
        `Graph.${forEachName}: too many arguments (expecting 1, 2 or 3 and got ${arguments.length}).`
      );
    };
    const mapName = "map" + name[0].toUpperCase() + name.slice(1);
    Class.prototype[mapName] = function() {
      const args = Array.prototype.slice.call(arguments);
      const callback = args.pop();
      let result;
      if (args.length === 0) {
        let length = 0;
        if (type2 !== "directed") length += this.undirectedSize;
        if (type2 !== "undirected") length += this.directedSize;
        result = new Array(length);
        let i = 0;
        args.push((e, ea, s, t, sa, ta, u) => {
          result[i++] = callback(e, ea, s, t, sa, ta, u);
        });
      } else {
        result = [];
        args.push((e, ea, s, t, sa, ta, u) => {
          result.push(callback(e, ea, s, t, sa, ta, u));
        });
      }
      this[forEachName].apply(this, args);
      return result;
    };
    const filterName = "filter" + name[0].toUpperCase() + name.slice(1);
    Class.prototype[filterName] = function() {
      const args = Array.prototype.slice.call(arguments);
      const callback = args.pop();
      const result = [];
      args.push((e, ea, s, t, sa, ta, u) => {
        if (callback(e, ea, s, t, sa, ta, u)) result.push(e);
      });
      this[forEachName].apply(this, args);
      return result;
    };
    const reduceName = "reduce" + name[0].toUpperCase() + name.slice(1);
    Class.prototype[reduceName] = function() {
      let args = Array.prototype.slice.call(arguments);
      if (args.length < 2 || args.length > 4) {
        throw new InvalidArgumentsGraphError(
          `Graph.${reduceName}: invalid number of arguments (expecting 2, 3 or 4 and got ${args.length}).`
        );
      }
      if (typeof args[args.length - 1] === "function" && typeof args[args.length - 2] !== "function") {
        throw new InvalidArgumentsGraphError(
          `Graph.${reduceName}: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.`
        );
      }
      let callback;
      let initialValue;
      if (args.length === 2) {
        callback = args[0];
        initialValue = args[1];
        args = [];
      } else if (args.length === 3) {
        callback = args[1];
        initialValue = args[2];
        args = [args[0]];
      } else if (args.length === 4) {
        callback = args[2];
        initialValue = args[3];
        args = [args[0], args[1]];
      }
      let accumulator = initialValue;
      args.push((e, ea, s, t, sa, ta, u) => {
        accumulator = callback(accumulator, e, ea, s, t, sa, ta, u);
      });
      this[forEachName].apply(this, args);
      return accumulator;
    };
  }
  function attachFindEdge(Class, description) {
    const { name, type: type2, direction } = description;
    const findEdgeName = "find" + name[0].toUpperCase() + name.slice(1, -1);
    Class.prototype[findEdgeName] = function(source, target, callback) {
      if (type2 !== "mixed" && this.type !== "mixed" && type2 !== this.type)
        return false;
      if (arguments.length === 1) {
        callback = source;
        return forEachEdge(true, this, type2, callback);
      }
      if (arguments.length === 2) {
        source = "" + source;
        callback = target;
        const nodeData = this._nodes.get(source);
        if (typeof nodeData === "undefined")
          throw new NotFoundGraphError(
            `Graph.${findEdgeName}: could not find the "${source}" node in the graph.`
          );
        return forEachEdgeForNode(
          true,
          this.multi,
          type2 === "mixed" ? this.type : type2,
          direction,
          nodeData,
          callback
        );
      }
      if (arguments.length === 3) {
        source = "" + source;
        target = "" + target;
        const sourceData = this._nodes.get(source);
        if (!sourceData)
          throw new NotFoundGraphError(
            `Graph.${findEdgeName}:  could not find the "${source}" source node in the graph.`
          );
        if (!this._nodes.has(target))
          throw new NotFoundGraphError(
            `Graph.${findEdgeName}:  could not find the "${target}" target node in the graph.`
          );
        return forEachEdgeForPath(
          true,
          type2,
          this.multi,
          direction,
          sourceData,
          target,
          callback
        );
      }
      throw new InvalidArgumentsGraphError(
        `Graph.${findEdgeName}: too many arguments (expecting 1, 2 or 3 and got ${arguments.length}).`
      );
    };
    const someName = "some" + name[0].toUpperCase() + name.slice(1, -1);
    Class.prototype[someName] = function() {
      const args = Array.prototype.slice.call(arguments);
      const callback = args.pop();
      args.push((e, ea, s, t, sa, ta, u) => {
        return callback(e, ea, s, t, sa, ta, u);
      });
      const found = this[findEdgeName].apply(this, args);
      if (found) return true;
      return false;
    };
    const everyName = "every" + name[0].toUpperCase() + name.slice(1, -1);
    Class.prototype[everyName] = function() {
      const args = Array.prototype.slice.call(arguments);
      const callback = args.pop();
      args.push((e, ea, s, t, sa, ta, u) => {
        return !callback(e, ea, s, t, sa, ta, u);
      });
      const found = this[findEdgeName].apply(this, args);
      if (found) return false;
      return true;
    };
  }
  function attachEdgeIteratorCreator(Class, description) {
    const { name: originalName, type: type2, direction } = description;
    const name = originalName.slice(0, -1) + "Entries";
    Class.prototype[name] = function(source, target) {
      if (type2 !== "mixed" && this.type !== "mixed" && type2 !== this.type)
        return emptyIterator();
      if (!arguments.length) return createEdgeIterator(this, type2);
      if (arguments.length === 1) {
        source = "" + source;
        const sourceData = this._nodes.get(source);
        if (!sourceData)
          throw new NotFoundGraphError(
            `Graph.${name}: could not find the "${source}" node in the graph.`
          );
        return createEdgeIteratorForNode(type2, direction, sourceData);
      }
      if (arguments.length === 2) {
        source = "" + source;
        target = "" + target;
        const sourceData = this._nodes.get(source);
        if (!sourceData)
          throw new NotFoundGraphError(
            `Graph.${name}:  could not find the "${source}" source node in the graph.`
          );
        if (!this._nodes.has(target))
          throw new NotFoundGraphError(
            `Graph.${name}:  could not find the "${target}" target node in the graph.`
          );
        return createEdgeIteratorForPath(type2, direction, sourceData, target);
      }
      throw new InvalidArgumentsGraphError(
        `Graph.${name}: too many arguments (expecting 0, 1 or 2 and got ${arguments.length}).`
      );
    };
  }
  function attachEdgeIterationMethods(Graph3) {
    EDGES_ITERATION.forEach((description) => {
      attachEdgeArrayCreator(Graph3, description);
      attachForEachEdge(Graph3, description);
      attachFindEdge(Graph3, description);
      attachEdgeIteratorCreator(Graph3, description);
    });
  }
  var NEIGHBORS_ITERATION = [
    {
      name: "neighbors",
      type: "mixed"
    },
    {
      name: "inNeighbors",
      type: "directed",
      direction: "in"
    },
    {
      name: "outNeighbors",
      type: "directed",
      direction: "out"
    },
    {
      name: "inboundNeighbors",
      type: "mixed",
      direction: "in"
    },
    {
      name: "outboundNeighbors",
      type: "mixed",
      direction: "out"
    },
    {
      name: "directedNeighbors",
      type: "directed"
    },
    {
      name: "undirectedNeighbors",
      type: "undirected"
    }
  ];
  function CompositeSetWrapper() {
    this.A = null;
    this.B = null;
  }
  CompositeSetWrapper.prototype.wrap = function(set3) {
    if (this.A === null) this.A = set3;
    else if (this.B === null) this.B = set3;
  };
  CompositeSetWrapper.prototype.has = function(key) {
    if (this.A !== null && key in this.A) return true;
    if (this.B !== null && key in this.B) return true;
    return false;
  };
  function forEachInObjectOnce(breakable, visited, nodeData, object, callback) {
    for (const k in object) {
      const edgeData = object[k];
      const sourceData = edgeData.source;
      const targetData = edgeData.target;
      const neighborData = sourceData === nodeData ? targetData : sourceData;
      if (visited && visited.has(neighborData.key)) continue;
      const shouldBreak = callback(neighborData.key, neighborData.attributes);
      if (breakable && shouldBreak) return neighborData.key;
    }
    return;
  }
  function forEachNeighbor(breakable, type2, direction, nodeData, callback) {
    if (type2 !== "mixed") {
      if (type2 === "undirected")
        return forEachInObjectOnce(
          breakable,
          null,
          nodeData,
          nodeData.undirected,
          callback
        );
      if (typeof direction === "string")
        return forEachInObjectOnce(
          breakable,
          null,
          nodeData,
          nodeData[direction],
          callback
        );
    }
    const visited = new CompositeSetWrapper();
    let found;
    if (type2 !== "undirected") {
      if (direction !== "out") {
        found = forEachInObjectOnce(
          breakable,
          null,
          nodeData,
          nodeData.in,
          callback
        );
        if (breakable && found) return found;
        visited.wrap(nodeData.in);
      }
      if (direction !== "in") {
        found = forEachInObjectOnce(
          breakable,
          visited,
          nodeData,
          nodeData.out,
          callback
        );
        if (breakable && found) return found;
        visited.wrap(nodeData.out);
      }
    }
    if (type2 !== "directed") {
      found = forEachInObjectOnce(
        breakable,
        visited,
        nodeData,
        nodeData.undirected,
        callback
      );
      if (breakable && found) return found;
    }
    return;
  }
  function createNeighborArrayForNode(type2, direction, nodeData) {
    if (type2 !== "mixed") {
      if (type2 === "undirected") return Object.keys(nodeData.undirected);
      if (typeof direction === "string") return Object.keys(nodeData[direction]);
    }
    const neighbors = [];
    forEachNeighbor(false, type2, direction, nodeData, function(key) {
      neighbors.push(key);
    });
    return neighbors;
  }
  function createDedupedObjectIterator(visited, nodeData, object) {
    const keys = Object.keys(object);
    const l = keys.length;
    let i = 0;
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        let neighborData = null;
        do {
          if (i >= l) {
            if (visited) visited.wrap(object);
            return { done: true };
          }
          const edgeData = object[keys[i++]];
          const sourceData = edgeData.source;
          const targetData = edgeData.target;
          neighborData = sourceData === nodeData ? targetData : sourceData;
          if (visited && visited.has(neighborData.key)) {
            neighborData = null;
            continue;
          }
        } while (neighborData === null);
        return {
          done: false,
          value: { neighbor: neighborData.key, attributes: neighborData.attributes }
        };
      }
    };
  }
  function createNeighborIterator(type2, direction, nodeData) {
    if (type2 !== "mixed") {
      if (type2 === "undirected")
        return createDedupedObjectIterator(null, nodeData, nodeData.undirected);
      if (typeof direction === "string")
        return createDedupedObjectIterator(null, nodeData, nodeData[direction]);
    }
    let iterator = emptyIterator();
    const visited = new CompositeSetWrapper();
    if (type2 !== "undirected") {
      if (direction !== "out") {
        iterator = chain(
          iterator,
          createDedupedObjectIterator(visited, nodeData, nodeData.in)
        );
      }
      if (direction !== "in") {
        iterator = chain(
          iterator,
          createDedupedObjectIterator(visited, nodeData, nodeData.out)
        );
      }
    }
    if (type2 !== "directed") {
      iterator = chain(
        iterator,
        createDedupedObjectIterator(visited, nodeData, nodeData.undirected)
      );
    }
    return iterator;
  }
  function attachNeighborArrayCreator(Class, description) {
    const { name, type: type2, direction } = description;
    Class.prototype[name] = function(node) {
      if (type2 !== "mixed" && this.type !== "mixed" && type2 !== this.type)
        return [];
      node = "" + node;
      const nodeData = this._nodes.get(node);
      if (typeof nodeData === "undefined")
        throw new NotFoundGraphError(
          `Graph.${name}: could not find the "${node}" node in the graph.`
        );
      return createNeighborArrayForNode(
        type2 === "mixed" ? this.type : type2,
        direction,
        nodeData
      );
    };
  }
  function attachForEachNeighbor(Class, description) {
    const { name, type: type2, direction } = description;
    const forEachName = "forEach" + name[0].toUpperCase() + name.slice(1, -1);
    Class.prototype[forEachName] = function(node, callback) {
      if (type2 !== "mixed" && this.type !== "mixed" && type2 !== this.type) return;
      node = "" + node;
      const nodeData = this._nodes.get(node);
      if (typeof nodeData === "undefined")
        throw new NotFoundGraphError(
          `Graph.${forEachName}: could not find the "${node}" node in the graph.`
        );
      forEachNeighbor(
        false,
        type2 === "mixed" ? this.type : type2,
        direction,
        nodeData,
        callback
      );
    };
    const mapName = "map" + name[0].toUpperCase() + name.slice(1);
    Class.prototype[mapName] = function(node, callback) {
      const result = [];
      this[forEachName](node, (n, a2) => {
        result.push(callback(n, a2));
      });
      return result;
    };
    const filterName = "filter" + name[0].toUpperCase() + name.slice(1);
    Class.prototype[filterName] = function(node, callback) {
      const result = [];
      this[forEachName](node, (n, a2) => {
        if (callback(n, a2)) result.push(n);
      });
      return result;
    };
    const reduceName = "reduce" + name[0].toUpperCase() + name.slice(1);
    Class.prototype[reduceName] = function(node, callback, initialValue) {
      if (arguments.length < 3)
        throw new InvalidArgumentsGraphError(
          `Graph.${reduceName}: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.`
        );
      let accumulator = initialValue;
      this[forEachName](node, (n, a2) => {
        accumulator = callback(accumulator, n, a2);
      });
      return accumulator;
    };
  }
  function attachFindNeighbor(Class, description) {
    const { name, type: type2, direction } = description;
    const capitalizedSingular = name[0].toUpperCase() + name.slice(1, -1);
    const findName = "find" + capitalizedSingular;
    Class.prototype[findName] = function(node, callback) {
      if (type2 !== "mixed" && this.type !== "mixed" && type2 !== this.type) return;
      node = "" + node;
      const nodeData = this._nodes.get(node);
      if (typeof nodeData === "undefined")
        throw new NotFoundGraphError(
          `Graph.${findName}: could not find the "${node}" node in the graph.`
        );
      return forEachNeighbor(
        true,
        type2 === "mixed" ? this.type : type2,
        direction,
        nodeData,
        callback
      );
    };
    const someName = "some" + capitalizedSingular;
    Class.prototype[someName] = function(node, callback) {
      const found = this[findName](node, callback);
      if (found) return true;
      return false;
    };
    const everyName = "every" + capitalizedSingular;
    Class.prototype[everyName] = function(node, callback) {
      const found = this[findName](node, (n, a2) => {
        return !callback(n, a2);
      });
      if (found) return false;
      return true;
    };
  }
  function attachNeighborIteratorCreator(Class, description) {
    const { name, type: type2, direction } = description;
    const iteratorName = name.slice(0, -1) + "Entries";
    Class.prototype[iteratorName] = function(node) {
      if (type2 !== "mixed" && this.type !== "mixed" && type2 !== this.type)
        return emptyIterator();
      node = "" + node;
      const nodeData = this._nodes.get(node);
      if (typeof nodeData === "undefined")
        throw new NotFoundGraphError(
          `Graph.${iteratorName}: could not find the "${node}" node in the graph.`
        );
      return createNeighborIterator(
        type2 === "mixed" ? this.type : type2,
        direction,
        nodeData
      );
    };
  }
  function attachNeighborIterationMethods(Graph3) {
    NEIGHBORS_ITERATION.forEach((description) => {
      attachNeighborArrayCreator(Graph3, description);
      attachForEachNeighbor(Graph3, description);
      attachFindNeighbor(Graph3, description);
      attachNeighborIteratorCreator(Graph3, description);
    });
  }
  function forEachAdjacency(breakable, assymetric, disconnectedNodes, graph, callback) {
    const iterator = graph._nodes.values();
    const type2 = graph.type;
    let step, sourceData, neighbor, adj, edgeData, targetData, shouldBreak;
    while (step = iterator.next(), step.done !== true) {
      let hasEdges = false;
      sourceData = step.value;
      if (type2 !== "undirected") {
        adj = sourceData.out;
        for (neighbor in adj) {
          edgeData = adj[neighbor];
          do {
            targetData = edgeData.target;
            hasEdges = true;
            shouldBreak = callback(
              sourceData.key,
              targetData.key,
              sourceData.attributes,
              targetData.attributes,
              edgeData.key,
              edgeData.attributes,
              edgeData.undirected
            );
            if (breakable && shouldBreak) return edgeData;
            edgeData = edgeData.next;
          } while (edgeData);
        }
      }
      if (type2 !== "directed") {
        adj = sourceData.undirected;
        for (neighbor in adj) {
          if (assymetric && sourceData.key > neighbor) continue;
          edgeData = adj[neighbor];
          do {
            targetData = edgeData.target;
            if (targetData.key !== neighbor) targetData = edgeData.source;
            hasEdges = true;
            shouldBreak = callback(
              sourceData.key,
              targetData.key,
              sourceData.attributes,
              targetData.attributes,
              edgeData.key,
              edgeData.attributes,
              edgeData.undirected
            );
            if (breakable && shouldBreak) return edgeData;
            edgeData = edgeData.next;
          } while (edgeData);
        }
      }
      if (disconnectedNodes && !hasEdges) {
        shouldBreak = callback(
          sourceData.key,
          null,
          sourceData.attributes,
          null,
          null,
          null,
          null
        );
        if (breakable && shouldBreak) return null;
      }
    }
    return;
  }
  function serializeNode(key, data) {
    const serialized = { key };
    if (!isEmpty(data.attributes))
      serialized.attributes = assign({}, data.attributes);
    return serialized;
  }
  function serializeEdge(type2, key, data) {
    const serialized = {
      key,
      source: data.source.key,
      target: data.target.key
    };
    if (!isEmpty(data.attributes))
      serialized.attributes = assign({}, data.attributes);
    if (type2 === "mixed" && data.undirected) serialized.undirected = true;
    return serialized;
  }
  function validateSerializedNode(value) {
    if (!isPlainObject(value))
      throw new InvalidArgumentsGraphError(
        'Graph.import: invalid serialized node. A serialized node should be a plain object with at least a "key" property.'
      );
    if (!("key" in value))
      throw new InvalidArgumentsGraphError(
        "Graph.import: serialized node is missing its key."
      );
    if ("attributes" in value && (!isPlainObject(value.attributes) || value.attributes === null))
      throw new InvalidArgumentsGraphError(
        "Graph.import: invalid attributes. Attributes should be a plain object, null or omitted."
      );
  }
  function validateSerializedEdge(value) {
    if (!isPlainObject(value))
      throw new InvalidArgumentsGraphError(
        'Graph.import: invalid serialized edge. A serialized edge should be a plain object with at least a "source" & "target" property.'
      );
    if (!("source" in value))
      throw new InvalidArgumentsGraphError(
        "Graph.import: serialized edge is missing its source."
      );
    if (!("target" in value))
      throw new InvalidArgumentsGraphError(
        "Graph.import: serialized edge is missing its target."
      );
    if ("attributes" in value && (!isPlainObject(value.attributes) || value.attributes === null))
      throw new InvalidArgumentsGraphError(
        "Graph.import: invalid attributes. Attributes should be a plain object, null or omitted."
      );
    if ("undirected" in value && typeof value.undirected !== "boolean")
      throw new InvalidArgumentsGraphError(
        "Graph.import: invalid undirectedness information. Undirected should be boolean or omitted."
      );
  }
  var INSTANCE_ID = incrementalIdStartingFromRandomByte();
  var TYPES = /* @__PURE__ */ new Set(["directed", "undirected", "mixed"]);
  var EMITTER_PROPS = /* @__PURE__ */ new Set([
    "domain",
    "_events",
    "_eventsCount",
    "_maxListeners"
  ]);
  var EDGE_ADD_METHODS = [
    {
      name: (verb) => `${verb}Edge`,
      generateKey: true
    },
    {
      name: (verb) => `${verb}DirectedEdge`,
      generateKey: true,
      type: "directed"
    },
    {
      name: (verb) => `${verb}UndirectedEdge`,
      generateKey: true,
      type: "undirected"
    },
    {
      name: (verb) => `${verb}EdgeWithKey`
    },
    {
      name: (verb) => `${verb}DirectedEdgeWithKey`,
      type: "directed"
    },
    {
      name: (verb) => `${verb}UndirectedEdgeWithKey`,
      type: "undirected"
    }
  ];
  var DEFAULTS = {
    allowSelfLoops: true,
    multi: false,
    type: "mixed"
  };
  function addNode(graph, node, attributes) {
    if (attributes && !isPlainObject(attributes))
      throw new InvalidArgumentsGraphError(
        `Graph.addNode: invalid attributes. Expecting an object but got "${attributes}"`
      );
    node = "" + node;
    attributes = attributes || {};
    if (graph._nodes.has(node))
      throw new UsageGraphError(
        `Graph.addNode: the "${node}" node already exist in the graph.`
      );
    const data = new graph.NodeDataClass(node, attributes);
    graph._nodes.set(node, data);
    graph.emit("nodeAdded", {
      key: node,
      attributes
    });
    return data;
  }
  function unsafeAddNode(graph, node, attributes) {
    const data = new graph.NodeDataClass(node, attributes);
    graph._nodes.set(node, data);
    graph.emit("nodeAdded", {
      key: node,
      attributes
    });
    return data;
  }
  function addEdge(graph, name, mustGenerateKey, undirected, edge, source, target, attributes) {
    if (!undirected && graph.type === "undirected")
      throw new UsageGraphError(
        `Graph.${name}: you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead.`
      );
    if (undirected && graph.type === "directed")
      throw new UsageGraphError(
        `Graph.${name}: you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead.`
      );
    if (attributes && !isPlainObject(attributes))
      throw new InvalidArgumentsGraphError(
        `Graph.${name}: invalid attributes. Expecting an object but got "${attributes}"`
      );
    source = "" + source;
    target = "" + target;
    attributes = attributes || {};
    if (!graph.allowSelfLoops && source === target)
      throw new UsageGraphError(
        `Graph.${name}: source & target are the same ("${source}"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`
      );
    const sourceData = graph._nodes.get(source), targetData = graph._nodes.get(target);
    if (!sourceData)
      throw new NotFoundGraphError(
        `Graph.${name}: source node "${source}" not found.`
      );
    if (!targetData)
      throw new NotFoundGraphError(
        `Graph.${name}: target node "${target}" not found.`
      );
    const eventData = {
      key: null,
      undirected,
      source,
      target,
      attributes
    };
    if (mustGenerateKey) {
      edge = graph._edgeKeyGenerator();
    } else {
      edge = "" + edge;
      if (graph._edges.has(edge))
        throw new UsageGraphError(
          `Graph.${name}: the "${edge}" edge already exists in the graph.`
        );
    }
    if (!graph.multi && (undirected ? typeof sourceData.undirected[target] !== "undefined" : typeof sourceData.out[target] !== "undefined")) {
      throw new UsageGraphError(
        `Graph.${name}: an edge linking "${source}" to "${target}" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the 'multi' option.`
      );
    }
    const edgeData = new EdgeData(
      undirected,
      edge,
      sourceData,
      targetData,
      attributes
    );
    graph._edges.set(edge, edgeData);
    const isSelfLoop = source === target;
    if (undirected) {
      sourceData.undirectedDegree++;
      targetData.undirectedDegree++;
      if (isSelfLoop) {
        sourceData.undirectedLoops++;
        graph._undirectedSelfLoopCount++;
      }
    } else {
      sourceData.outDegree++;
      targetData.inDegree++;
      if (isSelfLoop) {
        sourceData.directedLoops++;
        graph._directedSelfLoopCount++;
      }
    }
    if (graph.multi) edgeData.attachMulti();
    else edgeData.attach();
    if (undirected) graph._undirectedSize++;
    else graph._directedSize++;
    eventData.key = edge;
    graph.emit("edgeAdded", eventData);
    return edge;
  }
  function mergeEdge(graph, name, mustGenerateKey, undirected, edge, source, target, attributes, asUpdater) {
    if (!undirected && graph.type === "undirected")
      throw new UsageGraphError(
        `Graph.${name}: you cannot merge/update a directed edge to an undirected graph. Use the #.mergeEdge/#.updateEdge or #.addUndirectedEdge instead.`
      );
    if (undirected && graph.type === "directed")
      throw new UsageGraphError(
        `Graph.${name}: you cannot merge/update an undirected edge to a directed graph. Use the #.mergeEdge/#.updateEdge or #.addDirectedEdge instead.`
      );
    if (attributes) {
      if (asUpdater) {
        if (typeof attributes !== "function")
          throw new InvalidArgumentsGraphError(
            `Graph.${name}: invalid updater function. Expecting a function but got "${attributes}"`
          );
      } else {
        if (!isPlainObject(attributes))
          throw new InvalidArgumentsGraphError(
            `Graph.${name}: invalid attributes. Expecting an object but got "${attributes}"`
          );
      }
    }
    source = "" + source;
    target = "" + target;
    let updater;
    if (asUpdater) {
      updater = attributes;
      attributes = void 0;
    }
    if (!graph.allowSelfLoops && source === target)
      throw new UsageGraphError(
        `Graph.${name}: source & target are the same ("${source}"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`
      );
    let sourceData = graph._nodes.get(source);
    let targetData = graph._nodes.get(target);
    let edgeData;
    let alreadyExistingEdgeData;
    if (!mustGenerateKey) {
      edgeData = graph._edges.get(edge);
      if (edgeData) {
        if (edgeData.source.key !== source || edgeData.target.key !== target) {
          if (!undirected || edgeData.source.key !== target || edgeData.target.key !== source) {
            throw new UsageGraphError(
              `Graph.${name}: inconsistency detected when attempting to merge the "${edge}" edge with "${source}" source & "${target}" target vs. ("${edgeData.source.key}", "${edgeData.target.key}").`
            );
          }
        }
        alreadyExistingEdgeData = edgeData;
      }
    }
    if (!alreadyExistingEdgeData && !graph.multi && sourceData) {
      alreadyExistingEdgeData = undirected ? sourceData.undirected[target] : sourceData.out[target];
    }
    if (alreadyExistingEdgeData) {
      const info = [alreadyExistingEdgeData.key, false, false, false];
      if (asUpdater ? !updater : !attributes) return info;
      if (asUpdater) {
        const oldAttributes = alreadyExistingEdgeData.attributes;
        alreadyExistingEdgeData.attributes = updater(oldAttributes);
        graph.emit("edgeAttributesUpdated", {
          type: "replace",
          key: alreadyExistingEdgeData.key,
          attributes: alreadyExistingEdgeData.attributes
        });
      } else {
        assign(alreadyExistingEdgeData.attributes, attributes);
        graph.emit("edgeAttributesUpdated", {
          type: "merge",
          key: alreadyExistingEdgeData.key,
          attributes: alreadyExistingEdgeData.attributes,
          data: attributes
        });
      }
      return info;
    }
    attributes = attributes || {};
    if (asUpdater && updater) attributes = updater(attributes);
    const eventData = {
      key: null,
      undirected,
      source,
      target,
      attributes
    };
    if (mustGenerateKey) {
      edge = graph._edgeKeyGenerator();
    } else {
      edge = "" + edge;
      if (graph._edges.has(edge))
        throw new UsageGraphError(
          `Graph.${name}: the "${edge}" edge already exists in the graph.`
        );
    }
    let sourceWasAdded = false;
    let targetWasAdded = false;
    if (!sourceData) {
      sourceData = unsafeAddNode(graph, source, {});
      sourceWasAdded = true;
      if (source === target) {
        targetData = sourceData;
        targetWasAdded = true;
      }
    }
    if (!targetData) {
      targetData = unsafeAddNode(graph, target, {});
      targetWasAdded = true;
    }
    edgeData = new EdgeData(undirected, edge, sourceData, targetData, attributes);
    graph._edges.set(edge, edgeData);
    const isSelfLoop = source === target;
    if (undirected) {
      sourceData.undirectedDegree++;
      targetData.undirectedDegree++;
      if (isSelfLoop) {
        sourceData.undirectedLoops++;
        graph._undirectedSelfLoopCount++;
      }
    } else {
      sourceData.outDegree++;
      targetData.inDegree++;
      if (isSelfLoop) {
        sourceData.directedLoops++;
        graph._directedSelfLoopCount++;
      }
    }
    if (graph.multi) edgeData.attachMulti();
    else edgeData.attach();
    if (undirected) graph._undirectedSize++;
    else graph._directedSize++;
    eventData.key = edge;
    graph.emit("edgeAdded", eventData);
    return [edge, true, sourceWasAdded, targetWasAdded];
  }
  function dropEdgeFromData(graph, edgeData) {
    graph._edges.delete(edgeData.key);
    const { source: sourceData, target: targetData, attributes } = edgeData;
    const undirected = edgeData.undirected;
    const isSelfLoop = sourceData === targetData;
    if (undirected) {
      sourceData.undirectedDegree--;
      targetData.undirectedDegree--;
      if (isSelfLoop) {
        sourceData.undirectedLoops--;
        graph._undirectedSelfLoopCount--;
      }
    } else {
      sourceData.outDegree--;
      targetData.inDegree--;
      if (isSelfLoop) {
        sourceData.directedLoops--;
        graph._directedSelfLoopCount--;
      }
    }
    if (graph.multi) edgeData.detachMulti();
    else edgeData.detach();
    if (undirected) graph._undirectedSize--;
    else graph._directedSize--;
    graph.emit("edgeDropped", {
      key: edgeData.key,
      attributes,
      source: sourceData.key,
      target: targetData.key,
      undirected
    });
  }
  var Graph = class _Graph extends import_events.EventEmitter {
    constructor(options) {
      super();
      options = assign({}, DEFAULTS, options);
      if (typeof options.multi !== "boolean")
        throw new InvalidArgumentsGraphError(
          `Graph.constructor: invalid 'multi' option. Expecting a boolean but got "${options.multi}".`
        );
      if (!TYPES.has(options.type))
        throw new InvalidArgumentsGraphError(
          `Graph.constructor: invalid 'type' option. Should be one of "mixed", "directed" or "undirected" but got "${options.type}".`
        );
      if (typeof options.allowSelfLoops !== "boolean")
        throw new InvalidArgumentsGraphError(
          `Graph.constructor: invalid 'allowSelfLoops' option. Expecting a boolean but got "${options.allowSelfLoops}".`
        );
      const NodeDataClass = options.type === "mixed" ? MixedNodeData : options.type === "directed" ? DirectedNodeData : UndirectedNodeData;
      privateProperty(this, "NodeDataClass", NodeDataClass);
      const instancePrefix = "geid_" + INSTANCE_ID() + "_";
      let edgeId = 0;
      const edgeKeyGenerator = () => {
        let availableEdgeKey;
        do {
          availableEdgeKey = instancePrefix + edgeId++;
        } while (this._edges.has(availableEdgeKey));
        return availableEdgeKey;
      };
      privateProperty(this, "_attributes", {});
      privateProperty(this, "_nodes", /* @__PURE__ */ new Map());
      privateProperty(this, "_edges", /* @__PURE__ */ new Map());
      privateProperty(this, "_directedSize", 0);
      privateProperty(this, "_undirectedSize", 0);
      privateProperty(this, "_directedSelfLoopCount", 0);
      privateProperty(this, "_undirectedSelfLoopCount", 0);
      privateProperty(this, "_edgeKeyGenerator", edgeKeyGenerator);
      privateProperty(this, "_options", options);
      EMITTER_PROPS.forEach((prop) => privateProperty(this, prop, this[prop]));
      readOnlyProperty(this, "order", () => this._nodes.size);
      readOnlyProperty(this, "size", () => this._edges.size);
      readOnlyProperty(this, "directedSize", () => this._directedSize);
      readOnlyProperty(this, "undirectedSize", () => this._undirectedSize);
      readOnlyProperty(
        this,
        "selfLoopCount",
        () => this._directedSelfLoopCount + this._undirectedSelfLoopCount
      );
      readOnlyProperty(
        this,
        "directedSelfLoopCount",
        () => this._directedSelfLoopCount
      );
      readOnlyProperty(
        this,
        "undirectedSelfLoopCount",
        () => this._undirectedSelfLoopCount
      );
      readOnlyProperty(this, "multi", this._options.multi);
      readOnlyProperty(this, "type", this._options.type);
      readOnlyProperty(this, "allowSelfLoops", this._options.allowSelfLoops);
      readOnlyProperty(this, "implementation", () => "graphology");
    }
    _resetInstanceCounters() {
      this._directedSize = 0;
      this._undirectedSize = 0;
      this._directedSelfLoopCount = 0;
      this._undirectedSelfLoopCount = 0;
    }
    /**---------------------------------------------------------------------------
     * Read
     **---------------------------------------------------------------------------
     */
    /**
     * Method returning whether the given node is found in the graph.
     *
     * @param  {any}     node - The node.
     * @return {boolean}
     */
    hasNode(node) {
      return this._nodes.has("" + node);
    }
    /**
     * Method returning whether the given directed edge is found in the graph.
     *
     * Arity 1:
     * @param  {any}     edge - The edge's key.
     *
     * Arity 2:
     * @param  {any}     source - The edge's source.
     * @param  {any}     target - The edge's target.
     *
     * @return {boolean}
     *
     * @throws {Error} - Will throw if the arguments are invalid.
     */
    hasDirectedEdge(source, target) {
      if (this.type === "undirected") return false;
      if (arguments.length === 1) {
        const edge = "" + source;
        const edgeData = this._edges.get(edge);
        return !!edgeData && !edgeData.undirected;
      } else if (arguments.length === 2) {
        source = "" + source;
        target = "" + target;
        const nodeData = this._nodes.get(source);
        if (!nodeData) return false;
        return nodeData.out.hasOwnProperty(target);
      }
      throw new InvalidArgumentsGraphError(
        `Graph.hasDirectedEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`
      );
    }
    /**
     * Method returning whether the given undirected edge is found in the graph.
     *
     * Arity 1:
     * @param  {any}     edge - The edge's key.
     *
     * Arity 2:
     * @param  {any}     source - The edge's source.
     * @param  {any}     target - The edge's target.
     *
     * @return {boolean}
     *
     * @throws {Error} - Will throw if the arguments are invalid.
     */
    hasUndirectedEdge(source, target) {
      if (this.type === "directed") return false;
      if (arguments.length === 1) {
        const edge = "" + source;
        const edgeData = this._edges.get(edge);
        return !!edgeData && edgeData.undirected;
      } else if (arguments.length === 2) {
        source = "" + source;
        target = "" + target;
        const nodeData = this._nodes.get(source);
        if (!nodeData) return false;
        return nodeData.undirected.hasOwnProperty(target);
      }
      throw new InvalidArgumentsGraphError(
        `Graph.hasDirectedEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`
      );
    }
    /**
     * Method returning whether the given edge is found in the graph.
     *
     * Arity 1:
     * @param  {any}     edge - The edge's key.
     *
     * Arity 2:
     * @param  {any}     source - The edge's source.
     * @param  {any}     target - The edge's target.
     *
     * @return {boolean}
     *
     * @throws {Error} - Will throw if the arguments are invalid.
     */
    hasEdge(source, target) {
      if (arguments.length === 1) {
        const edge = "" + source;
        return this._edges.has(edge);
      } else if (arguments.length === 2) {
        source = "" + source;
        target = "" + target;
        const nodeData = this._nodes.get(source);
        if (!nodeData) return false;
        return typeof nodeData.out !== "undefined" && nodeData.out.hasOwnProperty(target) || typeof nodeData.undirected !== "undefined" && nodeData.undirected.hasOwnProperty(target);
      }
      throw new InvalidArgumentsGraphError(
        `Graph.hasEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`
      );
    }
    /**
     * Method returning the edge matching source & target in a directed fashion.
     *
     * @param  {any} source - The edge's source.
     * @param  {any} target - The edge's target.
     *
     * @return {any|undefined}
     *
     * @throws {Error} - Will throw if the graph is multi.
     * @throws {Error} - Will throw if source or target doesn't exist.
     */
    directedEdge(source, target) {
      if (this.type === "undirected") return;
      source = "" + source;
      target = "" + target;
      if (this.multi)
        throw new UsageGraphError(
          "Graph.directedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.directedEdges instead."
        );
      const sourceData = this._nodes.get(source);
      if (!sourceData)
        throw new NotFoundGraphError(
          `Graph.directedEdge: could not find the "${source}" source node in the graph.`
        );
      if (!this._nodes.has(target))
        throw new NotFoundGraphError(
          `Graph.directedEdge: could not find the "${target}" target node in the graph.`
        );
      const edgeData = sourceData.out && sourceData.out[target] || void 0;
      if (edgeData) return edgeData.key;
    }
    /**
     * Method returning the edge matching source & target in a undirected fashion.
     *
     * @param  {any} source - The edge's source.
     * @param  {any} target - The edge's target.
     *
     * @return {any|undefined}
     *
     * @throws {Error} - Will throw if the graph is multi.
     * @throws {Error} - Will throw if source or target doesn't exist.
     */
    undirectedEdge(source, target) {
      if (this.type === "directed") return;
      source = "" + source;
      target = "" + target;
      if (this.multi)
        throw new UsageGraphError(
          "Graph.undirectedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.undirectedEdges instead."
        );
      const sourceData = this._nodes.get(source);
      if (!sourceData)
        throw new NotFoundGraphError(
          `Graph.undirectedEdge: could not find the "${source}" source node in the graph.`
        );
      if (!this._nodes.has(target))
        throw new NotFoundGraphError(
          `Graph.undirectedEdge: could not find the "${target}" target node in the graph.`
        );
      const edgeData = sourceData.undirected && sourceData.undirected[target] || void 0;
      if (edgeData) return edgeData.key;
    }
    /**
     * Method returning the edge matching source & target in a mixed fashion.
     *
     * @param  {any} source - The edge's source.
     * @param  {any} target - The edge's target.
     *
     * @return {any|undefined}
     *
     * @throws {Error} - Will throw if the graph is multi.
     * @throws {Error} - Will throw if source or target doesn't exist.
     */
    edge(source, target) {
      if (this.multi)
        throw new UsageGraphError(
          "Graph.edge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.edges instead."
        );
      source = "" + source;
      target = "" + target;
      const sourceData = this._nodes.get(source);
      if (!sourceData)
        throw new NotFoundGraphError(
          `Graph.edge: could not find the "${source}" source node in the graph.`
        );
      if (!this._nodes.has(target))
        throw new NotFoundGraphError(
          `Graph.edge: could not find the "${target}" target node in the graph.`
        );
      const edgeData = sourceData.out && sourceData.out[target] || sourceData.undirected && sourceData.undirected[target] || void 0;
      if (edgeData) return edgeData.key;
    }
    /**
     * Method returning whether two nodes are directed neighbors.
     *
     * @param  {any}     node     - The node's key.
     * @param  {any}     neighbor - The neighbor's key.
     * @return {boolean}
     *
     * @throws {Error} - Will throw if the node isn't in the graph.
     */
    areDirectedNeighbors(node, neighbor) {
      node = "" + node;
      neighbor = "" + neighbor;
      const nodeData = this._nodes.get(node);
      if (!nodeData)
        throw new NotFoundGraphError(
          `Graph.areDirectedNeighbors: could not find the "${node}" node in the graph.`
        );
      if (this.type === "undirected") return false;
      return neighbor in nodeData.in || neighbor in nodeData.out;
    }
    /**
     * Method returning whether two nodes are out neighbors.
     *
     * @param  {any}     node     - The node's key.
     * @param  {any}     neighbor - The neighbor's key.
     * @return {boolean}
     *
     * @throws {Error} - Will throw if the node isn't in the graph.
     */
    areOutNeighbors(node, neighbor) {
      node = "" + node;
      neighbor = "" + neighbor;
      const nodeData = this._nodes.get(node);
      if (!nodeData)
        throw new NotFoundGraphError(
          `Graph.areOutNeighbors: could not find the "${node}" node in the graph.`
        );
      if (this.type === "undirected") return false;
      return neighbor in nodeData.out;
    }
    /**
     * Method returning whether two nodes are in neighbors.
     *
     * @param  {any}     node     - The node's key.
     * @param  {any}     neighbor - The neighbor's key.
     * @return {boolean}
     *
     * @throws {Error} - Will throw if the node isn't in the graph.
     */
    areInNeighbors(node, neighbor) {
      node = "" + node;
      neighbor = "" + neighbor;
      const nodeData = this._nodes.get(node);
      if (!nodeData)
        throw new NotFoundGraphError(
          `Graph.areInNeighbors: could not find the "${node}" node in the graph.`
        );
      if (this.type === "undirected") return false;
      return neighbor in nodeData.in;
    }
    /**
     * Method returning whether two nodes are undirected neighbors.
     *
     * @param  {any}     node     - The node's key.
     * @param  {any}     neighbor - The neighbor's key.
     * @return {boolean}
     *
     * @throws {Error} - Will throw if the node isn't in the graph.
     */
    areUndirectedNeighbors(node, neighbor) {
      node = "" + node;
      neighbor = "" + neighbor;
      const nodeData = this._nodes.get(node);
      if (!nodeData)
        throw new NotFoundGraphError(
          `Graph.areUndirectedNeighbors: could not find the "${node}" node in the graph.`
        );
      if (this.type === "directed") return false;
      return neighbor in nodeData.undirected;
    }
    /**
     * Method returning whether two nodes are neighbors.
     *
     * @param  {any}     node     - The node's key.
     * @param  {any}     neighbor - The neighbor's key.
     * @return {boolean}
     *
     * @throws {Error} - Will throw if the node isn't in the graph.
     */
    areNeighbors(node, neighbor) {
      node = "" + node;
      neighbor = "" + neighbor;
      const nodeData = this._nodes.get(node);
      if (!nodeData)
        throw new NotFoundGraphError(
          `Graph.areNeighbors: could not find the "${node}" node in the graph.`
        );
      if (this.type !== "undirected") {
        if (neighbor in nodeData.in || neighbor in nodeData.out) return true;
      }
      if (this.type !== "directed") {
        if (neighbor in nodeData.undirected) return true;
      }
      return false;
    }
    /**
     * Method returning whether two nodes are inbound neighbors.
     *
     * @param  {any}     node     - The node's key.
     * @param  {any}     neighbor - The neighbor's key.
     * @return {boolean}
     *
     * @throws {Error} - Will throw if the node isn't in the graph.
     */
    areInboundNeighbors(node, neighbor) {
      node = "" + node;
      neighbor = "" + neighbor;
      const nodeData = this._nodes.get(node);
      if (!nodeData)
        throw new NotFoundGraphError(
          `Graph.areInboundNeighbors: could not find the "${node}" node in the graph.`
        );
      if (this.type !== "undirected") {
        if (neighbor in nodeData.in) return true;
      }
      if (this.type !== "directed") {
        if (neighbor in nodeData.undirected) return true;
      }
      return false;
    }
    /**
     * Method returning whether two nodes are outbound neighbors.
     *
     * @param  {any}     node     - The node's key.
     * @param  {any}     neighbor - The neighbor's key.
     * @return {boolean}
     *
     * @throws {Error} - Will throw if the node isn't in the graph.
     */
    areOutboundNeighbors(node, neighbor) {
      node = "" + node;
      neighbor = "" + neighbor;
      const nodeData = this._nodes.get(node);
      if (!nodeData)
        throw new NotFoundGraphError(
          `Graph.areOutboundNeighbors: could not find the "${node}" node in the graph.`
        );
      if (this.type !== "undirected") {
        if (neighbor in nodeData.out) return true;
      }
      if (this.type !== "directed") {
        if (neighbor in nodeData.undirected) return true;
      }
      return false;
    }
    /**
     * Method returning the given node's in degree.
     *
     * @param  {any}     node - The node's key.
     * @return {number}       - The node's in degree.
     *
     * @throws {Error} - Will throw if the node isn't in the graph.
     */
    inDegree(node) {
      node = "" + node;
      const nodeData = this._nodes.get(node);
      if (!nodeData)
        throw new NotFoundGraphError(
          `Graph.inDegree: could not find the "${node}" node in the graph.`
        );
      if (this.type === "undirected") return 0;
      return nodeData.inDegree;
    }
    /**
     * Method returning the given node's out degree.
     *
     * @param  {any}     node - The node's key.
     * @return {number}       - The node's in degree.
     *
     * @throws {Error} - Will throw if the node isn't in the graph.
     */
    outDegree(node) {
      node = "" + node;
      const nodeData = this._nodes.get(node);
      if (!nodeData)
        throw new NotFoundGraphError(
          `Graph.outDegree: could not find the "${node}" node in the graph.`
        );
      if (this.type === "undirected") return 0;
      return nodeData.outDegree;
    }
    /**
     * Method returning the given node's directed degree.
     *
     * @param  {any}     node - The node's key.
     * @return {number}       - The node's in degree.
     *
     * @throws {Error} - Will throw if the node isn't in the graph.
     */
    directedDegree(node) {
      node = "" + node;
      const nodeData = this._nodes.get(node);
      if (!nodeData)
        throw new NotFoundGraphError(
          `Graph.directedDegree: could not find the "${node}" node in the graph.`
        );
      if (this.type === "undirected") return 0;
      return nodeData.inDegree + nodeData.outDegree;
    }
    /**
     * Method returning the given node's undirected degree.
     *
     * @param  {any}     node - The node's key.
     * @return {number}       - The node's in degree.
     *
     * @throws {Error} - Will throw if the node isn't in the graph.
     */
    undirectedDegree(node) {
      node = "" + node;
      const nodeData = this._nodes.get(node);
      if (!nodeData)
        throw new NotFoundGraphError(
          `Graph.undirectedDegree: could not find the "${node}" node in the graph.`
        );
      if (this.type === "directed") return 0;
      return nodeData.undirectedDegree;
    }
    /**
     * Method returning the given node's inbound degree.
     *
     * @param  {any}     node - The node's key.
     * @return {number}       - The node's inbound degree.
     *
     * @throws {Error} - Will throw if the node isn't in the graph.
     */
    inboundDegree(node) {
      node = "" + node;
      const nodeData = this._nodes.get(node);
      if (!nodeData)
        throw new NotFoundGraphError(
          `Graph.inboundDegree: could not find the "${node}" node in the graph.`
        );
      let degree = 0;
      if (this.type !== "directed") {
        degree += nodeData.undirectedDegree;
      }
      if (this.type !== "undirected") {
        degree += nodeData.inDegree;
      }
      return degree;
    }
    /**
     * Method returning the given node's outbound degree.
     *
     * @param  {any}     node - The node's key.
     * @return {number}       - The node's outbound degree.
     *
     * @throws {Error} - Will throw if the node isn't in the graph.
     */
    outboundDegree(node) {
      node = "" + node;
      const nodeData = this._nodes.get(node);
      if (!nodeData)
        throw new NotFoundGraphError(
          `Graph.outboundDegree: could not find the "${node}" node in the graph.`
        );
      let degree = 0;
      if (this.type !== "directed") {
        degree += nodeData.undirectedDegree;
      }
      if (this.type !== "undirected") {
        degree += nodeData.outDegree;
      }
      return degree;
    }
    /**
     * Method returning the given node's directed degree.
     *
     * @param  {any}     node - The node's key.
     * @return {number}       - The node's degree.
     *
     * @throws {Error} - Will throw if the node isn't in the graph.
     */
    degree(node) {
      node = "" + node;
      const nodeData = this._nodes.get(node);
      if (!nodeData)
        throw new NotFoundGraphError(
          `Graph.degree: could not find the "${node}" node in the graph.`
        );
      let degree = 0;
      if (this.type !== "directed") {
        degree += nodeData.undirectedDegree;
      }
      if (this.type !== "undirected") {
        degree += nodeData.inDegree + nodeData.outDegree;
      }
      return degree;
    }
    /**
     * Method returning the given node's in degree without considering self loops.
     *
     * @param  {any}     node - The node's key.
     * @return {number}       - The node's in degree.
     *
     * @throws {Error} - Will throw if the node isn't in the graph.
     */
    inDegreeWithoutSelfLoops(node) {
      node = "" + node;
      const nodeData = this._nodes.get(node);
      if (!nodeData)
        throw new NotFoundGraphError(
          `Graph.inDegreeWithoutSelfLoops: could not find the "${node}" node in the graph.`
        );
      if (this.type === "undirected") return 0;
      return nodeData.inDegree - nodeData.directedLoops;
    }
    /**
     * Method returning the given node's out degree without considering self loops.
     *
     * @param  {any}     node - The node's key.
     * @return {number}       - The node's in degree.
     *
     * @throws {Error} - Will throw if the node isn't in the graph.
     */
    outDegreeWithoutSelfLoops(node) {
      node = "" + node;
      const nodeData = this._nodes.get(node);
      if (!nodeData)
        throw new NotFoundGraphError(
          `Graph.outDegreeWithoutSelfLoops: could not find the "${node}" node in the graph.`
        );
      if (this.type === "undirected") return 0;
      return nodeData.outDegree - nodeData.directedLoops;
    }
    /**
     * Method returning the given node's directed degree without considering self loops.
     *
     * @param  {any}     node - The node's key.
     * @return {number}       - The node's in degree.
     *
     * @throws {Error} - Will throw if the node isn't in the graph.
     */
    directedDegreeWithoutSelfLoops(node) {
      node = "" + node;
      const nodeData = this._nodes.get(node);
      if (!nodeData)
        throw new NotFoundGraphError(
          `Graph.directedDegreeWithoutSelfLoops: could not find the "${node}" node in the graph.`
        );
      if (this.type === "undirected") return 0;
      return nodeData.inDegree + nodeData.outDegree - nodeData.directedLoops * 2;
    }
    /**
     * Method returning the given node's undirected degree without considering self loops.
     *
     * @param  {any}     node - The node's key.
     * @return {number}       - The node's in degree.
     *
     * @throws {Error} - Will throw if the node isn't in the graph.
     */
    undirectedDegreeWithoutSelfLoops(node) {
      node = "" + node;
      const nodeData = this._nodes.get(node);
      if (!nodeData)
        throw new NotFoundGraphError(
          `Graph.undirectedDegreeWithoutSelfLoops: could not find the "${node}" node in the graph.`
        );
      if (this.type === "directed") return 0;
      return nodeData.undirectedDegree - nodeData.undirectedLoops * 2;
    }
    /**
     * Method returning the given node's inbound degree without considering self loops.
     *
     * @param  {any}     node - The node's key.
     * @return {number}       - The node's inbound degree.
     *
     * @throws {Error} - Will throw if the node isn't in the graph.
     */
    inboundDegreeWithoutSelfLoops(node) {
      node = "" + node;
      const nodeData = this._nodes.get(node);
      if (!nodeData)
        throw new NotFoundGraphError(
          `Graph.inboundDegreeWithoutSelfLoops: could not find the "${node}" node in the graph.`
        );
      let degree = 0;
      let loops = 0;
      if (this.type !== "directed") {
        degree += nodeData.undirectedDegree;
        loops += nodeData.undirectedLoops * 2;
      }
      if (this.type !== "undirected") {
        degree += nodeData.inDegree;
        loops += nodeData.directedLoops;
      }
      return degree - loops;
    }
    /**
     * Method returning the given node's outbound degree without considering self loops.
     *
     * @param  {any}     node - The node's key.
     * @return {number}       - The node's outbound degree.
     *
     * @throws {Error} - Will throw if the node isn't in the graph.
     */
    outboundDegreeWithoutSelfLoops(node) {
      node = "" + node;
      const nodeData = this._nodes.get(node);
      if (!nodeData)
        throw new NotFoundGraphError(
          `Graph.outboundDegreeWithoutSelfLoops: could not find the "${node}" node in the graph.`
        );
      let degree = 0;
      let loops = 0;
      if (this.type !== "directed") {
        degree += nodeData.undirectedDegree;
        loops += nodeData.undirectedLoops * 2;
      }
      if (this.type !== "undirected") {
        degree += nodeData.outDegree;
        loops += nodeData.directedLoops;
      }
      return degree - loops;
    }
    /**
     * Method returning the given node's directed degree without considering self loops.
     *
     * @param  {any}     node - The node's key.
     * @return {number}       - The node's degree.
     *
     * @throws {Error} - Will throw if the node isn't in the graph.
     */
    degreeWithoutSelfLoops(node) {
      node = "" + node;
      const nodeData = this._nodes.get(node);
      if (!nodeData)
        throw new NotFoundGraphError(
          `Graph.degreeWithoutSelfLoops: could not find the "${node}" node in the graph.`
        );
      let degree = 0;
      let loops = 0;
      if (this.type !== "directed") {
        degree += nodeData.undirectedDegree;
        loops += nodeData.undirectedLoops * 2;
      }
      if (this.type !== "undirected") {
        degree += nodeData.inDegree + nodeData.outDegree;
        loops += nodeData.directedLoops * 2;
      }
      return degree - loops;
    }
    /**
     * Method returning the given edge's source.
     *
     * @param  {any} edge - The edge's key.
     * @return {any}      - The edge's source.
     *
     * @throws {Error} - Will throw if the edge isn't in the graph.
     */
    source(edge) {
      edge = "" + edge;
      const data = this._edges.get(edge);
      if (!data)
        throw new NotFoundGraphError(
          `Graph.source: could not find the "${edge}" edge in the graph.`
        );
      return data.source.key;
    }
    /**
     * Method returning the given edge's target.
     *
     * @param  {any} edge - The edge's key.
     * @return {any}      - The edge's target.
     *
     * @throws {Error} - Will throw if the edge isn't in the graph.
     */
    target(edge) {
      edge = "" + edge;
      const data = this._edges.get(edge);
      if (!data)
        throw new NotFoundGraphError(
          `Graph.target: could not find the "${edge}" edge in the graph.`
        );
      return data.target.key;
    }
    /**
     * Method returning the given edge's extremities.
     *
     * @param  {any}   edge - The edge's key.
     * @return {array}      - The edge's extremities.
     *
     * @throws {Error} - Will throw if the edge isn't in the graph.
     */
    extremities(edge) {
      edge = "" + edge;
      const edgeData = this._edges.get(edge);
      if (!edgeData)
        throw new NotFoundGraphError(
          `Graph.extremities: could not find the "${edge}" edge in the graph.`
        );
      return [edgeData.source.key, edgeData.target.key];
    }
    /**
     * Given a node & an edge, returns the other extremity of the edge.
     *
     * @param  {any}   node - The node's key.
     * @param  {any}   edge - The edge's key.
     * @return {any}        - The related node.
     *
     * @throws {Error} - Will throw if the edge isn't in the graph or if the
     *                   edge & node are not related.
     */
    opposite(node, edge) {
      node = "" + node;
      edge = "" + edge;
      const data = this._edges.get(edge);
      if (!data)
        throw new NotFoundGraphError(
          `Graph.opposite: could not find the "${edge}" edge in the graph.`
        );
      const source = data.source.key;
      const target = data.target.key;
      if (node === source) return target;
      if (node === target) return source;
      throw new NotFoundGraphError(
        `Graph.opposite: the "${node}" node is not attached to the "${edge}" edge (${source}, ${target}).`
      );
    }
    /**
     * Returns whether the given edge has the given node as extremity.
     *
     * @param  {any}     edge - The edge's key.
     * @param  {any}     node - The node's key.
     * @return {boolean}      - The related node.
     *
     * @throws {Error} - Will throw if either the node or the edge isn't in the graph.
     */
    hasExtremity(edge, node) {
      edge = "" + edge;
      node = "" + node;
      const data = this._edges.get(edge);
      if (!data)
        throw new NotFoundGraphError(
          `Graph.hasExtremity: could not find the "${edge}" edge in the graph.`
        );
      return data.source.key === node || data.target.key === node;
    }
    /**
     * Method returning whether the given edge is undirected.
     *
     * @param  {any}     edge - The edge's key.
     * @return {boolean}
     *
     * @throws {Error} - Will throw if the edge isn't in the graph.
     */
    isUndirected(edge) {
      edge = "" + edge;
      const data = this._edges.get(edge);
      if (!data)
        throw new NotFoundGraphError(
          `Graph.isUndirected: could not find the "${edge}" edge in the graph.`
        );
      return data.undirected;
    }
    /**
     * Method returning whether the given edge is directed.
     *
     * @param  {any}     edge - The edge's key.
     * @return {boolean}
     *
     * @throws {Error} - Will throw if the edge isn't in the graph.
     */
    isDirected(edge) {
      edge = "" + edge;
      const data = this._edges.get(edge);
      if (!data)
        throw new NotFoundGraphError(
          `Graph.isDirected: could not find the "${edge}" edge in the graph.`
        );
      return !data.undirected;
    }
    /**
     * Method returning whether the given edge is a self loop.
     *
     * @param  {any}     edge - The edge's key.
     * @return {boolean}
     *
     * @throws {Error} - Will throw if the edge isn't in the graph.
     */
    isSelfLoop(edge) {
      edge = "" + edge;
      const data = this._edges.get(edge);
      if (!data)
        throw new NotFoundGraphError(
          `Graph.isSelfLoop: could not find the "${edge}" edge in the graph.`
        );
      return data.source === data.target;
    }
    /**---------------------------------------------------------------------------
     * Mutation
     **---------------------------------------------------------------------------
     */
    /**
     * Method used to add a node to the graph.
     *
     * @param  {any}    node         - The node.
     * @param  {object} [attributes] - Optional attributes.
     * @return {any}                 - The node.
     *
     * @throws {Error} - Will throw if the given node already exist.
     * @throws {Error} - Will throw if the given attributes are not an object.
     */
    addNode(node, attributes) {
      const nodeData = addNode(this, node, attributes);
      return nodeData.key;
    }
    /**
     * Method used to merge a node into the graph.
     *
     * @param  {any}    node         - The node.
     * @param  {object} [attributes] - Optional attributes.
     * @return {any}                 - The node.
     */
    mergeNode(node, attributes) {
      if (attributes && !isPlainObject(attributes))
        throw new InvalidArgumentsGraphError(
          `Graph.mergeNode: invalid attributes. Expecting an object but got "${attributes}"`
        );
      node = "" + node;
      attributes = attributes || {};
      let data = this._nodes.get(node);
      if (data) {
        if (attributes) {
          assign(data.attributes, attributes);
          this.emit("nodeAttributesUpdated", {
            type: "merge",
            key: node,
            attributes: data.attributes,
            data: attributes
          });
        }
        return [node, false];
      }
      data = new this.NodeDataClass(node, attributes);
      this._nodes.set(node, data);
      this.emit("nodeAdded", {
        key: node,
        attributes
      });
      return [node, true];
    }
    /**
     * Method used to add a node if it does not exist in the graph or else to
     * update its attributes using a function.
     *
     * @param  {any}      node      - The node.
     * @param  {function} [updater] - Optional updater function.
     * @return {any}                - The node.
     */
    updateNode(node, updater) {
      if (updater && typeof updater !== "function")
        throw new InvalidArgumentsGraphError(
          `Graph.updateNode: invalid updater function. Expecting a function but got "${updater}"`
        );
      node = "" + node;
      let data = this._nodes.get(node);
      if (data) {
        if (updater) {
          const oldAttributes = data.attributes;
          data.attributes = updater(oldAttributes);
          this.emit("nodeAttributesUpdated", {
            type: "replace",
            key: node,
            attributes: data.attributes
          });
        }
        return [node, false];
      }
      const attributes = updater ? updater({}) : {};
      data = new this.NodeDataClass(node, attributes);
      this._nodes.set(node, data);
      this.emit("nodeAdded", {
        key: node,
        attributes
      });
      return [node, true];
    }
    /**
     * Method used to drop a single node & all its attached edges from the graph.
     *
     * @param  {any}    node - The node.
     * @return {Graph}
     *
     * @throws {Error} - Will throw if the node doesn't exist.
     */
    dropNode(node) {
      node = "" + node;
      const nodeData = this._nodes.get(node);
      if (!nodeData)
        throw new NotFoundGraphError(
          `Graph.dropNode: could not find the "${node}" node in the graph.`
        );
      let edgeData;
      if (this.type !== "undirected") {
        for (const neighbor in nodeData.out) {
          edgeData = nodeData.out[neighbor];
          do {
            dropEdgeFromData(this, edgeData);
            edgeData = edgeData.next;
          } while (edgeData);
        }
        for (const neighbor in nodeData.in) {
          edgeData = nodeData.in[neighbor];
          do {
            dropEdgeFromData(this, edgeData);
            edgeData = edgeData.next;
          } while (edgeData);
        }
      }
      if (this.type !== "directed") {
        for (const neighbor in nodeData.undirected) {
          edgeData = nodeData.undirected[neighbor];
          do {
            dropEdgeFromData(this, edgeData);
            edgeData = edgeData.next;
          } while (edgeData);
        }
      }
      this._nodes.delete(node);
      this.emit("nodeDropped", {
        key: node,
        attributes: nodeData.attributes
      });
    }
    /**
     * Method used to drop a single edge from the graph.
     *
     * Arity 1:
     * @param  {any}    edge - The edge.
     *
     * Arity 2:
     * @param  {any}    source - Source node.
     * @param  {any}    target - Target node.
     *
     * @return {Graph}
     *
     * @throws {Error} - Will throw if the edge doesn't exist.
     */
    dropEdge(edge) {
      let edgeData;
      if (arguments.length > 1) {
        const source = "" + arguments[0];
        const target = "" + arguments[1];
        edgeData = getMatchingEdge(this, source, target, this.type);
        if (!edgeData)
          throw new NotFoundGraphError(
            `Graph.dropEdge: could not find the "${source}" -> "${target}" edge in the graph.`
          );
      } else {
        edge = "" + edge;
        edgeData = this._edges.get(edge);
        if (!edgeData)
          throw new NotFoundGraphError(
            `Graph.dropEdge: could not find the "${edge}" edge in the graph.`
          );
      }
      dropEdgeFromData(this, edgeData);
      return this;
    }
    /**
     * Method used to drop a single directed edge from the graph.
     *
     * @param  {any}    source - Source node.
     * @param  {any}    target - Target node.
     *
     * @return {Graph}
     *
     * @throws {Error} - Will throw if the edge doesn't exist.
     */
    dropDirectedEdge(source, target) {
      if (arguments.length < 2)
        throw new UsageGraphError(
          "Graph.dropDirectedEdge: it does not make sense to try and drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead."
        );
      if (this.multi)
        throw new UsageGraphError(
          "Graph.dropDirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones."
        );
      source = "" + source;
      target = "" + target;
      const edgeData = getMatchingEdge(this, source, target, "directed");
      if (!edgeData)
        throw new NotFoundGraphError(
          `Graph.dropDirectedEdge: could not find a "${source}" -> "${target}" edge in the graph.`
        );
      dropEdgeFromData(this, edgeData);
      return this;
    }
    /**
     * Method used to drop a single undirected edge from the graph.
     *
     * @param  {any}    source - Source node.
     * @param  {any}    target - Target node.
     *
     * @return {Graph}
     *
     * @throws {Error} - Will throw if the edge doesn't exist.
     */
    dropUndirectedEdge(source, target) {
      if (arguments.length < 2)
        throw new UsageGraphError(
          "Graph.dropUndirectedEdge: it does not make sense to drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead."
        );
      if (this.multi)
        throw new UsageGraphError(
          "Graph.dropUndirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones."
        );
      const edgeData = getMatchingEdge(this, source, target, "undirected");
      if (!edgeData)
        throw new NotFoundGraphError(
          `Graph.dropUndirectedEdge: could not find a "${source}" -> "${target}" edge in the graph.`
        );
      dropEdgeFromData(this, edgeData);
      return this;
    }
    /**
     * Method used to remove every edge & every node from the graph.
     *
     * @return {Graph}
     */
    clear() {
      this._edges.clear();
      this._nodes.clear();
      this._resetInstanceCounters();
      this.emit("cleared");
    }
    /**
     * Method used to remove every edge from the graph.
     *
     * @return {Graph}
     */
    clearEdges() {
      const iterator = this._nodes.values();
      let step;
      while (step = iterator.next(), step.done !== true) {
        step.value.clear();
      }
      this._edges.clear();
      this._resetInstanceCounters();
      this.emit("edgesCleared");
    }
    /**---------------------------------------------------------------------------
     * Attributes-related methods
     **---------------------------------------------------------------------------
     */
    /**
     * Method returning the desired graph's attribute.
     *
     * @param  {string} name - Name of the attribute.
     * @return {any}
     */
    getAttribute(name) {
      return this._attributes[name];
    }
    /**
     * Method returning the graph's attributes.
     *
     * @return {object}
     */
    getAttributes() {
      return this._attributes;
    }
    /**
     * Method returning whether the graph has the desired attribute.
     *
     * @param  {string}  name - Name of the attribute.
     * @return {boolean}
     */
    hasAttribute(name) {
      return this._attributes.hasOwnProperty(name);
    }
    /**
     * Method setting a value for the desired graph's attribute.
     *
     * @param  {string}  name  - Name of the attribute.
     * @param  {any}     value - Value for the attribute.
     * @return {Graph}
     */
    setAttribute(name, value) {
      this._attributes[name] = value;
      this.emit("attributesUpdated", {
        type: "set",
        attributes: this._attributes,
        name
      });
      return this;
    }
    /**
     * Method using a function to update the desired graph's attribute's value.
     *
     * @param  {string}   name    - Name of the attribute.
     * @param  {function} updater - Function use to update the attribute's value.
     * @return {Graph}
     */
    updateAttribute(name, updater) {
      if (typeof updater !== "function")
        throw new InvalidArgumentsGraphError(
          "Graph.updateAttribute: updater should be a function."
        );
      const value = this._attributes[name];
      this._attributes[name] = updater(value);
      this.emit("attributesUpdated", {
        type: "set",
        attributes: this._attributes,
        name
      });
      return this;
    }
    /**
     * Method removing the desired graph's attribute.
     *
     * @param  {string} name  - Name of the attribute.
     * @return {Graph}
     */
    removeAttribute(name) {
      delete this._attributes[name];
      this.emit("attributesUpdated", {
        type: "remove",
        attributes: this._attributes,
        name
      });
      return this;
    }
    /**
     * Method replacing the graph's attributes.
     *
     * @param  {object} attributes - New attributes.
     * @return {Graph}
     *
     * @throws {Error} - Will throw if given attributes are not a plain object.
     */
    replaceAttributes(attributes) {
      if (!isPlainObject(attributes))
        throw new InvalidArgumentsGraphError(
          "Graph.replaceAttributes: provided attributes are not a plain object."
        );
      this._attributes = attributes;
      this.emit("attributesUpdated", {
        type: "replace",
        attributes: this._attributes
      });
      return this;
    }
    /**
     * Method merging the graph's attributes.
     *
     * @param  {object} attributes - Attributes to merge.
     * @return {Graph}
     *
     * @throws {Error} - Will throw if given attributes are not a plain object.
     */
    mergeAttributes(attributes) {
      if (!isPlainObject(attributes))
        throw new InvalidArgumentsGraphError(
          "Graph.mergeAttributes: provided attributes are not a plain object."
        );
      assign(this._attributes, attributes);
      this.emit("attributesUpdated", {
        type: "merge",
        attributes: this._attributes,
        data: attributes
      });
      return this;
    }
    /**
     * Method updating the graph's attributes.
     *
     * @param  {function} updater - Function used to update the attributes.
     * @return {Graph}
     *
     * @throws {Error} - Will throw if given updater is not a function.
     */
    updateAttributes(updater) {
      if (typeof updater !== "function")
        throw new InvalidArgumentsGraphError(
          "Graph.updateAttributes: provided updater is not a function."
        );
      this._attributes = updater(this._attributes);
      this.emit("attributesUpdated", {
        type: "update",
        attributes: this._attributes
      });
      return this;
    }
    /**
     * Method used to update each node's attributes using the given function.
     *
     * @param {function}  updater - Updater function to use.
     * @param {object}    [hints] - Optional hints.
     */
    updateEachNodeAttributes(updater, hints) {
      if (typeof updater !== "function")
        throw new InvalidArgumentsGraphError(
          "Graph.updateEachNodeAttributes: expecting an updater function."
        );
      if (hints && !validateHints(hints))
        throw new InvalidArgumentsGraphError(
          "Graph.updateEachNodeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}"
        );
      const iterator = this._nodes.values();
      let step, nodeData;
      while (step = iterator.next(), step.done !== true) {
        nodeData = step.value;
        nodeData.attributes = updater(nodeData.key, nodeData.attributes);
      }
      this.emit("eachNodeAttributesUpdated", {
        hints: hints ? hints : null
      });
    }
    /**
     * Method used to update each edge's attributes using the given function.
     *
     * @param {function}  updater - Updater function to use.
     * @param {object}    [hints] - Optional hints.
     */
    updateEachEdgeAttributes(updater, hints) {
      if (typeof updater !== "function")
        throw new InvalidArgumentsGraphError(
          "Graph.updateEachEdgeAttributes: expecting an updater function."
        );
      if (hints && !validateHints(hints))
        throw new InvalidArgumentsGraphError(
          "Graph.updateEachEdgeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}"
        );
      const iterator = this._edges.values();
      let step, edgeData, sourceData, targetData;
      while (step = iterator.next(), step.done !== true) {
        edgeData = step.value;
        sourceData = edgeData.source;
        targetData = edgeData.target;
        edgeData.attributes = updater(
          edgeData.key,
          edgeData.attributes,
          sourceData.key,
          targetData.key,
          sourceData.attributes,
          targetData.attributes,
          edgeData.undirected
        );
      }
      this.emit("eachEdgeAttributesUpdated", {
        hints: hints ? hints : null
      });
    }
    /**---------------------------------------------------------------------------
     * Iteration-related methods
     **---------------------------------------------------------------------------
     */
    /**
     * Method iterating over the graph's adjacency using the given callback.
     *
     * @param  {function}  callback - Callback to use.
     */
    forEachAdjacencyEntry(callback) {
      if (typeof callback !== "function")
        throw new InvalidArgumentsGraphError(
          "Graph.forEachAdjacencyEntry: expecting a callback."
        );
      forEachAdjacency(false, false, false, this, callback);
    }
    forEachAdjacencyEntryWithOrphans(callback) {
      if (typeof callback !== "function")
        throw new InvalidArgumentsGraphError(
          "Graph.forEachAdjacencyEntryWithOrphans: expecting a callback."
        );
      forEachAdjacency(false, false, true, this, callback);
    }
    /**
     * Method iterating over the graph's assymetric adjacency using the given callback.
     *
     * @param  {function}  callback - Callback to use.
     */
    forEachAssymetricAdjacencyEntry(callback) {
      if (typeof callback !== "function")
        throw new InvalidArgumentsGraphError(
          "Graph.forEachAssymetricAdjacencyEntry: expecting a callback."
        );
      forEachAdjacency(false, true, false, this, callback);
    }
    forEachAssymetricAdjacencyEntryWithOrphans(callback) {
      if (typeof callback !== "function")
        throw new InvalidArgumentsGraphError(
          "Graph.forEachAssymetricAdjacencyEntryWithOrphans: expecting a callback."
        );
      forEachAdjacency(false, true, true, this, callback);
    }
    /**
     * Method returning the list of the graph's nodes.
     *
     * @return {array} - The nodes.
     */
    nodes() {
      return Array.from(this._nodes.keys());
    }
    /**
     * Method iterating over the graph's nodes using the given callback.
     *
     * @param  {function}  callback - Callback (key, attributes, index).
     */
    forEachNode(callback) {
      if (typeof callback !== "function")
        throw new InvalidArgumentsGraphError(
          "Graph.forEachNode: expecting a callback."
        );
      const iterator = this._nodes.values();
      let step, nodeData;
      while (step = iterator.next(), step.done !== true) {
        nodeData = step.value;
        callback(nodeData.key, nodeData.attributes);
      }
    }
    /**
     * Method iterating attempting to find a node matching the given predicate
     * function.
     *
     * @param  {function}  callback - Callback (key, attributes).
     */
    findNode(callback) {
      if (typeof callback !== "function")
        throw new InvalidArgumentsGraphError(
          "Graph.findNode: expecting a callback."
        );
      const iterator = this._nodes.values();
      let step, nodeData;
      while (step = iterator.next(), step.done !== true) {
        nodeData = step.value;
        if (callback(nodeData.key, nodeData.attributes)) return nodeData.key;
      }
      return;
    }
    /**
     * Method mapping nodes.
     *
     * @param  {function}  callback - Callback (key, attributes).
     */
    mapNodes(callback) {
      if (typeof callback !== "function")
        throw new InvalidArgumentsGraphError(
          "Graph.mapNode: expecting a callback."
        );
      const iterator = this._nodes.values();
      let step, nodeData;
      const result = new Array(this.order);
      let i = 0;
      while (step = iterator.next(), step.done !== true) {
        nodeData = step.value;
        result[i++] = callback(nodeData.key, nodeData.attributes);
      }
      return result;
    }
    /**
     * Method returning whether some node verify the given predicate.
     *
     * @param  {function}  callback - Callback (key, attributes).
     */
    someNode(callback) {
      if (typeof callback !== "function")
        throw new InvalidArgumentsGraphError(
          "Graph.someNode: expecting a callback."
        );
      const iterator = this._nodes.values();
      let step, nodeData;
      while (step = iterator.next(), step.done !== true) {
        nodeData = step.value;
        if (callback(nodeData.key, nodeData.attributes)) return true;
      }
      return false;
    }
    /**
     * Method returning whether all node verify the given predicate.
     *
     * @param  {function}  callback - Callback (key, attributes).
     */
    everyNode(callback) {
      if (typeof callback !== "function")
        throw new InvalidArgumentsGraphError(
          "Graph.everyNode: expecting a callback."
        );
      const iterator = this._nodes.values();
      let step, nodeData;
      while (step = iterator.next(), step.done !== true) {
        nodeData = step.value;
        if (!callback(nodeData.key, nodeData.attributes)) return false;
      }
      return true;
    }
    /**
     * Method filtering nodes.
     *
     * @param  {function}  callback - Callback (key, attributes).
     */
    filterNodes(callback) {
      if (typeof callback !== "function")
        throw new InvalidArgumentsGraphError(
          "Graph.filterNodes: expecting a callback."
        );
      const iterator = this._nodes.values();
      let step, nodeData;
      const result = [];
      while (step = iterator.next(), step.done !== true) {
        nodeData = step.value;
        if (callback(nodeData.key, nodeData.attributes))
          result.push(nodeData.key);
      }
      return result;
    }
    /**
     * Method reducing nodes.
     *
     * @param  {function}  callback - Callback (accumulator, key, attributes).
     */
    reduceNodes(callback, initialValue) {
      if (typeof callback !== "function")
        throw new InvalidArgumentsGraphError(
          "Graph.reduceNodes: expecting a callback."
        );
      if (arguments.length < 2)
        throw new InvalidArgumentsGraphError(
          "Graph.reduceNodes: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array."
        );
      let accumulator = initialValue;
      const iterator = this._nodes.values();
      let step, nodeData;
      while (step = iterator.next(), step.done !== true) {
        nodeData = step.value;
        accumulator = callback(accumulator, nodeData.key, nodeData.attributes);
      }
      return accumulator;
    }
    /**
     * Method returning an iterator over the graph's node entries.
     *
     * @return {Iterator}
     */
    nodeEntries() {
      const iterator = this._nodes.values();
      return {
        [Symbol.iterator]() {
          return this;
        },
        next() {
          const step = iterator.next();
          if (step.done) return step;
          const data = step.value;
          return {
            value: { node: data.key, attributes: data.attributes },
            done: false
          };
        }
      };
    }
    /**---------------------------------------------------------------------------
     * Serialization
     **---------------------------------------------------------------------------
     */
    /**
     * Method used to export the whole graph.
     *
     * @return {object} - The serialized graph.
     */
    export() {
      const nodes = new Array(this._nodes.size);
      let i = 0;
      this._nodes.forEach((data, key) => {
        nodes[i++] = serializeNode(key, data);
      });
      const edges = new Array(this._edges.size);
      i = 0;
      this._edges.forEach((data, key) => {
        edges[i++] = serializeEdge(this.type, key, data);
      });
      return {
        options: {
          type: this.type,
          multi: this.multi,
          allowSelfLoops: this.allowSelfLoops
        },
        attributes: this.getAttributes(),
        nodes,
        edges
      };
    }
    /**
     * Method used to import a serialized graph.
     *
     * @param  {object|Graph} data  - The serialized graph.
     * @param  {boolean}      merge - Whether to merge data.
     * @return {Graph}              - Returns itself for chaining.
     */
    import(data, merge = false) {
      if (data instanceof _Graph) {
        data.forEachNode((n, a2) => {
          if (merge) this.mergeNode(n, a2);
          else this.addNode(n, a2);
        });
        data.forEachEdge((e, a2, s, t, _sa, _ta, u) => {
          if (merge) {
            if (u) this.mergeUndirectedEdgeWithKey(e, s, t, a2);
            else this.mergeDirectedEdgeWithKey(e, s, t, a2);
          } else {
            if (u) this.addUndirectedEdgeWithKey(e, s, t, a2);
            else this.addDirectedEdgeWithKey(e, s, t, a2);
          }
        });
        return this;
      }
      if (!isPlainObject(data))
        throw new InvalidArgumentsGraphError(
          "Graph.import: invalid argument. Expecting a serialized graph or, alternatively, a Graph instance."
        );
      if (data.attributes) {
        if (!isPlainObject(data.attributes))
          throw new InvalidArgumentsGraphError(
            "Graph.import: invalid attributes. Expecting a plain object."
          );
        if (merge) this.mergeAttributes(data.attributes);
        else this.replaceAttributes(data.attributes);
      }
      let i, l, list, node, edge;
      if (data.nodes) {
        list = data.nodes;
        if (!Array.isArray(list))
          throw new InvalidArgumentsGraphError(
            "Graph.import: invalid nodes. Expecting an array."
          );
        for (i = 0, l = list.length; i < l; i++) {
          node = list[i];
          validateSerializedNode(node);
          const { key, attributes } = node;
          if (merge) this.mergeNode(key, attributes);
          else this.addNode(key, attributes);
        }
      }
      if (data.edges) {
        let undirectedByDefault = false;
        if (this.type === "undirected") {
          undirectedByDefault = true;
        }
        list = data.edges;
        if (!Array.isArray(list))
          throw new InvalidArgumentsGraphError(
            "Graph.import: invalid edges. Expecting an array."
          );
        for (i = 0, l = list.length; i < l; i++) {
          edge = list[i];
          validateSerializedEdge(edge);
          const {
            source,
            target,
            attributes,
            undirected = undirectedByDefault
          } = edge;
          let method;
          if ("key" in edge) {
            method = merge ? undirected ? this.mergeUndirectedEdgeWithKey : this.mergeDirectedEdgeWithKey : undirected ? this.addUndirectedEdgeWithKey : this.addDirectedEdgeWithKey;
            method.call(this, edge.key, source, target, attributes);
          } else {
            method = merge ? undirected ? this.mergeUndirectedEdge : this.mergeDirectedEdge : undirected ? this.addUndirectedEdge : this.addDirectedEdge;
            method.call(this, source, target, attributes);
          }
        }
      }
      return this;
    }
    /**---------------------------------------------------------------------------
     * Utils
     **---------------------------------------------------------------------------
     */
    /**
     * Method returning a null copy of the graph, i.e. a graph without nodes
     * & edges but with the exact same options.
     *
     * @param  {object} options - Options to merge with the current ones.
     * @return {Graph}          - The null copy.
     */
    nullCopy(options) {
      const graph = new _Graph(assign({}, this._options, options));
      graph.replaceAttributes(assign({}, this.getAttributes()));
      return graph;
    }
    /**
     * Method returning an empty copy of the graph, i.e. a graph without edges but
     * with the exact same options.
     *
     * @param  {object} options - Options to merge with the current ones.
     * @return {Graph}          - The empty copy.
     */
    emptyCopy(options) {
      const graph = this.nullCopy(options);
      this._nodes.forEach((nodeData, key) => {
        const attributes = assign({}, nodeData.attributes);
        nodeData = new graph.NodeDataClass(key, attributes);
        graph._nodes.set(key, nodeData);
      });
      return graph;
    }
    /**
     * Method returning an exact copy of the graph.
     *
     * @param  {object} options - Upgrade options.
     * @return {Graph}          - The copy.
     */
    copy(options) {
      options = options || {};
      if (typeof options.type === "string" && options.type !== this.type && options.type !== "mixed")
        throw new UsageGraphError(
          `Graph.copy: cannot create an incompatible copy from "${this.type}" type to "${options.type}" because this would mean losing information about the current graph.`
        );
      if (typeof options.multi === "boolean" && options.multi !== this.multi && options.multi !== true)
        throw new UsageGraphError(
          "Graph.copy: cannot create an incompatible copy by downgrading a multi graph to a simple one because this would mean losing information about the current graph."
        );
      if (typeof options.allowSelfLoops === "boolean" && options.allowSelfLoops !== this.allowSelfLoops && options.allowSelfLoops !== true)
        throw new UsageGraphError(
          "Graph.copy: cannot create an incompatible copy from a graph allowing self loops to one that does not because this would mean losing information about the current graph."
        );
      const graph = this.emptyCopy(options);
      const iterator = this._edges.values();
      let step, edgeData;
      while (step = iterator.next(), step.done !== true) {
        edgeData = step.value;
        addEdge(
          graph,
          "copy",
          false,
          edgeData.undirected,
          edgeData.key,
          edgeData.source.key,
          edgeData.target.key,
          assign({}, edgeData.attributes)
        );
      }
      return graph;
    }
    /**---------------------------------------------------------------------------
     * Known methods
     **---------------------------------------------------------------------------
     */
    /**
     * Method used by JavaScript to perform JSON serialization.
     *
     * @return {object} - The serialized graph.
     */
    toJSON() {
      return this.export();
    }
    /**
     * Method returning [object Graph].
     */
    toString() {
      return "[object Graph]";
    }
    /**
     * Method used internally by node's console to display a custom object.
     *
     * @return {object} - Formatted object representation of the graph.
     */
    inspect() {
      const nodes = {};
      this._nodes.forEach((data, key) => {
        nodes[key] = data.attributes;
      });
      const edges = {}, multiIndex = {};
      this._edges.forEach((data, key) => {
        const direction = data.undirected ? "--" : "->";
        let label = "";
        let source = data.source.key;
        let target = data.target.key;
        let tmp;
        if (data.undirected && source > target) {
          tmp = source;
          source = target;
          target = tmp;
        }
        const desc = `(${source})${direction}(${target})`;
        if (!key.startsWith("geid_")) {
          label += `[${key}]: `;
        } else if (this.multi) {
          if (typeof multiIndex[desc] === "undefined") {
            multiIndex[desc] = 0;
          } else {
            multiIndex[desc]++;
          }
          label += `${multiIndex[desc]}. `;
        }
        label += desc;
        edges[label] = data.attributes;
      });
      const dummy = {};
      for (const k in this) {
        if (this.hasOwnProperty(k) && !EMITTER_PROPS.has(k) && typeof this[k] !== "function" && typeof k !== "symbol")
          dummy[k] = this[k];
      }
      dummy.attributes = this._attributes;
      dummy.nodes = nodes;
      dummy.edges = edges;
      privateProperty(dummy, "constructor", this.constructor);
      return dummy;
    }
  };
  if (typeof Symbol !== "undefined")
    Graph.prototype[Symbol.for("nodejs.util.inspect.custom")] = Graph.prototype.inspect;
  EDGE_ADD_METHODS.forEach((method) => {
    ["add", "merge", "update"].forEach((verb) => {
      const name = method.name(verb);
      const fn = verb === "add" ? addEdge : mergeEdge;
      if (method.generateKey) {
        Graph.prototype[name] = function(source, target, attributes) {
          return fn(
            this,
            name,
            true,
            (method.type || this.type) === "undirected",
            null,
            source,
            target,
            attributes,
            verb === "update"
          );
        };
      } else {
        Graph.prototype[name] = function(edge, source, target, attributes) {
          return fn(
            this,
            name,
            false,
            (method.type || this.type) === "undirected",
            edge,
            source,
            target,
            attributes,
            verb === "update"
          );
        };
      }
    });
  });
  attachNodeAttributesMethods(Graph);
  attachEdgeAttributesMethods(Graph);
  attachEdgeIterationMethods(Graph);
  attachNeighborIterationMethods(Graph);
  var DirectedGraph = class extends Graph {
    constructor(options) {
      const finalOptions = assign({ type: "directed" }, options);
      if ("multi" in finalOptions && finalOptions.multi !== false)
        throw new InvalidArgumentsGraphError(
          "DirectedGraph.from: inconsistent indication that the graph should be multi in given options!"
        );
      if (finalOptions.type !== "directed")
        throw new InvalidArgumentsGraphError(
          'DirectedGraph.from: inconsistent "' + finalOptions.type + '" type in given options!'
        );
      super(finalOptions);
    }
  };
  var UndirectedGraph = class extends Graph {
    constructor(options) {
      const finalOptions = assign({ type: "undirected" }, options);
      if ("multi" in finalOptions && finalOptions.multi !== false)
        throw new InvalidArgumentsGraphError(
          "UndirectedGraph.from: inconsistent indication that the graph should be multi in given options!"
        );
      if (finalOptions.type !== "undirected")
        throw new InvalidArgumentsGraphError(
          'UndirectedGraph.from: inconsistent "' + finalOptions.type + '" type in given options!'
        );
      super(finalOptions);
    }
  };
  var MultiGraph = class extends Graph {
    constructor(options) {
      const finalOptions = assign({ multi: true }, options);
      if ("multi" in finalOptions && finalOptions.multi !== true)
        throw new InvalidArgumentsGraphError(
          "MultiGraph.from: inconsistent indication that the graph should be simple in given options!"
        );
      super(finalOptions);
    }
  };
  var MultiDirectedGraph = class extends Graph {
    constructor(options) {
      const finalOptions = assign({ type: "directed", multi: true }, options);
      if ("multi" in finalOptions && finalOptions.multi !== true)
        throw new InvalidArgumentsGraphError(
          "MultiDirectedGraph.from: inconsistent indication that the graph should be simple in given options!"
        );
      if (finalOptions.type !== "directed")
        throw new InvalidArgumentsGraphError(
          'MultiDirectedGraph.from: inconsistent "' + finalOptions.type + '" type in given options!'
        );
      super(finalOptions);
    }
  };
  var MultiUndirectedGraph = class extends Graph {
    constructor(options) {
      const finalOptions = assign({ type: "undirected", multi: true }, options);
      if ("multi" in finalOptions && finalOptions.multi !== true)
        throw new InvalidArgumentsGraphError(
          "MultiUndirectedGraph.from: inconsistent indication that the graph should be simple in given options!"
        );
      if (finalOptions.type !== "undirected")
        throw new InvalidArgumentsGraphError(
          'MultiUndirectedGraph.from: inconsistent "' + finalOptions.type + '" type in given options!'
        );
      super(finalOptions);
    }
  };
  function attachStaticFromMethod(Class) {
    Class.from = function(data, options) {
      const finalOptions = assign({}, data.options, options);
      const instance = new Class(finalOptions);
      instance.import(data);
      return instance;
    };
  }
  attachStaticFromMethod(Graph);
  attachStaticFromMethod(DirectedGraph);
  attachStaticFromMethod(UndirectedGraph);
  attachStaticFromMethod(MultiGraph);
  attachStaticFromMethod(MultiDirectedGraph);
  attachStaticFromMethod(MultiUndirectedGraph);
  Graph.Graph = Graph;
  Graph.DirectedGraph = DirectedGraph;
  Graph.UndirectedGraph = UndirectedGraph;
  Graph.MultiGraph = MultiGraph;
  Graph.MultiDirectedGraph = MultiDirectedGraph;
  Graph.MultiUndirectedGraph = MultiUndirectedGraph;
  Graph.InvalidArgumentsGraphError = InvalidArgumentsGraphError;
  Graph.NotFoundGraphError = NotFoundGraphError;
  Graph.UsageGraphError = UsageGraphError;

  // node_modules/d3-dispatch/src/dispatch.js
  var noop = { value: () => {
  } };
  function dispatch() {
    for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
      if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
      _[t] = [];
    }
    return new Dispatch(_);
  }
  function Dispatch(_) {
    this._ = _;
  }
  function parseTypenames(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
      return { type: t, name };
    });
  }
  Dispatch.prototype = dispatch.prototype = {
    constructor: Dispatch,
    on: function(typename, callback) {
      var _ = this._, T = parseTypenames(typename + "", _), t, i = -1, n = T.length;
      if (arguments.length < 2) {
        while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
        return;
      }
      if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
      while (++i < n) {
        if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
        else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
      }
      return this;
    },
    copy: function() {
      var copy = {}, _ = this._;
      for (var t in _) copy[t] = _[t].slice();
      return new Dispatch(copy);
    },
    call: function(type2, that) {
      if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
      if (!this._.hasOwnProperty(type2)) throw new Error("unknown type: " + type2);
      for (t = this._[type2], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    },
    apply: function(type2, that, args) {
      if (!this._.hasOwnProperty(type2)) throw new Error("unknown type: " + type2);
      for (var t = this._[type2], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    }
  };
  function get(type2, name) {
    for (var i = 0, n = type2.length, c2; i < n; ++i) {
      if ((c2 = type2[i]).name === name) {
        return c2.value;
      }
    }
  }
  function set(type2, name, callback) {
    for (var i = 0, n = type2.length; i < n; ++i) {
      if (type2[i].name === name) {
        type2[i] = noop, type2 = type2.slice(0, i).concat(type2.slice(i + 1));
        break;
      }
    }
    if (callback != null) type2.push({ name, value: callback });
    return type2;
  }
  var dispatch_default = dispatch;

  // node_modules/d3-selection/src/namespaces.js
  var xhtml = "http://www.w3.org/1999/xhtml";
  var namespaces_default = {
    svg: "http://www.w3.org/2000/svg",
    xhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };

  // node_modules/d3-selection/src/namespace.js
  function namespace_default(name) {
    var prefix = name += "", i = prefix.indexOf(":");
    if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
    return namespaces_default.hasOwnProperty(prefix) ? { space: namespaces_default[prefix], local: name } : name;
  }

  // node_modules/d3-selection/src/creator.js
  function creatorInherit(name) {
    return function() {
      var document2 = this.ownerDocument, uri = this.namespaceURI;
      return uri === xhtml && document2.documentElement.namespaceURI === xhtml ? document2.createElement(name) : document2.createElementNS(uri, name);
    };
  }
  function creatorFixed(fullname) {
    return function() {
      return this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
  }
  function creator_default(name) {
    var fullname = namespace_default(name);
    return (fullname.local ? creatorFixed : creatorInherit)(fullname);
  }

  // node_modules/d3-selection/src/selector.js
  function none() {
  }
  function selector_default(selector) {
    return selector == null ? none : function() {
      return this.querySelector(selector);
    };
  }

  // node_modules/d3-selection/src/selection/select.js
  function select_default(select) {
    if (typeof select !== "function") select = selector_default(select);
    for (var groups = this._groups, m2 = groups.length, subgroups = new Array(m2), j = 0; j < m2; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
        }
      }
    }
    return new Selection(subgroups, this._parents);
  }

  // node_modules/d3-selection/src/array.js
  function array(x3) {
    return x3 == null ? [] : Array.isArray(x3) ? x3 : Array.from(x3);
  }

  // node_modules/d3-selection/src/selectorAll.js
  function empty() {
    return [];
  }
  function selectorAll_default(selector) {
    return selector == null ? empty : function() {
      return this.querySelectorAll(selector);
    };
  }

  // node_modules/d3-selection/src/selection/selectAll.js
  function arrayAll(select) {
    return function() {
      return array(select.apply(this, arguments));
    };
  }
  function selectAll_default(select) {
    if (typeof select === "function") select = arrayAll(select);
    else select = selectorAll_default(select);
    for (var groups = this._groups, m2 = groups.length, subgroups = [], parents = [], j = 0; j < m2; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          subgroups.push(select.call(node, node.__data__, i, group));
          parents.push(node);
        }
      }
    }
    return new Selection(subgroups, parents);
  }

  // node_modules/d3-selection/src/matcher.js
  function matcher_default(selector) {
    return function() {
      return this.matches(selector);
    };
  }
  function childMatcher(selector) {
    return function(node) {
      return node.matches(selector);
    };
  }

  // node_modules/d3-selection/src/selection/selectChild.js
  var find = Array.prototype.find;
  function childFind(match) {
    return function() {
      return find.call(this.children, match);
    };
  }
  function childFirst() {
    return this.firstElementChild;
  }
  function selectChild_default(match) {
    return this.select(match == null ? childFirst : childFind(typeof match === "function" ? match : childMatcher(match)));
  }

  // node_modules/d3-selection/src/selection/selectChildren.js
  var filter = Array.prototype.filter;
  function children() {
    return Array.from(this.children);
  }
  function childrenFilter(match) {
    return function() {
      return filter.call(this.children, match);
    };
  }
  function selectChildren_default(match) {
    return this.selectAll(match == null ? children : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
  }

  // node_modules/d3-selection/src/selection/filter.js
  function filter_default(match) {
    if (typeof match !== "function") match = matcher_default(match);
    for (var groups = this._groups, m2 = groups.length, subgroups = new Array(m2), j = 0; j < m2; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }
    return new Selection(subgroups, this._parents);
  }

  // node_modules/d3-selection/src/selection/sparse.js
  function sparse_default(update) {
    return new Array(update.length);
  }

  // node_modules/d3-selection/src/selection/enter.js
  function enter_default() {
    return new Selection(this._enter || this._groups.map(sparse_default), this._parents);
  }
  function EnterNode(parent, datum2) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum2;
  }
  EnterNode.prototype = {
    constructor: EnterNode,
    appendChild: function(child) {
      return this._parent.insertBefore(child, this._next);
    },
    insertBefore: function(child, next) {
      return this._parent.insertBefore(child, next);
    },
    querySelector: function(selector) {
      return this._parent.querySelector(selector);
    },
    querySelectorAll: function(selector) {
      return this._parent.querySelectorAll(selector);
    }
  };

  // node_modules/d3-selection/src/constant.js
  function constant_default(x3) {
    return function() {
      return x3;
    };
  }

  // node_modules/d3-selection/src/selection/data.js
  function bindIndex(parent, group, enter, update, exit, data) {
    var i = 0, node, groupLength = group.length, dataLength = data.length;
    for (; i < dataLength; ++i) {
      if (node = group[i]) {
        node.__data__ = data[i];
        update[i] = node;
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }
    for (; i < groupLength; ++i) {
      if (node = group[i]) {
        exit[i] = node;
      }
    }
  }
  function bindKey(parent, group, enter, update, exit, data, key) {
    var i, node, nodeByKeyValue = /* @__PURE__ */ new Map(), groupLength = group.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
    for (i = 0; i < groupLength; ++i) {
      if (node = group[i]) {
        keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
        if (nodeByKeyValue.has(keyValue)) {
          exit[i] = node;
        } else {
          nodeByKeyValue.set(keyValue, node);
        }
      }
    }
    for (i = 0; i < dataLength; ++i) {
      keyValue = key.call(parent, data[i], i, data) + "";
      if (node = nodeByKeyValue.get(keyValue)) {
        update[i] = node;
        node.__data__ = data[i];
        nodeByKeyValue.delete(keyValue);
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }
    for (i = 0; i < groupLength; ++i) {
      if ((node = group[i]) && nodeByKeyValue.get(keyValues[i]) === node) {
        exit[i] = node;
      }
    }
  }
  function datum(node) {
    return node.__data__;
  }
  function data_default(value, key) {
    if (!arguments.length) return Array.from(this, datum);
    var bind = key ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
    if (typeof value !== "function") value = constant_default(value);
    for (var m2 = groups.length, update = new Array(m2), enter = new Array(m2), exit = new Array(m2), j = 0; j < m2; ++j) {
      var parent = parents[j], group = groups[j], groupLength = group.length, data = arraylike(value.call(parent, parent && parent.__data__, j, parents)), dataLength = data.length, enterGroup = enter[j] = new Array(dataLength), updateGroup = update[j] = new Array(dataLength), exitGroup = exit[j] = new Array(groupLength);
      bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);
      for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
        if (previous = enterGroup[i0]) {
          if (i0 >= i1) i1 = i0 + 1;
          while (!(next = updateGroup[i1]) && ++i1 < dataLength) ;
          previous._next = next || null;
        }
      }
    }
    update = new Selection(update, parents);
    update._enter = enter;
    update._exit = exit;
    return update;
  }
  function arraylike(data) {
    return typeof data === "object" && "length" in data ? data : Array.from(data);
  }

  // node_modules/d3-selection/src/selection/exit.js
  function exit_default() {
    return new Selection(this._exit || this._groups.map(sparse_default), this._parents);
  }

  // node_modules/d3-selection/src/selection/join.js
  function join_default(onenter, onupdate, onexit) {
    var enter = this.enter(), update = this, exit = this.exit();
    if (typeof onenter === "function") {
      enter = onenter(enter);
      if (enter) enter = enter.selection();
    } else {
      enter = enter.append(onenter + "");
    }
    if (onupdate != null) {
      update = onupdate(update);
      if (update) update = update.selection();
    }
    if (onexit == null) exit.remove();
    else onexit(exit);
    return enter && update ? enter.merge(update).order() : update;
  }

  // node_modules/d3-selection/src/selection/merge.js
  function merge_default(context) {
    var selection2 = context.selection ? context.selection() : context;
    for (var groups0 = this._groups, groups1 = selection2._groups, m0 = groups0.length, m1 = groups1.length, m2 = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m2; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }
    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }
    return new Selection(merges, this._parents);
  }

  // node_modules/d3-selection/src/selection/order.js
  function order_default() {
    for (var groups = this._groups, j = -1, m2 = groups.length; ++j < m2; ) {
      for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0; ) {
        if (node = group[i]) {
          if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }
    return this;
  }

  // node_modules/d3-selection/src/selection/sort.js
  function sort_default(compare) {
    if (!compare) compare = ascending;
    function compareNode(a2, b) {
      return a2 && b ? compare(a2.__data__, b.__data__) : !a2 - !b;
    }
    for (var groups = this._groups, m2 = groups.length, sortgroups = new Array(m2), j = 0; j < m2; ++j) {
      for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          sortgroup[i] = node;
        }
      }
      sortgroup.sort(compareNode);
    }
    return new Selection(sortgroups, this._parents).order();
  }
  function ascending(a2, b) {
    return a2 < b ? -1 : a2 > b ? 1 : a2 >= b ? 0 : NaN;
  }

  // node_modules/d3-selection/src/selection/call.js
  function call_default() {
    var callback = arguments[0];
    arguments[0] = this;
    callback.apply(null, arguments);
    return this;
  }

  // node_modules/d3-selection/src/selection/nodes.js
  function nodes_default2() {
    return Array.from(this);
  }

  // node_modules/d3-selection/src/selection/node.js
  function node_default() {
    for (var groups = this._groups, j = 0, m2 = groups.length; j < m2; ++j) {
      for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
        var node = group[i];
        if (node) return node;
      }
    }
    return null;
  }

  // node_modules/d3-selection/src/selection/size.js
  function size_default() {
    let size = 0;
    for (const node of this) ++size;
    return size;
  }

  // node_modules/d3-selection/src/selection/empty.js
  function empty_default() {
    return !this.node();
  }

  // node_modules/d3-selection/src/selection/each.js
  function each_default(callback) {
    for (var groups = this._groups, j = 0, m2 = groups.length; j < m2; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) callback.call(node, node.__data__, i, group);
      }
    }
    return this;
  }

  // node_modules/d3-selection/src/selection/attr.js
  function attrRemove(name) {
    return function() {
      this.removeAttribute(name);
    };
  }
  function attrRemoveNS(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }
  function attrConstant(name, value) {
    return function() {
      this.setAttribute(name, value);
    };
  }
  function attrConstantNS(fullname, value) {
    return function() {
      this.setAttributeNS(fullname.space, fullname.local, value);
    };
  }
  function attrFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttribute(name);
      else this.setAttribute(name, v);
    };
  }
  function attrFunctionNS(fullname, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
      else this.setAttributeNS(fullname.space, fullname.local, v);
    };
  }
  function attr_default(name, value) {
    var fullname = namespace_default(name);
    if (arguments.length < 2) {
      var node = this.node();
      return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
    }
    return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
  }

  // node_modules/d3-selection/src/window.js
  function window_default(node) {
    return node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView;
  }

  // node_modules/d3-selection/src/selection/style.js
  function styleRemove(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }
  function styleConstant(name, value, priority) {
    return function() {
      this.style.setProperty(name, value, priority);
    };
  }
  function styleFunction(name, value, priority) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.style.removeProperty(name);
      else this.style.setProperty(name, v, priority);
    };
  }
  function style_default(name, value, priority) {
    return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
  }
  function styleValue(node, name) {
    return node.style.getPropertyValue(name) || window_default(node).getComputedStyle(node, null).getPropertyValue(name);
  }

  // node_modules/d3-selection/src/selection/property.js
  function propertyRemove(name) {
    return function() {
      delete this[name];
    };
  }
  function propertyConstant(name, value) {
    return function() {
      this[name] = value;
    };
  }
  function propertyFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) delete this[name];
      else this[name] = v;
    };
  }
  function property_default(name, value) {
    return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
  }

  // node_modules/d3-selection/src/selection/classed.js
  function classArray(string) {
    return string.trim().split(/^|\s+/);
  }
  function classList(node) {
    return node.classList || new ClassList(node);
  }
  function ClassList(node) {
    this._node = node;
    this._names = classArray(node.getAttribute("class") || "");
  }
  ClassList.prototype = {
    add: function(name) {
      var i = this._names.indexOf(name);
      if (i < 0) {
        this._names.push(name);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    remove: function(name) {
      var i = this._names.indexOf(name);
      if (i >= 0) {
        this._names.splice(i, 1);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    contains: function(name) {
      return this._names.indexOf(name) >= 0;
    }
  };
  function classedAdd(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.add(names[i]);
  }
  function classedRemove(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.remove(names[i]);
  }
  function classedTrue(names) {
    return function() {
      classedAdd(this, names);
    };
  }
  function classedFalse(names) {
    return function() {
      classedRemove(this, names);
    };
  }
  function classedFunction(names, value) {
    return function() {
      (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
    };
  }
  function classed_default(name, value) {
    var names = classArray(name + "");
    if (arguments.length < 2) {
      var list = classList(this.node()), i = -1, n = names.length;
      while (++i < n) if (!list.contains(names[i])) return false;
      return true;
    }
    return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
  }

  // node_modules/d3-selection/src/selection/text.js
  function textRemove() {
    this.textContent = "";
  }
  function textConstant(value) {
    return function() {
      this.textContent = value;
    };
  }
  function textFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    };
  }
  function text_default(value) {
    return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
  }

  // node_modules/d3-selection/src/selection/html.js
  function htmlRemove() {
    this.innerHTML = "";
  }
  function htmlConstant(value) {
    return function() {
      this.innerHTML = value;
    };
  }
  function htmlFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    };
  }
  function html_default(value) {
    return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
  }

  // node_modules/d3-selection/src/selection/raise.js
  function raise() {
    if (this.nextSibling) this.parentNode.appendChild(this);
  }
  function raise_default() {
    return this.each(raise);
  }

  // node_modules/d3-selection/src/selection/lower.js
  function lower() {
    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
  }
  function lower_default() {
    return this.each(lower);
  }

  // node_modules/d3-selection/src/selection/append.js
  function append_default(name) {
    var create2 = typeof name === "function" ? name : creator_default(name);
    return this.select(function() {
      return this.appendChild(create2.apply(this, arguments));
    });
  }

  // node_modules/d3-selection/src/selection/insert.js
  function constantNull() {
    return null;
  }
  function insert_default(name, before) {
    var create2 = typeof name === "function" ? name : creator_default(name), select = before == null ? constantNull : typeof before === "function" ? before : selector_default(before);
    return this.select(function() {
      return this.insertBefore(create2.apply(this, arguments), select.apply(this, arguments) || null);
    });
  }

  // node_modules/d3-selection/src/selection/remove.js
  function remove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  }
  function remove_default() {
    return this.each(remove);
  }

  // node_modules/d3-selection/src/selection/clone.js
  function selection_cloneShallow() {
    var clone = this.cloneNode(false), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
  }
  function selection_cloneDeep() {
    var clone = this.cloneNode(true), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
  }
  function clone_default(deep) {
    return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
  }

  // node_modules/d3-selection/src/selection/datum.js
  function datum_default(value) {
    return arguments.length ? this.property("__data__", value) : this.node().__data__;
  }

  // node_modules/d3-selection/src/selection/on.js
  function contextListener(listener) {
    return function(event) {
      listener.call(this, event, this.__data__);
    };
  }
  function parseTypenames2(typenames) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      return { type: t, name };
    });
  }
  function onRemove(typename) {
    return function() {
      var on = this.__on;
      if (!on) return;
      for (var j = 0, i = -1, m2 = on.length, o; j < m2; ++j) {
        if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
        } else {
          on[++i] = o;
        }
      }
      if (++i) on.length = i;
      else delete this.__on;
    };
  }
  function onAdd(typename, value, options) {
    return function() {
      var on = this.__on, o, listener = contextListener(value);
      if (on) for (var j = 0, m2 = on.length; j < m2; ++j) {
        if ((o = on[j]).type === typename.type && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
          this.addEventListener(o.type, o.listener = listener, o.options = options);
          o.value = value;
          return;
        }
      }
      this.addEventListener(typename.type, listener, options);
      o = { type: typename.type, name: typename.name, value, listener, options };
      if (!on) this.__on = [o];
      else on.push(o);
    };
  }
  function on_default(typename, value, options) {
    var typenames = parseTypenames2(typename + ""), i, n = typenames.length, t;
    if (arguments.length < 2) {
      var on = this.node().__on;
      if (on) for (var j = 0, m2 = on.length, o; j < m2; ++j) {
        for (i = 0, o = on[j]; i < n; ++i) {
          if ((t = typenames[i]).type === o.type && t.name === o.name) {
            return o.value;
          }
        }
      }
      return;
    }
    on = value ? onAdd : onRemove;
    for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
    return this;
  }

  // node_modules/d3-selection/src/selection/dispatch.js
  function dispatchEvent(node, type2, params) {
    var window2 = window_default(node), event = window2.CustomEvent;
    if (typeof event === "function") {
      event = new event(type2, params);
    } else {
      event = window2.document.createEvent("Event");
      if (params) event.initEvent(type2, params.bubbles, params.cancelable), event.detail = params.detail;
      else event.initEvent(type2, false, false);
    }
    node.dispatchEvent(event);
  }
  function dispatchConstant(type2, params) {
    return function() {
      return dispatchEvent(this, type2, params);
    };
  }
  function dispatchFunction(type2, params) {
    return function() {
      return dispatchEvent(this, type2, params.apply(this, arguments));
    };
  }
  function dispatch_default2(type2, params) {
    return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type2, params));
  }

  // node_modules/d3-selection/src/selection/iterator.js
  function* iterator_default() {
    for (var groups = this._groups, j = 0, m2 = groups.length; j < m2; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) yield node;
      }
    }
  }

  // node_modules/d3-selection/src/selection/index.js
  var root = [null];
  function Selection(groups, parents) {
    this._groups = groups;
    this._parents = parents;
  }
  function selection() {
    return new Selection([[document.documentElement]], root);
  }
  function selection_selection() {
    return this;
  }
  Selection.prototype = selection.prototype = {
    constructor: Selection,
    select: select_default,
    selectAll: selectAll_default,
    selectChild: selectChild_default,
    selectChildren: selectChildren_default,
    filter: filter_default,
    data: data_default,
    enter: enter_default,
    exit: exit_default,
    join: join_default,
    merge: merge_default,
    selection: selection_selection,
    order: order_default,
    sort: sort_default,
    call: call_default,
    nodes: nodes_default2,
    node: node_default,
    size: size_default,
    empty: empty_default,
    each: each_default,
    attr: attr_default,
    style: style_default,
    property: property_default,
    classed: classed_default,
    text: text_default,
    html: html_default,
    raise: raise_default,
    lower: lower_default,
    append: append_default,
    insert: insert_default,
    remove: remove_default,
    clone: clone_default,
    datum: datum_default,
    on: on_default,
    dispatch: dispatch_default2,
    [Symbol.iterator]: iterator_default
  };
  var selection_default = selection;

  // node_modules/d3-selection/src/select.js
  function select_default2(selector) {
    return typeof selector === "string" ? new Selection([[document.querySelector(selector)]], [document.documentElement]) : new Selection([[selector]], root);
  }

  // node_modules/d3-selection/src/sourceEvent.js
  function sourceEvent_default(event) {
    let sourceEvent;
    while (sourceEvent = event.sourceEvent) event = sourceEvent;
    return event;
  }

  // node_modules/d3-selection/src/pointer.js
  function pointer_default(event, node) {
    event = sourceEvent_default(event);
    if (node === void 0) node = event.currentTarget;
    if (node) {
      var svg = node.ownerSVGElement || node;
      if (svg.createSVGPoint) {
        var point = svg.createSVGPoint();
        point.x = event.clientX, point.y = event.clientY;
        point = point.matrixTransform(node.getScreenCTM().inverse());
        return [point.x, point.y];
      }
      if (node.getBoundingClientRect) {
        var rect = node.getBoundingClientRect();
        return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
      }
    }
    return [event.pageX, event.pageY];
  }

  // node_modules/d3-drag/src/noevent.js
  var nonpassive = { passive: false };
  var nonpassivecapture = { capture: true, passive: false };
  function nopropagation(event) {
    event.stopImmediatePropagation();
  }
  function noevent_default(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  // node_modules/d3-drag/src/nodrag.js
  function nodrag_default(view) {
    var root2 = view.document.documentElement, selection2 = select_default2(view).on("dragstart.drag", noevent_default, nonpassivecapture);
    if ("onselectstart" in root2) {
      selection2.on("selectstart.drag", noevent_default, nonpassivecapture);
    } else {
      root2.__noselect = root2.style.MozUserSelect;
      root2.style.MozUserSelect = "none";
    }
  }
  function yesdrag(view, noclick) {
    var root2 = view.document.documentElement, selection2 = select_default2(view).on("dragstart.drag", null);
    if (noclick) {
      selection2.on("click.drag", noevent_default, nonpassivecapture);
      setTimeout(function() {
        selection2.on("click.drag", null);
      }, 0);
    }
    if ("onselectstart" in root2) {
      selection2.on("selectstart.drag", null);
    } else {
      root2.style.MozUserSelect = root2.__noselect;
      delete root2.__noselect;
    }
  }

  // node_modules/d3-drag/src/constant.js
  var constant_default2 = (x3) => () => x3;

  // node_modules/d3-drag/src/event.js
  function DragEvent(type2, {
    sourceEvent,
    subject,
    target,
    identifier,
    active,
    x: x3,
    y: y3,
    dx,
    dy,
    dispatch: dispatch2
  }) {
    Object.defineProperties(this, {
      type: { value: type2, enumerable: true, configurable: true },
      sourceEvent: { value: sourceEvent, enumerable: true, configurable: true },
      subject: { value: subject, enumerable: true, configurable: true },
      target: { value: target, enumerable: true, configurable: true },
      identifier: { value: identifier, enumerable: true, configurable: true },
      active: { value: active, enumerable: true, configurable: true },
      x: { value: x3, enumerable: true, configurable: true },
      y: { value: y3, enumerable: true, configurable: true },
      dx: { value: dx, enumerable: true, configurable: true },
      dy: { value: dy, enumerable: true, configurable: true },
      _: { value: dispatch2 }
    });
  }
  DragEvent.prototype.on = function() {
    var value = this._.on.apply(this._, arguments);
    return value === this._ ? this : value;
  };

  // node_modules/d3-drag/src/drag.js
  function defaultFilter(event) {
    return !event.ctrlKey && !event.button;
  }
  function defaultContainer() {
    return this.parentNode;
  }
  function defaultSubject(event, d) {
    return d == null ? { x: event.x, y: event.y } : d;
  }
  function defaultTouchable() {
    return navigator.maxTouchPoints || "ontouchstart" in this;
  }
  function drag_default() {
    var filter2 = defaultFilter, container = defaultContainer, subject = defaultSubject, touchable = defaultTouchable, gestures = {}, listeners = dispatch_default("start", "drag", "end"), active = 0, mousedownx, mousedowny, mousemoving, touchending, clickDistance2 = 0;
    function drag(selection2) {
      selection2.on("mousedown.drag", mousedowned).filter(touchable).on("touchstart.drag", touchstarted).on("touchmove.drag", touchmoved, nonpassive).on("touchend.drag touchcancel.drag", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
    }
    function mousedowned(event, d) {
      if (touchending || !filter2.call(this, event, d)) return;
      var gesture = beforestart(this, container.call(this, event, d), event, d, "mouse");
      if (!gesture) return;
      select_default2(event.view).on("mousemove.drag", mousemoved, nonpassivecapture).on("mouseup.drag", mouseupped, nonpassivecapture);
      nodrag_default(event.view);
      nopropagation(event);
      mousemoving = false;
      mousedownx = event.clientX;
      mousedowny = event.clientY;
      gesture("start", event);
    }
    function mousemoved(event) {
      noevent_default(event);
      if (!mousemoving) {
        var dx = event.clientX - mousedownx, dy = event.clientY - mousedowny;
        mousemoving = dx * dx + dy * dy > clickDistance2;
      }
      gestures.mouse("drag", event);
    }
    function mouseupped(event) {
      select_default2(event.view).on("mousemove.drag mouseup.drag", null);
      yesdrag(event.view, mousemoving);
      noevent_default(event);
      gestures.mouse("end", event);
    }
    function touchstarted(event, d) {
      if (!filter2.call(this, event, d)) return;
      var touches = event.changedTouches, c2 = container.call(this, event, d), n = touches.length, i, gesture;
      for (i = 0; i < n; ++i) {
        if (gesture = beforestart(this, c2, event, d, touches[i].identifier, touches[i])) {
          nopropagation(event);
          gesture("start", event, touches[i]);
        }
      }
    }
    function touchmoved(event) {
      var touches = event.changedTouches, n = touches.length, i, gesture;
      for (i = 0; i < n; ++i) {
        if (gesture = gestures[touches[i].identifier]) {
          noevent_default(event);
          gesture("drag", event, touches[i]);
        }
      }
    }
    function touchended(event) {
      var touches = event.changedTouches, n = touches.length, i, gesture;
      if (touchending) clearTimeout(touchending);
      touchending = setTimeout(function() {
        touchending = null;
      }, 500);
      for (i = 0; i < n; ++i) {
        if (gesture = gestures[touches[i].identifier]) {
          nopropagation(event);
          gesture("end", event, touches[i]);
        }
      }
    }
    function beforestart(that, container2, event, d, identifier, touch) {
      var dispatch2 = listeners.copy(), p = pointer_default(touch || event, container2), dx, dy, s;
      if ((s = subject.call(that, new DragEvent("beforestart", {
        sourceEvent: event,
        target: drag,
        identifier,
        active,
        x: p[0],
        y: p[1],
        dx: 0,
        dy: 0,
        dispatch: dispatch2
      }), d)) == null) return;
      dx = s.x - p[0] || 0;
      dy = s.y - p[1] || 0;
      return function gesture(type2, event2, touch2) {
        var p0 = p, n;
        switch (type2) {
          case "start":
            gestures[identifier] = gesture, n = active++;
            break;
          case "end":
            delete gestures[identifier], --active;
          // falls through
          case "drag":
            p = pointer_default(touch2 || event2, container2), n = active;
            break;
        }
        dispatch2.call(
          type2,
          that,
          new DragEvent(type2, {
            sourceEvent: event2,
            subject: s,
            target: drag,
            identifier,
            active: n,
            x: p[0] + dx,
            y: p[1] + dy,
            dx: p[0] - p0[0],
            dy: p[1] - p0[1],
            dispatch: dispatch2
          }),
          d
        );
      };
    }
    drag.filter = function(_) {
      return arguments.length ? (filter2 = typeof _ === "function" ? _ : constant_default2(!!_), drag) : filter2;
    };
    drag.container = function(_) {
      return arguments.length ? (container = typeof _ === "function" ? _ : constant_default2(_), drag) : container;
    };
    drag.subject = function(_) {
      return arguments.length ? (subject = typeof _ === "function" ? _ : constant_default2(_), drag) : subject;
    };
    drag.touchable = function(_) {
      return arguments.length ? (touchable = typeof _ === "function" ? _ : constant_default2(!!_), drag) : touchable;
    };
    drag.on = function() {
      var value = listeners.on.apply(listeners, arguments);
      return value === listeners ? drag : value;
    };
    drag.clickDistance = function(_) {
      return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
    };
    return drag;
  }

  // node_modules/d3-color/src/define.js
  function define_default(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
  }
  function extend(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for (var key in definition) prototype[key] = definition[key];
    return prototype;
  }

  // node_modules/d3-color/src/color.js
  function Color() {
  }
  var darker = 0.7;
  var brighter = 1 / darker;
  var reI = "\\s*([+-]?\\d+)\\s*";
  var reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*";
  var reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
  var reHex = /^#([0-9a-f]{3,8})$/;
  var reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`);
  var reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`);
  var reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`);
  var reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`);
  var reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`);
  var reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);
  var named = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074
  };
  define_default(Color, color, {
    copy(channels) {
      return Object.assign(new this.constructor(), this, channels);
    },
    displayable() {
      return this.rgb().displayable();
    },
    hex: color_formatHex,
    // Deprecated! Use color.formatHex.
    formatHex: color_formatHex,
    formatHex8: color_formatHex8,
    formatHsl: color_formatHsl,
    formatRgb: color_formatRgb,
    toString: color_formatRgb
  });
  function color_formatHex() {
    return this.rgb().formatHex();
  }
  function color_formatHex8() {
    return this.rgb().formatHex8();
  }
  function color_formatHsl() {
    return hslConvert(this).formatHsl();
  }
  function color_formatRgb() {
    return this.rgb().formatRgb();
  }
  function color(format) {
    var m2, l;
    format = (format + "").trim().toLowerCase();
    return (m2 = reHex.exec(format)) ? (l = m2[1].length, m2 = parseInt(m2[1], 16), l === 6 ? rgbn(m2) : l === 3 ? new Rgb(m2 >> 8 & 15 | m2 >> 4 & 240, m2 >> 4 & 15 | m2 & 240, (m2 & 15) << 4 | m2 & 15, 1) : l === 8 ? rgba(m2 >> 24 & 255, m2 >> 16 & 255, m2 >> 8 & 255, (m2 & 255) / 255) : l === 4 ? rgba(m2 >> 12 & 15 | m2 >> 8 & 240, m2 >> 8 & 15 | m2 >> 4 & 240, m2 >> 4 & 15 | m2 & 240, ((m2 & 15) << 4 | m2 & 15) / 255) : null) : (m2 = reRgbInteger.exec(format)) ? new Rgb(m2[1], m2[2], m2[3], 1) : (m2 = reRgbPercent.exec(format)) ? new Rgb(m2[1] * 255 / 100, m2[2] * 255 / 100, m2[3] * 255 / 100, 1) : (m2 = reRgbaInteger.exec(format)) ? rgba(m2[1], m2[2], m2[3], m2[4]) : (m2 = reRgbaPercent.exec(format)) ? rgba(m2[1] * 255 / 100, m2[2] * 255 / 100, m2[3] * 255 / 100, m2[4]) : (m2 = reHslPercent.exec(format)) ? hsla(m2[1], m2[2] / 100, m2[3] / 100, 1) : (m2 = reHslaPercent.exec(format)) ? hsla(m2[1], m2[2] / 100, m2[3] / 100, m2[4]) : named.hasOwnProperty(format) ? rgbn(named[format]) : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
  }
  function rgbn(n) {
    return new Rgb(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
  }
  function rgba(r, g, b, a2) {
    if (a2 <= 0) r = g = b = NaN;
    return new Rgb(r, g, b, a2);
  }
  function rgbConvert(o) {
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Rgb();
    o = o.rgb();
    return new Rgb(o.r, o.g, o.b, o.opacity);
  }
  function rgb(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
  }
  function Rgb(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
  }
  define_default(Rgb, rgb, extend(Color, {
    brighter(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb() {
      return this;
    },
    clamp() {
      return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
    },
    displayable() {
      return -0.5 <= this.r && this.r < 255.5 && (-0.5 <= this.g && this.g < 255.5) && (-0.5 <= this.b && this.b < 255.5) && (0 <= this.opacity && this.opacity <= 1);
    },
    hex: rgb_formatHex,
    // Deprecated! Use color.formatHex.
    formatHex: rgb_formatHex,
    formatHex8: rgb_formatHex8,
    formatRgb: rgb_formatRgb,
    toString: rgb_formatRgb
  }));
  function rgb_formatHex() {
    return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
  }
  function rgb_formatHex8() {
    return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
  }
  function rgb_formatRgb() {
    const a2 = clampa(this.opacity);
    return `${a2 === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a2 === 1 ? ")" : `, ${a2})`}`;
  }
  function clampa(opacity) {
    return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
  }
  function clampi(value) {
    return Math.max(0, Math.min(255, Math.round(value) || 0));
  }
  function hex(value) {
    value = clampi(value);
    return (value < 16 ? "0" : "") + value.toString(16);
  }
  function hsla(h, s, l, a2) {
    if (a2 <= 0) h = s = l = NaN;
    else if (l <= 0 || l >= 1) h = s = NaN;
    else if (s <= 0) h = NaN;
    return new Hsl(h, s, l, a2);
  }
  function hslConvert(o) {
    if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Hsl();
    if (o instanceof Hsl) return o;
    o = o.rgb();
    var r = o.r / 255, g = o.g / 255, b = o.b / 255, min2 = Math.min(r, g, b), max2 = Math.max(r, g, b), h = NaN, s = max2 - min2, l = (max2 + min2) / 2;
    if (s) {
      if (r === max2) h = (g - b) / s + (g < b) * 6;
      else if (g === max2) h = (b - r) / s + 2;
      else h = (r - g) / s + 4;
      s /= l < 0.5 ? max2 + min2 : 2 - max2 - min2;
      h *= 60;
    } else {
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl(h, s, l, o.opacity);
  }
  function hsl(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
  }
  function Hsl(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }
  define_default(Hsl, hsl, extend(Color, {
    brighter(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    darker(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    rgb() {
      var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s, m1 = 2 * l - m2;
      return new Rgb(
        hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
        hsl2rgb(h, m1, m2),
        hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
        this.opacity
      );
    },
    clamp() {
      return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
    },
    displayable() {
      return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && (0 <= this.l && this.l <= 1) && (0 <= this.opacity && this.opacity <= 1);
    },
    formatHsl() {
      const a2 = clampa(this.opacity);
      return `${a2 === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a2 === 1 ? ")" : `, ${a2})`}`;
    }
  }));
  function clamph(value) {
    value = (value || 0) % 360;
    return value < 0 ? value + 360 : value;
  }
  function clampt(value) {
    return Math.max(0, Math.min(1, value || 0));
  }
  function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
  }

  // node_modules/d3-interpolate/src/basis.js
  function basis(t1, v0, v1, v2, v3) {
    var t2 = t1 * t1, t3 = t2 * t1;
    return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
  }
  function basis_default(values) {
    var n = values.length - 1;
    return function(t) {
      var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n), v1 = values[i], v2 = values[i + 1], v0 = i > 0 ? values[i - 1] : 2 * v1 - v2, v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
      return basis((t - i / n) * n, v0, v1, v2, v3);
    };
  }

  // node_modules/d3-interpolate/src/basisClosed.js
  function basisClosed_default(values) {
    var n = values.length;
    return function(t) {
      var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n), v0 = values[(i + n - 1) % n], v1 = values[i % n], v2 = values[(i + 1) % n], v3 = values[(i + 2) % n];
      return basis((t - i / n) * n, v0, v1, v2, v3);
    };
  }

  // node_modules/d3-interpolate/src/constant.js
  var constant_default3 = (x3) => () => x3;

  // node_modules/d3-interpolate/src/color.js
  function linear(a2, d) {
    return function(t) {
      return a2 + t * d;
    };
  }
  function exponential(a2, b, y3) {
    return a2 = Math.pow(a2, y3), b = Math.pow(b, y3) - a2, y3 = 1 / y3, function(t) {
      return Math.pow(a2 + t * b, y3);
    };
  }
  function gamma(y3) {
    return (y3 = +y3) === 1 ? nogamma : function(a2, b) {
      return b - a2 ? exponential(a2, b, y3) : constant_default3(isNaN(a2) ? b : a2);
    };
  }
  function nogamma(a2, b) {
    var d = b - a2;
    return d ? linear(a2, d) : constant_default3(isNaN(a2) ? b : a2);
  }

  // node_modules/d3-interpolate/src/rgb.js
  var rgb_default = function rgbGamma(y3) {
    var color2 = gamma(y3);
    function rgb2(start2, end) {
      var r = color2((start2 = rgb(start2)).r, (end = rgb(end)).r), g = color2(start2.g, end.g), b = color2(start2.b, end.b), opacity = nogamma(start2.opacity, end.opacity);
      return function(t) {
        start2.r = r(t);
        start2.g = g(t);
        start2.b = b(t);
        start2.opacity = opacity(t);
        return start2 + "";
      };
    }
    rgb2.gamma = rgbGamma;
    return rgb2;
  }(1);
  function rgbSpline(spline) {
    return function(colors) {
      var n = colors.length, r = new Array(n), g = new Array(n), b = new Array(n), i, color2;
      for (i = 0; i < n; ++i) {
        color2 = rgb(colors[i]);
        r[i] = color2.r || 0;
        g[i] = color2.g || 0;
        b[i] = color2.b || 0;
      }
      r = spline(r);
      g = spline(g);
      b = spline(b);
      color2.opacity = 1;
      return function(t) {
        color2.r = r(t);
        color2.g = g(t);
        color2.b = b(t);
        return color2 + "";
      };
    };
  }
  var rgbBasis = rgbSpline(basis_default);
  var rgbBasisClosed = rgbSpline(basisClosed_default);

  // node_modules/d3-interpolate/src/number.js
  function number_default(a2, b) {
    return a2 = +a2, b = +b, function(t) {
      return a2 * (1 - t) + b * t;
    };
  }

  // node_modules/d3-interpolate/src/string.js
  var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
  var reB = new RegExp(reA.source, "g");
  function zero(b) {
    return function() {
      return b;
    };
  }
  function one(b) {
    return function(t) {
      return b(t) + "";
    };
  }
  function string_default(a2, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
    a2 = a2 + "", b = b + "";
    while ((am = reA.exec(a2)) && (bm = reB.exec(b))) {
      if ((bs = bm.index) > bi) {
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs;
        else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) {
        if (s[i]) s[i] += bm;
        else s[++i] = bm;
      } else {
        s[++i] = null;
        q.push({ i, x: number_default(am, bm) });
      }
      bi = reB.lastIndex;
    }
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs;
      else s[++i] = bs;
    }
    return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function(t) {
      for (var i2 = 0, o; i2 < b; ++i2) s[(o = q[i2]).i] = o.x(t);
      return s.join("");
    });
  }

  // node_modules/d3-interpolate/src/transform/decompose.js
  var degrees = 180 / Math.PI;
  var identity = {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    skewX: 0,
    scaleX: 1,
    scaleY: 1
  };
  function decompose_default(a2, b, c2, d, e, f) {
    var scaleX, scaleY, skewX;
    if (scaleX = Math.sqrt(a2 * a2 + b * b)) a2 /= scaleX, b /= scaleX;
    if (skewX = a2 * c2 + b * d) c2 -= a2 * skewX, d -= b * skewX;
    if (scaleY = Math.sqrt(c2 * c2 + d * d)) c2 /= scaleY, d /= scaleY, skewX /= scaleY;
    if (a2 * d < b * c2) a2 = -a2, b = -b, skewX = -skewX, scaleX = -scaleX;
    return {
      translateX: e,
      translateY: f,
      rotate: Math.atan2(b, a2) * degrees,
      skewX: Math.atan(skewX) * degrees,
      scaleX,
      scaleY
    };
  }

  // node_modules/d3-interpolate/src/transform/parse.js
  var svgNode;
  function parseCss(value) {
    const m2 = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
    return m2.isIdentity ? identity : decompose_default(m2.a, m2.b, m2.c, m2.d, m2.e, m2.f);
  }
  function parseSvg(value) {
    if (value == null) return identity;
    if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgNode.setAttribute("transform", value);
    if (!(value = svgNode.transform.baseVal.consolidate())) return identity;
    value = value.matrix;
    return decompose_default(value.a, value.b, value.c, value.d, value.e, value.f);
  }

  // node_modules/d3-interpolate/src/transform/index.js
  function interpolateTransform(parse, pxComma, pxParen, degParen) {
    function pop(s) {
      return s.length ? s.pop() + " " : "";
    }
    function translate(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push("translate(", null, pxComma, null, pxParen);
        q.push({ i: i - 4, x: number_default(xa, xb) }, { i: i - 2, x: number_default(ya, yb) });
      } else if (xb || yb) {
        s.push("translate(" + xb + pxComma + yb + pxParen);
      }
    }
    function rotate(a2, b, s, q) {
      if (a2 !== b) {
        if (a2 - b > 180) b += 360;
        else if (b - a2 > 180) a2 += 360;
        q.push({ i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: number_default(a2, b) });
      } else if (b) {
        s.push(pop(s) + "rotate(" + b + degParen);
      }
    }
    function skewX(a2, b, s, q) {
      if (a2 !== b) {
        q.push({ i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: number_default(a2, b) });
      } else if (b) {
        s.push(pop(s) + "skewX(" + b + degParen);
      }
    }
    function scale(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push(pop(s) + "scale(", null, ",", null, ")");
        q.push({ i: i - 4, x: number_default(xa, xb) }, { i: i - 2, x: number_default(ya, yb) });
      } else if (xb !== 1 || yb !== 1) {
        s.push(pop(s) + "scale(" + xb + "," + yb + ")");
      }
    }
    return function(a2, b) {
      var s = [], q = [];
      a2 = parse(a2), b = parse(b);
      translate(a2.translateX, a2.translateY, b.translateX, b.translateY, s, q);
      rotate(a2.rotate, b.rotate, s, q);
      skewX(a2.skewX, b.skewX, s, q);
      scale(a2.scaleX, a2.scaleY, b.scaleX, b.scaleY, s, q);
      a2 = b = null;
      return function(t) {
        var i = -1, n = q.length, o;
        while (++i < n) s[(o = q[i]).i] = o.x(t);
        return s.join("");
      };
    };
  }
  var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
  var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

  // node_modules/d3-interpolate/src/zoom.js
  var epsilon2 = 1e-12;
  function cosh(x3) {
    return ((x3 = Math.exp(x3)) + 1 / x3) / 2;
  }
  function sinh(x3) {
    return ((x3 = Math.exp(x3)) - 1 / x3) / 2;
  }
  function tanh(x3) {
    return ((x3 = Math.exp(2 * x3)) - 1) / (x3 + 1);
  }
  var zoom_default = function zoomRho(rho, rho2, rho4) {
    function zoom(p0, p1) {
      var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2], dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, i, S;
      if (d2 < epsilon2) {
        S = Math.log(w1 / w0) / rho;
        i = function(t) {
          return [
            ux0 + t * dx,
            uy0 + t * dy,
            w0 * Math.exp(rho * t * S)
          ];
        };
      } else {
        var d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1), b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
        S = (r1 - r0) / rho;
        i = function(t) {
          var s = t * S, coshr0 = cosh(r0), u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
          return [
            ux0 + u * dx,
            uy0 + u * dy,
            w0 * coshr0 / cosh(rho * s + r0)
          ];
        };
      }
      i.duration = S * 1e3 * rho / Math.SQRT2;
      return i;
    }
    zoom.rho = function(_) {
      var _1 = Math.max(1e-3, +_), _2 = _1 * _1, _4 = _2 * _2;
      return zoomRho(_1, _2, _4);
    };
    return zoom;
  }(Math.SQRT2, 2, 4);

  // node_modules/d3-timer/src/timer.js
  var frame = 0;
  var timeout = 0;
  var interval = 0;
  var pokeDelay = 1e3;
  var taskHead;
  var taskTail;
  var clockLast = 0;
  var clockNow = 0;
  var clockSkew = 0;
  var clock = typeof performance === "object" && performance.now ? performance : Date;
  var setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
    setTimeout(f, 17);
  };
  function now() {
    return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
  }
  function clearNow() {
    clockNow = 0;
  }
  function Timer() {
    this._call = this._time = this._next = null;
  }
  Timer.prototype = timer.prototype = {
    constructor: Timer,
    restart: function(callback, delay, time) {
      if (typeof callback !== "function") throw new TypeError("callback is not a function");
      time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
      if (!this._next && taskTail !== this) {
        if (taskTail) taskTail._next = this;
        else taskHead = this;
        taskTail = this;
      }
      this._call = callback;
      this._time = time;
      sleep();
    },
    stop: function() {
      if (this._call) {
        this._call = null;
        this._time = Infinity;
        sleep();
      }
    }
  };
  function timer(callback, delay, time) {
    var t = new Timer();
    t.restart(callback, delay, time);
    return t;
  }
  function timerFlush() {
    now();
    ++frame;
    var t = taskHead, e;
    while (t) {
      if ((e = clockNow - t._time) >= 0) t._call.call(void 0, e);
      t = t._next;
    }
    --frame;
  }
  function wake() {
    clockNow = (clockLast = clock.now()) + clockSkew;
    frame = timeout = 0;
    try {
      timerFlush();
    } finally {
      frame = 0;
      nap();
      clockNow = 0;
    }
  }
  function poke() {
    var now2 = clock.now(), delay = now2 - clockLast;
    if (delay > pokeDelay) clockSkew -= delay, clockLast = now2;
  }
  function nap() {
    var t0, t1 = taskHead, t2, time = Infinity;
    while (t1) {
      if (t1._call) {
        if (time > t1._time) time = t1._time;
        t0 = t1, t1 = t1._next;
      } else {
        t2 = t1._next, t1._next = null;
        t1 = t0 ? t0._next = t2 : taskHead = t2;
      }
    }
    taskTail = t0;
    sleep(time);
  }
  function sleep(time) {
    if (frame) return;
    if (timeout) timeout = clearTimeout(timeout);
    var delay = time - clockNow;
    if (delay > 24) {
      if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
      if (interval) interval = clearInterval(interval);
    } else {
      if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
      frame = 1, setFrame(wake);
    }
  }

  // node_modules/d3-timer/src/timeout.js
  function timeout_default(callback, delay, time) {
    var t = new Timer();
    delay = delay == null ? 0 : +delay;
    t.restart((elapsed) => {
      t.stop();
      callback(elapsed + delay);
    }, delay, time);
    return t;
  }

  // node_modules/d3-transition/src/transition/schedule.js
  var emptyOn = dispatch_default("start", "end", "cancel", "interrupt");
  var emptyTween = [];
  var CREATED = 0;
  var SCHEDULED = 1;
  var STARTING = 2;
  var STARTED = 3;
  var RUNNING = 4;
  var ENDING = 5;
  var ENDED = 6;
  function schedule_default(node, name, id2, index2, group, timing) {
    var schedules = node.__transition;
    if (!schedules) node.__transition = {};
    else if (id2 in schedules) return;
    create(node, id2, {
      name,
      index: index2,
      // For context during callback.
      group,
      // For context during callback.
      on: emptyOn,
      tween: emptyTween,
      time: timing.time,
      delay: timing.delay,
      duration: timing.duration,
      ease: timing.ease,
      timer: null,
      state: CREATED
    });
  }
  function init(node, id2) {
    var schedule = get2(node, id2);
    if (schedule.state > CREATED) throw new Error("too late; already scheduled");
    return schedule;
  }
  function set2(node, id2) {
    var schedule = get2(node, id2);
    if (schedule.state > STARTED) throw new Error("too late; already running");
    return schedule;
  }
  function get2(node, id2) {
    var schedule = node.__transition;
    if (!schedule || !(schedule = schedule[id2])) throw new Error("transition not found");
    return schedule;
  }
  function create(node, id2, self) {
    var schedules = node.__transition, tween;
    schedules[id2] = self;
    self.timer = timer(schedule, 0, self.time);
    function schedule(elapsed) {
      self.state = SCHEDULED;
      self.timer.restart(start2, self.delay, self.time);
      if (self.delay <= elapsed) start2(elapsed - self.delay);
    }
    function start2(elapsed) {
      var i, j, n, o;
      if (self.state !== SCHEDULED) return stop();
      for (i in schedules) {
        o = schedules[i];
        if (o.name !== self.name) continue;
        if (o.state === STARTED) return timeout_default(start2);
        if (o.state === RUNNING) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("interrupt", node, node.__data__, o.index, o.group);
          delete schedules[i];
        } else if (+i < id2) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("cancel", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }
      }
      timeout_default(function() {
        if (self.state === STARTED) {
          self.state = RUNNING;
          self.timer.restart(tick, self.delay, self.time);
          tick(elapsed);
        }
      });
      self.state = STARTING;
      self.on.call("start", node, node.__data__, self.index, self.group);
      if (self.state !== STARTING) return;
      self.state = STARTED;
      tween = new Array(n = self.tween.length);
      for (i = 0, j = -1; i < n; ++i) {
        if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
          tween[++j] = o;
        }
      }
      tween.length = j + 1;
    }
    function tick(elapsed) {
      var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1), i = -1, n = tween.length;
      while (++i < n) {
        tween[i].call(node, t);
      }
      if (self.state === ENDING) {
        self.on.call("end", node, node.__data__, self.index, self.group);
        stop();
      }
    }
    function stop() {
      self.state = ENDED;
      self.timer.stop();
      delete schedules[id2];
      for (var i in schedules) return;
      delete node.__transition;
    }
  }

  // node_modules/d3-transition/src/interrupt.js
  function interrupt_default(node, name) {
    var schedules = node.__transition, schedule, active, empty2 = true, i;
    if (!schedules) return;
    name = name == null ? null : name + "";
    for (i in schedules) {
      if ((schedule = schedules[i]).name !== name) {
        empty2 = false;
        continue;
      }
      active = schedule.state > STARTING && schedule.state < ENDING;
      schedule.state = ENDED;
      schedule.timer.stop();
      schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
      delete schedules[i];
    }
    if (empty2) delete node.__transition;
  }

  // node_modules/d3-transition/src/selection/interrupt.js
  function interrupt_default2(name) {
    return this.each(function() {
      interrupt_default(this, name);
    });
  }

  // node_modules/d3-transition/src/transition/tween.js
  function tweenRemove(id2, name) {
    var tween0, tween1;
    return function() {
      var schedule = set2(this, id2), tween = schedule.tween;
      if (tween !== tween0) {
        tween1 = tween0 = tween;
        for (var i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1 = tween1.slice();
            tween1.splice(i, 1);
            break;
          }
        }
      }
      schedule.tween = tween1;
    };
  }
  function tweenFunction(id2, name, value) {
    var tween0, tween1;
    if (typeof value !== "function") throw new Error();
    return function() {
      var schedule = set2(this, id2), tween = schedule.tween;
      if (tween !== tween0) {
        tween1 = (tween0 = tween).slice();
        for (var t = { name, value }, i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1[i] = t;
            break;
          }
        }
        if (i === n) tween1.push(t);
      }
      schedule.tween = tween1;
    };
  }
  function tween_default(name, value) {
    var id2 = this._id;
    name += "";
    if (arguments.length < 2) {
      var tween = get2(this.node(), id2).tween;
      for (var i = 0, n = tween.length, t; i < n; ++i) {
        if ((t = tween[i]).name === name) {
          return t.value;
        }
      }
      return null;
    }
    return this.each((value == null ? tweenRemove : tweenFunction)(id2, name, value));
  }
  function tweenValue(transition2, name, value) {
    var id2 = transition2._id;
    transition2.each(function() {
      var schedule = set2(this, id2);
      (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
    });
    return function(node) {
      return get2(node, id2).value[name];
    };
  }

  // node_modules/d3-transition/src/transition/interpolate.js
  function interpolate_default(a2, b) {
    var c2;
    return (typeof b === "number" ? number_default : b instanceof color ? rgb_default : (c2 = color(b)) ? (b = c2, rgb_default) : string_default)(a2, b);
  }

  // node_modules/d3-transition/src/transition/attr.js
  function attrRemove2(name) {
    return function() {
      this.removeAttribute(name);
    };
  }
  function attrRemoveNS2(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }
  function attrConstant2(name, interpolate, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
      var string0 = this.getAttribute(name);
      return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
    };
  }
  function attrConstantNS2(fullname, interpolate, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
      var string0 = this.getAttributeNS(fullname.space, fullname.local);
      return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
    };
  }
  function attrFunction2(name, interpolate, value) {
    var string00, string10, interpolate0;
    return function() {
      var string0, value1 = value(this), string1;
      if (value1 == null) return void this.removeAttribute(name);
      string0 = this.getAttribute(name);
      string1 = value1 + "";
      return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }
  function attrFunctionNS2(fullname, interpolate, value) {
    var string00, string10, interpolate0;
    return function() {
      var string0, value1 = value(this), string1;
      if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
      string0 = this.getAttributeNS(fullname.space, fullname.local);
      string1 = value1 + "";
      return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }
  function attr_default2(name, value) {
    var fullname = namespace_default(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate_default;
    return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS2 : attrFunction2)(fullname, i, tweenValue(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS2 : attrRemove2)(fullname) : (fullname.local ? attrConstantNS2 : attrConstant2)(fullname, i, value));
  }

  // node_modules/d3-transition/src/transition/attrTween.js
  function attrInterpolate(name, i) {
    return function(t) {
      this.setAttribute(name, i.call(this, t));
    };
  }
  function attrInterpolateNS(fullname, i) {
    return function(t) {
      this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
    };
  }
  function attrTweenNS(fullname, value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
      return t0;
    }
    tween._value = value;
    return tween;
  }
  function attrTween(name, value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
      return t0;
    }
    tween._value = value;
    return tween;
  }
  function attrTween_default(name, value) {
    var key = "attr." + name;
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error();
    var fullname = namespace_default(name);
    return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
  }

  // node_modules/d3-transition/src/transition/delay.js
  function delayFunction(id2, value) {
    return function() {
      init(this, id2).delay = +value.apply(this, arguments);
    };
  }
  function delayConstant(id2, value) {
    return value = +value, function() {
      init(this, id2).delay = value;
    };
  }
  function delay_default(value) {
    var id2 = this._id;
    return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id2, value)) : get2(this.node(), id2).delay;
  }

  // node_modules/d3-transition/src/transition/duration.js
  function durationFunction(id2, value) {
    return function() {
      set2(this, id2).duration = +value.apply(this, arguments);
    };
  }
  function durationConstant(id2, value) {
    return value = +value, function() {
      set2(this, id2).duration = value;
    };
  }
  function duration_default(value) {
    var id2 = this._id;
    return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id2, value)) : get2(this.node(), id2).duration;
  }

  // node_modules/d3-transition/src/transition/ease.js
  function easeConstant(id2, value) {
    if (typeof value !== "function") throw new Error();
    return function() {
      set2(this, id2).ease = value;
    };
  }
  function ease_default(value) {
    var id2 = this._id;
    return arguments.length ? this.each(easeConstant(id2, value)) : get2(this.node(), id2).ease;
  }

  // node_modules/d3-transition/src/transition/easeVarying.js
  function easeVarying(id2, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (typeof v !== "function") throw new Error();
      set2(this, id2).ease = v;
    };
  }
  function easeVarying_default(value) {
    if (typeof value !== "function") throw new Error();
    return this.each(easeVarying(this._id, value));
  }

  // node_modules/d3-transition/src/transition/filter.js
  function filter_default2(match) {
    if (typeof match !== "function") match = matcher_default(match);
    for (var groups = this._groups, m2 = groups.length, subgroups = new Array(m2), j = 0; j < m2; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }
    return new Transition(subgroups, this._parents, this._name, this._id);
  }

  // node_modules/d3-transition/src/transition/merge.js
  function merge_default2(transition2) {
    if (transition2._id !== this._id) throw new Error();
    for (var groups0 = this._groups, groups1 = transition2._groups, m0 = groups0.length, m1 = groups1.length, m2 = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m2; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }
    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }
    return new Transition(merges, this._parents, this._name, this._id);
  }

  // node_modules/d3-transition/src/transition/on.js
  function start(name) {
    return (name + "").trim().split(/^|\s+/).every(function(t) {
      var i = t.indexOf(".");
      if (i >= 0) t = t.slice(0, i);
      return !t || t === "start";
    });
  }
  function onFunction(id2, name, listener) {
    var on0, on1, sit = start(name) ? init : set2;
    return function() {
      var schedule = sit(this, id2), on = schedule.on;
      if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);
      schedule.on = on1;
    };
  }
  function on_default2(name, listener) {
    var id2 = this._id;
    return arguments.length < 2 ? get2(this.node(), id2).on.on(name) : this.each(onFunction(id2, name, listener));
  }

  // node_modules/d3-transition/src/transition/remove.js
  function removeFunction(id2) {
    return function() {
      var parent = this.parentNode;
      for (var i in this.__transition) if (+i !== id2) return;
      if (parent) parent.removeChild(this);
    };
  }
  function remove_default2() {
    return this.on("end.remove", removeFunction(this._id));
  }

  // node_modules/d3-transition/src/transition/select.js
  function select_default3(select) {
    var name = this._name, id2 = this._id;
    if (typeof select !== "function") select = selector_default(select);
    for (var groups = this._groups, m2 = groups.length, subgroups = new Array(m2), j = 0; j < m2; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
          schedule_default(subgroup[i], name, id2, i, subgroup, get2(node, id2));
        }
      }
    }
    return new Transition(subgroups, this._parents, name, id2);
  }

  // node_modules/d3-transition/src/transition/selectAll.js
  function selectAll_default2(select) {
    var name = this._name, id2 = this._id;
    if (typeof select !== "function") select = selectorAll_default(select);
    for (var groups = this._groups, m2 = groups.length, subgroups = [], parents = [], j = 0; j < m2; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          for (var children2 = select.call(node, node.__data__, i, group), child, inherit2 = get2(node, id2), k = 0, l = children2.length; k < l; ++k) {
            if (child = children2[k]) {
              schedule_default(child, name, id2, k, children2, inherit2);
            }
          }
          subgroups.push(children2);
          parents.push(node);
        }
      }
    }
    return new Transition(subgroups, parents, name, id2);
  }

  // node_modules/d3-transition/src/transition/selection.js
  var Selection2 = selection_default.prototype.constructor;
  function selection_default2() {
    return new Selection2(this._groups, this._parents);
  }

  // node_modules/d3-transition/src/transition/style.js
  function styleNull(name, interpolate) {
    var string00, string10, interpolate0;
    return function() {
      var string0 = styleValue(this, name), string1 = (this.style.removeProperty(name), styleValue(this, name));
      return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate(string00 = string0, string10 = string1);
    };
  }
  function styleRemove2(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }
  function styleConstant2(name, interpolate, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
      var string0 = styleValue(this, name);
      return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
    };
  }
  function styleFunction2(name, interpolate, value) {
    var string00, string10, interpolate0;
    return function() {
      var string0 = styleValue(this, name), value1 = value(this), string1 = value1 + "";
      if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
      return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }
  function styleMaybeRemove(id2, name) {
    var on0, on1, listener0, key = "style." + name, event = "end." + key, remove2;
    return function() {
      var schedule = set2(this, id2), on = schedule.on, listener = schedule.value[key] == null ? remove2 || (remove2 = styleRemove2(name)) : void 0;
      if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);
      schedule.on = on1;
    };
  }
  function style_default2(name, value, priority) {
    var i = (name += "") === "transform" ? interpolateTransformCss : interpolate_default;
    return value == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove2(name)) : typeof value === "function" ? this.styleTween(name, styleFunction2(name, i, tweenValue(this, "style." + name, value))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant2(name, i, value), priority).on("end.style." + name, null);
  }

  // node_modules/d3-transition/src/transition/styleTween.js
  function styleInterpolate(name, i, priority) {
    return function(t) {
      this.style.setProperty(name, i.call(this, t), priority);
    };
  }
  function styleTween(name, value, priority) {
    var t, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
      return t;
    }
    tween._value = value;
    return tween;
  }
  function styleTween_default(name, value, priority) {
    var key = "style." + (name += "");
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error();
    return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
  }

  // node_modules/d3-transition/src/transition/text.js
  function textConstant2(value) {
    return function() {
      this.textContent = value;
    };
  }
  function textFunction2(value) {
    return function() {
      var value1 = value(this);
      this.textContent = value1 == null ? "" : value1;
    };
  }
  function text_default2(value) {
    return this.tween("text", typeof value === "function" ? textFunction2(tweenValue(this, "text", value)) : textConstant2(value == null ? "" : value + ""));
  }

  // node_modules/d3-transition/src/transition/textTween.js
  function textInterpolate(i) {
    return function(t) {
      this.textContent = i.call(this, t);
    };
  }
  function textTween(value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
      return t0;
    }
    tween._value = value;
    return tween;
  }
  function textTween_default(value) {
    var key = "text";
    if (arguments.length < 1) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error();
    return this.tween(key, textTween(value));
  }

  // node_modules/d3-transition/src/transition/transition.js
  function transition_default() {
    var name = this._name, id0 = this._id, id1 = newId();
    for (var groups = this._groups, m2 = groups.length, j = 0; j < m2; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          var inherit2 = get2(node, id0);
          schedule_default(node, name, id1, i, group, {
            time: inherit2.time + inherit2.delay + inherit2.duration,
            delay: 0,
            duration: inherit2.duration,
            ease: inherit2.ease
          });
        }
      }
    }
    return new Transition(groups, this._parents, name, id1);
  }

  // node_modules/d3-transition/src/transition/end.js
  function end_default() {
    var on0, on1, that = this, id2 = that._id, size = that.size();
    return new Promise(function(resolve, reject) {
      var cancel = { value: reject }, end = { value: function() {
        if (--size === 0) resolve();
      } };
      that.each(function() {
        var schedule = set2(this, id2), on = schedule.on;
        if (on !== on0) {
          on1 = (on0 = on).copy();
          on1._.cancel.push(cancel);
          on1._.interrupt.push(cancel);
          on1._.end.push(end);
        }
        schedule.on = on1;
      });
      if (size === 0) resolve();
    });
  }

  // node_modules/d3-transition/src/transition/index.js
  var id = 0;
  function Transition(groups, parents, name, id2) {
    this._groups = groups;
    this._parents = parents;
    this._name = name;
    this._id = id2;
  }
  function transition(name) {
    return selection_default().transition(name);
  }
  function newId() {
    return ++id;
  }
  var selection_prototype = selection_default.prototype;
  Transition.prototype = transition.prototype = {
    constructor: Transition,
    select: select_default3,
    selectAll: selectAll_default2,
    selectChild: selection_prototype.selectChild,
    selectChildren: selection_prototype.selectChildren,
    filter: filter_default2,
    merge: merge_default2,
    selection: selection_default2,
    transition: transition_default,
    call: selection_prototype.call,
    nodes: selection_prototype.nodes,
    node: selection_prototype.node,
    size: selection_prototype.size,
    empty: selection_prototype.empty,
    each: selection_prototype.each,
    on: on_default2,
    attr: attr_default2,
    attrTween: attrTween_default,
    style: style_default2,
    styleTween: styleTween_default,
    text: text_default2,
    textTween: textTween_default,
    remove: remove_default2,
    tween: tween_default,
    delay: delay_default,
    duration: duration_default,
    ease: ease_default,
    easeVarying: easeVarying_default,
    end: end_default,
    [Symbol.iterator]: selection_prototype[Symbol.iterator]
  };

  // node_modules/d3-ease/src/cubic.js
  function cubicInOut(t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
  }

  // node_modules/d3-transition/src/selection/transition.js
  var defaultTiming = {
    time: null,
    // Set on use.
    delay: 0,
    duration: 250,
    ease: cubicInOut
  };
  function inherit(node, id2) {
    var timing;
    while (!(timing = node.__transition) || !(timing = timing[id2])) {
      if (!(node = node.parentNode)) {
        throw new Error(`transition ${id2} not found`);
      }
    }
    return timing;
  }
  function transition_default2(name) {
    var id2, timing;
    if (name instanceof Transition) {
      id2 = name._id, name = name._name;
    } else {
      id2 = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
    }
    for (var groups = this._groups, m2 = groups.length, j = 0; j < m2; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          schedule_default(node, name, id2, i, group, timing || inherit(node, id2));
        }
      }
    }
    return new Transition(groups, this._parents, name, id2);
  }

  // node_modules/d3-transition/src/selection/index.js
  selection_default.prototype.interrupt = interrupt_default2;
  selection_default.prototype.transition = transition_default2;

  // node_modules/d3-brush/src/brush.js
  var { abs, max, min } = Math;
  function number1(e) {
    return [+e[0], +e[1]];
  }
  function number2(e) {
    return [number1(e[0]), number1(e[1])];
  }
  var X = {
    name: "x",
    handles: ["w", "e"].map(type),
    input: function(x3, e) {
      return x3 == null ? null : [[+x3[0], e[0][1]], [+x3[1], e[1][1]]];
    },
    output: function(xy) {
      return xy && [xy[0][0], xy[1][0]];
    }
  };
  var Y = {
    name: "y",
    handles: ["n", "s"].map(type),
    input: function(y3, e) {
      return y3 == null ? null : [[e[0][0], +y3[0]], [e[1][0], +y3[1]]];
    },
    output: function(xy) {
      return xy && [xy[0][1], xy[1][1]];
    }
  };
  var XY = {
    name: "xy",
    handles: ["n", "w", "e", "s", "nw", "ne", "sw", "se"].map(type),
    input: function(xy) {
      return xy == null ? null : number2(xy);
    },
    output: function(xy) {
      return xy;
    }
  };
  function type(t) {
    return { type: t };
  }

  // node_modules/d3-force/src/center.js
  function center_default(x3, y3) {
    var nodes, strength = 1;
    if (x3 == null) x3 = 0;
    if (y3 == null) y3 = 0;
    function force() {
      var i, n = nodes.length, node, sx = 0, sy = 0;
      for (i = 0; i < n; ++i) {
        node = nodes[i], sx += node.x, sy += node.y;
      }
      for (sx = (sx / n - x3) * strength, sy = (sy / n - y3) * strength, i = 0; i < n; ++i) {
        node = nodes[i], node.x -= sx, node.y -= sy;
      }
    }
    force.initialize = function(_) {
      nodes = _;
    };
    force.x = function(_) {
      return arguments.length ? (x3 = +_, force) : x3;
    };
    force.y = function(_) {
      return arguments.length ? (y3 = +_, force) : y3;
    };
    force.strength = function(_) {
      return arguments.length ? (strength = +_, force) : strength;
    };
    return force;
  }

  // node_modules/d3-quadtree/src/add.js
  function add_default(d) {
    const x3 = +this._x.call(null, d), y3 = +this._y.call(null, d);
    return add(this.cover(x3, y3), x3, y3, d);
  }
  function add(tree, x3, y3, d) {
    if (isNaN(x3) || isNaN(y3)) return tree;
    var parent, node = tree._root, leaf = { data: d }, x0 = tree._x0, y0 = tree._y0, x1 = tree._x1, y1 = tree._y1, xm, ym, xp, yp, right, bottom, i, j;
    if (!node) return tree._root = leaf, tree;
    while (node.length) {
      if (right = x3 >= (xm = (x0 + x1) / 2)) x0 = xm;
      else x1 = xm;
      if (bottom = y3 >= (ym = (y0 + y1) / 2)) y0 = ym;
      else y1 = ym;
      if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
    }
    xp = +tree._x.call(null, node.data);
    yp = +tree._y.call(null, node.data);
    if (x3 === xp && y3 === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;
    do {
      parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
      if (right = x3 >= (xm = (x0 + x1) / 2)) x0 = xm;
      else x1 = xm;
      if (bottom = y3 >= (ym = (y0 + y1) / 2)) y0 = ym;
      else y1 = ym;
    } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | xp >= xm));
    return parent[j] = node, parent[i] = leaf, tree;
  }
  function addAll(data) {
    var d, i, n = data.length, x3, y3, xz = new Array(n), yz = new Array(n), x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (i = 0; i < n; ++i) {
      if (isNaN(x3 = +this._x.call(null, d = data[i])) || isNaN(y3 = +this._y.call(null, d))) continue;
      xz[i] = x3;
      yz[i] = y3;
      if (x3 < x0) x0 = x3;
      if (x3 > x1) x1 = x3;
      if (y3 < y0) y0 = y3;
      if (y3 > y1) y1 = y3;
    }
    if (x0 > x1 || y0 > y1) return this;
    this.cover(x0, y0).cover(x1, y1);
    for (i = 0; i < n; ++i) {
      add(this, xz[i], yz[i], data[i]);
    }
    return this;
  }

  // node_modules/d3-quadtree/src/cover.js
  function cover_default(x3, y3) {
    if (isNaN(x3 = +x3) || isNaN(y3 = +y3)) return this;
    var x0 = this._x0, y0 = this._y0, x1 = this._x1, y1 = this._y1;
    if (isNaN(x0)) {
      x1 = (x0 = Math.floor(x3)) + 1;
      y1 = (y0 = Math.floor(y3)) + 1;
    } else {
      var z = x1 - x0 || 1, node = this._root, parent, i;
      while (x0 > x3 || x3 >= x1 || y0 > y3 || y3 >= y1) {
        i = (y3 < y0) << 1 | x3 < x0;
        parent = new Array(4), parent[i] = node, node = parent, z *= 2;
        switch (i) {
          case 0:
            x1 = x0 + z, y1 = y0 + z;
            break;
          case 1:
            x0 = x1 - z, y1 = y0 + z;
            break;
          case 2:
            x1 = x0 + z, y0 = y1 - z;
            break;
          case 3:
            x0 = x1 - z, y0 = y1 - z;
            break;
        }
      }
      if (this._root && this._root.length) this._root = node;
    }
    this._x0 = x0;
    this._y0 = y0;
    this._x1 = x1;
    this._y1 = y1;
    return this;
  }

  // node_modules/d3-quadtree/src/data.js
  function data_default2() {
    var data = [];
    this.visit(function(node) {
      if (!node.length) do
        data.push(node.data);
      while (node = node.next);
    });
    return data;
  }

  // node_modules/d3-quadtree/src/extent.js
  function extent_default(_) {
    return arguments.length ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1]) : isNaN(this._x0) ? void 0 : [[this._x0, this._y0], [this._x1, this._y1]];
  }

  // node_modules/d3-quadtree/src/quad.js
  function quad_default(node, x0, y0, x1, y1) {
    this.node = node;
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
  }

  // node_modules/d3-quadtree/src/find.js
  function find_default(x3, y3, radius) {
    var data, x0 = this._x0, y0 = this._y0, x1, y1, x22, y22, x32 = this._x1, y32 = this._y1, quads = [], node = this._root, q, i;
    if (node) quads.push(new quad_default(node, x0, y0, x32, y32));
    if (radius == null) radius = Infinity;
    else {
      x0 = x3 - radius, y0 = y3 - radius;
      x32 = x3 + radius, y32 = y3 + radius;
      radius *= radius;
    }
    while (q = quads.pop()) {
      if (!(node = q.node) || (x1 = q.x0) > x32 || (y1 = q.y0) > y32 || (x22 = q.x1) < x0 || (y22 = q.y1) < y0) continue;
      if (node.length) {
        var xm = (x1 + x22) / 2, ym = (y1 + y22) / 2;
        quads.push(
          new quad_default(node[3], xm, ym, x22, y22),
          new quad_default(node[2], x1, ym, xm, y22),
          new quad_default(node[1], xm, y1, x22, ym),
          new quad_default(node[0], x1, y1, xm, ym)
        );
        if (i = (y3 >= ym) << 1 | x3 >= xm) {
          q = quads[quads.length - 1];
          quads[quads.length - 1] = quads[quads.length - 1 - i];
          quads[quads.length - 1 - i] = q;
        }
      } else {
        var dx = x3 - +this._x.call(null, node.data), dy = y3 - +this._y.call(null, node.data), d2 = dx * dx + dy * dy;
        if (d2 < radius) {
          var d = Math.sqrt(radius = d2);
          x0 = x3 - d, y0 = y3 - d;
          x32 = x3 + d, y32 = y3 + d;
          data = node.data;
        }
      }
    }
    return data;
  }

  // node_modules/d3-quadtree/src/remove.js
  function remove_default3(d) {
    if (isNaN(x3 = +this._x.call(null, d)) || isNaN(y3 = +this._y.call(null, d))) return this;
    var parent, node = this._root, retainer, previous, next, x0 = this._x0, y0 = this._y0, x1 = this._x1, y1 = this._y1, x3, y3, xm, ym, right, bottom, i, j;
    if (!node) return this;
    if (node.length) while (true) {
      if (right = x3 >= (xm = (x0 + x1) / 2)) x0 = xm;
      else x1 = xm;
      if (bottom = y3 >= (ym = (y0 + y1) / 2)) y0 = ym;
      else y1 = ym;
      if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
      if (!node.length) break;
      if (parent[i + 1 & 3] || parent[i + 2 & 3] || parent[i + 3 & 3]) retainer = parent, j = i;
    }
    while (node.data !== d) if (!(previous = node, node = node.next)) return this;
    if (next = node.next) delete node.next;
    if (previous) return next ? previous.next = next : delete previous.next, this;
    if (!parent) return this._root = next, this;
    next ? parent[i] = next : delete parent[i];
    if ((node = parent[0] || parent[1] || parent[2] || parent[3]) && node === (parent[3] || parent[2] || parent[1] || parent[0]) && !node.length) {
      if (retainer) retainer[j] = node;
      else this._root = node;
    }
    return this;
  }
  function removeAll(data) {
    for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);
    return this;
  }

  // node_modules/d3-quadtree/src/root.js
  function root_default() {
    return this._root;
  }

  // node_modules/d3-quadtree/src/size.js
  function size_default2() {
    var size = 0;
    this.visit(function(node) {
      if (!node.length) do
        ++size;
      while (node = node.next);
    });
    return size;
  }

  // node_modules/d3-quadtree/src/visit.js
  function visit_default(callback) {
    var quads = [], q, node = this._root, child, x0, y0, x1, y1;
    if (node) quads.push(new quad_default(node, this._x0, this._y0, this._x1, this._y1));
    while (q = quads.pop()) {
      if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
        var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
        if (child = node[3]) quads.push(new quad_default(child, xm, ym, x1, y1));
        if (child = node[2]) quads.push(new quad_default(child, x0, ym, xm, y1));
        if (child = node[1]) quads.push(new quad_default(child, xm, y0, x1, ym));
        if (child = node[0]) quads.push(new quad_default(child, x0, y0, xm, ym));
      }
    }
    return this;
  }

  // node_modules/d3-quadtree/src/visitAfter.js
  function visitAfter_default(callback) {
    var quads = [], next = [], q;
    if (this._root) quads.push(new quad_default(this._root, this._x0, this._y0, this._x1, this._y1));
    while (q = quads.pop()) {
      var node = q.node;
      if (node.length) {
        var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
        if (child = node[0]) quads.push(new quad_default(child, x0, y0, xm, ym));
        if (child = node[1]) quads.push(new quad_default(child, xm, y0, x1, ym));
        if (child = node[2]) quads.push(new quad_default(child, x0, ym, xm, y1));
        if (child = node[3]) quads.push(new quad_default(child, xm, ym, x1, y1));
      }
      next.push(q);
    }
    while (q = next.pop()) {
      callback(q.node, q.x0, q.y0, q.x1, q.y1);
    }
    return this;
  }

  // node_modules/d3-quadtree/src/x.js
  function defaultX(d) {
    return d[0];
  }
  function x_default(_) {
    return arguments.length ? (this._x = _, this) : this._x;
  }

  // node_modules/d3-quadtree/src/y.js
  function defaultY(d) {
    return d[1];
  }
  function y_default(_) {
    return arguments.length ? (this._y = _, this) : this._y;
  }

  // node_modules/d3-quadtree/src/quadtree.js
  function quadtree(nodes, x3, y3) {
    var tree = new Quadtree(x3 == null ? defaultX : x3, y3 == null ? defaultY : y3, NaN, NaN, NaN, NaN);
    return nodes == null ? tree : tree.addAll(nodes);
  }
  function Quadtree(x3, y3, x0, y0, x1, y1) {
    this._x = x3;
    this._y = y3;
    this._x0 = x0;
    this._y0 = y0;
    this._x1 = x1;
    this._y1 = y1;
    this._root = void 0;
  }
  function leaf_copy(leaf) {
    var copy = { data: leaf.data }, next = copy;
    while (leaf = leaf.next) next = next.next = { data: leaf.data };
    return copy;
  }
  var treeProto = quadtree.prototype = Quadtree.prototype;
  treeProto.copy = function() {
    var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1), node = this._root, nodes, child;
    if (!node) return copy;
    if (!node.length) return copy._root = leaf_copy(node), copy;
    nodes = [{ source: node, target: copy._root = new Array(4) }];
    while (node = nodes.pop()) {
      for (var i = 0; i < 4; ++i) {
        if (child = node.source[i]) {
          if (child.length) nodes.push({ source: child, target: node.target[i] = new Array(4) });
          else node.target[i] = leaf_copy(child);
        }
      }
    }
    return copy;
  };
  treeProto.add = add_default;
  treeProto.addAll = addAll;
  treeProto.cover = cover_default;
  treeProto.data = data_default2;
  treeProto.extent = extent_default;
  treeProto.find = find_default;
  treeProto.remove = remove_default3;
  treeProto.removeAll = removeAll;
  treeProto.root = root_default;
  treeProto.size = size_default2;
  treeProto.visit = visit_default;
  treeProto.visitAfter = visitAfter_default;
  treeProto.x = x_default;
  treeProto.y = y_default;

  // node_modules/d3-force/src/constant.js
  function constant_default5(x3) {
    return function() {
      return x3;
    };
  }

  // node_modules/d3-force/src/jiggle.js
  function jiggle_default(random) {
    return (random() - 0.5) * 1e-6;
  }

  // node_modules/d3-force/src/collide.js
  function x(d) {
    return d.x + d.vx;
  }
  function y(d) {
    return d.y + d.vy;
  }
  function collide_default(radius) {
    var nodes, radii, random, strength = 1, iterations = 1;
    if (typeof radius !== "function") radius = constant_default5(radius == null ? 1 : +radius);
    function force() {
      var i, n = nodes.length, tree, node, xi, yi, ri, ri2;
      for (var k = 0; k < iterations; ++k) {
        tree = quadtree(nodes, x, y).visitAfter(prepare);
        for (i = 0; i < n; ++i) {
          node = nodes[i];
          ri = radii[node.index], ri2 = ri * ri;
          xi = node.x + node.vx;
          yi = node.y + node.vy;
          tree.visit(apply);
        }
      }
      function apply(quad, x0, y0, x1, y1) {
        var data = quad.data, rj = quad.r, r = ri + rj;
        if (data) {
          if (data.index > node.index) {
            var x3 = xi - data.x - data.vx, y3 = yi - data.y - data.vy, l = x3 * x3 + y3 * y3;
            if (l < r * r) {
              if (x3 === 0) x3 = jiggle_default(random), l += x3 * x3;
              if (y3 === 0) y3 = jiggle_default(random), l += y3 * y3;
              l = (r - (l = Math.sqrt(l))) / l * strength;
              node.vx += (x3 *= l) * (r = (rj *= rj) / (ri2 + rj));
              node.vy += (y3 *= l) * r;
              data.vx -= x3 * (r = 1 - r);
              data.vy -= y3 * r;
            }
          }
          return;
        }
        return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r;
      }
    }
    function prepare(quad) {
      if (quad.data) return quad.r = radii[quad.data.index];
      for (var i = quad.r = 0; i < 4; ++i) {
        if (quad[i] && quad[i].r > quad.r) {
          quad.r = quad[i].r;
        }
      }
    }
    function initialize() {
      if (!nodes) return;
      var i, n = nodes.length, node;
      radii = new Array(n);
      for (i = 0; i < n; ++i) node = nodes[i], radii[node.index] = +radius(node, i, nodes);
    }
    force.initialize = function(_nodes, _random) {
      nodes = _nodes;
      random = _random;
      initialize();
    };
    force.iterations = function(_) {
      return arguments.length ? (iterations = +_, force) : iterations;
    };
    force.strength = function(_) {
      return arguments.length ? (strength = +_, force) : strength;
    };
    force.radius = function(_) {
      return arguments.length ? (radius = typeof _ === "function" ? _ : constant_default5(+_), initialize(), force) : radius;
    };
    return force;
  }

  // node_modules/d3-force/src/link.js
  function index(d) {
    return d.index;
  }
  function find2(nodeById, nodeId) {
    var node = nodeById.get(nodeId);
    if (!node) throw new Error("node not found: " + nodeId);
    return node;
  }
  function link_default(links) {
    var id2 = index, strength = defaultStrength, strengths, distance = constant_default5(30), distances, nodes, count, bias, random, iterations = 1;
    if (links == null) links = [];
    function defaultStrength(link) {
      return 1 / Math.min(count[link.source.index], count[link.target.index]);
    }
    function force(alpha) {
      for (var k = 0, n = links.length; k < iterations; ++k) {
        for (var i = 0, link, source, target, x3, y3, l, b; i < n; ++i) {
          link = links[i], source = link.source, target = link.target;
          x3 = target.x + target.vx - source.x - source.vx || jiggle_default(random);
          y3 = target.y + target.vy - source.y - source.vy || jiggle_default(random);
          l = Math.sqrt(x3 * x3 + y3 * y3);
          l = (l - distances[i]) / l * alpha * strengths[i];
          x3 *= l, y3 *= l;
          target.vx -= x3 * (b = bias[i]);
          target.vy -= y3 * b;
          source.vx += x3 * (b = 1 - b);
          source.vy += y3 * b;
        }
      }
    }
    function initialize() {
      if (!nodes) return;
      var i, n = nodes.length, m2 = links.length, nodeById = new Map(nodes.map((d, i2) => [id2(d, i2, nodes), d])), link;
      for (i = 0, count = new Array(n); i < m2; ++i) {
        link = links[i], link.index = i;
        if (typeof link.source !== "object") link.source = find2(nodeById, link.source);
        if (typeof link.target !== "object") link.target = find2(nodeById, link.target);
        count[link.source.index] = (count[link.source.index] || 0) + 1;
        count[link.target.index] = (count[link.target.index] || 0) + 1;
      }
      for (i = 0, bias = new Array(m2); i < m2; ++i) {
        link = links[i], bias[i] = count[link.source.index] / (count[link.source.index] + count[link.target.index]);
      }
      strengths = new Array(m2), initializeStrength();
      distances = new Array(m2), initializeDistance();
    }
    function initializeStrength() {
      if (!nodes) return;
      for (var i = 0, n = links.length; i < n; ++i) {
        strengths[i] = +strength(links[i], i, links);
      }
    }
    function initializeDistance() {
      if (!nodes) return;
      for (var i = 0, n = links.length; i < n; ++i) {
        distances[i] = +distance(links[i], i, links);
      }
    }
    force.initialize = function(_nodes, _random) {
      nodes = _nodes;
      random = _random;
      initialize();
    };
    force.links = function(_) {
      return arguments.length ? (links = _, initialize(), force) : links;
    };
    force.id = function(_) {
      return arguments.length ? (id2 = _, force) : id2;
    };
    force.iterations = function(_) {
      return arguments.length ? (iterations = +_, force) : iterations;
    };
    force.strength = function(_) {
      return arguments.length ? (strength = typeof _ === "function" ? _ : constant_default5(+_), initializeStrength(), force) : strength;
    };
    force.distance = function(_) {
      return arguments.length ? (distance = typeof _ === "function" ? _ : constant_default5(+_), initializeDistance(), force) : distance;
    };
    return force;
  }

  // node_modules/d3-force/src/lcg.js
  var a = 1664525;
  var c = 1013904223;
  var m = 4294967296;
  function lcg_default() {
    let s = 1;
    return () => (s = (a * s + c) % m) / m;
  }

  // node_modules/d3-force/src/simulation.js
  function x2(d) {
    return d.x;
  }
  function y2(d) {
    return d.y;
  }
  var initialRadius = 10;
  var initialAngle = Math.PI * (3 - Math.sqrt(5));
  function simulation_default(nodes) {
    var simulation, alpha = 1, alphaMin = 1e-3, alphaDecay = 1 - Math.pow(alphaMin, 1 / 300), alphaTarget = 0, velocityDecay = 0.6, forces = /* @__PURE__ */ new Map(), stepper = timer(step), event = dispatch_default("tick", "end"), random = lcg_default();
    if (nodes == null) nodes = [];
    function step() {
      tick();
      event.call("tick", simulation);
      if (alpha < alphaMin) {
        stepper.stop();
        event.call("end", simulation);
      }
    }
    function tick(iterations) {
      var i, n = nodes.length, node;
      if (iterations === void 0) iterations = 1;
      for (var k = 0; k < iterations; ++k) {
        alpha += (alphaTarget - alpha) * alphaDecay;
        forces.forEach(function(force) {
          force(alpha);
        });
        for (i = 0; i < n; ++i) {
          node = nodes[i];
          if (node.fx == null) node.x += node.vx *= velocityDecay;
          else node.x = node.fx, node.vx = 0;
          if (node.fy == null) node.y += node.vy *= velocityDecay;
          else node.y = node.fy, node.vy = 0;
        }
      }
      return simulation;
    }
    function initializeNodes() {
      for (var i = 0, n = nodes.length, node; i < n; ++i) {
        node = nodes[i], node.index = i;
        if (node.fx != null) node.x = node.fx;
        if (node.fy != null) node.y = node.fy;
        if (isNaN(node.x) || isNaN(node.y)) {
          var radius = initialRadius * Math.sqrt(0.5 + i), angle = i * initialAngle;
          node.x = radius * Math.cos(angle);
          node.y = radius * Math.sin(angle);
        }
        if (isNaN(node.vx) || isNaN(node.vy)) {
          node.vx = node.vy = 0;
        }
      }
    }
    function initializeForce(force) {
      if (force.initialize) force.initialize(nodes, random);
      return force;
    }
    initializeNodes();
    return simulation = {
      tick,
      restart: function() {
        return stepper.restart(step), simulation;
      },
      stop: function() {
        return stepper.stop(), simulation;
      },
      nodes: function(_) {
        return arguments.length ? (nodes = _, initializeNodes(), forces.forEach(initializeForce), simulation) : nodes;
      },
      alpha: function(_) {
        return arguments.length ? (alpha = +_, simulation) : alpha;
      },
      alphaMin: function(_) {
        return arguments.length ? (alphaMin = +_, simulation) : alphaMin;
      },
      alphaDecay: function(_) {
        return arguments.length ? (alphaDecay = +_, simulation) : +alphaDecay;
      },
      alphaTarget: function(_) {
        return arguments.length ? (alphaTarget = +_, simulation) : alphaTarget;
      },
      velocityDecay: function(_) {
        return arguments.length ? (velocityDecay = 1 - _, simulation) : 1 - velocityDecay;
      },
      randomSource: function(_) {
        return arguments.length ? (random = _, forces.forEach(initializeForce), simulation) : random;
      },
      force: function(name, _) {
        return arguments.length > 1 ? (_ == null ? forces.delete(name) : forces.set(name, initializeForce(_)), simulation) : forces.get(name);
      },
      find: function(x3, y3, radius) {
        var i = 0, n = nodes.length, dx, dy, d2, node, closest;
        if (radius == null) radius = Infinity;
        else radius *= radius;
        for (i = 0; i < n; ++i) {
          node = nodes[i];
          dx = x3 - node.x;
          dy = y3 - node.y;
          d2 = dx * dx + dy * dy;
          if (d2 < radius) closest = node, radius = d2;
        }
        return closest;
      },
      on: function(name, _) {
        return arguments.length > 1 ? (event.on(name, _), simulation) : event.on(name);
      }
    };
  }

  // node_modules/d3-force/src/manyBody.js
  function manyBody_default() {
    var nodes, node, random, alpha, strength = constant_default5(-30), strengths, distanceMin2 = 1, distanceMax2 = Infinity, theta2 = 0.81;
    function force(_) {
      var i, n = nodes.length, tree = quadtree(nodes, x2, y2).visitAfter(accumulate);
      for (alpha = _, i = 0; i < n; ++i) node = nodes[i], tree.visit(apply);
    }
    function initialize() {
      if (!nodes) return;
      var i, n = nodes.length, node2;
      strengths = new Array(n);
      for (i = 0; i < n; ++i) node2 = nodes[i], strengths[node2.index] = +strength(node2, i, nodes);
    }
    function accumulate(quad) {
      var strength2 = 0, q, c2, weight = 0, x3, y3, i;
      if (quad.length) {
        for (x3 = y3 = i = 0; i < 4; ++i) {
          if ((q = quad[i]) && (c2 = Math.abs(q.value))) {
            strength2 += q.value, weight += c2, x3 += c2 * q.x, y3 += c2 * q.y;
          }
        }
        quad.x = x3 / weight;
        quad.y = y3 / weight;
      } else {
        q = quad;
        q.x = q.data.x;
        q.y = q.data.y;
        do
          strength2 += strengths[q.data.index];
        while (q = q.next);
      }
      quad.value = strength2;
    }
    function apply(quad, x1, _, x22) {
      if (!quad.value) return true;
      var x3 = quad.x - node.x, y3 = quad.y - node.y, w = x22 - x1, l = x3 * x3 + y3 * y3;
      if (w * w / theta2 < l) {
        if (l < distanceMax2) {
          if (x3 === 0) x3 = jiggle_default(random), l += x3 * x3;
          if (y3 === 0) y3 = jiggle_default(random), l += y3 * y3;
          if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
          node.vx += x3 * quad.value * alpha / l;
          node.vy += y3 * quad.value * alpha / l;
        }
        return true;
      } else if (quad.length || l >= distanceMax2) return;
      if (quad.data !== node || quad.next) {
        if (x3 === 0) x3 = jiggle_default(random), l += x3 * x3;
        if (y3 === 0) y3 = jiggle_default(random), l += y3 * y3;
        if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
      }
      do
        if (quad.data !== node) {
          w = strengths[quad.data.index] * alpha / l;
          node.vx += x3 * w;
          node.vy += y3 * w;
        }
      while (quad = quad.next);
    }
    force.initialize = function(_nodes, _random) {
      nodes = _nodes;
      random = _random;
      initialize();
    };
    force.strength = function(_) {
      return arguments.length ? (strength = typeof _ === "function" ? _ : constant_default5(+_), initialize(), force) : strength;
    };
    force.distanceMin = function(_) {
      return arguments.length ? (distanceMin2 = _ * _, force) : Math.sqrt(distanceMin2);
    };
    force.distanceMax = function(_) {
      return arguments.length ? (distanceMax2 = _ * _, force) : Math.sqrt(distanceMax2);
    };
    force.theta = function(_) {
      return arguments.length ? (theta2 = _ * _, force) : Math.sqrt(theta2);
    };
    return force;
  }

  // node_modules/d3-zoom/src/constant.js
  var constant_default6 = (x3) => () => x3;

  // node_modules/d3-zoom/src/event.js
  function ZoomEvent(type2, {
    sourceEvent,
    target,
    transform: transform2,
    dispatch: dispatch2
  }) {
    Object.defineProperties(this, {
      type: { value: type2, enumerable: true, configurable: true },
      sourceEvent: { value: sourceEvent, enumerable: true, configurable: true },
      target: { value: target, enumerable: true, configurable: true },
      transform: { value: transform2, enumerable: true, configurable: true },
      _: { value: dispatch2 }
    });
  }

  // node_modules/d3-zoom/src/transform.js
  function Transform(k, x3, y3) {
    this.k = k;
    this.x = x3;
    this.y = y3;
  }
  Transform.prototype = {
    constructor: Transform,
    scale: function(k) {
      return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
    },
    translate: function(x3, y3) {
      return x3 === 0 & y3 === 0 ? this : new Transform(this.k, this.x + this.k * x3, this.y + this.k * y3);
    },
    apply: function(point) {
      return [point[0] * this.k + this.x, point[1] * this.k + this.y];
    },
    applyX: function(x3) {
      return x3 * this.k + this.x;
    },
    applyY: function(y3) {
      return y3 * this.k + this.y;
    },
    invert: function(location) {
      return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
    },
    invertX: function(x3) {
      return (x3 - this.x) / this.k;
    },
    invertY: function(y3) {
      return (y3 - this.y) / this.k;
    },
    rescaleX: function(x3) {
      return x3.copy().domain(x3.range().map(this.invertX, this).map(x3.invert, x3));
    },
    rescaleY: function(y3) {
      return y3.copy().domain(y3.range().map(this.invertY, this).map(y3.invert, y3));
    },
    toString: function() {
      return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
    }
  };
  var identity2 = new Transform(1, 0, 0);
  transform.prototype = Transform.prototype;
  function transform(node) {
    while (!node.__zoom) if (!(node = node.parentNode)) return identity2;
    return node.__zoom;
  }

  // node_modules/d3-zoom/src/noevent.js
  function nopropagation3(event) {
    event.stopImmediatePropagation();
  }
  function noevent_default3(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  // node_modules/d3-zoom/src/zoom.js
  function defaultFilter2(event) {
    return (!event.ctrlKey || event.type === "wheel") && !event.button;
  }
  function defaultExtent() {
    var e = this;
    if (e instanceof SVGElement) {
      e = e.ownerSVGElement || e;
      if (e.hasAttribute("viewBox")) {
        e = e.viewBox.baseVal;
        return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
      }
      return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
    }
    return [[0, 0], [e.clientWidth, e.clientHeight]];
  }
  function defaultTransform() {
    return this.__zoom || identity2;
  }
  function defaultWheelDelta(event) {
    return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 2e-3) * (event.ctrlKey ? 10 : 1);
  }
  function defaultTouchable2() {
    return navigator.maxTouchPoints || "ontouchstart" in this;
  }
  function defaultConstrain(transform2, extent, translateExtent) {
    var dx0 = transform2.invertX(extent[0][0]) - translateExtent[0][0], dx1 = transform2.invertX(extent[1][0]) - translateExtent[1][0], dy0 = transform2.invertY(extent[0][1]) - translateExtent[0][1], dy1 = transform2.invertY(extent[1][1]) - translateExtent[1][1];
    return transform2.translate(
      dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
      dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
    );
  }
  function zoom_default2() {
    var filter2 = defaultFilter2, extent = defaultExtent, constrain = defaultConstrain, wheelDelta = defaultWheelDelta, touchable = defaultTouchable2, scaleExtent = [0, Infinity], translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]], duration = 250, interpolate = zoom_default, listeners = dispatch_default("start", "zoom", "end"), touchstarting, touchfirst, touchending, touchDelay = 500, wheelDelay = 150, clickDistance2 = 0, tapDistance = 10;
    function zoom(selection2) {
      selection2.property("__zoom", defaultTransform).on("wheel.zoom", wheeled, { passive: false }).on("mousedown.zoom", mousedowned).on("dblclick.zoom", dblclicked).filter(touchable).on("touchstart.zoom", touchstarted).on("touchmove.zoom", touchmoved).on("touchend.zoom touchcancel.zoom", touchended).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
    }
    zoom.transform = function(collection, transform2, point, event) {
      var selection2 = collection.selection ? collection.selection() : collection;
      selection2.property("__zoom", defaultTransform);
      if (collection !== selection2) {
        schedule(collection, transform2, point, event);
      } else {
        selection2.interrupt().each(function() {
          gesture(this, arguments).event(event).start().zoom(null, typeof transform2 === "function" ? transform2.apply(this, arguments) : transform2).end();
        });
      }
    };
    zoom.scaleBy = function(selection2, k, p, event) {
      zoom.scaleTo(selection2, function() {
        var k0 = this.__zoom.k, k1 = typeof k === "function" ? k.apply(this, arguments) : k;
        return k0 * k1;
      }, p, event);
    };
    zoom.scaleTo = function(selection2, k, p, event) {
      zoom.transform(selection2, function() {
        var e = extent.apply(this, arguments), t0 = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p, p1 = t0.invert(p0), k1 = typeof k === "function" ? k.apply(this, arguments) : k;
        return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
      }, p, event);
    };
    zoom.translateBy = function(selection2, x3, y3, event) {
      zoom.transform(selection2, function() {
        return constrain(this.__zoom.translate(
          typeof x3 === "function" ? x3.apply(this, arguments) : x3,
          typeof y3 === "function" ? y3.apply(this, arguments) : y3
        ), extent.apply(this, arguments), translateExtent);
      }, null, event);
    };
    zoom.translateTo = function(selection2, x3, y3, p, event) {
      zoom.transform(selection2, function() {
        var e = extent.apply(this, arguments), t = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
        return constrain(identity2.translate(p0[0], p0[1]).scale(t.k).translate(
          typeof x3 === "function" ? -x3.apply(this, arguments) : -x3,
          typeof y3 === "function" ? -y3.apply(this, arguments) : -y3
        ), e, translateExtent);
      }, p, event);
    };
    function scale(transform2, k) {
      k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
      return k === transform2.k ? transform2 : new Transform(k, transform2.x, transform2.y);
    }
    function translate(transform2, p0, p1) {
      var x3 = p0[0] - p1[0] * transform2.k, y3 = p0[1] - p1[1] * transform2.k;
      return x3 === transform2.x && y3 === transform2.y ? transform2 : new Transform(transform2.k, x3, y3);
    }
    function centroid(extent2) {
      return [(+extent2[0][0] + +extent2[1][0]) / 2, (+extent2[0][1] + +extent2[1][1]) / 2];
    }
    function schedule(transition2, transform2, point, event) {
      transition2.on("start.zoom", function() {
        gesture(this, arguments).event(event).start();
      }).on("interrupt.zoom end.zoom", function() {
        gesture(this, arguments).event(event).end();
      }).tween("zoom", function() {
        var that = this, args = arguments, g = gesture(that, args).event(event), e = extent.apply(that, args), p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point, w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]), a2 = that.__zoom, b = typeof transform2 === "function" ? transform2.apply(that, args) : transform2, i = interpolate(a2.invert(p).concat(w / a2.k), b.invert(p).concat(w / b.k));
        return function(t) {
          if (t === 1) t = b;
          else {
            var l = i(t), k = w / l[2];
            t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k);
          }
          g.zoom(null, t);
        };
      });
    }
    function gesture(that, args, clean) {
      return !clean && that.__zooming || new Gesture(that, args);
    }
    function Gesture(that, args) {
      this.that = that;
      this.args = args;
      this.active = 0;
      this.sourceEvent = null;
      this.extent = extent.apply(that, args);
      this.taps = 0;
    }
    Gesture.prototype = {
      event: function(event) {
        if (event) this.sourceEvent = event;
        return this;
      },
      start: function() {
        if (++this.active === 1) {
          this.that.__zooming = this;
          this.emit("start");
        }
        return this;
      },
      zoom: function(key, transform2) {
        if (this.mouse && key !== "mouse") this.mouse[1] = transform2.invert(this.mouse[0]);
        if (this.touch0 && key !== "touch") this.touch0[1] = transform2.invert(this.touch0[0]);
        if (this.touch1 && key !== "touch") this.touch1[1] = transform2.invert(this.touch1[0]);
        this.that.__zoom = transform2;
        this.emit("zoom");
        return this;
      },
      end: function() {
        if (--this.active === 0) {
          delete this.that.__zooming;
          this.emit("end");
        }
        return this;
      },
      emit: function(type2) {
        var d = select_default2(this.that).datum();
        listeners.call(
          type2,
          this.that,
          new ZoomEvent(type2, {
            sourceEvent: this.sourceEvent,
            target: zoom,
            type: type2,
            transform: this.that.__zoom,
            dispatch: listeners
          }),
          d
        );
      }
    };
    function wheeled(event, ...args) {
      if (!filter2.apply(this, arguments)) return;
      var g = gesture(this, args).event(event), t = this.__zoom, k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))), p = pointer_default(event);
      if (g.wheel) {
        if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
          g.mouse[1] = t.invert(g.mouse[0] = p);
        }
        clearTimeout(g.wheel);
      } else if (t.k === k) return;
      else {
        g.mouse = [p, t.invert(p)];
        interrupt_default(this);
        g.start();
      }
      noevent_default3(event);
      g.wheel = setTimeout(wheelidled, wheelDelay);
      g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));
      function wheelidled() {
        g.wheel = null;
        g.end();
      }
    }
    function mousedowned(event, ...args) {
      if (touchending || !filter2.apply(this, arguments)) return;
      var currentTarget = event.currentTarget, g = gesture(this, args, true).event(event), v = select_default2(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true), p = pointer_default(event, currentTarget), x0 = event.clientX, y0 = event.clientY;
      nodrag_default(event.view);
      nopropagation3(event);
      g.mouse = [p, this.__zoom.invert(p)];
      interrupt_default(this);
      g.start();
      function mousemoved(event2) {
        noevent_default3(event2);
        if (!g.moved) {
          var dx = event2.clientX - x0, dy = event2.clientY - y0;
          g.moved = dx * dx + dy * dy > clickDistance2;
        }
        g.event(event2).zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = pointer_default(event2, currentTarget), g.mouse[1]), g.extent, translateExtent));
      }
      function mouseupped(event2) {
        v.on("mousemove.zoom mouseup.zoom", null);
        yesdrag(event2.view, g.moved);
        noevent_default3(event2);
        g.event(event2).end();
      }
    }
    function dblclicked(event, ...args) {
      if (!filter2.apply(this, arguments)) return;
      var t0 = this.__zoom, p0 = pointer_default(event.changedTouches ? event.changedTouches[0] : event, this), p1 = t0.invert(p0), k1 = t0.k * (event.shiftKey ? 0.5 : 2), t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, args), translateExtent);
      noevent_default3(event);
      if (duration > 0) select_default2(this).transition().duration(duration).call(schedule, t1, p0, event);
      else select_default2(this).call(zoom.transform, t1, p0, event);
    }
    function touchstarted(event, ...args) {
      if (!filter2.apply(this, arguments)) return;
      var touches = event.touches, n = touches.length, g = gesture(this, args, event.changedTouches.length === n).event(event), started, i, t, p;
      nopropagation3(event);
      for (i = 0; i < n; ++i) {
        t = touches[i], p = pointer_default(t, this);
        p = [p, this.__zoom.invert(p), t.identifier];
        if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
        else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
      }
      if (touchstarting) touchstarting = clearTimeout(touchstarting);
      if (started) {
        if (g.taps < 2) touchfirst = p[0], touchstarting = setTimeout(function() {
          touchstarting = null;
        }, touchDelay);
        interrupt_default(this);
        g.start();
      }
    }
    function touchmoved(event, ...args) {
      if (!this.__zooming) return;
      var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t, p, l;
      noevent_default3(event);
      for (i = 0; i < n; ++i) {
        t = touches[i], p = pointer_default(t, this);
        if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;
        else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
      }
      t = g.that.__zoom;
      if (g.touch1) {
        var p0 = g.touch0[0], l0 = g.touch0[1], p1 = g.touch1[0], l1 = g.touch1[1], dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp, dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
        t = scale(t, Math.sqrt(dp / dl));
        p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
        l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
      } else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
      else return;
      g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
    }
    function touchended(event, ...args) {
      if (!this.__zooming) return;
      var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t;
      nopropagation3(event);
      if (touchending) clearTimeout(touchending);
      touchending = setTimeout(function() {
        touchending = null;
      }, touchDelay);
      for (i = 0; i < n; ++i) {
        t = touches[i];
        if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
        else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
      }
      if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
      if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
      else {
        g.end();
        if (g.taps === 2) {
          t = pointer_default(t, this);
          if (Math.hypot(touchfirst[0] - t[0], touchfirst[1] - t[1]) < tapDistance) {
            var p = select_default2(this).on("dblclick.zoom");
            if (p) p.apply(this, arguments);
          }
        }
      }
    }
    zoom.wheelDelta = function(_) {
      return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : constant_default6(+_), zoom) : wheelDelta;
    };
    zoom.filter = function(_) {
      return arguments.length ? (filter2 = typeof _ === "function" ? _ : constant_default6(!!_), zoom) : filter2;
    };
    zoom.touchable = function(_) {
      return arguments.length ? (touchable = typeof _ === "function" ? _ : constant_default6(!!_), zoom) : touchable;
    };
    zoom.extent = function(_) {
      return arguments.length ? (extent = typeof _ === "function" ? _ : constant_default6([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom) : extent;
    };
    zoom.scaleExtent = function(_) {
      return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom) : [scaleExtent[0], scaleExtent[1]];
    };
    zoom.translateExtent = function(_) {
      return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
    };
    zoom.constrain = function(_) {
      return arguments.length ? (constrain = _, zoom) : constrain;
    };
    zoom.duration = function(_) {
      return arguments.length ? (duration = +_, zoom) : duration;
    };
    zoom.interpolate = function(_) {
      return arguments.length ? (interpolate = _, zoom) : interpolate;
    };
    zoom.on = function() {
      var value = listeners.on.apply(listeners, arguments);
      return value === listeners ? zoom : value;
    };
    zoom.clickDistance = function(_) {
      return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom) : Math.sqrt(clickDistance2);
    };
    zoom.tapDistance = function(_) {
      return arguments.length ? (tapDistance = +_, zoom) : tapDistance;
    };
    return zoom;
  }

  // src/graphs/GraphRenderer.js
  var GraphRenderer = class {
    /**
     * @param {HTMLElement} container - The container element to render the graph in
     */
    constructor(container) {
      this.container = container;
      this.width = container.clientWidth;
      this.height = container.clientHeight;
      this.svg = null;
      this.nodes = null;
      this.links = null;
      this.labels = null;
      this.simulation = null;
      this.updateLabelVisibility = null;
      this.updateNodeVisibility = null;
      this.currentZoomScale = 1;
    }
    /**
     * Initialize the renderer
     */
    initialize() {
      if (!this.svg) {
        this.svg = select_default2(this.container).append("svg").attr("width", this.width).attr("height", this.height);
      }
      this.simulation = this.createSimulation();
      this._addResizeHandler();
      return this;
    }
    /**
     * Handle container resize
     */
    _handleResize(width, height) {
      this.width = width;
      this.height = height;
      if (this.svg) {
        this.svg.attr("width", this.width).attr("height", this.height);
      }
      if (this.simulation) {
        const centerX = this.width / 2;
        this.simulation.force("center").x(centerX).y(this.height / 2);
        this.simulation.alpha(1).restart();
      }
    }
    /**
     * Create a D3 force simulation
     * @returns {d3.Simulation} The created simulation
     */
    createSimulation() {
      return simulation_default().force("link", link_default().id((d) => d.id).distance(150)).force("charge", manyBody_default().strength(-400)).force("center", center_default(this.width / 2, this.height / 2)).force("collide", collide_default().radius((d) => d.size * 2));
    }
    /**
     * Render the graph with the given data
     * @param {Object} graphData - Object with nodes and links arrays
     * @param {Function} onNodeHover - Function to call when a node is hovered
     * @param {Function} onNodeDoubleClick - Function to call when a node is double-clicked
     */
    render(graphData, onNodeHover, onNodeDoubleClick) {
      if (this.svg) {
        this.svg.selectAll("g").remove();
      } else {
        this.initialize();
      }
      this.links = this.svg.append("g").selectAll("line").data(graphData.links).enter().append("line").attr("stroke", "#E0E0E0").attr("stroke-width", 1).attr("opacity", 0.6);
      this.nodes = this.svg.append("g").selectAll("circle").data(graphData.nodes).enter().append("circle").attr("r", (d) => d.size).attr("fill", (d) => d.color).attr("stroke", "#fff").attr("stroke-width", 1.5);
      this.labels = this.svg.append("g").selectAll("text").data(graphData.nodes).enter().append("text").text((d) => d.label).attr("font-size", (d) => d.qualityType === "property" || d.id === "quality-root" ? Math.max(10, d.size * 0.45) : 10).attr("text-anchor", (d) => d.id === "quality-root" || d.qualityType === "property" ? "middle" : "start").attr("dominant-baseline", (d) => d.id === "quality-root" || d.qualityType === "property" ? "middle" : "auto").attr("dx", (d) => {
        if (d.id === "quality-root" || d.qualityType === "property") {
          return 0;
        } else {
          return d.size + 5;
        }
      }).attr("dy", (d) => d.id === "quality-root" || d.qualityType === "property" ? 0 : 4);
      this.setupZoom();
      this.setupDrag();
      if (onNodeHover) {
        this.nodes.on("mouseenter", onNodeHover);
        this.nodes.on("mouseleave", (event, d) => {
          this.nodes.each(function(node) {
            node.highlighted = false;
            node.connectedHighlighted = false;
          });
          this.highlightNode(d.id, false, null);
        });
        const internalLabels = this.labels.filter((d) => d.id === "quality-root" || d.qualityType === "property");
        internalLabels.on("mouseenter", onNodeHover);
        internalLabels.on("mouseleave", (event, d) => {
          this.nodes.each(function(node) {
            node.highlighted = false;
            node.connectedHighlighted = false;
          });
          this.highlightNode(d.id, false, null);
        });
      }
      if (onNodeDoubleClick) {
        this.nodes.on("dblclick", onNodeDoubleClick);
      }
      graphData.nodes.forEach((node) => {
        node.x = node.x !== void 0 ? node.x + this.width / 2 : this.width / 2;
        node.y = node.y !== void 0 ? node.y + this.height / 2 : this.height / 2;
      });
      this.simulation.nodes(graphData.nodes).on("tick", this.handleTick.bind(this));
      this.simulation.force("link").links(graphData.links);
      this.updateLabelVisibility = this.createLabelVisibilityUpdater(this.labels, this.currentZoomScale);
      this.updateNodeVisibility = this.createNodeVisibilityUpdater(this.nodes, this.currentZoomScale);
      this.updateLabelVisibility();
      this.updateNodeVisibility();
      return this;
    }
    /**
     * Handle simulation tick
     */
    handleTick() {
      requestAnimationFrame(() => {
        if (this.links) {
          this.links.attr("x1", (d) => d.source.x).attr("y1", (d) => d.source.y).attr("x2", (d) => d.target.x).attr("y2", (d) => d.target.y);
        }
        if (this.nodes) {
          this.nodes.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
        }
        if (this.labels) {
          this.labels.attr("x", (d) => d.x).attr("y", (d) => d.y);
        }
      });
    }
    /**
     * Setup zoom behavior
     */
    setupZoom() {
      const zoom = zoom_default2().on("zoom", (event) => {
        this.svg.selectAll("g").attr("transform", event.transform);
        this.currentZoomScale = event.transform.k;
        if (this.updateLabelVisibility) {
          this.updateLabelVisibility(this.currentZoomScale);
        }
        if (this.updateNodeVisibility) {
          this.updateNodeVisibility(this.currentZoomScale);
        }
      });
      this.svg.call(zoom);
      const sidebarWidth = 200;
      const initialTransform = identity2.translate(sidebarWidth / 2, 0);
      this.svg.call(zoom.transform, initialTransform);
    }
    /**
     * Setup drag behavior
     */
    setupDrag() {
      const dragBehavior = drag_default().on("start", (event, d) => {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }).on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      }).on("end", (event, _) => {
        if (!event.active) this.simulation.alphaTarget(0);
      });
      this.nodes.call(dragBehavior);
      this.labels.filter((d) => d.id === "quality-root" || d.qualityType === "property").call(dragBehavior);
    }
    /**
     * Highlight nodes and their connections
     * @param {string} nodeId - ID of the node to highlight
     * @param {boolean} highlight - Whether to highlight or unhighlight
     * @param {Set} [providedConnectedNodes] - Optional Set of connected node IDs
     */
    highlightNode(nodeId, highlight = true, providedConnectedNodes = null) {
      if (!this.nodes || !this.links || !this.labels) return;
      this.nodes.filter((d) => d.id === nodeId).classed("highlighted", highlight);
      const connectedNodes = providedConnectedNodes || (() => {
        const nodes = /* @__PURE__ */ new Set();
        this.links.each(function(d) {
          if (d.source.id === nodeId) nodes.add(d.target.id);
          if (d.target.id === nodeId) nodes.add(d.source.id);
        });
        return nodes;
      })();
      this.nodes.filter((d) => connectedNodes.has(d.id)).classed("connected-highlighted", highlight);
      this.labels.filter((d) => d.id === nodeId).classed("highlighted", highlight);
      this.labels.filter((d) => connectedNodes.has(d.id)).classed("connected-highlighted", highlight);
      this.links.filter((d) => d.source.id === nodeId || d.target.id === nodeId).classed("highlighted", highlight).attr("stroke", highlight ? "#941651" : "#E0E0E0").attr("stroke-width", highlight ? 2 : 1);
    }
    /**
     * Center the view on the visible nodes
     */
    centerView() {
      if (!this.svg || !this.nodes || this.nodes.size() === 0) return;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      this.nodes.each(function(d) {
        if (select_default2(this).style("display") !== "none") {
          minX = Math.min(minX, d.x);
          minY = Math.min(minY, d.y);
          maxX = Math.max(maxX, d.x);
          maxY = Math.max(maxY, d.y);
        }
      });
      if (minX === Infinity) return;
      const width = this.width;
      const height = this.height;
      const graphWidth = maxX - minX;
      const graphHeight = maxY - minY;
      const centerX = minX + graphWidth / 2;
      const centerY = minY + graphHeight / 2;
      const padding = 50;
      const scale = Math.min(
        0.9 * width / (graphWidth + padding),
        0.9 * height / (graphHeight + padding),
        3
        // Maximum zoom level
      );
      const transform2 = identity2.translate(width / 2, height / 2).scale(scale).translate(-centerX, -centerY);
      this.svg.transition().duration(750).call(zoom_default2().transform, transform2);
      this.currentZoomScale = scale;
      if (this.updateLabelVisibility) {
        this.updateLabelVisibility(this.currentZoomScale);
      }
      if (this.updateNodeVisibility) {
        this.updateNodeVisibility(this.currentZoomScale);
      }
    }
    /**
     * Get the renderer components
     * @returns {Object} Object with nodes, links, labels, and simulation
     */
    getComponents() {
      return {
        nodes: this.nodes,
        links: this.links,
        labels: this.labels,
        simulation: this.simulation
      };
    }
    /**
     * Clear the renderer
     */
    clear() {
      if (this.svg) {
        this.svg.selectAll("*").remove();
      }
      this.nodes = null;
      this.links = null;
      this.labels = null;
      this.simulation = null;
    }
    /**
     * Creates a function to update node visibility and detail based on zoom level
     *
     * @param {d3.Selection} node - Node selection
     * @param {number} initialZoomScale - Initial zoom scale
     * @returns {Function} Function to update node visibility and detail
     */
    createNodeVisibilityUpdater(node, initialZoomScale) {
      let currentZoomScale = initialZoomScale;
      return (nodeData) => {
        if (nodeData) {
          if (nodeData.id === "quality-root" || nodeData.qualityType === "property" || nodeData.qualityType === "requirement") {
            return {
              visible: true,
              size: nodeData.size,
              opacity: 1,
              strokeWidth: 1.5
            };
          }
          const visibilityThreshold = 0.4 / (nodeData.size / 10);
          const isHighlighted = nodeData.highlighted || nodeData.connectedHighlighted;
          if (!isHighlighted && currentZoomScale < visibilityThreshold) {
            return { visible: false };
          }
          const sizeFactor = Math.min(1, Math.max(0.5, currentZoomScale / 1.5));
          const strokeWidth = Math.min(1.5, Math.max(0.5, currentZoomScale / 1.5));
          if (isHighlighted) {
            return {
              visible: true,
              size: nodeData.size,
              opacity: 1,
              strokeWidth: 1.5
            };
          }
          return {
            visible: true,
            size: nodeData.size * sizeFactor,
            opacity: Math.min(1, Math.max(0.6, currentZoomScale / 1.2)),
            strokeWidth
          };
        } else {
          if (typeof arguments[0] === "number") {
            currentZoomScale = arguments[0];
          }
          node.each(function(d) {
            const nodeElement = select_default2(this);
            if (d.id === "quality-root" || d.qualityType === "property" || d.qualityType === "requirement") {
              nodeElement.style("display", null);
              nodeElement.attr("opacity", 1);
              nodeElement.attr("r", d.size);
              nodeElement.attr("stroke-width", 1.5);
              return;
            }
            const visibilityThreshold = 0.4 / (d.size / 10);
            const isHighlighted = d.highlighted || d.connectedHighlighted;
            if (!isHighlighted && currentZoomScale < visibilityThreshold) {
              nodeElement.style("display", "none");
              nodeElement.attr("opacity", 0);
              return;
            }
            const sizeFactor = Math.min(1, Math.max(0.5, currentZoomScale / 1.5));
            const strokeWidth = Math.min(1.5, Math.max(0.5, currentZoomScale / 1.5));
            if (isHighlighted) {
              nodeElement.style("display", null);
              nodeElement.attr("opacity", 1);
              nodeElement.attr("r", d.size);
              nodeElement.attr("stroke-width", 1.5);
              return;
            }
            nodeElement.style("display", null);
            nodeElement.attr("opacity", Math.min(1, Math.max(0.6, currentZoomScale / 1.2)));
            nodeElement.attr("r", d.size * sizeFactor);
            nodeElement.attr("stroke-width", strokeWidth);
          });
        }
      };
    }
    /**
     * Creates a function to update label visibility based on zoom level
     *
     * @param {d3.Selection} label - Label selection
     * @param {number} initialZoomScale - Initial zoom scale
     * @returns {Function} Function to update label visibility
     */
    createLabelVisibilityUpdater(label, initialZoomScale) {
      let currentZoomScale = initialZoomScale;
      return (nodeData) => {
        if (nodeData) {
          if (nodeData.id === "quality-root" || nodeData.qualityType === "property") {
            return 1;
          }
          const visibilityThreshold = nodeData.qualityType === "quality" || nodeData.qualityType === "requirement" ? 1.2 / (nodeData.size / 10) : 0.8 / (nodeData.size / 10);
          const isHighlighted = nodeData.highlighted || nodeData.connectedHighlighted;
          return isHighlighted || currentZoomScale > visibilityThreshold ? 1 : 0;
        } else {
          if (typeof arguments[0] === "number") {
            currentZoomScale = arguments[0];
          }
          label.each(function(d) {
            const labelElement = select_default2(this);
            if (d.id === "quality-root" || d.qualityType === "property") {
              labelElement.attr("opacity", 1);
              labelElement.attr("font-weight", "bold");
              return;
            }
            const visibilityThreshold = d.qualityType === "quality" || d.qualityType === "requirement" ? 1.2 / (d.size / 10) : 0.8 / (d.size / 10);
            const isHighlighted = d.highlighted || d.connectedHighlighted;
            const opacity = isHighlighted || currentZoomScale > visibilityThreshold ? 1 : 0;
            labelElement.attr("opacity", opacity);
            if (opacity === 0 && !isHighlighted) {
              labelElement.style("display", "none");
            } else {
              labelElement.style("display", "default");
            }
          });
        }
      };
    }
    _addResizeHandler() {
      new ResizeObserver((entries) => {
        const rect = entries[0].contentRect;
        this._handleResize(rect.width, rect.height);
      }).observe(this.container);
    }
  };

  // src/graphs/Graph.js
  var Graph2 = class {
    /**
     * @param {string} containerId - ID of the container element
     * @param {string} name - Graph name (home or fullpage)
     * @param {GraphDataProvider} dataProvider - Data provider instance
     */
    constructor(containerId, name, dataProvider2) {
      this.containerId = containerId;
      this.name = name;
      this.dataProvider = dataProvider2;
      this.container = document.getElementById(containerId);
      this.graph = new MultiGraph();
      this.renderer = new GraphRenderer(this.container);
      this.eventHandlers = {};
    }
    /**
     * Initialize the graph
     * @returns {Graph} This graph instance for chaining
     */
    initialize() {
      this.graph.setAttribute("name", this.name);
      this.graph.setAttribute("qualityType", "q42");
      this.renderer.initialize();
      return this;
    }
    /**
     * Build the graph structure from data
     * @returns {HomeGraph} This graph instance for chaining
     */
    buildGraph() {
      const { propertyNodes, nodes, edges } = this.dataProvider.getData();
      try {
        this.createRootNode("Quality", 50, "#ebebeb");
        this.createNodes(propertyNodes);
        this.createNodes(nodes);
        this.createEdges(edges);
        this.applyEnhancedRadialLayout("quality-root", 250);
      } catch (error) {
        console.error("Could not build graph", { cause: error });
      }
      return this;
    }
    /**
     * Creates the root node of the graph
     * @param {string} label - Label for the root node
     * @param {number} size - Size of the root node
     * @param {string} color - Color of the root node
     */
    createRootNode(label, size, color2) {
      this.graph.addNode("quality-root", {
        label,
        size,
        x: 0,
        y: 0,
        color: color2
      });
    }
    /**
     * Creates node elements
     * @param {{id: string, label: string, size: number, color: string, qualityType: string, page: string}[]} nodes - Array of node data
     */
    createNodes(nodes) {
      nodes.forEach(
        (node) => this.graph.addNode(node.id, {
          label: node.label,
          size: node.size,
          color: node.color,
          qualityType: node.qualityType,
          page: node.page
        })
      );
    }
    /**
     * Creates edges between nodes
     * @param {{source: string, target: string}[]} edges - Array of edge data
     */
    createEdges(edges) {
      edges.forEach((edge) => this.graph.addEdge(edge.source, edge.target));
    }
    /**
     * Creates an enhanced radial hierarchical layout that handles interconnected nodes
     *
     * @param {string} rootId - ID of the root node
     * @param {number} levelRadius - Base radius between hierarchy levels
     */
    applyEnhancedRadialLayout(rootId, levelRadius = 150) {
      this.graph.updateNodeAttributes(rootId, (attr) => ({
        ...attr,
        x: 0,
        y: 0,
        hierarchyLevel: 1
      }));
      const propertyNodes = this.graph.inNeighbors(rootId).filter((n) => this.graph.getNodeAttribute(n, "qualityType") === "property");
      const propertyAngleStep = 2 * Math.PI / propertyNodes.length;
      propertyNodes.forEach((propNode, i) => {
        const angle = i * propertyAngleStep;
        const x3 = levelRadius * Math.cos(angle);
        const y3 = levelRadius * Math.sin(angle);
        this.graph.updateNodeAttributes(propNode, (attr) => ({
          ...attr,
          x: x3,
          y: y3,
          angle,
          hierarchyLevel: 2
        }));
      });
      const qualityNodes = /* @__PURE__ */ new Set();
      const propertyConnections = /* @__PURE__ */ new Map();
      propertyNodes.forEach((propNode) => {
        this.graph.inNeighbors(propNode).forEach((n) => {
          if (this.graph.getNodeAttribute(n, "qualityType") === "quality") {
            qualityNodes.add(n);
            if (!propertyConnections.has(n)) {
              propertyConnections.set(n, []);
            }
            propertyConnections.get(n).push(propNode);
          }
        });
      });
      const qualityNodesByConnections = /* @__PURE__ */ new Map();
      propertyConnections.forEach((connections, qualityNode) => {
        const count = connections.length;
        if (!qualityNodesByConnections.has(count)) {
          qualityNodesByConnections.set(count, []);
        }
        qualityNodesByConnections.get(count).push({
          id: qualityNode,
          connections
        });
      });
      if (qualityNodesByConnections.has(1)) {
        const singleConnNodes = qualityNodesByConnections.get(1);
        const nodesByProperty = /* @__PURE__ */ new Map();
        singleConnNodes.forEach(({ id: id2, connections }) => {
          const propId = connections[0];
          if (!nodesByProperty.has(propId)) {
            nodesByProperty.set(propId, []);
          }
          nodesByProperty.get(propId).push(id2);
        });
        nodesByProperty.forEach((nodes, propId) => {
          const propX = this.graph.getNodeAttribute(propId, "x");
          const propY = this.graph.getNodeAttribute(propId, "y");
          const propAngle = this.graph.getNodeAttribute(propId, "angle");
          const qualityRadius = levelRadius;
          const angleStep = Math.PI / 1.5 / (nodes.length + 1);
          nodes.forEach((nodeId, i) => {
            const angle = propAngle - Math.PI / 4 + (i + 1) * angleStep;
            const x3 = propX + qualityRadius * Math.cos(angle);
            const y3 = propY + qualityRadius * Math.sin(angle);
            this.graph.updateNodeAttributes(nodeId, (attr) => ({
              ...attr,
              x: x3,
              y: y3,
              hierarchyLevel: 3
            }));
          });
        });
      }
      for (let connCount = 2; connCount <= propertyNodes.length; connCount++) {
        if (qualityNodesByConnections.has(connCount)) {
          const multiConnNodes = qualityNodesByConnections.get(connCount);
          multiConnNodes.forEach(({ id: id2, connections }) => {
            let avgX = 0, avgY = 0;
            connections.forEach((propId) => {
              avgX += this.graph.getNodeAttribute(propId, "x");
              avgY += this.graph.getNodeAttribute(propId, "y");
            });
            avgX /= connections.length;
            avgY /= connections.length;
            const distFromCenter = Math.sqrt(avgX * avgX + avgY * avgY);
            const radius = distFromCenter + levelRadius * 0.8;
            if (distFromCenter > 0) {
              const factor = radius / distFromCenter;
              avgX *= factor;
              avgY *= factor;
            }
            this.graph.updateNodeAttributes(id2, (attr) => ({
              ...attr,
              x: avgX,
              y: avgY,
              hierarchyLevel: 3
            }));
          });
        }
      }
      const reqNodes = /* @__PURE__ */ new Set();
      qualityNodes.forEach((qualityNode) => {
        this.graph.inNeighbors(qualityNode).forEach((n) => {
          if (this.graph.getNodeAttribute(n, "qualityType") === "requirement") {
            reqNodes.add(n);
          }
        });
      });
      if (reqNodes.size > 0) {
        const reqByQuality = /* @__PURE__ */ new Map();
        reqNodes.forEach((reqId) => {
          const parents = this.graph.outNeighbors(reqId).filter((n) => this.graph.getNodeAttribute(n, "qualityType") === "quality");
          if (parents.length > 0) {
            const mainParent = parents[0];
            if (!reqByQuality.has(mainParent)) {
              reqByQuality.set(mainParent, []);
            }
            reqByQuality.get(mainParent).push(reqId);
          }
        });
        reqByQuality.forEach((reqs, qualityId) => {
          const qualityX = this.graph.getNodeAttribute(qualityId, "x");
          const qualityY = this.graph.getNodeAttribute(qualityId, "y");
          const angleToCenter = Math.atan2(qualityY, qualityX);
          const reqRadius = levelRadius * 0.7;
          const reqAngleStep = Math.PI / (reqs.length + 1);
          reqs.forEach((reqId, i) => {
            const angle = angleToCenter + Math.PI - reqAngleStep * (reqs.length / 2) + reqAngleStep * (i + 1);
            const x3 = qualityX + reqRadius * Math.cos(angle);
            const y3 = qualityY + reqRadius * Math.sin(angle);
            this.graph.updateNodeAttributes(reqId, (attr) => ({
              ...attr,
              x: x3,
              y: y3,
              hierarchyLevel: 4
            }));
          });
        });
      }
      this._adjustNodeOverlaps(30);
    }
    /**
     * Adjust node positions to minimize overlaps
     * @private
     * @param {number} minDistance - Minimum distance between nodes
     */
    _adjustNodeOverlaps(minDistance) {
      const iterations = 50;
      const nodePositions = [];
      const initNodePositions = () => {
        this.graph.forEachNode((nodeId, attrs) => {
          const qualityType = attrs.qualityType;
          let nodeDist = minDistance;
          if (qualityType === "quality") {
            nodeDist = minDistance * 1.5;
          }
          nodePositions.push({
            id: nodeId,
            x: attrs.x,
            y: attrs.y,
            level: attrs.hierarchyLevel || 1,
            fixed: nodeId === "quality-root",
            qualityType,
            minDist: nodeDist
          });
        });
      };
      const computeNodeShift = (nodeA, i) => {
        if (nodeA.fixed) return { dx: 0, dy: 0, moved: false };
        let dx = 0, dy = 0, moved = false;
        for (let j = 0; j < nodePositions.length; j++) {
          if (i === j) continue;
          const nodeB = nodePositions[j];
          const repulsion = this._computeRepulsion(nodeA, nodeB);
          dx += repulsion.dx;
          dy += repulsion.dy;
          if (repulsion.moved) moved = true;
        }
        return { dx, dy, moved };
      };
      initNodePositions();
      for (let iter = 0; iter < iterations; iter++) {
        let moved = false;
        for (let i = 0; i < nodePositions.length; i++) {
          const nodeA = nodePositions[i];
          const { dx, dy, moved: nodeMoved } = computeNodeShift(nodeA, i);
          if (dx !== 0 || dy !== 0) {
            nodeA.x += dx;
            nodeA.y += dy;
          }
          if (nodeMoved) moved = true;
          this._adjustDistanceFromCenter(nodeA, minDistance);
        }
        if (!moved) break;
      }
      nodePositions.forEach(({ id: id2, x: x3, y: y3 }) => {
        this.graph.updateNodeAttributes(id2, (attrs) => ({
          ...attrs,
          x: x3,
          y: y3
        }));
      });
    }
    /**
     * Compute the force of repulsion between two nodes
     * @private
     * @param {Object} nodeA - First node
     * @param {Object} nodeB - Second node
     * @returns {Object} - Object with dx, dy, and moved properties
     */
    _computeRepulsion(nodeA, nodeB) {
      const xDiff = nodeA.x - nodeB.x;
      const yDiff = nodeA.y - nodeB.y;
      const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
      const effectiveMinDist = Math.max(nodeA.minDist, nodeB.minDist);
      if (distance > 0 && distance < effectiveMinDist) {
        let forceMultiplier = nodeA.qualityType === "quality" ? 0.15 : 0.1;
        const force = (effectiveMinDist - distance) / distance;
        return {
          dx: xDiff * force * forceMultiplier,
          dy: yDiff * force * forceMultiplier,
          moved: true
        };
      }
      return { dx: 0, dy: 0, moved: false };
    }
    /**
     * Keep nodes at a distance from the center based on their hierarchy level
     * @private
     * @param {Object} node - Node to adjust
     * @param {number} minDistance - Minimum distance between nodes
     */
    _adjustDistanceFromCenter(node, minDistance) {
      const distFromCenter = Math.sqrt(node.x * node.x + node.y * node.y);
      const targetDist = (node.level - 1) * minDistance * 3;
      if (Math.abs(distFromCenter - targetDist) > minDistance * 0.5) {
        const angle = Math.atan2(node.y, node.x);
        node.x = targetDist * Math.cos(angle);
        node.y = targetDist * Math.sin(angle);
      }
    }
    /**
     * Prepare graph data for D3
     * @returns {Object} Object with nodes and links arrays
     */
    prepareGraphData() {
      const graphData = {
        nodes: [],
        links: []
      };
      this.graph.forEachNode((nodeId, attrs) => {
        if (!attrs.hidden) {
          graphData.nodes.push({
            id: nodeId,
            ...attrs,
            size: attrs.size
          });
        }
      });
      this.graph.forEachEdge((edgeId, attrs, source, target) => {
        if (!this.graph.getNodeAttribute(source, "hidden") && !this.graph.getNodeAttribute(target, "hidden")) {
          graphData.links.push({
            id: edgeId,
            source,
            target,
            ...attrs
          });
        }
      });
      return graphData;
    }
    /**
     * Render the graph
     * @returns {Graph} This graph instance for chaining
     */
    render() {
      const graphData = this.prepareGraphData();
      this.renderer.render(
        graphData,
        this.eventHandlers.nodeHover,
        this.eventHandlers.nodeDoubleClick
      );
      return this;
    }
    /**
     * Register event handlers
     * @param {Object} handlers - Object with event handler functions
     * @returns {Graph} This graph instance for chaining
     */
    registerEventHandlers(handlers) {
      this.eventHandlers = { ...this.eventHandlers, ...handlers };
      return this;
    }
    /**
     * Filter the graph data and re-render
     * @param {string} filterTerm - The search term to filter by
     * @returns {Graph} This graph instance for chaining
     */
    filter(filterTerm) {
      this.dataProvider.filterByTerm(filterTerm);
      this.graph = new MultiGraph();
      this.graph.setAttribute("name", this.name);
      this.graph.setAttribute("qualityType", "q42");
      this.buildGraph();
      this.render();
      if (this.renderer.simulation) {
        this.renderer.simulation.alpha(1).alphaTarget(0.3).restart();
        this.renderer.centerView();
        setTimeout(() => {
          this.renderer.simulation.alphaTarget(0);
          this.renderer.centerView();
        }, 1e3);
      }
      return this;
    }
    /**
     * Reset the filter and re-render the graph
     * @returns {Graph} This graph instance for chaining
     */
    resetFilter() {
      this.dataProvider.resetFilter();
      this.graph = new MultiGraph();
      this.graph.setAttribute("name", this.name);
      this.graph.setAttribute("qualityType", "q42");
      this.buildGraph();
      this.render();
      if (this.renderer.simulation) {
        this.renderer.simulation.alpha(1).alphaTarget(0.3).restart();
        this.renderer.centerView();
        setTimeout(() => {
          this.renderer.simulation.alphaTarget(0);
          this.renderer.centerView();
        }, 1e3);
      }
      return this;
    }
    /**
     * Get the graph instance
     * @returns {MultiGraph} The graph instance
     */
    getGraph() {
      return this.graph;
    }
    /**
     * Get the renderer instance
     * @returns {GraphRenderer} The renderer instance
     */
    getRenderer() {
      return this.renderer;
    }
  };

  // src/graphs/FullGraph.js
  var FullGraph = class extends Graph2 {
    /**
     * @param {string} containerId - ID of the container element
     * @param {GraphDataProvider} dataProvider - Data provider instance
     */
    constructor(containerId, dataProvider2) {
      super(containerId, "fullpage", dataProvider2);
      this.filterInput = document.getElementById("full-q-graph-filter__input");
      this.filterButton = document.getElementById("full-q-graph-filter__btn");
      this.debounceTimeout = null;
    }
    /**
     * Initialize the graph and register filter controls
     * @returns {FullGraph} This graph instance for chaining
     */
    initialize() {
      super.initialize();
      this.registerFilterControls();
      return this;
    }
    /**
     * Register filter controls
     * @returns {FullGraph} This graph instance for chaining
     */
    registerFilterControls() {
      if (!this.filterInput) {
        console.error("Filter input element not found");
        return this;
      }
      if (!this.filterButton) {
        console.error("Filter button element not found");
        return this;
      }
      this.filterButton.addEventListener("click", () => {
        this.filter(this.filterInput.value);
      });
      this.filterInput.addEventListener("input", (e) => {
        this.debounceFilter(e.target.value);
      });
      this.filterInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
          this.filter(this.filterInput.value);
        }
      });
      return this;
    }
    /**
     * Debounce filter function with 300ms delay
     * @param {string} value - Filter value
     */
    debounceFilter(value) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.filter(value);
      }, 300);
    }
    /**
     * Register default event handlers for the full graph
     * @returns {Graph} This graph instance for chaining
     */
    registerDefaultEventHandlers() {
      const nodeDoubleClick = (event, d) => {
        if (d.id !== "quality-root") {
          window.location.href = this.graph.getNodeAttribute(d.id, "page");
        }
      };
      const nodeHover = (event, d) => {
        const isHighlighted = d.highlighted;
        this.renderer.nodes.each(function(node) {
          node.highlighted = false;
          node.connectedHighlighted = false;
        });
        const connectedNodes = /* @__PURE__ */ new Set();
        if (!isHighlighted) {
          d.highlighted = true;
          this.renderer.links.each(function(link) {
            if (link.source.id === d.id) {
              connectedNodes.add(link.target.id);
              link.target.connectedHighlighted = true;
            }
            if (link.target.id === d.id) {
              connectedNodes.add(link.source.id);
              link.source.connectedHighlighted = true;
            }
          });
        }
        this.renderer.highlightNode(d.id, !isHighlighted, connectedNodes);
      };
      return this.registerEventHandlers({
        nodeHover,
        nodeDoubleClick
      });
    }
  };

  // src/graphs/fullpage/main.js
  var dataProvider = new GraphDataProvider(property_nodes_default, nodes_default, edges_default);
  var fullGraph = new FullGraph("full-q-graph-container", dataProvider);
  fullGraph.initialize().buildGraph().registerDefaultEventHandlers().render();
})();
