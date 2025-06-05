package com.rubi.barber.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender emailSender;

    public void enviarEmailRecuperacion(String to, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@rubibarber.com");
            message.setTo(to);
            message.setSubject("Recuperación de Contraseña - Rubí Barber");
            
            String emailContent = String.format(
                "Estimado cliente de Rubí Barber,\n\n" +
                "Hemos recibido una solicitud para restablecer tu contraseña. " +
                "Para proceder con el cambio, por favor haz clic en el siguiente enlace:\n\n" +
                "http://localhost:5173/reset-password?token=%s\n\n" +
                "Este enlace es válido por 24 horas por motivos de seguridad.\n\n" +
                "Si no solicitaste este cambio, por favor ignora este mensaje y tu contraseña permanecerá sin cambios.\n\n" +
                "Saludos cordiales,\n" +
                "El equipo de Rubí Barber", token);
            
            message.setText(emailContent);
            
            emailSender.send(message);
            logger.info("Email de recuperación enviado exitosamente a: {}", to);
        } catch (Exception e) {
            logger.error("Error al enviar email de recuperación a: " + to, e);
            throw new RuntimeException("Error al enviar el email de recuperación", e);
        }
    }
} 