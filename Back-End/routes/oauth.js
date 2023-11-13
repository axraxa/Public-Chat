const router = require("express").Router();
const cookieParser = require("cookie-parser");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const Message = require("../models/Message");
require("dotenv").config();

router.post("/request", async function(req, res, next) {
  const redirectUrl = `${process.env.BACKEND_URL}/oauth`;
  const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectUrl,
  );
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    // access_type: "offline",
    scope:
      "https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email",
    prompt: "consent",
  });

  res.json({ url: authorizeUrl });
});

router.get("/", async function(req, res, next) {
  const code = req.query.code;
  try {
    const redirectUrl = `${process.env.BACKEND_URL}/oauth`;
    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectUrl,
    );
    const response = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(response.tokens);
    const user = oAuth2Client.credentials;
    //get userdata
    const userresponse = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${user.access_token}`,
    );
    const data = await userresponse.json();

    const token = jwt.sign({ data }, process.env.SECRET_KEY, {
      algorithm: "HS256",
    });
    return res.redirect(
      `${process.env.FRONTEND_URL}/jwtverify/${token.replace(
        /\./g,
        "jemaliBidzia",
      )}`,
    );
  } catch (error) {
    console.log(error);
    return res.redirect(`${process.env.FRONTEND_URL}`);
  }
});

router.get("/jwtverify", function(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      if (err) return res.json({ err: err });
      return res.json({ decoded });
    });
  } catch (error) {
    return res.json(error);
  }
});

router.get(`/messages/:length`, async (req, res, next) => {
  try {
    const length = req.params.length;
    if (length == 0) {
      const messages = await Message.find()
        .sort({ date: "desc" })
        .skip(length)
        .limit(20);
      return res.send(messages);
    }
    const token = req.headers.authorization;
    if (!token) return res.send({ msg: "You are not registered buddy:)" });
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) return res.send({ msg: "You are not registered buddy:)" });
    });
    const messages = await Message.find()
      .sort({ date: "desc" })
      .skip(length)
      .limit(20);
    if (messages.length > 0) return res.send(messages);
    return res.send({ msg: "No more message" });
  } catch (error) {
    console.log(error);
    return res.send({ msg: "Something wrong with it" });
  }
});
module.exports = router;
