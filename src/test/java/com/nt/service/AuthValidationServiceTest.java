package com.nt.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class AuthValidationServiceTest {

	private final AuthValidationService validationService = new AuthValidationService();

	@Test
	void acceptsValidEmail() {
		assertNull(validationService.validateEmail("user@example.com"));
	}

	@Test
	void rejectsInvalidEmail() {
		assertEquals("Enter a valid email address.", validationService.validateEmail("invalid-email"));
	}

	@Test
	void acceptsStrongPassword() {
		assertNull(validationService.validatePassword("password123"));
	}

	@Test
	void rejectsWeakPassword() {
		assertEquals("Password must contain at least one number.", validationService.validatePassword("password"));
	}

	@Test
	void checkEmailDetectsInvalidFormat() {
		assertFalse(validationService.isValidEmail("bad-email"));
		assertTrue(validationService.isValidEmail("good@mail.com"));
	}
}
