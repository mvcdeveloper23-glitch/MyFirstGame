// Sound Manager for Space Shooter Game
class SoundManager {
  constructor() {
    this.audioContext = null;
    this.sounds = {};
    this.musicGainNode = null;
    this.sfxGainNode = null;
    this.currentMusic = null;
    this.musicVolume = 0.3;
    this.sfxVolume = 0.5;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create gain nodes for volume control
      this.musicGainNode = this.audioContext.createGain();
      this.musicGainNode.gain.value = this.musicVolume;
      this.musicGainNode.connect(this.audioContext.destination);
      
      this.sfxGainNode = this.audioContext.createGain();
      this.sfxGainNode.gain.value = this.sfxVolume;
      this.sfxGainNode.connect(this.audioContext.destination);
      
      this.initialized = true;
      console.log('Sound system initialized!');
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  // Play shooting sound
  playShoot() {
    if (!this.initialized) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.sfxGainNode);
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  // Play explosion sound
  playExplosion() {
    if (!this.initialized) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const noiseBuffer = this.createNoiseBuffer();
    const noiseSource = this.audioContext.createBufferSource();
    const noiseGain = this.audioContext.createGain();
    
    // Bass explosion
    oscillator.connect(gainNode);
    gainNode.connect(this.sfxGainNode);
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3);
    gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    // White noise for explosion effect
    noiseSource.buffer = noiseBuffer;
    noiseSource.connect(noiseGain);
    noiseGain.connect(this.sfxGainNode);
    noiseGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
    
    oscillator.start();
    noiseSource.start();
    oscillator.stop(this.audioContext.currentTime + 0.3);
    noiseSource.stop(this.audioContext.currentTime + 0.2);
  }

  // Play combo sound
  playCombo(comboLevel) {
    if (!this.initialized) return;
    
    const baseFreq = 400 + (comboLevel * 100);
    
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGainNode);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(baseFreq + (i * 200), this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.2);
      }, i * 50);
    }
  }

  // Play level complete sound
  playLevelComplete() {
    if (!this.initialized) return;
    
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, index) => {
      setTimeout(() => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGainNode);
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.3);
      }, index * 150);
    });
  }

  // Play game over sound
  playGameOver() {
    if (!this.initialized) return;
    
    const notes = [659.25, 587.33, 523.25, 392.00]; // E5, D5, C5, G4 (descending)
    
    notes.forEach((freq, index) => {
      setTimeout(() => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGainNode);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.4);
      }, index * 200);
    });
  }

  // Play pause sound
  playPause() {
    if (!this.initialized) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.sfxGainNode);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.15);
  }

  // Play resume sound
  playResume() {
    if (!this.initialized) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.sfxGainNode);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.15);
  }

  // Start background music
  startBackgroundMusic() {
    if (!this.initialized || this.currentMusic) return;
    
    this.currentMusic = this.createBackgroundMusic();
  }

  // Stop background music
  stopBackgroundMusic() {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }

  // Create background music (simple melody loop)
  createBackgroundMusic() {
    const melody = [
      { freq: 523.25, duration: 0.3 }, // C5
      { freq: 659.25, duration: 0.3 }, // E5
      { freq: 783.99, duration: 0.3 }, // G5
      { freq: 659.25, duration: 0.3 }, // E5
      { freq: 523.25, duration: 0.3 }, // C5
      { freq: 392.00, duration: 0.3 }, // G4
      { freq: 523.25, duration: 0.6 }, // C5
    ];
    
    let currentNoteIndex = 0;
    let nextNoteTime = this.audioContext.currentTime;
    
    const scheduleNote = () => {
      const note = melody[currentNoteIndex];
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.musicGainNode);
      
      oscillator.type = 'square';
      oscillator.frequency.value = note.freq;
      
      gainNode.gain.setValueAtTime(0.08, nextNoteTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, nextNoteTime + note.duration);
      
      oscillator.start(nextNoteTime);
      oscillator.stop(nextNoteTime + note.duration);
      
      nextNoteTime += note.duration;
      currentNoteIndex = (currentNoteIndex + 1) % melody.length;
      
      if (this.currentMusic) {
        setTimeout(() => scheduleNote(), note.duration * 1000);
      }
    };
    
    scheduleNote();
    
    return {
      stop: () => {
        this.currentMusic = null;
      }
    };
  }

  // Create noise buffer for explosion effect
  createNoiseBuffer() {
    const bufferSize = this.audioContext.sampleRate * 0.2;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    return buffer;
  }

  // Set volumes
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGainNode) {
      this.musicGainNode.gain.value = this.musicVolume;
    }
  }

  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.sfxGainNode) {
      this.sfxGainNode.gain.value = this.sfxVolume;
    }
  }

  // Mute/unmute
  muteMusic() {
    if (this.musicGainNode) {
      this.musicGainNode.gain.value = 0;
    }
  }

  unmuteMusic() {
    if (this.musicGainNode) {
      this.musicGainNode.gain.value = this.musicVolume;
    }
  }

  muteSFX() {
    if (this.sfxGainNode) {
      this.sfxGainNode.gain.value = 0;
    }
  }

  unmuteSFX() {
    if (this.sfxGainNode) {
      this.sfxGainNode.gain.value = this.sfxVolume;
    }
  }
}

// Create singleton instance
const soundManager = new SoundManager();

export default soundManager;