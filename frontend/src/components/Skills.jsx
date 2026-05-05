import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getApiUrl } from '../utils/api';
import './Skills.css';

const Skills = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch(getApiUrl('/api/skills'));
        const data = await res.json();
        setSkills(data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };
    fetchSkills();
  }, []);

  const categories = [
    { key: 'frontend', title: 'Frontend Development' },
    { key: 'backend', title: 'Backend & Database' },
    { key: 'tools', title: 'Tools & Technologies' }
    // { key: 'other', title: 'Other Skills' }
  ];

  const getLogoSrc = (skill) => {
    if (skill.logoUrl) {
      return skill.logoUrl.startsWith('http') ? skill.logoUrl : getApiUrl(skill.logoUrl);
    }
    if (skill.icon && (skill.icon.startsWith('http') || skill.icon.startsWith('/')) ) {
      return skill.icon.startsWith('http') ? skill.icon : getApiUrl(skill.icon);
    }
    return null;
  };

  return (
    <section id="skills" className="skills-section">
      <div className="container">
        <h2 className="section-title">Technical Skills</h2>

        <div className="skills-main-row">
          {categories.map((cat) => {
            const categorySkills = skills.filter(skill => skill.category === cat.key);
            if (categorySkills.length === 0) return null;

            return (
              <div key={cat.key} className="skill-category-box glass-morphism">
                <h3>{cat.title}</h3>
                <div className="skills-mini-grid">
                  {categorySkills.map((skill, i) => {
                    const logoSrc = getLogoSrc(skill);
                    return (
                      <div key={i} className="skill-item-mini">
                        <div className="skill-header-mini">
                          {logoSrc ? (
                            <img src={logoSrc} alt={skill.name} className="skill-logo-mini" />
                          ) : skill.icon && skill.icon.startsWith('<svg') ? (
                            <div className="skill-logo-mini" style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} dangerouslySetInnerHTML={{ __html: skill.icon }} />
                          ) : (
                            <div className="skill-logo-mini skill-icon-fallback">{skill.icon || '⚡'}</div>
                          )}
                          <div className="skill-info-mini">
                            <span>{skill.name}</span>
                            <span>{skill.proficiency}%</span>
                          </div>
                        </div>
                        <div className="progress-bar-mini">
                          <motion.div
                            className="progress"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.proficiency}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            viewport={{ once: true }}
                          ></motion.div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
