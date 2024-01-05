const User = require('../../../models/User');

exports.Verify = async (req, res, next) => {
   try{
    const token = req.params.token;
    console.log(token)
    const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() }
    })
    if (!user) {
        return res.status(400).send('Verification link is invalid or has expired');
    }
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save().then((user) => {
        console.log(user)
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.redirect('/account');
        })
    })
   
   }
   catch(err){
    return res.status(500).send(err);
   }
}