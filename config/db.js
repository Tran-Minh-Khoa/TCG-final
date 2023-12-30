const Card = require('../models/Card');
const Set = require('../models/Set');
const User = require('../models/User');
const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const connect = require('./mongodbconect')
const createMockData = async () => {
  try {
    await connect();
    // Insert mock data for sets
    const setOne = new Set({ id: 'set1', name: 'Set One', series: 'Series A' });
    console.log(setOne);

    await setOne.save();
    // Insert mock data for cards
    const cardOne = await Card.create({
      id: 'card1',
      name: 'Card One',
      supertype: 'Super One',
      types: 'Type A',
      set_id: setOne.id,
      market_prices: 5.99,
      amount: 10,
    });

    // Insert mock data for users
    const userOne = await User.create({ id: 'user1', username: 'JohnDoe', role: 'customer' });

    // Insert mock data for orders
    const orderOne = await Order.create({ id: 'order1', user_id: userOne.id });

    // Insert mock data for order details
    await OrderDetail.create({ id: 'detail1', order_id: orderOne.id, card_id: cardOne.id, quantity: 3, total_price: 17.97 });

    console.log('Mock data created successfully');
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(); // Terminate the script
  }
};

createMockData();
