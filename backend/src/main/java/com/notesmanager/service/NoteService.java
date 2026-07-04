package com.notesmanager.service;

import com.notesmanager.dto.NoteRequest;
import com.notesmanager.dto.NoteResponse;
import com.notesmanager.dto.PagedResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Service interface for Note operations.
 * Defines the contract for all business logic related to notes.
 * Implementations handle CRUD, search, filter, pin, archive, and file attachment operations.
 */
public interface NoteService {

    NoteResponse createNote(NoteRequest request);

    NoteResponse getNoteById(String id);

    PagedResponse<NoteResponse> getAllNotes(int page, int size, String sortBy, String sortDir);

    NoteResponse updateNote(String id, NoteRequest request);

    void deleteNote(String id);

    NoteResponse togglePin(String id);

    NoteResponse toggleArchive(String id);

    PagedResponse<NoteResponse> getPinnedNotes(int page, int size, String sortBy, String sortDir);

    PagedResponse<NoteResponse> getArchivedNotes(int page, int size, String sortBy, String sortDir);

    PagedResponse<NoteResponse> searchNotes(String keyword, int page, int size, String sortBy, String sortDir);

    PagedResponse<NoteResponse> filterNotes(Boolean pinned, Boolean archived, List<String> tags, int page, int size, String sortBy, String sortDir);

    NoteResponse uploadAttachment(String noteId, MultipartFile file);

    void deleteAttachment(String noteId);
}