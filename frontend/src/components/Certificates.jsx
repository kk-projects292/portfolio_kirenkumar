import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Certificates.css';

const certificates = [
  {
    id: 1,
    title: "MERN Stack Developer",
    issuer: "Udemy",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    date: "2024"
  },
  {
    id: 2,
    title: "Full Stack Web Development",
    issuer: "Coursera",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    date: "2023"
  },
  {
    id: 3,
    title: "JavaScript Algorithms & Data Structures",
    issuer: "FreeCodeCamp",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    date: "2023"
  },
  {
    id: 4,
    title: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    date: "2024"
  }
];

const Certificates = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImg, setSelectedImg] = useState(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % certificates.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + certificates.length) % certificates.length);
  };

  useEffect(() => {
    if (!selectedImg) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [selectedImg]);

  return (
    <section id="certificates" className="certificates-section">
      <div className="container">
        <h2 className="section-title">Certifications</h2>
        <div className="slider-wrapper">
          <button className="slider-btn prev" onClick={prevSlide}>&lsaquo;</button>
          
          <div className="slider-container">
            <AnimatePresence mode='wait'>
              <motion.div 
                key={currentIndex}
                className="certificate-slide"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <div className="cert-card glass-morphism">
                  <div className="cert-image" onClick={() => setSelectedImg(certificates[currentIndex].image)}>
                    <img src={certificates[currentIndex].image} alt={certificates[currentIndex].title} />
                    <div className="zoom-overlay">
                      <span>View Full Size</span>
                    </div>
                  </div>
                  <div className="cert-info">
                    <span className="cert-date">{certificates[currentIndex].date}</span>
                    <h3>{certificates[currentIndex].title}</h3>
                    <p>{certificates[currentIndex].issuer}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button className="slider-btn next" onClick={nextSlide}>&rsaquo;</button>
        </div>
        
        <div className="slider-dots">
          {certificates.map((_, index) => (
            <span 
              key={index} 
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            className="cert-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <img src={selectedImg} alt="Full Certificate" />
              <button className="close-modal" onClick={() => setSelectedImg(null)}>&times;</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certificates;
