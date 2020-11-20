const {
    OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_ID);

const verify = async(token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_ID
    });
    const payload = ticket.getPayload();
    const { given_name, email, picture, family_name } = payload;
    const userid = payload['sub'];
    return { name: given_name, email, picture, lastname: family_name };
}

module.exports = {
    verify
}