import React, { useState } from "react";
import Layout from "../../components/Layout";
import { FaTrash, FaEdit, FaPlus, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Addresses = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([
    {
      id: "addr_1",
      label: "Home",
      fullName: "John Doe",
      phone: "123456789",
      addressLine1: "Building 10, Street 5",
      addressLine2: "Near City Center",
      city: "Doha",
      state: "Doha",
      postalCode: "00000",
      country: "Qatar",
      isDefault: true,
    },
    {
      id: "addr_2",
      label: "Work",
      fullName: "John Doe",
      phone: "987654321",
      addressLine1: "Office Tower, West Bay",
      addressLine2: "",
      city: "Doha",
      state: "Doha",
      postalCode: "00000",
      country: "Qatar",
      isDefault: false,
    },
  ]);

  const [newAddress, setNewAddress] = useState({
    label: "",
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Qatar",
    isDefault: false,
  });

  const [editingId, setEditingId] = useState(null);
  const addAddress = () => {
    console.log("ADD ADDRESS DATA:", newAddress);

    if (!newAddress.fullName || !newAddress.phone) return;

    if (newAddress.isDefault) {
      setAddresses((prev) =>
        prev.map((addr) => ({ ...addr, isDefault: false })),
      );
    }

    setAddresses([
      ...addresses,
      {
        ...newAddress,
        id: Date.now().toString(),
      },
    ]);

    resetForm();
  };

  const startEdit = (address) => {
    setEditingId(address.id);
    setNewAddress(address);
  };

  const updateAddress = () => {
    console.log("UPDATE ADDRESS DATA:", newAddress);

    setAddresses(
      addresses.map((addr) => (addr.id === editingId ? newAddress : addr)),
    );

    setEditingId(null);
    resetForm();
  };

  const deleteAddress = (id) => {
    console.log("DELETE ADDRESS ID:", id);

    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const setDefault = (id) => {
    console.log("SET DEFAULT ADDRESS:", id);

    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    );
  };

  const resetForm = () => {
    setNewAddress({
      label: "",
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Qatar",
      isDefault: false,
    });
  };


  return (
    <Layout>
      <div className="p-4">
        <div className="flex justify-between items-baseline">
          <h2 className="text-2xl font-bold text-purple-800 mb-6">
            Cart Management
          </h2>

          <button
            className="p-2 bg-purple-400 rounded-md text-white"
            onClick={() => navigate("/add/address")}
          >
            Add New
          </button>
        </div>

    
        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-lg font-semibold text-purple-700 mb-4">
            Saved Addresses
          </h3>

          {addresses.length === 0 ? (
            <p className="text-purple-600">No addresses available</p>
          ) : (
            <div className="space-y-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="flex items-center justify-between bg-purple-50 p-4 rounded-lg border"
                >
                  <div>
                    <h4 className="font-semibold text-purple-800">
                      {addr.label}{" "}
                      {addr.isDefault && (
                        <span className="text-green-600 text-sm">
                          (Default)
                        </span>
                      )}
                    </h4>

                    <p className="text-purple-600">{addr.fullName}</p>
                    <p className="text-purple-600">{addr.phone}</p>

                    <p className="text-sm">
                      {addr.addressLine1}, {addr.addressLine2}
                    </p>

                    <p className="text-sm">
                      {addr.city}, {addr.state}
                    </p>

                    <p className="text-sm">
                      {addr.country} - {addr.postalCode}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefault(addr.id)}
                        className="bg-green-100 text-green-700 p-2 rounded"
                      >
                        <FaCheck />
                      </button>
                    )}

                    <button
                      onClick={() => startEdit(addr)}
                      className="bg-purple-100 text-purple-700 p-2 rounded"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="bg-red-100 text-red-600 p-2 rounded"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Addresses;
