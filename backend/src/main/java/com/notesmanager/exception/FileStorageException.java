package com.notesmanager.exception;

/**
 * Exception thrown when file upload/download operations fail.
 * Maps to HTTP 500 Internal Server Error status code.
 */
public class FileStorageException extends RuntimeException {

    public FileStorageException(String message, Throwable cause) {
        super(message, cause);
    }

    public FileStorageException(String message) {
        super(message);
    }
}