import { useState, useEffect } from "react";

export default function LocationDetailsForm({ onChange }) {
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
  });

  const [isLocationSelected, setIsLocationSelected] = useState(false);

  /* ---------- HELPERS ---------- */

  const extractLatLng = (url) => {
    const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    return match
      ? { lat: Number(match[1]), lng: Number(match[2]) }
      : null;
  };

  const buildPayload = (data) => {
    const payload = {
      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
      },
      location: data.latitude && data.longitude
        ? {
          type: "Point",
          coordinates: [data.longitude, data.latitude], // 🔥 [lng, lat]
        }
        : null,
    };

    console.log("📍 Location Payload:", JSON.stringify(payload, null, 2));
    return payload;
  };

  const updateAll = (data) => {
    setFormData(data);
    const payload = buildPayload(data);
    onChange && onChange(payload);
  };

  /* ---------- HANDLERS ---------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateAll({ ...formData, [name]: value });
  };

  const handleMapLinkChange = (e) => {
    const coords = extractLatLng(e.target.value);
    if (!coords) return;

    updateAll({
      ...formData,
      latitude: coords.lat,
      longitude: coords.lng,
    });
  };

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateAll({
          ...formData,
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
        });

        setIsLocationSelected(true); // ✅ mark as selected
      },
      () => {
        alert("Location access denied");
      }
    );
  };


  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-slate-800">
        Location Details
      </h4>

      <button
        type="button"
        onClick={fetchCurrentLocation}
        className={`
    px-4 py-2 rounded-full text-sm font-medium transition
    ${isLocationSelected
            ? "bg-teal-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
  `}
      >
        📍 Use Current Location
      </button>


      <input
        name="street"
        placeholder="House No. / Street / Society"
        value={formData.street}
        onChange={handleChange}
        className="input"
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="input"
        />

        <input
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          className="input"
        />
      </div>

      <input
        name="pincode"
        placeholder="Pincode"
        value={formData.pincode}
        onChange={handleChange}
        className="input"
      />

      {/* ACTIONS */}
      <div className="flex flex-wrap gap-3">


        {/* <input
          type="text"
          placeholder="Paste Google Maps link"
          onChange={handleMapLinkChange}
          className="input"
        /> */}
      </div>

      {/* <p className="text-xs text-teal-700 bg-teal-50 px-3 py-2 rounded-lg">
        📌 Location will be saved using GPS / Google Maps
      </p> */}

      <style>{`
        .input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 14px;
          background: #f1f5f9;
          border: 1px solid transparent;
        }
        .input:focus {
          outline: none;
          background: white;
          border-color: #14b8a6;
        }
      `}</style>
    </div>
  );
}
