module.exports = tiny => {
  tiny.listen(/.*/i, (send, match) => {
    send(`Du sa ${match[0]}`)
  })
  tiny.listen(/tobias/i, send => {
    send('Jaaaaaaaaa')
  })
  tiny.speak(/team-customer-dev/i, send => {
    send('Tobias här!')
  })
}