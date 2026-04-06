package com.theburgery.backend.service;

import com.theburgery.backend.entity.Supplier;
import com.theburgery.backend.repository.SupplierRepository;
import com.theburgery.backend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {
    private final SupplierRepository repository;

    public List<Supplier> findAll() { return repository.findAll(); }
    public Supplier findById(Long id) { return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Supplier not found")); }
    public Supplier save(Supplier entity) { return repository.save(entity); }
    public Supplier update(Long id, Supplier entity) {
        Supplier existing = findById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Supplier not found");
        repository.deleteById(id);
    }
}
