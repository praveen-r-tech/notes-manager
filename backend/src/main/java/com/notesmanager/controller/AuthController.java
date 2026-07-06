package com.notesmanager.controller;

import com.notesmanager.dto.AuthResponse;
import com.notesmanager.dto.LoginRequest;
import com.notesmanager.dto.RegisterRequest;
import com.notesmanager.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${ALLOWED_ORIGINS:http://localhost:3000}")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        boolean exists = userService.emailExists(email);
        if (exists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("exists", true));
        }
        return ResponseEntity.ok(Map.of("exists", false));
    }
}
