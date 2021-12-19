import express, { Request, Response } from "express"
import { Teachers, Students } from "../../models/academy"
import mongoose, { MongooseQueryOptions } from "mongoose"

const router = express.Router()
mongoose.set("useFindAndModify", false)

router.use(
  express.urlencoded({
    extended: true,
  })
)

router.get("/", async (req: Request, res: Response) => {
  return res.status(200).render("appView")
})

router.get("/api/teachers", async (req: Request, res: Response) => {
  const teachers: object = await Teachers.find({})
  return res.status(200).send(teachers)
})

router.get("/teachers", async (req: Request, res: Response) => {
  const teachers = await Teachers.find({})

  return res
    .status(200)
    .render("teachersView", { title: "Teachers", teachers: teachers })
})

router.post("/api/teachers", async (req: Request, res: Response) => {
  try {
    const { surname, studCapacity, teacherStudents } = req.body
    const teachers = await Teachers.create({
      surname,
      studCapacity,
      teacherStudents,
    })

    return res.status(201).send(teachers)
  } catch (e) {
    const error =
      "Teacher surname must be unique, letter only, more or equal 3 chars. Student capacity must be a positive digit"
    return res.status(404).send(error)
  }
})

router.get("/assign", async (req: Request, res: Response) => {
  const teachers = await Teachers.find({})
  const students = await Students.find({})
  const teachersStudents = []

  for (let i: number = 0; i < teachers.length; i++) {
    const teacherSurname = teachers[i].surname
    const teacherStudents = await Students.find({
      _id: { $in: teachers[i].teacherStudents },
    }).select("surname -_id")

    teachersStudents.push(
      { teacherSurname: teacherSurname },
      ...teacherStudents
    )
  }
  return res.status(200).render("assignView", {
    title: "Assign",
    teachers: teachers,
    students: students,
    teachersStudents: teachersStudents,
  })
})

router.patch(
  "/api/teachers/:id/assignstudent",
  async (req: Request, res: Response) => {
    const { studId } = req.body

    // const teacherStudLimit = await Teachers.findOne({
    //   _id: req.params.id,
    // }).select("studCapacity teacherStudents -_id")

    const teacherStudLimit: any = await Teachers.findOne({
      _id: req.params.id,
    })

    const limit = teacherStudLimit.studCapacity
    const currentStudents = teacherStudLimit.teacherStudents.length

    // const limit = Object(teacherStudLimit)["studCapacity"]
    // const currentStudents = Object(teacherStudLimit)["teacherStudents"].length

    const error = "Teacher student's limit capped"
    if (currentStudents < limit) {
      await Teachers.updateMany({ $pull: { teacherStudents: studId } })
      const teachers = await Teachers.findOneAndUpdate(
        { _id: req.params.id },
        { $addToSet: { teacherStudents: studId } },
        { new: true }
      )

      return res.status(201).send(teachers)
    } else {
      return res.status(404).send(error)
    }
  }
)

router.patch("/api/teachers/:id", async (req: Request, res: Response) => {
  const { surname, studCapacity } = req.body

  const filter = { _id: req.params.id }
  const update = { surname: surname, studCapacity: studCapacity }

  let teachers = await Teachers.findOneAndUpdate(filter, update, {
    new: true,
  })

  return res.status(201).send(teachers)
})

router.delete("/api/teachers/:id", async (req: Request, res: Response) => {
  const filter = { _id: req.params.id }
  let teacherDel: any = await Teachers.findOne(filter)
  let teachers = await Teachers.find().select(
    "teacherStudents studCapacity _id"
  )

  let moveToTeacherId = Object(
    teachers.find(
      (element) =>
        element.studCapacity -
          element.teacherStudents.length -
          teacherDel.teacherStudents.length >=
        0
    )
  )["_id"]

  if (moveToTeacherId) {
    console.log("Udało się")

    for (let i = 0; i < teacherDel.teacherStudents.length; i++) {
      await Teachers.findOneAndUpdate(
        { _id: moveToTeacherId },
        {
          $addToSet: {
            teacherStudents: teacherDel.teacherStudents[i],
          },
        },
        { new: true }
      )

      await Teachers.findOneAndUpdate(
        { _id: teacherDel._id },
        {
          $pullAll: [
            {
              teacherStudents: teacherDel.teacherStudents[i],
            },
          ],
        }
      )
    }
    await Teachers.deleteOne({ _id: teacherDel._id })
    return res.status(201).send("Nauczyciel usunięty")
  } else {
    let error =
      "Brak nauczyciela z wystarczającą ilością wolnych miejsc, zatrudnij nowego :)"
    let sumFreeSpaces = 0
    teachers.forEach(function (teacher) {
      return (sumFreeSpaces =
        teacher.studCapacity - teacher.teacherStudents.length + sumFreeSpaces)
    })
    console.log(sumFreeSpaces)
    return res.status(404).send(error)
  }
})

router.get("/api/students", async (req: Request, res: Response) => {
  const students = await Students.find({})
  return res.status(200).send(students)
})

router.get("/students", async (req: Request, res: Response) => {
  const students = await Students.find({})

  return res
    .status(200)
    .render("studentsView", { title: "Students", students: students })
})

router.post("/api/students", async (req: Request, res: Response) => {
  try {
    const { surname } = req.body

    const students = await Students.create({ surname })

    return res.status(201).send(students)
  } catch (e) {
    const error =
      "Student surname must be unique, letter only, more or equal 3 chars"
    return res.status(404).send(error)
  }
})

export { router as academyRouter }
