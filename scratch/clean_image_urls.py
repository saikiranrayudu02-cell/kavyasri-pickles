seed_path = '/Users/maggi/kavya_pickles/src/lib/data/seed-data.ts'

with open(seed_path, 'r') as f:
    content = f.read()

# Replace all ?v=20 with empty string
cleaned_content = content.replace('?v=20', '')

with open(seed_path, 'w') as f:
    f.write(cleaned_content)

print("Successfully stripped all ?v=20 query params from image URLs in seed-data.ts!")
