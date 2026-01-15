import { GoogleGenAI } from "@google/genai";
import { Coordinates, KebabPlace, GroundingChunk } from "../types";

export const findKebabs = async (coords: Coordinates): Promise<KebabPlace[]> => {
  // Safe access to process.env.API_KEY
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables");
    throw new Error("API configuration missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find the absolute SINGLE best rated kebab or shawarma place near me (Lat: ${coords.latitude}, Lng: ${coords.longitude}). 
      I need the following details in this exact format:
      Name: [Name of Place]
      Address: [Street Address, City]
      Distance: [Approximate distance in km from my location, just the number and unit]
      Reason: [Short 1 sentence spicy description]
      
      If you find multiple good ones, just pick the #1 best one.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: coords.latitude,
              longitude: coords.longitude
            }
          }
        },
        temperature: 0.7,
      },
    });

    const candidate = response.candidates?.[0];
    const text = candidate?.content?.parts?.map(p => p.text).join('') || "";
    const chunks = candidate?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;

    const places: KebabPlace[] = [];

    // Robust parsing (Case insensitive, handles extra spaces)
    const nameMatch = text.match(/Name:\s*(.+)/i);
    const addressMatch = text.match(/Address:\s*(.+)/i);
    const distanceMatch = text.match(/Distance:\s*(.+)/i);
    const reasonMatch = text.match(/Reason:\s*(.+)/i);

    let uri = "";
    let name = nameMatch ? nameMatch[1].trim() : "Unknown Kebab";

    // Attempt to map back to a grounding chunk for the correct URI
    if (chunks && chunks.length > 0) {
      // Look for a map chunk that matches the extracted name
      const bestMatch = chunks.find(c => 
        c.maps && c.maps.title && name.toLowerCase().includes(c.maps.title.toLowerCase())
      );
      
      if (bestMatch && bestMatch.maps) {
          uri = bestMatch.maps.uri;
          name = bestMatch.maps.title; // Use official title
      } else {
          // Fallback: just use the first map chunk if we can't match names perfectly,
          // assuming the model talked about the first thing it found.
          const firstMap = chunks.find(c => c.maps);
          if (firstMap && firstMap.maps) {
             uri = firstMap.maps.uri;
          }
      }
    }

    if (name !== "Unknown Kebab") {
        places.push({
            id: 'target-1',
            name: name,
            address: addressMatch ? addressMatch[1].trim() : "",
            distance: distanceMatch ? distanceMatch[1].trim() : "N/A",
            description: reasonMatch ? reasonMatch[1].trim() : "Highly recommended.",
            uri: uri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + (addressMatch ? addressMatch[1] : ''))}`
        });
    }

    return places;

  } catch (error) {
    console.error("Error fetching kebabs:", error);
    throw error;
  }
};