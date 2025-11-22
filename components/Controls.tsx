import React from 'react';
import { QRErrorCorrectionLevel, QRStyleOptions, GenerationMode, WiFiConfig, VCardConfig, EmailConfig, SMSConfig, CalendarConfig } from '../types';
import { 
  Type, 
  Link, 
  Wifi, 
  Contact, 
  Mail,
  MessageSquare,
  Calendar,
  Sparkles, 
  Palette, 
  Download,
  Upload,
  Circle,
  Square,
  FileImage,
  FileCode,
  AlertCircle
} from 'lucide-react';

interface ControlsProps {
  mode: GenerationMode;
  setMode: (m: GenerationMode) => void;
  textInput: string;
  setTextInput: (s: string) => void;
  wifiConfig: WiFiConfig;
  setWifiConfig: (c: WiFiConfig) => void;
  vCardConfig: VCardConfig;
  setVCardConfig: (c: VCardConfig) => void;
  emailConfig: EmailConfig;
  setEmailConfig: (c: EmailConfig) => void;
  smsConfig: SMSConfig;
  setSmsConfig: (c: SMSConfig) => void;
  calendarConfig: CalendarConfig;
  setCalendarConfig: (c: CalendarConfig) => void;
  aiPrompt: string;
  setAiPrompt: (s: string) => void;
  handleAiGenerate: () => void;
  isAiLoading: boolean;
  styleOptions: QRStyleOptions;
  setStyleOptions: (o: QRStyleOptions) => void;
  onDownloadPng: () => void;
  onDownloadSvg: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  mode, setMode,
  textInput, setTextInput,
  wifiConfig, setWifiConfig,
  vCardConfig, setVCardConfig,
  emailConfig, setEmailConfig,
  smsConfig, setSmsConfig,
  calendarConfig, setCalendarConfig,
  aiPrompt, setAiPrompt,
  handleAiGenerate, isAiLoading,
  styleOptions, setStyleOptions,
  onDownloadPng,
  onDownloadSvg
}) => {

  const tabs = [
    { id: 'url', icon: Link, label: 'URL' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'wifi', icon: Wifi, label: 'WiFi' },
    { id: 'vcard', icon: Contact, label: 'vCard' },
    { id: 'email', icon: Mail, label: 'Email' },
    { id: 'sms', icon: MessageSquare, label: 'SMS' },
    { id: 'calendar', icon: Calendar, label: 'Event' },
    { id: 'ai', icon: Sparkles, label: 'AI Magic', color: 'text-violet-600' },
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setStyleOptions({
            ...styleOptions, 
            logoUrl: ev.target.result as string,
            errorCorrectionLevel: QRErrorCorrectionLevel.H 
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const showUrlError = mode === 'url' && textInput.trim() !== '' && !isValidUrl(textInput);

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = mode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id as GenerationMode)}
              className={`flex items-center px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap shadow-sm
                ${isActive 
                  ? 'bg-violet-600 text-white shadow-violet-200' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                }`}
            >
              <Icon className={`w-4 h-4 mr-2 ${tab.color && !isActive ? tab.color : ''}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Inputs */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center">
          {mode === 'ai' ? <Sparkles className="w-5 h-5 mr-2 text-violet-600" /> : null}
          Input Content
        </h3>
        
        {(mode === 'text' || mode === 'url') && (
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              {mode === 'url' ? 'Website URL' : 'Plain Text'}
            </label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={mode === 'url' ? "https://www.example.com" : "Enter text to encode..."}
              className={`w-full bg-slate-50 border rounded-xl p-4 text-slate-800 focus:ring-2 focus:border-transparent outline-none transition-all resize-none h-32 placeholder:text-slate-400 ${
                showUrlError 
                  ? 'border-red-300 focus:ring-red-500 text-red-900 bg-red-50' 
                  : 'border-slate-200 focus:ring-violet-500'
              }`}
            />
            {showUrlError && (
              <p className="mt-2 text-xs text-red-600 font-medium flex items-center animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-3 h-3 mr-1.5" />
                Please enter a valid URL including protocol (e.g., https://...)
              </p>
            )}
          </div>
        )}

        {mode === 'wifi' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Network Name (SSID)</label>
              <input
                type="text"
                value={wifiConfig.ssid}
                onChange={(e) => setWifiConfig({...wifiConfig, ssid: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-violet-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Password</label>
              <input
                type="text"
                value={wifiConfig.password}
                onChange={(e) => setWifiConfig({...wifiConfig, password: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-violet-500 focus:outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Encryption</label>
                <select
                  value={wifiConfig.encryption}
                  onChange={(e) => setWifiConfig({...wifiConfig, encryption: e.target.value as any})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-violet-500 focus:outline-none"
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None</option>
                </select>
              </div>
              <div className="flex items-center mt-7 px-2">
                 <input
                  type="checkbox"
                  checked={wifiConfig.hidden}
                  onChange={(e) => setWifiConfig({...wifiConfig, hidden: e.target.checked})}
                  className="w-5 h-5 text-violet-600 bg-slate-100 border-slate-300 rounded focus:ring-violet-500"
                  id="hidden-net"
                />
                <label htmlFor="hidden-net" className="ml-2 text-sm text-slate-600 font-medium">Hidden Network</label>
              </div>
            </div>
          </div>
        )}

        {mode === 'vcard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['firstName', 'lastName', 'phone', 'email'].map((field) => (
              <input
                key={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace('Name', ' Name')}
                value={(vCardConfig as any)[field]}
                onChange={(e) => setVCardConfig({...vCardConfig, [field]: e.target.value})}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              />
            ))}
            <div className="md:col-span-2">
               <input
                  placeholder="Organization / Company"
                  value={vCardConfig.org}
                  onChange={(e) => setVCardConfig({...vCardConfig, org: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
               />
            </div>
          </div>
        )}

        {mode === 'email' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email Address</label>
              <input
                type="email"
                value={emailConfig.email}
                onChange={(e) => setEmailConfig({...emailConfig, email: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-violet-500 focus:outline-none"
                placeholder="recipient@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Subject</label>
              <input
                type="text"
                value={emailConfig.subject}
                onChange={(e) => setEmailConfig({...emailConfig, subject: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-violet-500 focus:outline-none"
                placeholder="Email Subject"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Message Body</label>
              <textarea
                value={emailConfig.body}
                onChange={(e) => setEmailConfig({...emailConfig, body: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-violet-500 focus:outline-none h-24 resize-none"
                placeholder="Type your message here..."
              />
            </div>
          </div>
        )}

        {mode === 'sms' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={smsConfig.phone}
                onChange={(e) => setSmsConfig({...smsConfig, phone: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-violet-500 focus:outline-none"
                placeholder="+1234567890"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Message</label>
              <textarea
                value={smsConfig.message}
                onChange={(e) => setSmsConfig({...smsConfig, message: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-violet-500 focus:outline-none h-24 resize-none"
                placeholder="Text message content..."
              />
            </div>
          </div>
        )}

        {mode === 'calendar' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Event Title</label>
              <input
                type="text"
                value={calendarConfig.title}
                onChange={(e) => setCalendarConfig({...calendarConfig, title: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-violet-500 focus:outline-none"
                placeholder="Meeting with Team"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Start Time</label>
                <input
                  type="datetime-local"
                  value={calendarConfig.startDate}
                  onChange={(e) => setCalendarConfig({...calendarConfig, startDate: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-violet-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">End Time</label>
                <input
                  type="datetime-local"
                  value={calendarConfig.endDate}
                  onChange={(e) => setCalendarConfig({...calendarConfig, endDate: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-violet-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Location</label>
              <input
                type="text"
                value={calendarConfig.location}
                onChange={(e) => setCalendarConfig({...calendarConfig, location: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-violet-500 focus:outline-none"
                placeholder="Conference Room A"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Description</label>
              <textarea
                value={calendarConfig.description}
                onChange={(e) => setCalendarConfig({...calendarConfig, description: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-violet-500 focus:outline-none h-20 resize-none"
                placeholder="Event details..."
              />
            </div>
          </div>
        )}

        {mode === 'ai' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Describe what you want. Gemini will format it correctly.
              <br/>
              <span className="text-slate-400 italic">Ex: "Wifi for GuestNet pass 1234" or "Contact info for Jane Doe, 555-0199"</span>
            </p>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask AI to create a QR code..."
              className="w-full bg-slate-50 border border-violet-200 rounded-xl p-4 text-slate-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all resize-none h-32"
            />
            <button
              onClick={handleAiGenerate}
              disabled={isAiLoading || !aiPrompt.trim()}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-3 px-4 rounded-xl transition-all flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-200"
            >
              {isAiLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Magic QR
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Style Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center">
          <Palette className="w-5 h-5 mr-2 text-fuchsia-500" />
          Design & Branding
        </h3>
        
        {/* Shape Selector */}
        <div>
           <label className="block text-xs font-bold text-slate-400 uppercase mb-3">Module Style</label>
           <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => setStyleOptions({...styleOptions, style: 'square'})}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${styleOptions.style === 'square' ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
              >
                <Square className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Square</span>
              </button>
              <button 
                onClick={() => setStyleOptions({...styleOptions, style: 'rounded'})}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${styleOptions.style === 'rounded' ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
              >
                <div className="w-5 h-5 rounded-md border-2 border-current mb-1"></div>
                <span className="text-xs font-medium">Rounded</span>
              </button>
              <button 
                onClick={() => setStyleOptions({...styleOptions, style: 'dots'})}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${styleOptions.style === 'dots' ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
              >
                <Circle className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Dots</span>
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Colors */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Colors</label>
              <div className="flex space-x-4">
                <div className="flex-1">
                   <label className="text-xs text-slate-500 mb-1 block">Foreground</label>
                   <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <input
                        type="color"
                        value={styleOptions.colorDark}
                        onChange={(e) => setStyleOptions({...styleOptions, colorDark: e.target.value})}
                        className="h-8 w-8 bg-transparent rounded cursor-pointer border-0 p-0"
                      />
                      <span className="text-xs font-mono text-slate-600">{styleOptions.colorDark}</span>
                   </div>
                </div>
                <div className="flex-1">
                   <label className="text-xs text-slate-500 mb-1 block">Background</label>
                   <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <input
                        type="color"
                        value={styleOptions.colorLight}
                        onChange={(e) => setStyleOptions({...styleOptions, colorLight: e.target.value})}
                        className="h-8 w-8 bg-transparent rounded cursor-pointer border-0 p-0"
                      />
                      <span className="text-xs font-mono text-slate-600">{styleOptions.colorLight}</span>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
             <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Logo Overlay</label>
             <div className="relative group">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 group-hover:border-violet-400 group-hover:bg-violet-50 transition-all h-full min-h-[100px]">
                  {styleOptions.logoUrl ? (
                    <div className="relative">
                      <img src={styleOptions.logoUrl} className="w-12 h-12 object-contain rounded-md shadow-sm" alt="Logo" />
                      <div className="absolute -top-2 -right-2 bg-violet-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">Change</div>
                    </div>
                  ) : (
                    <>
                       <Upload className="w-6 h-6 mb-2 text-slate-400" />
                       <span className="text-xs">Click to Upload Logo</span>
                    </>
                  )}
                </div>
             </div>
             {styleOptions.logoUrl && (
               <div>
                 <label className="block text-xs text-slate-400 mb-1">Logo Size</label>
                 <input 
                    type="range" 
                    min="10" 
                    max="30" 
                    value={styleOptions.logoSize * 100} 
                    onChange={(e) => setStyleOptions({...styleOptions, logoSize: parseInt(e.target.value) / 100})}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                 />
               </div>
             )}
          </div>
        </div>

        {/* Advanced Settings Toggle */}
        <div className="pt-4 border-t border-slate-100">
           <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs text-slate-400 mb-2">Error Correction</label>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  {[QRErrorCorrectionLevel.L, QRErrorCorrectionLevel.M, QRErrorCorrectionLevel.Q, QRErrorCorrectionLevel.H].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setStyleOptions({...styleOptions, errorCorrectionLevel: lvl})}
                      className={`flex-1 text-xs font-bold py-1.5 rounded-md transition-all ${styleOptions.errorCorrectionLevel === lvl ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
             </div>
           </div>
        </div>

      </div>

      {/* Download Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
            onClick={onDownloadPng}
            className="col-span-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center text-base transform hover:scale-[1.02]"
          >
            <FileImage className="w-5 h-5 mr-2" />
            PNG
          </button>
          <button
            onClick={onDownloadSvg}
            className="col-span-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 px-4 rounded-2xl shadow-lg shadow-slate-300 transition-all flex items-center justify-center text-base transform hover:scale-[1.02]"
          >
            <FileCode className="w-5 h-5 mr-2" />
            SVG
          </button>
      </div>
    </div>
  );
};