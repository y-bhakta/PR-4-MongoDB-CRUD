import express from "express"
import dotenv from "dotenv"
import { db } from "./configs/db.js"
import { User } from "./models/usermodle.js"
import bodyParser from "body-parser"
import { LocalStorage } from "node-localstorage"
global.localStorage = new LocalStorage('./scratch');
dotenv.config();
const port = process.env.PORT || 8081;
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.render("./index");
});
app.get('/form-basic', (req, res) => {
    res.render("./pages/form-basic");
});
app.get('/tables',async (req, res) => {
    try {
        let data=await User.find({});
        res.render("./pages/tables",{user:data});
    } catch (error) {
        console.log(err);
        return res.render("./pages/tables",{user:[]});
    }
});
app.get('/signup', (req, res) => {
    return res.render('./pages/signup');
});
app.get('/login', (req, res) => {
    return res.render('./pages/login');
});
app.post('/login',async (req,res)=>{
    try {
        let rs=await fetch('http://127.0.0.1:6060/user/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(req.body)
        })
        let data=await rs.json();
        if(data.success){
            localStorage.setItem('id',JSON.stringify(data.data._id));
            return res.render('./');
        } else{
            return  res.render('/login');
        }
    } catch (error) {
        return res.render('/login');
    }
});
app.post('/user/login', async(req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            if (user.password == password) {
                return res.json({
                    message: "Login Success",
                    success: true,
                    data: user,
                });
            } else {
                return res.json({ message: "Password Not match.", success: false });
            }
        } else {
            return res.json({ message: "User Not Found.", success: false });
        }
    } catch (error) {
        return res.json({ message: error.message, success: false });
    }
});
app.post('/signup', (req, res) => {
    fetch('http://127.0.0.1:6060/user/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    })
        .then((rs) => {
            return rs.json();
        })
        .then((data) => {
            return res.redirect('/login');
        })
        .catch((err) => {
            return res.redirect('/');
        })
});
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
            return res.json({ message: "User Updated", id: id });
        })
        .catch((err) => {
            return res.json({ message: err.message });
        })
});
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("Server Stared At port http://127.0.0.1:" + port);
});