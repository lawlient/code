const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.session.token;

  if (!token) {
    return res.status(403).redirect("/api/auth/login");
  }

  jwt.verify(token,
            config.secret,
            (err, decoded) => {
              if (err) {
                res.status(403).redirect("/api/auth/login")
              }
              req.userId = decoded.id;
              next();
            });
};

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec().then(user => {
    Role.find(
      {
        _id: { $in: user.roles },
      }
    ).then(
      roles => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    ).catch(err => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
    });
  }).catch(err => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
  });
};

isModerator = (req, res, next) => {
  User.findById(req.userId).exec().then(user => {
    Role.find(
      {
        _id: { $in: user.roles },
      }).then(roles => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Moderator Role!" });
        return;
      }
    ).catch(err => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
    });
  }).catch(err => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
};
module.exports = authJwt;