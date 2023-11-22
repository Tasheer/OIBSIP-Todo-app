import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Task = ({ task, onDelete, onToggle, onComplete  }) => {
    return (
        <div className={`task ${task.reminder ? 'reminder' : ''} ${task.completed ? 'completed' : ''} `} onDoubleClick={() => onToggle(task.id)}>
            <h3>
                {task.text} 
                <button className='complete-btn' onClick={() => {onComplete(task.id)}} >Complete</button>
                <FaTimes 
                    style={{
                        color:'red', 
                        cursor:'pointer'
                    }} 
                    onClick={() => onDelete(task.id)}
                />
            </h3>
            <p>{task.day}</p>
        </div>
    )
}

export default Task;