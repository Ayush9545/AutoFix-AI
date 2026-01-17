/**
 * Validates a password based on the following criteria:
 * - At least 8 characters long
 * - Contains at least one number
 * - Contains at least one special character
 * 
 * @param {string} password - The password string to validate
 * @returns {boolean} - Returns true if criteria are met, false otherwise
 */
function validatePassword(password) {
  if (typeof password !== 'string') {
    return false;
  }

  // Regex breakdown:
  // ^                          - Start of string
  // (?=.*[0-9])                - Assert at least one digit
  // (?=.*[!@#$%^&*(),.?":{}|<>]) - Assert at least one special character
  // .{8,}                      - At least 8 characters of any type
  // $                          - End of string
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  return passwordRegex.test(password);
}

module.exports = validatePassword;