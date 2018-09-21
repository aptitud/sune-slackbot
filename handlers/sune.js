

module.exports = tiny => {
  tiny.listen(/^sune (.+)/i, (send, match) => {
    const command = match[1].trim();
    if(command === 'hjälp') {
        send('Hej. \n Jag kan hjälpa dig med att leta i trello om du skriver `trello` och något du letar efter. Eller så kan jag deploya om apitud.se. \n ') 
    } else if (command === 'ls'){
       send('`trello [command]` söker i trello efter [command] \n `netlify deploy` : deployar om aptitud.se') 
    
    }else {
      send(`[${match[1]}] vet jag inte vad jag ska göra med. Jag kan bara deploy`);
    } 
  })
}