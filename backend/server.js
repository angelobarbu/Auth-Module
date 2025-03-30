import app from './app.js';
import dotenv from 'dotenv';
import config from './config/config.js';

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});