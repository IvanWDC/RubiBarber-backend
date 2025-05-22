package com.rubi.barber.security;

import com.rubi.barber.model.Usuario;
import com.rubi.barber.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import org.springframework.security.core.GrantedAuthority;


import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario user = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        System.out.println(">> Usuario encontrado:");
        System.out.println("   Email: " + user.getEmail());
        System.out.println("   Password (hash): " + user.getPassword());
        System.out.println("   Rol: " + user.getRol());

        return new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getPassword(),
            Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + user.getRol().toString().toUpperCase())
            )
        );
    }

}
