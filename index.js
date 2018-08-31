const Discord = require('discord.js'); // Discord.JS para trabajar con discord
const request = require('request'); // Request facilita el trabajo con APIs

const client = new Discord.Client(); // Nuevo cliente de discord
const prefix = "!" // Prefix para los comandos.

// Información requerida para conectar y realizar consultas con la API de IBM.
let username = "INGRESAR_USERNAME_AQUÍ";
let password = "INGRESAR_PASSWORD_AQUÍ";
let url = "INGRESAR_LA_URL_DE_LA_API_AQUÍ";
let auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

// Conectar a discord.
// Discord.js nos abstrae de todo el proceso complicado y lo reduce a sólo requerir el token para conectarnos.
client.login('INGRESAR_TOKEN_AQUÍ');

// Cuando el bot logre conectarse, avisará en la consola.
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
}); 

// Una vez conectado, comenzará a recibir los mensajes, hasta que por alguna razón se desconecte.
client.on('message', message => {
  if (message.author.bot) return undefined; // Evitamos que reciba comandos desde otros bots.

  let msg = message.content.toLocaleLowerCase(); // Convierte los mensajes recibidos a letras minusculas.
  let args = message.content.slice(prefix.length).trim().split(' '); // Texto escrito después del comando (ejemplo: !comando argumento).
  let command = args.shift().toLocaleLowerCase(); // Convierte todos los argumentos a letras minusculas.

  // Nuestro único comando.
  if (command === 'habla') {

    let text = args.join(' '); // Espacio entre los argumentos.
    
    // Realizar la consulta a la API con la información obtenida previamente.
    request({
      url: url,
      method: "POST",
      headers: {
        "Authorization" : auth,
        "Content-Type" : 'application/json'
      },
      body: JSON.stringify({
        'input': {
          'text': text
        },
        'alternate_intents': false
      })
    }, function (error, response, body) {
      let json = JSON.parse(body); // Recibir la respuesta de la api en formato JSON.
      message.reply(json.output.text); // Enviar la respuesta de la api al chat de discord.
    })
  }
});