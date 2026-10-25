import Image from "next/image";
import Link from "next/link";
import ProductShowcase from "./components/product-showcase";
import { STORE, formatNpr } from "./config";

const checkout = `/checkout?product=${encodeURIComponent(STORE.product.id)}&quantity=1`;

function Eyebrow({ children, light = false }) {
  return <p className={`mb-5 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[.2em] ${light ? "text-cream/70" : "text-forest/70"}`}><span className="h-px w-7 bg-gold" />{children}</p>;
}

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="bg-forest px-4 py-2 text-center text-[9px] font-medium tracking-[.12em] text-cream sm:text-[10px]">CASH ON DELIVERY AVAILABLE <span className="mx-2 text-gold-light">·</span> DELIVERY ACROSS NEPAL</div>
      <header className="sticky top-0 z-20 border-b border-gold/15 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="inline-flex items-center" aria-label="Aura Jewels home"><Image src="/aura-jewels-logo.png" alt="Aura Jewels — Bring your story" width={124} height={55} priority className="h-[52px] w-auto sm:h-[58px]" /></Link>
          <Link href={checkout} className="rounded-full border border-forest/25 px-4 py-2 text-[10px] font-semibold text-forest transition hover:bg-forest hover:text-cream sm:px-5 sm:text-xs">Order now <span aria-hidden="true">↗</span></Link>
        </div>
      </header>
      <main id="main">
        <section className="mx-auto grid max-w-7xl items-center gap-8 px-5 pb-14 pt-9 sm:px-8 sm:pb-20 sm:pt-14 lg:min-h-[650px] lg:grid-cols-[1fr_.9fr] lg:gap-14 lg:py-16">
          <div className="order-2 lg:order-1">
            <Eyebrow>Traditional detail, made for your moments</Eyebrow>
            <h1 className="serif max-w-2xl text-[clamp(3.1rem,10vw,6.6rem)] leading-[.86] tracking-[-.045em] text-forest">A little tradition.<br/><em className="font-normal text-gold">A lot of you.</em></h1>
            <p className="mt-6 max-w-lg text-sm leading-7 text-muted sm:text-base">Meet Rang Mahal, a brass temple necklace set with a gold-tone finish and colourful accents. A considered finishing touch for celebrations, weddings and gifts.</p>
            <div className="mt-7 grid max-w-md gap-3 sm:flex">
              <Link href={checkout} className="flex min-h-14 flex-1 items-center justify-center gap-3 rounded-full bg-forest px-6 text-xs font-semibold text-cream shadow-lg shadow-forest/15 transition hover:-translate-y-0.5 hover:bg-forest-deep">Purchase now <span aria-hidden="true">↗</span></Link>
              <a href="#showcase" className="flex min-h-14 flex-1 items-center justify-center gap-3 rounded-full border border-forest/25 px-6 text-xs font-semibold text-forest transition hover:bg-sand">See the details <span aria-hidden="true">↓</span></a>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[10px] text-muted"><span>✓ Cash on Delivery</span><span>✓ Order support by phone</span><span>✓ Price confirmed before dispatch</span></div>
          </div>
          <div className="relative order-1 mx-auto w-full max-w-[550px] lg:order-2">
            <div className="absolute -inset-3 -rotate-2 rounded-[2rem] border border-gold/35 sm:-inset-4" />
            <div className="relative overflow-hidden rounded-[1.6rem] bg-sand shadow-[0_25px_75px_rgba(18,43,36,.18)]">
              {/* The hero deliberately shows one product photo only. */}
              <Image src={STORE.product.images[0].src} alt="Rang Mahal brass temple necklace with matching earrings and red and green accents" width={900} height={760} priority className="aspect-[1.15] w-full object-cover" sizes="(max-width: 1024px) 100vw, 48vw" />
            </div>
            <div className="absolute -bottom-4 left-3 rounded-xl border border-gold/20 bg-cream px-4 py-3 shadow-lg sm:-left-5 sm:px-5"><span className="block text-[8px] uppercase tracking-[.16em] text-muted">The featured set</span><span className="serif text-lg text-forest">{formatNpr(STORE.product.price)}</span></div>
            <span className="absolute -right-2 top-5 grid size-14 place-items-center rounded-full border border-gold bg-cream text-center text-[8px] font-semibold uppercase leading-3 tracking-widest text-forest sm:-right-5 sm:top-8">COD<br/>Nepal</span>
          </div>
        </section>

        <section id="showcase" className="bg-sand px-5 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-7xl"><div className="mx-auto mb-9 max-w-2xl text-center sm:mb-12"><Eyebrow>Look a little closer</Eyebrow><h2 className="serif text-4xl leading-none text-forest sm:text-6xl">A statement with <em className="font-normal text-gold">meaning.</em></h2><p className="mx-auto mt-4 max-w-lg text-xs leading-6 text-muted sm:text-sm">A closer look at the Rang Mahal set. Swipe through the product views, choose your quantity and continue to checkout.</p></div><ProductShowcase/></div>
        </section>

        <section className="bg-forest px-5 py-16 text-cream sm:px-8 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
            <div><Eyebrow light>Why this piece</Eyebrow><h2 className="serif max-w-md text-5xl leading-[.92] sm:text-6xl">A detail that <em className="font-normal text-gold-light">stays with you.</em></h2><p className="mt-5 max-w-sm text-xs leading-6 text-cream/70 sm:text-sm">Traditional inspiration, colour and ornament come together in one matching set. Wear it for the occasion, or give it to someone you love.</p><Link href={checkout} className="mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-gold-light px-6 text-xs font-semibold text-forest transition hover:bg-white">Order now <span aria-hidden="true">↗</span></Link></div>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-cream/15 bg-cream/15 sm:grid-cols-2">
              {[
                ["01", "A complete set", "One necklace and a matching pair of earrings."],
                ["02", "Brass base", "Brass jewellery with a warm gold-tone finish."],
                ["03", "Colourful detail", "Red and green accents bring colour to the look."],
                ["04", "Easy to order", "Send your details and pay Cash on Delivery."],
              ].map(([number, title, copy]) => <article key={number} className="bg-forest p-5 sm:p-7"><span className="text-[9px] tracking-[.16em] text-gold-light">{number}</span><h3 className="serif mt-4 text-2xl">{title}</h3><p className="mt-2 max-w-xs text-[11px] leading-5 text-cream/65">{copy}</p></article>)}
            </div>
          </div>
        </section>

        <section id="reviews" className="px-5 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-9 max-w-xl text-center sm:mb-12"><Eyebrow>Made for meaningful moments</Eyebrow><h2 className="serif text-4xl text-forest sm:text-6xl">Details worth <em className="font-normal text-gold">noticing.</em></h2><p className="mt-3 text-xs leading-5 text-muted">A closer look at the design and thoughtful details of the Rang Mahal set.</p></div>
            <div className="grid gap-4 md:grid-cols-3">{STORE.reviewHighlights.map((highlight, i) => <article key={highlight.title} className="relative flex min-h-56 flex-col rounded-2xl border border-gold/25 bg-white/70 p-6 shadow-[0_12px_34px_rgba(23,57,47,.04)] sm:p-7"><span className="grid size-10 place-items-center rounded-full border border-gold/30 text-[10px] font-semibold tracking-[.12em] text-gold">0{i + 1}</span><h3 className="serif mt-5 text-2xl leading-tight text-forest">{highlight.title}</h3><p className="mt-3 flex-1 text-xs leading-6 text-muted">{highlight.detail}</p><footer className="mt-5 border-t border-gold/15 pt-4 text-[9px] font-semibold uppercase tracking-[.13em] text-gold">Rang Mahal · Design detail</footer></article>)}</div>
          </div>
        </section>

        <section className="bg-[#f2eddf] px-5 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[.75fr_1.25fr] lg:gap-16">
            <div><Eyebrow>Good to know</Eyebrow><h2 className="serif text-5xl leading-[.92] text-forest sm:text-6xl">A few things you might <em className="font-normal text-gold">wonder.</em></h2><p className="mt-5 text-xs leading-6 text-muted sm:text-sm">Our team can answer order questions before your piece is sent.</p><a href="mailto:maharjansamish@gmail.com" className="mt-4 inline-block border-b border-gold pb-1 text-xs font-semibold text-forest">Contact Aura Jewels ↗</a></div>
            <div className="border-t border-gold/25">
              {[
                ["What is this jewellery set made from?", "The set has a brass base with a gold-tone finish. It includes the matching necklace and earrings shown in the product photos."],
                ["Are the photos of the actual design?", "These product views were supplied in the Aura Jewels catalogue. Lighting and screen settings can affect how colours appear. Message us if you would like us to confirm a detail before ordering."],
                ["How does Cash on Delivery work?", "Place your order with your phone number and exact location. Our sales representative will call to confirm the order before it is dispatched. Pay the confirmed amount when it arrives."],
                ["How much is delivery and how long will it take?", `The current sample delivery fee is ${formatNpr(STORE.product.deliveryFee)}. Delivery time depends on your location; we will confirm the fee and expected timing when we call.`],
                ["Can I order this as a gift?", "Yes. Add a note in the location field with the recipient or delivery instructions. We will confirm the details with you before dispatch."],
                ["Can I exchange or return my order?", "Please ask us about the current exchange policy before placing your order. We will explain the policy when we call to confirm."],
              ].map(([question, answer]) => <details key={question} className="group border-b border-gold/25"><summary className="flex min-h-[62px] cursor-pointer list-none items-center justify-between gap-4 py-4 text-xs font-semibold text-forest marker:content-none [&::-webkit-details-marker]:hidden">{question}<span className="shrink-0 text-xl font-light text-gold transition group-open:rotate-45">+</span></summary><p className="max-w-2xl pb-5 pr-8 text-xs leading-6 text-muted">{answer}</p></details>)}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-forest px-5 py-16 text-center text-cream sm:px-8 sm:py-24">
          <span aria-hidden="true" className="serif absolute -right-3 top-0 text-8xl text-gold/20 sm:right-[12%] sm:text-9xl">✳</span><Eyebrow light>Make it part of your moment</Eyebrow><h2 className="serif text-6xl leading-none sm:text-8xl">Find your <em className="font-normal text-gold-light">Aura.</em></h2><p className="mx-auto mt-4 max-w-md text-xs leading-6 text-cream/75 sm:text-sm">Choose your quantity and place your Cash on Delivery order in a few easy steps.</p><Link href={checkout} className="mx-auto mt-7 flex min-h-14 max-w-sm items-center justify-center gap-3 rounded-full bg-gold-light px-7 text-xs font-semibold text-forest transition hover:-translate-y-0.5 hover:bg-white">Buy now · {formatNpr(STORE.product.price)} <span aria-hidden="true">↗</span></Link>
        </section>
      </main>
      <footer className="bg-[#eee7d9] px-5 py-8 text-center sm:px-8"><Link href="/" className="inline-flex" aria-label="Aura Jewels home"><Image src="/aura-jewels-logo.png" alt="Aura Jewels — Bring your story" width={124} height={55} className="h-[62px] w-auto" /></Link><p className="mt-2 text-[10px] text-muted">Traditional detail, made for your moments.</p><div className="mt-5 flex flex-wrap justify-center gap-4 text-[10px] text-forest"><a href="mailto:maharjansamish@gmail.com" className="underline decoration-gold underline-offset-4">maharjansamish@gmail.com</a><a href="#showcase" className="underline decoration-gold underline-offset-4">Featured set</a></div><p className="mt-5 text-[9px] text-muted">© {new Date().getFullYear()} Aura Jewels</p></footer>
    </>
  );
}
