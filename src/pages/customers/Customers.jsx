import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../store/user/userThunks";

const Customers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users, loading, error } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user?._id) {
      dispatch(getUsers({ page: 1, limit: 20 }));
    }
  }, [dispatch, user]);

  const handleOpenUser = (selectedUser) => {
    navigate(`/customers/${selectedUser._id}`, {
      state: { user: selectedUser },
    });
  };

  const filteredUsers = users?.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Layout>
      <div className=" mx-auto  space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Customers
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              View and manage all registered users
            </p>
          </div>

          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl px-4 py-2 w-full md:w-72 focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg">{error}</div>
        )}

        {loading && (
          <div className="text-gray-500 animate-pulse">
            Loading customers...
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUsers?.map((customer) => (
            <div
              key={customer._id}
              onClick={() => handleOpenUser(customer)}
              className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold text-white shadow">
                  {customer.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-gray-800 capitalize group-hover:text-purple-600 transition">
                    {customer.name || "Unnamed User"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {customer.email || "No Email"}
                  </p>
                </div>
              </div>

              <div className="border-t my-5"></div>

              <div className="flex justify-between text-sm">
                <div>
                  <span className="font-semibold text-gray-800">
                    {customer.addresses?.length || 0}
                  </span>
                  <span className="text-gray-500 ml-1">Addresses</span>
                </div>

                <div>
                  <span className="font-semibold text-purple-600">
                    {customer.wishlist?.length || 0}
                  </span>
                  <span className="text-gray-500 ml-1">Wishlist</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Customers;
