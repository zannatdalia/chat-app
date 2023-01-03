const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const path = require('path')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUserInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)


const port = process.env.PORT || 3000
const public_directory_path = path.join(__dirname, '../public')


app.use(express.static(public_directory_path))

io.on('connection', (socket) => {
    console.log('new web socket connection');

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }
        
        socket.join(user.room)

        socket.emit('message', generateMessage('Admin','Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin',`${user.username} has joined`))

        console.log(getUserInRoom(user.room));

        io.to(user.room).emit('roomData',{
            room:user.room,
            users: getUserInRoom(user.room)
        })

        callback()
    })



    socket.on('sendMessage', (message, callback) => {
        const user=getUser(socket.id)

        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profinity is not allowed')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user=getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })



    socket.on('disconnect', (message) => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin',`${user.username} has left `))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUserInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log('server is up on port 3000');
})

