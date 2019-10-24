const mongoose = require("mongoose")
const Joi = require("@hapi/joi")

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
  const schema = {
    name: Joi.string().required(),
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string().required()
  }
  return Joi.validate(teacher, schema)
}

exports.Teacher = Teacher
exports.validate = validateTeacher
