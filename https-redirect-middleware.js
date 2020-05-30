function httpsRedirectMiddleware() {
  return (req, res, next) => {
    const isSecure = req.secure || req.headers["X-Forwarded-Proto"] == "https";
    if (!isSecure) res.redirect("https://" + req.headers.host + req.url);
    else next();
  };
}

module.exports = httpsRedirectMiddleware;
