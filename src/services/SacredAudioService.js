// src/services/SacredAudioService.js
class SacredAudioService {
    constructor() {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.mantras = new Map();
      this.baseFrequency = 432; // Healing frequency
    }
  
    async loadMantra(name, url) {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.mantras.set(name, audioBuffer);
      } catch (error) {
        console.error('Error loading mantra:', error);
      }
    }
  
    playMantra(name, options = {}) {
      const source = this.audioContext.createBufferSource();
      source.buffer = this.mantras.get(name);
      
      // Create healing frequency oscillator
      const oscillator = this.audioContext.createOscillator();
      oscillator.frequency.setValueAtTime(this.baseFrequency, this.audioContext.currentTime);
      
      // Create gain nodes for mixing
      const mantraGain = this.audioContext.createGain();
      const oscillatorGain = this.audioContext.createGain();
      
      // Connect nodes
      source.connect(mantraGain);
      oscillator.connect(oscillatorGain);
      mantraGain.connect(this.audioContext.destination);
      oscillatorGain.connect(this.audioContext.destination);
      
      // Set volumes
      mantraGain.gain.value = options.mantraVolume || 0.7;
      oscillatorGain.gain.value = options.frequencyVolume || 0.3;
      
      // Start playing
      source.start();
      oscillator.start();
      
      return {
        stop: () => {
          source.stop();
          oscillator.stop();
        }
      };
    }
  }
  
  export default new SacredAudioService();
  