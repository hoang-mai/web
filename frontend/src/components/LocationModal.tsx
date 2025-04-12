// components/LocationModal.tsx
import { useState } from "react";
import addressData from "./addressData";

interface Props {
  onClose: () => void;
  onSelect: (city: string, district: string, ward: string) => void;
}

const LocationModal = ({ onClose, onSelect }: Props) => {
  const [tab, setTab] = useState<"city" | "district" | "ward">("city");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const cities = Object.keys(addressData);
  const districts = selectedCity ? Object.keys(addressData[selectedCity]) : [];
  const wards =
    selectedCity && selectedDistrict
      ? addressData[selectedCity][selectedDistrict]
      : [];

  const handleSelect = (value: string) => {
    if (tab === "city") {
      setSelectedCity(value);
      setSelectedDistrict(null);
      setTab("district");
    } else if (tab === "district") {
      setSelectedDistrict(value);
      setTab("ward");
    } else if (tab === "ward" && selectedCity && selectedDistrict) {
      onSelect(selectedCity, selectedDistrict, value);
      onClose();
    }
  };

  const options =
    tab === "city" ? cities : tab === "district" ? districts : wards;

  return (
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
        <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
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
          <button onClick={onClose} className="text-blue-500 hover:underline">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
