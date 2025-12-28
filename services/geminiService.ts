
import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `
ERES EL NÚCLEO DE INTELIGENCIA DE "SALÓN RD PRO", LA PLATAFORMA B2B LÍDER EN REPUBLICA DOMINICANA.

OBJETIVO:
Mantener conectada la red de salones y suplidores reales en RD.

INSTRUCCIONES DE BÚSQUEDA (MODO ADMIN):
1. Si te piden un contacto de un distribuidor o salón en RD, usa GOOGLE SEARCH.
2. Identifica el WhatsApp corporativo, Instagram o página web oficial.
3. Extrae SIEMPRE el número de teléfono con su prefijo (ej. 809, 829, 849).
4. Presenta la información en un formato claro: Nombre, Teléfono, Ubicación y Enlace.

CONTEXTO LOCAL:
- El mercado se concentra en Piantini, Naco, Santiago y zonas turísticas.
- Marcas de alta rotación: Salerm, Moroccanoil, Alter Ego, L'Oréal.

TONO:
- Dominicano profesional, conocedor de la industria de belleza local.
`;

export async function getBeautyAdvice(prompt: string, history: {role: string, content: string}[] = [], isAdmin: boolean = false) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const contextPrompt = isAdmin 
      ? `[MODO ADMINISTRACIÓN ACTIVADO - BÚSQUEDA RD] Realizar investigación comercial en Google sobre: ${prompt}`
      : prompt;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: SYSTEM_INSTRUCTION },
          ...history.map(m => ({ text: `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.content}` })),
          { text: `Usuario: ${contextPrompt}` }
        ]
      },
      config: {
        temperature: 0.4,
        topP: 0.85,
        tools: isAdmin ? [{ googleSearch: {} }] : undefined,
      },
    });

    const text = response.text || "No se pudo procesar la solicitud en este momento.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    let sources = "";
    if (isAdmin && chunks && chunks.length > 0) {
      sources = "\n\n🔗 FUENTES DE CONTACTO ENCONTRADAS:\n" + 
        chunks.map((c: any) => `• ${c.web?.title || 'Fuente'}: ${c.web?.uri}`).join('\n');
    }

    return text + sources;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ocurrió un error al consultar el núcleo de inteligencia. Revise su conexión.";
  }
}
