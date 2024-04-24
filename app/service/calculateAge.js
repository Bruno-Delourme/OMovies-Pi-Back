const debug = require('debug')('service:calculateAge');

// Utility function to calculate age

function calculateAge(birthday) {

  const today = new Date();
  const dob = new Date(birthday);

  let age = today.getFullYear() - dob.getFullYear();
  const month = today.getMonth() - dob.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
      age--;
  }
  return age;
};

module.exports =  calculateAge;