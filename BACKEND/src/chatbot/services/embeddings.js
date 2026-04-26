/**
 * Embedding service using Google text-embedding-004 model.
 * Generates 768-dimensional vectors for RAG document storage and query-time search.
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

const EMBEDDING_MODEL = "gemini-embedding-001";

let genAI = null;

/**
 * Lazily initializes the Google Generative AI client.
 */
function getClient() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

/**
 * Generates an embedding for a single text string.
 *
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>} 768-dimensional embedding vector
 */
async function generateEmbedding(text) {
  const client = getClient();
  const model = client.getGenerativeModel({ model: EMBEDDING_MODEL });

  const result = await model.embedContent(text);
  return result.embedding.values;
}

/**
 * Generates embeddings for multiple texts in batch.
 * Processes in batches of 100 to respect API limits.
 *
 * @param {string[]} texts - Array of texts to embed
 * @returns {Promise<number[][]>} Array of 768-dimensional embedding vectors
 */
async function generateEmbeddings(texts) {
  const client = getClient();
  const model = client.getGenerativeModel({ model: EMBEDDING_MODEL });

  const BATCH_SIZE = 100;
  const allEmbeddings = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);

    const result = await model.batchEmbedContents({
      requests: batch.map((text) => ({
        content: { parts: [{ text }] },
      })),
    });

    const embeddings = result.embeddings.map((e) => e.values);
    allEmbeddings.push(...embeddings);

    // Rate limiting: brief pause between batches
    if (i + BATCH_SIZE < texts.length) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log(
      `  📐 Embedded batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(texts.length / BATCH_SIZE)} (${allEmbeddings.length}/${texts.length})`
    );
  }

  return allEmbeddings;
}

module.exports = { generateEmbedding, generateEmbeddings };
