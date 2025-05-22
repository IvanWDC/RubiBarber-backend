package com.rubi.barber.repository;

import com.rubi.barber.model.Cita;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Cita c " +
           "WHERE c.peluquero.id = :peluqueroId " +
           "AND (" +
           "   (c.fechaHora <= :fin AND FUNCTION('TIMESTAMPADD', MINUTE, c.servicio.duracion, c.fechaHora) >= :inicio) " +
           "   OR (c.fechaHora >= :inicio AND c.fechaHora <= :fin)" +
           ")")
    boolean existeSolapamiento(
        @Param("peluqueroId") Long peluqueroId,
        @Param("inicio") LocalDateTime inicio,
        @Param("fin") LocalDateTime fin
    );

    // AÑADIMOS ESTO 
    List<Cita> findByPeluqueroId(Long peluqueroId);
    List<Cita> findByClienteId(Long clienteId);
    List<Cita> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin);

    List<Cita> findByPeluqueroIdAndFechaHoraBetween(
        Long peluqueroId, 
        LocalDateTime inicio, 
        LocalDateTime fin
    );

}