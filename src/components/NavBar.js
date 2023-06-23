import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Input</Link>
        </li>
        <li>
          <Link to="/resume">View Resume</Link>
        </li>
        <li>
          <Link to="/cover-letter">View Cover Letter</Link>
        </li>
        <li>
          <Link to="/job-fit">View Assessment</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

