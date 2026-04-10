import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

// Create the login component using setUser from App.jsx
const Login = ({setUser}) => {

    // Navigation Setup
    const navigate = useNavigate();

    // Create state variables to store login username, password, and errors if necessary
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Create state variables to store register username, password, success, and errors if necessary
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [registerError, setRegisterError] = useState('');
    const [registerSuccess, setRegisterSuccess] = useState('');

    // Make sure the page does not refresh when the form is submitted as that will erase the stored username/password
    const loginSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try{
            // Sending the request to the backend
            const response = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
    
            const data = await response.json();
    
            // If fails
            if (!response.ok) {
                setError(data.error || 'Login faled');
                return;
            }
    
            // If success, store the username in App.jsx and redirect to the home page
            sessionStorage.setItem('user', data.username);
            setUser(data.username);
            navigate('/home');

        }
        catch(error) {
            console.error(error)
            setError('Server error');
        }
    }

    const registerSubmit = async (x) => {
        x.preventDefault();
        setRegisterError('');
        setRegisterSuccess('');

        try{
            // Sending the request to the backend
            const response = await fetch('http://localhost:8080/api/users/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: newUsername,
                    password: newPassword
                })
            });
    
            const data = await response.json();
    
            // If fails
            if (!response.ok) {
                setRegisterError(data.error || 'Registration faled');
                return;
            }
    
            // If success, store the username in App.jsx and redirect to the home page
            setRegisterSuccess('Account created successfully! You can log in now');
            setNewUsername('');
            setNewPassword('');

        }
        catch(error) {
            console.error(error)
            setRegisterError('Server error');
        }
    }

    return (
        <div className='page-container'>
            <header className="hero-section">
                <h1>TMU Event Planner Login</h1>
                <p>In order to access the TMU Event Planner, you must log in</p>
            </header>
            <section className="cards-container">

                {/* Login */}
                <div className="card login-card">
                    <div className="card-material">
                        <h2>Login</h2>
                        <p>Already have an account? Log in with your credentials below!</p>
                        <form onSubmit={loginSubmit}>
                            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                            <button type="submit" className="button login-button">Login</button>
                        </form>
                        {error && <p className="error-text" >{error}</p>}
                    </div>
                </div>

                {/* Register */}
                <div className="card register-card">
                    <div className="card-material">
                        <h2>Create Account</h2>
                        <p>Don't have an account? Create one by entering a username and password below!</p>
                        <form onSubmit={registerSubmit}>
                            <input type="text" placeholder="Username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required/>
                            <input type="password" placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required/>
                            <button type="submit" className="button register-button">Create Account</button>
                        </form>
                        {registerError && <p className="error-text">{registerError}</p>}
                        {registerSuccess && <p className="success-text">{registerSuccess}</p>}
                    </div>
                </div>
            </section>
        </div>
      );
}
export default Login;