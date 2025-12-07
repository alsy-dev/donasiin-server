import { model as Admin } from '../model/Admins.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const handleRegister = async (req, res) => {
    const {username, password} = req.body;
    if(!username || !password) {
        return res.status(400).json({
            'message': 'Wajib mengisi username dan password'
        });
    }

    // Check for duplicate
    const duplicate = await Admin.findOne({ username: username }).exec();
    if(duplicate) {
        return res.sendStatus(409);
    }

    try {
        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and store the password
        const result = await Admin.create({
            username: username,
            password: hashedPassword
        });

        console.log(result);

        return res.status(201).json({
            'message': `Admin berhasil diregistrasi`
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({'message': error.message});
    }
}

export const handleLogin = async (req, res) => {
    const {username, password} = req.body;
    if(!username || !password) {
        return res.status(400).json({
            'message': 'Wajib mengisi username dan password'
        });
    }

    const foundUser = await Admin.findOne({ username: username }).exec();
    if(!foundUser) {
        return res.sendStatus(401);
    }

    // Evaluate passsword
    const match = await bcrypt.compare(password, foundUser.password);
    if(match) {
        // Create JWT
        const accessToken = jwt.sign(
            {
                'UserInfo': {
                    'username': foundUser.username
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '10m'}
        );

        const refreshToken = jwt.sign(
            {'username': foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '10d'}
        );

        // Saving refreshToken with current admin
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.json({
            accessToken
        });
    } else return res.sendStatus(401);
}

export const handleLogout = async (req, res) => {

    // On client also delete the accessToken
    const cookies = req.cookies;
    
    if(!cookies?.jwt) {
        return res.sendStatus(204); // No content
    }
    const refreshToken = cookies.jwt;

    // Checks if refreshToken in database
    const foundUser = await User.findOne({ refreshToken }).exec();
    if(!foundUser) {
        res.clearCookie('jwt', {httpOnly: true});
        return res.sendStatus(204); // No content
    }

    // Delete refreshToken in DB
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
    res.sendStatus(204);
}

export const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) {
        return res.sendStatus(401);
    }

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if(!foundUser) {
        return res.sendStatus(409); // Conflict
    }

    jwt.verify(
        refreshToken, 
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || foundUser.username != decoded.username) return res.sendStatus(403);

            const accessToken = jwt.sign({
                'UserInfo': {
                    'username': decoded.username,
                }
            },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10m'}
            );
            res.json({ accessToken });
        }
    )

}
