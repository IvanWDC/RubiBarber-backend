package com.rubi.barber.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.rubi.barber.model.Peluquero;
import com.rubi.barber.model.Usuario;
import com.rubi.barber.repository.PeluqueroRepository;
import com.rubi.barber.repository.UsuarioRepository;
import com.rubi.barber.repository.PasswordResetTokenRepository;
import com.rubi.barber.repository.HorarioRepository;
import com.rubi.barber.dto.PeluqueroDTO;
import com.rubi.barber.dto.UsuarioDTO;

@Service
public class PeluqueroService {

    @Autowired
    private PeluqueroRepository peluqueroRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private HorarioRepository horarioRepository;

    @Transactional
    public void eliminarPeluqueroYUsuario(Long idPeluquero) {
        Peluquero peluquero = peluqueroRepository.findById(idPeluquero)
            .orElseThrow(() -> new RuntimeException("Peluquero no encontrado"));

        horarioRepository.deleteByPeluqueroId(idPeluquero);

        Usuario usuario = peluquero.getUsuario();
        tokenRepository.deleteByUsuarioId(usuario.getId());
        peluqueroRepository.delete(peluquero);
        usuarioRepository.delete(usuario);
    }

    private PeluqueroDTO convertToDTO(Peluquero peluquero) {
        PeluqueroDTO dto = new PeluqueroDTO();
        dto.setId(peluquero.getId());
        dto.setNombre(peluquero.getNombre());
        dto.setEspecialidad(peluquero.getEspecialidad());
        dto.setActivo(peluquero.isActivo());
        dto.setRol(peluquero.getUsuario() != null ? peluquero.getUsuario().getRol().name() : null);
        dto.setEmail(peluquero.getUsuario() != null ? peluquero.getUsuario().getEmail() : null);

        if (peluquero.getUsuario() != null) {
            UsuarioDTO usuarioDTO = new UsuarioDTO();
            usuarioDTO.setId(peluquero.getUsuario().getId());
            usuarioDTO.setEmail(peluquero.getUsuario().getEmail());
            usuarioDTO.setActivo(peluquero.getUsuario().isActivo());
            usuarioDTO.setRol(peluquero.getUsuario().getRol().name());
            dto.setUsuarioPeluquero(usuarioDTO);
        }
        
        return dto;
    }
} 