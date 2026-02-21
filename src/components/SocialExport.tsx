import React, { useState, useRef } from 'react';

export default function SocialExport() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      } as any);
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          stopRecording();
        }
      }, 30000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not start recording. Please allow screen capture.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const downloadClip = () => {
    if (!recordedBlob) return;
    
    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-lounge-clip-${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const shareClip = async () => {
    if (!recordedBlob) return;
    
    const file = new File([recordedBlob], `ai-lounge-clip-${Date.now()}.webm`, {
      type: 'video/webm'
    });
    
    if (navigator.share && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'AI Lounge Clip',
          text: 'Check out this moment from the AI Lounge! 🎵✨'
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to download
      downloadClip();
    }
  };
  
  const takeScreenshot = async () => {
    try {
      const canvas = document.querySelector('canvas');
      if (!canvas) return;
      
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-lounge-screenshot-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error('Error taking screenshot:', error);
    }
  };
  
  return (
    <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-2">
      {/* Recording indicator */}
      {isRecording && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 animate-pulse">
          <span className="w-3 h-3 bg-white rounded-full animate-ping" />
          <span className="font-bold text-sm">RECORDING</span>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex gap-2">
        {/* Screenshot button */}
        <button
          onClick={takeScreenshot}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-2 border-white/20"
          title="Take Screenshot"
        >
          <span className="text-xl">📸</span>
        </button>
        
        {/* Record button */}
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-2 border-white/20"
            title="Start Recording"
          >
            <span className="text-xl">🎥</span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-2 border-white/20"
            title="Stop Recording"
          >
            <span className="text-xl">⏹️</span>
          </button>
        )}
      </div>
      
      {/* Recorded clip actions */}
      {recordedBlob && !isRecording && (
        <div className="bg-black/90 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-4 shadow-2xl">
          <p className="text-white font-bold mb-3 text-sm">CLIP READY! 🎬</p>
          <div className="flex gap-2">
            <button
              onClick={downloadClip}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg text-white font-bold text-sm hover:opacity-90 transition-opacity"
            >
              DOWNLOAD
            </button>
            <button
              onClick={shareClip}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 rounded-lg text-white font-bold text-sm hover:opacity-90 transition-opacity"
            >
              SHARE
            </button>
          </div>
          <button
            onClick={() => setRecordedBlob(null)}
            className="w-full mt-2 text-white/60 hover:text-white text-xs"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
