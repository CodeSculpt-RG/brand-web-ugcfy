const { GoogleGenerativeAI } = require("@google/generative-ai");

async function main() {
  try {
    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const result = await ai.getGenerativeModel({ model: "embedding-001" });
    console.log("Got model embedding-001:", !!result);
    // Let's fetch models using fetch since AI SDK might not expose ListModels easily
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await res.json();
    console.log("Available embedding models:");
    data.models.forEach(m => {
      if (m.name.includes("embed")) {
        console.log("- " + m.name);
      }
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
