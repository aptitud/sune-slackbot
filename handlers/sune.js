

module.exports = tiny => {
  tiny.listen(/^sune (.+)/i, (send, match) => {
    const command = match[1].trim();
    if(command === 'hjälp') {
        send('Hej. \n Jag kan hjälpa dig med att söka i trello om du skriver _trello_ följt av något du letar efter, t.ex. `trello uppdrag`. Eller så kan jag deploya om apitud.se, om du skriver `netlify deploy`. \n Om det inte räcker, -> https://github.com/aptitud/sune-slackbot ') 
    } else if (command === 'ls'){
       send('`trello [command]`\t: Söker i trello efter [command] \n `netlify deploy`\t\t: Deployar om aptitud.se') 
    
    }else {
      send(`[${match[1]}] vet jag inte vad jag ska göra med. Jag kan bara deploy`);
    } 
  })
}