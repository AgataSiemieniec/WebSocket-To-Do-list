const express = require('express');
const socket = require('socket.io');

const app = express();

const tasks = [];
console.log('tasks', tasks);

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running...');
  });

app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
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

      socket.on('removeTask', (id) => {
        const removedTask = tasks.find(tasks => tasks.id === socket.id);
        const taskToRemove = tasks.indexOf(removedTask);
        if(removedUser){
            socket.broadcast.emit('removeTask', id);
            users.splice(taskToRemove, 1);
            console.log(task + 'has been deleted');
        }
      });
});

