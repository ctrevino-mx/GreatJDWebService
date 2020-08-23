const express = require("express");
const app = express();
const fs = require("fs");
app.use(express.urlencoded({ extended: true }));

let rawData = fs.readFileSync("data.json");
let data = JSON.parse(rawData);

app.get("/greatWebService/getEverything", (req, res) => {
  res.json(data);
});

app.get("/greatWebService/getByKey/:key", (req, res) => {
  function findObject(pkey) {
    //search array for key
    pdata = [];
    xpayload = [];
    for (let i = 0; i < data.length; ++i) {
      //if the key is what we are looking for push into array
      if (data[i].id === parseInt(pkey)) xpayload.push(data[i].payload);
    }
    pdata.push({ id: pkey, payload: xpayload });
    return pdata;
  } // End function
  // Calling function
  const obj = findObject(req.params.key);
  res.json(obj);
});

app.get("/greatWebService/getByValue/:value", (req, res) => {
  function findObject(pValue) {
    //search array for Value
    pdata = [];
    keys = [];
    for (let i = 0; i < data.length; ++i) {
      //if the key is what we are looking for push into array
      if (data[i].payload === pValue) keys.push(data[i].id);
    } // End For
    pdata.push({ payload: pValue, id: keys });
    return pdata;
  } // End function
  // Calling function
  const obj = findObject(req.params.value);
  res.json(obj);
});

//put this above your show.ejs file
app.get("/greatWebService/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/greatWebService/", (req, res) => {
  //   req.body.id = parseInt(req.body.id);
  //   data.push(req.body);
  //   res.send("data received");
  const rawData = fs.readFileSync(req.body.fileName);
  const newData = JSON.parse(rawData);
  for (let i = 0; i < newData.length; ++i) {
    data.push({ id: newData[i].id, payload: newData[i].payload });
  } // End For
  res.send("data received");
});

app.listen(3000, () => {
  console.log("server listening");
});
