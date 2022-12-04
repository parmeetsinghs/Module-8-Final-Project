//This gives us the loan API and the entered data.
const Loan = require('./../model/loanModel');
const Users = require('./../model/userModel');
const APIFeatures = require('./../dataBaseManager/loanDbContext');

exports.getLandingPAge = async (req, res) => {
  res.status(200).render('overview', {
    title: `Over View`
  });
};

exports.getAllLoans = async (req, res) => {
  try {
    
    const features = new APIFeatures(Loan.find(), req.query) //Loan here has the schema
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const loans = await features.query;
    res.status(200).render('loans', {  //this is the pug file
      title: `Get Loans`,
      status: 'success',
      results: loans.length,
      data: loans
    });
  } catch (err){
  res.status(404).render({
    status: 'fail',
    message: err
  });
}
};

exports.getUsers = async (req, res) => {
  try {
    
    const feature = new APIFeatures(Users.find(), req.query) //Loan here has the schema
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const users = await feature.query;
    res.status(200).render('users', {  //this is the pug file
      title: `Get Users`,
      status: 'success',
      results: users.length,
      data: users
    });
  } catch (err){
  res.status(404).render({
    status: 'fail',
    message: err
  });
}
};

exports.getLoan = async (req, res) => {
  res.status(200).render('Loans', {
    title: `Get Loans`
  });
};


exports.createNewLoan = async (req, res) => {
  res.status(200).render('newLoan', {
    title: `Create New Loan`
  });
};

exports.getSignInForm = (req, res) => {
  res.status(200).render('newCustomer', {
    title: 'Sign in New User'
  });
};

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getuserPage = (req, res) => {
  res.status(200).render('userPage', {
    title: 'User page opened successfully'
  });
};

exports.getLogout = (req, res) => {
  res.status(200).render('logout', {
    title: 'go to overview page'
  });
};
