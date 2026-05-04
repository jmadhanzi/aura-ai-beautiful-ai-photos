// ── Real AI Image Processing Service ──────────────────
// Integrates fal.ai for production-grade face enhancement.
// Falls back to a simulated result if VITE_FAL_API_KEY is not set.

const FAL_KEY = import.meta.env.VITE_FAL_API_KEY;

export type ToolId = 'skin' | 'headshot' | 'background' | 'sculpt' | 'style' | 'cinematic' | 'makeup' | 'optimize';

export interface ProcessResult {
  editedUrl: string;
  processingMs: number;
  model: string;
}

type FalResponse = {
  data?: {
    image?: { url: string };
    images?: { url: string }[];
    output?: string;
  };
};

const MODEL_CONFIGS: Record<string, { model: string; buildInput: (url: string) => Record<string, unknown> }> = {
  skin: {
    model: 'fal-ai/clarity-upscaler',
    buildInput: (url) => ({ image_url: url, scale: 2, creativity: 0.32, resemblance: 0.92, detail: 0.85 }),
  },
  headshot: {
    model: 'fal-ai/flux/dev/image-to-image',
    buildInput: (url) => ({
      image_url: url,
      prompt: 'professional business headshot, natural studio lighting, sharp focus on face, clean neutral background, confident expression',
      strength: 0.38,
      num_inference_steps: 28,
    }),
  },
  editorial: {
    model: 'fal-ai/flux/dev/image-to-image',
    buildInput: (url) => ({
      image_url: url,
      prompt: 'editorial magazine portrait, soft diffused studio lighting, Vogue aesthetic, professional retouching, film grain',
      strength: 0.44,
      num_inference_steps: 30,
    }),
  },
  confident: {
    model: 'fal-ai/flux/dev/image-to-image',
    buildInput: (url) => ({
      image_url: url,
      prompt: 'confident professional LinkedIn portrait, direct eye contact, well-lit, polished appearance, corporate setting',
      strength: 0.38,
      num_inference_steps: 28,
    }),
  },
  natural: {
    model: 'fal-ai/clarity-upscaler',
    buildInput: (url) => ({ image_url: url, scale: 2, creativity: 0.25, resemblance: 0.95, detail: 0.7 }),
  },
  dramatic: {
    model: 'fal-ai/flux/dev/image-to-image',
    buildInput: (url) => ({
      image_url: url,
      prompt: 'dramatic cinematic portrait, high contrast, moody rembrandt lighting, film noir, deep shadows',
      strength: 0.5,
      num_inference_steps: 30,
    }),
  },
  golden: {
    model: 'fal-ai/flux/dev/image-to-image',
    buildInput: (url) => ({
      image_url: url,
      prompt: 'golden hour portrait, warm 3200K backlight, cinematic orange teal grade, soft bokeh, magic hour',
      strength: 0.44,
      num_inference_steps: 28,
    }),
  },
  moody: {
    model: 'fal-ai/flux/dev/image-to-image',
    buildInput: (url) => ({
      image_url: url,
      prompt: 'moody analog film photography, kodak portra 400 grain, muted tones, atmospheric, indie film aesthetic',
      strength: 0.48,
      num_inference_steps: 28,
    }),
  },
  background: {
    model: 'fal-ai/birefnet',
    buildInput: (url) => ({ image_url: url, model: 'General Use (Light)', refine_foreground: true }),
  },
};

async function callFal(model: string, input: Record<string, unknown>): Promise<string> {
  const res = await fetch(`https://fal.run/${model}`, {
    method: 'POST',
    headers: {
      'Authorization': `Key ${FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) throw new Error(`fal.ai error: ${res.status}`);

  const data: FalResponse['data'] = await res.json();
  return data?.image?.url ?? data?.images?.[0]?.url ?? data?.output ?? '';
}

export async function processImage(
  imageUrl: string,
  toolOrPreset: string,
): Promise<ProcessResult> {
  const start = Date.now();
  const config = MODEL_CONFIGS[toolOrPreset] ?? MODEL_CONFIGS.skin;

  // No API key — simulate with a 2.5s delay and return original
  if (!FAL_KEY) {
    await new Promise((r) => setTimeout(r, 2500));
    return { editedUrl: imageUrl, processingMs: 2500, model: 'simulation' };
  }

  try {
    const editedUrl = await callFal(config.model, config.buildInput(imageUrl));
    return { editedUrl: editedUrl || imageUrl, processingMs: Date.now() - start, model: config.model };
  } catch (err) {
    console.error('[imageAI] Processing failed:', err);
    return { editedUrl: imageUrl, processingMs: Date.now() - start, model: 'fallback' };
  }
}
