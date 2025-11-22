export enum QRErrorCorrectionLevel {
  L = 'L',
  M = 'M',
  Q = 'Q',
  H = 'H'
}

export type QRStyleType = 'square' | 'dots' | 'rounded';

export interface QRStyleOptions {
  colorDark: string;
  colorLight: string;
  margin: number;
  scale: number; // Pixel size per module
  errorCorrectionLevel: QRErrorCorrectionLevel;
  style: QRStyleType;
  logoUrl?: string;
  logoSize: number; // 0.1 to 0.3 (percentage of QR width)
}

export type GenerationMode = 'text' | 'url' | 'wifi' | 'vcard' | 'email' | 'sms' | 'calendar' | 'ai';

export interface WiFiConfig {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardConfig {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  org: string;
  title: string;
  url: string;
}

export interface EmailConfig {
  email: string;
  subject: string;
  body: string;
}

export interface SMSConfig {
  phone: string;
  message: string;
}

export interface CalendarConfig {
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}