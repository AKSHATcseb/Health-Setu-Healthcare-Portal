const express = require("express");
const { body, validationResult } = require("express-validator");
const HospitalRequest = require("../models/HospitalRequest");
const Hospital = require("../models/HospitalDetails");
const User = require("../models/Registeration");
const Machine = require("../models/Machine");
const { sendMail, buildRejectionEmail, buildChangesRequestedEmail, buildAcceptanceEmail } = require("../services/email.service");
const { requireAuth } = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

function generateSlotsFromTimings(timings) {
  const slots = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const formattedDate = date.toISOString().split("T")[0];

    timings.forEach((time) => {
      slots.push({
        date: formattedDate,
        startTime: time.start,   // ✅ string
        endTime: time.end,       // ✅ new field
        availability_status: "available",
      });
    });
  }

  return slots;
}

// admin role guard
router.use(async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("role email");
    if (!user) return res.status(401).json({ message: "Unauthorized: user not found" });

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: admin role required" });
    }

    req.user.role = user.role;
    req.user.email = user.email;

    next();
  } catch (err) {
    console.error("Admin guard error:", err);
    return res.status(500).json({ message: "Server error in auth guard" });
  }
});

/**
 * GET /api/admin/requests?status=&search=&page=&limit=
 */
router.get("/requests", async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const q = {};
    if (status) q.status = status;
    if (search) {
      q.$or = [
        { hospitalName: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { registrationNumber: new RegExp(search, "i") },
      ];
    }
    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const data = await HospitalRequest.find(q).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const total = await HospitalRequest.countDocuments(q);
    res.json({ ok: true, data, meta: { total, page: Number(page), limit: Number(limit) } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list requests" });
  }
});

/**
 * GET /api/admin/requests/:id
 */
router.get("/requests/:id", async (req, res) => {
  try {
    const doc = await HospitalRequest.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true, data: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch request" });
  }
});

/**
 * PATCH /api/admin/requests/:id/status
 * body: { status: "accepted"|"rejected"|"changes_requested", note?: string }
 */
router.patch(
  "/requests/:id/status",
  body("status").isIn(["accepted", "rejected", "changes_requested"]),
  body("note").optional().isString(),

  async (req, res) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return res.status(400).json({ errors: validation.array() });
    }

    const { status, note } = req.body;

    try {
      const doc = await HospitalRequest.findById(req.params.id);
      if (!doc) {
        return res.status(404).json({ error: "Request not found" });
      }

      /* ---------------- UPDATE REQUEST STATUS ---------------- */
      doc.status = status;
      doc.adminNote = note || "";
      await doc.save();

      let emailSent = false;
      let emailError = null;

      /* ================= ACCEPTED ================= */
      if (status === "accepted") {
        /* ---------- CHECK DUPLICATE HOSPITAL ---------- */
        const orClauses = [];
        if (doc.registrationNumber)
          orClauses.push({ registrationNumber: doc.registrationNumber });
        if (doc.email) orClauses.push({ email: doc.email });

        const exists = orClauses.length
          ? await Hospital.findOne({ $or: orClauses })
          : null;

        if (exists) {
          console.warn("Hospital already exists:", exists._id);
        } else {
          /* ---------- CREATE HOSPITAL ---------- */
          const hospitalPayload = {
            hospitalName: doc.hospitalName || "",
            email: doc.email || "",
            phone: doc.phone || "",
            registrationNumber: doc.registrationNumber || "",

            is24x7: !!doc.is24x7,
            operatingHours: doc.operatingHours || {},

            slots: {
              numberOf4HrsSessionsPerDay:
                doc?.slots?.numberOf4HrsSessionsPerDay ?? 0,
              numberOf6HrsSessionsPerDay:
                doc?.slots?.numberOf6HrsSessionsPerDay ?? 0,

              firstStart4h: doc?.slots?.firstStart4h || "09:00",
              firstStart6h: doc?.slots?.firstStart6h || "09:00",

              slots4h: doc?.slots?.slots4h || [],
              slots6h: doc?.slots?.slots6h || [],
            },

            dialysisSeats:
              doc.dialysisSeats !== undefined && doc.dialysisSeats !== null
                ? Number(doc.dialysisSeats)
                : 0,

            dialysisType: doc.dialysisType || undefined,

            priceFor4Hrs:
              doc.priceFor4Hrs !== undefined && doc.priceFor4Hrs !== null
                ? Number(doc.priceFor4Hrs)
                : undefined,

            priceFor6Hrs:
              doc.priceFor6Hrs !== undefined && doc.priceFor6Hrs !== null
                ? Number(doc.priceFor6Hrs)
                : undefined,

            priceForPD:
              doc.priceForPD !== undefined && doc.priceForPD !== null
                ? Number(doc.priceForPD)
                : undefined,

            address: doc.address || "",

            latitude:
              doc.latitude !== undefined && doc.latitude !== null
                ? Number(doc.latitude)
                : null,

            longitude:
              doc.longitude !== undefined && doc.longitude !== null
                ? Number(doc.longitude)
                : null,

            accountHolderName: doc.accountHolderName || "",
            upiID: doc.upiID || "",
          };

          try {
            const createdHospital = await Hospital.create(hospitalPayload);

            // console.log("Hospital created:", createdHospital);


            /* ================= CREATE MACHINES ================= */

            console.log("number of machines for hospital:", createdHospital.dialysisSeats);
            const numberOfMachines = createdHospital.dialysisSeats || 0;

            // for (let i = 1; i <= numberOfMachines; i++) {
            //   const existing = await Machine.findOne({
            //     hospitalId: createdHospital._id,
            //     machineNumber: `M${i}`,
            //   });

            //   if (!existing) {
            //     await Machine.create({
            //       hospitalId: createdHospital._id,
            //       machineNumber: `M${i}`,
            //     });
            //     console.log(`Created machine M${i}`);
            //   } else {
            //     console.log(`Machine M${i} already exists`);
            //   }
            // }

            // const hospital = createdHospital;

            /* 🔥 extract timings from hospital */
            const seats = Number(createdHospital.dialysisSeats) || 0;

            const timings = [
              ...new Set([
                ...(createdHospital.slots?.slots4h || []),
                ...(createdHospital.slots?.slots6h || []),
              ]),
            ];

            console.log("Timings:", timings);

            if (timings.length === 0) {
              throw new Error("Hospital has no slot timings configured");
            }

            for (let i = 1; i <= seats; i++) {
              try {
                const existing = await Machine.findOne({
                  hospitalId: createdHospital._id,
                  machineNumber: `M${i}`,
                });

                if (!existing) {
                  const machine = await Machine.create({
                    hospitalId: createdHospital._id,
                    machineNumber: `M${i}`,
                    slots: generateSlotsFromTimings(timings),
                  });

                  console.log(`✅ Created machine ${machine.machineNumber}`);
                } else {
                  console.log(`⚠️ Machine M${i} already exists`);
                }
              } catch (err) {
                console.error(`❌ Error creating M${i}:`, err.message);
              }
            }

            console.log(`${numberOfMachines} machines created`);
          } catch (err) {
            console.error("Hospital/Machine creation failed:", err);
          }
        }

        /* ---------- SEND ACCEPTANCE EMAIL ---------- */
        if (doc.email) {
          try {
            const { subject, html, text } = buildAcceptanceEmail(
              doc.hospitalName,
              note
            );
            await sendMail(doc.email, subject, html, text);
            emailSent = true;
          } catch (emailErr) {
            emailError = emailErr.message;
          }
        } else {
          emailError = "No email present";
        }
      }

      /* ================= REJECTED ================= */
      else if (status === "rejected") {
        if (doc.email) {
          try {
            const { subject, html } = buildRejectionEmail(
              doc.hospitalName,
              note
            );
            await sendMail(doc.email, subject, html);
            emailSent = true;
          } catch (emailErr) {
            emailError = emailErr.message;
          }
        } else {
          emailError = "No email present";
        }
      }

      /* ================= CHANGES REQUESTED ================= */
      else if (status === "changes_requested") {
        if (doc.email) {
          try {
            const { subject, html } = buildChangesRequestedEmail(
              doc.hospitalName,
              note
            );
            await sendMail(doc.email, subject, html);
            emailSent = true;
          } catch (emailErr) {
            emailError = emailErr.message;
          }
        } else {
          emailError = "No email present";
        }
      }

      /* ================= RESPONSE ================= */
      return res.json({
        ok: true,
        data: doc,
        email: {
          to: doc.email || null,
          sent: emailSent,
          error: emailError,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update status" });
    }
  }
);

module.exports = router;