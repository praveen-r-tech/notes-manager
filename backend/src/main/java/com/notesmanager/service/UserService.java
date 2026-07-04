package com.notesmanager.service;

import com.notesmanager.dto.AuthResponse;
import com.notesmanager.dto.LoginRequest;
import com.notesmanager.dto.RegisterRequest;

public interface UserService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}