'use client';

import { useState } from 'react';

interface TaskStep {
  evaluation_previous_goal: string;
  id: string;
  next_goal: string;
  step: number;
}

interface Task {
  id: string;
  task: string;
  live_url: string;
  output: string;
  status: string;
  created_at: string;
  finished_at: string;
  browser_data: null | any; 
  media: any[];
  steps: TaskStep[];
}


export default function BrowserUSe() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const runTask = async () => {
    setIsLoading(true);
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_BROWSER_USE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ save_browser_data: true, task: input }) 
    };
    
    const res = await fetch('https://api.browser-use.com/api/v1/run-task', options)
      .then(response => response.json())
      .then(response => {
        setInput('');
        console.log(response); 
        setTaskId(response.id)
      })
      .catch(err => console.error(err)).finally(() => setIsLoading(false));
  }


  const getTask = async () => {
    setIsLoading(true);
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${process.env.NEXT_PUBLIC_BROWSER_USE_API_KEY}`}
    };
    
    fetch(`https://api.browser-use.com/api/v1/task/${taskId}`, options)
      .then(response => response.json())
      .then(response => {
        console.log(response); 
        if(response.status === 'running') {
          alert('Task is still running. Please wait for it to finish.')
          return
        }
        response.media = getTaskMedia();
        const taskList = [...tasks, response]
        setTasks( taskList);
      })
      .catch(err => console.error(err)).finally(() => setIsLoading(false));
  }

  const getTaskMedia = async () => {
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${process.env.NEXT_PUBLIC_BROWSER_USE_API_KEY}`}
    };
    
    fetch(`https://api.browser-use.com/api/v1/task/${taskId}/media`, options)
      .then(response => response.json())
      .then(response => {
        console.log(response); 
        return response.recordings;
      })
      .catch(err => console.error(err));
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Browser Use Chatbot</h1>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your message..."
          style={{ padding: '0.5rem', borderRadius: '0.5rem', width: '30%' }}
        />
        <br />
        <button disabled={isLoading || !input} onClick={runTask}>Run task</button>
        <button style={{ marginLeft: '1rem' }} disabled={isLoading || !taskId} onClick={getTask}>Get task</button>
        
      <div style={{ marginTop: '1rem' }}>
      {isLoading ? <strong style={{fontSize:"1.2rem"}}>Loading...</strong> : ''}
      {tasks.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <strong style={{fontSize:"1.2rem"}}>Result:</strong>
          <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              <strong style={{fontSize:"1.2rem"}}>Task {index + 1}:</strong>
              <div>
                <strong>User:</strong> {task.task}
              </div>
              <strong>Assisstant:</strong><div>{task.output}</div>
              {task.steps.length > 0 && (
                    <div>
                      <strong style={{ fontSize: "1.2rem" }}>Steps:</strong>
                      <ul>
                        {task.steps.map((step, stepIndex) => (
                          <li key={stepIndex}>
                            <strong>Step {step.step}:</strong>
                            <div>Evaluation: {step.evaluation_previous_goal}</div>
                            <div>Next Goal: {step.next_goal}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              <div>
                {task.media.length > 0 && (
                  <div>
                    <strong style={{fontSize:"1.2rem"}}> Task Media:</strong>
                    <ul>
                      {task.media.map((source, index) => (
                        <li key={index}>
                          <video width="320" height="240" controls>
                            <source src={source} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </li>
                      ))}
                    </ul>

                  </div>
                )}

              </div>
            </li>
          ))}
          </ul>
        </div>
      )}
      </div>
    </div>
  );
}
