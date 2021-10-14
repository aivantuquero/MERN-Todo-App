const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Todo = require('./models/Todos');
const userRoutes = require('./routes/UserRoutes');
const validateToken = require('./validation/token');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true, // <= Accept credentials (cookies) sent by the client
}))

//connect to db
mongoose.connect(process.env.DB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to Db'))
.catch((err) => console.log(err));


app.get('/todos',validateToken, async(req, res) => {
    const todos = await Todo.find({userid : req.user.id});
    
    res.json(todos);
});

app.post('/todo/new', validateToken, (req, res) => {
    const todo = new Todo({
        userid: req.user.id,
        text: req.body.text

    });
    
    //save to collection
    todo.save();

    res.json(todo);
})

app.delete('/todo/delete/:id', async (req, res) => {
    const result = await Todo.findByIdAndDelete(req.params.id);

    res.json(result);
});

app.get('/todo/complete/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id);

    todo.complete = !todo.complete;

    todo.save();

    res.json(todo);
});

app.use(userRoutes);


app.listen(3001, () => console.log('server started on 3001'));