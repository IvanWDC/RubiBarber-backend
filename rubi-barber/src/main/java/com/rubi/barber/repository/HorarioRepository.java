package com.rubi.barber.repository;

import com.rubi.barber.model.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HorarioRepository extends JpaRepository<Horario, Long> {
    List<Horario> findByPeluqueroId(Long peluqueroId);
    Optional<Horario> findByPeluqueroIdAndDiaSemana(Long peluqueroId, String diaSemana);
    void deleteByPeluqueroId(Long peluqueroId);
}
