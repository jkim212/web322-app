/*********************************************************************************
 * WEB322 – Assignment 02I declare that this assignment is my own work in accordance with 
 * Seneca Academic Policy. No part * of this assignment hasbeen copied manually or electronically 
 * from any other source (including 3rd party web sites) or distributed to other students.
 * Name: Juhan Kim
 * Student ID: 126478221
 * Date: June 9, 2023
 * Cyclic Web App URL: _______________________________________________________
 * GitHub Repository URL: ______________________________________________________
 * ********************************************************************************/

const storeService = require('./store-service.js');
var express = require("express");
var app = express();
var path = require("path");
var HTTP_PORT = process.env.PORT || 8080;


function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));

app.get("/", function(req,res){
    res.redirect("/about");
});

app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.get("/shop", function(req,res){
    storeService.getAllItems()
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.json({ message: error });
    });
});

app.get("/items", function(req,res){
    storeService.getPublishedItems()
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.json({ message: error });
    });
});

app.get("/categories", function(req,res){
    storeService.getCategories()
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.json({ message: error });
    });
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
  });

storeService.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server is running on port ${HTTP_PORT}`);
    });
  })
  .catch(error => {
    console.error("Error initializing data:", error);
  });