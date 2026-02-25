const Hospital = require("../models/Hospital");
const cache = require("../utils/cache");

/**
 * ✅ PATIENT HOSPITAL FILTER SEARCH (PRODUCTION READY)
 */
exports.getHospitalsForPatients = async (req, res) => {
  try {
    let {
      city,
      q,
      maxCost,
      session,
      emergency,
      minRating,
      available,
      sort,
      lat,
      lng,
      page,
      limit,
    } = req.query;

    // ---------------- DEFAULTS ----------------
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const skip = (page - 1) * limit;

    // ---------------- CACHE KEY ----------------
    const cacheKey = JSON.stringify(req.query);

    if (cache.has(cacheKey)) {
      return res.json({
        success: true,
        cached: true,
        ...cache.get(cacheKey),
      });
    }

    // ---------------- FILTER OBJECT ----------------
    let filter = {
      isActive: true,
      isVerified: true, // ✅ verified hospitals only
    };

    // ✅ Available machines filter
    if (available === "true") {
      filter.availableMachines = { $gt: 0 };
    }

    // ✅ City filter
    if (city) {
      filter["address.city"] = city;
    }

    // ✅ Emergency filter
    if (emergency === "true") {
      filter.emergencyServices = true;
    }

    // ✅ Rating filter
    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    // ✅ Keyword search
    if (q) {
      filter.name = { $regex: q, $options: "i" };
    }

    // ✅ Cost filter by session type
    if (maxCost && session) {
      if (session === "4") {
        filter.costPerSession4h = { $lte: Number(maxCost) };
      }
      if (session === "6") {
        filter.costPerSession6h = { $lte: Number(maxCost) };
      }
    }

    // ---------------- SORT LOGIC ----------------
    let sortQuery = {};

    if (sort === "rating") {
      sortQuery.rating = -1;
    }

    if (sort === "cheapest") {
      // Cheapest depends on session
      if (session === "6") {
        sortQuery.costPerSession6h = 1;
      } else {
        sortQuery.costPerSession4h = 1;
      }
    }

    // ---------------- GEO SEARCH ----------------
    if (sort === "nearest" && lat && lng) {
      const hospitals = await Hospital.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [Number(lng), Number(lat)],
            },
            distanceField: "distanceMeters",
            spherical: true,
            maxDistance: 20000, // 20km radius
            query: filter,
          },
        },

        // ✅ Pagination FIX
        { $skip: skip },
        { $limit: limit },

        // ✅ Select fields
        {
          $project: {
            name: 1,
            address: 1,
            rating: 1,
            emergencyServices: 1,
            availableMachines: 1,
            costPerSession4h: 1,
            costPerSession6h: 1,
            isVerified: 1,
            distanceKm: {
              $round: [{ $divide: ["$distanceMeters", 1000] }, 2],
            },
          },
        },
      ]);

      const response = {
        page,
        totalHospitals: hospitals.length,
        hospitals,
      };

      cache.set(cacheKey, response);

      return res.json({
        success: true,
        cached: false,
        ...response,
      });
    }

    // ---------------- NORMAL SEARCH ----------------
    const hospitalsQuery = Hospital.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .select(
        "name address rating emergencyServices availableMachines costPerSession4h costPerSession6h isVerified"
      )
      .lean(); // ✅ faster

    const hospitals = await hospitalsQuery;
    const total = await Hospital.countDocuments(filter);

    const response = {
      page,
      totalPages: Math.ceil(total / limit),
      totalHospitals: total,
      hospitals,
    };

    // ✅ Cache store
    cache.set(cacheKey, response);

    res.json({
      success: true,
      cached: false,
      ...response,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Hospital filter search failed",
      error: err.message,
    });
  }
};
