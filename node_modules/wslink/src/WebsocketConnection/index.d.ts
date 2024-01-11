export interface SubscriberInfo {
  topic: string
  callback: (args: any[]) => Promise<any>;
}

// Provides a generic RPC stub built on top of websocket.
export interface WebsocketSession {
  // Issue a single-shot RPC.
  call(methodName: string, args?: any[], kwargs?: Record<string, any>): Promise<any>;
  // Subscribe to one-way messages from the server.
  subscribe(topic: string, callback: (args: any[]) => Promise<any>): {
    // A promise to be resolved once subscription succeeds.
    promise: Promise<SubscriberInfo>;
    // Cancels the subscription.
    unsubscribe: () => Promise<void>;
  }
  // Cancels the subscription.
  unsubscribe(info: SubscriberInfo): Promise<void>;
  close(): Promise<void>;

  /**
   * @param payload The binary data to send
   * @returns The id assigned to the binary attachment
   */
  addAttachment(payload: Blob): string
}

export interface IWebsocketConnectionInitialValues {
  secret?: string;
  connection?: any;
  session?: any;
  retry?: boolean;
}

// Represents a single established websocket connection.
export interface WebsocketConnection {
  getSession(): WebsocketSession;
  getUrl(): string | null;
  destroy(): void;
}

/**
 * Creates a new SmartConnect object with the given configuration.
 */
export function newInstance(initialValues: IWebsocketConnectionInitialValues): WebsocketConnection;

/**
 * Decorates a given object (publicAPI+model) with WebsocketConnection characteristics.
 */
export function extend(publicAPI: object, model: object, initialValues?: IWebsocketConnectionInitialValues): void;

export declare const WebsocketConnection: {
  newInstance: typeof newInstance;
  extend: typeof extend;
}

export default WebsocketConnection;
