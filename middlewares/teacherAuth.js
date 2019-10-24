module.exports = function(req, res, next) {
  if (!req.user.isTeacher) return res.status(402).send("Forbidden")
  next()
}
