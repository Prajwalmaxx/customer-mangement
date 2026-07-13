package com.nt.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class AuthMailService {

	private static final Logger log = LoggerFactory.getLogger(AuthMailService.class);

	private final JavaMailSender mailSender;
	private final boolean mailEnabled;
	private final String fromAddress;

	public AuthMailService(
			JavaMailSender mailSender,
			@Value("${app.mail.enabled:false}") boolean mailEnabled,
			@Value("${app.mail.from:noreply@customerdata.com}") String fromAddress) {
		this.mailSender = mailSender;
		this.mailEnabled = mailEnabled;
		this.fromAddress = fromAddress;
	}

	public void sendWelcomeEmail(String email, String name) {
		send(
				email,
				"Welcome to Customer Data manipulation",
				"Hello " + name + ",\n\nYour account was created successfully.\n\nRegards,\nCustomer Data manipulation");
	}

	public void sendExistingEmailNotice(String email) {
		send(
				email,
				"Registration attempt for existing account",
				"A registration attempt was made using this email address, but the account already exists.\n\nIf this was not you, please ignore this message.");
	}

	public void sendLoginFailureNotice(String email) {
		send(
				email,
				"Failed login attempt",
				"An unsuccessful login attempt was made for your account.\n\nIf this was not you, please reset your password.");
	}

	private void send(String to, String subject, String text) {
		if (!mailEnabled) {
			log.info("Mail disabled. Would send to {} | subject: {}", to, subject);
			return;
		}

		try {
			SimpleMailMessage message = new SimpleMailMessage();
			message.setFrom(fromAddress);
			message.setTo(to);
			message.setSubject(subject);
			message.setText(text);
			mailSender.send(message);
			log.info("Mail sent to {}", to);
		} catch (Exception ex) {
			log.warn("Failed to send mail to {}: {}", to, ex.getMessage());
		}
	}
}
