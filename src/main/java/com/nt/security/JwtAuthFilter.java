package com.nt.security;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

	public static final String AUTH_USER_EMAIL = "authUserEmail";
	public static final String AUTH_USER_NAME = "authUserName";

	private static final List<String> PUBLIC_PREFIXES = List.of(
			"/api/auth/",
			"/js/",
			"/assets/",
			"/styles.css",
			"/login-bg.png",
			"/index.html",
			"/favicon.ico",
			"/error");

	private final JwtService jwtService;
	private final ObjectMapper objectMapper;

	public JwtAuthFilter(JwtService jwtService, ObjectMapper objectMapper) {
		this.jwtService = jwtService;
		this.objectMapper = objectMapper;
	}

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
		if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
			return true;
		}

		String path = request.getRequestURI();
		if ("/".equals(path)) {
			return true;
		}

		return PUBLIC_PREFIXES.stream().anyMatch(path::startsWith);
	}

	@Override
	protected void doFilterInternal(
			HttpServletRequest request,
			HttpServletResponse response,
			FilterChain filterChain) throws ServletException, IOException {

		String authorization = request.getHeader("Authorization");
		if (authorization == null || !authorization.startsWith("Bearer ")) {
			writeUnauthorized(response, "Missing or invalid Authorization header.");
			return;
		}

		String token = authorization.substring(7).trim();
		if (!jwtService.isValidToken(token)) {
			writeUnauthorized(response, "Invalid or expired JWT token.");
			return;
		}

		try {
			var claims = jwtService.parseToken(token);
			request.setAttribute(AUTH_USER_EMAIL, claims.getSubject());
			request.setAttribute(AUTH_USER_NAME, claims.get("name", String.class));
			filterChain.doFilter(request, response);
		} catch (Exception ex) {
			writeUnauthorized(response, "Invalid or expired JWT token.");
		}
	}

	private void writeUnauthorized(HttpServletResponse response, String message) throws IOException {
		response.setStatus(HttpStatus.UNAUTHORIZED.value());
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		objectMapper.writeValue(response.getWriter(), java.util.Map.of("message", message));
	}
}
