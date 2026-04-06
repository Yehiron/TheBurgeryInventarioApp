package com.theburgery.backend.controller;

import com.theburgery.backend.entity.Ingredient;
import com.theburgery.backend.service.IngredientService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ingredients")
@RequiredArgsConstructor
public class IngredientController {
    private final IngredientService service;

    @GetMapping
    public List<Ingredient> getAll() { return service.findAll(); }
    @GetMapping("/{id}")
    public Ingredient getById(@PathVariable Long id) { return service.findById(id); }
    @PostMapping
    public Ingredient create(@Valid @RequestBody Ingredient entity) {
        return service.save(entity); }
    @PutMapping("/{id}")
    public Ingredient update(@PathVariable Long id, @Valid @RequestBody Ingredient entity) { return service.update(id, entity); }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
