// src/services/sacred/MantraService.js
class MantraService {
    constructor() {
      this.audioContext = null;
      this.mantras = new Map();
      this.currentSource = null;
      this.gainNode = null;
    }
  
    async initialize() {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
      } catch (error) {
        console.error('Error initializing MantraService:', error);
      }
    }
  
    play(mantraId, options = {}) {
      const frequency = mantraId === 'om' ? 432 : 528;
      
      if (this.currentSource) {
        this.stop();
      }
  
      const oscillator = this.audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      
      this.gainNode.gain.value = options.volume || 0.7;
      oscillator.connect(this.gainNode);
      
      oscillator.start();
      this.currentSource = oscillator;
    }
  
    stop() {
      if (this.currentSource) {
        this.currentSource.stop();
        this.currentSource = null;
      }
    }
  
    setVolume(value) {
      if (this.gainNode) {
        this.gainNode.gain.value = value;
      }
    }
  
    cleanup() {
      this.stop();
      if (this.audioContext) {
        this.audioContext.close();
      }
    }
  }
  
  export const mantraService = new MantraService();
  