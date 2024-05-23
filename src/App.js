import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import Dashboard from './Components/Dashboard';
import Login from './Components/Login';
import { BrowserRouter as Router, Route, Routes, Switch, Link } from 'react-router-dom';

function App() {
  // localStorage.clear()
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    // Check if a token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };


  return (
    <>
      <div className="container">
      {isAuthenticated ? (
        <Dashboard/>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
    </>
  );
}

export default App;
