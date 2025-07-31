import "./styles.css";

import React, { Component, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tab } from "@headlessui/react";

import { PageView } from "layout/PageView";
import InputComponent from "components/InputComponent";
import { UploadAvatar } from "components/UploadAvatar/UploadAvatar";
import { Switch } from "components/Switch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Floating background elements
function FloatingElements() {
  return (
    <div className="floating-elements">
      <div 
        className="floating-circle w-20 h-20 top-10 left-10"
        style={{ '--delay': '0s' } as any}
      />
      <div 
        className="floating-circle w-32 h-32 top-1/4 right-10"
        style={{ '--delay': '1s' } as any}
      />
      <div 
        className="floating-circle w-16 h-16 bottom-20 left-1/4"
        style={{ '--delay': '2s' } as any}
      />
      <div 
        className="floating-circle w-24 h-24 bottom-10 right-1/3"
        style={{ '--delay': '0.5s' } as any}
      />
    </div>
  );
}

// Enhanced Input Component
function AuthInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon,
  ...props
}: any) {
  return (
    <div className="auth-input-group animate-slide-up">
      <label className="auth-label">{label}</label>
      <div className="auth-input-wrapper">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`auth-input ${icon ? 'pl-12' : ''} ${error ? 'error' : ''}`}
          {...props}
        />
        {error && <div className="auth-error-message">{error}</div>}
      </div>
    </div>
  );
}

function Login({
  onSubmit,
  onUsernameChange,
  onPasswordChange,
  loading,
  errors
} : any) {
  return (
    <div className="auth-form">
      <AuthInput
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        onChange={onUsernameChange}
        error={errors.email}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        }
      />

      <AuthInput
        label="Password"
        type="password"
        placeholder="Enter your password"
        onChange={onPasswordChange}
        error={errors.password}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        }
      />

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center text-gray-300">
          <input type="checkbox" className="mr-2 rounded" />
          Remember me
        </label>
        <button type="button" className="auth-link">
          Forgot password?
        </button>
      </div>

      <button 
        onClick={() => onSubmit()} 
        disabled={loading}
        className="auth-button animate-slide-up"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="auth-spinner" />
            <span>Signing in...</span>
          </div>
        ) : (
          'Sign In'
        )}
      </button>
    </div>
  );
}

function Register({
  onSubmit,
  onUsernameChange,
  onPasswordChange,
  onFnameChange,
  onLnameChange,
  onUserTypeChange,
  loading,
  errors
}: any) {
  return (
    <div className="auth-form">
      <div className="grid grid-cols-2 gap-4">
        <AuthInput
          label="First Name"
          placeholder="John"
          onChange={onFnameChange}
          error={errors.fname}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />
        <AuthInput
          label="Last Name"
          placeholder="Doe"
          onChange={onLnameChange}
          error={errors.lname}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />
      </div>

      <AuthInput
        label="Email Address"
        type="email"
        placeholder="john.doe@example.com"
        onChange={onUsernameChange}
        error={errors.email}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        }
      />

      <AuthInput
        label="Password"
        type="password"
        placeholder="Create a strong password"
        onChange={onPasswordChange}
        error={errors.password}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        }
      />

      <div className="auth-input-group">
        <label className="auth-label">User Type</label>
        <select 
          onChange={(e) => onUserTypeChange(e.target.value)}
          className="auth-input"
          defaultValue=""
        >
          <option value="" disabled>Select your role</option>
          <option value="Player">Player</option>
          <option value="Coach">Coach</option>
          <option value="Manager">Manager</option>
        </select>
      </div>

      <div className="text-sm text-gray-300">
        <label className="flex items-start space-x-2">
          <input type="checkbox" className="mt-1" required />
          <span>
            I agree to the{' '}
            <button type="button" className="auth-link">Terms of Service</button>
            {' '}and{' '}
            <button type="button" className="auth-link">Privacy Policy</button>
          </span>
        </label>
      </div>

      <button 
        onClick={() => onSubmit()} 
        disabled={loading}
        className="auth-button animate-slide-up"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="auth-spinner" />
            <span>Creating account...</span>
          </div>
        ) : (
          'Create Account'
        )}
      </button>
    </div>
  );
}

export function LoginRegister() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [userType, setUserType] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const closePopup = function() {
    setPopupVisible(false);
    setPopupMessage("");
  }

  useEffect(() => {
    if(popupMessage && popupMessage.trim() !== ""){
      setPopupVisible(true);
      setTimeout(() => {
        setPopupVisible(false);
        setPopupMessage("");
      }, 5000);
    }
  }, [popupMessage]);

  useEffect(() => {
    // Get any message from localStorage
    const message = window.localStorage.getItem("message");
    if (message) {
      setPopupMessage(message);
      window.localStorage.removeItem("message");
    }
  }, []);

  // Form validation
  const validateLogin = () => {
    const newErrors: any = {};
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors: any = {};
    
    if (!fname.trim()) {
      newErrors.fname = "First name is required";
    }
    
    if (!lname.trim()) {
      newErrors.lname = "Last name is required";
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!userType) {
      newErrors.userType = "Please select a user type";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function login() {
    if (!validateLogin()) {
      return;
    }

    setLoading(true);
    setErrors({});
    
    fetch(`${API_BASE_URL}/login-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        
        if (data.status == "ok") {
          window.localStorage.setItem("token", data.data);
          window.localStorage.setItem("loggedIn", "true");
          
          // Success message
          window.localStorage.setItem("message", "Login successful! Welcome back.");
          window.localStorage.setItem("messageType", "success");
          
          // Navigate to dashboard
          navigate("/dashboard");
        } else {
          setPopupMessage(data.error || "Login failed. Please try again.");
        }
      })
      .catch((error) => {
        setLoading(false);
        setPopupMessage("Network error. Please check your connection.");
        console.error("Login error:", error);
      });
  }

  function register() {
    if (!validateRegister()) {
      return;
    }

    setLoading(true);
    setErrors({});
    
    fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        fname,
        lname,
        userType,
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        
        if (data.status == "ok") {
          window.localStorage.setItem("token", data.data);
          window.localStorage.setItem("loggedIn", "true");
          
          // Success message
          window.localStorage.setItem("message", "Account created successfully! Welcome to Playmate.");
          window.localStorage.setItem("messageType", "success");
          
          // Navigate to dashboard
          navigate("/dashboard");
        } else {
          setPopupMessage(data.error || "Registration failed. Please try again.");
        }
      })
      .catch((error) => {
        setLoading(false);
        setPopupMessage("Network error. Please check your connection.");
        console.error("Registration error:", error);
      });
  }

  return (
    <div className="auth-container">
      <FloatingElements />
      
      {/* Popup Message */}
      {popupVisible && (
        <div className={`auth-popup ${popupVisible ? 'show' : 'hide'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>{popupMessage}</span>
            </div>
            <button onClick={closePopup} className="ml-4 hover:text-red-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="auth-card animate-slide-up">
        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">
            {activeTab === 0 ? 'Welcome Back' : 'Join Playmate'}
          </h1>
          <p className="auth-subtitle">
            {activeTab === 0 
              ? 'Sign in to continue your sports journey' 
              : 'Create your account and start playing'
            }
          </p>
        </div>

        {/* Custom Tabs */}
        <div className="auth-tabs">
          <button
            onClick={() => setActiveTab(0)}
            className={`auth-tab ${activeTab === 0 ? 'active' : 'inactive'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab(1)}
            className={`auth-tab ${activeTab === 1 ? 'active' : 'inactive'}`}
          >
            Sign Up
          </button>
        </div>

        {/* Tab Content */}
        <div className="relative">
          {activeTab === 0 ? (
            <Login 
              onSubmit={login} 
              onUsernameChange={setEmail} 
              onPasswordChange={setPassword}
              loading={loading}
              errors={errors}
            />
          ) : (
            <Register 
              onSubmit={register} 
              onUsernameChange={setEmail} 
              onPasswordChange={setPassword}
              onFnameChange={setFname}
              onLnameChange={setLname}
              onUserTypeChange={setUserType}
              loading={loading}
              errors={errors}
            />
          )}
        </div>

        {/* Social Login Divider */}
        <div className="auth-divider animate-slide-up">
          <div className="auth-divider-line" />
          <span className="auth-divider-text">or</span>
          <div className="auth-divider-line" />
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3 animate-slide-up">
          <button className="auth-social-button">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          
          <button className="auth-social-button">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-400 animate-slide-up">
          {activeTab === 0 ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setActiveTab(1)} className="auth-link">
                Sign up here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => setActiveTab(0)} className="auth-link">
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
