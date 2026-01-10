
import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    @Get()
    findAll() {
        return this.productService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productService.findOne(id);
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productService.update(id, updateProductDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productService.remove(id);
    }
}
