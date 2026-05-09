import { catchError } from 'rxjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Controller, Get, Post, Body, Param, Inject, Query, Patch, ParseUUIDPipe } from '@nestjs/common';

import { ORDER_SERVICE } from '../config';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';

@Controller('orders')
export class OrderController {
    constructor(
        @Inject(ORDER_SERVICE) private readonly orderClient: ClientProxy,
    ) {}

    @Post()
    create(@Body() createOrderDto: CreateOrderDto) {
        return this.orderClient.send('createOrder', createOrderDto)
    }

    @Get()
    findAll(@Query() orderPaginationDto: OrderPaginationDto) {
        return this.orderClient.send('findAllOrders', orderPaginationDto)
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.orderClient.send('findOneOrder', { id }).pipe(
            catchError(err => { throw new RpcException(err) })
        )
    }

    @Patch(':id')
    changeStatus(@Param('id', ParseUUIDPipe) id: string, @Body() statusDto: StatusDto) {
        return this.orderClient.send('changeOrderStatus', { id, status: statusDto.status }).pipe(
            catchError(err => { throw new RpcException(err)})
        )
    }
}
