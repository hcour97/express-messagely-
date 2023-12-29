/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

const { SECRET_KEY } = require("../config");
const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (await User.authenticate(username, password)) {
            let token = jwt.sign({username}, SECRET_KEY);
            User.updateLoginTimestamp(username);
            return res.json({token});
        } else {
            throw new ExpressError(`Invalid username and password combination. Please try again.`, 404);
        }
    }
    catch (err) {
    return next(err);
      }
});




/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post("/register", async function (req, res, next) {
    try {
      let {username} = await User.register(req.body); // calls on user method to register
      let token = jwt.sign({username}, SECRET_KEY); // create the token (a string)
      User.updateLoginTimestamp(username); // NEED TO WRITE!!!!  
  
      return res.json({token});
    } catch (err) {
      return next(err);
    }
  });


  module.exports = router;
