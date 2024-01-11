"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseIterator = void 0;
class PromiseIterator extends Promise {
}
exports.PromiseIterator = PromiseIterator;
class ProgressiveIterator {
    constructor(name) {
        this.name = name || 'unknown';
    }
    static as(promise) {
        if (promise.iterator) {
            return promise.iterator;
        }
        const iterator = new ProgressiveIterator('as iterator');
        promise.then((v) => {
            try {
                iterator.add(v, true);
            }
            catch (e) {
                iterator.reject(e);
            }
        }, (reason) => iterator.reject(reason));
        return iterator;
    }
    add(x, done = false) {
        this.nextValue = x;
        this.done || (this.done = done);
        if (this.waiting) {
            this.waiting.resolve(x);
            this.waiting = undefined;
        }
    }
    resolve() {
        this.done = true;
        if (this.waiting) {
            this.waiting.resolve(this.nextValue);
            this.waiting = undefined;
        }
    }
    reject(reason) {
        var _a;
        this.rejectReason = reason;
        (_a = this.waiting) === null || _a === void 0 ? void 0 : _a.reject(reason);
    }
    getRecent() {
        if (this.rejectReason) {
            throw this.rejectReason;
        }
        return this.nextValue;
    }
    [Symbol.asyncIterator]() {
        return __asyncGenerator(this, arguments, function* _a() {
            while (!this.done) {
                if (this.rejectReason) {
                    throw this.rejectReason;
                }
                if (this.nextValue !== undefined) {
                    yield yield __await(this.nextValue);
                    if (this.done) {
                        break;
                    }
                }
                if (!this.waiting) {
                    this.waiting = {};
                    this.waiting.promise = new Promise((resolve, reject) => {
                        this.waiting.resolve = resolve;
                        this.waiting.reject = reject;
                    });
                }
                yield __await(this.waiting.promise);
            }
            yield yield __await(this.nextValue);
        });
    }
    forEach(callback, errorCallback) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            let index = 0;
            try {
                try {
                    for (var _b = __asyncValues(this), _c; _c = yield _b.next(), !_c.done;) {
                        const value = _c.value;
                        const { done } = this;
                        try {
                            yield callback(value, done, index);
                            index++;
                        }
                        catch (e) {
                            if (!done) {
                                console.warn('Caught exception in intermediate value', e);
                                continue;
                            }
                            if (errorCallback) {
                                errorCallback(e, done);
                            }
                            else {
                                throw e;
                            }
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            catch (e) {
                if (errorCallback) {
                    errorCallback(e, true);
                }
                else {
                    throw e;
                }
            }
        });
    }
    generate(processFunction, errorCallback) {
        return processFunction(this, this.reject.bind(this)).then(() => {
            if (!this.done) {
                this.resolve();
            }
        }, (reason) => {
            this.reject(reason);
            if (errorCallback) {
                errorCallback(reason);
            }
            else {
                console.warn("Couldn't process because", reason);
            }
        });
    }
    nextPromise() {
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (var _b = __asyncValues(this), _c; _c = yield _b.next(), !_c.done;) {
                    const i = _c.value;
                    if (i) {
                        return i;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return this.nextValue;
        });
    }
    donePromise() {
        var e_3, _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (var _b = __asyncValues(this), _c; _c = yield _b.next(), !_c.done;) {
                    const i = _c.value;
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return this.nextValue;
        });
    }
    getNextPromise() {
        const promise = this.nextPromise();
        promise.iterator = this;
        return promise;
    }
    getDonePromise() {
        const promise = this.donePromise();
        promise.iterator = this;
        return promise;
    }
}
exports.default = ProgressiveIterator;
//# sourceMappingURL=ProgressiveIterator.js.map