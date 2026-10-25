import CheckoutForm from "../components/checkout-form";
import { STORE } from "../config";

export const metadata = { title: "Checkout | Aura Jewels", robots: { index: false, follow: false } };

export default async function CheckoutPage({ searchParams }) {
  const params = await searchParams;
  // This funnel has one featured product. Older or shared checkout links may
  // omit `product`, so keep those links usable by selecting that product.
  // Explicit unknown product IDs still reach the validation message.
  const product = params?.product ?? params?.productId ?? STORE.product.id;
  const quantity = Number(params?.quantity || 1);
  return <CheckoutForm productId={product} initialQuantity={Number.isInteger(quantity) ? Math.min(10, Math.max(1, quantity)) : 1} />;
}
