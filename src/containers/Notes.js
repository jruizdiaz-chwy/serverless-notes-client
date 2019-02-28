import React, { Component } from 'react';
import { Storage, API } from 'aws-amplify';
import { s3Upload, s3Remove } from "../libs/awsLib";
import config from '../config';
import { FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import './Notes.css';

export default class Notes extends Component {
	constructor(props) {
		super(props);

		this.file = null;
		this.state = {
			note: null,
			content: '',
			attachmentURL: '',
			isLoading: false,
			isDeleting: false,
		};
	}

	async componentDidMount() {
		let note;
		let attachmentURL;
		try {
			note = await this.getNote();
			const { content, attachment } = note;

			if (attachment) {
				attachmentURL = await Storage.vault.get(attachment);
				console.log(attachmentURL);
			}

			console.log('attachement retrived');

			this.setState({
				note,
				content,
				attachmentURL
			});
		} catch (e) {
			console.log(attachmentURL);
			alert(e);
		}
	}

	getNote() {
		return API.get('notes', `/notes/${this.props.match.params.id}`);
	}

	saveNote(note) {
		return API.put('notes', `/notes/${this.props.match.params.id}`, {
			body: note
		});
	}

	deleteNote() {
		return API.del('notes', `/notes/${this.props.match.params.id}`);
	}

	validateForm() {
		return this.state.content.length > 0;
	}

	formatFilename(str) {
		return str.replace(/^\w+-/, '');
	}

	handleChange = event => {
		this.setState({
			[event.target.id]: event.target.value
		});
	}

	handleFileChange = event => {
		this.file = event.target.files[0];
	}

	handleSubmit = async event => {
		let attachment;
		event.preventDefault();

		if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
			alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
			return;
		}

		this.setState({ isLoading: true });

		try {
			if (this.file) {
				attachment = await s3Upload(this.file);
				await s3Remove(this.state.note.attachment);
			}

			await this.saveNote({
				content: this.state.content,
				attachment: attachment || this.state.note.attachment
			});
			this.props.history.push('/');
		} catch (e) {
			alert(e);
			this.setState({ isLoading: false });
		}
	}

	handleDelete = async event => {
		event.preventDefault();

		const confirmed = window.confirm(
			'Are you sure you want to delete this note?'
		);

		if (!confirmed) {
			return;
		}

		this.setState({ isDeleting: true });

		try {
			if (this.state.note.attachment)
				await s3Remove(this.state.note.attachment);
			await this.deleteNote();
			this.props.history.push('/');
		} catch (e) {
			alert(e);
			this.setState({ isDeleting: false });
		}
	}

	render() {
		const { content, note, attachmentURL, isLoading, isDeleting } = this.state;
		return (
			<div className="Notes">
				{note &&
					<form onSubmit={this.handleSubmit}>
						<FormGroup controlId="content">
							<FormControl
								onChange={this.handleChange}
								value={content}
								as="textarea"
							/>
						</FormGroup>
						{note.attachment &&
							<FormGroup>
								<FormLabel>Attachment</FormLabel>
								<p>
									<a
										target="_blank"
										rel="noopener noreferrer"
										href={attachmentURL}
									>
										{this.formatFilename(note.attachment)}
									</a>
								</p>
							</FormGroup>}
						<FormGroup controlId="file">
							{!note.attachment &&
								<FormLabel>Attachment</FormLabel>}
							<FormControl onChange={this.handleFileChange} type="file" />
						</FormGroup>
						<LoaderButton
							block
							variant="primary"
							bsSize="large"
							disabled={!this.validateForm()}
							type="submit"
							isLoading={isLoading}
							text="Save"
							loadingText="Saving..."
						/>
						<LoaderButton
							block
							variant="danger"
							bsSize="large"
							isLoading={isDeleting}
							onClick={this.handleDelete}
							text="Delete"
							loadingText="Deleting…"
						/>
					</form>}
			</div>
		);
	}
}