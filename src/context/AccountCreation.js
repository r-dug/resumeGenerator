import React, { useState } from 'react';
import * as yup from "yup"
const schema = yup.object().shape({
    username: yup
      .string()
      .required('Username is required.')
      .min(5, 'Username must be at least 5 characters long.'),
    email: yup
      .string()
      .required('Email is required.')
      .email('Email must be a valid email address.'),
    password: yup
      .string()
      .required('Password is required.')
      .min(8, 'Password must be at least 8 characters long.')
      .matches(
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
        'Password must contain: numbers, uppercase and lowercase letters.'
      ),
  });

const RegistrationForm = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'https://localhost';
    const [formState, setFormState] = useState({
        email: '',
        username: '',
        password: '',
    });
    const [banner, setBanners] = useState(null);
    const [errors, setErrors] = useState({});

    const handleInputChange = (event) => {
        setFormState({
        ...formState,
        [event.target.name]: event.target.value,
        });
    };
  const sendForm = async (form) => {
      const options = {
          method: "POST",
          headers:{
              "Content-Type": "application/json"
              },
          body: JSON.stringify(form),
      }
      try{
          const response = await fetch(`${API_URL}/registration`, options)
          const data = await response.json()
          console.log("data: ",data.message)
          if (data.message === "User already exists") {
            setBanners("I'm sorry but this user already exists!")
          } else if (data.message === "User created") {
            setBanners("User Created Successfully!")
          } else if (data.message === "this Email is already in use.") {
            setBanners("Im sorry but this Email is already in use.")
          }else {
            setBanners("An unexpected error occurred");
          }
          return data
      } catch(error){
      }
  }

  const handleSubmit = (event) => {
  event.preventDefault();

  schema
      .validate(formState, { abortEarly: false })
      .then(() => {
      // If the form is valid, we can send it to the server
      sendForm(formState)
      })
      .catch((err) => {
      // If the form is invalid, we can show the validation errors
      const errorMessages = err.inner.reduce(
          (errors, error) => ({
          ...errors,
          [error.path]: error.message,
          }),
          {}
      );
      setErrors(errorMessages);
      // console.error(errorMessages)
      setBanners(Object.values(errors).join(", "))
      });
      
  // console.log(formState);
  };

  return (
    <div>
      {banner && <div className="topBanner">{banner}</div>}
    
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={formState.username}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formState.email}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={formState.password}
          onChange={handleInputChange}
        />
      </label>
      <button type="submit">Register</button>
    </form>
    </div>
  );
}

export default RegistrationForm;
