package com.rubi.barber.controller;

import com.rubi.barber.model.Horario;
import com.rubi.barber.model.Cita;
import com.rubi.barber.model.Servicio;
import com.rubi.barber.repository.HorarioRepository;
import com.rubi.barber.repository.CitaRepository;
import com.rubi.barber.repository.PeluqueroRepository;
import com.rubi.barber.repository.ServicioRepository;
import com.rubi.barber.dto.DiaHorarioDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Locale;
import java.time.format.TextStyle;
import java.util.LinkedHashMap;

import io.swagger.v3.oas.annotations.Operation;

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

    @Autowired
    private ServicioRepository servicioRepository;

    @GetMapping
    public List<Horario> getAll() {
        return horarioRepository.findAll();
    }

    @Operation(summary = "Obtiene los horarios disponibles para un peluquero en una fecha, considerando la duración del servicio")
    @GetMapping("/peluquero/{peluqueroId}")
    public ResponseEntity<?> getHorariosDisponibles(
            @PathVariable Long peluqueroId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            @RequestParam Long servicioId) {
        
        if (!peluqueroRepository.existsById(peluqueroId)) {
            return ResponseEntity.notFound().build();
        }

        Servicio servicio = servicioRepository.findById(servicioId)
            .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
        int servicioDuracion = servicio.getDuracion();

        String diaSemana = fecha.getDayOfWeek().getDisplayName(TextStyle.FULL, new Locale("es", "ES"));

        Optional<Horario> horarioOptional = horarioRepository.findByPeluqueroIdAndDiaSemana(peluqueroId, diaSemana);
        Horario horarioBase = horarioOptional.orElse(new Horario(LocalTime.of(9, 0), LocalTime.of(20, 0)));

        if (!horarioBase.isActivo()) {
            return ResponseEntity.ok(new ArrayList<>());
        }

            LocalDateTime inicioDia = fecha.atStartOfDay();
            LocalDateTime finDia = fecha.atTime(23, 59, 59);
            List<Cita> citasExistentes = citaRepository.findByPeluqueroIdAndFechaHoraBetween(
                    peluqueroId, inicioDia, finDia);

            List<LocalDateTime> slotsDisponibles = new ArrayList<>();
        LocalDateTime inicioJornada = fecha.atTime(horarioBase.getHoraInicio());
            LocalDateTime finJornada = fecha.atTime(horarioBase.getHoraFin());
        LocalDateTime ahora = LocalDateTime.now();

        for (LocalDateTime currentSlot = inicioJornada;
                 currentSlot.isBefore(finJornada);
                 currentSlot = currentSlot.plusMinutes(30)) {
                
            if (currentSlot.isBefore(ahora)) {
                continue;
            }

            LocalDateTime finNuevoServicio = currentSlot.plusMinutes(servicioDuracion);

            if (finNuevoServicio.isAfter(finJornada)) {
                break;
            }

            final LocalDateTime slotToCheck = currentSlot;

            boolean solapaConCitaExistente = citasExistentes.stream()
                    .anyMatch(cita -> {
                            LocalDateTime inicioCita = cita.getFechaHora();
                            LocalDateTime finCita = inicioCita.plusMinutes(cita.getServicio().getDuracion());
                            
                        return slotToCheck.isBefore(finCita) && inicioCita.isBefore(slotToCheck.plusMinutes(servicioDuracion));
                        });

            if (!solapaConCitaExistente) {
                slotsDisponibles.add(slotToCheck);
            }
        }

        return ResponseEntity.ok(slotsDisponibles);
    }

    @PostMapping
    public Horario create(@RequestBody Horario horario) {
        return horarioRepository.save(horario);
    }

    @PutMapping("/peluquero/{peluqueroId}")
    public ResponseEntity<?> updateHorarioSemanal(
            @PathVariable Long peluqueroId,
            @RequestBody Map<String, DiaHorarioDto> horarioSemanal) {

        if (!peluqueroRepository.existsById(peluqueroId)) {
            return ResponseEntity.notFound().build();
        }

        try {
            for (Map.Entry<String, DiaHorarioDto> entry : horarioSemanal.entrySet()) {
                String diaSemana = entry.getKey();
                DiaHorarioDto diaHorarioDto = entry.getValue();

                Optional<Horario> existingHorarioOpt = horarioRepository.findByPeluqueroIdAndDiaSemana(
                        peluqueroId, diaSemana);

                Horario horario;

                if (existingHorarioOpt.isPresent()) {
                    horario = existingHorarioOpt.get();
                } else {
                    horario = new Horario();
                    horario.setPeluquero(peluqueroRepository.findById(peluqueroId).orElseThrow(
                            () -> new RuntimeException("Peluquero no encontrado")));
                    horario.setDiaSemana(diaSemana);
                }

                horario.setActivo(diaHorarioDto.isAvailable());

                if (diaHorarioDto.isAvailable()) {
                    if (diaHorarioDto.getStart() == null || diaHorarioDto.getStart().isEmpty()) {
                        throw new IllegalArgumentException("La hora de inicio no puede estar vacía para un día activo (" + diaSemana + ").");
                    }
                    if (diaHorarioDto.getEnd() == null || diaHorarioDto.getEnd().isEmpty()) {
                         throw new IllegalArgumentException("La hora de fin no puede estar vacía para un día activo (" + diaSemana + ").");
                    }
                    try {
                         horario.setHoraInicio(LocalTime.parse(diaHorarioDto.getStart()));
                         horario.setHoraFin(LocalTime.parse(diaHorarioDto.getEnd()));
                    } catch (DateTimeParseException e) {
                         throw new IllegalArgumentException("Formato de hora incorrecto para " + diaSemana + ". Use HH:mm");
                    }
                } else {
                    horario.setHoraInicio(LocalTime.of(0, 0));
                    horario.setHoraFin(LocalTime.of(0, 0));
                }

                 if (horario.isActivo() && horario.getHoraInicio() != null && horario.getHoraFin() != null && !horario.getHoraInicio().isBefore(horario.getHoraFin())) {
                     throw new IllegalArgumentException("La hora de inicio debe ser anterior a la hora de fin para el " + diaSemana);
                 }

                horarioRepository.save(horario);
            }

            return ResponseEntity.ok().build();

        } catch (DateTimeParseException e) {
            System.err.println("Error parsing time: " + e.getMessage());
            return ResponseEntity.badRequest().body("Formato de hora incorrecto. Use HH:mm");
        } catch (IllegalArgumentException e) {
             System.err.println("Validation error: " + e.getMessage());
             return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Error updating schedule: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Error interno al actualizar el horario.");
        }
    }

    @Operation(summary = "Obtiene el horario semanal de un peluquero")
    @GetMapping("/semanal/peluquero/{peluqueroId}")
    public ResponseEntity<Map<String, DiaHorarioDto>> getHorariosSemanalesByPeluqueroId(@PathVariable Long peluqueroId) {
        List<Horario> horarios = horarioRepository.findByPeluqueroId(peluqueroId);

        Map<String, DiaHorarioDto> horarioSemanalDto = horarios.stream()
            .collect(Collectors.toMap(
                Horario::getDiaSemana,
                horario -> new DiaHorarioDto(horario.getHoraInicio() != null ? horario.getHoraInicio().toString() : "", 
                                            horario.getHoraFin() != null ? horario.getHoraFin().toString() : "", 
                                            horario.isActivo())
            ));

        List<String> diasSemanaOrdenados = List.of("Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo");
        Map<String, DiaHorarioDto> finalHorarioSemanalDto = new LinkedHashMap<>();

        diasSemanaOrdenados.forEach(dia -> {
            finalHorarioSemanalDto.put(dia, horarioSemanalDto.getOrDefault(dia, new DiaHorarioDto("", "", false)));
        });

        return ResponseEntity.ok(finalHorarioSemanalDto);
    }
}
