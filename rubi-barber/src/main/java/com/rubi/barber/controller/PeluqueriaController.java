package com.rubi.barber.controller;

import com.rubi.barber.model.Peluqueria;
import com.rubi.barber.model.Peluquero;
import com.rubi.barber.model.Servicio;
import com.rubi.barber.repository.PeluqueriaRepository;
import com.rubi.barber.repository.PeluqueroRepository;
import com.rubi.barber.repository.ServicioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/peluquerias")
@CrossOrigin(origins = "*")
public class PeluqueriaController {

    @Autowired
    private PeluqueriaRepository peluqueriaRepository;

    @Autowired
    private PeluqueroRepository peluqueroRepository;

    @Autowired
    private ServicioRepository servicioRepository;

    // Obtener todas las peluquerías
    @GetMapping
    public List<Peluqueria> getAll() {
        return peluqueriaRepository.findAll();
    }

    // Nuevo endpoint para obtener una peluquería por ID
    @GetMapping("/{id}")
    public ResponseEntity<Peluqueria> getById(@PathVariable Long id) {
        Optional<Peluqueria> peluqueria = peluqueriaRepository.findById(id);
        if (peluqueria.isPresent()) {
            // TODO: Asegurarse de que la peluquería devuelta incluya los servicios asociados si es necesario para el frontend (ej. en la entidad Peluqueria con @ManyToMany o @OneToMany y fetch EAGER o consulta específica).
            return ResponseEntity.ok(peluqueria.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Obtener peluqueros por peluquería
    @GetMapping("/{peluqueriaId}/peluqueros")
    public ResponseEntity<?> getPeluquerosByPeluqueria(@PathVariable Long peluqueriaId) {
        if (!peluqueriaRepository.existsById(peluqueriaId)) {
            return ResponseEntity.notFound().build();
        }
        List<Peluquero> peluqueros = peluqueroRepository.findByPeluqueriaId(peluqueriaId);
        return ResponseEntity.ok(peluqueros);
    }

    // 1. Obtener peluquerías activas cercanas
    @GetMapping("/cercanas")
    public List<Peluqueria> obtenerPeluqueriasCercanas(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "10") double radio // km
    ) {
        return peluqueriaRepository.findCercanas(lat, lng, radio);
    }

    // 2. Obtener peluquerías que ofrecen un servicio concreto
    @GetMapping("/por-servicio/{idServicio}")
    public List<Peluqueria> obtenerPeluqueriasPorServicio(@PathVariable Long idServicio) {
        Servicio servicio = servicioRepository.findById(idServicio).orElse(null);
        if (servicio == null) return List.of();

        return peluqueriaRepository.findByActivoTrue().stream()
                .filter(peluqueria -> peluqueria.getPeluqueros().stream()
                        .anyMatch(p -> p.isActivo() &&
                                p.getServicios().stream().anyMatch(s -> s.getId().equals(idServicio))))
                .collect(Collectors.toList());
    }
}
