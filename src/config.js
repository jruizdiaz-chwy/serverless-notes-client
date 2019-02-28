export default {
	MAX_ATTACHMENT_SIZE: 5000000,
	s3: {
		REGION: "us-east-2",
		BUCKET: "notes-tutorial-app-files"
	},
	apiGateway: {
		REGION: "us-east-2",
		URL: "https://iokhrzrb3b.execute-api.us-east-2.amazonaws.com/prod"
	},
	cognito: {
		REGION: "us-east-2",
		USER_POOL_ID: "us-east-2_dHJNBCXKN",
		APP_CLIENT_ID: "5n5udaqcpb1459m88ct92rj8gp",
		IDENTITY_POOL_ID: "us-east-2:9e3b4c08-bb53-44f0-bdc8-d18ab8cea1ca"
	},
	social: {
		FB: process.env.REACT_APP_FB_APP_ID
	}
};