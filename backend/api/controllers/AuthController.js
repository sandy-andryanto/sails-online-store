/**
* This file is part of the Sandy Andryanto Online Store Website.
*
* @author     Sandy Andryanto <sandy.andryanto.blade@gmail.com>
* @copyright  2025
*
* For the full copyright and license information,
* please view the LICENSE.md file that was distributed
* with this source code.
*/


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { faker } = require('@faker-js/faker');


require("dotenv").config();

module.exports = {

  login: async function (req, res) {

    if (!req.body.email) {
      return res.status(400).json({ message: 'The field email can not be empty!' });
    }

    if (!req.body.password) {
      return res.status(400).json({ message: 'The field password can not be empty!' });
    }

    const email = req.body.email
    const password = req.body.password
    const user = await User.findOne({email: email});

    if(!user){
      return res.status(401).json({ message: 'These credentials do not match our records.' });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Wrong password!!' });
    }

    if (parseInt(user.status) === 0) {
       return res.status(401).json({ message: 'You need to confirm your account. We have sent you an activation code, please check your email.!' });
    }

    const token = jwt.sign({user}, process.env.JWT_KEY, { expiresIn: '8766h'});

    await Activity.create({
        user: user.id,
        event: "Sign In",
        subject: "Sign In Current User",
        description: "Sign in to application",
        createdAt: new Date(),
        updatedAt: new Date()
    });

    return res.json({ token: token, expiresIn: moment().add(8766, 'hours').format('YYYY-MM-DD HH:mm:ss') });
  },

  register: async function (req, res) {

    if (!req.body.name) {
      return res.status(400).json({ message: 'The field name can not be empty!' });
    }

    if (!req.body.email) {
      return res.status(400).json({ message: 'The field email can not be empty!' });
    }

    if (!req.body.password) {
      return res.status(400).json({ message: 'The field password can not be empty!' });
    }

    if (!req.body.password_confirm) {
      return res.status(400).json({ message: 'The field password_confirm can not be empty!' });
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const password_confirm = req.body.password_confirm;
    const user = await User.findOne({email: email});
    const names = name.split(" ")

    if (password.length < 8) {
      return res.status(400).json({ message: 'The password must be at least 8 characters.!' });
    }

    if (password_confirm !== password) {
      return res.status(400).json({ message: 'The password confirmation does not match.!' });
    }

    if(user){
      return res.status(400).json({ message: 'The email has already been taken.!' });
    }

    let formUser = {
        email: email,
        password: bcrypt.hashSync(password, 10),
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    }

    if(names.length > 1){
       formUser = {
          ...formUser,
          firstName: names[0],
          lastName: names.slice(1).join(' ')
       }
    }else{
       formUser = {
          ...formUser,
          firstName: names[0]
       }
    }

    const token = faker.datatype.uuid()
    const newUser = await User.create(formUser).fetch();
    const now = new Date();
    const expiredAt = new Date(now.getTime() + 30 * 60 * 1000);

    await Activity.create({
        user: newUser.id,
        event: "Sign Up",
        subject: "Sign Up To Application",
        description: "Register new user account",
        createdAt: new Date(),
        updatedAt: new Date()
    });
    
    await Authentication.create({
        user: newUser.id,
        type: 'email-confirm',
        credential: email,
        token: token,
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        expiredAt: expiredAt
    })

    const payload = {
      message: 'You need to confirm your account. We have sent you an activation code, please check your email.',
      token: token
    }

    return res.json(payload);
  },

  confirm: async function (req, res) {

    const token = req.param('token')
    const auth = await Authentication.findOne({token: token, status: 0});

    if(!auth){
      return res.status(400).json({ message: 'We can`t find a user with that  token is invalid.!' });
    }

    await User.updateOne({ email: auth.credential }).set({  status: 1, updatedAt: new Date() })
    await Authentication.updateOne({ token: token }).set({  status: 2, expiredAt: new Date() })

    const user = await User.findOne({email: auth.credential});

    await Activity.create({
        user: user.id,
        event: "Email Verification",
        subject: "E-mail Confirmation",
        description: "Confirm new member registration account",
        createdAt: new Date(),
        updatedAt: new Date()
    });

    return res.json({ message: 'Your e-mail is verified. You can now login.' });
  },

  forgot: async function (req, res) {

    if (!req.body.email) {
      return res.status(400).json({ message: 'The field email can not be empty!' });
    }

    const email = req.body.email;
    const user = await User.findOne({email: email});
    const token = faker.datatype.uuid()
    const now = new Date();
    const expiredAt = new Date(now.getTime() + 30 * 60 * 1000);

    if(!user){
      return res.status(401).json({ message: 'We can`t find a user with that e-mail address.' });
    }

   await Authentication.create({
      user: user.id,
      type: 'reset-password',
      credential: email,
      token: token,
      status: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiredAt: expiredAt
    })

    await Activity.create({
        user: user.id,
        event: "Forgot Password",
        subject: "Send Request Reset Password",
        description: "Request reset password link",
        createdAt: new Date(),
        updatedAt: new Date()
    });

    const payload = {
      message: 'We have e-mailed your password reset link!',
      token: token
    }

    return res.json(payload);
  },

  reset: async function (req, res) {

    if (!req.body.email) {
      return res.status(400).json({ message: 'The field email can not be empty!' });
    }

    if (!req.body.password) {
      return res.status(400).json({ message: 'The field password can not be empty!' });
    }

    if (!req.body.password_confirm) {
      return res.status(400).json({ message: 'The field password_confirm can not be empty!' });
    }

    const token = req.param('token')
    const email = req.body.email;
    const password = req.body.password;
    const password_confirm = req.body.password_confirm;
    
    if (password.length < 8) {
      return res.status(400).json({ message: 'The password must be at least 8 characters.!' });
    }

    if (password_confirm !== password) {
      return res.status(400).json({ message: 'The password confirmation does not match.!' });
    }

    const auth = await Authentication.findOne({token: token, credential: email, status: 0});

    if(!auth){
      return res.status(400).json({ message: 'We can`t find a user with that  token is invalid.!' });
    }
    
    await User.updateOne({ email: auth.credential }).set({  status: 1, password: bcrypt.hashSync(password, 10), status: 1, updatedAt: new Date() })
    await Authentication.updateOne({ token: token }).set({  status: 2, expiredAt: new Date() })
    
    const user =  await User.findOne({email: email});

    await Activity.create({
        user: user.id,
        event: "Reset Password",
        subject: "Update Current Password",
        description: "Reset account password",
        createdAt: new Date(),
        updatedAt: new Date()
    });

    return res.json({ message: 'Your password has been reset!' });
  },

};

