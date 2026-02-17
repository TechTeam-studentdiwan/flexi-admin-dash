import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
// import { getUsers } from "../store/users/userThunks";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../store/user/userThunks";

const Customers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users, loading, error } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUsers({ page: 1, limit: 20, isAdmin: user._id }));
  }, [dispatch]);

  const handleOpenUser = (user) => {
    navigate(`/customers/${user._id}`, {
      state: { user },
    });
  };

  return (
    <Layout>
      <div className="">
        <h2 className="text-2xl font-bold text-purple-800 mb-6">Customers</h2>

        {loading && <p>Loading customers...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users?.map((user) => (
            <div
              key={user._id}
              onClick={() => handleOpenUser(user)}
              className="bg-white shadow-md rounded-xl p-5 cursor-pointer hover:shadow-lg transition border border-purple-100"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-purple-200 flex items-center justify-center text-xl font-bold text-purple-800 ">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div>
                  <h3 className="font-semibold text-purple-800 text-lg capitalize">
                    {user.name || "Unnamed User"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {user.email || "No Email"}
                  </p>
                </div>
              </div>

              <div className="mt-4 text-xs flex justify-between">
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {user.addresses?.length || 0} Addresses
                </span>

                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {user.wishlist?.length || 0} Wishlist
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Customers;
