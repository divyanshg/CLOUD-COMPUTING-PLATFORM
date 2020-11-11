const express = require('express')
const app = express()
const port = 6001

app.get('/execute/:id/:projectID', async (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`ACTION EXECUTER LIVE ON ${port}`)
})