package com.nt.service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.nt.security.JwtService;

@Service
public class AuthService {

	private final Map<String, String> users = new ConcurrentHashMap<>();
	private final AuthValidationService validationService;
	private final AuthMailService mailService;
	private final JwtService jwtService;

	public AuthService(
			AuthValidationService validationService,
			AuthMailService mailService,
			JwtService jwtService) {
		this.validationService = validationService;
		this.mailService = mailService;
		this.jwtService = jwtService;
		users.put("admin@test.com", "password123");
	}

	public Map<String, Object> checkEmail(String email) {
		String emailError = validationService.validateEmail(email);
		if (emailError != null) {
			return Map.of(
					"valid", false,
					"exists", false,
					"message", emailError);
		}

		String normalizedEmail = normalizeEmail(email);
		boolean exists = users.containsKey(normalizedEmail);

		return Map.of(
				"valid", true,
				"exists", exists,
				"message", exists ? "This email is already registered." : "Email is available.");
	}

	public Map<String, Object> login(String email, String password) {
		String emailError = validationService.validateEmail(email);
		if (emailError != null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, emailError);
		}

		String passwordError = validationService.validatePassword(password);
		if (passwordError != null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, passwordError);
		}

		String normalizedEmail = normalizeEmail(email);
		if (!users.containsKey(normalizedEmail)) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No account found for this email.");
		}

		if (!password.equals(users.get(normalizedEmail))) {
			mailService.sendLoginFailureNotice(normalizedEmail);
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password.");
		}

		return buildAuthResponse(normalizedEmail, null);
	}

	public Map<String, Object> register(String name, String email, String password) {
		String nameError = validationService.validateName(name);
		if (nameError != null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, nameError);
		}

		String emailError = validationService.validateEmail(email);
		if (emailError != null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, emailError);
		}

		String passwordError = validationService.validatePassword(password);
		if (passwordError != null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, passwordError);
		}

		String normalizedEmail = normalizeEmail(email);
		if (users.containsKey(normalizedEmail)) {
			mailService.sendExistingEmailNotice(normalizedEmail);
			throw new ResponseStatusException(HttpStatus.CONFLICT, "This email is already registered.");
		}

		users.put(normalizedEmail, password);
		String displayName = name.trim();
		mailService.sendWelcomeEmail(normalizedEmail, displayName);

		return buildAuthResponse(normalizedEmail, displayName);
	}

	private String normalizeEmail(String email) {
		return email.trim().toLowerCase();
	}

	private Map<String, Object> buildAuthResponse(String email, String name) {
		String displayName = (name != null && !name.isBlank()) ? name.trim() : email.split("@")[0];
		String token = jwtService.generateToken(email, displayName);

		return Map.of(
				"token", token,
				"user", Map.of("email", email, "name", displayName));
	}
}
