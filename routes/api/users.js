const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const config = require('config');
const User = require('../../models/User');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post('/',[
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter password with 6 or more characters').isLength({ min: 6 }),
    check('mobileNo', 'Mobile number is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, mobileNo, address } = req.body;

    try {
        // See if user exists
        let user = await User.findOne({ email });

        if(user) {
            return res.status(400).json({ errors: [{ msg: 'user already exists' }]});
        }

        user = new User({
            firstName,
            lastName,
            email,
            password,
            mobileNo,
            address
        });

        // Encrypt password with salt and hash
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        }
        
        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            { expiresIn: 360000},
            (err, tokenData) => {
                if(err) throw err;
                return res.json({messge: 'User is registered successfully', accessToken: tokenData});
            }
        );
    } catch(err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const limitValue = Number(req.query.limit) || 2;
        const skipValue = Number(req.query.skip) || 0;
        const user = await User.find().select('-password').limit(limitValue).skip(skipValue);

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
 });

 router.put('/', auth, [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter password with 6 or more characters').isLength({ min: 6 }),
    check('mobileNo', 'Mobile number is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, mobileNo, address } = req.body;

    try {
        // See if user exists
        let user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid user. Please provide valid email' }]});
        }


        let userFields = {};
        userFields.firstName = firstName ? firstName : user.firstName
        userFields.lastName = lastName ? lastName : user.lastName
        userFields.password = firstName ? await passwordHash(password) : user.password
        userFields.mobileNo = mobileNo ? mobileNo : user.mobileNo
        userFields.address = address ? address : user.address
        
        user = await User.findOneAndUpdate(
            {id: user.id},
            {$set: userFields},
            {new: true}
        );

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        }
        
        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            { expiresIn: 360000},
            (err, tokenData) => {
                if(err) throw err;
                return res.json({messge: 'User is updated successfully', accessToken: tokenData});
            }
        );
    } catch(err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

router.put('/search', auth, async (req, res) => {
    try {
        // See if user exists
        const limitValue = Number(req.query.limit) || 100000;
        const skipValue = Number(req.query.skip) || 0;

        const user = await User.find(req.body).select('-password').limit(limitValue).skip(skipValue);

        
        res.json(user);
    } catch(err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

const passwordHash = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

module.exports = router;