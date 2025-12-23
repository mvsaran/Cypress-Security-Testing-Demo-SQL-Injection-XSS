const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Vulnerability 1: SQL Injection
// The application directly concatenates the username and password into the query string
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // VULNERABLE CODE:
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    console.log('Executing Query:', query); // For demonstration

    db.get(query, (err, row) => {
        if (err) {
            res.status(500).send("Internal Server Error");
        } else if (row) {
            res.send(`<h1>Login Successful! Welcome, ${row.username}</h1>`);
        } else {
            res.send('<h1>Login Failed</h1><a href="/login.html">Try Again</a>');
        }
    });
});

// Vulnerability 2: Reflected XSS
// The application takes the 'q' query parameter and directly inserts it into the HTML response
app.get('/search', (req, res) => {
    const query = req.query.q || '';

    // VULNERABLE CODE:
    // No sanitation of 'query' before rendering it
    res.send(`
        <html>
            <body>
                <h1>Search Results</h1>
                <p>You searched for: <b>${query}</b></p>
                <form action="/search" method="GET">
                    <input type="text" name="q" placeholder="Search again...">
                    <button type="submit">Search</button>
                </form>
                <a href="/">Home</a>
            </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
