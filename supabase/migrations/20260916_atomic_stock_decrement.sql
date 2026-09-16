-- PostgreSQL Atomic Stock Reservation Function for Supabase
-- Guarantees atomic row locking (FOR UPDATE) and prevents overselling under concurrent requests

CREATE OR REPLACE FUNCTION deduct_product_stock(
  p_product_id UUID,
  p_variant_weight TEXT,
  p_quantity INT
) RETURNS JSONB AS $$
DECLARE
  v_current_stock INT;
  v_product_name TEXT;
  v_rows_affected INT;
BEGIN
  -- 1. Exclusively lock product row to serialize concurrent purchases
  SELECT stock_quantity, name INTO v_current_stock, v_product_name
  FROM products
  WHERE id = p_product_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Product not found');
  END IF;

  -- 2. Check stock sufficiency
  IF v_current_stock < p_quantity THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', format('Insufficient stock for %s. Available: %s, Requested: %s', v_product_name, v_current_stock, p_quantity)
    );
  END IF;

  -- 3. Atomic stock decrement with strict non-negative check
  UPDATE products
  SET stock_quantity = stock_quantity - p_quantity
  WHERE id = p_product_id AND stock_quantity >= p_quantity;

  GET DIAGNOSTICS v_rows_affected = ROW_COUNT;

  IF v_rows_affected = 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Stock conflict during concurrent transaction');
  END IF;

  -- 4. Decrement variant stock if variant weight specified
  IF p_variant_weight IS NOT NULL AND p_variant_weight <> '' THEN
    UPDATE product_variants
    SET stock_quantity = GREATEST(0, stock_quantity - p_quantity)
    WHERE product_id = p_product_id AND weight = p_variant_weight;
  END IF;

  RETURN jsonb_build_object('success', true, 'remaining_stock', v_current_stock - p_quantity);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
