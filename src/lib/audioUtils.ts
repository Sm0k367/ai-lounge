// Advanced Web Audio API utilities for beat detection and visualization
// 100% FREE - uses browser's built-in Web Audio API

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private beatDetector: BeatDetector | null = null;
  
  async initialize(audioElement: HTMLAudioElement) {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;
    
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
    
    this.source = this.audioContext.createMediaElementSource(audioElement);
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
    
    this.beatDetector = new BeatDetector(this.analyser);
    
    return this;
  }
  
  getFrequencyData(): Uint8Array {
    if (this.analyser && this.dataArray) {
      this.analyser.getByteFrequencyData(this.dataArray);
      return this.dataArray;
    }
    return new Uint8Array(0);
  }
  
  getTimeDomainData(): Uint8Array {
    if (this.analyser && this.dataArray) {
      this.analyser.getByteTimeDomainData(this.dataArray);
      return this.dataArray;
    }
    return new Uint8Array(0);
  }
  
  getBass(): number {
    const data = this.getFrequencyData();
    let sum = 0;
    const bassRange = Math.floor(data.length * 0.1); // First 10% is bass
    for (let i = 0; i < bassRange; i++) {
      sum += data[i];
    }
    return sum / bassRange / 255;
  }
  
  getMids(): number {
    const data = this.getFrequencyData();
    let sum = 0;
    const start = Math.floor(data.length * 0.1);
    const end = Math.floor(data.length * 0.5);
    for (let i = start; i < end; i++) {
      sum += data[i];
    }
    return sum / (end - start) / 255;
  }
  
  getTreble(): number {
    const data = this.getFrequencyData();
    let sum = 0;
    const start = Math.floor(data.length * 0.5);
    for (let i = start; i < data.length; i++) {
      sum += data[i];
    }
    return sum / (data.length - start) / 255;
  }
  
  getOverallVolume(): number {
    const data = this.getFrequencyData();
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }
    return sum / data.length / 255;
  }
  
  isBeat(): boolean {
    return this.beatDetector?.isBeat() || false;
  }
  
  getBeatStrength(): number {
    return this.beatDetector?.getBeatStrength() || 0;
  }
}

class BeatDetector {
  private analyser: AnalyserNode;
  private threshold: number = 1.3;
  private minTimeBetweenBeats: number = 200; // ms
  private lastBeatTime: number = 0;
  private energyHistory: number[] = [];
  private historySize: number = 43; // ~1 second at 60fps
  
  constructor(analyser: AnalyserNode) {
    this.analyser = analyser;
  }
  
  isBeat(): boolean {
    const now = Date.now();
    if (now - this.lastBeatTime < this.minTimeBetweenBeats) {
      return false;
    }
    
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    
    // Focus on bass frequencies for beat detection
    const bassRange = Math.floor(dataArray.length * 0.15);
    let energy = 0;
    for (let i = 0; i < bassRange; i++) {
      energy += dataArray[i] * dataArray[i];
    }
    energy /= bassRange;
    
    this.energyHistory.push(energy);
    if (this.energyHistory.length > this.historySize) {
      this.energyHistory.shift();
    }
    
    const avgEnergy = this.energyHistory.reduce((a, b) => a + b, 0) / this.energyHistory.length;
    
    if (energy > avgEnergy * this.threshold) {
      this.lastBeatTime = now;
      return true;
    }
    
    return false;
  }
  
  getBeatStrength(): number {
    if (this.energyHistory.length === 0) return 0;
    const avgEnergy = this.energyHistory.reduce((a, b) => a + b, 0) / this.energyHistory.length;
    const currentEnergy = this.energyHistory[this.energyHistory.length - 1] || 0;
    return Math.min(currentEnergy / (avgEnergy * this.threshold), 2);
  }
}

// Visualizer data generator
export function generateVisualizerData(audioEngine: AudioEngine, barCount: number = 64): number[] {
  const frequencyData = audioEngine.getFrequencyData();
  const bars: number[] = [];
  const step = Math.floor(frequencyData.length / barCount);
  
  for (let i = 0; i < barCount; i++) {
    const start = i * step;
    const end = start + step;
    let sum = 0;
    for (let j = start; j < end; j++) {
      sum += frequencyData[j];
    }
    bars.push(sum / step / 255);
  }
  
  return bars;
}

// Spatial audio positioning (for 3D sound)
export function createSpatialAudio(audioContext: AudioContext, x: number, y: number, z: number) {
  const panner = audioContext.createPanner();
  panner.panningModel = 'HRTF';
  panner.distanceModel = 'inverse';
  panner.refDistance = 1;
  panner.maxDistance = 10000;
  panner.rolloffFactor = 1;
  panner.coneInnerAngle = 360;
  panner.coneOuterAngle = 0;
  panner.coneOuterGain = 0;
  panner.setPosition(x, y, z);
  return panner;
}
