package com.udaykiran.ecommerce.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String toEmail, String otp) {
        // Always log the OTP so you can test locally even before email is configured.
        log.info("Password reset OTP for {}: {}", toEmail, otp);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Your password reset code");
            message.setText("Your OTP to reset your password is: " + otp
                    + "\n\nThis code expires in 10 minutes. If you didn't request this, ignore this email.");
            mailSender.send(message);
        } catch (Exception e) {
            log.warn("Could not send OTP email (check mail config in application.properties). "
                    + "OTP is still available in the console log above.");
        }
    }
}
