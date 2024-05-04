const ratelimit = require("express-rate-limit");
const { logEvents } = require("./logger");

const loginLimitter = ratelimit({
  windowMs: 60 * 1000, // 1 minutes
  limit: 5, // limit each IP to 5 login requests per window per minute.
  message: {
    message: "Too many login requests. Please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logEvents(
      `Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "errLog.log"
    );
    res.status(options.statusCode).send(options.message);
  },
});

module.exports = loginLimitter;
