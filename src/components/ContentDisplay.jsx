import React, { useState, useCallback } from 'react';

const ContentDisplay = ({ content, isLoading }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [imageErrors, setImageErrors] = useState({});

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

  // Optimized image loading with error handling
  const handleImageLoad = useCallback((url) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [url]: false
    }));
  }, []);

  const handleImageError = useCallback((url) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [url]: false
    }));
    setImageErrors(prev => ({
      ...prev,
      [url]: true
    }));
  }, []);

  const handleImageLoadStart = useCallback((url) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [url]: true
    }));
    setImageErrors(prev => ({
      ...prev,
      [url]: false
    }));
  }, []);

  const renderFilePreview = (file, index) => {
    if (!file) return null;

    const isImage = file.contentType && file.contentType.startsWith('image/');
    const fileKey = `${file.url}-${index}`;
    
    if (isImage) {
      const isImageLoading = imageLoadingStates[file.url];
      const hasImageError = imageErrors[file.url];

      return (
        <div className="file-preview image-preview" key={fileKey}>
          {isImageLoading && (
            <div className="image-loading-overlay">
              <div className="spinner"></div>
              <span>Loading image...</span>
            </div>
          )}
          
          {hasImageError ? (
            <div className="image-error-state">
              <div className="error-icon">📷</div>
              <span>Failed to load image</span>
              <button 
                onClick={() => {
                  setImageErrors(prev => ({ ...prev, [file.url]: false }));
                  handleImageLoadStart(file.url);
                }}
                className="btn-retry"
              >
                Retry
              </button>
            </div>
          ) : (
            <img
              src={file.url}
              alt={file.fileName || 'Timeline image'}
              className="content-image"
              onClick={() => setSelectedImage(file)}
              onLoad={() => handleImageLoad(file.url)}
              onError={() => handleImageError(file.url)}
              onLoadStart={() => handleImageLoadStart(file.url)}
              loading="lazy"
              style={{ display: hasImageError ? 'none' : 'block' }}
            />
          )}
          
          {file.fileName && (
            <div className="image-caption">
              {file.fileName}
              {/* Show file size if available for monitoring */}
              {process.env.NODE_ENV === 'development' && file.size && (
                <span className="file-size-debug">
                  ({(file.size / 1024).toFixed(1)}KB)
                </span>
              )}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="file-preview document-preview" key={fileKey}>
          <div className="document-icon">📄</div>
          <div className="document-info">
            <div className="document-name">{file.fileName}</div>
            <div className="document-type">{file.contentType}</div>
            <a 
              href={file.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="document-link"
              onClick={() => {
                // Track document downloads in development
                if (process.env.NODE_ENV === 'development') {
                  console.log('Document downloaded:', file.fileName);
                }
              }}
            >
              View Document
            </a>
          </div>
        </div>
      );
    }
  };

  const closeImageModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  // Handle escape key for modal
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedImage) {
        closeImageModal();
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, closeImageModal]);

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
                  <div key={`file-${index}`} className="file-item">
                    {renderFilePreview(file, index)}
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
      </div>

      {/* Optimized Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={closeImageModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="image-modal-close" 
              onClick={closeImageModal}
              aria-label="Close image"
            >
              ×
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.fileName || 'Full size image'}
              className="modal-image"
              onLoad={() => console.log('Modal image loaded')}
              onError={() => console.error('Modal image failed to load')}
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