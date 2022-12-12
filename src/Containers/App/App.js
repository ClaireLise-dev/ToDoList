import React, { useState, useRef, useEffect } from 'react';
import classes from './App.module.css';
import Task from '../../Components/Tasks/Task';
import axios from '../../axios-firebase';

function App() {
  // UseEffect
  useEffect(() => {
      inputElement.current.focus();
      fetchTasks();
  }, [])

  // States
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  // Ref
  const inputElement = useRef(null)

  // Fonctions
  const removeClickedHandler = index => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);

    axios.delete('/tasks/' + tasks[index].id + '.json', newTasks[index])
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error)
    })
  }

  const doneClickedHandler = index => {
    const newTasks = [...tasks];
    newTasks[index].done = !tasks[index].done;
    setTasks(newTasks);

    axios.put('/tasks/' + tasks[index].id + '.json', newTasks[index])
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error)
    })
  }

  const submittedTaskHandler = event => {
    event.preventDefault();

    const newTask = {
      content: input,
      done: false
    }
    
    setInput('');

    axios.post('/tasks.json', newTask)
    .then(response => {
      console.log(response);
      fetchTasks();
    })
    .catch(error => {console.log(error)})
  }

  const changedFormHandler = event => {
    setInput(event.target.value);
  }

  const fetchTasks = () => {
    axios.get('/tasks.json')
    .then(response => {
      const newTasks = [];
      
      for (let key in response.data) {
          newTasks.push({
            ...response.data[key],
            id: key
          });
        }
        setTasks(newTasks)
      }
    )}

  // Variables
  let tasksDisplayed = tasks.map((task, index) => (
    <Task
      done={task.done}
      content={task.content}
      key={index}
      removeClicked={() => removeClickedHandler(index)}
      doneClicked={() => doneClickedHandler(index)}
    />
  ));

  return (
    <div className={classes.App}>
      <header>
        <span>TO-DO</span>
      </header>

    <div className={classes.add}>
        <form onSubmit={(e) => submittedTaskHandler(e)}>
          <input
            type="text"
            value={input}
            onChange={(e) => changedFormHandler(e)}
            placeholder="Que souhaitez-vous ajouter ?"
            ref={inputElement}
            />
          <button type="submit">
            Ajouter
          </button>
        </form>
      </div>

      {tasksDisplayed}
    </div>
  );
}

export default App;

