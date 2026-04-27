/**
 * lsle of Mist — Product & Category Data Update Script
 * Clears existing products/categories and re-seeds with full data + real images
 */
process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./dev.db'
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌿 Updating lsle of Mist product catalog...\n')

  // ── 1. Clear existing data ──────────────────────────────────────────────────
  await prisma.review.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  console.log('✅ Cleared existing products & categories\n')

  // ── 2. Categories ───────────────────────────────────────────────────────────
  const cats = await Promise.all([
    prisma.category.create({ data: {
      name: 'Healing Bracelets', slug: 'healing-bracelets',
      description: 'Hand-strung natural crystal bracelets for daily healing and balance',
      image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&auto=format&fit=crop',
    }}),
    prisma.category.create({ data: {
      name: 'Chakra Sets', slug: 'chakra-sets',
      description: 'Complete chakra balancing sets — one crystal for each energy centre',
      image: 'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=800&auto=format&fit=crop',
    }}),
    prisma.category.create({ data: {
      name: 'Protection Crystals', slug: 'protection-crystals',
      description: 'Protective and grounding crystal bracelets to shield your energy',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
    }}),
    prisma.category.create({ data: {
      name: 'Love & Romance', slug: 'love-romance',
      description: 'Crystals for opening the heart, attracting love and nurturing connection',
      image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&auto=format&fit=crop',
    }}),
  ])

  const catMap = Object.fromEntries(cats.map(c => [c.slug, c.id]))
  cats.forEach(c => console.log('📂', c.name))
  console.log()

  // ── 3. Products ─────────────────────────────────────────────────────────────
  const products = [

    // ── HEALING BRACELETS ────────────────────────────────────────────────────

    {
      name: 'Amethyst Serenity Bracelet',
      slug: 'amethyst-serenity-bracelet',
      description: 'Hand-strung with 8mm genuine amethyst beads on a durable stretch cord. Each bead carries the deep violet energy of calm, clarity, and inner peace — finished with a sterling silver spacer.',
      story: 'For centuries, amethyst has been revered as the stone of spiritual protection and clear-headedness. Ancient Greeks wore it to prevent intoxication; medieval soldiers carried it into battle to stay level-headed. Today, it remains the most beloved stone for quieting an overactive mind. Place it on your wrist and let its steady purple energy dissolve the static of a busy day.',
      price: 38.00,
      comparePrice: 52.00,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1638768892257-8aec93a524e5?w=800&auto=format&fit=crop',
      ]),
      stock: 45, sku: 'AME-001', weight: 25,
      categoryId: catMap['healing-bracelets'], featured: true,
      crystalType: 'Amethyst', chakra: 'Crown & Third Eye',
      healing: JSON.stringify(['Anxiety Relief', 'Spiritual Growth', 'Better Sleep', 'Intuition', 'Mental Clarity']),
    },

    {
      name: 'Lapis Lazuli Wisdom Bracelet',
      slug: 'lapis-lazuli-wisdom-bracelet',
      description: 'Deep midnight-blue lapis lazuli beads threaded on elastic cord, accented with natural golden pyrite flecks that catch the light. A statement piece as much as a healing tool.',
      story: 'Lapis lazuli was ground into pigment for the robes of the Virgin Mary and the burial mask of Tutankhamun. Civilisations across 6,000 years have valued it as the stone of truth, wisdom, and royal authority. Wear it when you need to speak clearly, think deeply, or find direction through confusion.',
      price: 48.00,
      comparePrice: null,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1639622448472-18146a9b3f2a?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
      ]),
      stock: 25, sku: 'LAP-001', weight: 26,
      categoryId: catMap['healing-bracelets'], featured: false,
      crystalType: 'Lapis Lazuli', chakra: 'Third Eye & Throat',
      healing: JSON.stringify(['Wisdom', 'Truth', 'Communication', 'Intellectual Clarity', 'Self-Expression']),
    },

    {
      name: 'Citrine Abundance Bracelet',
      slug: 'citrine-abundance-bracelet',
      description: 'Warm golden citrine beads (8mm) on a soft stretch cord. Lightweight and joyful to wear, radiating the colour of morning sunlight from the first moment you put it on.',
      story: 'Citrine is one of the only crystals that never absorbs negative energy — it only transmutes it into golden light. Called the Merchant\'s Stone, it has sat on shop counters and in cash registers across cultures for generations. But its gift is not just material: citrine restores confidence, dissolves self-doubt, and reminds you that abundance is a state of mind before it is a state of your bank account.',
      price: 36.00,
      comparePrice: 48.00,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1676291055501-286c48bb186f?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=800&auto=format&fit=crop',
      ]),
      stock: 50, sku: 'CIT-001', weight: 24,
      categoryId: catMap['healing-bracelets'], featured: false,
      crystalType: 'Citrine', chakra: 'Solar Plexus',
      healing: JSON.stringify(['Abundance', 'Confidence', 'Creativity', 'Positive Energy', 'Motivation']),
    },

    {
      name: 'Green Aventurine Growth Bracelet',
      slug: 'green-aventurine-growth-bracelet',
      description: 'Smooth 8mm green aventurine beads with a subtle shimmer, strung on a durable elastic cord. The cool, forest-green tone feels fresh and grounding against the skin.',
      story: 'Aventurine is sometimes called the Stone of Opportunity — a talisman for gamblers, gardeners, and anyone planting seeds of change. Its gentle green energy resonates with the heart chakra and with the natural world: think of morning dew on leaves, of quiet forest light. It encourages growth — not the frantic, grasping kind, but the steady, rooted kind that lasts.',
      price: 32.00,
      comparePrice: 42.00,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1640053666464-55a0045c4895?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1638768892257-8aec93a524e5?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&auto=format&fit=crop',
      ]),
      stock: 55, sku: 'AVE-001', weight: 23,
      categoryId: catMap['healing-bracelets'], featured: false,
      crystalType: 'Green Aventurine', chakra: 'Heart',
      healing: JSON.stringify(['Luck', 'Opportunity', 'Emotional Calm', 'Growth', 'Optimism']),
    },

    {
      name: 'Moonstone Intuition Bracelet',
      slug: 'moonstone-intuition-bracelet',
      description: 'Luminous white moonstone beads (8mm) with a gentle blue adularescence that shifts as you move. Each bead is unique — no two moonstones carry the same light.',
      story: 'Named for the moon it resembles, moonstone has been a talisman of travellers, lovers, and those who trust their instincts above all else. In Hindu mythology it is made from moonbeams solidified. It is the stone of cycles — of the natural rhythm of emotions, creativity, and intuition. Wear it to tune into what you already know, deep down.',
      price: 52.00,
      comparePrice: 68.00,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1707222610699-c0f82cc41298?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1639622448472-18146a9b3f2a?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&auto=format&fit=crop',
      ]),
      stock: 20, sku: 'MOO-001', weight: 24,
      categoryId: catMap['healing-bracelets'], featured: true,
      crystalType: 'Moonstone', chakra: 'Crown & Sacral',
      healing: JSON.stringify(['Intuition', 'Emotional Balance', 'Feminine Energy', 'New Beginnings', 'Inner Peace']),
    },

    // ── CHAKRA SETS ──────────────────────────────────────────────────────────

    {
      name: '7 Chakra Alignment Bracelet',
      slug: '7-chakra-alignment-bracelet',
      description: 'Seven carefully chosen gemstone beads — one for each chakra: amethyst (crown), lapis lazuli (third eye), turquoise (throat), green aventurine (heart), tiger\'s eye (solar plexus), carnelian (sacral), and red jasper (root).',
      story: 'The chakra system describes seven energy centres running along the spine, each governing different aspects of our physical and emotional life. When even one is blocked or overactive, we feel it — as tension, confusion, disconnection, or unexplained unease. This bracelet was designed to carry all seven frequencies at once, a full-spectrum companion for days when you need everything to come back into alignment.',
      price: 55.00,
      comparePrice: 72.00,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1638768892257-8aec93a524e5?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1640053666464-55a0045c4895?w=800&auto=format&fit=crop',
      ]),
      stock: 30, sku: 'CHK-001', weight: 35,
      categoryId: catMap['chakra-sets'], featured: true,
      crystalType: 'Multi-Crystal', chakra: 'All 7 Chakras',
      healing: JSON.stringify(['Full Chakra Balance', 'Energy Alignment', 'Holistic Healing', 'Spiritual Harmony', 'Vitality']),
    },

    {
      name: 'Root & Sacral Grounding Duo Set',
      slug: 'root-sacral-grounding-duo',
      description: 'A matched pair: one red jasper bracelet (root chakra) and one carnelian bracelet (sacral chakra). Wear together or separately. Presented in a linen gift box with a chakra card.',
      story: 'When life feels unstable — when anxiety keeps you in your head, when motivation has run dry — it is almost always the lower chakras calling for attention. Red jasper anchors you to the earth. Carnelian rekindles your creative fire. Together they rebuild from the ground up, restoring the steady, embodied sense of self that makes everything else feel manageable again.',
      price: 62.00,
      comparePrice: 84.00,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1610694954731-e6aeb964a84c?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
      ]),
      stock: 18, sku: 'CHK-002', weight: 48,
      categoryId: catMap['chakra-sets'], featured: false,
      crystalType: 'Red Jasper & Carnelian', chakra: 'Root & Sacral',
      healing: JSON.stringify(['Blessing', 'Creativity', 'Stability', 'Motivation', 'Vitality']),
    },

    // ── PROTECTION CRYSTALS ──────────────────────────────────────────────────

    {
      name: 'Black Tourmaline Shield Bracelet',
      slug: 'black-tourmaline-shield-bracelet',
      description: 'Chunky 10mm black tourmaline beads on heavy-duty elastic cord. Noticeably weighty on the wrist — a quality that many wearers find grounding in itself. Raw, earthy, and powerful.',
      story: 'Black tourmaline is nature\'s own force field. Piezoelectric — meaning it generates a subtle electrical charge when pressure is applied — it has a measurable interaction with electromagnetic fields. Metaphysically, it is the most potent protective stone known: creating an energetic boundary between you and whatever is draining, harmful, or simply not yours to carry. Wear it on difficult days, in difficult places, with difficult people.',
      price: 42.00,
      comparePrice: null,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1639622448472-18146a9b3f2a?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&auto=format&fit=crop',
      ]),
      stock: 38, sku: 'BT-001', weight: 32,
      categoryId: catMap['protection-crystals'], featured: true,
      crystalType: 'Black Tourmaline', chakra: 'Root',
      healing: JSON.stringify(['Protection', 'Blessing', 'EMF Shielding', 'Negative Energy Clearing', 'Anxiety Relief']),
    },

    {
      name: 'Obsidian Truth Mirror Bracelet',
      slug: 'obsidian-truth-mirror-bracelet',
      description: 'Glossy black obsidian beads (8mm) with a mirror-like polish. Cool and glassy against the skin, with an almost hypnotic depth to each bead when held to the light.',
      story: 'Obsidian forms in an instant — molten lava hitting cold water, freezing mid-flow. There is nothing gentle about its origin, and nothing gentle about its energy. It is the stone of radical honesty: with others, and above all, with yourself. Ancient Mesoamerican shamans used obsidian mirrors for scrying — gazing into their own depths. Wear it when you need to see clearly, even when clarity is uncomfortable.',
      price: 38.00,
      comparePrice: 50.00,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1676291055501-286c48bb186f?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1639622448472-18146a9b3f2a?w=800&auto=format&fit=crop',
      ]),
      stock: 28, sku: 'OBS-001', weight: 27,
      categoryId: catMap['protection-crystals'], featured: false,
      crystalType: 'Black Obsidian', chakra: 'Root',
      healing: JSON.stringify(['Protection', 'Shadow Work', 'Truth', 'Psychic Protection', 'Clarity']),
    },

    {
      name: 'Smoky Quartz Forest Bracelet',
      slug: 'smoky-quartz-forest-bracelet',
      description: 'Translucent smoky quartz beads ranging from pale grey to deep charcoal brown — no two bracelets are identical. The natural colour gradient evokes morning mist settling over dark earth.',
      story: 'Smoky quartz forms when clear quartz is exposed to natural radiation deep within the earth over millennia. The result is a stone uniquely attuned to transformation: absorbing negative vibrations and transmuting them, like a forest floor composting fallen leaves into rich soil. It is the quiet, unglamorous work of healing — steady, patient, and deeply effective.',
      price: 44.00,
      comparePrice: 58.00,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1640053666464-55a0045c4895?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&auto=format&fit=crop',
      ]),
      stock: 32, sku: 'SMQ-001', weight: 26,
      categoryId: catMap['protection-crystals'], featured: false,
      crystalType: 'Smoky Quartz', chakra: 'Root & Earth Star',
      healing: JSON.stringify(['Blessing', 'Stress Relief', 'Negativity Transmutation', 'Emotional Calm', 'Protection']),
    },

    // ── LOVE & ROMANCE ───────────────────────────────────────────────────────

    {
      name: 'Rose Quartz Heart Bracelet',
      slug: 'rose-quartz-heart-bracelet',
      description: 'Soft blush-pink rose quartz beads (8mm) with one small carved heart bead at centre. Delicate and feminine, yet with a quiet strength that has made rose quartz the world\'s most gifted crystal.',
      story: 'Rose quartz is not about romantic love alone. It is about the much harder, much more important work of loving yourself — of extending to your own heart the same tenderness you give to the people you love most. Aphrodite, Isis, Freya: goddesses of love across three cultures all claimed this stone. Wear it as a reminder that compassion begins with you.',
      price: 34.00,
      comparePrice: 45.00,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1634185331054-66bb781a637e?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1610694954731-e6aeb964a84c?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&auto=format&fit=crop',
      ]),
      stock: 60, sku: 'RQ-001', weight: 22,
      categoryId: catMap['love-romance'], featured: true,
      crystalType: 'Rose Quartz', chakra: 'Heart',
      healing: JSON.stringify(['Self-Love', 'Unconditional Love', 'Emotional Healing', 'Compassion', 'Relationship Harmony']),
    },

    {
      name: 'Rhodonite Forgiveness Bracelet',
      slug: 'rhodonite-forgiveness-bracelet',
      description: 'Striking rhodonite beads in dusty rose with distinctive black manganese veining — nature\'s own artwork on every bead. 8mm on soft stretch cord, with a gentle weight that feels grounding.',
      story: 'Rhodonite is the stone of forgiveness — not the easy, performative kind, but the deep, liberating kind that you do for yourself. The black veins running through the pink stone tell the story: through the dark places, love finds its way. Rhodonite works slowly, the way real healing does. It asks you to stay with uncomfortable feelings long enough to understand them, and then — gently — to let them go.',
      price: 40.00,
      comparePrice: 52.00,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1638768892257-8aec93a524e5?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1634185331054-66bb781a637e?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&auto=format&fit=crop',
      ]),
      stock: 22, sku: 'RHO-001', weight: 25,
      categoryId: catMap['love-romance'], featured: false,
      crystalType: 'Rhodonite', chakra: 'Heart',
      healing: JSON.stringify(['Forgiveness', 'Emotional Wounds', 'Self-Worth', 'Compassion', 'Relationship Healing']),
    },
  ]

  let count = 0
  for (const p of products) {
    await prisma.product.create({ data: p })
    console.log(`✅ ${p.name} — $${p.price}`)
    count++
  }

  // ── 4. Reviews ──────────────────────────────────────────────────────────────
  console.log('\n📝 Adding reviews...')
  const customer = await prisma.user.findUnique({ where: { email: 'customer@test.com' } })

  if (customer) {
    const amethyst  = await prisma.product.findUnique({ where: { slug: 'amethyst-serenity-bracelet' } })
    const roseQ     = await prisma.product.findUnique({ where: { slug: 'rose-quartz-heart-bracelet' } })
    const tourmaline = await prisma.product.findUnique({ where: { slug: 'black-tourmaline-shield-bracelet' } })
    const chakra    = await prisma.product.findUnique({ where: { slug: '7-chakra-alignment-bracelet' } })
    const moonstone = await prisma.product.findUnique({ where: { slug: 'moonstone-intuition-bracelet' } })

    const reviews = [
      { productId: amethyst?.id,   rating: 5, title: 'Genuinely calming — I was sceptical but now I\'m a convert', body: 'I\'ve been wearing this for 3 weeks and I\'m sleeping better. Whether it\'s the crystal or just the ritual of putting it on, something has shifted. The quality is beautiful — smooth beads, strong elastic.', verified: true },
      { productId: amethyst?.id,   rating: 5, title: 'The most beautiful bracelet I\'ve owned', body: 'The purple is so rich and the beads catch the light wonderfully. I bought it for anxiety and I genuinely reach for it when I feel overwhelmed. Worth every penny.', verified: true },
      { productId: roseQ?.id,      rating: 5, title: 'Bought for myself as a self-love reminder', body: 'I was going through a difficult period and bought this as a reminder to be kinder to myself. The rose quartz is soft and pretty, and there\'s something about wearing it that shifts my mindset. Beautifully packaged too.', verified: true },
      { productId: roseQ?.id,      rating: 4, title: 'Lovely gift — recipient was delighted', body: 'Bought as a birthday gift. Arrived in gorgeous packaging with a crystal card. My friend wore it immediately and loves it. Would have given 5 stars but shipping took a little longer than expected.', verified: true },
      { productId: tourmaline?.id, rating: 5, title: 'Feels like armour', body: 'I wear this to work every day — I work in a very high-stress environment with difficult colleagues. It feels grounding in a way I can\'t fully explain. Heavy and reassuring on the wrist. Highly recommend.', verified: true },
      { productId: chakra?.id,     rating: 5, title: 'A stunning set — each crystal is perfect', body: 'The quality of each stone is exceptional. You can tell these are genuine crystals, not cheap dyed glass. I\'ve been using chakra bracelets for years and this is the best set I\'ve found at this price point.', verified: true },
      { productId: moonstone?.id,  rating: 5, title: 'The adularescence is magical in person', body: 'Photos don\'t do the moonstone justice — in real life it has this gorgeous blue flash. I bought it for intuition work and I love wearing it during meditation. Shipping was fast and packaging was beautiful.', verified: true },
    ].filter(r => r.productId)

    for (const r of reviews) {
      await prisma.review.create({ data: { ...r, userId: customer.id } })
    }
    console.log(`✅ ${reviews.length} reviews added`)
  }

  console.log(`\n🎉 Done! ${count} products across 4 categories ready for lsle of Mist.`)
}

main()
  .catch(e => { console.error('❌ Error:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
