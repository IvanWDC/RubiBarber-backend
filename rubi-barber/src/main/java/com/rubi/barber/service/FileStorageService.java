package com.rubi.barber.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String storeFile(MultipartFile file, Long userId) throws IOException {
        // Crear el directorio si no existe
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        // Generar nombre único para el archivo
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String fileName = "profile_" + userId + "_" + UUID.randomUUID().toString() + fileExtension;

        // Validar el archivo
        if (file.isEmpty()) {
            throw new IOException("No se puede guardar un archivo vacío");
        }
        if (fileName.contains("..")) {
            throw new IOException("Nombre de archivo inválido");
        }

        // Guardar el archivo
        Path targetLocation = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        // Retornar la ruta relativa para almacenar en la base de datos
        return "/uploads/" + fileName;
    }

    public void deleteFile(String fileUrl) throws IOException {
        if (fileUrl != null && fileUrl.startsWith("/uploads/")) {
            Path filePath = Paths.get(uploadDir).resolve(fileUrl.substring("/uploads/".length()));
            Files.deleteIfExists(filePath);
        }
    }
} 