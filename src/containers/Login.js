import { Auth } from 'aws-amplify';
import React, { Component } from 'react';
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import './Login.css';
import LoaderButton from '../components/LoaderButton';
import FacebookButton from '../components/FacebookButton';

export default class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: '',
			isLoading: false
		};
	}

	validateForm() {
		return this.state.email.length > 0 && this.state.password.length > 0;
	}

	handleChange = event => {
		this.setState({
			[event.target.id]: event.target.value
		});
	}

	handleSubmit = async event => {
		event.preventDefault();
		this.setState({ isLoading: true });
		const { email, password } = this.state;

		try {
			await Auth.signIn(email, password);
			this.props.userHasAuthenticated(true);
		} catch (e) {
			alert(e.message);
			this.setState({ isLoading: false });
		}
	}

	handleFbLogin = () => {
		this.props.userHasAuthenticated(true);
	};

	render() {
		const { email, password, isLoading } = this.state;
		return (
			<div className="Login">
				<form onSubmit={this.handleSubmit}>
					<FacebookButton
						onLogin={this.handleFbLogin}
					/>
					<hr />
					<FormGroup
						controlId="email"
						bsSize="large"
					>
						<FormLabel>Email</FormLabel>
						<FormControl
							value={email}
							onChange={this.handleChange}
							type="text"
						/>
					</FormGroup>
					<FormGroup controlId="password" bsSize="large">
						<FormLabel>Password</FormLabel>
						<FormControl
							value={password}
							onChange={this.handleChange}
							type="password"
						/>
					</FormGroup>
					<LoaderButton
						block
						bsSize="large"
						disabled={!this.validateForm()}
						type="submit"
						isLoading={isLoading}
						loadingText="Logging in..."
						text="Login"
					/>
				</form>
			</div>
		)
	}
}