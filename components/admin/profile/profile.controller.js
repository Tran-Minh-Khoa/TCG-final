const AccountService = require("../../user/account/account.service");

exports.ProfileEditPage = async function (req, res, next) {
  const styles = ["/adminExtra/styles/card-edit.css"];
  const scripts = [
    "/adminExtra/scripts/image-drop-single.js",
    "/adminExtra/scripts/profile-form-submit.js",
  ];
  const user = await AccountService.getUserProfile(req.user.id);
  console.log(user);
  res.render("admin/profile", {
    layout: "admin/layouts/layout",
    title: "Profile",
    scripts: scripts,
    styles: styles,
    user: user,
  });
};

exports.UpdateProfile = async (req, res, next) => {
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
    } else {
      const updateCard = await AccountService.updateProfile(req.body, null);
      res.status(200).send(updateCard);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading file.");
  }
};
