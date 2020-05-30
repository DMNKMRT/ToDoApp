function httpsRedirectMiddleware() {
  return (req, res, next) => {
    if (!req.secure)
      res.redirect("https://" + req.headers.host + req.url);
    else next();
  };
}

module.exports = httpsRedirectMiddleware;
