module.exports = function requestLogger(req, res, next)  {
    const log = {
        ip: req,ip,
        method: req.method,
        endpoint: req.originalUrl,
        userAgent: req.headers["user-agent"],
        language: req.headers["accept-language"],
        referer: req.headers["referer"] || req.headers["referrer"] || "direct",
        contentType: req.headers["content-type"] || "N/A",
        time: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: Date.now()
    };
    console.log("Request Log: ", log);
    next();
    
}