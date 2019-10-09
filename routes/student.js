const { Student, validate } = require("../models/Student")
const router = require("express").Router()
const bcrypt = require("bcryptjs")
const _ = require("lodash")
const auth = require("../middleware/auth")
const jwt = require("jsonwebtoken")

router.get("/me", auth, async (req, res) => {
  const student = await Student.findById(req.user._id).select({ password: -1 })
  res.send(student)
})

router.post("/", async (req, res) => {
  const { error } = validate(req.body)
  if (error) {
    res.status(400).send(error.details[0].message)
    return
  }
  //Find student who are already registered
  let student = await Student.findOne({ email: req.body.email })
  if (student) {
    res.status(400).send("The email is already registered with us")
    return
  }
  const salt = await bcrypt.genSalt(10)
  req.body.password = await bcrypt.hash(req.body.password, salt)
  student = new Student(_.pick(req.body, ["name", "email", "password"]))
  student.save()
  const token = student.generateAuthToken()
  res
    .header("x-auth-token", token)
    .send(_.pick(student, ["_id", "name", "email"]))
})

module.exports = router;