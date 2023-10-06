const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const questionModel = require("./model/questionModel");

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const mongoURI = "mongodb+srv://chenrussotask:LianBar1@moveohometask.rqlck7m.mongodb.net/ProgrammingQuestions"

let firstSocketIdConnected = null;  // Variable to store the first connected user's socket ID

async function connectToMongoDB() {
  console.log('Calling connectToMongoDB...');  // Add this line
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

io.on('connection', (socket) => {

  console.log(`User Connected: ${socket.id}`);

  if (firstSocketIdConnected === null) {
    firstSocketIdConnected = socket.id;
    console.log(`First user connected: ${firstSocketIdConnected}`);
  }

  socket.on('send_message', (data) => {
    io.emit('receive_message', data);
  });

  socket.on('typing', () => {
    socket.broadcast.emit('user_typing', { id: socket.id });
  });

  socket.on('stop_typing', () => {
    socket.broadcast.emit('user_stop_typing', { id: socket.id });
  });

  socket.on('get_all_questions', async (data) => {
    try {
      const questions = await getQuestions();
      socket.emit('send_questions', questions);  // Send questions to the client who requested
    } catch (error) {
      console.error('Error getting questions:', error);
    }
  });

  socket.on('is_first_user', () => {
    console.log(socket.id)
    console.log(firstSocketIdConnected)
    socket.emit('receive_is_first_user', socket.id === firstSocketIdConnected);
  });


  app.get('/request_question/:id', async (req, res) => {
    const questionId = req.params.id;

    try {
      const question = await getQuestionCodeById(questionId);
      res.json({ question });
    } catch (error) {
      console.error('Error getting question:', error);
      res.status(500).json({ error: 'Error getting question' });
    }
  });

});

(async () => {
  await connectToMongoDB();
  server.listen(3001, () => {
    console.log('Server is running on port 3001');
  });
})();

const getQuestions = async () => {
  try {
    // Get all the questions from the database
    const questions = await questionModel.find({});

    return questions;
  } catch (error) {
    console.error('Error retrieving questions:', error);
  }
};

const getQuestionCodeById = async (id) => {
  try {
    // Get all the questions from the database
    const question = await questionModel.findById(id);

    return question;
  } catch (error) {
    console.error('Error retrieving questions:', error);
  }
};




