const express = require('express');
const router = express.Router();
const scrapePrecip = require('../scraper/scrapePrecip');

/* GET precipitations data. */
router.get('/', (req, res, next) => {
  scrapePrecip().then(data => res.send(data));
});

module.exports = router;
