const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5001; // Change this if needed

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/tododata', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schema and Model
const todotaskSchema = new mongoose.Schema({
    task: { type: String, required: true },
});

const Todo = mongoose.model('task', todotaskSchema);

// Routes
// Create Todo
app.post('/rj/tasks', async (req, res) => {
    try {
        const todotask = new Todo(req.body);
        await todotask.save();
        res.status(201).json(todotask);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all Todos
app.get('/rj/tasks', async (req, res) => {
    try {
        const todotasks = await Todo.find();
        res.json(todotasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Todo
app.put('/rj/tasks/:id', async (req, res) => {
    try {
        const todotask = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!todotask) return res.status(404).json({ error: 'Hospital not found' });
        res.json(todotask);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete Todo
app.delete('/rj/tasks/:id', async (req, res) => {
    try {
        const todotask = await Todo.findByIdAndDelete(req.params.id);
        if (!todotask) return res.status(404).json({ error: 'Hospital not found' });
        res.json({ message: 'Hospital deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

