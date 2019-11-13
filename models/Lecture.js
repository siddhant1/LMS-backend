const mongoose = require("mongoose")
const Joi = require("@hapi/joi")

const LectureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lectureUrl: { type: String, required: true },
  thumbnailImageUrl: { type: String, required: true },
  isPublished: { type: Boolean, default: false },
  dateCreated: { type: Date, default: Date.now() },
  feedback: [{ comment: String, user: mongoose.Schema.Types.ObjectId }]
})

const Lecture = mongoose.model("lecture", LectureSchema)

function validateLecture(lecture) {
  const schema = Joi.object({
    name: Joi.string().required(),
    lectureUrl: Joi.string().required(),
    thumbnailImageUrl: Joi.string().required()
  })
  return schema.validate(lecture)
}

exports.validate = validateLecture
exports.Lecture = Lecture
