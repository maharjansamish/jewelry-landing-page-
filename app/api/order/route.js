import { randomBytes } from "node:crypto";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import { STORE, formatNpr } from "../../config";
import { businessOrderEmail, customerOrderEmail } from "../../../lib/email-templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SHEET_HEADERS = ["Order ID", "Date & Time", "Customer Name", "Phone Number", "Email Address", "Exact Location", "Product Name", "Quantity", "Price Per Piece", "Delivery Fee", "Total Price", "Payment Method", "Order Status", "Notes"];

function jsonError(error, status, code) {
  return Response.json({ error, code }, { status, headers: { "Cache-Control": "no-store" } });
}

function text(value, maxLength) {
  return String(value ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, maxLength);
}

function validEmail(value) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function makeOrderId() {
  return `AJ-${Date.now().toString(36).toUpperCase()}-${randomBytes(4).toString("hex").toUpperCase()}`;
}

function formatKathmanduDate() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kathmandu", day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
  }).format(new Date());
}

function requiredEnvironment() {
  const required = ["BUSINESS_EMAIL", "EMAIL_FROM", "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "GOOGLE_SHEET_ID", "GOOGLE_SHEET_TAB_NAME", "GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY"];
  return required.filter((name) => !process.env[name]?.trim());
}

function createMailer() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS.replace(/\s/g, "") },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });
}

async function appendToSheet(order) {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const tab = process.env.GOOGLE_SHEET_TAB_NAME.replace(/'/g, "''");
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    fields: "sheets.properties.title",
  });
  const hasTab = spreadsheet.data.sheets?.some((sheet) => sheet.properties?.title === process.env.GOOGLE_SHEET_TAB_NAME);
  if (!hasTab) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      requestBody: { requests: [{ addSheet: { properties: { title: process.env.GOOGLE_SHEET_TAB_NAME } } }] },
    });
  }
  const headerRange = `'${tab}'!A1:N1`;
  const currentHeader = await sheets.spreadsheets.values.get({ spreadsheetId: process.env.GOOGLE_SHEET_ID, range: headerRange });
  if (!currentHeader.data.values?.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: headerRange,
      valueInputOption: "RAW",
      requestBody: { values: [SHEET_HEADERS] },
    });
    const sheetId = spreadsheet.data.sheets?.find((sheet) => sheet.properties?.title === process.env.GOOGLE_SHEET_TAB_NAME)?.properties?.sheetId;
    if (sheetId !== undefined) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        requestBody: { requests: [
          { updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: 1 } }, fields: "gridProperties.frozenRowCount" } },
          { repeatCell: { range: { sheetId, startRowIndex: 0, endRowIndex: 1 }, cell: { userEnteredFormat: { backgroundColor: { red: 0.09, green: 0.22, blue: 0.18 }, textFormat: { foregroundColor: { red: 1, green: 0.97, blue: 0.88 }, bold: true, fontSize: 10 }, verticalAlignment: "MIDDLE", wrapStrategy: "WRAP" } }, fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment,wrapStrategy)" } },
          { repeatCell: { range: { sheetId, startRowIndex: 1, endRowIndex: 1000 }, cell: { userEnteredFormat: { textFormat: { foregroundColor: { red: 0.12, green: 0.17, blue: 0.15 }, fontSize: 10 }, verticalAlignment: "MIDDLE" } }, fields: "userEnteredFormat(textFormat,verticalAlignment)" } },
          { updateDimensionProperties: { range: { sheetId, dimension: "ROWS", startIndex: 0, endIndex: 1 }, properties: { pixelSize: 42 }, fields: "pixelSize" } },
          ...[150, 155, 180, 125, 220, 210, 200, 90, 125, 120, 125, 160, 140, 220].map((pixelSize, index) => ({ updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: index, endIndex: index + 1 }, properties: { pixelSize }, fields: "pixelSize" } })),
          { addBanding: { bandedRange: { range: { sheetId, startRowIndex: 0, startColumnIndex: 0, endColumnIndex: SHEET_HEADERS.length }, rowProperties: { headerColor: { red: 0.09, green: 0.22, blue: 0.18 }, firstBandColor: { red: 1, green: 1, blue: 1 }, secondBandColor: { red: 0.96, green: 0.95, blue: 0.91 } } } } },
        ] },
      });
    }
  }
  const range = `'${tab}'!A:N`;
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[
        order.orderId, order.dateTime, order.customerName, order.phone, order.email,
        order.location, order.productName, order.quantity, order.pricePerPiece,
        order.deliveryFee, order.totalPrice, order.paymentMethod, order.orderStatus, "",
      ]],
    },
  });
}

export async function POST(request) {
  const nativeForm = /application\/x-www-form-urlencoded|multipart\/form-data/i.test(request.headers.get("content-type") || "");
  const origin = request.headers.get("origin");
  const requestUrl = new URL(request.url);
  const allowedOrigins = [requestUrl.origin, process.env.FRONTEND_URL, process.env.NEXT_PUBLIC_SITE_URL]
    .map((value) => {
      try { return new URL(value).origin; }
      catch { return null; }
    })
    .filter(Boolean);
  let refererOrigin = "";
  try { refererOrigin = new URL(request.headers.get("referer") || "").origin; }
  catch { /* A missing or malformed Referer is not trusted. */ }
  // Some browsers omit or rewrite Origin on native form POSTs. Accept those
  // only when the Referer still proves the request came from this same site.
  const isLocalDevelopmentOrigin = (value) => {
    if (process.env.NODE_ENV !== "development" || !value) return false;
    try {
      const parsed = new URL(value);
      return ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname) && parsed.port === requestUrl.port;
    } catch { return false; }
  };
  const isAllowedOrigin = (value) => {
    try { return allowedOrigins.includes(new URL(value).origin); }
    catch { return false; }
  };
  const sameOriginRequest = isAllowedOrigin(origin) || (nativeForm && isAllowedOrigin(refererOrigin)) || isLocalDevelopmentOrigin(origin);
  if (!sameOriginRequest) return jsonError("This order request is not allowed.", 403, "ORIGIN_NOT_ALLOWED");

  let payload;
  try {
    payload = nativeForm ? Object.fromEntries(await request.formData()) : await request.json();
  }
  catch { return jsonError("Please send a valid order form.", 400, "INVALID_JSON"); }

  if (text(payload?.website, 300)) return jsonError("We could not accept this request.", 400, "INVALID_REQUEST");
  const customerName = text(payload?.customerName, 100);
  const phone = text(payload?.phone, 24);
  const email = text(payload?.email, 254).toLowerCase();
  const location = text(payload?.location, 500);
  const productId = text(payload?.productId, 80);
  const quantity = Number(payload?.quantity);
  const phoneDigits = phone.replace(/\D/g, "");
  const errors = [];
  if (customerName.length < 2) errors.push("Enter your full name.");
  if (phoneDigits.length < 7 || phoneDigits.length > 15) errors.push("Enter a valid phone number.");
  if (!validEmail(email)) errors.push("Enter a valid email address.");
  if (location.length < 5) errors.push("Enter your exact location.");
  if (productId !== STORE.product.id) errors.push("Please select a valid product.");
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) errors.push("Choose a quantity from 1 to 10.");
  if (errors.length) return Response.json({ error: "Please check the highlighted order details.", fields: errors }, { status: 400, headers: { "Cache-Control": "no-store" } });

  const product = STORE.product;
  const missing = requiredEnvironment();
  if (missing.length) {
    // Allow the local funnel to be previewed before Sheets and email credentials
    // are configured. This response is clearly marked as a preview and is never
    // enabled in production, so it cannot claim that a real order was recorded.
    if (process.env.NODE_ENV === "development") {
      console.info("[order] development preview only; order was not saved or emailed");
      const previewOrder = {
        orderId: `PREVIEW-${makeOrderId()}`,
        productName: product.name,
        quantity,
        totalPrice: product.price * quantity + product.deliveryFee,
      };
      if (nativeForm) {
        const destination = new URL("/thank-you", request.url);
        destination.search = new URLSearchParams({ orderId: previewOrder.orderId, product: previewOrder.productName, quantity: String(quantity), total: String(previewOrder.totalPrice), preview: "true" }).toString();
        return Response.redirect(destination, 303);
      }
      return Response.json({ ok: true, demo: true, order: previewOrder }, { status: 201, headers: { "Cache-Control": "no-store" } });
    }
    console.error("[order] required server environment is missing", missing);
    return jsonError("Order service setup is incomplete. Please contact Aura Jewels at the support email shown on the website.", 503, "ORDER_SERVICE_NOT_CONFIGURED");
  }
  if (!validEmail(process.env.BUSINESS_EMAIL)) return jsonError("The business notification address is not configured correctly.", 503, "ORDER_SERVICE_NOT_CONFIGURED");

  const order = {
    orderId: makeOrderId(),
    dateTime: formatKathmanduDate(),
    customerName,
    phone,
    email,
    location,
    productId: product.id,
    productName: product.name,
    quantity,
    pricePerPiece: product.price,
    deliveryFee: product.deliveryFee,
    totalPrice: product.price * quantity + product.deliveryFee,
    paymentMethod: "Cash On Delivery",
    orderStatus: "New Order",
  };

  const mailer = createMailer();
  try {
    // Check the SMTP connection before writing the order, so missing or invalid mail setup does not leave an unnotified row.
    await mailer.verify();
  } catch (error) {
    console.error("[order] SMTP verification failed", { code: error?.code || "SMTP_ERROR" });
    return jsonError("We could not connect to the order email service. Please try again later.", 503, "EMAIL_SERVICE_UNAVAILABLE");
  }

  try {
    await appendToSheet(order);
  } catch (error) {
    console.error("[order] spreadsheet append failed", { orderId: order.orderId, code: error?.code || "SHEETS_ERROR" });
    return jsonError("We could not save your order yet. Please try again in a moment.", 502, "SHEET_WRITE_FAILED");
  }

  const emailFrom = process.env.EMAIL_FROM;
  const brandName = process.env.BRAND_NAME?.trim() || STORE.brand;
  const emails = await Promise.allSettled([
    mailer.sendMail({
      from: emailFrom, to: process.env.BUSINESS_EMAIL,
      subject: `New Product Order Received - ${order.orderId}`,
      text: `New Aura Jewels order ${order.orderId}. Customer: ${order.customerName}. Phone: ${order.phone}. Product: ${order.productName}. Quantity: ${order.quantity}. Total: ${formatNpr(order.totalPrice)}. Please call the customer soon to confirm this order.`,
      html: businessOrderEmail(order),
    }),
    mailer.sendMail({
      from: emailFrom, to: order.email, replyTo: process.env.BUSINESS_EMAIL,
      subject: `Your Order Has Been Received - ${brandName}`,
      text: `Hi ${order.customerName},\n\nThank you for your order. We have received it successfully.\n\nProduct: ${order.productName}\nQuantity: ${order.quantity}\nTotal Price: ${formatNpr(order.totalPrice)}\nPayment Method: Cash On Delivery\nOrder ID: ${order.orderId}\n\nOur sales representative will call you soon to confirm your order.\n\nThank you,\n${brandName}`,
      html: customerOrderEmail(order),
    }),
  ]);

  const failed = emails.filter((result) => result.status === "rejected");
  if (failed.length) {
    console.error("[order] email delivery failed after sheet save", { orderId: order.orderId, failedCount: failed.length, code: failed[0].reason?.code || "SMTP_SEND_ERROR" });
    return jsonError("Your order was saved, but we could not send all email notifications. Please do not submit again; Aura Jewels will contact you by phone.", 502, "ORDER_SAVED_NOTIFICATION_FAILED");
  }

  if (nativeForm) {
    const destination = new URL("/thank-you", request.url);
    destination.search = new URLSearchParams({ orderId: order.orderId, product: order.productName, quantity: String(quantity), total: String(order.totalPrice) }).toString();
    return Response.redirect(destination, 303);
  }

  return Response.json({
    ok: true,
    order: {
      orderId: order.orderId,
      productName: order.productName,
      quantity: order.quantity,
      totalPrice: order.totalPrice,
      displayTotal: formatNpr(order.totalPrice),
    },
  }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
