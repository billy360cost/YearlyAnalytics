const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock user data for authentication
const users = [
    { username: 'Ashok', password: 'Taboo@123', role: 'admin' },
    { username: 'Isaac', password: 'AmmuAmmu', role: 'user' },
    { username: 'Karthk', password: 'Login@123', role: 'user' }
];
const testCases = {
    creation: [],
    execution: [],
    defects: []
};

// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Test case creation entry
app.post('/api/test-case-creation', (req, res) => {
    const { description, date, manDays } = req.body;
    testCases.creation.push({ description, date, manDays });
    res.json({ success: true });
});

// Test case execution entry
app.post('/api/test-case-execution', (req, res) => {
    const { description, date, manDays } = req.body;
    testCases.execution.push({ description, date, manDays });
    res.json({ success: true });
});

// Bug creation entry
app.post('/api/bugs-created', (req, res) => {
    const { description, date } = req.body;
    testCases.defects.push({ description, date });
    res.json({ success: true });
});

// Analytics endpoint
app.post('/api/analytics', (req, res) => {
    const { period, fromMonth, toMonth } = req.body;
    
    const totalCreation = testCases.creation.length;
    const totalExecution = testCases.execution.length;
    const totalDefects = testCases.defects.length;
    
    const creationManDays = testCases.creation.reduce((acc, tc) => acc + tc.manDays, 0);
    const executionManDays = testCases.execution.reduce((acc, tc) => acc + tc.manDays, 0);
    
    const creationPerManDay = totalCreation / creationManDays || 0;
    const executionPerManDay = totalExecution / executionManDays || 0;
    
    res.json({
        totalCreation,
        totalExecution,
        totalDefects,
        creationManDays,
        executionManDays,
        creationPerManDay,
        executionPerManDay
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
