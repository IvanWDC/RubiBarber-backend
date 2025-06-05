package com.rubi.barber.controller;

import com.rubi.barber.model.Usuario;
import com.rubi.barber.repository.UsuarioRepository;
import com.rubi.barber.service.FileStorageService;
import com.rubi.barber.security.JwtService;
import com.rubi.barber.security.JwtResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*") // para permitir peticiones desde cualquier frontend
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private JwtService jwtService;

    // Directorio donde se guardarán las imágenes de perfil (configurar en application.properties o similar en un proyecto real)
    private final Path rootLocation = Paths.get("uploads/profile-images");

    public UsuarioController() {
        // Crear el directorio si no existe al iniciar el controlador
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage", e);
        }
    }

    // Obtener todos los usuarios
    @GetMapping
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    // Crear nuevo usuario
    @PostMapping
    public Usuario createUsuario(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // Obtener un usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable Long id) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isPresent()) {
            return ResponseEntity.ok(usuarioOpt.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUsuario(@PathVariable Long id) {
        if (!usuarioRepository.existsById(id)) {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }
        usuarioRepository.deleteById(id);
        return ResponseEntity.ok().body("Usuario eliminado");
    }

    // Actualizar usuario (para perfil)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUsuario(
            @PathVariable Long id,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String password,
            @RequestParam(required = false) MultipartFile imagen,
            @RequestParam(required = false) String eliminarImagen
    ) {
        try {
            Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
            if (!usuarioOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Usuario usuario = usuarioOpt.get();
            boolean emailHaCambiado = false;

            // Actualizar campos si se proporcionan
            if (nombre != null) usuario.setNombre(nombre);
            if (email != null && !email.equals(usuario.getEmail())) {
                // Verificar si el nuevo email ya está en uso
                if (usuarioRepository.findByEmail(email).isPresent()) {
                    return ResponseEntity.badRequest().body("El email ya está en uso");
                }
                emailHaCambiado = true;
                usuario.setEmail(email);
            }
            if (password != null && !password.isEmpty()) {
                usuario.setPassword(passwordEncoder.encode(password));
            }
            if (imagen != null && !imagen.isEmpty()) {
                String imagenUrl = fileStorageService.storeFile(imagen, usuario.getId());
                usuario.setImagenPerfilUrl(imagenUrl);
            }

            // Handle image removal
            if ("true".equals(eliminarImagen) && usuario.getImagenPerfilUrl() != null) {
                // TODO: Implement file deletion in FileStorageService
                fileStorageService.deleteFile(usuario.getImagenPerfilUrl()); 
                usuario.setImagenPerfilUrl(null); // Set URL to null in DB
            }

            Usuario usuarioActualizado = usuarioRepository.save(usuario);

            // Si el email cambió, devolver nuevo token
            if (emailHaCambiado) {
                String nuevoToken = jwtService.generateToken(usuarioActualizado);
                return ResponseEntity.ok(new JwtResponse(nuevoToken));
            }

            // Si no cambió el email, devolver los datos del usuario actualizado incluyendo imagenPerfilUrl
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("id", usuarioActualizado.getId());
            responseBody.put("nombre", usuarioActualizado.getNombre());
            responseBody.put("email", usuarioActualizado.getEmail());
            responseBody.put("rol", usuarioActualizado.getRol());
            responseBody.put("activo", usuarioActualizado.isActivo());
            responseBody.put("imagenPerfilUrl", usuarioActualizado.getImagenPerfilUrl()); // Explicitly include
            // Include other relevant fields if necessary, based on what the frontend expects in userData

            return ResponseEntity.ok(responseBody);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar el usuario: " + e.getMessage());
        }
    }

    // Verificar si un email existe
    @GetMapping("/verificar-email/{email}")
    public ResponseEntity<Map<String, Boolean>> verificarEmail(@PathVariable String email) {
        boolean exists = usuarioRepository.findByEmail(email).isPresent();
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }
}
