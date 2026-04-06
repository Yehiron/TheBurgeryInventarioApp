package com.theburgery.backend.controller;

import com.theburgery.backend.entity.Category;
import com.theburgery.backend.service.CategoryService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService service;

    @GetMapping
    public List<Category> getAll() { return service.findAll(); }
    @GetMapping("/{id}")
    public Category getById(@PathVariable Long id) { return service.findById(id); }
    @PostMapping
    public Category create(@Valid @RequestBody Category entity) {
        return service.save(entity); }
    @PutMapping("/{id}")
    public Category update(@PathVariable Long id, @Valid @RequestBody Category entity) { return service.update(id, entity); }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
