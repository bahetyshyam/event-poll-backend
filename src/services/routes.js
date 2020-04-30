import bodyParser from 'body-parser';
import passport from 'passport';
import auth from '../routes/auth';


export default function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/api/auth', auth);

    app.get('/auth/google',
            passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email'] }));
    
    app.get('/auth/google/callback', 
        passport.authenticate('google', { successRedirect: "/", failureRedirect: '/login' }));
    
    app.get("/login", (req, res) => {
        res.send("Failed attempt");
    });
        
    app.get("/", (req, res) => {
        res.send("Success");
    });

    app.all('*', (req, res) => {
        res.status(404).send({ success: false, message: 'Endpoint not found.' });
    });

}