const { Teacher, validate } = require("../models/Teacher")
const router = require("express").Router()
const bcrypt = require("bcryptjs")

const _ = require("lodash")
const auth = require("../middleware/auth")
const jwt = require("jsonwebtoken")

router.get("/me", auth, async (req, res) => {
  const teacher = await Teacher.findById(req.user._id).select({ password: -1 })
  res.send(teacher)
})

router.post("/", async (req, res) => {
  const { error } = validate(req.body)
  if (error) {
    res.status(400).send(error.details[0].message)
    return
  }
  //Find teacher who are already registered
  let teacher = await Teacher.findOne({ email: req.body.email })
  if (teacher) {
    res.status(400).send("The teacher is already registered with us")
    return
  }
  const salt = await bcrypt.genSalt(10)
  req.body.password = await bcrypt.hash(req.body.password, salt)
  teacher = new Teacher(_.pick(req.body, ["name", "email", "password"]))
  teacher.save()
  const token = teacher.generateAuthToken()
  res
    .header("x-auth-token", token)
    .send(_.pickteacher, ["_id", "name", "email"])
})

module.exports = router
