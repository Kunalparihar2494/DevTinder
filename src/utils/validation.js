const validate = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("First name and Last name is not present");
  } else if (!validate.isEmail(emailId)) {
    throw new Error("Email Id is not valid");
  } else if (!validate.isStrongPassword(password)) {
    throw new Error("Password is not strong password");
  }
};

const validateProfileEdit = (req) => {
    const data = req.body;
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "photoURL",
      "skills",
      "about",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) => {
      return ALLOWED_UPDATES.includes(k);
    });

    if(data.about.length > 200) throw new Error("About me cannot be more than 200");
    

    return isUpdateAllowed;
}

module.exports = { validateSignUpData,validateProfileEdit };
