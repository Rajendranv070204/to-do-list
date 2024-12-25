import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css"

const App = () => {
    const [todolists, setTodolist] = useState([]);
    const [task, setTask] = useState('');
    const [editing, setEditing] = useState(null);
    const [completed, setCompleted] = useState({}); // Track completion status


    useEffect(() => {
        fetchTodolists();
    }, []);

    const fetchTodolists = async () => {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/rj/tasks`);
        setTodolist(response.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editing) {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/rj/tasks/${editing}`, { task });
            setEditing(null);
        } else {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/rj/tasks`, { task });
        }
        setTask('');
        fetchTodolists();
    };



    const handleEdit = (tasks) => {
        setEditing(tasks._id);
        setTask(tasks.task);
      
    };

    const handleDelete = async (id) => {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/rj/tasks/${id}`);
        fetchTodolists();
    };

    const toggleCompletion = (id) => {
        setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <>
    <section className='section'>
        <div className='input-box'>
        <h1 className='h1'>to do list</h1>
        <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter your task..."
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    required
                />
                <button className='btn' type="submit">{editing ? 'Update' : 'Add'}</button>
            </form>
        </div>
        <div className='output-box'>
        <ul>
                {todolists.map((tasks) => (
                    <li>
                        <p
                         key={tasks._id}
                         onClick={() => toggleCompletion(tasks._id)}
                         style={{
                             textDecoration: completed[tasks._id] ? 'line-through' : 'none',
                             cursor: 'pointer',
                         }}
                        >{tasks.task}</p>
                        <button className='obtn ebtn' style={{visibility:completed[tasks._id] ? "hidden":"visible"}}  onClick={(e) => { e.stopPropagation(); handleEdit(tasks); }}>Edit</button>
                        <button className=' obtn dbtn'  onClick={(e) => { e.stopPropagation(); handleDelete(tasks._id); }}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    </section>
        </>

    );
};

export default App;
