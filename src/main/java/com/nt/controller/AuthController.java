package com.nt.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nt.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin()
public class AuthController {

	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@GetMapping("/check-email")
	public ResponseEntity<Map<String, Object>> checkEmail(@RequestParam String email) {
		return ResponseEntity.ok(authService.checkEmail(email));
	}

	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
		return ResponseEntity.ok(authService.login(body.get("email"), body.get("password")));
	}

	@PostMapping("/register")
	public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> body) {
		return ResponseEntity.ok(authService.register(body.get("name"), body.get("email"), body.get("password")));
	}
}
