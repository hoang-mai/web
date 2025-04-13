// components/LocationSelector.tsx
import { useState, useEffect } from "react";
import addressData from "./addressData";

const LocationSelector = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Hồ Chí Minh");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [tab, setTab] = useState<"city" | "district" | "ward">("city");

  // Khôi phục địa chỉ đã chọn nếu có trong localStorage
    useEffect(() => {
        const saved = localStorage.getItem("userAddress");
        if (saved) {
        const { city, district, ward } = JSON.parse(saved);
        if (city) setSelectedCity(city);
        if (district) setSelectedDistrict(district);
        if (ward) setSelectedWard(ward);
        }
    }, []);
  

  const cities = Object.keys(addressData);
  const districts = selectedCity ? Object.keys(addressData[selectedCity]) : [];
  const wards =
    selectedCity && selectedDistrict
      ? addressData[selectedCity][selectedDistrict]
      : [];

  const options =
    tab === "city" ? cities : tab === "district" ? districts : wards;

  const handleSelect = (value: string) => {
    if (tab === "city") {
      setSelectedCity(value);
      setSelectedDistrict("");
      setSelectedWard("");
      setTab("district");
    } else if (tab === "district") {
      setSelectedDistrict(value);
      setSelectedWard("");
      setTab("ward");
    } else if (tab === "ward") {
      setSelectedWard(value);
      setShowModal(false);
    }
  };

  const getSelectedAddress = () => {
    if (selectedWard && selectedDistrict && selectedCity) {
      return `${selectedWard}, ${selectedDistrict}, ${selectedCity}`;
    }
    return selectedCity;
  };

  useEffect(() => {
    if (selectedCity && selectedDistrict && selectedWard) {
      const selectedAddress = {
        city: selectedCity,
        district: selectedDistrict,
        ward: selectedWard,
      };
      localStorage.setItem("userAddress", JSON.stringify(selectedAddress));
    }
  }, [selectedCity, selectedDistrict, selectedWard]);
  

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1 border px-3 py-1 rounded-full hover:shadow"
      >
        <img src="/icons/location.svg" alt="Location" className="w-4 h-4" />
        <span className="truncate max-w-[200px]">{getSelectedAddress()}</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-4 w-[500px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-2">Chọn địa chỉ nhận hàng</h2>
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setTab("city")}
                className={`px-4 py-1 rounded-full border ${
                  tab === "city" ? "bg-blue-500 text-white" : ""
                }`}
              >
                Tỉnh/TP
              </button>
              <button
                disabled={!selectedCity}
                onClick={() => setTab("district")}
                className={`px-4 py-1 rounded-full border ${
                  tab === "district" ? "bg-blue-500 text-white" : ""
                }`}
              >
                Quận/Huyện
              </button>
              <button
                disabled={!selectedDistrict}
                onClick={() => setTab("ward")}
                className={`px-4 py-1 rounded-full border ${
                  tab === "ward" ? "bg-blue-500 text-white" : ""
                }`}
              >
                Phường/Xã
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto scroll-smooth">
              {options.map((name) => (
                <button
                  key={name}
                  onClick={() => handleSelect(name)}
                  className="text-left px-3 py-2 hover:bg-gray-100 rounded"
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="text-right mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="text-blue-500 hover:underline"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
