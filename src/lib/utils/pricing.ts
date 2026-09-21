import { ProductVariant } from '../types';

/**
 * AUTHORITATIVE WEIGHT VARIANT PRICING UTILITY
 * 
 * Rules:
 * 1. Base price of any product is for 1 KG.
 * 2. 250g price = 1 KG price * 0.25
 * 3. 500g price = 1 KG price * 0.50
 * 4. 1 KG price = 1 KG price * 1.00
 * 
 * Exact currency rounding is applied to preserve paise (2 decimal places).
 */

export function normalizeWeightLabel(weight?: string): '250g' | '500g' | '1 KG' {
  if (!weight) return '250g';
  const clean = weight.trim().toLowerCase().replace(/\s+/g, '');
  if (clean === '250g' || clean === '250') return '250g';
  if (clean === '500g' || clean === '500') return '500g';
  if (clean === '1kg' || clean === '1-kg' || clean === '1') return '1 KG';
  return '250g';
}

export function calculateVariantPrices(base1KgPrice: number, base1KgMrp?: number) {
  const price1Kg = Number(base1KgPrice || 0);
  const mrp1Kg = Number(base1KgMrp || price1Kg);

  const price250g = Math.round(price1Kg * 0.25 * 100) / 100;
  const price500g = Math.round(price1Kg * 0.50 * 100) / 100;
  const price1kg = price1Kg;

  const mrp250g = Math.round(mrp1Kg * 0.25 * 100) / 100;
  const mrp500g = Math.round(mrp1Kg * 0.50 * 100) / 100;
  const mrp1kg = mrp1Kg;

  return {
    price250g,
    price500g,
    price1kg,
    mrp250g,
    mrp500g,
    mrp1kg,
  };
}

export function calculatePriceForWeight(base1KgPrice: number, weight?: string): number {
  const normWeight = normalizeWeightLabel(weight);
  const basePrice = Number(base1KgPrice || 0);

  if (normWeight === '250g') {
    return Math.round(basePrice * 0.25 * 100) / 100;
  }
  if (normWeight === '500g') {
    return Math.round(basePrice * 0.50 * 100) / 100;
  }
  return basePrice; // 1 KG
}

export function calculateMrpForWeight(base1KgMrp: number, weight?: string): number {
  const normWeight = normalizeWeightLabel(weight);
  const baseMrp = Number(base1KgMrp || 0);

  if (normWeight === '250g') {
    return Math.round(baseMrp * 0.25 * 100) / 100;
  }
  if (normWeight === '500g') {
    return Math.round(baseMrp * 0.50 * 100) / 100;
  }
  return baseMrp; // 1 KG
}

export function ensureThreeVariants(
  productId: string,
  base1KgPrice: number,
  base1KgMrp?: number,
  stockQty: number = 50
): ProductVariant[] {
  const { price250g, price500g, price1kg, mrp250g, mrp500g, mrp1kg } = calculateVariantPrices(
    base1KgPrice,
    base1KgMrp
  );

  return [
    {
      id: `var-${productId}-250g`,
      product_id: productId,
      weight: '250g',
      price: price250g,
      mrp: mrp250g,
      stock_quantity: stockQty,
    },
    {
      id: `var-${productId}-500g`,
      product_id: productId,
      weight: '500g',
      price: price500g,
      mrp: mrp500g,
      stock_quantity: stockQty,
    },
    {
      id: `var-${productId}-1kg`,
      product_id: productId,
      weight: '1 KG',
      price: price1kg,
      mrp: mrp1kg,
      stock_quantity: stockQty,
    },
  ];
}
