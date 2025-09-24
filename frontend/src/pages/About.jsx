import React from 'react';

const About = () => {
  const containerStyle = {
    padding: '40px 20px',
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    color: '#333',
  };

  const sectionStyle = {
    marginBottom: '40px',
  };

  const h1Style = {
    color: '#1E40AF',
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '2.5rem',
  };

  const h2Style = {
    color: '#4B5563',
    marginBottom: '15px',
    borderBottom: '2px solid #ccc',
    paddingBottom: '5px',
  };

  const teamMemberStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const teamImageStyle = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    marginRight: '20px',
    objectFit: 'cover',
  };

  return (
    <div style={containerStyle}>
      <h1 style={h1Style}>About MkulimaHub</h1>
      
      <div style={sectionStyle}>
        <h2 style={h2Style}>Our Mission</h2>
        <p>
          MkulimaHub is a digital marketplace dedicated to creating a direct and transparent connection between local farmers and urban consumers. Our mission is to empower farmers by providing them with a platform to sell their fresh, high-quality produce at fair prices, while offering consumers a convenient way to access farm-to-table products.
        </p>
      </div>
      
      <div style={sectionStyle}>
        <h2 style={h2Style}>What We Do</h2>
        <p>
          We simplify the farm-to-fork supply chain. Our platform allows farmers to list their produce, manage inventory, and connect directly with customers. For buyers, we provide a seamless browsing experience to discover a variety of fresh produce, place orders, and track their delivery. We believe in sustainable agriculture and supporting local communities.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={h2Style}>Our Story</h2>
        <p>
          Founded by a team passionate about technology and agriculture, MkulimaHub was born out of a desire to solve the inefficiencies in traditional food distribution. We saw an opportunity to use technology to benefit both ends of the supply chain, ensuring farmers get a better share of the profit and consumers receive fresher goods.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={h2Style}>Meet the Team</h2>
        <p>
          Our team is a blend of agricultural experts and tech innovators, all working together to make MkulimaHub a success.
        </p>
        <div style={teamMemberStyle}>
          <img src="https://i.postimg.cc/5tCDYCHF/bill.jpg" alt="Team Member" style={teamImageStyle} />
          <div>
            <h3>Billy Kemboi</h3>
            <p><strong>Co-founder & CEO</strong></p>
            <p>Billy is a passionate advocate for sustainable farming and has a background in agricultural economics.</p>
          </div>
        </div>
        <div style={teamMemberStyle}>
          <img src="https://via.placeholder.com/120" alt="Team Member" style={teamImageStyle} />
          <div>
            <h3>John Smith</h3>
            <p><strong>Co-founder & CTO</strong></p>
            <p>With years of experience in software development, John builds the seamless technology that powers MkulimaHub.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;