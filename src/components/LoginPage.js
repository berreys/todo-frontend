import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginStyle.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setUsername(e.target.value);
        console.log(username);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate('/user', {state:{username}});
    }

    return (
        <div className="mainContainer">
            <h1 className="h1">Sam Berrey's To-Do List</h1>
            <div className='loginContainer'>
                <h2 className="h2">Login or Register</h2>
                <p className="p">If the entered username is not already registered,<br></br> an account will be created.</p>
                <form onSubmit={handleSubmit} className="form">
                
                    <input
                        type="text"
                        value={username}
                        onChange={handleInputChange}
                        placeholder="Enter username"
                        required
                        className="input"
                    />
                    <button type="submit" className="button">Log In</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;