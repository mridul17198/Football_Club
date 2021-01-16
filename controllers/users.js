'use strict';

module.exports = function(_,passport,User,validator) {
    return {
        SetRouting: function(router){
            router.get('/',this.indexPage);
            router.get('/signup',this.getSignUp);
            router.get('/auth/facebook',this.getFacebookLogin);
            router.get('/auth/facebook/callback', this.facebookLogin);
            router.get('/auth/google', this.getGoogleLogin);
            router.get('/auth/google/callback', this.googleLogin);

            router.post('/',[
                validator.check('email').not().isEmpty().isEmail()
                .withMessage('Email is Invalid'),
                validator.check('password').not().isEmpty()
                .withMessage('Password is Required and must be atleast 5 character long')
            ],
            this.postValidation, this.postLogin);

            //router.post('/signup',User.SignUpValidation,this.postSignUp);
            router.post('/signup',[
                validator.check('username').not().isEmpty().isLength({min: 5})
                .withMessage('Username is required and must of minimum length 5'),
                validator.check('email').not().isEmpty().isEmail()
                .withMessage('Email is Invalid'),
                validator.check('password').not().isEmpty()
                .withMessage('Password is Required and must be atleast 5 character long')
            ],this.postValidation,this.postSignUp);
        },
        indexPage: function(req, res){
            const errors = req.flash('error');
            return res.render('index', {title: 'FootballClub | Login', messages: errors, hasErrors: errors.length > 0});
        },
        getSignUp: function(req, res){
            const errors = req.flash('error');
            return res.render('signup', {title: 'FootballClub | SignUp', messages: errors, hasErrors: errors.length > 0});
        },
        postValidation: function(req,res,next) {
            const err = validator.validationResult(req);
            const errors = err.array();
            const messages = [];
            errors.forEach((error) => {
                messages.push(error.msg);
            });
            if(req.url ==='/')
            {
                req.flash('error', messages);
                res.redirect('/');
            }
            else{
                req.flash('error', messages);
                res.redirect('/signup');
            }
        },
        
        postSignUp: passport.authenticate('local.signup', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),

        postLogin: passport.authenticate('local.login', {
            successRedirect: '/home',
            failureRedirect: '/',
            failureFlash: true
        }),

        getGoogleLogin: passport.authenticate('google', {
            scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read']
        }),
        
        googleLogin: passport.authenticate('google', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),

        facebookLogin : passport.authenticate('facebook',{
            successRedirect : '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),

        getFacebookLogin: passport.authenticate('facebook',{
            scope: 'email'
        })
    }
}