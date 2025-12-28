import dotenv from 'dotenv';
/*👉 You should load .env as early as possible in your app.
That’s why developers usually put it in the entry point file (like index.js or server.js), not in app.js.*/

import app from "./app.js"; // --> importing express from app.js

import connectDB from './db/index.js'; // --> importing connectDB function from db/index.js

// Use correct relative path for .env file in project root
dotenv.config({ path :"././.env"});

const port = process.env.PORT || 3000;

console.log('Loaded PORT:', process.env.PORT);

connectDB()
.then(()=>{   // if and only if my db is connected i can then only listen on the port
  app.listen(port,() =>{
    console.log(`My app is listening on port http://localhost:${port}`);
  })
})
.catch((err)=>{
  console.error("Mongodb not connected",err)
  process.exit(1);
})
