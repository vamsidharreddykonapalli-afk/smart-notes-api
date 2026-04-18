const express = require('express');
const app = express();

app.use(express.json());

let notes = [];
let id = 1;

// RESET FUNCTION FOR TESTING
app.resetNotes = () => {
  notes = [];
  id = 1;
};

// GET all notes
app.get('/notes', (req, res) => {
  res.json(notes);
});

// SEARCH notes
app.get('/notes/search', (req, res) => {
  const q = req.query.q?.toLowerCase() || "";
  const result = notes.filter(n => 
    n.title.toLowerCase().includes(q) ||
    n.content.toLowerCase().includes(q)
  );
  res.json(result);
});

// GET note by ID
app.get('/notes/:id', (req, res) => {
  const note = notes.find(n => n.id === parseInt(req.params.id));
  if (!note) return res.status(404).json({ error: "Not found" });
  res.json(note);
});

// CREATE note
app.post('/notes', (req, res) => {
  const { title, content, important } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title required" });
  }

  const newNote = {
    id: id++,
    title,
    content: content || "",
    important: important || false
  };

  notes.push(newNote);
  res.status(201).json(newNote);
});

// UPDATE note
app.put('/notes/:id', (req, res) => {
  const note = notes.find(n => n.id === parseInt(req.params.id));
  if (!note) return res.status(404).json({ error: "Not found" });

  note.title = req.body.title || note.title;
  note.content = req.body.content || note.content;
  note.important = req.body.important ?? note.important;

  res.json(note);
});

// DELETE note
app.delete('/notes/:id', (req, res) => {
  const index = notes.findIndex(n => n.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Not found" });

  notes.splice(index, 1);
  res.json({ message: "Deleted" });
});

// SERVER START
if (require.main === module) {
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
