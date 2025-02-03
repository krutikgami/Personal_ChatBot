import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter  from './routes/user.routes.js';


dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(userRouter);

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT} ⚙️`);
})


