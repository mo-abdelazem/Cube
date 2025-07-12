import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Core modules
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

// Product & Category modules
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OptionsModule } from './options/options.module';

// Order & Commerce modules
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { CouponsModule } from './coupons/coupons.module';
import { ShippingModule } from './shipping/shipping.module';

// Customer modules
import { ReviewsModule } from './reviews/reviews.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { AddressesModule } from './addresses/addresses.module';

// Admin modules
import { AdminModule } from './admin/admin.module';
import { InventoryModule } from './inventory/inventory.module';
import { UploadModule } from './upload/upload.module';

// Utility modules
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Serve static files (uploaded images)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    // Core modules
    PrismaModule,
    AuthModule,
    UsersModule,

    // Product & Category modules
    ProductsModule,
    CategoriesModule,
    OptionsModule,

    // Order & Commerce modules
    OrdersModule,
    CartModule,
    CouponsModule,
    ShippingModule,

    // Customer modules
    ReviewsModule,
    WishlistModule,
    AddressesModule,

    // Admin modules
    AdminModule,
    InventoryModule,
    UploadModule,

    // Utility modules
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
