package com.rubi.barber.controller;

import com.rubi.barber.model.PasswordResetToken;
import com.rubi.barber.model.Usuario;
import com.rubi.barber.repository.PasswordResetTokenRepository;
import com.rubi.barber.repository.UsuarioRepository;
import com.rubi.barber.service.EmailService;
import com.rubi.barber.service.PasswordResetService;
import com.rubi.barber.dto.EmailRequest;
import com.rubi.barber.dto.ResetPasswordRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class PasswordResetController {

    private static final Logger logger = LoggerFactory.getLogger(PasswordResetController.class);

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> solicitarRecuperacion(@RequestBody EmailRequest request) {
        String email = request.getEmail();
        logger.info("Solicitud de recuperación de contraseña recibida en controlador. Email: {}", email);
        try {
            passwordResetService.solicitarRecuperacion(email);
            return ResponseEntity.ok().body("Si el email existe, recibirás un enlace de recuperación.");
        } catch (Exception e) {
            logger.error("Error al procesar solicitud de recuperación en controlador para email: {}", email, e);
            return ResponseEntity.internalServerError().body("Error interno al procesar la solicitud.");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> restablecerPassword(
            @RequestParam String token,
            @RequestBody ResetPasswordRequest request) {

        logger.info("Solicitud de restablecimiento de contraseña recibida.");
        logger.info("Token: {}", token);
        logger.info("Nueva contraseña (parcial): {}", request.getPassword() != null ? request.getPassword().substring(0, Math.min(request.getPassword().length(), 5)) + "..." : "null");
        logger.info("Confirmación de contraseña (parcial): {}", request.getConfirmPassword() != null ? request.getConfirmPassword().substring(0, Math.min(request.getConfirmPassword().length(), 5)) + "..." : "null");

        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElse(null);

        if (resetToken == null) {
            logger.warn("Token no encontrado: {}", token);
        } else {
            logger.info("Token encontrado. Expirado: {}, Usado: {}", resetToken.isExpirado(), resetToken.isUsado());
        }

        if (resetToken == null || resetToken.isExpirado() || resetToken.isUsado()) {
            return ResponseEntity.badRequest().body("Token inválido o expirado.");
        }

        Usuario usuario = resetToken.getUsuario();
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        logger.info("Contraseña codificada y lista para guardar para usuario: {}", usuario.getId());
        usuarioRepository.save(usuario);

        resetToken.setUsado(true);
        tokenRepository.save(resetToken);

        return ResponseEntity.ok().body("Contraseña actualizada correctamente.");
    }

    @GetMapping("/validate-token")
    public ResponseEntity<?> validarToken(@RequestParam String token) {
        logger.info("Solicitud de validación de token: {}", token);
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElse(null);

        if (resetToken == null || resetToken.isExpirado() || resetToken.isUsado()) {
            logger.warn("Token inválido o expirado: {}", token);
            return ResponseEntity.badRequest().body("Token inválido o expirado.");
        }

        logger.info("Token válido: {}", token);
        return ResponseEntity.ok().body("Token válido.");
    }
} 