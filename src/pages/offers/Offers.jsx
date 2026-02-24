import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getOffers, deleteOffer } from "../../store/offers/offerThunks";
import Spinner from "../../components/Spinner";

const Offers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { offers, loading } = useSelector((state) => state.offers);

  useEffect(() => {
    dispatch(getOffers());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Delete this offer?")) {
      dispatch(deleteOffer(id));
    }
  };

  return (
    <Layout>
      <div className="mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Offers
          </h2>

          <button
            onClick={() => navigate("/add/offer")}
            className="px-5 py-2 bg-linear-to-r from-pink-500 to-purple-600 text-white rounded-xl shadow"
          >
            + Add Offer
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <Spinner color="black" />
            </div>
          ) : offers.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No offers found.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 text-sm text-gray-600">
                <tr>
                  <th className="p-4 text-left">Image</th>
                  <th className="p-4 text-center">Position</th>
                  <th className="p-4 text-center">Link</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {offers.map((offer) => (
                  <tr key={offer._id}>
                    <td className="p-4">
                      <img
                        src={offer.image}
                        alt="Offer"
                        className="h-16 w-28 object-cover rounded-lg border"
                      />
                    </td>

                    <td className="p-4 text-center">
                      {offer.position}
                    </td>
                    <td className="p-4 text-center">
                      {offer.link ? (
                        <a
                          href={offer.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 underline text-sm"
                        >
                          View Link
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          —
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right space-x-4">
                      <button
                        onClick={() =>
                          navigate(`/edit/offer/${offer._id}`, {
                            state: { offer },
                          })
                        }
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => handleDelete(offer._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Offers;