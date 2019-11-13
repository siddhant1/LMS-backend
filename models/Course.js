const mongoose = require("mongoose")
const Joi = require("@hapi/joi")

const jwt = require("jsonwebtoken")

const CourseSchema = new mongoose.Schema({
  name: { type: String, require: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },
  lectures: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Lecture", required: true }
  ],
  dateCreated: { type: Date, defualt: Date.now() },
  isPublished: { type: Boolean, default: false }
})

const Course = mongoose.model("course", CourseSchema)

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().required(),
    createdBy: Joi.objectId()
  })
  return schema.validate(course)
}

exports.Course = Course
exports.validate = validateCourse
