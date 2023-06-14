// ====== function for validating email format ====== //

const isValidEmail = function (email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

// ====== function for validating password format ====== //

const passwordVal = function (password) {
  var strongRegex = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,15}$/
  );
  /*at least 1 lowercase, at least 1 uppercase,contain at least 1 numeric character,
        at least one special character, range between 8-15*/
  return strongRegex.test(password);
};

module.exports = { isValidEmail, passwordVal };
