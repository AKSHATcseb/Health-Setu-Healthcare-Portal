const mongoose = require("mongoose");

const ragDocSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },

    embedding: {
      type: [Number],
      required: true,
      validate: {
        validator: (v) => v.length === 3072,
        message: "Embedding must be exactly 3072 dimensions",
      },
    },

    metadata: {
      type: {
        type: String,
        enum: ["api", "feature", "faq"],
        required: true,
      },
      module: {
        type: String,
        required: true,
        index: true,
      },
      route: { type: String }, // only for API docs
    },
  },
  {
    timestamps: true,
    collection: "rag_docs",
  }
);

// Index for metadata filtering in vector search
ragDocSchema.index({ "metadata.type": 1, "metadata.module": 1 });

module.exports = mongoose.model("RagDoc", ragDocSchema);
