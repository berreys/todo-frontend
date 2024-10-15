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

    var showPending = true;
    var showComplete = true;

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
            else {
                setUserData((prevData) => {
                    const updatedTasks = [...prevData.tasks];
                    updatedTasks[index].state = 'complete'; // Toggle completion
                    return { ...prevData, tasks: updatedTasks };
                })
            }
            console.log("AFTER", userData);
        }
        catch(error) {
            console.error('Error completing todo:', error);
        }
    };
    const editItem = async (index, newText) => {
        try {
            console.log(newText);
            const response = await fetch(`https://todo-backend-b066bc9bfdc1.herokuapp.com/editTask`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({"username": username, "index": index, "newText": newText})
            });
            if(!response.ok) {
                throw new Error('Error editing todo');
            }
            else {
                setUserData((prevData) => {
                    const updatedTasks = [...prevData.tasks];
                    updatedTasks[index].text = newText;
                    return {...prevData, tasks: updatedTasks}
                });
            }
        }
        catch(error) {
            console.error('Error editing todo:', error);
        }
    };
    const removeItem = async (index) => {
        try{
            const response = await fetch(`https://todo-backend-b066bc9bfdc1.herokuapp.com/removeTask`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({"username": username, "index": index})
            });
            if(!response.ok) {
                throw new Error('Error editing todo');
            }
            else {
                setUserData((prevData) => {
                    const updatedTasks = [...prevData.tasks];
                    updatedTasks.splice(index, 1);
                    return {...prevData, tasks: updatedTasks}
                });
            }
        }
        catch(error) {
            console.error('Error removing todo:', error);
        }
    };
    const addItem = async (text) => {
        try {
            const response = await fetch(`https://todo-backend-b066bc9bfdc1.herokuapp.com/addTask`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({"username": username, "task": {"state": "pending", "text": text}})
            });
            if(!response.ok) {
                throw new Error('Error adding todo');
            }
            else{
                setUserData((prevData) => {
                    const updatedTasks = [...prevData.tasks];
                    updatedTasks.push({"state": "pending", "text": text});
                    return {...prevData, tasks: updatedTasks}
                })
            }
        }
        catch(error) {
            console.error('Error adding todo:', error);
        }
    }
    const changeShowPending = () => {
        showPending = !showPending;
    }

    return (
        <div>
            <h1>{username}'s Todo List</h1>
            {loading ? (
                <p>Loading user data...</p>
            ) : userData ? (
                <div>
                    <input type="checkbox" id="showPending"/>
                        <label for="showPending" onChange={changeShowPending}>Show incomplete tasks</label>
                    <ul>
                        {userData.tasks.map((todo, index) => (
                            <li key={index} className={(todo.state === 'pending' && !showPending) || (todo.state === 'complete' && !showComplete) ? 'hide' : ''} >
                                <span
                                    style={{
                                        textDecoration: todo.state === 'complete' ? 'line-through' : 'none',
                                    }}
                                >
                                    {todo.text}
                                </span>
                                <button onClick={() => completeItem(index)} className={todo.state === 'pending' ? '' : 'hide'}>
                                    {todo.state === 'complete' ? 'Undo' : 'Complete'}
                                </button>
                                <button onClick={() => editItem(index, prompt('Edit your todo:', todo.text))}>
                                    Edit
                                </button>
                                <button onClick={() => removeItem(index)}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => addItem(prompt('Enter your todo:'))}>
                        Add Item
                    </button>
                </div>
            ) : (
                <p>No user data available.</p>
            )}
        </div>
    );
};

export default TodoPage;