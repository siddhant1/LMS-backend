const mongoose = require("mongoose")
const Joi = require("@hapi/joi")
const jwt = require("jsonwebtoken")

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, maxlength: 1024 }
})

StudentSchema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this._id }, process.env.jwtPrivateKey)
}

const Student = mongoose.model("student", StudentSchema)

function validateStudent(student) {
  const schema = {
    name: Joi.string().required(),
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required()
      .max(255)
  }

  return Joi.validate(student, schema)
}

exports.Student = Student
exports.validate = validateStudent
