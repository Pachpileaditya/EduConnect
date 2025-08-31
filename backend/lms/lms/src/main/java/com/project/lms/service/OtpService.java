package com.project.lms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {
    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 5;
    private final Map<String, OtpEntry> otpStorage = new ConcurrentHashMap<>();

    @Autowired
    private JavaMailSender mailSender;

    private static class OtpEntry {
        String otp;
        LocalDateTime expiry;
        OtpEntry(String otp, LocalDateTime expiry) {
            this.otp = otp;
            this.expiry = expiry;
        }
    }

    public void generateAndSendOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);
        otpStorage.put(email, new OtpEntry(otp, expiry));
        sendOtpEmail(email, otp);
    }

    public boolean validateOtp(String email, String otp) {
        OtpEntry entry = otpStorage.get(email);
        if (entry == null) return false;
        if (entry.expiry.isBefore(LocalDateTime.now())) {
            return false;
        }
        return entry.otp.equals(otp);
    }

    // Add a method to consume (remove) OTP after successful reset
    public void consumeOtp(String email) {
        otpStorage.remove(email);
    }

    public boolean isOtpExpired(String email) {
        OtpEntry entry = otpStorage.get(email);
        return entry == null || entry.expiry.isBefore(LocalDateTime.now());
    }

    private void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your OTP Code for LMS Platform");
        message.setText(
                "Dear User,\n\n" +
                "Your One-Time Password (OTP) is: " + otp + "\n\n" +
                "This OTP is valid for 5 minutes.\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "Best regards,\nLMS Team"
        );
        mailSender.send(message);
    }

    // Clean up expired OTPs every 10 minutes
    @Scheduled(fixedRate = 10 * 60 * 1000)
    public void cleanupExpiredOtps() {
        LocalDateTime now = LocalDateTime.now();
        otpStorage.entrySet().removeIf(e -> e.getValue().expiry.isBefore(now));
    }
} 