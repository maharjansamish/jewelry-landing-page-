# Aura Jewels COD Order Funnel

Mobile-first Next.js App Router site for the Aura Jewels brass temple necklace and matching earring set. The selected design is catalogue code **553005**, shown in four cropped PNG views in `public/`.

## Product settings to confirm

The catalogue does not list a price. `app/config.js` currently uses **Rs 2,499** for the set and **Rs 150** for delivery as editable launch estimates. Comparable brass temple sets currently span a wide range in Nepal, so confirm the actual cost, margin, and delivery charge before advertising. The product copy describes a brass base and gold-tone finish; confirm that the finish and included pieces match the stock you will ship.

Edit `app/config.js` to change the product name, product code, price, optional compare-at price, delivery fee, material/copy, image list, and product highlights. Add customer testimonials only when they are genuine and approved for publication. There is no reels section because no reel links were supplied.

## Stack and order flow

- **Next.js App Router + Tailwind CSS:** one project serves the product page, checkout, thank-you page, and server-side order endpoint.
- **Product selection:** the landing page sends a product ID and quantity to `/checkout`. The customer enters their name, phone, email, and exact location. Product name, unit price, delivery fee, and total are displayed as read-only order details.
- **Server validation:** `POST /api/order` accepts customer details plus product ID and quantity only. It checks required fields and recomputes all prices from `app/config.js`; submitted browser prices are never trusted.
- **Google Sheets:** a server-only service-account client creates the requested header row if the tab is empty, then appends the order. No spreadsheet credentials are included in the browser bundle.
- **Email notifications:** after the row is saved, Nodemailer sends an order notice to `BUSINESS_EMAIL` and an order receipt to the customer. SMTP is verified before saving. The API returns success only if both emails send. If email delivery fails after the row is saved, checkout warns the customer not to submit again.
- **Thank-you page:** only after the API reports success does checkout redirect to `/thank-you` with the order ID and summary.

The spreadsheet append and email services are not a single distributed transaction. If one email fails after another was delivered, the API logs the failure and reports the saved order ID in server logs; the customer is told not to submit a duplicate.

## Run locally

Requirements: Node.js 20.9+ and npm.

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://127.0.0.1:3000` in local development. When required integration settings are missing, checkout uses a clearly marked preview that does not save customer data or send email. Real orders require a valid Google service-account key, access to the spreadsheet, and working SMTP credentials. The API validates and saves the order before sending the business notification and customer confirmation.

## Google Spreadsheet setup

1. Create a Google Spreadsheet and a tab named `Orders` (or set another name in `GOOGLE_SHEET_TAB_NAME`).
2. The `Orders` tab is created if it does not exist, and its first row is created automatically when empty. The columns are: `Order ID`, `Date & Time`, `Customer Name`, `Phone Number`, `Email Address`, `Exact Location`, `Product Name`, `Quantity`, `Price Per Piece`, `Delivery Fee`, `Total Price`, `Payment Method`, `Order Status`, `Notes`.
3. To get the Sheet ID, copy the text between `/d/` and `/edit` in the spreadsheet URL and set it as `GOOGLE_SHEET_ID`.
4. In Google Cloud Console, create a project, enable the Google Sheets API, and create a service account. Set its email as `GOOGLE_SERVICE_ACCOUNT_EMAIL` and its private key as `GOOGLE_PRIVATE_KEY`.
5. Share the spreadsheet with the service account email and grant **Editor** access. The API cannot write until this is done.
6. In row 1, select the header row and choose **Data → Create a filter** to filter or sort orders.
7. Select the `Order Status` data cells in column L, choose **Data → Data validation → Add rule → Dropdown**, and add: `New Order`, `Order Confirmed`, `Order Ongoing`, `Delivered`, `Cancelled`.

For a private key in `.env.local`, keep it quoted. Google private keys with literal `\n` characters are converted to line breaks by the API route. Never commit `.env.local` or share the private key.

## Email setup

The current implementation uses Nodemailer with authenticated SMTP. For Gmail, use the account’s 2-Step Verification and create an App Password for SMTP; do not use the normal account password. Set `SMTP_USER` to the authenticated Gmail address, `SMTP_PASS` to the App Password, `SMTP_HOST=smtp.gmail.com`, and `SMTP_PORT=465`. Set `EMAIL_FROM` to that same account or an authorized Gmail “Send mail as” alias. `BUSINESS_EMAIL` is the order notification recipient and the customer reply-to address. The address provided for this project is `maharjansamish@gmail.com`.

## Environment variables

Copy `.env.example` to `.env.local` locally and add the private values. In Vercel, add the same values in **Project → Settings → Environment Variables** for Preview and Production. Keep every secret server-only; never prefix credentials with `NEXT_PUBLIC_`.

- `NEXT_PUBLIC_SITE_URL`: site origin used for metadata/schema.
- `BUSINESS_EMAIL`: order notification and customer reply-to address.
- `EMAIL_FROM`: authenticated Gmail address or configured send-as alias.
- `BRAND_NAME`: reserved for future email customization; current copy uses Aura Jewels in `app/config.js`.
- `GOOGLE_SHEET_ID`, `GOOGLE_SHEET_TAB_NAME`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`: Sheets API settings.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: SMTP connection. Port 465 uses TLS.
- `EMAIL_SERVICE_API_KEY`: optional and unused by the SMTP implementation.
- `FRONTEND_URL`: exact deployed site origin, e.g. `https://your-project.vercel.app`; the order route checks browser request origin against it.

## Deploy to Vercel

1. Push the project to a private GitHub repository. Confirm `.env.local` is ignored and is not in the commit.
2. In Vercel, import the repository. Vercel detects Next.js; use the project root as the Root Directory and leave the build command as `next build`.
3. Add all environment variables above in Vercel settings, then set `NEXT_PUBLIC_SITE_URL` and `FRONTEND_URL` to the production origin.
4. Deploy. Add the same variables to Preview if you want preview deployments to process test orders. Use a test spreadsheet and inbox for preview.
5. Verify the live product page, a test order, the appended sheet row, both emails, and the thank-you page before running ads.

## Routes

- `/` — product landing page
- `/checkout?product=temple-set-553005&quantity=1` — checkout
- `/thank-you` — successful-order confirmation
- `POST /api/order` — validates, saves, and notifies

## Current limitations to resolve before launch

- Confirm the actual item price, delivery charge, brass finish/material wording, and order return/exchange policy.
- Replace all testimonial placeholders with reviews you have permission to publish.
- Replace the sample amount references in FAQs and checkout copy if your prices differ.
- Set real Google Sheets and Gmail SMTP credentials in the deployment environment and complete a test order.
- Add the Instagram profile, business phone/address, and product video links if you want them displayed.
