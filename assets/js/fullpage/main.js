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
      function EventEmitter3() {
        EventEmitter3.init.call(this);
      }
      module.exports = EventEmitter3;
      module.exports.once = once;
      EventEmitter3.EventEmitter = EventEmitter3;
      EventEmitter3.prototype._events = void 0;
      EventEmitter3.prototype._eventsCount = 0;
      EventEmitter3.prototype._maxListeners = void 0;
      var defaultMaxListeners = 10;
      function checkListener(listener) {
        if (typeof listener !== "function") {
          throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
        }
      }
      Object.defineProperty(EventEmitter3, "defaultMaxListeners", {
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
      EventEmitter3.init = function() {
        if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
        }
        this._maxListeners = this._maxListeners || void 0;
      };
      EventEmitter3.prototype.setMaxListeners = function setMaxListeners(n) {
        if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
          throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
        }
        this._maxListeners = n;
        return this;
      };
      function _getMaxListeners(that) {
        if (that._maxListeners === void 0)
          return EventEmitter3.defaultMaxListeners;
        return that._maxListeners;
      }
      EventEmitter3.prototype.getMaxListeners = function getMaxListeners() {
        return _getMaxListeners(this);
      };
      EventEmitter3.prototype.emit = function emit(type) {
        var args = [];
        for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
        var doError = type === "error";
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
        var handler = events[type];
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
      function _addListener(target, type, listener, prepend) {
        var m;
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
              type,
              listener.listener ? listener.listener : listener
            );
            events = target._events;
          }
          existing = events[type];
        }
        if (existing === void 0) {
          existing = events[type] = listener;
          ++target._eventsCount;
        } else {
          if (typeof existing === "function") {
            existing = events[type] = prepend ? [listener, existing] : [existing, listener];
          } else if (prepend) {
            existing.unshift(listener);
          } else {
            existing.push(listener);
          }
          m = _getMaxListeners(target);
          if (m > 0 && existing.length > m && !existing.warned) {
            existing.warned = true;
            var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
            w.name = "MaxListenersExceededWarning";
            w.emitter = target;
            w.type = type;
            w.count = existing.length;
            ProcessEmitWarning(w);
          }
        }
        return target;
      }
      EventEmitter3.prototype.addListener = function addListener(type, listener) {
        return _addListener(this, type, listener, false);
      };
      EventEmitter3.prototype.on = EventEmitter3.prototype.addListener;
      EventEmitter3.prototype.prependListener = function prependListener(type, listener) {
        return _addListener(this, type, listener, true);
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
      function _onceWrap(target, type, listener) {
        var state = { fired: false, wrapFn: void 0, target, type, listener };
        var wrapped = onceWrapper.bind(state);
        wrapped.listener = listener;
        state.wrapFn = wrapped;
        return wrapped;
      }
      EventEmitter3.prototype.once = function once2(type, listener) {
        checkListener(listener);
        this.on(type, _onceWrap(this, type, listener));
        return this;
      };
      EventEmitter3.prototype.prependOnceListener = function prependOnceListener(type, listener) {
        checkListener(listener);
        this.prependListener(type, _onceWrap(this, type, listener));
        return this;
      };
      EventEmitter3.prototype.removeListener = function removeListener(type, listener) {
        var list, events, position, i, originalListener;
        checkListener(listener);
        events = this._events;
        if (events === void 0)
          return this;
        list = events[type];
        if (list === void 0)
          return this;
        if (list === listener || list.listener === listener) {
          if (--this._eventsCount === 0)
            this._events = /* @__PURE__ */ Object.create(null);
          else {
            delete events[type];
            if (events.removeListener)
              this.emit("removeListener", type, list.listener || listener);
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
            events[type] = list[0];
          if (events.removeListener !== void 0)
            this.emit("removeListener", type, originalListener || listener);
        }
        return this;
      };
      EventEmitter3.prototype.off = EventEmitter3.prototype.removeListener;
      EventEmitter3.prototype.removeAllListeners = function removeAllListeners(type) {
        var listeners, events, i;
        events = this._events;
        if (events === void 0)
          return this;
        if (events.removeListener === void 0) {
          if (arguments.length === 0) {
            this._events = /* @__PURE__ */ Object.create(null);
            this._eventsCount = 0;
          } else if (events[type] !== void 0) {
            if (--this._eventsCount === 0)
              this._events = /* @__PURE__ */ Object.create(null);
            else
              delete events[type];
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
        listeners = events[type];
        if (typeof listeners === "function") {
          this.removeListener(type, listeners);
        } else if (listeners !== void 0) {
          for (i = listeners.length - 1; i >= 0; i--) {
            this.removeListener(type, listeners[i]);
          }
        }
        return this;
      };
      function _listeners(target, type, unwrap) {
        var events = target._events;
        if (events === void 0)
          return [];
        var evlistener = events[type];
        if (evlistener === void 0)
          return [];
        if (typeof evlistener === "function")
          return unwrap ? [evlistener.listener || evlistener] : [evlistener];
        return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
      }
      EventEmitter3.prototype.listeners = function listeners(type) {
        return _listeners(this, type, true);
      };
      EventEmitter3.prototype.rawListeners = function rawListeners(type) {
        return _listeners(this, type, false);
      };
      EventEmitter3.listenerCount = function(emitter, type) {
        if (typeof emitter.listenerCount === "function") {
          return emitter.listenerCount(type);
        } else {
          return listenerCount.call(emitter, type);
        }
      };
      EventEmitter3.prototype.listenerCount = listenerCount;
      function listenerCount(type) {
        var events = this._events;
        if (events !== void 0) {
          var evlistener = events[type];
          if (typeof evlistener === "function") {
            return 1;
          } else if (evlistener !== void 0) {
            return evlistener.length;
          }
        }
        return 0;
      }
      EventEmitter3.prototype.eventNames = function eventNames() {
        return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
      };
      function arrayClone(arr, n) {
        var copy = new Array(n);
        for (var i = 0; i < n; ++i)
          copy[i] = arr[i];
        return copy;
      }
      function spliceOne(list, index) {
        for (; index + 1 < list.length; index++)
          list[index] = list[index + 1];
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

  // node_modules/graphology-utils/is-graph.js
  var require_is_graph = __commonJS({
    "node_modules/graphology-utils/is-graph.js"(exports, module) {
      module.exports = function isGraph2(value) {
        return value !== null && typeof value === "object" && typeof value.addUndirectedEdgeWithKey === "function" && typeof value.dropNode === "function" && typeof value.multi === "boolean";
      };
    }
  });

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
  function getMatchingEdge(graph2, source, target, type) {
    const sourceData = graph2._nodes.get(source);
    let edge = null;
    if (!sourceData) return edge;
    if (type === "mixed") {
      edge = sourceData.out && sourceData.out[target] || sourceData.undirected && sourceData.undirected[target];
    } else if (type === "directed") {
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
  function findRelevantNodeData(graph2, method, mode, nodeOrEdge, nameOrEdge, add1, add2) {
    let nodeData, edgeData, arg1, arg2;
    nodeOrEdge = "" + nodeOrEdge;
    if (mode === NODE) {
      nodeData = graph2._nodes.get(nodeOrEdge);
      if (!nodeData)
        throw new NotFoundGraphError(
          `Graph.${method}: could not find the "${nodeOrEdge}" node in the graph.`
        );
      arg1 = nameOrEdge;
      arg2 = add1;
    } else if (mode === OPPOSITE) {
      nameOrEdge = "" + nameOrEdge;
      edgeData = graph2._edges.get(nameOrEdge);
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
      edgeData = graph2._edges.get(nodeOrEdge);
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
  function attachNodeAttributesMethods(Graph2) {
    NODE_ATTRIBUTES_METHODS.forEach(function({ name, attacher }) {
      attacher(Graph2, name("Node"), NODE);
      attacher(Graph2, name("Source"), SOURCE);
      attacher(Graph2, name("Target"), TARGET);
      attacher(Graph2, name("Opposite"), OPPOSITE);
    });
  }
  function attachEdgeAttributeGetter(Class, method, type) {
    Class.prototype[method] = function(element, name) {
      let data;
      if (this.type !== "mixed" && type !== "mixed" && type !== this.type)
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
        data = getMatchingEdge(this, source, target, type);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`
          );
      } else {
        if (type !== "mixed")
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
  function attachEdgeAttributesGetter(Class, method, type) {
    Class.prototype[method] = function(element) {
      let data;
      if (this.type !== "mixed" && type !== "mixed" && type !== this.type)
        throw new UsageGraphError(
          `Graph.${method}: cannot find this type of edges in your ${this.type} graph.`
        );
      if (arguments.length > 1) {
        if (this.multi)
          throw new UsageGraphError(
            `Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`
          );
        const source = "" + element, target = "" + arguments[1];
        data = getMatchingEdge(this, source, target, type);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`
          );
      } else {
        if (type !== "mixed")
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
  function attachEdgeAttributeChecker(Class, method, type) {
    Class.prototype[method] = function(element, name) {
      let data;
      if (this.type !== "mixed" && type !== "mixed" && type !== this.type)
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
        data = getMatchingEdge(this, source, target, type);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`
          );
      } else {
        if (type !== "mixed")
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
  function attachEdgeAttributeSetter(Class, method, type) {
    Class.prototype[method] = function(element, name, value) {
      let data;
      if (this.type !== "mixed" && type !== "mixed" && type !== this.type)
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
        data = getMatchingEdge(this, source, target, type);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`
          );
      } else {
        if (type !== "mixed")
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
  function attachEdgeAttributeUpdater(Class, method, type) {
    Class.prototype[method] = function(element, name, updater) {
      let data;
      if (this.type !== "mixed" && type !== "mixed" && type !== this.type)
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
        data = getMatchingEdge(this, source, target, type);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`
          );
      } else {
        if (type !== "mixed")
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
  function attachEdgeAttributeRemover(Class, method, type) {
    Class.prototype[method] = function(element, name) {
      let data;
      if (this.type !== "mixed" && type !== "mixed" && type !== this.type)
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
        data = getMatchingEdge(this, source, target, type);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`
          );
      } else {
        if (type !== "mixed")
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
  function attachEdgeAttributesReplacer(Class, method, type) {
    Class.prototype[method] = function(element, attributes) {
      let data;
      if (this.type !== "mixed" && type !== "mixed" && type !== this.type)
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
        data = getMatchingEdge(this, source, target, type);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`
          );
      } else {
        if (type !== "mixed")
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
  function attachEdgeAttributesMerger(Class, method, type) {
    Class.prototype[method] = function(element, attributes) {
      let data;
      if (this.type !== "mixed" && type !== "mixed" && type !== this.type)
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
        data = getMatchingEdge(this, source, target, type);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`
          );
      } else {
        if (type !== "mixed")
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
  function attachEdgeAttributesUpdater(Class, method, type) {
    Class.prototype[method] = function(element, updater) {
      let data;
      if (this.type !== "mixed" && type !== "mixed" && type !== this.type)
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
        data = getMatchingEdge(this, source, target, type);
        if (!data)
          throw new NotFoundGraphError(
            `Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`
          );
      } else {
        if (type !== "mixed")
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
  function attachEdgeAttributesMethods(Graph2) {
    EDGE_ATTRIBUTES_METHODS.forEach(function({ name, attacher }) {
      attacher(Graph2, name("Edge"), "mixed");
      attacher(Graph2, name("DirectedEdge"), "directed");
      attacher(Graph2, name("UndirectedEdge"), "undirected");
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
  function createEdgeArray(graph2, type) {
    if (graph2.size === 0) return [];
    if (type === "mixed" || type === graph2.type) {
      return Array.from(graph2._edges.keys());
    }
    const size = type === "undirected" ? graph2.undirectedSize : graph2.directedSize;
    const list = new Array(size), mask = type === "undirected";
    const iterator = graph2._edges.values();
    let i = 0;
    let step, data;
    while (step = iterator.next(), step.done !== true) {
      data = step.value;
      if (data.undirected === mask) list[i++] = data.key;
    }
    return list;
  }
  function forEachEdge(breakable, graph2, type, callback) {
    if (graph2.size === 0) return;
    const shouldFilter = type !== "mixed" && type !== graph2.type;
    const mask = type === "undirected";
    let step, data;
    let shouldBreak = false;
    const iterator = graph2._edges.values();
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
  function createEdgeIterator(graph2, type) {
    if (graph2.size === 0) return emptyIterator();
    const shouldFilter = type !== "mixed" && type !== graph2.type;
    const mask = type === "undirected";
    const iterator = graph2._edges.values();
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
  function forEachEdgeForNode(breakable, multi, type, direction, nodeData, callback) {
    const fn = multi ? forEachMulti : forEachSimple;
    let found;
    if (type !== "undirected") {
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
    if (type !== "directed") {
      found = fn(breakable, nodeData.undirected, callback);
      if (breakable && found) return found;
    }
    return;
  }
  function createEdgeArrayForNode(multi, type, direction, nodeData) {
    const edges = [];
    forEachEdgeForNode(false, multi, type, direction, nodeData, function(key) {
      edges.push(key);
    });
    return edges;
  }
  function createEdgeIteratorForNode(type, direction, nodeData) {
    let iterator = emptyIterator();
    if (type !== "undirected") {
      if (direction !== "out" && typeof nodeData.in !== "undefined")
        iterator = chain(iterator, createIterator(nodeData.in));
      if (direction !== "in" && typeof nodeData.out !== "undefined")
        iterator = chain(
          iterator,
          createIterator(nodeData.out, !direction ? nodeData.key : void 0)
        );
    }
    if (type !== "directed" && typeof nodeData.undirected !== "undefined") {
      iterator = chain(iterator, createIterator(nodeData.undirected));
    }
    return iterator;
  }
  function forEachEdgeForPath(breakable, type, multi, direction, sourceData, target, callback) {
    const fn = multi ? forEachForKeyMulti : forEachForKeySimple;
    let found;
    if (type !== "undirected") {
      if (typeof sourceData.in !== "undefined" && direction !== "out") {
        found = fn(breakable, sourceData.in, target, callback);
        if (breakable && found) return found;
      }
      if (typeof sourceData.out !== "undefined" && direction !== "in" && (direction || sourceData.key !== target)) {
        found = fn(breakable, sourceData.out, target, callback);
        if (breakable && found) return found;
      }
    }
    if (type !== "directed") {
      if (typeof sourceData.undirected !== "undefined") {
        found = fn(breakable, sourceData.undirected, target, callback);
        if (breakable && found) return found;
      }
    }
    return;
  }
  function createEdgeArrayForPath(type, multi, direction, sourceData, target) {
    const edges = [];
    forEachEdgeForPath(
      false,
      type,
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
  function createEdgeIteratorForPath(type, direction, sourceData, target) {
    let iterator = emptyIterator();
    if (type !== "undirected") {
      if (typeof sourceData.in !== "undefined" && direction !== "out" && target in sourceData.in)
        iterator = chain(iterator, createIteratorForKey(sourceData.in, target));
      if (typeof sourceData.out !== "undefined" && direction !== "in" && target in sourceData.out && (direction || sourceData.key !== target))
        iterator = chain(iterator, createIteratorForKey(sourceData.out, target));
    }
    if (type !== "directed") {
      if (typeof sourceData.undirected !== "undefined" && target in sourceData.undirected)
        iterator = chain(
          iterator,
          createIteratorForKey(sourceData.undirected, target)
        );
    }
    return iterator;
  }
  function attachEdgeArrayCreator(Class, description) {
    const { name, type, direction } = description;
    Class.prototype[name] = function(source, target) {
      if (type !== "mixed" && this.type !== "mixed" && type !== this.type)
        return [];
      if (!arguments.length) return createEdgeArray(this, type);
      if (arguments.length === 1) {
        source = "" + source;
        const nodeData = this._nodes.get(source);
        if (typeof nodeData === "undefined")
          throw new NotFoundGraphError(
            `Graph.${name}: could not find the "${source}" node in the graph.`
          );
        return createEdgeArrayForNode(
          this.multi,
          type === "mixed" ? this.type : type,
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
          type,
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
    const { name, type, direction } = description;
    const forEachName = "forEach" + name[0].toUpperCase() + name.slice(1, -1);
    Class.prototype[forEachName] = function(source, target, callback) {
      if (type !== "mixed" && this.type !== "mixed" && type !== this.type) return;
      if (arguments.length === 1) {
        callback = source;
        return forEachEdge(false, this, type, callback);
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
          type === "mixed" ? this.type : type,
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
          type,
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
        if (type !== "directed") length += this.undirectedSize;
        if (type !== "undirected") length += this.directedSize;
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
    const { name, type, direction } = description;
    const findEdgeName = "find" + name[0].toUpperCase() + name.slice(1, -1);
    Class.prototype[findEdgeName] = function(source, target, callback) {
      if (type !== "mixed" && this.type !== "mixed" && type !== this.type)
        return false;
      if (arguments.length === 1) {
        callback = source;
        return forEachEdge(true, this, type, callback);
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
          type === "mixed" ? this.type : type,
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
          type,
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
    const { name: originalName, type, direction } = description;
    const name = originalName.slice(0, -1) + "Entries";
    Class.prototype[name] = function(source, target) {
      if (type !== "mixed" && this.type !== "mixed" && type !== this.type)
        return emptyIterator();
      if (!arguments.length) return createEdgeIterator(this, type);
      if (arguments.length === 1) {
        source = "" + source;
        const sourceData = this._nodes.get(source);
        if (!sourceData)
          throw new NotFoundGraphError(
            `Graph.${name}: could not find the "${source}" node in the graph.`
          );
        return createEdgeIteratorForNode(type, direction, sourceData);
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
        return createEdgeIteratorForPath(type, direction, sourceData, target);
      }
      throw new InvalidArgumentsGraphError(
        `Graph.${name}: too many arguments (expecting 0, 1 or 2 and got ${arguments.length}).`
      );
    };
  }
  function attachEdgeIterationMethods(Graph2) {
    EDGES_ITERATION.forEach((description) => {
      attachEdgeArrayCreator(Graph2, description);
      attachForEachEdge(Graph2, description);
      attachFindEdge(Graph2, description);
      attachEdgeIteratorCreator(Graph2, description);
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
  CompositeSetWrapper.prototype.wrap = function(set) {
    if (this.A === null) this.A = set;
    else if (this.B === null) this.B = set;
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
  function forEachNeighbor(breakable, type, direction, nodeData, callback) {
    if (type !== "mixed") {
      if (type === "undirected")
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
    if (type !== "undirected") {
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
    if (type !== "directed") {
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
  function createNeighborArrayForNode(type, direction, nodeData) {
    if (type !== "mixed") {
      if (type === "undirected") return Object.keys(nodeData.undirected);
      if (typeof direction === "string") return Object.keys(nodeData[direction]);
    }
    const neighbors = [];
    forEachNeighbor(false, type, direction, nodeData, function(key) {
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
  function createNeighborIterator(type, direction, nodeData) {
    if (type !== "mixed") {
      if (type === "undirected")
        return createDedupedObjectIterator(null, nodeData, nodeData.undirected);
      if (typeof direction === "string")
        return createDedupedObjectIterator(null, nodeData, nodeData[direction]);
    }
    let iterator = emptyIterator();
    const visited = new CompositeSetWrapper();
    if (type !== "undirected") {
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
    if (type !== "directed") {
      iterator = chain(
        iterator,
        createDedupedObjectIterator(visited, nodeData, nodeData.undirected)
      );
    }
    return iterator;
  }
  function attachNeighborArrayCreator(Class, description) {
    const { name, type, direction } = description;
    Class.prototype[name] = function(node) {
      if (type !== "mixed" && this.type !== "mixed" && type !== this.type)
        return [];
      node = "" + node;
      const nodeData = this._nodes.get(node);
      if (typeof nodeData === "undefined")
        throw new NotFoundGraphError(
          `Graph.${name}: could not find the "${node}" node in the graph.`
        );
      return createNeighborArrayForNode(
        type === "mixed" ? this.type : type,
        direction,
        nodeData
      );
    };
  }
  function attachForEachNeighbor(Class, description) {
    const { name, type, direction } = description;
    const forEachName = "forEach" + name[0].toUpperCase() + name.slice(1, -1);
    Class.prototype[forEachName] = function(node, callback) {
      if (type !== "mixed" && this.type !== "mixed" && type !== this.type) return;
      node = "" + node;
      const nodeData = this._nodes.get(node);
      if (typeof nodeData === "undefined")
        throw new NotFoundGraphError(
          `Graph.${forEachName}: could not find the "${node}" node in the graph.`
        );
      forEachNeighbor(
        false,
        type === "mixed" ? this.type : type,
        direction,
        nodeData,
        callback
      );
    };
    const mapName = "map" + name[0].toUpperCase() + name.slice(1);
    Class.prototype[mapName] = function(node, callback) {
      const result = [];
      this[forEachName](node, (n, a) => {
        result.push(callback(n, a));
      });
      return result;
    };
    const filterName = "filter" + name[0].toUpperCase() + name.slice(1);
    Class.prototype[filterName] = function(node, callback) {
      const result = [];
      this[forEachName](node, (n, a) => {
        if (callback(n, a)) result.push(n);
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
      this[forEachName](node, (n, a) => {
        accumulator = callback(accumulator, n, a);
      });
      return accumulator;
    };
  }
  function attachFindNeighbor(Class, description) {
    const { name, type, direction } = description;
    const capitalizedSingular = name[0].toUpperCase() + name.slice(1, -1);
    const findName = "find" + capitalizedSingular;
    Class.prototype[findName] = function(node, callback) {
      if (type !== "mixed" && this.type !== "mixed" && type !== this.type) return;
      node = "" + node;
      const nodeData = this._nodes.get(node);
      if (typeof nodeData === "undefined")
        throw new NotFoundGraphError(
          `Graph.${findName}: could not find the "${node}" node in the graph.`
        );
      return forEachNeighbor(
        true,
        type === "mixed" ? this.type : type,
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
      const found = this[findName](node, (n, a) => {
        return !callback(n, a);
      });
      if (found) return false;
      return true;
    };
  }
  function attachNeighborIteratorCreator(Class, description) {
    const { name, type, direction } = description;
    const iteratorName = name.slice(0, -1) + "Entries";
    Class.prototype[iteratorName] = function(node) {
      if (type !== "mixed" && this.type !== "mixed" && type !== this.type)
        return emptyIterator();
      node = "" + node;
      const nodeData = this._nodes.get(node);
      if (typeof nodeData === "undefined")
        throw new NotFoundGraphError(
          `Graph.${iteratorName}: could not find the "${node}" node in the graph.`
        );
      return createNeighborIterator(
        type === "mixed" ? this.type : type,
        direction,
        nodeData
      );
    };
  }
  function attachNeighborIterationMethods(Graph2) {
    NEIGHBORS_ITERATION.forEach((description) => {
      attachNeighborArrayCreator(Graph2, description);
      attachForEachNeighbor(Graph2, description);
      attachFindNeighbor(Graph2, description);
      attachNeighborIteratorCreator(Graph2, description);
    });
  }
  function forEachAdjacency(breakable, assymetric, disconnectedNodes, graph2, callback) {
    const iterator = graph2._nodes.values();
    const type = graph2.type;
    let step, sourceData, neighbor, adj, edgeData, targetData, shouldBreak;
    while (step = iterator.next(), step.done !== true) {
      let hasEdges = false;
      sourceData = step.value;
      if (type !== "undirected") {
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
      if (type !== "directed") {
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
  function serializeEdge(type, key, data) {
    const serialized = {
      key,
      source: data.source.key,
      target: data.target.key
    };
    if (!isEmpty(data.attributes))
      serialized.attributes = assign({}, data.attributes);
    if (type === "mixed" && data.undirected) serialized.undirected = true;
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
  function addNode(graph2, node, attributes) {
    if (attributes && !isPlainObject(attributes))
      throw new InvalidArgumentsGraphError(
        `Graph.addNode: invalid attributes. Expecting an object but got "${attributes}"`
      );
    node = "" + node;
    attributes = attributes || {};
    if (graph2._nodes.has(node))
      throw new UsageGraphError(
        `Graph.addNode: the "${node}" node already exist in the graph.`
      );
    const data = new graph2.NodeDataClass(node, attributes);
    graph2._nodes.set(node, data);
    graph2.emit("nodeAdded", {
      key: node,
      attributes
    });
    return data;
  }
  function unsafeAddNode(graph2, node, attributes) {
    const data = new graph2.NodeDataClass(node, attributes);
    graph2._nodes.set(node, data);
    graph2.emit("nodeAdded", {
      key: node,
      attributes
    });
    return data;
  }
  function addEdge(graph2, name, mustGenerateKey, undirected, edge, source, target, attributes) {
    if (!undirected && graph2.type === "undirected")
      throw new UsageGraphError(
        `Graph.${name}: you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead.`
      );
    if (undirected && graph2.type === "directed")
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
    if (!graph2.allowSelfLoops && source === target)
      throw new UsageGraphError(
        `Graph.${name}: source & target are the same ("${source}"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`
      );
    const sourceData = graph2._nodes.get(source), targetData = graph2._nodes.get(target);
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
      edge = graph2._edgeKeyGenerator();
    } else {
      edge = "" + edge;
      if (graph2._edges.has(edge))
        throw new UsageGraphError(
          `Graph.${name}: the "${edge}" edge already exists in the graph.`
        );
    }
    if (!graph2.multi && (undirected ? typeof sourceData.undirected[target] !== "undefined" : typeof sourceData.out[target] !== "undefined")) {
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
    graph2._edges.set(edge, edgeData);
    const isSelfLoop = source === target;
    if (undirected) {
      sourceData.undirectedDegree++;
      targetData.undirectedDegree++;
      if (isSelfLoop) {
        sourceData.undirectedLoops++;
        graph2._undirectedSelfLoopCount++;
      }
    } else {
      sourceData.outDegree++;
      targetData.inDegree++;
      if (isSelfLoop) {
        sourceData.directedLoops++;
        graph2._directedSelfLoopCount++;
      }
    }
    if (graph2.multi) edgeData.attachMulti();
    else edgeData.attach();
    if (undirected) graph2._undirectedSize++;
    else graph2._directedSize++;
    eventData.key = edge;
    graph2.emit("edgeAdded", eventData);
    return edge;
  }
  function mergeEdge(graph2, name, mustGenerateKey, undirected, edge, source, target, attributes, asUpdater) {
    if (!undirected && graph2.type === "undirected")
      throw new UsageGraphError(
        `Graph.${name}: you cannot merge/update a directed edge to an undirected graph. Use the #.mergeEdge/#.updateEdge or #.addUndirectedEdge instead.`
      );
    if (undirected && graph2.type === "directed")
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
    if (!graph2.allowSelfLoops && source === target)
      throw new UsageGraphError(
        `Graph.${name}: source & target are the same ("${source}"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`
      );
    let sourceData = graph2._nodes.get(source);
    let targetData = graph2._nodes.get(target);
    let edgeData;
    let alreadyExistingEdgeData;
    if (!mustGenerateKey) {
      edgeData = graph2._edges.get(edge);
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
    if (!alreadyExistingEdgeData && !graph2.multi && sourceData) {
      alreadyExistingEdgeData = undirected ? sourceData.undirected[target] : sourceData.out[target];
    }
    if (alreadyExistingEdgeData) {
      const info = [alreadyExistingEdgeData.key, false, false, false];
      if (asUpdater ? !updater : !attributes) return info;
      if (asUpdater) {
        const oldAttributes = alreadyExistingEdgeData.attributes;
        alreadyExistingEdgeData.attributes = updater(oldAttributes);
        graph2.emit("edgeAttributesUpdated", {
          type: "replace",
          key: alreadyExistingEdgeData.key,
          attributes: alreadyExistingEdgeData.attributes
        });
      } else {
        assign(alreadyExistingEdgeData.attributes, attributes);
        graph2.emit("edgeAttributesUpdated", {
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
      edge = graph2._edgeKeyGenerator();
    } else {
      edge = "" + edge;
      if (graph2._edges.has(edge))
        throw new UsageGraphError(
          `Graph.${name}: the "${edge}" edge already exists in the graph.`
        );
    }
    let sourceWasAdded = false;
    let targetWasAdded = false;
    if (!sourceData) {
      sourceData = unsafeAddNode(graph2, source, {});
      sourceWasAdded = true;
      if (source === target) {
        targetData = sourceData;
        targetWasAdded = true;
      }
    }
    if (!targetData) {
      targetData = unsafeAddNode(graph2, target, {});
      targetWasAdded = true;
    }
    edgeData = new EdgeData(undirected, edge, sourceData, targetData, attributes);
    graph2._edges.set(edge, edgeData);
    const isSelfLoop = source === target;
    if (undirected) {
      sourceData.undirectedDegree++;
      targetData.undirectedDegree++;
      if (isSelfLoop) {
        sourceData.undirectedLoops++;
        graph2._undirectedSelfLoopCount++;
      }
    } else {
      sourceData.outDegree++;
      targetData.inDegree++;
      if (isSelfLoop) {
        sourceData.directedLoops++;
        graph2._directedSelfLoopCount++;
      }
    }
    if (graph2.multi) edgeData.attachMulti();
    else edgeData.attach();
    if (undirected) graph2._undirectedSize++;
    else graph2._directedSize++;
    eventData.key = edge;
    graph2.emit("edgeAdded", eventData);
    return [edge, true, sourceWasAdded, targetWasAdded];
  }
  function dropEdgeFromData(graph2, edgeData) {
    graph2._edges.delete(edgeData.key);
    const { source: sourceData, target: targetData, attributes } = edgeData;
    const undirected = edgeData.undirected;
    const isSelfLoop = sourceData === targetData;
    if (undirected) {
      sourceData.undirectedDegree--;
      targetData.undirectedDegree--;
      if (isSelfLoop) {
        sourceData.undirectedLoops--;
        graph2._undirectedSelfLoopCount--;
      }
    } else {
      sourceData.outDegree--;
      targetData.inDegree--;
      if (isSelfLoop) {
        sourceData.directedLoops--;
        graph2._directedSelfLoopCount--;
      }
    }
    if (graph2.multi) edgeData.detachMulti();
    else edgeData.detach();
    if (undirected) graph2._undirectedSize--;
    else graph2._directedSize--;
    graph2.emit("edgeDropped", {
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
        data.forEachNode((n, a) => {
          if (merge) this.mergeNode(n, a);
          else this.addNode(n, a);
        });
        data.forEachEdge((e, a, s, t, _sa, _ta, u) => {
          if (merge) {
            if (u) this.mergeUndirectedEdgeWithKey(e, s, t, a);
            else this.mergeDirectedEdgeWithKey(e, s, t, a);
          } else {
            if (u) this.addUndirectedEdgeWithKey(e, s, t, a);
            else this.addDirectedEdgeWithKey(e, s, t, a);
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
      const graph2 = new _Graph(assign({}, this._options, options));
      graph2.replaceAttributes(assign({}, this.getAttributes()));
      return graph2;
    }
    /**
     * Method returning an empty copy of the graph, i.e. a graph without edges but
     * with the exact same options.
     *
     * @param  {object} options - Options to merge with the current ones.
     * @return {Graph}          - The empty copy.
     */
    emptyCopy(options) {
      const graph2 = this.nullCopy(options);
      this._nodes.forEach((nodeData, key) => {
        const attributes = assign({}, nodeData.attributes);
        nodeData = new graph2.NodeDataClass(key, attributes);
        graph2._nodes.set(key, nodeData);
      });
      return graph2;
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
      const graph2 = this.emptyCopy(options);
      const iterator = this._edges.values();
      let step, edgeData;
      while (step = iterator.next(), step.done !== true) {
        edgeData = step.value;
        addEdge(
          graph2,
          "copy",
          false,
          edgeData.undirected,
          edgeData.key,
          edgeData.source.key,
          edgeData.target.key,
          assign({}, edgeData.attributes)
        );
      }
      return graph2;
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

  // node_modules/sigma/dist/inherits-d1a1e29b.esm.js
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _classCallCheck(a, n) {
    if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
  }
  function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
      var o = r[t];
      o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
    }
  }
  function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
      writable: false
    }), e;
  }
  function _getPrototypeOf(t) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t2) {
      return t2.__proto__ || Object.getPrototypeOf(t2);
    }, _getPrototypeOf(t);
  }
  function _isNativeReflectConstruct() {
    try {
      var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t2) {
    }
    return (_isNativeReflectConstruct = function() {
      return !!t;
    })();
  }
  function _assertThisInitialized(e) {
    if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return e;
  }
  function _possibleConstructorReturn(t, e) {
    if (e && ("object" == typeof e || "function" == typeof e)) return e;
    if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
    return _assertThisInitialized(t);
  }
  function _callSuper(t, o, e) {
    return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
  }
  function _setPrototypeOf(t, e) {
    return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t2, e2) {
      return t2.__proto__ = e2, t2;
    }, _setPrototypeOf(t, e);
  }
  function _inherits(t, e) {
    if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
    t.prototype = Object.create(e && e.prototype, {
      constructor: {
        value: t,
        writable: true,
        configurable: true
      }
    }), Object.defineProperty(t, "prototype", {
      writable: false
    }), e && _setPrototypeOf(t, e);
  }

  // node_modules/sigma/dist/colors-beb06eb2.esm.js
  function _arrayWithHoles(r) {
    if (Array.isArray(r)) return r;
  }
  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e, n, i, u, a = [], f = true, o = false;
      try {
        if (i = (t = t.call(r)).next, 0 === l) {
          if (Object(t) !== t) return;
          f = false;
        } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true) ;
      } catch (r2) {
        o = true, n = r2;
      } finally {
        try {
          if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _slicedToArray(r, e) {
    return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
  }
  var HTML_COLORS = {
    black: "#000000",
    silver: "#C0C0C0",
    gray: "#808080",
    grey: "#808080",
    white: "#FFFFFF",
    maroon: "#800000",
    red: "#FF0000",
    purple: "#800080",
    fuchsia: "#FF00FF",
    green: "#008000",
    lime: "#00FF00",
    olive: "#808000",
    yellow: "#FFFF00",
    navy: "#000080",
    blue: "#0000FF",
    teal: "#008080",
    aqua: "#00FFFF",
    darkblue: "#00008B",
    mediumblue: "#0000CD",
    darkgreen: "#006400",
    darkcyan: "#008B8B",
    deepskyblue: "#00BFFF",
    darkturquoise: "#00CED1",
    mediumspringgreen: "#00FA9A",
    springgreen: "#00FF7F",
    cyan: "#00FFFF",
    midnightblue: "#191970",
    dodgerblue: "#1E90FF",
    lightseagreen: "#20B2AA",
    forestgreen: "#228B22",
    seagreen: "#2E8B57",
    darkslategray: "#2F4F4F",
    darkslategrey: "#2F4F4F",
    limegreen: "#32CD32",
    mediumseagreen: "#3CB371",
    turquoise: "#40E0D0",
    royalblue: "#4169E1",
    steelblue: "#4682B4",
    darkslateblue: "#483D8B",
    mediumturquoise: "#48D1CC",
    indigo: "#4B0082",
    darkolivegreen: "#556B2F",
    cadetblue: "#5F9EA0",
    cornflowerblue: "#6495ED",
    rebeccapurple: "#663399",
    mediumaquamarine: "#66CDAA",
    dimgray: "#696969",
    dimgrey: "#696969",
    slateblue: "#6A5ACD",
    olivedrab: "#6B8E23",
    slategray: "#708090",
    slategrey: "#708090",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    mediumslateblue: "#7B68EE",
    lawngreen: "#7CFC00",
    chartreuse: "#7FFF00",
    aquamarine: "#7FFFD4",
    skyblue: "#87CEEB",
    lightskyblue: "#87CEFA",
    blueviolet: "#8A2BE2",
    darkred: "#8B0000",
    darkmagenta: "#8B008B",
    saddlebrown: "#8B4513",
    darkseagreen: "#8FBC8F",
    lightgreen: "#90EE90",
    mediumpurple: "#9370DB",
    darkviolet: "#9400D3",
    palegreen: "#98FB98",
    darkorchid: "#9932CC",
    yellowgreen: "#9ACD32",
    sienna: "#A0522D",
    brown: "#A52A2A",
    darkgray: "#A9A9A9",
    darkgrey: "#A9A9A9",
    lightblue: "#ADD8E6",
    greenyellow: "#ADFF2F",
    paleturquoise: "#AFEEEE",
    lightsteelblue: "#B0C4DE",
    powderblue: "#B0E0E6",
    firebrick: "#B22222",
    darkgoldenrod: "#B8860B",
    mediumorchid: "#BA55D3",
    rosybrown: "#BC8F8F",
    darkkhaki: "#BDB76B",
    mediumvioletred: "#C71585",
    indianred: "#CD5C5C",
    peru: "#CD853F",
    chocolate: "#D2691E",
    tan: "#D2B48C",
    lightgray: "#D3D3D3",
    lightgrey: "#D3D3D3",
    thistle: "#D8BFD8",
    orchid: "#DA70D6",
    goldenrod: "#DAA520",
    palevioletred: "#DB7093",
    crimson: "#DC143C",
    gainsboro: "#DCDCDC",
    plum: "#DDA0DD",
    burlywood: "#DEB887",
    lightcyan: "#E0FFFF",
    lavender: "#E6E6FA",
    darksalmon: "#E9967A",
    violet: "#EE82EE",
    palegoldenrod: "#EEE8AA",
    lightcoral: "#F08080",
    khaki: "#F0E68C",
    aliceblue: "#F0F8FF",
    honeydew: "#F0FFF0",
    azure: "#F0FFFF",
    sandybrown: "#F4A460",
    wheat: "#F5DEB3",
    beige: "#F5F5DC",
    whitesmoke: "#F5F5F5",
    mintcream: "#F5FFFA",
    ghostwhite: "#F8F8FF",
    salmon: "#FA8072",
    antiquewhite: "#FAEBD7",
    linen: "#FAF0E6",
    lightgoldenrodyellow: "#FAFAD2",
    oldlace: "#FDF5E6",
    magenta: "#FF00FF",
    deeppink: "#FF1493",
    orangered: "#FF4500",
    tomato: "#FF6347",
    hotpink: "#FF69B4",
    coral: "#FF7F50",
    darkorange: "#FF8C00",
    lightsalmon: "#FFA07A",
    orange: "#FFA500",
    lightpink: "#FFB6C1",
    pink: "#FFC0CB",
    gold: "#FFD700",
    peachpuff: "#FFDAB9",
    navajowhite: "#FFDEAD",
    moccasin: "#FFE4B5",
    bisque: "#FFE4C4",
    mistyrose: "#FFE4E1",
    blanchedalmond: "#FFEBCD",
    papayawhip: "#FFEFD5",
    lavenderblush: "#FFF0F5",
    seashell: "#FFF5EE",
    cornsilk: "#FFF8DC",
    lemonchiffon: "#FFFACD",
    floralwhite: "#FFFAF0",
    snow: "#FFFAFA",
    lightyellow: "#FFFFE0",
    ivory: "#FFFFF0"
  };
  var INT8 = new Int8Array(4);
  var INT32 = new Int32Array(INT8.buffer, 0, 1);
  var FLOAT32 = new Float32Array(INT8.buffer, 0, 1);
  var RGBA_TEST_REGEX = /^\s*rgba?\s*\(/;
  var RGBA_EXTRACT_REGEX = /^\s*rgba?\s*\(\s*([0-9]*)\s*,\s*([0-9]*)\s*,\s*([0-9]*)(?:\s*,\s*(.*)?)?\)\s*$/;
  function parseColor(val) {
    var r = 0;
    var g = 0;
    var b = 0;
    var a = 1;
    if (val[0] === "#") {
      if (val.length === 4) {
        r = parseInt(val.charAt(1) + val.charAt(1), 16);
        g = parseInt(val.charAt(2) + val.charAt(2), 16);
        b = parseInt(val.charAt(3) + val.charAt(3), 16);
      } else {
        r = parseInt(val.charAt(1) + val.charAt(2), 16);
        g = parseInt(val.charAt(3) + val.charAt(4), 16);
        b = parseInt(val.charAt(5) + val.charAt(6), 16);
      }
      if (val.length === 9) {
        a = parseInt(val.charAt(7) + val.charAt(8), 16) / 255;
      }
    } else if (RGBA_TEST_REGEX.test(val)) {
      var match = val.match(RGBA_EXTRACT_REGEX);
      if (match) {
        r = +match[1];
        g = +match[2];
        b = +match[3];
        if (match[4]) a = +match[4];
      }
    }
    return {
      r,
      g,
      b,
      a
    };
  }
  var FLOAT_COLOR_CACHE = {};
  for (htmlColor in HTML_COLORS) {
    FLOAT_COLOR_CACHE[htmlColor] = floatColor(HTML_COLORS[htmlColor]);
    FLOAT_COLOR_CACHE[HTML_COLORS[htmlColor]] = FLOAT_COLOR_CACHE[htmlColor];
  }
  var htmlColor;
  function rgbaToFloat(r, g, b, a, masking) {
    INT32[0] = a << 24 | b << 16 | g << 8 | r;
    if (masking) INT32[0] = INT32[0] & 4278190079;
    return FLOAT32[0];
  }
  function floatColor(val) {
    val = val.toLowerCase();
    if (typeof FLOAT_COLOR_CACHE[val] !== "undefined") return FLOAT_COLOR_CACHE[val];
    var parsed = parseColor(val);
    var r = parsed.r, g = parsed.g, b = parsed.b;
    var a = parsed.a;
    a = a * 255 | 0;
    var color = rgbaToFloat(r, g, b, a, true);
    FLOAT_COLOR_CACHE[val] = color;
    return color;
  }
  var FLOAT_INDEX_CACHE = {};
  function indexToColor(index) {
    if (typeof FLOAT_INDEX_CACHE[index] !== "undefined") return FLOAT_INDEX_CACHE[index];
    var r = (index & 16711680) >>> 16;
    var g = (index & 65280) >>> 8;
    var b = index & 255;
    var a = 255;
    var color = rgbaToFloat(r, g, b, a, true);
    FLOAT_INDEX_CACHE[index] = color;
    return color;
  }
  function colorToIndex(r, g, b, _a) {
    return b + (g << 8) + (r << 16);
  }
  function getPixelColor(gl, frameBuffer, x, y, pixelRatio, downSizingRatio) {
    var bufferX = Math.floor(x / downSizingRatio * pixelRatio);
    var bufferY = Math.floor(gl.drawingBufferHeight / downSizingRatio - y / downSizingRatio * pixelRatio);
    var pixel = new Uint8Array(4);
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.readPixels(bufferX, bufferY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    var _pixel = _slicedToArray(pixel, 4), r = _pixel[0], g = _pixel[1], b = _pixel[2], a = _pixel[3];
    return [r, g, b, a];
  }

  // node_modules/sigma/dist/index-236c62ad.esm.js
  function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e[r] = t, e;
  }
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function(r2) {
        return Object.getOwnPropertyDescriptor(e, r2).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
        _defineProperty(e, r2, t[r2]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
        Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
      });
    }
    return e;
  }
  function _superPropBase(t, o) {
    for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t)); ) ;
    return t;
  }
  function _get() {
    return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function(e, t, r) {
      var p = _superPropBase(e, t);
      if (p) {
        var n = Object.getOwnPropertyDescriptor(p, t);
        return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value;
      }
    }, _get.apply(null, arguments);
  }
  function _superPropGet(t, o, e, r) {
    var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e);
    return 2 & r && "function" == typeof p ? function(t2) {
      return p.apply(e, t2);
    } : p;
  }
  function getAttributeItemsCount(attr) {
    return attr.normalized ? 1 : attr.size;
  }
  function getAttributesItemsCount(attrs) {
    var res = 0;
    attrs.forEach(function(attr) {
      return res += getAttributeItemsCount(attr);
    });
    return res;
  }
  function loadShader(type, gl, source) {
    var glType = type === "VERTEX" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
    var shader = gl.createShader(glType);
    if (shader === null) {
      throw new Error("loadShader: error while creating the shader");
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var successfullyCompiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!successfullyCompiled) {
      var infoLog = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error("loadShader: error while compiling the shader:\n".concat(infoLog, "\n").concat(source));
    }
    return shader;
  }
  function loadVertexShader(gl, source) {
    return loadShader("VERTEX", gl, source);
  }
  function loadFragmentShader(gl, source) {
    return loadShader("FRAGMENT", gl, source);
  }
  function loadProgram(gl, shaders) {
    var program = gl.createProgram();
    if (program === null) {
      throw new Error("loadProgram: error while creating the program.");
    }
    var i, l;
    for (i = 0, l = shaders.length; i < l; i++) gl.attachShader(program, shaders[i]);
    gl.linkProgram(program);
    var successfullyLinked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!successfullyLinked) {
      gl.deleteProgram(program);
      throw new Error("loadProgram: error while linking the program.");
    }
    return program;
  }
  function killProgram(_ref) {
    var gl = _ref.gl, buffer = _ref.buffer, program = _ref.program, vertexShader = _ref.vertexShader, fragmentShader = _ref.fragmentShader;
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    gl.deleteProgram(program);
    gl.deleteBuffer(buffer);
  }
  var PICKING_PREFIX = "#define PICKING_MODE\n";
  var SIZE_FACTOR_PER_ATTRIBUTE_TYPE = _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, WebGL2RenderingContext.BOOL, 1), WebGL2RenderingContext.BYTE, 1), WebGL2RenderingContext.UNSIGNED_BYTE, 1), WebGL2RenderingContext.SHORT, 2), WebGL2RenderingContext.UNSIGNED_SHORT, 2), WebGL2RenderingContext.INT, 4), WebGL2RenderingContext.UNSIGNED_INT, 4), WebGL2RenderingContext.FLOAT, 4);
  var Program = /* @__PURE__ */ function() {
    function Program2(gl, pickingBuffer, renderer2) {
      _classCallCheck(this, Program2);
      _defineProperty(this, "array", new Float32Array());
      _defineProperty(this, "constantArray", new Float32Array());
      _defineProperty(this, "capacity", 0);
      _defineProperty(this, "verticesCount", 0);
      var def = this.getDefinition();
      this.VERTICES = def.VERTICES;
      this.VERTEX_SHADER_SOURCE = def.VERTEX_SHADER_SOURCE;
      this.FRAGMENT_SHADER_SOURCE = def.FRAGMENT_SHADER_SOURCE;
      this.UNIFORMS = def.UNIFORMS;
      this.ATTRIBUTES = def.ATTRIBUTES;
      this.METHOD = def.METHOD;
      this.CONSTANT_ATTRIBUTES = "CONSTANT_ATTRIBUTES" in def ? def.CONSTANT_ATTRIBUTES : [];
      this.CONSTANT_DATA = "CONSTANT_DATA" in def ? def.CONSTANT_DATA : [];
      this.isInstanced = "CONSTANT_ATTRIBUTES" in def;
      this.ATTRIBUTES_ITEMS_COUNT = getAttributesItemsCount(this.ATTRIBUTES);
      this.STRIDE = this.VERTICES * this.ATTRIBUTES_ITEMS_COUNT;
      this.renderer = renderer2;
      this.normalProgram = this.getProgramInfo("normal", gl, def.VERTEX_SHADER_SOURCE, def.FRAGMENT_SHADER_SOURCE, null);
      this.pickProgram = pickingBuffer ? this.getProgramInfo("pick", gl, PICKING_PREFIX + def.VERTEX_SHADER_SOURCE, PICKING_PREFIX + def.FRAGMENT_SHADER_SOURCE, pickingBuffer) : null;
      if (this.isInstanced) {
        var constantAttributesItemsCount = getAttributesItemsCount(this.CONSTANT_ATTRIBUTES);
        if (this.CONSTANT_DATA.length !== this.VERTICES) throw new Error("Program: error while getting constant data (expected ".concat(this.VERTICES, " items, received ").concat(this.CONSTANT_DATA.length, " instead)"));
        this.constantArray = new Float32Array(this.CONSTANT_DATA.length * constantAttributesItemsCount);
        for (var i = 0; i < this.CONSTANT_DATA.length; i++) {
          var vector = this.CONSTANT_DATA[i];
          if (vector.length !== constantAttributesItemsCount) throw new Error("Program: error while getting constant data (one vector has ".concat(vector.length, " items instead of ").concat(constantAttributesItemsCount, ")"));
          for (var j = 0; j < vector.length; j++) this.constantArray[i * constantAttributesItemsCount + j] = vector[j];
        }
        this.STRIDE = this.ATTRIBUTES_ITEMS_COUNT;
      }
    }
    return _createClass(Program2, [{
      key: "kill",
      value: function kill() {
        killProgram(this.normalProgram);
        if (this.pickProgram) {
          killProgram(this.pickProgram);
          this.pickProgram = null;
        }
      }
    }, {
      key: "getProgramInfo",
      value: function getProgramInfo(name, gl, vertexShaderSource, fragmentShaderSource, frameBuffer) {
        var def = this.getDefinition();
        var buffer = gl.createBuffer();
        if (buffer === null) throw new Error("Program: error while creating the WebGL buffer.");
        var vertexShader = loadVertexShader(gl, vertexShaderSource);
        var fragmentShader = loadFragmentShader(gl, fragmentShaderSource);
        var program = loadProgram(gl, [vertexShader, fragmentShader]);
        var uniformLocations = {};
        def.UNIFORMS.forEach(function(uniformName) {
          var location = gl.getUniformLocation(program, uniformName);
          if (location) uniformLocations[uniformName] = location;
        });
        var attributeLocations = {};
        def.ATTRIBUTES.forEach(function(attr) {
          attributeLocations[attr.name] = gl.getAttribLocation(program, attr.name);
        });
        var constantBuffer;
        if ("CONSTANT_ATTRIBUTES" in def) {
          def.CONSTANT_ATTRIBUTES.forEach(function(attr) {
            attributeLocations[attr.name] = gl.getAttribLocation(program, attr.name);
          });
          constantBuffer = gl.createBuffer();
          if (constantBuffer === null) throw new Error("Program: error while creating the WebGL constant buffer.");
        }
        return {
          name,
          program,
          gl,
          frameBuffer,
          buffer,
          constantBuffer: constantBuffer || {},
          uniformLocations,
          attributeLocations,
          isPicking: name === "pick",
          vertexShader,
          fragmentShader
        };
      }
    }, {
      key: "bindProgram",
      value: function bindProgram(program) {
        var _this = this;
        var offset = 0;
        var gl = program.gl, buffer = program.buffer;
        if (!this.isInstanced) {
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          offset = 0;
          this.ATTRIBUTES.forEach(function(attr) {
            return offset += _this.bindAttribute(attr, program, offset);
          });
          gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);
        } else {
          gl.bindBuffer(gl.ARRAY_BUFFER, program.constantBuffer);
          offset = 0;
          this.CONSTANT_ATTRIBUTES.forEach(function(attr) {
            return offset += _this.bindAttribute(attr, program, offset, false);
          });
          gl.bufferData(gl.ARRAY_BUFFER, this.constantArray, gl.STATIC_DRAW);
          gl.bindBuffer(gl.ARRAY_BUFFER, program.buffer);
          offset = 0;
          this.ATTRIBUTES.forEach(function(attr) {
            return offset += _this.bindAttribute(attr, program, offset, true);
          });
          gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
      }
    }, {
      key: "unbindProgram",
      value: function unbindProgram(program) {
        var _this2 = this;
        if (!this.isInstanced) {
          this.ATTRIBUTES.forEach(function(attr) {
            return _this2.unbindAttribute(attr, program);
          });
        } else {
          this.CONSTANT_ATTRIBUTES.forEach(function(attr) {
            return _this2.unbindAttribute(attr, program, false);
          });
          this.ATTRIBUTES.forEach(function(attr) {
            return _this2.unbindAttribute(attr, program, true);
          });
        }
      }
    }, {
      key: "bindAttribute",
      value: function bindAttribute(attr, program, offset, setDivisor) {
        var sizeFactor = SIZE_FACTOR_PER_ATTRIBUTE_TYPE[attr.type];
        if (typeof sizeFactor !== "number") throw new Error('Program.bind: yet unsupported attribute type "'.concat(attr.type, '"'));
        var location = program.attributeLocations[attr.name];
        var gl = program.gl;
        if (location !== -1) {
          gl.enableVertexAttribArray(location);
          var stride = !this.isInstanced ? this.ATTRIBUTES_ITEMS_COUNT * Float32Array.BYTES_PER_ELEMENT : (setDivisor ? this.ATTRIBUTES_ITEMS_COUNT : getAttributesItemsCount(this.CONSTANT_ATTRIBUTES)) * Float32Array.BYTES_PER_ELEMENT;
          gl.vertexAttribPointer(location, attr.size, attr.type, attr.normalized || false, stride, offset);
          if (this.isInstanced && setDivisor) {
            if (gl instanceof WebGL2RenderingContext) {
              gl.vertexAttribDivisor(location, 1);
            } else {
              var ext = gl.getExtension("ANGLE_instanced_arrays");
              if (ext) ext.vertexAttribDivisorANGLE(location, 1);
            }
          }
        }
        return attr.size * sizeFactor;
      }
    }, {
      key: "unbindAttribute",
      value: function unbindAttribute(attr, program, unsetDivisor) {
        var location = program.attributeLocations[attr.name];
        var gl = program.gl;
        if (location !== -1) {
          gl.disableVertexAttribArray(location);
          if (this.isInstanced && unsetDivisor) {
            if (gl instanceof WebGL2RenderingContext) {
              gl.vertexAttribDivisor(location, 0);
            } else {
              var ext = gl.getExtension("ANGLE_instanced_arrays");
              if (ext) ext.vertexAttribDivisorANGLE(location, 0);
            }
          }
        }
      }
    }, {
      key: "reallocate",
      value: function reallocate(capacity) {
        if (capacity === this.capacity) return;
        this.capacity = capacity;
        this.verticesCount = this.VERTICES * capacity;
        this.array = new Float32Array(!this.isInstanced ? this.verticesCount * this.ATTRIBUTES_ITEMS_COUNT : this.capacity * this.ATTRIBUTES_ITEMS_COUNT);
      }
    }, {
      key: "hasNothingToRender",
      value: function hasNothingToRender() {
        return this.verticesCount === 0;
      }
    }, {
      key: "renderProgram",
      value: function renderProgram(params, programInfo) {
        var gl = programInfo.gl, program = programInfo.program;
        gl.enable(gl.BLEND);
        gl.useProgram(program);
        this.setUniforms(params, programInfo);
        this.drawWebGL(this.METHOD, programInfo);
      }
    }, {
      key: "render",
      value: function render(params) {
        if (this.hasNothingToRender()) return;
        if (this.pickProgram) {
          this.pickProgram.gl.viewport(0, 0, params.width * params.pixelRatio / params.downSizingRatio, params.height * params.pixelRatio / params.downSizingRatio);
          this.bindProgram(this.pickProgram);
          this.renderProgram(_objectSpread2(_objectSpread2({}, params), {}, {
            pixelRatio: params.pixelRatio / params.downSizingRatio
          }), this.pickProgram);
          this.unbindProgram(this.pickProgram);
        }
        this.normalProgram.gl.viewport(0, 0, params.width * params.pixelRatio, params.height * params.pixelRatio);
        this.bindProgram(this.normalProgram);
        this.renderProgram(params, this.normalProgram);
        this.unbindProgram(this.normalProgram);
      }
    }, {
      key: "drawWebGL",
      value: function drawWebGL(method, _ref) {
        var gl = _ref.gl, frameBuffer = _ref.frameBuffer;
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        if (!this.isInstanced) {
          gl.drawArrays(method, 0, this.verticesCount);
        } else {
          if (gl instanceof WebGL2RenderingContext) {
            gl.drawArraysInstanced(method, 0, this.VERTICES, this.capacity);
          } else {
            var ext = gl.getExtension("ANGLE_instanced_arrays");
            if (ext) ext.drawArraysInstancedANGLE(method, 0, this.VERTICES, this.capacity);
          }
        }
      }
    }]);
  }();
  var NodeProgram = /* @__PURE__ */ function(_ref) {
    function NodeProgram2() {
      _classCallCheck(this, NodeProgram2);
      return _callSuper(this, NodeProgram2, arguments);
    }
    _inherits(NodeProgram2, _ref);
    return _createClass(NodeProgram2, [{
      key: "kill",
      value: function kill() {
        _superPropGet(NodeProgram2, "kill", this, 3)([]);
      }
    }, {
      key: "process",
      value: function process(nodeIndex, offset, data) {
        var i = offset * this.STRIDE;
        if (data.hidden) {
          for (var l = i + this.STRIDE; i < l; i++) {
            this.array[i] = 0;
          }
          return;
        }
        return this.processVisibleItem(indexToColor(nodeIndex), i, data);
      }
    }]);
  }(Program);
  var EdgeProgram = /* @__PURE__ */ function(_ref) {
    function EdgeProgram2() {
      var _this;
      _classCallCheck(this, EdgeProgram2);
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      _this = _callSuper(this, EdgeProgram2, [].concat(args));
      _defineProperty(_this, "drawLabel", void 0);
      return _this;
    }
    _inherits(EdgeProgram2, _ref);
    return _createClass(EdgeProgram2, [{
      key: "kill",
      value: function kill() {
        _superPropGet(EdgeProgram2, "kill", this, 3)([]);
      }
    }, {
      key: "process",
      value: function process(edgeIndex, offset, sourceData, targetData, data) {
        var i = offset * this.STRIDE;
        if (data.hidden || sourceData.hidden || targetData.hidden) {
          for (var l = i + this.STRIDE; i < l; i++) {
            this.array[i] = 0;
          }
          return;
        }
        return this.processVisibleItem(indexToColor(edgeIndex), i, sourceData, targetData, data);
      }
    }]);
  }(Program);
  function createEdgeCompoundProgram(programClasses, drawLabel) {
    return /* @__PURE__ */ function() {
      function EdgeCompoundProgram(gl, pickingBuffer, renderer2) {
        _classCallCheck(this, EdgeCompoundProgram);
        _defineProperty(this, "drawLabel", drawLabel);
        this.programs = programClasses.map(function(Program2) {
          return new Program2(gl, pickingBuffer, renderer2);
        });
      }
      return _createClass(EdgeCompoundProgram, [{
        key: "reallocate",
        value: function reallocate(capacity) {
          this.programs.forEach(function(program) {
            return program.reallocate(capacity);
          });
        }
      }, {
        key: "process",
        value: function process(edgeIndex, offset, sourceData, targetData, data) {
          this.programs.forEach(function(program) {
            return program.process(edgeIndex, offset, sourceData, targetData, data);
          });
        }
      }, {
        key: "render",
        value: function render(params) {
          this.programs.forEach(function(program) {
            return program.render(params);
          });
        }
      }, {
        key: "kill",
        value: function kill() {
          this.programs.forEach(function(program) {
            return program.kill();
          });
        }
      }]);
    }();
  }
  function drawStraightEdgeLabel(context, edgeData, sourceData, targetData, settings) {
    var size = settings.edgeLabelSize, font = settings.edgeLabelFont, weight = settings.edgeLabelWeight, color = settings.edgeLabelColor.attribute ? edgeData[settings.edgeLabelColor.attribute] || settings.edgeLabelColor.color || "#000" : settings.edgeLabelColor.color;
    var label = edgeData.label;
    if (!label) return;
    context.fillStyle = color;
    context.font = "".concat(weight, " ").concat(size, "px ").concat(font);
    var sSize = sourceData.size;
    var tSize = targetData.size;
    var sx = sourceData.x;
    var sy = sourceData.y;
    var tx = targetData.x;
    var ty = targetData.y;
    var cx = (sx + tx) / 2;
    var cy = (sy + ty) / 2;
    var dx = tx - sx;
    var dy = ty - sy;
    var d = Math.sqrt(dx * dx + dy * dy);
    if (d < sSize + tSize) return;
    sx += dx * sSize / d;
    sy += dy * sSize / d;
    tx -= dx * tSize / d;
    ty -= dy * tSize / d;
    cx = (sx + tx) / 2;
    cy = (sy + ty) / 2;
    dx = tx - sx;
    dy = ty - sy;
    d = Math.sqrt(dx * dx + dy * dy);
    var textLength = context.measureText(label).width;
    if (textLength > d) {
      var ellipsis = "\u2026";
      label = label + ellipsis;
      textLength = context.measureText(label).width;
      while (textLength > d && label.length > 1) {
        label = label.slice(0, -2) + ellipsis;
        textLength = context.measureText(label).width;
      }
      if (label.length < 4) return;
    }
    var angle;
    if (dx > 0) {
      if (dy > 0) angle = Math.acos(dx / d);
      else angle = Math.asin(dy / d);
    } else {
      if (dy > 0) angle = Math.acos(dx / d) + Math.PI;
      else angle = Math.asin(dx / d) + Math.PI / 2;
    }
    context.save();
    context.translate(cx, cy);
    context.rotate(angle);
    context.fillText(label, -textLength / 2, edgeData.size / 2 + size);
    context.restore();
  }
  function drawDiscNodeLabel(context, data, settings) {
    if (!data.label) return;
    var size = settings.labelSize, font = settings.labelFont, weight = settings.labelWeight, color = settings.labelColor.attribute ? data[settings.labelColor.attribute] || settings.labelColor.color || "#000" : settings.labelColor.color;
    context.fillStyle = color;
    context.font = "".concat(weight, " ").concat(size, "px ").concat(font);
    context.fillText(data.label, data.x + data.size + 3, data.y + size / 3);
  }
  function drawDiscNodeHover(context, data, settings) {
    var size = settings.labelSize, font = settings.labelFont, weight = settings.labelWeight;
    context.font = "".concat(weight, " ").concat(size, "px ").concat(font);
    context.fillStyle = "#FFF";
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 8;
    context.shadowColor = "#000";
    var PADDING = 2;
    if (typeof data.label === "string") {
      var textWidth = context.measureText(data.label).width, boxWidth = Math.round(textWidth + 5), boxHeight = Math.round(size + 2 * PADDING), radius = Math.max(data.size, size / 2) + PADDING;
      var angleRadian = Math.asin(boxHeight / 2 / radius);
      var xDeltaCoord = Math.sqrt(Math.abs(Math.pow(radius, 2) - Math.pow(boxHeight / 2, 2)));
      context.beginPath();
      context.moveTo(data.x + xDeltaCoord, data.y + boxHeight / 2);
      context.lineTo(data.x + radius + boxWidth, data.y + boxHeight / 2);
      context.lineTo(data.x + radius + boxWidth, data.y - boxHeight / 2);
      context.lineTo(data.x + xDeltaCoord, data.y - boxHeight / 2);
      context.arc(data.x, data.y, radius, angleRadian, -angleRadian);
      context.closePath();
      context.fill();
    } else {
      context.beginPath();
      context.arc(data.x, data.y, data.size + PADDING, 0, Math.PI * 2);
      context.closePath();
      context.fill();
    }
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 0;
    drawDiscNodeLabel(context, data, settings);
  }
  var SHADER_SOURCE$6 = (
    /*glsl*/
    "\nprecision highp float;\n\nvarying vec4 v_color;\nvarying vec2 v_diffVector;\nvarying float v_radius;\n\nuniform float u_correctionRatio;\n\nconst vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);\n\nvoid main(void) {\n  float border = u_correctionRatio * 2.0;\n  float dist = length(v_diffVector) - v_radius + border;\n\n  // No antialiasing for picking mode:\n  #ifdef PICKING_MODE\n  if (dist > border)\n    gl_FragColor = transparent;\n  else\n    gl_FragColor = v_color;\n\n  #else\n  float t = 0.0;\n  if (dist > border)\n    t = 1.0;\n  else if (dist > 0.0)\n    t = dist / border;\n\n  gl_FragColor = mix(v_color, transparent, t);\n  #endif\n}\n"
  );
  var FRAGMENT_SHADER_SOURCE$2 = SHADER_SOURCE$6;
  var SHADER_SOURCE$5 = (
    /*glsl*/
    "\nattribute vec4 a_id;\nattribute vec4 a_color;\nattribute vec2 a_position;\nattribute float a_size;\nattribute float a_angle;\n\nuniform mat3 u_matrix;\nuniform float u_sizeRatio;\nuniform float u_correctionRatio;\n\nvarying vec4 v_color;\nvarying vec2 v_diffVector;\nvarying float v_radius;\nvarying float v_border;\n\nconst float bias = 255.0 / 254.0;\n\nvoid main() {\n  float size = a_size * u_correctionRatio / u_sizeRatio * 4.0;\n  vec2 diffVector = size * vec2(cos(a_angle), sin(a_angle));\n  vec2 position = a_position + diffVector;\n  gl_Position = vec4(\n    (u_matrix * vec3(position, 1)).xy,\n    0,\n    1\n  );\n\n  v_diffVector = diffVector;\n  v_radius = size / 2.0;\n\n  #ifdef PICKING_MODE\n  // For picking mode, we use the ID as the color:\n  v_color = a_id;\n  #else\n  // For normal mode, we use the color:\n  v_color = a_color;\n  #endif\n\n  v_color.a *= bias;\n}\n"
  );
  var VERTEX_SHADER_SOURCE$3 = SHADER_SOURCE$5;
  var _WebGLRenderingContex$3 = WebGLRenderingContext;
  var UNSIGNED_BYTE$3 = _WebGLRenderingContex$3.UNSIGNED_BYTE;
  var FLOAT$3 = _WebGLRenderingContex$3.FLOAT;
  var UNIFORMS$3 = ["u_sizeRatio", "u_correctionRatio", "u_matrix"];
  var NodeCircleProgram = /* @__PURE__ */ function(_NodeProgram) {
    function NodeCircleProgram2() {
      _classCallCheck(this, NodeCircleProgram2);
      return _callSuper(this, NodeCircleProgram2, arguments);
    }
    _inherits(NodeCircleProgram2, _NodeProgram);
    return _createClass(NodeCircleProgram2, [{
      key: "getDefinition",
      value: function getDefinition() {
        return {
          VERTICES: 3,
          VERTEX_SHADER_SOURCE: VERTEX_SHADER_SOURCE$3,
          FRAGMENT_SHADER_SOURCE: FRAGMENT_SHADER_SOURCE$2,
          METHOD: WebGLRenderingContext.TRIANGLES,
          UNIFORMS: UNIFORMS$3,
          ATTRIBUTES: [{
            name: "a_position",
            size: 2,
            type: FLOAT$3
          }, {
            name: "a_size",
            size: 1,
            type: FLOAT$3
          }, {
            name: "a_color",
            size: 4,
            type: UNSIGNED_BYTE$3,
            normalized: true
          }, {
            name: "a_id",
            size: 4,
            type: UNSIGNED_BYTE$3,
            normalized: true
          }],
          CONSTANT_ATTRIBUTES: [{
            name: "a_angle",
            size: 1,
            type: FLOAT$3
          }],
          CONSTANT_DATA: [[NodeCircleProgram2.ANGLE_1], [NodeCircleProgram2.ANGLE_2], [NodeCircleProgram2.ANGLE_3]]
        };
      }
    }, {
      key: "processVisibleItem",
      value: function processVisibleItem(nodeIndex, startIndex, data) {
        var array = this.array;
        var color = floatColor(data.color);
        array[startIndex++] = data.x;
        array[startIndex++] = data.y;
        array[startIndex++] = data.size;
        array[startIndex++] = color;
        array[startIndex++] = nodeIndex;
      }
    }, {
      key: "setUniforms",
      value: function setUniforms(params, _ref) {
        var gl = _ref.gl, uniformLocations = _ref.uniformLocations;
        var u_sizeRatio = uniformLocations.u_sizeRatio, u_correctionRatio = uniformLocations.u_correctionRatio, u_matrix = uniformLocations.u_matrix;
        gl.uniform1f(u_correctionRatio, params.correctionRatio);
        gl.uniform1f(u_sizeRatio, params.sizeRatio);
        gl.uniformMatrix3fv(u_matrix, false, params.matrix);
      }
    }]);
  }(NodeProgram);
  _defineProperty(NodeCircleProgram, "ANGLE_1", 0);
  _defineProperty(NodeCircleProgram, "ANGLE_2", 2 * Math.PI / 3);
  _defineProperty(NodeCircleProgram, "ANGLE_3", 4 * Math.PI / 3);
  var SHADER_SOURCE$4 = (
    /*glsl*/
    "\nprecision mediump float;\n\nvarying vec4 v_color;\n\nvoid main(void) {\n  gl_FragColor = v_color;\n}\n"
  );
  var FRAGMENT_SHADER_SOURCE$1 = SHADER_SOURCE$4;
  var SHADER_SOURCE$3 = (
    /*glsl*/
    "\nattribute vec2 a_position;\nattribute vec2 a_normal;\nattribute float a_radius;\nattribute vec3 a_barycentric;\n\n#ifdef PICKING_MODE\nattribute vec4 a_id;\n#else\nattribute vec4 a_color;\n#endif\n\nuniform mat3 u_matrix;\nuniform float u_sizeRatio;\nuniform float u_correctionRatio;\nuniform float u_minEdgeThickness;\nuniform float u_lengthToThicknessRatio;\nuniform float u_widenessToThicknessRatio;\n\nvarying vec4 v_color;\n\nconst float bias = 255.0 / 254.0;\n\nvoid main() {\n  float minThickness = u_minEdgeThickness;\n\n  float normalLength = length(a_normal);\n  vec2 unitNormal = a_normal / normalLength;\n\n  // These first computations are taken from edge.vert.glsl and\n  // edge.clamped.vert.glsl. Please read it to get better comments on what's\n  // happening:\n  float pixelsThickness = max(normalLength / u_sizeRatio, minThickness);\n  float webGLThickness = pixelsThickness * u_correctionRatio;\n  float webGLNodeRadius = a_radius * 2.0 * u_correctionRatio / u_sizeRatio;\n  float webGLArrowHeadLength = webGLThickness * u_lengthToThicknessRatio * 2.0;\n  float webGLArrowHeadThickness = webGLThickness * u_widenessToThicknessRatio;\n\n  float da = a_barycentric.x;\n  float db = a_barycentric.y;\n  float dc = a_barycentric.z;\n\n  vec2 delta = vec2(\n      da * (webGLNodeRadius * unitNormal.y)\n    + db * ((webGLNodeRadius + webGLArrowHeadLength) * unitNormal.y + webGLArrowHeadThickness * unitNormal.x)\n    + dc * ((webGLNodeRadius + webGLArrowHeadLength) * unitNormal.y - webGLArrowHeadThickness * unitNormal.x),\n\n      da * (-webGLNodeRadius * unitNormal.x)\n    + db * (-(webGLNodeRadius + webGLArrowHeadLength) * unitNormal.x + webGLArrowHeadThickness * unitNormal.y)\n    + dc * (-(webGLNodeRadius + webGLArrowHeadLength) * unitNormal.x - webGLArrowHeadThickness * unitNormal.y)\n  );\n\n  vec2 position = (u_matrix * vec3(a_position + delta, 1)).xy;\n\n  gl_Position = vec4(position, 0, 1);\n\n  #ifdef PICKING_MODE\n  // For picking mode, we use the ID as the color:\n  v_color = a_id;\n  #else\n  // For normal mode, we use the color:\n  v_color = a_color;\n  #endif\n\n  v_color.a *= bias;\n}\n"
  );
  var VERTEX_SHADER_SOURCE$2 = SHADER_SOURCE$3;
  var _WebGLRenderingContex$2 = WebGLRenderingContext;
  var UNSIGNED_BYTE$2 = _WebGLRenderingContex$2.UNSIGNED_BYTE;
  var FLOAT$2 = _WebGLRenderingContex$2.FLOAT;
  var UNIFORMS$2 = ["u_matrix", "u_sizeRatio", "u_correctionRatio", "u_minEdgeThickness", "u_lengthToThicknessRatio", "u_widenessToThicknessRatio"];
  var DEFAULT_EDGE_ARROW_HEAD_PROGRAM_OPTIONS = {
    extremity: "target",
    lengthToThicknessRatio: 2.5,
    widenessToThicknessRatio: 2
  };
  function createEdgeArrowHeadProgram(inputOptions) {
    var options = _objectSpread2(_objectSpread2({}, DEFAULT_EDGE_ARROW_HEAD_PROGRAM_OPTIONS), inputOptions || {});
    return /* @__PURE__ */ function(_EdgeProgram) {
      function EdgeArrowHeadProgram2() {
        _classCallCheck(this, EdgeArrowHeadProgram2);
        return _callSuper(this, EdgeArrowHeadProgram2, arguments);
      }
      _inherits(EdgeArrowHeadProgram2, _EdgeProgram);
      return _createClass(EdgeArrowHeadProgram2, [{
        key: "getDefinition",
        value: function getDefinition() {
          return {
            VERTICES: 3,
            VERTEX_SHADER_SOURCE: VERTEX_SHADER_SOURCE$2,
            FRAGMENT_SHADER_SOURCE: FRAGMENT_SHADER_SOURCE$1,
            METHOD: WebGLRenderingContext.TRIANGLES,
            UNIFORMS: UNIFORMS$2,
            ATTRIBUTES: [{
              name: "a_position",
              size: 2,
              type: FLOAT$2
            }, {
              name: "a_normal",
              size: 2,
              type: FLOAT$2
            }, {
              name: "a_radius",
              size: 1,
              type: FLOAT$2
            }, {
              name: "a_color",
              size: 4,
              type: UNSIGNED_BYTE$2,
              normalized: true
            }, {
              name: "a_id",
              size: 4,
              type: UNSIGNED_BYTE$2,
              normalized: true
            }],
            CONSTANT_ATTRIBUTES: [{
              name: "a_barycentric",
              size: 3,
              type: FLOAT$2
            }],
            CONSTANT_DATA: [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
          };
        }
      }, {
        key: "processVisibleItem",
        value: function processVisibleItem(edgeIndex, startIndex, sourceData, targetData, data) {
          if (options.extremity === "source") {
            var _ref = [targetData, sourceData];
            sourceData = _ref[0];
            targetData = _ref[1];
          }
          var thickness = data.size || 1;
          var radius = targetData.size || 1;
          var x1 = sourceData.x;
          var y1 = sourceData.y;
          var x2 = targetData.x;
          var y2 = targetData.y;
          var color = floatColor(data.color);
          var dx = x2 - x1;
          var dy = y2 - y1;
          var len = dx * dx + dy * dy;
          var n1 = 0;
          var n2 = 0;
          if (len) {
            len = 1 / Math.sqrt(len);
            n1 = -dy * len * thickness;
            n2 = dx * len * thickness;
          }
          var array = this.array;
          array[startIndex++] = x2;
          array[startIndex++] = y2;
          array[startIndex++] = -n1;
          array[startIndex++] = -n2;
          array[startIndex++] = radius;
          array[startIndex++] = color;
          array[startIndex++] = edgeIndex;
        }
      }, {
        key: "setUniforms",
        value: function setUniforms(params, _ref2) {
          var gl = _ref2.gl, uniformLocations = _ref2.uniformLocations;
          var u_matrix = uniformLocations.u_matrix, u_sizeRatio = uniformLocations.u_sizeRatio, u_correctionRatio = uniformLocations.u_correctionRatio, u_minEdgeThickness = uniformLocations.u_minEdgeThickness, u_lengthToThicknessRatio = uniformLocations.u_lengthToThicknessRatio, u_widenessToThicknessRatio = uniformLocations.u_widenessToThicknessRatio;
          gl.uniformMatrix3fv(u_matrix, false, params.matrix);
          gl.uniform1f(u_sizeRatio, params.sizeRatio);
          gl.uniform1f(u_correctionRatio, params.correctionRatio);
          gl.uniform1f(u_minEdgeThickness, params.minEdgeThickness);
          gl.uniform1f(u_lengthToThicknessRatio, options.lengthToThicknessRatio);
          gl.uniform1f(u_widenessToThicknessRatio, options.widenessToThicknessRatio);
        }
      }]);
    }(EdgeProgram);
  }
  var EdgeArrowHeadProgram = createEdgeArrowHeadProgram();
  var SHADER_SOURCE$2 = (
    /*glsl*/
    "\nprecision mediump float;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\nvarying float v_feather;\n\nconst vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);\n\nvoid main(void) {\n  // We only handle antialiasing for normal mode:\n  #ifdef PICKING_MODE\n  gl_FragColor = v_color;\n  #else\n  float dist = length(v_normal) * v_thickness;\n\n  float t = smoothstep(\n    v_thickness - v_feather,\n    v_thickness,\n    dist\n  );\n\n  gl_FragColor = mix(v_color, transparent, t);\n  #endif\n}\n"
  );
  var FRAGMENT_SHADER_SOURCE = SHADER_SOURCE$2;
  var SHADER_SOURCE$1 = (
    /*glsl*/
    "\nattribute vec4 a_id;\nattribute vec4 a_color;\nattribute vec2 a_normal;\nattribute float a_normalCoef;\nattribute vec2 a_positionStart;\nattribute vec2 a_positionEnd;\nattribute float a_positionCoef;\nattribute float a_radius;\nattribute float a_radiusCoef;\n\nuniform mat3 u_matrix;\nuniform float u_zoomRatio;\nuniform float u_sizeRatio;\nuniform float u_pixelRatio;\nuniform float u_correctionRatio;\nuniform float u_minEdgeThickness;\nuniform float u_lengthToThicknessRatio;\nuniform float u_feather;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\nvarying float v_feather;\n\nconst float bias = 255.0 / 254.0;\n\nvoid main() {\n  float minThickness = u_minEdgeThickness;\n\n  float radius = a_radius * a_radiusCoef;\n  vec2 normal = a_normal * a_normalCoef;\n  vec2 position = a_positionStart * (1.0 - a_positionCoef) + a_positionEnd * a_positionCoef;\n\n  float normalLength = length(normal);\n  vec2 unitNormal = normal / normalLength;\n\n  // These first computations are taken from edge.vert.glsl. Please read it to\n  // get better comments on what's happening:\n  float pixelsThickness = max(normalLength, minThickness * u_sizeRatio);\n  float webGLThickness = pixelsThickness * u_correctionRatio / u_sizeRatio;\n\n  // Here, we move the point to leave space for the arrow head:\n  float direction = sign(radius);\n  float webGLNodeRadius = direction * radius * 2.0 * u_correctionRatio / u_sizeRatio;\n  float webGLArrowHeadLength = webGLThickness * u_lengthToThicknessRatio * 2.0;\n\n  vec2 compensationVector = vec2(-direction * unitNormal.y, direction * unitNormal.x) * (webGLNodeRadius + webGLArrowHeadLength);\n\n  // Here is the proper position of the vertex\n  gl_Position = vec4((u_matrix * vec3(position + unitNormal * webGLThickness + compensationVector, 1)).xy, 0, 1);\n\n  v_thickness = webGLThickness / u_zoomRatio;\n\n  v_normal = unitNormal;\n\n  v_feather = u_feather * u_correctionRatio / u_zoomRatio / u_pixelRatio * 2.0;\n\n  #ifdef PICKING_MODE\n  // For picking mode, we use the ID as the color:\n  v_color = a_id;\n  #else\n  // For normal mode, we use the color:\n  v_color = a_color;\n  #endif\n\n  v_color.a *= bias;\n}\n"
  );
  var VERTEX_SHADER_SOURCE$1 = SHADER_SOURCE$1;
  var _WebGLRenderingContex$1 = WebGLRenderingContext;
  var UNSIGNED_BYTE$1 = _WebGLRenderingContex$1.UNSIGNED_BYTE;
  var FLOAT$1 = _WebGLRenderingContex$1.FLOAT;
  var UNIFORMS$1 = ["u_matrix", "u_zoomRatio", "u_sizeRatio", "u_correctionRatio", "u_pixelRatio", "u_feather", "u_minEdgeThickness", "u_lengthToThicknessRatio"];
  var DEFAULT_EDGE_CLAMPED_PROGRAM_OPTIONS = {
    lengthToThicknessRatio: DEFAULT_EDGE_ARROW_HEAD_PROGRAM_OPTIONS.lengthToThicknessRatio
  };
  function createEdgeClampedProgram(inputOptions) {
    var options = _objectSpread2(_objectSpread2({}, DEFAULT_EDGE_CLAMPED_PROGRAM_OPTIONS), inputOptions || {});
    return /* @__PURE__ */ function(_EdgeProgram) {
      function EdgeClampedProgram2() {
        _classCallCheck(this, EdgeClampedProgram2);
        return _callSuper(this, EdgeClampedProgram2, arguments);
      }
      _inherits(EdgeClampedProgram2, _EdgeProgram);
      return _createClass(EdgeClampedProgram2, [{
        key: "getDefinition",
        value: function getDefinition() {
          return {
            VERTICES: 6,
            VERTEX_SHADER_SOURCE: VERTEX_SHADER_SOURCE$1,
            FRAGMENT_SHADER_SOURCE,
            METHOD: WebGLRenderingContext.TRIANGLES,
            UNIFORMS: UNIFORMS$1,
            ATTRIBUTES: [{
              name: "a_positionStart",
              size: 2,
              type: FLOAT$1
            }, {
              name: "a_positionEnd",
              size: 2,
              type: FLOAT$1
            }, {
              name: "a_normal",
              size: 2,
              type: FLOAT$1
            }, {
              name: "a_color",
              size: 4,
              type: UNSIGNED_BYTE$1,
              normalized: true
            }, {
              name: "a_id",
              size: 4,
              type: UNSIGNED_BYTE$1,
              normalized: true
            }, {
              name: "a_radius",
              size: 1,
              type: FLOAT$1
            }],
            CONSTANT_ATTRIBUTES: [
              // If 0, then position will be a_positionStart
              // If 1, then position will be a_positionEnd
              {
                name: "a_positionCoef",
                size: 1,
                type: FLOAT$1
              },
              {
                name: "a_normalCoef",
                size: 1,
                type: FLOAT$1
              },
              {
                name: "a_radiusCoef",
                size: 1,
                type: FLOAT$1
              }
            ],
            CONSTANT_DATA: [[0, 1, 0], [0, -1, 0], [1, 1, 1], [1, 1, 1], [0, -1, 0], [1, -1, -1]]
          };
        }
      }, {
        key: "processVisibleItem",
        value: function processVisibleItem(edgeIndex, startIndex, sourceData, targetData, data) {
          var thickness = data.size || 1;
          var x1 = sourceData.x;
          var y1 = sourceData.y;
          var x2 = targetData.x;
          var y2 = targetData.y;
          var color = floatColor(data.color);
          var dx = x2 - x1;
          var dy = y2 - y1;
          var radius = targetData.size || 1;
          var len = dx * dx + dy * dy;
          var n1 = 0;
          var n2 = 0;
          if (len) {
            len = 1 / Math.sqrt(len);
            n1 = -dy * len * thickness;
            n2 = dx * len * thickness;
          }
          var array = this.array;
          array[startIndex++] = x1;
          array[startIndex++] = y1;
          array[startIndex++] = x2;
          array[startIndex++] = y2;
          array[startIndex++] = n1;
          array[startIndex++] = n2;
          array[startIndex++] = color;
          array[startIndex++] = edgeIndex;
          array[startIndex++] = radius;
        }
      }, {
        key: "setUniforms",
        value: function setUniforms(params, _ref) {
          var gl = _ref.gl, uniformLocations = _ref.uniformLocations;
          var u_matrix = uniformLocations.u_matrix, u_zoomRatio = uniformLocations.u_zoomRatio, u_feather = uniformLocations.u_feather, u_pixelRatio = uniformLocations.u_pixelRatio, u_correctionRatio = uniformLocations.u_correctionRatio, u_sizeRatio = uniformLocations.u_sizeRatio, u_minEdgeThickness = uniformLocations.u_minEdgeThickness, u_lengthToThicknessRatio = uniformLocations.u_lengthToThicknessRatio;
          gl.uniformMatrix3fv(u_matrix, false, params.matrix);
          gl.uniform1f(u_zoomRatio, params.zoomRatio);
          gl.uniform1f(u_sizeRatio, params.sizeRatio);
          gl.uniform1f(u_correctionRatio, params.correctionRatio);
          gl.uniform1f(u_pixelRatio, params.pixelRatio);
          gl.uniform1f(u_feather, params.antiAliasingFeather);
          gl.uniform1f(u_minEdgeThickness, params.minEdgeThickness);
          gl.uniform1f(u_lengthToThicknessRatio, options.lengthToThicknessRatio);
        }
      }]);
    }(EdgeProgram);
  }
  var EdgeClampedProgram = createEdgeClampedProgram();
  function createEdgeArrowProgram(inputOptions) {
    return createEdgeCompoundProgram([createEdgeClampedProgram(inputOptions), createEdgeArrowHeadProgram(inputOptions)]);
  }
  var EdgeArrowProgram = createEdgeArrowProgram();
  var EdgeArrowProgram$1 = EdgeArrowProgram;
  var SHADER_SOURCE = (
    /*glsl*/
    `
attribute vec4 a_id;
attribute vec4 a_color;
attribute vec2 a_normal;
attribute float a_normalCoef;
attribute vec2 a_positionStart;
attribute vec2 a_positionEnd;
attribute float a_positionCoef;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_zoomRatio;
uniform float u_pixelRatio;
uniform float u_correctionRatio;
uniform float u_minEdgeThickness;
uniform float u_feather;

varying vec4 v_color;
varying vec2 v_normal;
varying float v_thickness;
varying float v_feather;

const float bias = 255.0 / 254.0;

void main() {
  float minThickness = u_minEdgeThickness;

  vec2 normal = a_normal * a_normalCoef;
  vec2 position = a_positionStart * (1.0 - a_positionCoef) + a_positionEnd * a_positionCoef;

  float normalLength = length(normal);
  vec2 unitNormal = normal / normalLength;

  // We require edges to be at least "minThickness" pixels thick *on screen*
  // (so we need to compensate the size ratio):
  float pixelsThickness = max(normalLength, minThickness * u_sizeRatio);

  // Then, we need to retrieve the normalized thickness of the edge in the WebGL
  // referential (in a ([0, 1], [0, 1]) space), using our "magic" correction
  // ratio:
  float webGLThickness = pixelsThickness * u_correctionRatio / u_sizeRatio;

  // Here is the proper position of the vertex
  gl_Position = vec4((u_matrix * vec3(position + unitNormal * webGLThickness, 1)).xy, 0, 1);

  // For the fragment shader though, we need a thickness that takes the "magic"
  // correction ratio into account (as in webGLThickness), but so that the
  // antialiasing effect does not depend on the zoom level. So here's yet
  // another thickness version:
  v_thickness = webGLThickness / u_zoomRatio;

  v_normal = unitNormal;

  v_feather = u_feather * u_correctionRatio / u_zoomRatio / u_pixelRatio * 2.0;

  #ifdef PICKING_MODE
  // For picking mode, we use the ID as the color:
  v_color = a_id;
  #else
  // For normal mode, we use the color:
  v_color = a_color;
  #endif

  v_color.a *= bias;
}
`
  );
  var VERTEX_SHADER_SOURCE = SHADER_SOURCE;
  var _WebGLRenderingContex = WebGLRenderingContext;
  var UNSIGNED_BYTE = _WebGLRenderingContex.UNSIGNED_BYTE;
  var FLOAT = _WebGLRenderingContex.FLOAT;
  var UNIFORMS = ["u_matrix", "u_zoomRatio", "u_sizeRatio", "u_correctionRatio", "u_pixelRatio", "u_feather", "u_minEdgeThickness"];
  var EdgeRectangleProgram = /* @__PURE__ */ function(_EdgeProgram) {
    function EdgeRectangleProgram2() {
      _classCallCheck(this, EdgeRectangleProgram2);
      return _callSuper(this, EdgeRectangleProgram2, arguments);
    }
    _inherits(EdgeRectangleProgram2, _EdgeProgram);
    return _createClass(EdgeRectangleProgram2, [{
      key: "getDefinition",
      value: function getDefinition() {
        return {
          VERTICES: 6,
          VERTEX_SHADER_SOURCE,
          FRAGMENT_SHADER_SOURCE,
          METHOD: WebGLRenderingContext.TRIANGLES,
          UNIFORMS,
          ATTRIBUTES: [{
            name: "a_positionStart",
            size: 2,
            type: FLOAT
          }, {
            name: "a_positionEnd",
            size: 2,
            type: FLOAT
          }, {
            name: "a_normal",
            size: 2,
            type: FLOAT
          }, {
            name: "a_color",
            size: 4,
            type: UNSIGNED_BYTE,
            normalized: true
          }, {
            name: "a_id",
            size: 4,
            type: UNSIGNED_BYTE,
            normalized: true
          }],
          CONSTANT_ATTRIBUTES: [
            // If 0, then position will be a_positionStart
            // If 2, then position will be a_positionEnd
            {
              name: "a_positionCoef",
              size: 1,
              type: FLOAT
            },
            {
              name: "a_normalCoef",
              size: 1,
              type: FLOAT
            }
          ],
          CONSTANT_DATA: [[0, 1], [0, -1], [1, 1], [1, 1], [0, -1], [1, -1]]
        };
      }
    }, {
      key: "processVisibleItem",
      value: function processVisibleItem(edgeIndex, startIndex, sourceData, targetData, data) {
        var thickness = data.size || 1;
        var x1 = sourceData.x;
        var y1 = sourceData.y;
        var x2 = targetData.x;
        var y2 = targetData.y;
        var color = floatColor(data.color);
        var dx = x2 - x1;
        var dy = y2 - y1;
        var len = dx * dx + dy * dy;
        var n1 = 0;
        var n2 = 0;
        if (len) {
          len = 1 / Math.sqrt(len);
          n1 = -dy * len * thickness;
          n2 = dx * len * thickness;
        }
        var array = this.array;
        array[startIndex++] = x1;
        array[startIndex++] = y1;
        array[startIndex++] = x2;
        array[startIndex++] = y2;
        array[startIndex++] = n1;
        array[startIndex++] = n2;
        array[startIndex++] = color;
        array[startIndex++] = edgeIndex;
      }
    }, {
      key: "setUniforms",
      value: function setUniforms(params, _ref) {
        var gl = _ref.gl, uniformLocations = _ref.uniformLocations;
        var u_matrix = uniformLocations.u_matrix, u_zoomRatio = uniformLocations.u_zoomRatio, u_feather = uniformLocations.u_feather, u_pixelRatio = uniformLocations.u_pixelRatio, u_correctionRatio = uniformLocations.u_correctionRatio, u_sizeRatio = uniformLocations.u_sizeRatio, u_minEdgeThickness = uniformLocations.u_minEdgeThickness;
        gl.uniformMatrix3fv(u_matrix, false, params.matrix);
        gl.uniform1f(u_zoomRatio, params.zoomRatio);
        gl.uniform1f(u_sizeRatio, params.sizeRatio);
        gl.uniform1f(u_correctionRatio, params.correctionRatio);
        gl.uniform1f(u_pixelRatio, params.pixelRatio);
        gl.uniform1f(u_feather, params.antiAliasingFeather);
        gl.uniform1f(u_minEdgeThickness, params.minEdgeThickness);
      }
    }]);
  }(EdgeProgram);

  // node_modules/sigma/types/dist/sigma-types.esm.js
  var import_events2 = __toESM(require_events());
  var TypedEventEmitter = /* @__PURE__ */ function(_ref) {
    function TypedEventEmitter2() {
      var _this;
      _classCallCheck(this, TypedEventEmitter2);
      _this = _callSuper(this, TypedEventEmitter2);
      _this.rawEmitter = _this;
      return _this;
    }
    _inherits(TypedEventEmitter2, _ref);
    return _createClass(TypedEventEmitter2);
  }(import_events2.EventEmitter);

  // node_modules/sigma/dist/normalization-be445518.esm.js
  var import_is_graph = __toESM(require_is_graph());
  var linear = function linear2(k) {
    return k;
  };
  var quadraticIn = function quadraticIn2(k) {
    return k * k;
  };
  var quadraticOut = function quadraticOut2(k) {
    return k * (2 - k);
  };
  var quadraticInOut = function quadraticInOut2(k) {
    if ((k *= 2) < 1) return 0.5 * k * k;
    return -0.5 * (--k * (k - 2) - 1);
  };
  var cubicIn = function cubicIn2(k) {
    return k * k * k;
  };
  var cubicOut = function cubicOut2(k) {
    return --k * k * k + 1;
  };
  var cubicInOut = function cubicInOut2(k) {
    if ((k *= 2) < 1) return 0.5 * k * k * k;
    return 0.5 * ((k -= 2) * k * k + 2);
  };
  var easings = {
    linear,
    quadraticIn,
    quadraticOut,
    quadraticInOut,
    cubicIn,
    cubicOut,
    cubicInOut
  };
  var ANIMATE_DEFAULTS = {
    easing: "quadraticInOut",
    duration: 150
  };
  function identity() {
    return Float32Array.of(1, 0, 0, 0, 1, 0, 0, 0, 1);
  }
  function scale(m, x, y) {
    m[0] = x;
    m[4] = typeof y === "number" ? y : x;
    return m;
  }
  function rotate(m, r) {
    var s = Math.sin(r), c = Math.cos(r);
    m[0] = c;
    m[1] = s;
    m[3] = -s;
    m[4] = c;
    return m;
  }
  function translate(m, x, y) {
    m[6] = x;
    m[7] = y;
    return m;
  }
  function multiply(a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2];
    var a10 = a[3], a11 = a[4], a12 = a[5];
    var a20 = a[6], a21 = a[7], a22 = a[8];
    var b00 = b[0], b01 = b[1], b02 = b[2];
    var b10 = b[3], b11 = b[4], b12 = b[5];
    var b20 = b[6], b21 = b[7], b22 = b[8];
    a[0] = b00 * a00 + b01 * a10 + b02 * a20;
    a[1] = b00 * a01 + b01 * a11 + b02 * a21;
    a[2] = b00 * a02 + b01 * a12 + b02 * a22;
    a[3] = b10 * a00 + b11 * a10 + b12 * a20;
    a[4] = b10 * a01 + b11 * a11 + b12 * a21;
    a[5] = b10 * a02 + b11 * a12 + b12 * a22;
    a[6] = b20 * a00 + b21 * a10 + b22 * a20;
    a[7] = b20 * a01 + b21 * a11 + b22 * a21;
    a[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return a;
  }
  function multiplyVec2(a, b) {
    var z = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
    var a00 = a[0];
    var a01 = a[1];
    var a10 = a[3];
    var a11 = a[4];
    var a20 = a[6];
    var a21 = a[7];
    var b0 = b.x;
    var b1 = b.y;
    return {
      x: b0 * a00 + b1 * a10 + a20 * z,
      y: b0 * a01 + b1 * a11 + a21 * z
    };
  }
  function getCorrectionRatio(viewportDimensions, graphDimensions) {
    var viewportRatio = viewportDimensions.height / viewportDimensions.width;
    var graphRatio = graphDimensions.height / graphDimensions.width;
    if (viewportRatio < 1 && graphRatio > 1 || viewportRatio > 1 && graphRatio < 1) {
      return 1;
    }
    return Math.min(Math.max(graphRatio, 1 / graphRatio), Math.max(1 / viewportRatio, viewportRatio));
  }
  function matrixFromCamera(state, viewportDimensions, graphDimensions, padding, inverse) {
    var angle = state.angle, ratio = state.ratio, x = state.x, y = state.y;
    var width = viewportDimensions.width, height = viewportDimensions.height;
    var matrix = identity();
    var smallestDimension = Math.min(width, height) - 2 * padding;
    var correctionRatio = getCorrectionRatio(viewportDimensions, graphDimensions);
    if (!inverse) {
      multiply(matrix, scale(identity(), 2 * (smallestDimension / width) * correctionRatio, 2 * (smallestDimension / height) * correctionRatio));
      multiply(matrix, rotate(identity(), -angle));
      multiply(matrix, scale(identity(), 1 / ratio));
      multiply(matrix, translate(identity(), -x, -y));
    } else {
      multiply(matrix, translate(identity(), x, y));
      multiply(matrix, scale(identity(), ratio));
      multiply(matrix, rotate(identity(), angle));
      multiply(matrix, scale(identity(), width / smallestDimension / 2 / correctionRatio, height / smallestDimension / 2 / correctionRatio));
    }
    return matrix;
  }
  function getMatrixImpact(matrix, cameraState, viewportDimensions) {
    var _multiplyVec = multiplyVec2(matrix, {
      x: Math.cos(cameraState.angle),
      y: Math.sin(cameraState.angle)
    }, 0), x = _multiplyVec.x, y = _multiplyVec.y;
    return 1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) / viewportDimensions.width;
  }
  function graphExtent(graph2) {
    if (!graph2.order) return {
      x: [0, 1],
      y: [0, 1]
    };
    var xMin = Infinity;
    var xMax = -Infinity;
    var yMin = Infinity;
    var yMax = -Infinity;
    graph2.forEachNode(function(_, attr) {
      var x = attr.x, y = attr.y;
      if (x < xMin) xMin = x;
      if (x > xMax) xMax = x;
      if (y < yMin) yMin = y;
      if (y > yMax) yMax = y;
    });
    return {
      x: [xMin, xMax],
      y: [yMin, yMax]
    };
  }
  function validateGraph(graph2) {
    if (!(0, import_is_graph.default)(graph2)) throw new Error("Sigma: invalid graph instance.");
    graph2.forEachNode(function(key, attributes) {
      if (!Number.isFinite(attributes.x) || !Number.isFinite(attributes.y)) {
        throw new Error("Sigma: Coordinates of node ".concat(key, " are invalid. A node must have a numeric 'x' and 'y' attribute."));
      }
    });
  }
  function createElement(tag, style, attributes) {
    var element = document.createElement(tag);
    if (style) {
      for (var k in style) {
        element.style[k] = style[k];
      }
    }
    if (attributes) {
      for (var _k in attributes) {
        element.setAttribute(_k, attributes[_k]);
      }
    }
    return element;
  }
  function getPixelRatio() {
    if (typeof window.devicePixelRatio !== "undefined") return window.devicePixelRatio;
    return 1;
  }
  function zIndexOrdering(_extent, getter, elements) {
    return elements.sort(function(a, b) {
      var zA = getter(a) || 0, zB = getter(b) || 0;
      if (zA < zB) return -1;
      if (zA > zB) return 1;
      return 0;
    });
  }
  function createNormalizationFunction(extent) {
    var _extent$x = _slicedToArray(extent.x, 2), minX = _extent$x[0], maxX = _extent$x[1], _extent$y = _slicedToArray(extent.y, 2), minY = _extent$y[0], maxY = _extent$y[1];
    var ratio = Math.max(maxX - minX, maxY - minY), dX = (maxX + minX) / 2, dY = (maxY + minY) / 2;
    if (ratio === 0 || Math.abs(ratio) === Infinity || isNaN(ratio)) ratio = 1;
    if (isNaN(dX)) dX = 0;
    if (isNaN(dY)) dY = 0;
    var fn = function fn2(data) {
      return {
        x: 0.5 + (data.x - dX) / ratio,
        y: 0.5 + (data.y - dY) / ratio
      };
    };
    fn.applyTo = function(data) {
      data.x = 0.5 + (data.x - dX) / ratio;
      data.y = 0.5 + (data.y - dY) / ratio;
    };
    fn.inverse = function(data) {
      return {
        x: dX + ratio * (data.x - 0.5),
        y: dY + ratio * (data.y - 0.5)
      };
    };
    fn.ratio = ratio;
    return fn;
  }

  // node_modules/sigma/dist/data-11df7124.esm.js
  function _typeof(o) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof(o);
  }
  function extend(array, values) {
    var l2 = values.size;
    if (l2 === 0) return;
    var l1 = array.length;
    array.length += l2;
    var i = 0;
    values.forEach(function(value) {
      array[l1 + i] = value;
      i++;
    });
  }
  function assign2(target) {
    target = target || {};
    for (var i = 0, l = arguments.length <= 1 ? 0 : arguments.length - 1; i < l; i++) {
      var o = i + 1 < 1 || arguments.length <= i + 1 ? void 0 : arguments[i + 1];
      if (!o) continue;
      Object.assign(target, o);
    }
    return target;
  }

  // node_modules/sigma/settings/dist/sigma-settings.esm.js
  var DEFAULT_SETTINGS = {
    // Performance
    hideEdgesOnMove: false,
    hideLabelsOnMove: false,
    renderLabels: true,
    renderEdgeLabels: false,
    enableEdgeEvents: false,
    // Component rendering
    defaultNodeColor: "#999",
    defaultNodeType: "circle",
    defaultEdgeColor: "#ccc",
    defaultEdgeType: "line",
    labelFont: "Arial",
    labelSize: 14,
    labelWeight: "normal",
    labelColor: {
      color: "#000"
    },
    edgeLabelFont: "Arial",
    edgeLabelSize: 14,
    edgeLabelWeight: "normal",
    edgeLabelColor: {
      attribute: "color"
    },
    stagePadding: 30,
    defaultDrawEdgeLabel: drawStraightEdgeLabel,
    defaultDrawNodeLabel: drawDiscNodeLabel,
    defaultDrawNodeHover: drawDiscNodeHover,
    minEdgeThickness: 1.7,
    antiAliasingFeather: 1,
    // Mouse and touch settings
    dragTimeout: 100,
    draggedEventsTolerance: 3,
    inertiaDuration: 200,
    inertiaRatio: 3,
    zoomDuration: 250,
    zoomingRatio: 1.7,
    doubleClickTimeout: 300,
    doubleClickZoomingRatio: 2.2,
    doubleClickZoomingDuration: 200,
    tapMoveTolerance: 10,
    // Size and scaling
    zoomToSizeRatioFunction: Math.sqrt,
    itemSizesReference: "screen",
    autoRescale: true,
    autoCenter: true,
    // Labels
    labelDensity: 1,
    labelGridCellSize: 100,
    labelRenderedSizeThreshold: 6,
    // Reducers
    nodeReducer: null,
    edgeReducer: null,
    // Features
    zIndex: false,
    minCameraRatio: null,
    maxCameraRatio: null,
    enableCameraZooming: true,
    enableCameraPanning: true,
    enableCameraRotation: true,
    cameraPanBoundaries: null,
    // Lifecycle
    allowInvalidContainer: false,
    // Program classes
    nodeProgramClasses: {},
    nodeHoverProgramClasses: {},
    edgeProgramClasses: {}
  };
  var DEFAULT_NODE_PROGRAM_CLASSES = {
    circle: NodeCircleProgram
  };
  var DEFAULT_EDGE_PROGRAM_CLASSES = {
    arrow: EdgeArrowProgram$1,
    line: EdgeRectangleProgram
  };
  function validateSettings(settings) {
    if (typeof settings.labelDensity !== "number" || settings.labelDensity < 0) {
      throw new Error("Settings: invalid `labelDensity`. Expecting a positive number.");
    }
    var minCameraRatio = settings.minCameraRatio, maxCameraRatio = settings.maxCameraRatio;
    if (typeof minCameraRatio === "number" && typeof maxCameraRatio === "number" && maxCameraRatio < minCameraRatio) {
      throw new Error("Settings: invalid camera ratio boundaries. Expecting `maxCameraRatio` to be greater than `minCameraRatio`.");
    }
  }
  function resolveSettings(settings) {
    var resolvedSettings = assign2({}, DEFAULT_SETTINGS, settings);
    resolvedSettings.nodeProgramClasses = assign2({}, DEFAULT_NODE_PROGRAM_CLASSES, resolvedSettings.nodeProgramClasses);
    resolvedSettings.edgeProgramClasses = assign2({}, DEFAULT_EDGE_PROGRAM_CLASSES, resolvedSettings.edgeProgramClasses);
    return resolvedSettings;
  }

  // node_modules/sigma/dist/sigma.esm.js
  var import_events3 = __toESM(require_events());
  var import_is_graph2 = __toESM(require_is_graph());
  var DEFAULT_ZOOMING_RATIO = 1.5;
  var Camera = /* @__PURE__ */ function(_TypedEventEmitter) {
    function Camera2() {
      var _this;
      _classCallCheck(this, Camera2);
      _this = _callSuper(this, Camera2);
      _defineProperty(_this, "x", 0.5);
      _defineProperty(_this, "y", 0.5);
      _defineProperty(_this, "angle", 0);
      _defineProperty(_this, "ratio", 1);
      _defineProperty(_this, "minRatio", null);
      _defineProperty(_this, "maxRatio", null);
      _defineProperty(_this, "enabledZooming", true);
      _defineProperty(_this, "enabledPanning", true);
      _defineProperty(_this, "enabledRotation", true);
      _defineProperty(_this, "clean", null);
      _defineProperty(_this, "nextFrame", null);
      _defineProperty(_this, "previousState", null);
      _defineProperty(_this, "enabled", true);
      _this.previousState = _this.getState();
      return _this;
    }
    _inherits(Camera2, _TypedEventEmitter);
    return _createClass(Camera2, [{
      key: "enable",
      value: (
        /**
         * Method used to enable the camera.
         */
        function enable() {
          this.enabled = true;
          return this;
        }
      )
      /**
       * Method used to disable the camera.
       */
    }, {
      key: "disable",
      value: function disable() {
        this.enabled = false;
        return this;
      }
      /**
       * Method used to retrieve the camera's current state.
       */
    }, {
      key: "getState",
      value: function getState() {
        return {
          x: this.x,
          y: this.y,
          angle: this.angle,
          ratio: this.ratio
        };
      }
      /**
       * Method used to check whether the camera has the given state.
       */
    }, {
      key: "hasState",
      value: function hasState(state) {
        return this.x === state.x && this.y === state.y && this.ratio === state.ratio && this.angle === state.angle;
      }
      /**
       * Method used to retrieve the camera's previous state.
       */
    }, {
      key: "getPreviousState",
      value: function getPreviousState() {
        var state = this.previousState;
        if (!state) return null;
        return {
          x: state.x,
          y: state.y,
          angle: state.angle,
          ratio: state.ratio
        };
      }
      /**
       * Method used to check minRatio and maxRatio values.
       */
    }, {
      key: "getBoundedRatio",
      value: function getBoundedRatio(ratio) {
        var r = ratio;
        if (typeof this.minRatio === "number") r = Math.max(r, this.minRatio);
        if (typeof this.maxRatio === "number") r = Math.min(r, this.maxRatio);
        return r;
      }
      /**
       * Method used to check various things to return a legit state candidate.
       */
    }, {
      key: "validateState",
      value: function validateState(state) {
        var validatedState = {};
        if (this.enabledPanning && typeof state.x === "number") validatedState.x = state.x;
        if (this.enabledPanning && typeof state.y === "number") validatedState.y = state.y;
        if (this.enabledZooming && typeof state.ratio === "number") validatedState.ratio = this.getBoundedRatio(state.ratio);
        if (this.enabledRotation && typeof state.angle === "number") validatedState.angle = state.angle;
        return this.clean ? this.clean(_objectSpread2(_objectSpread2({}, this.getState()), validatedState)) : validatedState;
      }
      /**
       * Method used to check whether the camera is currently being animated.
       */
    }, {
      key: "isAnimated",
      value: function isAnimated() {
        return !!this.nextFrame;
      }
      /**
       * Method used to set the camera's state.
       */
    }, {
      key: "setState",
      value: function setState(state) {
        if (!this.enabled) return this;
        this.previousState = this.getState();
        var validState = this.validateState(state);
        if (typeof validState.x === "number") this.x = validState.x;
        if (typeof validState.y === "number") this.y = validState.y;
        if (typeof validState.ratio === "number") this.ratio = validState.ratio;
        if (typeof validState.angle === "number") this.angle = validState.angle;
        if (!this.hasState(this.previousState)) this.emit("updated", this.getState());
        return this;
      }
      /**
       * Method used to update the camera's state using a function.
       */
    }, {
      key: "updateState",
      value: function updateState(updater) {
        this.setState(updater(this.getState()));
        return this;
      }
      /**
       * Method used to animate the camera.
       */
    }, {
      key: "animate",
      value: function animate(state) {
        var _this2 = this;
        var opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var callback = arguments.length > 2 ? arguments[2] : void 0;
        if (!callback) return new Promise(function(resolve) {
          return _this2.animate(state, opts, resolve);
        });
        if (!this.enabled) return;
        var options = _objectSpread2(_objectSpread2({}, ANIMATE_DEFAULTS), opts);
        var validState = this.validateState(state);
        var easing = typeof options.easing === "function" ? options.easing : easings[options.easing];
        var start = Date.now(), initialState = this.getState();
        var _fn = function fn() {
          var t = (Date.now() - start) / options.duration;
          if (t >= 1) {
            _this2.nextFrame = null;
            _this2.setState(validState);
            if (_this2.animationCallback) {
              _this2.animationCallback.call(null);
              _this2.animationCallback = void 0;
            }
            return;
          }
          var coefficient = easing(t);
          var newState = {};
          if (typeof validState.x === "number") newState.x = initialState.x + (validState.x - initialState.x) * coefficient;
          if (typeof validState.y === "number") newState.y = initialState.y + (validState.y - initialState.y) * coefficient;
          if (_this2.enabledRotation && typeof validState.angle === "number") newState.angle = initialState.angle + (validState.angle - initialState.angle) * coefficient;
          if (typeof validState.ratio === "number") newState.ratio = initialState.ratio + (validState.ratio - initialState.ratio) * coefficient;
          _this2.setState(newState);
          _this2.nextFrame = requestAnimationFrame(_fn);
        };
        if (this.nextFrame) {
          cancelAnimationFrame(this.nextFrame);
          if (this.animationCallback) this.animationCallback.call(null);
          this.nextFrame = requestAnimationFrame(_fn);
        } else {
          _fn();
        }
        this.animationCallback = callback;
      }
      /**
       * Method used to zoom the camera.
       */
    }, {
      key: "animatedZoom",
      value: function animatedZoom(factorOrOptions) {
        if (!factorOrOptions) return this.animate({
          ratio: this.ratio / DEFAULT_ZOOMING_RATIO
        });
        if (typeof factorOrOptions === "number") return this.animate({
          ratio: this.ratio / factorOrOptions
        });
        return this.animate({
          ratio: this.ratio / (factorOrOptions.factor || DEFAULT_ZOOMING_RATIO)
        }, factorOrOptions);
      }
      /**
       * Method used to unzoom the camera.
       */
    }, {
      key: "animatedUnzoom",
      value: function animatedUnzoom(factorOrOptions) {
        if (!factorOrOptions) return this.animate({
          ratio: this.ratio * DEFAULT_ZOOMING_RATIO
        });
        if (typeof factorOrOptions === "number") return this.animate({
          ratio: this.ratio * factorOrOptions
        });
        return this.animate({
          ratio: this.ratio * (factorOrOptions.factor || DEFAULT_ZOOMING_RATIO)
        }, factorOrOptions);
      }
      /**
       * Method used to reset the camera.
       */
    }, {
      key: "animatedReset",
      value: function animatedReset(options) {
        return this.animate({
          x: 0.5,
          y: 0.5,
          ratio: 1,
          angle: 0
        }, options);
      }
      /**
       * Returns a new Camera instance, with the same state as the current camera.
       */
    }, {
      key: "copy",
      value: function copy() {
        return Camera2.from(this.getState());
      }
    }], [{
      key: "from",
      value: function from(state) {
        var camera = new Camera2();
        return camera.setState(state);
      }
    }]);
  }(TypedEventEmitter);
  function getPosition(e, dom) {
    var bbox = dom.getBoundingClientRect();
    return {
      x: e.clientX - bbox.left,
      y: e.clientY - bbox.top
    };
  }
  function getMouseCoords(e, dom) {
    var res = _objectSpread2(_objectSpread2({}, getPosition(e, dom)), {}, {
      sigmaDefaultPrevented: false,
      preventSigmaDefault: function preventSigmaDefault() {
        res.sigmaDefaultPrevented = true;
      },
      original: e
    });
    return res;
  }
  function cleanMouseCoords(e) {
    var res = "x" in e ? e : _objectSpread2(_objectSpread2({}, e.touches[0] || e.previousTouches[0]), {}, {
      original: e.original,
      sigmaDefaultPrevented: e.sigmaDefaultPrevented,
      preventSigmaDefault: function preventSigmaDefault() {
        e.sigmaDefaultPrevented = true;
        res.sigmaDefaultPrevented = true;
      }
    });
    return res;
  }
  function getWheelCoords(e, dom) {
    return _objectSpread2(_objectSpread2({}, getMouseCoords(e, dom)), {}, {
      delta: getWheelDelta(e)
    });
  }
  var MAX_TOUCHES = 2;
  function getTouchesArray(touches) {
    var arr = [];
    for (var i = 0, l = Math.min(touches.length, MAX_TOUCHES); i < l; i++) arr.push(touches[i]);
    return arr;
  }
  function getTouchCoords(e, previousTouches, dom) {
    var res = {
      touches: getTouchesArray(e.touches).map(function(touch) {
        return getPosition(touch, dom);
      }),
      previousTouches: previousTouches.map(function(touch) {
        return getPosition(touch, dom);
      }),
      sigmaDefaultPrevented: false,
      preventSigmaDefault: function preventSigmaDefault() {
        res.sigmaDefaultPrevented = true;
      },
      original: e
    };
    return res;
  }
  function getWheelDelta(e) {
    if (typeof e.deltaY !== "undefined") return e.deltaY * -3 / 360;
    if (typeof e.detail !== "undefined") return e.detail / -9;
    throw new Error("Captor: could not extract delta from event.");
  }
  var Captor = /* @__PURE__ */ function(_TypedEventEmitter) {
    function Captor2(container, renderer2) {
      var _this;
      _classCallCheck(this, Captor2);
      _this = _callSuper(this, Captor2);
      _this.container = container;
      _this.renderer = renderer2;
      return _this;
    }
    _inherits(Captor2, _TypedEventEmitter);
    return _createClass(Captor2);
  }(TypedEventEmitter);
  var MOUSE_SETTINGS_KEYS = ["doubleClickTimeout", "doubleClickZoomingDuration", "doubleClickZoomingRatio", "dragTimeout", "draggedEventsTolerance", "inertiaDuration", "inertiaRatio", "zoomDuration", "zoomingRatio"];
  var DEFAULT_MOUSE_SETTINGS = MOUSE_SETTINGS_KEYS.reduce(function(iter, key) {
    return _objectSpread2(_objectSpread2({}, iter), {}, _defineProperty({}, key, DEFAULT_SETTINGS[key]));
  }, {});
  var MouseCaptor = /* @__PURE__ */ function(_Captor) {
    function MouseCaptor2(container, renderer2) {
      var _this;
      _classCallCheck(this, MouseCaptor2);
      _this = _callSuper(this, MouseCaptor2, [container, renderer2]);
      _defineProperty(_this, "enabled", true);
      _defineProperty(_this, "draggedEvents", 0);
      _defineProperty(_this, "downStartTime", null);
      _defineProperty(_this, "lastMouseX", null);
      _defineProperty(_this, "lastMouseY", null);
      _defineProperty(_this, "isMouseDown", false);
      _defineProperty(_this, "isMoving", false);
      _defineProperty(_this, "movingTimeout", null);
      _defineProperty(_this, "startCameraState", null);
      _defineProperty(_this, "clicks", 0);
      _defineProperty(_this, "doubleClickTimeout", null);
      _defineProperty(_this, "currentWheelDirection", 0);
      _defineProperty(_this, "settings", DEFAULT_MOUSE_SETTINGS);
      _this.handleClick = _this.handleClick.bind(_this);
      _this.handleRightClick = _this.handleRightClick.bind(_this);
      _this.handleDown = _this.handleDown.bind(_this);
      _this.handleUp = _this.handleUp.bind(_this);
      _this.handleMove = _this.handleMove.bind(_this);
      _this.handleWheel = _this.handleWheel.bind(_this);
      _this.handleLeave = _this.handleLeave.bind(_this);
      _this.handleEnter = _this.handleEnter.bind(_this);
      container.addEventListener("click", _this.handleClick, {
        capture: false
      });
      container.addEventListener("contextmenu", _this.handleRightClick, {
        capture: false
      });
      container.addEventListener("mousedown", _this.handleDown, {
        capture: false
      });
      container.addEventListener("wheel", _this.handleWheel, {
        capture: false
      });
      container.addEventListener("mouseleave", _this.handleLeave, {
        capture: false
      });
      container.addEventListener("mouseenter", _this.handleEnter, {
        capture: false
      });
      document.addEventListener("mousemove", _this.handleMove, {
        capture: false
      });
      document.addEventListener("mouseup", _this.handleUp, {
        capture: false
      });
      return _this;
    }
    _inherits(MouseCaptor2, _Captor);
    return _createClass(MouseCaptor2, [{
      key: "kill",
      value: function kill() {
        var container = this.container;
        container.removeEventListener("click", this.handleClick);
        container.removeEventListener("contextmenu", this.handleRightClick);
        container.removeEventListener("mousedown", this.handleDown);
        container.removeEventListener("wheel", this.handleWheel);
        container.removeEventListener("mouseleave", this.handleLeave);
        container.removeEventListener("mouseenter", this.handleEnter);
        document.removeEventListener("mousemove", this.handleMove);
        document.removeEventListener("mouseup", this.handleUp);
      }
    }, {
      key: "handleClick",
      value: function handleClick(e) {
        var _this2 = this;
        if (!this.enabled) return;
        this.clicks++;
        if (this.clicks === 2) {
          this.clicks = 0;
          if (typeof this.doubleClickTimeout === "number") {
            clearTimeout(this.doubleClickTimeout);
            this.doubleClickTimeout = null;
          }
          return this.handleDoubleClick(e);
        }
        setTimeout(function() {
          _this2.clicks = 0;
          _this2.doubleClickTimeout = null;
        }, this.settings.doubleClickTimeout);
        if (this.draggedEvents < this.settings.draggedEventsTolerance) this.emit("click", getMouseCoords(e, this.container));
      }
    }, {
      key: "handleRightClick",
      value: function handleRightClick(e) {
        if (!this.enabled) return;
        this.emit("rightClick", getMouseCoords(e, this.container));
      }
    }, {
      key: "handleDoubleClick",
      value: function handleDoubleClick(e) {
        if (!this.enabled) return;
        e.preventDefault();
        e.stopPropagation();
        var mouseCoords = getMouseCoords(e, this.container);
        this.emit("doubleClick", mouseCoords);
        if (mouseCoords.sigmaDefaultPrevented) return;
        var camera = this.renderer.getCamera();
        var newRatio = camera.getBoundedRatio(camera.getState().ratio / this.settings.doubleClickZoomingRatio);
        camera.animate(this.renderer.getViewportZoomedState(getPosition(e, this.container), newRatio), {
          easing: "quadraticInOut",
          duration: this.settings.doubleClickZoomingDuration
        });
      }
    }, {
      key: "handleDown",
      value: function handleDown(e) {
        if (!this.enabled) return;
        if (e.button === 0) {
          this.startCameraState = this.renderer.getCamera().getState();
          var _getPosition = getPosition(e, this.container), x = _getPosition.x, y = _getPosition.y;
          this.lastMouseX = x;
          this.lastMouseY = y;
          this.draggedEvents = 0;
          this.downStartTime = Date.now();
          this.isMouseDown = true;
        }
        this.emit("mousedown", getMouseCoords(e, this.container));
      }
    }, {
      key: "handleUp",
      value: function handleUp(e) {
        var _this3 = this;
        if (!this.enabled || !this.isMouseDown) return;
        var camera = this.renderer.getCamera();
        this.isMouseDown = false;
        if (typeof this.movingTimeout === "number") {
          clearTimeout(this.movingTimeout);
          this.movingTimeout = null;
        }
        var _getPosition2 = getPosition(e, this.container), x = _getPosition2.x, y = _getPosition2.y;
        var cameraState = camera.getState(), previousCameraState = camera.getPreviousState() || {
          x: 0,
          y: 0
        };
        if (this.isMoving) {
          camera.animate({
            x: cameraState.x + this.settings.inertiaRatio * (cameraState.x - previousCameraState.x),
            y: cameraState.y + this.settings.inertiaRatio * (cameraState.y - previousCameraState.y)
          }, {
            duration: this.settings.inertiaDuration,
            easing: "quadraticOut"
          });
        } else if (this.lastMouseX !== x || this.lastMouseY !== y) {
          camera.setState({
            x: cameraState.x,
            y: cameraState.y
          });
        }
        this.isMoving = false;
        setTimeout(function() {
          var shouldRefresh = _this3.draggedEvents > 0;
          _this3.draggedEvents = 0;
          if (shouldRefresh && _this3.renderer.getSetting("hideEdgesOnMove")) _this3.renderer.refresh();
        }, 0);
        this.emit("mouseup", getMouseCoords(e, this.container));
      }
    }, {
      key: "handleMove",
      value: function handleMove(e) {
        var _this4 = this;
        if (!this.enabled) return;
        var mouseCoords = getMouseCoords(e, this.container);
        this.emit("mousemovebody", mouseCoords);
        if (e.target === this.container || e.composedPath()[0] === this.container) {
          this.emit("mousemove", mouseCoords);
        }
        if (mouseCoords.sigmaDefaultPrevented) return;
        if (this.isMouseDown) {
          this.isMoving = true;
          this.draggedEvents++;
          if (typeof this.movingTimeout === "number") {
            clearTimeout(this.movingTimeout);
          }
          this.movingTimeout = window.setTimeout(function() {
            _this4.movingTimeout = null;
            _this4.isMoving = false;
          }, this.settings.dragTimeout);
          var camera = this.renderer.getCamera();
          var _getPosition3 = getPosition(e, this.container), eX = _getPosition3.x, eY = _getPosition3.y;
          var lastMouse = this.renderer.viewportToFramedGraph({
            x: this.lastMouseX,
            y: this.lastMouseY
          });
          var mouse = this.renderer.viewportToFramedGraph({
            x: eX,
            y: eY
          });
          var offsetX = lastMouse.x - mouse.x, offsetY = lastMouse.y - mouse.y;
          var cameraState = camera.getState();
          var x = cameraState.x + offsetX, y = cameraState.y + offsetY;
          camera.setState({
            x,
            y
          });
          this.lastMouseX = eX;
          this.lastMouseY = eY;
          e.preventDefault();
          e.stopPropagation();
        }
      }
    }, {
      key: "handleLeave",
      value: function handleLeave(e) {
        this.emit("mouseleave", getMouseCoords(e, this.container));
      }
    }, {
      key: "handleEnter",
      value: function handleEnter(e) {
        this.emit("mouseenter", getMouseCoords(e, this.container));
      }
    }, {
      key: "handleWheel",
      value: function handleWheel(e) {
        var _this5 = this;
        var camera = this.renderer.getCamera();
        if (!this.enabled || !camera.enabledZooming) return;
        var delta = getWheelDelta(e);
        if (!delta) return;
        var wheelCoords = getWheelCoords(e, this.container);
        this.emit("wheel", wheelCoords);
        if (wheelCoords.sigmaDefaultPrevented) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        var currentRatio = camera.getState().ratio;
        var ratioDiff = delta > 0 ? 1 / this.settings.zoomingRatio : this.settings.zoomingRatio;
        var newRatio = camera.getBoundedRatio(currentRatio * ratioDiff);
        var wheelDirection = delta > 0 ? 1 : -1;
        var now = Date.now();
        if (currentRatio === newRatio) return;
        e.preventDefault();
        e.stopPropagation();
        if (this.currentWheelDirection === wheelDirection && this.lastWheelTriggerTime && now - this.lastWheelTriggerTime < this.settings.zoomDuration / 5) {
          return;
        }
        camera.animate(this.renderer.getViewportZoomedState(getPosition(e, this.container), newRatio), {
          easing: "quadraticOut",
          duration: this.settings.zoomDuration
        }, function() {
          _this5.currentWheelDirection = 0;
        });
        this.currentWheelDirection = wheelDirection;
        this.lastWheelTriggerTime = now;
      }
    }, {
      key: "setSettings",
      value: function setSettings(settings) {
        this.settings = settings;
      }
    }]);
  }(Captor);
  var TOUCH_SETTINGS_KEYS = ["dragTimeout", "inertiaDuration", "inertiaRatio", "doubleClickTimeout", "doubleClickZoomingRatio", "doubleClickZoomingDuration", "tapMoveTolerance"];
  var DEFAULT_TOUCH_SETTINGS = TOUCH_SETTINGS_KEYS.reduce(function(iter, key) {
    return _objectSpread2(_objectSpread2({}, iter), {}, _defineProperty({}, key, DEFAULT_SETTINGS[key]));
  }, {});
  var TouchCaptor = /* @__PURE__ */ function(_Captor) {
    function TouchCaptor2(container, renderer2) {
      var _this;
      _classCallCheck(this, TouchCaptor2);
      _this = _callSuper(this, TouchCaptor2, [container, renderer2]);
      _defineProperty(_this, "enabled", true);
      _defineProperty(_this, "isMoving", false);
      _defineProperty(_this, "hasMoved", false);
      _defineProperty(_this, "touchMode", 0);
      _defineProperty(_this, "startTouchesPositions", []);
      _defineProperty(_this, "lastTouches", []);
      _defineProperty(_this, "lastTap", null);
      _defineProperty(_this, "settings", DEFAULT_TOUCH_SETTINGS);
      _this.handleStart = _this.handleStart.bind(_this);
      _this.handleLeave = _this.handleLeave.bind(_this);
      _this.handleMove = _this.handleMove.bind(_this);
      container.addEventListener("touchstart", _this.handleStart, {
        capture: false
      });
      container.addEventListener("touchcancel", _this.handleLeave, {
        capture: false
      });
      document.addEventListener("touchend", _this.handleLeave, {
        capture: false,
        passive: false
      });
      document.addEventListener("touchmove", _this.handleMove, {
        capture: false,
        passive: false
      });
      return _this;
    }
    _inherits(TouchCaptor2, _Captor);
    return _createClass(TouchCaptor2, [{
      key: "kill",
      value: function kill() {
        var container = this.container;
        container.removeEventListener("touchstart", this.handleStart);
        container.removeEventListener("touchcancel", this.handleLeave);
        document.removeEventListener("touchend", this.handleLeave);
        document.removeEventListener("touchmove", this.handleMove);
      }
    }, {
      key: "getDimensions",
      value: function getDimensions() {
        return {
          width: this.container.offsetWidth,
          height: this.container.offsetHeight
        };
      }
    }, {
      key: "handleStart",
      value: function handleStart(e) {
        var _this2 = this;
        if (!this.enabled) return;
        e.preventDefault();
        var touches = getTouchesArray(e.touches);
        this.touchMode = touches.length;
        this.startCameraState = this.renderer.getCamera().getState();
        this.startTouchesPositions = touches.map(function(touch) {
          return getPosition(touch, _this2.container);
        });
        if (this.touchMode === 2) {
          var _this$startTouchesPos = _slicedToArray(this.startTouchesPositions, 2), _this$startTouchesPos2 = _this$startTouchesPos[0], x0 = _this$startTouchesPos2.x, y0 = _this$startTouchesPos2.y, _this$startTouchesPos3 = _this$startTouchesPos[1], x1 = _this$startTouchesPos3.x, y1 = _this$startTouchesPos3.y;
          this.startTouchesAngle = Math.atan2(y1 - y0, x1 - x0);
          this.startTouchesDistance = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
        }
        this.emit("touchdown", getTouchCoords(e, this.lastTouches, this.container));
        this.lastTouches = touches;
        this.lastTouchesPositions = this.startTouchesPositions;
      }
    }, {
      key: "handleLeave",
      value: function handleLeave(e) {
        if (!this.enabled || !this.startTouchesPositions.length) return;
        if (e.cancelable) e.preventDefault();
        if (this.movingTimeout) {
          this.isMoving = false;
          clearTimeout(this.movingTimeout);
        }
        switch (this.touchMode) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          case 2:
            if (e.touches.length === 1) {
              this.handleStart(e);
              e.preventDefault();
              break;
            }
          /* falls through */
          case 1:
            if (this.isMoving) {
              var camera = this.renderer.getCamera();
              var cameraState = camera.getState(), previousCameraState = camera.getPreviousState() || {
                x: 0,
                y: 0
              };
              camera.animate({
                x: cameraState.x + this.settings.inertiaRatio * (cameraState.x - previousCameraState.x),
                y: cameraState.y + this.settings.inertiaRatio * (cameraState.y - previousCameraState.y)
              }, {
                duration: this.settings.inertiaDuration,
                easing: "quadraticOut"
              });
            }
            this.hasMoved = false;
            this.isMoving = false;
            this.touchMode = 0;
            break;
        }
        this.emit("touchup", getTouchCoords(e, this.lastTouches, this.container));
        if (!e.touches.length) {
          var position = getPosition(this.lastTouches[0], this.container);
          var downPosition = this.startTouchesPositions[0];
          var dSquare = Math.pow(position.x - downPosition.x, 2) + Math.pow(position.y - downPosition.y, 2);
          if (!e.touches.length && dSquare < Math.pow(this.settings.tapMoveTolerance, 2)) {
            if (this.lastTap && Date.now() - this.lastTap.time < this.settings.doubleClickTimeout) {
              var touchCoords = getTouchCoords(e, this.lastTouches, this.container);
              this.emit("doubletap", touchCoords);
              this.lastTap = null;
              if (!touchCoords.sigmaDefaultPrevented) {
                var _camera = this.renderer.getCamera();
                var newRatio = _camera.getBoundedRatio(_camera.getState().ratio / this.settings.doubleClickZoomingRatio);
                _camera.animate(this.renderer.getViewportZoomedState(position, newRatio), {
                  easing: "quadraticInOut",
                  duration: this.settings.doubleClickZoomingDuration
                });
              }
            } else {
              var _touchCoords = getTouchCoords(e, this.lastTouches, this.container);
              this.emit("tap", _touchCoords);
              this.lastTap = {
                time: Date.now(),
                position: _touchCoords.touches[0] || _touchCoords.previousTouches[0]
              };
            }
          }
        }
        this.lastTouches = getTouchesArray(e.touches);
        this.startTouchesPositions = [];
      }
    }, {
      key: "handleMove",
      value: function handleMove(e) {
        var _this3 = this;
        if (!this.enabled || !this.startTouchesPositions.length) return;
        e.preventDefault();
        var touches = getTouchesArray(e.touches);
        var touchesPositions = touches.map(function(touch) {
          return getPosition(touch, _this3.container);
        });
        var lastTouches = this.lastTouches;
        this.lastTouches = touches;
        this.lastTouchesPositions = touchesPositions;
        var touchCoords = getTouchCoords(e, lastTouches, this.container);
        this.emit("touchmove", touchCoords);
        if (touchCoords.sigmaDefaultPrevented) return;
        this.hasMoved || (this.hasMoved = touchesPositions.some(function(position, idx) {
          var startPosition = _this3.startTouchesPositions[idx];
          return startPosition && (position.x !== startPosition.x || position.y !== startPosition.y);
        }));
        if (!this.hasMoved) {
          return;
        }
        this.isMoving = true;
        if (this.movingTimeout) clearTimeout(this.movingTimeout);
        this.movingTimeout = window.setTimeout(function() {
          _this3.isMoving = false;
        }, this.settings.dragTimeout);
        var camera = this.renderer.getCamera();
        var startCameraState = this.startCameraState;
        var padding = this.renderer.getSetting("stagePadding");
        switch (this.touchMode) {
          case 1: {
            var _this$renderer$viewpo = this.renderer.viewportToFramedGraph((this.startTouchesPositions || [])[0]), xStart = _this$renderer$viewpo.x, yStart = _this$renderer$viewpo.y;
            var _this$renderer$viewpo2 = this.renderer.viewportToFramedGraph(touchesPositions[0]), x = _this$renderer$viewpo2.x, y = _this$renderer$viewpo2.y;
            camera.setState({
              x: startCameraState.x + xStart - x,
              y: startCameraState.y + yStart - y
            });
            break;
          }
          case 2: {
            var newCameraState = {
              x: 0.5,
              y: 0.5,
              angle: 0,
              ratio: 1
            };
            var _touchesPositions$ = touchesPositions[0], x0 = _touchesPositions$.x, y0 = _touchesPositions$.y;
            var _touchesPositions$2 = touchesPositions[1], x1 = _touchesPositions$2.x, y1 = _touchesPositions$2.y;
            var angleDiff = Math.atan2(y1 - y0, x1 - x0) - this.startTouchesAngle;
            var ratioDiff = Math.hypot(y1 - y0, x1 - x0) / this.startTouchesDistance;
            var newRatio = camera.getBoundedRatio(startCameraState.ratio / ratioDiff);
            newCameraState.ratio = newRatio;
            newCameraState.angle = startCameraState.angle + angleDiff;
            var dimensions = this.getDimensions();
            var touchGraphPosition = this.renderer.viewportToFramedGraph((this.startTouchesPositions || [])[0], {
              cameraState: startCameraState
            });
            var smallestDimension = Math.min(dimensions.width, dimensions.height) - 2 * padding;
            var dx = smallestDimension / dimensions.width;
            var dy = smallestDimension / dimensions.height;
            var ratio = newRatio / smallestDimension;
            var _x = x0 - smallestDimension / 2 / dx;
            var _y = y0 - smallestDimension / 2 / dy;
            var _ref = [_x * Math.cos(-newCameraState.angle) - _y * Math.sin(-newCameraState.angle), _y * Math.cos(-newCameraState.angle) + _x * Math.sin(-newCameraState.angle)];
            _x = _ref[0];
            _y = _ref[1];
            newCameraState.x = touchGraphPosition.x - _x * ratio;
            newCameraState.y = touchGraphPosition.y + _y * ratio;
            camera.setState(newCameraState);
            break;
          }
        }
      }
    }, {
      key: "setSettings",
      value: function setSettings(settings) {
        this.settings = settings;
      }
    }]);
  }(Captor);
  function _arrayWithoutHoles(r) {
    if (Array.isArray(r)) return _arrayLikeToArray(r);
  }
  function _iterableToArray(r) {
    if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _toConsumableArray(r) {
    return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
  }
  function _objectWithoutPropertiesLoose(r, e) {
    if (null == r) return {};
    var t = {};
    for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
      if (e.includes(n)) continue;
      t[n] = r[n];
    }
    return t;
  }
  function _objectWithoutProperties(e, t) {
    if (null == e) return {};
    var o, r, i = _objectWithoutPropertiesLoose(e, t);
    if (Object.getOwnPropertySymbols) {
      var s = Object.getOwnPropertySymbols(e);
      for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
    }
    return i;
  }
  var LabelCandidate = /* @__PURE__ */ function() {
    function LabelCandidate2(key, size) {
      _classCallCheck(this, LabelCandidate2);
      this.key = key;
      this.size = size;
    }
    return _createClass(LabelCandidate2, null, [{
      key: "compare",
      value: function compare(first, second) {
        if (first.size > second.size) return -1;
        if (first.size < second.size) return 1;
        if (first.key > second.key) return 1;
        return -1;
      }
    }]);
  }();
  var LabelGrid = /* @__PURE__ */ function() {
    function LabelGrid2() {
      _classCallCheck(this, LabelGrid2);
      _defineProperty(this, "width", 0);
      _defineProperty(this, "height", 0);
      _defineProperty(this, "cellSize", 0);
      _defineProperty(this, "columns", 0);
      _defineProperty(this, "rows", 0);
      _defineProperty(this, "cells", {});
    }
    return _createClass(LabelGrid2, [{
      key: "resizeAndClear",
      value: function resizeAndClear(dimensions, cellSize) {
        this.width = dimensions.width;
        this.height = dimensions.height;
        this.cellSize = cellSize;
        this.columns = Math.ceil(dimensions.width / cellSize);
        this.rows = Math.ceil(dimensions.height / cellSize);
        this.cells = {};
      }
    }, {
      key: "getIndex",
      value: function getIndex(pos) {
        var xIndex = Math.floor(pos.x / this.cellSize);
        var yIndex = Math.floor(pos.y / this.cellSize);
        return yIndex * this.columns + xIndex;
      }
    }, {
      key: "add",
      value: function add(key, size, pos) {
        var candidate = new LabelCandidate(key, size);
        var index = this.getIndex(pos);
        var cell = this.cells[index];
        if (!cell) {
          cell = [];
          this.cells[index] = cell;
        }
        cell.push(candidate);
      }
    }, {
      key: "organize",
      value: function organize() {
        for (var k in this.cells) {
          var cell = this.cells[k];
          cell.sort(LabelCandidate.compare);
        }
      }
    }, {
      key: "getLabelsToDisplay",
      value: function getLabelsToDisplay(ratio, density) {
        var cellArea = this.cellSize * this.cellSize;
        var scaledCellArea = cellArea / ratio / ratio;
        var scaledDensity = scaledCellArea * density / cellArea;
        var labelsToDisplayPerCell = Math.ceil(scaledDensity);
        var labels = [];
        for (var k in this.cells) {
          var cell = this.cells[k];
          for (var i = 0; i < Math.min(labelsToDisplayPerCell, cell.length); i++) {
            labels.push(cell[i].key);
          }
        }
        return labels;
      }
    }]);
  }();
  function edgeLabelsToDisplayFromNodes(params) {
    var graph2 = params.graph, hoveredNode = params.hoveredNode, highlightedNodes = params.highlightedNodes, displayedNodeLabels = params.displayedNodeLabels;
    var worthyEdges = [];
    graph2.forEachEdge(function(edge, _, source, target) {
      if (source === hoveredNode || target === hoveredNode || highlightedNodes.has(source) || highlightedNodes.has(target) || displayedNodeLabels.has(source) && displayedNodeLabels.has(target)) {
        worthyEdges.push(edge);
      }
    });
    return worthyEdges;
  }
  var X_LABEL_MARGIN = 150;
  var Y_LABEL_MARGIN = 50;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function applyNodeDefaults(settings, key, data) {
    if (!hasOwnProperty.call(data, "x") || !hasOwnProperty.call(data, "y")) throw new Error('Sigma: could not find a valid position (x, y) for node "'.concat(key, '". All your nodes must have a number "x" and "y". Maybe your forgot to apply a layout or your "nodeReducer" is not returning the correct data?'));
    if (!data.color) data.color = settings.defaultNodeColor;
    if (!data.label && data.label !== "") data.label = null;
    if (data.label !== void 0 && data.label !== null) data.label = "" + data.label;
    else data.label = null;
    if (!data.size) data.size = 2;
    if (!hasOwnProperty.call(data, "hidden")) data.hidden = false;
    if (!hasOwnProperty.call(data, "highlighted")) data.highlighted = false;
    if (!hasOwnProperty.call(data, "forceLabel")) data.forceLabel = false;
    if (!data.type || data.type === "") data.type = settings.defaultNodeType;
    if (!data.zIndex) data.zIndex = 0;
    return data;
  }
  function applyEdgeDefaults(settings, _key, data) {
    if (!data.color) data.color = settings.defaultEdgeColor;
    if (!data.label) data.label = "";
    if (!data.size) data.size = 0.5;
    if (!hasOwnProperty.call(data, "hidden")) data.hidden = false;
    if (!hasOwnProperty.call(data, "forceLabel")) data.forceLabel = false;
    if (!data.type || data.type === "") data.type = settings.defaultEdgeType;
    if (!data.zIndex) data.zIndex = 0;
    return data;
  }
  var Sigma$1 = /* @__PURE__ */ function(_TypedEventEmitter) {
    function Sigma(graph2, container) {
      var _this;
      var settings = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      _classCallCheck(this, Sigma);
      _this = _callSuper(this, Sigma);
      _defineProperty(_this, "elements", {});
      _defineProperty(_this, "canvasContexts", {});
      _defineProperty(_this, "webGLContexts", {});
      _defineProperty(_this, "pickingLayers", /* @__PURE__ */ new Set());
      _defineProperty(_this, "textures", {});
      _defineProperty(_this, "frameBuffers", {});
      _defineProperty(_this, "activeListeners", {});
      _defineProperty(_this, "labelGrid", new LabelGrid());
      _defineProperty(_this, "nodeDataCache", {});
      _defineProperty(_this, "edgeDataCache", {});
      _defineProperty(_this, "nodeProgramIndex", {});
      _defineProperty(_this, "edgeProgramIndex", {});
      _defineProperty(_this, "nodesWithForcedLabels", /* @__PURE__ */ new Set());
      _defineProperty(_this, "edgesWithForcedLabels", /* @__PURE__ */ new Set());
      _defineProperty(_this, "nodeExtent", {
        x: [0, 1],
        y: [0, 1]
      });
      _defineProperty(_this, "nodeZExtent", [Infinity, -Infinity]);
      _defineProperty(_this, "edgeZExtent", [Infinity, -Infinity]);
      _defineProperty(_this, "matrix", identity());
      _defineProperty(_this, "invMatrix", identity());
      _defineProperty(_this, "correctionRatio", 1);
      _defineProperty(_this, "customBBox", null);
      _defineProperty(_this, "normalizationFunction", createNormalizationFunction({
        x: [0, 1],
        y: [0, 1]
      }));
      _defineProperty(_this, "graphToViewportRatio", 1);
      _defineProperty(_this, "itemIDsIndex", {});
      _defineProperty(_this, "nodeIndices", {});
      _defineProperty(_this, "edgeIndices", {});
      _defineProperty(_this, "width", 0);
      _defineProperty(_this, "height", 0);
      _defineProperty(_this, "pixelRatio", getPixelRatio());
      _defineProperty(_this, "pickingDownSizingRatio", 2 * _this.pixelRatio);
      _defineProperty(_this, "displayedNodeLabels", /* @__PURE__ */ new Set());
      _defineProperty(_this, "displayedEdgeLabels", /* @__PURE__ */ new Set());
      _defineProperty(_this, "highlightedNodes", /* @__PURE__ */ new Set());
      _defineProperty(_this, "hoveredNode", null);
      _defineProperty(_this, "hoveredEdge", null);
      _defineProperty(_this, "renderFrame", null);
      _defineProperty(_this, "renderHighlightedNodesFrame", null);
      _defineProperty(_this, "needToProcess", false);
      _defineProperty(_this, "checkEdgesEventsFrame", null);
      _defineProperty(_this, "nodePrograms", {});
      _defineProperty(_this, "nodeHoverPrograms", {});
      _defineProperty(_this, "edgePrograms", {});
      _this.settings = resolveSettings(settings);
      validateSettings(_this.settings);
      validateGraph(graph2);
      if (!(container instanceof HTMLElement)) throw new Error("Sigma: container should be an html element.");
      _this.graph = graph2;
      _this.container = container;
      _this.createWebGLContext("edges", {
        picking: settings.enableEdgeEvents
      });
      _this.createCanvasContext("edgeLabels");
      _this.createWebGLContext("nodes", {
        picking: true
      });
      _this.createCanvasContext("labels");
      _this.createCanvasContext("hovers");
      _this.createWebGLContext("hoverNodes");
      _this.createCanvasContext("mouse", {
        style: {
          touchAction: "none",
          userSelect: "none"
        }
      });
      _this.resize();
      for (var type in _this.settings.nodeProgramClasses) {
        _this.registerNodeProgram(type, _this.settings.nodeProgramClasses[type], _this.settings.nodeHoverProgramClasses[type]);
      }
      for (var _type in _this.settings.edgeProgramClasses) {
        _this.registerEdgeProgram(_type, _this.settings.edgeProgramClasses[_type]);
      }
      _this.camera = new Camera();
      _this.bindCameraHandlers();
      _this.mouseCaptor = new MouseCaptor(_this.elements.mouse, _this);
      _this.mouseCaptor.setSettings(_this.settings);
      _this.touchCaptor = new TouchCaptor(_this.elements.mouse, _this);
      _this.touchCaptor.setSettings(_this.settings);
      _this.bindEventHandlers();
      _this.bindGraphHandlers();
      _this.handleSettingsUpdate();
      _this.refresh();
      return _this;
    }
    _inherits(Sigma, _TypedEventEmitter);
    return _createClass(Sigma, [{
      key: "registerNodeProgram",
      value: function registerNodeProgram(key, NodeProgramClass, NodeHoverProgram) {
        if (this.nodePrograms[key]) this.nodePrograms[key].kill();
        if (this.nodeHoverPrograms[key]) this.nodeHoverPrograms[key].kill();
        this.nodePrograms[key] = new NodeProgramClass(this.webGLContexts.nodes, this.frameBuffers.nodes, this);
        this.nodeHoverPrograms[key] = new (NodeHoverProgram || NodeProgramClass)(this.webGLContexts.hoverNodes, null, this);
        return this;
      }
      /**
       * Internal function used to register an edge program
       *
       * @param  {string}          key              - The program's key, matching the related edges "type" values.
       * @param  {EdgeProgramType} EdgeProgramClass - An edges program class.
       * @return {Sigma}
       */
    }, {
      key: "registerEdgeProgram",
      value: function registerEdgeProgram(key, EdgeProgramClass) {
        if (this.edgePrograms[key]) this.edgePrograms[key].kill();
        this.edgePrograms[key] = new EdgeProgramClass(this.webGLContexts.edges, this.frameBuffers.edges, this);
        return this;
      }
      /**
       * Internal function used to unregister a node program
       *
       * @param  {string} key - The program's key, matching the related nodes "type" values.
       * @return {Sigma}
       */
    }, {
      key: "unregisterNodeProgram",
      value: function unregisterNodeProgram(key) {
        if (this.nodePrograms[key]) {
          var _this$nodePrograms = this.nodePrograms, program = _this$nodePrograms[key], programs = _objectWithoutProperties(_this$nodePrograms, [key].map(_toPropertyKey));
          program.kill();
          this.nodePrograms = programs;
        }
        if (this.nodeHoverPrograms[key]) {
          var _this$nodeHoverProgra = this.nodeHoverPrograms, _program = _this$nodeHoverProgra[key], _programs = _objectWithoutProperties(_this$nodeHoverProgra, [key].map(_toPropertyKey));
          _program.kill();
          this.nodePrograms = _programs;
        }
        return this;
      }
      /**
       * Internal function used to unregister an edge program
       *
       * @param  {string} key - The program's key, matching the related edges "type" values.
       * @return {Sigma}
       */
    }, {
      key: "unregisterEdgeProgram",
      value: function unregisterEdgeProgram(key) {
        if (this.edgePrograms[key]) {
          var _this$edgePrograms = this.edgePrograms, program = _this$edgePrograms[key], programs = _objectWithoutProperties(_this$edgePrograms, [key].map(_toPropertyKey));
          program.kill();
          this.edgePrograms = programs;
        }
        return this;
      }
      /**
       * Method (re)binding WebGL texture (for picking).
       *
       * @return {Sigma}
       */
    }, {
      key: "resetWebGLTexture",
      value: function resetWebGLTexture(id) {
        var gl = this.webGLContexts[id];
        var frameBuffer = this.frameBuffers[id];
        var currentTexture = this.textures[id];
        if (currentTexture) gl.deleteTexture(currentTexture);
        var pickingTexture = gl.createTexture();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.bindTexture(gl.TEXTURE_2D, pickingTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, pickingTexture, 0);
        this.textures[id] = pickingTexture;
        return this;
      }
      /**
       * Method binding camera handlers.
       *
       * @return {Sigma}
       */
    }, {
      key: "bindCameraHandlers",
      value: function bindCameraHandlers() {
        var _this2 = this;
        this.activeListeners.camera = function() {
          _this2.scheduleRender();
        };
        this.camera.on("updated", this.activeListeners.camera);
        return this;
      }
      /**
       * Method unbinding camera handlers.
       *
       * @return {Sigma}
       */
    }, {
      key: "unbindCameraHandlers",
      value: function unbindCameraHandlers() {
        this.camera.removeListener("updated", this.activeListeners.camera);
        return this;
      }
      /**
       * Method that returns the closest node to a given position.
       */
    }, {
      key: "getNodeAtPosition",
      value: function getNodeAtPosition(position) {
        var x = position.x, y = position.y;
        var color = getPixelColor(this.webGLContexts.nodes, this.frameBuffers.nodes, x, y, this.pixelRatio, this.pickingDownSizingRatio);
        var index = colorToIndex.apply(void 0, _toConsumableArray(color));
        var itemAt = this.itemIDsIndex[index];
        return itemAt && itemAt.type === "node" ? itemAt.id : null;
      }
      /**
       * Method binding event handlers.
       *
       * @return {Sigma}
       */
    }, {
      key: "bindEventHandlers",
      value: function bindEventHandlers() {
        var _this3 = this;
        this.activeListeners.handleResize = function() {
          _this3.scheduleRefresh();
        };
        window.addEventListener("resize", this.activeListeners.handleResize);
        this.activeListeners.handleMove = function(e) {
          var event = cleanMouseCoords(e);
          var baseEvent = {
            event,
            preventSigmaDefault: function preventSigmaDefault() {
              event.preventSigmaDefault();
            }
          };
          var nodeToHover = _this3.getNodeAtPosition(event);
          if (nodeToHover && _this3.hoveredNode !== nodeToHover && !_this3.nodeDataCache[nodeToHover].hidden) {
            if (_this3.hoveredNode) _this3.emit("leaveNode", _objectSpread2(_objectSpread2({}, baseEvent), {}, {
              node: _this3.hoveredNode
            }));
            _this3.hoveredNode = nodeToHover;
            _this3.emit("enterNode", _objectSpread2(_objectSpread2({}, baseEvent), {}, {
              node: nodeToHover
            }));
            _this3.scheduleHighlightedNodesRender();
            return;
          }
          if (_this3.hoveredNode) {
            if (_this3.getNodeAtPosition(event) !== _this3.hoveredNode) {
              var node = _this3.hoveredNode;
              _this3.hoveredNode = null;
              _this3.emit("leaveNode", _objectSpread2(_objectSpread2({}, baseEvent), {}, {
                node
              }));
              _this3.scheduleHighlightedNodesRender();
              return;
            }
          }
          if (_this3.settings.enableEdgeEvents) {
            var edgeToHover = _this3.hoveredNode ? null : _this3.getEdgeAtPoint(baseEvent.event.x, baseEvent.event.y);
            if (edgeToHover !== _this3.hoveredEdge) {
              if (_this3.hoveredEdge) _this3.emit("leaveEdge", _objectSpread2(_objectSpread2({}, baseEvent), {}, {
                edge: _this3.hoveredEdge
              }));
              if (edgeToHover) _this3.emit("enterEdge", _objectSpread2(_objectSpread2({}, baseEvent), {}, {
                edge: edgeToHover
              }));
              _this3.hoveredEdge = edgeToHover;
            }
          }
        };
        this.activeListeners.handleMoveBody = function(e) {
          var event = cleanMouseCoords(e);
          _this3.emit("moveBody", {
            event,
            preventSigmaDefault: function preventSigmaDefault() {
              event.preventSigmaDefault();
            }
          });
        };
        this.activeListeners.handleLeave = function(e) {
          var event = cleanMouseCoords(e);
          var baseEvent = {
            event,
            preventSigmaDefault: function preventSigmaDefault() {
              event.preventSigmaDefault();
            }
          };
          if (_this3.hoveredNode) {
            _this3.emit("leaveNode", _objectSpread2(_objectSpread2({}, baseEvent), {}, {
              node: _this3.hoveredNode
            }));
            _this3.scheduleHighlightedNodesRender();
          }
          if (_this3.settings.enableEdgeEvents && _this3.hoveredEdge) {
            _this3.emit("leaveEdge", _objectSpread2(_objectSpread2({}, baseEvent), {}, {
              edge: _this3.hoveredEdge
            }));
            _this3.scheduleHighlightedNodesRender();
          }
          _this3.emit("leaveStage", _objectSpread2({}, baseEvent));
        };
        this.activeListeners.handleEnter = function(e) {
          var event = cleanMouseCoords(e);
          var baseEvent = {
            event,
            preventSigmaDefault: function preventSigmaDefault() {
              event.preventSigmaDefault();
            }
          };
          _this3.emit("enterStage", _objectSpread2({}, baseEvent));
        };
        var createInteractionListener = function createInteractionListener2(eventType) {
          return function(e) {
            var event = cleanMouseCoords(e);
            var baseEvent = {
              event,
              preventSigmaDefault: function preventSigmaDefault() {
                event.preventSigmaDefault();
              }
            };
            var nodeAtPosition = _this3.getNodeAtPosition(event);
            if (nodeAtPosition) return _this3.emit("".concat(eventType, "Node"), _objectSpread2(_objectSpread2({}, baseEvent), {}, {
              node: nodeAtPosition
            }));
            if (_this3.settings.enableEdgeEvents) {
              var edge = _this3.getEdgeAtPoint(event.x, event.y);
              if (edge) return _this3.emit("".concat(eventType, "Edge"), _objectSpread2(_objectSpread2({}, baseEvent), {}, {
                edge
              }));
            }
            return _this3.emit("".concat(eventType, "Stage"), baseEvent);
          };
        };
        this.activeListeners.handleClick = createInteractionListener("click");
        this.activeListeners.handleRightClick = createInteractionListener("rightClick");
        this.activeListeners.handleDoubleClick = createInteractionListener("doubleClick");
        this.activeListeners.handleWheel = createInteractionListener("wheel");
        this.activeListeners.handleDown = createInteractionListener("down");
        this.activeListeners.handleUp = createInteractionListener("up");
        this.mouseCaptor.on("mousemove", this.activeListeners.handleMove);
        this.mouseCaptor.on("mousemovebody", this.activeListeners.handleMoveBody);
        this.mouseCaptor.on("click", this.activeListeners.handleClick);
        this.mouseCaptor.on("rightClick", this.activeListeners.handleRightClick);
        this.mouseCaptor.on("doubleClick", this.activeListeners.handleDoubleClick);
        this.mouseCaptor.on("wheel", this.activeListeners.handleWheel);
        this.mouseCaptor.on("mousedown", this.activeListeners.handleDown);
        this.mouseCaptor.on("mouseup", this.activeListeners.handleUp);
        this.mouseCaptor.on("mouseleave", this.activeListeners.handleLeave);
        this.mouseCaptor.on("mouseenter", this.activeListeners.handleEnter);
        this.touchCaptor.on("touchdown", this.activeListeners.handleDown);
        this.touchCaptor.on("touchdown", this.activeListeners.handleMove);
        this.touchCaptor.on("touchup", this.activeListeners.handleUp);
        this.touchCaptor.on("touchmove", this.activeListeners.handleMove);
        this.touchCaptor.on("tap", this.activeListeners.handleClick);
        this.touchCaptor.on("doubletap", this.activeListeners.handleDoubleClick);
        this.touchCaptor.on("touchmove", this.activeListeners.handleMoveBody);
        return this;
      }
      /**
       * Method binding graph handlers
       *
       * @return {Sigma}
       */
    }, {
      key: "bindGraphHandlers",
      value: function bindGraphHandlers() {
        var _this4 = this;
        var graph2 = this.graph;
        var LAYOUT_IMPACTING_FIELDS = /* @__PURE__ */ new Set(["x", "y", "zIndex", "type"]);
        this.activeListeners.eachNodeAttributesUpdatedGraphUpdate = function(e) {
          var _e$hints;
          var updatedFields = (_e$hints = e.hints) === null || _e$hints === void 0 ? void 0 : _e$hints.attributes;
          _this4.graph.forEachNode(function(node) {
            return _this4.updateNode(node);
          });
          var layoutChanged = !updatedFields || updatedFields.some(function(f) {
            return LAYOUT_IMPACTING_FIELDS.has(f);
          });
          _this4.refresh({
            partialGraph: {
              nodes: graph2.nodes()
            },
            skipIndexation: !layoutChanged,
            schedule: true
          });
        };
        this.activeListeners.eachEdgeAttributesUpdatedGraphUpdate = function(e) {
          var _e$hints2;
          var updatedFields = (_e$hints2 = e.hints) === null || _e$hints2 === void 0 ? void 0 : _e$hints2.attributes;
          _this4.graph.forEachEdge(function(edge) {
            return _this4.updateEdge(edge);
          });
          var layoutChanged = updatedFields && ["zIndex", "type"].some(function(f) {
            return updatedFields === null || updatedFields === void 0 ? void 0 : updatedFields.includes(f);
          });
          _this4.refresh({
            partialGraph: {
              edges: graph2.edges()
            },
            skipIndexation: !layoutChanged,
            schedule: true
          });
        };
        this.activeListeners.addNodeGraphUpdate = function(payload) {
          var node = payload.key;
          _this4.addNode(node);
          _this4.refresh({
            partialGraph: {
              nodes: [node]
            },
            skipIndexation: false,
            schedule: true
          });
        };
        this.activeListeners.updateNodeGraphUpdate = function(payload) {
          var node = payload.key;
          _this4.refresh({
            partialGraph: {
              nodes: [node]
            },
            skipIndexation: false,
            schedule: true
          });
        };
        this.activeListeners.dropNodeGraphUpdate = function(payload) {
          var node = payload.key;
          _this4.removeNode(node);
          _this4.refresh({
            schedule: true
          });
        };
        this.activeListeners.addEdgeGraphUpdate = function(payload) {
          var edge = payload.key;
          _this4.addEdge(edge);
          _this4.refresh({
            partialGraph: {
              edges: [edge]
            },
            schedule: true
          });
        };
        this.activeListeners.updateEdgeGraphUpdate = function(payload) {
          var edge = payload.key;
          _this4.refresh({
            partialGraph: {
              edges: [edge]
            },
            skipIndexation: false,
            schedule: true
          });
        };
        this.activeListeners.dropEdgeGraphUpdate = function(payload) {
          var edge = payload.key;
          _this4.removeEdge(edge);
          _this4.refresh({
            schedule: true
          });
        };
        this.activeListeners.clearEdgesGraphUpdate = function() {
          _this4.clearEdgeState();
          _this4.clearEdgeIndices();
          _this4.refresh({
            schedule: true
          });
        };
        this.activeListeners.clearGraphUpdate = function() {
          _this4.clearEdgeState();
          _this4.clearNodeState();
          _this4.clearEdgeIndices();
          _this4.clearNodeIndices();
          _this4.refresh({
            schedule: true
          });
        };
        graph2.on("nodeAdded", this.activeListeners.addNodeGraphUpdate);
        graph2.on("nodeDropped", this.activeListeners.dropNodeGraphUpdate);
        graph2.on("nodeAttributesUpdated", this.activeListeners.updateNodeGraphUpdate);
        graph2.on("eachNodeAttributesUpdated", this.activeListeners.eachNodeAttributesUpdatedGraphUpdate);
        graph2.on("edgeAdded", this.activeListeners.addEdgeGraphUpdate);
        graph2.on("edgeDropped", this.activeListeners.dropEdgeGraphUpdate);
        graph2.on("edgeAttributesUpdated", this.activeListeners.updateEdgeGraphUpdate);
        graph2.on("eachEdgeAttributesUpdated", this.activeListeners.eachEdgeAttributesUpdatedGraphUpdate);
        graph2.on("edgesCleared", this.activeListeners.clearEdgesGraphUpdate);
        graph2.on("cleared", this.activeListeners.clearGraphUpdate);
        return this;
      }
      /**
       * Method used to unbind handlers from the graph.
       *
       * @return {undefined}
       */
    }, {
      key: "unbindGraphHandlers",
      value: function unbindGraphHandlers() {
        var graph2 = this.graph;
        graph2.removeListener("nodeAdded", this.activeListeners.addNodeGraphUpdate);
        graph2.removeListener("nodeDropped", this.activeListeners.dropNodeGraphUpdate);
        graph2.removeListener("nodeAttributesUpdated", this.activeListeners.updateNodeGraphUpdate);
        graph2.removeListener("eachNodeAttributesUpdated", this.activeListeners.eachNodeAttributesUpdatedGraphUpdate);
        graph2.removeListener("edgeAdded", this.activeListeners.addEdgeGraphUpdate);
        graph2.removeListener("edgeDropped", this.activeListeners.dropEdgeGraphUpdate);
        graph2.removeListener("edgeAttributesUpdated", this.activeListeners.updateEdgeGraphUpdate);
        graph2.removeListener("eachEdgeAttributesUpdated", this.activeListeners.eachEdgeAttributesUpdatedGraphUpdate);
        graph2.removeListener("edgesCleared", this.activeListeners.clearEdgesGraphUpdate);
        graph2.removeListener("cleared", this.activeListeners.clearGraphUpdate);
      }
      /**
       * Method looking for an edge colliding with a given point at (x, y). Returns
       * the key of the edge if any, or null else.
       */
    }, {
      key: "getEdgeAtPoint",
      value: function getEdgeAtPoint(x, y) {
        var color = getPixelColor(this.webGLContexts.edges, this.frameBuffers.edges, x, y, this.pixelRatio, this.pickingDownSizingRatio);
        var index = colorToIndex.apply(void 0, _toConsumableArray(color));
        var itemAt = this.itemIDsIndex[index];
        return itemAt && itemAt.type === "edge" ? itemAt.id : null;
      }
      /**
       * Method used to process the whole graph's data.
       *  - extent
       *  - normalizationFunction
       *  - compute node's coordinate
       *  - labelgrid
       *  - program data allocation
       * @return {Sigma}
       */
    }, {
      key: "process",
      value: function process() {
        var _this5 = this;
        this.emit("beforeProcess");
        var graph2 = this.graph;
        var settings = this.settings;
        var dimensions = this.getDimensions();
        this.nodeExtent = graphExtent(this.graph);
        if (!this.settings.autoRescale) {
          var width = dimensions.width, height = dimensions.height;
          var _this$nodeExtent = this.nodeExtent, x = _this$nodeExtent.x, y = _this$nodeExtent.y;
          this.nodeExtent = {
            x: [(x[0] + x[1]) / 2 - width / 2, (x[0] + x[1]) / 2 + width / 2],
            y: [(y[0] + y[1]) / 2 - height / 2, (y[0] + y[1]) / 2 + height / 2]
          };
        }
        this.normalizationFunction = createNormalizationFunction(this.customBBox || this.nodeExtent);
        var nullCamera = new Camera();
        var nullCameraMatrix = matrixFromCamera(nullCamera.getState(), dimensions, this.getGraphDimensions(), this.getStagePadding());
        this.labelGrid.resizeAndClear(dimensions, settings.labelGridCellSize);
        var nodesPerPrograms = {};
        var nodeIndices = {};
        var edgeIndices = {};
        var itemIDsIndex = {};
        var incrID = 1;
        var nodes = graph2.nodes();
        for (var i = 0, l = nodes.length; i < l; i++) {
          var node = nodes[i];
          var data = this.nodeDataCache[node];
          var attrs = graph2.getNodeAttributes(node);
          data.x = attrs.x;
          data.y = attrs.y;
          this.normalizationFunction.applyTo(data);
          if (typeof data.label === "string" && !data.hidden) this.labelGrid.add(node, data.size, this.framedGraphToViewport(data, {
            matrix: nullCameraMatrix
          }));
          nodesPerPrograms[data.type] = (nodesPerPrograms[data.type] || 0) + 1;
        }
        this.labelGrid.organize();
        for (var type in this.nodePrograms) {
          if (!hasOwnProperty.call(this.nodePrograms, type)) {
            throw new Error('Sigma: could not find a suitable program for node type "'.concat(type, '"!'));
          }
          this.nodePrograms[type].reallocate(nodesPerPrograms[type] || 0);
          nodesPerPrograms[type] = 0;
        }
        if (this.settings.zIndex && this.nodeZExtent[0] !== this.nodeZExtent[1]) nodes = zIndexOrdering(this.nodeZExtent, function(node2) {
          return _this5.nodeDataCache[node2].zIndex;
        }, nodes);
        for (var _i = 0, _l = nodes.length; _i < _l; _i++) {
          var _node = nodes[_i];
          nodeIndices[_node] = incrID;
          itemIDsIndex[nodeIndices[_node]] = {
            type: "node",
            id: _node
          };
          incrID++;
          var _data = this.nodeDataCache[_node];
          this.addNodeToProgram(_node, nodeIndices[_node], nodesPerPrograms[_data.type]++);
        }
        var edgesPerPrograms = {};
        var edges = graph2.edges();
        for (var _i2 = 0, _l2 = edges.length; _i2 < _l2; _i2++) {
          var edge = edges[_i2];
          var _data2 = this.edgeDataCache[edge];
          edgesPerPrograms[_data2.type] = (edgesPerPrograms[_data2.type] || 0) + 1;
        }
        if (this.settings.zIndex && this.edgeZExtent[0] !== this.edgeZExtent[1]) edges = zIndexOrdering(this.edgeZExtent, function(edge2) {
          return _this5.edgeDataCache[edge2].zIndex;
        }, edges);
        for (var _type2 in this.edgePrograms) {
          if (!hasOwnProperty.call(this.edgePrograms, _type2)) {
            throw new Error('Sigma: could not find a suitable program for edge type "'.concat(_type2, '"!'));
          }
          this.edgePrograms[_type2].reallocate(edgesPerPrograms[_type2] || 0);
          edgesPerPrograms[_type2] = 0;
        }
        for (var _i3 = 0, _l3 = edges.length; _i3 < _l3; _i3++) {
          var _edge = edges[_i3];
          edgeIndices[_edge] = incrID;
          itemIDsIndex[edgeIndices[_edge]] = {
            type: "edge",
            id: _edge
          };
          incrID++;
          var _data3 = this.edgeDataCache[_edge];
          this.addEdgeToProgram(_edge, edgeIndices[_edge], edgesPerPrograms[_data3.type]++);
        }
        this.itemIDsIndex = itemIDsIndex;
        this.nodeIndices = nodeIndices;
        this.edgeIndices = edgeIndices;
        this.emit("afterProcess");
        return this;
      }
      /**
       * Method that backports potential settings updates where it's needed.
       * @private
       */
    }, {
      key: "handleSettingsUpdate",
      value: function handleSettingsUpdate(oldSettings) {
        var _this6 = this;
        var settings = this.settings;
        this.camera.minRatio = settings.minCameraRatio;
        this.camera.maxRatio = settings.maxCameraRatio;
        this.camera.enabledZooming = settings.enableCameraZooming;
        this.camera.enabledPanning = settings.enableCameraPanning;
        this.camera.enabledRotation = settings.enableCameraRotation;
        if (settings.cameraPanBoundaries) {
          this.camera.clean = function(state) {
            return _this6.cleanCameraState(state, settings.cameraPanBoundaries && _typeof(settings.cameraPanBoundaries) === "object" ? settings.cameraPanBoundaries : {});
          };
        } else {
          this.camera.clean = null;
        }
        this.camera.setState(this.camera.validateState(this.camera.getState()));
        if (oldSettings) {
          if (oldSettings.edgeProgramClasses !== settings.edgeProgramClasses) {
            for (var type in settings.edgeProgramClasses) {
              if (settings.edgeProgramClasses[type] !== oldSettings.edgeProgramClasses[type]) {
                this.registerEdgeProgram(type, settings.edgeProgramClasses[type]);
              }
            }
            for (var _type3 in oldSettings.edgeProgramClasses) {
              if (!settings.edgeProgramClasses[_type3]) this.unregisterEdgeProgram(_type3);
            }
          }
          if (oldSettings.nodeProgramClasses !== settings.nodeProgramClasses || oldSettings.nodeHoverProgramClasses !== settings.nodeHoverProgramClasses) {
            for (var _type4 in settings.nodeProgramClasses) {
              if (settings.nodeProgramClasses[_type4] !== oldSettings.nodeProgramClasses[_type4] || settings.nodeHoverProgramClasses[_type4] !== oldSettings.nodeHoverProgramClasses[_type4]) {
                this.registerNodeProgram(_type4, settings.nodeProgramClasses[_type4], settings.nodeHoverProgramClasses[_type4]);
              }
            }
            for (var _type5 in oldSettings.nodeProgramClasses) {
              if (!settings.nodeProgramClasses[_type5]) this.unregisterNodeProgram(_type5);
            }
          }
        }
        this.mouseCaptor.setSettings(this.settings);
        this.touchCaptor.setSettings(this.settings);
        return this;
      }
    }, {
      key: "cleanCameraState",
      value: function cleanCameraState(state) {
        var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$tolerance = _ref.tolerance, tolerance = _ref$tolerance === void 0 ? 0 : _ref$tolerance, boundaries = _ref.boundaries;
        var newState = _objectSpread2({}, state);
        var _ref2 = boundaries || this.nodeExtent, _ref2$x = _slicedToArray(_ref2.x, 2), xMinGraph = _ref2$x[0], xMaxGraph = _ref2$x[1], _ref2$y = _slicedToArray(_ref2.y, 2), yMinGraph = _ref2$y[0], yMaxGraph = _ref2$y[1];
        var corners = [this.graphToViewport({
          x: xMinGraph,
          y: yMinGraph
        }, {
          cameraState: state
        }), this.graphToViewport({
          x: xMaxGraph,
          y: yMinGraph
        }, {
          cameraState: state
        }), this.graphToViewport({
          x: xMinGraph,
          y: yMaxGraph
        }, {
          cameraState: state
        }), this.graphToViewport({
          x: xMaxGraph,
          y: yMaxGraph
        }, {
          cameraState: state
        })];
        var xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
        corners.forEach(function(_ref3) {
          var x = _ref3.x, y = _ref3.y;
          xMin = Math.min(xMin, x);
          xMax = Math.max(xMax, x);
          yMin = Math.min(yMin, y);
          yMax = Math.max(yMax, y);
        });
        var graphWidth = xMax - xMin;
        var graphHeight = yMax - yMin;
        var _this$getDimensions = this.getDimensions(), width = _this$getDimensions.width, height = _this$getDimensions.height;
        var dx = 0;
        var dy = 0;
        if (graphWidth >= width) {
          if (xMax < width - tolerance) dx = xMax - (width - tolerance);
          else if (xMin > tolerance) dx = xMin - tolerance;
        } else {
          if (xMax > width + tolerance) dx = xMax - (width + tolerance);
          else if (xMin < -tolerance) dx = xMin + tolerance;
        }
        if (graphHeight >= height) {
          if (yMax < height - tolerance) dy = yMax - (height - tolerance);
          else if (yMin > tolerance) dy = yMin - tolerance;
        } else {
          if (yMax > height + tolerance) dy = yMax - (height + tolerance);
          else if (yMin < -tolerance) dy = yMin + tolerance;
        }
        if (dx || dy) {
          var origin = this.viewportToFramedGraph({
            x: 0,
            y: 0
          }, {
            cameraState: state
          });
          var delta = this.viewportToFramedGraph({
            x: dx,
            y: dy
          }, {
            cameraState: state
          });
          dx = delta.x - origin.x;
          dy = delta.y - origin.y;
          newState.x += dx;
          newState.y += dy;
        }
        return newState;
      }
      /**
       * Method used to render labels.
       *
       * @return {Sigma}
       */
    }, {
      key: "renderLabels",
      value: function renderLabels() {
        if (!this.settings.renderLabels) return this;
        var cameraState = this.camera.getState();
        var labelsToDisplay = this.labelGrid.getLabelsToDisplay(cameraState.ratio, this.settings.labelDensity);
        extend(labelsToDisplay, this.nodesWithForcedLabels);
        this.displayedNodeLabels = /* @__PURE__ */ new Set();
        var context = this.canvasContexts.labels;
        for (var i = 0, l = labelsToDisplay.length; i < l; i++) {
          var node = labelsToDisplay[i];
          var data = this.nodeDataCache[node];
          if (this.displayedNodeLabels.has(node)) continue;
          if (data.hidden) continue;
          var _this$framedGraphToVi = this.framedGraphToViewport(data), x = _this$framedGraphToVi.x, y = _this$framedGraphToVi.y;
          var size = this.scaleSize(data.size);
          if (!data.forceLabel && size < this.settings.labelRenderedSizeThreshold) continue;
          if (x < -X_LABEL_MARGIN || x > this.width + X_LABEL_MARGIN || y < -Y_LABEL_MARGIN || y > this.height + Y_LABEL_MARGIN) continue;
          this.displayedNodeLabels.add(node);
          var defaultDrawNodeLabel = this.settings.defaultDrawNodeLabel;
          var nodeProgram = this.nodePrograms[data.type];
          var drawLabel = (nodeProgram === null || nodeProgram === void 0 ? void 0 : nodeProgram.drawLabel) || defaultDrawNodeLabel;
          drawLabel(context, _objectSpread2(_objectSpread2({
            key: node
          }, data), {}, {
            size,
            x,
            y
          }), this.settings);
        }
        return this;
      }
      /**
       * Method used to render edge labels, based on which node labels were
       * rendered.
       *
       * @return {Sigma}
       */
    }, {
      key: "renderEdgeLabels",
      value: function renderEdgeLabels() {
        if (!this.settings.renderEdgeLabels) return this;
        var context = this.canvasContexts.edgeLabels;
        context.clearRect(0, 0, this.width, this.height);
        var edgeLabelsToDisplay = edgeLabelsToDisplayFromNodes({
          graph: this.graph,
          hoveredNode: this.hoveredNode,
          displayedNodeLabels: this.displayedNodeLabels,
          highlightedNodes: this.highlightedNodes
        });
        extend(edgeLabelsToDisplay, this.edgesWithForcedLabels);
        var displayedLabels = /* @__PURE__ */ new Set();
        for (var i = 0, l = edgeLabelsToDisplay.length; i < l; i++) {
          var edge = edgeLabelsToDisplay[i], extremities = this.graph.extremities(edge), sourceData = this.nodeDataCache[extremities[0]], targetData = this.nodeDataCache[extremities[1]], edgeData = this.edgeDataCache[edge];
          if (displayedLabels.has(edge)) continue;
          if (edgeData.hidden || sourceData.hidden || targetData.hidden) {
            continue;
          }
          var defaultDrawEdgeLabel = this.settings.defaultDrawEdgeLabel;
          var edgeProgram = this.edgePrograms[edgeData.type];
          var drawLabel = (edgeProgram === null || edgeProgram === void 0 ? void 0 : edgeProgram.drawLabel) || defaultDrawEdgeLabel;
          drawLabel(context, _objectSpread2(_objectSpread2({
            key: edge
          }, edgeData), {}, {
            size: this.scaleSize(edgeData.size)
          }), _objectSpread2(_objectSpread2(_objectSpread2({
            key: extremities[0]
          }, sourceData), this.framedGraphToViewport(sourceData)), {}, {
            size: this.scaleSize(sourceData.size)
          }), _objectSpread2(_objectSpread2(_objectSpread2({
            key: extremities[1]
          }, targetData), this.framedGraphToViewport(targetData)), {}, {
            size: this.scaleSize(targetData.size)
          }), this.settings);
          displayedLabels.add(edge);
        }
        this.displayedEdgeLabels = displayedLabels;
        return this;
      }
      /**
       * Method used to render the highlighted nodes.
       *
       * @return {Sigma}
       */
    }, {
      key: "renderHighlightedNodes",
      value: function renderHighlightedNodes() {
        var _this7 = this;
        var context = this.canvasContexts.hovers;
        context.clearRect(0, 0, this.width, this.height);
        var render = function render2(node) {
          var data = _this7.nodeDataCache[node];
          var _this7$framedGraphToV = _this7.framedGraphToViewport(data), x = _this7$framedGraphToV.x, y = _this7$framedGraphToV.y;
          var size = _this7.scaleSize(data.size);
          var defaultDrawNodeHover = _this7.settings.defaultDrawNodeHover;
          var nodeProgram = _this7.nodePrograms[data.type];
          var drawHover = (nodeProgram === null || nodeProgram === void 0 ? void 0 : nodeProgram.drawHover) || defaultDrawNodeHover;
          drawHover(context, _objectSpread2(_objectSpread2({
            key: node
          }, data), {}, {
            size,
            x,
            y
          }), _this7.settings);
        };
        var nodesToRender = [];
        if (this.hoveredNode && !this.nodeDataCache[this.hoveredNode].hidden) {
          nodesToRender.push(this.hoveredNode);
        }
        this.highlightedNodes.forEach(function(node) {
          if (node !== _this7.hoveredNode) nodesToRender.push(node);
        });
        nodesToRender.forEach(function(node) {
          return render(node);
        });
        var nodesPerPrograms = {};
        nodesToRender.forEach(function(node) {
          var type2 = _this7.nodeDataCache[node].type;
          nodesPerPrograms[type2] = (nodesPerPrograms[type2] || 0) + 1;
        });
        for (var type in this.nodeHoverPrograms) {
          this.nodeHoverPrograms[type].reallocate(nodesPerPrograms[type] || 0);
          nodesPerPrograms[type] = 0;
        }
        nodesToRender.forEach(function(node) {
          var data = _this7.nodeDataCache[node];
          _this7.nodeHoverPrograms[data.type].process(0, nodesPerPrograms[data.type]++, data);
        });
        this.webGLContexts.hoverNodes.clear(this.webGLContexts.hoverNodes.COLOR_BUFFER_BIT);
        var renderParams = this.getRenderParams();
        for (var _type6 in this.nodeHoverPrograms) {
          var program = this.nodeHoverPrograms[_type6];
          program.render(renderParams);
        }
      }
      /**
       * Method used to schedule a hover render.
       *
       */
    }, {
      key: "scheduleHighlightedNodesRender",
      value: function scheduleHighlightedNodesRender() {
        var _this8 = this;
        if (this.renderHighlightedNodesFrame || this.renderFrame) return;
        this.renderHighlightedNodesFrame = requestAnimationFrame(function() {
          _this8.renderHighlightedNodesFrame = null;
          _this8.renderHighlightedNodes();
          _this8.renderEdgeLabels();
        });
      }
      /**
       * Method used to render.
       *
       * @return {Sigma}
       */
    }, {
      key: "render",
      value: function render() {
        var _this9 = this;
        this.emit("beforeRender");
        var exitRender = function exitRender2() {
          _this9.emit("afterRender");
          return _this9;
        };
        if (this.renderFrame) {
          cancelAnimationFrame(this.renderFrame);
          this.renderFrame = null;
        }
        this.resize();
        if (this.needToProcess) this.process();
        this.needToProcess = false;
        this.clear();
        this.pickingLayers.forEach(function(layer) {
          return _this9.resetWebGLTexture(layer);
        });
        if (!this.graph.order) return exitRender();
        var mouseCaptor = this.mouseCaptor;
        var moving = this.camera.isAnimated() || mouseCaptor.isMoving || mouseCaptor.draggedEvents || mouseCaptor.currentWheelDirection;
        var cameraState = this.camera.getState();
        var viewportDimensions = this.getDimensions();
        var graphDimensions = this.getGraphDimensions();
        var padding = this.getStagePadding();
        this.matrix = matrixFromCamera(cameraState, viewportDimensions, graphDimensions, padding);
        this.invMatrix = matrixFromCamera(cameraState, viewportDimensions, graphDimensions, padding, true);
        this.correctionRatio = getMatrixImpact(this.matrix, cameraState, viewportDimensions);
        this.graphToViewportRatio = this.getGraphToViewportRatio();
        var params = this.getRenderParams();
        for (var type in this.nodePrograms) {
          var program = this.nodePrograms[type];
          program.render(params);
        }
        if (!this.settings.hideEdgesOnMove || !moving) {
          for (var _type7 in this.edgePrograms) {
            var _program2 = this.edgePrograms[_type7];
            _program2.render(params);
          }
        }
        if (this.settings.hideLabelsOnMove && moving) return exitRender();
        this.renderLabels();
        this.renderEdgeLabels();
        this.renderHighlightedNodes();
        return exitRender();
      }
      /**
       * Add a node in the internal data structures.
       * @private
       * @param key The node's graphology ID
       */
    }, {
      key: "addNode",
      value: function addNode2(key) {
        var attr = Object.assign({}, this.graph.getNodeAttributes(key));
        if (this.settings.nodeReducer) attr = this.settings.nodeReducer(key, attr);
        var data = applyNodeDefaults(this.settings, key, attr);
        this.nodeDataCache[key] = data;
        this.nodesWithForcedLabels["delete"](key);
        if (data.forceLabel && !data.hidden) this.nodesWithForcedLabels.add(key);
        this.highlightedNodes["delete"](key);
        if (data.highlighted && !data.hidden) this.highlightedNodes.add(key);
        if (this.settings.zIndex) {
          if (data.zIndex < this.nodeZExtent[0]) this.nodeZExtent[0] = data.zIndex;
          if (data.zIndex > this.nodeZExtent[1]) this.nodeZExtent[1] = data.zIndex;
        }
      }
      /**
       * Update a node the internal data structures.
       * @private
       * @param key The node's graphology ID
       */
    }, {
      key: "updateNode",
      value: function updateNode(key) {
        this.addNode(key);
        var data = this.nodeDataCache[key];
        this.normalizationFunction.applyTo(data);
      }
      /**
       * Remove a node from the internal data structures.
       * @private
       * @param key The node's graphology ID
       */
    }, {
      key: "removeNode",
      value: function removeNode(key) {
        delete this.nodeDataCache[key];
        delete this.nodeProgramIndex[key];
        this.highlightedNodes["delete"](key);
        if (this.hoveredNode === key) this.hoveredNode = null;
        this.nodesWithForcedLabels["delete"](key);
      }
      /**
       * Add an edge into the internal data structures.
       * @private
       * @param key The edge's graphology ID
       */
    }, {
      key: "addEdge",
      value: function addEdge2(key) {
        var attr = Object.assign({}, this.graph.getEdgeAttributes(key));
        if (this.settings.edgeReducer) attr = this.settings.edgeReducer(key, attr);
        var data = applyEdgeDefaults(this.settings, key, attr);
        this.edgeDataCache[key] = data;
        this.edgesWithForcedLabels["delete"](key);
        if (data.forceLabel && !data.hidden) this.edgesWithForcedLabels.add(key);
        if (this.settings.zIndex) {
          if (data.zIndex < this.edgeZExtent[0]) this.edgeZExtent[0] = data.zIndex;
          if (data.zIndex > this.edgeZExtent[1]) this.edgeZExtent[1] = data.zIndex;
        }
      }
      /**
       * Update an edge in the internal data structures.
       * @private
       * @param key The edge's graphology ID
       */
    }, {
      key: "updateEdge",
      value: function updateEdge(key) {
        this.addEdge(key);
      }
      /**
       * Remove an edge from the internal data structures.
       * @private
       * @param key The edge's graphology ID
       */
    }, {
      key: "removeEdge",
      value: function removeEdge(key) {
        delete this.edgeDataCache[key];
        delete this.edgeProgramIndex[key];
        if (this.hoveredEdge === key) this.hoveredEdge = null;
        this.edgesWithForcedLabels["delete"](key);
      }
      /**
       * Clear all indices related to nodes.
       * @private
       */
    }, {
      key: "clearNodeIndices",
      value: function clearNodeIndices() {
        this.labelGrid = new LabelGrid();
        this.nodeExtent = {
          x: [0, 1],
          y: [0, 1]
        };
        this.nodeDataCache = {};
        this.edgeProgramIndex = {};
        this.nodesWithForcedLabels = /* @__PURE__ */ new Set();
        this.nodeZExtent = [Infinity, -Infinity];
      }
      /**
       * Clear all indices related to edges.
       * @private
       */
    }, {
      key: "clearEdgeIndices",
      value: function clearEdgeIndices() {
        this.edgeDataCache = {};
        this.edgeProgramIndex = {};
        this.edgesWithForcedLabels = /* @__PURE__ */ new Set();
        this.edgeZExtent = [Infinity, -Infinity];
      }
      /**
       * Clear all indices.
       * @private
       */
    }, {
      key: "clearIndices",
      value: function clearIndices() {
        this.clearEdgeIndices();
        this.clearNodeIndices();
      }
      /**
       * Clear all graph state related to nodes.
       * @private
       */
    }, {
      key: "clearNodeState",
      value: function clearNodeState() {
        this.displayedNodeLabels = /* @__PURE__ */ new Set();
        this.highlightedNodes = /* @__PURE__ */ new Set();
        this.hoveredNode = null;
      }
      /**
       * Clear all graph state related to edges.
       * @private
       */
    }, {
      key: "clearEdgeState",
      value: function clearEdgeState() {
        this.displayedEdgeLabels = /* @__PURE__ */ new Set();
        this.highlightedNodes = /* @__PURE__ */ new Set();
        this.hoveredEdge = null;
      }
      /**
       * Clear all graph state.
       * @private
       */
    }, {
      key: "clearState",
      value: function clearState() {
        this.clearEdgeState();
        this.clearNodeState();
      }
      /**
       * Add the node data to its program.
       * @private
       * @param node The node's graphology ID
       * @param fingerprint A fingerprint used to identity the node with picking
       * @param position The index where to place the node in the program
       */
    }, {
      key: "addNodeToProgram",
      value: function addNodeToProgram(node, fingerprint, position) {
        var data = this.nodeDataCache[node];
        var nodeProgram = this.nodePrograms[data.type];
        if (!nodeProgram) throw new Error('Sigma: could not find a suitable program for node type "'.concat(data.type, '"!'));
        nodeProgram.process(fingerprint, position, data);
        this.nodeProgramIndex[node] = position;
      }
      /**
       * Add the edge data to its program.
       * @private
       * @param edge The edge's graphology ID
       * @param fingerprint A fingerprint used to identity the edge with picking
       * @param position The index where to place the edge in the program
       */
    }, {
      key: "addEdgeToProgram",
      value: function addEdgeToProgram(edge, fingerprint, position) {
        var data = this.edgeDataCache[edge];
        var edgeProgram = this.edgePrograms[data.type];
        if (!edgeProgram) throw new Error('Sigma: could not find a suitable program for edge type "'.concat(data.type, '"!'));
        var extremities = this.graph.extremities(edge), sourceData = this.nodeDataCache[extremities[0]], targetData = this.nodeDataCache[extremities[1]];
        edgeProgram.process(fingerprint, position, sourceData, targetData, data);
        this.edgeProgramIndex[edge] = position;
      }
      /**---------------------------------------------------------------------------
       * Public API.
       **---------------------------------------------------------------------------
       */
      /**
       * Function used to get the render params.
       *
       * @return {RenderParams}
       */
    }, {
      key: "getRenderParams",
      value: function getRenderParams() {
        return {
          matrix: this.matrix,
          invMatrix: this.invMatrix,
          width: this.width,
          height: this.height,
          pixelRatio: this.pixelRatio,
          zoomRatio: this.camera.ratio,
          cameraAngle: this.camera.angle,
          sizeRatio: 1 / this.scaleSize(),
          correctionRatio: this.correctionRatio,
          downSizingRatio: this.pickingDownSizingRatio,
          minEdgeThickness: this.settings.minEdgeThickness,
          antiAliasingFeather: this.settings.antiAliasingFeather
        };
      }
      /**
       * Function used to retrieve the actual stage padding value.
       *
       * @return {number}
       */
    }, {
      key: "getStagePadding",
      value: function getStagePadding() {
        var _this$settings = this.settings, stagePadding = _this$settings.stagePadding, autoRescale = _this$settings.autoRescale;
        return autoRescale ? stagePadding || 0 : 0;
      }
      /**
       * Function used to create a layer element.
       *
       * @param {string} id - Context's id.
       * @param {string} tag - The HTML tag to use.
       * @param options
       * @return {Sigma}
       */
    }, {
      key: "createLayer",
      value: function createLayer(id, tag) {
        var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        if (this.elements[id]) throw new Error('Sigma: a layer named "'.concat(id, '" already exists'));
        var element = createElement(tag, {
          position: "absolute"
        }, {
          "class": "sigma-".concat(id)
        });
        if (options.style) Object.assign(element.style, options.style);
        this.elements[id] = element;
        if ("beforeLayer" in options && options.beforeLayer) {
          this.elements[options.beforeLayer].before(element);
        } else if ("afterLayer" in options && options.afterLayer) {
          this.elements[options.afterLayer].after(element);
        } else {
          this.container.appendChild(element);
        }
        return element;
      }
      /**
       * Function used to create a canvas element.
       *
       * @param {string} id - Context's id.
       * @param options
       * @return {Sigma}
       */
    }, {
      key: "createCanvas",
      value: function createCanvas(id) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        return this.createLayer(id, "canvas", options);
      }
      /**
       * Function used to create a canvas context and add the relevant DOM elements.
       *
       * @param  {string} id - Context's id.
       * @param  options
       * @return {Sigma}
       */
    }, {
      key: "createCanvasContext",
      value: function createCanvasContext(id) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var canvas = this.createCanvas(id, options);
        var contextOptions = {
          preserveDrawingBuffer: false,
          antialias: false
        };
        this.canvasContexts[id] = canvas.getContext("2d", contextOptions);
        return this;
      }
      /**
       * Function used to create a WebGL context and add the relevant DOM
       * elements.
       *
       * @param  {string}  id      - Context's id.
       * @param  {object?} options - #getContext params to override (optional)
       * @return {WebGLRenderingContext}
       */
    }, {
      key: "createWebGLContext",
      value: function createWebGLContext(id) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var canvas = (options === null || options === void 0 ? void 0 : options.canvas) || this.createCanvas(id, options);
        if (options.hidden) canvas.remove();
        var contextOptions = _objectSpread2({
          preserveDrawingBuffer: false,
          antialias: false
        }, options);
        var context;
        context = canvas.getContext("webgl2", contextOptions);
        if (!context) context = canvas.getContext("webgl", contextOptions);
        if (!context) context = canvas.getContext("experimental-webgl", contextOptions);
        var gl = context;
        this.webGLContexts[id] = gl;
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        if (options.picking) {
          this.pickingLayers.add(id);
          var newFrameBuffer = gl.createFramebuffer();
          if (!newFrameBuffer) throw new Error("Sigma: cannot create a new frame buffer for layer ".concat(id));
          this.frameBuffers[id] = newFrameBuffer;
        }
        return gl;
      }
      /**
       * Function used to properly kill a layer.
       *
       * @param  {string} id - Layer id.
       * @return {Sigma}
       */
    }, {
      key: "killLayer",
      value: function killLayer(id) {
        var element = this.elements[id];
        if (!element) throw new Error("Sigma: cannot kill layer ".concat(id, ", which does not exist"));
        if (this.webGLContexts[id]) {
          var _gl$getExtension;
          var gl = this.webGLContexts[id];
          (_gl$getExtension = gl.getExtension("WEBGL_lose_context")) === null || _gl$getExtension === void 0 || _gl$getExtension.loseContext();
          delete this.webGLContexts[id];
        } else if (this.canvasContexts[id]) {
          delete this.canvasContexts[id];
        }
        element.remove();
        delete this.elements[id];
        return this;
      }
      /**
       * Method returning the renderer's camera.
       *
       * @return {Camera}
       */
    }, {
      key: "getCamera",
      value: function getCamera() {
        return this.camera;
      }
      /**
       * Method setting the renderer's camera.
       *
       * @param  {Camera} camera - New camera.
       * @return {Sigma}
       */
    }, {
      key: "setCamera",
      value: function setCamera(camera) {
        this.unbindCameraHandlers();
        this.camera = camera;
        this.bindCameraHandlers();
      }
      /**
       * Method returning the container DOM element.
       *
       * @return {HTMLElement}
       */
    }, {
      key: "getContainer",
      value: function getContainer() {
        return this.container;
      }
      /**
       * Method returning the renderer's graph.
       *
       * @return {Graph}
       */
    }, {
      key: "getGraph",
      value: function getGraph() {
        return this.graph;
      }
      /**
       * Method used to set the renderer's graph.
       *
       * @return {Graph}
       */
    }, {
      key: "setGraph",
      value: function setGraph(graph2) {
        if (graph2 === this.graph) return;
        if (this.hoveredNode && !graph2.hasNode(this.hoveredNode)) this.hoveredNode = null;
        if (this.hoveredEdge && !graph2.hasEdge(this.hoveredEdge)) this.hoveredEdge = null;
        this.unbindGraphHandlers();
        if (this.checkEdgesEventsFrame !== null) {
          cancelAnimationFrame(this.checkEdgesEventsFrame);
          this.checkEdgesEventsFrame = null;
        }
        this.graph = graph2;
        this.bindGraphHandlers();
        this.refresh();
      }
      /**
       * Method returning the mouse captor.
       *
       * @return {MouseCaptor}
       */
    }, {
      key: "getMouseCaptor",
      value: function getMouseCaptor() {
        return this.mouseCaptor;
      }
      /**
       * Method returning the touch captor.
       *
       * @return {TouchCaptor}
       */
    }, {
      key: "getTouchCaptor",
      value: function getTouchCaptor() {
        return this.touchCaptor;
      }
      /**
       * Method returning the current renderer's dimensions.
       *
       * @return {Dimensions}
       */
    }, {
      key: "getDimensions",
      value: function getDimensions() {
        return {
          width: this.width,
          height: this.height
        };
      }
      /**
       * Method returning the current graph's dimensions.
       *
       * @return {Dimensions}
       */
    }, {
      key: "getGraphDimensions",
      value: function getGraphDimensions() {
        var extent = this.customBBox || this.nodeExtent;
        return {
          width: extent.x[1] - extent.x[0] || 1,
          height: extent.y[1] - extent.y[0] || 1
        };
      }
      /**
       * Method used to get all the sigma node attributes.
       * It's useful for example to get the position of a node
       * and to get values that are set by the nodeReducer
       *
       * @param  {string} key - The node's key.
       * @return {NodeDisplayData | undefined} A copy of the desired node's attribute or undefined if not found
       */
    }, {
      key: "getNodeDisplayData",
      value: function getNodeDisplayData(key) {
        var node = this.nodeDataCache[key];
        return node ? Object.assign({}, node) : void 0;
      }
      /**
       * Method used to get all the sigma edge attributes.
       * It's useful for example to get values that are set by the edgeReducer.
       *
       * @param  {string} key - The edge's key.
       * @return {EdgeDisplayData | undefined} A copy of the desired edge's attribute or undefined if not found
       */
    }, {
      key: "getEdgeDisplayData",
      value: function getEdgeDisplayData(key) {
        var edge = this.edgeDataCache[key];
        return edge ? Object.assign({}, edge) : void 0;
      }
      /**
       * Method used to get the set of currently displayed node labels.
       *
       * @return {Set<string>} A set of node keys whose label is displayed.
       */
    }, {
      key: "getNodeDisplayedLabels",
      value: function getNodeDisplayedLabels() {
        return new Set(this.displayedNodeLabels);
      }
      /**
       * Method used to get the set of currently displayed edge labels.
       *
       * @return {Set<string>} A set of edge keys whose label is displayed.
       */
    }, {
      key: "getEdgeDisplayedLabels",
      value: function getEdgeDisplayedLabels() {
        return new Set(this.displayedEdgeLabels);
      }
      /**
       * Method returning a copy of the settings collection.
       *
       * @return {Settings} A copy of the settings collection.
       */
    }, {
      key: "getSettings",
      value: function getSettings() {
        return _objectSpread2({}, this.settings);
      }
      /**
       * Method returning the current value for a given setting key.
       *
       * @param  {string} key - The setting key to get.
       * @return {any} The value attached to this setting key or undefined if not found
       */
    }, {
      key: "getSetting",
      value: function getSetting(key) {
        return this.settings[key];
      }
      /**
       * Method setting the value of a given setting key. Note that this will schedule
       * a new render next frame.
       *
       * @param  {string} key - The setting key to set.
       * @param  {any}    value - The value to set.
       * @return {Sigma}
       */
    }, {
      key: "setSetting",
      value: function setSetting(key, value) {
        var oldValues = _objectSpread2({}, this.settings);
        this.settings[key] = value;
        validateSettings(this.settings);
        this.handleSettingsUpdate(oldValues);
        this.scheduleRefresh();
        return this;
      }
      /**
       * Method updating the value of a given setting key using the provided function.
       * Note that this will schedule a new render next frame.
       *
       * @param  {string}   key     - The setting key to set.
       * @param  {function} updater - The update function.
       * @return {Sigma}
       */
    }, {
      key: "updateSetting",
      value: function updateSetting(key, updater) {
        this.setSetting(key, updater(this.settings[key]));
        return this;
      }
      /**
       * Method setting multiple settings at once.
       *
       * @param  {Partial<Settings>} settings - The settings to set.
       * @return {Sigma}
       */
    }, {
      key: "setSettings",
      value: function setSettings(settings) {
        var oldValues = _objectSpread2({}, this.settings);
        this.settings = _objectSpread2(_objectSpread2({}, this.settings), settings);
        validateSettings(this.settings);
        this.handleSettingsUpdate(oldValues);
        this.scheduleRefresh();
        return this;
      }
      /**
       * Method used to resize the renderer.
       *
       * @param  {boolean} force - If true, then resize is processed even if size is unchanged (optional).
       * @return {Sigma}
       */
    }, {
      key: "resize",
      value: function resize(force) {
        var previousWidth = this.width, previousHeight = this.height;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.pixelRatio = getPixelRatio();
        if (this.width === 0) {
          if (this.settings.allowInvalidContainer) this.width = 1;
          else throw new Error("Sigma: Container has no width. You can set the allowInvalidContainer setting to true to stop seeing this error.");
        }
        if (this.height === 0) {
          if (this.settings.allowInvalidContainer) this.height = 1;
          else throw new Error("Sigma: Container has no height. You can set the allowInvalidContainer setting to true to stop seeing this error.");
        }
        if (!force && previousWidth === this.width && previousHeight === this.height) return this;
        for (var id in this.elements) {
          var element = this.elements[id];
          element.style.width = this.width + "px";
          element.style.height = this.height + "px";
        }
        for (var _id in this.canvasContexts) {
          this.elements[_id].setAttribute("width", this.width * this.pixelRatio + "px");
          this.elements[_id].setAttribute("height", this.height * this.pixelRatio + "px");
          if (this.pixelRatio !== 1) this.canvasContexts[_id].scale(this.pixelRatio, this.pixelRatio);
        }
        for (var _id2 in this.webGLContexts) {
          this.elements[_id2].setAttribute("width", this.width * this.pixelRatio + "px");
          this.elements[_id2].setAttribute("height", this.height * this.pixelRatio + "px");
          var gl = this.webGLContexts[_id2];
          gl.viewport(0, 0, this.width * this.pixelRatio, this.height * this.pixelRatio);
          if (this.pickingLayers.has(_id2)) {
            var currentTexture = this.textures[_id2];
            if (currentTexture) gl.deleteTexture(currentTexture);
          }
        }
        this.emit("resize");
        return this;
      }
      /**
       * Method used to clear all the canvases.
       *
       * @return {Sigma}
       */
    }, {
      key: "clear",
      value: function clear() {
        this.emit("beforeClear");
        this.webGLContexts.nodes.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null);
        this.webGLContexts.nodes.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);
        this.webGLContexts.edges.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null);
        this.webGLContexts.edges.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);
        this.webGLContexts.hoverNodes.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);
        this.canvasContexts.labels.clearRect(0, 0, this.width, this.height);
        this.canvasContexts.hovers.clearRect(0, 0, this.width, this.height);
        this.canvasContexts.edgeLabels.clearRect(0, 0, this.width, this.height);
        this.emit("afterClear");
        return this;
      }
      /**
       * Method used to refresh, i.e. force the renderer to reprocess graph
       * data and render, but keep the state.
       * - if a partialGraph is provided, we only reprocess those nodes & edges.
       * - if schedule is TRUE, we schedule a render instead of sync render
       * - if skipIndexation is TRUE, then labelGrid & program indexation are skipped (can be used if you haven't modify x, y, zIndex & size)
       *
       * @return {Sigma}
       */
    }, {
      key: "refresh",
      value: function refresh(opts) {
        var _this10 = this;
        var skipIndexation = (opts === null || opts === void 0 ? void 0 : opts.skipIndexation) !== void 0 ? opts === null || opts === void 0 ? void 0 : opts.skipIndexation : false;
        var schedule = (opts === null || opts === void 0 ? void 0 : opts.schedule) !== void 0 ? opts.schedule : false;
        var fullRefresh = !opts || !opts.partialGraph;
        if (fullRefresh) {
          this.clearEdgeIndices();
          this.clearNodeIndices();
          this.graph.forEachNode(function(node2) {
            return _this10.addNode(node2);
          });
          this.graph.forEachEdge(function(edge2) {
            return _this10.addEdge(edge2);
          });
        } else {
          var _opts$partialGraph, _opts$partialGraph2;
          var nodes = ((_opts$partialGraph = opts.partialGraph) === null || _opts$partialGraph === void 0 ? void 0 : _opts$partialGraph.nodes) || [];
          for (var i = 0, l = (nodes === null || nodes === void 0 ? void 0 : nodes.length) || 0; i < l; i++) {
            var node = nodes[i];
            this.updateNode(node);
            if (skipIndexation) {
              var programIndex = this.nodeProgramIndex[node];
              if (programIndex === void 0) throw new Error('Sigma: node "'.concat(node, `" can't be repaint`));
              this.addNodeToProgram(node, this.nodeIndices[node], programIndex);
            }
          }
          var edges = (opts === null || opts === void 0 || (_opts$partialGraph2 = opts.partialGraph) === null || _opts$partialGraph2 === void 0 ? void 0 : _opts$partialGraph2.edges) || [];
          for (var _i4 = 0, _l4 = edges.length; _i4 < _l4; _i4++) {
            var edge = edges[_i4];
            this.updateEdge(edge);
            if (skipIndexation) {
              var _programIndex = this.edgeProgramIndex[edge];
              if (_programIndex === void 0) throw new Error('Sigma: edge "'.concat(edge, `" can't be repaint`));
              this.addEdgeToProgram(edge, this.edgeIndices[edge], _programIndex);
            }
          }
        }
        if (fullRefresh || !skipIndexation) this.needToProcess = true;
        if (schedule) this.scheduleRender();
        else this.render();
        return this;
      }
      /**
       * Method used to schedule a render at the next available frame.
       * This method can be safely called on a same frame because it basically
       * debounces refresh to the next frame.
       *
       * @return {Sigma}
       */
    }, {
      key: "scheduleRender",
      value: function scheduleRender() {
        var _this11 = this;
        if (!this.renderFrame) {
          this.renderFrame = requestAnimationFrame(function() {
            _this11.render();
          });
        }
        return this;
      }
      /**
       * Method used to schedule a refresh (i.e. fully reprocess graph data and render)
       * at the next available frame.
       * This method can be safely called on a same frame because it basically
       * debounces refresh to the next frame.
       *
       * @return {Sigma}
       */
    }, {
      key: "scheduleRefresh",
      value: function scheduleRefresh(opts) {
        return this.refresh(_objectSpread2(_objectSpread2({}, opts), {}, {
          schedule: true
        }));
      }
      /**
       * Method used to (un)zoom, while preserving the position of a viewport point.
       * Used for instance to zoom "on the mouse cursor".
       *
       * @param viewportTarget
       * @param newRatio
       * @return {CameraState}
       */
    }, {
      key: "getViewportZoomedState",
      value: function getViewportZoomedState(viewportTarget, newRatio) {
        var _this$camera$getState = this.camera.getState(), ratio = _this$camera$getState.ratio, angle = _this$camera$getState.angle, x = _this$camera$getState.x, y = _this$camera$getState.y;
        var _this$settings2 = this.settings, minCameraRatio = _this$settings2.minCameraRatio, maxCameraRatio = _this$settings2.maxCameraRatio;
        if (typeof maxCameraRatio === "number") newRatio = Math.min(newRatio, maxCameraRatio);
        if (typeof minCameraRatio === "number") newRatio = Math.max(newRatio, minCameraRatio);
        var ratioDiff = newRatio / ratio;
        var center = {
          x: this.width / 2,
          y: this.height / 2
        };
        var graphMousePosition = this.viewportToFramedGraph(viewportTarget);
        var graphCenterPosition = this.viewportToFramedGraph(center);
        return {
          angle,
          x: (graphMousePosition.x - graphCenterPosition.x) * (1 - ratioDiff) + x,
          y: (graphMousePosition.y - graphCenterPosition.y) * (1 - ratioDiff) + y,
          ratio: newRatio
        };
      }
      /**
       * Method returning the abstract rectangle containing the graph according
       * to the camera's state.
       *
       * @return {object} - The view's rectangle.
       */
    }, {
      key: "viewRectangle",
      value: function viewRectangle() {
        var p1 = this.viewportToFramedGraph({
          x: 0,
          y: 0
        }), p2 = this.viewportToFramedGraph({
          x: this.width,
          y: 0
        }), h = this.viewportToFramedGraph({
          x: 0,
          y: this.height
        });
        return {
          x1: p1.x,
          y1: p1.y,
          x2: p2.x,
          y2: p2.y,
          height: p2.y - h.y
        };
      }
      /**
       * Method returning the coordinates of a point from the framed graph system to the viewport system. It allows
       * overriding anything that is used to get the translation matrix, or even the matrix itself.
       *
       * Be careful if overriding dimensions, padding or cameraState, as the computation of the matrix is not the lightest
       * of computations.
       */
    }, {
      key: "framedGraphToViewport",
      value: function framedGraphToViewport(coordinates) {
        var override = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var recomputeMatrix = !!override.cameraState || !!override.viewportDimensions || !!override.graphDimensions;
        var matrix = override.matrix ? override.matrix : recomputeMatrix ? matrixFromCamera(override.cameraState || this.camera.getState(), override.viewportDimensions || this.getDimensions(), override.graphDimensions || this.getGraphDimensions(), override.padding || this.getStagePadding()) : this.matrix;
        var viewportPos = multiplyVec2(matrix, coordinates);
        return {
          x: (1 + viewportPos.x) * this.width / 2,
          y: (1 - viewportPos.y) * this.height / 2
        };
      }
      /**
       * Method returning the coordinates of a point from the viewport system to the framed graph system. It allows
       * overriding anything that is used to get the translation matrix, or even the matrix itself.
       *
       * Be careful if overriding dimensions, padding or cameraState, as the computation of the matrix is not the lightest
       * of computations.
       */
    }, {
      key: "viewportToFramedGraph",
      value: function viewportToFramedGraph(coordinates) {
        var override = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var recomputeMatrix = !!override.cameraState || !!override.viewportDimensions || !override.graphDimensions;
        var invMatrix = override.matrix ? override.matrix : recomputeMatrix ? matrixFromCamera(override.cameraState || this.camera.getState(), override.viewportDimensions || this.getDimensions(), override.graphDimensions || this.getGraphDimensions(), override.padding || this.getStagePadding(), true) : this.invMatrix;
        var res = multiplyVec2(invMatrix, {
          x: coordinates.x / this.width * 2 - 1,
          y: 1 - coordinates.y / this.height * 2
        });
        if (isNaN(res.x)) res.x = 0;
        if (isNaN(res.y)) res.y = 0;
        return res;
      }
      /**
       * Method used to translate a point's coordinates from the viewport system (pixel distance from the top-left of the
       * stage) to the graph system (the reference system of data as they are in the given graph instance).
       *
       * This method accepts an optional camera which can be useful if you need to translate coordinates
       * based on a different view than the one being currently being displayed on screen.
       *
       * @param {Coordinates}                  viewportPoint
       * @param {CoordinateConversionOverride} override
       */
    }, {
      key: "viewportToGraph",
      value: function viewportToGraph(viewportPoint) {
        var override = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        return this.normalizationFunction.inverse(this.viewportToFramedGraph(viewportPoint, override));
      }
      /**
       * Method used to translate a point's coordinates from the graph system (the reference system of data as they are in
       * the given graph instance) to the viewport system (pixel distance from the top-left of the stage).
       *
       * This method accepts an optional camera which can be useful if you need to translate coordinates
       * based on a different view than the one being currently being displayed on screen.
       *
       * @param {Coordinates}                  graphPoint
       * @param {CoordinateConversionOverride} override
       */
    }, {
      key: "graphToViewport",
      value: function graphToViewport(graphPoint) {
        var override = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        return this.framedGraphToViewport(this.normalizationFunction(graphPoint), override);
      }
      /**
       * Method returning the distance multiplier between the graph system and the
       * viewport system.
       */
    }, {
      key: "getGraphToViewportRatio",
      value: function getGraphToViewportRatio() {
        var graphP1 = {
          x: 0,
          y: 0
        };
        var graphP2 = {
          x: 1,
          y: 1
        };
        var graphD = Math.sqrt(Math.pow(graphP1.x - graphP2.x, 2) + Math.pow(graphP1.y - graphP2.y, 2));
        var viewportP1 = this.graphToViewport(graphP1);
        var viewportP2 = this.graphToViewport(graphP2);
        var viewportD = Math.sqrt(Math.pow(viewportP1.x - viewportP2.x, 2) + Math.pow(viewportP1.y - viewportP2.y, 2));
        return viewportD / graphD;
      }
      /**
       * Method returning the graph's bounding box.
       *
       * @return {{ x: Extent, y: Extent }}
       */
    }, {
      key: "getBBox",
      value: function getBBox() {
        return this.nodeExtent;
      }
      /**
       * Method returning the graph's custom bounding box, if any.
       *
       * @return {{ x: Extent, y: Extent } | null}
       */
    }, {
      key: "getCustomBBox",
      value: function getCustomBBox() {
        return this.customBBox;
      }
      /**
       * Method used to override the graph's bounding box with a custom one. Give `null` as the argument to stop overriding.
       *
       * @return {Sigma}
       */
    }, {
      key: "setCustomBBox",
      value: function setCustomBBox(customBBox) {
        this.customBBox = customBBox;
        this.scheduleRender();
        return this;
      }
      /**
       * Method used to shut the container & release event listeners.
       *
       * @return {undefined}
       */
    }, {
      key: "kill",
      value: function kill() {
        this.emit("kill");
        this.removeAllListeners();
        this.unbindCameraHandlers();
        window.removeEventListener("resize", this.activeListeners.handleResize);
        this.mouseCaptor.kill();
        this.touchCaptor.kill();
        this.unbindGraphHandlers();
        this.clearIndices();
        this.clearState();
        this.nodeDataCache = {};
        this.edgeDataCache = {};
        this.highlightedNodes.clear();
        if (this.renderFrame) {
          cancelAnimationFrame(this.renderFrame);
          this.renderFrame = null;
        }
        if (this.renderHighlightedNodesFrame) {
          cancelAnimationFrame(this.renderHighlightedNodesFrame);
          this.renderHighlightedNodesFrame = null;
        }
        var container = this.container;
        while (container.firstChild) container.removeChild(container.firstChild);
        this.canvasContexts = {};
        this.webGLContexts = {};
        this.elements = {};
        for (var type in this.nodePrograms) {
          this.nodePrograms[type].kill();
        }
        for (var _type8 in this.nodeHoverPrograms) {
          this.nodeHoverPrograms[_type8].kill();
        }
        for (var _type9 in this.edgePrograms) {
          this.edgePrograms[_type9].kill();
        }
        this.nodePrograms = {};
        this.nodeHoverPrograms = {};
        this.edgePrograms = {};
        for (var id in this.elements) {
          this.killLayer(id);
        }
      }
      /**
       * Method used to scale the given size according to the camera's ratio, i.e.
       * zooming state.
       *
       * @param  {number?} size -        The size to scale (node size, edge thickness etc.).
       * @param  {number?} cameraRatio - A camera ratio (defaults to the actual camera ratio).
       * @return {number}              - The scaled size.
       */
    }, {
      key: "scaleSize",
      value: function scaleSize() {
        var size = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1;
        var cameraRatio = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.camera.ratio;
        return size / this.settings.zoomToSizeRatioFunction(cameraRatio) * (this.getSetting("itemSizesReference") === "positions" ? cameraRatio * this.graphToViewportRatio : 1);
      }
      /**
       * Method that returns the collection of all used canvases.
       * At the moment, the instantiated canvases are the following, and in the
       * following order in the DOM:
       * - `edges`
       * - `nodes`
       * - `edgeLabels`
       * - `labels`
       * - `hovers`
       * - `hoverNodes`
       * - `mouse`
       *
       * @return {PlainObject<HTMLCanvasElement>} - The collection of canvases.
       */
    }, {
      key: "getCanvases",
      value: function getCanvases() {
        var res = {};
        for (var layer in this.elements) if (this.elements[layer] instanceof HTMLCanvasElement) res[layer] = this.elements[layer];
        return res;
      }
    }]);
  }(TypedEventEmitter);

  // assets/data/property-nodes.json
  var property_nodes_default = [
    {
      id: "efficient",
      label: "Efficient",
      size: 20,
      color: "green",
      qualityType: "property",
      page: "/tag-efficient"
    },
    {
      id: "flexible",
      label: "Flexible",
      size: 20,
      color: "green",
      qualityType: "property",
      page: "/tag-flexible"
    },
    {
      id: "operable",
      label: "Operable",
      size: 20,
      color: "green",
      qualityType: "property",
      page: "/tag-operable"
    },
    {
      id: "reliable",
      label: "Reliable",
      size: 20,
      color: "green",
      qualityType: "property",
      page: "/tag-reliable"
    },
    {
      id: "safe",
      label: "Safe",
      size: 20,
      color: "green",
      qualityType: "property",
      page: "/tag-safe"
    },
    {
      id: "secure",
      label: "Secure",
      size: 20,
      color: "green",
      qualityType: "property",
      page: "/tag-secure"
    },
    {
      id: "suitable",
      label: "Suitable",
      size: 20,
      color: "green",
      qualityType: "property",
      page: "/tag-suitable"
    },
    {
      id: "usable",
      label: "Usable",
      size: 20,
      color: "green",
      qualityType: "property",
      page: "/tag-usable"
    }
  ];

  // assets/data/nodes.json
  var nodes_default = [
    {
      id: "access-control",
      label: "Access Control",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/access-control"
    },
    {
      id: "access-control-is-enforced",
      label: "Access control is enforced",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/access-control-is-enforced"
    },
    {
      id: "access-control-via-sso",
      label: "Access Control via SSO",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/access-control-via-sso"
    },
    {
      id: "access-find-function-quickly",
      label: "Access find function in three seconds",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/access-find-function-quickly"
    },
    {
      id: "accessibility",
      label: "Accessibility",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/accessibility"
    },
    {
      id: "accessible-user-interface",
      label: "Accessible User Interface",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/accessible-user-interface"
    },
    {
      id: "accountability",
      label: "Accountability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/accountability"
    },
    {
      id: "accuracy",
      label: "Accuracy",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/accuracy"
    },
    {
      id: "accurate-estimate-of-insurance-rate",
      label: "Accurate estimate of insurance contract rate",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/accurate-estimate-of-insurance-rate"
    },
    {
      id: "adaptability",
      label: "Adaptability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/adaptability"
    },
    {
      id: "add-new-product",
      label: "Add new product under 60 minutes",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/add-new-product"
    },
    {
      id: "affordability",
      label: "Affordability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/affordability"
    },
    {
      id: "affordable-crm",
      label: "Affordable CRM (customer relationship management)",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/affordable-crm"
    },
    {
      id: "agility",
      label: "Agility",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/agility"
    },
    {
      id: "analysability",
      label: "Analysability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/analysability"
    },
    {
      id: "anticipated-workplace-environment",
      label: "Anticipated Workplace Environment",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/anticipated-workplace-environment"
    },
    {
      id: "appearance",
      label: "Appearance",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/appearance"
    },
    {
      id: "appearance-requirements",
      label: "Appearance of mobile UI",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/appearance-requirements"
    },
    {
      id: "appropriateness-recognizability",
      label: "Appropriateness recognizability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/appropriateness-recognizability"
    },
    {
      id: "assess-impact-of-proposed-change",
      label: "Assess impact of proposed change",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/assess-impact-of-proposed-change"
    },
    {
      id: "attractiveness",
      label: "Attractiveness",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/attractiveness"
    },
    {
      id: "auditability",
      label: "Auditability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/auditability"
    },
    {
      id: "authenticity",
      label: "Authenticity",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/authenticity"
    },
    {
      id: "authenticity-of-digital-document",
      label: "Authenticity of a digital document",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/authenticity-of-digital-document"
    },
    {
      id: "autonomy",
      label: "Autonomy",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/autonomy"
    },
    {
      id: "availability",
      label: "Availability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/availability"
    },
    {
      id: "available-7-24-99",
      label: "Available 7x24 with 99% uptime",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/available-7-24-99"
    },
    {
      id: "avoid-common-vulnerabilities",
      label: "Avoid common vulnerabilities",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/avoid-common-vulnerabilities"
    },
    {
      id: "backup-patient-monitoring-sensor",
      label: "Backup patient monitoring sensor takes over",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/backup-patient-monitoring-sensor"
    },
    {
      id: "backward-compatibility",
      label: "Backward compatibility",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/backward-compatibility"
    },
    {
      id: "budget-constraint-library-update",
      label: "Budget constrained library update",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/budget-constraint-library-update"
    },
    {
      id: "budget-constraint",
      label: "Budget constraint",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/budget-constraint"
    },
    {
      id: "capacity",
      label: "Capacity",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/capacity"
    },
    {
      id: "capacity-to-process-sensor-inputs",
      label: "Capacity to process 1000 sensor inputs per minute",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/capacity-to-process-sensor-inputs"
    },
    {
      id: "carbon-emission-efficiency",
      label: "Carbon Emission Efficiency",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/carbon-emission-efficiency"
    },
    {
      id: "change-failure-rate",
      label: "Change failure rate",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/change-failure-rate"
    },
    {
      id: "changeability",
      label: "Changeability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/changeability"
    },
    {
      id: "clarity",
      label: "Clarity",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/clarity"
    },
    {
      id: "clarity-in-technical-documentation",
      label: "Clarity in technical documentation",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/clarity-in-technical-documentation"
    },
    {
      id: "co-existence",
      label: "Co-existence",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/co-existence"
    },
    {
      id: "code-complexity",
      label: "Code Complexity",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/code-complexity"
    },
    {
      id: "code-readability",
      label: "Code Readability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/code-readability"
    },
    {
      id: "coherence",
      label: "Coherence",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/coherence"
    },
    {
      id: "cohesion",
      label: "Cohesion",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/cohesion"
    },
    {
      id: "communicability",
      label: "Communicability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/communicability"
    },
    {
      id: "compatibility",
      label: "Compatibility",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/compatibility"
    },
    {
      id: "compatible-with-5-battery-providers",
      label: "Compatible with 5 different battery providers",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/compatible-with-5-battery-providers"
    },
    {
      id: "compliance",
      label: "Compliance",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/compliance"
    },
    {
      id: "compliance-with-ui-styleguide",
      label: "Compliance with UI styleguide",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/compliance-with-ui-styleguide"
    },
    {
      id: "compliance-to-wcag",
      label: "Compliance with WCA accessibility guidelines",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/compliance-to-wcag"
    },
    {
      id: "composability",
      label: "Composability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/composability"
    },
    {
      id: "conciseness",
      label: "Conciseness",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/conciseness"
    },
    {
      id: "confidentiality",
      label: "Confidentiality",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/confidentiality"
    },
    {
      id: "confidentiality-by-multitenance",
      label: "Confidentiality by multi-tenancy",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/confidentiality-by-multitenance"
    },
    {
      id: "configurability",
      label: "Configurability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/configurability"
    },
    {
      id: "configurable-ui-theme",
      label: "Configurable UI theme",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/configurable-ui-theme"
    },
    {
      id: "consistency",
      label: "Consistency",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/consistency"
    },
    {
      id: "consistent-keyboard-shortcuts",
      label: "Consistent keyboard shortcuts",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/consistent-keyboard-shortcuts"
    },
    {
      id: "controllability",
      label: "Controllability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/controllability"
    },
    {
      id: "convenience",
      label: "Convenience",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/convenience"
    },
    {
      id: "convenient-online-banking",
      label: "Convenient online banking",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/convenient-online-banking"
    },
    {
      id: "core-functions-on-mac-win-linux",
      label: "Core functions can be used on multiple OSs",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/core-functions-on-mac-win-linux"
    },
    {
      id: "correctness",
      label: "Correctness",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/correctness"
    },
    {
      id: "cost",
      label: "Cost",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/cost"
    },
    {
      id: "credibility",
      label: "Credibility",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/credibility"
    },
    {
      id: "cultural-sensitivity-in-content",
      label: "Cultural Sensitivity in Content",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/cultural-sensitivity-in-content"
    },
    {
      id: "customizability",
      label: "Customizability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/customizability"
    },
    {
      id: "cyber-security",
      label: "Cyber Security",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/cyber-security"
    },
    {
      id: "cycle-time",
      label: "Cycle time",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/cycle-time"
    },
    {
      id: "data-throughput-for-visual-test-system",
      label: "Data Throughput for Visual Test System",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/data-throughput-for-visual-test-system"
    },
    {
      id: "dependability",
      label: "Dependability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/dependability"
    },
    {
      id: "deployability",
      label: "Deployability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/deployability"
    },
    {
      id: "deployment-frequency",
      label: "Deployment frequency",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/deployment-frequency"
    },
    {
      id: "detailed-audit-log",
      label: "Detailed audit log",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/detailed-audit-log"
    },
    {
      id: "detect-inconsistent-user-input",
      label: "Detect inconsistent user input",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/detect-inconsistent-user-input"
    },
    {
      id: "devops-metrics",
      label: "Devops-Metrics",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/devops-metrics"
    },
    {
      id: "display-data-based-on-context",
      label: "Display Data Based on Context",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/display-data-based-on-context"
    },
    {
      id: "DORA-metrics",
      label: "DORA Metrics",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/DORA-metrics"
    },
    {
      id: "ease-of-use",
      label: "Ease of Use",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/ease-of-use"
    },
    {
      id: "change-cloud-provider",
      label: "Easily change cloud provider",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/change-cloud-provider"
    },
    {
      id: "understandable-acceptance-tests",
      label: "Easily understandable acceptance test cases",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/understandable-acceptance-tests"
    },
    {
      id: "understandable-generated-code",
      label: "Easily understandable generated code",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/understandable-generated-code"
    },
    {
      id: "easy-ui",
      label: "Easy UI",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/easy-ui"
    },
    {
      id: "effectiveness",
      label: "Effectiveness",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/effectiveness"
    },
    {
      id: "efficiency",
      label: "Efficiency",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/efficiency"
    },
    {
      id: "luggage-routing",
      label: "Efficient change of business rules",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/luggage-routing"
    },
    {
      id: "efficient-generation-of-test-data",
      label: "Efficient generation of test data",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/efficient-generation-of-test-data"
    },
    {
      id: "efficient-save-function",
      label: "Efficient save function",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/efficient-save-function"
    },
    {
      id: "annual-tax-update",
      label: "Efficient update of annual accounting report",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/annual-tax-update"
    },
    {
      id: "elasticity",
      label: "Elasticity",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/elasticity"
    },
    {
      id: "employee-attempts-to-modify-pay-rate",
      label: "Employee attempts to modify pay rate",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/employee-attempts-to-modify-pay-rate"
    },
    {
      id: "encrypted-storage",
      label: "Encrypted storage",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/encrypted-storage"
    },
    {
      id: "energy-efficiency",
      label: "Energy Efficiency",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/energy-efficiency"
    },
    {
      id: "every-data-modification-is-logged",
      label: "Every data modification is logged",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/every-data-modification-is-logged"
    },
    {
      id: "expected-physical-environment",
      label: "Expected physical environment",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/expected-physical-environment"
    },
    {
      id: "explainability",
      label: "Explainability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/explainability"
    },
    {
      id: "expressive-error-messages",
      label: "Expressive error messages",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/expressive-error-messages"
    },
    {
      id: "extensibility",
      label: "Extensibility",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/extensibility"
    },
    {
      id: "fail-safe",
      label: "Fail safe",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/fail-safe"
    },
    {
      id: "fast-accurate-sensor",
      label: "Fast and accurate sensor",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/fast-accurate-sensor"
    },
    {
      id: "fast-creation-of-sales-report",
      label: "Fast creation of sales report",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/fast-creation-of-sales-report"
    },
    {
      id: "fast-deployment",
      label: "Fast deployment",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/fast-deployment"
    },
    {
      id: "fast-rollout-of-changes",
      label: "Fast rollout of changes",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/fast-rollout-of-changes"
    },
    {
      id: "fast-startup-time",
      label: "Fast startup time (less than 90 sec)",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/fast-startup-time"
    },
    {
      id: "fault-isolation",
      label: "Fault isolation",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/fault-isolation"
    },
    {
      id: "fault-tolerance",
      label: "Fault tolerance",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/fault-tolerance"
    },
    {
      id: "faultlessness",
      label: "Faultlessness",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/faultlessness"
    },
    {
      id: "features",
      label: "Features",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/features"
    },
    {
      id: "flexibility",
      label: "Flexibility",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/flexibility"
    },
    {
      id: "functional-appropriateness",
      label: "Functional Appropriateness",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/functional-appropriateness"
    },
    {
      id: "functional-completeness",
      label: "Functional completeness",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/functional-completeness"
    },
    {
      id: "functional-correctness",
      label: "Functional correctness",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/functional-correctness"
    },
    {
      id: "functional-suitability",
      label: "Functional suitability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/functional-suitability"
    },
    {
      id: "functionality",
      label: "Functionality",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/functionality"
    },
    {
      id: "global-explainability",
      label: "Global Explainability",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/global-explainability"
    },
    {
      id: "good-code-readability-score",
      label: "Good code readability score",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/good-code-readability-score"
    },
    {
      id: "graceful-degradation",
      label: "Graceful degradation",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/graceful-degradation"
    },
    {
      id: "handle-sudden-increase-in-traffic",
      label: "Handle sudden increase in traffic",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/handle-sudden-increase-in-traffic"
    },
    {
      id: "hazard-warning",
      label: "Hazard warning",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/hazard-warning"
    },
    {
      id: "high-availability",
      label: "High availability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/high-availability"
    },
    {
      id: "i18n",
      label: "i18n (Internationalization)",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/i18n"
    },
    {
      id: "immunity",
      label: "Immunity",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/immunity"
    },
    {
      id: "inclusive-user-testing",
      label: "Inclusive User Testing",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/inclusive-user-testing"
    },
    {
      id: "inclusivity",
      label: "Inclusivity",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/inclusivity"
    },
    {
      id: "independence",
      label: "Independence",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/independence"
    },
    {
      id: "independent-enhancement-of-subsystem",
      label: "Independent enhancement of subsystem",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/independent-enhancement-of-subsystem"
    },
    {
      id: "independent-replacement-of-subsystem",
      label: "Independent replacement of subsystem",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/independent-replacement-of-subsystem"
    },
    {
      id: "information-security",
      label: "Information Security",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/information-security"
    },
    {
      id: "installability",
      label: "Installability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/installability"
    },
    {
      id: "integrity",
      label: "Integrity",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/integrity"
    },
    {
      id: "interaction-capability",
      label: "Interaction capability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/interaction-capability"
    },
    {
      id: "internationalization",
      label: "Internationalization",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/internationalization"
    },
    {
      id: "interoperability",
      label: "Interoperability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/interoperability"
    },
    {
      id: "interoperable-with-java-12",
      label: "Interoperable with Java 12",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/interoperable-with-java-12"
    },
    {
      id: "interruptable-backend-process",
      label: "Interruptable backend process",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/interruptable-backend-process"
    },
    {
      id: "intrusion-detection",
      label: "Intrusion Detection",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/intrusion-detection"
    },
    {
      id: "intrusion-prevention",
      label: "Intrusion Prevention",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/intrusion-prevention"
    },
    {
      id: "jitter",
      label: "Jitter",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/jitter"
    },
    {
      id: "keep-data-on-error",
      label: "Keep data on error",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/keep-data-on-error"
    },
    {
      id: "latency",
      label: "Latency",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/latency"
    },
    {
      id: "lead-time-for-changes",
      label: "Lead time for changes",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/lead-time-for-changes"
    },
    {
      id: "learnability",
      label: "Learnability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/learnability"
    },
    {
      id: "legal-requirements",
      label: "Legal Requirements",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/legal-requirements"
    },
    {
      id: "legibility",
      label: "Legibility",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/legibility"
    },
    {
      id: "local-explainability",
      label: "Local Explainability",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/local-explainability"
    },
    {
      id: "localizability",
      label: "Localizability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/localizability"
    },
    {
      id: "localizable-to-n-languages",
      label: "Localizable to several languages",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/localizable-to-n-languages"
    },
    {
      id: "longevity",
      label: "Longevity",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/longevity"
    },
    {
      id: "loose-coupling",
      label: "Loose Coupling",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/loose-coupling"
    },
    {
      id: "low-change-failure-rate",
      label: "Low change-failure rate",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/low-change-failure-rate"
    },
    {
      id: "low-effort-deployment",
      label: "Low effort deployment",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/low-effort-deployment"
    },
    {
      id: "low-impact-diagnosis",
      label: "Low impact diagnosis",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/low-impact-diagnosis"
    },
    {
      id: "query-execution-management",
      label: "Low-overhead query execution measurement",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/query-execution-management"
    },
    {
      id: "maintainability",
      label: "Maintainability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/maintainability"
    },
    {
      id: "maintainable-checking-strategy",
      label: "Maintainable checking strategies",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/maintainable-checking-strategy"
    },
    {
      id: "mean-time-between-failures",
      label: "Mean time between failures",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/mean-time-between-failures"
    },
    {
      id: "mean-time-to-recovery",
      label: "Mean time to recovery",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/mean-time-to-recovery"
    },
    {
      id: "memory-usage",
      label: "Memory usage",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/memory-usage"
    },
    {
      id: "minimize-jitter",
      label: "Minimize jitter in real-time data streaming",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/minimize-jitter"
    },
    {
      id: "modifiability",
      label: "Modifiability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/modifiability"
    },
    {
      id: "modular-system-for-data-analysis",
      label: "Modular System for Data Analysis",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/modular-system-for-data-analysis"
    },
    {
      id: "modularity",
      label: "Modularity",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/modularity"
    },
    {
      id: "multilinguality-support",
      label: "Multilinguality Support",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/multilinguality-support"
    },
    {
      id: "near-instant-search-results",
      label: "Near instant search results",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/near-instant-search-results"
    },
    {
      id: "new-features-introduct-no-bugs",
      label: "New Features Introduce No Bugs",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/new-features-introduct-no-bugs"
    },
    {
      id: "learnability-find-article",
      label: "New users learn to find articles on their own",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/learnability-find-article"
    },
    {
      id: "non-repudiation",
      label: "Non-repudiation",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/non-repudiation"
    },
    {
      id: "observability",
      label: "Observability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/observability"
    },
    {
      id: "only-authenticated-users-can-access",
      label: "Only authenticated users can access data",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/only-authenticated-users-can-access"
    },
    {
      id: "operability",
      label: "Operability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/operability"
    },
    {
      id: "operational-environment-requirements",
      label: "Operational and Environment Requirements",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/operational-environment-requirements"
    },
    {
      id: "operational-constraint",
      label: "Operational constraint",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/operational-constraint"
    },
    {
      id: "order-queue",
      label: "Order queue",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/order-queue"
    },
    {
      id: "parallel-data-modification",
      label: "Parallel Data Modification",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/parallel-data-modification"
    },
    {
      id: "patient-safety",
      label: "Patient Safety",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/patient-safety"
    },
    {
      id: "performance",
      label: "Performance",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/performance"
    },
    {
      id: "personalization",
      label: "Personalization",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/personalization"
    },
    {
      id: "portability",
      label: "Portability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/portability"
    },
    {
      id: "portable-business-data-checker",
      label: "Portable Business Data Checker",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/portable-business-data-checker"
    },
    {
      id: "high-precision-calculation",
      label: "Precise calculation of gamma coefficient",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/high-precision-calculation"
    },
    {
      id: "preciseness",
      label: "Preciseness",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/preciseness"
    },
    {
      id: "precision",
      label: "Precision",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/precision"
    },
    {
      id: "precise-vehicle-orientation-gps",
      label: "Precision of vehicle's orientation",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/precise-vehicle-orientation-gps"
    },
    {
      id: "predictability",
      label: "Predictability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/predictability"
    },
    {
      id: "privacy",
      label: "Privacy",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/privacy"
    },
    {
      id: "profitability",
      label: "Profitability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/profitability"
    },
    {
      id: "protect-data-by-security-procols",
      label: "Protect Data by Establishing Security Protocols",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/protect-data-by-security-procols"
    },
    {
      id: "quick-unit-tests",
      label: "Quick unit tests",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/quick-unit-tests"
    },
    {
      id: "quickly-locate-bugs",
      label: "Quickly locate bugs",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/quickly-locate-bugs"
    },
    {
      id: "readability",
      label: "Readability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/readability"
    },
    {
      id: "recognize-assistive-technology",
      label: "Recognize Assistive Technologies",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/recognize-assistive-technology"
    },
    {
      id: "recoverability",
      label: "Recoverability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/recoverability"
    },
    {
      id: "recovery-time",
      label: "Recovery time",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/recovery-time"
    },
    {
      id: "reduce-energy-consumption-with-new-version",
      label: "Reduce energy consumption with every new version",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/reduce-energy-consumption-with-new-version"
    },
    {
      id: "releasability",
      label: "Releasability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/releasability"
    },
    {
      id: "reliability",
      label: "Reliability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/reliability"
    },
    {
      id: "reliable-backup-and-restore",
      label: "Reliable Backup and Restore",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/reliable-backup-and-restore"
    },
    {
      id: "reliable-erh-system",
      label: "Reliable ERH System",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/reliable-erh-system"
    },
    {
      id: "replaceability",
      label: "Replaceability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/replaceability"
    },
    {
      id: "reproducibility",
      label: "Reproducibility",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/reproducibility"
    },
    {
      id: "resilience",
      label: "Resilience",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/resilience"
    },
    {
      id: "resistance",
      label: "Resistance",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/resistance"
    },
    {
      id: "resource-efficiency",
      label: "Resource efficiency",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/resource-efficiency"
    },
    {
      id: "resource-utilization",
      label: "Resource utilization",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/resource-utilization"
    },
    {
      id: "respond-to-15000-requests-per-workday",
      label: "Respond to 15000 requests per workday",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/respond-to-15000-requests-per-workday"
    },
    {
      id: "response-time",
      label: "Response Time",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/response-time"
    },
    {
      id: "response-time-for-image-rendering",
      label: "Response time for image rendering",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/response-time-for-image-rendering"
    },
    {
      id: "responsiveness",
      label: "Responsiveness",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/responsiveness"
    },
    {
      id: "restore-filter-after-log-in",
      label: "Restore Filter after Log In",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/restore-filter-after-log-in"
    },
    {
      id: "mttr-12h",
      label: "Restored to fully functional state 12h after complete failure",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/mttr-12h"
    },
    {
      id: "restricted-memory",
      label: "Restricted Memory",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/restricted-memory"
    },
    {
      id: "reusability",
      label: "Reusability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/reusability"
    },
    {
      id: "risk-identification",
      label: "Risk identification",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/risk-identification"
    },
    {
      id: "robustness",
      label: "Robustness",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/robustness"
    },
    {
      id: "rollout-new-feature",
      label: "Rollout of a new feature",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/rollout-new-feature"
    },
    {
      id: "safe-integration",
      label: "Safe integration",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/safe-integration"
    },
    {
      id: "safety",
      label: "Safety",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/safety"
    },
    {
      id: "carbon-efficiency-save",
      label: "Save at least 20% of carbon emissions with every new version",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/carbon-efficiency-save"
    },
    {
      id: "scalability",
      label: "Scalability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/scalability"
    },
    {
      id: "scale-up-in-2-minutes",
      label: "Scale up in 2 Minutes",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/scale-up-in-2-minutes"
    },
    {
      id: "securability",
      label: "Securability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/securability"
    },
    {
      id: "security",
      label: "Security",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/security"
    },
    {
      id: "self-containedness",
      label: "Self-containedness",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/self-containedness"
    },
    {
      id: "self-descriptiveness",
      label: "Self-descriptiveness",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/self-descriptiveness"
    },
    {
      id: "server-fails-operation-without-downtime",
      label: "Server fails, system continues to operate without downtime",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/server-fails-operation-without-downtime"
    },
    {
      id: "shutdown-to-safe-state",
      label: "Severe errors are detected and the system shuts down into safe state",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/shutdown-to-safe-state"
    },
    {
      id: "simplicity",
      label: "Simplicity",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/simplicity"
    },
    {
      id: "speed",
      label: "Speed",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/speed"
    },
    {
      id: "speed-to-market",
      label: "Speed to Market",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/speed-to-market"
    },
    {
      id: "stability",
      label: "Stability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/stability"
    },
    {
      id: "standard-compliance",
      label: "Standard Compliance",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/standard-compliance"
    },
    {
      id: "startup-time",
      label: "Startup Time",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/startup-time"
    },
    {
      id: "suitability",
      label: "Suitability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/suitability"
    },
    {
      id: "sustainability",
      label: "Sustainability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/sustainability"
    },
    {
      id: "long-running-without-reboot",
      label: "System can run >12h without re-booting the operating system",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/long-running-without-reboot"
    },
    {
      id: "system-runs-offline",
      label: "System runs offline",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/system-runs-offline"
    },
    {
      id: "test-coverage",
      label: "Test Coverage",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/test-coverage"
    },
    {
      id: "test-with-path-coverage-30min",
      label: "Test with path coverage in 30min",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/test-with-path-coverage-30min"
    },
    {
      id: "testability",
      label: "Testability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/testability"
    },
    {
      id: "throughput",
      label: "Throughput",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/throughput"
    },
    {
      id: "time-behaviour",
      label: "Time behaviour",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/time-behaviour"
    },
    {
      id: "time-to-market",
      label: "Time to Market",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/time-to-market"
    },
    {
      id: "timeliness",
      label: "Timeliness",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/timeliness"
    },
    {
      id: "traceability",
      label: "Traceability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/traceability"
    },
    {
      id: "transparency",
      label: "Transparency",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/transparency"
    },
    {
      id: "unavailability-max-2-minutes",
      label: "Unavailable for max 2 minutes",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/unavailability-max-2-minutes"
    },
    {
      id: "understandability",
      label: "Understandability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/understandability"
    },
    {
      id: "up-to-date-api",
      label: "Up to date API",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/up-to-date-api"
    },
    {
      id: "upgradeability",
      label: "Upgradeability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/upgradeability"
    },
    {
      id: "usability",
      label: "Usability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/usability"
    },
    {
      id: "usable-despite-color-blindness",
      label: "Usable Despite Color Blindness",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/usable-despite-color-blindness"
    },
    {
      id: "usable-on-factory-floor",
      label: "Usable on Factory Floor",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/usable-on-factory-floor"
    },
    {
      id: "usable-with-gloves",
      label: "Usable With Gloves",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/usable-with-gloves"
    },
    {
      id: "user-assistance",
      label: "User assistance",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/user-assistance"
    },
    {
      id: "user-engagement",
      label: "User engagement",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/user-engagement"
    },
    {
      id: "user-error-protection",
      label: "User error protection",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/user-error-protection"
    },
    {
      id: "user-experience",
      label: "User experience",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/user-experience"
    },
    {
      id: "user-interface-aesthetics",
      label: "User interface aesthetics",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/user-interface-aesthetics"
    },
    {
      id: "user-interface-works-with-current-browsers",
      label: "User Interface can be used in Current Browsers",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/user-interface-works-with-current-browsers"
    },
    {
      id: "user-tries-primary-function",
      label: "User tries to achieve primary function",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/user-tries-primary-function"
    },
    {
      id: "accurate-vehicle-position-gps",
      label: "Vehicle's position validity influences accuracy",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/accurate-vehicle-position-gps"
    },
    {
      id: "versatility",
      label: "Versatility",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/versatility"
    },
    {
      id: "vulnerability",
      label: "Vulnerability",
      size: 10,
      color: "blue",
      qualityType: "quality",
      page: "/qualities/vulnerability"
    },
    {
      id: "withstand-ddos-attack",
      label: "Withstand DDoS Attack",
      size: 5,
      color: "yellow",
      qualityType: "requirement",
      page: "/requirements/withstand-ddos-attack"
    },
    {
      id: "zero-knowledge-data-storage",
      label: "Zero-knowledge data storage",
      size: 5,
      color: "yellow",
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

  // src/graphs/utils.js
  function createRootNode(graph2, label, size, color) {
    graph2.addNode("quality-root", {
      label,
      size,
      x: 0,
      y: 0,
      color
    });
  }
  function createNodes(graph2, nodes) {
    nodes.forEach(
      (node) => graph2.addNode(node.id, {
        label: node.label,
        size: node.size,
        color: node.color,
        qualityType: node.qualityType,
        page: node.page
      })
    );
  }
  function createEdges(graph2, edges) {
    edges.forEach((edge) => graph2.addEdge(edge.source, edge.target));
  }
  function getDefaultNodeColor(graph2, node) {
    switch (graph2.getNodeAttribute(node, "qualityType")) {
      case "property":
        return "green";
      case "quality":
        return "blue";
      default:
        return "orange";
    }
  }
  function applyEnhancedRadialLayout(graph2, rootId, levelRadius = 150) {
    graph2.updateNodeAttributes(rootId, (attr) => ({
      ...attr,
      x: 0,
      y: 0,
      hierarchyLevel: 1
    }));
    const propertyNodes = graph2.inNeighbors(rootId).filter((n) => graph2.getNodeAttribute(n, "qualityType") === "property");
    const propertyAngleStep = 2 * Math.PI / propertyNodes.length;
    propertyNodes.forEach((propNode, i) => {
      const angle = i * propertyAngleStep;
      const x = levelRadius * Math.cos(angle);
      const y = levelRadius * Math.sin(angle);
      graph2.updateNodeAttributes(propNode, (attr) => ({
        ...attr,
        x,
        y,
        angle,
        hierarchyLevel: 2
      }));
    });
    const qualityNodes = /* @__PURE__ */ new Set();
    const propertyConnections = /* @__PURE__ */ new Map();
    propertyNodes.forEach((propNode) => {
      graph2.inNeighbors(propNode).forEach((n) => {
        if (graph2.getNodeAttribute(n, "qualityType") === "quality") {
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
      singleConnNodes.forEach(({ id, connections }) => {
        const propId = connections[0];
        if (!nodesByProperty.has(propId)) {
          nodesByProperty.set(propId, []);
        }
        nodesByProperty.get(propId).push(id);
      });
      nodesByProperty.forEach((nodes, propId) => {
        const propX = graph2.getNodeAttribute(propId, "x");
        const propY = graph2.getNodeAttribute(propId, "y");
        const propAngle = graph2.getNodeAttribute(propId, "angle");
        const qualityRadius = levelRadius * 1;
        const angleStep = Math.PI / 1.5 / (nodes.length + 1);
        nodes.forEach((nodeId, i) => {
          const angle = propAngle - Math.PI / 4 + (i + 1) * angleStep;
          const x = propX + qualityRadius * Math.cos(angle);
          const y = propY + qualityRadius * Math.sin(angle);
          graph2.updateNodeAttributes(nodeId, (attr) => ({
            ...attr,
            x,
            y,
            hierarchyLevel: 3
          }));
        });
      });
    }
    for (let connCount = 2; connCount <= propertyNodes.length; connCount++) {
      if (qualityNodesByConnections.has(connCount)) {
        const multiConnNodes = qualityNodesByConnections.get(connCount);
        multiConnNodes.forEach(({ id, connections }) => {
          let avgX = 0, avgY = 0;
          connections.forEach((propId) => {
            avgX += graph2.getNodeAttribute(propId, "x");
            avgY += graph2.getNodeAttribute(propId, "y");
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
          graph2.updateNodeAttributes(id, (attr) => ({
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
      graph2.inNeighbors(qualityNode).forEach((n) => {
        if (graph2.getNodeAttribute(n, "qualityType") === "requirement") {
          reqNodes.add(n);
        }
      });
    });
    if (reqNodes.size > 0) {
      const reqByQuality = /* @__PURE__ */ new Map();
      reqNodes.forEach((reqId) => {
        const parents = graph2.outNeighbors(reqId).filter((n) => graph2.getNodeAttribute(n, "qualityType") === "quality");
        if (parents.length > 0) {
          const mainParent = parents[0];
          if (!reqByQuality.has(mainParent)) {
            reqByQuality.set(mainParent, []);
          }
          reqByQuality.get(mainParent).push(reqId);
        }
      });
      reqByQuality.forEach((reqs, qualityId) => {
        const qualityX = graph2.getNodeAttribute(qualityId, "x");
        const qualityY = graph2.getNodeAttribute(qualityId, "y");
        const angleToCenter = Math.atan2(qualityY, qualityX);
        const reqRadius = levelRadius * 0.7;
        const reqAngleStep = Math.PI / (reqs.length + 1);
        reqs.forEach((reqId, i) => {
          const angle = angleToCenter + Math.PI - reqAngleStep * (reqs.length / 2) + reqAngleStep * (i + 1);
          const x = qualityX + reqRadius * Math.cos(angle);
          const y = qualityY + reqRadius * Math.sin(angle);
          graph2.updateNodeAttributes(reqId, (attr) => ({
            ...attr,
            x,
            y,
            hierarchyLevel: 4
          }));
        });
      });
    }
    adjustNodeOverlaps(graph2, 30);
  }
  function adjustNodeOverlaps(graph2, minDistance) {
    const iterations = 50;
    const nodePositions = [];
    graph2.forEachNode((nodeId, attrs) => {
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
        // Don't move root node
        qualityType,
        // Track node type
        minDist: nodeDist
        // Individual min distance
      });
    });
    for (let iter = 0; iter < iterations; iter++) {
      let moved = false;
      for (let i = 0; i < nodePositions.length; i++) {
        if (nodePositions[i].fixed) continue;
        let dx = 0, dy = 0;
        for (let j = 0; j < nodePositions.length; j++) {
          if (i === j) continue;
          const xDiff = nodePositions[i].x - nodePositions[j].x;
          const yDiff = nodePositions[i].y - nodePositions[j].y;
          const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
          const effectiveMinDist = Math.max(nodePositions[i].minDist, nodePositions[j].minDist);
          if (distance > 0 && distance < effectiveMinDist) {
            let forceMultiplier = 0.1;
            if (nodePositions[i].qualityType === "quality") {
              forceMultiplier = 0.15;
            }
            const force = (effectiveMinDist - distance) / distance;
            dx += xDiff * force * forceMultiplier;
            dy += yDiff * force * forceMultiplier;
            moved = true;
          }
        }
        if (dx !== 0 || dy !== 0) {
          nodePositions[i].x += dx;
          nodePositions[i].y += dy;
        }
        const node = nodePositions[i];
        const distFromCenter = Math.sqrt(node.x * node.x + node.y * node.y);
        const targetDist = (node.level - 1) * minDistance * 3;
        if (Math.abs(distFromCenter - targetDist) > minDistance * 0.5) {
          const angle = Math.atan2(node.y, node.x);
          nodePositions[i].x = targetDist * Math.cos(angle);
          nodePositions[i].y = targetDist * Math.sin(angle);
        }
      }
      if (!moved) break;
    }
    nodePositions.forEach(({ id, x, y }) => {
      graph2.updateNodeAttributes(id, (attrs) => ({
        ...attrs,
        x,
        y
      }));
    });
  }

  // src/graphs/events.js
  var addPointerOnForNonQualityRootNode = (hoveredNode, renderer2) => {
    if (hoveredNode !== "quality-root") renderer2.getContainer().style.cursor = "pointer";
  };
  var resetCursorToDefault = (renderer2) => renderer2.getContainer().style.cursor = "default";
  var registerHomeGraphEvents = (renderer2, graph2) => {
    renderer2.on("enterNode", (event) => {
      const hoveredNode = event.node;
      addPointerOnForNonQualityRootNode(hoveredNode, renderer2);
      if (graph2.getNodeAttribute(hoveredNode, "qualityType") === "property") {
        graph2.forEachEdge((edge, _, sourceNode, targetNode) => {
          const isSourceProperty = graph2.getNodeAttribute(sourceNode, "qualityType") === "property";
          if (targetNode === hoveredNode) {
            graph2.updateNodeAttribute(sourceNode, "hidden", () => false);
            graph2.updateEdgeAttribute(edge, "hidden", () => false);
          } else if (!isSourceProperty) {
            graph2.updateEdgeAttribute(edge, "hidden", () => true);
          }
        });
      }
      renderer2.refresh();
    });
    renderer2.on("leaveNode", () => {
      resetCursorToDefault(renderer2);
      graph2.forEachNode((node) => {
        const { qualityType, hidden } = graph2.getNodeAttributes(node);
        if (qualityType === "quality" && !hidden) {
          graph2.updateNodeAttribute(node, "hidden", () => true);
        }
      });
      renderer2.refresh();
    });
  };
  var registerFullGraphEvents = (renderer2, graph2) => {
    renderer2.on("enterNode", (event) => {
      const hoveredNode = event.node;
      addPointerOnForNonQualityRootNode(hoveredNode, renderer2);
      graph2.forEachEdge((edgeId, _, sourceNode, targetNode) => {
        const isRelated = sourceNode === hoveredNode || targetNode === hoveredNode;
        graph2.updateEdgeAttribute(edgeId, "color", () => isRelated ? "red" : "#E0E0E0");
      });
      graph2.forEachNode((node) => {
        const isConnected = graph2.hasEdge(hoveredNode, node) || graph2.hasEdge(node, hoveredNode);
        graph2.updateNodeAttribute(
          node,
          "color",
          () => isConnected ? graph2.getNodeAttribute(node, "color") : "#CCCCCC"
        );
      });
    });
    renderer2.on("leaveNode", () => {
      resetCursorToDefault(renderer2);
      graph2.forEachEdge((edgeId) => {
        graph2.updateEdgeAttribute(edgeId, "color", () => DEFAULT_SETTINGS.defaultEdgeColor);
      });
      graph2.forEachNode((node) => {
        graph2.updateNodeAttribute(node, "color", () => getDefaultNodeColor(graph2, node));
      });
    });
  };
  var registerGraphEvents = (graph2, renderer2) => {
    const graphName = graph2.getAttribute("name");
    renderer2.on("doubleClickNode", (event) => {
      if (event.node !== "quality-root") {
        window.location.href = graph2.getNodeAttribute(event.node, "page");
      }
    });
    if (graphName === "home") {
      registerHomeGraphEvents(renderer2, graph2);
    } else {
      registerFullGraphEvents(renderer2, graph2);
    }
  };

  // src/graphs/filter.js
  var filterGraph = (filterTerm, graph2, renderer2) => {
    if (!filterTerm || filterTerm.trim() === "") {
      graph2.forEachNode((node) => {
        graph2.setNodeAttribute(node, "hidden", false);
      });
      graph2.forEachEdge((edge) => {
        graph2.setEdgeAttribute(edge, "hidden", false);
      });
      renderer2.refresh();
      return;
    }
    const lowerFilterTerm = filterTerm.toLowerCase();
    const visibleNodes = /* @__PURE__ */ new Set();
    graph2.forEachNode((node) => {
      const nodeLabel = graph2.getNodeAttribute(node, "label").toLowerCase();
      const isMatch = nodeLabel.includes(lowerFilterTerm);
      graph2.setNodeAttribute(node, "hidden", !isMatch);
      if (isMatch) visibleNodes.add(node);
    });
    graph2.forEachEdge((edge, attrs, source, target) => {
      const isVisible = visibleNodes.has(source) || visibleNodes.has(target);
      graph2.setEdgeAttribute(edge, "hidden", !isVisible);
      if (isVisible) {
        graph2.setNodeAttribute(source, "hidden", false);
        graph2.setNodeAttribute(target, "hidden", false);
      }
    });
    graph2.updateNodeAttribute("quality-root", "hidden", () => false);
    renderer2.refresh();
  };
  var registerFilterEvents = (graph2, renderer2) => {
    const filterInput = document.getElementById("full-q-graph-filter__input");
    const filterButton = document.getElementById("full-q-graph-filter__btn");
    if (!filterInput) {
      console.error("Filter input element not found");
      return;
    }
    if (!filterButton) {
      console.error("Filter button element not found");
      return;
    }
    const applyFilter = () => filterGraph(filterInput.value, graph2, renderer2);
    filterButton.addEventListener("click", () => applyFilter());
    filterInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter" || e.keyCode === 13) {
        applyFilter();
      }
    });
  };

  // src/graphs/fullpage/main.js
  var graph = new MultiGraph();
  graph.setAttribute("name", "fullpage");
  graph.setAttribute("qualityType", "q42");
  try {
    createRootNode(graph, "Quality", 35, "orange");
    createNodes(graph, property_nodes_default);
    createNodes(graph, nodes_default);
    createEdges(graph, edges_default);
  } catch (error) {
    console.error("Could not render graph", { cause: error });
  }
  applyEnhancedRadialLayout(graph, "quality-root", 250);
  var renderer = new Sigma$1(graph, document.getElementById("full-q-graph-container"), {
    allowInvalidContainer: true,
    autoRescale: true,
    autoCenter: true
  });
  registerGraphEvents(graph, renderer);
  registerFilterEvents(graph, renderer);
})();
