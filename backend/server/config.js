//variables for the backend
const domain = "95.217.16.200";
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
