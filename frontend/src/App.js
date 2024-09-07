import React, { useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
// import ContainerList from "./components/container_list";

function App() {
  const [formData, setFormData] = useState({
    image: "",
    cmd: "",
  });

  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { image, cmd } = formData;
    console.log(formData)
    
    // make a array of strings for cmd such that is a (,) is comming in cmd then split it and make a array of strings
    const Command = formData.cmd.split(","); // 
    console .log(Command);
    let body = {
        "image": image,
        // Cmd is a array of strings
        "cmd": Command,
    }
    try {
      const response = await axios.post("http://localhost:5000/containers", body);
      
      console.log("Response: ", response.data);
      alert(
        `Container started with ID: ${response.data.container} on port: ${response.data.port}`
      );
    } catch (error) {
      console.error("Error starting container", error);
      alert("Error starting container");
    }
  };
  const formStyle = {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
  };

  const buttonStyle = {
    display: "block",
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  };

  const buttonHoverStyle = {
    backgroundColor: "#0056b3",
  };

  const textcenter = {
    textAlign: "center",
  };

  return (
    <>
      <Navbar />
      <div className="App">
        <h2 style={textcenter}>Manage Docker Containers</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            name="image"
            placeholder="Docker Image"
            onChange={handleChange}
            style={inputStyle}
            value={formData.image}
          />
          {/* input for Cmd */}
          <input
            type="text"
            name="cmd"
            placeholder="Cmd"
            onChange={handleChange}
            style={inputStyle}
            value={formData.cmd}
          />
          <button
            type="submit"
            style={
              isHovered ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle
            }
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Start Container
          </button>
        </form>
      </div>
      {/* <ContainerList /> */}
      <Footer />
    </>
  );
}

export default App;
