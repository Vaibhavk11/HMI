// Voice command recognition service for hands-free workout control
// Uses Web Speech API (SpeechRecognition) for voice input

// Type declarations for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export interface VoiceCommandSettings {
  enabled: boolean;
  language: string;
  continuous: boolean;
}

export const DEFAULT_COMMAND_SETTINGS: VoiceCommandSettings = {
  enabled: false, // Disabled by default (user must opt-in)
  language: 'en-US',
  continuous: true
};

export type VoiceCommand = 
  | 'next'
  | 'skip'
  | 'pause'
  | 'resume'
  | 'start'
  | 'stop'
  | 'complete'
  | 'repeat'
  | 'instructions'
  | 'help';

export interface VoiceCommandHandler {
  command: VoiceCommand;
  handler: () => void;
}

class VoiceCommandService {
  private recognition: SpeechRecognition | null = null;
  private settings: VoiceCommandSettings;
  private handlers: Map<VoiceCommand, () => void> = new Map();
  private isListening: boolean = false;
  private commandPatterns: Map<VoiceCommand, RegExp[]> = new Map();
  
  constructor() {
    this.settings = this.loadSettings();
    this.initializeRecognition();
    this.setupCommandPatterns();
  }
  
  // Initialize speech recognition
  private initializeRecognition(): void {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }
    
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = this.settings.continuous;
    this.recognition.interimResults = false;
    this.recognition.lang = this.settings.language;
    this.recognition.maxAlternatives = 3;
    
    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      this.handleRecognitionResult(event);
    };
    
    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech' || event.error === 'audio-capture') {
        // Auto-restart on common errors
        this.restartListening();
      }
    };
    
    this.recognition.onend = () => {
      // Auto-restart if continuous mode is enabled and still should be listening
      if (this.isListening && this.settings.enabled && this.settings.continuous) {
        this.restartListening();
      }
    };
  }
  
  // Setup command patterns (flexible matching)
  private setupCommandPatterns(): void {
    this.commandPatterns.set('next', [
      /\bnext\b/i,
      /\bgo\s+next\b/i,
      /\bmove\s+on\b/i,
      /\bcontinue\b/i
    ]);
    
    this.commandPatterns.set('skip', [
      /\bskip\b/i,
      /\bskip\s+this\b/i,
      /\bskip\s+exercise\b/i,
      /\bpass\b/i
    ]);
    
    this.commandPatterns.set('pause', [
      /\bpause\b/i,
      /\bstop\b/i,
      /\bwait\b/i,
      /\bhold\s+on\b/i
    ]);
    
    this.commandPatterns.set('resume', [
      /\bresume\b/i,
      /\bstart\b/i,
      /\bcontinue\b/i,
      /\bgo\b/i
    ]);
    
    this.commandPatterns.set('complete', [
      /\bcomplete\b/i,
      /\bdone\b/i,
      /\bfinished\b/i,
      /\bcomplete\s+set\b/i
    ]);
    
    this.commandPatterns.set('repeat', [
      /\brepeat\b/i,
      /\bagain\b/i,
      /\bsay\s+that\s+again\b/i
    ]);
    
    this.commandPatterns.set('instructions', [
      /\binstructions\b/i,
      /\bshow\s+instructions\b/i,
      /\bhow\s+to\b/i,
      /\bhelp\s+me\b/i
    ]);
    
    this.commandPatterns.set('help', [
      /\bhelp\b/i,
      /\bcommands\b/i,
      /\bwhat\s+can\s+i\s+say\b/i
    ]);
  }
  
  // Handle speech recognition result
  private handleRecognitionResult(event: SpeechRecognitionEvent): void {
    const results = event.results;
    const lastResult = results[results.length - 1];
    
    if (!lastResult.isFinal) return;
    
    // Get all alternatives
    const transcripts: string[] = [];
    for (let i = 0; i < lastResult.length; i++) {
      transcripts.push(lastResult[i].transcript.toLowerCase().trim());
    }
    
    console.log('Voice command heard:', transcripts[0]);
    
    // Try to match command
    for (const transcript of transcripts) {
      const command = this.matchCommand(transcript);
      if (command) {
        console.log('Matched command:', command);
        this.executeCommand(command);
        break;
      }
    }
  }
  
  // Match transcript to command
  private matchCommand(transcript: string): VoiceCommand | null {
    for (const [command, patterns] of this.commandPatterns.entries()) {
      for (const pattern of patterns) {
        if (pattern.test(transcript)) {
          return command;
        }
      }
    }
    return null;
  }
  
  // Execute command if handler exists
  private executeCommand(command: VoiceCommand): void {
    const handler = this.handlers.get(command);
    if (handler) {
      handler();
    } else {
      console.warn('No handler registered for command:', command);
    }
  }
  
  // Restart listening (with delay to avoid errors)
  private restartListening(): void {
    setTimeout(() => {
      if (this.isListening && this.settings.enabled && this.recognition) {
        try {
          this.recognition.start();
        } catch (error) {
          // Ignore if already started
        }
      }
    }, 100);
  }
  
  // Register command handler
  registerCommand(command: VoiceCommand, handler: () => void): void {
    this.handlers.set(command, handler);
  }
  
  // Unregister command handler
  unregisterCommand(command: VoiceCommand): void {
    this.handlers.delete(command);
  }
  
  // Clear all command handlers
  clearCommands(): void {
    this.handlers.clear();
  }
  
  // Start listening for commands
  startListening(): void {
    if (!this.recognition) {
      console.warn('Speech recognition not available');
      return;
    }
    
    if (!this.settings.enabled) {
      console.warn('Voice commands are disabled in settings');
      return;
    }
    
    if (this.isListening) {
      console.log('Already listening');
      return;
    }
    
    try {
      this.isListening = true;
      this.recognition.start();
      console.log('Started listening for voice commands');
    } catch (error) {
      console.error('Failed to start listening:', error);
      this.isListening = false;
    }
  }
  
  // Stop listening for commands
  stopListening(): void {
    if (!this.recognition || !this.isListening) return;
    
    try {
      this.isListening = false;
      this.recognition.stop();
      console.log('Stopped listening for voice commands');
    } catch (error) {
      console.error('Failed to stop listening:', error);
    }
  }
  
  // Load settings from localStorage
  private loadSettings(): VoiceCommandSettings {
    try {
      const saved = localStorage.getItem('voiceCommandSettings');
      if (saved) {
        return { ...DEFAULT_COMMAND_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Failed to load voice command settings:', error);
    }
    return DEFAULT_COMMAND_SETTINGS;
  }
  
  // Save settings to localStorage
  saveSettings(settings: VoiceCommandSettings): void {
    this.settings = settings;
    try {
      localStorage.setItem('voiceCommandSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save voice command settings:', error);
    }
    
    // Update recognition settings if available
    if (this.recognition) {
      this.recognition.continuous = settings.continuous;
      this.recognition.lang = settings.language;
      
      // Restart if currently listening to apply new settings
      if (this.isListening) {
        this.stopListening();
        this.startListening();
      }
    }
  }
  
  // Get current settings
  getSettings(): VoiceCommandSettings {
    return { ...this.settings };
  }
  
  // Check if browser supports speech recognition
  isSupported(): boolean {
    return !!window.SpeechRecognition || !!window.webkitSpeechRecognition;
  }
  
  // Check if currently listening
  getIsListening(): boolean {
    return this.isListening;
  }
  
  // Get all available commands
  getAvailableCommands(): VoiceCommand[] {
    return Array.from(this.commandPatterns.keys());
  }
}

// Export singleton instance
export const voiceCommandService = new VoiceCommandService();
