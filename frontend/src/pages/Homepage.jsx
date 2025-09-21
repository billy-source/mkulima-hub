import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import farmersVideo from "../assets/farmers.mp4";

// Styles for the video background layout
const heroContainerStyle = {
  position: "relative",
  width: "100%",
  height: "70vh", // Sets a fixed height for the hero section
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  color: "white",
  overflow: "hidden", // Ensures the video doesn't overflow
};

const videoStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover", // Ensures the video covers the entire container
  zIndex: -1, // Pushes the video behind the text content
};

const textOverlayStyle = {
  position: "relative", // Ensures the text is on top of the video
  zIndex: 1,
  padding: "20px",
  backgroundColor: "rgba(0, 0, 0, 0.4)", // A semi-transparent overlay for readability
  borderRadius: "10px",
  maxWidth: "800px",
};

const buttonStyle = {
  padding: "15px 30px",
  fontSize: "1.2em",
  cursor: "pointer",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "5px",
  marginTop: "20px",
  transition: "background-color 0.3s ease",
};

const h2Style = {
  fontSize: "3rem",
  marginBottom: "10px",
  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
};

const pStyle = {
  fontSize: "1.2rem",
  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
};

function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* --- Hero Section with Video Background --- */}
      <section style={heroContainerStyle}>
        <video src={farmersVideo} autoPlay loop muted playsInline style={videoStyle}></video>
        
        <div style={textOverlayStyle}>
          <h2 style={h2Style}>Connecting Farmers Directly to You</h2>
          <p style={pStyle}>
            MkulimaHub bridges the gap between local farmers and urban buyers, ensuring fresh produce and fair prices for all.
          </p>
          <button onClick={() => navigate("/Marketplace")} style={buttonStyle}>
            Explore Products
          </button>
        </div>
      </section>
      <section className="bg-green-50 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Why Mkulima Hub?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              "Farmer-friendly Registration",
              "Seamless M-Pesa Integration",
              "Reliable Order Management",
              "Insights & Dashboards",
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
              >
                <p className="font-semibold text-lg">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">Our Impact</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "💰 Higher Earnings", desc: "Farmers get fair prices." },
            { title: "🥬 Fresher Produce", desc: "Buyers enjoy healthy food." },
            { title: "🌍 Local Growth", desc: "Boost the community economy." },
          ].map((impact, index) => (
            <div
              key={index}
              className="bg-green-100 rounded-2xl p-8 shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold mb-2">{impact.title}</h3>
              <p>{impact.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-green-600 text-white py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Join Mkulima Hub Today
        </h2>
        <p className="mb-8 text-lg">
          Grow more, earn more, live better.
        </p>
        <a
          href="/register"
          className="px-8 py-4 bg-blue-400 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-blue-500 transition"
        >
          Register Now
        </a>
      </section>
      {/* --- Rest of your page content (e.g., product sections, etc.) goes here --- */}
      {/* Note: I've removed the products section from here, as it belongs to the Marketplace page as per your previous code. */}
    </div>
  );
}

export default HomePage;