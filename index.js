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
  .connect("<url>")
  .then(() => console.log("connected to mongoDB"))
  .catch(() => console.log("there is an error maybe"))

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
