/**
 * Vector retriever using MongoDB Atlas Vector Search.
 * Falls back to in-memory cosine similarity if Atlas Vector Search is unavailable.
 */

const RagDoc = require("../models/RagDoc");
const { generateEmbedding } = require("./embeddings");

const TOP_K = 5;
const MIN_SCORE = 0.5;

/**
 * Retrieves the top-K most relevant documents for a query.
 * Uses metadata filtering based on detected intent modules.
 *
 * @param {string} query - User query text
 * @param {string[]} modules - Intent modules for pre-filtering
 * @returns {Promise<Array<{ text: string, metadata: Object, score: number }>>}
 */
async function retrieveDocuments(query, modules = []) {
  const queryEmbedding = await generateEmbedding(query);

  // Try Atlas Vector Search first, fall back to in-memory
  try {
    const results = await atlasVectorSearch(queryEmbedding, modules);

    // If Atlas returns results, use them
    if (results.length >= 2) {
      return results;
    }

    // If filtered results are too few, retry without filter
    if (results.length < 2 && modules.length > 0) {
      const unfiltered = await atlasVectorSearch(queryEmbedding, []);
      if (unfiltered.length >= 2) {
        return unfiltered;
      }
    }

    // Atlas returned no/few results (index may not exist) — fall back to in-memory
    if (results.length < 2) {
      console.log("ℹ️ Atlas Vector Search returned few results, using in-memory fallback.");
      return inMemorySearch(queryEmbedding, modules);
    }

    return results;
  } catch (error) {
    console.warn(
      "⚠️ Atlas Vector Search unavailable, falling back to in-memory search:",
      error.message
    );
    return inMemorySearch(queryEmbedding, modules);
  }
}

/**
 * Atlas Vector Search using $vectorSearch aggregation.
 */
async function atlasVectorSearch(queryEmbedding, modules = []) {
  const filter = {};

  if (modules.length > 0) {
    filter["metadata.module"] = { $in: modules };
  }

  const pipeline = [
    {
      $vectorSearch: {
        index: "rag_vector_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: TOP_K * 10,
        limit: TOP_K,
        ...(Object.keys(filter).length > 0 ? { filter } : {}),
      },
    },
    {
      $project: {
        text: 1,
        metadata: 1,
        score: { $meta: "vectorSearchScore" },
        _id: 0,
      },
    },
  ];

  const results = await RagDoc.aggregate(pipeline);

  // Filter out low-score results
  return results.filter((r) => r.score >= MIN_SCORE);
}

/**
 * In-memory cosine similarity search (fallback).
 * Loads all docs from MongoDB and computes similarity in Node.js.
 */
async function inMemorySearch(queryEmbedding, modules = []) {
  const query = {};

  if (modules.length > 0) {
    query["metadata.module"] = { $in: modules };
  }

  const docs = await RagDoc.find(query).lean();

  if (docs.length === 0) {
    // If filtered yields nothing, try all docs
    if (modules.length > 0) {
      const allDocs = await RagDoc.find({}).lean();
      return scoreAndRank(allDocs, queryEmbedding);
    }
    return [];
  }

  return scoreAndRank(docs, queryEmbedding);
}

/**
 * Scores documents by cosine similarity and returns top-K.
 */
function scoreAndRank(docs, queryEmbedding) {
  const scored = docs.map((doc) => ({
    text: doc.text,
    metadata: doc.metadata,
    score: cosineSimilarity(queryEmbedding, doc.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.filter((r) => r.score >= MIN_SCORE).slice(0, TOP_K);
}

/**
 * Computes cosine similarity between two vectors.
 */
function cosineSimilarity(a, b) {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dotProduct / denom;
}

module.exports = { retrieveDocuments, cosineSimilarity };
