import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation, useOutletContext } from "react-router-dom";
import { User, Mail, Phone, Lock, Camera, Upload, ChevronRight, ChevronLeft } from "lucide-react";
import { registerUser } from "../api/auth.api.js";
import { createUser, createAddress, getUserByUserId, updateUser } from "../api/user.api.js";
import { getCategories,getBrands } from "../api/product.api.js";
import {useAuth} from "../context/AuthContext";
// ===============================
// INDEXED DB HELPERS
// ===============================

const DB_NAME = "registerDB";
const STORE_NAME = "registerForm";
const DB_VERSION = 1;

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveFormToDB = async (data) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put({ id: "register-form", data });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

const getFormFromDB = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get("register-form");
    request.onsuccess = () => resolve(request.result?.data || null);
    request.onerror = () => reject(request.error);
  });
};

const clearFormDB = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete("register-form");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export default function Register() {
  const USER_ROLES = ["customer", "admin", "seller", "support"];
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const { id } = useParams();
  const location = useLocation();

  // FIX 1: Safe profile fallback — never null
  const profile = location.state?.profile ?? {};
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [showCamera, setShowCamera] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [createdUser, setCreatedUser] = useState(null);
  const userLoad = JSON.parse(localStorage.getItem("user"));
  //const { brands, categories } = useOutletContext();

  // FIX 2: Safe split — profile.fullName may be undefined
  const nameParts = profile.fullName?.split(" ") ?? [];
  const first = nameParts[0] ?? "";
  const last = nameParts.slice(1).join(" ") ?? "";
  const [mode, setMode] = useState(
    profile?.sizes?.footwear?.region || "UK/INDIA"
  );
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
        const loadProducts = async () => {
          try {
            const [resCategories, resBrands] = await Promise.all([getCategories(),getBrands()]);
            setCategories(resCategories.data.data || []);
            setBrands(resBrands.data.data || [])
            console.log("Brands: ",resBrands);
            console.log("Categories: ",resCategories);
          } catch (error) {
            console.error("Products Error:", error);
          }
        };
        loadProducts();
      }, []);

  const shoeSizeRanges = {
    "UK/INDIA": { min: 3, max: 10 },
    "US (Men)": { min: 4, max: 11 },
    "US (Women)": { min: 5, max: 12 },
    "EU": { min: 35, max: 48 },
    "CM": { min: 21.6, max: 28.5 },
  };

  const currentRange = shoeSizeRanges[mode];
    const [formData, setFormData] = useState({
    // USER COLLECTION
    email: userLoad?.email || "",
    phone: userLoad?.phone || "",
    roles: userLoad?.roles || ["customer"],
    password: "",
    confirmPassword: "",

    // PROFILE COLLECTION
    firstName: first || profile?.firstName || "",
    lastName: last || profile?.lastName || "",
    gender: profile?.gender || "",
    dateOfBirth: profile?.dateOfBirth
      ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
      : "",
    bio: profile?.bio || "",
    profileImage: profile?.profileImage || "",

    preferredCategories: profile?.preferredCategories || [],
    // FIX 3: preferredBrands — extract $oid strings if they are ObjectId objects
    preferredBrands: (profile?.preferredBrands || []).map((b) =>
      typeof b === "object" && b.$oid ? b.$oid : b
    ),
    favoriteColors: profile?.favoriteColors || [],

    sizes: {
      topWear: profile?.sizes?.topWear || "",
      bottomWear: profile?.sizes?.bottomWear || "",
      footwear: {
        region: profile?.sizes?.footwear?.region || "UK/INDIA",
        size: profile?.sizes?.footwear?.size || "",
      },
    },

    lifestylePreferences: {
      budgetRange: profile?.lifestylePreferences?.budgetRange || "",
      shoppingFrequency: profile?.lifestylePreferences?.shoppingFrequency || "",
    },
  });
  const [addressData, setAddressData] = useState({
    fullName: (first || profile?.firstName || "") + " " + (last || profile?.lastName || ""),
    phoneNumber:   formData?.phone || userLoad?.phone || "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
    addressType: "home",
    isDefault: false,
  });
  const handleToggleStep = (clickedStep) => {
      if (id) {
        setStep(clickedStep);
      }
    };
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;

    setAddressData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  useEffect(() => {
    // In edit mode: skip to step 2, skip IndexedDB restore
    if (id && profile) {
      if (profile.profileImage) setPreview(profile.profileImage);
      return;
    }
    
    // FIX 4: Only restore from IndexedDB in create mode
    const loadSavedForm = async () => {
      try {
        const savedData = await getFormFromDB();
        if (savedData) {
          setFormData(savedData);
          if (savedData.profileImage) setPreview(savedData.profileImage);
          if (savedData.firstName || savedData.lastName || savedData.bio) {
            setStep(2);
          }
        }
      } catch (err) {
        console.log("LOAD DB ERROR:", err);
      }
    };

    loadSavedForm();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setFormData((prev) => ({ ...prev, profileImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setShowCamera(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    streamRef.current = stream;
    setTimeout(() => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    }, 100);
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setShowCamera(false);
  };

  const handleCapture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg");
    setPreview(base64);
    setFormData((prev) => ({ ...prev, profileImage: base64 }));
    stopCamera();
  };

  const validateStep1 = () => {
    const { email, phone, password, confirmPassword } = formData;
    if (!email || !password) return "Email and password are required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Invalid email address";
    if (phone && !/^\d{10}$/.test(phone)) return "Phone must be 10 digits";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirmPassword) return "Passwords do not match";
    return "";
  };

  const validateStep2 = () => {
    const { firstName, lastName } = formData;
    if (!firstName || !lastName) return "First and last name are required";
    return "";
  };

  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const roles = checked
        ? [...prev.roles, value]
        : prev.roles.filter((r) => r !== value);
      return { ...prev, roles };
    });
  };
  const handleSaveAddress = async () => {
    try {
      const payload = {
        userId: createdUser?._id || userLoad?.id,
        ...addressData,
      }
      if (payload.userId === undefined) {
        delete payload.userId;
      }
      const res = await createAddress(payload);
      if (res.status === 201) {
        console.log("ADDRESS RESPONSE:", res.data);
      }
    } catch (err) {
      console.error(err);
    }
  }
  const handleNext = async () => {
    const err = validateStep1();
    if (err) {
      setError(err);
      return;
    }
    try {
      const payload = {
        email: formData.email,
        phone: formData.phone,
        roles: formData.roles,
        password: formData.password,
      };
      if(id) {
        const res = await updateUser(id, payload);
        if (res.status === 200) {
          console.log("REGISTER RESPONSE:", res.data);
          setCreatedUser(res.data.data);
          setStep(2);
        }
      } else {
        const res = await registerUser(payload);
        if (res.status === 201) {
          console.log("REGISTER RESPONSE:", res.data);
          setCreatedUser(res.data.data.user);
          login({
            token: res.data.data.accessToken,
            refreshToken: res.data.data.refreshToken,
            user: res.data.data.user
          })
          setStep(2);
        }
      }
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validateStep2();
    if (err) {
      setError(err);
      return;
    }

    try {
      // In create mode, createdUser must exist (set after step 1 registration)
      // if (!id && !createdUser?._id) {
      //   setError("Session error: please go back to step 1 and try again.");
      //   return;
      // }

      const profilePayload = {
        userId: userLoad?.id || createdUser._id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        profileImage: formData.profileImage,
        bio: formData.bio,
        preferredCategories: formData.preferredCategories,
        preferredBrands: formData.preferredBrands,
        favoriteColors: formData.favoriteColors,
        sizes: {
          topWear: formData.sizes.topWear,
          bottomWear: formData.sizes.bottomWear,
          footwear: {
            region: formData.sizes.footwear.region,
            size: Number(formData.sizes.footwear.size),
          },
        },
        lifestylePreferences: {
          budgetRange: formData.lifestylePreferences.budgetRange,
          shoppingFrequency: formData.lifestylePreferences.shoppingFrequency,
        },
      };

      // Remove userId key entirely if undefined (edit mode)
      if (profilePayload.userId === undefined) {
        delete profilePayload.userId;
      }

      console.log("PROFILE PAYLOAD:", profilePayload);

      if (!id) {
        // CREATE mode
        const res = await createUser(profilePayload);
        if (res.status === 201) {
          await clearFormDB();
          setStep(3);
        }
        console.log("CREATE RESPONSE:", res.data);
      } else {
        // EDIT mode
        const res = await updateUser(id, profilePayload);
        if (res.status === 200) {
          if (userLoad?.roles?.includes("customer")) {
            navigate("/profile");
          } else {
            navigate("/admin/profile");
          }
        }
      }
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || "Profile creation failed");
    }
  };

  const inputCls = `
    w-full h-12 pl-11 pr-4
    rounded-xl border border-black/20
    bg-white/70 outline-none
    text-sm text-[#2b241c]
    focus:border-[#255441] focus:ring-2 focus:ring-[#255441]/20
    placeholder:text-[#9a8f82]
    transition
  `;

  const uniqueSubCategories = [
    ...new Map(
      categories
        ?.flatMap((cat) => cat.subCategories || [])
        .map((sub) => [sub.slug, sub])
    ).values(),
  ];

  return (
    <div className="min-h-screen bg-[#f6f1e6] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-[#d1a36e]/80 rounded-[40px] p-8 shadow-xl">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#1b1610]">Create Account</h1>
          <p className="text-[#3d342b] text-sm mt-1">
            {step === 1 ? "Set up your login credentials" : "Complete your profile"}
          </p>
        </div>

        {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">

                {/* Step Circle */}
                <button
                  type="button"
                  onClick={() => handleToggleStep(s)}
                  disabled={!id}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    text-sm font-semibold transition

                    ${
                      step >= s
                        ? "bg-[#255441] text-white"
                        : "bg-white/40 text-[#3d342b]"
                    }

                    ${
                      id
                        ? "cursor-pointer hover:scale-105"
                        : "cursor-default"
                    }
                  `}
                >
                  {s}
                </button>

                {/* Line */}
                {s < 3 && (
                  <div
                    className={`
                      flex-1 h-0.5 mx-1 transition
                      ${
                        step > s
                          ? "bg-[#255441]"
                          : "bg-white/30"
                      }
                    `}
                  />
                )}
              </div>
            ))}

            {/* Step Label */}
            <span className="text-xs text-[#3d342b] ml-1">
              {step === 1
                ? "Credentials"
                : step === 2
                ? "Profile"
                : "Address"}
            </span>
          </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ── STEP 1: Credentials ── */}
          {step === 1 && (
            <>
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a6d5c]" />
                <input
                  type="email" name="email" placeholder="Email address"
                  value={formData.email} onChange={handleChange}
                  className={inputCls}
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a6d5c]" />
                <input
                  type="tel" name="phone" placeholder="Phone number (optional)"
                  value={formData.phone} onChange={handleChange}
                  className={inputCls}
                />
              </div>

              {/* Role */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium">Roles</label>
                <div className="flex flex-wrap gap-4">
                  {USER_ROLES.map((role) => (
                    <label key={role} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="roles"
                        value={role}
                        checked={formData.roles.includes(role)}
                        onChange={handleRoleChange}
                        className="w-4 h-4"
                      />
                      <span className="capitalize">{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a6d5c]" />
                <input
                  type="password" name="password" placeholder="Password (min 6 chars)"
                  value={formData.password} onChange={handleChange}
                  className={inputCls}
                />
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a6d5c]" />
                <input
                  type="password" name="confirmPassword" placeholder="Confirm password"
                  value={formData.confirmPassword} onChange={handleChange}
                  className={inputCls}
                />
              </div>

              {error && <p className="text-red-800 text-sm text-center">{error}</p>}

              <button
                type="button" onClick={handleNext}
                className="w-full h-12 bg-[#255441] text-white font-semibold rounded-xl hover:bg-[#1c4032] transition flex items-center justify-center gap-2"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* ── STEP 2: Profile ── */}
          {step === 2 && (
            <>
              {/* First + Last name row */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a6d5c]" />
                  <input
                    type="text" name="firstName" placeholder="First name"
                    value={formData.firstName} onChange={handleChange}
                    className={inputCls}
                  />
                </div>
                <div className="relative flex-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a6d5c]" />
                  <input
                    type="text" name="lastName" placeholder="Last name"
                    value={formData.lastName} onChange={handleChange}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Gender + DOB row */}
              <div className="flex gap-3">
                <select
                  name="gender" value={formData.gender} onChange={handleChange}
                  className={`${inputCls} pl-4 flex-1`}
                >
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <input
                  type="date" name="dateOfBirth"
                  value={formData.dateOfBirth} onChange={handleChange}
                  className={`${inputCls} pl-4 flex-1`}
                />
              </div>

              {/* Bio */}
              <textarea
                name="bio" placeholder="Short bio (optional)"
                value={formData.bio} onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-black/20 bg-white/70 outline-none text-sm text-[#2b241c] placeholder:text-[#9a8f82] focus:border-[#255441] focus:ring-2 focus:ring-[#255441]/20 transition resize-none"
              />

              <div>
                <label className="text-sm font-semibold text-[#2b241c]">
                  Preferred Categories
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {uniqueSubCategories.map((category) => {
                    const exists = formData.preferredCategories.includes(category.slug);
                    return (
                      <button
                        type="button"
                        key={category._id || category.slug}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            preferredCategories: exists
                              ? prev.preferredCategories.filter((c) => c !== category.slug)
                              : [...prev.preferredCategories, category.slug],
                          }));
                        }}
                        className={`
                          px-3 py-2 rounded-xl text-sm border transition
                          ${exists ? "bg-[#255441] text-white border-[#255441]" : "bg-white/60 border-black/10"}
                        `}
                      >
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-[#2b241c]">
                  Favorite Colors
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["Black", "Brown", "Olive Green", "Navy Blue", "White"].map((color) => (
                    <button
                      type="button"
                      key={color}
                      onClick={() => {
                        const exists = formData.favoriteColors.includes(color);
                        setFormData((prev) => ({
                          ...prev,
                          favoriteColors: exists
                            ? prev.favoriteColors.filter((c) => c !== color)
                            : [...prev.favoriteColors, color],
                        }));
                      }}
                      className={`
                        px-3 py-2 rounded-xl text-sm border transition
                        ${formData.favoriteColors.includes(color)
                          ? "bg-[#3d2c1d] text-white border-[#3d2c1d]"
                          : "bg-white/60 border-black/10"}
                      `}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <select
                  value={formData.sizes.footwear.region}
                  onChange={(e) => {
                    setMode(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      sizes: {
                        ...prev.sizes,
                        footwear: { ...prev.sizes.footwear, region: e.target.value },
                      },
                    }));
                  }}
                  className={`${inputCls} pl-4`}
                >
                  {Object.keys(shoeSizeRanges).map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>

                <select
                  value={formData.sizes.topWear}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sizes: { ...prev.sizes, topWear: e.target.value },
                    }))
                  }
                  className={`${inputCls} pl-4`}
                >
                  <option value="">Top Size</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>

                <select
                  value={formData.sizes.bottomWear}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sizes: { ...prev.sizes, bottomWear: e.target.value },
                    }))
                  }
                  className={`${inputCls} pl-4`}
                >
                  <option value="">Bottom Size</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>

                <input
                  type="number"
                  min={currentRange.min}
                  max={currentRange.max}
                  placeholder={`Shoe Size (${currentRange.min}-${currentRange.max})`}
                  value={formData.sizes.footwear.size}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sizes: {
                        ...prev.sizes,
                        footwear: { ...prev.sizes.footwear, size: e.target.value },
                      },
                    }))
                  }
                  className={`${inputCls} pl-4`}
                />
              </div>
              <select
                value={formData.lifestylePreferences.budgetRange}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    lifestylePreferences: {
                      ...prev.lifestylePreferences,
                      budgetRange: e.target.value,
                    },
                  }))
                }
                className={`${inputCls} pl-4`}
              >
                <option value="">Budget Range</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="premium">Premium</option>
                <option value="luxury">Luxury</option>
              </select>

              <select
                  value={formData.lifestylePreferences.shoppingFrequency}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lifestylePreferences: {
                        ...prev.lifestylePreferences,
                        shoppingFrequency: e.target.value,
                      },
                    }))
                  }
                  className={`${inputCls} pl-4`}
                >
                  <option value="">Shopping Frequency</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="occasionally">Occasionally</option>
                </select>
              {/* Profile Image */}
              <div className="flex flex-col items-center gap-3">
                {preview ? (
                  <img src={preview} alt="preview" className="w-20 h-20 rounded-full object-cover border-4 border-white/60" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/40 flex items-center justify-center">
                    <User className="w-8 h-8 text-[#7a6d5c]" />
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    type="button" onClick={() => fileRef.current.click()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/50 text-[#2b241c] text-sm hover:bg-white/70 transition"
                  >
                    <Upload className="w-4 h-4" /> Upload
                  </button>
                  <button
                    type="button" onClick={startCamera}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#255441] text-white text-sm hover:bg-[#1c4032] transition"
                  >
                    <Camera className="w-4 h-4" /> Camera
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
              </div>

              {/* Camera preview */}
              {showCamera && (
                <div className="flex flex-col items-center gap-2 bg-white/30 rounded-2xl p-3">
                  <video ref={videoRef} autoPlay className="w-full rounded-xl" />
                  <div className="flex gap-2">
                    <button type="button" onClick={handleCapture}
                      className="px-4 py-2 bg-[#255441] text-white text-sm rounded-xl hover:bg-[#1c4032] transition">
                      Capture
                    </button>
                    <button type="button" onClick={stopCamera}
                      className="px-4 py-2 bg-white/50 text-[#2b241c] text-sm rounded-xl hover:bg-white/70 transition">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {error && <p className="text-red-800 text-sm text-center">{error}</p>}

              <div className="flex gap-3">
                {/* FIX 6: Hide Back button in edit mode since step 1 is irrelevant */}
                {!id && (
                  <button
                    type="button" onClick={() => { setStep(1); setError(""); }}
                    className="flex-1 h-12 bg-white/40 text-[#2b241c] font-semibold rounded-xl hover:bg-white/60 transition flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 h-12 bg-[#3d2c1d] text-white font-semibold rounded-xl hover:bg-[#2a1f15] transition"
                >
                  {id ? "Save Changes" : "Register"}
                </button>
              </div>
            </>
          )}
            {/* ── STEP 3: Address ── */}
            <>
              {step === 3 && (
                <div className="space-y-6">

                  {/* Heading */}
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-[#2b241c]">
                      Address Details
                    </h2>

                    <p className="text-[#5b5147] mt-2">
                      Add your shipping or billing address
                    </p>
                  </div>

                  {/* Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Full Name */}
                    <div>
                      <label className="block mb-2 font-medium text-[#2b241c]">
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="fullName"
                        value={addressData.fullName}
                        onChange={handleAddressChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-[#d6c7b2] bg-white/70 outline-none focus:ring-2 focus:ring-[#7c5c3b]"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block mb-2 font-medium text-[#2b241c]">
                        Phone Number
                      </label>

                      <input
                        type="text"
                        name="phoneNumber"
                        value={addressData.phoneNumber}
                        onChange={handleAddressChange}
                        placeholder="9876543210"
                        className="w-full px-4 py-3 rounded-xl border border-[#d6c7b2] bg-white/70 outline-none focus:ring-2 focus:ring-[#7c5c3b]"
                      />
                    </div>

                    {/* Address Line 1 */}
                    <div className="md:col-span-2">
                      <label className="block mb-2 font-medium text-[#2b241c]">
                        Address Line 1
                      </label>

                      <input
                        type="text"
                        name="addressLine1"
                        value={addressData.addressLine1}
                        onChange={handleAddressChange}
                        placeholder="House No, Street Name"
                        className="w-full px-4 py-3 rounded-xl border border-[#d6c7b2] bg-white/70 outline-none focus:ring-2 focus:ring-[#7c5c3b]"
                      />
                    </div>

                    {/* Address Line 2 */}
                    <div className="md:col-span-2">
                      <label className="block mb-2 font-medium text-[#2b241c]">
                        Address Line 2
                      </label>

                      <input
                        type="text"
                        name="addressLine2"
                        value={addressData.addressLine2}
                        onChange={handleAddressChange}
                        placeholder="Apartment, Suite, etc."
                        className="w-full px-4 py-3 rounded-xl border border-[#d6c7b2] bg-white/70 outline-none focus:ring-2 focus:ring-[#7c5c3b]"
                      />
                    </div>

                    {/* Landmark */}
                    <div>
                      <label className="block mb-2 font-medium text-[#2b241c]">
                        Landmark
                      </label>

                      <input
                        type="text"
                        name="landmark"
                        value={addressData.landmark}
                        onChange={handleAddressChange}
                        placeholder="Near City Mall"
                        className="w-full px-4 py-3 rounded-xl border border-[#d6c7b2] bg-white/70 outline-none focus:ring-2 focus:ring-[#7c5c3b]"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block mb-2 font-medium text-[#2b241c]">
                        City
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={addressData.city}
                        onChange={handleAddressChange}
                        placeholder="Bangalore"
                        className="w-full px-4 py-3 rounded-xl border border-[#d6c7b2] bg-white/70 outline-none focus:ring-2 focus:ring-[#7c5c3b]"
                      />
                    </div>

                    {/* State */}
                    <div>
                      <label className="block mb-2 font-medium text-[#2b241c]">
                        State
                      </label>

                      <input
                        type="text"
                        name="state"
                        value={addressData.state}
                        onChange={handleAddressChange}
                        placeholder="Karnataka"
                        className="w-full px-4 py-3 rounded-xl border border-[#d6c7b2] bg-white/70 outline-none focus:ring-2 focus:ring-[#7c5c3b]"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block mb-2 font-medium text-[#2b241c]">
                        Country
                      </label>

                      <input
                        type="text"
                        name="country"
                        value={addressData.country}
                        onChange={handleAddressChange}
                        placeholder="India"
                        className="w-full px-4 py-3 rounded-xl border border-[#d6c7b2] bg-white/70 outline-none focus:ring-2 focus:ring-[#7c5c3b]"
                      />
                    </div>

                    {/* Postal Code */}
                    <div>
                      <label className="block mb-2 font-medium text-[#2b241c]">
                        Postal Code
                      </label>

                      <input
                        type="text"
                        name="postalCode"
                        value={addressData.postalCode}
                        onChange={handleAddressChange}
                        placeholder="560001"
                        className="w-full px-4 py-3 rounded-xl border border-[#d6c7b2] bg-white/70 outline-none focus:ring-2 focus:ring-[#7c5c3b]"
                      />
                    </div>

                    {/* Address Type */}
                    <div>
                      <label className="block mb-2 font-medium text-[#2b241c]">
                        Address Type
                      </label>

                      <select
                        name="addressType"
                        value={addressData.addressType}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 rounded-xl border border-[#d6c7b2] bg-white/70 outline-none focus:ring-2 focus:ring-[#7c5c3b]"
                      >
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Default Address */}
                    <div className="flex items-center gap-3 mt-8">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={addressData.isDefault}
                        onChange={(e) =>
                          setAddressData({
                            ...addressData,
                            isDefault: e.target.checked,
                          })
                        }
                        className="w-5 h-5"
                      />

                      <label className="text-[#2b241c] font-medium">
                        Set as Default Address
                      </label>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/40 hover:bg-white/60 transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-[#2b241c] text-white font-semibold hover:bg-[#1d1711] transition"
                      onClick={handleSaveAddress}
                    >
                      Save Address
                    </button>
                  </div>
                </div>
              )}
            </>
          
        </form>

        <div className="text-center mt-5">
          <Link to="/login" className="text-[#0055cc] text-sm hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}