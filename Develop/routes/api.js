const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const { get } = require('http');



const dbPath = path.join(__dirname, '..', 'db', 'db.json');

function getNotes(){
    //read content of json

    const content = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(content) || [];

}


function saveNote(title, text){

    const newNote = {
        id: uuid.v4(),
        title: title,
        text: text,
    }
    
    // add new note data to db.json

    // retrieve the existing note data 
    const notes = getNotes();
    // then push new note
    notes.push(newNote);
    // resave
    fs.writeFileSync(dbPath, JSON.stringify(notes), 'utf-8');
    return newNote;
}

function deleteNote(id){
    // get the notes
    const notes = getNotes();
    //filter out the note with the given id
    const filtered = notes.filter((note) => note.id !== id);
    //resave the notes
    fs.writeFileSync(dbPath, JSON.stringify(filtered), 'utf-8');

}



router.get('/notes', (req, res) => {
    const notes = getNotes();
    res.json(notes);
});



router.post('/notes', (req, res) => {
    //create new note
    const created = saveNote(req.body.title, req.body.text);
    res.json(created);
});


// ## Bonus

// You haven’t learned how to handle DELETE requests, but this application offers that functionality on the front end. As a bonus, try to add the DELETE route to the application using the following guideline:

// * `DELETE /notes/:id` should receive a query parameter that contains the id of a note to delete.
//  To delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.

router.delete('/notes/:id', (req, res) => {

    deleteNote(req.params.id);

    res.json({
        data: 'ok',
    })

})


module.exports = router;
