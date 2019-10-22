const login = document.getElementById("login");
const email = document.getElementById("email");
const checkEmail = document.getElementById("checkEmail");
const checkLogin = document.getElementById("checkLogin");

/* Sending request to check if the same values exist in the database */

const checkFetch = async (event) => {
  if (event.target.value != '') {
    const res = await fetch(`/user/registration/check?${event.target.id}=${event.target.value}`, {
      method: "get"
    });
    let div;
    const text = await res.text();
    if (event.target.id == "login") {
      div = checkLogin;
    } else if (event.target.id == "email") {
      div = checkEmail;
    }
    div.textContent = text;
    if (/not/.test(text) || !res.ok) {
      div.style.color = "red";
    } else {
      div.style.color = "green";
    }
  }
};

login.addEventListener("blur", checkFetch);
email.addEventListener("blur", checkFetch);