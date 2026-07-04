package com.notesmanager.service.impl;

import com.notesmanager.dto.NoteRequest;
import com.notesmanager.dto.NoteResponse;
import com.notesmanager.dto.PagedResponse;
import com.notesmanager.entity.Note;
import com.notesmanager.exception.FileStorageException;
import com.notesmanager.exception.ResourceNotFoundException;
import com.notesmanager.mapper.NoteMapper;
import com.notesmanager.repository.FileRepository;
import com.notesmanager.repository.NoteRepository;
import com.notesmanager.service.NoteService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Implementation of NoteService interface.
 * Contains all business logic for note management including CRUD, search, filter,
 * pin/archive operations, and file attachment handling.
 * Uses constructor injection and never exposes entities to the controller layer.
 */
@Service
@Transactional
public class NoteServiceImpl implements NoteService {

    private static final Logger log = LoggerFactory.getLogger(NoteServiceImpl.class);

    private final NoteRepository noteRepository;
    private final FileRepository fileRepository;
    private final NoteMapper noteMapper;

    public NoteServiceImpl(NoteRepository noteRepository,
                           FileRepository fileRepository,
                           NoteMapper noteMapper) {
        this.noteRepository = noteRepository;
        this.fileRepository = fileRepository;
        this.noteMapper = noteMapper;
    }

    @Override
    public NoteResponse createNote(NoteRequest request) {
        log.info("Creating new note with title: {}", request.getTitle());
        Note note = noteMapper.toEntity(request);
        Note savedNote = noteRepository.save(note);
        log.info("Note created successfully with id: {}", savedNote.getId());
        return noteMapper.toResponse(savedNote);
    }

    @Override
    public NoteResponse getNoteById(String id) {
        log.info("Fetching note by id: {}", id);
        Note note = findNoteById(id);
        return noteMapper.toResponse(note);
    }

    @Override
    public PagedResponse<NoteResponse> getAllNotes(int page, int size, String sortBy, String sortDir) {
        log.info("Fetching all notes - page: {}, size: {}, sortBy: {}, sortDir: {}", page, size, sortBy, sortDir);
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<Note> notePage = noteRepository.findByArchivedFalse(pageable);
        return buildPagedResponse(notePage);
    }

    @Override
    public NoteResponse updateNote(String id, NoteRequest request) {
        log.info("Updating note with id: {}", id);
        Note note = findNoteById(id);
        noteMapper.updateEntity(note, request);
        Note updatedNote = noteRepository.save(note);
        log.info("Note updated successfully with id: {}", id);
        return noteMapper.toResponse(updatedNote);
    }

    @Override
    public void deleteNote(String id) {
        log.info("Deleting note with id: {}", id);
        Note note = findNoteById(id);

        // Delete associated file if exists
        if (note.getAttachmentId() != null) {
            deleteAttachmentFile(note.getAttachmentId());
        }

        noteRepository.delete(note);
        log.info("Note deleted successfully with id: {}", id);
    }

    @Override
    public NoteResponse togglePin(String id) {
        log.info("Toggling pin for note with id: {}", id);
        Note note = findNoteById(id);
        note.setPinned(!note.isPinned());
        note.setUpdatedAt(LocalDateTime.now());
        Note savedNote = noteRepository.save(note);
        log.info("Pin toggled to {} for note id: {}", savedNote.isPinned(), id);
        return noteMapper.toResponse(savedNote);
    }

    @Override
    public NoteResponse toggleArchive(String id) {
        log.info("Toggling archive for note with id: {}", id);
        Note note = findNoteById(id);
        note.setArchived(!note.isArchived());
        note.setUpdatedAt(LocalDateTime.now());
        Note savedNote = noteRepository.save(note);
        log.info("Archive toggled to {} for note id: {}", savedNote.isArchived(), id);
        return noteMapper.toResponse(savedNote);
    }

    @Override
    public PagedResponse<NoteResponse> getPinnedNotes(int page, int size, String sortBy, String sortDir) {
        log.info("Fetching pinned notes - page: {}, size: {}", page, size);
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<Note> notePage = noteRepository.findByPinnedTrueAndArchivedFalse(pageable);
        return buildPagedResponse(notePage);
    }

    @Override
    public PagedResponse<NoteResponse> getArchivedNotes(int page, int size, String sortBy, String sortDir) {
        log.info("Fetching archived notes - page: {}, size: {}", page, size);
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<Note> notePage = noteRepository.findByArchivedTrue(pageable);
        return buildPagedResponse(notePage);
    }

    @Override
    public PagedResponse<NoteResponse> searchNotes(String keyword, int page, int size, String sortBy, String sortDir) {
        log.info("Searching notes with keyword: {} - page: {}, size: {}", keyword, page, size);
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<Note> notePage = noteRepository.searchAll(keyword, pageable);
        return buildPagedResponse(notePage);
    }

    @Override
    public PagedResponse<NoteResponse> filterNotes(Boolean pinned, Boolean archived, List<String> tags,
                                                    int page, int size, String sortBy, String sortDir) {
        log.info("Filtering notes - pinned: {}, archived: {}, tags: {}", pinned, archived, tags);
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<Note> notePage;

        if (tags != null && !tags.isEmpty()) {
            notePage = noteRepository.findByTags(tags, pageable);
        } else if (Boolean.TRUE.equals(pinned)) {
            notePage = noteRepository.findByPinnedTrueAndArchivedFalse(pageable);
        } else if (Boolean.TRUE.equals(archived)) {
            notePage = noteRepository.findByArchivedTrue(pageable);
        } else {
            notePage = noteRepository.findByArchivedFalse(pageable);
        }

        return buildPagedResponse(notePage);
    }

    @Override
    public NoteResponse uploadAttachment(String noteId, MultipartFile file) {
        log.info("Uploading attachment for note id: {} - filename: {}", noteId, file.getOriginalFilename());
        Note note = findNoteById(noteId);

        // Delete existing attachment if any
        if (note.getAttachmentId() != null) {
            deleteAttachmentFile(note.getAttachmentId());
        }

        try {
            String fileId = fileRepository.uploadFile(file);
            note.setAttachmentId(fileId);
            note.setAttachmentName(file.getOriginalFilename());
            note.setAttachmentType(file.getContentType());
            note.setAttachmentSize(file.getSize());
            note.setUpdatedAt(LocalDateTime.now());

            Note savedNote = noteRepository.save(note);
            log.info("Attachment uploaded successfully for note id: {}", noteId);
            return noteMapper.toResponse(savedNote);
        } catch (IOException e) {
            log.error("Failed to upload attachment for note id: {}", noteId, e);
            throw new FileStorageException("Failed to upload file: " + file.getOriginalFilename(), e);
        }
    }

    @Override
    public void deleteAttachment(String noteId) {
        log.info("Deleting attachment for note id: {}", noteId);
        Note note = findNoteById(noteId);

        if (note.getAttachmentId() != null) {
            deleteAttachmentFile(note.getAttachmentId());
            note.setAttachmentId(null);
            note.setAttachmentName(null);
            note.setAttachmentType(null);
            note.setAttachmentSize(null);
            note.setUpdatedAt(LocalDateTime.now());
            noteRepository.save(note);
            log.info("Attachment deleted successfully for note id: {}", noteId);
        }
    }

    private Note findNoteById(String id) {
        return noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note", id));
    }

    private void deleteAttachmentFile(String fileId) {
        try {
            fileRepository.deleteFile(fileId);
        } catch (Exception e) {
            log.error("Failed to delete file with id: {}", fileId, e);
        }
    }

    private Pageable createPageable(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return PageRequest.of(page, size, sort);
    }

    private PagedResponse<NoteResponse> buildPagedResponse(Page<Note> notePage) {
        List<NoteResponse> content = notePage.getContent()
                .stream()
                .map(noteMapper::toResponse)
                .toList();

        return new PagedResponse<>(content, notePage.getNumber(), notePage.getSize(), notePage.getTotalElements(), notePage.getTotalPages(), notePage.isLast(), notePage.isFirst());
    }
}