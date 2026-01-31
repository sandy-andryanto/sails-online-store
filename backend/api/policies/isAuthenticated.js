/**
 * This file is part of the Sandy Andryanto Online Store Website.
 *
 * @author     Sandy Andryanto <sandy.andryanto.official@gmail.com>
 * @copyright  2025
 *
 * For the full copyright and license information,
 * please view the LICENSE.md file that was distributed
 * with this source code.
 */

module.exports = async function (req, res, next){
  sails.helpers.verifyJwt.with({
    req: req,
    res: res
  }).switch({
    error: function (err) {
        return res.serverError(err)
    },
    invalid: function(_err){
      if (req.wantsJSON){
        return res.sendStatus(401)
      }
      return res.redirect('/auth/login')
    },
    success: function(){
      return next()
    }
  })
}
