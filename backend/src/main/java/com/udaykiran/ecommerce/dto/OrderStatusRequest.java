package com.udaykiran.ecommerce.dto;

import com.udaykiran.ecommerce.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderStatusRequest {

    @NotNull
    private OrderStatus status;
}
