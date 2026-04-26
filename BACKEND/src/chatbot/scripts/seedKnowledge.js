/**
 * Knowledge seeding script.
 * Generates embeddings for all knowledge documents and stores them in MongoDB.
 *
 * Usage: node src/chatbot/scripts/seedKnowledge.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../../config/db");
const RagDoc = require("../models/RagDoc");
const { apiDocuments, featureDocuments } = require("../data/knowledgeBase");
const { faqDocuments } = require("../data/faqData");
const { chunkAllDocuments } = require("../utils/chunker");
const { generateEmbeddings } = require("../services/embeddings");

async function seed() {
  console.log("🚀 Starting knowledge seeding...\n");

  // Connect to MongoDB
  await connectDB();

  // Step 1: Prepare all documents
  console.log("📋 Preparing documents...");

  const allDocuments = [...apiDocuments, ...featureDocuments, ...faqDocuments];
  console.log(`  Total raw documents: ${allDocuments.length}`);
  console.log(`    API docs:     ${apiDocuments.length}`);
  console.log(`    Feature docs: ${featureDocuments.length}`);
  console.log(`    FAQ docs:     ${faqDocuments.length}`);

  // Step 2: Chunk documents
  console.log("\n✂️ Chunking documents...");
  const chunks = chunkAllDocuments(allDocuments);
  console.log(`  Total chunks after processing: ${chunks.length}`);

  // Step 3: Generate embeddings
  console.log("\n📐 Generating embeddings (this may take a moment)...");
  const texts = chunks.map((c) => c.text);
  const embeddings = await generateEmbeddings(texts);
  console.log(`  Generated ${embeddings.length} embeddings`);

  // Validate dimensions
  for (let i = 0; i < embeddings.length; i++) {
    if (embeddings[i].length !== 3072) {
      console.error(
        `  ❌ Embedding ${i} has ${embeddings[i].length} dimensions (expected 3072)`
      );
      process.exit(1);
    }
  }
  console.log("  ✅ All embeddings validated (3072 dimensions)");

  // Step 4: Clear existing data
  console.log("\n🗑️ Clearing existing rag_docs collection...");
  await RagDoc.deleteMany({});
  console.log("  ✅ Cleared");

  // Step 5: Insert documents
  console.log("\n💾 Inserting documents into MongoDB...");
  const docsToInsert = chunks.map((chunk, i) => ({
    text: chunk.text,
    embedding: embeddings[i],
    metadata: chunk.metadata,
  }));

  await RagDoc.insertMany(docsToInsert);
  console.log(`  ✅ Inserted ${docsToInsert.length} documents into rag_docs`);

  // Step 6: Print summary
  console.log("\n" + "=".repeat(60));
  console.log("✅ SEEDING COMPLETE");
  console.log("=".repeat(60));

  // Count by type
  const typeCounts = {};
  const moduleCounts = {};
  for (const doc of docsToInsert) {
    typeCounts[doc.metadata.type] = (typeCounts[doc.metadata.type] || 0) + 1;
    moduleCounts[doc.metadata.module] =
      (moduleCounts[doc.metadata.module] || 0) + 1;
  }

  console.log("\n📊 Documents by type:");
  for (const [type, count] of Object.entries(typeCounts)) {
    console.log(`  ${type}: ${count}`);
  }

  console.log("\n📊 Documents by module:");
  for (const [module, count] of Object.entries(moduleCounts)) {
    console.log(`  ${module}: ${count}`);
  }

  // Step 7: Print Atlas Vector Search index definition
  console.log("\n" + "=".repeat(60));
  console.log("📌 ATLAS VECTOR SEARCH INDEX");
  console.log("=".repeat(60));
  console.log(
    "\nCreate a vector search index named 'rag_vector_index' on the 'rag_docs' collection:"
  );
  console.log(
    JSON.stringify(
      {
        fields: [
          {
            type: "vector",
            path: "embedding",
            numDimensions: 3072,
            similarity: "cosine",
          },
          {
            type: "filter",
            path: "metadata.type",
          },
          {
            type: "filter",
            path: "metadata.module",
          },
        ],
      },
      null,
      2
    )
  );

  console.log("\n🎉 Done! The chatbot knowledge base is ready.\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
