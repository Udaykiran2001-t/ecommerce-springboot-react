package com.udaykiran.ecommerce.repository;

import com.udaykiran.ecommerce.entity.Order;
import com.udaykiran.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
}
