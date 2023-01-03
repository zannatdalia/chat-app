const users = []

//addUser, remmoveUser, getUser, getUserInRooms

const addUser = ({ id, username, room }) => {
    //clear data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate data
    if (!username || !room) {
        return {
            error: 'Username and Room required'
        }
    }

    //Check for exsisting User
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //validate username
    if (existingUser) {
        return {
            error: 'Username already in use!!'
        }
    }

    //storing user
    const user = { id, username, room }
    users.push(user)

    return {user}
}


//remove user
const removeUser = (id) => {
    let index = users.findIndex((user) => {
        return user.id === id
    })
    console.log(index);


    if (index !== -1) {
        return users.splice(index, 1)[0]

    }
}

//get user

const getUser = (id) => {
    return users.find((user) => user.id === id)
}


const getUserInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}




module.exports={
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}