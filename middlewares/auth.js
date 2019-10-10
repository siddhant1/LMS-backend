const jwt = require("jsonwebtoken")
function auth(req, res, next, shouldThrow = true) {
  const token = req.header("x-auth-token")
  if (!shouldThrow && !token) {
    next()
  } else if (!shouldThrow && token) {
    try {
      const payload = jwt.verify(token, process.env.jwtPrivateKey)
      req.user = payload
      next()
    } catch (e) {
      next()
      return
    }
  }
  if (!token) return res.status(401).send("Access Denied No Token Found")
  try {
    const payload = jwt.verify(token, process.env.jwtPrivateKey)
    req.user = payload
    next()
  } catch (ex) {
    res.status(401).send("Invalid Token")
  }
}
module.exports = auth
