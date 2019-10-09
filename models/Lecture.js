const mongoose = require("mongoose")
const Joi = require("@hapi/joi")

const LectureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lectureUrl: { type: String, required: true },
  thumbnailImageUrl: { type: String, required: true },
  isPublished: { type: Boolean, default: false },
  dateCreated: { type: Date, default: Date.now() }
})

const Lecture = mongoose.model("lecture", LectureSchema)

function validateLecture(lecture) {
  const schema = {
    name: Joi.string().required(),
    lectureUrl: Joi.string().required(),
    thumbnailImageUrl: Joi.string().required()
  }
  return Joi.validate(lecture, schema)
}

exports.validate = validateLecture
exports.Lecture = Lecture
