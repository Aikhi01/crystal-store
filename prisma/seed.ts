import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123456', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@crystalhealing.co' },
    update: {},
    create: {
      email: 'admin@crystalhealing.co',
      name: 'Store Admin',
      password: adminPassword,
      role: 'admin',
    },
  })
  console.log('Admin user:', admin.email)

  // Create test customer
  const customerPassword = await bcrypt.hash('customer123', 10)
  const customer = await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: {
      email: 'customer@test.com',
      name: 'Test Customer',
      password: customerPassword,
      role: 'customer',
    },
  })
  console.log('Customer user:', customer.email)

  // Categories
  const categories = [
    { name: 'Healing Bracelets', slug: 'healing-bracelets', description: 'Crystal bracelets for healing and balance', image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800' },
    { name: 'Chakra Sets', slug: 'chakra-sets', description: 'Full chakra balancing crystal sets', image: 'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=800' },
    { name: 'Protection Crystals', slug: 'protection-crystals', description: 'Protective crystal jewelry', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' },
    { name: 'Love & Romance', slug: 'love-romance', description: 'Crystals for love and relationships', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800' },
  ]

  const createdCategories: Record<string, string> = {}
  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    createdCategories[cat.slug] = c.id
    console.log('Category:', c.name)
  }

  // Products
  const products = [
    {
      name: 'Amethyst Serenity Bracelet',
      slug: 'amethyst-serenity-bracelet',
      description: 'Hand-crafted with genuine amethyst beads, this bracelet promotes calm, clarity, and spiritual awareness. Each bead is carefully selected for its deep purple hue and natural energy.',
      story: 'Amethyst has been revered for centuries as a stone of spiritual protection and purification. Ancient Greeks believed it prevented intoxication and brought clarity of mind. Today, this purple crystal is known as the "Stone of Sobriety" — helping to calm an overactive mind, reduce anxiety, and connect you to higher states of consciousness.',
      price: 38.00,
      comparePrice: 52.00,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800',
        'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=800',
      ]),
      stock: 45,
      sku: 'AME-001',
      weight: 25,
      categoryId: createdCategories['healing-bracelets'],
      featured: true,
      crystalType: 'Amethyst',
      chakra: 'Crown & Third Eye',
      healing: JSON.stringify(['Anxiety Relief', 'Spiritual Growth', 'Sleep Aid', 'Intuition']),
    },
    {
      name: 'Rose Quartz Love Bracelet',
      slug: 'rose-quartz-love-bracelet',
      description: 'Soft pink Rose Quartz beads woven together to attract love, compassion, and emotional healing. Perfect for opening the heart to give and receive love.',
      story: 'Rose Quartz is the quintessential stone of love — romantic love, self-love, family love. Its gentle pink essence carries a soft feminine energy of compassion, peace, tenderness, and healing. It speaks directly to the Heart Chakra, dissolving emotional wounds, fears, and resentments.',
      price: 34.00,
      comparePrice: 45.00,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800',
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800',
      ]),
      stock: 60,
      sku: 'RQ-001',
      weight: 22,
      categoryId: createdCategories['love-romance'],
      featured: true,
      crystalType: 'Rose Quartz',
      chakra: 'Heart',
      healing: JSON.stringify(['Unconditional Love', 'Self-Love', 'Emotional Healing', 'Compassion']),
    },
    {
      name: 'Black Tourmaline Protection Bracelet',
      slug: 'black-tourmaline-protection-bracelet',
      description: 'Powerful black tourmaline beads for energy protection, grounding, and shielding from negative energies. A must-have for empaths and sensitive souls.',
      story: 'Black Tourmaline is one of the most powerful protective stones in the crystal kingdom. It creates a shield of light around the body, deflecting and transforming negative energies, ill-wishes, and harmful electromagnetic fields (EMFs). A grounding stone, it connects you firmly to the earth while keeping your energy field clear.',
      price: 42.00,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800',
      ]),
      stock: 38,
      sku: 'BT-001',
      weight: 28,
      categoryId: createdCategories['protection-crystals'],
      featured: true,
      crystalType: 'Black Tourmaline',
      chakra: 'Root',
      healing: JSON.stringify(['Protection', 'Blessing', 'EMF Shielding', 'Negative Energy Removal']),
    },
    {
      name: '7 Chakra Healing Bracelet',
      slug: '7-chakra-healing-bracelet',
      description: 'Seven carefully chosen crystals, one for each chakra. Amethyst, lapis lazuli, turquoise, green aventurine, tiger eye, carnelian, and red jasper — all in one powerful bracelet.',
      story: 'The chakra system originated in ancient Indian texts and describes seven energy centers in the body, each governing different aspects of physical and emotional health. When these centers are balanced and flowing, you experience vitality, clarity, and a deep sense of well-being. This bracelet acts as a full-spectrum energy tool for daily alignment.',
      price: 55.00,
      comparePrice: 72.00,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=800',
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800',
      ]),
      stock: 30,
      sku: 'CHK-001',
      weight: 35,
      categoryId: createdCategories['chakra-sets'],
      featured: true,
      crystalType: 'Multi-Crystal',
      chakra: 'All 7 Chakras',
      healing: JSON.stringify(['Full Chakra Balance', 'Energy Alignment', 'Holistic Healing', 'Spiritual Harmony']),
    },
    {
      name: 'Lapis Lazuli Wisdom Bracelet',
      slug: 'lapis-lazuli-wisdom-bracelet',
      description: 'Deep blue Lapis Lazuli beads with natural golden pyrite flecks. Stimulates wisdom, truth, and intellectual ability.',
      story: 'Lapis Lazuli was treasured by ancient Egyptians, Greeks, and Romans, ground into powder for pigments and used as a sacred stone of royalty and wisdom. Today it remains one of the most sought-after stones for enhancing intellectual ability, stimulating the desire for knowledge, truth, and understanding.',
      price: 48.00,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      ]),
      stock: 25,
      sku: 'LAP-001',
      weight: 26,
      categoryId: createdCategories['healing-bracelets'],
      crystalType: 'Lapis Lazuli',
      chakra: 'Third Eye & Throat',
      healing: JSON.stringify(['Wisdom', 'Truth', 'Communication', 'Intellectual Clarity']),
    },
    {
      name: 'Citrine Abundance Bracelet',
      slug: 'citrine-abundance-bracelet',
      description: 'Sunny yellow Citrine beads to attract wealth, prosperity, and positive energy. Known as the "Merchant\'s Stone" for its power to manifest abundance.',
      story: 'Citrine is one of the few crystals that never needs cleansing — it absorbs negative energies and transmutes them into positive light. Known as the "Merchant\'s Stone," it is placed in cash registers and wallets around the world to attract wealth and success. Its bright solar energy activates creativity and imagination.',
      price: 36.00,
      comparePrice: 48.00,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800',
        'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=800',
      ]),
      stock: 50,
      sku: 'CIT-001',
      weight: 24,
      categoryId: createdCategories['healing-bracelets'],
      crystalType: 'Citrine',
      chakra: 'Solar Plexus',
      healing: JSON.stringify(['Abundance', 'Prosperity', 'Creativity', 'Confidence']),
    },
  ]

  for (const product of products) {
    const p = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
    console.log('Product:', p.name, '- $' + p.price)
  }

  // Shipping zones
  const zones = [
    {
      name: 'United States',
      countries: JSON.stringify(['US']),
      rates: [
        { name: 'Standard Shipping', price: 4.99, minDays: 5, maxDays: 8, freeAbove: 50, weightLimit: 2000 },
        { name: 'Express Shipping', price: 14.99, minDays: 2, maxDays: 3, freeAbove: null, weightLimit: 2000 },
      ],
    },
    {
      name: 'Europe',
      countries: JSON.stringify(['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'SE', 'NO', 'DK', 'FI', 'AT', 'CH', 'PL']),
      rates: [
        { name: 'Standard International', price: 12.99, minDays: 10, maxDays: 18, freeAbove: 80, weightLimit: 2000 },
        { name: 'Express International', price: 28.99, minDays: 4, maxDays: 7, freeAbove: null, weightLimit: 2000 },
      ],
    },
    {
      name: 'Canada & Australia',
      countries: JSON.stringify(['CA', 'AU', 'NZ']),
      rates: [
        { name: 'Standard International', price: 9.99, minDays: 8, maxDays: 15, freeAbove: 70, weightLimit: 2000 },
        { name: 'Express International', price: 24.99, minDays: 4, maxDays: 7, freeAbove: null, weightLimit: 2000 },
      ],
    },
    {
      name: 'Asia Pacific',
      countries: JSON.stringify(['JP', 'KR', 'SG', 'HK', 'TW', 'MY', 'TH', 'PH']),
      rates: [
        { name: 'Standard International', price: 14.99, minDays: 12, maxDays: 20, freeAbove: 80, weightLimit: 2000 },
        { name: 'Express International', price: 32.99, minDays: 5, maxDays: 8, freeAbove: null, weightLimit: 2000 },
      ],
    },
    {
      name: 'Rest of World',
      countries: JSON.stringify(['__default__']),
      rates: [
        { name: 'Standard International', price: 18.99, minDays: 15, maxDays: 30, freeAbove: 100, weightLimit: 2000 },
      ],
    },
  ]

  for (const zone of zones) {
    const z = await prisma.shippingZone.create({
      data: {
        name: zone.name,
        countries: zone.countries,
        rates: {
          create: zone.rates.map(r => ({
            name: r.name,
            price: r.price,
            minDays: r.minDays,
            maxDays: r.maxDays,
            freeAbove: r.freeAbove ?? null,
            weightLimit: r.weightLimit ?? null,
          })),
        },
      },
    })
    console.log('Shipping zone:', z.name)
  }

  // Add sample reviews
  const amethyst = await prisma.product.findUnique({ where: { slug: 'amethyst-serenity-bracelet' } })
  const roseQuartz = await prisma.product.findUnique({ where: { slug: 'rose-quartz-love-bracelet' } })

  if (amethyst && roseQuartz) {
    await prisma.review.createMany({
      data: [
        {
          productId: amethyst.id,
          userId: customer.id,
          rating: 5,
          title: 'Absolutely beautiful!',
          body: 'I\'ve been wearing this bracelet for 2 weeks and I genuinely feel calmer. The quality is outstanding — the beads are smooth and the clasp is sturdy. Will buy again!',
          verified: true,
        },
        {
          productId: roseQuartz.id,
          userId: customer.id,
          rating: 5,
          title: 'Perfect gift for myself',
          body: 'I bought this as a self-love reminder during a difficult time and it has been so meaningful. The rose quartz beads are a gorgeous soft pink and the bracelet arrived beautifully packaged.',
          verified: true,
        },
      ],
    })
  }

  console.log('✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
