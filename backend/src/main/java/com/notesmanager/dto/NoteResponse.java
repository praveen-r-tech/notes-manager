package com.notesmanager.dto;

import java.time.LocalDateTime;
import java.util.List;

public class NoteResponse {
    private String id;
    private String title;
    private String content;
    private List<String> tags;
    private boolean pinned;
    private boolean archived;
    private String attachmentName;
    private String attachmentType;
    private Long attachmentSize;
    private String attachmentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public NoteResponse() {}

    public NoteResponse(String id, String title, String content, List<String> tags, boolean pinned, boolean archived,
                        String attachmentName, String attachmentType, Long attachmentSize, String attachmentId,
                        LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id; this.title = title; this.content = content; this.tags = tags;
        this.pinned = pinned; this.archived = archived; this.attachmentName = attachmentName;
        this.attachmentType = attachmentType; this.attachmentSize = attachmentSize; this.attachmentId = attachmentId;
        this.createdAt = createdAt; this.updatedAt = updatedAt;
    }

    public String getId() { return id; } public void setId(String id) { this.id = id; }
    public String getTitle() { return title; } public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; } public void setContent(String content) { this.content = content; }
    public List<String> getTags() { return tags; } public void setTags(List<String> tags) { this.tags = tags; }
    public boolean isPinned() { return pinned; } public void setPinned(boolean pinned) { this.pinned = pinned; }
    public boolean isArchived() { return archived; } public void setArchived(boolean archived) { this.archived = archived; }
    public String getAttachmentName() { return attachmentName; } public void setAttachmentName(String n) { this.attachmentName = n; }
    public String getAttachmentType() { return attachmentType; } public void setAttachmentType(String t) { this.attachmentType = t; }
    public Long getAttachmentSize() { return attachmentSize; } public void setAttachmentSize(Long s) { this.attachmentSize = s; }
    public String getAttachmentId() { return attachmentId; } public void setAttachmentId(String id) { this.attachmentId = id; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime d) { this.createdAt = d; }
    public LocalDateTime getUpdatedAt() { return updatedAt; } public void setUpdatedAt(LocalDateTime d) { this.updatedAt = d; }
}