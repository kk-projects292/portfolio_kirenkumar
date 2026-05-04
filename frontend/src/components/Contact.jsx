import { useState } from 'react';
import { getApiUrl } from '../utils/api';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      const res = await fetch(getApiUrl('/api/messages'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('Failed to send message.');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('Error occurred.');
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>
        <div className="contact-grid">
          <div className="contact-info">
            <h3>Let's talk about your project!</h3>
            <p>I’m always open to discussing new projects, creative ideas, or opportunities to be part of your visions. Whether you have a fully-fleshed-out brief or just a spark of an idea, I’d love to help you bring it to life. I believe the best work comes from great conversations, so don’t hesitate to reach out—let’s build something impactful together."</p>
            <div className="contact-details">
              <div className="detail-item">
                <strong>Email:</strong> kirenkumar.dev424@gmail.com
              </div>
              <div className="detail-item">
                <strong>Phone:</strong> +91 7845928388
              </div>
              <div className="detail-item">
                <strong>Location:</strong> India
              </div>
            </div>

            <div className="contact-socials">
              <a href="mailto:kirenkumar.dev424@gmail.com" title="Gmail" target="_blank" rel="noopener noreferrer"><img src="https://cdn.simpleicons.org/gmail" alt="Gmail" /></a>
              <a href="https://linkedin.com/in/kirenkumar-dev424/" target="_blank" rel="noreferrer" title="LinkedIn"><img src="https://www.svgrepo.com/show/157006/linkedin.svg" alt="LinkedIn" /></a>
              <a href="https://wa.me/917845928388" target="_blank" rel="noreferrer" title="WhatsApp"><img src="https://cdn.simpleicons.org/whatsapp" alt="WhatsApp" /></a>
              <a href="https://github.com/kk-projects292/" target="_blank" rel="noreferrer" title="GitHub"><img src="https://cdn.simpleicons.org/github/white" alt="GitHub" /></a>
              <a href="https://www.instagram.com/kk_dev424/" target="_blank" rel="noreferrer" title="Instagram"><img src="https://cdn.simpleicons.org/instagram" alt="Instagram" /></a>
            </div>
          </div>
          <form className="contact-form glass-morphism" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Message"
                rows="3"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-full">Send Message</button>
            {status && <p className="status-msg">{status}</p>}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
