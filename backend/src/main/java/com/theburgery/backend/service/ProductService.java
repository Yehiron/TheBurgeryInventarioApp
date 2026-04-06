package com.theburgery.backend.service;

import com.theburgery.backend.entity.Product;
import com.theburgery.backend.repository.ProductRepository;
import com.theburgery.backend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository repository;

    public List<Product> findAll() { return repository.findAll(); }
    public Product findById(Long id) { return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found")); }
    public Product save(Product entity) { return repository.save(entity); }
    public Product update(Long id, Product entity) {
        Product existing = findById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Product not found");
        repository.deleteById(id);
    }
}
