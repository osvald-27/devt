
const { v4: uuidv4 } = require("uuid");

const requestLogger = (req, res, next) => {
  // Generate a unique request ID
  const requestId = uuidv4();

  // Get client IP (works behind proxies too if configured)
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  // Get method, URL, protocol
  const { method, originalUrl, protocol, httpVersion } = req;

  // Log the incoming request
  console.log("==== Incoming Request ====");
  console.log(`Request ID : ${requestId}`);
  console.log(`IP Address : ${ip}`);
  console.log(`Method : ${method}`);
  console.log(`URL : ${originalUrl}`);
  console.log(`Protocol : ${protocol.toUpperCase()}/${httpVersion}`);
  console.log("Headers :", req.headers);
console.log("Headers :", JSON.stringify(req.headers, null, 2));
  console.log("==========================");

  // Attach the request ID to the request object if you want to use it later
  req.requestId = requestId;

  next(); // important to continue the chain
};

module.exports = requestLogger;
