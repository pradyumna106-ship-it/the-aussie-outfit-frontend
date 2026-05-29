import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import {
  ChevronLeft,
  MapPin,
} from "lucide-react";

import {
  updateAddress,
  createAddress,
} from "../api/user.api.js";
import { useAuth } from "../context/AuthContext";
export default function EditAddress() {

  const navigate = useNavigate();

  const { id } = useParams();
  const location = useLocation();
  const address = location.state?.address;
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [addressData, setAddressData] = useState({
    fullName: address?.fullName || "",
    phoneNumber: address?.phoneNumber || "",
    addressLine1: address?.addressLine1 || "",
    addressLine2: address?.addressLine2 || "",
    landmark: address?.landmark || "",
    city: address?.city || "",
    state: address?.state || "",
    country: address?.country || "India",
    postalCode: address?.postalCode || "",
    addressType: address?.addressType || "home",
    isDefault: address?.isDefault || false,
  });

  // HANDLE CHANGE
  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setAddressData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // UPDATE ADDRESS
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {
      if (id) {
        const res = await updateAddress(
        id,
        addressData
      );

      if (res.status === 200) {

        navigate("/profile");
      }

      } else {
        const payload = {
        userId: user?.id,
        ...addressData,
        }
        if (payload.userId === undefined) {
          delete payload.userId;
        }
        const res = await createAddress(payload);
        if (res.status === 201) {
          console.log("ADDRESS RESPONSE:", res.data);
          if (res.status === 201) {

          navigate("/checkout");
        }
      }
        

        
      }
      
    } catch (err) {

      console.log(err);
    }
  };
  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#f6f1e6] py-14 px-4">

      <div className="max-w-4xl mx-auto">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="
            flex items-center gap-2
            px-5 py-3
            rounded-2xl
            bg-[#2b241c]
            text-white
            hover:bg-[#1d1711]
            transition mb-8
          "
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {/* CARD */}
        <div
          className="
            bg-[#fffdf6]
            border border-[#d8c8ae]
            rounded-[32px]
            p-8 md:p-10
            shadow-sm
          "
        >

          {/* HEADING */}
          <div className="text-center mb-10">

            <div
              className="
                w-16 h-16
                rounded-full
                bg-[#255441]/10
                mx-auto
                flex items-center justify-center
                mb-5
              "
            >
              <MapPin className="w-8 h-8 text-[#255441]" />
            </div>

            {(id) ?
              (<h1 className="text-4xl font-bold text-[#1b1610]">
              Edit Address
            </h1>) : (<h1 className="text-4xl font-bold text-[#1b1610]">
              Add New Address
            </h1>)
            }
            

            <p className="text-[#635846] mt-3">
              Update your shipping address details
            </p>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* FULL NAME */}
              <div>

                <label className="block mb-2 font-medium text-[#2b241c]">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={addressData.fullName}
                  onChange={handleChange}
                  className="
                    w-full px-4 py-3
                    rounded-xl
                    border border-[#d6c7b2]
                    bg-white/70
                    outline-none
                    focus:ring-2
                    focus:ring-[#255441]
                  "
                />

              </div>

              {/* PHONE */}
              <div>

                <label className="block mb-2 font-medium text-[#2b241c]">
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phoneNumber"
                  value={addressData.phoneNumber}
                  onChange={handleChange}
                  className="
                    w-full px-4 py-3
                    rounded-xl
                    border border-[#d6c7b2]
                    bg-white/70
                    outline-none
                    focus:ring-2
                    focus:ring-[#255441]
                  "
                />

              </div>

              {/* ADDRESS LINE 1 */}
              <div className="md:col-span-2">

                <label className="block mb-2 font-medium text-[#2b241c]">
                  Address Line 1
                </label>

                <input
                  type="text"
                  name="addressLine1"
                  value={addressData.addressLine1}
                  onChange={handleChange}
                  className="
                    w-full px-4 py-3
                    rounded-xl
                    border border-[#d6c7b2]
                    bg-white/70
                    outline-none
                    focus:ring-2
                    focus:ring-[#255441]
                  "
                />

              </div>

              {/* ADDRESS LINE 2 */}
              <div className="md:col-span-2">

                <label className="block mb-2 font-medium text-[#2b241c]">
                  Address Line 2
                </label>

                <input
                  type="text"
                  name="addressLine2"
                  value={addressData.addressLine2}
                  onChange={handleChange}
                  className="
                    w-full px-4 py-3
                    rounded-xl
                    border border-[#d6c7b2]
                    bg-white/70
                    outline-none
                    focus:ring-2
                    focus:ring-[#255441]
                  "
                />

              </div>

              {/* LANDMARK */}
              <div>

                <label className="block mb-2 font-medium text-[#2b241c]">
                  Landmark
                </label>

                <input
                  type="text"
                  name="landmark"
                  value={addressData.landmark}
                  onChange={handleChange}
                  className="
                    w-full px-4 py-3
                    rounded-xl
                    border border-[#d6c7b2]
                    bg-white/70
                    outline-none
                    focus:ring-2
                    focus:ring-[#255441]
                  "
                />

              </div>

              {/* CITY */}
              <div>

                <label className="block mb-2 font-medium text-[#2b241c]">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={addressData.city}
                  onChange={handleChange}
                  className="
                    w-full px-4 py-3
                    rounded-xl
                    border border-[#d6c7b2]
                    bg-white/70
                    outline-none
                    focus:ring-2
                    focus:ring-[#255441]
                  "
                />

              </div>

              {/* STATE */}
              <div>

                <label className="block mb-2 font-medium text-[#2b241c]">
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={addressData.state}
                  onChange={handleChange}
                  className="
                    w-full px-4 py-3
                    rounded-xl
                    border border-[#d6c7b2]
                    bg-white/70
                    outline-none
                    focus:ring-2
                    focus:ring-[#255441]
                  "
                />

              </div>

              {/* POSTAL CODE */}
              <div>

                <label className="block mb-2 font-medium text-[#2b241c]">
                  Postal Code
                </label>

                <input
                  type="text"
                  name="postalCode"
                  value={addressData.postalCode}
                  onChange={handleChange}
                  className="
                    w-full px-4 py-3
                    rounded-xl
                    border border-[#d6c7b2]
                    bg-white/70
                    outline-none
                    focus:ring-2
                    focus:ring-[#255441]
                  "
                />

              </div>

              {/* ADDRESS TYPE */}
              <div>

                <label className="block mb-2 font-medium text-[#2b241c]">
                  Address Type
                </label>

                <select
                  name="addressType"
                  value={addressData.addressType}
                  onChange={handleChange}
                  className="
                    w-full px-4 py-3
                    rounded-xl
                    border border-[#d6c7b2]
                    bg-white/70
                    outline-none
                    focus:ring-2
                    focus:ring-[#255441]
                  "
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>

              </div>

            </div>

            {/* DEFAULT */}
            <div className="flex items-center gap-3">

              <input
                type="checkbox"
                name="isDefault"
                checked={addressData.isDefault}
                onChange={handleChange}
                className="w-5 h-5"
              />

              <label className="font-medium text-[#2b241c]">
                Set as Default Address
              </label>

            </div>

            {/* BUTTON */}
            <div className="flex justify-end">
              {
                id ? ( <button
                type="submit"
                className="
                  px-7 py-3
                  rounded-2xl
                  bg-[#255441]
                  text-white
                  font-semibold
                  hover:bg-[#1e4638]
                  transition
                "
              >
                Update Address
              </button> ) : ( <button
                type="submit"
                className="
                  px-7 py-3
                  rounded-2xl
                  bg-[#255441]
                  text-white
                  font-semibold
                  hover:bg-[#1e4638]
                  transition
                "
              >
                Add Address
              </button> )
              }
              

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}