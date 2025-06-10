import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private carsRepository: Repository<Car>,
  ) {}

  create(createCarDto: Partial<Car>) {
    const car = this.carsRepository.create(createCarDto);
    return this.carsRepository.save(car);
  }

  findAll() {
    return this.carsRepository.find();
  }

  async findOne(id: number) {
    const car = await this.carsRepository.findOne({ where: { id } });
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    return car;
  }

  async update(id: number, updateCarDto: Partial<Car>) {
    await this.carsRepository.update(id, updateCarDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const car = await this.findOne(id);
    return this.carsRepository.remove(car);
  }

  async findByFilters(filters: {
    brand?: string;
    model?: string;
    minPrice?: number;
    maxPrice?: number;
    year?: number;
  }) {
    const queryBuilder = this.carsRepository.createQueryBuilder('car');

    if (filters.brand) {
      queryBuilder.andWhere('car.brand = :brand', { brand: filters.brand });
    }

    if (filters.model) {
      queryBuilder.andWhere('car.model = :model', { model: filters.model });
    }

    if (filters.minPrice) {
      queryBuilder.andWhere('car.price >= :minPrice', { minPrice: filters.minPrice });
    }

    if (filters.maxPrice) {
      queryBuilder.andWhere('car.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    if (filters.year) {
      queryBuilder.andWhere('car.year = :year', { year: filters.year });
    }

    return queryBuilder.getMany();
  }
} 