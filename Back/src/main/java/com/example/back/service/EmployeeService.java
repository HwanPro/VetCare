package com.example.back.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.back.Util.PasswordUtils;
import com.example.back.entity.Employee;
import com.example.back.entity.Rol;
import com.example.back.entity.User;
import com.example.back.repository.EmployeeRepository;
import com.example.back.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.back.repository.RolRepository;


@Service
public class EmployeeService {
    
    @Autowired
    UserRepository userRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    RolRepository rolRepository;

    
    // Obtener empleado por ID
    public Optional<Employee> getEmployee(Long id) {
        return employeeRepository.findById(id);
    }

    // Actualizar empleado
    public void updateEmployee(Employee updatedEmployee) {
        Optional<Employee> existingEmployeeOpt = employeeRepository.findById(updatedEmployee.getIdEmployee());
    
        if (existingEmployeeOpt.isPresent()) {
            Employee existingEmployee = existingEmployeeOpt.get();
    
            // Actualiza los campos necesarios
            existingEmployee.setDni(updatedEmployee.getDni());
            existingEmployee.setCmvp(updatedEmployee.getCmvp());
            existingEmployee.setFirstName(updatedEmployee.getFirstName());
            existingEmployee.setPreName(updatedEmployee.getPreName());
            existingEmployee.setFirstLastName(updatedEmployee.getFirstLastName());
            existingEmployee.setSecondLastName(updatedEmployee.getSecondLastName());
            existingEmployee.setAddress(updatedEmployee.getAddress());
            existingEmployee.setCellphone(updatedEmployee.getCellphone());
            existingEmployee.setDirImage(updatedEmployee.getDirImage());
            existingEmployee.setStatus(updatedEmployee.getStatus());
    
            // Actualiza la relación con Rol si es proporcionada
            if (updatedEmployee.getRol() != null) {
                existingEmployee.setRol(updatedEmployee.getRol());
            }
    
            // Actualiza la relación con User si es proporcionada
            if (updatedEmployee.getUser() != null) {
                existingEmployee.setUser(updatedEmployee.getUser());
            }
    
            // Guarda los cambios en la base de datos
            employeeRepository.save(existingEmployee);
        } else {
            throw new IllegalArgumentException("El empleado con el ID proporcionado no existe.");
        }
    }    

    // Buscar empleados
    public Page<Employee> searchEmployees(String dni, String name, String role, Character status, Pageable pageable) {
        return employeeRepository.searchEmployees(dni, status, role, name, pageable);
    }

    // Bloquear empleado
    public boolean blockEmployee(Long employeeId) {
        int rowsUpdated = employeeRepository.blockEmployee(employeeId);
        return rowsUpdated > 0;
    }

    // Eliminar empleado
    public void delete(Long id) {
        employeeRepository.deleteById(id);
    }

    // Crear empleado con usuario
@Transactional
public Employee createEmployeeWithUser(Employee employee) {
    // Validar y guardar el usuario
    if (employee.getUser() != null) {
        User user = employee.getUser();

        // Encriptar la contraseña antes de guardar
        if (user.getPassword() != null) {
            String encryptedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encryptedPassword);
        }

        // Guardar el usuario
        User savedUser = userRepository.save(user);
        employee.setUser(savedUser);
    }

    // Validar y asignar el rol
    if (employee.getRol() != null && employee.getRol().getIdRol() != null) {
        Optional<Rol> rolOpt = rolRepository.findById(employee.getRol().getIdRol());
        if (rolOpt.isEmpty()) {
            throw new IllegalArgumentException("El rol proporcionado no es válido.");
        }
        employee.setRol(rolOpt.get());
    } else {
        throw new IllegalArgumentException("El rol del empleado es obligatorio.");
    }

    // Guardar el empleado
    return employeeRepository.save(employee);
}


    public boolean dniExists(String dni) {
        return employeeRepository.existsByDni(dni);
    }

    public boolean cellphoneExists(String cellphone) {
        return employeeRepository.existsByCellphone(cellphone);
    }

    public boolean cmvpExists(String cmvp) {
        return employeeRepository.existsByCmvp(cmvp);
    }

    public boolean cellphoneExistsExcludingId(String cellphone, Long id) {
        return employeeRepository.existsByCellphoneAndNotId(cellphone, id);
    }
    
    public boolean cmvpExistsExcludingId(String cmvp, Long id) {
        return employeeRepository.existsByCmvpAndNotId(cmvp, id);
    }
    

}
