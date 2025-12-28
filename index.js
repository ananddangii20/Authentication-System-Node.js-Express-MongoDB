const express = require('express');
const {  mongoose } = require('mongoose');
const app = express();
require("dotenv").config();
const usermodel = require('./models/userdetails');
const bcrypt = require("bcrypt");
const session = require("express-session");
const crypto = require("crypto");


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret:"mysecretkey",
    resave: false,
    saveUninitialized : false
}));



app.set('view engine', 'ejs');


app.get("/register" ,(req,res)=>{
    res.render("register");
});

//Registerr
app.post("/register" , async (req,res)=>{
let{name , email , mobileno , password} = req.body;
    const hasedpassword = await bcrypt.hash(req.body.password , 10);
    let userdetail = new usermodel({
 name:req.body.name,
        email:req.body.email,
        mobileno: req.body.mobileno,
        password:hasedpassword
    });
    await userdetail.save();

    res.redirect("/login");
});


app.get("/login" ,(req,res)=>{
    res.render("login");
});

//Loginn
app.post("/login" ,async (req,res)=>{

const user = await usermodel.findOne({ email:req.body.email });
if(!user){
    return res.send("User not Found!")
}

const match = await bcrypt.compare(req.body.password , user.password
);

if(!match){
    return res.send(" Wrongg Password!")
}
 req.session.user = {
    id: user._id,
    name: user.name,
    email: user.email,
    mobileno: user.mobileno
  };


res.redirect("/dashboard");


});

app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  res.render("dashboard", {
    user: req.session.user
  });
});


app.get("/logout" , (req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/login");
    })
})

mongoose.connect(process.env.mydburl).then(()=>{
console.log("Database connetcted!")
})



//forget password
app.get("/forgot-password" , (req,res)=>{
    res.render("forgotpassword");
})


app.post("/forgot-password" , async (req,res)=>{
const { email } = req.body;

  const user = await usermodel.findOne({ email });
  if (!user) return res.send("User not found");

  const token = crypto.randomBytes(32).toString("hex");

  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 min
  await user.save();

  const resetLink = `http://localhost:8000/reset-password/${token}`;

  console.log("Reset Link:", resetLink); // for now

  res.redirect("login");
})


//reset password
app.get("/reset-password/:token", async (req, res) => {
  const user = await usermodel.findOne({
    resetToken: req.params.token,
    resetTokenExpiry: { $gt: Date.now() }
  });

  if (!user) return res.send("Invalid or expired link");

  res.render("resetpassword", { token: req.params.token  , error:null});
});


app.post("/reset-password/:token", async (req, res) => {
  const { password , confirmPassword } = req.body;

  // ✅ Check passwords match
  if (password !== confirmPassword) {
    return res.render("reset-password", {
      token: req.params.token,
      error: "Passwords do not match"
    });
  }

  const user = await usermodel.findOne({
    resetToken: req.params.token,
    resetTokenExpiry: { $gt: Date.now() }
  });

  if (!user) return res.send("Invalid or expired token");

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();

  res.redirect("passwordchanged");
});



app.listen(8000 ,()=>{
    console.log("Server Running!")
});
