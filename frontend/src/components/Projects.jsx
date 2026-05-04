import { useState, useEffect } from 'react';
import { getApiUrl } from '../utils/api';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch projects from API
    const fetchProjects = async () => {
      try {
        const res = await fetch(getApiUrl('/api/projects'));
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <h2 className="section-title">Projects</h2>
        <div className="projects-grid">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project._id} className="project-card glass-morphism">
                <div className="project-img">
                  <img 
                    src={project.imageUrl?.startsWith('http') ? project.imageUrl : getApiUrl(project.imageUrl)} 
                    alt={project.title} 
                  />
                </div>
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tech">
                    {project.techStack.map((tech, i) => (
                      <span key={i}>{tech}</span>
                    ))}
                  </div>
                  <div className="project-links">
                    {project.demoLink && <a href={project.demoLink} target="_blank" rel="noreferrer"><span>🌐</span> Live Demo</a>}
                    {project.githubLink && <a href={project.githubLink} target="_blank" rel="noreferrer"><span>📂</span> GitHub</a>}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-projects">Loading projects...</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
