package com.udaykiran.ecommerce.service;

import com.udaykiran.ecommerce.entity.User;
import com.udaykiran.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public void requestOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with that email"));

        String otp = String.format("%06d", new SecureRandom().nextInt(1_000_000));
        user.setResetOtp(otp);
        user.setResetOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        emailService.sendOtpEmail(email, otp);
    }

    public void resetPassword(String email, String otp, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with that email"));

        if (user.getResetOtp() == null || !user.getResetOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }
        if (user.getResetOtpExpiry() == null || user.getResetOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired. Please request a new one.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetOtp(null);
        user.setResetOtpExpiry(null);
        userRepository.save(user);
    }
}