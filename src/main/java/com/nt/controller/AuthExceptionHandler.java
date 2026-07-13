package com.nt.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestControllerAdvice
public class AuthExceptionHandler {

	@ExceptionHandler(ResponseStatusException.class)
	public ResponseEntity<Map<String, String>> handleResponseStatusException(ResponseStatusException ex) {
		return ResponseEntity.status(ex.getStatusCode()).body(Map.of("message", ex.getReason()));
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<Map<String, String>> handleUnreadableMessage(HttpMessageNotReadableException ex) {
		String message = ex.getMostSpecificCause().getMessage();
		if (message != null && message.contains("out of range of int")) {
			message = "Customer number is too large. Use a value up to 9,223,372,036,854,775,807 or a smaller ID.";
		} else if (message != null && message.contains("Cannot deserialize value of type")) {
			message = "Invalid customer data format. Check customer number, phone numbers, and ID details.";
		} else {
			message = "Invalid request body. Please check all customer fields.";
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", message));
	}
}
