import mongoose from "mongoose"

interface ITeachers {
  surname: string
  studCapacity: number
  teacherStudents: [string]
}

interface IStudents {
  surname: string
}

interface teachersModelInterface extends mongoose.Model<TeachersDoc> {
  build(attr: ITeachers): TeachersDoc
}

interface studentsModelInterface extends mongoose.Model<StudentsDoc> {
  build(attr: IStudents): StudentsDoc
}

let onlyLettersAllow = function (inputString: "string") {
  let myRegxp = /^[a-zA-Z]+$/i
  return myRegxp.test(inputString)
}

let onlyNumbersAllow = function (inputString: "string") {
  let myRegxp = /^[1-9]+$/i
  return myRegxp.test(inputString)
}

let minLen = function (val: String) {
  return val.length >= 3
}

let manyValidators = [{ validator: minLen }, { validator: onlyLettersAllow }]

interface TeachersDoc extends mongoose.Document {
  surname: string
  studCapacity: number
  teacherStudents: [string]
}

interface StudentsDoc extends mongoose.Document {
  surname: string
}

const teachersSchema = new mongoose.Schema({
  surname: {
    type: String,
    required: true,
    unique: true,
    validate: manyValidators,
  },
  studCapacity: {
    type: Number,
    required: true,
    validate: onlyNumbersAllow,
  },
  teacherStudents: {
    type: [String],
  },
})

const studentsSchema = new mongoose.Schema({
  surname: {
    type: String,
    required: true,
    unique: true,
    validate: manyValidators,
  },
})

teachersSchema.statics.build = (attr: ITeachers) => {
  return new Teachers(attr)
}

studentsSchema.statics.build = (attr: IStudents) => {
  return new Students(attr)
}

const Teachers = mongoose.model<TeachersDoc, teachersModelInterface>(
  "Teachers",
  teachersSchema
)

const Students = mongoose.model<StudentsDoc, studentsModelInterface>(
  "Students",
  studentsSchema
)

export { Teachers, Students }
