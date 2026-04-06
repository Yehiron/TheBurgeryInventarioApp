package com.theburgery.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name="recipe_ingredients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeIngredient {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name="recipe_id") @com.fasterxml.jackson.annotation.JsonIgnore
    private Recipe recipe;
    @ManyToOne @JoinColumn(name="ingredient_id")
    private Ingredient ingredient;
    @Column(name="cantidad_requerida")
    private java.math.BigDecimal cantidadRequerida;
}
