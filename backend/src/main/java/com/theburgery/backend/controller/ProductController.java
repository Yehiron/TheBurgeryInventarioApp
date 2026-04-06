package com.theburgery.backend.controller;

import com.theburgery.backend.entity.Product;
import com.theburgery.backend.service.ProductService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService service;

    @GetMapping
    public List<Product> getAll() { return service.findAll(); }
    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) { return service.findById(id); }
    @PostMapping
    public Product create(@Valid @RequestBody Product entity) {
        return service.save(entity); }
    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @Valid @RequestBody Product entity) { return service.update(id, entity); }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
