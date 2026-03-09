import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/avatar.svg";
import Tilt from "react-parallax-tilt";
import { useGitHubProfile } from "../../hooks/useGitHubProfile";

function Home2() {
  const { profile, loading } = useGitHubProfile();
  
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              LET ME <span className="purple"> INTRODUCE </span> MYSELF
            </h1>
            <p className="home-about-body">
              {loading ? (
                "Loading profile..."
              ) : profile?.bio ? (
                profile.bio
              ) : (
                <>
                  I'm a Software Developer who loves building modern web applications,
                  automation systems, and AI-powered tools. I enjoy working with APIs,
                  cloud services, and creating scalable solutions.
                  <br />
                  <br />
                  I'm proficient in
                  <i>
                    <b className="purple">
                      {" "}
                      JavaScript, TypeScript, React, and Node.js{" "}
                    </b>
                  </i>
                  — and I enjoy working across both backend and frontend stacks.
                  <br />
                  <br />
                  My key areas of interest include developing
                  <i>
                    <b className="purple">
                      {" "}
                      Web Applications, Automation Systems,{" "}
                    </b>
                  </i>
                  and exploring new ways to leverage AI and cloud technologies.
                  <br />
                  <br />
                  Whenever possible, I love building projects with
                  <b className="purple"> Node.js </b> and modern frameworks like{" "}
                  <i>
                    <b className="purple">React.js</b> and{" "}
                    <b className="purple">Next.js</b>.
                  </i>
                </>
              )}
            </p>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <img src={myImg} className="img-fluid" alt="avatar" />
            </Tilt>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default Home2;
