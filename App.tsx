import React, { useState, useMemo, useRef } from 'react';
import { QRCodeCanvas, QRCodeHandle } from './components/QRCodeCanvas';
import { Controls } from './components/Controls';
import { GenerationMode, QRErrorCorrectionLevel, QRStyleOptions, WiFiConfig, VCardConfig, EmailConfig, SMSConfig, CalendarConfig } from './types';
import { generateSmartQRContent } from './services/geminiService';
import { QrCode } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<GenerationMode>('url');
  
  // Content States
  const [textInput, setTextInput] = useState<string>('https://google.com');
  const [wifiConfig, setWifiConfig] = useState<WiFiConfig>({ ssid: '', password: '', encryption: 'WPA', hidden: false });
  const [vCardConfig, setVCardConfig] = useState<VCardConfig>({ firstName: '', lastName: '', phone: '', email: '', org: '', title: '', url: '' });
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({ email: '', subject: '', body: '' });
  const [smsConfig, setSmsConfig] = useState<SMSConfig>({ phone: '', message: '' });
  
  // Default to current time for calendar
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
  const toLocalISO = (d: Date) => d.toISOString().slice(0, 16);

  const [calendarConfig, setCalendarConfig] = useState<CalendarConfig>({ 
    title: '', 
    startDate: toLocalISO(now), 
    endDate: toLocalISO(oneHourLater), 
    location: '', 
    description: '' 
  });

  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiResult, setAiResult] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Style State
  const [styleOptions, setStyleOptions] = useState<QRStyleOptions>({
    colorDark: '#0f172a', // slate-900
    colorLight: '#ffffff',
    margin: 2,
    scale: 10,
    errorCorrectionLevel: QRErrorCorrectionLevel.M,
    style: 'square',
    logoSize: 0.2
  });

  // Refs
  const qrCodeRef = useRef<QRCodeHandle>(null);

  // Helper for iCal date formatting (YYYYMMDDTHHMMSS)
  const formatICalDate = (localIso: string) => {
    if (!localIso) return '';
    return localIso.replace(/[-:]/g, '') + '00';
  };

  // Derived State: The actual string needed by the QR generator
  const qrValue = useMemo(() => {
    switch (mode) {
      case 'text':
      case 'url':
        return textInput;
      case 'wifi':
        // WIFI:S:SSID;T:WPA;P:PASSWORD;H:false;;
        const enc = wifiConfig.encryption === 'nopass' ? '' : wifiConfig.encryption;
        return `WIFI:S:${wifiConfig.ssid};T:${enc};P:${wifiConfig.password};H:${wifiConfig.hidden};;`;
      case 'vcard':
        return `BEGIN:VCARD
VERSION:3.0
N:${vCardConfig.lastName};${vCardConfig.firstName}
FN:${vCardConfig.firstName} ${vCardConfig.lastName}
ORG:${vCardConfig.org}
TEL;TYPE=CELL:${vCardConfig.phone}
EMAIL:${vCardConfig.email}
END:VCARD`;
      case 'email':
        return `mailto:${emailConfig.email}?subject=${encodeURIComponent(emailConfig.subject)}&body=${encodeURIComponent(emailConfig.body)}`;
      case 'sms':
        return `SMSTO:${smsConfig.phone}:${smsConfig.message}`;
      case 'calendar':
        return `BEGIN:VEVENT
SUMMARY:${calendarConfig.title}
DTSTART:${formatICalDate(calendarConfig.startDate)}
DTEND:${formatICalDate(calendarConfig.endDate)}
LOCATION:${calendarConfig.location}
DESCRIPTION:${calendarConfig.description}
END:VEVENT`;
      case 'ai':
        return aiResult || "Ask AI to generate content";
      default:
        return '';
    }
  }, [mode, textInput, wifiConfig, vCardConfig, emailConfig, smsConfig, calendarConfig, aiResult]);

  // AI Handler
  const handleAiGenerate = async () => {
    if (!aiPrompt) return;
    setIsAiLoading(true);
    try {
      const result = await generateSmartQRContent(aiPrompt);
      setAiResult(result);
      setMode('ai'); // Ensure we are on AI tab
    } catch (error) {
      alert('Failed to generate content. Please check your API Key.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 flex items-center justify-between pb-6 border-b border-slate-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-violet-200">
              <QrCode className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">QRCraft AI</h1>
              <p className="text-slate-500 text-sm font-medium">Intelligent Custom QR Generator</p>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-7 space-y-8">
            <Controls 
              mode={mode} setMode={setMode}
              textInput={textInput} setTextInput={setTextInput}
              wifiConfig={wifiConfig} setWifiConfig={setWifiConfig}
              vCardConfig={vCardConfig} setVCardConfig={setVCardConfig}
              emailConfig={emailConfig} setEmailConfig={setEmailConfig}
              smsConfig={smsConfig} setSmsConfig={setSmsConfig}
              calendarConfig={calendarConfig} setCalendarConfig={setCalendarConfig}
              aiPrompt={aiPrompt} setAiPrompt={setAiPrompt}
              handleAiGenerate={handleAiGenerate} isAiLoading={isAiLoading}
              styleOptions={styleOptions} setStyleOptions={setStyleOptions}
              onDownloadPng={() => qrCodeRef.current?.handleDownloadPng()}
              onDownloadSvg={() => qrCodeRef.current?.handleDownloadSvg()}
            />
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
                <h2 className="text-xl font-bold mb-6 text-center text-slate-800">Live Preview</h2>
                
                <QRCodeCanvas 
                  ref={qrCodeRef}
                  value={qrValue} 
                  options={styleOptions} 
                />

                <div className="mt-8 text-center">
                  <p className="text-sm text-slate-400 font-medium">
                    {styleOptions.logoUrl && styleOptions.errorCorrectionLevel !== 'H' && (
                      <span className="text-amber-500 block mb-2 text-xs">
                        ⚠️ Recommend 'H' error correction with logos.
                      </span>
                    )}
                    Generated instantly in browser
                  </p>
                </div>
              </div>

              <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2">Raw Data Payload</p>
                  <div className="text-xs font-mono text-slate-600 break-all">
                    {qrValue}
                  </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;