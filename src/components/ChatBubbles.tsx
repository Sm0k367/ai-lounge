import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../lib/multiplayer';

interface ChatBubblesProps {
  messages?: ChatMessage[];
  onSendMessage?: (message: string) => void;
}

export default function ChatBubbles({ messages = [], onSendMessage }: ChatBubblesProps) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <>
      {/* Floating chat bubbles */}
      <div className="absolute left-4 bottom-24 z-20 space-y-2 max-w-sm">
        {messages.slice(-3).map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
      </div>
      
      {/* Chat toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute bottom-4 left-4 z-30 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50 hover:scale-110 transition-transform border-2 border-white/20"
      >
        <span className="text-2xl">💬</span>
        {messages.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
            {messages.length > 9 ? '9+' : messages.length}
          </span>
        )}
      </button>
      
      {/* Full chat panel */}
      {isOpen && (
        <div className="absolute bottom-20 left-4 z-30 w-80 md:w-96 h-96 bg-black/90 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold">LIVE CHAT</h3>
              <p className="text-white/80 text-xs">{messages.length} messages</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-white/80 text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-2">
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0"
                  style={{ backgroundColor: msg.color }}
                />
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-white font-bold text-sm">{msg.userName}</span>
                    <span className="text-white/40 text-xs">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-white/90 text-sm mt-1">{msg.message}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="p-4 border-t border-purple-500/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                maxLength={200}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-lg text-white font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                SEND
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setIsVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div
      className={`
        bg-black/80 backdrop-blur-sm rounded-2xl rounded-bl-none px-4 py-3
        border border-purple-500/30 shadow-lg
        transition-all duration-500
        ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
      `}
      style={{ borderLeftColor: message.color, borderLeftWidth: '3px' }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: message.color }}
        />
        <span className="text-white font-bold text-xs">{message.userName}</span>
      </div>
      <p className="text-white/90 text-sm">{message.message}</p>
    </div>
  );
}
