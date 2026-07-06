package com.notesmanager.mapper;

import com.notesmanager.dto.NoteRequest;
import com.notesmanager.dto.NoteResponse;
import com.notesmanager.entity.Note;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Collections;

/**
 * Maps between Note entity and DTOs.
 * Ensures entities are never exposed to the client layer.
 * Centralizes all mapping logic for consistency.
 */
@Component
public class NoteMapper {

    public NoteResponse toResponse(Note note) {
        if (note == null) return null;
        return new NoteResponse(note.getId(), note.getTitle(), note.getContent(), note.getTags() != null ? note.getTags() : Collections.emptyList(), note.isPinned(), note.isArchived(), note.getAttachmentName(), note.getAttachmentType(), note.getAttachmentSize(), note.getAttachmentId(), note.getCreatedAt(), note.getUpdatedAt());
    }

    @NonNull
    public Note toEntity(NoteRequest request) {
        Note note = new Note();
        note.setTitle(request != null ? request.getTitle() : null);
        note.setContent(request != null ? request.getContent() : null);
        note.setTags(request != null && request.getTags() != null ? request.getTags() : Collections.emptyList());
        note.setPinned(false);
        note.setArchived(false);
        note.setCreatedAt(LocalDateTime.now());
        note.setUpdatedAt(LocalDateTime.now());
        return note;
    }

    public void updateEntity(@NonNull Note note, NoteRequest request) {
        if (note == null || request == null) {
            return;
        }

        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        note.setTags(request.getTags() != null ? request.getTags() : Collections.emptyList());
        note.setUpdatedAt(LocalDateTime.now());
    }
}