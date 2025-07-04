const validate = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("First name and Last name is not present");
  } else if (!validate.isEmail(emailId)) {
    throw new Error("Email Id is not valid");
  } else if (!validate.isStrongPassword(password)) {
    throw new Error("Passwword is not strong password");
  }
};

const validateProfileEdit = (req) => {
    const data = req.body;
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "photoURL",
      "skills",
      "about",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) => {
      return ALLOWED_UPDATES.includes(k);
    });

    return isUpdateAllowed;
}

module.exports = { validateSignUpData,validateProfileEdit };
