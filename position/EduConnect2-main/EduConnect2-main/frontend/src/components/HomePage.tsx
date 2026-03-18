import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  CheckCircle, 
  Send,
  User,
  AtSign,
  MessageSquare
} from 'lucide-react';
import Lottie from 'lottie-react';
import AnimatedLogo from '../animated new.json';
import toast from 'react-hot-toast';
import { contactApi } from '../services/api';

const HomePage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'home' | 'about' | 'contact' | 'feedback'>('home');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Call the contact API service
      const result = await contactApi.submitContactForm(
        formData.name,
        formData.email,
        'Contact from Website', // Subject
        formData.message
      );
      
      if (result.success) {
        toast.success('Message sent successfully! We will get back to you soon.');
        // Reset form
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      } else {
        toast.error(result.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending contact form:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  const scrollToSection = (section: 'home' | 'about' | 'contact' | 'feedback') => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const quotes = [
    {
      text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
      author: "Malcolm X"
    },
    {
      text: "The beautiful thing about learning is that no one can take it away from you.",
      author: "B.B. King"
    },
    {
      text: "Education is not the filling of a pail, but the lighting of a fire.",
      author: "W.B. Yeats"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-16 h-16">
                <Lottie 
                  animationData={AnimatedLogo} 
                  loop={true}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <h1 className="text-xl font-bold text-indigo-800 ml-2">EduConnect</h1>
            </div>
            <div className="hidden md:flex space-x-6">
              <button 
                onClick={() => scrollToSection('home')}
                className={`font-medium transition-colors ${activeSection === 'home' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className={`font-medium transition-colors ${activeSection === 'about' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className={`font-medium transition-colors ${activeSection === 'contact' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
              >
                Contact
              </button>
              <button 
                onClick={() => scrollToSection('feedback')}
                className={`font-medium transition-colors ${activeSection === 'feedback' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
              >
                Feedback
              </button>
            </div>
            <div className="flex space-x-3">
              <motion.button 
                onClick={() => navigate('/login-selection')}
                className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Home Section */}
      <section id="home" className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="flex flex-col md:flex-row items-center justify-between"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-indigo-900 leading-tight"
                variants={itemVariants}
              >
                Connecting Students & Teachers
                <span className="text-indigo-600"> Seamlessly</span>
              </motion.h1>
              <motion.p 
                className="mt-6 text-lg text-gray-600 max-w-lg"
                variants={itemVariants}
              >
                A modern platform designed to facilitate efficient communication and scheduling between students and faculty members.
              </motion.p>
              <motion.div 
                className="mt-8 flex flex-wrap gap-4"
                variants={itemVariants}
              >
                <motion.button 
                  onClick={() => navigate('/login-selection')}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.button>
                <motion.button 
                  onClick={() => scrollToSection('about')}
                  className="px-6 py-3 bg-white text-indigo-600 border border-indigo-200 rounded-lg shadow-lg hover:bg-indigo-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </motion.div>
            </div>
            <motion.div 
              className="md:w-1/2"
              variants={itemVariants}
            >
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-10 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Students and teachers collaborating" 
                  className="relative rounded-2xl shadow-2xl z-10 max-w-full h-auto"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Quotes Section */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            {quotes.map((quote, index) => (
              <motion.div 
                key={index}
                className="bg-white/70 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-indigo-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
              >
                <p className="text-gray-700 italic mb-4">"{quote.text}"</p>
                <p className="text-indigo-600 font-medium text-right">— {quote.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-gradient-to-br from-indigo-900 to-blue-800 text-white">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Our Platform</h2>
            <p className="max-w-2xl mx-auto text-indigo-100">
              EduConnect is designed to bridge the gap between students and teachers, making educational interactions more efficient and productive.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              <Calendar className="h-10 w-10 text-indigo-300 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Scheduling</h3>
              <p className="text-indigo-100">
                Easily view teacher availability and schedule appointments during free time slots.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              <Clock className="h-10 w-10 text-indigo-300 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-indigo-100">
                Get instant notifications about appointment approvals, rejections, and schedule changes.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              <CheckCircle className="h-10 w-10 text-indigo-300 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Appointment Tracking</h3>
              <p className="text-indigo-100">
                Keep track of all your appointments, their status, and history in one place.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              <User className="h-10 w-10 text-indigo-300 mb-4" />
              <h3 className="text-xl font-semibold mb-2">User-Friendly Interface</h3>
              <p className="text-indigo-100">
                Intuitive design that makes navigation and usage simple for both students and teachers.
              </p>
            </motion.div>
          </div>

          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.button 
              onClick={() => navigate('/login-selection')}
              className="px-8 py-3 bg-white text-indigo-700 rounded-lg shadow-lg hover:bg-indigo-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Our Platform
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Get In Touch</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Have questions about our platform? Reach out to us and we'll get back to you as soon as possible.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleFormSubmit} className="bg-white/80 backdrop-blur-lg rounded-xl p-8 shadow-xl border border-indigo-100">
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <User size={16} className="mr-2" />
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <AtSign size={16} className="mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MessageSquare size={16} className="mr-2" />
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="How can we help you?"
                    required
                  ></textarea>
                </div>
                <motion.button
                  type="submit"
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </motion.button>
              </form>
            </motion.div>

            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-8 shadow-xl border border-indigo-100 h-full">
                <h3 className="text-2xl font-semibold text-indigo-800 mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-indigo-600 mt-1 mr-4" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <a href="mailto:nehulkarvedant@gmail.com" className="text-indigo-600 hover:text-indigo-800 transition-colors">
                        nehulkarvedant@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-indigo-600 mt-1 mr-4" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">Vedant Nehulkar: +91 8855926156</p>
                      <p className="text-gray-600">Anand Lavhale: +91 7058341534</p>
                      <p className="text-gray-600">Pawan Patil: +91 8999848477</p>
                      <p className="text-gray-600">Yashada Mathad: +91 7588184040</p>
                      <p className="text-gray-500 text-sm">Monday to Friday, 9am to 6pm</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-indigo-600 mt-1 mr-4" />
                    <div>
                      <p className="font-medium text-gray-900">Address</p>
                      <p className="text-gray-600">
                        PICT college<br />
                        Survey No. 27, Near Trimurti Chowk, Dhankawadi<br />
                        Pune-411043, Maharashtra (India)
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.575932280651!2d73.84861121391165!3d18.45741167544403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2eac85230ba47%3A0x871eddd0a8a0a108!2sPICT%20-%20Pune%20Institute%20of%20Computer%20Technology!5e0!3m2!1sen!2sin!4v1687359572968!5m2!1sen!2sin" 
                    width="100%" 
                    height="200" 
                    style={{ border: 0, borderRadius: '0.5rem' }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Map"
                  ></iframe>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section id="feedback" className="py-16 px-4 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">We Value Your Feedback</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Your opinion matters to us! Help us improve EduConnect by sharing your experience.
            </p>
          </motion.div>

          <motion.div
            className="max-w-xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-8 shadow-xl border border-indigo-100">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
                <p className="text-gray-700 text-lg">
                  Your feedback helps us create a better platform for students and teachers.
                </p>
              </div>
              <motion.a 
                href="https://forms.gle/SCkdQgjpSGxPz8cq8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Share Your Feedback
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="w-12 h-12">
                <Lottie 
                  animationData={AnimatedLogo} 
                  loop={true}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <h2 className="text-2xl font-bold ml-2">EduConnect</h2>
            </div>
            <div className="flex space-x-6">
              <a href="#home" className="hover:text-indigo-300 transition-colors">Home</a>
              <a href="#about" className="hover:text-indigo-300 transition-colors">About</a>
              <a href="#contact" className="hover:text-indigo-300 transition-colors">Contact</a>
              <a href="#feedback" className="hover:text-indigo-300 transition-colors">Feedback</a>
            </div>
          </div>
          <hr className="border-indigo-800 my-8" />
          <div className="text-center text-indigo-300 text-sm">
            <p>&copy; {new Date().getFullYear()} EduConnect. All rights reserved.</p>
            <p className="mt-2">Designed with ❤️ for students and teachers</p>
          </div>
        </div>
      </footer>

      {/* Floating back to top button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-3 bg-indigo-600 text-white rounded-full shadow-lg z-50"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </motion.button>

      {/* Add some custom styles for animations */}
      <style>
        {`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}
      </style>
    </div>
  );
};

export default HomePage;