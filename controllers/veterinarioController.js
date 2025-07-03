import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
    const { email, nombre } = req.body;

    // Prevenir usuarios duplicados (email)
    const existeUsuario = await Veterinario.findOne({ email });

    if (existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message });
    }

    try {
        // Guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();   // .save() guardar un objeto dentro de una base de datos

        // Enviar email
        emailRegistro({
            nombre, 
            email, 
            token: veterinarioGuardado.token
        });

        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);        
    }
};

const perfil = (req, res) => {
    const { veterinario } = req;
    res.json( veterinario );
};

const confirmar = async (req, res) => {
    const { token } = req.params;

    const ususarioConfirmar = await Veterinario.findOne({ token });

    if (!ususarioConfirmar) {
        const error = new Error('Token no válido');
        return res.status(404).json({ msg: error.message });
    }

    try {
        ususarioConfirmar.token = null;
        ususarioConfirmar.confirmado = true;
        await ususarioConfirmar.save();

        res.json({ msg: 'Usuario Confirmado Correctamente' });
    } catch (error) {
        console.log(error);
    }
};

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    // Comprobar si el ususario existe
    const usuario = await Veterinario.findOne({email});

    if (!usuario) {
        const error = new Error('El usuario no existe');
        return res.status(403).json({ msg: error.message });
    }

    // Comprobar si el ususario está confirmado
    if (!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({ msg: error.message });
    }

    // Revisar el password
    if (await usuario.comprobarPassword(password)) {
        // Autenticar ususario via JWT
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            telefono: usuario.telefono,
            web: usuario.web,
            token: generarJWT(usuario.id),
        });
    } else {
        const error = new Error('La contraseña es incorrecta');
        return res.status(403).json( {msg: error.message} );
    }
}

const olvidePassword = async (req, res) => {
    const { email } = req.body;
    
    const existeVeterinario = await Veterinario.findOne({ email });

    if(!existeVeterinario) {
        const error = new Error('El ususario no existe');
        return res.status(404).json( {msg: error.message} );
    }

    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();

        // Enviar email
        emailOlvidePassword({
            nombre: existeVeterinario.nombre,
            email,
            token: existeVeterinario.token
        });

        res.json({ msg: 'Hemos enviado un email con las instrucciones' });
    } catch (error) {
        console.log(error);
    }
};

const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const tokenValido = await Veterinario.findOne({token});

    if(!tokenValido) {
        const error = new Error('Token no válido');
        return res.status(400).json({msg: error.message});
    }

    res.json({ msg: 'Token válido y el usuario existe' });
};

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({ token });

    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({ msg: 'Password modificado correctamente' });
    } catch (error) {
        console.log(error);
    }
};

const actualizarPerfil = async (req, res) => {
    const { nombre, web, telefono, email } = req.body;
    const { id } = req.params;
    
    const veterinario = await Veterinario.findById(id);

    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json( {msg: error.message });
    }

    if (veterinario.email !== email) {
        const existeEmail = await Veterinario.findOne({email});

        if (existeEmail) {
            const error = new Error('Ese email ya está en uso');
            return res.status(400).json( {msg: error.message });
        }
    }

    try {
        veterinario.nombre = nombre;
        veterinario.email = email;
        veterinario.web = web;
        veterinario.telefono = telefono;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);
    } catch (error) {
        console.log(error);
    }
}

const actualizarPassword = async (req, res) => {
    // Leer Datos
    const { pwd_actual, pwd_nuevo } = req.body;
    const { id } = req.veterinario;

    // Comprobar que el veterinario exista
    const veterinario = await Veterinario.findById(id);

    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json( {msg: error.message });
    }

    // Comprobar password actual
    if (!(await veterinario.comprobarPassword(pwd_actual))) {
        const error = new Error('La contraseña actual es incorrecta');
        return res.status(400).json( {msg: error.message });
    } 

    // Almacenar nuevo password
    veterinario.password = pwd_nuevo;
    await veterinario.save();

    res.json({ msg: 'Contraseña Almacenada Correctamente'});
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword, 
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}