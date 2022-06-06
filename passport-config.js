const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

function initialize(passport, getUserByEmail, getUserById){
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email);
        if (user == null){
            return done(null, false, {message: "Email belum terdaftar!"});
        }
        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user);
            } else {
                return done(null, false, {message: "Kata sandi tidak valid!"});
            }
        } catch (err) {
            return done(err);
        }
    };
    
    passport.use(new localStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        return done(null, await getUserById(id))
    })
}

module.exports = initialize;