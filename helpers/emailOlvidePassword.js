import nodemailer from 'nodemailer';

const emailOlvidePassword = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { nombre, email, token } = datos;

    // Enviar email de confirmación
    const info = await transporter.sendMail({
        from: 'APV - Adiministrador de Pacientes de Veterinaria',
        to: email,
        subject: 'Recupera Password en APV',
        text: 'Recupera Password en APV',
        html: `
            <p>Hola ${nombre}, has solicitado reestablecer tu password.</p>
            <p>Sigue el siguiente enlace para generar un nuevo password:
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
            </p>

            <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
    });

    console.log("Mensaje enviado: %s", info.messageId);
}

export default emailOlvidePassword;