// Import necessary modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


// Define the port and initiate the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Set Express to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));  // to serve static files

// Route handling will go here...
// HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// API Routes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.json(JSON.parse(data));
        }
    });
});

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



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Starting the server
app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
});
