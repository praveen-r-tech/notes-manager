package com.notesmanager.exception;

/**
 * Exception thrown when a requested resource (note or file) is not found.
 * Maps to HTTP 404 Not Found status code.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resourceType, String id) {
        super(resourceType + " not found with id: " + id);
    }
}