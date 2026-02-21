// FREE Peer-to-Peer Multiplayer using PeerJS
// No server costs - uses free PeerJS cloud signaling

import Peer, { DataConnection } from 'peerjs';

export interface User {
  id: string;
  name: string;
  avatar: string;
  position: { x: number; y: number; z: number };
  color: string;
  isHost: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
  color: string;
}

export class MultiplayerEngine {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  private users: Map<string, User> = new Map();
  private localUser: User | null = null;
  private onUserJoined?: (user: User) => void;
  private onUserLeft?: (userId: string) => void;
  private onUserMoved?: (userId: string, position: { x: number; y: number; z: number }) => void;
  private onChatMessage?: (message: ChatMessage) => void;
  
  async initialize(userName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Use free PeerJS cloud server
      this.peer = new Peer({
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        }
      });
      
      this.peer.on('open', (id) => {
        const colors = ['#8b5cf6', '#d946ef', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        this.localUser = {
          id,
          name: userName,
          avatar: this.generateAvatar(userName),
          position: { x: 0, y: 0, z: 0 },
          color: randomColor,
          isHost: false
        };
        
        this.users.set(id, this.localUser);
        resolve(id);
      });
      
      this.peer.on('connection', (conn) => {
        this.handleConnection(conn);
      });
      
      this.peer.on('error', (err) => {
        console.error('Peer error:', err);
        reject(err);
      });
    });
  }
  
  connectToRoom(roomId: string) {
    if (!this.peer || !this.localUser) return;
    
    const conn = this.peer.connect(roomId, {
      reliable: true,
      serialization: 'json'
    });
    
    this.handleConnection(conn);
  }
  
  private handleConnection(conn: DataConnection) {
    conn.on('open', () => {
      this.connections.set(conn.peer, conn);
      
      // Send our user info
      conn.send({
        type: 'user-joined',
        user: this.localUser
      });
      
      // Request all users from the peer
      conn.send({
        type: 'request-users'
      });
    });
    
    conn.on('data', (data: any) => {
      this.handleMessage(conn.peer, data);
    });
    
    conn.on('close', () => {
      this.connections.delete(conn.peer);
      this.users.delete(conn.peer);
      if (this.onUserLeft) {
        this.onUserLeft(conn.peer);
      }
    });
  }
  
  private handleMessage(peerId: string, data: any) {
    switch (data.type) {
      case 'user-joined':
        this.users.set(data.user.id, data.user);
        if (this.onUserJoined) {
          this.onUserJoined(data.user);
        }
        // Send back our user info
        this.broadcast({
          type: 'user-joined',
          user: this.localUser
        });
        break;
        
      case 'request-users':
        // Send all known users to the requester
        const conn = this.connections.get(peerId);
        if (conn) {
          conn.send({
            type: 'users-list',
            users: Array.from(this.users.values())
          });
        }
        break;
        
      case 'users-list':
        data.users.forEach((user: User) => {
          if (user.id !== this.localUser?.id && !this.users.has(user.id)) {
            this.users.set(user.id, user);
            if (this.onUserJoined) {
              this.onUserJoined(user);
            }
          }
        });
        break;
        
      case 'user-moved':
        const user = this.users.get(data.userId);
        if (user) {
          user.position = data.position;
          if (this.onUserMoved) {
            this.onUserMoved(data.userId, data.position);
          }
        }
        break;
        
      case 'chat-message':
        if (this.onChatMessage) {
          this.onChatMessage(data.message);
        }
        break;
    }
  }
  
  updatePosition(position: { x: number; y: number; z: number }) {
    if (this.localUser) {
      this.localUser.position = position;
      this.broadcast({
        type: 'user-moved',
        userId: this.localUser.id,
        position
      });
    }
  }
  
  sendChatMessage(message: string) {
    if (!this.localUser) return;
    
    const chatMessage: ChatMessage = {
      id: `${this.localUser.id}-${Date.now()}`,
      userId: this.localUser.id,
      userName: this.localUser.name,
      message,
      timestamp: Date.now(),
      color: this.localUser.color
    };
    
    this.broadcast({
      type: 'chat-message',
      message: chatMessage
    });
    
    if (this.onChatMessage) {
      this.onChatMessage(chatMessage);
    }
  }
  
  private broadcast(data: any) {
    this.connections.forEach((conn) => {
      if (conn.open) {
        conn.send(data);
      }
    });
  }
  
  getUsers(): User[] {
    return Array.from(this.users.values());
  }
  
  getLocalUser(): User | null {
    return this.localUser;
  }
  
  setOnUserJoined(callback: (user: User) => void) {
    this.onUserJoined = callback;
  }
  
  setOnUserLeft(callback: (userId: string) => void) {
    this.onUserLeft = callback;
  }
  
  setOnUserMoved(callback: (userId: string, position: { x: number; y: number; z: number }) => void) {
    this.onUserMoved = callback;
  }
  
  setOnChatMessage(callback: (message: ChatMessage) => void) {
    this.onChatMessage = callback;
  }
  
  private generateAvatar(name: string): string {
    // Generate a simple avatar based on name
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="hsl(${hue}, 70%, 50%)"/>
        <text x="50" y="50" text-anchor="middle" dy=".3em" font-size="40" fill="white" font-family="Arial">
          ${name.charAt(0).toUpperCase()}
        </text>
      </svg>
    `)}`;
  }
  
  disconnect() {
    this.connections.forEach((conn) => conn.close());
    this.connections.clear();
    this.users.clear();
    if (this.peer) {
      this.peer.destroy();
    }
  }
}
