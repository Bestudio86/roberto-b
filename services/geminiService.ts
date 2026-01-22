
import { GoogleGenAI } from "@google/genai";
import { Category, Task } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getMapsInfo(location: string, userLocation?: { lat: number; lng: number }) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Trova la posizione esatta e i link di Google Maps per: ${location}. Fornisci dettagli utili per arrivarci.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: userLocation ? {
              latitude: userLocation.lat,
              longitude: userLocation.lng
            } : undefined
          }
        }
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const mapsLink = groundingChunks.find((chunk: any) => chunk.maps?.uri)?.maps?.uri;
    
    return {
      text: response.text,
      mapsUrl: mapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
    };
  } catch (error) {
    console.error("Errore Gemini Maps:", error);
    return {
      text: "Non è stato possibile recuperare dettagli precisi da Maps.",
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
    };
  }
}

export async function optimizeSchedule(tasks: Task[]) {
  if (tasks.length === 0) return null;

  const tasksList = tasks.map(t => `${t.title} presso ${t.location} (${t.category})`).join("\n");
  
  const prompt = `Ho i seguenti impegni oggi:\n${tasksList}\n\nAgisci come un assistente logistico esperto. Analizza queste attività e suggerisci l'ordine migliore per minimizzare gli spostamenti e risparmiare tempo. Considera le categorie (Lavoro, Casa, Corsi, Allenamento). Fornisci una risposta strutturata con suggerimenti pratici e un ordine consigliato.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }]
      }
    });

    return response.text;
  } catch (error) {
    console.error("Errore ottimizzazione AI:", error);
    return "Non è stato possibile generare un piano ottimizzato al momento.";
  }
}
