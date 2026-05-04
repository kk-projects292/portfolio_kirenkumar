import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiUrl } from '../utils/api';
import './Certificates.css';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImg, setSelectedImg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await fetch(getApiUrl('/api/certificates'));
        const data = await res.json();
        setCertificates(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching certificates:', err);
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const nextSlide = () => {
    if (certificates.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % certificates.length);
    }
  };

  const prevSlide = () => {
    if (certificates.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + certificates.length) % certificates.length);
    }
  };

  useEffect(() => {
    if (!selectedImg && certificates.length > 0) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [selectedImg, certificates.length]);

  return (
    <section id="certificates" className="certificates-section">
      <div className="container">
        <h2 className="section-title">Certifications</h2>
        
        {loading ? (
          <p className="loading-text">Loading certificates...</p>
        ) : certificates.length === 0 ? (
          <p className="no-certs-text">No certificates added yet.</p>
        ) : (
          <>
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
                      <div className="cert-image" onClick={() => setSelectedImg(certificates[currentIndex].imageUrl)}>
                        <img src={certificates[currentIndex].imageUrl.startsWith('http') ? certificates[currentIndex].imageUrl : getApiUrl(certificates[currentIndex].imageUrl)} alt={certificates[currentIndex].title} />
                        <div className="zoom-overlay">
                          <span>View Full Size</span>
                        </div>
                      </div>
                      <div className="cert-info">
                        <span className="cert-date">{new Date(certificates[currentIndex].issueDate).getFullYear()}</span>
                        <h3>{certificates[currentIndex].title}</h3>
                        <p>{certificates[currentIndex].issuer}</p>
                        {certificates[currentIndex].description && (
                          <p className="cert-description">{certificates[currentIndex].description}</p>
                        )}
                        {certificates[currentIndex].credentialUrl && (
                          <a href={certificates[currentIndex].credentialUrl} target="_blank" rel="noopener noreferrer" className="cert-link">View Credential →</a>
                        )}
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
          </>
        )}
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
