'use client';

import { useState, useRef, useEffect } from 'react';

export default function TestMedia() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const testMediaAccess = async () => {
    try {
      setError(null);
      console.log('Testing media access...');

      console.log('Is secure context:', window.isSecureContext);
      console.log('Protocol:', window.location.protocol);
      console.log('Hostname:', window.location.hostname);

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const audioDevices = devices.filter(device => device.kind === 'audioinput');
      
      setDeviceInfo(`Found ${videoDevices.length} camera(s), ${audioDevices.length} microphone(s)`);
      console.log('Available devices:', devices);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true
      });

      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      console.log('Media access successful:', mediaStream);
      console.log('Video tracks:', mediaStream.getVideoTracks());
      console.log('Audio tracks:', mediaStream.getAudioTracks());

    } catch (err: any) {
      console.error('Media access failed:', err);
      setError(`Media access failed: ${err.name} - ${err.message}`);
      
      if (err.name === 'NotAllowedError') {
        setError('Permission denied. Please click the camera icon in the browser address bar and allow access.');
      } else if (err.name === 'NotFoundError') {
        setError('Camera or microphone not found.');
      } else if (err.name === 'NotReadableError') {
        setError('Device is being used by another application. Please close other camera applications.');
      }
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-light mb-8 tracking-wide">Media Device Test</h1>
        
        <div className="mb-8">
          <h2 className="text-sm font-medium mb-4 text-gray-300">Environment Check</h2>
          <div className="border border-gray-800 p-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Protocol</span>
              <span className="text-gray-300">{typeof window !== 'undefined' ? window.location.protocol : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Host</span>
              <span className="text-gray-300">{typeof window !== 'undefined' ? window.location.hostname : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Secure Context</span>
              <span className={typeof window !== 'undefined' && window.isSecureContext ? 'text-white' : 'text-gray-600'}>
                {typeof window !== 'undefined' ? (window.isSecureContext ? 'Yes' : 'No') : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Devices</span>
              <span className="text-gray-300">{deviceInfo || 'Not detected'}</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-sm font-medium mb-4 text-gray-300">Camera Test</h2>
          <div className="border border-gray-800 p-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full max-w-md mx-auto bg-gray-900"
              style={{ aspectRatio: '16/9' }}
            />
          </div>
        </div>

        <div className="mb-8 space-x-4">
          <button
            onClick={testMediaAccess}
            disabled={!!stream}
            className="border border-white text-white hover:bg-white hover:text-black disabled:border-gray-600 disabled:text-gray-600 disabled:hover:bg-transparent disabled:hover:text-gray-600 px-6 py-2 text-sm transition-colors duration-200"
          >
            {stream ? 'Media Active' : 'Test Media Access'}
          </button>
          
          <button
            onClick={stopStream}
            disabled={!stream}
            className="border border-gray-600 text-gray-600 hover:border-gray-400 hover:text-gray-400 disabled:border-gray-800 disabled:text-gray-800 px-6 py-2 text-sm transition-colors duration-200"
          >
            Stop Media
          </button>

          <a
            href="/"
            className="border border-gray-600 text-gray-600 hover:border-gray-400 hover:text-gray-400 px-6 py-2 text-sm inline-block transition-colors duration-200"
          >
            Back to Home
          </a>
        </div>

        {error && (
          <div className="border border-gray-400 p-4 mb-8">
            <h3 className="font-medium mb-2 text-sm">Error</h3>
            <p className="text-sm text-gray-300 mb-4">{error}</p>
            
            <div className="text-xs">
              <p className="font-medium mb-2">Solutions:</p>
              <ul className="space-y-1 text-gray-400">
                <li>• Ensure using HTTPS or localhost</li>
                <li>• Check browser permission settings</li>
                <li>• Close other applications using camera</li>
                <li>• Refresh page and re-authorize</li>
              </ul>
            </div>
          </div>
        )}

        <div className="border border-gray-800 p-4">
          <h3 className="font-medium mb-2 text-sm">Instructions</h3>
          <ol className="space-y-1 text-xs text-gray-400">
            <li>1. Click "Test Media Access" button</li>
            <li>2. Browser will request camera and microphone permissions</li>
            <li>3. Click "Allow" to authorize access</li>
            <li>4. If successful, you should see camera feed</li>
            <li>5. If failed, check error message and solutions above</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
