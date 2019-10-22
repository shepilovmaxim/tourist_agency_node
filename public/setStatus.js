const paid = document.getElementsByClassName("paid");
const canceled = document.getElementsByClassName("canceled");

/* Send a request to change the status of voucher 
  Registered -> Paid
  or
  Registered -> Canceled
*/

if (paid.length > 0 && canceled.length > 0) {
  const statusFetch = async (event) => {
    event.preventDefault();
    const id = event.target.value;
    let status;
    if (event.target.classList.contains("paid")) {
      status = 1;
    } else if (event.target.classList.contains("canceled")) {
      status = 3;
    }
    const res = await fetch(`/admin/vouchers/set?status=${status}&id=${id}`, {
      method: "put"
    });
    window.location.href = res.url;
  }; 

  for (let i = 0; i < paid.length; i++) {
    paid[i].addEventListener("click", statusFetch);
    canceled[i].addEventListener("click", statusFetch);
  };
}