import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const TodoPage = () => {
    const location = useLocation();
    const username = location.state?.username;
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const hasFetchedRef = useRef(false);

    useEffect(() => {
        if (username && !hasFetchedRef.current) {
            hasFetchedRef.current = true;
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

    const completeItem = async (index) => {
        try {
            const response = await fetch(`https://todo-backend-b066bc9bfdc1.herokuapp.com/completeTask`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({"username": username, "index": index})
            });
            console.log("BEFORE", userData);
            if (!response.ok) {
                throw new Error('Error completing todo');
            }
            else{
                setUserData((prevData) => {
                    const updatedTasks = [...prevData.tasks];
                    updatedTasks[index].state = 'complete'; // Toggle completion
                    return { ...prevData, todos: updatedTasks };
                })
            }
            console.log("AFTER", userData);
        } catch (error) {
            console.error('Error completing todo:', error);
        }
    };

    return (
        <div>
            <h1>{username}'s Todo List</h1>
            {loading ? (
                <p>Loading user data...</p>
            ) : userData ? (
                <div>
                    <ul>
                        {userData.tasks.map((todo, index) => (
                            <li key={index}>
                                <span
                                    style={{
                                        textDecoration: todo.state === 'complete' ? 'line-through' : 'none',
                                    }}
                                >
                                    {todo.text}
                                </span>
                                <button onClick={() => completeItem(index)}>
                                    {todo.state === 'complete' ? 'Undo' : 'Complete'}
                                </button>
                                {/* <button onClick={() => editTodo(todo.id, prompt('Edit your todo:', todo.text))}>
                                    Edit
                                </button>
                                <button onClick={() => removeTodo(todo.id)}>
                                    Remove
                                </button> */}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No user data available.</p>
            )}
        </div>
    );
};

export default TodoPage;