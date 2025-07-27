//variables for the backend
const domain = "https://bingo-app-cv3k.onrender.com";
const frontPort = "3000";
const backPort = process.env.PORT || 4000;

const frontAdress = `${domain}:${frontPort}`;
const backAdress = `${domain}:${backPort}`;

module.exports = {
  domain,
  frontPort,
  backPort,
  frontAdress,
  backAdress,
};
