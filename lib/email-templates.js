import { STORE, formatNpr } from "../app/config";

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function base(content, brandName = STORE.brand) {
  const safeBrand = escapeHtml(brandName);
  return `<!doctype html><html><body style="margin:0;padding:0;background-color:#f5f1e8;font-family:Arial,Helvetica,sans-serif;color:#29241e"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f1e8;padding:24px 10px"><tr><td align="center"><table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#fffdf8;border:1px solid #e5dcc9;border-radius:18px;overflow:hidden"><tr><td style="padding:22px 28px;background:#17392f;color:#fffdf8;font-family:Georgia,serif;font-size:25px">${safeBrand}</td></tr>${content}<tr><td style="padding:18px 28px;background:#eee7d9;color:#70695f;font-size:11px;line-height:18px">${safeBrand} · Nepal<br/>This email is about a Cash on Delivery order.</td></tr></table></td></tr></table></body></html>`;
}

function detailRow(label, value) {
  return `<tr><td style="padding:9px 0;color:#70695f;font-size:12px;border-bottom:1px solid #eee7d9">${escapeHtml(label)}</td><td style="padding:9px 0;text-align:right;color:#17392f;font-size:12px;font-weight:bold;border-bottom:1px solid #eee7d9">${escapeHtml(value)}</td></tr>`;
}

export function businessOrderEmail(order) {
  const brandName = process.env.BRAND_NAME?.trim() || STORE.brand;
  const details = [
    detailRow("Order ID", order.orderId), detailRow("Date & Time", order.dateTime),
    detailRow("Customer", order.customerName), detailRow("Phone", order.phone),
    detailRow("Email", order.email), detailRow("Exact location", order.location),
    detailRow("Product", order.productName), detailRow("Quantity", order.quantity),
    detailRow("Price per piece", formatNpr(order.pricePerPiece)), detailRow("Delivery fee", formatNpr(order.deliveryFee)),
    detailRow("Total", formatNpr(order.totalPrice)), detailRow("Payment method", order.paymentMethod),
  ].join("");
  return base(`<tr><td style="padding:28px"><span style="display:inline-block;padding:6px 10px;border-radius:99px;background:#e8f0e8;color:#17392f;font-size:10px;font-weight:bold">${escapeHtml(order.orderStatus)}</span><h1 style="margin:14px 0 6px;color:#17392f;font-family:Georgia,serif;font-size:30px;font-weight:normal">New product order</h1><p style="margin:0 0 20px;color:#70695f;font-size:13px">Order details are ready for confirmation.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0">${details}</table><p style="margin:22px 0 0;padding:15px;background:#f5f1e8;border-left:3px solid #b68a3a;color:#29241e;font-size:13px;line-height:20px"><strong>Please call the customer soon to confirm this order.</strong></p></td></tr>`, brandName);
}

export function customerOrderEmail(order) {
  const rows = [detailRow("Product", order.productName), detailRow("Quantity", order.quantity), detailRow("Total", formatNpr(order.totalPrice)), detailRow("Payment method", order.paymentMethod)].join("");
  const supportEmail = escapeHtml(process.env.BUSINESS_EMAIL || "maharjansamish@gmail.com");
  const brandName = process.env.BRAND_NAME?.trim() || STORE.brand;
  return base(`<tr><td style="padding:30px"><p style="margin:0 0 8px;color:#70695f;font-size:12px">Hi ${escapeHtml(order.customerName)},</p><h1 style="margin:0 0 10px;color:#17392f;font-family:Georgia,serif;font-size:32px;font-weight:normal">Thank you for your order.</h1><p style="margin:0 0 21px;color:#70695f;font-size:13px;line-height:21px">We have received your order successfully. Here are your order details:</p><p style="margin:0 0 12px;color:#70695f;font-size:11px">Order ID: <strong style="color:#17392f">${escapeHtml(order.orderId)}</strong></p><table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows}</table><p style="margin:22px 0 0;color:#29241e;font-size:13px;line-height:21px">Our sales representative will call you soon to confirm your order.</p><p style="margin:20px 0 0;color:#70695f;font-size:12px;line-height:20px">Thank you,<br/><strong style="color:#17392f">${escapeHtml(brandName)}</strong><br/>Questions? Reply to this email or write to <a href="mailto:${supportEmail}" style="color:#17392f">${supportEmail}</a>.</p></td></tr>`, brandName);
}
