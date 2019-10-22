exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  };
  res.redirect("/user/login");
};

exports.guest = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  };
  res.redirect("/user/account");
};

exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && res.locals.authUser.roleId == "1") {
    return next();
  };
  res.redirect("/tours");
};

exports.isManagerOrAdmin = (req, res, next) => {
  if (req.isAuthenticated() && (res.locals.authUser.roleId == "1" || res.locals.authUser.roleId == "3")) {
    return next();
  };
  res.redirect("/tours");
};