const Joi = require('joi');
const bodyparser = require('body-parser');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const user = require('./routes/user');
const auth = require('./routes/auth');
const Twit= require('twit');
const data = require('./routes/data');
const config = require('config');
const cors = require('cors');
const nodemailer = require('nodemailer');
const generator = require('generate-password');

app.use(cors());
app.use(express.json());
app.use(bodyparser.json());
// app.use(bodyparser.urlencoded({extended:true}))
app.use(express.urlencoded({ extended: true }));
// app.get('/',function(req,res){
//     res.status(200).send('hlo chutiya')
// });
app.use('/user', user);
app.use('/auth', auth);
app.use('/data', data);



if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

// mongoose.connect('mongodb://localhost/rough', { useNewUrlParser: true })
//     .then(() => console.log("connected to the database"))
//     .catch((err) => console.log(err));


mongoose.connect('mongodb://yogesh12345:Yogesh123@ds147344.mlab.com:47344/rough', {
    useNewUrlParser: true
}).catch((err)=>{
    console.log("not connected to the databasde")
});
//   mongoose.connection.openUri('mongodb://localhost/rough',{useNewUrlParser : true})


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
    // console.log(FOO);
})