import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={handleInputChange}
                    placeholder="Enter username"
                    required
                />
                <button type="submit">Log In</button>
            </form>
        </div>
    );
}

export default LoginPage;