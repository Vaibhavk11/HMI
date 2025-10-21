// Voice guidance service for workout audio cues
// Uses Web Speech API for text-to-speech functionality

export interface VoiceSettings {
  enabled: boolean;
  volume: number; // 0 to 1
  rate: number; // 0.5 to 2
  pitch: number; // 0 to 2
  voice: string | null; // Voice name
}

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  enabled: true,
  volume: 0.8,
  rate: 1.0,
  pitch: 1.0,
  voice: null
};

class VoiceService {
  private synth: SpeechSynthesis;
  private settings: VoiceSettings;
  private voices: SpeechSynthesisVoice[] = [];
  
  constructor() {
    this.synth = window.speechSynthesis;
    this.settings = this.loadSettings();
    
    // Load voices when they become available
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth.getVoices();
      };
    }
    this.voices = this.synth.getVoices();
  }
  
  // Load settings from localStorage
  private loadSettings(): VoiceSettings {
    try {
      const saved = localStorage.getItem('voiceSettings');
      if (saved) {
        return { ...DEFAULT_VOICE_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Failed to load voice settings:', error);
    }
    return DEFAULT_VOICE_SETTINGS;
  }
  
  // Save settings to localStorage
  saveSettings(settings: VoiceSettings): void {
    this.settings = settings;
    try {
      localStorage.setItem('voiceSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save voice settings:', error);
    }
  }
  
  // Get current settings
  getSettings(): VoiceSettings {
    return { ...this.settings };
  }
  
  // Get available voices
  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
  
  // Speak text with current settings
  speak(text: string, options?: { priority?: boolean }): void {
    if (!this.settings.enabled) return;
    
    // Cancel any ongoing speech if priority is set
    if (options?.priority && this.synth.speaking) {
      this.synth.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = this.settings.volume;
    utterance.rate = this.settings.rate;
    utterance.pitch = this.settings.pitch;
    
    // Set voice if specified
    if (this.settings.voice) {
      const selectedVoice = this.voices.find(v => v.name === this.settings.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }
    
    this.synth.speak(utterance);
  }
  
  // Cancel any ongoing speech
  cancel(): void {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
  }
  
  // Check if speech synthesis is supported
  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
  
  // Exercise-specific announcements
  announceExerciseStart(exerciseName: string, setNumber?: number): void {
    const message = setNumber 
      ? `Starting ${exerciseName}, set ${setNumber}`
      : `Starting exercise: ${exerciseName}`;
    this.speak(message);
  }
  
  announceExerciseComplete(exerciseName: string): void {
    this.speak(`${exerciseName} complete! Good job!`);
  }
  
  announceSetComplete(setNumber: number, totalSets: number): void {
    if (setNumber < totalSets) {
      this.speak(`Set ${setNumber} complete. Rest and prepare for set ${setNumber + 1}`);
    } else {
      this.speak(`Final set complete! Great work!`);
    }
  }
  
  announceRestStart(duration: number): void {
    const seconds = Math.floor(duration);
    if (seconds <= 10) {
      this.speak(`Rest for ${seconds} seconds`);
    } else if (seconds <= 60) {
      this.speak(`Rest for ${seconds} seconds`);
    } else {
      const minutes = Math.floor(seconds / 60);
      this.speak(`Rest for ${minutes} minute${minutes > 1 ? 's' : ''}`);
    }
  }
  
  announceRestEnding(seconds: number): void {
    if (seconds === 10) {
      this.speak('10 seconds remaining');
    } else if (seconds === 5) {
      this.speak('5 seconds');
    } else if (seconds === 3) {
      this.speak('3, 2, 1');
    }
  }
  
  announceHalfway(): void {
    this.speak('Halfway there! Keep going!');
  }
  
  announceWorkoutStart(): void {
    this.speak('Workout starting. Let\'s do this!', { priority: true });
  }
  
  announceWorkoutComplete(): void {
    this.speak('Workout complete! Excellent work today!', { priority: true });
  }
  
  announceSectionTransition(sectionName: string): void {
    this.speak(`Moving to ${sectionName}`, { priority: true });
  }
}

// Export singleton instance
export const voiceService = new VoiceService();
