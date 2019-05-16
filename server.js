const express = require('express');
const connectDB = require('./config/db');
const {
  logErrors,
  clientErrorHandler,
  errorHandler
} = require('./middlewares');
const app = express();

// Connect Database
connectDB();

// Init middleware
app.use(express.json({ extended: false }));
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

app.get('/', (req, res) => res.send('API Working'));

// Define routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/users', require('./routes/api/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
