package com.rubi.barber.service;

import com.rubi.barber.model.PasswordResetToken;
import com.rubi.barber.model.Usuario;
import com.rubi.barber.repository.PasswordResetTokenRepository;
import com.rubi.barber.repository.UsuarioRepository;
import com.rubi.barber.dto.EmailRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;
import java.time.LocalDateTime;

@Service
public class PasswordResetService {

    private static final Logger logger = LoggerFactory.getLogger(PasswordResetService.class);

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Transactional
    public void solicitarRecuperacion(String email) {
        logger.info("Servicio de recuperación de contraseña: solicitud para email {}", email);
        String cleanedEmail = email != null ? email.trim().toLowerCase() : null;

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(cleanedEmail);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            logger.info("Usuario encontrado: {}", usuario.getEmail());

            // Buscar y eliminar token anterior si existe
            Optional<PasswordResetToken> existingTokenOpt = tokenRepository.findByUsuarioId(usuario.getId());
            if (existingTokenOpt.isPresent()) {
                logger.info("Eliminando token anterior para usuario: {}", usuario.getId());
                tokenRepository.delete(existingTokenOpt.get());
                tokenRepository.flush();
            }

            // Crear nuevo token
            logger.info("Creando nuevo token para usuario: {}", usuario.getId());
            String token = UUID.randomUUID().toString();
            
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(token);
            resetToken.setUsuario(usuario);
            resetToken.setExpiryDate(LocalDateTime.now().plusHours(24));
            resetToken.setUsado(false);

            tokenRepository.save(resetToken);

            // Enviar email
            logger.info("Enviando email de recuperación a: {}", usuario.getEmail());
            emailService.enviarEmailRecuperacion(usuario.getEmail(), token);

            logger.info("Email de recuperación procesado para: {}", usuario.getEmail());

        } else {
            logger.warn("Usuario no encontrado para email: {}", email);
            // Considerar si enviar un email genérico aquí para no revelar si el email existe
            // Por ahora, no hacemos nada si el usuario no existe para evitar enumeración de usuarios
        }
    }

    // Aquí se podrían añadir otros métodos relacionados con el restablecimiento de contraseña, como validar token o restablecer la contraseña.
} 