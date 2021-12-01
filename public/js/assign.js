$(document)
  .ready(function () {
    $("#submit").click(function () {
      let selTeacher = document.getElementById("selTeacher")
      let teacherId = selTeacher.value
      let selStudent = document.getElementById("selStudent")
      let studentId = selStudent.value

      const data = { studId: studentId }
      $.ajax({
        url: `/api/teachers/${teacherId}/addstudent`,
        data: JSON.stringify(data),
        type: "PATCH",
        contentType: "application/json",
        processData: false,
        dataType: "json",
        error: function (xhr, ajaxOptions, thrownError) {
          if (xhr.status == 404) {
            alert(xhr.responseText)
          }
        },
      })
    })
  })
  .ajaxStop(function () {
    window.location.reload()
  })
