package com.theburgery.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name="recipes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Recipe {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    private String nombre;
    private String descripcion;
    @OneToMany(mappedBy="recipe", cascade=CascadeType.ALL, orphanRemoval=true)
    private java.util.List<RecipeIngredient> ingredients;
}
