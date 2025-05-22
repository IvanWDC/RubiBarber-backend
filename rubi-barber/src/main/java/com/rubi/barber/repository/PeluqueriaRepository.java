package com.rubi.barber.repository;

import com.rubi.barber.model.Peluqueria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PeluqueriaRepository extends JpaRepository<Peluqueria, Long> {

    // Obtener todas las peluquerías activas
    List<Peluqueria> findByActivoTrue();

    // Buscar peluquerías por radio (Haversine) — SQL nativo
    @Query(value = """
        SELECT * FROM peluqueria
        WHERE activo = true AND (
            6371 * acos(
                cos(radians(:lat)) * cos(radians(latitud)) *
                cos(radians(longitud) - radians(:lng)) +
                sin(radians(:lat)) * sin(radians(latitud))
            )
        ) <= :radio
        """, nativeQuery = true)
    List<Peluqueria> findCercanas(@Param("lat") double lat, @Param("lng") double lng, @Param("radio") double radio);
}
