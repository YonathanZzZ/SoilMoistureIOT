import passport from "passport";
import bcrypt from 'bcrypt';
import passportLocal from "passport-local";

import { getUser } from "../services/user.service";

const LocalStrategy = passportLocal.Strategy;

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },

    async (email, password, done) => {
        const user = await getUser(email);
        if(!user) {
            return done(null, false);
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) {
            return done(null, false);
        }

        const sessionUser = {
            id: user.id,
            name: user.name,
        };
        
        return done(null, sessionUser); //user authenticated
    }
));

//TODO add Google strategy. requires registering the application with Google (https://www.passportjs.org/packages/passport-google-oauth20/)