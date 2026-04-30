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
  const [selectedOrderIds, setSelectedOrderIds] = useState(new Set());

  const toggleSelect = (e, id) => {
    e.stopPropagation();
    setSelectedOrderIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.size === orders.length) {
      setSelectedOrderIds(new Set());
    } else {
      setSelectedOrderIds(new Set(orders.map(o => o._id)));
    }
  };

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

  const buildInvoiceHTML = useCallback(async (order) => {
    const addr = order.shippingAddress || {};
    const trackingUrl = `${TRACKING_BASE}/${order.orderNumber}`;

    const addrParts = addr.addressType === "villa"
      ? [`Villa ${addr.villaNo}`, `Street ${addr.streetNo}`, `Zone ${addr.zoneNo}`]
      : [`Building ${addr.buildingNo}`, `Floor ${addr.floorNo}`, `Room ${addr.roomNo}`, `Street ${addr.streetNo}`, `Zone ${addr.zoneNo}`];
    const addrLine = [...addrParts, addr.city, addr.country].filter(Boolean).join(", ");

    let printQr = "";
    try {
      printQr = await QRCode.toDataURL(trackingUrl, {
        width: 200, margin: 1,
        color: { dark: "#000000", light: "#ffffff" },
        errorCorrectionLevel: "H",
      });
    } catch (_) {}

    const barcodeSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    try {
      JsBarcode(barcodeSvg, String(order.orderNumber || order._id.slice(-10)), {
        format: "CODE128", width: 2, height: 50,
        displayValue: true, fontSize: 11, margin: 4,
        background: "#ffffff", lineColor: "#000",
        xmlDocument: document,
      });
    } catch (_) {}

    const itemsHTML = (order.items || []).map((item) => `
      <tr>
        <td style="padding:7px 6px;vertical-align:middle">
          ${item.image ? `<img src="${item.image}" style="width:38px;height:38px;object-fit:cover;border:1px solid #ddd;border-radius:3px;display:block"/>` : `<div style="width:38px;height:38px;background:#f3f4f6;border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:8px;color:#999"></div>`}
        </td>
        <td style="padding:7px 6px;vertical-align:middle">
          <div style="font-size:10px;font-weight:700;color:#111">${item.name || ""}</div>
          <div style="font-size:8px;color:#777;margin-top:2px">Size: ${item.size || "—"}</div>
        </td>
        <td style="padding:7px 6px;text-align:center;vertical-align:middle;font-size:10px;color:#444">×${item.quantity}</td>
        <td style="padding:7px 6px;text-align:right;vertical-align:middle;font-size:10px;font-weight:700;color:#000">QAR ${Number(item.discountPrice || item.price || 0).toFixed(2)}</td>
      </tr>`).join("");

    const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const estStr = order.estimatedDelivery
      ? new Date(order.estimatedDelivery).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      : "—";
    const statusLabel = (order.orderStatus || "").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    const paymentLabel = (order.paymentType || "online").replace(/\b\w/g, c => c.toUpperCase());

    return `
  <div class="invoice">
    <!-- HEADER -->
    <div class="inv-header">
      <div class="brand">
        <div class="brand-name">SAHIBA</div>
        <div class="brand-sub">Ethnic &amp; Traditional Wear · Doha, Qatar</div>
      </div>
      <div class="order-block">
        <div class="order-id">ORDER #${order.orderNumber || order._id.slice(-8)}</div>
        <div class="order-meta">${orderDate}</div>
        <div class="status-badge">${statusLabel}</div>
      </div>
    </div>

    <!-- SHIP TO + CODES -->
    <div class="ship-row">
      <div class="ship-details">
        <div class="section-label">SHIP TO</div>
        <div style="font-size:14px;font-weight:800;color:#000;margin-bottom:3px">${addr.fullName || ""}</div>
        <div style="font-size:10px;color:#333;margin-bottom:3px">${addr.phone || ""}</div>
        <div style="font-size:9px;color:#555;line-height:1.5">${addrLine}</div>
      </div>
      <div class="codes-col">
        ${printQr ? `<img src="${printQr}" style="width:76px;height:76px;border:1px solid #ddd;border-radius:4px;display:block"/>
        <div style="font-size:7px;color:#777;text-align:center;margin-top:3px;text-transform:uppercase;letter-spacing:.5px">Scan to Track</div>` : ""}
      </div>
    </div>

    <!-- BARCODE -->
    <div style="text-align:center;margin:8px 0 10px">${barcodeSvg.outerHTML}</div>

    <div class="divider"></div>

    <!-- ITEMS TABLE -->
    <div class="section-label" style="margin-bottom:4px">ITEMS</div>
    <table>
      <thead>
        <tr style="border-bottom:2px solid #000">
          <th style="padding:5px 6px;text-align:left;font-size:8px;text-transform:uppercase;letter-spacing:.5px;width:44px"></th>
          <th style="padding:5px 6px;text-align:left;font-size:8px;text-transform:uppercase;letter-spacing:.5px">Product</th>
          <th style="padding:5px 6px;text-align:center;font-size:8px;text-transform:uppercase;letter-spacing:.5px">Qty</th>
          <th style="padding:5px 6px;text-align:right;font-size:8px;text-transform:uppercase;letter-spacing:.5px">Price</th>
        </tr>
      </thead>
      <tbody>${itemsHTML}</tbody>
    </table>

    <div class="divider" style="margin-top:8px"></div>

    <!-- TOTALS -->
    <div class="totals">
      ${Number(order.discount) > 0 ? `<div class="total-row"><span>Discount${order.couponCode ? ` (${order.couponCode})` : ""}</span><span style="color:#16a34a">−QAR ${Number(order.discount).toFixed(2)}</span></div>` : ""}
      <div class="total-row"><span>Delivery</span><span>${order.deliveryFee === 0 ? "FREE" : `QAR ${Number(order.deliveryFee || 0).toFixed(2)}`}</span></div>
      <div class="total-row"><span>Payment</span><span>${paymentLabel} · ${(order.paymentStatus || "").toUpperCase()}</span></div>
      <div class="total-row"><span>Est. Delivery</span><span>${estStr}</span></div>
      <div class="total-final"><span>TOTAL</span><span>QAR ${Number(order.total || 0).toFixed(2)}</span></div>
    </div>

    <!-- FOOTER -->
    <div class="inv-footer">Thank you for shopping with Sahiba Wears &nbsp;·&nbsp; support@sahibawears.com</div>
  </div>`;
  }, [qrDataUrl]);

  const printOrderSticker = useCallback(async () => {
    if (!selectedOrder) return;
    const invoiceBody = await buildInvoiceHTML(selectedOrder);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Invoice — #${selectedOrder.orderNumber}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,sans-serif;background:#fff;padding:0}
  @media print{
    @page{size:A5;margin:12mm}
    .no-print{display:none!important}
    body{padding:0}
  }
  .invoice{max-width:148mm;margin:0 auto;padding:16px}
  .inv-header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2.5px solid #000;padding-bottom:12px;margin-bottom:14px}
  .brand-name{font-size:22px;font-weight:900;letter-spacing:-0.5px;color:#000}
  .brand-sub{font-size:8px;color:#666;letter-spacing:.3px;margin-top:2px}
  .order-block{text-align:right}
  .order-id{font-size:15px;font-weight:800;color:#000}
  .order-meta{font-size:9px;color:#777;margin-top:2px}
  .status-badge{display:inline-block;border:1.5px solid #000;border-radius:3px;padding:2px 8px;font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-top:5px}
  .ship-row{display:flex;gap:14px;margin-bottom:10px}
  .ship-details{flex:1}
  .codes-col{flex-shrink:0;display:flex;flex-direction:column;align-items:center}
  .section-label{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#888;margin-bottom:5px}
  .divider{border-top:1px solid #ddd;margin:8px 0}
  table{width:100%;border-collapse:collapse}
  .totals{margin-top:8px}
  .total-row{display:flex;justify-content:space-between;font-size:9.5px;color:#555;padding:2px 0}
  .total-final{display:flex;justify-content:space-between;font-size:14px;font-weight:900;color:#000;border-top:2.5px solid #000;margin-top:6px;padding-top:6px}
  .inv-footer{text-align:center;font-size:8px;color:#999;border-top:1px dashed #ccc;margin-top:14px;padding-top:8px}
  .print-btn{display:block;width:100%;padding:12px;background:#000;color:#fff;border:none;font-size:14px;font-weight:700;cursor:pointer;margin-top:16px;border-radius:6px;letter-spacing:.5px}
  .print-btn:hover{background:#333}
</style>
</head>
<body>
  ${invoiceBody}
  <button class="print-btn no-print" onclick="window.print()">Print Invoice</button>
</body>
</html>`;

    const win = window.open("", "_blank", "width=600,height=820");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
  }, [selectedOrder, buildInvoiceHTML]);

  const printBulkOrders = useCallback(async () => {
    const toPrint = orders.filter(o => selectedOrderIds.has(o._id));
    if (!toPrint.length) return;

    const invoiceBodies = await Promise.all(toPrint.map(o => buildInvoiceHTML(o)));

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Bulk Invoices — Sahiba Wears</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,sans-serif;background:#fff}
  @media print{
    @page{size:A5;margin:12mm}
    .no-print{display:none!important}
    .invoice{page-break-after:always}
    .invoice:last-child{page-break-after:auto}
  }
  .invoice{max-width:148mm;margin:0 auto;padding:16px;border-bottom:2px dashed #ccc}
  @media print{.invoice{border-bottom:none}}
  .inv-header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2.5px solid #000;padding-bottom:12px;margin-bottom:14px}
  .brand-name{font-size:22px;font-weight:900;letter-spacing:-0.5px;color:#000}
  .brand-sub{font-size:8px;color:#666;letter-spacing:.3px;margin-top:2px}
  .order-block{text-align:right}
  .order-id{font-size:15px;font-weight:800;color:#000}
  .order-meta{font-size:9px;color:#777;margin-top:2px}
  .status-badge{display:inline-block;border:1.5px solid #000;border-radius:3px;padding:2px 8px;font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-top:5px}
  .ship-row{display:flex;gap:14px;margin-bottom:10px}
  .ship-details{flex:1}
  .codes-col{flex-shrink:0;display:flex;flex-direction:column;align-items:center}
  .section-label{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#888;margin-bottom:5px}
  .divider{border-top:1px solid #ddd;margin:8px 0}
  table{width:100%;border-collapse:collapse}
  .totals{margin-top:8px}
  .total-row{display:flex;justify-content:space-between;font-size:9.5px;color:#555;padding:2px 0}
  .total-final{display:flex;justify-content:space-between;font-size:14px;font-weight:900;color:#000;border-top:2.5px solid #000;margin-top:6px;padding-top:6px}
  .inv-footer{text-align:center;font-size:8px;color:#999;border-top:1px dashed #ccc;margin-top:14px;padding-top:8px}
  .print-btn{display:block;width:100%;padding:12px;background:#000;color:#fff;border:none;font-size:14px;font-weight:700;cursor:pointer;margin:20px auto;max-width:320px;border-radius:6px;letter-spacing:.5px}
</style>
</head>
<body>
  ${invoiceBodies.join("\n")}
  <button class="print-btn no-print" onclick="window.print()">Print All ${toPrint.length} Invoices</button>
</body>
</html>`;

    const win = window.open("", "_blank", "width=660,height=860");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
  }, [orders, selectedOrderIds, buildInvoiceHTML]);

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

        {selectedOrderIds.size > 0 && (
          <div className="flex items-center gap-3 mb-3 bg-purple-50 border border-purple-200 rounded-lg px-4 py-2">
            <span className="text-sm text-purple-700 font-medium">{selectedOrderIds.size} order{selectedOrderIds.size > 1 ? "s" : ""} selected</span>
            <button
              onClick={printBulkOrders}
              className="ml-auto bg-black text-white text-sm px-4 py-1.5 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Print Selected ({selectedOrderIds.size})
            </button>
            <button
              onClick={() => setSelectedOrderIds(new Set())}
              className="text-sm text-gray-500 hover:text-gray-700 transition"
            >
              Clear
            </button>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-6 text-center">
              <Spinner color="black" />
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-4">
                    <input
                      type="checkbox"
                      checked={orders.length > 0 && selectedOrderIds.size === orders.length}
                      onChange={toggleSelectAll}
                      className="cursor-pointer"
                    />
                  </th>
                  <th className="p-4 text-sm font-semibold">Order #</th>
                  <th className="p-4 text-sm font-semibold">Customer</th>
                  <th className="p-4 text-sm font-semibold">Total</th>
                  <th className="p-4 text-sm font-semibold">Order Status</th>
                  <th className="p-4 text-sm font-semibold">Payment</th>
                  <th className="p-4 text-sm font-semibold">Date</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    onClick={() => openDetails(order)}
                    className="border-t hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedOrderIds.has(order._id)}
                        onChange={(e) => toggleSelect(e, order._id)}
                        onClick={(e) => e.stopPropagation()}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="p-4 font-mono text-xs text-gray-600">
                      #{order.orderNumber || order._id.slice(-8)}
                    </td>
                    <td className="p-4 font-medium">
                      {order.shippingAddress?.fullName}
                      <div className="text-xs text-gray-500">
                        {order.shippingAddress?.phone}
                      </div>
                    </td>

                    <td className="p-4 font-semibold">QAR {order.total}</td>

                    <td className="p-4">
                      <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-700 capitalize">
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="p-4">
                      <div>
                        <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700 capitalize">
                          {order.paymentStatus}
                        </span>
                        <div className="text-xs text-gray-500 mt-1 capitalize">{order.paymentType || "online"}</div>
                      </div>
                    </td>

                    <td className="p-4 text-xs text-gray-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
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
                  <div key={index} className="border p-3 rounded bg-gray-50 flex gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded border flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Size: {item.size} · Qty: {item.quantity}</div>
                      <div className="text-sm font-bold text-purple-700 mt-1">QAR {Number(item.discountPrice || item.price || 0).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="my-4" />

              <h3 className="font-semibold text-purple-700">Payment Summary</h3>

              <div className="bg-gray-50 rounded-lg p-3 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>QAR {selectedOrder.subtotal}</span></div>
                {Number(selectedOrder.discount) > 0 && (
                  <div className="flex justify-between"><span className="text-gray-500">Discount{selectedOrder.couponCode ? ` (${selectedOrder.couponCode})` : ""}</span><span className="text-green-600">−QAR {selectedOrder.discount}</span></div>
                )}
                <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span>{selectedOrder.deliveryFee === 0 ? "FREE" : `QAR ${selectedOrder.deliveryFee}`}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Payment Type</span><span className="capitalize font-medium">{selectedOrder.paymentType || "online"}</span></div>
                <div className="flex justify-between border-t pt-1.5 font-bold text-base">
                  <span>Total</span><span className="text-purple-700">QAR {selectedOrder.total}</span>
                </div>
              </div>
            </div>
          </SideDrawer>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
