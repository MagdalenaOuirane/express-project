const express = require('express')
const crypto = require('crypto')
const { users, schedules } = require('./data')
const path = require('path')

const app = express()

//load view engine

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '../', 'views'))

// parse form data
app.use(express.urlencoded({ extended: false }))

//Body parser -json
app.use(express.json())

const PORT = 3000

app.get('/', (req, res) => {
  res.render('mainPage', {
    title: 'Main page',
  })
})

//get all users
app.get('/users', (req, res) => {
  res.render('users', {
    users: users,
  })
})

//get all schedules
app.get('/schedules', (req, res) => {
  res.render('schedules', {
    schedules: schedules,
  })
})

//get specific user
app.get('/user', (req, res) => {
  res.render('user', {
    users: users[1],
  })
})

//get specific schedule
app.get('/userSchedule', (req, res) => {
  res.render('userSchedule', {
    schedules: schedules[1],
  })
})

// get form user template
app.get('/users/new', (req, res) => {
  res.render('newUser_form')
}),
  //get form schedule template
  app.get('/schedules/new', (req, res) => {
    res.render('newSchedule_form')
  })

// //create new user
app.post('/users', (req, res) => {
  const newUser = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
  }

  if (
    !newUser.firstname ||
    !newUser.lastname ||
    !newUser.email ||
    !newUser.password
  ) {
    return res.status(401).send('Please fill out the form')
  }

  newUser.password = crypto
    .createHash('sha256')
    .update(newUser.password)
    .digest('hex')
  users.push(newUser)
  res.redirect('/users')
})

//create new Schedule

app.post('/schedules', (req, res) => {
  const newSchedule = {
    user_id: req.body.user_id,
    day: req.body.day,
    start_at: req.body.start_at,
    end_at: req.body.end_at,
  }

  if (
    !newSchedule.user_id ||
    !newSchedule.day ||
    !newSchedule.start_at ||
    !newSchedule.end_at
  ) {
    return res.status(401).send('Please fill out the form')
  }

  schedules.push(newSchedule)
  res.redirect('/schedules')
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
