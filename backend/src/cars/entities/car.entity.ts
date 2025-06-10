import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  mileage: number;

  @Column()
  color: string;

  @Column()
  fuelType: string;

  @Column()
  transmission: string;

  @Column('text')
  description: string;

  @Column('simple-array')
  imageUrls: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 