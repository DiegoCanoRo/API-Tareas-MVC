'use strict';

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Usuario } = require('../models');
// Configurar Passport Google OAuth
module.exports = () => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackURL = process.env.GOOGLE_CALLBACK_URL;

  // Verificar que las variables de entorno necesarias estén definidas
  if (!clientID || !clientSecret || !callbackURL) {
    console.warn('Google OAuth no está totalmente configurado. Define GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET y GOOGLE_CALLBACK_URL en el .env.');
    return false;
  }

  // configurar la estrategia de Google OAuth con Passport
  passport.use(new GoogleStrategy({
    clientID,
    clientSecret,
    callbackURL,
    // solicitar acceso al perfil y correo electrónico del usuario
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(null, false, { message: 'No se encontró correo electrónico en el perfil de Google' });
      }

      // buscar o crear el usuario en la base de datos usando su email
      const [usuario, created] = await Usuario.findOrCreate({
        where: { email },
        defaults: {
          googleId: profile.id,
          nombre: profile.displayName,
          proveedor: 'google',
          avatar: profile.photos?.[0]?.value || null,
          activo: true,
        }
      });

      // si el usuario ya existía pero no tenía el googleId, actualizarlo para vincular la cuenta de Google
      if (!created && usuario.googleId !== profile.id) {
        usuario.googleId = profile.id;
        await usuario.save();
      }
      // pasar el usuario autenticado a Passport
      return done(null, usuario);
    } catch (error) {
      return done(error);
    }
  }));

  return true;
};
