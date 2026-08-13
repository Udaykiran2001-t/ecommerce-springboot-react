package com.udaykiran.ecommerce.service;

import com.udaykiran.ecommerce.dto.CartItemRequest;
import com.udaykiran.ecommerce.entity.CartItem;
import com.udaykiran.ecommerce.entity.Product;
import com.udaykiran.ecommerce.entity.User;
import com.udaykiran.ecommerce.repository.CartItemRepository;
import com.udaykiran.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public List<CartItem> getCart(User user) {
        return cartItemRepository.findByUser(user);
    }

    public CartItem addToCart(User user, CartItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return cartItemRepository.findByUserAndProductId(user, product.getId())
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + request.getQuantity());
                    return cartItemRepository.save(existing);
                })
                .orElseGet(() -> {
                    CartItem item = new CartItem();
                    item.setUser(user);
                    item.setProduct(product);
                    item.setQuantity(request.getQuantity());
                    return cartItemRepository.save(item);
                });
    }

    public CartItem updateQuantity(Long itemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    public void removeItem(Long itemId) {
        cartItemRepository.deleteById(itemId);
    }

    public void clearCart(User user) {
        cartItemRepository.deleteByUser(user);
    }
}
