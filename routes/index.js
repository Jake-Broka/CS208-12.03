var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next){
  try {
    req.db.query('SELECT * FROM todos;', (err, results) => {
      if (err) {
        console.error('Error fetching todos:', err);
        return res.status(500).send('Error fetching todos');
      }
      res.render('index', { title: 'My Simple TODO', todos: results });
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
});

router.post('/create', function (req, res, next) {
    const { task } = req.body;
    //Checks for blank input
    if(task.trim()){
      try {
        req.db.query('INSERT INTO todos (task) VALUES (?);', [task], (err, results) => {
          if (err) {
            console.error('Error adding todo:', err);
            return res.status(500).send('Error adding todo');
          }
          console.log('Todo added successfully:', results);
          // Redirect to the home page after adding
          res.redirect('/');
        });
      } catch (error) {
        console.error('Error adding todo:', error);
        res.status(500).send('Error adding todo');
      }
    } else {
      console.log('Blank todo input!');
    }
});

router.post('/delete', function (req, res, next) {
    const { id } = req.body;
    try {
      req.db.query('DELETE FROM todos WHERE id = ?;', [id], (err, results) => {
        if (err) {
          console.error('Error deleting todo:', err);
          return res.status(500).send('Error deleting todo');
        }
        console.log('Todo deleted successfully:', results);
        // Redirect to the home page after deletion
        res.redirect('/');
    });
    }catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).send('Error deleting todo:');
    }
});

/*
  Checks the for the completeness status of a todo, and adjusts the status accordingly upon user input
*/
router.post('/complete', function(req, res, next){
  const { id } = req.body;
  try{
    req.db.query('UPDATE todos SET completed = CASE WHEN completed = 0 THEN 1 WHEN completed = 1 THEN 0 END WHERE id = ?', [id], function(err, results){
      if(err){
        console.error('Error setting complete:',err);
        return res.status(500).send('Error setting complete');
      }
      console.log('Set complete successfully:', results);
      res.redirect('/');
    });
  } catch(error){
      console.error('Error setting complete:', error);
      res.status(500).send('Error setting complete:');
  }
});

/*
  Allows the user to edit the task based off the text entered through the form submission.
*/
router.post('/edit', function (req, res, next){
  const { editText, id } = req.body
  //Checks for blank input
  if(editText.trim()){
    try{
      req.db.query('UPDATE todos SET task = ? WHERE id = ?', [editText, id], function(err, results){
        if(err){
          console.error('Error editing task:',err);
          return res.status(500).send('Error editing task');
        }
        console.log('Edited task successfully:', results);
        res.redirect('/');
      });
    } catch(error){
        console.error('Error editing task:', error);
        res.status(500).send('Error editing task:');
    }
  } else {
    console.log('Blank edit input!');
  }
});

module.exports = router;