"use strict";

const { hashPassword } = require("../utils/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        fullname: "John Doe",
        email: "admin@gmail.com",
        password: await hashPassword("admin123"), // Replace with a hashed password
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullname: "Jane Smith",
        email: "admin1@gmail.com",
        password: await hashPassword("admin123"), // Replace with a hashed password
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullname: "Alice Johnson",
        email: "admin123@gmail.com",
        password: await hashPassword("admin123"), // Replace with a hashed password
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
