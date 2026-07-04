package com.notesmanager.repository;

import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

/**
 * Repository for file storage operations using MongoDB GridFS.
 * GridFS is ideal for storing files larger than the 16MB BSON document size limit.
 * Provides upload, download, and delete operations for file attachments.
 */
@Repository
public class FileRepository {

    private final GridFsOperations gridFsOperations;

    public FileRepository(GridFsOperations gridFsOperations) {
        this.gridFsOperations = gridFsOperations;
    }

    public String uploadFile(MultipartFile file) throws IOException {
        try (InputStream inputStream = file.getInputStream()) {
            ObjectId fileId = gridFsOperations.store(
                    inputStream,
                    file.getOriginalFilename(),
                    file.getContentType()
            );
            return fileId.toString();
        }
    }

    public GridFSFile getFile(String fileId) {
        return gridFsOperations.findOne(
                Query.query(Criteria.where("_id").is(fileId))
        );
    }

    public GridFsResource getFileResource(String fileId) {
        GridFSFile gridFSFile = getFile(fileId);
        if (gridFSFile == null) {
            return null;
        }
        return gridFsOperations.getResource(gridFSFile);
    }

    public void deleteFile(String fileId) {
        gridFsOperations.delete(
                Query.query(Criteria.where("_id").is(fileId))
        );
    }
}