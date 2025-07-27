//variables for the backend
const domain = "http://localhost";
const frontPort = "3000";
const backPort = "3500";

const frontAdress = `${domain}:${frontPort}`;
const backAdress = `${domain}:${backPort}`;

module.exports = {
  domain,
  frontPort,
  backPort,
  frontAdress,
  backAdress,
};
