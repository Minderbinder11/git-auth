//index.js
import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import handler from './route-handler.js';
import config from '../config.json';
import bodyParser from 'body-parser';

const clientDir = path.resolve(__dirname, '../client');
const app = express();

app.use('/client', express.static(clientDir));
console.log('penut butter jelly');


// authorization flows are stateful,  they use state as opposed to just 
app.use(cookieParser());
app.use(session({
  secret: 'AlwaysOn',
  cookie: { maxAge: 3600000 },
  resave: false,
  saveUninitialized: false,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', handler.home);
app.get('/login', handler.login);
app.get('/callback/redirect', handler.callback);



app.listen(config.port, () => {
  console.log(`Express server started on http://localhost:${config.port}`);
});