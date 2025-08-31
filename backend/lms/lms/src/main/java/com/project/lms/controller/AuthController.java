package com.project.lms.controller;

import com.project.lms.entity.Teacher;
import com.project.lms.entity.Student;
import com.project.lms.entity.User;
import com.project.lms.entity.Year;
// import com.project.lms.entity.Hod;
import com.project.lms.exception.YearNotFoundException;
import com.project.lms.DTO.LoginRequest;
import com.project.lms.entity.Role;
import com.project.lms.repo.StudentRepository;
import com.project.lms.repo.TeacherRepository;
import com.project.lms.repo.UserRepository;
import com.project.lms.security.util.JwtUtils;
import com.project.lms.service.OtpService;
// import com.project.lms.service.HodService;
import org.springframework.mail.MailException;

import java.io.ObjectOutputStream;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.project.lms.service.TeacherService;
import com.project.lms.service.YearService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final TeacherService teacherService;
    
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private OtpService otpService;

    // @Autowired
    // private HodService hodService;

    private final PasswordEncoder passwordEncoder;
    // private final JwtUtil jwtUtil;
    private final YearService yearService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    

    // DTO for teacher registration
    public static class TeacherRegistrationRequest {
        private String name;
        private String email;
        private String password;
        private String expertise;
        private LocalDate date;
        private String gender;
        private String address;
        private int pincode;
        private String state;
        Set<Integer> years;

        // Getters and Setters

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getExpertise() {
            return expertise;
        }

        public void setExpertise(String expertise) {
            this.expertise = expertise;
        }

        public LocalDate getDate() {
            return date;
        }

        public void setDate(LocalDate date) {
            this.date = date;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public int getPincode() {
            return pincode;
        }

        public void setPincode(int pincode) {
            this.pincode = pincode;
        }

        public String getState() {
            return state;
        }

        public void setState(String state) {
            this.state = state;
        }

        public Set<Integer> getYears() {
            return years;
        }

        public void setYears(Set<Integer> years) {
            this.years = years;
        }

    }

    public Set<Year> GetYearSet(Set<Integer> years) {
        Set<Year> tempYears = new HashSet<>();
        for (Integer i : years) {
            Year dbYear = yearService.getYearByName(i);
            tempYears.add(dbYear);
        }

        return tempYears;
    }

    public static class StudentRegistrationRequest {
        private String name;
        private String email;
        private String password;
        private Integer year;
        private LocalDate date;
        private String gender;
        private String address;
        private int pincode;
        private String state;

        // Getters and Setters
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public LocalDate getDate() {
            return date;
        }

        public void setDate(LocalDate date) {
            this.date = date;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public int getPincode() {
            return pincode;
        }

        public void setPincode(int pincode) {
            this.pincode = pincode;
        }

        public String getState() {
            return state;
        }

        public void setState(String state) {
            this.state = state;
        }

        public Integer getYear() {
            return year;
        }

        public void setYear(Integer year) {
            this.year = year;
        }

    }

    public static class AdminRegistrationRequest {
        private String name;
        private String email;
        private String password;
        private LocalDate date;
        private String gender;
        private String address;
        private int pincode;
        private String state;

        // Getters and Setters
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public LocalDate getDate() {
            return date;
        }

        public void setDate(LocalDate date) {
            this.date = date;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public int getPincode() {
            return pincode;
        }

        public void setPincode(int pincode) {
            this.pincode = pincode;
        }

        public String getState() {
            return state;
        }

        public void setState(String state) {
            this.state = state;
        }
    }

    public static class HODRegistrationRequest {
        private String name;
        private String email;
        private String password;
        private String department;
        private LocalDate date;
        private String gender;
        private String address;
        private int pincode;
        private String state;
        
        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }
        
        // Custom setter to handle string dates from frontend
        public void setDate(String dateString) {
            if (dateString != null && !dateString.trim().isEmpty()) {
                try {
                    this.date = LocalDate.parse(dateString);
                } catch (Exception e) {
                    System.err.println("Error parsing date: " + dateString + " - " + e.getMessage());
                    // Try alternative date formats if needed
                    try {
                        this.date = LocalDate.parse(dateString, java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                    } catch (Exception e2) {
                        System.err.println("Failed to parse date with alternative format: " + e2.getMessage());
                    }
                }
            }
        }
        
        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public int getPincode() { return pincode; }
        public void setPincode(int pincode) { this.pincode = pincode; }
        public String getState() { return state; }
        public void setState(String state) { this.state = state; }
    }

    @PostMapping("/register/teacher")
    public ResponseEntity<?> registerTeacher(@RequestBody TeacherRegistrationRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already taken.");
        }

        // Create and save the user with role TEACHER
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        // user.setPassword(request.getPassword());// Encrypt password
        user.setRole(Role.TEACHER);
        user.setDob(request.date);
        user.setGender(request.getGender());
        user.setAddress(request.getAddress());
        user.setPincode(request.getPincode());
        user.setState(request.getState());

        // Create and save the teacher entity linked to the user
        Teacher teacher = new Teacher();
        teacher.setUser(user);
        teacher.setExpertise(request.getExpertise());
        Set<Year> myYears = yearService.getYearSet(request.getYears());
        System.out.println(myYears);
        System.out.println();
        teacher.setYears(myYears);
        System.out.println(teacher);
        teacherService.saveTeacher(teacher);

        return ResponseEntity.ok(teacher);
    }

    @PostMapping("/register/student")
    public ResponseEntity<?> registerStudent(@RequestBody StudentRegistrationRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already taken.");
        }

        // Create and save the user with role TEACHER
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Encrypt password
        // user.setPassword(request.getPassword());
        user.setRole(Role.STUDENT);
        user.setDob(request.date);
        user.setGender(request.getGender());
        user.setAddress(request.getAddress());
        user.setPincode(request.getPincode());
        user.setState(request.getState());

        userRepository.save(user);

        // Create and save the student entity linked to the user
        Student student = new Student();
        student.setUser(user);
        Integer myYear = request.getYear();

        if (yearService.yearExits(myYear)) {
            student.setYear(myYear);
        } else {
            throw new YearNotFoundException("Year not found with id = " + myYear);
        }
        student.setIsPassout(false);
        studentRepository.save(student);

        return ResponseEntity.ok(student);
    }

    @PostMapping("/register/admin")
    public ResponseEntity<?> registerAdmin(@RequestBody AdminRegistrationRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already taken.");
        }

        // Create and save the user with role TEACHER
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Encrypt password
        // user.setPassword(request.getPassword());
        user.setRole(Role.ADMIN);
        user.setDob(request.date);
        user.setGender(request.getGender());
        user.setAddress(request.getAddress());
        user.setPincode(request.getPincode());
        user.setState(request.getState());

        // If you have an Admin entity, create and save it here.
        // For this example, we're using the User entity for admin registration.

        return ResponseEntity.ok(user);
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend is running successfully!");
    }

    // @PostMapping("/register/hod")
    // public ResponseEntity<?> registerHod(@RequestBody HODRegistrationRequest request) {
    //     try {
    //         // Debug logging
    //         System.out.println("HOD Registration Request received:");
    //         System.out.println("Name: " + request.getName());
    //         System.out.println("Email: " + request.getEmail());
    //         System.out.println("Department: " + request.getDepartment());
    //         System.out.println("Date: " + request.getDate());
    //         System.out.println("Gender: " + request.getGender());
    //         System.out.println("Address: " + request.getAddress());
    //         System.out.println("Pincode: " + request.getPincode());
    //         System.out.println("State: " + request.getState());
            
    //         // Check if email already exists
    //         if (userRepository.existsByEmail(request.getEmail())) {
    //             return ResponseEntity.badRequest().body("Email is already taken.");
    //         }

    //         // Validate required fields
    //         if (request.getName() == null || request.getName().trim().isEmpty()) {
    //             return ResponseEntity.badRequest().body("Name is required.");
    //         }
    //         if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
    //             return ResponseEntity.badRequest().body("Email is required.");
    //         }
    //         if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
    //             return ResponseEntity.badRequest().body("Password is required.");
    //         }
    //         if (request.getDepartment() == null || request.getDepartment().trim().isEmpty()) {
    //             return ResponseEntity.badRequest().body("Department is required.");
    //         }
    //         if (request.getDate() == null) {
    //             return ResponseEntity.badRequest().body("Date of birth is required.");
    //         }

    //         // Create and save the user with role HOD
    //         User user = new User();
    //         user.setName(request.getName());
    //         user.setEmail(request.getEmail());
    //         user.setPassword(passwordEncoder.encode(request.getPassword())); // Encrypt password
    //         user.setRole(Role.HOD);
    //         user.setDob(request.getDate());
    //         user.setGender(request.getGender());
    //         user.setAddress(request.getAddress());
    //         user.setPincode(request.getPincode());
    //         user.setState(request.getState());

    //         // Save the user first
    //         User savedUser = userRepository.save(user);
    //         System.out.println("User saved with ID: " + savedUser.getId());

    //         // Create and save the HOD entity
    //         // Hod hod = new Hod(savedUser, request.getDepartment());
    //         // Hod savedHod = hodService.saveHod(hod);
    //         // System.out.println("HOD saved with ID: " + savedHod.getId());

    //         // return ResponseEntity.ok(savedHod);
    //     } catch (Exception e) {
    //         System.err.println("Error in HOD registration: " + e.getMessage());
    //         e.printStackTrace();
    //         return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
    //     }
    // }



    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        Map<String, String> userInfo = new HashMap<>();

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(
                            request.getEmail(), request.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = jwtUtils.generateTokenForUser(authentication);

            userInfo.put("email", user.getEmail());
            userInfo.put("token", jwt);
            userInfo.put("role", user.getRole().name());

            // Fetch teacherId, studentId, or hodId based on role
            if ("TEACHER".equals(user.getRole().name())) {
                teacherRepository.findByUserId(user.getId())
                        .ifPresent(teacher -> userInfo.put("id", String.valueOf(teacher.getId())));
            } else if ("STUDENT".equals(user.getRole().name())) {
                studentRepository.findByUserId(user.getId())
                        .ifPresent(student -> userInfo.put("id", String.valueOf(student.getId())));
            // } else if ("HOD".equals(user.getRole().name())) {
            //     Hod hod = hodService.findByUser(user);
            //     if (hod != null) {
            //         userInfo.put("id", String.valueOf(hod.getId()));
            //     }
            // } else {
                userInfo.put("id", String.valueOf(user.getId())); // fallback
            }

            return userInfo;
        }

        userInfo.put("error", "Invalid email or password");
        return userInfo;
    }

    /**
     * Step 1: Request password reset (send OTP to email)
     */
    @PostMapping("/request-password-reset")
    public ResponseEntity<?> requestPasswordReset(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }
        // Always respond with success to avoid email enumeration
        try {
            if (userRepository.existsByEmail(email)) {
                otpService.generateAndSendOtp(email);
            }
        } catch (MailException e) {
            // Log error, but don't reveal to user
        }
        return ResponseEntity.ok(Map.of("message", "If the email exists, an OTP has been sent."));
    }

    /**
     * Step 2: Verify OTP for password reset
     */
    @PostMapping("/verify-reset-otp")
    public ResponseEntity<?> verifyResetOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and OTP are required"));
        }
        if (otpService.isOtpExpired(email)) {
            return ResponseEntity.status(410).body(Map.of("error", "OTP expired. Please request a new one."));
        }
        boolean valid = otpService.validateOtp(email, otp);
        if (valid) {
            return ResponseEntity.ok(Map.of("message", "OTP verified successfully"));
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid OTP"));
        }
    }

    /**
     * Step 3: Reset password (after OTP verified)
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");
        String otp = request.get("otp");
        if (email == null || newPassword == null || otp == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email, OTP, and new password are required"));
        }
        if (otpService.isOtpExpired(email)) {
            return ResponseEntity.status(410).body(Map.of("error", "OTP expired. Please request a new one."));
        }
        boolean valid = otpService.validateOtp(email, otp);
        if (!valid) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid OTP"));
        }
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            otpService.consumeOtp(email); // Remove OTP after successful reset
        }
        // Always respond with success to avoid email enumeration
        return ResponseEntity.ok(Map.of("message", "Password has been reset if the email exists."));
    }
}
