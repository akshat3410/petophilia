import { Role, OrderStatus, PaymentStatus, CouponType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { db } from "../lib/db";

async function main() {
  console.log("🌱 Seeding database...");

  // ── Brands ─────────────────────────────────────────────────────────────────
  const [meadowkind, kinderbowl, pawpantry, nestwell, furriva] =
    await Promise.all([
      db.brand.upsert({
        where: { slug: "meadowkind" },
        update: {},
        create: {
          name: "Meadowkind",
          slug: "meadowkind",
          tagline: "Grass-fed, slow cooked",
          description: "Premium slow-cooked meals made from grass-fed meats.",
          isActive: true,
        },
      }),
      db.brand.upsert({
        where: { slug: "kinderbowl" },
        update: {},
        create: {
          name: "Kinderbowl",
          slug: "kinderbowl",
          tagline: "Vet-formulated",
          description: "Veterinarian-formulated wet foods and supplements.",
          isActive: true,
        },
      }),
      db.brand.upsert({
        where: { slug: "pawpantry" },
        update: {},
        create: {
          name: "Pawpantry",
          slug: "pawpantry",
          tagline: "Small-batch treats",
          description: "Small-batch artisan treats baked with love.",
          isActive: true,
        },
      }),
      db.brand.upsert({
        where: { slug: "nestwell" },
        update: {},
        create: {
          name: "Nestwell",
          slug: "nestwell",
          tagline: "Home & bedding",
          description: "Sustainable pet beds and home accessories.",
          isActive: true,
        },
      }),
      db.brand.upsert({
        where: { slug: "furriva" },
        update: {},
        create: {
          name: "Furriva",
          slug: "furriva",
          tagline: "Functional supplements",
          description: "Science-backed functional supplements for pets.",
          isActive: true,
        },
      }),
    ]);

  // ── Categories ─────────────────────────────────────────────────────────────
  const [catDogs, catCats, catTreats, catVet, catAccessories, catToys, catGrooming, catFood] =
    await Promise.all([
      db.category.upsert({ where: { slug: "dog" }, update: {}, create: { name: "Dogs", slug: "dog", description: "Everything for your dog", isActive: true } }),
      db.category.upsert({ where: { slug: "cat" }, update: {}, create: { name: "Cats", slug: "cat", description: "Everything for your cat", isActive: true } }),
      db.category.upsert({ where: { slug: "treats" }, update: {}, create: { name: "Treats", slug: "treats", description: "Healthy treats and snacks", isActive: true } }),
      db.category.upsert({ where: { slug: "vet-care" }, update: {}, create: { name: "Vet Care", slug: "vet-care", description: "Vet-approved health products", isActive: true } }),
      db.category.upsert({ where: { slug: "accessories" }, update: {}, create: { name: "Accessories", slug: "accessories", description: "Beds, bowls, and home goods", isActive: true } }),
      db.category.upsert({ where: { slug: "toys" }, update: {}, create: { name: "Toys", slug: "toys", description: "Fun and enrichment toys", isActive: true } }),
      db.category.upsert({ where: { slug: "grooming" }, update: {}, create: { name: "Grooming", slug: "grooming", description: "Shampoos, balms, and grooming tools", isActive: true } }),
      db.category.upsert({ where: { slug: "food" }, update: {}, create: { name: "Food", slug: "food", description: "Dry food and raw diets", isActive: true } }),
    ]);

  // ── Users ──────────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash("admin@petophilia123", 12);
  const customerHash = await bcrypt.hash("customer123", 12);

  const admin = await db.user.upsert({
    where: { email: "admin@petophilia.in" },
    update: {},
    create: {
      name: "Petophilia Admin",
      email: "admin@petophilia.in",
      passwordHash: adminHash,
      role: Role.ADMIN,
    },
  });

  const customer = await db.user.upsert({
    where: { email: "june@example.com" },
    update: {},
    create: {
      name: "June Mehta",
      email: "june@example.com",
      passwordHash: customerHash,
      role: Role.CUSTOMER,
      phone: "+91-9876543210",
    },
  });

  // Customer default address
  const address = await db.address.upsert({
    where: { id: "addr-june-default" },
    update: {},
    create: {
      id: "addr-june-default",
      userId: customer.id,
      fullName: "June Mehta",
      phone: "+91-9876543210",
      addressLine1: "42 Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400050",
      country: "India",
      isDefault: true,
    },
  });

  // ── Products ───────────────────────────────────────────────────────────────
  const productData = [
    {
      slug: "slow-cooked-chicken-oat",
      name: "Slow-Cooked Chicken & Oat",
      shortDescription: "Gently cooked at 90°C so nutrients stay where they belong.",
      description: "Free-range chicken slow-cooked with rolled oats, carrot & turmeric. Grain-friendly formula ideal for dogs with sensitive tummies. Made in small batches.",
      unit: "2.5kg pouch", price: 148000, compareAtPrice: 165000,
      sku: "MK-001", stock: 48, lowStockThreshold: 10,
      categoryId: catDogs.id, brandId: meadowkind.id,
      isFeatured: true, isBestSeller: true,
      ratingAverage: 4.9, ratingCount: 1284,
      tags: ["Grain-friendly", "Adult", "Sensitive tummy"], tint: "#E8DCD5",
    },
    {
      slug: "ocean-whitefish-pate",
      name: "Ocean Whitefish Pâté",
      shortDescription: "Wild-caught whitefish in a silky pâté cats come running for.",
      description: "Wild-caught whitefish whipped into a silky pâté. High in taurine for heart health. Hairball support formula.",
      unit: "12 × 85g tins", price: 98000, compareAtPrice: 110000,
      sku: "KB-001", stock: 62, lowStockThreshold: 10,
      categoryId: catCats.id, brandId: kinderbowl.id,
      isFeatured: true, isBestSeller: true,
      ratingAverage: 4.8, ratingCount: 842,
      tags: ["Hairball support", "All ages", "High protein"], tint: "#CFE3D8",
    },
    {
      slug: "pumpkin-peanut-biscuits",
      name: "Pumpkin & Peanut Biscuits",
      shortDescription: "Crunchy rewards baked in a tiny bakery in Jabalpur.",
      description: "Grain-free training treats. Under 5 calories each. Made with real pumpkin and peanut butter. No artificial preservatives.",
      unit: "220g jar", price: 52000, compareAtPrice: 60000,
      sku: "PP-001", stock: 120, lowStockThreshold: 20,
      categoryId: catTreats.id, brandId: pawpantry.id,
      isFeatured: true, isBestSeller: true, isNewArrival: false,
      ratingAverage: 4.9, ratingCount: 2104,
      tags: ["Grain-free", "Training", "Under 5 cal"], tint: "#E8DCD5",
    },
    {
      slug: "calming-chamomile-chews",
      name: "Calming Chamomile Chews",
      shortDescription: "For fireworks, thunder, and the vacuum cleaner.",
      description: "Vet-approved botanical soft chews with chamomile, L-theanine and valerian root. Non-drowsy calming support for anxious dogs.",
      unit: "60 soft chews", price: 86000,
      sku: "FU-001", stock: 35, lowStockThreshold: 8,
      categoryId: catVet.id, brandId: furriva.id,
      isNewArrival: true,
      ratingAverage: 4.7, ratingCount: 592,
      tags: ["Calming", "Travel", "Anxiety support"], tint: "#CFE3D8",
    },
    {
      slug: "hempwood-crinkle-lounger",
      name: "Hempwood Crinkle Lounger",
      shortDescription: "A crinkle-lined nest that catches the afternoon sun beautifully.",
      description: "Recycled hemp fibre nest with organic cotton shell and crinkle liner. Machine washable. One size fits cats and small dogs.",
      unit: "One size — 52cm", price: 248000,
      sku: "NW-001", stock: 15, lowStockThreshold: 3,
      categoryId: catAccessories.id, brandId: nestwell.id,
      isFeatured: true,
      ratingAverage: 4.8, ratingCount: 318,
      tags: ["Recycled", "Machine washable"], tint: "#E8DCD5",
    },
    {
      slug: "river-salmon-sweet-potato",
      name: "River Salmon & Sweet Potato",
      shortDescription: "For the dog whose coat deserves a bit more shine.",
      description: "Grain-free omega-rich fresh food. Rohu salmon with sweet potato, peas and seaweed. Ideal for dogs with sensitive skin.",
      unit: "2.5kg pouch", price: 164000, compareAtPrice: 180000,
      sku: "MK-002", stock: 40,
      categoryId: catDogs.id, brandId: meadowkind.id,
      isBestSeller: true,
      ratingAverage: 4.9, ratingCount: 974,
      tags: ["Grain-free", "Omega-rich", "Sensitive skin"], tint: "#CFE3D8",
    },
    {
      slug: "felt-mouse-trio",
      name: "Felt Mouse Trio",
      shortDescription: "Three hand-felted mice filled with organic catnip.",
      description: "Hand-felted Himalayan wool mice filled with certified organic catnip. Set of 3. Chaos guaranteed.",
      unit: "Set of 3", price: 64000,
      sku: "PP-002", stock: 80,
      categoryId: catToys.id, brandId: pawpantry.id,
      isNewArrival: true,
      ratingAverage: 4.6, ratingCount: 441,
      tags: ["Wool", "Catnip-filled", "Handmade"], tint: "#E8DCD5",
    },
    {
      slug: "dental-kelp-sticks",
      name: "Dental Kelp Sticks",
      shortDescription: "One a day keeps the tartar away.",
      description: "Daily dental sticks with kelp and parsley. Clinically shown to reduce plaque by up to 30% in 4 weeks. Mildly minty.",
      unit: "12 sticks", price: 58000,
      sku: "FU-002", stock: 95,
      categoryId: catTreats.id, brandId: furriva.id,
      isBestSeller: true,
      ratingAverage: 4.8, ratingCount: 712,
      tags: ["Dental", "Plaque support", "Daily"], tint: "#CFE3D8",
    },
    {
      slug: "gentle-paw-balm",
      name: "Gentle Paw Balm",
      shortDescription: "Shea and calendula for paws that have seen adventures.",
      description: "Natural paw balm with shea butter, calendula and vitamin E. Soothes cracked paws. Lick-safe formula.",
      unit: "50ml tin", price: 78000,
      sku: "FU-003", stock: 4, lowStockThreshold: 5,
      categoryId: catGrooming.id, brandId: furriva.id,
      isNewArrival: true,
      ratingAverage: 4.9, ratingCount: 388,
      tags: ["Balm", "Winter", "Natural"], tint: "#E8DCD5",
    },
    {
      slug: "linen-dream-cushion",
      name: "Linen Dream Cushion",
      shortDescription: "Memory foam under a washed-linen cover.",
      description: "Orthopaedic memory foam core with removable washed-linen cover. Machine washable. Ideal for dogs with joint issues.",
      unit: "Medium — 80×60cm", price: 448000, compareAtPrice: 520000,
      sku: "NW-002", stock: 12, lowStockThreshold: 3,
      categoryId: catAccessories.id, brandId: nestwell.id,
      isFeatured: true,
      ratingAverage: 4.9, ratingCount: 206,
      tags: ["Orthopaedic", "Linen", "Removable cover"], tint: "#CFE3D8",
    },
    {
      slug: "goat-milk-gelato",
      name: "Goat Milk Gelato",
      shortDescription: "A frozen treat for warmer days.",
      description: "Raw goat milk frozen treats with honey and banana. Contains live probiotic cultures. Summer essential.",
      unit: "4 × 100ml", price: 42000,
      sku: "PP-003", stock: 30,
      categoryId: catTreats.id, brandId: pawpantry.id,
      isNewArrival: true,
      ratingAverage: 4.7, ratingCount: 528,
      tags: ["Frozen", "Summer", "Probiotic"], tint: "#E8DCD5",
    },
    {
      slug: "pheasant-quinoa-dinner",
      name: "Pheasant & Quinoa Dinner",
      shortDescription: "Novel-protein dinner for sensitive pups. No chicken, no beef.",
      description: "Hypoallergenic wet food with pheasant and quinoa. Single protein source. Ideal for food-allergic dogs.",
      unit: "12 × 150g trays", price: 134000,
      sku: "KB-002", stock: 55,
      categoryId: catFood.id, brandId: kinderbowl.id,
      isBestSeller: true,
      ratingAverage: 4.8, ratingCount: 611,
      tags: ["Single protein", "Novel protein", "Hypoallergenic"], tint: "#CFE3D8",
    },
    {
      slug: "wild-venison-cold-pressed",
      name: "Wild Venison Cold-Pressed",
      shortDescription: "Nutrient-locked cold-pressed biscuits from wild venison.",
      description: "Cold-pressed at low temperature to preserve natural enzymes. Wild venison with sweet potato and cranberry.",
      unit: "2kg bag", price: 189000, compareAtPrice: 210000,
      sku: "MK-003", stock: 28,
      categoryId: catFood.id, brandId: meadowkind.id,
      isFeatured: true, isNewArrival: true,
      ratingAverage: 4.7, ratingCount: 203,
      tags: ["Cold-pressed", "Wild-caught", "Grain-free"], tint: "#E8DCD5",
    },
    {
      slug: "lavender-oat-shampoo",
      name: "Lavender Oat Shampoo",
      shortDescription: "Calming coat wash for sensitive dogs.",
      description: "pH-balanced shampoo with colloidal oatmeal and lavender. Soap-free, paraben-free. Leaves coat soft and calm-smelling.",
      unit: "300ml bottle", price: 62000,
      sku: "FU-004", stock: 65,
      categoryId: catGrooming.id, brandId: furriva.id,
      isNewArrival: true,
      ratingAverage: 4.6, ratingCount: 187,
      tags: ["Sensitive skin", "Soap-free", "Lavender"], tint: "#CFE3D8",
    },
    {
      slug: "tuna-catnip-medallions",
      name: "Tuna & Catnip Medallions",
      shortDescription: "Freeze-dried tuna coins with a catnip surprise.",
      description: "100% freeze-dried tuna with organic catnip centre. No additives. Single ingredient (almost).",
      unit: "50g pouch", price: 48000,
      sku: "PP-004", stock: 3, lowStockThreshold: 5,
      categoryId: catTreats.id, brandId: pawpantry.id,
      isFeatured: false, isBestSeller: true,
      ratingAverage: 4.9, ratingCount: 763,
      tags: ["Freeze-dried", "Single ingredient", "Cats"], tint: "#E8DCD5",
    },
    {
      slug: "bamboo-elevated-feeder",
      name: "Bamboo Elevated Feeder",
      shortDescription: "Posture-friendly raised bowl set in sustainable bamboo.",
      description: "Raises food to optimal height for medium-large dogs. Stainless steel bowls. Bamboo stand. Helps reduce bloat.",
      unit: "With 2 × 700ml bowls", price: 189000,
      sku: "NW-003", stock: 18,
      categoryId: catAccessories.id, brandId: nestwell.id,
      isNewArrival: true,
      ratingAverage: 4.5, ratingCount: 142,
      tags: ["Bamboo", "Elevated", "Anti-bloat"], tint: "#CFE3D8",
    },
    {
      slug: "salmon-oil-pump",
      name: "Salmon Oil Pump",
      shortDescription: "Wild-caught omega-3 daily drizzle for coat and joints.",
      description: "Cold-extracted wild salmon oil. High EPA & DHA. Easy pump dispenser. Supports coat shine, joint health and immune function.",
      unit: "500ml pump", price: 124000, compareAtPrice: 140000,
      sku: "FU-005", stock: 72,
      categoryId: catVet.id, brandId: furriva.id,
      isBestSeller: true,
      ratingAverage: 4.8, ratingCount: 934,
      tags: ["Omega-3", "Coat care", "Joint support"], tint: "#E8DCD5",
    },
    {
      slug: "snuffle-mat-forager",
      name: "Snuffle Mat Forager",
      shortDescription: "Hide treats in 250+ fleece folds. Slow them down.",
      description: "Enrichment snuffle mat with 250+ fleece tufts. Machine washable. Slows fast eaters, reduces anxiety.",
      unit: "45cm × 35cm", price: 158000,
      sku: "NW-004", stock: 22,
      categoryId: catToys.id, brandId: nestwell.id,
      isFeatured: true,
      ratingAverage: 4.7, ratingCount: 289,
      tags: ["Enrichment", "Slow feeder", "Machine washable"], tint: "#CFE3D8",
    },
    {
      slug: "grain-free-turkey-kibble",
      name: "Grain-Free Turkey Kibble",
      shortDescription: "Air-dried turkey kibble for everyday feeding.",
      description: "Grain-free kibble with turkey as first ingredient. Added probiotics and prebiotics. No fillers.",
      unit: "3kg bag", price: 178000, compareAtPrice: 195000,
      sku: "KB-003", stock: 45,
      categoryId: catFood.id, brandId: kinderbowl.id,
      isBestSeller: true, isFeatured: true,
      ratingAverage: 4.8, ratingCount: 512,
      tags: ["Grain-free", "Turkey", "Probiotic"], tint: "#E8DCD5",
    },
    {
      slug: "cat-teaser-wand-refills",
      name: "Cat Teaser Wand + Refills",
      shortDescription: "Feather, ribbon and crinkle — all in one wand kit.",
      description: "Extendable teaser wand with 3 interchangeable attachments. Feather, crinkle ribbon and felt fish. Hours of play.",
      unit: "Wand + 3 refills", price: 82000,
      sku: "PP-005", stock: 55,
      categoryId: catToys.id, brandId: pawpantry.id,
      isNewArrival: true,
      ratingAverage: 4.6, ratingCount: 318,
      tags: ["Interactive", "Feather", "Cat toy"], tint: "#CFE3D8",
    },
  ];

  for (const data of productData) {
    await db.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        lowStockThreshold: data.lowStockThreshold ?? 5,
        isFeatured: data.isFeatured ?? false,
        isBestSeller: data.isBestSeller ?? false,
        isNewArrival: data.isNewArrival ?? false,
      },
    });
  }

  // ── Coupons ────────────────────────────────────────────────────────────────
  await db.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      type: CouponType.PERCENTAGE,
      value: 10,
      minOrderAmount: 50000,
      maxDiscountAmount: 20000,
      usageLimit: 1000,
      isActive: true,
    },
  });

  await db.coupon.upsert({
    where: { code: "FLAT200" },
    update: {},
    create: {
      code: "FLAT200",
      type: CouponType.FIXED,
      value: 20000,
      minOrderAmount: 100000,
      isActive: true,
    },
  });

  // ── Sample Orders for customer ─────────────────────────────────────────────
  const p1 = await db.product.findUnique({ where: { slug: "slow-cooked-chicken-oat" } });
  const p2 = await db.product.findUnique({ where: { slug: "pumpkin-peanut-biscuits" } });
  const p3 = await db.product.findUnique({ where: { slug: "gentle-paw-balm" } });
  const p4 = await db.product.findUnique({ where: { slug: "ocean-whitefish-pate" } });
  const p5 = await db.product.findUnique({ where: { slug: "hempwood-crinkle-lounger" } });

  if (p1 && p2 && p3 && p4 && p5) {
    const ordersToSeed = [
      {
        id: "order-seed-001",
        orderNumber: "PT-04281",
        status: OrderStatus.SHIPPED,
        paymentStatus: PaymentStatus.PAID,
        subtotal: p1.price + p2.price,
        total: p1.price + p2.price,
        items: [
          { productId: p1.id, productName: p1.name, productImage: null, price: p1.price, quantity: 1, total: p1.price },
          { productId: p2.id, productName: p2.name, productImage: null, price: p2.price, quantity: 1, total: p2.price },
        ],
        createdAt: new Date("2024-06-04"),
      },
      {
        id: "order-seed-002",
        orderNumber: "PT-04144",
        status: OrderStatus.DELIVERED,
        paymentStatus: PaymentStatus.PAID,
        subtotal: p4.price + p3.price,
        total: p4.price + p3.price,
        items: [
          { productId: p4.id, productName: p4.name, productImage: null, price: p4.price, quantity: 1, total: p4.price },
          { productId: p3.id, productName: p3.name, productImage: null, price: p3.price, quantity: 1, total: p3.price },
        ],
        createdAt: new Date("2024-05-22"),
      },
      {
        id: "order-seed-003",
        orderNumber: "PT-04029",
        status: OrderStatus.DELIVERED,
        paymentStatus: PaymentStatus.PAID,
        subtotal: p5.price,
        total: p5.price,
        items: [
          { productId: p5.id, productName: p5.name, productImage: null, price: p5.price, quantity: 1, total: p5.price },
        ],
        createdAt: new Date("2024-05-03"),
      },
    ];

    for (const o of ordersToSeed) {
      const { items, ...rest } = o;
      await db.order.upsert({
        where: { id: rest.id },
        update: {},
        create: {
          ...rest,
          discount: 0,
          shippingFee: 0,
          userId: customer.id,
          addressId: address.id,
          items: { create: items },
        },
      });
    }

    // Sample subscriptions
    await db.subscription.upsert({
      where: { id: "sub-seed-001" },
      update: {},
      create: {
        id: "sub-seed-001",
        userId: customer.id,
        productId: p1.id,
        status: "ACTIVE",
        frequency: "MONTHLY",
        nextDeliveryDate: new Date("2024-06-18"),
      },
    });
    await db.subscription.upsert({
      where: { id: "sub-seed-002" },
      update: {},
      create: {
        id: "sub-seed-002",
        userId: customer.id,
        productId: p4.id,
        status: "ACTIVE",
        frequency: "MONTHLY",
        nextDeliveryDate: new Date("2024-06-18"),
      },
    });
  }

  console.log("✅ Seed complete!");
  console.log("   Admin: admin@petophilia.in / admin@petophilia123");
  console.log("   Customer: june@example.com / customer123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
