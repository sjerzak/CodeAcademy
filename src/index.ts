import express from "express"
import mongoose from "mongoose"
import { json } from "body-parser"
import { academyRouter } from "./routes/academy"
import * as path from "path"
const swaggerUi = require("swagger-ui-express")
const swaggerFile = require("../public/CodeAcademySwagger.json")

const app = express()
app.use(json())
app.use(academyRouter)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile))

mongoose.connect(
  `mongodb+srv://${process.env.MongoUsername}:${process.env.MongoPass}@cluster0.axhjt.mongodb.net/CodeAcademy?authSource=admin&replicaSet=atlas-wbhxry-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Connected to database")
  }
)

app.listen(process.env.PORT || 3000, () => {
  console.log("server is listening on port 3000")
})

app.set("view engine", "pug")

const static_path = path.join(__dirname, "../public")
app.use(express.static(static_path))
app.use(express.urlencoded({ extended: true }))
