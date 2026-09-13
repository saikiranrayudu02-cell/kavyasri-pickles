import { Category, Product, Order, Coupon, Review, Customer, StoreSettings, FlashUpdate } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-veg',
    name: 'Veg Pickles',
    slug: 'veg-pickles',
    description: 'Authentic homemade vegetarian pickles crafted with traditional recipes and premium ingredients.',
    image_url: '/images/pickles/avakaya.jpg',
    is_active: true,
    display_order: 1,
  },
  {
    id: 'cat-nonveg',
    name: 'Authentic Non-Veg Pickles',
    slug: 'authentic-non-veg-pickles',
    description: 'Slow-cooked succulent meat & seafood pickles prepared with age-old royal recipes.',
    image_url: '/images/pickles/chicken.jpg',
    is_active: true,
    display_order: 2,
  },
  {
    id: 'cat-andhra',
    name: 'Spicy Andhra Delights',
    slug: 'spicy-andhra-delights',
    description: 'Fiery and bold flavors from the heart of Andhra Pradesh, famous for Guntur chillies and gongura.',
    image_url: '/images/pickles/gongura.jpg',
    is_active: true,
    display_order: 3,
  },
  {
    id: 'cat-seasonal',
    name: 'Seasonal & Gourmet Specials',
    slug: 'seasonal-gourmet-specials',
    description: 'Limited edition small-batch batches made with fresh seasonal produce like wild gooseberries and winter veggies.',
    image_url: '/images/pickles/garlic.jpg',
    is_active: true,
    display_order: 4,
  },
  {
    id: 'cat-combos',
    name: 'Handcrafted Combo Jars',
    slug: 'handcrafted-combo-jars',
    description: 'Curated value packs and gift sets of our most loved homemade pickle varieties.',
    image_url: '/images/pickles/hero.jpg',
    is_active: true,
    display_order: 5,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    "id": "prod-avakaya",
    "category_id": "cat-veg",
    "category_name": "Veg Pickles",
    "name": "Avakaya Pickle",
    "slug": "avakaya-pickle",
    "short_description": "Authentic Andhra raw mango avakaya pickle made with stone-ground Guntur chillies & cold-pressed sesame oil.",
    "description": "Our traditional Avakaya Pickle is crafted with fresh, hand-cut raw Ramkela mangoes, sun-cured with stone-ground Guntur red chillies, fragrant mustard powder, garlic, and pure gingelly oil following an authentic heirloom Andhra recipe.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "250g",
    "stock_quantity": 60,
    "sku": "KP-AVK-250",
    "spice_level": "Extra Hot",
    "dietary": "veg",
    "shelf_life": "12 Months",
    "storage_instructions": "Store in a cool dry place. Always use a dry spoon.",
    "ingredients": [
      "Raw Mango Pieces",
      "Cold-Pressed Sesame Oil",
      "Guntur Red Chilli Powder",
      "Mustard Powder",
      "Garlic",
      "Sea Salt",
      "Turmeric"
    ],
    "images": [
      "/images/pickles/avakaya.jpg"
    ],
    "is_featured": true,
    "is_active": true,
    "rating": 4.9,
    "reviews_count": 152,
    "variants": [
      {
        "id": "var-avk-250",
        "product_id": "prod-avakaya",
        "weight": "250g",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 60
      },
      {
        "id": "var-avk-500",
        "product_id": "prod-avakaya",
        "weight": "500g",
        "price": 749,
        "mrp": 899,
        "stock_quantity": 35
      },
      {
        "id": "var-avk-1kg",
        "product_id": "prod-avakaya",
        "weight": "1kg",
        "price": 1399,
        "mrp": 1599,
        "stock_quantity": 20
      }
    ],
    "created_at": "2026-08-01T10:00:00Z"
  },
  {
    "id": "prod-tomato",
    "category_id": "cat-veg",
    "category_name": "Veg Pickles",
    "name": "Tomato Pickle",
    "slug": "tomato-pickle",
    "short_description": "Rich red country tomato pickle slow-simmered with tamarind pulp, mustard, and curry leaves.",
    "description": "Juicy vine-ripened tomatoes slow-reduced with tamarind, red chilli oil, mustard seeds, and fried curry leaves to create a rich savory tomato thokku pickle perfect with hot rice, idlis, and parathas.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "250g",
    "stock_quantity": 50,
    "sku": "KP-TOM-250",
    "spice_level": "Medium",
    "dietary": "veg",
    "shelf_life": "9 Months",
    "storage_instructions": "Store in a cool dry place. Use a clean dry spoon.",
    "ingredients": [
      "Country Desi Tomatoes",
      "Tamarind Pulp",
      "Sesame Oil",
      "Red Chilli Powder",
      "Mustard Seeds",
      "Curry Leaves",
      "Asafoetida",
      "Salt"
    ],
    "images": [
      "/images/pickles/tomato.jpg"
    ],
    "is_featured": true,
    "is_active": true,
    "rating": 4.8,
    "reviews_count": 88,
    "variants": [
      {
        "id": "var-tom-250",
        "product_id": "prod-tomato",
        "weight": "250g",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 50
      },
      {
        "id": "var-tom-500",
        "product_id": "prod-tomato",
        "weight": "500g",
        "price": 749,
        "mrp": 899,
        "stock_quantity": 30
      },
      {
        "id": "var-tom-1kg",
        "product_id": "prod-tomato",
        "weight": "1kg",
        "price": 1399,
        "mrp": 1599,
        "stock_quantity": 15
      }
    ],
    "created_at": "2026-08-02T10:00:00Z"
  },
  {
    "id": "prod-pandu-mirchi",
    "category_id": "cat-veg",
    "category_name": "Veg Pickles",
    "name": "Pandu Mirchi Pickle",
    "slug": "pandu-mirchi-pickle",
    "short_description": "Fiery Andhra red chilli pickle made from ripe red chillies, tamarind, and garlic.",
    "description": "Authentic Andhra Pandu Mirchi Pachadi crafted with freshly harvested ripe red chillies coarsely ground with wild tamarind, plump garlic cloves, and cold-pressed gingelly oil for an unmatched spicy explosion.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "250g",
    "stock_quantity": 45,
    "sku": "KP-PND-250",
    "spice_level": "Extra Hot",
    "dietary": "veg",
    "shelf_life": "12 Months",
    "storage_instructions": "Keep jar lid closed tightly. Keep away from direct sunlight.",
    "ingredients": [
      "Ripe Red Chillies",
      "Tamarind",
      "Garlic",
      "Sesame Oil",
      "Mustard Seeds",
      "Salt",
      "Fenugreek"
    ],
    "images": [
      "/images/pickles/pandu_mirchi.jpg"
    ],
    "is_featured": true,
    "is_active": true,
    "rating": 4.9,
    "reviews_count": 110,
    "variants": [
      {
        "id": "var-pnd-250",
        "product_id": "prod-pandu-mirchi",
        "weight": "250g",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 45
      },
      {
        "id": "var-pnd-500",
        "product_id": "prod-pandu-mirchi",
        "weight": "500g",
        "price": 749,
        "mrp": 899,
        "stock_quantity": 25
      },
      {
        "id": "var-pnd-1kg",
        "product_id": "prod-pandu-mirchi",
        "weight": "1kg",
        "price": 1399,
        "mrp": 1599,
        "stock_quantity": 12
      }
    ],
    "created_at": "2026-08-03T10:00:00Z"
  },
  {
    "id": "prod-gongura",
    "category_id": "cat-veg",
    "category_name": "Veg Pickles",
    "name": "Gongura Pickle",
    "slug": "gongura-pickle",
    "short_description": "Authentic tangy sorrel leaf pickle slow-roasted with roasted red chillies and garlic.",
    "description": "Handpicked fresh red sorrel leaves slow-cooked in fragrant cold-pressed sesame oil, tempered with sun-dried red chillies, garlic, and fenugreek. Delivers the legendary tangy Andhra taste.",
    "price": 600,
    "mrp": 699,
    "discount_percent": 14,
    "weight": "250g",
    "stock_quantity": 50,
    "sku": "KP-GON-250",
    "spice_level": "Hot",
    "dietary": "veg",
    "shelf_life": "9 Months",
    "storage_instructions": "Store at room temperature. Keep submerged in spiced oil.",
    "ingredients": [
      "Sorrel (Gongura) Leaves",
      "Sesame Oil",
      "Dry Red Chillies",
      "Garlic",
      "Mustard",
      "Fenugreek",
      "Salt"
    ],
    "images": [
      "/images/pickles/gongura.jpg"
    ],
    "is_featured": true,
    "is_active": true,
    "rating": 4.8,
    "reviews_count": 125,
    "variants": [
      {
        "id": "var-gon-250",
        "product_id": "prod-gongura",
        "weight": "250g",
        "price": 600,
        "mrp": 699,
        "stock_quantity": 50
      },
      {
        "id": "var-gon-500",
        "product_id": "prod-gongura",
        "weight": "500g",
        "price": 1099,
        "mrp": 1249,
        "stock_quantity": 30
      },
      {
        "id": "var-gon-1kg",
        "product_id": "prod-gongura",
        "weight": "1kg",
        "price": 1999,
        "mrp": 2299,
        "stock_quantity": 15
      }
    ],
    "created_at": "2026-08-04T10:00:00Z"
  },
  {
    "id": "prod-nimmakaya",
    "category_id": "cat-veg",
    "category_name": "Veg Pickles",
    "name": "Nimmakaya Pickle",
    "slug": "nimmakaya-pickle",
    "short_description": "Traditional sun-cured yellow lemon pickle with spicy salt seasoning & mustard seeds.",
    "description": "Fresh kagzi lemons sun-cured for 21 days with rock salt, yellow mustard, and spicy red chilli powder to create a lip-smacking digestion-boosting tangy lemon pickle.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "250g",
    "stock_quantity": 55,
    "sku": "KP-NMK-250",
    "spice_level": "Medium",
    "dietary": "veg",
    "shelf_life": "18 Months",
    "storage_instructions": "Store in a dry place. Gets better with age.",
    "ingredients": [
      "Yellow Lemons",
      "Red Chilli Powder",
      "Mustard Seeds",
      "Carom Seeds",
      "Turmeric",
      "Rock Salt"
    ],
    "images": [
      "/images/pickles/nimmakaya.jpg"
    ],
    "is_featured": false,
    "is_active": true,
    "rating": 4.7,
    "reviews_count": 75,
    "variants": [
      {
        "id": "var-nmk-250",
        "product_id": "prod-nimmakaya",
        "weight": "250g",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 55
      },
      {
        "id": "var-nmk-500",
        "product_id": "prod-nimmakaya",
        "weight": "500g",
        "price": 749,
        "mrp": 899,
        "stock_quantity": 30
      },
      {
        "id": "var-nmk-1kg",
        "product_id": "prod-nimmakaya",
        "weight": "1kg",
        "price": 1399,
        "mrp": 1599,
        "stock_quantity": 15
      }
    ],
    "created_at": "2026-08-05T10:00:00Z"
  },
  {
    "id": "prod-dabbakaya",
    "category_id": "cat-veg",
    "category_name": "Veg Pickles",
    "name": "Dabbakaya Pickle",
    "slug": "dabbakaya-pickle",
    "short_description": "Authentic South Indian citron pickle seasoned with fenugreek & roasted mustard oil.",
    "description": "Hand-harvested Indian citron (Dabbakaya) cured with traditional spices, split fenugreek, mustard, and gingelly oil, offering a rare combination of citrus aroma and savory spice.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "250g",
    "stock_quantity": 40,
    "sku": "KP-DBK-250",
    "spice_level": "Medium",
    "dietary": "veg",
    "shelf_life": "12 Months",
    "storage_instructions": "Keep jar closed tight in a dry cool place.",
    "ingredients": [
      "Citron (Dabbakaya)",
      "Gingelly Oil",
      "Red Chilli Powder",
      "Mustard Powder",
      "Fenugreek",
      "Salt"
    ],
    "images": [
      "/images/pickles/dabbakaya.jpg"
    ],
    "is_featured": false,
    "is_active": true,
    "rating": 4.8,
    "reviews_count": 62,
    "variants": [
      {
        "id": "var-dbk-250",
        "product_id": "prod-dabbakaya",
        "weight": "250g",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 40
      },
      {
        "id": "var-dbk-500",
        "product_id": "prod-dabbakaya",
        "weight": "500g",
        "price": 749,
        "mrp": 899,
        "stock_quantity": 20
      },
      {
        "id": "var-dbk-1kg",
        "product_id": "prod-dabbakaya",
        "weight": "1kg",
        "price": 1399,
        "mrp": 1599,
        "stock_quantity": 10
      }
    ],
    "created_at": "2026-08-06T10:00:00Z"
  },
  {
    "id": "prod-vendu-mirchi-gongura",
    "category_id": "cat-veg",
    "category_name": "Veg Pickles",
    "name": "Vendu Mirchi Gongura Pickle",
    "slug": "vendu-mirchi-gongura-pickle",
    "short_description": "Sun-dried red chillies blended with Gongura sorrel leaves and garlic.",
    "description": "Crisp sun-dried whole red chillies braised with sour Gongura sorrel leaves, roasted mustard seeds, garlic, and sesame oil to create a fiery regional Andhra favorite.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "250g",
    "stock_quantity": 48,
    "sku": "KP-VMG-250",
    "spice_level": "Extra Hot",
    "dietary": "veg",
    "shelf_life": "9 Months",
    "storage_instructions": "Keep in a dry container. Use dry spoon.",
    "ingredients": [
      "Dried Red Chillies",
      "Sorrel (Gongura) Leaves",
      "Garlic",
      "Sesame Oil",
      "Mustard",
      "Salt"
    ],
    "images": [
      "/images/pickles/vendu_mirchi_gongura.jpg"
    ],
    "is_featured": false,
    "is_active": true,
    "rating": 4.9,
    "reviews_count": 82,
    "variants": [
      {
        "id": "var-vmg-250",
        "product_id": "prod-vendu-mirchi-gongura",
        "weight": "250g",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 48
      },
      {
        "id": "var-vmg-500",
        "product_id": "prod-vendu-mirchi-gongura",
        "weight": "500g",
        "price": 749,
        "mrp": 899,
        "stock_quantity": 28
      },
      {
        "id": "var-vmg-1kg",
        "product_id": "prod-vendu-mirchi-gongura",
        "weight": "1kg",
        "price": 1399,
        "mrp": 1599,
        "stock_quantity": 12
      }
    ],
    "created_at": "2026-08-07T10:00:00Z"
  },
  {
    "id": "prod-allam",
    "category_id": "cat-veg",
    "category_name": "Veg Pickles",
    "name": "Allam Pickle",
    "slug": "allam-pickle",
    "short_description": "Rich Andhra ginger pickle with tamarind, organic jaggery, and spices.",
    "description": "Freshly grated ginger root slow-cooked with thick tamarind pulp, organic dark jaggery, red chilli powder, and sesame oil tempering. Perfectly balances sweet, tangy, and spicy notes.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "250g",
    "stock_quantity": 50,
    "sku": "KP-ALM-250",
    "spice_level": "Medium",
    "dietary": "veg",
    "shelf_life": "9 Months",
    "storage_instructions": "Store in a cool place away from moisture.",
    "ingredients": [
      "Fresh Ginger Root",
      "Tamarind",
      "Jaggery",
      "Red Chilli Powder",
      "Sesame Oil",
      "Salt"
    ],
    "images": [
      "/images/pickles/allam.jpg"
    ],
    "is_featured": true,
    "is_active": true,
    "rating": 4.8,
    "reviews_count": 95,
    "variants": [
      {
        "id": "var-alm-250",
        "product_id": "prod-allam",
        "weight": "250g",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 50
      },
      {
        "id": "var-alm-500",
        "product_id": "prod-allam",
        "weight": "500g",
        "price": 749,
        "mrp": 899,
        "stock_quantity": 30
      },
      {
        "id": "var-alm-1kg",
        "product_id": "prod-allam",
        "weight": "1kg",
        "price": 1399,
        "mrp": 1599,
        "stock_quantity": 14
      }
    ],
    "created_at": "2026-08-08T10:00:00Z"
  },
  {
    "id": "prod-pudina",
    "category_id": "cat-veg",
    "category_name": "Veg Pickles",
    "name": "Pudina Pickle",
    "slug": "pudina-pickle",
    "short_description": "Fresh mint leaf pickle seasoned with garlic, tamarind, and cold-pressed oil.",
    "description": "Aromatic fresh garden mint (pudina) leaves roasted with green chillies, tamarind pulp, garlic cloves, and gingelly oil, creating a refreshing yet zesty pickle.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "250g",
    "stock_quantity": 42,
    "sku": "KP-PDN-250",
    "spice_level": "Medium",
    "dietary": "veg",
    "shelf_life": "6 Months",
    "storage_instructions": "Keep refrigerated after opening for optimal freshness.",
    "ingredients": [
      "Fresh Mint Leaves",
      "Garlic",
      "Tamarind",
      "Green Chillies",
      "Sesame Oil",
      "Salt"
    ],
    "images": [
      "/images/pickles/pudina.jpg"
    ],
    "is_featured": false,
    "is_active": true,
    "rating": 4.7,
    "reviews_count": 68,
    "variants": [
      {
        "id": "var-pdn-250",
        "product_id": "prod-pudina",
        "weight": "250g",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 42
      },
      {
        "id": "var-pdn-500",
        "product_id": "prod-pudina",
        "weight": "500g",
        "price": 749,
        "mrp": 899,
        "stock_quantity": 22
      },
      {
        "id": "var-pdn-1kg",
        "product_id": "prod-pudina",
        "weight": "1kg",
        "price": 1399,
        "mrp": 1599,
        "stock_quantity": 10
      }
    ],
    "created_at": "2026-08-09T10:00:00Z"
  },
  {
    "id": "prod-kothimira",
    "category_id": "cat-veg",
    "category_name": "Veg Pickles",
    "name": "Kothimira Pickle",
    "slug": "kothimira-pickle",
    "short_description": "Fresh coriander cilantro leaf pickle with tamarind, garlic, and spices.",
    "description": "Farm-fresh green coriander (cilantro) leaves ground coarsely with tamarind, garlic, red chillies, and tempered in pure cold-pressed oil for an invigorating taste.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "250g",
    "stock_quantity": 40,
    "sku": "KP-KTM-250",
    "spice_level": "Medium",
    "dietary": "veg",
    "shelf_life": "6 Months",
    "storage_instructions": "Store in a dry place. Keep spoon clean.",
    "ingredients": [
      "Fresh Coriander Leaves",
      "Tamarind",
      "Garlic",
      "Red Chilli Powder",
      "Sesame Oil",
      "Salt"
    ],
    "images": [
      "/images/pickles/kothimira.jpg"
    ],
    "is_featured": false,
    "is_active": true,
    "rating": 4.7,
    "reviews_count": 54,
    "variants": [
      {
        "id": "var-ktm-250",
        "product_id": "prod-kothimira",
        "weight": "250g",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 40
      },
      {
        "id": "var-ktm-500",
        "product_id": "prod-kothimira",
        "weight": "500g",
        "price": 749,
        "mrp": 899,
        "stock_quantity": 20
      },
      {
        "id": "var-ktm-1kg",
        "product_id": "prod-kothimira",
        "weight": "1kg",
        "price": 1399,
        "mrp": 1599,
        "stock_quantity": 10
      }
    ],
    "created_at": "2026-08-10T10:00:00Z"
  },
  {
    "id": "prod-chintakaya",
    "category_id": "cat-veg",
    "category_name": "Veg Pickles",
    "name": "Chintakaya Pickle",
    "slug": "chintakaya-pickle",
    "short_description": "Authentic raw green tamarind pickle crushed with green chillies & mustard temper.",
    "description": "Tender raw green tamarind pods crushed with green chillies, turmeric, salt, and seasoned with mustard-curry leaf tempering. A legendary tangy rustic delicacy.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "250g",
    "stock_quantity": 45,
    "sku": "KP-CHK-250",
    "spice_level": "Hot",
    "dietary": "veg",
    "shelf_life": "12 Months",
    "storage_instructions": "Store in glass or ceramic jar.",
    "ingredients": [
      "Raw Green Tamarind Pods",
      "Green Chillies",
      "Turmeric",
      "Sesame Oil",
      "Mustard Seeds",
      "Salt"
    ],
    "images": [
      "/images/pickles/chintakaya.jpg"
    ],
    "is_featured": false,
    "is_active": true,
    "rating": 4.8,
    "reviews_count": 79,
    "variants": [
      {
        "id": "var-ctk-250",
        "product_id": "prod-chintakaya",
        "weight": "250g",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 45
      },
      {
        "id": "var-ctk-500",
        "product_id": "prod-chintakaya",
        "weight": "500g",
        "price": 749,
        "mrp": 899,
        "stock_quantity": 25
      },
      {
        "id": "var-ctk-1kg",
        "product_id": "prod-chintakaya",
        "weight": "1kg",
        "price": 1399,
        "mrp": 1599,
        "stock_quantity": 12
      }
    ],
    "created_at": "2026-08-11T10:00:00Z"
  },
  {
    "id": "prod-usiri",
    "category_id": "cat-veg",
    "category_name": "Veg Pickles",
    "name": "Usiri Pickle",
    "slug": "usiri-pickle",
    "short_description": "Whole Indian gooseberry (amla) pickle infused with red chilli mustard spice.",
    "description": "Plump whole Indian amla gooseberries steamed and cured in spicy Guntur red chilli powder, stone-ground mustard, fenugreek, and cold-pressed gingelly oil.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "250g",
    "stock_quantity": 50,
    "sku": "KP-USR-250",
    "spice_level": "Hot",
    "dietary": "veg",
    "shelf_life": "12 Months",
    "storage_instructions": "Store in a cool dry pantry. Keeps amla fresh.",
    "ingredients": [
      "Whole Indian Amla Gooseberries",
      "Red Chilli Powder",
      "Mustard Powder",
      "Fenugreek",
      "Sesame Oil",
      "Salt"
    ],
    "images": [
      "/images/pickles/usiri.jpg"
    ],
    "is_featured": true,
    "is_active": true,
    "rating": 4.9,
    "reviews_count": 102,
    "variants": [
      {
        "id": "var-usr-250",
        "product_id": "prod-usiri",
        "weight": "250g",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 50
      },
      {
        "id": "var-usr-500",
        "product_id": "prod-usiri",
        "weight": "500g",
        "price": 749,
        "mrp": 899,
        "stock_quantity": 30
      },
      {
        "id": "var-usr-1kg",
        "product_id": "prod-usiri",
        "weight": "1kg",
        "price": 1399,
        "mrp": 1599,
        "stock_quantity": 15
      }
    ],
    "created_at": "2026-08-12T10:00:00Z"
  },
  {
    "id": "prod-mamidi-thokku",
    "category_id": "cat-veg",
    "category_name": "Veg Pickles",
    "name": "Mamidi Thokku Pickle",
    "slug": "mamidi-thokku-pickle",
    "short_description": "Shredded raw mango thokku pickle with red chilli powder & garlic.",
    "description": "Finely grated raw green mango strands marinated with spicy red chillies, garlic, mustard seeds, and sesame oil. Spreads effortlessly over warm rice and flatbreads.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "250g",
    "stock_quantity": 52,
    "sku": "KP-MTK-250",
    "spice_level": "Hot",
    "dietary": "veg",
    "shelf_life": "12 Months",
    "storage_instructions": "Store tightly closed in cool dark space.",
    "ingredients": [
      "Grated Raw Green Mango",
      "Red Chilli Powder",
      "Garlic",
      "Mustard Powder",
      "Sesame Oil",
      "Salt"
    ],
    "images": [
      "/images/pickles/mamidi_thokku.jpg"
    ],
    "is_featured": false,
    "is_active": true,
    "rating": 4.8,
    "reviews_count": 84,
    "variants": [
      {
        "id": "var-mtk-250",
        "product_id": "prod-mamidi-thokku",
        "weight": "250g",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 52
      },
      {
        "id": "var-mtk-500",
        "product_id": "prod-mamidi-thokku",
        "weight": "500g",
        "price": 749,
        "mrp": 899,
        "stock_quantity": 32
      },
      {
        "id": "var-mtk-1kg",
        "product_id": "prod-mamidi-thokku",
        "weight": "1kg",
        "price": 1399,
        "mrp": 1599,
        "stock_quantity": 14
      }
    ],
    "created_at": "2026-08-13T10:00:00Z"
  },
  {
    "id": "prod-kakarakaya",
    "category_id": "cat-veg",
    "category_name": "Veg Pickles",
    "name": "Kakarakaya Pickle",
    "slug": "kakarakaya-pickle",
    "short_description": "Crispy bitter gourd pickle cooked with tamarind, jaggery, and aromatic spices.",
    "description": "Crisp-fried bitter gourd roundels folded into a rich tamarind, jaggery, and red chilli masala gravy. The unique balance of bitter, sweet, sour, and spicy makes it a gourmet treat.",
    "price": 600,
    "mrp": 699,
    "discount_percent": 14,
    "weight": "250g",
    "stock_quantity": 40,
    "sku": "KP-KKA-250",
    "spice_level": "Medium",
    "dietary": "veg",
    "shelf_life": "9 Months",
    "storage_instructions": "Keep jar dry. Use a clean dry spoon.",
    "ingredients": [
      "Bitter Gourd (Kakarakaya)",
      "Tamarind",
      "Jaggery",
      "Red Chilli Powder",
      "Sesame Oil",
      "Salt"
    ],
    "images": [
      "/images/pickles/kakarakaya.jpg"
    ],
    "is_featured": false,
    "is_active": true,
    "rating": 4.7,
    "reviews_count": 61,
    "variants": [
      {
        "id": "var-kka-250",
        "product_id": "prod-kakarakaya",
        "weight": "250g",
        "price": 600,
        "mrp": 699,
        "stock_quantity": 40
      },
      {
        "id": "var-kka-500",
        "product_id": "prod-kakarakaya",
        "weight": "500g",
        "price": 1099,
        "mrp": 1249,
        "stock_quantity": 20
      },
      {
        "id": "var-kka-1kg",
        "product_id": "prod-kakarakaya",
        "weight": "1kg",
        "price": 1999,
        "mrp": 2299,
        "stock_quantity": 10
      }
    ],
    "created_at": "2026-08-14T10:00:00Z"
  },
  {
    "id": "prod-vellulli",
    "category_id": "cat-veg",
    "category_name": "Veg Pickles",
    "name": "Vellulli Pickle",
    "slug": "vellulli-pickle",
    "short_description": "Whole garlic clove pickle drenched in mustard oil and roasted Indian spices.",
    "description": "Immunity-boosting whole peeled garlic cloves soaked in cold-pressed mustard oil, crushed yellow mustard, and spicy Guntur red chilli powder.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "250g",
    "stock_quantity": 50,
    "sku": "KP-VEL-250",
    "spice_level": "Hot",
    "dietary": "veg",
    "shelf_life": "12 Months",
    "storage_instructions": "Keep jar tightly closed in a cool dry area.",
    "ingredients": [
      "Peeled Whole Garlic Cloves",
      "Mustard Oil",
      "Red Chilli Powder",
      "Mustard Seeds",
      "Fenugreek",
      "Salt"
    ],
    "images": [
      "/images/pickles/vellulli.jpg"
    ],
    "is_featured": true,
    "is_active": true,
    "rating": 4.8,
    "reviews_count": 98,
    "variants": [
      {
        "id": "var-vel-250",
        "product_id": "prod-vellulli",
        "weight": "250g",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 50
      },
      {
        "id": "var-vel-500",
        "product_id": "prod-vellulli",
        "weight": "500g",
        "price": 749,
        "mrp": 899,
        "stock_quantity": 30
      },
      {
        "id": "var-vel-1kg",
        "product_id": "prod-vellulli",
        "weight": "1kg",
        "price": 1399,
        "mrp": 1599,
        "stock_quantity": 15
      }
    ],
    "created_at": "2026-08-15T10:00:00Z"
  },
  {
    "id": "prod-munagakaya",
    "category_id": "cat-veg",
    "category_name": "Veg Pickles",
    "name": "Munagakaya Pickle",
    "slug": "munagakaya-pickle",
    "short_description": "Tender drumstick pickle cooked in spicy Andhra tamarind mustard marinade.",
    "description": "Fresh cut drumstick (munagakaya) pieces marinated in fiery Andhra red chilli masala, tamarind pulp, and tempered in pure sesame oil.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "250g",
    "stock_quantity": 40,
    "sku": "KP-MNK-250",
    "spice_level": "Hot",
    "dietary": "veg",
    "shelf_life": "6 Months",
    "storage_instructions": "Refrigerate after opening for extended freshness.",
    "ingredients": [
      "Drumstick Pieces",
      "Tamarind Pulp",
      "Red Chilli Powder",
      "Sesame Oil",
      "Mustard Seeds",
      "Salt"
    ],
    "images": [
      "/images/pickles/munagakaya.jpg"
    ],
    "is_featured": false,
    "is_active": true,
    "rating": 4.7,
    "reviews_count": 52,
    "variants": [
      {
        "id": "var-mnk-250",
        "product_id": "prod-munagakaya",
        "weight": "250g",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 40
      },
      {
        "id": "var-mnk-500",
        "product_id": "prod-munagakaya",
        "weight": "500g",
        "price": 749,
        "mrp": 899,
        "stock_quantity": 20
      },
      {
        "id": "var-mnk-1kg",
        "product_id": "prod-munagakaya",
        "weight": "1kg",
        "price": 1399,
        "mrp": 1599,
        "stock_quantity": 10
      }
    ],
    "created_at": "2026-08-16T10:00:00Z"
  },
  {
    "id": "prod-karivepaku",
    "category_id": "cat-veg",
    "category_name": "Veg Pickles",
    "name": "Karivepaku Pickle",
    "slug": "karivepaku-pickle",
    "short_description": "Fragrant curry leaf pickle coarsely ground with tamarind, garlic & gingelly oil.",
    "description": "Fresh, dark green curry leaves dry-roasted and coarsely ground with roasted red chillies, tamarind, garlic, and sesame oil. Rich in iron and digestive wellness.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "250g",
    "stock_quantity": 45,
    "sku": "KP-KVP-250",
    "spice_level": "Medium",
    "dietary": "veg",
    "shelf_life": "9 Months",
    "storage_instructions": "Store in a cool dry place. Keep jar tightly closed.",
    "ingredients": [
      "Fresh Curry Leaves",
      "Tamarind",
      "Garlic",
      "Red Chilli Powder",
      "Sesame Oil",
      "Salt"
    ],
    "images": [
      "/images/pickles/karivepaku.jpg"
    ],
    "is_featured": false,
    "is_active": true,
    "rating": 4.8,
    "reviews_count": 71,
    "variants": [
      {
        "id": "var-kvp-250",
        "product_id": "prod-karivepaku",
        "weight": "250g",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 45
      },
      {
        "id": "var-kvp-500",
        "product_id": "prod-karivepaku",
        "weight": "500g",
        "price": 749,
        "mrp": 899,
        "stock_quantity": 25
      },
      {
        "id": "var-kvp-1kg",
        "product_id": "prod-karivepaku",
        "weight": "1kg",
        "price": 1399,
        "mrp": 1599,
        "stock_quantity": 12
      }
    ],
    "created_at": "2026-08-17T10:00:00Z"
  },
  {
    "id": "prod-maagaya",
    "category_id": "cat-veg",
    "category_name": "Veg Pickles",
    "name": "Maagaya Pickle",
    "slug": "maagaya-pickle",
    "short_description": "Sun-dried raw mango slice pickle with fenugreek & mustard oil.",
    "description": "Peeled raw mango strips sun-dried and cured with roasted fenugreek powder, Guntur red chilli powder, turmeric, and gingelly oil for an authentic vintage Andhra flavor.",
    "price": 600,
    "mrp": 699,
    "discount_percent": 14,
    "weight": "250g",
    "stock_quantity": 40,
    "sku": "KP-MGY-250",
    "spice_level": "Hot",
    "dietary": "veg",
    "shelf_life": "12 Months",
    "storage_instructions": "Store in ceramic martaban or glass jar.",
    "ingredients": [
      "Peeled Raw Mango Strips",
      "Fenugreek Powder",
      "Red Chilli Powder",
      "Sesame Oil",
      "Mustard",
      "Salt"
    ],
    "images": [
      "/images/pickles/maagaya.jpg"
    ],
    "is_featured": true,
    "is_active": true,
    "rating": 4.9,
    "reviews_count": 90,
    "variants": [
      {
        "id": "var-mgy-250",
        "product_id": "prod-maagaya",
        "weight": "250g",
        "price": 600,
        "mrp": 699,
        "stock_quantity": 40
      },
      {
        "id": "var-mgy-500",
        "product_id": "prod-maagaya",
        "weight": "500g",
        "price": 1099,
        "mrp": 1249,
        "stock_quantity": 20
      },
      {
        "id": "var-mgy-1kg",
        "product_id": "prod-maagaya",
        "weight": "1kg",
        "price": 1999,
        "mrp": 2299,
        "stock_quantity": 10
      }
    ],
    "created_at": "2026-08-18T10:00:00Z"
  },
  {
    "id": "prod-all-veg-mixed",
    "category_id": "cat-veg",
    "category_name": "Veg Pickles",
    "name": "All Veg Mixed Pickle",
    "slug": "all-veg-mixed-pickle",
    "short_description": "Assorted farm vegetables cured in traditional Indian red chilli mustard spice oil.",
    "description": "A delicious medley of diced raw mangoes, carrots, green chillies, cauliflower, and lime cured in a fragrant red chilli and yellow mustard oil blend.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "250g",
    "stock_quantity": 55,
    "sku": "KP-MXV-250",
    "spice_level": "Medium",
    "dietary": "veg",
    "shelf_life": "12 Months",
    "storage_instructions": "Store in a cool dry location.",
    "ingredients": [
      "Raw Mango",
      "Carrots",
      "Cauliflower",
      "Green Chillies",
      "Lime",
      "Mustard Oil",
      "Spices",
      "Salt"
    ],
    "images": [
      "/images/pickles/all_veg_mixed.jpg"
    ],
    "is_featured": false,
    "is_active": true,
    "rating": 4.8,
    "reviews_count": 85,
    "variants": [
      {
        "id": "var-mxv-250",
        "product_id": "prod-all-veg-mixed",
        "weight": "250g",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 55
      },
      {
        "id": "var-mxv-500",
        "product_id": "prod-all-veg-mixed",
        "weight": "500g",
        "price": 749,
        "mrp": 899,
        "stock_quantity": 35
      },
      {
        "id": "var-mxv-1kg",
        "product_id": "prod-all-veg-mixed",
        "weight": "1kg",
        "price": 1399,
        "mrp": 1599,
        "stock_quantity": 18
      }
    ],
    "created_at": "2026-08-19T10:00:00Z"
  },
  {
    "id": "prod-cauliflower",
    "category_id": "cat-veg",
    "category_name": "Veg Pickles",
    "name": "Cauliflower Pickle",
    "slug": "cauliflower-pickle",
    "short_description": "Crunchy cauliflower florets pickled with mustard, ginger, and Kashmiri chilli.",
    "description": "Fresh crispy white cauliflower florets blanched and marinated in Kashmiri red chilli, ginger, yellow mustard powder, and mustard oil for a crunchy gourmet pickle experience.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "250g",
    "stock_quantity": 45,
    "sku": "KP-CLF-250",
    "spice_level": "Medium",
    "dietary": "veg",
    "shelf_life": "6 Months",
    "storage_instructions": "Keep jar closed tight in cool dry place.",
    "ingredients": [
      "Cauliflower Florets",
      "Mustard Oil",
      "Kashmiri Red Chilli",
      "Yellow Mustard",
      "Ginger",
      "Salt"
    ],
    "images": [
      "/images/pickles/cauliflower.jpg"
    ],
    "is_featured": false,
    "is_active": true,
    "rating": 4.7,
    "reviews_count": 64,
    "variants": [
      {
        "id": "var-clf-250",
        "product_id": "prod-cauliflower",
        "weight": "250g",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 45
      },
      {
        "id": "var-clf-500",
        "product_id": "prod-cauliflower",
        "weight": "500g",
        "price": 749,
        "mrp": 899,
        "stock_quantity": 25
      },
      {
        "id": "var-clf-1kg",
        "product_id": "prod-cauliflower",
        "weight": "1kg",
        "price": 1399,
        "mrp": 1599,
        "stock_quantity": 12
      }
    ],
    "created_at": "2026-08-20T10:00:00Z"
  },
  {
    "id": "prod-chicken",
    "category_id": "cat-nonveg",
    "category_name": "Authentic Non-Veg Pickles",
    "name": "Country Style Boneless Chicken Pickle",
    "slug": "country-style-chicken-pickle",
    "short_description": "Crisp-fried juicy tender boneless chicken bites tossed in fiery Andhra masala gravy.",
    "description": "An absolute non-veg delicacy! Fresh boneless chicken cubes are marinated in lemon juice and organic turmeric, crisp-fried till golden, and folded into a rich gravy.",
    "price": 349,
    "mrp": 399,
    "discount_percent": 13,
    "weight": "250g",
    "stock_quantity": 38,
    "sku": "KP-CHK-250",
    "spice_level": "Hot",
    "dietary": "non-veg",
    "shelf_life": "6 Months",
    "storage_instructions": "Refrigeration recommended after opening.",
    "ingredients": [
      "Fresh Boneless Chicken",
      "Cold-Pressed Oil",
      "Ginger-Garlic Paste",
      "Red Chilli Powder",
      "Spices",
      "Salt"
    ],
    "images": [
      "/images/pickles/chicken.jpg"
    ],
    "is_featured": true,
    "is_active": true,
    "rating": 4.9,
    "reviews_count": 196,
    "variants": [
      {
        "id": "var-chk-250",
        "product_id": "prod-chicken",
        "weight": "250g",
        "price": 349,
        "mrp": 399,
        "stock_quantity": 38
      },
      {
        "id": "var-chk-500",
        "product_id": "prod-chicken",
        "weight": "500g",
        "price": 599,
        "mrp": 699,
        "stock_quantity": 25
      },
      {
        "id": "var-chk-1kg",
        "product_id": "prod-chicken",
        "weight": "1kg",
        "price": 1099,
        "mrp": 1249,
        "stock_quantity": 12
      }
    ],
    "created_at": "2026-08-10T12:00:00Z"
  },
  {
    "id": "prod-mutton",
    "category_id": "cat-nonveg",
    "category_name": "Authentic Non-Veg Pickles",
    "name": "Royal Hyderabadi Mutton Pickle (Gosht ka Achar)",
    "slug": "royal-hyderabadi-mutton-pickle",
    "short_description": "Tender boneless mutton cubes slow-braised in aromatic Nizami roasted spices.",
    "description": "Boneless morsels of fresh, tender mutton slow-braised in their own juices and infused with Tellicherry black pepper and roasted Kashmiri chillies.",
    "price": 449,
    "mrp": 499,
    "discount_percent": 10,
    "weight": "250g",
    "stock_quantity": 24,
    "sku": "KP-MTN-250",
    "spice_level": "Hot",
    "dietary": "non-veg",
    "shelf_life": "6 Months",
    "storage_instructions": "Refrigeration recommended after opening.",
    "ingredients": [
      "Boneless Mutton",
      "Mustard Oil",
      "Black Pepper",
      "Red Chilli",
      "Ginger-Garlic",
      "Spices"
    ],
    "images": [
      "/images/pickles/mutton.jpg"
    ],
    "is_featured": true,
    "is_active": true,
    "rating": 4.9,
    "reviews_count": 145,
    "variants": [
      {
        "id": "var-mtn-250",
        "product_id": "prod-mutton",
        "weight": "250g",
        "price": 449,
        "mrp": 499,
        "stock_quantity": 24
      },
      {
        "id": "var-mtn-500",
        "product_id": "prod-mutton",
        "weight": "500g",
        "price": 799,
        "mrp": 899,
        "stock_quantity": 15
      },
      {
        "id": "var-mtn-1kg",
        "product_id": "prod-mutton",
        "weight": "1kg",
        "price": 1499,
        "mrp": 1699,
        "stock_quantity": 8
      }
    ],
    "created_at": "2026-08-20T10:00:00Z"
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'KP-2026-8941',
    user_id: 'usr-1',
    customer_name: 'Ananya Sharma',
    customer_email: 'ananya.sharma@example.com',
    customer_phone: '+91 98765 43210',
    shipping_address: {
      fullName: 'Ananya Sharma',
      phone: '+91 98765 43210',
      addressLine1: 'Flat 402, Sai Residency, Road No. 12, Banjara Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034',
    },
    items: [
      {
        id: 'item-1',
        product_id: 'prod-mango',
        product_name: 'Avakaya Mango Pickle (Spicy Andhra Style)',
        image: '/images/pickles/mango.jpg',
        variant_weight: '500g',
        price: 449,
        quantity: 2,
        total: 898,
      },
      {
        id: 'item-2',
        product_id: 'prod-gongura',
        product_name: 'Authentic Andhra Gongura Pickle (Red Sorrel)',
        image: '/images/pickles/gongura.jpg',
        variant_weight: '250g',
        price: 229,
        quantity: 1,
        total: 229,
      },
    ],
    subtotal: 1127,
    discount: 112,
    coupon_code: 'KAVYA10',
    shipping_fee: 0,
    tax: 50,
    total_amount: 1065,
    payment_status: 'Paid',
    payment_method: 'Razorpay UPI',
    razorpay_order_id: 'order_O9k12jKLms',
    razorpay_payment_id: 'pay_N8s9d8f7sdf',
    order_status: 'Shipped',
    timeline: [
      { status: 'Pending', timestamp: '2026-09-08 14:20', note: 'Order placed online' },
      { status: 'Confirmed', timestamp: '2026-09-08 14:25', note: 'Payment verified via Razorpay' },
      { status: 'Processing', timestamp: '2026-09-09 10:00', note: 'Packed in vacuum-sealed glass jar' },
      { status: 'Packed', timestamp: '2026-09-09 16:30', note: 'Parcel boxed with cushioning' },
      { status: 'Shipped', timestamp: '2026-09-10 09:15', note: 'Dispatched via BlueDart AWB#89218273' },
    ],
    created_at: '2026-09-08T14:20:00Z',
  },
  {
    id: 'KP-2026-8942',
    user_id: 'usr-2',
    customer_name: 'Vikram Reddy',
    customer_email: 'vikram.reddy@example.com',
    customer_phone: '+91 98490 11223',
    shipping_address: {
      fullName: 'Vikram Reddy',
      phone: '+91 98490 11223',
      addressLine1: 'Villa 14, Rainbow Meadows, Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560066',
    },
    items: [
      {
        id: 'item-3',
        product_id: 'prod-chicken',
        product_name: 'Country Style Boneless Chicken Pickle',
        image: '/images/pickles/chicken.jpg',
        variant_weight: '500g',
        price: 599,
        quantity: 1,
        total: 599,
      },
      {
        id: 'item-4',
        product_id: 'prod-mutton',
        product_name: 'Royal Hyderabadi Mutton Pickle',
        image: '/images/pickles/mutton.jpg',
        variant_weight: '500g',
        price: 799,
        quantity: 1,
        total: 799,
      },
    ],
    subtotal: 1398,
    discount: 100,
    coupon_code: 'WELCOME100',
    shipping_fee: 0,
    tax: 65,
    total_amount: 1363,
    payment_status: 'Paid',
    payment_method: 'Razorpay UPI',
    razorpay_order_id: 'order_O9k13jKLmt',
    razorpay_payment_id: 'pay_N8s9d8f7sdg',
    order_status: 'Processing',
    timeline: [
      { status: 'Pending', timestamp: '2026-09-10 11:10', note: 'Order placed online' },
      { status: 'Confirmed', timestamp: '2026-09-10 11:15', note: 'Payment verified via Razorpay' },
      { status: 'Processing', timestamp: '2026-09-10 17:00', note: 'Fresh batch preparation underway' },
    ],
    created_at: '2026-09-10T11:10:00Z',
  },
  {
    id: 'KP-2026-8943',
    user_id: 'usr-3',
    customer_name: 'Sowmya Iyer',
    customer_email: 'sowmya.iyer@example.com',
    customer_phone: '+91 94440 55667',
    shipping_address: {
      fullName: 'Sowmya Iyer',
      phone: '+91 94440 55667',
      addressLine1: '18/4, 2nd Main Road, R.A. Puram',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600028',
    },
    items: [
      {
        id: 'item-5',
        product_id: 'prod-lemon',
        product_name: 'Traditional Tangy Lemon Pickle',
        image: '/images/pickles/lemon.jpg',
        variant_weight: '500g',
        price: 349,
        quantity: 1,
        total: 349,
      },
    ],
    subtotal: 349,
    discount: 0,
    shipping_fee: 50,
    tax: 17,
    total_amount: 416,
    payment_status: 'Paid',
    payment_method: 'Cards',
    razorpay_order_id: 'order_O9k14jKLmu',
    razorpay_payment_id: 'pay_N8s9d8f7sdh',
    order_status: 'Delivered',
    timeline: [
      { status: 'Pending', timestamp: '2026-09-04 09:30', note: 'Order placed' },
      { status: 'Confirmed', timestamp: '2026-09-04 09:32', note: 'Payment confirmed' },
      { status: 'Processing', timestamp: '2026-09-04 14:00', note: 'Dispatched from kitchen' },
      { status: 'Packed', timestamp: '2026-09-05 10:00', note: 'Handed to courier' },
      { status: 'Shipped', timestamp: '2026-09-05 18:00', note: 'In transit' },
      { status: 'Out for Delivery', timestamp: '2026-09-07 08:30', note: 'Out with delivery agent' },
      { status: 'Delivered', timestamp: '2026-09-07 14:15', note: 'Package delivered successfully' },
    ],
    created_at: '2026-09-04T09:30:00Z',
  },
  {
    id: 'KP-2026-8944',
    user_id: 'usr-4',
    customer_name: 'Rajesh Mukherjee',
    customer_email: 'rajesh.m@example.com',
    customer_phone: '+91 98300 77889',
    shipping_address: {
      fullName: 'Rajesh Mukherjee',
      phone: '+91 98300 77889',
      addressLine1: 'Flat 3B, Lake View Apts, Salt Lake Sector 1',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700064',
    },
    items: [
      {
        id: 'item-6',
        product_id: 'prod-trio-combo',
        product_name: 'Traditional Pickle Trio Combo Pack',
        image: '/images/pickles/hero.jpg',
        variant_weight: '3 x 250g',
        price: 649,
        quantity: 1,
        total: 649,
      },
    ],
    subtotal: 649,
    discount: 50,
    coupon_code: 'DESI50',
    shipping_fee: 0,
    tax: 30,
    total_amount: 629,
    payment_status: 'Paid',
    payment_method: 'Razorpay UPI',
    razorpay_order_id: 'order_O9k15jKLmv',
    razorpay_payment_id: 'pay_N8s9d8f7sdi',
    order_status: 'Confirmed',
    timeline: [
      { status: 'Pending', timestamp: '2026-09-11 07:15', note: 'Order placed' },
      { status: 'Confirmed', timestamp: '2026-09-11 07:18', note: 'Payment verified' },
    ],
    created_at: '2026-09-11T07:15:00Z',
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'usr-1',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 98765 43210',
    created_at: '2026-06-15',
    orders_count: 5,
    total_spent: 4680,
    last_order_date: '2026-09-08',
    status: 'Active',
  },
  {
    id: 'usr-2',
    name: 'Vikram Reddy',
    email: 'vikram.reddy@example.com',
    phone: '+91 98490 11223',
    created_at: '2026-07-02',
    orders_count: 3,
    total_spent: 3820,
    last_order_date: '2026-09-10',
    status: 'Active',
  },
  {
    id: 'usr-3',
    name: 'Sowmya Iyer',
    email: 'sowmya.iyer@example.com',
    phone: '+91 94440 55667',
    created_at: '2026-07-20',
    orders_count: 2,
    total_spent: 1250,
    last_order_date: '2026-09-04',
    status: 'Active',
  },
  {
    id: 'usr-4',
    name: 'Rajesh Mukherjee',
    email: 'rajesh.m@example.com',
    phone: '+91 98300 77889',
    created_at: '2026-08-11',
    orders_count: 1,
    total_spent: 629,
    last_order_date: '2026-09-11',
    status: 'Active',
  },
  {
    id: 'usr-5',
    name: 'Pooja Agarwal',
    email: 'pooja.agarwal@example.com',
    phone: '+91 98200 33445',
    created_at: '2026-08-14',
    orders_count: 4,
    total_spent: 3190,
    last_order_date: '2026-09-01',
    status: 'Active',
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    product_id: 'prod-mango',
    product_name: 'Avakaya Mango Pickle (Spicy Andhra Style)',
    user_id: 'usr-1',
    customer_name: 'Ananya S.',
    rating: 5,
    comment: 'Tastes exactly like how my Ammamma (grandmother) used to make it in Godavari district! The oil level, spice heat, and mango crunch are 100% authentic.',
    is_approved: true,
    is_verified_purchase: true,
    created_at: '2026-09-05',
  },
  {
    id: 'rev-2',
    product_id: 'prod-chicken',
    product_name: 'Country Style Boneless Chicken Pickle',
    user_id: 'usr-2',
    customer_name: 'Vikram R.',
    rating: 5,
    comment: 'Hands down the best chicken pickle online. Fresh chicken chunks with no rubbery texture, and the curry leaf aroma is mind blowing.',
    is_approved: true,
    is_verified_purchase: true,
    created_at: '2026-09-07',
  },
  {
    id: 'rev-3',
    product_id: 'prod-gongura',
    product_name: 'Authentic Andhra Gongura Pickle (Red Sorrel)',
    user_id: 'usr-3',
    customer_name: 'Sowmya I.',
    rating: 5,
    comment: 'The tartness of genuine gongura with roasted garlic is pure bliss with hot ghee rice! Must try.',
    is_approved: true,
    is_verified_purchase: true,
    created_at: '2026-09-08',
  },
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  store_name: 'Kavyasri Pickles',
  tagline: 'Traditional Taste. Homemade Love.',
  store_email: 'support@kavyasripickles.com',
  store_phone: '+91 91234 56789',
  whatsapp_number: '+91 91234 56789',
  fssai_number: '13624014000189',
  gst_number: '36AAECK1294F1Z3',
  address: 'Plot 42, Heritage Kitchens, Near RTC Colony, Kothapet',
  city: 'Hyderabad',
  state: 'Telangana',
  pincode: '500035',
  free_shipping_threshold: 499,
  standard_shipping_fee: 50,
  razorpay_key_id: 'rzp_test_kavyaPickles2026',
  is_razorpay_live: false,
  enable_cod: true,
};

export const INITIAL_FLASH_UPDATES: FlashUpdate[] = [
  {
    id: 'flash-1',
    badge: '⚡ FLASH RESTOCK',
    message: 'Fresh Batches of Homemade Avakaya & Gongura Pachadi just packed! 100% Wood-Pressed Cold Sesame Oil.',
    link_url: '/shop?category=cat-veg',
    link_text: 'Shop Fresh Batches →',
    theme: 'crimson',
    is_active: true,
    priority: 1,
    display_mode: 'marquee',
    marquee_direction: 'ltr',
    stock_alert_text: '🌿 Just Cured Today',
    created_at: '2026-09-11T12:00:00.000Z',
    updated_at: '2026-09-11T12:00:00.000Z',
  },
  {
    id: 'flash-2',
    badge: '🔥 LIMITED BATCH',
    message: 'Special Boneless Country Chicken & Mutton Pickles freshly cured — Only 25 jars available today!',
    link_url: '/shop?category=cat-nonveg',
    link_text: 'Order Now →',
    theme: 'amber',
    is_active: true,
    priority: 2,
    display_mode: 'marquee',
    marquee_direction: 'ltr',
    stock_alert_text: '⏳ Only 18 Jars Left',
    created_at: '2026-09-11T12:00:00.000Z',
    updated_at: '2026-09-11T12:00:00.000Z',
  },
  {
    id: 'flash-3',
    badge: '🎁 FESTIVE DEAL',
    message: 'Use code TRADITION10 for 10% OFF + Free Express Home Delivery on all orders above ₹499!',
    link_url: '/shop',
    link_text: 'Claim 10% Off →',
    theme: 'gold',
    is_active: true,
    priority: 3,
    display_mode: 'marquee',
    marquee_direction: 'ltr',
    stock_alert_text: '🚚 Free Express Shipping',
    created_at: '2026-09-11T12:00:00.000Z',
    updated_at: '2026-09-11T12:00:00.000Z',
  },
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c-1',
    code: 'KAVYA10',
    discount_type: 'percentage',
    discount_value: 10,
    min_order_amount: 399,
    max_discount: 100,
    expiry_date: '2026-12-31T23:59:59Z',
    usage_limit: 500,
    times_used: 142,
    is_active: true,
  },
  {
    id: 'c-2',
    code: 'WELCOME50',
    discount_type: 'fixed',
    discount_value: 50,
    min_order_amount: 299,
    expiry_date: '2026-12-31T23:59:59Z',
    usage_limit: 1000,
    times_used: 320,
    is_active: true,
  },
];


