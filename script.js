/*
 * AURA JEWELS — EDITABLE STORE DETAILS
 * Replace the bracketed values below with your real business information.
 */
const CONFIG = {
  whatsappNumber: "977XXXXXXXXXX", // Country code + number, digits only. Replace before launch.
  generalMessage: "Hi Aura Jewels, I want to order from your collection.",
  instagram: "[YOUR INSTAGRAM HANDLE]",
  phone: "[YOUR PHONE NUMBER]",
  address: "[YOUR ADDRESS]",
  products: [
    { name: "Sajilo Gold-Tone Hoops", price: "[PRICE]", image: "images/product-hoops.svg", alt: "Gold-tone hoop earrings on a warm cream background" },
    { name: "Maya Pendant Necklace", price: "[PRICE]", image: "images/product-necklace.svg", alt: "Delicate pendant necklace displayed on a warm cream background" },
    { name: "Saanjh Statement Earrings", price: "[PRICE]", image: "images/product-earrings.svg", alt: "Statement drop earrings on a warm cream background" },
    { name: "Komal Everyday Bracelet", price: "[PRICE]", image: "images/product-bracelet.svg", alt: "Minimal bracelet arranged on a warm cream background" },
    { name: "Aarohi Gift Set", price: "[PRICE]", image: "images/product-gift.svg", alt: "Jewellery gift set arranged in a small box" },
    { name: "Tara Occasion Ring", price: "[PRICE]", image: "images/product-ring.svg", alt: "A gold-tone ring shown close up" }
  ]
};

function whatsappUrl(message) {
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

const generalMessage = whatsappUrl(CONFIG.generalMessage);
document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  link.href = generalMessage;
});

const productGrid = document.querySelector("#product-grid");
CONFIG.products.forEach((product, index) => {
  const card = document.createElement("article");
  card.className = "product-card reveal";
  const hasPrice = product.price && !product.price.includes("[");
  const priceMessage = hasPrice ? ` (Rs ${product.price})` : "";
  const message = `Hi Aura Jewels, I want to order ${product.name}${priceMessage}.`;
  card.innerHTML = `
    <a class="product-photo" href="${whatsappUrl(message)}" target="_blank" rel="noopener noreferrer" aria-label="Ask about ${product.name} on WhatsApp">
      <img src="${product.image}" alt="${product.alt}" width="720" height="860" loading="lazy" decoding="async">
      <span class="product-number">0${index + 1}</span>
    </a>
    <div class="product-info"><div><h3>${product.name}</h3><p class="product-price">Rs ${product.price}</p></div>
      <a class="text-link product-order" href="${whatsappUrl(message)}" target="_blank" rel="noopener noreferrer">Order this <span aria-hidden="true">↗</span></a>
    </div>`;
  productGrid.append(card);
});

document.querySelector("[data-instagram]").textContent = CONFIG.instagram;
document.querySelector("[data-instagram]").href = `https://www.instagram.com/${CONFIG.instagram.replace(/^@/, "")}/`;
document.querySelector("[data-phone]").textContent = CONFIG.phone;
document.querySelector("[data-address]").textContent = CONFIG.address;
document.querySelector("[data-year]").textContent = new Date().getFullYear();

// Meta Pixel and GA4 hooks: add your IDs before enabling the snippets in <head>.
document.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-whatsapp], .product-order, .product-photo, .floating-whatsapp");
  if (!link) return;
  if (typeof window.fbq === "function") window.fbq("track", "Contact");
  if (typeof window.gtag === "function") window.gtag("event", "contact", { method: "WhatsApp" });
});

const floatingButton = document.querySelector(".floating-whatsapp");
const hero = document.querySelector("#home");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(([entry]) => {
    floatingButton.classList.toggle("is-visible", !entry.isIntersecting);
  }, { threshold: 0.08 });
  observer.observe(hero);
} else {
  window.addEventListener("scroll", () => floatingButton.classList.toggle("is-visible", window.scrollY > hero.offsetHeight), { passive: true });
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");
if (!reducedMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else revealItems.forEach((item) => item.classList.add("is-visible"));
