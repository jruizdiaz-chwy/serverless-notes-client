import Amplify from 'aws-amplify';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import config from "./config";
import App from './App';
import * as serviceWorker from './serviceWorker';

Amplify.configure({
	API: {
		endpoints: [
			{
				name: "notes",
				endpoint: config.apiGateway.URL,
				region: config.apiGateway.REGION
			},
		],
		credentials: {
      accessKeyId: config.auth.ACCESS_KEY_ID,
      secretAccessKey: config.auth.SECRET_ACCESS_KEY
    },
	}
});

ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
