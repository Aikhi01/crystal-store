process.env.DATABASE_URL = 'postgresql://neondb_owner:npg_T1vmFBluE7QL@ep-rapid-shape-aml8yk67.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require';
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const p = new PrismaClient();

async function main() {
  // Extra categories
  const extras = [
    { name: 'Chinese Zodiac Collection', slug: 'chinese-zodiac', description: 'Limited-edition crystal bracelets crafted for each Chinese zodiac sign' },
    { name: 'Zodiac Signs', slug: 'zodiac-signs', description: 'Crystal bracelets crafted for each of the 12 Western zodiac signs' },
    { name: 'Fortune & Blessings', slug: 'fortune-blessings', description: 'Crystals for prosperity, good fortune, and auspicious energy' },
  ];
  for (const c of extras) {
    await p.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
    console.log('✓ Category:', c.name);
  }

  // Admin user
  const adminHash = await bcrypt.hash('admin123456', 12);
  await p.user.upsert({
    where: { email: 'admin@crystalhealing.co' },
    update: {},
    create: { email: 'admin@crystalhealing.co', name: 'Admin', password: adminHash, role: 'admin' }
  });
  console.log('✓ Admin user: admin@crystalhealing.co');

  // Customer user
  const custHash = await bcrypt.hash('customer123', 12);
  await p.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: { email: 'customer@test.com', name: 'Test Customer', password: custHash, role: 'customer' }
  });
  console.log('✓ Customer user: customer@test.com');

  console.log('\n✅ All done!');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => p.$disconnect());
