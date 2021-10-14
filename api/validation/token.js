const jwt = require('jsonwebtoken');

//validation middleware for jwt
module.exports = validateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const accessToken = authHeader && authHeader.split(' ')[1]
    if (accessToken == null) return res.sendStatus(401)
  
    jwt.verify(accessToken, process.env.SECRET_KEY, (err, user) => {
        console.log(user);
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user
      next();
    })
};
  