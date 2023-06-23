import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import Login from './context/Login';
import RegistrationForm from './context/AccountCreation';
import Main from './components/display/Main';
import { UserProvider } from './context/Provider';
import PrivateRoute from './PrivateRoute';
import Navbar from './components/NavBar'
import { useNavigate } from 'react-router-dom';


const App = () => {
  const Navigation = () => {
    const { user, setUser } = useContext(UserContext);
    console.log(user)
    return (
      <nav>
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && <Link to="/main">Main</Link>}
        {user && <button onClick={() => {setUser(null)}}>Logout</button>}
      </nav>
    );
  };
  return (
    <UserProvider>
    <Router>
      <Navigation />
      <Routes>
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/main"element={<PrivateRoute><Main /></PrivateRoute>} />
      </Routes>
    </Router>
    </UserProvider>
  );
};

export default App;



// ******************************************************************


// import { BrowserRouter as Router, Route, Redirect, Routes } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import UserContext from './UserContext';
// import NavBar from './NavBar';
// import Resume from './display/Resume';
// import CoverLetter from './display/CoverLetter';
// import JobFit from './display/JobFit';

// const App = () => {
//   // State variables
//   // I think we want this to be reusable accross 
//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();

//     reader.onload = (e) => {
//       const content = e.target.result;
//       setResumeValue(content);
//     };

//     reader.readAsText(file);
//   }

//   return (
//     <Router>
//       <div className="app">
//         <NavBar />
//         <Routes>
//           <Route path="/create" exact>
//             {/* Render the component for the input view */}
//             {/* Replace the existing JSX for the input view */}
//           </Route>
//           <Route path="/Resume">
//             {/* Render the component for the resume view */}
//             {/* Replace the existing JSX for the resume view */}
//           </Route>
//           <Route path="/cover-letter">
//             {/* Render the component for the cover letter view */}
//             {/* Replace the existing JSX for the cover letter view */}
//           </Route>
//           <Route path="/job-fit">
//             {/* Render the component for the job fit view */}
//             {/* Replace the existing JSX for the job fit view */}
//           </Route>
//           <Redirect to="/create" />
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;
