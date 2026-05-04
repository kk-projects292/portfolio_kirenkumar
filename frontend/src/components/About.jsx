import './About.css';

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              I am a passionate MERN Stack Developer with experience in building robust web applications.
              My journey started with a curiosity for how things work on the internet,
              which led me to master the art of full-stack development.
            </p>
            <p>
              I focus on creating clean, efficient, and user-centric solutions.
              Whether it's optimizing backend queries or crafting smooth frontend experiences,
              I strive for excellence in every line of code.
            </p>
            <p>
              Beyond coding, I enjoy exploring new AI tools and staying up-to-date with the latest trends
              in the web development ecosystem. I believe in continuous learning and
              leveraging technology to solve real-world problems.
            </p>
          </div>
          <div className="education-roadmap">
            <h3>My Education Journey</h3>
            <div className="roadmap-container">
              <div className="roadmap-line"></div>

              <div className="roadmap-item">
                <div className="roadmap-dot"></div>
                <div className="roadmap-content glass-morphism">
                  <span className="roadmap-year">2020 - 2021</span>
                  <h4>Higher Secondary Education</h4>
                  <p>Specialized in Mathematics and Computer Science. Built a strong foundation in logic and programming basics.</p>
                </div>
              </div>

              <div className="roadmap-item">
                <div className="roadmap-dot highlight"></div>
                <div className="roadmap-content glass-morphism">
                  <span className="roadmap-year">2023 - 2026</span>
                  <h4>Bachelor of Science in Computer Science</h4>
                  <p>Deep dived into Data Structures, Algorithms, Database Management, and Web Technologies. Developed several academic projects.</p>
                </div>
              </div>

              <div className="roadmap-item">
                <div className="roadmap-dot"></div>
                <div className="roadmap-content glass-morphism">
                  <span className="roadmap-year">Current</span>
                  <h4>MERN Stack Specialization</h4>
                  <p>Focusing on building scalable full-stack applications using MongoDB, Express, React, and Node.js.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
