const OrderDetail = require("../../../models/OrderDetail"); // has cardID, quantity, totalprice
const Card = require("../../../models/Card"); //Get name, price and set id from here
const Order = require("../../../models/Order"); //Has totalPrice and orderDate

exports.GetEarning = async function (days) {
  const currentDate = new Date();
  const pastDay = new Date(currentDate - days * 24 * 60 * 60 * 1000);

  try {
    const orders = await Order.find({
      orderDate: { $gte: pastDay, $lte: currentDate },
    });

    const earningsByDay = {};

    // Initialize earningsByDay for all days within the range
    let currentDay = new Date(pastDay);
    while (currentDay <= currentDate) {
      const dateKey = currentDay.toISOString().split("T")[0];
      earningsByDay[dateKey] = 0;
      currentDay.setDate(currentDay.getDate() + 1);
    }

    // Update earningsByDay based on orders
    orders.forEach((order) => {
      const date = order.orderDate.toISOString().split("T")[0];
      const totalPrice = order.totalPrice;

      if (earningsByDay[date] !== undefined) {
        earningsByDay[date] += totalPrice;
      }
    });

    const resultArray = Object.keys(earningsByDay).map((date) => ({
      date: date,
      totalPrice: earningsByDay[date],
    }));

    return resultArray;
  } catch (error) {
    // Handle errors
    console.error("Error fetching orders:", error);
    throw error;
  }
};

exports.GetTotalEarning = async function (days) {
  const currentDate = new Date();
  const pastDay = new Date(currentDate - days * 24 * 60 * 60 * 1000);

  try {
    const orders = await Order.find({
      orderDate: { $gte: pastDay, $lte: currentDate },
    });

    let totalEarning = 0;

    // Calculate total earning based on orders
    orders.forEach((order) => {
      totalEarning += order.totalPrice;
    });

    return totalEarning;
  } catch (error) {
    // Handle errors
    console.error("Error fetching orders:", error);
    throw error;
  }
};

exports.GetTodayOrder = async function () {
  try {
    const currentDate = new Date();

    currentDate.setHours(0, 0, 0, 0);

    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const ordersToday = await Order.find({
      orderDate: { $gte: currentDate, $lte: endOfDay },
    });

    const ordersAmount = ordersToday.length;

    return ordersAmount;
  } catch (error) {
    // Handle errors
    console.error("Error fetching orders:", error);
    throw error;
  }
};

exports.GetTopRevenue = async function (days) {
  try {
    const top10Cards = await OrderDetail.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "id",
          as: "orderInfo",
        },
      },
      {
        $unwind: "$orderInfo",
      },

      {
        $match: {
          "orderInfo.orderDate": {
            $gte: new Date(new Date() - days * 24 * 60 * 60 * 1000),
          },
        },
      },

      {
        $group: {
          _id: "$cardId",
          totalRevenue: { $sum: "$totalPrice" },
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "cards",
          localField: "_id",
          foreignField: "id",
          as: "cardInfo",
        },
      },
      {
        $unwind: "$cardInfo",
      },
      {
        $project: {
          cardId: "$_id",
          cardName: "$cardInfo.name",
          setId: "$cardInfo.setId",
          Price: "$cardInfo.marketPrices",
          amount: "$totalQuantity",
          totalRevenue: "$totalRevenue",
        },
      },
    ]);
    return top10Cards;
  } catch (error) {
    // Handle errors
    console.error("Error fetching top 10 cards:", error);
    throw error;
  }
};

exports.GetTopSetRevenue = async function (days) {
  try {
    const currentDate = new Date();
    const pastDay = new Date(currentDate - days * 24 * 60 * 60 * 1000);

    const top4Sets = await OrderDetail.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "id",
          as: "orderInfo",
        },
      },
      {
        $unwind: "$orderInfo",
      },
      {
        $match: {
          "orderInfo.orderDate": { $gte: pastDay, $lte: currentDate },
        },
      },
      {
        $lookup: {
          from: "cards",
          localField: "cardId",
          foreignField: "id",
          as: "cardInfo",
        },
      },
      {
        $unwind: "$cardInfo",
      },
      {
        $group: {
          _id: "$cardInfo.setId",
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
      {
        $limit: 4,
      },
    ]);

    return top4Sets;
  } catch (error) {
    // Handle errors
    console.error(
      `Error fetching top 4 sets for the last ${days} days:`,
      error
    );
    throw error;
  }
};
