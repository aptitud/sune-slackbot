//import { request } from "http";
const https = require('https')

module.exports = tiny => {
  tiny.listen(/^netlify (.+)/i, (send, match) => {
    if(match[1].trim() === 'deploy') {
      const options = { 
        hostname: 'api.netlify.com',
        path: process.env.NETLIFY_HOOK,
        method: 'POST'
      };
      const req =  https.request(options, (res) => {
        send(`Deployar om aptitud.se. Varsågod (klart om några sekunder) `)
      });

      req.on('error', (e)  => {
        send(`Det där gick inte så bra... ${e}`);
      }); 
      req.end();
    }
    else {
      send(`[${match[1]}] vet jag inte vad jag ska göra med. Jag kan bara deploy`);
    } 
  })
}