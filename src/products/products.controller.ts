import { catchError } from 'rxjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';

import { PaginationDto } from '../common';
import { PRODUCT_SERVICE } from '../config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
    constructor(
        @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy
    ) {}

    @Post()
    createProduct(@Body() createProductDto: CreateProductDto) {
        return this.productsClient.send({ cmd: 'createProduct' }, createProductDto)
    }

    @Get()
    findAllProducts( @Query() paginationDto: PaginationDto) {
        return this.productsClient.send({ cmd: 'findAllProducts' }, paginationDto)
    }

    @Get(':id')
    async findOneProduct(@Param('id', ParseIntPipe) id: number) {
        return this.productsClient.send({ cmd: 'findOneProduct' }, { id }).pipe(
            catchError(err => { throw new RpcException(err)})
        )
    }

    @Delete(':id')
    deleteProduct(@Param('id', ParseIntPipe) id: number) {
        return this.productsClient.send({ cmd: 'deleteProduct' }, { id }).pipe(
            catchError(err => { throw new RpcException(err)})
        )
    }

    @Patch(':id')
    updateProduct(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
        return this.productsClient.send({ cmd: 'updateProduct' }, { id, ...updateProductDto }).pipe(
            catchError(err => { throw new RpcException(err)})
        )
    }
}
