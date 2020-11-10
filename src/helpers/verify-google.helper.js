const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_ID);

const verify = async(token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_ID
    });
    const payload = ticket.getPayload();
    const { name, email, img } = payload;
    const userid = payload['sub'];
    return { name, email, picture };
    //return { name, email };
}

module.exports = {
    verify
}