const fs = require("fs");

let items = [];
let categories = [];

function initialize() {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/items.json", "utf8", (err, data) => {
      if (err) {
        reject("Unable to read items file.");
        return;
      }

      try {
        items = JSON.parse(data);
      } catch (error) {
        reject("Unable to parse items file.");
        return;
      }

      fs.readFile("./data/categories.json", "utf8", (err, data) => {
        if (err) {
          reject("Unable to read categories file.");
          return;
        }

        try {
          categories = JSON.parse(data);
        } catch (error) {
          reject("Unable to parse categories file.");
          return;
        }

        resolve("Initialization completed successfully.");
      });
    });
  });
}

function getAllItems() {
  return new Promise((resolve, reject) => {
    if (items.length === 0) {
      reject("No items available.");
    } else {
      resolve(items);
    }
  });
}

function getPublishedItems() {
  return new Promise((resolve, reject) => {
    const publishedItems = items.filter(item => item.published);

    if (publishedItems.length === 0) {
      reject("No published items available.");
    } else {
      resolve(publishedItems);
    }
  });
}

function getCategories() {
  return new Promise((resolve, reject) => {
    if (categories.length === 0) {
      reject("No categories available.");
    } else {
      resolve(categories);
    }
  });
}

module.exports = {
  initialize,
  getAllItems,
  getPublishedItems,
  getCategories
};
