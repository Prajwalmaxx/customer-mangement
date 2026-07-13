package com.nt.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class JwtServiceTest {

	private final JwtService jwtService = new JwtService(
			"CustomerDataManipulationSecretKeyForJwtSigning2026",
			3_600_000L);

	@Test
	void generatesAndValidatesToken() {
		String token = jwtService.generateToken("user@test.com", "User");

		assertTrue(jwtService.isValidToken(token));
		assertEquals("user@test.com", jwtService.extractEmail(token));
	}

	@Test
	void rejectsInvalidToken() {
		assertFalse(jwtService.isValidToken("invalid.token.value"));
	}
}
