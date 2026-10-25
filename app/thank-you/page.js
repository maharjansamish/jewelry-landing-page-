import Image from "next/image";
import Link from "next/link";
import { formatNpr } from "../config";

export const metadata = { title: "Order received | Aura Jewels", robots: { index: false, follow: false } };

export default async function ThankYouPage({ searchParams }) {
  const params = await searchParams;
  const orderId = params?.orderId || "Order received";
  const product = params?.product || "Your Aura Jewels order";
  const quantity = Math.max(1, Number(params?.quantity) || 1);
  const total = Math.max(0, Number(params?.total) || 0);
  const preview = params?.preview === "true";
  return (
    <main className="grid min-h-screen place-items-center bg-cream px-5 py-12">
      <section className="w-full max-w-xl rounded-[2rem] border border-gold/20 bg-white/70 px-6 py-10 text-center shadow-[0_25px_80px_rgba(23,57,47,.1)] sm:px-12 sm:py-14">
        <Link href="/" aria-label="Aura Jewels home" className="mx-auto mb-6 inline-flex"><Image src="/aura-jewels-logo.svg" alt="Aura Jewels — Bring your story" width={360} height={100} priority className="h-[48px] w-auto" /></Link>
        <span aria-hidden="true" className="mx-auto grid size-16 place-items-center rounded-full border border-gold bg-forest text-2xl text-gold-light">✓</span>
        <p className="mt-7 text-[9px] font-semibold uppercase tracking-[.2em] text-forest/70">{preview ? "Checkout preview" : "Order confirmation"}</p>
        <h1 className="serif mt-3 text-5xl leading-none text-forest sm:text-6xl">{preview ? "Preview complete." : "Thank you for your order!"}</h1>
        <p className="mx-auto mt-4 max-w-sm text-xs leading-6 text-muted">{preview ? "This was a local preview. The order was not saved and no email was sent. Connect Google Sheets and email before accepting real orders." : "Our sales representative will call you soon to confirm your order."}</p>
        <div className="mt-8 rounded-2xl bg-sand p-5 text-left">
          <p className="mb-4 text-[9px] font-semibold uppercase tracking-[.16em] text-forest/70">Order details</p>
          <dl className="grid gap-3 text-xs">
            <div className="flex justify-between gap-4"><dt className="text-muted">Order ID</dt><dd className="font-semibold text-forest">{orderId}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Product</dt><dd className="text-right font-semibold text-forest">{product}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Quantity</dt><dd className="font-semibold text-forest">{quantity}</dd></div>
            {total > 0 && <div className="flex justify-between gap-4"><dt className="text-muted">Total</dt><dd className="font-semibold text-forest">{formatNpr(total)}</dd></div>}
            <div className="flex justify-between gap-4"><dt className="text-muted">Payment method</dt><dd className="font-semibold text-forest">Cash On Delivery</dd></div>
          </dl>
        </div>
        <Link href="/" className="mt-7 flex min-h-[52px] items-center justify-center rounded-full bg-forest px-6 text-xs font-semibold text-cream transition hover:bg-forest-deep">Back to home</Link>
      </section>
    </main>
  );
}
