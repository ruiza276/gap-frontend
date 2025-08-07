import { useState, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://your-backend-api.azurewebsites.net/api';

export const useContactForm = () => {
  const [contactForm, setContactForm] = useState({ 
    name: '', 
    email: '', 
    message: '' 
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Validate form data
   */
  const validateForm = useCallback((formData) => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }

    return errors;
  }, []);

  /**
   * Submit contact form
   */
  const handleContactSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm(contactForm);
    if (Object.keys(validationErrors).length > 0) {
      setError('Please fix the form errors before submitting');
      return false;
    }

    setSubmitting(true);
    setError(null);
    
    try {
      // Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}/messages`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     ...contactForm,
      //     timestamp: new Date().toISOString(),
      //     userAgent: navigator.userAgent,
      //     referrer: document.referrer
      //   })
      // });
      
      // if (!response.ok) {
      //   throw new Error(`Failed to send message: ${response.statusText}`);
      // }
      
      // const result = await response.json();

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and show success
      setContactForm({ name: '', email: '', message: '' });
      setSubmitSuccess(true);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);

      return true;
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setError(err.message || 'Failed to send message. Please try again.');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [contactForm, validateForm]);

  /**
   * Update form field
   */
  const updateField = useCallback((field, value) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  }, [error]);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setContactForm({ name: '', email: '', message: '' });
    setSubmitSuccess(false);
    setError(null);
  }, []);

  /**
   * Get form validation state
   */
  const getFieldError = useCallback((field) => {
    if (!error) return null;
    const errors = validateForm(contactForm);
    return errors[field] || null;
  }, [error, contactForm, validateForm]);

  /**
   * Check if form is valid
   */
  const isFormValid = useCallback(() => {
    const errors = validateForm(contactForm);
    return Object.keys(errors).length === 0;
  }, [contactForm, validateForm]);

  /**
   * Check if form has been modified
   */
  const isFormDirty = useCallback(() => {
    return contactForm.name !== '' || 
           contactForm.email !== '' || 
           contactForm.message !== '';
  }, [contactForm]);

  return {
    // State
    contactForm,
    submitting,
    submitSuccess,
    error,

    // Methods
    setContactForm,
    setSubmitSuccess,
    handleContactSubmit,
    updateField,
    resetForm,

    // Validation
    getFieldError,
    isFormValid,
    isFormDirty,
    validateForm
  };
};