import express from "express"
import dotenv from "dotenv"
import { db } from "./configs/db.js"
import { User } from "./models/usermodle.js"
import bodyParser from "body-parser"
dotenv.config();
const port = process.env.PORT || 8081;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.post("/user/create", (req, res) => {
    User.create(req.body)
        .then((data) => {
            return res.json(data);
        })
        .catch((err) => {
            return res.json({ message: err.message });
        });
});
app.get("/user/getallusers", (req, res) => {
    User.find({})
        .then((data) => {
            return res.json(data);
        })
        .catch((err) => {
            return res.json({ message: err.message });
        });
});
app.get('/user/delete/:id', (req, res) => {
    const { id } = req.params;
    User.findByIdAndDelete(id)
        .then((data) => {
            return res.json({ message: "User Deleted", data });
        })
        .catch((err) => {
            return res.json({ message: err.message });
        })
});
app.post('/user/update/:id', (req, res) => {
    const { id } = req.params;
    User.findByIdAndUpdate(id, req.body)
        .then((data) => {
            return res.json({ message: "User Updated",id:id});
        })
        .catch((err)=>{
            return res.json({ message: err.message });
        })
});
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("Server Stared At port http://127.0.0.1:" + port);
});