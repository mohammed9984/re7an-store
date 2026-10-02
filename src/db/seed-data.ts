export type SeedVariant = { size: string; ml: number; price: number; compareAt?: number; stock: number };

export type SeedProduct = {
  slug: string;
  name: string;
  arabicName: string;
  collection: string;
  gender: "women" | "men" | "unisex" | "kids";
  family: string;
  concentration: string;
  ageGroup: string;
  tagline: string;
  description: string;
  story: string;
  top: string[];
  heart: string[];
  base: string[];
  images: string[];
  seasons: string[];
  occasions: string[];
  longevity: number;
  sillage: number;
  featured?: boolean;
  bestseller?: boolean;
  isNew?: boolean;
  sales: number;
  daysAgo: number;
  reviewTarget: number;
  variants: SeedVariant[];
};

const S = (id: string) => `/images/stock/${id}.jpg`;
const C = (name: string) => `/images/collections/${name}.jpg`;

export const SEED_COLLECTIONS = [
  {
    slug: "women",
    name: "For Her",
    arabicName: "لها",
    tagline: "Florals, musks & soft gourmands",
    description:
      "Luminous roses, Egyptian jasmine and velvety vanillas — fragrances that feel romantic, confident and unmistakably you.",
    image: C("women"),
    sortOrder: 1,
  },
  {
    slug: "men",
    name: "For Him",
    arabicName: "له",
    tagline: "Woods, leather & sea air",
    description:
      "From Mediterranean breezes to midnight leather and saffron — refined scents with character and serious staying power.",
    image: C("men"),
    sortOrder: 2,
  },
  {
    slug: "unisex",
    name: "Unisex",
    arabicName: "للجميع",
    tagline: "Scents without rules",
    description:
      "Fresh basil, white musk and golden amber made to be shared — by partners, siblings and generations.",
    image: C("unisex"),
    sortOrder: 3,
  },
  {
    slug: "oud-oriental",
    name: "Oud & Oriental",
    arabicName: "عود وشرقي",
    tagline: "The soul of the Orient",
    description:
      "Precious oud, saffron, incense and rose attars inspired by the perfume souks of old Cairo.",
    image: C("oud"),
    sortOrder: 4,
  },
  {
    slug: "kids-teens",
    name: "Kids & Teens",
    arabicName: "للصغار",
    tagline: "Gentle, joyful, alcohol-free",
    description:
      "Dermatologist-tested mists and first perfumes for little ones and teens — light, happy and parent-approved.",
    image: C("kids"),
    sortOrder: 5,
  },
  {
    slug: "gift-sets",
    name: "Gift Sets",
    arabicName: "هدايا",
    tagline: "Wrapped & ready to delight",
    description:
      "Keepsake boxes, discovery sets and duos for Eid, weddings, birthdays and every reason in between.",
    image: C("gifts"),
    sortOrder: 6,
  },
];

const edp = (s30: number, s50: number, s100: number, stock: [number, number, number]): SeedVariant[] => [
  { size: "30 ml", ml: 30, price: s30, stock: stock[0] },
  { size: "50 ml", ml: 50, price: s50, stock: stock[1] },
  { size: "100 ml", ml: 100, price: s100, stock: stock[2] },
];

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    slug: "re7an-signature",
    name: "Re7an Signature",
    arabicName: "ريحان سيجنتشر",
    collection: "unisex",
    gender: "unisex",
    family: "fresh",
    concentration: "Eau de Parfum",
    ageGroup: "All ages",
    tagline: "Sweet basil, green fig and bergamot. Our namesake.",
    description:
      "The scent that started it all. Crushed sweet basil and bergamot open green and sparkling, a heart of fig leaf and neroli adds sunny warmth, and vetiver with white musk keeps it close for hours. Fresh, uplifting and effortlessly elegant — for anyone, anywhere.",
    story:
      "Re7an (ريحان) is the Egyptian word for basil — the herb grandmothers grow on every Cairo balcony, the scent of home. We built our entire house around it.",
    top: ["Sweet basil", "Bergamot", "Pink grapefruit"],
    heart: ["Fig leaf", "Neroli", "Green tea"],
    base: ["Vetiver", "White musk", "Cedar"],
    images: ["/images/products/re7an-signature.jpg", C("unisex"), S("8450107")],
    seasons: ["All year"],
    occasions: ["Everyday", "Office", "Daytime"],
    longevity: 4,
    sillage: 3,
    featured: true,
    bestseller: true,
    sales: 2480,
    daysAgo: 360,
    reviewTarget: 18,
    variants: edp(690, 1050, 1650, [60, 72, 48]),
  },
  {
    slug: "zamalek-rose",
    name: "Zamalek Rose",
    arabicName: "ورد الزمالك",
    collection: "women",
    gender: "women",
    family: "floral",
    concentration: "Eau de Parfum",
    ageGroup: "Adults",
    tagline: "Damask rose at golden hour on the Nile corniche.",
    description:
      "A luminous rose for the woman who walks into a room and softens it. Fresh lychee and pink pepper open onto a heart of Damask rose and dewy peony, settling into creamy musk and Atlas cedar that hums on the skin for hours.",
    story:
      "Inspired by the jacaranda-lined streets of Zamalek, where old villas hide rose gardens behind wrought-iron gates. We blend Egyptian rose absolute with a modern musk accord so it feels romantic, never old-fashioned.",
    top: ["Lychee", "Pink pepper", "Bergamot"],
    heart: ["Damask rose", "Peony", "Magnolia"],
    base: ["White musk", "Atlas cedar", "Ambrette"],
    images: [S("4938265"), S("18745781"), C("women")],
    seasons: ["Spring", "Autumn"],
    occasions: ["Daytime", "Date night", "Office"],
    longevity: 4,
    sillage: 3,
    featured: true,
    bestseller: true,
    sales: 1840,
    daysAgo: 320,
    reviewTarget: 16,
    variants: edp(690, 1050, 1650, [40, 55, 32]),
  },
  {
    slug: "khan-el-khalili",
    name: "Khan El Khalili",
    arabicName: "خان الخليلي",
    collection: "oud-oriental",
    gender: "unisex",
    family: "oriental",
    concentration: "Eau de Parfum",
    ageGroup: "Adults",
    tagline: "Spice markets, incense and amber in old Cairo.",
    description:
      "Wander the lanes of the old bazaar: cinnamon, clove and saffron drift from the spice stalls, rose and frankincense curl out of the attar shops, and a warm base of amber, benzoin and oud lingers like the glow of brass lanterns.",
    story:
      "Founded in 1382, Khan El Khalili is one of the oldest markets in the world. Our perfumer's grandfather sold oils there — this is a scent full of memory.",
    top: ["Cinnamon", "Clove", "Saffron"],
    heart: ["Rose", "Frankincense", "Myrrh"],
    base: ["Amber", "Benzoin", "Oud"],
    images: [S("7075055"), C("oud")],
    seasons: ["Autumn", "Winter"],
    occasions: ["Evening", "Ramadan nights", "Special occasions"],
    longevity: 5,
    sillage: 4,
    featured: true,
    bestseller: true,
    sales: 2050,
    daysAgo: 330,
    reviewTarget: 17,
    variants: edp(750, 1150, 1790, [38, 46, 30]),
  },
  {
    slug: "cairo-nights",
    name: "Cairo Nights",
    arabicName: "ليالي القاهرة",
    collection: "men",
    gender: "men",
    family: "oriental",
    concentration: "Eau de Parfum",
    ageGroup: "Adults",
    tagline: "Leather, tobacco and cardamom after midnight downtown.",
    description:
      "A magnetic evening scent. Cardamom and bergamot spark the opening; a heart of tobacco leaf and supple leather unfolds, warmed by labdanum, tonka and smoky vetiver. Confident without ever shouting.",
    story:
      "Downtown Cairo never sleeps — jazz from a rooftop, conversations on Champollion Street that run until dawn. Cairo Nights is that energy, distilled.",
    top: ["Cardamom", "Bergamot", "Black pepper"],
    heart: ["Tobacco leaf", "Leather", "Iris"],
    base: ["Labdanum", "Tonka bean", "Vetiver"],
    images: [S("30263576"), C("men"), S("21614757")],
    seasons: ["Autumn", "Winter"],
    occasions: ["Evening", "Date night", "Special occasions"],
    longevity: 5,
    sillage: 4,
    featured: true,
    bestseller: true,
    sales: 1690,
    daysAgo: 300,
    reviewTarget: 15,
    variants: [
      { size: "50 ml", ml: 50, price: 1250, stock: 45 },
      { size: "100 ml", ml: 100, price: 1950, stock: 38 },
    ],
  },
  {
    slug: "luxor-gold",
    name: "Luxor Gold",
    arabicName: "ذهب الأقصر",
    collection: "oud-oriental",
    gender: "unisex",
    family: "oud",
    concentration: "Extrait de Parfum",
    ageGroup: "Adults",
    tagline: "Cambodian oud, saffron and Taif rose in pure gold.",
    description:
      "Our masterpiece. Saffron and pink pepper open onto a sumptuous heart of Taif rose and Cambodian oud, deepened with amber, leather and precious sandalwood. Rich, regal and astonishingly long-lasting — one spray is enough.",
    story:
      "Luxor was once Thebes, capital of the pharaohs and home to treasures of gold. This extrait — 30% perfume oils — is our tribute to that splendour, aged for eight weeks before bottling.",
    top: ["Saffron", "Pink pepper", "Raspberry"],
    heart: ["Taif rose", "Cambodian oud", "Patchouli"],
    base: ["Amber", "Leather", "Sandalwood"],
    images: [S("38721545"), C("oud")],
    seasons: ["Autumn", "Winter"],
    occasions: ["Weddings", "Evening", "Special occasions"],
    longevity: 5,
    sillage: 5,
    featured: true,
    bestseller: true,
    sales: 1340,
    daysAgo: 310,
    reviewTarget: 14,
    variants: [
      { size: "50 ml", ml: 50, price: 1850, stock: 18 },
      { size: "100 ml", ml: 100, price: 2950, stock: 0 },
    ],
  },
  {
    slug: "yasmina",
    name: "Yasmina",
    arabicName: "ياسمينة",
    collection: "women",
    gender: "women",
    family: "floral",
    concentration: "Eau de Parfum",
    ageGroup: "Adults",
    tagline: "Egyptian jasmine, picked at dawn in Gharbia.",
    description:
      "A radiant white floral built around jasmine grandiflorum from the fields of Gharbia — the source of much of the world's jasmine absolute. Orange blossom and neroli brighten the opening; tuberose and sandalwood make the dry-down velvety and sensual.",
    story:
      "Every summer, families in Shubra Beltan pick jasmine before sunrise, when its scent is strongest. Yasmina is our love letter to them — and a favourite among brides across Egypt.",
    top: ["Neroli", "Mandarin", "Green leaves"],
    heart: ["Egyptian jasmine", "Orange blossom", "Tuberose"],
    base: ["Sandalwood", "Musk", "Benzoin"],
    images: [S("8450150"), S("38703053"), "/images/story.jpg"],
    seasons: ["Spring", "Summer"],
    occasions: ["Weddings", "Evening", "Special occasions"],
    longevity: 4,
    sillage: 4,
    featured: true,
    bestseller: true,
    sales: 1520,
    daysAgo: 290,
    reviewTarget: 14,
    variants: edp(690, 1050, 1650, [36, 48, 25]),
  },
  {
    slug: "sahara-musk",
    name: "Sahara Musk",
    arabicName: "مسك الصحراء",
    collection: "unisex",
    gender: "unisex",
    family: "musky",
    concentration: "Eau de Parfum",
    ageGroup: "All ages",
    tagline: "Clean white musk, warm sand and soft iris.",
    description:
      "Skin, but better. A soft halo of white musk and ambrette, a powdery heart of iris and cotton flower, and a warm base of cashmere wood that feels like sun-warmed sand. Universally loved and endlessly layerable.",
    story:
      "The desert is the cleanest place on earth. Sahara Musk is our modern take on the white musk every Egyptian family keeps in the wardrobe — refined, airy and long-lasting.",
    top: ["Aldehydes", "Pear", "Ambrette"],
    heart: ["White musk", "Iris", "Cotton flower"],
    base: ["Cashmere wood", "Ambrox", "Sandalwood"],
    images: [S("8361538"), S("8361540"), S("8361545")],
    seasons: ["All year"],
    occasions: ["Everyday", "Office", "Layering"],
    longevity: 4,
    sillage: 2,
    bestseller: true,
    sales: 1960,
    daysAgo: 340,
    reviewTarget: 16,
    variants: edp(650, 990, 1550, [55, 64, 40]),
  },
  {
    slug: "nile-dusk",
    name: "Nile Dusk",
    arabicName: "غروب النيل",
    collection: "unisex",
    gender: "unisex",
    family: "woody",
    concentration: "Eau de Parfum",
    ageGroup: "Adults",
    tagline: "Papyrus, amber and sandalwood as the sun sets over the Nile.",
    description:
      "A warm, golden embrace. Cardamom and mandarin glow against a heart of papyrus and iris, melting into creamy sandalwood, amber and a whisper of vanilla. Soft enough for daytime, rich enough for night.",
    story:
      "Our perfumer sketched this scent on a felucca in Aswan, watching the sky turn from gold to violet. It's the hour when Egypt is at its most beautiful.",
    top: ["Cardamom", "Mandarin", "Saffron"],
    heart: ["Papyrus", "Iris", "Orris butter"],
    base: ["Sandalwood", "Amber", "Vanilla"],
    images: [S("5790458"), S("19663386")],
    seasons: ["Autumn", "Winter", "Spring"],
    occasions: ["Evening", "Date night", "Everyday"],
    longevity: 4,
    sillage: 4,
    featured: true,
    sales: 1120,
    daysAgo: 280,
    reviewTarget: 11,
    variants: edp(750, 1150, 1790, [30, 42, 35]),
  },
  {
    slug: "oud-royale",
    name: "Oud Royale",
    arabicName: "عود رويال",
    collection: "oud-oriental",
    gender: "unisex",
    family: "oud",
    concentration: "Perfume Oil",
    ageGroup: "Adults",
    tagline: "Pure oud oil, alcohol-free, in the Arabian tradition.",
    description:
      "A concentrated, alcohol-free perfume oil centred on aged Assam oud, softened with Bulgarian rose and finished with ambergris and musk. Apply a single drop to the wrists and behind the ears — it evolves beautifully on skin for twelve hours or more.",
    story:
      "Perfume oils have been worn in Egypt for over 3,000 years. Oud Royale is decanted by hand into crystal bottles, just as it has been for generations in the attar shops of Al-Muizz Street.",
    top: ["Saffron", "Bergamot"],
    heart: ["Assam oud", "Bulgarian rose"],
    base: ["Ambergris", "Musk", "Sandalwood"],
    images: [S("30981935"), S("6693977"), C("oud")],
    seasons: ["Autumn", "Winter"],
    occasions: ["Evening", "Eid gatherings", "Special occasions"],
    longevity: 5,
    sillage: 4,
    bestseller: true,
    sales: 1180,
    daysAgo: 260,
    reviewTarget: 13,
    variants: [
      { size: "6 ml", ml: 6, price: 950, stock: 24 },
      { size: "12 ml", ml: 12, price: 1750, stock: 15 },
    ],
  },
  {
    slug: "mango-sorbet",
    name: "Mango Sorbet",
    arabicName: "مانجو سوربيه",
    collection: "kids-teens",
    gender: "kids",
    family: "gourmand",
    concentration: "Body Mist",
    ageGroup: "Teens 12+",
    tagline: "Juicy Ismailia mango, peach and a swirl of sugar.",
    description:
      "A playful, alcohol-free body mist bursting with ripe mango, peach nectar and a creamy sorbet base. Light, joyful and perfect for school days, the club, or the beach in Sahel.",
    story:
      "Egyptian summer means mango season — and the best mangoes come from Ismailia. We made a mist that smells exactly like the first slice.",
    top: ["Mango", "Peach", "Mandarin"],
    heart: ["Coconut water", "Freesia"],
    base: ["Vanilla sorbet", "Soft musk"],
    images: [C("kids"), S("30999240")],
    seasons: ["Summer", "Spring"],
    occasions: ["School", "Beach", "Everyday"],
    longevity: 2,
    sillage: 2,
    bestseller: true,
    sales: 1450,
    daysAgo: 180,
    reviewTarget: 12,
    variants: [
      { size: "100 ml", ml: 100, price: 390, compareAt: 450, stock: 80 },
      { size: "200 ml", ml: 200, price: 590, compareAt: 690, stock: 52 },
    ],
  },
  {
    slug: "velvet-vanilla",
    name: "Velvet Vanilla",
    arabicName: "فانيليا مخملية",
    collection: "women",
    gender: "women",
    family: "gourmand",
    concentration: "Eau de Parfum",
    ageGroup: "Adults",
    tagline: "Madagascar vanilla wrapped in cashmere.",
    description:
      "A cosy, addictive gourmand: salted caramel and pink pepper on top, a heart of bourbon vanilla and jasmine sambac, and a base of tonka bean and praline that lingers on scarves for days.",
    story:
      "Created for long winter evenings in Cairo — the kind spent with hot sahlab and good company. It's the most complimented scent at our Zamalek boutique.",
    top: ["Salted caramel", "Pink pepper", "Pear"],
    heart: ["Bourbon vanilla", "Jasmine sambac", "Orchid"],
    base: ["Tonka bean", "Praline", "Cashmere wood"],
    images: [S("7005940"), C("women")],
    seasons: ["Autumn", "Winter"],
    occasions: ["Evening", "Date night", "Cosy days"],
    longevity: 5,
    sillage: 4,
    sales: 980,
    daysAgo: 250,
    reviewTarget: 10,
    variants: [
      { size: "30 ml", ml: 30, price: 590, compareAt: 690, stock: 26 },
      { size: "50 ml", ml: 50, price: 890, compareAt: 1050, stock: 34 },
      { size: "100 ml", ml: 100, price: 1390, compareAt: 1650, stock: 3 },
    ],
  },
  {
    slug: "alexandria-breeze",
    name: "Alexandria Breeze",
    arabicName: "نسيم إسكندرية",
    collection: "men",
    gender: "men",
    family: "aquatic",
    concentration: "Eau de Toilette",
    ageGroup: "Adults",
    tagline: "Mediterranean salt air along the Corniche.",
    description:
      "Crisp, clean and endlessly wearable. Sea salt and bergamot meet a heart of sage and geranium, resting on ambergris and white cedar. Your go-to for hot summer days and long office hours alike.",
    story:
      "For everyone who grew up spending summers in Alexandria — fresh fish in Bahary, sunsets at Stanley Bridge, the sea wind that follows you home.",
    top: ["Sea salt", "Bergamot", "Grapefruit"],
    heart: ["Sage", "Geranium", "Marine accord"],
    base: ["Ambergris", "White cedar", "Musk"],
    images: [S("31612011"), S("21614757")],
    seasons: ["Spring", "Summer"],
    occasions: ["Daytime", "Office", "Sport"],
    longevity: 3,
    sillage: 3,
    sales: 1210,
    daysAgo: 270,
    reviewTarget: 11,
    variants: [
      { size: "50 ml", ml: 50, price: 850, stock: 50 },
      { size: "100 ml", ml: 100, price: 1350, stock: 44 },
    ],
  },
  {
    slug: "cotton-cloud",
    name: "Cotton Cloud",
    arabicName: "سحابة قطن",
    collection: "kids-teens",
    gender: "kids",
    family: "musky",
    concentration: "Body Mist",
    ageGroup: "Kids 3+",
    tagline: "Soft as a fresh cotton blanket — gentle for little ones.",
    description:
      "An ultra-gentle, alcohol-free, hypoallergenic mist for children. Clean cotton, a hint of pear and powdery vanilla milk — the comforting smell of fresh laundry and bedtime cuddles. Dermatologically tested.",
    story:
      "Developed with Egyptian paediatric dermatologists for sensitive skin, Cotton Cloud contains no alcohol, no parabens and no harsh allergens. Moms love it as much as kids do.",
    top: ["Pear", "Mandarin"],
    heart: ["Cotton flower", "Lily of the valley"],
    base: ["Vanilla milk", "Powdery musk"],
    images: [S("2417856"), C("kids")],
    seasons: ["All year"],
    occasions: ["Everyday", "Bedtime", "School"],
    longevity: 2,
    sillage: 1,
    sales: 1020,
    daysAgo: 240,
    reviewTarget: 10,
    variants: [
      { size: "100 ml", ml: 100, price: 350, stock: 70 },
      { size: "200 ml", ml: 200, price: 520, stock: 45 },
    ],
  },
  {
    slug: "dahab-blue",
    name: "Dahab Blue",
    arabicName: "دهب الأزرق",
    collection: "men",
    gender: "men",
    family: "aquatic",
    concentration: "Eau de Toilette",
    ageGroup: "Adults",
    tagline: "Red Sea blue, spearmint and grapefruit.",
    description:
      "Bright and energising. Grapefruit and spearmint fizz over a cool heart of lavender and marine notes, settling into a clean musk and driftwood base. Made for diving into the Blue Hole — or just Monday mornings.",
    story:
      "Dahab means gold in Arabic, but for anyone who has visited it means turquoise water, lazy cafés and the freedom of the sea. This one is for the free spirits.",
    top: ["Grapefruit", "Spearmint", "Lemon"],
    heart: ["Lavender", "Marine notes", "Rosemary"],
    base: ["Clean musk", "Driftwood", "Amber"],
    images: [S("8361528"), C("unisex")],
    seasons: ["Summer", "Spring"],
    occasions: ["Daytime", "Sport", "Casual"],
    longevity: 3,
    sillage: 3,
    sales: 890,
    daysAgo: 230,
    reviewTarget: 9,
    variants: [
      { size: "50 ml", ml: 50, price: 680, compareAt: 850, stock: 42 },
      { size: "100 ml", ml: 100, price: 1080, compareAt: 1350, stock: 37 },
    ],
  },
  {
    slug: "discovery-set",
    name: "The Discovery Set",
    arabicName: "مجموعة الاكتشاف",
    collection: "gift-sets",
    gender: "unisex",
    family: "assorted",
    concentration: "Gift Set",
    ageGroup: "Adults",
    tagline: "Six bestsellers in 10 ml — find your signature.",
    description:
      "Can't decide? Explore six of our most-loved scents in elegant 10 ml sprays: Re7an Signature, Zamalek Rose, Cairo Nights, Khan El Khalili, Sahara Musk and Nile Dusk. Includes an EGP 300 voucher toward any full-size bottle.",
    story:
      "Every set is packed by hand at our Cairo atelier in a reusable oak tray box — the perfect gift, or the smartest way to find your forever scent.",
    top: ["Re7an Signature 10 ml", "Zamalek Rose 10 ml"],
    heart: ["Khan El Khalili 10 ml", "Nile Dusk 10 ml"],
    base: ["Cairo Nights 10 ml", "Sahara Musk 10 ml"],
    images: ["/images/products/discovery-set.jpg", C("gifts")],
    seasons: ["All year"],
    occasions: ["Gifting", "Travel", "Discovery"],
    longevity: 4,
    sillage: 3,
    featured: true,
    sales: 870,
    daysAgo: 160,
    reviewTarget: 11,
    variants: [{ size: "6 × 10 ml", ml: 60, price: 1250, stock: 50 }],
  },
  {
    slug: "sinai-cedar",
    name: "Sinai Cedar",
    arabicName: "أرز سيناء",
    collection: "men",
    gender: "men",
    family: "woody",
    concentration: "Eau de Parfum",
    ageGroup: "Adults",
    tagline: "Dry woods and warm stone under the Sinai sun.",
    description:
      "An elegant, dry woody scent with a mineral edge. Black pepper and juniper open onto smoky cedarwood and cypress, finishing with vetiver and a touch of incense — like a sunrise climb up Mount Sinai.",
    story:
      "Inspired by the granite mountains of South Sinai and the Bedouin campfires that warm the desert night. Rugged, honest and quietly refined.",
    top: ["Black pepper", "Juniper", "Elemi"],
    heart: ["Cedarwood", "Cypress", "Clary sage"],
    base: ["Vetiver", "Incense", "Patchouli"],
    images: [S("8361484"), C("men")],
    seasons: ["Autumn", "Winter", "Spring"],
    occasions: ["Office", "Daytime", "Evening"],
    longevity: 4,
    sillage: 3,
    sales: 760,
    daysAgo: 210,
    reviewTarget: 8,
    variants: [
      { size: "50 ml", ml: 50, price: 1150, stock: 33 },
      { size: "100 ml", ml: 100, price: 1790, stock: 27 },
    ],
  },
  {
    slug: "aswan-amber",
    name: "Aswan Amber",
    arabicName: "عنبر أسوان",
    collection: "oud-oriental",
    gender: "unisex",
    family: "amber",
    concentration: "Eau de Parfum",
    ageGroup: "Adults",
    tagline: "Golden amber, benzoin and Nubian spice.",
    description:
      "Liquid sunshine. Warm amber resin and benzoin glow at the heart, framed by pink pepper and orange on top and a velvety base of vanilla, labdanum and musk. Cosy, radiant and gorgeous on everyone.",
    story:
      "In the Nubian villages near Aswan, houses are painted in bold colours and guests are welcomed with incense and hibiscus tea. Aswan Amber captures that generous warmth.",
    top: ["Pink pepper", "Orange", "Cardamom"],
    heart: ["Amber resin", "Benzoin", "Cinnamon"],
    base: ["Vanilla", "Labdanum", "Musk"],
    images: [S("28664165"), C("oud")],
    seasons: ["Autumn", "Winter"],
    occasions: ["Evening", "Everyday", "Cosy days"],
    longevity: 4,
    sillage: 4,
    sales: 720,
    daysAgo: 200,
    reviewTarget: 9,
    variants: [
      { size: "50 ml", ml: 50, price: 1040, compareAt: 1150, stock: 29 },
      { size: "100 ml", ml: 100, price: 1610, compareAt: 1790, stock: 21 },
    ],
  },
  {
    slug: "ramses-intense",
    name: "Ramses Intense",
    arabicName: "رمسيس إنتنس",
    collection: "men",
    gender: "men",
    family: "amber",
    concentration: "Parfum",
    ageGroup: "Adults",
    tagline: "Saffron, frankincense and labdanum — a scent fit for a king.",
    description:
      "Our most powerful creation for men. Saffron and nutmeg blaze over a royal heart of frankincense and davana, resting on labdanum, smoked birch and ambergris. Two sprays carry you from dusk until dawn.",
    story:
      "Named after the greatest of the pharaohs, Ramses Intense is built like a monument — layered, golden and made to last. Composed at parfum concentration (25%).",
    top: ["Saffron", "Nutmeg", "Pink pepper"],
    heart: ["Frankincense", "Davana", "Geranium"],
    base: ["Labdanum", "Smoked birch", "Ambergris"],
    images: [S("38893412"), C("men")],
    seasons: ["Autumn", "Winter"],
    occasions: ["Evening", "Weddings", "Special occasions"],
    longevity: 5,
    sillage: 5,
    sales: 640,
    daysAgo: 150,
    reviewTarget: 9,
    variants: [
      { size: "60 ml", ml: 60, price: 1750, stock: 22 },
      { size: "100 ml", ml: 100, price: 2450, stock: 4 },
    ],
  },
  {
    slug: "his-and-hers-duo",
    name: "His & Hers Duo",
    arabicName: "ثنائي هو وهي",
    collection: "gift-sets",
    gender: "unisex",
    family: "assorted",
    concentration: "Gift Set",
    ageGroup: "Adults",
    tagline: "Cairo Nights & Zamalek Rose, gift-boxed together.",
    description:
      "Our most romantic pairing: Cairo Nights (50 ml) for him and Zamalek Rose (50 ml) for her, presented in a cream and gold keepsake box with a satin ribbon. A favourite for anniversaries, engagements and Valentine's Day.",
    story:
      "Shabka season, wedding season, anniversaries — some moments deserve two bottles. Add a handwritten gift message at checkout and we'll tuck it inside.",
    top: ["Cairo Nights 50 ml"],
    heart: ["Zamalek Rose 50 ml"],
    base: ["Keepsake gift box & ribbon"],
    images: [C("gifts"), S("38703053"), S("19663386")],
    seasons: ["All year"],
    occasions: ["Anniversaries", "Weddings", "Gifting"],
    longevity: 4,
    sillage: 4,
    sales: 530,
    daysAgo: 140,
    reviewTarget: 8,
    variants: [{ size: "2 × 50 ml", ml: 100, price: 1990, compareAt: 2300, stock: 20 }],
  },
  {
    slug: "first-bloom",
    name: "First Bloom",
    arabicName: "أول زهرة",
    collection: "kids-teens",
    gender: "kids",
    family: "floral",
    concentration: "Eau de Toilette",
    ageGroup: "Teens 12+",
    tagline: "A first perfume — pear, freesia and pink musk.",
    description:
      "The perfect first fragrance: crisp pear and pink grapefruit, a delicate bouquet of freesia and peony, and a soft pink musk. Light enough for school, pretty enough for parties — and approved by moms.",
    story:
      "Choosing your first perfume is a milestone. First Bloom was designed with a panel of Cairo teens who told us exactly what they wanted: fresh, sweet and never overpowering.",
    top: ["Pear", "Pink grapefruit", "Green apple"],
    heart: ["Freesia", "Peony", "Lily of the valley"],
    base: ["Pink musk", "Vanilla", "Blonde woods"],
    images: [S("36910560"), S("10536617"), S("9149046")],
    seasons: ["Spring", "Summer"],
    occasions: ["School", "Parties", "Everyday"],
    longevity: 3,
    sillage: 2,
    isNew: true,
    sales: 410,
    daysAgo: 35,
    reviewTarget: 6,
    variants: [
      { size: "50 ml", ml: 50, price: 650, stock: 40 },
      { size: "100 ml", ml: 100, price: 950, stock: 30 },
    ],
  },
  {
    slug: "karkadeh-bloom",
    name: "Karkadeh Bloom",
    arabicName: "زهرة الكركديه",
    collection: "women",
    gender: "women",
    family: "floral",
    concentration: "Eau de Parfum",
    ageGroup: "Adults",
    tagline: "Hibiscus, red berries and a sparkle of sunshine.",
    description:
      "Inspired by Egypt's beloved ruby-red karkadeh. Tart hibiscus and raspberry fizz over a bouquet of rose and peony, drying down to a soft, sheer musk. Joyful, juicy and impossible not to smile in.",
    story:
      "Karkadeh is served iced at every Egyptian celebration. We wanted to bottle that first refreshing sip — tangy, floral and a little bit festive.",
    top: ["Hibiscus", "Raspberry", "Blood orange"],
    heart: ["Rose", "Peony", "Freesia"],
    base: ["Sheer musk", "Blonde woods", "Vanilla"],
    images: [S("7814533"), S("7814534"), S("7814532")],
    seasons: ["Spring", "Summer"],
    occasions: ["Daytime", "Brunch", "Casual"],
    longevity: 3,
    sillage: 3,
    isNew: true,
    sales: 340,
    daysAgo: 30,
    reviewTarget: 5,
    variants: edp(650, 990, 1550, [28, 40, 26]),
  },
  {
    slug: "siwa-oasis",
    name: "Siwa Oasis",
    arabicName: "واحة سيوة",
    collection: "unisex",
    gender: "unisex",
    family: "fresh",
    concentration: "Eau de Parfum",
    ageGroup: "All ages",
    tagline: "Date palm, olive leaf and cool spring water.",
    description:
      "A serene green fragrance. Olive leaf and lime open bright, a heart of date palm, fig and green tea feels cool and calm, and a dry base of vetiver and sandalwood evokes desert air at dusk.",
    story:
      "In the far Western Desert, Siwa's freshwater springs bubble up between date palms and salt lakes. We bottled that rare feeling of stillness.",
    top: ["Olive leaf", "Lime", "Petitgrain"],
    heart: ["Date palm", "Fig", "Green tea"],
    base: ["Vetiver", "Sandalwood", "Salt accord"],
    images: [S("8361479"), C("unisex")],
    seasons: ["Spring", "Summer"],
    occasions: ["Daytime", "Office", "Casual"],
    longevity: 3,
    sillage: 3,
    isNew: true,
    sales: 260,
    daysAgo: 25,
    reviewTarget: 5,
    variants: edp(690, 1050, 1650, [25, 34, 20]),
  },
  {
    slug: "fayoum-rose-attar",
    name: "Fayoum Rose Attar",
    arabicName: "عطر ورد الفيوم",
    collection: "oud-oriental",
    gender: "unisex",
    family: "floral",
    concentration: "Perfume Oil",
    ageGroup: "All ages",
    tagline: "Pure rose oil from the Fayoum oasis — alcohol-free.",
    description:
      "A pure, alcohol-free rose attar from roses grown in the Fayoum oasis, deepened with a drop of oud and warm sandalwood. Silky on skin, gentle enough for daily wear, and beloved by every generation — from teens to grandmothers.",
    story:
      "Rose water and rose oil have perfumed Egyptian homes since the time of Cleopatra. Our attar follows a traditional recipe, blended in small batches and rested in glass for a month.",
    top: ["Rose petals", "Pink pepper"],
    heart: ["Fayoum rose", "Geranium"],
    base: ["Sandalwood", "Oud", "Musk"],
    images: [S("4041388"), S("4041389"), S("18745781")],
    seasons: ["All year"],
    occasions: ["Everyday", "Eid gatherings", "Prayer"],
    longevity: 4,
    sillage: 2,
    isNew: true,
    sales: 180,
    daysAgo: 20,
    reviewTarget: 4,
    variants: [
      { size: "6 ml", ml: 6, price: 650, stock: 30 },
      { size: "12 ml", ml: 12, price: 1150, stock: 18 },
    ],
  },
  {
    slug: "lotus-blue",
    name: "Lotus Blue",
    arabicName: "اللوتس الأزرق",
    collection: "women",
    gender: "women",
    family: "aquatic",
    concentration: "Eau de Toilette",
    ageGroup: "All ages",
    tagline: "The sacred blue lotus of the pharaohs, reimagined.",
    description:
      "Cool, watery and quietly hypnotic. Pear and violet leaf open like morning light on the water, the blue lotus heart floats over water lily and iris, and a soft driftwood base keeps it close and luminous.",
    story:
      "Ancient Egyptians painted the blue lotus on temple walls as a symbol of rebirth. We captured its airy, aquatic floral character in a modern everyday scent that feels like a deep breath.",
    top: ["Pear", "Violet leaf", "Bergamot"],
    heart: ["Blue lotus", "Water lily", "Iris"],
    base: ["Driftwood", "Musk", "Ambroxan"],
    images: [S("33994391"), S("264950")],
    seasons: ["Spring", "Summer"],
    occasions: ["Daytime", "Office", "Casual"],
    longevity: 3,
    sillage: 3,
    isNew: true,
    sales: 210,
    daysAgo: 18,
    reviewTarget: 4,
    variants: [
      { size: "50 ml", ml: 50, price: 850, stock: 30 },
      { size: "100 ml", ml: 100, price: 1350, stock: 22 },
    ],
  },
  {
    slug: "ne3na3-fresh",
    name: "Ne3na3 Fresh",
    arabicName: "نعناع فريش",
    collection: "unisex",
    gender: "unisex",
    family: "fresh",
    concentration: "Eau de Toilette",
    ageGroup: "All ages",
    tagline: "Mint lemonade on a hot summer afternoon.",
    description:
      "Pure refreshment. Egyptian spearmint and lemon burst open, green tea and basil keep it crisp, and a light musk base makes it gentle enough to spray generously. A summer staple for the whole family.",
    story:
      "Nothing beats a glass of lemon-mint juice in July. Ne3na3 Fresh is that ice-cold first sip — the scent of an Egyptian summer.",
    top: ["Spearmint", "Lemon", "Lime"],
    heart: ["Green tea", "Basil", "Neroli"],
    base: ["Light musk", "Vetiver", "Cedar"],
    images: [S("28745493"), C("unisex")],
    seasons: ["Summer"],
    occasions: ["Daytime", "Sport", "Casual"],
    longevity: 2,
    sillage: 3,
    isNew: true,
    sales: 300,
    daysAgo: 12,
    reviewTarget: 3,
    variants: [
      { size: "50 ml", ml: 50, price: 750, stock: 40 },
      { size: "100 ml", ml: 100, price: 1150, stock: 36 },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Deterministic review generation                                     */
/* ------------------------------------------------------------------ */

type ReviewKind = "floral" | "warm" | "oud" | "fresh" | "gourmand" | "musky" | "kids" | "gift";

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FEMALE = ["Mariam", "Nour", "Salma", "Hana", "Farida", "Laila", "Yara", "Dina", "Rana", "Habiba", "Menna", "Aya", "Reem", "Nadine", "Malak", "Jana", "Heba", "Engy", "Basma", "Lina", "Shahd", "Rawan", "Noha", "Sara", "Mai", "Amira", "Yasmin", "Hagar", "Rahma", "Ola"];
const MALE = ["Ahmed", "Youssef", "Omar", "Karim", "Mostafa", "Khaled", "Amr", "Ziad", "Hassan", "Tarek", "Mohamed", "Sherif", "Ali", "Seif", "Mahmoud", "Marwan", "Adham", "Hossam", "Mazen", "Ibrahim", "Walid", "Hesham", "Fady", "Mina", "Bishoy"];
const INITIALS = ["A.", "M.", "S.", "H.", "E.", "K.", "F.", "N.", "R.", "Y.", "G.", "T.", "B.", "Z."];
const CITIES = ["Cairo", "Alexandria", "Giza", "New Cairo", "Heliopolis", "Maadi", "Nasr City", "Sheikh Zayed", "6th of October", "Zamalek", "Mansoura", "Tanta", "Zagazig", "Port Said", "Ismailia", "Suez", "Damietta", "Hurghada", "Sharm El Sheikh", "El Gouna", "Luxor", "Aswan", "Asyut", "Minya", "Sohag", "Beni Suef", "Faiyum", "Banha", "Damanhour", "Marsa Matrouh"];

const OPENERS5: Record<ReviewKind | "generic", string[]> = {
  generic: [
    "I've worn {name} almost every day for a month and still get compliments — it lasts from my morning coffee until I'm home in the evening.",
    "Honestly better than designer perfumes I've paid three times as much for. The dry-down is gorgeous.",
    "I was nervous buying perfume online without smelling it first, but the notes description was spot on.",
    "My new signature scent. Noticeable without being overpowering — people lean in when I greet them.",
    "Smells so expensive. I wore it to a family gathering and everyone asked what I was wearing.",
    "Lasts 8+ hours on my skin and even longer on clothes.",
    "Bought it after trying the discovery set and the full size is even better than I remembered.",
    "So proud to see an Egyptian house making perfume of this quality. Elegant and truly unique.",
    "This is the third bottle I've ordered — once you find your scent, you don't let it go.",
    "Everything about it feels premium: the heavy glass bottle, the box and, of course, the scent itself.",
  ],
  floral: [
    "The flowers smell so real — like walking through a garden right after the rain. Feminine and classy.",
    "I wore it on my wedding day and my husband still says it reminds him of that night.",
    "Fresh and floral without smelling soapy or old-fashioned. I'm completely obsessed.",
    "My mother, my daughter and I all share this bottle — it suits every age beautifully.",
    "Soft, romantic and so elegant. Perfect for the office and for evenings out.",
  ],
  warm: [
    "Warm, smoky and sophisticated — perfect for winter evenings and dinners out.",
    "I get compliments every time I wear it to the office, and it lasts through a ten-hour day.",
    "Deep and elegant. It feels like a niche fragrance that costs four times as much.",
    "My husband wears it and honestly I keep stealing it for myself.",
    "The kind of scent people remember you by. Rich, smooth and very grown-up.",
  ],
  oud: [
    "The oud is smooth and rich — not harsh or medicinal at all. A true Arabian scent at an honest price.",
    "I wore it for Eid prayers and the whole family asked about it. Still on my clothes the next morning.",
    "My father has worn oud his whole life and he says this is one of the best he's tried.",
    "Luxurious from the very first second. A little goes a long way.",
    "Perfect for weddings and special nights. It fills the room in the most elegant way.",
  ],
  fresh: [
    "So fresh and clean — perfect for Egyptian summers. I spray it after the gym and feel brand new.",
    "Like a sea breeze on the Corniche. My go-to for work, and it never turns sour in the heat.",
    "Light, crisp and very versatile. My wife and I both wear it.",
    "The most refreshing scent I own. Even in August traffic it keeps me feeling cool.",
    "Clean and green with a lovely herbal twist. Everyone at the office asked what it was.",
  ],
  gourmand: [
    "Smells good enough to eat! Cosy and sweet but never childish.",
    "I get hugged a lot more since I started wearing this. It lasts all day on my scarf.",
    "Creamy, warm and addictive — my absolute favourite for cooler evenings.",
    "Sweet in the most elegant way. My friends call it my 'signature hug'.",
  ],
  musky: [
    "Clean, soft and comforting — like freshly washed skin. I wear it every single day.",
    "Perfect for layering. I spray it under my oud and the combination is magical.",
    "Subtle but long-lasting. Great for the office when you don't want to overwhelm anyone.",
    "My whole family wears it, from my teenage son to my grandmother. Universally loved.",
  ],
  kids: [
    "My daughter (8) loves it and asks for it every morning before school. Gentle on her sensitive skin.",
    "Finally an alcohol-free mist I trust for my kids. The scent is sweet and natural, not artificial.",
    "My 13-year-old is obsessed — she says all her friends asked where it's from.",
    "The perfect first fragrance. Light enough for school and it smells so happy.",
    "Bought one for each of my girls and now I'm borrowing them too.",
  ],
  gift: [
    "Bought it for my sister's birthday — the packaging is stunning and she loved every scent.",
    "The perfect engagement gift. The box is so elegant it didn't need any extra wrapping.",
    "A wonderful way to discover the range. I've already found two scents I want in full size.",
    "Gave it to my parents for their anniversary and they were genuinely moved. Beautiful presentation.",
  ],
};

const CLOSERS5 = [
  "Delivery to {city} took just two days.",
  "The bottle looks beautiful on my dresser.",
  "Already ordered another one as a gift.",
  "Will definitely get the bigger size next time.",
  "The free sample they included was a lovely touch.",
  "Customer service on WhatsApp was super helpful too.",
  "Paid cash on delivery — easy and smooth.",
  "",
  "",
  "",
];

const AR5: Record<ReviewKind | "generic", string[]> = {
  generic: [
    "ريحته تحفة وثباته عالي جدًا، وصلني في يومين والتغليف شيك جدًا. أكيد هطلب تاني.",
    "من أحلى العطور اللي جربتها، والسعر ممتاز مقارنة بالماركات العالمية.",
    "عطر راقي جدًا وكل اللي حواليا بيسألوني عليه. حاجة تفرّح إنه براند مصري بالجودة دي.",
  ],
  floral: ["الريحة الزهرية فيه طبيعية ورقيقة جدًا، بحبه."],
  warm: ["ريحة فخمة ودافية وثباتها طول اليوم."],
  oud: ["عود أصلي وريحته فخمة جدًا، رشة واحدة بتكفي اليوم كله."],
  fresh: ["ريحة منعشة جدًا وأحسن حاجة للصيف والحر."],
  gourmand: ["ريحته حلوة ودافية زي الحلويات، بحبه جدًا في الشتا."],
  musky: ["مسك نضيف وهادي، بلبسه كل يوم."],
  kids: ["بنتي بتحبه جدًا وريحته لطيفة ومناسبة لسنها."],
  gift: ["هدية شيك جدًا والعلبة فخمة، الكل انبسط بيها."],
};

const OPENERS4: Record<ReviewKind | "generic", string[]> = {
  generic: [
    "Lovely scent with moderate projection. I reapply once in the afternoon, but I'd still buy it again.",
    "Really beautiful fragrance — I only wish the smallest size came with a travel case.",
    "A little strong for the first ten minutes, then it settles into something perfect.",
    "Great quality for the price. Delivery to {city} took four days, a bit longer than expected.",
    "Very elegant. Not quite my usual style, but I keep reaching for it.",
  ],
  floral: ["Beautiful and romantic, though it fades a little faster in the summer heat."],
  warm: ["Excellent scent, maybe a touch heavy for midday in August — perfect at night."],
  oud: ["Strong and beautiful. Start small — a little is plenty!"],
  fresh: ["Very refreshing. I reapply in the afternoon, which is normal for a fresh scent."],
  gourmand: ["Lovely, a bit sweet for daytime but perfect for evenings."],
  musky: ["Very soft — I wish it projected a little more, but I love how clean it smells."],
  kids: ["Lovely and gentle. The scent fades after a few hours, which is actually fine for kids."],
  gift: ["Lovely set — I just wish there was a mini of Luxor Gold included too."],
};

const CLOSERS4 = ["Still a great buy.", "I'd buy it again.", "Delivery was smooth.", "", ""];
const AR4 = [
  "حلو جدًا بس كنت متوقع ثباته يكون أعلى شوية. الريحة نفسها ممتازة.",
  "جميل ومميز، والتوصيل كان سريع.",
];
const BODIES3 = [
  "Nice, but a little sweeter than I expected from the description. My sister loves it, so it found a good home.",
  "Smells good, but it fades after about four hours on my skin. Beautiful packaging though.",
  "Pleasant and well made — just not quite my style. I prefer something with more projection.",
];
const BODIES2 = [
  "The scent is fine but it fades quickly on my skin. Customer service on WhatsApp was very helpful and offered an exchange.",
];

const TITLES: Record<number, string[]> = {
  5: ["Absolutely stunning", "My new signature", "Compliment magnet", "Worth every pound", "Smells so expensive", "Pure class", "Better than designer", "Obsessed", "Exceeded my expectations", "Beautiful scent", "Long-lasting & elegant", "In love with it"],
  4: ["Really lovely", "Very nice", "Great value", "Almost perfect", "Elegant", "Would buy again"],
  3: ["Nice, but not for me", "Pleasant", "Good, not great"],
  2: ["Didn't last on me", "Not what I expected"],
};
const KIND_TITLES: Partial<Record<ReviewKind, string[]>> = {
  kids: ["Kids love it", "Perfect first perfume", "Gentle & sweet", "So happy with it"],
  gift: ["Perfect gift", "Beautiful presentation", "Loved by everyone", "Gift-worthy"],
};
const AR_TITLES: Record<number, string[]> = {
  5: ["تحفة", "رائع جدًا", "ريحة فخمة", "هشتريه تاني"],
  4: ["حلو جدًا", "جميل"],
};

function reviewKind(p: SeedProduct): ReviewKind {
  if (p.collection === "kids-teens") return "kids";
  if (p.collection === "gift-sets") return "gift";
  switch (p.family) {
    case "floral":
      return "floral";
    case "oud":
      return "oud";
    case "fresh":
    case "aquatic":
      return "fresh";
    case "gourmand":
      return "gourmand";
    case "musky":
      return "musky";
    default:
      return "warm";
  }
}

export type SeedReview = {
  authorName: string;
  city: string;
  rating: number;
  title: string;
  body: string;
  isVerified: boolean;
  createdAt: Date;
};

export function buildReviews(p: SeedProduct, index: number, productCreatedAt: Date, now: number): SeedReview[] {
  const rng = mulberry32(index * 7919 + 101);
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)];
  const kind = reviewKind(p);
  const specialised = kind === "kids" || kind === "gift";
  const femaleShare = p.gender === "women" ? 0.85 : p.gender === "men" ? 0.15 : p.gender === "kids" ? 0.75 : 0.5;
  const ageDays = Math.max(3, Math.floor((now - productCreatedAt.getTime()) / 86_400_000));
  const used = new Set<string>();
  const out: SeedReview[] = [];

  const compose = (rating: number) => {
    if (rating === 5) {
      if (rng() < 0.14) return pick([...AR5.generic, ...AR5[kind]]);
      const opener = specialised || rng() < 0.55 ? pick(OPENERS5[kind]) : pick(OPENERS5.generic);
      const closer = pick(CLOSERS5);
      return closer ? `${opener} ${closer}` : opener;
    }
    if (rating === 4) {
      if (rng() < 0.12) return pick(AR4);
      const opener = specialised || rng() < 0.5 ? pick(OPENERS4[kind]) : pick(OPENERS4.generic);
      const closer = pick(CLOSERS4);
      return closer ? `${opener} ${closer}` : opener;
    }
    if (rating === 3) return pick(BODIES3);
    return pick(BODIES2);
  };

  for (let i = 0; i < p.reviewTarget; i++) {
    const r = rng();
    const rating = p.bestseller
      ? r < 0.76 ? 5 : r < 0.96 ? 4 : 3
      : r < 0.64 ? 5 : r < 0.89 ? 4 : r < 0.97 ? 3 : 2;

    let body = compose(rating);
    for (let attempt = 0; attempt < 8 && used.has(body); attempt++) body = compose(rating);
    used.add(body);

    const city = pick(CITIES);
    const female = rng() < femaleShare;
    const authorName = `${female ? pick(FEMALE) : pick(MALE)} ${pick(INITIALS)}`;
    const arabic = /[\u0600-\u06FF]/.test(body);
    const titlePool = arabic ? AR_TITLES[rating] ?? TITLES[rating] : (rating === 5 && KIND_TITLES[kind]) || TITLES[rating];
    const daysAgo = 1 + Math.floor(rng() * (ageDays - 1));

    out.push({
      authorName,
      city,
      rating,
      title: pick(titlePool),
      body: body.replaceAll("{city}", city).replaceAll("{name}", p.name),
      isVerified: rng() < 0.88,
      createdAt: new Date(now - daysAgo * 86_400_000 - Math.floor(rng() * 36_000_000)),
    });
  }
  return out;
}
