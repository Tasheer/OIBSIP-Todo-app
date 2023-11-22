import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Header from "./components/header";
import Tasks from "./components/tasks";
import AddTask from './components/add-task';
import Footer from './footer';
import About from './components/about';

function App() {

  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      const allTasks = await fetchTasks();
  
      const storedCompletedTasks = localStorage.getItem('completedTasks');
      const completedTasks = storedCompletedTasks ? JSON.parse(storedCompletedTasks) : [];
  
      const updatedTasks = allTasks.map((task) => ({
        ...task,
        completed: completedTasks.includes(task.id),
      }));
  
      setTasks(updatedTasks);
    };
  
    getTasks();
  }, []);
  
  
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json();
    return data
  }

  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json();
    return data
  }

  const toggleAddTask = (() => {
    return setShowAddTask(!showAddTask)
  })

    const addTask = (async (task) => {
      const res = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(task)
      })
      const data = await res.json()
  
      setTasks([...tasks, data])
  
    })
  
  

  const deleteTask = async (id) => {

    await fetch(`http://localhost:5000/tasks/${id}`,{
      method:'DELETE'
    })

    setTasks(tasks.filter((task) => {
      return task.id !== id
    }))
  }
  
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = {...taskToToggle,
      reminder: !taskToToggle.reminder
    }
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method:'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(updTask)
    })
    const data = await res.json()


    setTasks(
      tasks.map((task) => {
        return task.id === id ? {...task, reminder: data.reminder} : task
      })
    )
  }

  const completeTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    const completedTasks = updatedTasks.filter((task) => task.completed).map((task) => task.id);
  
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  };
  
  
  
  
  
  return (

    <Router>

    <div className="container">

      <Header 
        onAdd={toggleAddTask} 
        showAddBtn={showAddTask} 
      />  

      <Routes>

        <Route 
          path='/' 
          element={
          <>
            { showAddTask && <AddTask onAdd={addTask} /> }
            {tasks.length > 0 ? 
            
            <>
            <Tasks
              tasks={tasks.filter((task) => !task.completed)} 
              onDelete={deleteTask}
              onToggle={toggleReminder}
              onComplete={completeTask}
            />
            {
                tasks.some((task) => task.completed) && (
              <>
                <h3>Completed Tasks:</h3>
                <Tasks
                  tasks={tasks.filter((task) => task.completed)}
                  onDelete={deleteTask} 
                  onToggle={toggleReminder}
                  onComplete={completeTask}
                />
              </>
            )}
          </>
              : (
                'No tasks available'
                )
              }
          </>
        } />

        <Route path='/about' element={<About />} />

      </Routes>

      <Footer />
    </div>
  </Router>
  );
}

export default App;
