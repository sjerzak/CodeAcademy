$(document)
  .ready(function () {
    $("#submit").click(function () {
      let formData = $("form").serializeArray()
      let surname = formData[0].value
      let studCapacity = formData[1].value * 1

      const data = { surname: surname, studCapacity: studCapacity }

      $.ajax({
        url: `/api/teachers`,
        data: JSON.stringify(data),
        type: "POST",
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
