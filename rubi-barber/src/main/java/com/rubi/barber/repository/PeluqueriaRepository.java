package com.rubi.barber.repository;

import com.rubi.barber.model.Peluqueria;
import com.rubi.barber.model.Usuario;
import com.rubi.barber.projection.PeluqueriaConDistancia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PeluqueriaRepository extends JpaRepository<Peluqueria, Long> {

    // Obtener todas las peluquerías activas
    List<Peluqueria> findByActivoTrue();

    // Buscar peluquerías por radio (Haversine) — SQL nativo
    @Query(value = """
        SELECT
            p.id,
            p.nombre,
            p.direccion,
            p.latitud,
            p.longitud,
            p.activo,
            (
                6371 * acos(
                    cos(radians(:lat)) * cos(radians(p.latitud)) *
                    cos(radians(p.longitud) - radians(:lng)) +
                    sin(radians(:lat)) * sin(radians(p.latitud))
                )
            )
         AS distancia
        FROM peluqueria p
        WHERE p.activo = true AND (
            6371 * acos(
                cos(radians(:lat)) * cos(radians(p.latitud)) *
                cos(radians(p.longitud) - radians(:lng)) +
                sin(radians(:lat)) * sin(radians(p.latitud))
            )
        ) <= :radio
        ORDER BY distancia ASC
        """, nativeQuery = true)
    List<PeluqueriaConDistancia> findCercanas(@Param("lat") double lat, @Param("lng") double lng, @Param("radio") double radio);

    // Buscar peluquería por el usuario administrador asociado
    Optional<Peluqueria> findByUsuario(Usuario usuario);
}
