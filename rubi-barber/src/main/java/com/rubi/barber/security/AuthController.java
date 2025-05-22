package com.rubi.barber.security;

import com.rubi.barber.model.Usuario;
import com.rubi.barber.model.Rol;
import com.rubi.barber.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
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

            String token = jwtService.generateToken(usuario.getEmail());

            AuthResponse response = new AuthResponse(token, usuario.getRol().name());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println(">>> Error en autenticación: " + e.getMessage());
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Usuario> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ResponseEntity.ok(usuario);
    }
}
