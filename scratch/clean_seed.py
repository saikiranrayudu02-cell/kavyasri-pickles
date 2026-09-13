with open('/Users/maggi/kavya_pickles/src/lib/data/seed-data.ts', 'r') as f:
    text = f.read()

# Find first occurrence of export const INITIAL_ORDERS
orders_pos = text.find('export const INITIAL_ORDERS')
second_orders_pos = text.find('export const INITIAL_ORDERS', orders_pos + 1)

if second_orders_pos != -1:
    text = text[:second_orders_pos]

with open('/Users/maggi/kavya_pickles/src/lib/data/seed-data.ts', 'w') as f:
    f.write(text)

print('Cleaned duplicate exports from seed-data.ts!')
