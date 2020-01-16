import nodemailer from 'nodemailer';
import template from './template';


export default async function(variables) {

	const translations = {
		'en-EN': {
			subject: "Reset password",
			msg: "Reset password",
			title: "It seems you forgot your password",
			p1: "If you're not at the origin of this e-mail, please ignore it.",
			p2: "If you forgot your password and you're not able to access to your account, click on the button below to reset your password, after that you will be able to login to your account with your new password.",
			byemsg: "See you soon on HyperTube !",
			button: "Reset Password",
			endmsg: "HYPERTUBE - Web streaming app, the best solution to watch any movie, anywhere at any moment.",
			footer: "Copyright © 2019 Made at 42 by mthiery, epieracc & amoynet"
		},
		'fr-FR': {
			subject: "Réinitialisation de mot de passe",
            msg: "Réinitialisation de votre mot de passe",
            title: "Il semble que vous avez oublié votre mot de passe",
            p1: "Si vous n'êtes pas à l'origine de cet e-mail, merci de l'ignorer",
            p2: "Si vous avez oublié votre mot de passe et que vous ne pouvez plus accéder à votre compte, cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe, après cela vous pourrez vous connecter à votre compte avec votre nouveau mot de passe.",
            byemsg: "À bientôt sur Hypertube !",
            button: "Réinitialisation",
            endmsg: "HYPERTUBE - Application web de streaming, la meilleure solution pour visionner tous vos films préférés, où et quand vous le souhaitez.",
            footer: "Copyright © 2019 Réalisé à 42 par mthiery, epieracc & amoynet"
		},
		'it-IT': {
			subject: "Reset password",
			msg: "Reset password",
			title: "Sembra che tu abbia dimenticato la password",
			p1: "Se non hai richiesto il reset della password ignora questa email.",
			p2: "Se hai dimenticato la password clicca il bottone qui per resettarla, dopo sarai in grado di accedere con la tua nuova password.",
			byemsg: "A presto su Hypertube !",
			button: "Reset Password",
			endmsg: "HYPERTUBE - Web streaming app, the best solution to watch any movie, anywhere at any moment.",
			footer: "Copyright © 2019 Made at 42 by mthiery, epieracc & amoynet"
		}
	}
	
	const templatex = template(translations[variables.language], variables.url);

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.SENDMAIL_USER,
			pass: process.env.SENDMAIL_PWD
		}
	});

	let info = await transporter.sendMail({
        from: '"Hypertube 👻" <support@hypertube.com>',
        to: variables.email,
        subject: translations[variables.language].msg,
		html: templatex
	});
	
	console.log('Message sent: %s', info.messageId);
	
	transporter.close();
}