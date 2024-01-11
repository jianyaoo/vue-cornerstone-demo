export class PromiseIterator extends Promise {
}
export default class ProgressiveIterator {
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
        this.done ||= done;
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
        this.rejectReason = reason;
        this.waiting?.reject(reason);
    }
    getRecent() {
        if (this.rejectReason) {
            throw this.rejectReason;
        }
        return this.nextValue;
    }
    async *[Symbol.asyncIterator]() {
        while (!this.done) {
            if (this.rejectReason) {
                throw this.rejectReason;
            }
            if (this.nextValue !== undefined) {
                yield this.nextValue;
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
            await this.waiting.promise;
        }
        yield this.nextValue;
    }
    async forEach(callback, errorCallback) {
        let index = 0;
        try {
            for await (const value of this) {
                const { done } = this;
                try {
                    await callback(value, done, index);
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
        catch (e) {
            if (errorCallback) {
                errorCallback(e, true);
            }
            else {
                throw e;
            }
        }
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
    async nextPromise() {
        for await (const i of this) {
            if (i) {
                return i;
            }
        }
        return this.nextValue;
    }
    async donePromise() {
        for await (const i of this) {
        }
        return this.nextValue;
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
//# sourceMappingURL=ProgressiveIterator.js.map