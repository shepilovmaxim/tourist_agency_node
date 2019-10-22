const orderButton = document.getElementById("order_button");
const tourId = document.getElementById("tour_id").value;
const error_container = document.getElementsByClassName("error_container")[0];

/* Send a request to order a tour */

orderButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const res = await fetch(`/tours/${tourId}`, {
    method: "post"
  });
  if (res.ok) {
    window.location.href = res.url;
  } else {
    const text = await res.text();
    error_container.textContent = text;
  }
});