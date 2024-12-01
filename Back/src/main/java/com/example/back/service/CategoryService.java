package com.example.back.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.back.entity.Category;
import com.example.back.repository.CategoryRepository;

@Service
public class CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> searchCategoriesByName(String name) {
        return categoryRepository.findByNameContainingIgnoreCase(name);
    }

    // Crear una nueva categoría
    public Category createCategory(Category category) {
        category.setStatus('1'); // Aseguramos que la categoría se cree como activa
        return categoryRepository.save(category);
    }

    // Actualizar una categoría existente
    public Category updateCategory(Long idCategory, Category updatedCategory) {
        Optional<Category> categoryOpt = categoryRepository.findById(idCategory);
        if (categoryOpt.isEmpty()) {
            throw new RuntimeException("Categoría no encontrada");
        }
        Category category = categoryOpt.get();
        category.setName(updatedCategory.getName());
        category.setTimeSpan(updatedCategory.getTimeSpan());
        category.setCapacity(updatedCategory.getCapacity());
        return categoryRepository.save(category);
    }

    // Listar categorías activas con paginación
    public Page<Category> listActiveCategories(Pageable pageable) {
        return categoryRepository.findByStatus('1', pageable);
    }

    // Bloquear una categoría (cambiar status a '0')
    public void blockCategory(Long idCategory) {
        Optional<Category> categoryOpt = categoryRepository.findById(idCategory);
        if (categoryOpt.isEmpty()) {
            throw new RuntimeException("Categoría no encontrada");
        }
        Category category = categoryOpt.get();
        category.setStatus('0'); // Cambia el estado a inactivo
        categoryRepository.save(category);
    }

     // Obtener una categoría por ID
     public Category getCategoryById(Long idCategory) {
        Optional<Category> categoryOpt = categoryRepository.findById(idCategory);
        if (categoryOpt.isEmpty()) {
            throw new RuntimeException("Categoría no encontrada");
        }
        return categoryOpt.get();
    }
}
