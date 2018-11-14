const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const SENDGRID_API_KEY = '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'

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(SENDGRID_API_KEY)

exports.firestoreEmail = functions.firestore
	.document('email/{emailId}')
	.onCreate((email) => {
		const to = email.data().to
		const subject = email.data().subject
		const message = email.data().message
		const link = email.data().link
		if (to) {
			return sendEmail(to, subject, message, link)
		} else {
			return 'No Email'
		}
})

function sendEmail(to, subject, message, link) {
	let msg = {
		to: to,
		from: 'share@partyregistry.co',
		subject: subject,
		templateId: '7fd2aed5-712d-49d0-b0bc-c7dfe807afcc',
		substitutionWrappers: ['{{', '}}'],
		substitutions: {
			message: message,
			link: link
		}	
	}
	return sgMail.send(msg).then((response) => {
		return console.log(response)
	}).catch((error) => {
		return console.log(error)
	})
}
