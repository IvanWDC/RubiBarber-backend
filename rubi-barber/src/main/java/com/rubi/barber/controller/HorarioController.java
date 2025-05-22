package com.rubi.barber.controller;

import com.rubi.barber.model.Horario;
import com.rubi.barber.model.Cita;
import com.rubi.barber.repository.HorarioRepository;
import com.rubi.barber.repository.CitaRepository;
import com.rubi.barber.repository.PeluqueroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/horarios")
@CrossOrigin(origins = "*")
public class HorarioController {

    @Autowired
    private HorarioRepository horarioRepository;

    @Autowired
    private CitaRepository citaRepository;

    @Autowired
    private PeluqueroRepository peluqueroRepository;

    @GetMapping
    public List<Horario> getAll() {
        return horarioRepository.findAll();
    }

    @GetMapping("/peluquero/{peluqueroId}")
    public ResponseEntity<?> getHorariosDisponibles(
            @PathVariable Long peluqueroId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        
        if (!peluqueroRepository.existsById(peluqueroId)) {
            return ResponseEntity.notFound().build();
        }

        // Obtener horario base del peluquero
        Horario horarioBase = horarioRepository.findByPeluqueroId(peluqueroId)
                .orElse(new Horario(LocalTime.of(9, 0), LocalTime.of(20, 0))); // Horario por defecto

        // Obtener citas existentes del peluquero para esa fecha
        LocalDateTime inicioDia = fecha.atStartOfDay();
        LocalDateTime finDia = fecha.atTime(23, 59, 59);
        List<Cita> citasExistentes = citaRepository.findByPeluqueroIdAndFechaHoraBetween(
                peluqueroId, inicioDia, finDia);

        // Generar slots de 30 minutos
        List<LocalDateTime> slotsDisponibles = new ArrayList<>();
        LocalDateTime finJornada = fecha.atTime(horarioBase.getHoraFin());

        for (LocalDateTime currentSlot = fecha.atTime(horarioBase.getHoraInicio());
             currentSlot.isBefore(finJornada);
             currentSlot = currentSlot.plusMinutes(30)) {
            
            final LocalDateTime slot = currentSlot; // Variable efectivamente final para el lambda
            boolean slotDisponible = citasExistentes.stream()
                    .noneMatch(cita -> {
                        LocalDateTime inicioCita = cita.getFechaHora();
                        LocalDateTime finCita = inicioCita.plusMinutes(cita.getServicio().getDuracion());
                        return !slot.isBefore(inicioCita) && !slot.isAfter(finCita);
                    });

            if (slotDisponible) {
                slotsDisponibles.add(slot);
            }
        }

        return ResponseEntity.ok(slotsDisponibles);
    }

    @PostMapping
    public Horario create(@RequestBody Horario horario) {
        return horarioRepository.save(horario);
    }
}
