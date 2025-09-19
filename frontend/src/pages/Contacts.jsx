import React from 'react';

const Contacts = () => {
  const containerStyle = {
    padding: '40px 20px',
    maxWidth: '700px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    color: '#333',
  };

  const h1Style = {
    color: '#1E40AF',
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '2.5rem',
  };

  const contactInfoStyle = {
    backgroundColor: '#f9f9f9',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const itemStyle = {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
  };

  const iconStyle = {
    fontSize: '1.5rem',
    color: '#4CAF50',
    marginRight: '15px',
  };

  const formStyle = {
    marginTop: '40px',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '1rem',
  };

  const buttonStyle = {
    width: '100%',
    padding: '15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  return (
    <div style={containerStyle}>
      <h1 style={h1Style}>Contact Us</h1>
      
      <div style={contactInfoStyle}>
        <p style={{ textAlign: 'center', marginBottom: '30px' }}>
          We'd love to hear from you. Whether you're a farmer, a buyer, or just have a question, feel free to reach out.
        </p>
        
        <div style={itemStyle}>
          <i className="fas fa-map-marker-alt" style={iconStyle}></i>
          <div>
            <p><strong>Head Office</strong></p>
            <p>123 Agri Street, Nairobi, Kenya</p>
          </div>
        </div>
        
        <div style={itemStyle}>
          <i className="fas fa-phone-alt" style={iconStyle}></i>
          <div>
            <p><strong>Phone</strong></p>
            <p>+254 712 345 678</p>
          </div>
        </div>
        
        <div style={itemStyle}>
          <i className="fas fa-envelope" style={iconStyle}></i>
          <div>
            <p><strong>Email</strong></p>
            <p>info@mkulimahub.com</p>
          </div>
        </div>
      </div>
      
      <div style={formStyle}>
        <h2 style={{ color: '#4B5563', marginBottom: '20px' }}>Send Us a Message</h2>
        <form>
          <input type="text" placeholder="Your Name" style={inputStyle} />
          <input type="email" placeholder="Your Email" style={inputStyle} />
          <textarea placeholder="Your Message" rows="5" style={inputStyle}></textarea>
          <button type="submit" style={buttonStyle}>Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contacts;