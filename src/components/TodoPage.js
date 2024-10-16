import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './TodoStyle.css';

const TodoPage = () => {
    const location = useLocation();
    const username = location.state?.username;
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const hasFetchedRef = useRef(false);
    const [showPending, setShowPending] = useState(true);
    const [showComplete, setShowComplete] = useState(true);
    const [newTaskText, setNewTaskText] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [editText, setEditText] = useState('');

    useEffect(() => {
        if (username && !hasFetchedRef.current) {
            hasFetchedRef.current = true;
            fetchUserData(username);
        }
    }, [username]);

    const fetchUserData = async (usernameParam) => {
        setLoading(true);
        try {
            const response = await fetch(`https://todo-backend-b066bc9bfdc1.herokuapp.com/login/${usernameParam}`);
            if (!response.ok) {
                throw new Error('Error logging in');
            }
            const data = await response.json();
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "username": username, "index": index })
            });
            if (!response.ok) {
                throw new Error('Error completing todo');
            } else {
                setUserData((prevData) => {
                    const updatedTasks = [...prevData.tasks];
                    updatedTasks[index].state = 'complete';
                    return { ...prevData, tasks: updatedTasks };
                });
            }
        } catch (error) {
            console.error('Error completing todo:', error);
        }
    };

    const handleEditItemClick = (index, text) => {
        setEditIndex(index);
        setEditText(text);
    };

    const handleEditSubmit = async (index) => {
        try {
            const response = await fetch(`https://todo-backend-b066bc9bfdc1.herokuapp.com/editTask`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "username": username, "index": index, "newText": editText })
            });
            if (!response.ok) {
                throw new Error('Error editing todo');
            } else {
                setUserData((prevData) => {
                    const updatedTasks = [...prevData.tasks];
                    updatedTasks[index].text = editText;
                    return { ...prevData, tasks: updatedTasks };
                });
                setEditIndex(null); // Close the editing input
            }
        } catch (error) {
            console.error('Error editing todo:', error);
        }
    };

    const removeItem = async (index) => {
        try {
            const response = await fetch(`https://todo-backend-b066bc9bfdc1.herokuapp.com/removeTask`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "username": username, "index": index })
            });
            if (!response.ok) {
                throw new Error('Error removing todo');
            } else {
                setUserData((prevData) => {
                    const updatedTasks = [...prevData.tasks];
                    updatedTasks.splice(index, 1);
                    return { ...prevData, tasks: updatedTasks };
                });
            }
        } catch (error) {
            console.error('Error removing todo:', error);
        }
    };

    const handleAddTaskSubmit = async () => {
        if(newTaskText === '') return;
        try {
            const response = await fetch(`https://todo-backend-b066bc9bfdc1.herokuapp.com/addTask`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "username": username, "task": { "state": "pending", "text": newTaskText } })
            });
            if (!response.ok) {
                throw new Error('Error adding todo');
            } else {
                setUserData((prevData) => {
                    const updatedTasks = [...prevData.tasks];
                    updatedTasks.push({ "state": "pending", "text": newTaskText });
                    return { ...prevData, tasks: updatedTasks };
                });
                setNewTaskText(''); // Clear the input field after submission
            }
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const handleShowPendingChange = () => {
        setShowPending((prev) => !prev);
    };

    const handleShowCompleteChange = () => {
        setShowComplete((prev) => !prev);
    };

    return (
        <div className='div'>
            <h1 className='header'>{username}'s To-Do List</h1>
            {loading ? (
                <p className='loading-text'>Loading user data...</p>
            ) : userData ? (
                <div className='body-div'>
                    <div className='filter-buttons'>
                        <input type="checkbox" id="showPending" onChange={handleShowPendingChange} checked={showPending} />
                        <label htmlFor="showPending">Show incomplete tasks</label>
                        <input type="checkbox" id="showComplete" onChange={handleShowCompleteChange} checked={showComplete} />
                        <label htmlFor="showComplete">Show complete tasks</label>
                    </div>
                    <ul className='list'>
                        {userData.tasks.map((todo, index) => (
                            <li key={index} className={(todo.state === 'pending' && !showPending) || (todo.state === 'complete' && !showComplete) ? 'hide' : 'task'}>
                                {editIndex === index ? (
                                    <div className="edit-div">
                                        <input
                                            type="text"
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                        />
                                        
                                        <button onClick={() => setEditIndex(null)} className='remove-btn'>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                width="24"
                                                height="24"
                                            >
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                        <button onClick={() => handleEditSubmit(index)} className='complete-btn'>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                width="24"
                                                height="24"
                                            >
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <span style={{ textDecoration: todo.state === 'complete' ? 'line-through' : 'none' }}>
                                        {todo.text}
                                    </span>
                                )}
                                {editIndex !== index && (
                                    <>
                                        <button onClick={() => removeItem(index)} className="remove-btn">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                width="24"
                                                height="24"
                                            >
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                        <button onClick={() => handleEditItemClick(index, todo.text)} className={todo.state === 'pending' ? 'edit-btn' : 'hide'}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                width="24"
                                                height="24"
                                            >
                                              <path d="M12 20h9" />
                                              <path d="M16.5 3l4.5 4.5-12 12H4v-4l12-12z" />
                                            </svg>
                                        </button>
                                        <button onClick={() => completeItem(index)} className={todo.state === 'pending' ? 'complete-btn' : 'hide'}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                width="24"
                                                height="24"
                                            >
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className="add-div">
                        <input
                            type="text"
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            placeholder="Enter new task"
                        />
                        <button onClick={handleAddTaskSubmit} className="complete-btn">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                width="24"
                                height="24"
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            ) : (
                <p>No user data available.</p>
            )}
        </div>
    );
};

export default TodoPage;
