const newPlacesRequest = require('../controllers/placesapicall')
const Type = require('../controllers/type.class')
module.exports = (app) => {
  // Places Lat Long get request
  app.put('/placesapi/placesRequest', async (req, res) => {
    const { props } = req.body
    const latAndLong = await newPlacesRequest.getLatLong(props)
    const type = new Type({ ...latAndLong, ...props })
    await type.run()
    res.json(type.results)
  })
}