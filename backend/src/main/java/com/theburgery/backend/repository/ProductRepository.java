package com.theburgery.backend.repository;

import com.theburgery.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    java.util.List<Product> findByCategoryId(Long categoryId);
    java.util.List<Product> findBySupplierId(Long supplierId);
}
