const router = require('express').Router();
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');
const DB = require('../database/model.js');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 14);

  creds.password = hash;

  try {
    const userAddSuccess = await DB.add(creds);
    const token = genToken(userAddSuccess);
    res.status(201).json({ userAddSuccess, token: token });
  } catch (err) {
    res.status(500).json(err);
  }
});

// {
// 	"username": "Apple Man",
// 	"password": "HorseInAbigOlFight"
// }
// "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjEsInVzZXJuYW1lIjoiQXBwbGUgTWFuIiwiaWF0IjoxNTc2NDU4NzY0LCJleHAiOjE1NzY0NjU5NjR9.SY3Bp5kXagEoT8U5C81-zFq28ivoqrAPsu0v07tiFIc"

// {
// 	"username": "Banana Lad",
// 	"password": "keepYourIsPeeled"
// }
// {
//   "created_user": {
//       "id": 2,
//       "username": "Banana Lad",
//       "password": "$2a$14$nF855OxSGy98ImBQn6qKreftbzCmNP87f27aw.XmGUc1dh4z1a58S"
//   },
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjIsInVzZXJuYW1lIjoiQmFuYW5hIExhZCIsImlhdCI6MTU3NjQ1ODg3NiwiZXhwIjoxNTc2NDY2MDc2fQ.3Qu7LQNvYjiK71pmRKLriNAX4-hxwK3aPFHanzJCWto"
// }

router.post('/login', async (req, res) => {
  try {
    let { username, password } = req.body;

    const user = await DB.findBy({ username }).first();

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = genToken(user);
      res.status(200).json({ username: user.username, token: token });
    } else {
      res.status(401).json({ message: 'Invalid Credentials' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

function genToken(user) {
  const payload = {
    userid: user.id,
    username: user.username
  };

  const options = { expiresIn: '2h' };
  const token = jwt.sign(payload, secrets.jwtSecret, options);

  return token;
}
module.exports = router;
