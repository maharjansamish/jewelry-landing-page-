"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { STORE, formatNpr } from "../config";

export default function ProductShowcase() {
  const [selected, setSelected] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const product = STORE.product;
  const total = product.price * quantity + product.deliveryFee;
  const checkoutUrl = `/checkout?product=${encodeURIComponent(product.id)}&quantity=${quantity}`;

  return (
    <div className="grid items-center gap-9 lg:grid-cols-[1.08fr_.92fr] lg:gap-16">
      <div className="min-w-0">
        <div className="relative overflow-hidden rounded-[2rem] border border-gold/20 bg-[#e6ddcc] shadow-[0_24px_70px_rgba(24,44,33,.12)]">
          <Image src={product.images[selected].src} alt={product.images[selected].alt} width={900} height={760} priority className="aspect-[1.15] w-full object-cover" sizes="(max-width: 768px) 100vw, 55vw" />
          <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-[.16em] text-forest">Design {product.sku}</span>
          <button type="button" onClick={() => setSelected((selected + product.images.length - 1) % product.images.length)} aria-label="Previous product image" className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-cream/90 text-xl text-forest shadow">‹</button>
          <button type="button" onClick={() => setSelected((selected + 1) % product.images.length)} aria-label="Next product image" className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-cream/90 text-xl text-forest shadow">›</button>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-3" aria-label="Choose a product photo">
          {product.images.map((image, index) => <button type="button" key={image.src} onClick={() => setSelected(index)} aria-label={`Show product image ${index + 1}`} aria-pressed={selected === index} className={`overflow-hidden rounded-xl border-2 transition ${selected === index ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"}`}><Image src={image.src} alt="" width={220} height={180} className="aspect-[1.15] w-full object-cover" sizes="25vw" /></button>)}
        </div>
      </div>
      <div className="py-2 lg:py-8">
        <p className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.2em] text-forest"><span className="h-px w-7 bg-gold" />The featured piece</p>
        <h2 className="serif text-5xl leading-[.95] tracking-tight text-forest sm:text-6xl">{product.name}</h2>
        <p className="mt-4 text-sm text-muted">A traditional necklace and earring set with a warm gold-tone finish and red-and-green accents. A statement piece for celebrations and thoughtful gifting.</p>
        <p className="mt-2 text-xs text-muted">Material: {product.material}. Includes one necklace and one matching pair of earrings.</p>
        <ul className="mt-6 grid gap-3 text-sm text-ink">
          <li className="flex gap-3"><span className="text-gold">✳</span>Temple-inspired detailing with colourful accents.</li>
          <li className="flex gap-3"><span className="text-gold">✳</span>Matching earrings included with the necklace.</li>
          <li className="flex gap-3"><span className="text-gold">✳</span>Cash on Delivery available in Nepal.</li>
        </ul>
        <div className="my-6 flex items-end gap-3 border-y border-gold/20 py-5"><span className="serif text-4xl text-forest">{formatNpr(product.price)}</span>{product.compareAtPrice && <span className="pb-1 text-sm text-muted line-through">{formatNpr(product.compareAtPrice)}</span>}<span className="pb-1 text-[10px] uppercase tracking-wider text-muted">per set</span></div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <label htmlFor="product-quantity" className="text-xs font-semibold text-ink">Quantity</label>
          <div className="flex items-center rounded-full border border-gold/30 bg-white/70">
            <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity" className="size-11 rounded-full text-lg text-forest hover:bg-sand">−</button>
            <input id="product-quantity" aria-label="Quantity" inputMode="numeric" pattern="[0-9]*" value={quantity} onChange={(event) => setQuantity(Math.min(10, Math.max(1, Number(event.target.value) || 1)))} className="w-10 bg-transparent text-center text-sm font-semibold text-forest outline-none" />
            <button type="button" onClick={() => setQuantity(Math.min(10, quantity + 1))} aria-label="Increase quantity" className="size-11 rounded-full text-lg text-forest hover:bg-sand">+</button>
          </div>
        </div>
        <div className="mt-4 flex justify-between text-xs text-muted"><span>Delivery</span><span>{formatNpr(product.deliveryFee)} · {quantity} {quantity === 1 ? "set" : "sets"}</span></div>
        <div className="mt-2 flex justify-between border-t border-gold/20 pt-3 text-sm font-semibold text-forest"><span>Estimated total</span><span>{formatNpr(total)}</span></div>
        <p className="mt-2 text-[10px] leading-5 text-muted">Sample price and delivery charge. Please confirm the final amounts with Aura Jewels before launch.</p>
        <Link href={checkoutUrl} className="mt-5 flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-forest px-7 text-sm font-semibold text-cream shadow-lg shadow-forest/15 transition hover:-translate-y-0.5 hover:bg-forest-deep">Order this set <span aria-hidden="true">↗</span></Link>
        <p className="mt-3 text-center text-[10px] text-muted">No online payment. Pay cash when your order arrives.</p>
      </div>
    </div>
  );
}
