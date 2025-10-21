import React, { useState, useEffect } from 'react';
import { voiceService, VoiceSettings } from '../utils/voiceService';
import { voiceCommandService, VoiceCommandSettings } from '../utils/voiceCommandService';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<VoiceSettings>(voiceService.getSettings());
  const [commandSettings, setCommandSettings] = useState<VoiceCommandSettings>(voiceCommandService.getSettings());
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isTestingSpeech, setIsTestingSpeech] = useState(false);
  const [activeTab, setActiveTab] = useState<'guidance' | 'commands'>('guidance');
  
  useEffect(() => {
    // Load available voices
    const loadVoices = () => {
      const availableVoices = voiceService.getVoices();
      setVoices(availableVoices);
    };
    
    loadVoices();
    
    // Voices might load asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);
  
  const handleSave = () => {
    voiceService.saveSettings(settings);
    voiceCommandService.saveSettings(commandSettings);
    onClose();
  };
  
  const handleTest = () => {
    setIsTestingSpeech(true);
    voiceService.saveSettings(settings); // Apply current settings temporarily
    voiceService.speak('This is a test of the voice guidance system. Starting exercise: Push ups');
    setTimeout(() => setIsTestingSpeech(false), 2000);
  };
  
  const handleReset = () => {
    const defaults = {
      enabled: true,
      volume: 0.8,
      rate: 1.0,
      pitch: 1.0,
      voice: null
    };
    setSettings(defaults);
    
    const commandDefaults = {
      enabled: false,
      language: 'en-US',
      continuous: true
    };
    setCommandSettings(commandDefaults);
  };
  
  if (!isOpen) return null;
  
  const commandsSupported = voiceCommandService.isSupported();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-gray-200">
          <div className="p-4 flex justify-between items-center border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">🎙️ Voice Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex">
            <button
              onClick={() => setActiveTab('guidance')}
              className={`flex-1 px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === 'guidance'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              🔊 Audio Guidance
            </button>
            <button
              onClick={() => setActiveTab('commands')}
              className={`flex-1 px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === 'commands'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              🎤 Voice Commands
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Audio Guidance Tab */}
          {activeTab === 'guidance' && (
            <>
              {/* Enable/Disable Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-semibold text-gray-900">Enable Voice Guidance</label>
                  <p className="text-sm text-gray-500">Audio cues during workouts</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.enabled ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {settings.enabled && (
                <>
                  {/* Volume Control */}
                  <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Volume: {Math.round(settings.volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.volume}
                  onChange={(e) => setSettings({ ...settings, volume: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Quiet</span>
                  <span>Loud</span>
                </div>
              </div>
              
              {/* Speech Rate Control */}
              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Speech Rate: {settings.rate.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.rate}
                  onChange={(e) => setSettings({ ...settings, rate: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Slower</span>
                  <span>Normal</span>
                  <span>Faster</span>
                </div>
              </div>
              
              {/* Pitch Control */}
              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Pitch: {settings.pitch.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.pitch}
                  onChange={(e) => setSettings({ ...settings, pitch: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Lower</span>
                  <span>Normal</span>
                  <span>Higher</span>
                </div>
              </div>
              
              {/* Voice Selection */}
              {voices.length > 0 && (
                <div>
                  <label className="block font-semibold text-gray-900 mb-2">
                    Voice
                  </label>
                  <select
                    value={settings.voice || ''}
                    onChange={(e) => setSettings({ ...settings, voice: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Default</option>
                    {voices.map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Select a voice for audio guidance
                  </p>
                </div>
              )}
              
              {/* Test Button */}
              <button
                onClick={handleTest}
                disabled={isTestingSpeech}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {isTestingSpeech ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Playing...
                  </>
                ) : (
                  <>
                    <span className="text-lg mr-2">🔊</span>
                    Test Voice
                  </>
                )}
              </button>
            </>
          )}
            </>
          )}
          
          {/* Voice Commands Tab */}
          {activeTab === 'commands' && (
            <>
              {!commandsSupported && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">
                    <strong>⚠️ Not Supported:</strong> Voice commands are not supported in your browser. 
                    Try using Chrome, Edge, or Safari.
                  </p>
                </div>
              )}
              
              {commandsSupported && (
                <>
                  {/* Enable Voice Commands */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-semibold text-gray-900">Enable Voice Commands</label>
                      <p className="text-sm text-gray-500">Control workout with voice</p>
                    </div>
                    <button
                      onClick={() => setCommandSettings({ ...commandSettings, enabled: !commandSettings.enabled })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        commandSettings.enabled ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          commandSettings.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {commandSettings.enabled && (
                    <>
                      {/* Language Selection */}
                      <div>
                        <label className="block font-semibold text-gray-900 mb-2">
                          Language
                        </label>
                        <select
                          value={commandSettings.language}
                          onChange={(e) => setCommandSettings({ ...commandSettings, language: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="en-US">English (US)</option>
                          <option value="en-GB">English (UK)</option>
                          <option value="en-AU">English (Australia)</option>
                          <option value="en-IN">English (India)</option>
                        </select>
                      </div>
                      
                      {/* Available Commands */}
                      <div>
                        <label className="block font-semibold text-gray-900 mb-2">
                          Available Commands
                        </label>
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">"Next" or "Continue"</span>
                            <span className="text-gray-500">→ Next exercise</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">"Skip"</span>
                            <span className="text-gray-500">→ Skip exercise</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">"Pause" or "Stop"</span>
                            <span className="text-gray-500">→ Pause timer</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">"Resume" or "Start"</span>
                            <span className="text-gray-500">→ Resume timer</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">"Complete" or "Done"</span>
                            <span className="text-gray-500">→ Complete set</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">"Instructions"</span>
                            <span className="text-gray-500">→ Show instructions</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Microphone Permissions Notice */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                          <strong>🎤 Microphone Access:</strong> Your browser will request microphone 
                          permission when voice commands are enabled during a workout.
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
          
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              {activeTab === 'guidance' ? (
                <>
                  <strong>💡 Tip:</strong> Voice guidance will announce exercise starts, completions, and rest periods during your workout.
                </>
              ) : (
                <>
                  <strong>💡 Tip:</strong> Voice commands allow hands-free workout control. Just say "Next", "Skip", or "Pause" during your workout.
                </>
              )}
            </p>
          </div>
        </div>
        
        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceSettingsModal;
