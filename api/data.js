const express = require('express');
const cors = require('cors');
const dataTable = require('../dataTable.json');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('hello world');
});

app.get('/api/data', (req, res) => {
  res.json(dataTable[0]);
});

app.post('/api/data', (req, res) => {
  const draw = parseInt(req.body.draw);
  const start = parseInt(req.body.start);
  const length = parseInt(req.body.length);
  const searchValue = req.body.search?.value?.toLowerCase() || '';
  const order = req.body.order;

  let filetredData;
  if (searchValue !== '') {
    filetredData = dataTable.filter(data => {
      return (
        (data.name && data.name.toLowerCase().includes(searchValue)) ||
        (data.language && data.language.toLowerCase().includes(searchValue)) ||
        (data.id && data.id.toLowerCase().includes(searchValue)) ||
        (data.bio && data.bio.toLowerCase().includes(searchValue)) ||
        data.version === searchValue
      );
    });
  } else {
    filetredData = dataTable;
  }

  if (order && filetredData.length > 0) {
    let sortByField = Object.keys(filetredData[0])[order[0].column];
    if (sortByField) {
      filetredData.sort((a, b) => {
        const fieldA = a[sortByField];
        const fieldB = b[sortByField];
        if (typeof fieldA === 'string' && typeof fieldB === 'string') {
          return fieldA.localeCompare(fieldB);
        } else {
          return fieldA - fieldB;
        }
      });
      if (order[0].dir === 'desc') {
        filetredData.reverse();
      }
    }
  }

  const pagedData = filetredData.slice(start, start + length);

  res.json({
    draw: draw,
    recordsTotal: dataTable.length,
    recordsFiltered: filetredData.length,
    data: pagedData,
  });
});

// Export as Vercel handler
module.exports = app;
module.exports.config = { api: { bodyParser: false } };