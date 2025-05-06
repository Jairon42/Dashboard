import { useState } from "react";
import { useUser } from "../context/UserContext";
import { FaUser, FaLock, FaMoon, FaSun } from "react-icons/fa";
import "../styles/Login.css";

const Login = () => {
  const { loginUser, error } = useUser();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [darkMode, setDarkMode] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser(credentials);
  };

  return (
    <div className={`login-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="login-box">
        <div className="login-header">
          <h2>Bienvenido</h2>
          <button className="mode-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-icon-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="username"
              placeholder="Usuario"
              value={credentials.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>
          <div className="input-icon-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={credentials.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" className="login-btn">Iniciar sesión</button>
        </form>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
