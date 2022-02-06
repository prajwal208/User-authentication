const express = require('express')
const router = express.Router()
const Users = require('../db/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//register
router.post('/',async(req,res) => {
    try {
        const {email,password,verifypasword} = req.body

    //validation

    if(!email || !password || !verifypasword){
        return res.status(400).json({errormessage:"Please Enter the valid details"})
        }

    if(password !== verifypasword){
        return res.status(400).json({errormessage:"Please Enter the same password"})
    }

    const existingUser = await Users.findOne({email})
    if(existingUser){
        return res.status(400).send({errormessage:"Email has already Exist"})
    }
    
    //password hash
    const salt = await bcrypt.genSalt()
    const hashpassword = await bcrypt.hash(password,salt)

    //saving into database
    const newUser = new Users({
        email,
        password:hashpassword
    })

    const saveduser = newUser.save()

    //token
    const token = jwt.sign({
        user:saveduser._id
    },process.env.SECRET_KEY)

  
    //send the token into the cookie
    res.cookie("token",token,{
        httpOnly:true,
        secure: true,
        sameSite: "none",
    }).send()

} 

    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }
})

//login
router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // validate
  
      if (!email || !password)
        return res.status(400).json({ errorMessage: "Please enter all required fields." });
  
      const existingUser = await Users.findOne({ email });
      if (!existingUser)
        return res.status(401).json({ errorMessage: "Wrong email or password." });
  
      const passwordCorrect = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!passwordCorrect)
        return res.status(401).json({ errorMessage: "Wrong email or password." });
  
      // token
  
      const token = jwt.sign(
        {
          user: existingUser._id,
        },
        process.env.SECRET_KEY
      );
  
      // send the token in cookie
  
      res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        }).send()
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  });

  //logout
  router.get('/logout',(req,res) => {
      res.cookie("token","",{
          httpOnly:true,
          secure: true,
          sameSite: "none",
          expires:new Date(0)
      }).send()
  })

  router.get('/loggedIn',(req,res) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(200).json(false);
  
      jwt.verify(token, process.env.SECRET_KEY);
      res.status(200).send(true) 

    } catch (err) {
      console.error(err);
      res.status(401).json({ errorMessage: "Unauthorized" });
    }
  })


module.exports = router