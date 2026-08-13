package com.udaykiran.ecommerce.controller;

import com.udaykiran.ecommerce.dto.OrderStatusRequest;
import com.udaykiran.ecommerce.entity.Order;
import com.udaykiran.ecommerce.entity.User;
import com.udaykiran.ecommerce.repository.UserRepository;
import com.udaykiran.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @PostMapping("/api/orders")
    public Order placeOrder(@AuthenticationPrincipal UserDetails principal) {
        User user = currentUser(principal);
        return orderService.placeOrder(user);
    }

    @GetMapping("/api/orders")
    public List<Order> myOrders(@AuthenticationPrincipal UserDetails principal) {
        User user = currentUser(principal);
        return orderService.getOrdersForUser(user);
    }

    @GetMapping("/api/admin/orders")
    public List<Order> allOrders() {
        return orderService.getAllOrders();
    }

    @PatchMapping("/api/admin/orders/{id}/status")
    public Order updateStatus(@PathVariable Long id, @Valid @RequestBody OrderStatusRequest request) {
        return orderService.updateStatus(id, request.getStatus());
    }

    private User currentUser(UserDetails principal) {
        return userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
