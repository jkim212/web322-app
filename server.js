/*********************************************************************************
 * WEB322 – Assignment 03
 * I declare that this assignment is my own work in accordance with 
 * Seneca Academic Policy. No part * of this assignment hasbeen copied manually or electronically 
 * from any other source (including 3rd party web sites) or distributed to other students.
 * Name: Juhan Kim
 * Student ID: 126478221
 * Date: July 5, 2023
 * Cyclic Web App URL: https://elegant-tick-onesies.cyclic.app
 * GitHub Repository URL: https://github.com/jkim212/web322-app
 * ********************************************************************************/

const storeService = require('./store-service.js');
var express = require("express");
var app = express();
var path = require("path");
var HTTP_PORT = process.env.PORT || 8080;

const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: 'drkjmjvrk',
  api_key: '847667969236513',
  api_secret: 'N6HJvk_PxH5bi6Us6jOlOFoCNyI',
  secure: true
});

const upload = multer();

app.post('/items/add', upload.single('featureImage'), (req, res) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }

    upload(req)
      .then((uploaded) => {
        processItem(uploaded.url);
      });
  } else {
    processItem("");
  }

  function processItem(imageUrl) {
    req.body.featureImage = imageUrl;
    const itemData = {
      title: req.body.title,
      price: parseFloat(req.body.price),
      body: req.body.body,
      category: parseInt(req.body.category),
      published: req.body.published === "on" ? true : false,
    };

    storeService.addItem(itemData)
      .then((addedItem) => {
        res.redirect('/items');
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

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
  const { category, minDate } = req.query;

  if (category) {
    storeService.getItemsByCategory(parseInt(category))
      .then(filteredItems => {
        res.json(filteredItems);
      })
      .catch(error => {
        res.json({ message: error });
      });
  } else if (minDate) {
    storeService.getItemsByMinDate(minDate)
      .then(filteredItems => {
        res.json(filteredItems);
      })
      .catch(error => {
        res.json({ message: error });
      });
  } else {
    storeService.getPublishedItems()
      .then(data => {
        res.json(data);
      })
      .catch(error => {
        res.json({ message: error });
      });
  }
});

app.get('/item/:id', (req, res) => {
  const itemId = parseInt(req.params.id);

  storeService.getItemById(itemId)
    .then(item => {
      res.json(item);
    })
    .catch(error => {
      res.status(404).json({ error: 'Item not found' });
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

app.get("/items/add", function(req,res){
  res.sendFile(path.join(__dirname,"/views/addItem.html"));
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