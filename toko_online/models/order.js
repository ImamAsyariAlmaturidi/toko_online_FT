"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init(
    {
      cart_items: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          isArrayOfObjects(value) {
            if (
              !Array.isArray(value) ||
              !value.every((item) => typeof item === "object")
            ) {
              throw new Error("cart_items must be an array of objects");
            }
          },
        },
      },
      total_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      customer_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isNumeric: true,
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      payment_status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["pending", "paid", "failed"]],
        },
      },
      midtrans_order_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
