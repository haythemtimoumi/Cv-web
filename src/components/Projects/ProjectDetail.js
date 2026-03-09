import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Container, Row, Col, Card, Badge, Button, Spinner, Modal } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { BsGithub, BsStar, BsCodeSlash, BsArrowLeft, BsX } from "react-icons/bs";
import { CgWebsite } from "react-icons/cg";
import { AiOutlineFolder, AiOutlineExpand } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import Particle from "../Particle";
import { usePortfolioProjects } from "../../hooks/usePortfolioProjects";
import { fetchRepoReadme, fetchRepoVideos, fetchImageAsDataUrl } from "../../api/github";
import ReactMarkdown from "react-markdown";

// Memoized Markdown component to prevent re-renders
const MarkdownContent = React.memo(({ content, onImageClick }) => {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        components={{
          img: ({node, src, alt, ...props}) => {
            if (src && (src.startsWith('data:') || src.startsWith('http'))) {
              return (
                <img
                  src={src}
                  alt={alt || 'Image'}
                  loading="lazy"
                  style={{
                    maxWidth: '100%',
                    borderRadius: '8px',
                    margin: '1em 0',
                    border: '2px solid rgba(200, 137, 230, 0.3)',
                    cursor: 'pointer'
                  }}
                  onClick={() => onImageClick({ 
                    download_url: src, 
                    name: alt || 'Screenshot' 
                  })}
                />
              );
            }
            
            return (
              <div style={{
                width: '100%',
                height: '200px',
                background: 'linear-gradient(90deg, rgba(98, 54, 134, 0.1) 25%, rgba(138, 73, 168, 0.2) 50%, rgba(98, 54, 134, 0.1) 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c770f0'
              }}>
                Loading image: {alt || 'Image'}
              </div>
            );
          },
          a: ({node, ...props}) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#c770f0', textDecoration: 'none' }}
            >
              {props.children}
            </a>
          ),
          code: ({node, inline, className, children, ...props}) => {
            if (!inline) {
              return (
                <pre style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '15px',
                  borderRadius: '8px',
                  overflow: 'auto',
                  border: '1px solid rgba(200, 137, 230, 0.2)',
                  whiteSpace: 'pre',
                  fontFamily: "'Courier New', monospace"
                }}>
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              );
            }
            return (
              <code
                className={className}
                style={{
                  background: 'rgba(200, 137, 230, 0.1)',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  fontFamily: "'Courier New', monospace",
                  color: '#c770f0'
                }}
                {...props}
              >
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

MarkdownContent.displayName = 'MarkdownContent';


function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, loading: projectsLoading } = usePortfolioProjects();
  
  const [project, setProject] = useState(null);
  const [readme, setReadme] = useState("");
  const [processedReadme, setProcessedReadme] = useState("");
  const [media, setMedia] = useState({ images: [], videos: [] });
  const [loadingContent, setLoadingContent] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState({});
  const [scrollProgress, setScrollProgress] = useState(0);
  const [defaultBranch, setDefaultBranch] = useState('main');

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const progress = (window.scrollY / totalHeight) * 100;
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!projectsLoading && projects.length > 0) {
      const foundProject = projects.find(p => p.id === projectId);
      if (foundProject) {
        setProject(foundProject);
        // Set default branch from repo data
        setDefaultBranch(foundProject.mainRepo.default_branch || 'main');
        loadProjectContent(foundProject);
      } else {
        navigate("/project");
      }
    }
  }, [projectId, projects, projectsLoading, navigate]);

  const loadProjectContent = async (proj) => {
      setLoadingContent(true);
      try {
        // Fetch README from main repo (includes images from README and branch info)
        const readmeData = await fetchRepoReadme(proj.mainRepo.owner.login, proj.mainRepo.name);
        setReadme(readmeData.content);

        console.log('README data:', readmeData);
        console.log('Extracted images:', readmeData.images);

        // Set the correct branch
        if (readmeData.branch) {
          setDefaultBranch(readmeData.branch);
          console.log('Using branch:', readmeData.branch);
        }

        // Process images - use different strategies for public vs private repos
        const processedImages = await Promise.all(
          readmeData.images.map(async (img) => {
            if (img.isApiUrl && img.path) {
              // Check if repo is private
              if (proj.mainRepo.private) {
                // For private repos, convert to data URL (requires auth)
                try {
                  const dataUrl = await fetchImageAsDataUrl(img.download_url);
                  return {
                    ...img,
                    download_url: dataUrl,
                    originalUrl: img.download_url
                  };
                } catch (error) {
                  console.error('Failed to fetch private image:', img.download_url, error);
                  return img;
                }
              } else {
                // For public repos, use raw.githubusercontent.com (faster, no auth needed)
                const rawUrl = `https://raw.githubusercontent.com/${proj.mainRepo.owner.login}/${proj.mainRepo.name}/${readmeData.branch}/${img.path}`;
                return {
                  ...img,
                  download_url: rawUrl,
                  originalUrl: img.download_url
                };
              }
            }
            return img;
          })
        );

        // Replace image URLs in README content
        let processedContent = readmeData.content;
        processedImages.forEach(img => {
          if (img.path) {
            // Create regex patterns to match the image references
            const escapedPath = img.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // Match ![alt](path) or ![alt](./path)
            const markdownPattern = new RegExp(`!\\[([^\\]]*)\\]\\((\\.\\/)?${escapedPath}\\)`, 'g');
            processedContent = processedContent.replace(markdownPattern, `![${img.name}](${img.download_url})`);

            // Match <img src="path"> or <img src="./path">
            const htmlPattern = new RegExp(`<img([^>]+)src=["'](\\.\\/)?${escapedPath}["']`, 'g');
            processedContent = processedContent.replace(htmlPattern, `<img$1src="${img.download_url}"`);
          }
        });

        console.log('Processed README - first 500 chars:', processedContent.substring(0, 500));
        setProcessedReadme(processedContent);

        // Set images from README
        const allMedia = { 
          images: processedImages, 
          videos: [] 
        };

        // Fetch video files from all repos
        for (const repo of proj.repos) {
          const repoVideos = await fetchRepoVideos(repo.owner.login, repo.name);
          allMedia.videos.push(...repoVideos);
        }

        console.log('All media:', allMedia);
        setMedia(allMedia);
      } catch (error) {
        console.error("Error loading project content:", error);
      } finally {
        setLoadingContent(false);
      }
    };

  if (projectsLoading || !project) {
    return (
      <Container fluid className="project-section">
        <Particle />
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: "center", padding: "100px 0" }}
          >
            <Spinner animation="border" variant="primary" />
            <p style={{ color: "white", marginTop: "20px" }}>Loading project...</p>
          </motion.div>
        </Container>
      </Container>
    );
  }

  const mainRepo = project.mainRepo;
  const languages = [...new Set(project.repos.map(r => r.language).filter(Boolean))];
  
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

  const demoLink = mainRepo.homepage || project.repos.find(r => r.homepage)?.homepage;

  return (
    <Container fluid className="project-section">
      <Particle />
      
      {/* Scroll Progress Bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #c770f0, #a855f7)",
          transformOrigin: "0%",
          zIndex: 9999,
          transform: `scaleX(${scrollProgress / 100})`,
          transition: "transform 0.1s ease-out",
          willChange: "transform"
        }}
      />
      
      <Container>
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="link"
            onClick={() => navigate("/project")}
            className="back-button-animated"
            style={{
              color: "#c770f0",
              textDecoration: "none",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 0",
              transition: "all 0.3s ease"
            }}
          >
            <BsArrowLeft size={20} />
            Back to Projects
          </Button>
        </motion.div>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="project-header-glass"
          style={{
            background: "linear-gradient(135deg, rgba(98, 54, 134, 0.95) 0%, rgba(138, 73, 168, 0.95) 100%)",
            padding: "60px 40px",
            borderRadius: "20px",
            marginBottom: "30px",
            color: "white",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px 0 rgba(98, 54, 134, 0.37)"
          }}
        >
          <h1 style={{ fontSize: "2.5em", fontWeight: "bold", marginBottom: "15px" }}>
            {project.name}
          </h1>
          <p style={{ fontSize: "1.2em", opacity: 0.9, marginBottom: "20px" }}>
            {mainRepo.description || "No description available"}
          </p>
          
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "center" }}>
            {languages.map((lang, idx) => (
              <span key={idx} style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "1em"
              }}>
                <BsCodeSlash />
                {lang}
              </span>
            ))}
            {project.totalStars > 0 && (
              <span style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "1em",
                color: "#ffd700"
              }}>
                <BsStar /> {project.totalStars} stars
              </span>
            )}
            {project.isMultiRepo && (
              <span style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "1em",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "6px 14px",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.2)"
              }}>
                <AiOutlineFolder />
                {project.repos.length} {project.repos.length === 1 ? 'repo' : 'repos'}
              </span>
            )}
          </div>

          <div style={{ marginTop: "20px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
            {topics.map((topic, index) => (
              <Badge
                key={index}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "15px",
                  fontSize: "0.9em",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  fontWeight: "normal"
                }}
              >
                {topic}
              </Badge>
            ))}
          </div>

          <div style={{ marginTop: "30px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="light"
                href={mainRepo.html_url}
                target="_blank"
                size="lg"
                className="animated-button"
              >
                <BsGithub /> &nbsp; View on GitHub
              </Button>
            </motion.div>
            {demoLink && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline-light"
                  href={demoLink}
                  target="_blank"
                  size="lg"
                  className="animated-button"
                >
                  <CgWebsite /> &nbsp; Live Demo
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>

        <Row>
          {/* Main Content */}
          <Col lg={8}>
            {/* Screenshots Section */}
            {media.images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="project-card-view glass-card" style={{ marginBottom: "30px" }}>
                  <Card.Body>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "25px",
                      paddingBottom: "15px",
                      borderBottom: "2px solid rgba(200, 137, 230, 0.2)"
                    }}>
                      <h3 style={{ 
                        color: "#c770f0", 
                        margin: 0,
                        fontSize: "1.5em",
                        fontWeight: "600",
                        display: "flex", 
                        alignItems: "center", 
                        gap: "12px" 
                      }}>
                        <span style={{ fontSize: "1.3em" }}>📸</span> 
                        <span>Screenshots</span>
                      </h3>
                      <Badge 
                        bg="secondary" 
                        style={{
                          background: "rgba(200, 137, 230, 0.2)",
                          color: "#c770f0",
                          padding: "8px 16px",
                          fontSize: "0.85em",
                          fontWeight: "500"
                        }}
                      >
                        {media.images.length} {media.images.length === 1 ? 'image' : 'images'}
                      </Badge>
                    </div>
                    <Row>
                      {media.images.map((img, idx) => (
                        <Col md={6} key={idx} style={{ marginBottom: "20px" }}>
                          <div
                            className="image-container"
                            style={{ position: "relative" }}
                          >
                            {!imageLoaded[idx] && (
                              <div className="image-skeleton" style={{
                                width: "100%",
                                height: "200px",
                                background: "linear-gradient(90deg, rgba(98, 54, 134, 0.1) 25%, rgba(138, 73, 168, 0.2) 50%, rgba(98, 54, 134, 0.1) 75%)",
                                backgroundSize: "200% 100%",
                                animation: "shimmer 1.5s infinite",
                                borderRadius: "10px"
                              }} />
                            )}
                            <img
                              src={img.download_url}
                              alt={img.name}
                              loading="lazy"
                              style={{
                                width: "100%",
                                borderRadius: "10px",
                                border: "2px solid rgba(200, 137, 230, 0.3)",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                                display: imageLoaded[idx] ? "block" : "none"
                              }}
                              onLoad={() => {
                                console.log(`Image ${idx} loaded:`, img.download_url);
                                setImageLoaded(prev => ({ ...prev, [idx]: true }));
                              }}
                              onError={(e) => {
                                console.error(`Image ${idx} failed to load:`, img.download_url);
                                console.error('Error details:', e);
                                setImageLoaded(prev => ({ ...prev, [idx]: 'error' }));
                              }}
                              onClick={() => setSelectedImage(img)}
                            />
                            {imageLoaded[idx] === 'error' && (
                              <div style={{
                                width: "100%",
                                height: "200px",
                                background: "rgba(255, 107, 107, 0.1)",
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column",
                                border: "2px solid rgba(255, 107, 107, 0.3)",
                                padding: "20px",
                                textAlign: "center"
                              }}>
                                <p style={{ color: "#ff6b6b", marginBottom: "10px" }}>❌ Failed to load image</p>
                                <p style={{ color: "#a0a0a0", fontSize: "0.8em", wordBreak: "break-all" }}>
                                  {img.download_url}
                                </p>
                                <a 
                                  href={img.download_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  style={{ color: "#c770f0", fontSize: "0.85em", marginTop: "10px" }}
                                >
                                  Try opening directly
                                </a>
                              </div>
                            )}
                            {imageLoaded[idx] === true && (
                              <div
                                className="image-overlay"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  background: "rgba(98, 54, 134, 0.8)",
                                  borderRadius: "10px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer"
                                }}
                                onClick={() => setSelectedImage(img)}
                              >
                                <AiOutlineExpand size={40} color="white" />
                              </div>
                            )}
                          </div>
                          <p style={{
                            color: "white",
                            fontSize: "0.9em",
                            marginTop: "10px",
                            textAlign: "center",
                            fontWeight: "500",
                            background: "rgba(98, 54, 134, 0.3)",
                            padding: "8px 12px",
                            borderRadius: "8px"
                          }}>
                            {img.name}
                          </p>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              </motion.div>
            )}

            {/* Videos Section */}
            {media.videos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="project-card-view glass-card" style={{ marginBottom: "30px" }}>
                  <Card.Body>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "25px",
                      paddingBottom: "15px",
                      borderBottom: "2px solid rgba(200, 137, 230, 0.2)"
                    }}>
                      <h3 style={{ 
                        color: "#c770f0", 
                        margin: 0,
                        fontSize: "1.5em",
                        fontWeight: "600",
                        display: "flex", 
                        alignItems: "center", 
                        gap: "12px" 
                      }}>
                        <span style={{ fontSize: "1.3em" }}>🎥</span> 
                        <span>Demo Videos</span>
                      </h3>
                      <Badge 
                        bg="secondary" 
                        style={{
                          background: "rgba(200, 137, 230, 0.2)",
                          color: "#c770f0",
                          padding: "8px 16px",
                          fontSize: "0.85em",
                          fontWeight: "500"
                        }}
                      >
                        {media.videos.length} {media.videos.length === 1 ? 'video' : 'videos'}
                      </Badge>
                    </div>
                    {media.videos.map((video, idx) => (
                      <div
                        key={idx}
                        style={{ marginBottom: idx < media.videos.length - 1 ? "25px" : "0" }}
                      >
                        <div style={{
                          background: "rgba(98, 54, 134, 0.1)",
                          padding: "15px",
                          borderRadius: "12px",
                          border: "1px solid rgba(200, 137, 230, 0.2)"
                        }}>
                          <video
                            controls
                            preload="metadata"
                            style={{
                              width: "100%",
                              borderRadius: "10px",
                              border: "2px solid rgba(200, 137, 230, 0.3)",
                              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
                            }}
                          >
                            <source src={video.download_url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                          <div style={{
                            marginTop: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                          }}>
                            <p style={{
                              color: "white",
                              fontSize: "0.95em",
                              margin: 0,
                              fontWeight: "500"
                            }}>
                              {video.name}
                            </p>
                            <a
                              href={video.download_url}
                              download
                              style={{
                                color: "#c770f0",
                                fontSize: "0.85em",
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px"
                              }}
                            >
                              ⬇️ Download
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </motion.div>
            )}

            {/* README Section */}
            {readme && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="project-card-view glass-card" style={{ marginBottom: "30px" }}>
                  <Card.Body>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "25px",
                      paddingBottom: "15px",
                      borderBottom: "2px solid rgba(200, 137, 230, 0.2)"
                    }}>
                      <h3 style={{ 
                        color: "#c770f0", 
                        margin: 0,
                        fontSize: "1.5em",
                        fontWeight: "600",
                        display: "flex", 
                        alignItems: "center", 
                        gap: "12px" 
                      }}>
                        <span style={{ fontSize: "1.3em" }}>📚</span> 
                        <span>Documentation</span>
                      </h3>
                    </div>
                    <MarkdownContent 
                      content={processedReadme} 
                      onImageClick={setSelectedImage}
                    />
                  </Card.Body>
                </Card>
              </motion.div>
            )}

            {loadingContent && (
              <div style={{ textAlign: "center", padding: "50px" }}>
                <Spinner animation="border" variant="primary" />
                <p style={{ color: "white", marginTop: "20px" }}>
                  Loading project details...
                </p>
              </div>
            )}
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Repositories Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="project-card-view glass-card" style={{ marginBottom: "30px" }}>
                <Card.Body>
                  <h4 style={{ 
                    color: "#c770f0", 
                    marginBottom: "20px",
                    fontSize: "1.3em",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}>
                    <BsGithub /> Repositories
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {project.repos.map((repo, idx) => (
                      <a
                        key={idx}
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="repo-item"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 15px",
                          background: "rgba(98, 54, 134, 0.1)",
                          borderRadius: "10px",
                          border: "1px solid rgba(200, 137, 230, 0.2)",
                          textDecoration: "none",
                          transition: "all 0.3s ease",
                          cursor: "pointer"
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "8px",
                            marginBottom: "4px"
                          }}>
                            <Badge 
                              bg="primary" 
                              style={{ 
                                fontSize: "0.7em",
                                padding: "4px 8px",
                                textTransform: "uppercase",
                                fontWeight: "600"
                              }}
                            >
                              {repo.type}
                            </Badge>
                            {repo.language && (
                              <span style={{ 
                                fontSize: "0.75em", 
                                color: "#a0a0a0",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px"
                              }}>
                                <BsCodeSlash size={12} />
                                {repo.language}
                              </span>
                            )}
                          </div>
                          <div style={{
                            color: "#c770f0",
                            fontSize: "0.95em",
                            fontWeight: "500"
                          }}>
                            {repo.name}
                          </div>
                        </div>
                        {repo.stargazers_count > 0 && (
                          <div style={{ 
                            fontSize: "0.85em", 
                            color: "#ffd700",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            marginLeft: "10px"
                          }}>
                            <BsStar /> {repo.stargazers_count}
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </motion.div>

            {/* Tech Stack Card */}
            {languages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="project-card-view glass-card">
                  <Card.Body>
                    <h4 style={{ 
                      color: "#c770f0", 
                      marginBottom: "20px",
                      fontSize: "1.3em",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}>
                      <span>🛠️</span> Tech Stack
                    </h4>
                    <div style={{ 
                      display: "flex", 
                      flexWrap: "wrap", 
                      gap: "10px" 
                    }}>
                      {languages.map((lang, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: "10px 16px",
                            background: "linear-gradient(135deg, rgba(199, 112, 240, 0.2), rgba(138, 73, 168, 0.2))",
                            borderRadius: "20px",
                            border: "1px solid rgba(200, 137, 230, 0.3)",
                            color: "white",
                            fontSize: "0.9em",
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.3s ease"
                          }}
                          className="badge"
                        >
                          <BsCodeSlash size={14} />
                          {lang}
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            )}
          </Col>
        </Row>

        {/* Image Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <Modal
              show={!!selectedImage}
              onHide={() => setSelectedImage(null)}
              centered
              size="xl"
              className="image-modal"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <Modal.Body style={{
                  background: "rgba(0, 0, 0, 0.95)",
                  padding: "20px",
                  position: "relative"
                }}>
                  <Button
                    variant="link"
                    onClick={() => setSelectedImage(null)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      color: "white",
                      fontSize: "2em",
                      zIndex: 10,
                      background: "rgba(98, 54, 134, 0.8)",
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0
                    }}
                  >
                    <BsX />
                  </Button>
                  <img
                    src={selectedImage.download_url}
                    alt={selectedImage.name}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "10px"
                    }}
                  />
                  <p style={{
                    color: "white",
                    textAlign: "center",
                    marginTop: "15px",
                    fontSize: "1em"
                  }}>
                    {selectedImage.name}
                  </p>
                </Modal.Body>
              </motion.div>
            </Modal>
          )}
        </AnimatePresence>
      </Container>
    </Container>
  );
}

export default ProjectDetail;
