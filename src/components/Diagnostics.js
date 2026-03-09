import React, { useState, useEffect } from 'react';
import { Container, Button, Card, Alert, Badge } from 'react-bootstrap';
import { runDiagnostics } from '../utils/diagnostics';

function Diagnostics() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    try {
      const result = await runDiagnostics();
      setReport(result);
    } catch (error) {
      console.error('Diagnostic error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTest();
  }, []);

  return (
    <Container style={{ paddingTop: '150px', paddingBottom: '50px', minHeight: '100vh' }}>
      <h1 style={{ color: 'white', marginBottom: '30px' }}>
        🔍 GitHub API Diagnostics
      </h1>

      <Button 
        variant="primary" 
        onClick={runTest} 
        disabled={loading}
        style={{ marginBottom: '20px' }}
      >
        {loading ? 'Running Tests...' : 'Run Diagnostics'}
      </Button>

      {report && (
        <>
          {/* Token Status */}
          <Card style={{ marginBottom: '20px', background: '#1a1a2e', border: '1px solid #623686' }}>
            <Card.Header style={{ background: '#623686', color: 'white' }}>
              <h4>🔑 Token Status</h4>
            </Card.Header>
            <Card.Body>
              <div style={{ color: 'white' }}>
                <p>
                  <strong>Configured:</strong>{' '}
                  {report.token.configured ? (
                    <Badge bg="success">Yes</Badge>
                  ) : (
                    <Badge bg="danger">No</Badge>
                  )}
                </p>
                <p>
                  <strong>Valid:</strong>{' '}
                  {report.token.valid ? (
                    <Badge bg="success">Yes</Badge>
                  ) : (
                    <Badge bg="danger">No</Badge>
                  )}
                </p>
                <p>
                  <strong>Scopes:</strong>{' '}
                  {report.token.scopes.length > 0 ? (
                    report.token.scopes.map((scope, idx) => (
                      <Badge key={idx} bg="info" style={{ marginRight: '5px' }}>
                        {scope}
                      </Badge>
                    ))
                  ) : (
                    <Badge bg="secondary">None</Badge>
                  )}
                </p>
                <p>
                  <strong>Has "repo" scope:</strong>{' '}
                  {report.token.hasRepoScope ? (
                    <Badge bg="success">Yes ✓</Badge>
                  ) : (
                    <Badge bg="danger">No ✗</Badge>
                  )}
                </p>
                <p>
                  <strong>Has "public_repo" scope:</strong>{' '}
                  {report.token.hasPublicRepoScope ? (
                    <Badge bg="success">Yes ✓</Badge>
                  ) : (
                    <Badge bg="warning">No</Badge>
                  )}
                </p>
              </div>
            </Card.Body>
          </Card>

          {/* Repository Access */}
          <Card style={{ marginBottom: '20px', background: '#1a1a2e', border: '1px solid #623686' }}>
            <Card.Header style={{ background: '#623686', color: 'white' }}>
              <h4>📁 Repository Access</h4>
            </Card.Header>
            <Card.Body>
              <div style={{ color: 'white' }}>
                <p>
                  <strong>Can Fetch Repos:</strong>{' '}
                  {report.access.canFetchRepos ? (
                    <Badge bg="success">Yes</Badge>
                  ) : (
                    <Badge bg="danger">No</Badge>
                  )}
                </p>
                <p>
                  <strong>Can Access Private Repos:</strong>{' '}
                  {report.access.canAccessPrivate ? (
                    <Badge bg="success">Yes</Badge>
                  ) : (
                    <Badge bg="danger">No</Badge>
                  )}
                </p>
                <p>
                  <strong>Total Repos Found:</strong>{' '}
                  <Badge bg="info">{report.access.totalRepos}</Badge>
                </p>
                <p>
                  <strong>Public Repos:</strong>{' '}
                  <Badge bg="success">{report.access.publicRepos}</Badge>
                </p>
                <p>
                  <strong>Private Repos:</strong>{' '}
                  <Badge bg={report.access.privateRepos > 0 ? 'success' : 'warning'}>
                    {report.access.privateRepos}
                  </Badge>
                </p>
              </div>
            </Card.Body>
          </Card>

          {/* Recommendations */}
          {report.recommendations.length > 0 && (
            <Card style={{ marginBottom: '20px', background: '#1a1a2e', border: '1px solid #623686' }}>
              <Card.Header style={{ background: '#623686', color: 'white' }}>
                <h4>💡 Recommendations</h4>
              </Card.Header>
              <Card.Body>
                {report.recommendations.map((rec, idx) => {
                  const isError = rec.startsWith('❌');
                  const isWarning = rec.startsWith('⚠️');
                  const isSuccess = rec.startsWith('✅');
                  
                  return (
                    <Alert 
                      key={idx} 
                      variant={isError ? 'danger' : isWarning ? 'warning' : isSuccess ? 'success' : 'info'}
                      style={{ marginBottom: '10px' }}
                    >
                      {rec}
                    </Alert>
                  );
                })}
              </Card.Body>
            </Card>
          )}

          {/* Fix Instructions */}
          {!report.token.hasRepoScope && report.token.configured && (
            <Card style={{ background: '#2a1a3e', border: '2px solid #ff6b6b' }}>
              <Card.Header style={{ background: '#ff6b6b', color: 'white' }}>
                <h4>🔧 How to Fix: Add "repo" Scope</h4>
              </Card.Header>
              <Card.Body style={{ color: 'white' }}>
                <h5>Your token only has limited access. Follow these steps:</h5>
                <ol>
                  <li>
                    Go to:{' '}
                    <a 
                      href="https://github.com/settings/tokens" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#c770f0' }}
                    >
                      https://github.com/settings/tokens
                    </a>
                  </li>
                  <li>Click "Generate new token" → "Generate new token (classic)"</li>
                  <li>
                    <strong>Name:</strong> Portfolio - Full Access
                  </li>
                  <li>
                    <strong>Expiration:</strong> No expiration (or 90 days)
                  </li>
                  <li>
                    <strong>Select scopes:</strong>
                    <ul>
                      <li>✅ <strong>repo</strong> (Full control of private repositories)</li>
                      <li>✅ <strong>read:user</strong> (Read user profile data)</li>
                    </ul>
                  </li>
                  <li>Click "Generate token"</li>
                  <li>Copy the token (starts with ghp_...)</li>
                  <li>
                    Update your <code>.env</code> file:
                    <pre style={{ 
                      background: '#1a1a2e', 
                      padding: '10px', 
                      borderRadius: '5px',
                      marginTop: '10px'
                    }}>
                      REACT_APP_GITHUB_TOKEN=your_new_token_here
                    </pre>
                  </li>
                  <li>Restart the development server</li>
                </ol>
              </Card.Body>
            </Card>
          )}
        </>
      )}
    </Container>
  );
}

export default Diagnostics;
