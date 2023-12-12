// app.js

import express from 'express';
import bodyParser from 'body-parser';
import { sendEmail } from './sendEmail';

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Define routes
app.get('/send-email', sendEmail);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
