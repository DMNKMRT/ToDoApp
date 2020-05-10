const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
const LENGTH = 8;
const generateId = () => {
  let string = "";
  for (let i = 0; i < LENGTH; i++) {
    string += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return string;
};
module.exports.generateId = generateId;
