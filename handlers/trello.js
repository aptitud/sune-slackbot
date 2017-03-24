const Trello = require("node-trello")
const trelloApi = new Trello(process.env.TRELLO_APP_ID, process.env.TRELLO_APP_TOKEN)

const shorten = value => {
  const maxLength = 50
  const trimmedText = value.length > maxLength ? value.substring(0, maxLength) + "..." : value || "-"
  return trimmedText.replace('\\n', '').replace('\r', '')
}

module.exports = tiny => {
  tiny.listen(/trello(.*)/i, (send, match) => {
    trelloApi.get("/1/search", { query: match[1].trim() }, function(err, data) {
      send(`Hittade ${data.cards.length} kort som innehåller *${match[1]}*`)
      data.cards.map(card => {
    
        const formattedMessage = `
        *${shorten(card.name)}*
        ${shorten(card.desc)}
        ${card.shortUrl}
        `

        send(formattedMessage)
      })
    })
  })
}