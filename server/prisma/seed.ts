// prisma/seed.ts
import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  });

  // Create test customer
  const customerPassword = await bcrypt.hash('customer123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.CUSTOMER,
    },
  });

  // Create categories
  const electronicsCategory = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      slug: 'electronics',
      translations: {
        create: [
          { language: 'en', name: 'Electronics' },
          { language: 'ar', name: 'إلكترونيات' },
          { language: 'fr', name: 'Électronique' },
        ],
      },
    },
  });

  const clothingCategory = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: {
      slug: 'clothing',
      translations: {
        create: [
          { language: 'en', name: 'Clothing' },
          { language: 'ar', name: 'ملابس' },
          { language: 'fr', name: 'Vêtements' },
        ],
      },
    },
  });

  // Create Options (Size, Color, Storage)
  const sizeOption = await prisma.option.upsert({
    where: { slug: 'size' },
    update: {},
    create: {
      name: 'Size',
      slug: 'size',
      position: 1,
      translations: {
        create: [
          { language: 'en', name: 'Size' },
          { language: 'ar', name: 'الحجم' },
          { language: 'fr', name: 'Taille' },
        ],
      },
    },
  });

  const colorOption = await prisma.option.upsert({
    where: { slug: 'color' },
    update: {},
    create: {
      name: 'Color',
      slug: 'color',
      position: 2,
      translations: {
        create: [
          { language: 'en', name: 'Color' },
          { language: 'ar', name: 'اللون' },
          { language: 'fr', name: 'Couleur' },
        ],
      },
    },
  });

  const storageOption = await prisma.option.upsert({
    where: { slug: 'storage' },
    update: {},
    create: {
      name: 'Storage',
      slug: 'storage',
      position: 3,
      translations: {
        create: [
          { language: 'en', name: 'Storage' },
          { language: 'ar', name: 'التخزين' },
          { language: 'fr', name: 'Stockage' },
        ],
      },
    },
  });

  // Create Option Values for Size
  const sizeSmall = await prisma.optionValue.create({
    data: {
      optionId: sizeOption.id,
      value: 'Small',
      slug: 'small',
      position: 1,
      translations: {
        create: [
          { language: 'en', value: 'Small' },
          { language: 'ar', value: 'صغير' },
          { language: 'fr', value: 'Petit' },
        ],
      },
    },
  });

  const sizeMedium = await prisma.optionValue.create({
    data: {
      optionId: sizeOption.id,
      value: 'Medium',
      slug: 'medium',
      position: 2,
      translations: {
        create: [
          { language: 'en', value: 'Medium' },
          { language: 'ar', value: 'متوسط' },
          { language: 'fr', value: 'Moyen' },
        ],
      },
    },
  });

  const sizeLarge = await prisma.optionValue.create({
    data: {
      optionId: sizeOption.id,
      value: 'Large',
      slug: 'large',
      position: 3,
      translations: {
        create: [
          { language: 'en', value: 'Large' },
          { language: 'ar', value: 'كبير' },
          { language: 'fr', value: 'Grand' },
        ],
      },
    },
  });

  // Create Option Values for Color
  const colorRed = await prisma.optionValue.create({
    data: {
      optionId: colorOption.id,
      value: 'Red',
      slug: 'red',
      hexColor: '#FF0000',
      position: 1,
      translations: {
        create: [
          { language: 'en', value: 'Red' },
          { language: 'ar', value: 'أحمر' },
          { language: 'fr', value: 'Rouge' },
        ],
      },
    },
  });

  const colorBlue = await prisma.optionValue.create({
    data: {
      optionId: colorOption.id,
      value: 'Blue',
      slug: 'blue',
      hexColor: '#0000FF',
      position: 2,
      translations: {
        create: [
          { language: 'en', value: 'Blue' },
          { language: 'ar', value: 'أزرق' },
          { language: 'fr', value: 'Bleu' },
        ],
      },
    },
  });

  const colorBlack = await prisma.optionValue.create({
    data: {
      optionId: colorOption.id,
      value: 'Black',
      slug: 'black',
      hexColor: '#000000',
      position: 3,
      translations: {
        create: [
          { language: 'en', value: 'Black' },
          { language: 'ar', value: 'أسود' },
          { language: 'fr', value: 'Noir' },
        ],
      },
    },
  });

  // Create Option Values for Storage
  const storage128 = await prisma.optionValue.create({
    data: {
      optionId: storageOption.id,
      value: '128GB',
      slug: '128gb',
      position: 1,
      translations: {
        create: [
          { language: 'en', value: '128GB' },
          { language: 'ar', value: '128 جيجا' },
          { language: 'fr', value: '128Go' },
        ],
      },
    },
  });

  const storage256 = await prisma.optionValue.create({
    data: {
      optionId: storageOption.id,
      value: '256GB',
      slug: '256gb',
      position: 2,
      translations: {
        create: [
          { language: 'en', value: '256GB' },
          { language: 'ar', value: '256 جيجا' },
          { language: 'fr', value: '256Go' },
        ],
      },
    },
  });

  // Create Product with Variants - T-Shirt
  const tshirtProduct = await prisma.product.create({
    data: {
      sku: 'TSHIRT-COTTON-BASE',
      slug: 'cotton-t-shirt',
      basePrice: 19.99,
      hasVariants: true,
      categoryId: clothingCategory.id,
      isFeatured: true,
      translations: {
        create: [
          {
            language: 'en',
            name: 'Cotton T-Shirt',
            description: 'Comfortable 100% cotton t-shirt available in multiple sizes and colors.',
            shortDesc: '100% cotton comfortable t-shirt',
            metaTitle: 'Cotton T-Shirt - Multiple Colors & Sizes',
          },
          {
            language: 'ar',
            name: 'تي شيرت قطني',
            description: 'تي شيرت مريح من القطن 100% متوفر بأحجام وألوان متعددة.',
            shortDesc: 'تي شيرت مريح من القطن 100%',
            metaTitle: 'تي شيرت قطني - ألوان وأحجام متعددة',
          },
        ],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
            alt: 'Cotton T-Shirt',
            position: 1,
          },
        ],
      },
      options: {
        create: [
          { optionId: sizeOption.id, required: true },
          { optionId: colorOption.id, required: true },
        ],
      },
    },
  });

  // Create T-Shirt Variants (Size + Color combinations)
  const tshirtVariants = [
    { size: sizeSmall, color: colorRed, price: 19.99, stock: 50, sku: 'TSHIRT-COTTON-SM-RED' },
    { size: sizeSmall, color: colorBlue, price: 19.99, stock: 45, sku: 'TSHIRT-COTTON-SM-BLUE' },
    { size: sizeSmall, color: colorBlack, price: 22.99, stock: 30, sku: 'TSHIRT-COTTON-SM-BLACK' },
    { size: sizeMedium, color: colorRed, price: 19.99, stock: 60, sku: 'TSHIRT-COTTON-MD-RED', isDefault: true },
    { size: sizeMedium, color: colorBlue, price: 19.99, stock: 55, sku: 'TSHIRT-COTTON-MD-BLUE' },
    { size: sizeMedium, color: colorBlack, price: 22.99, stock: 40, sku: 'TSHIRT-COTTON-MD-BLACK' },
    { size: sizeLarge, color: colorRed, price: 21.99, stock: 35, sku: 'TSHIRT-COTTON-LG-RED' },
    { size: sizeLarge, color: colorBlue, price: 21.99, stock: 40, sku: 'TSHIRT-COTTON-LG-BLUE' },
    { size: sizeLarge, color: colorBlack, price: 24.99, stock: 25, sku: 'TSHIRT-COTTON-LG-BLACK' },
  ];

  for (const variantData of tshirtVariants) {
    const variant = await prisma.productVariant.create({
      data: {
        productId: tshirtProduct.id,
        sku: variantData.sku,
        price: variantData.price,
        stock: variantData.stock,
        isDefault: variantData.isDefault || false,
        weight: 200, // 200 grams
        dimensions: { length: 70, width: 50, height: 1 }, // cm
        options: {
          create: [
            { optionValueId: variantData.size.id },
            { optionValueId: variantData.color.id },
          ],
        },
      },
    });
  }

  // Create Product with Variants - iPhone
  const iphoneProduct = await prisma.product.create({
    data: {
      sku: 'IPHONE-15-BASE',
      slug: 'iphone-15',
      basePrice: 799.99,
      hasVariants: true,
      categoryId: electronicsCategory.id,
      isFeatured: true,
      translations: {
        create: [
          {
            language: 'en',
            name: 'iPhone 15',
            description: 'The latest iPhone with advanced features, available in different storage options and colors.',
            shortDesc: 'Latest iPhone with multiple storage and color options',
            metaTitle: 'iPhone 15 - Multiple Storage & Colors Available',
          },
          {
            language: 'ar',
            name: 'آيفون 15',
            description: 'أحدث آيفون بميزات متقدمة، متوفر بخيارات تخزين وألوان مختلفة.',
            shortDesc: 'أحدث آيفون بخيارات تخزين وألوان متعددة',
            metaTitle: 'آيفون 15 - تخزين وألوان متعددة متاحة',
          },
        ],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
            alt: 'iPhone 15',
            position: 1,
          },
        ],
      },
      options: {
        create: [
          { optionId: storageOption.id, required: true },
          { optionId: colorOption.id, required: true },
        ],
      },
    },
  });

  // Create iPhone Variants (Storage + Color combinations)
  const iphoneVariants = [
    { storage: storage128, color: colorBlack, price: 799.99, stock: 25, sku: 'IPHONE-15-128-BLACK', isDefault: true },
    { storage: storage128, color: colorBlue, price: 799.99, stock: 20, sku: 'IPHONE-15-128-BLUE' },
    { storage: storage256, color: colorBlack, price: 899.99, stock: 15, sku: 'IPHONE-15-256-BLACK' },
    { storage: storage256, color: colorBlue, price: 899.99, stock: 12, sku: 'IPHONE-15-256-BLUE' },
  ];

  for (const variantData of iphoneVariants) {
    const variant = await prisma.productVariant.create({
      data: {
        productId: iphoneProduct.id,
        sku: variantData.sku,
        price: variantData.price,
        stock: variantData.stock,
        isDefault: variantData.isDefault || false,
        weight: 171, // 171 grams
        dimensions: { length: 14.76, width: 7.15, height: 0.78 }, // cm
        options: {
          create: [
            { optionValueId: variantData.storage.id },
            { optionValueId: variantData.color.id },
          ],
        },
      },
    });
  }

  // Create a simple product without variants
  const plantProduct = await prisma.product.create({
    data: {
      sku: 'PLANT-FIDDLE-LG',
      slug: 'fiddle-leaf-fig-large',
      basePrice: 89.99,
      hasVariants: false,
      categoryId: electronicsCategory.id,
      translations: {
        create: [
          {
            language: 'en',
            name: 'Fiddle Leaf Fig - Large',
            description: 'Beautiful large fiddle leaf fig plant perfect for home decoration.',
            shortDesc: 'Large decorative fiddle leaf fig plant',
          },
        ],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1586943101559-4cdcf86a6f87?w=500',
            alt: 'Large Fiddle Leaf Fig Plant',
            position: 1,
          },
        ],
      },
    },
  });

  // Add a single variant for the plant (represents the main product)
  await prisma.productVariant.create({
    data: {
      productId: plantProduct.id,
      sku: 'PLANT-FIDDLE-LG-DEFAULT',
      price: 89.99,
      stock: 25,
      isDefault: true,
      weight: 5000, // 5kg
      dimensions: { length: 120, width: 80, height: 80 }, // cm
    },
  });

  console.log('✅ Database seeding completed!');
  console.log(`👤 Admin user: admin@example.com (password: admin123)`);
  console.log(`👤 Customer user: customer@example.com (password: customer123)`);
  console.log(`👕 T-Shirt: 9 variants (3 sizes × 3 colors)`);
  console.log(`📱 iPhone: 4 variants (2 storage × 2 colors)`);
  console.log(`🌱 Plant: Simple product without variants`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });