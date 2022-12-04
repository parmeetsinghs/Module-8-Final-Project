//This set routes to our landing pages
const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController')

const router = express.Router();

router.get('/', viewsController.getLandingPAge);
router.get('/loans', viewsController.getAllLoans);
router.get('/login', viewsController.getLoginForm);
router.get('/signup', viewsController.getSignInForm);
router.get('/newLoan', viewsController.createNewLoan);
router.get('/logout', viewsController.getLandingPAge);
router.get('/users', viewsController.getUsers);



router.get('/');
router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.post('/newLoan', authController.newLoan);

module.exports = router;
