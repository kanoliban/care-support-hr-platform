import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Eye, 
  Volume2,
  VolumeX,
  Type,
  Contrast,
  MousePointer,
  Keyboard,
  Zap,
  Save,
  PlayCircle,
  Pause
} from 'lucide-react';

function AccessibilityView() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    // Visual
    fontSize: 'medium',
    fontFamily: 'system',
    highContrast: false,
    darkMode: false,
    reduceMotion: false,
    focusIndicator: 'default',
    colorblindFriendly: false,
    
    // Audio
    soundEffects: true,
    speechRate: 'normal',
    enableScreenReader: false,
    audioDescriptions: false,
    voiceAnnouncements: true,
    
    // Motor/Input
    keyboardNavigation: true,
    stickyKeys: false,
    slowKeys: false,
    clickAssist: false,
    touchTargetSize: 'medium',
    
    // Cognitive
    autoAdvance: true,
    confirmActions: false,
    simplifiedInterface: false,
    readingMode: false,
    autoSave: true
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving accessibility settings:', settings);
    alert('Accessibility settings saved successfully!');
  };

  const playTestSound = () => {
    // In a real app, this would play a test sound
    alert('Test sound played');
  };

  const testVoiceAnnouncement = () => {
    // In a real app, this would use speech synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('This is a test voice announcement for CareSupport');
      speechSynthesis.speak(utterance);
    } else {
      alert('Voice announcements test - your browser does not support speech synthesis');
    }
  };

  const AccessibilitySection = ({ 
    title, 
    icon: Icon, 
    children, 
    iconColor 
  }: { 
    title: string; 
    icon: any; 
    children: React.ReactNode; 
    iconColor: string;
  }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <Icon size={20} className={iconColor} />
        {title}
      </h2>
      {children}
    </div>
  );

  const SettingRow = ({ 
    label, 
    description, 
    children 
  }: { 
    label: string; 
    description: string; 
    children: React.ReactNode;
  }) => (
    <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex-1 pr-4">
        <div className="font-medium text-gray-900 text-sm">{label}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  );

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/settings')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Eye size={28} className="text-orange-600" />
              Accessibility
            </h1>
            <p className="text-gray-600">Visual, audio, and interaction accessibility options</p>
          </div>
        </header>

        <div className="max-w-4xl space-y-8">
          {/* Visual Accessibility */}
          <AccessibilitySection title="Visual" icon={Eye} iconColor="text-blue-600">
            <div className="space-y-4">
              <SettingRow
                label="Font Size"
                description="Adjust text size for better readability"
              >
                <select
                  value={settings.fontSize}
                  onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="x-large">Extra Large</option>
                </select>
              </SettingRow>

              <SettingRow
                label="Font Family"
                description="Choose a font that's easier for you to read"
              >
                <select
                  value={settings.fontFamily}
                  onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                >
                  <option value="system">System Default</option>
                  <option value="dyslexic">OpenDyslexic</option>
                  <option value="mono">Monospace</option>
                  <option value="serif">Serif</option>
                </select>
              </SettingRow>

              <SettingRow
                label="High Contrast"
                description="Increase contrast between text and background"
              >
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                  className="rounded"
                />
              </SettingRow>

              <SettingRow
                label="Dark Mode"
                description="Use dark colors to reduce eye strain"
              >
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                  className="rounded"
                />
              </SettingRow>

              <SettingRow
                label="Reduce Motion"
                description="Minimize animations and transitions"
              >
                <input
                  type="checkbox"
                  checked={settings.reduceMotion}
                  onChange={(e) => handleSettingChange('reduceMotion', e.target.checked)}
                  className="rounded"
                />
              </SettingRow>

              <SettingRow
                label="Focus Indicator"
                description="How keyboard focus is shown"
              >
                <select
                  value={settings.focusIndicator}
                  onChange={(e) => handleSettingChange('focusIndicator', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                >
                  <option value="default">Default</option>
                  <option value="bold">Bold Outline</option>
                  <option value="color">Color Highlight</option>
                </select>
              </SettingRow>

              <SettingRow
                label="Colorblind Friendly"
                description="Use patterns and symbols in addition to colors"
              >
                <input
                  type="checkbox"
                  checked={settings.colorblindFriendly}
                  onChange={(e) => handleSettingChange('colorblindFriendly', e.target.checked)}
                  className="rounded"
                />
              </SettingRow>
            </div>
          </AccessibilitySection>

          {/* Audio Accessibility */}
          <AccessibilitySection title="Audio" icon={Volume2} iconColor="text-green-600">
            <div className="space-y-4">
              <SettingRow
                label="Sound Effects"
                description="Enable notification sounds and feedback"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.soundEffects}
                    onChange={(e) => handleSettingChange('soundEffects', e.target.checked)}
                    className="rounded"
                  />
                  <button
                    onClick={playTestSound}
                    className="p-1 text-gray-500 hover:text-gray-700"
                    title="Test sound"
                  >
                    <PlayCircle size={16} />
                  </button>
                </div>
              </SettingRow>

              <SettingRow
                label="Screen Reader Support"
                description="Enhanced compatibility with screen readers"
              >
                <input
                  type="checkbox"
                  checked={settings.enableScreenReader}
                  onChange={(e) => handleSettingChange('enableScreenReader', e.target.checked)}
                  className="rounded"
                />
              </SettingRow>

              <SettingRow
                label="Voice Announcements"
                description="Spoken notifications for important updates"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.voiceAnnouncements}
                    onChange={(e) => handleSettingChange('voiceAnnouncements', e.target.checked)}
                    className="rounded"
                  />
                  <button
                    onClick={testVoiceAnnouncement}
                    className="p-1 text-gray-500 hover:text-gray-700"
                    title="Test voice announcement"
                  >
                    <PlayCircle size={16} />
                  </button>
                </div>
              </SettingRow>

              <SettingRow
                label="Speech Rate"
                description="Speed of voice announcements"
              >
                <select
                  value={settings.speechRate}
                  onChange={(e) => handleSettingChange('speechRate', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                  disabled={!settings.voiceAnnouncements}
                >
                  <option value="slow">Slow</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Fast</option>
                </select>
              </SettingRow>

              <SettingRow
                label="Audio Descriptions"
                description="Spoken descriptions of visual content"
              >
                <input
                  type="checkbox"
                  checked={settings.audioDescriptions}
                  onChange={(e) => handleSettingChange('audioDescriptions', e.target.checked)}
                  className="rounded"
                />
              </SettingRow>
            </div>
          </AccessibilitySection>

          {/* Motor/Input Accessibility */}
          <AccessibilitySection title="Motor & Input" icon={MousePointer} iconColor="text-purple-600">
            <div className="space-y-4">
              <SettingRow
                label="Keyboard Navigation"
                description="Navigate using keyboard instead of mouse"
              >
                <input
                  type="checkbox"
                  checked={settings.keyboardNavigation}
                  onChange={(e) => handleSettingChange('keyboardNavigation', e.target.checked)}
                  className="rounded"
                />
              </SettingRow>

              <SettingRow
                label="Sticky Keys"
                description="Press modifier keys one at a time instead of holding"
              >
                <input
                  type="checkbox"
                  checked={settings.stickyKeys}
                  onChange={(e) => handleSettingChange('stickyKeys', e.target.checked)}
                  className="rounded"
                />
              </SettingRow>

              <SettingRow
                label="Slow Keys"
                description="Add delay to key presses to prevent accidental input"
              >
                <input
                  type="checkbox"
                  checked={settings.slowKeys}
                  onChange={(e) => handleSettingChange('slowKeys', e.target.checked)}
                  className="rounded"
                />
              </SettingRow>

              <SettingRow
                label="Click Assistance"
                description="Make clicking easier with hover delays"
              >
                <input
                  type="checkbox"
                  checked={settings.clickAssist}
                  onChange={(e) => handleSettingChange('clickAssist', e.target.checked)}
                  className="rounded"
                />
              </SettingRow>

              <SettingRow
                label="Touch Target Size"
                description="Size of buttons and clickable areas"
              >
                <select
                  value={settings.touchTargetSize}
                  onChange={(e) => handleSettingChange('touchTargetSize', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="x-large">Extra Large</option>
                </select>
              </SettingRow>
            </div>
          </AccessibilitySection>

          {/* Cognitive Accessibility */}
          <AccessibilitySection title="Cognitive" icon={Zap} iconColor="text-orange-600">
            <div className="space-y-4">
              <SettingRow
                label="Auto-advance"
                description="Automatically move to next screen after completing tasks"
              >
                <input
                  type="checkbox"
                  checked={settings.autoAdvance}
                  onChange={(e) => handleSettingChange('autoAdvance', e.target.checked)}
                  className="rounded"
                />
              </SettingRow>

              <SettingRow
                label="Confirm Actions"
                description="Ask for confirmation before important actions"
              >
                <input
                  type="checkbox"
                  checked={settings.confirmActions}
                  onChange={(e) => handleSettingChange('confirmActions', e.target.checked)}
                  className="rounded"
                />
              </SettingRow>

              <SettingRow
                label="Simplified Interface"
                description="Show fewer options and simpler layouts"
              >
                <input
                  type="checkbox"
                  checked={settings.simplifiedInterface}
                  onChange={(e) => handleSettingChange('simplifiedInterface', e.target.checked)}
                  className="rounded"
                />
              </SettingRow>

              <SettingRow
                label="Reading Mode"
                description="Focus on text with minimal distractions"
              >
                <input
                  type="checkbox"
                  checked={settings.readingMode}
                  onChange={(e) => handleSettingChange('readingMode', e.target.checked)}
                  className="rounded"
                />
              </SettingRow>

              <SettingRow
                label="Auto-save"
                description="Automatically save changes as you work"
              >
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                  className="rounded"
                />
              </SettingRow>
            </div>
          </AccessibilitySection>

          {/* Help & Resources */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Accessibility Resources</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• For more accessibility options, check your device's system accessibility settings</p>
              <p>• CareSupport supports most screen readers including NVDA, JAWS, and VoiceOver</p>
              <p>• You can navigate the entire interface using only the keyboard (Tab, Space, Enter, Arrow keys)</p>
              <p>• If you need additional accessibility features, please contact our support team</p>
            </div>
            <div className="mt-4">
              <button className="text-sm text-blue-700 hover:text-blue-800 underline">
                View Accessibility Guide
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Save size={20} />
            Save Accessibility Settings
          </button>
        </div>
      </div>
    </main>
  );
}

export default AccessibilityView;