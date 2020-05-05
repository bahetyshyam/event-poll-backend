import bodyParser from 'body-parser';
import auth from '../routes/auth';
import users from '../routes/user';


export default function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/api/auth', auth);
    app.use('/api/user', users);

    app.all('*', (req, res) => {
        res.status(404).send({ success: false, message: 'Endpoint not found.' });
    });
}