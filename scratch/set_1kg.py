import json
import re

seed_path = '/Users/maggi/kavya_pickles/src/lib/data/seed-data.ts'

with open(seed_path, 'r') as f:
    content = f.read()

# Parse INITIAL_PRODUCTS block
start_marker = 'export const INITIAL_PRODUCTS: Product[] = '
start_pos = content.find(start_marker)
end_marker = ';\n\nexport const INITIAL_ORDERS'
end_pos = content.find(end_marker)

if start_pos != -1 and end_pos != -1:
    json_str = content[start_pos + len(start_marker):end_pos]
    products = json.loads(json_str)

    # 20 Veg pickle IDs
    veg_ids = {
        'prod-avakaya': 400,
        'prod-tomato': 400,
        'prod-pandu-mirchi': 400,
        'prod-gongura': 600,
        'prod-nimmakaya': 400,
        'prod-dabbakaya': 400,
        'prod-vendu-mirchi-gongura': 400,
        'prod-allam': 400,
        'prod-pudina': 400,
        'prod-kothimira': 400,
        'prod-chintakaya': 400,
        'prod-usiri': 400,
        'prod-mamidi-thokku': 400,
        'prod-kakarakaya': 600,
        'prod-vellulli': 400,
        'prod-munagakaya': 400,
        'prod-karivepaku': 400,
        'prod-maagaya': 600,
        'prod-all-veg-mixed': 400,
        'prod-cauliflower': 400,
    }

    for prod in products:
        if prod['id'] in veg_ids:
            target_price = veg_ids[prod['id']]
            target_mrp = 499 if target_price == 400 else 699
            
            prod['weight'] = '1kg'
            prod['price'] = target_price
            prod['mrp'] = target_mrp
            
            # Re-order and update variants so 1kg is default (first) with exact price
            prefix = prod['id'].replace('prod-', '')
            prod['variants'] = [
                { "id": f"var-{prefix}-1kg", "product_id": prod['id'], "weight": "1kg", "price": target_price, "mrp": target_mrp, "stock_quantity": prod.get('stock_quantity', 50) },
                { "id": f"var-{prefix}-500g", "product_id": prod['id'], "weight": "500g", "price": int(target_price * 0.55), "mrp": int(target_mrp * 0.55), "stock_quantity": 30 },
                { "id": f"var-{prefix}-250g", "product_id": prod['id'], "weight": "250g", "price": int(target_price * 0.3), "mrp": int(target_mrp * 0.3), "stock_quantity": 20 }
            ]

    updated_json = json.dumps(products, indent=2)
    new_content = content[:start_pos + len(start_marker)] + updated_json + content[end_pos:]

    with open(seed_path, 'w') as f:
        f.write(new_content)

    print("Successfully set default weight to 1kg with exact prices for all 20 veg pickles!")
else:
    print("Could not locate INITIAL_PRODUCTS block")
