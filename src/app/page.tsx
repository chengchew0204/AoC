'use client';

import { useState, useEffect } from 'react';
import LiveKitRoom from '@/components/LiveKitRoom';

export default function Home() {
  const [identity, setIdentity] = useState<string>('');
  const [isInRoom, setIsInRoom] = useState(false);
  const [roomName] = useState('arena-of-consciousness');

  useEffect(() => {
    const storedIdentity = localStorage.getItem('user-identity');
    if (storedIdentity) {
      setIdentity(storedIdentity);
    } else {
      const newIdentity = `user-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user-identity', newIdentity);
      setIdentity(newIdentity);
    }
  }, []);

  const joinRoom = () => {
    if (identity) {
      setIsInRoom(true);
    }
  };

  const leaveRoom = () => {
    setIsInRoom(false);
  };

  const handleDisconnected = () => {
    console.log('Room disconnected, but staying in room UI for reconnection attempts');
  };

  if (!identity) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white mx-auto mb-4"></div>
          <p className="text-sm">Initializing...</p>
        </div>
      </div>
    );
  }

  if (!isInRoom) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center text-white max-w-lg mx-auto">
          <h1 className="text-3xl font-light mb-8 tracking-wide">Arena of Consciousness</h1>
          
          <div className="border border-gray-800 p-8 mb-8">
            <p className="text-gray-300 mb-6 leading-relaxed text-sm">
              Global real-time broadcasting platform.<br/>
              Multiple viewers, single broadcaster.<br/>
              Anyone can takeover at any time.
            </p>
            
            <div className="space-y-3 text-xs text-left mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Low latency streaming</span>
                <span className="text-gray-400">&lt; 1 second</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Architecture</span>
                <span className="text-gray-400">WebRTC + SFU</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Concurrent viewers</span>
                <span className="text-gray-400">Unlimited</span>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4 mb-6 text-xs">
              <div className="flex justify-between mb-1">
                <span className="text-gray-500">Identity</span>
                <span className="font-mono text-gray-300">{identity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Room</span>
                <span className="font-mono text-gray-300">{roomName}</span>
              </div>
            </div>

            <button
              onClick={joinRoom}
              className="w-full border border-white text-white hover:bg-white hover:text-black transition-colors duration-200 py-3 px-6 text-sm font-medium mb-3"
            >
              Enter Room
            </button>

            <a
              href="/test-media"
              className="w-full border border-gray-600 text-gray-300 hover:border-gray-400 hover:text-gray-100 transition-colors duration-200 py-2 px-6 text-xs block text-center"
            >
              Test Camera & Microphone
            </a>
          </div>
          
          <div className="text-xs text-gray-600 space-y-1">
            <p>Powered by LiveKit Cloud</p>
            <p>WebRTC Real-time Communication</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <LiveKitRoom
        roomName={roomName}
        identity={identity}
        onDisconnected={handleDisconnected}
      />
      
      <button
        onClick={leaveRoom}
        className="absolute top-4 left-4 z-20 border border-gray-600 bg-black bg-opacity-50 text-white hover:border-gray-400 px-4 py-2 text-sm transition-colors duration-200"
      >
        Leave Room
      </button>
    </div>
  );
}
