const validationUrlExpression = /^(https?:\/\/)?(www.)?[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,3}(\/\S*)?$/;

function validateLink(link) {
  return validationUrlExpression.test(link);
}
module.exports = { validateLink, validationUrlExpression };
