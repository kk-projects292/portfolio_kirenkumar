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

  // Categories that use progress bars
  const progressCategories = [
    { key: 'frontend', title: 'Frontend Development' },
    { key: 'backend', title: 'Backend & Database' }
  ];

  // Tools category — rendered as scrolling badges
  const toolsSkills = skills.filter(skill => skill.category === 'tools');

  const getLogoSrc = (skill) => {
    if (skill.logoUrl) {
      return skill.logoUrl.startsWith('http') ? skill.logoUrl : getApiUrl(skill.logoUrl);
    }
    if (skill.icon && (skill.icon.startsWith('http') || skill.icon.startsWith('/')) ) {
      return skill.icon.startsWith('http') ? skill.icon : getApiUrl(skill.icon);
    }
    return null;
  };

  const renderSkillIcon = (skill) => {
    const logoSrc = getLogoSrc(skill);
    if (logoSrc) {
      return <img src={logoSrc} alt={skill.name} className="skill-logo-mini" />;
    }
    if (skill.icon && skill.icon.startsWith('<svg')) {
      return (
        <div
          className="skill-logo-mini"
          style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          dangerouslySetInnerHTML={{ __html: skill.icon }}
        />
      );
    }
    return <div className="skill-logo-mini skill-icon-fallback">{skill.icon || '⚡'}</div>;
  };

  // Split tools into two rows for a better visual
  const midpoint = Math.ceil(toolsSkills.length / 2);
  const toolsRow1 = toolsSkills.slice(0, midpoint);
  const toolsRow2 = toolsSkills.slice(midpoint);

  return (
    <section id="skills" className="skills-section">
      <div className="container">
        <h2 className="section-title">Technical skills</h2>

        {/* Progress bar categories: Frontend & Backend */}
        <div className="skills-main-row">
          {progressCategories.map((cat) => {
            const categorySkills = skills.filter(skill => skill.category === cat.key);
            if (categorySkills.length === 0) return null;

            return (
              <div key={cat.key} className="skill-category-box glass-morphism">
                <h3>{cat.title}</h3>
                <div className="skills-mini-grid">
                  {categorySkills.map((skill, i) => {
                    return (
                      <div key={i} className="skill-item-mini">
                        <div className="skill-header-mini">
                          {renderSkillIcon(skill)}
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

        {/* Tools & Technologies — Scrolling Marquee */}
        {toolsSkills.length > 0 && (
          <div className="tools-marquee-section">
            <h3 className="tools-marquee-title">Tools & Technologies</h3>

            {/* Row 1: scrolls left */}
            <div className="marquee-track">
              <div className="marquee-content scroll-left">
                {[...toolsRow1, ...toolsRow1, ...toolsRow1].map((skill, i) => (
                  <div key={i} className="tool-chip glass-morphism" style={{ '--chip-color': skill.color || '#6366f1' }}>
                    {renderSkillIcon(skill)}
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: scrolls right */}
            {toolsRow2.length > 0 && (
              <div className="marquee-track">
                <div className="marquee-content scroll-right">
                  {[...toolsRow2, ...toolsRow2, ...toolsRow2].map((skill, i) => (
                    <div key={i} className="tool-chip glass-morphism" style={{ '--chip-color': skill.color || '#6366f1' }}>
                      {renderSkillIcon(skill)}
                      <span>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
