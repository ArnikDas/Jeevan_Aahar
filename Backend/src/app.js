import express from "express";
import cors from "cors";

const app = express();

//Basic configs of express
app.use(express.json({ limit : "16kb"})); //--> expecting json data from users,and they able to send it

// also i want through url i want to accept data
app.use(express.urlencoded({ extended : true,limit : "16kb"}));
//the extended : true means we can accept nested objects,means the data which is coming through url can be nested objects

//also i want to serve static files from public folder,these part of app should be allowed publically viewable

app.use(express.static("public"));
//now the whole public folder is available now we can serve images through it



//configarations for CORS
//through cors i want to tell where my frontend lies
app.use(cors({
    origin : process.env.CORS_ORIGIN || "*", //--> frontend url
   
    methods : ["GET","POST","PUT","PATCH","DELETE","OPTIONS"], //--> which methods are allowed from frontend
    
    credentials : true, //--> if we are using cookies or authentication headers
    
    allowedHeaders: ["Content-Type", "Authorization"] //--> which headers are allowed from frontend
}));
   
// import the routes 
import healthCheckRouter from "./routes/healthCheck.routes.js";
import DonationRouter from "./routes/formDonation.route.js";

app.use("/api/v1/healthCheck",healthCheckRouter);
//once someone hits the url healthCheckRouter will taKE OVER And goes to the healthcheck.route.js 
//file and serve the home page 

app.use("/api/v1/donation",DonationRouter);


app.get("/", (req,res) => {
    res.send("Hello guys I am happy");
}); 

export default app;