import { motion } from 'framer-motion';
import './Skills.css';

const Skills = () => {
  const categories = [
    {
      title: 'Frontend Development',
      skills: [
        { name: 'HTML5', level: 95, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
        { name: 'CSS3', level: 90, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
        { name: 'JavaScript', level: 90, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
        { name: 'React', level: 85, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        { name: 'TypeScript', level: 75, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' }
      ]
    },
    {
      title: 'Backend & Database',
      skills: [
        { name: 'Node.js', level: 80, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
        { name: 'Express.js', level: 85, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
        { name: 'MongoDB', level: 80, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
        { name: 'Python', level: 70, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' }
      ]
    }
  ];

  const tools = [
    { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
    { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'Postman', icon: 'https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg' },
    { name: 'Vercel', icon: 'https://www.vectorlogo.zone/logos/vercel/vercel-icon.svg' },
    { name: 'ChatGPT', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
    { name: 'Claude', icon: 'https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/light/claude-color.png' },
    { name: 'Cursor', icon: 'https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/light/cursor.png' }
  ];

  return (
    <section id="skills" className="skills-section">
      <div className="container">
        <h2 className="section-title">Technical Skills</h2>

        <div className="skills-main-row">
          {categories.map((cat, idx) => (
            <div key={idx} className="skill-category-box glass-morphism">
              <h3>{cat.title}</h3>
              <div className="skills-mini-grid">
                {cat.skills.map((skill, i) => (
                  <div key={i} className="skill-item-mini">
                    <div className="skill-header-mini">
                      <img src={skill.icon} alt={skill.name} className="skill-logo-mini" />
                      <div className="skill-info-mini">
                        <span>{skill.name}</span>
                        <span>{skill.level}%</span>
                      </div>
                    </div>
                    <div className="progress-bar-mini">
                      <motion.div
                        className="progress"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        viewport={{ once: true }}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="tools-category-box glass-morphism">
            <h3>Tools & Technologies</h3>
            <div className="tools-mini-grid">
              {tools.map((tool, i) => (
                <motion.div
                  key={i}
                  className="tool-badge-mini"
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={tool.icon} alt={tool.name} className="tool-logo-mini" />
                  <span>{tool.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
