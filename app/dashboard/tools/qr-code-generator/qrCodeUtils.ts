import QRCode from 'qrcode';

interface QRCodeOptions {
  fgColor: string;
  bgColor: string;
  logo: string | null;
  pixelStyle: string;
}

const drawPixel = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, style: string) => {
  switch (style) {
    case 'rounded':
      ctx.beginPath();
      ctx.moveTo(x + size / 2, y);
      ctx.arcTo(x + size, y, x + size, y + size, size / 2);
      ctx.arcTo(x + size, y + size, x, y + size, size / 2);
      ctx.arcTo(x, y + size, x, y, size / 2);
      ctx.arcTo(x, y, x + size, y, size / 2);
      ctx.fill();
      break;
    case 'dots':
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'diamond':
      ctx.beginPath();
      ctx.moveTo(x + size / 2, y);
      ctx.lineTo(x + size, y + size / 2);
      ctx.lineTo(x + size / 2, y + size);
      ctx.lineTo(x, y + size / 2);
      ctx.closePath();
      ctx.fill();
      break;
    default: // square
      ctx.fillRect(x, y, size, size);
  }
};

const addLogo = (ctx: CanvasRenderingContext2D, logo: string, canvasSize: number) => {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const logoSize = canvasSize * 0.2; // Logo size (20% of QR code)
      const x = (canvasSize - logoSize) / 2;
      const y = (canvasSize - logoSize) / 2;

      // Draw white circle background
      ctx.beginPath();
      ctx.arc(canvasSize / 2, canvasSize / 2, logoSize / 1.8, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      // Draw the logo
      ctx.drawImage(img, x, y, logoSize, logoSize);
      resolve();
    };
    img.onerror = reject;
    img.src = logo;
  });
};

export const generateQRCode = async (content: string, options: QRCodeOptions): Promise<string> => {
  const canvas = document.createElement('canvas');
  const canvasSize = 300; // Fixed size for consistency
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Unable to get canvas context');
  }

  // Generate QR code data
  const qrData = await QRCode.create(content, {
    errorCorrectionLevel: 'H',
  });

  // Set background
  ctx.fillStyle = options.bgColor;
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Draw QR code with custom pixel style
  const moduleCount = qrData.modules.size;
  const pixelSize = canvasSize / moduleCount;
  ctx.fillStyle = options.fgColor;

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (qrData.modules.get(row, col)) {
        drawPixel(ctx, col * pixelSize, row * pixelSize, pixelSize, options.pixelStyle);
      }
    }
  }

  // Add logo if provided
  if (options.logo) {
    await addLogo(ctx, options.logo, canvasSize);
  }

  return canvas.toDataURL();
};