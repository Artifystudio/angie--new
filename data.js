/* ============================================================
   ANGIE BEVERAGES & SALADS — MENU DATA
   Edit prices, names, descriptions here. Everything in the UI
   is generated from this file — no menu content lives in the
   HTML or JS logic.

   IMAGES
   Every item has an `image` path pointing into /images/<category>/.
   Drop a real photo in with the exact same filename (jpg or png —
   just update the extension in this file if needed) and it will
   replace the branded placeholder automatically, no code changes
   needed. Recommended: 800x600px, well-lit, consistent crop.
   See images/README.md for the full shot list.
   ============================================================ */

// Central contact config — change once, updates everywhere.
const CONTACT = {
  whatsappNumber: "256758990778", // digits only, country code first
  callNumber: "+256 758 990 778",
  whatsappDisplay: "+256 758 990 778",
};

// Dressings customers can choose for salads (no extra charge)
const DRESSINGS = [
  "Lemon dressing",
  "Caesar dressing",
  "Balsamic dressing",
  "Peanut butter dressing",
  "Herby yogurt dressing",
  "Green goddess dressing",
  "Thai dressing",
  "Honey & mustard dressing",
  "Orange vinaigrette dressing",
  "Creamy vinaigrette dressing",
];

// Paid add-ons/extras, grouped
const ADDON_GROUPS = [
  {
    label: "Cheese",
    options: [
      { id: "feta", name: "Feta", price: 7000 },
      { id: "halloumi", name: "Halloumi", price: 9000 },
      { id: "mozzarella", name: "Mozzarella", price: 7000 },
      { id: "parmesan", name: "Parmesan", price: 12000 },
    ],
  },
  {
    label: "Extras",
    options: [
      { id: "egg", name: "Egg", price: 5000 },
      { id: "avocado", name: "Avocado", price: 4000 },
      { id: "chicken", name: "Chicken", price: 13000 },
      { id: "beef", name: "Beef", price: 11000 },
      { id: "salmon", name: "Salmon", price: 21000 },
    ],
  },
];

// id, name, price (UGX), description, tags, category, dressing, popular, image
const MENU = {
  salads: [
    { id: "sal-01", name: "Classic Garden Salad", price: 22000, desc: "Lettuce, iceberg, rocket leaves, cucumber, cherry tomatoes, red onions, carrots, avocado.", tags: ["Fresh", "Vegetarian"], dressing: true, popular: true, image: "images/garden-Salad.png" },
    { id: "sal-02", name: "Classic Caesar Salad", price: 25000, desc: "Romaine lettuce, Parmesan cheese, croutons, caesar dressing.", tags: ["Signature"], dressing: true, popular: true, image: "images/Ceasar-salad.png" },
    { id: "sal-03", name: "Potato Salad", price: 22000, desc: "Boiled potatoes, celery, fresh herbs, red onions, dill pickles, boiled eggs, avocado.", tags: ["Hearty"], dressing: true, image: "images/potato-salad.png" },
    { id: "sal-04", name: "Pasta Salad", price: 32000, desc: "Fusilli pasta, scallion, cherry tomatoes, orange, basil, almond nuts, boiled eggs, sesame seeds, grilled beef fillet, Parmesan cheese.", tags: ["High Protein"], dressing: true, image: "images/pasta-salad.png" },
    { id: "sal-05", name: "Thai Beef Salad", price: 30000, desc: "Lettuce, cilantro, parsley, cucumber, cherry tomatoes, red onions, carrots, avocado, grilled beef fillet.", tags: ["High Protein"], dressing: true, image: "images/thai-beef.png" },
    { id: "sal-06", name: "Halloumi Salad", price: 25000, desc: "Lettuce, red onions, cherry tomatoes, cucumber, red bell pepper, carrots, nectarine, basil, chives, walnuts, halloumi cheese.", tags: ["Vegetarian"], dressing: true, image: "images/halloumi.png" },
    { id: "sal-07", name: "Caprese & Avocado Salad", price: 25000, desc: "Mozzarella cheese, tomatoes, basil leaves, avocado.", tags: ["Vegetarian", "Fresh"], dressing: true, image: "images/caprese.png" },
    { id: "sal-08", name: "Rainbow Salad", price: 25000, desc: "Purple cabbage, carrots, cucumber, sweet corn, apples, avocado, boiled eggs, cherry tomatoes.", tags: ["Fresh", "Popular"], dressing: true, popular: true, image: "images/rainbow-salad.png" },
    { id: "sal-09", name: "Seafood Salad", price: 40000, desc: "Salad mix, parsley, quinoa, cherry tomatoes, red onions, shrimp, calamari, salmon, avocado.", tags: ["High Protein"], dressing: true, image: "images/sea-food.png" },
    { id: "sal-10", name: "Quinoa Salad", price: 28000, desc: "Quinoa, bell peppers, carrots, cucumber, red onions, cherry tomatoes, parsley, avocado, chick peas.", tags: ["Vegetarian", "Healthy Choice"], dressing: true, image: "images/quionoa.png" },
    { id: "sal-11", name: "Chicken Broccoli Salad", price: 34000, desc: "Broccoli, salad mix, sweet corn, herbs, pomegranate, walnuts, grilled chicken breast.", tags: ["High Protein"], dressing: true, image: "images/chicken-brocoli.png" },
    { id: "sal-12", name: "Chick Pea Salad", price: 25000, desc: "Chick peas, salad mix, cherry tomatoes, red onions, cucumber, radish, lemon zest, feta cheese, avocado.", tags: ["Vegetarian"], dressing: true, image: "images/chic-pea.png" },
    { id: "sal-13", name: "Texas Salad", price: 30000, desc: "Rocket leaves, basil, lettuce, cherry tomatoes, sweet corn, olives, feta cheese, grilled chicken breast.", tags: ["High Protein"], dressing: true, image: "images/texa-salad.png" },
  ],

  juices: [
    { id: "jui-01", name: "Orange", price: 13000, desc: "Freshly pressed orange, 100% natural, no preservatives.", tags: ["Fresh"], image: "images/orange.png" },
    { id: "jui-02", name: "Apple", price: 12000, desc: "Freshly pressed apple juice.", tags: ["Fresh"], image: "images/apple.png" },
    { id: "jui-03", name: "Mixed Berry Juice", price: 17000, desc: "A blend of fresh mixed berries.", tags: ["Fresh", "Popular"], popular: true, image: "images/mixed berr.png" },
    { id: "jui-04", name: "Soursop & Coconut Juice", price: 12000, desc: "Soursop blended with fresh coconut water.", tags: ["Fresh"], image: "images/soursop-coconut.png" },
    { id: "jui-05", name: "Kiwi Lemonade", price: 15000, desc: "Kiwi and fresh lemon, lightly sweetened.", tags: ["Fresh"], image: "images/kiwi.png" },
    { id: "jui-06", name: "Strawberry Lemonade", price: 15000, desc: "Strawberry and fresh lemon.", tags: ["Fresh", "Popular"], popular: true, image: "images/strawberry-lemonade.png" },
    { id: "jui-07", name: "Mango, Passion & Carrot Juice", price: 10000, desc: "Mango, passion fruit and carrot pressed together.", tags: ["Fresh"], image: "images/Mango Passion Carrot Juice Delight.png" },
    { id: "jui-08", name: "Beetroot & Mango", price: 10000, desc: "Beetroot and mango juice.", tags: ["Fresh"], image: "images/beetroot.png" },
    { id: "jui-09", name: "Pawpaw & Mango", price: 10000, desc: "Pawpaw and mango juice.", tags: ["Fresh"], image: "images/pawpaw-mango.png" },
    { id: "jui-10", name: "Tropical Juice", price: 10000, desc: "A tropical fruit blend.", tags: ["Fresh"], image: "images/tropical.png" },
    { id: "jui-11", name: "Pineapple Mint", price: 10000, desc: "Pineapple juice with fresh mint.", tags: ["Fresh"], image: "images/pineaple-mint.png" },
  ],

  detox: [
    { id: "det-01", name: "Green Shots", price: 18000, desc: "Green apples, celery, cucumber, spinach, moringa (optional), ginger, lemon juice, coconut water. Sold as a half dozen.", tags: ["Detox", "Popular"], popular: true, image: "images/green-shot.png" },
    { id: "det-02", name: "Red Shots", price: 18000, desc: "Beetroot, red apples, cranberry, ginger, lemon, hibiscus, pineapple. Sold as a half dozen.", tags: ["Detox"], image: "images/redshot.png" },
    { id: "det-03", name: "Orange Shots (Retinol)", price: 18000, desc: "Orange, apples, tangerine, lemon, ginger, turmeric, carrots. Sold as a half dozen.", tags: ["Detox"], image: "images/orange-shot.png" },
  ],

  smoothies: [
    { id: "smo-01", name: "Mixed Berry Smoothie", price: 20000, desc: "Blackberries, blueberries, strawberries, goose berries, crane berries, greek yogurt, milk (choice), honey, peanut butter (optional).", tags: ["Popular"], popular: true, image: "images/Refreshing Berry Smoothies with Fresh Garnishes.png" },
    { id: "smo-02", name: "Green Power Smoothie", price: 18000, desc: "Spinach, kale, celery, pineapple, apple, banana, mint, moringa, chia seeds, greek yogurt, almond milk, almond nuts, dates, honey.", tags: ["Healthy Choice"], image: "images/green-power.png" },
    { id: "smo-03", name: "Tropical Smoothie", price: 19000, desc: "Banana, mango, pineapple, apple, strawberry, mint, beetroot, oats, milk (choice), greek yogurt, dates, honey, peanut butter.", tags: [], image: "images/tropical-smoothie.png" },
    { id: "smo-04", name: "Strawberry & Banana Smoothie", price: 17000, desc: "Strawberries, banana, coconut milk, greek yogurt, honey.", tags: [], image: "images/strawberry-nanana.png" },
    { id: "smo-05", name: "Beetroot & Banana Smoothie", price: 15000, desc: "Beetroot, banana, plain yogurt, dates, milk (choice).", tags: [], image: "images/beetroot-smoothie.png" },
    { id: "smo-06", name: "Banana Smoothie", price: 15000, desc: "Banana, milk (choice), oats, yogurt, dates, peanut butter, honey.", tags: [], image: "images/banana-smoothie.png" },
    { id: "smo-07", name: "Mango & Banana Smoothie", price: 15000, desc: "Mango, banana, milk (choice), yogurt, dates, honey.", tags: [], image: "images/mango-banana.png" },
  ],

  shakes: [
    { id: "sha-01", name: "Mixed Berry Shake", price: 23000, desc: "Mixed berries, dates, bananas, greek yogurt, almond milk, peanut butter, protein powder.", tags: ["High Protein"], image: "images/mixwd-berry.png" },
    { id: "sha-02", name: "Green Power Shake", price: 22000, desc: "Spinach, kale, celery, mint, apple, chia seeds, banana, pineapple, dates, almond or coconut milk, moringa, honey, protein powder.", tags: ["High Protein"], image: "images/greenpower.png" },
    { id: "sha-03", name: "Tropical Protein Shake", price: 25000, desc: "Oats, raw egg (optional), chia seeds, moringa, banana, pineapple, apple, berries, mint, dates, greek yogurt, almond or coconut milk, peanut butter, protein powder.", tags: ["High Protein", "Popular"], popular: true, image: "images/tropical-shake.png" },
  ],

  breakfast: [
    { id: "bre-01", name: "Fruit Parfait", price: 19000, desc: "Greek yogurt, blueberry jam, granola, fruits, honey, almond nuts.", tags: ["Fresh"], image: "images/fruit-parfait.png" },
    { id: "bre-02", name: "Oat Meal", price: 18000, desc: "Oats, blueberries, strawberries, bananas, almond nuts, pumpkin seeds, coconut flakes.", tags: ["Healthy Choice"], image: "images/oat.png" },
    { id: "bre-03", name: "Chia Seed Pudding Parfait", price: 21000, desc: "Chia pudding, blueberries, greek yogurt, mango puree, granola, strawberries, dragon fruit.", tags: ["Popular"], popular: true, image: "images/chia-seed.png" },
    { id: "bre-04", name: "Breakfast Power Bowl", price: 26000, desc: "Boiled eggs, avocado, mixed fruits, mixed greens, toasted cereal bread.", tags: ["High Protein"], image: "images/breakfast.png" },
    { id: "bre-05", name: "Muesli", price: 18000, desc: "Plain or mixed berry yogurt, muesli cereal, almond nuts, fruits, honey.", tags: [], image: "images/muesli.png" },
    { id: "bre-06", name: "Fruit Salad", price: 22000, desc: "All kinds of fresh fruits.", tags: ["Vegetarian", "Fresh"], image: "images/fruit salad.png" },
  ],
};

// Weekly meal plan package
const MEAL_PLAN = {
  name: "Weekly Healthy Meal Plan",
  price: 380000,
  desc: "A convenient weekly package designed to help you stay healthy, energized and nourished throughout the week.",
  choiceLimit: 3,
  image: "images/weekly.jpeg",
  includes: [
    { label: "Breakfast (4)", items: "2 Fruit Parfaits, 2 Chia Seed Pudding Parfaits" },
    { label: "Signature Salads (3)", items: "Choose any 3 salads from our menu" },
    { label: "Fresh Juices (5)", items: "Mango, Passion Fruit, Carrot, Pineapple, Watermelon" },
    { label: "Detox Shots", items: "Half dozen Green Detox Shots (or your preferred shot)" },
    { label: "Fresh Fruit Box (4)", items: "Mangoes, Mixed Berries & Grapes, Watermelon, Pineapple" },
    { label: "Protein Shakes & Smoothies", items: "Any 2 Protein Shakes, Any 3 Smoothies" },
  ],
  disclaimer: "Meal plans are general food options and are not intended to replace professional medical or nutritional advice.",
};

// Category definitions used for nav + section rendering
// icon is used for the branded placeholder shown until a real photo exists
const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "salads", label: "Salads", icon: "🥗" },
  { id: "juices", label: "Fresh Juices", icon: "🍊" },
  { id: "detox", label: "Detox Shots", icon: "🌿" },
  { id: "smoothies", label: "Smoothies", icon: "🍓" },
  { id: "shakes", label: "Protein Shakes", icon: "💪" },
  { id: "breakfast", label: "Breakfast", icon: "🍳" },
  { id: "plan", label: "Meal Plan", icon: "🗓️" },
];
