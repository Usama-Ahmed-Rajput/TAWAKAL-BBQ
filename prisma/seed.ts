import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

const rawDbPath = path.resolve(process.cwd(), 'prisma', 'dev.db').replace(/\\/g, '/');
const connectionUrl = process.env.DATABASE_URL || `file:${rawDbPath}`;

const adapter = new PrismaBetterSqlite3({ url: connectionUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting Tawakal BBQ database seed...');

  // 1. Roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: {
      name: 'SUPER_ADMIN',
      description: 'Full system control and access to all settings, analytics, and user management.',
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Management access for orders, menu, deals, reservations, and customer care.',
    },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'MANAGER' },
    update: {},
    create: {
      name: 'MANAGER',
      description: 'Operational access for order fulfillment and table reservations.',
    },
  });

  const staffRole = await prisma.role.upsert({
    where: { name: 'STAFF' },
    update: {},
    create: {
      name: 'STAFF',
      description: 'Basic order viewing and status updates.',
    },
  });

  // 2. Permissions
  const permissionsList = [
    { key: 'orders.view', name: 'View Orders', description: 'Can view customer orders' },
    { key: 'orders.manage', name: 'Manage Orders', description: 'Can update order status and details' },
    { key: 'menu.view', name: 'View Menu', description: 'Can view menu items and categories' },
    { key: 'menu.create', name: 'Create Menu Items', description: 'Can add new dishes and categories' },
    { key: 'menu.edit', name: 'Edit Menu Items', description: 'Can update prices, names, and images' },
    { key: 'menu.delete', name: 'Delete Menu Items', description: 'Can archive or remove menu items' },
    { key: 'deals.view', name: 'View Deals', description: 'Can view promotional deals' },
    { key: 'deals.create', name: 'Create Deals', description: 'Can create new deals' },
    { key: 'deals.edit', name: 'Edit Deals', description: 'Can update deals' },
    { key: 'deals.delete', name: 'Delete Deals', description: 'Can remove deals' },
    { key: 'deals.publish', name: 'Publish Deals', description: 'Can publish/unpublish deals' },
    { key: 'customers.view', name: 'View Customers', description: 'Can view customer database' },
    { key: 'reservations.view', name: 'View Reservations', description: 'Can view table bookings' },
    { key: 'reservations.manage', name: 'Manage Reservations', description: 'Can confirm/cancel bookings' },
    { key: 'offers.manage', name: 'Manage Offers & Coupons', description: 'Can manage discount coupons' },
    { key: 'reviews.manage', name: 'Manage Reviews', description: 'Can approve/reject reviews' },
    { key: 'analytics.view', name: 'View Analytics', description: 'Can view revenue and sales reports' },
    { key: 'reports.view', name: 'View Reports', description: 'Can generate detailed reports' },
    { key: 'settings.manage', name: 'Manage Settings', description: 'Can change restaurant configuration' },
    { key: 'users.manage', name: 'Manage Users & Roles', description: 'Can manage admin staff accounts' },
  ];

  for (const perm of permissionsList) {
    const createdPerm = await prisma.permission.upsert({
      where: { key: perm.key },
      update: { name: perm.name, description: perm.description },
      create: perm,
    });

    // Link all permissions to SUPER_ADMIN
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionKey: {
          roleId: superAdminRole.id,
          permissionKey: createdPerm.key,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionKey: createdPerm.key,
      },
    });
  }

  // 3. Initial Super Admin User
  const passwordHash = await bcrypt.hash('admin123456', 10);
  await prisma.user.upsert({
    where: { email: 'admin@tawakalbbq.com' },
    update: { passwordHash, roleId: superAdminRole.id },
    create: {
      name: 'Tawakal Super Admin',
      email: 'admin@tawakalbbq.com',
      passwordHash,
      roleId: superAdminRole.id,
    },
  });

  // 4. Menu Categories
  const categoriesData = [
    {
      name: 'BBQ',
      slug: 'bbq',
      description: 'Charcoal grilled kebabs, tikkas and botis cooked over live fire.',
      image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80',
      sortOrder: 1,
    },
    {
      name: 'PLATTERS',
      slug: 'platters',
      description: 'Grand family assortments served on sizzling iron griddles.',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
      sortOrder: 2,
    },
    {
      name: 'STARTERS',
      slug: 'starters',
      description: 'Appetizers to spark your appetite before the main BBQ feast.',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
      sortOrder: 3,
    },
    {
      name: 'BREADS',
      slug: 'breads',
      description: 'Live tandoori naans, parathas and clay oven rotis.',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      sortOrder: 4,
    },
    {
      name: 'SIDES',
      slug: 'sides',
      description: 'Smokey raitas, fresh kachumber salads and specialty chutneys.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      sortOrder: 5,
    },
    {
      name: 'DRINKS',
      slug: 'drinks',
      description: 'Smokey lemonades, chilled lassi and tandoori karak chai.',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
      sortOrder: 6,
    },
    {
      name: 'DESSERTS',
      slug: 'desserts',
      description: 'Traditional sweets infused with saffron and clay-charred flavor.',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
      sortOrder: 7,
    },
  ];

  const categoryMap: Record<string, string> = {};

  for (const cat of categoriesData) {
    const createdCat = await prisma.menuCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap[cat.slug] = createdCat.id;
  }

  // 5. Menu Items
  const menuItemsData = [
    {
      name: 'Tawakal Special Chicken Tikka',
      slug: 'tawakal-special-chicken-tikka',
      urduName: 'تَوَکَّل چکن تکہ',
      description: 'Quarter chicken marinated in signature red spices, char-grilled over live coals till succulent.',
      shortDescription: 'Quarter chicken marinated in red spices & charred live.',
      categoryId: categoryMap['bbq'],
      price: 580,
      image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      isPopular: true,
      isAvailable: true,
      sortOrder: 1,
    },
    {
      name: 'Smokey Seekh Kebab (Beef)',
      slug: 'smokey-seekh-kebab-beef',
      urduName: 'سیخ کباب بیف',
      description: 'Minced beef blended with crushed chili, coriander seeds & secret spices, grilled on iron skewers.',
      shortDescription: 'Minced beef with coarse spices charred on skewers.',
      categoryId: categoryMap['bbq'],
      price: 720,
      image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      isPopular: true,
      isAvailable: true,
      sortOrder: 2,
    },
    {
      name: 'Reshmi Malai Boti',
      slug: 'reshmi-malai-boti',
      urduName: 'ریشمی ملائی بوٹی',
      description: 'Melt-in-mouth chicken breast cubes marinated in heavy cream, green chili paste and white pepper.',
      shortDescription: 'Chicken breast marinated in cream and cardamom.',
      categoryId: categoryMap['bbq'],
      price: 890,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      isPopular: true,
      isAvailable: true,
      sortOrder: 3,
    },
    {
      name: 'Fire Beef Boti',
      slug: 'fire-beef-boti',
      urduName: 'بیف بوٹی فائر',
      description: 'Tender beef chunks slow-marinated in papaya & coarse spices, scorched over roaring embers.',
      shortDescription: 'Spicy tender beef cuts grilled on coals.',
      categoryId: categoryMap['bbq'],
      price: 950,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      isPopular: true,
      isAvailable: true,
      sortOrder: 4,
    },
    {
      name: 'Kasturi Chicken Boti',
      slug: 'kasturi-chicken-boti',
      urduName: 'کستوری چکن بوٹی',
      description: 'Succulent chicken morsels dusted with toasted fenugreek, dry pomegranate and aromatic ghee.',
      shortDescription: 'Boneless chicken morsels infused with fenugreek.',
      categoryId: categoryMap['bbq'],
      price: 850,
      image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      isPopular: false,
      isAvailable: true,
      sortOrder: 5,
    },
    {
      name: 'The Tawakal Royal BBQ Platter',
      slug: 'the-tawakal-royal-bbq-platter',
      urduName: 'تَوَکَّل شاہی پلیٹر',
      description: 'Includes 1 Chicken Tikka, 4 Seekh Kebabs, 6 Malai Boti, 6 Beef Boti, 2 Puri Parathas, Mint Raita & Fresh Salad.',
      shortDescription: 'The grand feast: Tikka, Seekh Kebab, Malai Boti, Parathas & Raita.',
      categoryId: categoryMap['platters'],
      price: 3450,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      isPopular: true,
      isAvailable: true,
      sortOrder: 1,
    },
    {
      name: 'Live Tandoori Garlic Naan',
      slug: 'live-tandoori-garlic-naan',
      urduName: 'تندوری گارلک نان',
      description: 'Clay-oven baked naan topped with crushed garlic, coriander and warm desi ghee.',
      shortDescription: 'Garlic naan baked on clay oven walls.',
      categoryId: categoryMap['breads'],
      price: 140,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      isPopular: true,
      isAvailable: true,
      sortOrder: 1,
    },
    {
      name: 'Crispy Golden Puri Paratha',
      slug: 'crispy-golden-puri-paratha',
      urduName: 'پوری پراٹھا',
      description: 'Flaky layered fried paratha - the essential companion for Tawakal BBQ.',
      shortDescription: 'Flaky layered crispy paratha.',
      categoryId: categoryMap['breads'],
      price: 160,
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      isPopular: true,
      isAvailable: true,
      sortOrder: 2,
    },
    {
      name: 'Zeera & Mint Smoked Raita',
      slug: 'zeera-mint-smoked-raita',
      urduName: 'زیرا پودینہ رائتہ',
      description: 'Thick whipped yogurt smoked with coal infusion, roasted cumin and mint.',
      shortDescription: 'Smokey whipped yogurt with roasted cumin.',
      categoryId: categoryMap['sides'],
      price: 180,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      isPopular: true,
      isAvailable: true,
      sortOrder: 1,
    },
    {
      name: 'Smokey Charcoal Lemonade',
      slug: 'smokey-charcoal-lemonade',
      urduName: 'چارکول لیمونیڈ',
      description: 'Refreshing black lemon fizz infused with mint leaves, lemon juice and activated charcoal spark.',
      shortDescription: 'Chilled mint & black lemon fizz.',
      categoryId: categoryMap['drinks'],
      price: 320,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      isPopular: true,
      isAvailable: true,
      sortOrder: 1,
    },
  ];

  const menuItemMap: Record<string, string> = {};

  for (const item of menuItemsData) {
    const createdItem = await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
    menuItemMap[item.slug] = createdItem.id;
  }

  // 6. Promotional Deals
  const familyDeal = await prisma.deal.upsert({
    where: { slug: 'family-bbq-deal' },
    update: {},
    create: {
      title: 'Family BBQ Deal',
      slug: 'family-bbq-deal',
      shortDescription: 'Complete BBQ feast for 4 persons with Tikka, Kebabs & Parathas.',
      description: 'Includes 1 Tawakal Special Chicken Tikka, 4 Smokey Seekh Kebabs, 6 Reshmi Malai Boti, 4 Golden Puri Parathas, and 1 Zeera Mint Raita.',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
      originalPrice: 3890,
      dealPrice: 2999,
      discountType: 'FIXED',
      discountValue: 891,
      isActive: true,
      isFeatured: true,
      isHomepageFeatured: true,
      sortOrder: 1,
      terms: 'Available for delivery and pickup every day from 12 PM to 11:30 PM.',
    },
  });

  const sizzlerDeal = await prisma.deal.upsert({
    where: { slug: 'sizzling-duo-combo' },
    update: {},
    create: {
      title: 'Sizzling Duo Combo',
      slug: 'sizzling-duo-combo',
      shortDescription: 'Perfect BBQ pair deal with Chicken Tikka, Seekh Kebab & Drinks.',
      description: 'Includes 1 Chicken Tikka, 2 Smokey Seekh Kebabs, 2 Tandoori Garlic Naans, and 2 Smokey Charcoal Lemonades.',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      originalPrice: 2260,
      dealPrice: 1799,
      discountType: 'FIXED',
      discountValue: 461,
      isActive: true,
      isFeatured: true,
      isHomepageFeatured: true,
      sortOrder: 2,
      terms: 'Valid for online ordering & dine-in.',
    },
  });

  // Deal Items
  if (menuItemMap['tawakal-special-chicken-tikka']) {
    await prisma.dealItem.createMany({
      data: [
        { dealId: familyDeal.id, menuItemId: menuItemMap['tawakal-special-chicken-tikka'], quantity: 1 },
        { dealId: familyDeal.id, menuItemId: menuItemMap['smokey-seekh-kebab-beef'], quantity: 4 },
        { dealId: familyDeal.id, menuItemId: menuItemMap['reshmi-malai-boti'], quantity: 6 },
        { dealId: sizzlerDeal.id, menuItemId: menuItemMap['tawakal-special-chicken-tikka'], quantity: 1 },
        { dealId: sizzlerDeal.id, menuItemId: menuItemMap['smokey-seekh-kebab-beef'], quantity: 2 },
      ],
    });
  }

  // 7. Coupons
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrder: 1000,
      maxDiscount: 500,
      usageLimit: 100,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'TAWAKAL200' },
    update: {},
    create: {
      code: 'TAWAKAL200',
      discountType: 'FIXED',
      discountValue: 200,
      minOrder: 1500,
      isActive: true,
    },
  });

  // 8. Restaurant Tables
  const tableData = [
    { tableNumber: 'T01', capacity: 2, area: 'MAIN_DINING' },
    { tableNumber: 'T02', capacity: 4, area: 'MAIN_DINING' },
    { tableNumber: 'T03', capacity: 4, area: 'FAMILY_HALL' },
    { tableNumber: 'T04', capacity: 6, area: 'FAMILY_HALL' },
    { tableNumber: 'T05', capacity: 8, area: 'OUTDOOR' },
  ];

  for (const table of tableData) {
    await prisma.restaurantTable.upsert({
      where: { tableNumber: table.tableNumber },
      update: table,
      create: table,
    });
  }

  // 9. Restaurant Settings
  const defaultSettings = [
    { key: 'restaurant_name', value: 'Tawakal BBQ' },
    { key: 'phone', value: '+92 300 1234567' },
    { key: 'email', value: 'info@tawakalbbq.com' },
    { key: 'whatsapp', value: '+923001234567' },
    { key: 'address', value: 'Main Charcoal Street, BBQ Hub, Karachi' },
    { key: 'delivery_fee', value: '150' },
    { key: 'min_order_amount', value: '500' },
    { key: 'ordering_enabled', value: 'true' },
    { key: 'delivery_enabled', value: 'true' },
    { key: 'pickup_enabled', value: 'true' },
    { key: 'cod_enabled', value: 'true' },
    { key: 'map_url', value: 'https://maps.google.com' },
  ];

  for (const setting of defaultSettings) {
    await prisma.restaurantSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  // 10. Business Hours
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  for (const day of days) {
    await prisma.businessHour.upsert({
      where: { dayOfWeek: day },
      update: { isOpen: true, openTime: '12:00', closeTime: '01:00' },
      create: { dayOfWeek: day, isOpen: true, openTime: '12:00', closeTime: '01:00' },
    });
  }

  // 11. Testimonials
  const testimonials = [
    {
      name: 'Farhan Zaidi',
      rating: 5,
      comment: 'The chicken tikka and seekh kebabs are unbeatable. Authentically charred over live coals!',
      isFeatured: true,
      sortOrder: 1,
    },
    {
      name: 'Ayesha Malik',
      rating: 5,
      comment: 'Best BBQ experience in town. The Reshmi Malai Boti melted in our mouth!',
      isFeatured: true,
      sortOrder: 2,
    },
    {
      name: 'Kamran Shah',
      rating: 5,
      comment: 'Ordering online was super smooth. Delivered steaming hot in under 35 minutes.',
      isFeatured: true,
      sortOrder: 3,
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({
      data: t,
    });
  }

  console.log('✅ Tawakal BBQ database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
