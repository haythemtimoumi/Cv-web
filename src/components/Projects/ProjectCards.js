import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CgWebsite } from "react-icons/cg";
import { BsGithub, BsStar, BsCodeSlash } from "react-icons/bs";
import { AiOutlineFolder, AiOutlineFolderOpen } from "react-icons/ai";
import { BiDetail } from "react-icons/bi";

function ProjectCards({ project }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  
  const mainRepo = project.mainRepo;
  const isMultiRepo = project.isMultiRepo;
  const totalStars = project.totalStars;
  
  // Get all unique languages from all repos
  const languages = [...new Set(project.repos.map(r => r.language).filter(Boolean))];
  
  // Get all unique topics (excluding 'portfolio' and project identifier)
  const allTopics = new Set();
  project.repos.forEach(repo => {
    if (repo.topics) {
      repo.topics.forEach(topic => {
        if (topic !== 'portfolio' && topic !== project.id.toLowerCase()) {
          allTopics.add(topic);
        }
      });
    }
  });
  const topics = Array.from(allTopics);
  
  // Get description from main repo or first repo with description
  const description = mainRepo.description || 
    project.repos.find(r => r.description)?.description || 
    "No description available";
  
  // Get demo link from main repo or first repo with homepage
  const demoLink = mainRepo.homepage || 
    project.repos.find(r => r.homepage)?.homepage;
  
  // Repo type badges
  const getRepoTypeBadge = (type) => {
    const badges = {
      frontend: { bg: "primary", text: "Frontend" },
      backend: { bg: "success", text: "Backend" },
      api: { bg: "info", text: "API" },
      scraper: { bg: "warning", text: "Scraper" },
      mobile: { bg: "secondary", text: "Mobile" },
      admin: { bg: "dark", text: "Admin" },
      main: { bg: "primary", text: "Main" },
    };
    return badges[type] || badges.main;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -10 }}
    >
      <Card className="project-card-view glass-card">
        {/* Project Header */}
        <div style={{ 
          background: "linear-gradient(135deg, #623686 0%, #8a49a8 100%)",
          padding: "40px 20px",
          textAlign: "center",
          color: "white",
          position: "relative",
          overflow: "hidden"
        }}>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="gradient-text" style={{ 
              margin: 0, 
              fontSize: "1.5em", 
              fontWeight: "bold",
              background: "white",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              {project.name}
            </h3>
          </motion.div>
          {isMultiRepo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ marginTop: "10px", fontSize: "0.85em", opacity: 0.9 }}
            >
              <AiOutlineFolder style={{ marginRight: "5px" }} />
              {project.repos.length} repositories
            </motion.div>
          )}
        </div>
      
      <Card.Body>
        {/* Description */}
        <Card.Text style={{ textAlign: "justify", minHeight: "60px" }}>
          {description}
        </Card.Text>
        
        {/* Languages and Stars */}
        <div style={{ marginBottom: "15px", display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center" }}>
          {languages.map((lang, idx) => (
            <span key={idx} style={{ 
              color: "#c770f0", 
              fontSize: "0.9em",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}>
              <BsCodeSlash />
              {lang}
            </span>
          ))}
          {totalStars > 0 && (
            <span style={{ 
              color: "#ffd700", 
              fontSize: "0.9em",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              marginLeft: "auto"
            }}>
              <BsStar /> {totalStars}
            </span>
          )}
        </div>
        
        {/* Topics */}
        {topics.length > 0 && (
          <div style={{ marginBottom: "15px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {topics.slice(0, 5).map((topic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
              >
                <Badge 
                  bg="secondary"
                  style={{
                    background: "rgba(200, 137, 230, 0.2)",
                    color: "#c770f0",
                    padding: "5px 12px",
                    borderRadius: "12px",
                    fontSize: "0.75em",
                    border: "1px solid rgba(200, 137, 230, 0.3)",
                    fontWeight: "normal",
                    cursor: "pointer"
                  }}
                >
                  {topic}
                </Badge>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Multi-Repo Details */}
        {isMultiRepo && (
          <div style={{ marginBottom: "15px" }}>
            <Button
              variant="link"
              onClick={() => setExpanded(!expanded)}
              style={{ 
                padding: "5px 0", 
                color: "#c770f0", 
                textDecoration: "none",
                fontSize: "0.9em",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              {expanded ? <AiOutlineFolderOpen /> : <AiOutlineFolder />}
              {expanded ? "Hide" : "Show"} all repositories ({project.repos.length})
            </Button>
            
            {expanded && (
              <div style={{ 
                marginTop: "10px", 
                padding: "10px", 
                background: "rgba(98, 54, 134, 0.1)",
                borderRadius: "8px",
                border: "1px solid rgba(98, 54, 134, 0.3)"
              }}>
                {project.repos.map((repo, idx) => (
                  <div key={idx} style={{ 
                    marginBottom: idx < project.repos.length - 1 ? "10px" : "0",
                    paddingBottom: idx < project.repos.length - 1 ? "10px" : "0",
                    borderBottom: idx < project.repos.length - 1 ? "1px solid rgba(200, 137, 230, 0.2)" : "none"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                      <Badge bg={getRepoTypeBadge(repo.type).bg}>
                        {getRepoTypeBadge(repo.type).text}
                      </Badge>
                      <a 
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ 
                          color: "#c770f0", 
                          textDecoration: "none",
                          fontSize: "0.9em",
                          fontWeight: "500"
                        }}
                      >
                        {repo.name}
                      </a>
                      {repo.stargazers_count > 0 && (
                        <span style={{ fontSize: "0.8em", color: "#ffd700" }}>
                          ⭐ {repo.stargazers_count}
                        </span>
                      )}
                    </div>
                    {repo.description && (
                      <p style={{ 
                        fontSize: "0.85em", 
                        color: "#a0a0a0", 
                        margin: "5px 0 0 0",
                        paddingLeft: "10px"
                      }}>
                        {repo.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <motion.div style={{ flex: 1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="primary" 
              onClick={() => navigate(`/project/${project.id}`)}
              style={{ width: "100%" }}
              className="animated-button"
            >
              <BiDetail /> &nbsp;
              View Details
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              variant="outline-primary" 
              href={mainRepo.html_url} 
              target="_blank"
              className="animated-button"
            >
              <BsGithub />
            </Button>
          </motion.div>
          
          {demoLink && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline-primary"
                href={demoLink}
                target="_blank"
                className="animated-button"
              >
                <CgWebsite />
              </Button>
            </motion.div>
          )}
        </div>
      </Card.Body>
    </Card>
    </motion.div>
  );
}

export default ProjectCards;
