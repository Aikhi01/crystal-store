const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Admin user
  const adminPassword = await bcrypt.hash('admin123456', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@crystalhealing.co' },
    update: {},
    create: { email: 'admin@crystalhealing.co', name: 'Store Admin', password: adminPassword, role: 'admin' },
  })
  console.log('✅ Admin:', admin.email)

  // Test customer
  const customerPassword = await bcrypt.hash('customer123', 10)
  const customer = await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: { email: 'customer@test.com', name: 'Test Customer', password: customerPassword, role: 'customer' },
  })
  console.log('✅ Customer:', customer.email)

  // Categories
  const cats = [
    { name: 'Healing Bracelets', slug: 'healing-bracelets', description: 'Crystal bracelets for healing and balance', image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800' },
    { name: 'Chakra Sets', slug: 'chakra-sets', description: 'Full chakra balancing crystal sets', image: 'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=800' },
    { name: 'Protection Crystals', slug: 'protection-crystals', description: 'Protective crystal jewelry', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' },
    { name: 'Love & Romance', slug: 'love-romance', description: 'Crystals for love and relationships', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800' },
  ]

  const catMap = {}
  for (const cat of cats) {
    const c = await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat })
    catMap[cat.slug] = c.id
    console.log('✅ Category:', c.name)
  }

  // Products
  const products = [
    {
      name: 'Amethyst Serenity Bracelet', slug: 'amethyst-serenity-bracelet',
      description: 'Hand-crafted with genuine amethyst beads, this bracelet promotes calm, clarity, and spiritual awareness.',
      story: 'Amethyst has been revered for centuries as a stone of spiritual protection and purification. Its deep purple energy calms an overactive mind, reduces anxiety, and connects you to higher states of consciousness.',
      price: 38.00, comparePrice: 52.00,
      images: JSON.stringify(['https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800','https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=800']),
      stock: 45, sku: 'AME-001', weight: 25, categoryId: catMap['healing-bracelets'], featured: true,
      crystalType: 'Amethyst', chakra: 'Crown & Third Eye', healing: JSON.stringify(['Anxiety Relief','Spiritual Growth','Sleep Aid','Intuition']),
    },
    {
      name: 'Rose Quartz Love Bracelet', slug: 'rose-quartz-love-bracelet',
      description: 'Soft pink Rose Quartz beads woven together to attract love, compassion, and emotional healing.',
      story: 'Rose Quartz is the quintessential stone of love. Its gentle pink essence carries compassion and peace, speaking directly to the Heart Chakra and dissolving emotional wounds.',
      price: 34.00, comparePrice: 45.00,
      images: JSON.stringify(['https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800','https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800']),
      stock: 60, sku: 'RQ-001', weight: 22, categoryId: catMap['love-romance'], featured: true,
      crystalType: 'Rose Quartz', chakra: 'Heart', healing: JSON.stringify(['Unconditional Love','Self-Love','Emotional Healing','Compassion']),
    },
    {
      name: 'Black Tourmaline Protection Bracelet', slug: 'black-tourmaline-protection-bracelet',
      description: 'Powerful black tourmaline beads for energy protection, grounding, and shielding from negative energies.',
      story: 'Black Tourmaline creates a shield of light around the body, deflecting negative energies and harmful EMFs. A grounding stone that connects you firmly to the earth.',
      price: 42.00, comparePrice: null,
      images: JSON.stringify(['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800','https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800']),
      stock: 38, sku: 'BT-001', weight: 28, categoryId: catMap['protection-crystals'], featured: true,
      crystalType: 'Black Tourmaline', chakra: 'Root', healing: JSON.stringify(['Protection','Blessing','EMF Shielding','Negative Energy Removal']),
    },
    {
      name: '7 Chakra Healing Bracelet', slug: '7-chakra-healing-bracelet',
      description: 'Seven carefully chosen crystals, one for each chakra. Amethyst, lapis lazuli, turquoise, green aventurine, tiger eye, carnelian, and red jasper.',
      story: 'The chakra system describes seven energy centers in the body. When these centers are balanced, you experience vitality, clarity, and deep well-being.',
      price: 55.00, comparePrice: 72.00,
      images: JSON.stringify(['https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=800','https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800']),
      stock: 30, sku: 'CHK-001', weight: 35, categoryId: catMap['chakra-sets'], featured: true,
      crystalType: 'Multi-Crystal', chakra: 'All 7 Chakras', healing: JSON.stringify(['Full Chakra Balance','Energy Alignment','Holistic Healing','Spiritual Harmony']),
    },
    {
      name: 'Lapis Lazuli Wisdom Bracelet', slug: 'lapis-lazuli-wisdom-bracelet',
      description: 'Deep blue Lapis Lazuli beads with natural golden pyrite flecks. Stimulates wisdom, truth, and intellectual ability.',
      story: 'Lapis Lazuli was treasured by ancient Egyptians and Romans as a sacred stone of royalty and wisdom.',
      price: 48.00, comparePrice: null,
      images: JSON.stringify(['https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800']),
      stock: 25, sku: 'LAP-001', weight: 26, categoryId: catMap['healing-bracelets'], featured: false,
      crystalType: 'Lapis Lazuli', chakra: 'Third Eye & Throat', healing: JSON.stringify(['Wisdom','Truth','Communication','Intellectual Clarity']),
    },
    {
      name: 'Citrine Abundance Bracelet', slug: 'citrine-abundance-bracelet',
      description: "Sunny yellow Citrine beads to attract wealth, prosperity, and positive energy. Known as the Merchant's Stone.",
      story: "Citrine never needs cleansing — it absorbs negative energies and transmutes them into positive light. Known as the Merchant's Stone, it attracts wealth and success.",
      price: 36.00, comparePrice: 48.00,
      images: JSON.stringify(['https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800','https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=800']),
      stock: 50, sku: 'CIT-001', weight: 24, categoryId: catMap['healing-bracelets'], featured: false,
      crystalType: 'Citrine', chakra: 'Solar Plexus', healing: JSON.stringify(['Abundance','Prosperity','Creativity','Confidence']),
    },
  ]

  for (const p of products) {
    const prod = await prisma.product.upsert({ where: { slug: p.slug }, update: {}, create: p })
    console.log('✅ Product:', prod.name, '- $' + prod.price)
  }

  // Shipping zones
  const zones = [
    { name: 'United States', countries: JSON.stringify(['US']),
      rates: [{ name: 'Standard Shipping', price: 4.99, minDays: 5, maxDays: 8, freeAbove: 50, weightLimit: 2000 }, { name: 'Express Shipping', price: 14.99, minDays: 2, maxDays: 3, freeAbove: null, weightLimit: 2000 }] },
    { name: 'Europe', countries: JSON.stringify(['GB','DE','FR','IT','ES','NL','BE','SE','NO','DK','FI','AT','CH','PL']),
      rates: [{ name: 'Standard International', price: 12.99, minDays: 10, maxDays: 18, freeAbove: 80, weightLimit: 2000 }, { name: 'Express International', price: 28.99, minDays: 4, maxDays: 7, freeAbove: null, weightLimit: 2000 }] },
    { name: 'Canada & Australia', countries: JSON.stringify(['CA','AU','NZ']),
      rates: [{ name: 'Standard International', price: 9.99, minDays: 8, maxDays: 15, freeAbove: 70, weightLimit: 2000 }, { name: 'Express International', price: 24.99, minDays: 4, maxDays: 7, freeAbove: null, weightLimit: 2000 }] },
    { name: 'Asia Pacific', countries: JSON.stringify(['JP','KR','SG','HK','TW','MY','TH','PH']),
      rates: [{ name: 'Standard International', price: 14.99, minDays: 12, maxDays: 20, freeAbove: 80, weightLimit: 2000 }, { name: 'Express International', price: 32.99, minDays: 5, maxDays: 8, freeAbove: null, weightLimit: 2000 }] },
    { name: 'Rest of World', countries: JSON.stringify(['__default__']),
      rates: [{ name: 'Standard International', price: 18.99, minDays: 15, maxDays: 30, freeAbove: 100, weightLimit: 2000 }] },
  ]

  for (const zone of zones) {
    const z = await prisma.shippingZone.create({
      data: { name: zone.name, countries: zone.countries, rates: { create: zone.rates } },
    })
    console.log('✅ Shipping zone:', z.name)
  }

  // Sample reviews
  const amethyst = await prisma.product.findUnique({ where: { slug: 'amethyst-serenity-bracelet' } })
  const roseQuartz = await prisma.product.findUnique({ where: { slug: 'rose-quartz-love-bracelet' } })

  if (amethyst && roseQuartz) {
    await prisma.review.create({ data: { productId: amethyst.id, userId: customer.id, rating: 5, title: 'Absolutely beautiful!', body: "I've been wearing this bracelet for 2 weeks and I genuinely feel calmer. The quality is outstanding — the beads are smooth and the clasp is sturdy.", verified: true } })
    await prisma.review.create({ data: { productId: roseQuartz.id, userId: customer.id, rating: 5, title: 'Perfect gift for myself', body: 'I bought this as a self-love reminder during a difficult time. The rose quartz beads are gorgeous and the bracelet arrived beautifully packaged.', verified: true } })
    console.log('✅ Reviews added')
  }

  console.log('\n🎉 Seeding complete!')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
