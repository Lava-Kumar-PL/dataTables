const express = require("express");
const app = express();
const cors = require('cors');
const dataTable = require("./dataTable.json");
const results = require("./Results.json");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/helloworld', (req, res) => {
  res.send('hello world');
})
app.get("/api/data", (req, res) => {

  res.json(dataTable[0]);
});

app.post("/api/data", (req, res) => {

  const draw = parseInt(req.body.draw)
  const start = parseInt(req.body.start)
  const length = parseInt(req.body.length)
  const searchValue = req.body.search.value.toLowerCase();
  const order = req.body.order;


  let filetredData;
  if (searchValue !== '') {
    filetredData = dataTable.filter(data => {
      return data.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        data.language.toLowerCase().includes(searchValue.toLowerCase()) ||
        data.id.toLowerCase().includes(searchValue.toLowerCase()) ||
        data.bio.toLowerCase().includes(searchValue.toLowerCase()) ||
        data.version === searchValue
    });
  }
  else {
    filetredData = dataTable
  }



  if (order && filetredData.length > 0) {
    let sortByField = Object.keys(filetredData[0])[order[0].column]
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


  const pagedData = filetredData.slice(start, start + length)

  res.json({
    draw: draw,
    recordsTotal: dataTable.length,
    recordsFiltered: filetredData.length,
    data: pagedData
  });
});

app.post("/api/data2", (req, res) => {

  const draw = parseInt(req.body.draw)
  const start = parseInt(req.body.start)
  const length = parseInt(req.body.length)
  const searchValue = req.body.search.value.toLowerCase();
  const order = req.body.order;


  let filetredData;
  if (searchValue !== '') {
    filetredData = results.filter(data => {
      return (
        (data.LoginID && data.LoginID.toLowerCase().includes(searchValue)) ||
        (data.FirstName && data.FirstName.toLowerCase().includes(searchValue)) ||
        (data.LastName && data.LastName.toLowerCase().includes(searchValue)) ||
        (data.StartDate && data.StartDate.toLowerCase().includes(searchValue)) ||
        (data.Organization && data.Organization.toLowerCase().includes(searchValue)) ||
        (data.Location && data.Location.toLowerCase().includes(searchValue)) ||
        (data.Title && data.Title.toLowerCase().includes(searchValue)) ||
        (data.Email && data.Email.toLowerCase().includes(searchValue)) ||
        (data.IsActive && data.IsActive.toLowerCase().includes(searchValue)) ||
        (data.Phone && data.Phone.toLowerCase().includes(searchValue)) ||
        (data.EmployeeID && data.EmployeeID === searchValue)
      );  
    });
  }
  else {
    filetredData = results
  }



  if (order && filetredData.length > 0) {
    let sortByField = Object.keys(filetredData[0])[order[0].column]
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


  const pagedData = filetredData.slice(start, start + length)

  res.json({
    draw: draw,
    recordsTotal: results.length,
    recordsFiltered: filetredData.length,
    data: pagedData
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
