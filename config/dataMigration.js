const mongoose = require('mongoose');
const cardSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    supertype: { type: String, required: true },
    types: { type: String, required: true },
    set_id: { type: String, ref: 'Set' },
    ratity: { type: String, required: true },
    market_prices: { type: Number, required: true },
    amount: { type: Number, required: true, default: 10 },
  });

  const orderSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    user_id: { type: String, ref: 'User' },
    order_date: { type: Date, default: Date.now },
  });
  
  const orderDetailSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    order_id: { type: String, ref: 'Order' },
    card_id: { type: String, ref: 'Card' },
    quantity: { type: Number, required: true },
    total_price: { type: Number, required: true },
  });
  const setSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    series: { type: String, required: true },
  });

  const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    role: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  });

const Card = mongoose.model('Card', cardSchema);

const Order = mongoose.model('Order', orderSchema);
const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema);
const Set = mongoose.model('Set', setSchema);
const User = mongoose.model('User', userSchema);
const connect=async () => mongoose.connect('mongodb://localhost:27017/midterm', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))
const createMockData = async () => {
    try {
      await connect();
      // Insert mock data for sets
      const setOne = await Set.create({ id: 'set1', name: 'Set One', series: 'Series A' });
      
      // Insert mock data for cards
      const cardOne = await Card.create({
        id: 'card1',
        name: 'Card One',
        supertype: 'Super One',
        types: 'Type A',
        set_id: setOne.id,
        ratity: 'Rare',
        market_prices: 5.99,
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