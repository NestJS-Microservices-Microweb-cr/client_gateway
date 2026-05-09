import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "../../common";
import { OrderStatus, OrderStatusList } from "../enum/order.enum";

export class OrderPaginationDto extends PaginationDto {
    @IsOptional()
    @IsEnum(OrderStatusList, {
        message: `Únicos valores acptados: ${OrderStatusList}`
    })
    status?: OrderStatus
}
