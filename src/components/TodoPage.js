import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const TodoPage = () => {
    const location = useLocation();
    console.log(location); // Log location to see if state is passed correctly
    const username = location.state?.username;
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const hasFetchedRef = useRef(false); // Create a ref to track fetch status

    useEffect(() => {
        // Only fetch user data if username is defined and hasn't been fetched yet
        if (username && !hasFetchedRef.current) {
            hasFetchedRef.current = true; // Mark as fetched
            fetchUserData(username);
        }
    }, [username]);

    const fetchUserData = async (usernameParam) => {
        setLoading(true);
        try {
            console.log("USERNAME:", usernameParam);
            const response = await fetch(`https://todo-backend-b066bc9bfdc1.herokuapp.com/login/${usernameParam}`);
            if (!response.ok) {
                throw new Error('Error logging in');
            }
            const data = await response.json();
            console.log("DATA:", data);
            setUserData(data);
        } catch (error) {
            console.error('Error logging in:', error);
            setUserData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>User Information</h1>
            {loading ? ( // Check loading state
                <p>Loading user data...</p>
            ) : userData ? (
                <div>
                    <p>Username: {userData.username}</p>
                    {/* Uncomment the line below when you confirm the structure of your data */}
                    {/* <p>Email: {userData.tasks[0].state}</p> */}
                </div>
            ) : (
                <p>No user data available.</p>
            )}
        </div>
    );
};

export default TodoPage;