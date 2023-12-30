const AccountService = require('./account.service');

exports.AccountPage = function (req, res, next) {
  const scripts = [];
  const styles = ["/styles/account.css"];

  res.render("user/account-page", {
    layout: "user/layouts/layout",
    title: "Account",
    scripts: scripts,
    styles: styles,
  });
};


exports.AddressPage = async (req, res, next) =>{
  const scripts = ["/scripts/addresses.js"];
  const styles = ["/styles/account.css"];
  const user= await AccountService.getUserProfile(req.user.id);  
  console.log('aaaaaaaaa',user)
  res.render("user/address-page", {
    layout: "user/layouts/layout",
    title: "Addresses",
    scripts: scripts,
    styles: styles,
    user: user
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
      const imageUrl = await AccountService.uploadAvatar(file);
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