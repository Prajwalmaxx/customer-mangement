package com.nt.service;

import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

@Service
public class AuthValidationService {

	private static final Pattern EMAIL_PATTERN = Pattern.compile(
			"^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

	public boolean isValidEmail(String email) {
		return email != null && EMAIL_PATTERN.matcher(email.trim()).matches();
	}

	public String validateEmail(String email) {
		if (email == null || email.isBlank()) {
			return "Email is required.";
		}
		if (!isValidEmail(email)) {
			return "Enter a valid email address.";
		}
		return null;
	}

	public String validatePassword(String password) {
		if (password == null || password.isBlank()) {
			return "Password is required.";
		}
		if (password.length() < 8) {
			return "Password must be at least 8 characters.";
		}
		if (!password.matches(".*[A-Za-z].*")) {
			return "Password must contain at least one letter.";
		}
		if (!password.matches(".*\\d.*")) {
			return "Password must contain at least one number.";
		}
		return null;
	}

	public String validateName(String name) {
		if (name == null || name.isBlank()) {
			return "Full name is required.";
		}
		if (name.trim().length() < 2) {
			return "Full name must be at least 2 characters.";
		}
		return null;
	}
}
