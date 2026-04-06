package com.theburgery.backend.controller;

import com.theburgery.backend.entity.Recipe;
import com.theburgery.backend.service.RecipeService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {
    private final RecipeService service;

    @GetMapping
    public List<Recipe> getAll() { return service.findAll(); }
    @GetMapping("/{id}")
    public Recipe getById(@PathVariable Long id) { return service.findById(id); }
    @PostMapping
    public Recipe create(@Valid @RequestBody Recipe entity) {
        if(entity.getIngredients() != null) {
             entity.getIngredients().forEach(item -> item.setRecipe(entity));
        }
        return service.save(entity); }
    @PutMapping("/{id}")
    public Recipe update(@PathVariable Long id, @Valid @RequestBody Recipe entity) { return service.update(id, entity); }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
