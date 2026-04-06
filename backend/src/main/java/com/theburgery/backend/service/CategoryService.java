package com.theburgery.backend.service;

import com.theburgery.backend.entity.Category;
import com.theburgery.backend.repository.CategoryRepository;
import com.theburgery.backend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository repository;

    public List<Category> findAll() { return repository.findAll(); }
    public Category findById(Long id) { return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found")); }
    public Category save(Category entity) { return repository.save(entity); }
    public Category update(Long id, Category entity) {
        Category existing = findById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Category not found");
        repository.deleteById(id);
    }
}
