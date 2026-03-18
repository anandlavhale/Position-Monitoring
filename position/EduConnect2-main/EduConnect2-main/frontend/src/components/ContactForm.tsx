import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactApi } from '../services/api';

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name || !email || !subject || !message) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const result = await contactApi.submitContactForm(name, email, subject, message);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to send message');
      }

      // Success
      setSubmitSuccess(true);
      toast.success('Your message has been sent successfully!');
      
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      
      // Reset success state after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Us</h2>
      
      {submitSuccess ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6 flex items-start">
          <CheckCircle className="text-green-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
          <div>
            <p className="text-green-800 font-medium">Message sent successfully!</p>
            <p className="text-green-700 mt-1">We'll get back to you as soon as possible.</p>
          </div>
        </div>
      ) : null}
      
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 flex items-start">
          <AlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
          <p className="text-red-800">{error}</p>
        </div>
      ) : null}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Your name"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Your email address"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Subject of your message"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Your message"
          ></textarea>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center justify-center w-full py-2 px-4 rounded-md text-white font-medium ${
            isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
          } transition-colors duration-300`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2" size={18} />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm; 