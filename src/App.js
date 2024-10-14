import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import TodoPage from './components/TodoPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/user" element={<TodoPage/>} />
        </Routes>
    )
}

export default App;
