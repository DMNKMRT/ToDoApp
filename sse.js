function sseMiddleware(req, res, next) {
  res.status(200).set({
    connection: "keep-alive",
    "cache-control": "no-cache",
    "content-type": "text/event-stream",
  });
  next();
}

function sseSend(res, eventName, message) {
  const data = JSON.stringify(message);
  res.write(`event: ${eventName}\n`);
  res.write(`data: ${data}\n\n`);
}

module.exports = {
  sseMiddleware: sseMiddleware,
  sseSend: sseSend,
};
