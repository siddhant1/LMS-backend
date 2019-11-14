require("dotenv").config()
const Joi = require("@hapi/joi")
Joi.objectId = require("joi-objectid")(Joi)
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const morgan = require("morgan")
const helmet = require("helmet")

/**
 * Make sure the jwt private key is defined
 */
// if (!process.env.jwtPrivateKey) {
//   console.log("jwtprivatekey is not defined")
//   process.exit(1)
// }

/**
 *User Defined Routes
 */
const course = require("./routes/course")
const student = require("./routes/student")
const teacher = require("./routes/teacher")
const lecture = require("./routes/lecture")

/**
 * Setup basic config
 */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(helmet())
app.use(helmet.noCache())

/**
 * Connect to database
 */
mongoose
  .connect("mongodb://siddhant:siddhant1@ds029939.mlab.com:29939/learning-management-system")
  .then(() => console.log("connected to mongoDB"))
  .catch(() => console.log("there is an error maybe"))

/**
 * Setup routes
 */

app.get("/", (req,res) => res.json({ message: "ok" }))

app.use("/api/course", course)
app.use("/api/student", student)
app.use("/api/teacher", teacher)
app.use("/api/lecture", lecture)

/**
 * Setup log
 */

if (app.get("env") == "development") {
  app.use(morgan("dev"))
}

/**
 * Startup server
 */

const Port = process.env.PORT || 4000
app.listen(Port, () => {
  console.log("Listening on port" + Port)
})
