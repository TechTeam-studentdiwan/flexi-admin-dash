import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/Layout";
import {
  getAllOrders,
  updateOrderByAdminThunk,
} from "../../store/orders/ordersThunks";
import SideDrawer from "../../components/SideDrawer";
import { usePopup } from "../../components/PopupMessage/PopupContext";
import Spinner from "../../components/Spinner";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";

const Orders = () => {
  const dispatch = useDispatch();
  const { popMessage } = usePopup();
  const { orders, loading, pagination } = useSelector((state) => state.orders);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
  });

  const [updateData, setUpdateData] = useState({
    orderStatus: "",
    paymentStatus: "",
    estimatedDelivery: "",
  });

  const barcodeSvgRef = useRef(null);
  const [qrDataUrl, setQrDataUrl] = useState("");

  const TRACKING_BASE = "https://backend.sahibawears.com/orders/track";

  useEffect(() => {
    if (!selectedOrder) return;

    // Generate barcode
    if (barcodeSvgRef.current) {
      try {
        JsBarcode(barcodeSvgRef.current, String(selectedOrder.orderNumber || selectedOrder._id.slice(-10)), {
          format: "CODE128",
          width: 2,
          height: 56,
          displayValue: true,
          fontSize: 13,
          margin: 6,
          background: "#ffffff",
          lineColor: "#000000",
        });
      } catch (e) {
        console.error("Barcode error", e);
      }
    }

    // Generate QR code pointing to the public tracking URL
    const trackingUrl = `${TRACKING_BASE}/${selectedOrder.orderNumber}`;
    QRCode.toDataURL(trackingUrl, {
      width: 180,
      margin: 1,
      color: { dark: "#471755", light: "#ffffff" },
      errorCorrectionLevel: "M",
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR error", err));
  }, [selectedOrder]);

  const printOrderSticker = useCallback(async () => {
    if (!selectedOrder) return;

    const addr = selectedOrder.shippingAddress || {};
    const trackingUrl = `${TRACKING_BASE}/${selectedOrder.orderNumber}`;

    // Build address string for Qatar format
    const addrParts = addr.addressType === "villa"
      ? [`Villa ${addr.villaNo}`, `Street ${addr.streetNo}`, `Zone ${addr.zoneNo}`]
      : [`Building ${addr.buildingNo}`, `Floor ${addr.floorNo}`, `Room ${addr.roomNo}`, `Street ${addr.streetNo}`, `Zone ${addr.zoneNo}`];
    const addrLine = [...addrParts, addr.city, addr.country].filter(Boolean).join(", ");

    // Generate high-res QR for print
    let printQr = qrDataUrl;
    try {
      printQr = await QRCode.toDataURL(trackingUrl, {
        width: 300,
        margin: 1,
        color: { dark: "#471755", light: "#ffffff" },
        errorCorrectionLevel: "H",
      });
    } catch (_) {}

    // Build barcode SVG string
    const barcodeVal = String(selectedOrder.orderNumber || selectedOrder._id.slice(-10));
    const barcodeSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    try {
      JsBarcode(barcodeSvg, barcodeVal, {
        format: "CODE128", width: 2.2, height: 60,
        displayValue: true, fontSize: 13, margin: 4,
        background: "#ffffff", lineColor: "#000",
        xmlDocument: document,
      });
    } catch (_) {}

    const itemsHTML = (selectedOrder.items || []).map((item) => `
      <tr>
        <td class="item-name">${item.name}<span class="item-size"> — ${item.size}</span></td>
        <td class="item-qty">×${item.quantity}</td>
        <td class="item-price">QAR ${(item.discountPrice || item.price).toFixed(2)}</td>
      </tr>`).join("");

    const estimatedStr = selectedOrder.estimatedDelivery
      ? new Date(selectedOrder.estimatedDelivery).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      : "—";

    const statusColors = {
      pending: "#F59E0B", confirmed: "#10B981", processing: "#3B82F6",
      shipped: "#0EA5E9", delivered: "#059669", cancelled: "#EF4444",
    };
    const sc = statusColors[selectedOrder.orderStatus] || "#6B7280";
    const statusLabel = (selectedOrder.orderStatus || "").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Parcel Sticker — #${selectedOrder.orderNumber}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter',Arial,sans-serif;background:#fff;width:100mm;margin:0 auto}
  @media print{
    @page{size:100mm 150mm;margin:0}
    body{width:100mm;height:150mm;overflow:hidden}
    .no-print{display:none!important}
  }

  /* ── Header ── */
  .header{background:linear-gradient(135deg,#471755 0%,#7c3aed 100%);padding:10px 12px 8px;color:#fff;text-align:center}
  .store-name{font-size:18px;font-weight:800;letter-spacing:.5px}
  .store-sub{font-size:8px;opacity:.75;letter-spacing:.3px;margin-top:1px}
  .order-num{font-size:20px;font-weight:800;margin-top:5px;letter-spacing:1px}
  .status-pill{display:inline-block;margin-top:5px;padding:3px 10px;border-radius:12px;font-size:9px;font-weight:700;letter-spacing:.4px;border:1.5px solid}

  /* ── Body ── */
  .body{padding:8px 10px}

  /* ── QR + Barcode row ── */
  .codes-row{display:flex;align-items:center;gap:10px;margin-bottom:8px}
  .qr-wrap{flex-shrink:0;text-align:center}
  .qr-wrap img{width:72px;height:72px;display:block;border:2px solid #e9d5ff;border-radius:6px;padding:2px}
  .qr-label{font-size:7px;color:#7c3aed;font-weight:700;margin-top:2px;text-transform:uppercase;letter-spacing:.3px;text-align:center}
  .barcode-wrap{flex:1;text-align:center;overflow:hidden}
  .barcode-wrap svg{max-width:100%;height:52px}

  /* ── Divider ── */
  .dashed{border-top:1px dashed #d1d5db;margin:6px 0}

  /* ── Address ── */
  .section-label{font-size:7.5px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#9ca3af;margin-bottom:3px}
  .cust-name{font-size:13px;font-weight:800;color:#111}
  .cust-phone{font-size:10px;color:#555;margin-top:1px}
  .cust-addr{font-size:9px;color:#555;margin-top:2px;line-height:1.4}

  /* ── Items table ── */
  table{width:100%;border-collapse:collapse;font-size:9px}
  .item-name{color:#111;font-weight:600;padding:3px 0}
  .item-size{color:#777;font-weight:400}
  .item-qty{color:#555;text-align:center;padding:3px 4px}
  .item-price{text-align:right;color:#471755;font-weight:700;padding:3px 0}

  /* ── Summary ── */
  .sum-row{display:flex;justify-content:space-between;font-size:9px;color:#555;margin:2px 0}
  .sum-total{display:flex;justify-content:space-between;font-size:13px;font-weight:800;color:#471755;margin-top:4px;padding-top:4px;border-top:2px solid #471755}

  /* ── Footer ── */
  .footer{text-align:center;padding:5px 10px 8px;font-size:7.5px;color:#9ca3af;line-height:1.4}
  .footer strong{color:#471755}

  /* ── Print button (screen only) ── */
  .print-btn{display:block;width:100%;padding:10px;background:#471755;color:#fff;border:none;font-size:14px;font-weight:700;cursor:pointer;margin-top:12px;border-radius:6px}
  .print-btn:hover{background:#7c3aed}
</style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <div class="store-name">Sahiba Wears</div>
    <div class="store-sub">Ethnic &amp; Traditional Wear · Doha, Qatar</div>
    <div class="order-num">#${selectedOrder.orderNumber}</div>
    <div class="status-pill" style="background:${sc}22;color:${sc};border-color:${sc}88">${statusLabel}</div>
  </div>

  <!-- BODY -->
  <div class="body">

    <!-- QR + Barcode -->
    <div class="codes-row">
      <div class="qr-wrap">
        <img src="${printQr}" alt="QR"/>
        <div class="qr-label">Scan to Track</div>
      </div>
      <div class="barcode-wrap">
        ${barcodeSvg.outerHTML}
      </div>
    </div>

    <div class="dashed"></div>

    <!-- Address -->
    <div style="margin-bottom:6px">
      <div class="section-label">Ship To</div>
      <div class="cust-name">${addr.fullName || ""}</div>
      <div class="cust-phone">📞 ${addr.phone || ""}</div>
      <div class="cust-addr">${addrLine}</div>
    </div>

    <div class="dashed"></div>

    <!-- Items -->
    <div style="margin-bottom:5px">
      <div class="section-label">Items</div>
      <table>
        <tbody>${itemsHTML}</tbody>
      </table>
    </div>

    <div class="dashed"></div>

    <!-- Payment Summary -->
    ${selectedOrder.discount > 0 ? `<div class="sum-row"><span>Discount${selectedOrder.couponCode ? ` (${selectedOrder.couponCode})` : ""}</span><span style="color:#10b981">−QAR ${Number(selectedOrder.discount).toFixed(2)}</span></div>` : ""}
    <div class="sum-row"><span>Delivery</span><span>${selectedOrder.deliveryFee === 0 ? "FREE" : `QAR ${Number(selectedOrder.deliveryFee).toFixed(2)}`}</span></div>
    <div class="sum-total"><span>Total</span><span>QAR ${Number(selectedOrder.total).toFixed(2)}</span></div>

    <div class="sum-row" style="margin-top:4px">
      <span>Payment</span>
      <span style="font-weight:600;color:#111">${(selectedOrder.paymentType || "").replace(/\b\w/g,c=>c.toUpperCase())} · ${(selectedOrder.paymentStatus || "").toUpperCase()}</span>
    </div>
    <div class="sum-row">
      <span>Est. Delivery</span>
      <span style="font-weight:600;color:#111">${estimatedStr}</span>
    </div>

  </div>

  <!-- FOOTER -->
  <div class="footer">
    <strong>Thank you for shopping with Sahiba Wears ✨</strong><br/>
    ${new Date(selectedOrder.createdAt || Date.now()).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} · support@flexii.com
  </div>

  <button class="print-btn no-print" onclick="window.print()">🖨️ Print Sticker</button>

</body>
</html>`;

    const win = window.open("", "_blank", "width=440,height=680");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
  }, [selectedOrder, qrDataUrl]);

  useEffect(() => {
    dispatch(getAllOrders(filters));
  }, [dispatch, filters]);

  const openDetails = (order) => {
    setSelectedOrder(order);

    setUpdateData({
      orderStatus: order.orderStatus || "pending",
      paymentStatus: order.paymentStatus || "pending",
      estimatedDelivery: order.estimatedDelivery
        ? order.estimatedDelivery.split("T")[0]
        : "",
    });

    setIsOpen(true);
  };

  const closeDetails = () => {
    setIsOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdate = async () => {
    if (!selectedOrder) return;

    try {
      await dispatch(
        updateOrderByAdminThunk({
          orderId: selectedOrder._id,
          updateData,
        }),
      );
    } catch (error) {
      popMessage("something went wrong");
    }

    closeDetails();
  };

  return (
    <Layout>
      <div>
        <h2 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-10">
          Orders Management
        </h2>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-6 text-center">
              <Spinner color="black" />
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-4 text-sm font-semibold">Order #</th>
                  <th className="p-4 text-sm font-semibold">Customer</th>
                  <th className="p-4 text-sm font-semibold">Total</th>
                  <th className="p-4 text-sm font-semibold">Order Status</th>
                  <th className="p-4 text-sm font-semibold">Payment</th>
                  <th className="p-4 text-sm font-semibold">
                    Estimated Delivery
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    onClick={() => openDetails(order)}
                    className="border-t hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="p-4 font-mono text-xs text-gray-600">
                      #{order.orderNumber || order._id.slice(-8)}
                    </td>
                    <td className="p-4 font-medium">
                      {order.shippingAddress?.fullName}
                      <div className="text-xs text-gray-500">
                        {order.shippingAddress?.phone}
                      </div>
                    </td>

                    <td className="p-4">{order.total}</td>

                    <td className="p-4">
                      <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-700">
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="p-4 text-sm text-gray-500">
                      {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {isOpen && selectedOrder && (
          <SideDrawer
            isOpen={isOpen}
            onClose={closeDetails}
            title="Order Details"
          >
            <div className="space-y-4 text-sm">

              {/* QR + Barcode + Print */}
              <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
                {/* Purple top bar */}
                <div className="bg-gradient-to-r from-purple-700 to-violet-600 px-4 py-3">
                  <p className="text-white font-bold text-sm">Parcel Sticker</p>
                  <p className="text-purple-200 text-xs mt-0.5">
                    Order #{selectedOrder.orderNumber || selectedOrder._id.slice(-8)}
                  </p>
                </div>

                <div className="p-4">
                  {/* QR + Barcode side by side preview */}
                  <div className="flex items-center gap-4 mb-4">
                    {/* QR preview */}
                    <div className="flex flex-col items-center">
                      {qrDataUrl ? (
                        <img
                          src={qrDataUrl}
                          alt="QR Code"
                          className="w-24 h-24 rounded-lg border-2 border-purple-200 p-1"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                          Loading…
                        </div>
                      )}
                      <span className="text-[9px] text-purple-700 font-bold uppercase tracking-wide mt-1">
                        Scan to Track
                      </span>
                    </div>

                    {/* Barcode preview */}
                    <div className="flex-1 overflow-hidden">
                      <svg ref={barcodeSvgRef} className="w-full" />
                    </div>
                  </div>

                  {/* Tracking URL */}
                  <div className="bg-purple-50 rounded-lg px-3 py-2 mb-3">
                    <p className="text-[10px] text-purple-500 font-semibold uppercase tracking-wide mb-0.5">Tracking Link</p>
                    <p className="text-xs text-purple-800 break-all font-mono">
                      {TRACKING_BASE}/{selectedOrder.orderNumber}
                    </p>
                  </div>

                  <button
                    onClick={printOrderSticker}
                    className="w-full bg-gradient-to-r from-purple-700 to-violet-600 text-white py-2.5 rounded-lg hover:from-purple-800 hover:to-violet-700 transition text-sm font-bold shadow-md flex items-center justify-center gap-2"
                  >
                    <span>🖨️</span> Print Parcel Sticker (100×150mm)
                  </button>
                </div>
              </div>

              <div className="border p-4 rounded bg-gray-50">
                <h3 className="font-semibold text-purple-700 mb-3">
                  Admin Update Controls
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">Order Status</label>

                    <select
                      className="w-full border rounded p-2"
                      value={
                        [
                          "pending",
                          "processing",
                          "shipped",
                          "delivered",
                          "cancelled",
                        ].includes(updateData.orderStatus)
                          ? updateData.orderStatus
                          : "other"
                      }
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          orderStatus:
                            e.target.value === "other" ? "" : e.target.value,
                        })
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="other">Other</option>
                    </select>

                    {/* Show input if not one of default statuses */}
                    {![
                      "pending",
                      "processing",
                      "shipped",
                      "delivered",
                      "cancelled",
                    ].includes(updateData.orderStatus) && (
                      <input
                        type="text"
                        placeholder="Enter custom status"
                        className="w-full border rounded p-2 mt-2"
                        value={updateData.orderStatus}
                        onChange={(e) =>
                          setUpdateData({
                            ...updateData,
                            orderStatus: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Payment Status</label>
                    <select
                      className="w-full border rounded p-2"
                      value={updateData.paymentStatus}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          paymentStatus: e.target.value,
                        })
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-1">
                      Estimated Delivery
                    </label>
                    <input
                      type="date"
                      className="w-full border rounded p-2"
                      value={updateData.estimatedDelivery}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          estimatedDelivery: e.target.value,
                        })
                      }
                    />
                  </div>

                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition disabled:opacity-50"
                  >
                    {loading ? "Updating..." : "Update Order"}
                  </button>
                </div>
              </div>

              <div>
                <strong>Order ID:</strong> {selectedOrder._id}
              </div>

              <div>
                <strong>Order Status:</strong> {selectedOrder.orderStatus}
              </div>

              <div>
                <strong>Payment Status:</strong> {selectedOrder.paymentStatus}
              </div>

              <div>
                <strong>Estimated Delivery:</strong>{" "}
                {selectedOrder.estimatedDelivery
                  ? new Date(
                      selectedOrder.estimatedDelivery,
                    ).toLocaleDateString()
                  : "Not set"}
              </div>

              <hr className="my-4" />

              <h3 className="font-semibold text-purple-700">
                Customer Details
              </h3>

              <div>
                <strong>Name:</strong> {selectedOrder.shippingAddress.fullName}
              </div>

              <div>
                <strong>Phone:</strong> {selectedOrder.shippingAddress.phone}
              </div>

              <div>
                <strong>Address:</strong>
                <div className="text-gray-600">
                  {selectedOrder.shippingAddress.addressLine1}
                  <br />
                  {selectedOrder.shippingAddress.addressLine2}
                  <br />
                  {selectedOrder.shippingAddress.city},{" "}
                  {selectedOrder.shippingAddress.state}
                  <br />
                  {selectedOrder.shippingAddress.country}
                </div>
              </div>

              <hr className="my-4" />
              <h3 className="font-semibold text-purple-700">Ordered Items</h3>

              <div className="space-y-3">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="border p-3 rounded bg-gray-50">
                    <div className="font-medium">{item.name}</div>
                    <div>Size: {item.size}</div>
                    <div>Qty: {item.quantity}</div>
                    <div>Price: {item.discountPrice || item.price}</div>
                  </div>
                ))}
              </div>

              <hr className="my-4" />

              <h3 className="font-semibold text-purple-700">Payment Summary</h3>

              <div>Subtotal: {selectedOrder.subtotal}</div>
              <div>Discount: {selectedOrder.discount}</div>
              <div>Delivery Fee: {selectedOrder.deliveryFee}</div>
              <div className="font-bold text-lg">
                Total: {selectedOrder.total}
              </div>

              {selectedOrder.couponCode && (
                <div>
                  <strong>Coupon:</strong> {selectedOrder.couponCode}
                </div>
              )}
            </div>
          </SideDrawer>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
