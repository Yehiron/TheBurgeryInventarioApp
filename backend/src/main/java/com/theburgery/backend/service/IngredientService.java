package com.theburgery.backend.service;

import com.theburgery.backend.entity.Ingredient;
import com.theburgery.backend.repository.IngredientRepository;
import com.theburgery.backend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IngredientService {
    private final IngredientRepository repository;

    public List<Ingredient> findAll() { return repository.findAll(); }
    public Ingredient findById(Long id) { return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Ingredient not found")); }
    public Ingredient save(Ingredient entity) { return repository.save(entity); }
    public Ingredient update(Long id, Ingredient entity) {
        Ingredient existing = findById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Ingredient not found");
        repository.deleteById(id);
    }
}
