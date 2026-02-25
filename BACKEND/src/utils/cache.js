const NodeCache = require("node-cache");

const cache = new NodeCache({
  stdTTL: 60, // 1 min cache
});

module.exports = cache;
