//variables for the backend
const domain = "bingo-app-cv3k.onrender.com";
const frontPort = process.env.PORT || 3000;
const backPort = process.env.PORT || 4000;
const frontAdress = `wss//${domain}:${frontPort}`;
const backAdress = `https//${domain}`;

module.exports = {
  domain,
  frontPort,
  backPort,
  frontAdress,
  backAdress
};
