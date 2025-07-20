"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Orders", [
      {
        cart_items: JSON.stringify([
          {
            product_id: 1,
            name: "Product A",
            description: "Description for Product A",
            quantity: 2,
            price: 50000,
          },
          {
            product_id: 2,
            name: "Product B",
            description: "Description for Product B",
            quantity: 1,
            price: 75000,
          },
        ]),
        total_price: 175000,
        customer_name: "John Doe",
        phone: "081234567890",
        address: "123 Example Street, Jakarta",
        payment_status: "paid",
        midtrans_order_id: "MIDTRANS12345",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        cart_items: JSON.stringify([
          {
            product_id: 3,
            name: "Product C",
            description: "Description for Product C",
            quantity: 3,
            price: 30000,
          },
          {
            product_id: 4,
            name: "Product D",
            description: "Description for Product D",
            quantity: 2,
            price: 45000,
          },
        ]),
        total_price: 210000,
        customer_name: "Jane Smith",
        phone: "081987654321",
        address: "456 Another Street, Bandung",
        payment_status: "pending",
        midtrans_order_id: "MIDTRANS67890",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Orders", null, {});
  },
};
