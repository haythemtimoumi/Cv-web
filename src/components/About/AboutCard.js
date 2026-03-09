import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";
import { useGitHubProfile } from "../../hooks/useGitHubProfile";

function AboutCard() {
  const { profile, loading } = useGitHubProfile();
  
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          {loading ? (
            <p style={{ textAlign: "center" }}>Loading profile information...</p>
          ) : (
            <>
              <p style={{ textAlign: "justify" }}>
                Hi everyone! I'm <span className="purple">{profile?.name || "Haythem Timoumi"}</span>
                {profile?.location && (
                  <>
                    {" "}from <span className="purple">{profile.location}</span>
                  </>
                )}.
                <br />
                I'm a <span className="purple">Software Developer</span> passionate about
                building modern web applications, automation systems, and AI-powered tools.
                <br />
                <br />
                {profile?.bio && (
                  <>
                    {profile.bio}
                    <br />
                    <br />
                  </>
                )}
                Outside of coding, I love engaging in activities that keep me
                creative and inspired:
              </p>

              <ul>
                <li className="about-activity">
                  <ImPointRight /> Building Automation Tools 🤖
                </li>
                <li className="about-activity">
                  <ImPointRight /> Exploring AI Technologies 🧠
                </li>
                <li className="about-activity">
                  <ImPointRight /> Contributing to Open Source 💻
                </li>
              </ul>

              <p style={{ color: "rgb(155 126 172)" }}>
                "Strive to build things that make a difference!"{" "}
              </p>
              <footer className="blockquote-footer">{profile?.name || "Haythem Timoumi"}</footer>
            </>
          )}
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
