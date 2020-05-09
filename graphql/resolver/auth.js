const bcrypt = require('bcryptjs');
const User = require('../../models/user');

const jwt = require('jsonwebtoken')

module.exports = {


    createUser: async (args) => {

        try {
            const isUserExists = await User.findOne({
                email: args.userInput.email
            })
            if (isUserExists) {
                throw new Error('User already Exists!');
            }

            const hashPassword = await bcrypt.hash(args.userInput.password, 12);
            const user = new User({
                email: args.userInput.email,
                password: hashPassword
            })

            const userSaveRes = await user.save();


            return {
                ...userSaveRes._doc,
                password: null,
                _id: userSaveRes.id
            };
        } catch (e) {
            throw e;
        }
    },
    login: async ({email ,password}) => {
        const user = await User.findOne({email: email});

        if(!user){
            throw new Error ('Invalid credentials '); 
        }

        const isEquat = await bcrypt.compare(password, user.password);
        if(!isEquat){
            throw new Error ('Invalid credentials ');
        }

        const token = await jwt.sign({userId: user.id, email : user.email}, 'somesupersecretkey', {expiresIn: '1h'});

        return {
            userId: user.id,
            token: token,
            tokenExpiration: 1
        }
    }
}