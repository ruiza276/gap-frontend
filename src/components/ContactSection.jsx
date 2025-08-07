import React from 'react';
import { MessageSquare } from 'lucide-react';
import ContactForm from './ContactForm';

const ContactSection = ({ contactForm, setContactForm, submitting, submitSuccess, setSubmitSuccess, handleContactSubmit }) => {
  return (
    <section className="bg-white rounded-lg shadow-sm p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Get In Touch</h2>
          <p className="text-gray-600">
            Have questions about my journey or want to connect? I'd love to hear from you.
          </p>
        </div>

        <ContactForm 
          contactForm={contactForm}
          setContactForm={setContactForm}
          submitting={submitting}
          submitSuccess={submitSuccess}
          setSubmitSuccess={setSubmitSuccess}
          handleContactSubmit={handleContactSubmit}
        />
      </div>
    </section>
  );
};

export default ContactSection;