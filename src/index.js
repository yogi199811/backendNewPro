import express, { json, urlencoded } from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDb from "./config/db.config.js"
import userRoutes from "./routes/auth.route.js"

dotenv.config()

const app = express()
app.use(urlencoded({extended:true}))
app.use(cors({
    origin: "*",
    methods:["POST","GET","PUT","DELETE"]

}))

app.use(express.json())


app.get("/",(req,res)=>{
    res.send(" hi  i  am  running")
})

app.use("/",userRoutes)

connectDb()

app.listen(process.env.PORT || 3000 , ()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})

