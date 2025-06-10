import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CarsService } from './cars.service';
import { Car } from './entities/car.entity';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  create(
    @Body() createCarDto: Partial<Car>,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (files && files.length > 0) {
      createCarDto.imageUrls = files.map(file => `/uploads/${file.filename}`);
    }
    return this.carsService.create(createCarDto);
  }

  @Get()
  findAll(@Query() filters: {
    brand?: string;
    model?: string;
    minPrice?: number;
    maxPrice?: number;
    year?: number;
  }) {
    if (Object.keys(filters).length > 0) {
      return this.carsService.findByFilters(filters);
    }
    return this.carsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateCarDto: Partial<Car>,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (files && files.length > 0) {
      updateCarDto.imageUrls = files.map(file => `/uploads/${file.filename}`);
    }
    return this.carsService.update(+id, updateCarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carsService.remove(+id);
  }
} 