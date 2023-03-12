// const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const UserModel = require("../model/user");
const { local } = require("../middleware/localStrategy");

exports.join = async (req, res) => {
  console.log(`auth/join path -> ${req.path}`);
  // menu.filter((f) => f.selected == true).forEach((p) => (p.selected = false));
  // menu.find((p) => p.text === "Login").selected = true;

  res.render("join", { style: "main", login: false });
};

exports.login = (req, res, next) => {
  console.log(`auth/login path -> ${req.path}`);
  res.render("login", { style: "main", login: false });
};

exports.password = (req, res, next) => {
  console.log(`login/password path -> ${req.path}`);
  passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login",
  });
};

exports.logout = async (req, res) => {
  console.log(`auth/logout path -> ${req.params.email}`);
  req.logout();
  req.session.destroy();
  req.redirect("/");
};

exports.signin = async (req, res) => {
  console.log(`auth/signin path -> ${req.params.email}`);
  await passport.authenticate("local", { failureRedirect: "/login" }),
    function (req, res) {
      res.redirect("/");
    };
};

exports.signup = async (req, res) => {
  console.log(`auth/signup path -> ${req.path}`);

  passport.authenticate("local-signup", { session: false }),
    (req, res, next) => {
      // sign up
      res.json({
        user: req.user,
      });
    };

  res.render("signup", { style: "main", login: false });
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("Not Login");
  }
};

exports.isNotLoggedIn = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent("로그인한 상태입니다.");
    res.redirect(`/?error=${message}`);
  }
};

exports.authenticateKakao = async (req, res) => {
  await passport.authenticate("kakao");
};

exports.authenticateRedirectKakao = async (req, res) => {
  await passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
    (req, res) => {
      res.redirect("/");
    };
};
