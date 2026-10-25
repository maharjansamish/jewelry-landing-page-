"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { STORE, formatNpr } from "../config";

export default function CheckoutForm({ productId, initialQuantity }) {
  const router = useRouter();
  const [quantity] = useState(initialQuantity);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [savedOrderWarning, setSavedOrderWarning] = useState(false);
  const product = STORE.product;
  const validProduct = productId === product.id;
  const total = validProduct ? product.price * quantity + product.deliveryFee : 0;

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting || !validProduct) return;
    setSubmitting(true);
    setError("");
    setSavedOrderWarning(false);
    const form = new FormData(event.currentTarget);
    const payload = {
      customerName: form.get("customerName"),
      phone: form.get("phone"),
      email: form.get("email"),
      location: form.get("location"),
      productId: product.id,
      quantity,
      website: form.get("website"),
    };

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        setSavedOrderWarning(result.code === "ORDER_SAVED_NOTIFICATION_FAILED");
        const fieldMessages = Array.isArray(result.fields) ? ` ${result.fields.join(" ")}` : "";
        throw new Error((result.error || "We could not submit your order. Please check your details and try again.") + fieldMessages);
      }
      const params = new URLSearchParams({
        orderId: result.order.orderId,
        product: result.order.productName,
        quantity: String(result.order.quantity),
        total: String(result.order.totalPrice),
      });
      if (result.demo) params.set("preview", "true");
      router.push(`/thank-you?${params.toString()}`);
    } catch (submitError) {
      setError(submitError.message || "We could not reach the order service. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <>
      <a className="skip-link" href="#checkout-form">Skip to checkout form</a>
      <header className="border-b border-gold/20 bg-cream"><div className="mx-auto flex h-[76px] max-w-5xl items-center justify-between px-5 sm:px-8"><Link href="/" className="inline-flex items-center" aria-label="Aura Jewels home"><Image src="/aura-jewels-logo.svg" alt="Aura Jewels — Bring your story" width={360} height={100} priority className="h-[40px] w-auto sm:h-[44px]" /></Link><Link href="/" className="text-[10px] font-semibold text-forest underline decoration-gold underline-offset-4">Back to product</Link></div></header>
      <main className="min-h-[calc(100vh-140px)] px-5 py-9 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-[9px] font-semibold uppercase tracking-[.2em] text-forest/70">Cash on Delivery · No online payment</p>
          <h1 className="serif text-5xl leading-none text-forest sm:text-6xl">Complete your <em className="font-normal text-gold">order.</em></h1>
          <p className="mt-3 max-w-xl text-xs leading-6 text-muted sm:text-sm">Share your details and our sales representative will call to confirm the order, delivery timing and final amount.</p>
          {process.env.NODE_ENV === "development" && <p className="mt-5 max-w-xl rounded-xl border border-gold/30 bg-[#f5efdf] px-4 py-3 text-xs leading-5 text-forest">Preview mode: checkout can be demonstrated, but orders are not saved or emailed until order services are configured.</p>}
          {!validProduct ? <div role="alert" className="mt-8 rounded-2xl border border-red-300 bg-red-50 p-5 text-sm text-red-900">This product selection is not valid. Please return to the product page and choose your order again.<Link href="/" className="ml-2 underline">Back to Aura Jewels</Link></div> : (
            <div className="mt-8 grid gap-7 lg:grid-cols-[1.15fr_.85fr] lg:gap-10">
              <form id="checkout-form" method="post" action="/api/order" onSubmit={handleSubmit} className="rounded-3xl border border-gold/20 bg-white/75 p-5 shadow-[0_16px_55px_rgba(25,50,38,.06)] sm:p-8">
                <h2 className="serif text-3xl text-forest">Your details</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-[11px] font-semibold text-ink">Full name<input name="customerName" required autoComplete="name" maxLength={100} placeholder="Your full name" className="min-h-12 rounded-xl border border-forest/15 bg-cream px-4 text-sm font-normal outline-none placeholder:text-muted/70 focus:border-gold" /></label>
                  <label className="grid gap-2 text-[11px] font-semibold text-ink">Phone number<input name="phone" required type="tel" autoComplete="tel" inputMode="tel" maxLength={20} placeholder="98XXXXXXXX" className="min-h-12 rounded-xl border border-forest/15 bg-cream px-4 text-sm font-normal outline-none placeholder:text-muted/70 focus:border-gold" /></label>
                  <label className="grid gap-2 text-[11px] font-semibold text-ink sm:col-span-2">Email address<input name="email" required type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" className="min-h-12 rounded-xl border border-forest/15 bg-cream px-4 text-sm font-normal outline-none placeholder:text-muted/70 focus:border-gold" /></label>
                  <label className="grid gap-2 text-[11px] font-semibold text-ink sm:col-span-2">Exact location<textarea name="location" required autoComplete="street-address" maxLength={500} rows={3} placeholder="Kindly share your exact location" className="resize-y rounded-xl border border-forest/15 bg-cream px-4 py-3 text-sm font-normal outline-none placeholder:text-muted/70 focus:border-gold" /></label>
                </div>
                <input type="hidden" name="productId" value={product.id} />
                <input type="hidden" name="quantity" value={quantity} />
                <label aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
                {error && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs leading-5 text-red-900">{savedOrderWarning ? <><strong>Your order was saved, but email notifications did not complete.</strong> Please do not submit again. Aura Jewels will follow up using your phone number. </> : null}{error}</div>}
                <button type="submit" disabled={submitting} className="mt-6 flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-forest px-6 text-sm font-semibold text-cream transition hover:bg-forest-deep disabled:cursor-wait disabled:opacity-70">{submitting ? "Submitting order…" : "Order now · Cash on Delivery"}</button>
                <p className="mt-3 text-center text-[10px] text-muted">Your details are used to process and confirm this order.</p>
              </form>
              <aside className="h-fit rounded-3xl bg-forest p-5 text-cream sm:p-7">
                <p className="text-[9px] font-semibold uppercase tracking-[.2em] text-gold-light">Order summary</p>
                <h2 className="serif mt-3 text-3xl leading-tight">{product.name}</h2>
                <p className="mt-2 text-[10px] text-cream/65">Product code {product.sku} · {product.material}</p>
                <dl className="mt-7 grid gap-4 border-t border-cream/15 pt-5 text-xs">
                  <div className="flex justify-between gap-4"><dt className="text-cream/65">Quantity</dt><dd>{quantity}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-cream/65">Price per piece</dt><dd>{formatNpr(product.price)}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-cream/65">Delivery fee</dt><dd>{formatNpr(product.deliveryFee)}</dd></div>
                  <div className="flex justify-between gap-4 border-t border-cream/15 pt-4 text-sm font-semibold"><dt>Total · COD</dt><dd className="text-gold-light">{formatNpr(total)}</dd></div>
                </dl>
                <p className="mt-5 rounded-xl bg-white/10 p-3 text-[10px] leading-5 text-cream/75">These are sample amounts. The team will confirm the final amount and delivery details by phone before dispatch.</p>
              </aside>
            </div>
          )}
        </div>
      </main>
      <footer className="border-t border-gold/15 px-5 py-5 text-center text-[9px] text-muted">Aura Jewels · Cash on Delivery · Order support by phone</footer>
    </>
  );
}
