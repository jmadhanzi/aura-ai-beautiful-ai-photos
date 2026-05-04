// ── Export & Share Service ──────────────────────────────
// Watermarks free exports, clean exports for Pro users.

import { track } from './analytics';

interface ExportOptions {
  imageUrl: string;
  isPro: boolean;
  label?: string; // e.g. "Skin Perfecting"
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function exportImage(opts: ExportOptions): Promise<Blob | null> {
  const { imageUrl, isPro, label } = opts;

  try {
    const img = await loadImage(imageUrl);
    const canvas = document.createElement('canvas');

    // 2× resolution for crisp export
    const scale = 2;
    canvas.width = img.naturalWidth * scale;
    canvas.height = img.naturalHeight * scale;

    const ctx = canvas.getContext('2d')!;
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

    if (!isPro) {
      // ── Watermark bar at bottom ──────────────────
      const barH = 44;
      const y = img.naturalHeight - barH;

      // Semi-transparent dark bar
      ctx.fillStyle = 'rgba(5,5,9,0.82)';
      ctx.fillRect(0, y, img.naturalWidth, barH);

      // Gold gradient text
      const grad = ctx.createLinearGradient(0, 0, img.naturalWidth, 0);
      grad.addColorStop(0, '#C8A45A');
      grad.addColorStop(0.5, '#EED498');
      grad.addColorStop(1, '#C8A45A');

      ctx.fillStyle = grad;
      ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
      ctx.textBaseline = 'middle';
      ctx.fillText('✦ AURA AI Studio', 14, y + barH / 2);

      // Right: "Get Pro at aura.app"
      ctx.fillStyle = 'rgba(240,240,248,0.5)';
      ctx.font = '11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('aura.app', img.naturalWidth - 14, y + barH / 2);
      ctx.textAlign = 'left';
    } else if (label) {
      // Pro: tiny tasteful credit bottom-right
      ctx.fillStyle = 'rgba(200,164,90,0.6)';
      ctx.font = '10px "DM Mono", monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(`AURA · ${label}`, img.naturalWidth - 10, img.naturalHeight - 8);
      ctx.textAlign = 'left';
    }

    return await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', 0.92));
  } catch (e) {
    console.error('[export] Failed:', e);
    return null;
  }
}

export async function downloadImage(opts: ExportOptions, filename = 'aura-edit.jpg') {
  track('photo_exported', { type: opts.isPro ? 'clean' : 'watermark' });
  const blob = await exportImage(opts);
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function shareImage(opts: ExportOptions) {
  track('share_triggered', { platform: 'native' });
  const blob = await exportImage(opts);
  if (!blob) return;

  if (navigator.share && navigator.canShare) {
    const file = new File([blob], 'aura-edit.jpg', { type: 'image/jpeg' });
    if (navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'My AURA Edit',
        text: '✦ Edited with AURA AI Studio — try it free at aura.app',
      });
      return;
    }
  }

  // Fallback: copy blob URL
  const url = URL.createObjectURL(blob);
  await navigator.clipboard.writeText(url);
}
