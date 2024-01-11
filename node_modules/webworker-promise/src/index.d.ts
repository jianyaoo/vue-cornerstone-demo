import NodeWorker = require("./node-worker");

export = PromiseWorker;

declare class PromiseWorker {
  constructor(worker: Worker | NodeWorker);

  /**
   * Trigger the main worker function.
   * The `onEvent` function is scoped to the 'emit' passed into the main function and is not triggered by global emits from the worker.
   *
   * @param message Data to send to worker
   * @param transferableList List of transferables to send to worker
   * @param onEvent Eventhandler for `emit` calls from the worker
   *
   * @example
   *
   * ```
   * // worker.js
   * registerWebworker((message) => {
   *      return `Hello ${message}!`;
   * });
   *
   * // main.js
   * worker.postMessage('world').then((response) => {
   *      console.log(response); // Hello world!
   * })
   * ```
   */
  postMessage(
    message: any,
    transferableList?: Transferable[],
    onEvent?: (eventName: string, message: any) => void
  ): Promise<any>;

  /**
   * Trigger an operation that is registered via the `operation` function in the worker.
   * The 'onEvent' function is scoped to the 'emit' passed into the `operation` function and is not triggered by global emits from the worker.
   *
   * @param operationName Name of the operation
   * @param message Data to send to worker
   * @param transferableList List of transferables to send to worker
   * @param onEvent Eventhandler for `emit` calls from the worker
   *
   * @example
   *
   * ```
   * // worker.js
   * registerWebworker().operation('greet', (message) => {
   *      return `Hello ${message}!`;
   * });
   *
   * // main.js
   * worker.exec('greet', 'world').then((response) => {
   *      console.log(response); // Hello world!
   * })
   * ```
   */
  exec(
    operationName: string,
    message?: any,
    transferableList?: Transferable[],
    onEvent?: (eventName: string, message: any) => void
  ): Promise<any>;
  /**
   * Register an event handler that can be triggered via the `emit` command from the worker.
   *
   * @param eventName Name of the operation
   * @param handler Event handler
   *
   * @example
   *
   * ```
   * // worker.js
   * const host = registerWebworker()
   *  .on('add', (x, y) => {
   *      host.emit('add:result', x + y);
   *  });
   *
   * // main.js
   * worker.on('add:result', (result) => {
   *      console.log(result); // 3
   * });
   *
   * worker.emit('add', 1, 2);
   * ```
   */
  on(eventName: string, handler: (...args: any[]) => void): PromiseWorker;
  /**
   * Register an event handler that can be triggered via the `emit` command from the worker, will only be triggered once.
   *
   * @param eventName Name of the operation
   * @param handler Event handler
   *
   * @example
   *
   * ```
   * // worker.js
   * const host = registerWebworker()
   *  .once('add', (x, y) => {
   *      host.emit('add:result', x + y);
   *  });
   *
   * // main.js
   * worker.once('add:result', (result) => {
   *      console.log(result); // 3
   * });
   *
   * // Will only have effect first call
   * worker.emit('add', 1, 2);
   * ```
   */
  once(eventName: string, handler: (...args: any[]) => void): PromiseWorker;
  /**
   * Emit an event to the worker that can be listened to via the `on` and `once` methods in the worker.
   *
   * @param eventName Name of the operation
   * @param args Values to emit
   *
   * @example
   *
   * ```
   * // worker.js
   * const host = registerWebworker()
   *  .on('add', (x, y) => {
   *      host.emit('add:result', x + y);
   *  });
   *
   * // main.js
   * worker.on('add:result', (result) => {
   *      console.log(result); // 3
   * });
   *
   * worker.emit('add', 1, 2);
   * ```
   */
  emit(eventName: string, ...args: any[]): void;
  /**
   * Disposes the underlying worker, future calls will have no effect
   */
  terminate(): void;
}
