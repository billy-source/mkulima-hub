import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.section}>
          <h4 style={styles.heading}>MkulimaHub</h4>
          <p style={styles.text}>
            Connecting farmers directly to you for fresh, quality produce.
          </p>
        </div>

        <div style={styles.section}>
          <h4 style={styles.heading}>Quick Links</h4>
          <ul style={styles.list}>
            <li><a href="/home" style={styles.link}>Home</a></li>
            <li><a href="/marketplace" style={styles.link}>Marketplace</a></li>
            <li><a href="/login" style={styles.link}>Login</a></li>
            <li><a href="/register" style={styles.link}>Register</a></li>
          </ul>
        </div>

        <div style={styles.section}>
          <h4 style={styles.heading}>Follow Us</h4>
          <div style={styles.socialIcons}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      <div style={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} MkulimaHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#1E40AF',
    color: '#fff',
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  section: {
    margin: '20px',
    flex: '1',
    minWidth: '200px',
  },
  heading: {
    fontSize: '1.2rem',
    marginBottom: '10px',
    borderBottom: '2px solid #fff',
    paddingBottom: '5px',
    display: 'inline-block',
  },
  text: {
    fontSize: '0.9rem',
    lineHeight: '1.5',
  },
  list: {
    listStyle: 'none',
    padding: '0',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.3s ease',
  },
  socialIcons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
  },
  socialLink: {
    color: '#fff',
    fontSize: '1.5rem',
    transition: 'color 0.3s ease',
  },
  bottomBar: {
    marginTop: '20px',
    paddingTop: '10px',
    borderTop: '1px solid #4B5563',
    fontSize: '0.8rem',
  },
};

export default Footer;