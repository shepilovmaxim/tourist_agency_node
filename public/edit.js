const editButton = document.getElementById("edit_button");
const deleteButton = document.getElementById("delete_button");
const form = document.getElementById("edit_form");
const tourId = document.getElementById("tour_id").value;
const error_container = document.getElementsByClassName("error_container")[0];

/* Toggle visibility of form */

editButton.addEventListener("click", (event) => {
  event.preventDefault();
  const textFields = document.getElementsByClassName("property_value");
  const editInputs = document.getElementsByClassName("edit");
  const buttons = document.getElementsByClassName("button");
  for (let i = 0; i < textFields.length; i++) {
    textFields[i].classList.add("hidden");
    editInputs[i].classList.remove("hidden");
    if (editInputs[i].nodeName === "SELECT") {
      for (let j = 0; j < editInputs[i].children.length; j++) {
        if (editInputs[i].children[j].textContent.indexOf(textFields[i].textContent) !== -1) {
          editInputs[i].children[j].setAttribute('selected', 'selected');
          break;
        }; 
      };
    } else if (editInputs[i].nodeName === "TEXTAREA") {
      editInputs[i].value = textFields[i].textContent;
      editInputs[i].style.height = editInputs[i].scrollHeight + "px";
    } else {
      editInputs[i].value = textFields[i].textContent;
    };
  };
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.toggle("hidden");
  };
});

/* Submits form data */

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const res = await fetch(`/tours/${tourId}`, {
    method: "put",
    body: formData
  });
  if (res.ok) {
    window.location.href = res.url;
  } else {
    const text = await res.text();
    error_container.textContent = text;
  }
});

/* Send a request to delete a tour */

deleteButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const res = await fetch(`/tours/${tourId}`, {
    method: "delete"
  });
  if (res.ok) {
    window.location.href = res.url;
  } else {
    const text = await res.text();
    error_container.textContent = text;
  }
});