
export interface ImageResult {
  id: string;
  src: string;
  perspective: string;
  mimeType: string;
}

export type StyleOption = 'Realistic' | 'Sketch' | 'Surreal' | 'Cinematic' | 'Fantasy' | 'Line Art';

export const styleOptions: StyleOption[] = ['Realistic', 'Sketch', 'Surreal', 'Cinematic', 'Fantasy', 'Line Art'];

export const perspectives: string[] = [
  'Front View',
  'Side Angle View',
  'Close-up Shot',
  'Aerial View',
];
