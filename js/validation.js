console.log("JS file is successfully connected!");

const form = document.getElementById("form");
const firstname_input = document.getElementById("firstname-input");
const email_input = document.getElementById("email-input");
const password_input = document.getElementById("password-input");
const repeat_password_input = document.getElementById("repeat-password-input");
const error_message = document.getElementById("error-message");

form.addEventListener("submit", (e) => {
  // e.preventDefault() Prevent Submit

  let errors = [];

  if (firstname_input) {
    // if we have the first name input, then, we are in the sign up page
    errors = getSignupFormErrors(
      firstname_input.value,
      email_input.value,
      password_input.value,
      repeat_password_input.value,
    );
  } else {
    //If we don't have a first name input, then we are in the log in page
    errors = getLoginFormErrors(email_input.value, password_input.value);
  }
  if (errors.length > 0) {
    //If there are any errors inside the array.
    e.preventDefault();
    error_message.innerText = errors.join(" ");
  }
});

function getSignupFormErrors(firstname, email, password, repeatPassword) {
  let errors = [];
  if (firstname === "" || firstname == null) {
    errors.push("First Name Is Required.");
    firstname_input.parentElement.classList.add("incorrect");
  }
  if (email === "" || email == null) {
    errors.push("Email Address Is Required.");
    email_input.parentElement.classList.add("incorrect");
  }
  if (password === "" || password == null) {
    errors.push("Password is Required.");
    password_input.parentElement.classList.add("incorrect");
  }
  if (repeatPassword === "" || repeatPassword == null) {
    errors.push("Repeating Password Is Required.");
    repeat_password_input.parentElement.classList.add("incorrect");
  }
  if (password !== repeatPassword) {
    errors.push(
      "Initial Password Does Not Match Password Entered in Repeat Password Field.",
    );
    password_input.parentElement.classList.add("incorrect");
    repeat_password_input.parentElement.classList.add("incorrect");
  }

  if (password.length < 8) {
    errors.push("The Best Passwords Are At Least 8 Characters Long!");
    password_input.parentElement.classList.add("incorrect");
  }
  return errors;
}

function getLoginFormErrors(email, password) {
  let errors = [];
  if (email === "" || email == null) {
    errors.push("Email Address Is Required.");
    email_input.parentElement.classList.add("incorrect");
  }
  if (password === "" || password == null) {
    errors.push("Password is Required.");
    password_input.parentElement.classList.add("incorrect");
  }
  return errors;
}

const allInputs = [
  firstname_input,
  email_input,
  password_input,
  repeat_password_input,
].filter((input) => input != null);
allInputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.parentElement.classList.contains("incorrect")) {
      input.parentElement.classList.remove("incorrect");
      error_message.innerText = "";
    }
  });
});
