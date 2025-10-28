
import { GoogleGenAI, Modality } from "@google/genai";
import { ImageResult, StyleOption } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}

export const generateVisuals = async (description: string, style: StyleOption, perspectives: string[]): Promise<ImageResult[]> => {
  const generationPromises = perspectives.map(async (perspective) => {
    const prompt = `A highly detailed, artist-quality visualization of: "${description}".
    Style: ${style}.
    Perspective: ${perspective}.
    Artistic Direction: Maintain a consistent subject character and environment. Use soft, dramatic lighting and balanced composition. Ensure clean detail edges with no distortions. The image should feel like a piece of concept art.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
    if (imagePart && imagePart.inlineData) {
      const mimeType = imagePart.inlineData.mimeType;
      const src = `data:${mimeType};base64,${imagePart.inlineData.data}`;
      return { id: `gen-${Date.now()}-${Math.random()}`, src, perspective, mimeType };
    }
    throw new Error(`Failed to generate image for perspective: ${perspective}`);
  });

  return Promise.all(generationPromises);
};

export const editImage = async (base64ImageData: string, mimeType: string, editPrompt: string): Promise<{ src: string, mimeType: string }> => {
  const imagePart = {
    inlineData: {
      data: base64ImageData,
      mimeType,
    },
  };

  const textPart = {
    text: editPrompt,
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [imagePart, textPart],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  const editedImagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
  if (editedImagePart && editedImagePart.inlineData) {
     const newMimeType = editedImagePart.inlineData.mimeType;
     const newSrc = `data:${newMimeType};base64,${editedImagePart.inlineData.data}`;
     return { src: newSrc, mimeType: newMimeType };
  }

  throw new Error('Failed to edit image.');
};
