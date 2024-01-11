import WebsocketConnection, {WebsocketSession} from '../WebsocketConnection';

export declare const DEFAULT_SESSION_MANAGER_URL: string;

export interface ISmartConnectConfig {
  // URL to connect to. E.g., "ws://localhost:1234".
  sessionURL?: string;
  // Endpoint of the launcher that is responsible to start the server process.
  // Defaults to  SESSION_MANAGER_URL.
  sessionManagerURL?: string;
  // The secret token to be sent during handshake and validated by the server.
  secret?: string;
  retry?: number;
}

// A function that rewrites the configuration.  It is called on connect.
type ConfigDecorator = (config: ISmartConnectConfig) => ISmartConnectConfig;

export interface ISmartConnectInitialValues {
  config: ISmartConnectConfig;
  configDecorator?: ConfigDecorator;
}

export type Event = any;

export interface WebsocketCloseEvent {
  // This object reports the values of the close frame.  Cf. RFC6455 section
  // 5.5.1. If the connection closes w/o a close frame, the following fields are unset.
  code?: number // RFC6455, section 7.4.
  reason?: string;
}

export interface SmartConnect {
  // Starts connecting to the server.
  connect(): void;
  getSession(): WebsocketSession;
  // Called when the connection is established
  onConnectionReady(cb: (c: WebsocketConnection) => void): void;
  // Called when the connection cannot be established.
  onConnectionError(cb: (c: WebsocketConnection, err: Event) => void): void;
  // Called when the connection is closed.
  onConnectionClose(cb: (c: WebsocketConnection, event: WebsocketCloseEvent) => void): void;
  // Close the connection and destroy this object.
  destroy(): void;
  // Return the config passed to newInstance.
  getConfig(): ISmartConnectConfig;
  getConfigDecorator(): ConfigDecorator | null;
  setConfigDecorator(c: ConfigDecorator): void;
}

/**
 * Creates a new SmartConnect object with the given configuration.
 */
export function newInstance(config: ISmartConnectInitialValues): SmartConnect;

/**
 * Decorates a given object (publicAPI+model) with SmartConnect characteristics.
 */
export function extend(publicAPI: object, model: object, initialValues?: ISmartConnectInitialValues): void;

export declare const SmartConnect: {
  newInstance: typeof newInstance;
  extend: typeof extend;
}

export default SmartConnect;
