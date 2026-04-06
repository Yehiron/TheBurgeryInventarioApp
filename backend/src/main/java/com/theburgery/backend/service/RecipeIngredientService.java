package com.theburgery.backend.service;

import com.theburgery.backend.entity.RecipeIngredient;
import com.theburgery.backend.repository.RecipeIngredientRepository;
import com.theburgery.backend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecipeIngredientService {
    private final RecipeIngredientRepository repository;

    public List<RecipeIngredient> findAll() { return repository.findAll(); }
    public RecipeIngredient findById(Long id) { return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("RecipeIngredient not found")); }
    public RecipeIngredient save(RecipeIngredient entity) { return repository.save(entity); }
    public RecipeIngredient update(Long id, RecipeIngredient entity) {
        RecipeIngredient existing = findById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("RecipeIngredient not found");
        repository.deleteById(id);
    }
}
