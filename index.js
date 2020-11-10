const express = require("express")
const connectDB = require("./config/db")
const cors = require("cors")

const app = express()

// connect to the db
connectDB()

const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/projects', require('./routes/projects'))
app.use('/api/tasks', require('./routes/tasks'))
//habilitar express.json antes conocido como body parser para leer los datos enviados con json

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})