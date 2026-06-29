const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");

async function main() {
  try {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: process.env.GEMINI_API_KEY
    });
    const res = await embeddings.embedQuery("Hello world");
    console.log("Success! Dimension:", res.length);
  } catch (err) {
    console.error("Error with text-embedding-004:", err.message);
  }
}

main();
