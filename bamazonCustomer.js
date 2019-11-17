var mysql = require("mysql");
var inquirer = ("inquirer");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "egypt@2020",
    database: "bamazon_db",
    port: 3306
})

// connection.connect();
// var display = function() {
//     connection.query("SELECT * FROM products",function(err,res){
//         if (err) throw err;
//         console.log("")
//         console.log(" Welcome to Bamazon ")
//         console.log("")
//         console.log("Find your Product Below")
//         console.log("")
//     });

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    showproduct();

});

function showproduct() {
    connection.query("SELECT * FROM products", function (err, res) {
        console.table(res);
        promptProduct();
    })
}

function promptProduct() {
    inquirer.prompt([{
        name: "productID",
        type: "input",
        message: "\n##### Welcome to Bamazon ####\n Please choose a product ID you want to purchase?"
    },

    {
        name: "productQuantity",
        type: "input",
        message: "How many units of the product you would like to purchase?"

    }]).then(function (answer) {
        var product = answer.productID;
        var quantity = answer.productQuantity;
        console.log(product)
        var userCost;
        var updateQuantity;
        connection.query("SELECT * FROM products WHERE ?", { id: product }, function (err, res) {
            if (err) throw err;
            if (quantity > res[0].stock_quqntity) {
                console.log("Quantity exceeds whats in stock")
            } else {
                console.log(res)
                userCost = quantity * res[0].price;
                updateQuantity = res[0].stock_quqntity - quantity;
                console.log(`
                You have purchased ${quantity} of ${res[0].products_name}
                Your Total is ${userCost}`);
                connection.query("update products set ? where ?", [{ stock_quqntity: updateQuantity }, { id: product }], function (err, res) {
                    if (err) throw err;
                    console.log("Inventory updated.")
                })

            }
            connection.end();
        })
    });
};