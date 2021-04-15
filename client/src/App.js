import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      taskName: '',
    };
  }
//uruchamiana jest po wyrenderowaniu komponentu do drzewa DOM. 
  componentDidMount(){
    this.socket = io('http://localhost:8000');
    this.socket.on('addTask', (task) => this.addTask(task));
    this.socket.on('removeTask', (id) => this.removeTask(id));
    this.socket.on('updateData', (tasks) => this.updateTasks(tasks));
  };

  addTask(task){
    this.setState({
      tasks : [ ...this.state.tasks, task ],
      taskName: '',
    })
  };

  removeTask(id, e){
    this.setState({
      tasks: this.state.tasks.filter(tasks => tasks.id !== id)
    })
    if(e !== undefined) {
      this.socket.emit('removeTask', id);
    }
  };

  updateTasks(tasks)  {
    this.setState({
      tasks:  tasks
    });
  };

  submitForm(e){
    e.preventDefault();
    const task = { id: uuidv4(), name: this.state.taskName }
    this.addTask(task);
    this.socket.emit('addTask', task );
    this.setState({
      task: [...this.state.tasks, task]
    })
  };

  render() {
    const { tasks, taskName } = this.state;
    return (
      <div className="App">
    
        <header>
          <h1>ToDoList.app</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map((task) => (
              <li 
                className="task"
                key={task.id}>
                {task.name}
                <button 
                  type="button"
                  className="btn btn--red"
                  onClick={(e) => this.removeTask(task.id, e)}
                  >Remove
                </button>
              </li>
            ))}
          </ul>
          <form id="add-task-form" onSubmit={(e) => this.submitForm({e})}>
            <input 
              className="text-input" 
              autoComplete="off" 
              type="text" 
              placeholder="Type your description" 
              id="task-name" 
              required="required"
              value={taskName}
              onChange={(e) => this.setState({ taskName: e.currentTarget.value})}
            />
            <button className="btn" type="submit">
              Add
            </button>
          </form>
    
        </section>
      </div>
    );
  };
};

export default App;