package com.notesmanager.controller;

import com.notesmanager.exception.ResourceNotFoundException;
import com.notesmanager.repository.FileRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for file download operations.
 * Files are stored in MongoDB GridFS and served with proper HTTP headers
 * to preserve original filename and content type.
 */
@RestController
@RequestMapping("/api/files")
@Tag(name = "Files", description = "File download and management APIs")
public class FileController {

    private static final Logger log = LoggerFactory.getLogger(FileController.class);
    private static final String DEFAULT_CONTENT_TYPE = "application/octet-stream";

    private final FileRepository fileRepository;

    public FileController(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    @SuppressWarnings("all")
    @GetMapping("/{id}/download")
    @Operation(summary = "Download a file", description = "Download a file by its GridFS ID with original filename and content type preserved")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "File downloaded successfully"),
            @ApiResponse(responseCode = "404", description = "File not found")
    })
    public ResponseEntity<Resource> downloadFile(@PathVariable String id) {
        log.info("GET /api/files/{}/download - Downloading file", id);

        var gridFsResource = fileRepository.getFileResource(id);
        if (gridFsResource == null) {
            throw new ResourceNotFoundException("File", id);
        }

        String contentType = gridFsResource.getContentType();
        if (contentType == null) {
            contentType = DEFAULT_CONTENT_TYPE;
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + gridFsResource.getFilename() + "\"")
                .body(gridFsResource);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a file", description = "Delete a file from GridFS by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "File deleted successfully"),
            @ApiResponse(responseCode = "404", description = "File not found")
    })
    public ResponseEntity<Void> deleteFile(@PathVariable String id) {
        log.info("DELETE /api/files/{} - Deleting file", id);

        var gridFSFile = fileRepository.getFile(id);
        if (gridFSFile == null) {
            throw new ResourceNotFoundException("File", id);
        }

        fileRepository.deleteFile(id);
        return ResponseEntity.noContent().build();
    }
}