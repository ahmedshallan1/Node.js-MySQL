var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table2");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "egypt@2020",
  database: "bamazon_db",
  port: 3306
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  managerChoices();
});

function managerChoices() {
  inquirer.prompt({
      name: "managerList",
      type: "list",
      message: "Do you want to view Products for sale, view low inventory, Add to Inventory, Add new Product",
      choices: ["View Products", "Low Inventory", "Add to Inventory", "Add New product"]
  }).then(function (answer) {
      switch (answer.managerList) {
          case "View Products":
              showproduct();
              break;
          case "Low Inventory":
              LowInventory();
              break;
          case "Add to Inventory":
              AddToInventory();
              break;
          case "Add New product":
              AddNewProduct();
              break;
      }
  })
}

function showproduct() {
  connection.query("SELECT * FROM products", function (err, res) {
      console.table(res);
      connection.end();
  })
}
function LowInventory() {
  connection.query("SELECT * FROM products WHERE stock_quqntity <= 10", function (err, res) {
      console.table(res);
      connection.end();
  })
}
function AddToInventory() {
  connection.query("SELECT * FROM products", function (err, res) {
      console.table(res);
      inquirer.prompt([{
          name: "productID",
          type: "input",
          message: "Please choose a product ID you want to update?"
      }, {
          name: "productQuantity",
          type: "input",
          message: "How many units of the product you would like to add to inventory?"
      }]).then(function (answer) {
          var product = answer.productID;
          var quantity = answer.productQuantity;
          var updateQuantity;
          connection.query("SELECT * FROM products WHERE ?", { id: product }, function (err, res) {
              if (err) throw err;
              updateQuantity = res[0].stock_quqntity + parseInt(quantity);

              connection.query("update products set ? where ?", [{ stock_quqntity: updateQuantity }, { id: product }], function (err, res) {
                  if (err) throw err;
                  console.log("Inventory updated.")
                  connection.end();
              })

          })
      })
  })



}
function AddNewProduct() {
  inquirer
      .prompt([
          {
              name: "item",
              type: "input",
              message: "What is the item you would like to add?"
          }, {
              name: "dep",
              type: "input",
              message: "Department of item?"
          }, {
              name: "price",
              type: "input",
              message: "Price of product?"
          }, {
              name: "stock",
              type: "input",
              message: "How many would you like to list?"
          }
      ]).then(function (answer) {
          var product = answer.item;
          var department = answer.dep;
          var price = answer.price;
          var stock = answer.stock
          connection.query(`INSERT INTO products(product_name, department_name, price, stock_quqntity) VALUES(?, ?, ?, ?)`, [product, department, price, stock], function (err, response) {
              if (err) throw err;
              console.log("Product Added to Shop!");
              connection.end();
          })
      })
}