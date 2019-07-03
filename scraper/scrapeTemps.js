const request = require('request-promise');
const cheerio = require('cheerio');

const thisYear = new Date().getFullYear();

async function scrapeTemps() {
  let data = [];
  for (let year = 2009; year <= thisYear; year++) {
    dateArr = [];
    for (
      let date = new Date(`1-1-${year}`);
      date <= new Date(`12-31-${year}`);
      date.setDate(date.getDate() + 1)
    ) {
      dateArr.push(date.toString());
    }
    dateArr.sort((a, b) => {
      if (new Date(a).getDate() > new Date(b).getDate()) return 1;
      if (new Date(a).getDate() < new Date(b).getDate()) return -1;
      if (new Date(a).getMonth() > new Date(b).getMonth()) return 1;
      if (new Date(a).getMonth() < new Date(b).getMonth()) return -1;
    });

    await request('http://www.sumeteo.info/wxtempdetail.php?year=' + year)
      .then(html => {
        const $ = cheerio.load(html);

        const T = $('#report')
          .find('th.labels')
          .parent()
          .nextAll()
          .slice(0, -7)
          .find('td:not(".reportdt")')
          .filter('td:not(".noday")');

        for (let i = 0; i <= dateArr.length - 1; i++) {
          data.push({
            date: dateArr[i],
            high: T[i * 2].children[0].data.trim(),
            low: T[i * 2 + 1].children[0].data.trim()
          });
        }
      })
      .catch(e => console.log(e));
  }

  console.log('Done scraping temperatures...');

  return data
    .filter(el => el.high !== '---' && el.low !== '---')
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

module.exports = scrapeTemps;
