import Amplify from 'aws-amplify';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

Amplify.configure({
	API: {
		endpoints: [
			{
				name: "notes",
				endpoint: process.env.REACT_APP_API_GW_URL,
				region: process.env.REACT_APP_API_GW_REGION
			},
		],
		credentials: {
      accessKeyId: process.env.REACT_APP_API_GW_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_API_GW_SECRET_ACCESS_KEY
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
