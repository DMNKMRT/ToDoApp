function httpsRedirectMiddleware() {
  return (req, res, next) => {
    console.log(req.headers);
    const isSecure = req.secure || req.headers["x-forwarded-proto"] == "https";
    if (!isSecure) res.redirect("https://" + req.headers.host + req.url);
    else next();
  };
}

module.exports = httpsRedirectMiddleware;
