const { Course, validate } = require("../models/Course")
const { Lectures } = require("../models/Lecture")
const router = require("express").Router()
const teacherAuth = require("../middlewares/teacherAuth")
const auth = require("../middlewares/auth")
const jwt = require("jsonwebtoken")
const _ = require("lodash")

router.get(
  "/",
  (req, res, next) => auth(req, res, next, false),
  async (req, res) => {
    if (req.user && req.user.isTeacher) {
      const courses = await Course.find({ createdBy: req.user._id }).populate(
        "lectures"
      )
      res.json(courses)
      return
    }
    const courses = await Course.find({ isPublished: true }).populate(
      "lectures"
    )
    res.json(courses)
  }
)

router.get(
  "/:id",
  (req, res, next) => auth(req, res, next, false),
  async (req, res) => {
    if (req.user && req.user.isTeacher) {
      const courses = await Course.find({
        createdBy: req.user._id,
        _id: req.params.id
      }).populate("lectures")
      res.json(courses)
      return
    }
    const courses = await Course.find({
      isPublished: true,
      _id: req.params.id
    }).populate("lectures")
    res.json(courses)
  }
)

router.put("/:id", auth, teacherAuth, async (req, res) => {
  const { error } = validate(req.body)
  if (error) {
    return res.status(400).json()
  }

  let course = await Course.findById(req.params.id)
  if (!course) {
    res.status(404).send("The course with the given id is not found")
    return
  }

  const { user, lectures, isPublished } = req.body
  const updatedCourse = {
    name: user,
    lectures,
    isPublished
  }
  try {
    const course = await Course.findOneAndUpdate(req.params.id, updatedCourse)
    res.status(200).json({
      message: "Course Successfully Updated"
    })
  } catch (e) {
    res.status(500).json({
      message: "Internal Server Error"
    })
  }
})

router.delete("/:id", auth, teacherAuth, async (req, res) => {
  const course = await Course.findByIdAndRemove(req.params.id)

  if (!course)
    return res.status(404).send("The Course with the given ID was not found.")

  res.send(course)
})

router.post("/", auth, teacherAuth, async (req, res) => {
  const { error } = validate(req.body)
  if (error) {
    return res.status(400).json(error.details[0].message)
  }
  console.log("user ", req.user)
  const course = new Course({
    name: req.body.name,
    createdBy: req.user,
    lectures: []
  })

  await course.save()

  res.status(200).json(course)
})

module.exports = router
