import React, { useState, useEffect } from 'react';
import './RegistrationForm.css';

// Custom hook for form validation
function useFormValidation(initialState, validate) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isSubmitting) {
      const noErrors = Object.keys(errors).length === 0;
      if (noErrors) {
        console.log("Form submitted successfully", values);
      }
      setIsSubmitting(false);
    }
  }, [errors, isSubmitting, values]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues({
      ...values,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setIsSubmitting(true);
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setValues,
  };
}

// Validation function
function validate(values) {
  let errors = {};

  if (!values.name) {
    errors.name = 'Name is required';
  }
  
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email address is invalid';
  }
  
  if (!values.age) {
    errors.age = 'Age is required';
  } else if (values.age <= 0) {
    errors.age = 'Age must be greater than 0';
  }
  
  if (values.attendingWithGuest && !values.guestName) {
    errors.guestName = 'Guest Name is required';
  }

  return errors;
}

const RegistrationForm = () => {
  const initialState = {
    name: '',
    email: '',
    age: '',
    attendingWithGuest: false,
    guestName: '',
  };

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setValues,
  } = useFormValidation(initialState, validate);

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isSubmitting) {
      const noErrors = Object.keys(errors).length === 0;
      if (noErrors) {
        setIsSubmitted(true);
      }
    }
  }, [errors, isSubmitting]);

  const handleBack = () => {
    setValues(initialState);
    setIsSubmitted(false);
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label>Name:</label>
        <input type="text" name="name" value={values.name} onChange={handleChange} className={errors.name ? 'error-input' : ''} />
        {errors.name && <p className="error-text">{errors.name}</p>}
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input type="email" name="email" value={values.email} onChange={handleChange} className={errors.email ? 'error-input' : ''} />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>

      <div className="form-group">
        <label>Age:</label>
        <input type="number" name="age" value={values.age} onChange={handleChange} className={errors.age ? 'error-input' : ''} />
        {errors.age && <p className="error-text">{errors.age}</p>}
      </div>

      <div className="form-group">
        <label>Are you attending with a guest?</label>
        <input type="checkbox" name="attendingWithGuest" checked={values.attendingWithGuest} onChange={handleChange} />
      </div>

      {values.attendingWithGuest && (
        <div className="form-group">
          <label>Guest Name:</label>
          <input type="text" name="guestName" value={values.guestName} onChange={handleChange} className={errors.guestName ? 'error-input' : ''} />
          {errors.guestName && <p className="error-text">{errors.guestName}</p>}
        </div>
      )}

      <button type="submit" className="submit-button">Submit</button>
    </form>
  );

  const renderSummary = () => (
    <div className="summary">
      <h2>Registration Summary</h2>
      <p><strong>Name:</strong> {values.name}</p>
      <p><strong>Email:</strong> {values.email}</p>
      <p><strong>Age:</strong> {values.age}</p>
      <p><strong>Attending with guest:</strong> {values.attendingWithGuest ? 'Yes' : 'No'}</p>
      {values.attendingWithGuest && <p><strong>Guest Name:</strong> {values.guestName}</p>}
      <button onClick={handleBack} className="back-button">Back</button>
    </div>
  );

  return (
    <div className="container">
      <h1>Event Registration Form</h1>
      {isSubmitted ? renderSummary() : renderForm()}
    </div>
  );
};

export default RegistrationForm;
