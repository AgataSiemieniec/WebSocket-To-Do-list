const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const tasks = [];
console.log('tasks', tasks);

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running...');
  });

const io = socket(server);

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    io.to(socket.id).emit('updateData', tasks);

    socket.on('addTask', (task) => {
        tasks.push(task);
        socket.broadcast.emit('addTask', task);
        console.log('User ' + socket.id + 'just added new task' + task);
      });

      socket.on('removeTask', (removedTask) => {
        const removedTask = tasks.find(tasks => tasks.id === socket.id);
        const taskToRemove= tasks.indexOf(removedTask);
        if(removedUser){
            socket.broadcast.emit('removeTask', removedTask);
            users.splice(taskToRemove, 1);
            console.log(task + 'has been deleted');
        }
      });
});

app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
});

