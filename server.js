const express = require("express");
const app = express();
const fs = require("fs");
const joi = require("joi");
const sortObjectsArray = require("sort-objects-array");
app.use(express.urlencoded({ extended: true }));

// Loading initial data
let rawData = fs.readFileSync("data.json");
let data = JSON.parse(rawData);

// ROUTE Send all data of json object
app.get("/greatWebService/getEverything", (req, res) => {
  if (req.headers.orderkey && req.headers.ordermode) {
    res.json(
      sortObjectsArray(data, req.headers.orderkey, req.headers.ordermode)
    );
  } else res.json(data);
});

// ROUTE to return json object by value
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

  // Calling function and sending resultant object
  const obj = findObject(req.params.key);
  res.json(obj);
});

// ROUTE the get a json object by value
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

  // Calling function and sending resultant object
  const obj = findObject(req.params.value);
  res.json(obj);
});

//ROUTE Rendering the new.ejs to provide the json file to load
app.get("/greatWebService/new", (req, res) => {
  res.render("new.ejs");
});

// ROUTE to appende new objects from json file
app.post("/greatWebService/", (req, res) => {
  try {
    // Load the new file
    const rawData = fs.readFileSync(req.body.fileName);
    const newData = JSON.parse(rawData);

    // Define the schema for JSON file Array of objects
    let fileObject = joi.object({
      id: joi.number().required(),
      payload: joi.string().required(),
    });
    let fileArray = joi.array().items(fileObject);

    // Validate the structure of the file against the shema
    // If error found then throw an error
    let test = fileArray.validate(newData);
    if (test.error) {
      throw test.error;
    }

    // If file with empty array throw an error
    // Else load the objects in the app object and send status 200
    if (newData.length === 0) {
      throw "Empty Array";
    } else {
      for (let i = 0; i < newData.length; ++i) {
        data.push({ id: newData[i].id, payload: newData[i].payload });
      } // End For
      res.status(200).json({ status: "200", error: "Valid Input" });
    } // End if
  } catch (err) {
    res.status(404).json({ status: "404", error: err.message });
  } // End try
});

app.listen(3000, () => {
  console.log("server listening");
});
