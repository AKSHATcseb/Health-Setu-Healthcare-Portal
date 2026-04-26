/**
 * Text chunker for RAG documents.
 * Splits text into chunks of 300–800 tokens (approx 4 chars/token)
 * with 50-token (~200 char) overlap.
 */

const MAX_CHUNK_CHARS = 3200; // ~800 tokens
const MIN_CHUNK_CHARS = 1200; // ~300 tokens
const OVERLAP_CHARS = 200; // ~50 tokens

/**
 * Converts a structured knowledge document into one or more text chunks.
 * Each chunk carries the original metadata.
 *
 * @param {Object} doc - Knowledge document (api, feature, or faq)
 * @returns {Array<{ text: string, metadata: Object }>}
 */
function chunkDocument(doc) {
  const text = documentToText(doc);
  const metadata = extractMetadata(doc);

  // If text fits in one chunk, return as-is
  if (text.length <= MAX_CHUNK_CHARS) {
    return [{ text, metadata }];
  }

  // Split into overlapping chunks
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = Math.min(start + MAX_CHUNK_CHARS, text.length);

    // Try to break at sentence boundary
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf(". ", end);
      const lastNewline = text.lastIndexOf("\n", end);
      const breakPoint = Math.max(lastPeriod, lastNewline);

      if (breakPoint > start + MIN_CHUNK_CHARS) {
        end = breakPoint + 1;
      }
    }

    chunks.push({
      text: text.slice(start, end).trim(),
      metadata,
    });

    // Move start forward with overlap
    start = end - OVERLAP_CHARS;
    if (start >= text.length) break;
  }

  return chunks;
}

/**
 * Converts a structured document into flat text for embedding.
 */
function documentToText(doc) {
  if (doc.type === "api") {
    return formatApiDoc(doc);
  } else if (doc.type === "feature") {
    return formatFeatureDoc(doc);
  } else if (doc.type === "faq") {
    return formatFaqDoc(doc);
  }
  return JSON.stringify(doc);
}

function formatApiDoc(doc) {
  const parts = [
    `API Endpoint: ${doc.route}`,
    `Module: ${doc.module}`,
    `Description: ${doc.description}`,
    `Authentication: ${doc.auth || "none"}`,
  ];

  if (doc.input && Object.keys(doc.input).length > 0) {
    parts.push(`Input Parameters: ${JSON.stringify(doc.input, null, 2)}`);
  }

  if (doc.output) {
    parts.push(`Response: ${JSON.stringify(doc.output, null, 2)}`);
  }

  if (doc.errors && doc.errors.length > 0) {
    parts.push(`Possible Errors:\n${doc.errors.map((e) => `  - ${e}`).join("\n")}`);
  }

  return parts.join("\n");
}

function formatFeatureDoc(doc) {
  const parts = [
    `Feature: ${doc.description}`,
    `Module: ${doc.module}`,
  ];

  if (doc.steps && doc.steps.length > 0) {
    parts.push(`Steps:\n${doc.steps.map((s, i) => `  ${i + 1}. ${s}`).join("\n")}`);
  }

  return parts.join("\n");
}

function formatFaqDoc(doc) {
  const parts = [
    `FAQ: ${doc.question}`,
    `Module: ${doc.module}`,
    `Answer: ${doc.answer}`,
  ];

  if (doc.relatedApi) {
    parts.push(`Related API: ${doc.relatedApi}`);
  }

  return parts.join("\n");
}

/**
 * Extracts metadata from a document for storage.
 */
function extractMetadata(doc) {
  const metadata = {
    type: doc.type,
    module: doc.module,
  };

  if (doc.route) {
    metadata.route = doc.route;
  }

  return metadata;
}

/**
 * Processes an array of documents into chunks.
 */
function chunkAllDocuments(documents) {
  const allChunks = [];

  for (const doc of documents) {
    const chunks = chunkDocument(doc);
    allChunks.push(...chunks);
  }

  return allChunks;
}

module.exports = { chunkDocument, chunkAllDocuments, documentToText };
