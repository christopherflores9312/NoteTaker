// Import necessary modules
const express = require('express'); // Express.js framework
const path = require('path'); // Node.js path module for working with file and directory paths
const fs = require('fs'); // Node.js file system module for working with the file system
const { v4: uuidv4 } = require('uuid'); // UUID package for generating unique identifiers

// Define the port and initiate the Express app
const app = express();
const PORT = process.env.PORT || 3000; // Use the port from environment variables if available, else use port 3000

// Set Express to handle data parsing
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.use(express.static('public')); // Serve static files from the 'public' directory

// Route to serve notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// API route to get notes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// API route to add a new note
app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const notes = JSON.parse(data);
            const newNote = {
                title: req.body.title,
                text: req.body.text,
                id: uuidv4(),
            };

            notes.push(newNote);

            fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
                if (err) throw err;
                res.status(200).json(newNote);
            });
        }
    });
});

// API route to delete a note
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let notes = JSON.parse(data);
            notes = notes.filter((note) => note.id !== req.params.id);

            fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
                if (err) throw err;
                res.status(200).end();
            });
        }
    });
});

// Route to serve index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Starting the server
app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
});
