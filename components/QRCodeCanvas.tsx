import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import QRCode from 'qrcode';
import { QRStyleOptions } from '../types';

interface QRCodeCanvasProps {
  value: string;
  options: QRStyleOptions;
}

export interface QRCodeHandle {
  handleDownloadPng: () => void;
  handleDownloadSvg: () => void;
}

export const QRCodeCanvas = forwardRef<QRCodeHandle, QRCodeCanvasProps>(({ value, options }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useImperativeHandle(ref, () => ({
    handleDownloadPng: () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'qrcraft-code.png';
        link.href = url;
        link.click();
      }
    },
    handleDownloadSvg: () => {
      const svgContent = generateSVG(value, options);
      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'qrcraft-code.svg';
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
  }));

  const generateSVG = (text: string, opts: QRStyleOptions) => {
    const qrData = QRCode.create(text, { errorCorrectionLevel: opts.errorCorrectionLevel });
    const modules = qrData.modules;
    const size = modules.size;
    const scale = opts.scale || 10;
    const margin = opts.margin || 2;
    const canvasSize = (size + margin * 2) * scale;
    
    let paths: string[] = [];
    const radius = scale * 0.35; // For rounded rects
    const dotRadius = (scale * 0.85) / 2; // For dots

    // Helper to check module state
    const isDark = (r: number, c: number) => {
      if (r < 0 || c < 0 || r >= size || c >= size) return false;
      return modules.get(r, c);
    };

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (isDark(r, c)) {
          const x = (c + margin) * scale;
          const y = (r + margin) * scale;

          if (opts.style === 'dots') {
             const cx = x + scale / 2;
             const cy = y + scale / 2;
             paths.push(`<circle cx="${cx}" cy="${cy}" r="${dotRadius}" fill="${opts.colorDark}" />`);
          } else if (opts.style === 'rounded') {
             paths.push(`<rect x="${x}" y="${y}" width="${scale}" height="${scale}" rx="${radius}" fill="${opts.colorDark}" />`);
          } else {
             paths.push(`<rect x="${x}" y="${y}" width="${scale}" height="${scale}" fill="${opts.colorDark}" />`);
          }
        }
      }
    }

    let logoSvg = '';
    if (opts.logoUrl) {
       const logoSizePx = canvasSize * opts.logoSize;
       const xPos = (canvasSize - logoSizePx) / 2;
       const yPos = (canvasSize - logoSizePx) / 2;
       const padding = scale;
       
       // Background for logo to ensure readability
       // Using a rect with slight rounding
       logoSvg += `<rect x="${xPos - padding/2}" y="${yPos - padding/2}" width="${logoSizePx + padding}" height="${logoSizePx + padding}" rx="${scale}" fill="${opts.colorLight}" />`;
       // Image
       logoSvg += `<image href="${opts.logoUrl}" x="${xPos}" y="${yPos}" width="${logoSizePx}" height="${logoSizePx}" />`;
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${canvasSize}" height="${canvasSize}" viewBox="0 0 ${canvasSize} ${canvasSize}">
        <rect width="100%" height="100%" fill="${opts.colorLight}"/>
        ${paths.join('')}
        ${logoSvg}
      </svg>
    `;
  };

  useEffect(() => {
    const renderQR = async () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      try {
        const qrData = QRCode.create(value || 'https://example.com', {
          errorCorrectionLevel: options.errorCorrectionLevel,
        });

        const modules = qrData.modules;
        const size = modules.size;
        const scale = options.scale || 10;
        const margin = options.margin || 2;

        const canvasSize = (size + margin * 2) * scale;
        canvas.width = canvasSize;
        canvas.height = canvasSize;

        // Draw Background
        ctx.fillStyle = options.colorLight;
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        // Draw Modules
        ctx.fillStyle = options.colorDark;
        
        const isDark = (r: number, c: number) => {
          if (r < 0 || c < 0 || r >= size || c >= size) return false;
          return modules.get(r, c);
        };

        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if (isDark(r, c)) {
              const x = (c + margin) * scale;
              const y = (r + margin) * scale;
              
              if (options.style === 'dots') {
                ctx.beginPath();
                const radius = (scale * 0.85) / 2;
                ctx.arc(x + scale / 2, y + scale / 2, radius, 0, Math.PI * 2);
                ctx.fill();
              } else if (options.style === 'rounded') {
                const radius = scale * 0.35;
                ctx.beginPath();
                ctx.roundRect(x, y, scale, scale, radius);
                ctx.fill();
              } else {
                ctx.fillRect(x, y, scale, scale);
              }
            }
          }
        }

        // Draw Logo
        if (options.logoUrl) {
          const img = new Image();
          img.src = options.logoUrl;
          img.crossOrigin = "Anonymous";

          img.onload = () => {
            const logoSizePx = canvasSize * options.logoSize;
            const xPos = (canvasSize - logoSizePx) / 2;
            const yPos = (canvasSize - logoSizePx) / 2;

            ctx.fillStyle = options.colorLight;
            const padding = scale;
            
            ctx.beginPath();
            ctx.roundRect(xPos - padding/2, yPos - padding/2, logoSizePx + padding, logoSizePx + padding, scale);
            ctx.fill();

            ctx.drawImage(img, xPos, yPos, logoSizePx, logoSizePx);
          };
        }

      } catch (err) {
        console.error("Failed to render QR", err);
      }
    };

    renderQR();
  }, [value, options]);

  return (
    <div className="flex justify-center items-center p-8 bg-white rounded-xl shadow-inner border border-slate-100">
      <canvas 
        ref={canvasRef} 
        className="max-w-full h-auto rounded-lg shadow-md"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
});

QRCodeCanvas.displayName = 'QRCodeCanvas';