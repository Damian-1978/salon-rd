
import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Eres el "Asistente Pro SALÓN RD", un experto en cosmetología y estilismo profesional de alto nivel. 
Tu objetivo es ayudar a dueños de salones y estilistas a:
1. Elegir los mejores productos del catálogo según el tipo de cabello.
2. Sugerir combos de productos para maximizar rentabilidad en el salón.
3. Dar tips técnicos de aplicación de tintes, keratinas y tratamientos.
4. Responder dudas sobre inventario y precios (simulando que conoces el catálogo).

Sé amable, profesional y usa términos locales si es necesario (ej. "el blower", "el desrizado", "pelo procesado").
Siempre refuerza la exclusividad y calidad de nuestra plataforma.
No des consejos médicos; siempre profesional.
`;

export async function getBeautyAdvice(prompt: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "Lo siento, tuve un problema procesando tu consulta. ¿Puedes repetirla?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "No pude conectar con el servidor. ¿Tienes conexión a internet?";
  }
}
