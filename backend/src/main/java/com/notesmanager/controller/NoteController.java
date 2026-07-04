package com.notesmanager.controller;

import com.notesmanager.dto.NoteRequest;
import com.notesmanager.dto.NoteResponse;
import com.notesmanager.dto.PagedResponse;
import com.notesmanager.service.NoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * REST controller for Note CRUD operations.
 * All endpoints are prefixed with /api/notes.
 * Controllers only handle HTTP concerns; business logic is delegated to the service layer.
 */
@RestController
@RequestMapping("/api/notes")
@Tag(name = "Notes", description = "Notes management APIs")
public class NoteController {

    private static final Logger log = LoggerFactory.getLogger(NoteController.class);

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @PostMapping
    @Operation(summary = "Create a new note", description = "Creates a new note with title, content, and optional tags")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Note created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<NoteResponse> createNote(@Valid @RequestBody NoteRequest request) {
        log.info("POST /api/notes - Creating note with title: {}", request.getTitle());
        NoteResponse response = noteService.createNote(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Get all non-archived notes", description = "Returns paginated list of non-archived notes with sorting")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notes retrieved successfully")
    })
    public ResponseEntity<PagedResponse<NoteResponse>> getAllNotes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        log.info("GET /api/notes - page: {}, size: {}", page, size);
        PagedResponse<NoteResponse> response = noteService.getAllNotes(page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a note by ID", description = "Returns a single note by its unique identifier")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Note found"),
            @ApiResponse(responseCode = "404", description = "Note not found")
    })
    public ResponseEntity<NoteResponse> getNoteById(@PathVariable String id) {
        log.info("GET /api/notes/{} - Fetching note", id);
        NoteResponse response = noteService.getNoteById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a note", description = "Updates an existing note's title, content, and tags")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Note updated successfully"),
            @ApiResponse(responseCode = "404", description = "Note not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<NoteResponse> updateNote(
            @PathVariable String id,
            @Valid @RequestBody NoteRequest request) {
        log.info("PUT /api/notes/{} - Updating note", id);
        NoteResponse response = noteService.updateNote(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a note", description = "Deletes a note and its associated file attachment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Note deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Note not found")
    })
    public ResponseEntity<Void> deleteNote(@PathVariable String id) {
        log.info("DELETE /api/notes/{} - Deleting note", id);
        noteService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/pin")
    @Operation(summary = "Toggle pin status", description = "Toggles the pinned status of a note")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pin status toggled"),
            @ApiResponse(responseCode = "404", description = "Note not found")
    })
    public ResponseEntity<NoteResponse> togglePin(@PathVariable String id) {
        log.info("PATCH /api/notes/{}/pin - Toggling pin", id);
        NoteResponse response = noteService.togglePin(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/archive")
    @Operation(summary = "Toggle archive status", description = "Toggles the archived status of a note")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Archive status toggled"),
            @ApiResponse(responseCode = "404", description = "Note not found")
    })
    public ResponseEntity<NoteResponse> toggleArchive(@PathVariable String id) {
        log.info("PATCH /api/notes/{}/archive - Toggling archive", id);
        NoteResponse response = noteService.toggleArchive(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pinned")
    @Operation(summary = "Get pinned notes", description = "Returns paginated list of pinned, non-archived notes")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pinned notes retrieved successfully")
    })
    public ResponseEntity<PagedResponse<NoteResponse>> getPinnedNotes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        log.info("GET /api/notes/pinned - page: {}, size: {}", page, size);
        PagedResponse<NoteResponse> response = noteService.getPinnedNotes(page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/archived")
    @Operation(summary = "Get archived notes", description = "Returns paginated list of archived notes")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Archived notes retrieved successfully")
    })
    public ResponseEntity<PagedResponse<NoteResponse>> getArchivedNotes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        log.info("GET /api/notes/archived - page: {}, size: {}", page, size);
        PagedResponse<NoteResponse> response = noteService.getArchivedNotes(page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    @Operation(summary = "Search notes", description = "Search notes by keyword in title, content, and tags (case-insensitive)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Search results retrieved successfully")
    })
    public ResponseEntity<PagedResponse<NoteResponse>> searchNotes(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        log.info("GET /api/notes/search - keyword: {}, page: {}, size: {}", keyword, page, size);
        PagedResponse<NoteResponse> response = noteService.searchNotes(keyword, page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter notes", description = "Filter notes by pinned, archived status, and tags")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Filtered results retrieved successfully")
    })
    public ResponseEntity<PagedResponse<NoteResponse>> filterNotes(
            @RequestParam(required = false) Boolean pinned,
            @RequestParam(required = false) Boolean archived,
            @RequestParam(required = false) List<String> tags,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        log.info("GET /api/notes/filter - pinned: {}, archived: {}, tags: {}", pinned, archived, tags);
        PagedResponse<NoteResponse> response = noteService.filterNotes(pinned, archived, tags, page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/{id}/attachment", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload attachment", description = "Upload a file attachment to a note (max 20MB)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Attachment uploaded successfully"),
            @ApiResponse(responseCode = "404", description = "Note not found"),
            @ApiResponse(responseCode = "413", description = "File size exceeds limit")
    })
    public ResponseEntity<NoteResponse> uploadAttachment(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {
        log.info("POST /api/notes/{}/attachment - Uploading file: {}", id, file.getOriginalFilename());
        NoteResponse response = noteService.uploadAttachment(id, file);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}/attachment")
    @Operation(summary = "Delete attachment", description = "Delete the file attachment from a note")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Attachment deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Note not found")
    })
    public ResponseEntity<NoteResponse> deleteAttachment(@PathVariable String id) {
        log.info("DELETE /api/notes/{}/attachment - Deleting attachment", id);
        noteService.deleteAttachment(id);
        NoteResponse response = noteService.getNoteById(id);
        return ResponseEntity.ok(response);
    }
}