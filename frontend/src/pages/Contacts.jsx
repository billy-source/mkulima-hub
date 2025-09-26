import React, { useState } from "react";

const Contacts = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'
  const [hoveredLink, setHoveredLink] = useState(null);

  // ======== Styles =========
  const containerStyle = {
    padding: "60px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    lineHeight: "1.7",
    color: "#2D3748",
    backgroundColor: "#F7FAFC",
  };
  const headerStyle = { textAlign: "center", marginBottom: "50px" };
  const h1Style = { color: "#1A202C", fontSize: "3rem", fontWeight: "700", marginBottom: "10px" };
  const subtitleStyle = { color: "#718096", fontSize: "1.125rem", maxWidth: "600px", margin: "0 auto" };

  const sectionStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "50px",
    marginBottom: "60px",
  };

  const contactInfoStyle = {
    backgroundColor: "#FFFFFF",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
    border: "1px solid #E2E8F0",
  };

  const contactTitleStyle = { textAlign: "center", fontSize: "1.5rem", marginBottom: "20px" };
  const itemStyle = {
    marginBottom: "20px",
    display: "flex",
    alignItems: "flex-start",
    padding: "15px",
    backgroundColor: "#F7FAFC",
    borderRadius: "8px",
    borderLeft: "4px solid #48BB78",
  };
  const iconStyle = { fontSize: "1.25rem", color: "#48BB78", marginRight: "15px" };
  const itemContentStyle = { flex: 1 };
  const itemLabelStyle = { fontWeight: "600", marginBottom: "5px" }; // FIXED
  const itemValueStyle = { margin: 0, fontSize: "1rem" };

  const socialLinksStyle = { display: "flex", gap: "15px", marginTop: "20px" };
  const socialLinkStyle = (index) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    backgroundColor: hoveredLink === index ? "#48BB78" : "#F7FAFC",
    color: hoveredLink === index ? "#fff" : "#48BB78",
    borderRadius: "50%",
    textDecoration: "none",
    border: "1px solid #E2E8F0",
    transition: "0.3s",
  });

  // ======== Form Handlers =========
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus("error");
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Replace with real API later
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setFormData({ name: "", email: "", message: "" });
      setSubmitStatus("success");
    } catch (err) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={h1Style}>Contact Us</h1>
        <p style={subtitleStyle}>
          We'd love to hear from you. Whether you're a farmer, a buyer, or just have a question, our team is here to help.
        </p>
      </div>

      <div style={sectionStyle}>
        {/* Contact Info */}
        <div style={contactInfoStyle}>
          <h2 style={contactTitleStyle}>Get in Touch</h2>

          <div style={itemStyle}>
            <i className="fas fa-map-marker-alt" style={iconStyle}></i>
            <div style={itemContentStyle}>
              <p style={itemLabelStyle}>Head Office</p>
              <p style={itemValueStyle}>123 Agri Street, Nairobi, Kenya</p>
            </div>
          </div>

          <div style={itemStyle}>
            <i className="fas fa-phone-alt" style={iconStyle}></i>
            <div style={itemContentStyle}>
              <p style={itemLabelStyle}>Phone</p>
              <p style={itemValueStyle}>+254 712 345 678</p>
            </div>
          </div>

          <div style={itemStyle}>
            <i className="fas fa-envelope" style={iconStyle}></i>
            <div style={itemContentStyle}>
              <p style={itemLabelStyle}>Email</p>
              <p style={itemValueStyle}>info@mkulimahub.com</p>
            </div>
          </div>

          {/* Social Links */}
          <div style={socialLinksStyle}>
            {["facebook", "twitter", "linkedin", "instagram"].map((platform, index) => (
              <a
                key={platform}
                href={`https://${platform}.com`}
                target="_blank"
                rel="noopener noreferrer"
                style={socialLinkStyle(index)}
                onMouseEnter={() => setHoveredLink(index)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <i className={`fab fa-${platform}`}></i>
              </a>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div style={contactInfoStyle}>
          <h2 style={contactTitleStyle}>Send Us a Message</h2>

          {submitStatus === "success" && <div style={{ background: "#C6F6D5", padding: "10px" }}>Message Sent!</div>}
          {submitStatus === "error" && <div style={{ background: "#FED7D7", padding: "10px" }}>Error sending message</div>}

          <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input name="name" value={formData.name} onChange={handleInputChange} style={{ width: "100%", marginBottom: "15px" }} />

            <label>Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleInputChange} style={{ width: "100%", marginBottom: "15px" }} />

            <label>Message</label>
            <textarea name="message" value={formData.message} onChange={handleInputChange} style={{ width: "100%", marginBottom: "15px" }} />

            <button type="submit" disabled={isSubmitting} style={{ background: "#48BB78", color: "white", padding: "10px", width: "100%", border: "none", borderRadius: "5px" }}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
