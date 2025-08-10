import React from 'react';
import { MessageSquare, Users, Coffee, Briefcase } from 'lucide-react';
import ContactForm from './ContactForm';

const ContactSection = ({ contactForm, setContactForm, submitting, submitSuccess, setSubmitSuccess, handleContactSubmit }) => {
  return (
    <section className="p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-100 rounded-2xl">
              <MessageSquare className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Let's Connect</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have questions about my journey, want to discuss opportunities, or just want to say hello? I'd love to hear from you.
          </p>
        </div>

        {/* Contact Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
            <Briefcase className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-800 mb-2">Job Opportunities</h4>
            <p className="text-sm text-gray-600">Interested in my skills and experience?</p>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-800 mb-2">Collaboration</h4>
            <p className="text-sm text-gray-600">Have a project or idea to discuss?</p>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100">
            <Coffee className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-800 mb-2">Casual Chat</h4>
            <p className="text-sm text-gray-600">Just want to connect and say hi?</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
            <ContactForm 
              contactForm={contactForm}
              setContactForm={setContactForm}
              submitting={submitting}
              submitSuccess={submitSuccess}
              setSubmitSuccess={setSubmitSuccess}
              handleContactSubmit={handleContactSubmit}
            />
          </div>
        </div>

        {/* Additional Contact Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">
            Prefer email? You can also reach me directly at
          </p>
          <a 
            href="mailto:your.email@example.com" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <span>your.email@example.com</span>
          </a>
          <p className="text-sm text-gray-400 mt-4">
            I typically respond within 24-48 hours
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;