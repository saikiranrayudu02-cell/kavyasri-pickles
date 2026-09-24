import { Category, Product, Order, Coupon, Review, Customer, StoreSettings, FlashUpdate } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-spices',
    name: 'Spices',
    slug: 'spices',
    description: 'Authentic homemade Andhra-style karam powders and traditional spice blends prepared with carefully selected ingredients.',
    image_url: '/images/pickles/spices_category.jpg',
    is_active: true,
    display_order: 6,
  },
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
  {
    id: 'cat-papads',
    name: 'Papads',
    slug: 'papads',
    description: 'Authentic homemade Andhra traditional odiyalu, papadams, and sun-dried majjiga mirapakayalu.',
    image_url: '/images/pickles/saggu_biyyam_odiyalu.jpg',
    is_active: true,
    display_order: 7,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    "id": "prod-avakaya",
    "category_id": "cat-veg",
    "category_name": "Veg Pickles",
    "name": "Avakaya Pickle",
    "slug": "avakaya-pickle",
    "short_description": "Authentic homemade Andhra-style raw mango pickle prepared with stone-ground Guntur chillies, mustard, and cold-pressed sesame oil.",
    "description": "Our traditional Avakaya Pickle is crafted with fresh, hand-cut raw Ramkela mangoes, sun-cured with stone-ground Guntur red chillies, fragrant mustard powder, garlic, and pure gingelly oil following an authentic heirloom Andhra recipe.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "1kg",
    "stock_quantity": 60,
    "sku": "KP-AVK-1KG",
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
        "id": "var-avk-1kg",
        "product_id": "prod-avakaya",
        "weight": "1kg",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 60
      },
      {
        "id": "var-avk-500g",
        "product_id": "prod-avakaya",
        "weight": "500g",
        "price": 249,
        "mrp": 299,
        "stock_quantity": 35
      },
      {
        "id": "var-avk-250g",
        "product_id": "prod-avakaya",
        "weight": "250g",
        "price": 149,
        "mrp": 199,
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
    "short_description": "Rich red country tomato pickle slow-reduced with tamarind pulp, roasted mustard, and curry leaves.",
    "description": "Juicy vine-ripened tomatoes slow-reduced with tamarind, red chilli oil, mustard seeds, and fried curry leaves to create a rich savory tomato thokku pickle perfect with hot rice, idlis, and parathas.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "1kg",
    "stock_quantity": 50,
    "sku": "KP-TOM-1KG",
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
        "id": "var-tom-1kg",
        "product_id": "prod-tomato",
        "weight": "1kg",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 50
      },
      {
        "id": "var-tom-500g",
        "product_id": "prod-tomato",
        "weight": "500g",
        "price": 249,
        "mrp": 299,
        "stock_quantity": 30
      },
      {
        "id": "var-tom-250g",
        "product_id": "prod-tomato",
        "weight": "250g",
        "price": 149,
        "mrp": 199,
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
    "short_description": "Fiery Andhra red chilli pickle prepared with freshly harvested ripe red chillies, garlic, and wild tamarind.",
    "description": "Authentic Andhra Pandu Mirchi Pachadi crafted with freshly harvested ripe red chillies coarsely ground with wild tamarind, plump garlic cloves, and cold-pressed gingelly oil for an unmatched spicy explosion.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "1kg",
    "stock_quantity": 45,
    "sku": "KP-PND-1KG",
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
        "id": "var-pnd-1kg",
        "product_id": "prod-pandu-mirchi",
        "weight": "1kg",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 45
      },
      {
        "id": "var-pnd-500g",
        "product_id": "prod-pandu-mirchi",
        "weight": "500g",
        "price": 249,
        "mrp": 299,
        "stock_quantity": 25
      },
      {
        "id": "var-pnd-250g",
        "product_id": "prod-pandu-mirchi",
        "weight": "250g",
        "price": 149,
        "mrp": 199,
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
    "short_description": "Authentic tangy sorrel leaf pickle slow-cooked in cold-pressed sesame oil with roasted red chillies and garlic.",
    "description": "Handpicked fresh red sorrel leaves slow-cooked in fragrant cold-pressed sesame oil, tempered with sun-dried red chillies, garlic, and fenugreek. Delivers the legendary tangy Andhra taste.",
    "price": 600,
    "mrp": 699,
    "discount_percent": 14,
    "weight": "1kg",
    "stock_quantity": 50,
    "sku": "KP-GON-1KG",
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
        "id": "var-gon-1kg",
        "product_id": "prod-gongura",
        "weight": "1kg",
        "price": 600,
        "mrp": 699,
        "stock_quantity": 50
      },
      {
        "id": "var-gon-500g",
        "product_id": "prod-gongura",
        "weight": "500g",
        "price": 349,
        "mrp": 399,
        "stock_quantity": 30
      },
      {
        "id": "var-gon-250g",
        "product_id": "prod-gongura",
        "weight": "250g",
        "price": 199,
        "mrp": 249,
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
    "short_description": "Traditional sun-cured yellow lemon pickle seasoned with rock salt, yellow mustard, and spicy red chilli.",
    "description": "Fresh kagzi lemons sun-cured for 21 days with rock salt, yellow mustard, and spicy red chilli powder to create a lip-smacking digestion-boosting tangy lemon pickle.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "1kg",
    "stock_quantity": 55,
    "sku": "KP-NMK-1KG",
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
        "id": "var-nmk-1kg",
        "product_id": "prod-nimmakaya",
        "weight": "1kg",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 55
      },
      {
        "id": "var-nmk-500g",
        "product_id": "prod-nimmakaya",
        "weight": "500g",
        "price": 249,
        "mrp": 299,
        "stock_quantity": 30
      },
      {
        "id": "var-nmk-250g",
        "product_id": "prod-nimmakaya",
        "weight": "250g",
        "price": 149,
        "mrp": 199,
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
    "short_description": "Authentic South Indian citron pickle prepared with split fenugreek, yellow mustard, and roasted sesame oil.",
    "description": "Hand-harvested Indian citron (Dabbakaya) cured with traditional spices, split fenugreek, mustard, and gingelly oil, offering a rare combination of citrus aroma and savory spice.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "1kg",
    "stock_quantity": 40,
    "sku": "KP-DBK-1KG",
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
        "id": "var-dbk-1kg",
        "product_id": "prod-dabbakaya",
        "weight": "1kg",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 40
      },
      {
        "id": "var-dbk-500g",
        "product_id": "prod-dabbakaya",
        "weight": "500g",
        "price": 249,
        "mrp": 299,
        "stock_quantity": 20
      },
      {
        "id": "var-dbk-250g",
        "product_id": "prod-dabbakaya",
        "weight": "250g",
        "price": 149,
        "mrp": 199,
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
    "short_description": "Sun-dried red chillies braised with tangy Gongura sorrel leaves, roasted mustard seeds, and garlic.",
    "description": "Crisp sun-dried whole red chillies braised with sour Gongura sorrel leaves, roasted mustard seeds, garlic, and sesame oil to create a fiery regional Andhra favorite.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "1kg",
    "stock_quantity": 48,
    "sku": "KP-VMG-1KG",
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
        "id": "var-vmg-1kg",
        "product_id": "prod-vendu-mirchi-gongura",
        "weight": "1kg",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 48
      },
      {
        "id": "var-vmg-500g",
        "product_id": "prod-vendu-mirchi-gongura",
        "weight": "500g",
        "price": 249,
        "mrp": 299,
        "stock_quantity": 28
      },
      {
        "id": "var-vmg-250g",
        "product_id": "prod-vendu-mirchi-gongura",
        "weight": "250g",
        "price": 149,
        "mrp": 199,
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
    "short_description": "Rich Andhra ginger pickle cooked with thick tamarind pulp, organic dark jaggery, and sesame oil tempering.",
    "description": "Freshly grated ginger root slow-cooked with thick tamarind pulp, organic dark jaggery, red chilli powder, and sesame oil tempering. Perfectly balances sweet, tangy, and spicy notes.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "1kg",
    "stock_quantity": 50,
    "sku": "KP-ALM-1KG",
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
        "id": "var-alm-1kg",
        "product_id": "prod-allam",
        "weight": "1kg",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 50
      },
      {
        "id": "var-alm-500g",
        "product_id": "prod-allam",
        "weight": "500g",
        "price": 249,
        "mrp": 299,
        "stock_quantity": 30
      },
      {
        "id": "var-alm-250g",
        "product_id": "prod-allam",
        "weight": "250g",
        "price": 149,
        "mrp": 199,
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
    "short_description": "Fresh garden mint leaf pickle roasted with green chillies, tamarind pulp, garlic cloves, and gingelly oil.",
    "description": "Aromatic fresh garden mint (pudina) leaves roasted with green chillies, tamarind pulp, garlic cloves, and gingelly oil, creating a refreshing yet zesty pickle.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "1kg",
    "stock_quantity": 42,
    "sku": "KP-PDN-1KG",
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
        "id": "var-pdn-1kg",
        "product_id": "prod-pudina",
        "weight": "1kg",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 42
      },
      {
        "id": "var-pdn-500g",
        "product_id": "prod-pudina",
        "weight": "500g",
        "price": 249,
        "mrp": 299,
        "stock_quantity": 22
      },
      {
        "id": "var-pdn-250g",
        "product_id": "prod-pudina",
        "weight": "250g",
        "price": 149,
        "mrp": 199,
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
    "short_description": "Farm-fresh green coriander leaf pickle ground coarsely with tamarind, garlic, red chillies, and spice oil.",
    "description": "Farm-fresh green coriander (cilantro) leaves ground coarsely with tamarind, garlic, red chillies, and tempered in pure cold-pressed oil for an invigorating taste.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "1kg",
    "stock_quantity": 40,
    "sku": "KP-KTM-1KG",
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
        "id": "var-ktm-1kg",
        "product_id": "prod-kothimira",
        "weight": "1kg",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 40
      },
      {
        "id": "var-ktm-500g",
        "product_id": "prod-kothimira",
        "weight": "500g",
        "price": 249,
        "mrp": 299,
        "stock_quantity": 20
      },
      {
        "id": "var-ktm-250g",
        "product_id": "prod-kothimira",
        "weight": "250g",
        "price": 149,
        "mrp": 199,
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
    "short_description": "Authentic raw green tamarind pickle crushed with green chillies, turmeric, and mustard-curry leaf tempering.",
    "description": "Tender raw green tamarind pods crushed with green chillies, turmeric, salt, and seasoned with mustard-curry leaf tempering. A legendary tangy rustic delicacy.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "1kg",
    "stock_quantity": 45,
    "sku": "KP-CHK-1KG",
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
        "id": "var-ctk-1kg",
        "product_id": "prod-chintakaya",
        "weight": "1kg",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 45
      },
      {
        "id": "var-ctk-500g",
        "product_id": "prod-chintakaya",
        "weight": "500g",
        "price": 249,
        "mrp": 299,
        "stock_quantity": 25
      },
      {
        "id": "var-ctk-250g",
        "product_id": "prod-chintakaya",
        "weight": "250g",
        "price": 149,
        "mrp": 199,
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
    "short_description": "Whole Indian gooseberry (amla) pickle cured in spicy Guntur red chilli powder, mustard, and gingelly oil.",
    "description": "Plump whole Indian amla gooseberries steamed and cured in spicy Guntur red chilli powder, stone-ground mustard, fenugreek, and cold-pressed gingelly oil.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "1kg",
    "stock_quantity": 50,
    "sku": "KP-USR-1KG",
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
        "id": "var-usr-1kg",
        "product_id": "prod-usiri",
        "weight": "1kg",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 50
      },
      {
        "id": "var-usr-500g",
        "product_id": "prod-usiri",
        "weight": "500g",
        "price": 249,
        "mrp": 299,
        "stock_quantity": 30
      },
      {
        "id": "var-usr-250g",
        "product_id": "prod-usiri",
        "weight": "250g",
        "price": 149,
        "mrp": 199,
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
    "short_description": "Shredded raw green mango thokku pickle marinated with red chilli powder, garlic, and cold-pressed oil.",
    "description": "Finely grated raw green mango strands marinated with spicy red chillies, garlic, mustard seeds, and sesame oil. Spreads effortlessly over warm rice and flatbreads.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "1kg",
    "stock_quantity": 52,
    "sku": "KP-MTK-1KG",
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
        "id": "var-mtk-1kg",
        "product_id": "prod-mamidi-thokku",
        "weight": "1kg",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 52
      },
      {
        "id": "var-mtk-500g",
        "product_id": "prod-mamidi-thokku",
        "weight": "500g",
        "price": 249,
        "mrp": 299,
        "stock_quantity": 32
      },
      {
        "id": "var-mtk-250g",
        "product_id": "prod-mamidi-thokku",
        "weight": "250g",
        "price": 149,
        "mrp": 199,
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
    "short_description": "Crispy bitter gourd pickle cooked in a rich tamarind, jaggery, and red chilli masala gravy.",
    "description": "Crisp-fried bitter gourd roundels folded into a rich tamarind, jaggery, and red chilli masala gravy. The unique balance of bitter, sweet, sour, and spicy makes it a gourmet treat.",
    "price": 600,
    "mrp": 699,
    "discount_percent": 14,
    "weight": "1kg",
    "stock_quantity": 40,
    "sku": "KP-KKA-1KG",
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
        "id": "var-kka-1kg",
        "product_id": "prod-kakarakaya",
        "weight": "1kg",
        "price": 600,
        "mrp": 699,
        "stock_quantity": 40
      },
      {
        "id": "var-kka-500g",
        "product_id": "prod-kakarakaya",
        "weight": "500g",
        "price": 349,
        "mrp": 399,
        "stock_quantity": 20
      },
      {
        "id": "var-kka-250g",
        "product_id": "prod-kakarakaya",
        "weight": "250g",
        "price": 199,
        "mrp": 249,
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
    "short_description": "Whole peeled garlic clove pickle drenched in cold-pressed mustard oil and roasted Indian spices.",
    "description": "Immunity-boosting whole peeled garlic cloves soaked in cold-pressed mustard oil, crushed yellow mustard, and spicy Guntur red chilli powder.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "1kg",
    "stock_quantity": 50,
    "sku": "KP-VEL-1KG",
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
        "id": "var-vel-1kg",
        "product_id": "prod-vellulli",
        "weight": "1kg",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 50
      },
      {
        "id": "var-vel-500g",
        "product_id": "prod-vellulli",
        "weight": "500g",
        "price": 249,
        "mrp": 299,
        "stock_quantity": 30
      },
      {
        "id": "var-vel-250g",
        "product_id": "prod-vellulli",
        "weight": "250g",
        "price": 149,
        "mrp": 199,
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
    "short_description": "Tender drumstick pieces marinated in fiery Andhra red chilli masala, tamarind pulp, and sesame oil.",
    "description": "Fresh cut drumstick (munagakaya) pieces marinated in fiery Andhra red chilli masala, tamarind pulp, and tempered in pure sesame oil.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "1kg",
    "stock_quantity": 40,
    "sku": "KP-MNK-1KG",
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
        "id": "var-mnk-1kg",
        "product_id": "prod-munagakaya",
        "weight": "1kg",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 40
      },
      {
        "id": "var-mnk-500g",
        "product_id": "prod-munagakaya",
        "weight": "500g",
        "price": 249,
        "mrp": 299,
        "stock_quantity": 20
      },
      {
        "id": "var-mnk-250g",
        "product_id": "prod-munagakaya",
        "weight": "250g",
        "price": 149,
        "mrp": 199,
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
    "short_description": "Fragrant curry leaf pickle coarsely ground with roasted red chillies, tamarind, garlic, and gingelly oil.",
    "description": "Fresh, dark green curry leaves dry-roasted and coarsely ground with roasted red chillies, tamarind, garlic, and sesame oil. Rich in iron and digestive wellness.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "1kg",
    "stock_quantity": 45,
    "sku": "KP-KVP-1KG",
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
        "id": "var-kvp-1kg",
        "product_id": "prod-karivepaku",
        "weight": "1kg",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 45
      },
      {
        "id": "var-kvp-500g",
        "product_id": "prod-karivepaku",
        "weight": "500g",
        "price": 249,
        "mrp": 299,
        "stock_quantity": 25
      },
      {
        "id": "var-kvp-250g",
        "product_id": "prod-karivepaku",
        "weight": "250g",
        "price": 149,
        "mrp": 199,
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
    "short_description": "Sun-dried raw mango slice pickle cured with roasted fenugreek powder, Guntur red chilli, and sesame oil.",
    "description": "Peeled raw mango strips sun-dried and cured with roasted fenugreek powder, Guntur red chilli powder, turmeric, and gingelly oil for an authentic vintage Andhra flavor.",
    "price": 600,
    "mrp": 699,
    "discount_percent": 14,
    "weight": "1kg",
    "stock_quantity": 40,
    "sku": "KP-MGY-1KG",
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
        "id": "var-mgy-1kg",
        "product_id": "prod-maagaya",
        "weight": "1kg",
        "price": 600,
        "mrp": 699,
        "stock_quantity": 40
      },
      {
        "id": "var-mgy-500g",
        "product_id": "prod-maagaya",
        "weight": "500g",
        "price": 349,
        "mrp": 399,
        "stock_quantity": 20
      },
      {
        "id": "var-mgy-250g",
        "product_id": "prod-maagaya",
        "weight": "250g",
        "price": 199,
        "mrp": 249,
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
    "short_description": "Assorted farm vegetables including carrots, green chillies, raw mango, and cauliflower cured in spice oil.",
    "description": "A delicious medley of diced raw mangoes, carrots, green chillies, cauliflower, and lime cured in a fragrant red chilli and yellow mustard oil blend.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "1kg",
    "stock_quantity": 55,
    "sku": "KP-MXV-1KG",
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
        "id": "var-mxv-1kg",
        "product_id": "prod-all-veg-mixed",
        "weight": "1kg",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 55
      },
      {
        "id": "var-mxv-500g",
        "product_id": "prod-all-veg-mixed",
        "weight": "500g",
        "price": 249,
        "mrp": 299,
        "stock_quantity": 35
      },
      {
        "id": "var-mxv-250g",
        "product_id": "prod-all-veg-mixed",
        "weight": "250g",
        "price": 149,
        "mrp": 199,
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
    "short_description": "Crunchy cauliflower florets marinated in Kashmiri red chilli, ginger, yellow mustard, and mustard oil.",
    "description": "Fresh crispy white cauliflower florets blanched and marinated in Kashmiri red chilli, ginger, yellow mustard powder, and mustard oil for a crunchy gourmet pickle experience.",
    "price": 400,
    "mrp": 499,
    "discount_percent": 20,
    "weight": "1kg",
    "stock_quantity": 45,
    "sku": "KP-CLF-1KG",
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
        "id": "var-clf-1kg",
        "product_id": "prod-cauliflower",
        "weight": "1kg",
        "price": 400,
        "mrp": 499,
        "stock_quantity": 45
      },
      {
        "id": "var-clf-500g",
        "product_id": "prod-cauliflower",
        "weight": "500g",
        "price": 249,
        "mrp": 299,
        "stock_quantity": 25
      },
      {
        "id": "var-clf-250g",
        "product_id": "prod-cauliflower",
        "weight": "250g",
        "price": 149,
        "mrp": 199,
        "stock_quantity": 12
      }
    ],
    "created_at": "2026-08-20T10:00:00Z"
  },
  {
    "id": "prod-chicken-boneless",
    "category_id": "cat-nonveg",
    "category_name": "Authentic Non-Veg Pickles",
    "name": "Chicken Boneless Pickle",
    "slug": "chicken-boneless-pickle",
    "short_description": "Tender boneless chicken morsels crisp-fried and tossed in rich Andhra spicy masala.",
    "description": "Authentic homemade Andhra-style boneless chicken pickle prepared with fresh, tender chicken morsels marinated in lemon juice and organic turmeric, crisp-fried till golden and slow-reduced in a rich Guntur red chilli and cold-pressed oil gravy.",
    "price": 900,
    "mrp": 1099,
    "discount_percent": 18,
    "weight": "1kg",
    "stock_quantity": 50,
    "sku": "KP-CHK-BL-1KG",
    "spice_level": "Hot",
    "dietary": "non-veg",
    "shelf_life": "6 Months",
    "storage_instructions": "Refrigeration recommended after opening. Always use a dry spoon.",
    "ingredients": [
      "Fresh Boneless Chicken",
      "Cold-Pressed Sesame Oil",
      "Guntur Red Chilli Powder",
      "Ginger-Garlic Paste",
      "Curry Leaves",
      "Coriander & Cumin Spices",
      "Sea Salt"
    ],
    "images": [
      "/images/pickles/chicken_boneless.jpg"
    ],
    "is_featured": true,
    "is_active": true,
    "rating": 4.9,
    "reviews_count": 196,
    "variants": [
      {
        "id": "var-chk-bl-1kg",
        "product_id": "prod-chicken-boneless",
        "weight": "1kg",
        "price": 900,
        "mrp": 1099,
        "stock_quantity": 50
      }
    ],
    "created_at": "2026-09-01T10:00:00Z"
  },
  {
    "id": "prod-fish-boneless",
    "category_id": "cat-nonveg",
    "category_name": "Authentic Non-Veg Pickles",
    "name": "Fish Boneless Pickle",
    "slug": "fish-boneless-pickle",
    "short_description": "Delicate boneless fish fillets crisp-fried and steeped in tangy mustard masala gravy.",
    "description": "Premium boneless sea fish fillets marinated in rock salt and turmeric, crisp-fried to perfection, and infused with roasted fenugreek, mustard, Guntur chillies, and sesame oil.",
    "price": 1000,
    "mrp": 1199,
    "discount_percent": 16,
    "weight": "1kg",
    "stock_quantity": 40,
    "sku": "KP-FSH-BL-1KG",
    "spice_level": "Medium",
    "dietary": "non-veg",
    "shelf_life": "6 Months",
    "storage_instructions": "Refrigeration recommended after opening. Always use a dry spoon.",
    "ingredients": [
      "Fresh Boneless Fish Fillets",
      "Cold-Pressed Oil",
      "Mustard Powder",
      "Fenugreek Powder",
      "Red Chilli Powder",
      "Garlic",
      "Lemon Juice",
      "Salt"
    ],
    "images": [
      "/images/pickles/fish_boneless.jpg"
    ],
    "is_featured": true,
    "is_active": true,
    "rating": 4.8,
    "reviews_count": 84,
    "variants": [
      {
        "id": "var-fish-bl-1kg",
        "product_id": "prod-fish-boneless",
        "weight": "1kg",
        "price": 1000,
        "mrp": 1199,
        "stock_quantity": 40
      }
    ],
    "created_at": "2026-09-01T10:00:00Z"
  },
  {
    "id": "prod-natu-kodi-bone",
    "category_id": "cat-nonveg",
    "category_name": "Authentic Non-Veg Pickles",
    "name": "Natu Kodi with Bone Pickle",
    "slug": "natu-kodi-with-bone-pickle",
    "short_description": "Traditional country chicken with bone slow-cooked in fiery Rayalaseema spices.",
    "description": "Authentic free-range country chicken (Natu Kodi) with bone, slow-cooked in cold-pressed gingelly oil, whole fried garlic cloves, fresh curry leaves, and roasted heirloom spices for an intense nostalgic flavor.",
    "price": 1400,
    "mrp": 1699,
    "discount_percent": 17,
    "weight": "1kg",
    "stock_quantity": 35,
    "sku": "KP-NKB-1KG",
    "spice_level": "Extra Hot",
    "dietary": "non-veg",
    "shelf_life": "6 Months",
    "storage_instructions": "Refrigeration recommended after opening. Always use a dry spoon.",
    "ingredients": [
      "Country Chicken with Bone",
      "Gingelly Oil",
      "Guntur Red Chilli",
      "Roasted Garlic",
      "Curry Leaves",
      "Homemade Masala Blend",
      "Sea Salt"
    ],
    "images": [
      "/images/pickles/natu_kodi_bone.jpg"
    ],
    "is_featured": true,
    "is_active": true,
    "rating": 4.9,
    "reviews_count": 112,
    "variants": [
      {
        "id": "var-nk-bone-1kg",
        "product_id": "prod-natu-kodi-bone",
        "weight": "1kg",
        "price": 1400,
        "mrp": 1699,
        "stock_quantity": 35
      }
    ],
    "created_at": "2026-09-01T10:00:00Z"
  },
  {
    "id": "prod-natu-kodi-boneless",
    "category_id": "cat-nonveg",
    "category_name": "Authentic Non-Veg Pickles",
    "name": "Natu Kodi Boneless Pickle",
    "slug": "natu-kodi-boneless-pickle",
    "short_description": "Juicy boneless country chicken morsels wok-tossed in robust spicy Andhra gravy.",
    "description": "Free-range country chicken meat hand-picked boneless and wok-tossed in sun-dried red chili oil, roasted coriander, cloves, and ginger-garlic paste for a premium non-veg treat.",
    "price": 1200,
    "mrp": 1499,
    "discount_percent": 20,
    "weight": "1kg",
    "stock_quantity": 35,
    "sku": "KP-NKBL-1KG",
    "spice_level": "Extra Hot",
    "dietary": "non-veg",
    "shelf_life": "6 Months",
    "storage_instructions": "Refrigeration recommended after opening. Always use a dry spoon.",
    "ingredients": [
      "Boneless Country Chicken",
      "Cold-Pressed Oil",
      "Guntur Red Chilli Powder",
      "Ginger-Garlic",
      "Coriander & Cloves",
      "Salt"
    ],
    "images": [
      "/images/pickles/natu_kodi_boneless.jpg"
    ],
    "is_featured": true,
    "is_active": true,
    "rating": 4.9,
    "reviews_count": 128,
    "variants": [
      {
        "id": "var-nk-bl-1kg",
        "product_id": "prod-natu-kodi-boneless",
        "weight": "1kg",
        "price": 1200,
        "mrp": 1499,
        "stock_quantity": 35
      }
    ],
    "created_at": "2026-09-01T10:00:00Z"
  },
  {
    "id": "prod-mutton-boneless",
    "category_id": "cat-nonveg",
    "category_name": "Authentic Non-Veg Pickles",
    "name": "Mutton Boneless Pickle",
    "slug": "mutton-boneless-pickle",
    "short_description": "Royal Hyderabadi boneless mutton cubes slow-braised in Nizami black pepper masala.",
    "description": "Tender boneless morsels of fresh, premium mutton slow-braised in their natural juices and folded into a dark, fragrant black pepper and red chilli spice oil reduction.",
    "price": 1800,
    "mrp": 2199,
    "discount_percent": 18,
    "weight": "1kg",
    "stock_quantity": 30,
    "sku": "KP-MTN-BL-1KG",
    "spice_level": "Hot",
    "dietary": "non-veg",
    "shelf_life": "6 Months",
    "storage_instructions": "Refrigeration recommended after opening. Always use a dry spoon.",
    "ingredients": [
      "Boneless Mutton",
      "Mustard Oil",
      "Black Pepper",
      "Kashmiri & Guntur Chilli",
      "Ginger-Garlic",
      "Whole Spices",
      "Salt"
    ],
    "images": [
      "/images/pickles/mutton_boneless.jpg"
    ],
    "is_featured": true,
    "is_active": true,
    "rating": 4.9,
    "reviews_count": 145,
    "variants": [
      {
        "id": "var-mtn-bl-1kg",
        "product_id": "prod-mutton-boneless",
        "weight": "1kg",
        "price": 1800,
        "mrp": 2199,
        "stock_quantity": 30
      }
    ],
    "created_at": "2026-09-01T10:00:00Z"
  },
  {
    "id": "prod-chicken-gongura",
    "category_id": "cat-nonveg",
    "category_name": "Authentic Non-Veg Pickles",
    "name": "Chicken Gongura Pickle",
    "slug": "chicken-gongura-pickle",
    "short_description": "Tangy red sorrel (Gongura) leaves blended with crisp-fried chicken in spicy Andhra oil.",
    "description": "A celebrated Andhra culinary invention combining tender fried chicken pieces with fresh hand-picked Gongura (red sorrel) leaves slow-cooked into a tangy, spicy, and irresistible pickle paste.",
    "price": 1000,
    "mrp": 1199,
    "discount_percent": 16,
    "weight": "1kg",
    "stock_quantity": 45,
    "sku": "KP-CHK-GNG-1KG",
    "spice_level": "Hot",
    "dietary": "non-veg",
    "shelf_life": "6 Months",
    "storage_instructions": "Refrigeration recommended after opening. Always use a dry spoon.",
    "ingredients": [
      "Fresh Chicken",
      "Gongura Sorrel Leaves",
      "Cold-Pressed Oil",
      "Red Chilli Powder",
      "Roasted Garlic",
      "Mustard Seeds",
      "Salt"
    ],
    "images": [
      "/images/pickles/chicken_gongura.jpg"
    ],
    "is_featured": true,
    "is_active": true,
    "rating": 4.9,
    "reviews_count": 162,
    "variants": [
      {
        "id": "var-chk-gng-1kg",
        "product_id": "prod-chicken-gongura",
        "weight": "1kg",
        "price": 1000,
        "mrp": 1199,
        "stock_quantity": 45
      }
    ],
    "created_at": "2026-09-01T10:00:00Z"
  },
  {
    "id": "32810da2-382f-469f-b634-3003e1733f04",
    "category_id": "cat-veg",
    "category_name": "Veg Pickles",
    "name": "Sample Product",
    "slug": "sample-product",
    "short_description": "Sample Product created for evaluation and trial orders.",
    "description": "Authentic Sample Jar created for tasting, trial orders, and checkout verification.",
    "price": 1,
    "mrp": 100,
    "discount_percent": 99,
    "weight": "250g",
    "stock_quantity": 50,
    "sku": "KP-SMP-001",
    "spice_level": "Medium",
    "dietary": "veg",
    "shelf_life": "12 Months",
    "storage_instructions": "Store in a cool dry place.",
    "ingredients": [
      "Homemade Ingredients"
    ],
    "images": [
      "/images/pickles/hero.jpg"
    ],
    "is_featured": true,
    "is_active": true,
    "rating": 5.0,
    "reviews_count": 1,
    "variants": [
      {
        "id": "var-smp-250g",
        "product_id": "32810da2-382f-469f-b634-3003e1733f04",
        "weight": "250g",
        "price": 1,
        "mrp": 100,
        "stock_quantity": 50
      }
    ],
    "created_at": "2026-09-14T10:00:00Z"
  },
{
  "id": "prod-idly-karam",
  "category_id": "cat-spices",
  "category_name": "Spices",
  "name": "Idly Karam",
  "slug": "idly-karam",
  "short_description": "Authentic homemade Andhra-style Idly Karam podi prepared with roasted lentils and red chillies.",
  "description": "Our traditional Idly Karam is crafted with stone-ground chana dal, urad dal, roasted Guntur red chillies, cumin seeds, garlic, and sea salt. Perfect condiment for hot idlis, dosa, and vada drizzled with melted desi ghee.",
  "price": 150,
  "mrp": 199,
  "discount_percent": 24,
  "weight": "250g",
  "stock_quantity": 60,
  "sku": "KP-IDL-KRM-250G",
  "spice_level": "Medium",
  "dietary": "veg",
  "shelf_life": "6 Months",
  "storage_instructions": "Store in an airtight container in a cool dry place.",
  "ingredients": [
    "Bengal Gram Dal",
    "Black Gram Dal",
    "Guntur Red Chilli",
    "Cumin Seeds",
    "Garlic",
    "Sea Salt"
  ],
  "images": [
    "/images/pickles/idly_karam.jpg"
  ],
  "is_featured": true,
  "is_active": true,
  "rating": 4.9,
  "reviews_count": 80,
  "variants": [
    {
      "id": "var-idly-karam-250g",
      "product_id": "prod-idly-karam",
      "weight": "250g",
      "price": 150,
      "mrp": 199,
      "stock_quantity": 60
    }
  ],
  "created_at": "2026-09-05T10:00:00Z"
},
{
  "id": "prod-nalla-karam",
  "category_id": "cat-spices",
  "category_name": "Spices",
  "name": "Nalla Karam",
  "slug": "nalla-karam",
  "short_description": "Authentic dark roasted Andhra Nalla Karam with rich roasted coriander, garlic, and chillies.",
  "description": "Nalla Karam is a prized ancestral recipe made by slow-roasting unhulled black gram, coriander seeds, dry red chillies, tamarind, and garlic to a dark, intensely savory podi powder.",
  "price": 150,
  "mrp": 199,
  "discount_percent": 24,
  "weight": "250g",
  "stock_quantity": 50,
  "sku": "KP-NLA-KRM-250G",
  "spice_level": "Hot",
  "dietary": "veg",
  "shelf_life": "6 Months",
  "storage_instructions": "Store in an airtight container in a cool dry place.",
  "ingredients": [
    "Unhulled Black Gram",
    "Coriander Seeds",
    "Red Chillies",
    "Tamarind",
    "Garlic",
    "Salt"
  ],
  "images": [
    "/images/pickles/nalla_karam.jpg"
  ],
  "is_featured": true,
  "is_active": true,
  "rating": 4.9,
  "reviews_count": 80,
  "variants": [
    {
      "id": "var-nalla-karam-250g",
      "product_id": "prod-nalla-karam",
      "weight": "250g",
      "price": 150,
      "mrp": 199,
      "stock_quantity": 50
    }
  ],
  "created_at": "2026-09-05T10:00:00Z"
},
{
  "id": "prod-karivepaku-karam",
  "category_id": "cat-spices",
  "category_name": "Spices",
  "name": "Karivepaku Karam",
  "slug": "karivepaku-karam",
  "short_description": "Authentic homemade Curry Leaves Karam podi rich in fresh sun-dried karivepaku and roasted spices.",
  "description": "Nutritious and flavorful karivepaku podi prepared with fresh sun-dried organic curry leaves, roasted lentils, Guntur red chillies, and asafoetida. Excellent for digestion and hair health.",
  "price": 150,
  "mrp": 199,
  "discount_percent": 24,
  "weight": "250g",
  "stock_quantity": 50,
  "sku": "KP-KVP-KRM-250G",
  "spice_level": "Medium",
  "dietary": "veg",
  "shelf_life": "6 Months",
  "storage_instructions": "Store in an airtight container in a cool dry place.",
  "ingredients": [
    "Fresh Organic Curry Leaves",
    "Toor Dal",
    "Urad Dal",
    "Red Chillies",
    "Cumin",
    "Salt"
  ],
  "images": [
    "/images/pickles/karivepaku_karam.jpg"
  ],
  "is_featured": true,
  "is_active": true,
  "rating": 4.9,
  "reviews_count": 80,
  "variants": [
    {
      "id": "var-karivepaku-karam-250g",
      "product_id": "prod-karivepaku-karam",
      "weight": "250g",
      "price": 150,
      "mrp": 199,
      "stock_quantity": 50
    }
  ],
  "created_at": "2026-09-05T10:00:00Z"
},
{
  "id": "prod-munagaku-karam",
  "category_id": "cat-spices",
  "category_name": "Spices",
  "name": "Munagaku Karam",
  "slug": "munagaku-karam",
  "short_description": "Superfood Drumstick Leaves Karam podi prepared with shade-dried munagaku and roasted lentils.",
  "description": "Power-packed with iron and vitamins, our Munagaku Karam blends shade-dried drumstick (moringa) leaves with slow-roasted lentils, garlic, and mild spices for a healthy daily side dish.",
  "price": 150,
  "mrp": 199,
  "discount_percent": 24,
  "weight": "250g",
  "stock_quantity": 45,
  "sku": "KP-MNG-KRM-250G",
  "spice_level": "Medium",
  "dietary": "veg",
  "shelf_life": "6 Months",
  "storage_instructions": "Store in an airtight container in a cool dry place.",
  "ingredients": [
    "Organic Drumstick Leaves",
    "Chana Dal",
    "Urad Dal",
    "Garlic",
    "Red Chillies",
    "Salt"
  ],
  "images": [
    "/images/pickles/munagaku_karam.jpg"
  ],
  "is_featured": true,
  "is_active": true,
  "rating": 4.9,
  "reviews_count": 80,
  "variants": [
    {
      "id": "var-munagaku-karam-250g",
      "product_id": "prod-munagaku-karam",
      "weight": "250g",
      "price": 150,
      "mrp": 199,
      "stock_quantity": 45
    }
  ],
  "created_at": "2026-09-05T10:00:00Z"
},
{
  "id": "prod-avisa-karam",
  "category_id": "cat-spices",
  "category_name": "Spices",
  "name": "Avisa Karam",
  "slug": "avisa-karam",
  "short_description": "Healthy Flaxseed Karam podi slow-roasted with aromatic spices for rich Omega-3 nutrition.",
  "description": "Avisa (flaxseed) Karam is a wholesome traditional condiment rich in plant-based Omega-3 fatty acids, prepared by roasting brown flaxseeds with dry chillies, garlic, and sea salt.",
  "price": 150,
  "mrp": 199,
  "discount_percent": 24,
  "weight": "250g",
  "stock_quantity": 40,
  "sku": "KP-AVS-KRM-250G",
  "spice_level": "Medium",
  "dietary": "veg",
  "shelf_life": "6 Months",
  "storage_instructions": "Store in an airtight container in a cool dry place.",
  "ingredients": [
    "Brown Flaxseeds",
    "Red Chillies",
    "Garlic",
    "Cumin Seeds",
    "Salt"
  ],
  "images": [
    "/images/pickles/avisa_karam.jpg"
  ],
  "is_featured": true,
  "is_active": true,
  "rating": 4.9,
  "reviews_count": 80,
  "variants": [
    {
      "id": "var-avisa-karam-250g",
      "product_id": "prod-avisa-karam",
      "weight": "250g",
      "price": 150,
      "mrp": 199,
      "stock_quantity": 40
    }
  ],
  "created_at": "2026-09-05T10:00:00Z"
},
{
  "id": "prod-nuvvula-karam",
  "category_id": "cat-spices",
  "category_name": "Spices",
  "name": "Nuvvula Karam",
  "slug": "nuvvula-karam",
  "short_description": "Fragrant Sesame Seed Karam podi roasted to a golden nutty perfection.",
  "description": "Nuvvula (sesame seed) Karam podi delivers a rich nutty warmth to rice and rotis, made by roasting white sesame seeds with whole red chillies, garlic, and rock salt.",
  "price": 150,
  "mrp": 199,
  "discount_percent": 24,
  "weight": "250g",
  "stock_quantity": 50,
  "sku": "KP-NVL-KRM-250G",
  "spice_level": "Medium",
  "dietary": "veg",
  "shelf_life": "6 Months",
  "storage_instructions": "Store in an airtight container in a cool dry place.",
  "ingredients": [
    "White Sesame Seeds",
    "Red Chillies",
    "Garlic",
    "Cumin",
    "Salt"
  ],
  "images": [
    "/images/pickles/nuvvula_karam.jpg"
  ],
  "is_featured": true,
  "is_active": true,
  "rating": 4.9,
  "reviews_count": 80,
  "variants": [
    {
      "id": "var-nuvvula-karam-250g",
      "product_id": "prod-nuvvula-karam",
      "weight": "250g",
      "price": 150,
      "mrp": 199,
      "stock_quantity": 50
    }
  ],
  "created_at": "2026-09-05T10:00:00Z"
},
{
  "id": "prod-vellulli-karam",
  "category_id": "cat-spices",
  "category_name": "Spices",
  "name": "Vellulli Karam",
  "slug": "vellulli-karam",
  "short_description": "Fiery Andhra Garlic Karam podi prepared with abundant fried garlic and red chillies.",
  "description": "Bold, pungent, and irresistibly aromatic! Vellulli (garlic) Karam podi is coarsely ground with heaps of garlic, sun-dried Guntur chillies, and roasted coriander.",
  "price": 150,
  "mrp": 199,
  "discount_percent": 24,
  "weight": "250g",
  "stock_quantity": 60,
  "sku": "KP-VLL-KRM-250G",
  "spice_level": "Hot",
  "dietary": "veg",
  "shelf_life": "6 Months",
  "storage_instructions": "Store in an airtight container in a cool dry place.",
  "ingredients": [
    "Garlic Cloves",
    "Guntur Red Chillies",
    "Coriander Seeds",
    "Cumin",
    "Sea Salt"
  ],
  "images": [
    "/images/pickles/vellulli_karam.jpg"
  ],
  "is_featured": true,
  "is_active": true,
  "rating": 4.9,
  "reviews_count": 80,
  "variants": [
    {
      "id": "var-vellulli-karam-250g",
      "product_id": "prod-vellulli-karam",
      "weight": "250g",
      "price": 150,
      "mrp": 199,
      "stock_quantity": 60
    }
  ],
  "created_at": "2026-09-05T10:00:00Z"
},
{
  "id": "prod-kandhi-podi",
  "category_id": "cat-spices",
  "category_name": "Spices",
  "name": "Kandhi Podi",
  "slug": "kandhi-podi",
  "short_description": "Classic Andhra Gunpowder Kandhi Podi made with slow-roasted yellow toor dal.",
  "description": "The quintessential Andhra comfort food! Kandhi Podi (Toor Dal Gunpowder) is made from slow-roasted golden split pigeon peas, red chillies, and cumin. Tastes heavenly with steaming hot rice and ghee.",
  "price": 150,
  "mrp": 199,
  "discount_percent": 24,
  "weight": "250g",
  "stock_quantity": 70,
  "sku": "KP-KND-PDI-250G",
  "spice_level": "Mild",
  "dietary": "veg",
  "shelf_life": "6 Months",
  "storage_instructions": "Store in an airtight container in a cool dry place.",
  "ingredients": [
    "Yellow Toor Dal",
    "Red Chillies",
    "Cumin Seeds",
    "Black Pepper",
    "Asafoetida",
    "Salt"
  ],
  "images": [
    "/images/pickles/kandhi_podi.jpg"
  ],
  "is_featured": true,
  "is_active": true,
  "rating": 4.9,
  "reviews_count": 80,
  "variants": [
    {
      "id": "var-kandhi-podi-250g",
      "product_id": "prod-kandhi-podi",
      "weight": "250g",
      "price": 150,
      "mrp": 199,
      "stock_quantity": 70
    }
  ],
  "created_at": "2026-09-05T10:00:00Z"
},
{
  "id": "prod-putnala-podi",
  "category_id": "cat-spices",
  "category_name": "Spices",
  "name": "Putnala Podi",
  "slug": "putnala-podi",
  "short_description": "Savory Roasted Gram Putnala Podi prepared with roasted chana and dry coconut.",
  "description": "Mild, creamy, and fragrant Putnala (roasted dalia) Podi crafted with crispy roasted gram, dry coconut flakes, garlic, and cumin. Perfect for sprinkles on upma, dosa, and rice.",
  "price": 150,
  "mrp": 199,
  "discount_percent": 24,
  "weight": "250g",
  "stock_quantity": 50,
  "sku": "KP-PTN-PDI-250G",
  "spice_level": "Mild",
  "dietary": "veg",
  "shelf_life": "6 Months",
  "storage_instructions": "Store in an airtight container in a cool dry place.",
  "ingredients": [
    "Roasted Dalia Gram",
    "Dry Coconut",
    "Garlic",
    "Red Chillies",
    "Cumin",
    "Salt"
  ],
  "images": [
    "/images/pickles/putnala_podi.jpg"
  ],
  "is_featured": true,
  "is_active": true,
  "rating": 4.9,
  "reviews_count": 80,
  "variants": [
    {
      "id": "var-putnala-podi-250g",
      "product_id": "prod-putnala-podi",
      "weight": "250g",
      "price": 150,
      "mrp": 199,
      "stock_quantity": 50
    }
  ],
  "created_at": "2026-09-05T10:00:00Z"
},
{
  "id": "prod-kobbari-karam",
  "category_id": "cat-spices",
  "category_name": "Spices",
  "name": "Kobbari Karam",
  "slug": "kobbari-karam",
  "short_description": "Sweet & spicy Coconut Karam podi made with dry copra and Guntur chillies.",
  "description": "Kobbari (dry coconut) Karam podi blends grated copra coconut with whole red chillies, garlic, and spices for a rich, aromatic side dish for tiffins and meals.",
  "price": 150,
  "mrp": 199,
  "discount_percent": 24,
  "weight": "250g",
  "stock_quantity": 55,
  "sku": "KP-KBR-KRM-250G",
  "spice_level": "Medium",
  "dietary": "veg",
  "shelf_life": "6 Months",
  "storage_instructions": "Store in an airtight container in a cool dry place.",
  "ingredients": [
    "Dry Copra Coconut",
    "Red Chillies",
    "Garlic",
    "Cumin",
    "Salt"
  ],
  "images": [
    "/images/pickles/kobbari_karam.jpg"
  ],
  "is_featured": true,
  "is_active": true,
  "rating": 4.9,
  "reviews_count": 80,
  "variants": [
    {
      "id": "var-kobbari-karam-250g",
      "product_id": "prod-kobbari-karam",
      "weight": "250g",
      "price": 150,
      "mrp": 199,
      "stock_quantity": 55
    }
  ],
  "created_at": "2026-09-05T10:00:00Z"
},
{
  "id": "prod-pappula-podi",
  "category_id": "cat-spices",
  "category_name": "Spices",
  "name": "Pappula Podi",
  "slug": "pappula-podi",
  "short_description": "Traditional heirloom Mixed Lentil Pappula Podi slow-roasted for comforting flavor.",
  "description": "An authentic blend of roasted split chana dal and black gram with garlic and whole spices, Pappula Podi brings rich nostalgia to everyday South Indian breakfast and lunch spreads.",
  "price": 150,
  "mrp": 199,
  "discount_percent": 24,
  "weight": "250g",
  "stock_quantity": 50,
  "sku": "KP-PPL-PDI-250G",
  "spice_level": "Mild",
  "dietary": "veg",
  "shelf_life": "6 Months",
  "storage_instructions": "Store in an airtight container in a cool dry place.",
  "ingredients": [
    "Roasted Chana Dal",
    "Urad Dal",
    "Garlic",
    "Red Chillies",
    "Asafoetida",
    "Salt"
  ],
  "images": [
    "/images/pickles/pappula_podi.jpg"
  ],
  "is_featured": true,
  "is_active": true,
  "rating": 4.9,
  "reviews_count": 80,
  "variants": [
    {
      "id": "var-pappula-podi-250g",
      "product_id": "prod-pappula-podi",
      "weight": "250g",
      "price": 150,
      "mrp": 199,
      "stock_quantity": 50
    }
  ],
  "created_at": "2026-09-05T10:00:00Z"
},
{
  "id": "prod-pudina-karam",
  "category_id": "cat-spices",
  "category_name": "Spices",
  "name": "Pudina Karam",
  "slug": "pudina-karam",
  "short_description": "Refreshing Mint Karam podi made with dried pudina leaves and roasted lentils.",
  "description": "A cooling yet spicy herbal karam made from shade-dried garden fresh mint (pudina) leaves roasted with lentils, red chillies, and cumin for a refreshing herbal taste.",
  "price": 150,
  "mrp": 199,
  "discount_percent": 24,
  "weight": "250g",
  "stock_quantity": 45,
  "sku": "KP-PDN-KRM-250G",
  "spice_level": "Medium",
  "dietary": "veg",
  "shelf_life": "6 Months",
  "storage_instructions": "Store in an airtight container in a cool dry place.",
  "ingredients": [
    "Fresh Shade-Dried Mint Leaves",
    "Toor Dal",
    "Urad Dal",
    "Red Chillies",
    "Garlic",
    "Salt"
  ],
  "images": [
    "/images/pickles/pudina_karam.jpg"
  ],
  "is_featured": true,
  "is_active": true,
  "rating": 4.9,
  "reviews_count": 80,
  "variants": [
    {
      "id": "var-pudina-karam-250g",
      "product_id": "prod-pudina-karam",
      "weight": "250g",
      "price": 150,
      "mrp": 199,
      "stock_quantity": 45
    }
  ],
  "created_at": "2026-09-05T10:00:00Z"
},
{
  "id": "prod-kothimeera-karam",
  "category_id": "cat-spices",
  "category_name": "Spices",
  "name": "Kothimeera Karam",
  "slug": "kothimeera-karam",
  "short_description": "Aromatic Fresh Coriander Karam podi prepared with sun-cured coriander leaves.",
  "description": "Handcrafted with fragrant sun-cured coriander (kothimeera) leaves, coriander seeds, lentils, and garlic, offering a burst of fresh herbal aroma with every spoon.",
  "price": 150,
  "mrp": 199,
  "discount_percent": 24,
  "weight": "250g",
  "stock_quantity": 45,
  "sku": "KP-KTM-KRM-250G",
  "spice_level": "Medium",
  "dietary": "veg",
  "shelf_life": "6 Months",
  "storage_instructions": "Store in an airtight container in a cool dry place.",
  "ingredients": [
    "Sun-Cured Coriander Leaves",
    "Coriander Seeds",
    "Urad Dal",
    "Red Chillies",
    "Garlic",
    "Salt"
  ],
  "images": [
    "/images/pickles/kothimeera_karam.jpg"
  ],
  "is_featured": true,
  "is_active": true,
  "rating": 4.9,
  "reviews_count": 80,
  "variants": [
    {
      "id": "var-kothimeera-karam-250g",
      "product_id": "prod-kothimeera-karam",
      "weight": "250g",
      "price": 150,
      "mrp": 199,
      "stock_quantity": 45
    }
  ],
  "created_at": "2026-09-05T10:00:00Z"
},
{
  "id": "prod-kuura-kaaram",
  "category_id": "cat-spices",
  "name": "Kuura Kaaram",
  "slug": "kuura-kaaram",
  "short_description": "Traditional Andhra-style homemade curry masala spice blend for authentic daily vegetable and legume curries.",
  "description": "Our authentic Kuura Kaaram is a handcrafted Andhra curry spice blend made from roasted coriander seeds, cumin, stone-ground red chillies, garlic, and traditional spices to give your curries an irreplaceable rich flavor and aroma.",
  "price": 400,
  "mrp": 499,
  "discount_percent": 20,
  "weight": "1kg",
  "stock_quantity": 50,
  "sku": "KP-KKM-1KG",
  "spice_level": "Hot",
  "dietary": "veg",
  "shelf_life": "12 Months",
  "storage_instructions": "Store in an airtight container in a cool dry place.",
  "ingredients": ["Coriander Seeds", "Guntur Red Chillies", "Cumin", "Garlic", "Turmeric", "Sea Salt"],
  "images": ["/images/pickles/kuura_kaaram.jpg"],
  "is_featured": true,
  "is_active": true,
  "rating": 5.0,
  "reviews_count": 18,
  "variants": [
    { "id": "var-kuura-kaaram-1kg", "product_id": "prod-kuura-kaaram", "weight": "1kg", "price": 400, "mrp": 499, "stock_quantity": 50 }
  ],
  "created_at": "2026-09-16T10:00:00Z"
},
{
  "id": "prod-pachi-kaaram",
  "category_id": "cat-spices",
  "name": "Pachi Kaaram",
  "slug": "pachi-kaaram",
  "short_description": "Vibrant and spicy fresh green chilli condiment spice blend prepared with fresh farm green chillies.",
  "description": "Handmade using fresh green chillies, curry leaves, garlic, and traditional spices, Pachi Kaaram adds a fresh zest and fiery green chilli taste to rice, breakfast tiffins, and fries.",
  "price": 500,
  "mrp": 599,
  "discount_percent": 17,
  "weight": "1kg",
  "stock_quantity": 40,
  "sku": "KP-PKM-1KG",
  "spice_level": "Extra Hot",
  "dietary": "veg",
  "shelf_life": "6 Months",
  "storage_instructions": "Store in a cool dry place or refrigerate for prolonged freshness.",
  "ingredients": ["Fresh Green Chillies", "Garlic", "Curry Leaves", "Cumin", "Cold-Pressed Oil", "Salt"],
  "images": ["/images/pickles/pachi_kaaram.jpg"],
  "is_featured": true,
  "is_active": true,
  "rating": 4.9,
  "reviews_count": 22,
  "variants": [
    { "id": "var-pachi-kaaram-1kg", "product_id": "prod-pachi-kaaram", "weight": "1kg", "price": 500, "mrp": 599, "stock_quantity": 40 }
  ],
  "created_at": "2026-09-16T10:00:00Z"
},
{
  "id": "prod-pasupu",
  "category_id": "cat-spices",
  "name": "Pasupu",
  "slug": "pasupu",
  "short_description": "100% pure hand-milled golden turmeric powder sourced from traditional Andhra turmeric rhizomes.",
  "description": "Pure, fragrant Pasupu (turmeric powder) made from sun-dried natural turmeric roots. Unadulterated and rich in natural curcumin, adding natural golden color and authentic wellness to every dish.",
  "price": 300,
  "mrp": 399,
  "discount_percent": 25,
  "weight": "1kg",
  "stock_quantity": 80,
  "sku": "KP-PSP-1KG",
  "spice_level": "Mild",
  "dietary": "veg",
  "shelf_life": "12 Months",
  "storage_instructions": "Store in a dry airtight jar.",
  "ingredients": ["Pure Dried Turmeric Rhizomes"],
  "images": ["/images/pickles/pasupu.jpg"],
  "is_featured": false,
  "is_active": true,
  "rating": 5.0,
  "reviews_count": 34,
  "variants": [
    { "id": "var-pasupu-1kg", "product_id": "prod-pasupu", "weight": "1kg", "price": 300, "mrp": 399, "stock_quantity": 80 }
  ],
  "created_at": "2026-09-16T10:00:00Z"
},
{
  "id": "prod-aavu-neyyi",
  "category_id": "cat-spices",
  "name": "Aavu Neyyi",
  "slug": "aavu-neyyi",
  "short_description": "Pure traditional golden cow ghee churned using authentic heirloom methods.",
  "description": "Handcrafted golden Aavu Neyyi (Cow Ghee) prepared by slow-simmering cultured butter. Fragrant, rich in aroma, and perfect for drizzling over hot rice, pappu, sweets, and tiffins.",
  "price": 800,
  "mrp": 999,
  "discount_percent": 20,
  "weight": "1kg",
  "stock_quantity": 50,
  "sku": "KP-ANY-1KG",
  "spice_level": "Mild",
  "dietary": "veg",
  "shelf_life": "9 Months",
  "storage_instructions": "Store at room temperature away from direct moisture.",
  "ingredients": ["Pure Cow Milk Fat / Clarified Butter"],
  "images": ["/images/pickles/aavu_neyyi.jpg"],
  "is_featured": true,
  "is_active": true,
  "rating": 5.0,
  "reviews_count": 45,
  "variants": [
    { "id": "var-aavu-neyyi-1kg", "product_id": "prod-aavu-neyyi", "weight": "1kg", "price": 800, "mrp": 999, "stock_quantity": 50 }
  ],
  "created_at": "2026-09-16T10:00:00Z"
},
{
  "id": "prod-gedhey-neyyi",
  "category_id": "cat-spices",
  "name": "Gedhey Neyyi",
  "slug": "gedhey-neyyi",
  "short_description": "Rich creamy granular buffalo ghee crafted using traditional Indian slow-cooking.",
  "description": "Traditional Gedhey Neyyi (Buffalo Ghee) known for its deep granular texture, rich buttery flavor, and superior aroma. Ideal for traditional cooking, sweets, and everyday meals.",
  "price": 1000,
  "mrp": 1199,
  "discount_percent": 17,
  "weight": "1kg",
  "stock_quantity": 45,
  "sku": "KP-GNY-1KG",
  "spice_level": "Mild",
  "dietary": "veg",
  "shelf_life": "9 Months",
  "storage_instructions": "Store in a cool dry place.",
  "ingredients": ["Pure Buffalo Milk Fat / Clarified Butter"],
  "images": ["/images/pickles/gedhey_neyyi.jpg"],
  "is_featured": true,
  "is_active": true,
  "rating": 4.9,
  "reviews_count": 31,
  "variants": [
    { "id": "var-gedhey-neyyi-1kg", "product_id": "prod-gedhey-neyyi", "weight": "1kg", "price": 1000, "mrp": 1199, "stock_quantity": 45 }
  ],
  "created_at": "2026-09-16T10:00:00Z"
},
{
  "id": "prod-saggu-biyyam-odiyalu",
  "category_id": "cat-papads",
  "name": "Saggu Biyyam Odiyalu",
  "slug": "saggu-biyyam-odiyalu",
  "short_description": "Handcrafted sun-dried sago & rice pearls odiyalu fryums that crisp up light and crunchy.",
  "description": "Traditional Andhra Saggu Biyyam Odiyalu prepared with high-grade sago pearls, rice flour, cumin, and mild spices. Sun-dried to perfection under natural sunlight, ready to deep-fry into crunchy, melt-in-the-mouth papadams.",
  "price": 1000,
  "mrp": 1199,
  "discount_percent": 17,
  "weight": "1kg",
  "stock_quantity": 50,
  "sku": "KP-SBO-1KG",
  "spice_level": "Mild",
  "dietary": "veg",
  "shelf_life": "12 Months",
  "storage_instructions": "Keep dry in an airtight container.",
  "ingredients": ["Sago / Sabudana", "Rice Flour", "Cumin", "Green Chillies", "Salt"],
  "images": ["/images/pickles/saggu_biyyam_odiyalu.jpg"],
  "is_featured": true,
  "is_active": true,
  "rating": 5.0,
  "reviews_count": 28,
  "variants": [
    { "id": "var-saggu-biyyam-odiyalu-1kg", "product_id": "prod-saggu-biyyam-odiyalu", "weight": "1kg", "price": 1000, "mrp": 1199, "stock_quantity": 50 }
  ],
  "created_at": "2026-09-16T10:00:00Z"
},
{
  "id": "prod-pindi-odiyalu",
  "category_id": "cat-papads",
  "name": "Pindi Odiyalu",
  "slug": "pindi-odiyalu",
  "short_description": "Authentic sun-dried rice flour flower-shaped odiyalu fryums.",
  "description": "Homemade Pindi Odiyalu crafted from seasoned rice flour paste and sun-dried on cotton sheets in authentic rural Andhra households. Delicate, crunchy, and perfect side for dal and rice.",
  "price": 1000,
  "mrp": 1199,
  "discount_percent": 17,
  "weight": "1kg",
  "stock_quantity": 50,
  "sku": "KP-PDO-1KG",
  "spice_level": "Mild",
  "dietary": "veg",
  "shelf_life": "12 Months",
  "storage_instructions": "Store in an airtight container.",
  "ingredients": ["Rice Flour", "Sago", "Cumin", "Asafoetida", "Salt"],
  "images": ["/images/pickles/pindi_odiyalu.jpg"],
  "is_featured": false,
  "is_active": true,
  "rating": 4.8,
  "reviews_count": 19,
  "variants": [
    { "id": "var-pindi-odiyalu-1kg", "product_id": "prod-pindi-odiyalu", "weight": "1kg", "price": 1000, "mrp": 1199, "stock_quantity": 50 }
  ],
  "created_at": "2026-09-16T10:00:00Z"
},
{
  "id": "prod-minapa-odiyalu",
  "category_id": "cat-papads",
  "name": "Minapa Odiyalu",
  "slug": "minapa-odiyalu",
  "short_description": "Protein-rich sun-dried urad dal dumplings for deep frying or cooking in curries.",
  "description": "Traditional Minapa Odiyalu prepared with soaked, ground black gram (urad dal), black pepper, cumin, and hing. Excellent when fried crispy or simmered in classic Andhra pulusu curries.",
  "price": 1000,
  "mrp": 1199,
  "discount_percent": 17,
  "weight": "1kg",
  "stock_quantity": 40,
  "sku": "KP-MPO-1KG",
  "spice_level": "Medium",
  "dietary": "veg",
  "shelf_life": "12 Months",
  "storage_instructions": "Store in a moisture-free dry jar.",
  "ingredients": ["Urad Dal (Minapappu)", "Black Pepper", "Cumin", "Hing", "Salt"],
  "images": ["/images/pickles/minapa_odiyalu.jpg"],
  "is_featured": true,
  "is_active": true,
  "rating": 4.9,
  "reviews_count": 24,
  "variants": [
    { "id": "var-minapa-odiyalu-1kg", "product_id": "prod-minapa-odiyalu", "weight": "1kg", "price": 1000, "mrp": 1199, "stock_quantity": 40 }
  ],
  "created_at": "2026-09-16T10:00:00Z"
},
{
  "id": "prod-gummadi-odiyalu",
  "category_id": "cat-papads",
  "name": "Gummadi Odiyalu",
  "slug": "gummadi-odiyalu",
  "short_description": "Handcrafted ash gourd pumpkin & urad dal sun-dried specialty odiyalu.",
  "description": "Heirloom Andhra Gummadi Odiyalu prepared with grated ash gourd pumpkin, urad dal, green chillies, and aromatic spices. Sun-dried carefully to lock in distinctive rich savory notes.",
  "price": 1200,
  "mrp": 1399,
  "discount_percent": 14,
  "weight": "1kg",
  "stock_quantity": 35,
  "sku": "KP-GMO-1KG",
  "spice_level": "Medium",
  "dietary": "veg",
  "shelf_life": "12 Months",
  "storage_instructions": "Keep in a cool dry container.",
  "ingredients": ["Grated Ash Gourd Pumpkin", "Urad Dal", "Green Chillies", "Salt"],
  "images": ["/images/pickles/gummadi_odiyalu.jpg"],
  "is_featured": true,
  "is_active": true,
  "rating": 5.0,
  "reviews_count": 36,
  "variants": [
    { "id": "var-gummadi-odiyalu-1kg", "product_id": "prod-gummadi-odiyalu", "weight": "1kg", "price": 1200, "mrp": 1399, "stock_quantity": 35 }
  ],
  "created_at": "2026-09-16T10:00:00Z"
},
{
  "id": "prod-majjiga-mirapakayalu",
  "category_id": "cat-papads",
  "name": "Majjiga Mirapakayalu",
  "slug": "majjiga-mirapakayalu",
  "short_description": "Traditional sun-dried green chillies soaked in seasoned sour buttermilk and sea salt.",
  "description": "Classic Andhra Majjiga Mirapakayalu (Oora Mirapakayalu). Selected green chillies slit, steeped in fermented sour curd buttermilk and salt, then sun-dried until dry. Deep-fry until dark and crunchy for the ultimate side dish with curd rice or sambar.",
  "price": 1200,
  "mrp": 1399,
  "discount_percent": 14,
  "weight": "1kg",
  "stock_quantity": 45,
  "sku": "KP-MMK-1KG",
  "spice_level": "Extra Hot",
  "dietary": "veg",
  "shelf_life": "12 Months",
  "storage_instructions": "Store in a dry airtight jar.",
  "ingredients": ["Green Chillies", "Fermented Curd / Buttermilk", "Rock Salt", "Fenugreek"],
  "images": ["/images/pickles/majjiga_mirapakayalu.jpg"],
  "is_featured": true,
  "is_active": true,
  "rating": 5.0,
  "reviews_count": 52,
  "variants": [
    { "id": "var-majjiga-mirapakayalu-1kg", "product_id": "prod-majjiga-mirapakayalu", "weight": "1kg", "price": 1200, "mrp": 1399, "stock_quantity": 45 }
  ],
  "created_at": "2026-09-16T10:00:00Z"
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
        variant_weight: '1kg',
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
        product_id: 'prod-chicken-boneless',
        product_name: 'Chicken Boneless Pickle',
        image: '/images/pickles/chicken_boneless.jpg',
        variant_weight: '1kg',
        price: 900,
        quantity: 1,
        total: 900,
      },
      {
        id: 'item-4',
        product_id: 'prod-mutton',
        product_name: 'Royal Hyderabadi Mutton Pickle',
        image: '/images/pickles/mutton.jpg',
        variant_weight: '1kg',
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
        variant_weight: '1kg',
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
    product_id: 'prod-chicken-boneless',
    product_name: 'Chicken Boneless Pickle',
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
  store_phone: '+91 97052 22744',
  whatsapp_number: '+91 97052 22744',
  fssai_number: '13624014000189',
  gst_number: '36AAECK1294F1Z3',
  address: 'Kavya Sri Pickles, Near Bustand, Pedavegi, Pedavegi Mandal',
  city: 'ELURU',
  state: 'ANDHRA PRADESH',
  pincode: '534435',
  free_shipping_threshold: 499,
  standard_shipping_fee: 50,
  gst_percentage: 5,
  gst_enabled: true,
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


