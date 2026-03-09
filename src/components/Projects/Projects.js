import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import { usePortfolioProjects } from "../../hooks/usePortfolioProjects";

function Projects() {
  const { projects, loading, error } = usePortfolioProjects();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="project-heading">
            My Recent <strong className="purple">Works </strong>
          </h1>
          <p style={{ color: "white" }}>
            Here are my portfolio projects. Some projects span multiple repositories (frontend, backend, etc.).
          </p>
        </motion.div>
        
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", padding: "50px" }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p style={{ color: "white", marginTop: "20px" }}>
              Loading projects from GitHub...
            </p>
          </motion.div>
        )}
        
        {error && (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <p style={{ color: "#ff6b6b", fontSize: "1.2em" }}>
              ⚠️ Error loading projects: {error}
            </p>
            <p style={{ color: "white", fontSize: "0.9em" }}>
              Make sure your GitHub token has 'repo' scope to access private repositories.
            </p>
          </div>
        )}
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
            {!loading && !error && projects.length === 0 && (
              <Col md={12}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: "center", padding: "50px" }}
                >
                  <p style={{ color: "white", fontSize: "1.2em" }}>
                    No portfolio projects found.
                  </p>
                  <p style={{ color: "#a0a0a0", fontSize: "0.9em" }}>
                    Add the topic "portfolio" to your repositories to display them here.
                  </p>
                </motion.div>
              </Col>
            )}
            
            {projects.map((project, index) => (
              <Col md={4} className="project-card" key={project.id || index}>
                <motion.div variants={itemVariants}>
                  <ProjectCard project={project} />
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
        
        {!loading && !error && projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ textAlign: "center", marginTop: "30px", color: "#a0a0a0" }}
          >
            <p>
              Showing {projects.length} project{projects.length !== 1 ? 's' : ''} • 
              Total {projects.reduce((sum, p) => sum + p.repos.length, 0)} repositories
            </p>
          </motion.div>
        )}
      </Container>
    </Container>
  );
}

export default Projects;
