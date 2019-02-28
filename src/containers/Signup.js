import { Auth } from 'aws-amplify';
import React, { Component } from 'react';
import {
	Form,
	FormGroup,
	FormControl,
	FormLabel
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import FacebookButton from '../components/FacebookButton';
import './Signup.css';

export default class Signup extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			email: '',
			password: '',
			confirmPassword: '',
			confirmationCode: '',
			newUser: null
		};
	}

	validateForm = () => {
		const { email, password, confirmPassword } = this.state;
		return (
			email.length > 0 &&
			password.length > 0 &&
			password === confirmPassword
		)
	}

	validateConfirmationForm = () => this.state.confirmationCode.length > 0;

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
			const newUser = await Auth.signUp({
				username: email,
				password
			})
			this.setState({ newUser });
		} catch (e) {
			if (e.code === 'UsernameExistsException') {
				await Auth.resendSignUp(email);
				this.setState({ newUser: 'duplicate' });
			} else {
				alert(e.message);
			}
		}

		this.setState({ isLoading: false });
	}

	handleConfirmationSubmit = async event => {
		event.preventDefault();
		this.setState({ isLoading: true });

		const { email, password, confirmationCode } = this.state;
		try {
			await Auth.confirmSignUp(email, confirmationCode);
			await Auth.signIn(email, password);

			this.props.userHasAuthenticated(true);
			this.props.history.push('/');
		} catch (e) {
			alert(e.message);
			this.setState({ isLoading: false });
		}
	}

	handleFbLogin = () => {
		this.props.userHasAuthenticated(true);
	};

	renderConfirmationForm() {
		return (
			<form onSubmit={this.handleConfirmationSubmit}>
				<FacebookButton
					onLogin={this.handleFbLogin}
				/>
				<hr />
				<FormGroup controlId="confirmationCode" bsSize="large">
					<FormLabel>Confirmation Code</FormLabel>
					<FormControl
						autoFocus
						type="tel"
						value={this.state.confirmationCode}
						onChange={this.handleChange}
					/>
					<Form.Text className="text-muted">Please check your email for the code.</Form.Text>
				</FormGroup>
				<LoaderButton
					block
					bsSize="large"
					disabled={!this.validateConfirmationForm()}
					type="submit"
					isLoading={this.state.isLoading}
					text="Verify"
					loadingText="Verifying..."
				/>
			</form>
		);
	}

	renderForm() {
		const { email, password, confirmPassword, isLoading } = this.state;
		return (
			<form onSubmit={this.handleSubmit}>
				<FormGroup controlId="email" bsSize="large">
					<FormLabel>Email</FormLabel>
					<FormControl
						autoFocus
						type="email"
						value={email}
						onChange={this.handleChange}
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
				<FormGroup controlId="confirmPassword" bsSize="large">
					<FormLabel>Confirm Password</FormLabel>
					<FormControl
						value={confirmPassword}
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
					text="Signup"
					loadingText="Signing up…"
				/>
			</form>
		)
	}

	render() {
		return (
			<div className="Signup">
				{this.state.newUser === null
					? this.renderForm()
					: this.renderConfirmationForm()
				}
			</div>
		);
	}
}
