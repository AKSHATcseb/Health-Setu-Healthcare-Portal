const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firebaseUid: {
            type: String,
            required: true,
            unique: true,
        },

        role: {
            type: String,
            enum: ["patient", "hospital_admin"],
            default: "patient",
        },

        name: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            sparse: true
        },

        email: {
            type: String,
            unique: true,
            sparse: true
        },


        age: {
            type: Number,
            // required: function () {
            //     return this.role === "patient";
            // },
        },


        weight: {
            type: Number,
            default: null
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },

        address: {
            street: String,
            city: String,
            state: String,
            pincode: String,
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },

            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true,
            },
        },

        medicalInfo: {
            bloodGroup: { type: String, default: null },
            dialysisType: {
                type: String,
                enum: ["hemodialysis", "peritoneal"],
                default: null,
            },
         },

        emergencyContact: {
            name: String,
            phone: String,
            relation: String,
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

// emergency person name, phone, relation
