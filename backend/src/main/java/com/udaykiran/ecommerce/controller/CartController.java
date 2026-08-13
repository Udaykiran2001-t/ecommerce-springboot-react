package com.udaykiran.ecommerce.controller;

import com.udaykiran.ecommerce.dto.CartItemRequest;
import com.udaykiran.ecommerce.entity.CartItem;
import com.udaykiran.ecommerce.entity.User;
import com.udaykiran.ecommerce.repository.UserRepository;
import com.udaykiran.ecommerce.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    @GetMapping
    public List<CartItem> getCart(@AuthenticationPrincipal UserDetails principal) {
        User user = currentUser(principal);
        return cartService.getCart(user);
    }

    @PostMapping
    public CartItem addToCart(@AuthenticationPrincipal UserDetails principal,
                               @Valid @RequestBody CartItemRequest request) {
        User user = currentUser(principal);
        return cartService.addToCart(user, request);
    }

    @PutMapping("/{itemId}")
    public CartItem updateQuantity(@PathVariable Long itemId, @RequestParam Integer quantity) {
        return cartService.updateQuantity(itemId, quantity);
    }

    @DeleteMapping("/{itemId}")
    public void removeItem(@PathVariable Long itemId) {
        cartService.removeItem(itemId);
    }

    private User currentUser(UserDetails principal) {
        return userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
