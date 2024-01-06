const AccountService = require('./account.service');

exports.AccountPage = async (req, res, next) => {
  try {
    const scripts = ["/scripts/account.js"];
  const styles = ["/styles/account.css"];

  const orders = await AccountService.getUserOrders(req.user.id)

  res.render("user/account-page", {
    layout: "user/layouts/layout",
    title: "Account",
    scripts: scripts,
    styles: styles,
    orders: orders
  });
  }
  catch(error) {
    console.log(error)
  }
};


exports.AddressPage = async (req, res, next) =>{
  const scripts = ["/scripts/addresses.js"];
  const styles = ["/styles/account.css"];
  const user= await AccountService.getUserProfile(req.user.id);  
  const addresses = await AccountService.getUserAddresses(req.user.id);
  console.log('aaaaaaaaa',user)
  res.render("user/address-page", {
    layout: "user/layouts/layout",
    title: "Profile",
    scripts: scripts,
    styles: styles,
    user: user,
    addresses: addresses
  });
};
exports.changePassword = async  (req, res, next)=> {
  try {
    const userId = req.user.id;
    const oldPassword = req.body.old_password;
    const newPassword = req.body.new_password;
    console.log(userId, oldPassword, newPassword);
    const result = await AccountService.changePassword(userId,oldPassword, newPassword);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: 'Error changing password: ' + error.message });
  }
}
exports.updateProfile = async (req, res, next) => {
  console.log(req.body);
  try {
    if (req.file) {
      const file = req.file;
      console.log(req.body);
      // Sử dụng await để nhận URL trả về từ hàm uploadCard
      const imageUrl = await AccountService.uploadAvatar(file,req.body.id);
      const updateCard = await AccountService.updateProfile(req.body, imageUrl);
      // Trả về URL của tệp tin đã tải lên
      console.log(updateCard);
      res.status(200).send(imageUrl);    
    }
    else {
      const updateCard = await AccountService.updateProfile(req.body,null);
      res.status(200).send(updateCard);
    }
   
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading file.");
  }
}

exports.getOrderDetail = async (req, res, next) => {
  const orderId = req.params.id

  const order_detail = await AccountService.getUserOrderDetail(orderId)

  res.status(200).json(order_detail)
}
exports.AddressUserAdd = async (req, res, next) => {
 try {
  const userId = req.user.id;
  const address = req.body;
  const result = await AccountService.addUserAddress(userId, address);
  return res.status(200).json(result);
 } catch (error) {
  return res.status(400).json({ message: 'Error changing password: ' + error.message });
 }
}
exports.AddressUserUpdate = async (req, res, next) => {
 try {
  const userId = req.user.id;
  const address = req.body;
  const result = await AccountService.updateUserAddress(userId, address);
  return res.status(200).json(result);
 } catch (error) {
  return res.status(400).json({ message: 'Error changing password: ' + error.message });
 }
}
exports.getAddressDetail = async (req, res, next) => {
  try {
    const userId = req.user.id
    const addressId = req.params.id

    const address_detail = await AccountService.getUserAddressDetail(userId, addressId)
  
    res.status(200).json(address_detail)
  } catch (error) {
   return res.status(400).json({ message: 'Error changing password: ' + error.message });
  }
 }