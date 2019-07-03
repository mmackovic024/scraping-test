const express = require('express');
const router = express.Router();
const scrapeTemps = require('../scraper/scrapeTemps');

/* GET temperatures data. */
router.get('/', (req, res, next) => {
  scrapeTemps().then(data => res.send(data));
});

module.exports = router;
