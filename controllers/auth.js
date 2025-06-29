const User = require('../models/User');
require('express-async-errors');
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
    // const { name, email, password } = req.body
    // // since we are using mongoose validator, there is no need to check it explicitly
    // // if (!name || !email || !password) {
    // //     throw new BadRequestError('Please provide all values')
    // // }
    // // console.log(req.body);
    // const salt = await bcrypt.genSalt(10)
    // const hashedPassword = await bcrypt.hash(password, salt)
    // const tempUser = { name, email, password: hashedPassword }
    const user = await User.create({ ...req.body })
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
    // here this data is send back to frontend -> to process the data
    // we can send the token, so that frontend can store it somewhere (localstorage, database)
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('Please provide all values')
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = {
    register,
    login
}  