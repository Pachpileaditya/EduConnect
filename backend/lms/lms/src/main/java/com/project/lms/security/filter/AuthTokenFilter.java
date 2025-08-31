package com.project.lms.security.filter;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.project.lms.security.service.ShopUserDetailsService;
import com.project.lms.security.util.JwtUtils;

import io.jsonwebtoken.JwtException;
import io.micrometer.common.lang.NonNull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class AuthTokenFilter extends OncePerRequestFilter {

    @Autowired
    private ShopUserDetailsService userDetailsService;

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        String jwt = parseJwt(request);
        try {
            if (StringUtils.hasText(jwt) && jwtUtils.validateToken(jwt)) {
                String userName = jwtUtils.getUsernameFromToken(jwt);
                UserDetails userDetails = userDetailsService.loadUserByUsername(userName);
                var auth = new UsernamePasswordAuthenticationToken(userName, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(auth);

            }
        } catch (JwtException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(e.getMessage() + " : Invalid or Expired Token");
            return;
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(e.getMessage());
            return;
        }

        filterChain.doFilter(request, response);

    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}

/**
 * 
 * 
 * 
 * 
 * import java.util.List;
 * 
 * import org.modelmapper.ModelMapper;
 * import org.springframework.context.annotation.Bean;
 * import org.springframework.context.annotation.Configuration;
 * import org.springframework.security.authentication.AuthenticationManager;
 * import
 * org.springframework.security.authentication.dao.DaoAuthenticationProvider;
 * import
 * org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
 * import
 * org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
 * import
 * org.springframework.security.config.annotation.web.builders.HttpSecurity;
 * import
 * org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
 * import
 * org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
 * import org.springframework.security.config.http.SessionCreationPolicy;
 * import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
 * import org.springframework.security.crypto.password.PasswordEncoder;
 * import org.springframework.security.web.SecurityFilterChain;
 * import
 * org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
 * 
 * 
 * 
 * import lombok.RequiredArgsConstructor;
 * 
 * 
 * @RequiredArgsConstructor
 * @EnableWebSecurity
 * @Configuration
 * @EnableMethodSecurity(prePostEnabled = true)
 *                                      public class SecurityConfig {
 *                                      private final ShopUserDetailsService
 *                                      userDetailsService;
 *                                      private final JwtEntryPoint
 *                                      authEntryPoint;
 * 
 *                                      private static final List<String>
 *                                      SECURE_URLS =
 *                                      List.of("/api/v1/admin/**","/");
 * 
 * @Bean
 *       public PasswordEncoder passwordEncoder() {
 *       return new BCryptPasswordEncoder();
 *       }
 * 
 * @Bean
 *       public AuthTokenFilter authTokenFilter() {
 *       return new AuthTokenFilter();
 *       }
 * 
 * @Bean
 *       public AuthenticationManager
 *       authenticationManager(AuthenticationConfiguration authConfig) throws
 *       Exception {
 *       return authConfig.getAuthenticationManager();
 *       }
 * 
 * @Bean
 *       public JwtUtils jwtUtils() {
 *       return new JwtUtils();
 *       }
 * 
 * @Bean
 *       public DaoAuthenticationProvider daoAuthenticationProvider() {
 *       var authProvider = new DaoAuthenticationProvider();
 *       authProvider.setUserDetailsService(userDetailsService);
 *       authProvider.setPasswordEncoder(passwordEncoder());
 *       return authProvider;
 * 
 *       }
 * 
 * @Bean
 *       public SecurityFilterChain filterChain(HttpSecurity http) throws
 *       Exception {
 * 
 *       http.csrf(AbstractHttpConfigurer::disable)
 *       .exceptionHandling(exception ->
 *       exception.authenticationEntryPoint(authEntryPoint))
 *       .sessionManagement(session ->
 *       session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
 *       .authorizeHttpRequests(auth ->
 *       auth.requestMatchers(SECURE_URLS.toArray(String[]::new)).authenticated()
 *       .anyRequest().permitAll());
 *       http.authenticationProvider(daoAuthenticationProvider());
 *       http.addFilterBefore(authTokenFilter(),
 *       UsernamePasswordAuthenticationFilter.class);
 *       return http.build();
 * 
 *       }
 *       }
 * 
 */