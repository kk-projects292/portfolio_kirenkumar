import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getApiUrl } from '../utils/api';
import './Hero.css';

const Hero = () => {
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(getApiUrl('/api/auth/profile'));
        const data = await res.json();
        console.log('Hero Profile Data:', data);
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    const fetchResume = async () => {
      try {
        const res = await fetch(getApiUrl('/api/resume'));
        if (res.ok) {
          const data = await res.json();
          setResume(data);
        }
      } catch (err) {
        console.error('Error fetching resume:', err);
      }
    };

    fetchProfile();
    fetchResume();
  }, []);

  return (
    <section id="hero" className="hero-section container">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="hero-title">
          Hi, I'm <span className="highlight">{profile?.username || 'Kiren'}</span>
        </h1>
        <h2 className="hero-subtitle">MERN Stack Developer</h2>
        <p className="hero-description">
          Building scalable, high-performance web applications with modern technologies.
        </p>
        <div className="hero-btns">
          <a href="#projects" className="btn btn-primary">Projects</a>
          {resume ? (
            <a href={getApiUrl(resume.url)} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-glow">Resume</a>
          ) : (
            <a href="1777880306688-resume sample1.pdf" className="btn btn-outline btn-glow">Resume</a>
          )}
        </div>

        <div className="hero-socials">
          <a href="mailto:kirenkumar.dev424@gmail.com" title="Gmail" target="_blank" rel="noopener noreferrer"><img src="https://cdn.simpleicons.org/gmail" alt="Gmail" /></a>
          <a href="https://linkedin.com/in/kirenkumar-dev424/" target="_blank" rel="noreferrer" title="LinkedIn"><img src="https://www.svgrepo.com/show/157006/linkedin.svg" alt="LinkedIn" /></a>
          <a href="https://wa.me/917845928388" target="_blank" rel="noreferrer" title="WhatsApp"><img src="https://cdn.simpleicons.org/whatsapp" alt="WhatsApp" /></a>
          <a href="https://github.com/kk-projects292/" target="_blank" rel="noreferrer" title="GitHub"><img src="https://cdn.simpleicons.org/github/white" alt="GitHub" /></a>
          <a href="https://www.instagram.com/kk_dev424/" target="_blank" rel="noreferrer" title="Instagram"><img src="https://cdn.simpleicons.org/instagram" alt="Instagram" /></a>
        </div>
      </motion.div>
      <div className="hero-visual">
        <div className="profile-container">
          {profile?.profileImage ? (
            <img
              src={profile.profileImage.startsWith('http') ? profile.profileImage : getApiUrl(profile.profileImage)}
              alt="Profile"
              className="profile-img"
            />
          ) : (
            <div className="profile-placeholder"></div>
          )}
          <div className="blob"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
