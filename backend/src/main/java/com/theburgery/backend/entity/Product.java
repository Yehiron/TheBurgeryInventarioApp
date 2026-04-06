package com.theburgery.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name="products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    private String nombre;
    @NotBlank @Column(name="unidad_compra")
    private String unidadCompra;
    @Column(name="precio_estimado")
    private java.math.BigDecimal precioEstimado;
    private Boolean activo;
    @ManyToOne @JoinColumn(name="category_id")
    private Category category;
    @ManyToOne @JoinColumn(name="supplier_id")
    private Supplier supplier;
}
