const { Lecture, validate } = require("../models/Lecture")
const router = require("express").Router()
const teacherAuth = require("../middlewares/teacherAuth")
const auth = require("../middlewares/auth")
const jwt = require("jsonwebtoken")
const _ = require("lodash")

router.get(
  "/",
  (req,res,next) => auth(req, res, next, false),
  async (req, res) => {
    if (req.user && req.user.isTeacher) {
      const lecture = await Lecture.find({ createdBy: req.user._id })
      res.json(lecture)
      return
    }
    const lecture = await Lecture.find({ isPublished: true })
    res.json(lecture)
  }
)

router.get(
  "/:id",
  (req,res,next) => auth(req, res, next, false),
  async (req, res) => {
    if (req.user && req.user.isTeacher) {
      const lecture = await Lecture.find({
        createdBy: req.user._id,
        _id: req.params.id
      })
      res.json(lecture)
      return
    }
    const lecture = await Lecture.find({
      isPublished: true,
      _id: req.params.id
    })
    res.json(lecture)
  }
)

router.put("/:id", auth, teacherAuth, async (req, res) => {
  const { error } = validate(req.body)
  if (error) {
    return res.status(400).json()
  }

  let lecture = await Lecture.findById(req.params.id)
  if (!lecture) {
    res.status(404).send("The Lecture with the given id is not found")
    return
  }

  const { user, lectureUrl, thumbnailImageUrl, isPublished } = req.body
  const updatedLecture = {
    name: user,
    lectureUrl,
    thumbnailImageUrl,
    isPublished
  }
  try {
    const lecture = await Lecture.findOneAndUpdate(
      req.params.id,
      updatedLecture
    )
    res.status(200).json({
      message: "Lecture Successfully Updated"
    })
  } catch (e) {
    res.status(500).json({
      message: "Internal Server Error"
    })
  }
})

router.delete("/:id", auth, teacherAuth, async (req, res) => {
  const lecture = await Lecture.findByIdAndRemove(req.params.id)

  if (!lecture)
    return res.status(404).send("The Lecture with the given ID was not found.")

  res.send(lecture)
})

router.post("/", auth, teacherAuth, async (req, res) => {
  const { error } = validate(req.body)
  if (error) {
    return res.status(400).json(error.details[0].message)
  }

  const lecture = new Lecture({
    name: req.body.name,
    lectureUrl: req.body.lectureUrl,
    thumbnailImageUrl: req.body.thumbnailImageUrl,
    createdBy: req.user
  })

  await lecture.save()

  res.status(200).json(lecture)
})

module.exports = router
