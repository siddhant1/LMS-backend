const mongoose = require("mongoose")
const Joi = require("@hapi/joi")
const jwt = require("jsonwebtoken")

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
})

TeacherSchema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this.id, isTeacher: true }, process.env.jwtPrivateKey)
}

const Teacher = mongoose.model("teacher", TeacherSchema)

function validateTeacher(teacher) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string().required()
  })
  return schema.validate(teacher)
}

exports.Teacher = Teacher
exports.validate = validateTeacher
