//THis provides us with the authentication information if the user
const express = require("express")
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('./../model/userModel');
const Loan = require('./../model/loanModel')

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = async (req, res, next) => {
  const newUser = await User.create({
    FirstName: req.body.fname,
    LastName: req.body.lname,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.cpassword
  });

  //createSendToken(newUser, 201, res);
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.login = async (req, res, next) => {

  // 1) Check if email and password exist
  if (!req.body.email || !req.body.password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  // const user = await User.findOne(req.body.email).select('+password');

  // if (!user || !(await user.correctPassword(req.body.password, user.password))) {
  //   return next(new AppError('Incorrect email or password', 401));
  // }
 
  // 3) If everything ok, send token to client
  //createSendToken(user, 200, res);
  res.status(200).render('userPage', {
    title: 'User page opened successfully'
  });
};

exports.protect = async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization && req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist.',401)
    );
  }
  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.',401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
};

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.newLoan = async (req, res, next) => {
  const floan = await Loan.create({
    customerName: req.body.cname,
    phoneNumber: req.body.pnumber,
    address: req.body.address,
    loanAmount: req.body.loanamount,
    interest: req.body.interest,
    loanTermYears: req.body.loantermyears,
    loanType: req.body.loantype,
    description: req.body.description
  });

  res.status(200).render('userPage', {
    title: 'User page opened successfully'
  });
};
