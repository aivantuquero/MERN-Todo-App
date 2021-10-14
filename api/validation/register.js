const Validator = require('validator');

function isEmpty(obj){
    if (obj == null) return true;

    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
  
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) return false;
    }
  
    return true;
}

module.exports = function validateRegisterInput(data){
    let errors = {};

    data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
    data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";
    

    if (Validator.isEmpty(data.firstName) || Validator.isEmpty(data.lastName)) {
        errors.name = "Name field is required";
    }

        // Email checks
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }

    // Password checks
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "Confirm password field is required";
    }

    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be at least 6 characters";
    }
    
    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match";
    }

    return {
        errors,
        isValid: isEmpty(errors)
      };


}