package com.rubi.barber.security;

import com.rubi.barber.model.Usuario;
import com.rubi.barber.model.Rol;
import com.rubi.barber.model.Peluqueria;
import com.rubi.barber.repository.UsuarioRepository;
import com.rubi.barber.repository.PeluqueriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PeluqueriaRepository peluqueriaRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Validaciones básicas
        if (request.getNombre() == null || request.getNombre().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El nombre no puede estar vacío.");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El email no puede estar vacío.");
        }
        // Validación básica de formato de email (puede ser más compleja con regex si es necesario)
        if (!request.getEmail().contains("@")) {
             return ResponseEntity.badRequest().body("Formato de email inválido.");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("La contraseña no puede estar vacía.");
        }
        // Validación de longitud mínima de contraseña
         if (request.getPassword().length() < 6) { // Ejemplo: mínimo 6 caracteres
             return ResponseEntity.badRequest().body("La contraseña debe tener al menos 6 caracteres.");
         }

        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email ya registrado.");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(request.getRol());
        usuario.setActivo(true);

        usuarioRepository.save(usuario);

        return ResponseEntity.ok("Usuario registrado correctamente.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            System.out.println(">>> Intentando autenticar:");
            System.out.println("   Email: " + request.getEmail());
            System.out.println("   Password: " + request.getPassword());

            Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            System.out.println(">>> Comparación manual de contraseña:");
            System.out.println("    Entrada: " + request.getPassword());
            System.out.println("    Hash BD: " + usuario.getPassword());
            boolean match = passwordEncoder.matches(request.getPassword(), usuario.getPassword());
            System.out.println("    ¿Coincide?: " + match);

            if (!match) {
                return ResponseEntity.status(401).body("Credenciales inválidas (comparación manual)");
            }

            // Si pasa la comparación manual, intenta autenticar de forma formal con Spring Security
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            System.out.println(">>> Usuario autenticado correctamente.");

            String token = jwtService.generateToken(usuario);

            // Buscar la peluquería si el rol es ADMIN
            Peluqueria peluqueria = null;
            if (usuario.getRol().name().equals(Rol.ADMIN.name()) || usuario.getRol().name().equals(Rol.BACKEND_ADMIN.name())) {
                 // Asumiendo que la relación Usuario -> Peluqueria está bien mapeada
                 // Puedes usar el método findByUsuario que añadimos en PeluqueriaRepository
                 Optional<Peluqueria> peluqueriaOpt = peluqueriaRepository.findByUsuario(usuario);
                 if(peluqueriaOpt.isPresent()) {
                     peluqueria = peluqueriaOpt.get();
                 }
            }

            AuthResponse response = new AuthResponse(
                token,
                usuario.getRol().name(),
                usuario.getId(),
                usuario.getEmail(),
                usuario.getNombre(),
                peluqueria
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println(">>> Error en autenticación: " + e.getMessage());
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }

        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ResponseEntity.ok(usuario);
    }
}
