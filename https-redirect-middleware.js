function httpsRedirectMiddleware() {
  return (req, res, next) => {
    if (req.protocol != "https")
      res.redirect("https://" + req.headers.host + req.url);
    next();
  };
}

module.exports = httpsRedirectMiddleware;
