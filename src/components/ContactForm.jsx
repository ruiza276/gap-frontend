import React, { useState, useCallback } from 'react';
import { apiService, debounce } from '../services/apiService';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Debounced input change handler to prevent excessive state updates
  const debouncedInputChange = useCallback(
    debounce((name, value) => {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }, 200), // 200ms debounce
    []
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update immediately for UI responsiveness
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Also trigger debounced update for any side effects
    debouncedInputChange(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Prevent double submissions
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await apiService.sendMessage(formData);
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      
      // Auto-hide error message after 8 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form-container">
      <div className="contact-form">
        {submitStatus === 'success' && (
          <div className="alert alert-success">
            <div className="alert-icon">✓</div>
            <div>
              <strong>Message sent successfully!</strong>
              <p>Thank you for reaching out. I'll get back to you soon.</p>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="alert alert-error">
            <div className="alert-icon">⚠</div>
            <div>
              <strong>Failed to send message</strong>
              <p>Please try again or contact me directly. Check your connection and retry.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Your full name"
                disabled={isSubmitting}
                autoComplete="name"
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="your.email@example.com"
                disabled={isSubmitting}
                autoComplete="email"
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="subject" className="form-label">Subject *</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className={`form-input ${errors.subject ? 'error' : ''}`}
              placeholder="What's this about?"
              disabled={isSubmitting}
              autoComplete="off"
            />
            {errors.subject && <span className="form-error">{errors.subject}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className={`form-textarea ${errors.message ? 'error' : ''}`}
              rows="6"
              placeholder="Tell me about your project, question, or just say hello!"
              disabled={isSubmitting}
            />
            {errors.message && <span className="form-error">{errors.message}</span>}
          </div>

          <button 
            type="submit"
            className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </form>

        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            background: '#f5f5f5', 
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#666'
          }}>
            <strong>Dev Info:</strong>
            <br />API Service Stats: {JSON.stringify(apiService.getStats(), null, 2)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactForm;