package com.theburgery.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name="ingredients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ingredient {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    private String nombre;
    @NotBlank @Column(name="unidad_medida")
    private String unidadMedida;
    @ManyToOne @JoinColumn(name="category_id")
    private Category category;
    @ManyToOne @JoinColumn(name="supplier_id")
    private Supplier supplier;
}
