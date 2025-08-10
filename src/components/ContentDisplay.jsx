import React, { useState } from 'react';

const ContentDisplay = ({ content, isLoading }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const renderFilePreview = (file) => {
    if (!file) return null;

    const isImage = file.contentType && file.contentType.startsWith('image/');
    
    if (isImage) {
      return (
        <div className="file-preview image-preview">
          <img
            src={file.url}
            alt={file.fileName || 'Timeline image'}
            className="content-image"
            onClick={() => setSelectedImage(file)}
            loading="lazy"
          />
          {file.fileName && (
            <div className="image-caption">
              {file.fileName}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="file-preview document-preview">
          <div className="document-icon">📄</div>
          <div className="document-info">
            <div className="document-name">{file.fileName}</div>
            <div className="document-type">{file.contentType}</div>
            <a 
              href={file.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="document-link"
            >
              View Document
            </a>
          </div>
        </div>
      );
    }
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (isLoading) {
    return (
      <div className="content-display loading">
        <div className="loading-container">
          <div className="spinner large"></div>
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="content-display empty">
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No content selected</h3>
          <p>Select a date from the calendar to view timeline content.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="content-display">
        <div className="content-header">
          <div className="content-date">
            <div className="date-icon">📅</div>
            <span>{formatDate(content.date)}</span>
          </div>
          
          {content.category && (
            <div className={`content-category category-${content.category.toLowerCase()}`}>
              {content.category}
            </div>
          )}
        </div>

        <div className="content-body">
          {content.title && (
            <h2 className="content-title">{content.title}</h2>
          )}

          {content.description && (
            <div className="content-description">
              {content.description.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          )}

          {content.files && content.files.length > 0 && (
            <div className="content-files">
              <h3 className="files-title">Attachments</h3>
              <div className="files-grid">
                {content.files.map((file, index) => (
                  <div key={index} className="file-item">
                    {renderFilePreview(file)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {content.tags && content.tags.length > 0 && (
            <div className="content-tags">
              <div className="tags-label">Tags:</div>
              <div className="tags-list">
                {content.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

{/* Uncomment if you want to display created/updated metadata
{/*         {(content.createdAt || content.updatedAt) && (
          <div className="content-footer">
            <div className="content-metadata">
              {content.createdAt && (
                <div className="metadata-item">
                  <span className="metadata-label">Created:</span>
                  <span className="metadata-value">
                    {new Date(content.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              {content.updatedAt && content.updatedAt !== content.createdAt && (
                <div className="metadata-item">
                  <span className="metadata-label">Updated:</span>
                  <span className="metadata-value">
                    {new Date(content.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )} */}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={closeImageModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={closeImageModal}>
              ×
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.fileName || 'Full size image'}
              className="modal-image"
            />
            {selectedImage.fileName && (
              <div className="modal-image-caption">
                {selectedImage.fileName}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ContentDisplay;