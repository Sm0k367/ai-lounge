declare module 'peerjs' {
  export interface PeerJSOption {
    key?: string;
    host?: string;
    port?: number;
    path?: string;
    secure?: boolean;
    config?: RTCConfiguration;
    debug?: number;
  }

  export interface DataConnection {
    send(data: any): void;
    close(): void;
    on(event: string, callback: Function): void;
    off(event: string, callback: Function): void;
    open: boolean;
    peer: string;
    reliable: boolean;
  }

  export interface MediaConnection {
    answer(stream?: MediaStream): void;
    close(): void;
    on(event: string, callback: Function): void;
    off(event: string, callback: Function): void;
    open: boolean;
    peer: string;
  }

  export default class Peer {
    constructor(id?: string, options?: PeerJSOption);
    constructor(options: PeerJSOption);
    
    id: string;
    connections: Record<string, DataConnection[]>;
    disconnected: boolean;
    destroyed: boolean;
    
    connect(peer: string, options?: any): DataConnection;
    call(peer: string, stream: MediaStream, options?: any): MediaConnection;
    on(event: 'open', callback: (id: string) => void): void;
    on(event: 'connection', callback: (conn: DataConnection) => void): void;
    on(event: 'call', callback: (call: MediaConnection) => void): void;
    on(event: 'close', callback: () => void): void;
    on(event: 'disconnected', callback: () => void): void;
    on(event: 'error', callback: (error: Error) => void): void;
    off(event: string, callback: Function): void;
    disconnect(): void;
    reconnect(): void;
    destroy(): void;
  }
}
