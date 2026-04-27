// Migrate data from SQLite to Neon using sqlite3 + Prisma (pg)
process.env.DATABASE_URL = 'postgresql://neondb_owner:npg_T1vmFBluE7QL@ep-rapid-shape-aml8yk67.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require';

const sqlite3 = require('sqlite3').verbose();
const { PrismaClient } = require('@prisma/client');
const path = require('path');

const neon = new PrismaClient();
const db = new sqlite3.Database(path.join(__dirname, 'dev.db'));

function all(sql) {
  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => err ? reject(err) : resolve(rows));
  });
}

async function main() {
  console.log('Starting migration...\n');

  // 1. Users
  const users = await all('SELECT * FROM User');
  for (const u of users) {
    await neon.user.upsert({
      where: { id: u.id },
      update: { name: u.name, email: u.email, password: u.password, role: u.role, image: u.image },
      create: { id: u.id, name: u.name, email: u.email, password: u.password, role: u.role, image: u.image, createdAt: new Date(u.createdAt), updatedAt: new Date(u.updatedAt) }
    });
  }
  console.log(`✓ Users: ${users.length}`);

  // 2. Categories
  const cats = await all('SELECT * FROM Category');
  for (const c of cats) {
    await neon.category.upsert({
      where: { id: c.id },
      update: { name: c.name, slug: c.slug, description: c.description, image: c.image },
      create: { id: c.id, name: c.name, slug: c.slug, description: c.description, image: c.image }
    });
  }
  console.log(`✓ Categories: ${cats.length}`);

  // 3. Products
  const products = await all('SELECT * FROM Product');
  for (const p of products) {
    await neon.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name, slug: p.slug, description: p.description, story: p.story,
        price: p.price, comparePrice: p.comparePrice, currency: p.currency,
        images: p.images, stock: p.stock, sku: p.sku, weight: p.weight,
        categoryId: p.categoryId, featured: p.featured === 1, isActive: p.isActive === 1,
        crystalType: p.crystalType, chakra: p.chakra, healing: p.healing
      },
      create: {
        id: p.id, name: p.name, slug: p.slug, description: p.description, story: p.story,
        price: p.price, comparePrice: p.comparePrice, currency: p.currency,
        images: p.images, stock: p.stock, sku: p.sku, weight: p.weight,
        categoryId: p.categoryId, featured: p.featured === 1, isActive: p.isActive === 1,
        crystalType: p.crystalType, chakra: p.chakra, healing: p.healing,
        createdAt: new Date(p.createdAt), updatedAt: new Date(p.updatedAt)
      }
    });
  }
  console.log(`✓ Products: ${products.length}`);

  // 4. Shipping Zones
  const zones = await all('SELECT * FROM ShippingZone');
  for (const z of zones) {
    await neon.shippingZone.upsert({
      where: { id: z.id },
      update: { name: z.name, countries: z.countries },
      create: { id: z.id, name: z.name, countries: z.countries }
    });
  }
  const rates = await all('SELECT * FROM ShippingRate');
  for (const r of rates) {
    await neon.shippingRate.upsert({
      where: { id: r.id },
      update: { zoneId: r.zoneId, name: r.name, price: r.price, minDays: r.minDays, maxDays: r.maxDays, freeAbove: r.freeAbove, weightLimit: r.weightLimit },
      create: { id: r.id, zoneId: r.zoneId, name: r.name, price: r.price, minDays: r.minDays, maxDays: r.maxDays, freeAbove: r.freeAbove, weightLimit: r.weightLimit }
    });
  }
  console.log(`✓ Shipping zones: ${zones.length}, rates: ${rates.length}`);

  // 5. Reviews
  const reviews = await all('SELECT * FROM Review');
  for (const r of reviews) {
    await neon.review.upsert({
      where: { id: r.id },
      update: { productId: r.productId, userId: r.userId, rating: r.rating, title: r.title, body: r.body, verified: r.verified === 1 },
      create: { id: r.id, productId: r.productId, userId: r.userId, rating: r.rating, title: r.title, body: r.body, verified: r.verified === 1, createdAt: new Date(r.createdAt) }
    });
  }
  console.log(`✓ Reviews: ${reviews.length}`);

  console.log('\n✅ Migration complete!');
}

main()
  .catch(e => { console.error('❌', e.message); process.exit(1); })
  .finally(async () => { db.close(); await neon.$disconnect(); });
