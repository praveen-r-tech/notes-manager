package com.notesmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Notes Manager Backend Application.
 * This class bootstraps the Spring Boot application and starts the embedded server.
 */
@SpringBootApplication
public class NotesManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(NotesManagerApplication.class, args);
    }
}