/**
 * Audio Manager - Modern Web Audio API implementation
 * Replaces SoundManager2 Flash-based audio
 */

class AudioManager {
  constructor() {
    this.audioContext = null;
    this.samples = new Map();
    this.loading = false;
    this.loaded = false;
  }

  async init() {
    if (this.audioContext) return;
    
    // Create AudioContext on user interaction (required by browsers)
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  async loadSamples(notes) {
    if (this.loading || this.loaded) return;
    this.loading = true;

    try {
      await this.init();
      
      const loadPromises = [];
      
      // Load individual note samples
      for (const note of notes) {
        const filename = note.replace(/#/g, 'sharp');
        loadPromises.push(this.loadSample(note, `samples/${filename}.mp3`));
      }
      
      // Load interval samples (C3 combined with other notes)
      for (const note of notes) {
        const filename = note.replace(/#/g, 'sharp');
        const sampleId = `C3-${note}`;
        loadPromises.push(this.loadSample(sampleId, `samples/C3-${filename}.mp3`));
      }
      
      await Promise.all(loadPromises);
      this.loaded = true;
      this.loading = false;
      
      console.log('All audio samples loaded successfully');
    } catch (error) {
      console.error('Error loading samples:', error);
      this.loading = false;
      throw error;
    }
  }

  async loadSample(id, url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load ${url}: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.samples.set(id, audioBuffer);
    } catch (error) {
      console.warn(`Could not load sample ${id}:`, error.message);
    }
  }

  play(sampleId) {
    if (!this.audioContext || !this.samples.has(sampleId)) {
      console.warn(`Sample not found: ${sampleId}`);
      return null;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = this.samples.get(sampleId);
    source.connect(this.audioContext.destination);
    source.start(0);
    
    return source;
  }

  async ensureReady() {
    if (!this.audioContext) {
      await this.init();
    }
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }
}

export const audioManager = new AudioManager();
