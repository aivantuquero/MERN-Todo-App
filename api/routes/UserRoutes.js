const express = require('express');
const User = require('../models/Users.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

const router = express.Router();

//You can use redis cache or database for this jwt storage, but for simlicity I will only use arrays.
let refreshTokens = [];

const generateAccessToken = (payload) => {
  return jwt.sign( payload, process.env.SECRET_KEY, {
    expiresIn: "60s",
  });
};

const generateSessionToken = (payload) => {
  return jwt.sign( payload, process.env.SESSION_KEY, {
    expiresIn: "60s",
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign( payload, process.env.REFRESH_KEY);
};


//registration route
router.post('/api/register', (req, res) => {

    const { errors, isValid } = validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
          return res.status(400).json({ email: "Email already exists" });
        } else {
          const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
          });
    
          // generate salt then hash password before saving to database
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
            });
          });
        }
    });
});

//login route
router.post('/api/login', (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json({err : "User not found"});
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }).then(user => {
        if(!user){
            return res.status(404).json({ err: "User not found"});
        }

        bcrypt.compare(password, user.password).then(isMatch => {

          if(isMatch) {
  
            const payload = {
              id: user.id,
              name: user.firstName.concat(' ', user.lastName)
            }

            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);
            const sessionToken = generateSessionToken(payload);
            refreshTokens.push(refreshToken);

            return res.cookie('refreshToken',`${refreshToken}` , { httpOnly: true }).json({
              success:true,
              token: "Bearer " + accessToken,
              session: sessionToken
            })

          }
          else{
            return res.status(400).json({passwordincorrect:"Email or Password is incorrect"});
          }
        });
    });
});

//route for refrestoken
router.post('/api/refresh-token', (req, res) => {

  try {
    const getToken = req.cookies.refreshToken;
    if (getToken) {
      const { id, name } = jwt.verify(getToken, process.env.REFRESH_KEY);

      //create new acccess token
      //you can make a new refreshtoken as well if you want more security
      const accesssToken = jwt.sign({ id, name }, process.env.SECRET_KEY, { expiresIn: '60s' });
      return res.status(200).json(accesssToken);
    }
  } catch (err) {
    return res.status(400);
  }

});

//route for logout
router.post('/api/logout', (req, res) => {
  try {
    const getToken = req.cookies.refreshToken;
    if (getToken) {
      const goodToken = jwt.verify(getToken, process.env.REFRESH_KEY);
      refreshTokens = refreshTokens.filter(token != getToken)
      //destroy the refreshCookie
      return res.clearCookie('refreshToken', {httpOnly : true}).json('Logout successful!');
    }
  } catch (err) {
    //token not legit
    return res.status(400);
  }

})



module.exports = router;