import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarsModule } from './cars/cars.module';
import { ContactsModule } from './contacts/contacts.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'cars.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Only use in development
    }),
    CarsModule,
    ContactsModule,
  ],
})
export class AppModule {}
