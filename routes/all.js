const express = require('express');
const router = express.Router();
const scrapeAll = require('../scraper/scrapeAll');

/* GET all data. */
router.get('/', (req, res, next) => {
  scrapeAll().then(data => res.send(data));
});

module.exports = router;
