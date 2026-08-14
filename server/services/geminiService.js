const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

let ai = null;

const apiKey = process.env.GEMINI_API_KEY;
if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  ai = new GoogleGenAI({ apiKey: apiKey });
}

// Format the catalog into a dense string representation for the AI
function formatCatalogForAI(catalog) {
  return catalog.map(p => `
ID: ${p.id} | Name: ${p.name} | Category: ${p.category} | Price: ₹${p.price}
Specs: ${JSON.stringify(p.specs)}
Features: ${p.features.join(', ')}
Pros: ${p.pros.join(', ')}
Cons: ${p.cons.join(', ')}
Best For: ${p.bestFor}
`).join('\n---\n');
}

// Fallback matching logic if no API key is provided
function findMatchingProductsFallback(message, catalog) {
  const lowerMessage = message.toLowerCase();
  const keywords = lowerMessage.split(/\s+/).filter(word => word.length > 3);
  
  let matches = [...catalog];
  if (keywords.length > 0) {
    matches = matches.filter(p => {
      const pText = `${p.name} ${p.category} ${p.features.join(' ')} ${p.bestFor}`.toLowerCase();
      return keywords.some(kw => pText.includes(kw));
    });
  }
  return matches.slice(0, 3);
}

async function generateChatResponse(message, history = [], catalog = []) {
  if (!ai) {
    console.log("Using Basic Fallback (No Gemini API Key)");
    const recommended = findMatchingProductsFallback(message, catalog);
    
    let responseText = "⚠️ **Demo Mode Active: No Gemini API Key found.**\n\nTo unlock the full conversational AI capabilities, please add a `GEMINI_API_KEY` to the `.env` file.\n\nHere are some keyword matches I found locally:\n\n";
    
    if (recommended.length > 0) {
      recommended.forEach(p => {
        responseText += `- **${p.name}** (₹${p.price.toLocaleString()})\n`;
      });
    } else {
      responseText += "No matches found.";
    }

    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
    return { text: responseText };
  }

  try {
    const catalogDataString = formatCatalogForAI(catalog);
    
    const systemInstruction = `
You are ShopSmart AI, an expert, conversational shopping assistant. 
Your goal is to help the user discover, compare, and evaluate products based *only* on the provided catalog.

# Instructions
1. Be helpful, concise, and professional, like ChatGPT.
2. If the user asks about products, recommend the best matches from the catalog.
3. If they ask for comparisons, compare the specs, pros, and cons of the relevant products.
4. Always format your responses using Markdown.
   - Use **bold** for product names and important features.
   - Use bulleted lists for pros/cons or multiple features.
   - You can use tables for head-to-head comparisons if appropriate.
5. NEVER invent products, prices, or specs that are not in the catalog.
6. If the user's request is vague (e.g., "I need a laptop"), ask a follow-up question (e.g., "What's your budget and primary use case?").

# Product Catalog
${catalogDataString}
`;

    // Format history for the new GenAI SDK
    // The new SDK uses { role: "user" | "model", parts: [{ text: "..." }] }
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [...formattedHistory, { role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2, // Low temperature for factual consistency based on catalog
      }
    });

    return {
      text: response.text
    };

  } catch (error) {
    console.error("Gemini service error:", error);
    throw new Error("Failed to process chat with AI");
  }
}

module.exports = {
  generateChatResponse
};
