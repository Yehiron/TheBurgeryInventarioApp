package com.theburgery.backend.service;

import com.theburgery.backend.entity.Recipe;
import com.theburgery.backend.repository.RecipeRepository;
import com.theburgery.backend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecipeService {
    private final RecipeRepository repository;

    public List<Recipe> findAll() { return repository.findAll(); }
    public Recipe findById(Long id) { return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Recipe not found")); }
    public Recipe save(Recipe entity) { return repository.save(entity); }
    public Recipe update(Long id, Recipe entity) {
        Recipe existing = findById(id);
        entity.setId(id);
        if(entity.getIngredients() != null) {
             entity.getIngredients().forEach(item -> item.setRecipe(entity));
        }
        return repository.save(entity);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Recipe not found");
        repository.deleteById(id);
    }
}
