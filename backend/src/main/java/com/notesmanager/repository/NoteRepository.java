package com.notesmanager.repository;

import com.notesmanager.entity.Note;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Note entity.
 * Provides CRUD operations and custom query methods for MongoDB.
 * Uses Spring Data MongoDB's derived query methods and custom @Query annotations.
 */
@Repository
public interface NoteRepository extends MongoRepository<Note, String> {

    Page<Note> findByArchivedFalse(Pageable pageable);

    Page<Note> findByPinnedTrueAndArchivedFalse(Pageable pageable);

    Page<Note> findByArchivedTrue(Pageable pageable);

    List<Note> findByPinnedTrueAndArchivedFalse();

    @Query("{ 'archived': false, 'title': { $regex: ?0, $options: 'i' } }")
    Page<Note> searchByTitle(String title, Pageable pageable);

    @Query("{ 'archived': false, 'content': { $regex: ?0, $options: 'i' } }")
    Page<Note> searchByContent(String content, Pageable pageable);

    @Query("{ 'archived': false, 'tags': { $in: ?0 } }")
    Page<Note> findByTags(List<String> tags, Pageable pageable);

    @Query("{ 'archived': false, $or: [ " +
            "{ 'title': { $regex: ?0, $options: 'i' } }, " +
            "{ 'content': { $regex: ?0, $options: 'i' } }, " +
            "{ 'tags': { $regex: ?0, $options: 'i' } } " +
            "] }")
    Page<Note> searchAll(String keyword, Pageable pageable);
}