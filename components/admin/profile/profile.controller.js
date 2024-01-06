const AccountService = require("../../user/account/account.service");

exports.ProfileEditPage = async function (req, res, next) {
  const styles = ["/adminExtra/styles/card-edit.css"];
  const scripts = [
    "/adminExtra/scripts/image-drop-single.js",
    "/adminExtra/scripts/profile-form-submit.js",
  ];
  console.log(req.user);
  const user = await AccountService.getUserProfile(req.user.id);
  res.render("admin/profile", {
    layout: "admin/layouts/layout",
    title: "Profile",
    scripts: scripts,
    styles: styles,
    user: user,
    currentUser: req.user,
  });
};

exports.UpdateProfile = async (req, res, next) => {
  try {
    if (req.file) {
      const file = req.file;
      // Sử dụng await để nhận URL trả về từ hàm uploadCard
      const imageUrl = await AccountService.uploadAvatar(file);
      const updateUser = await AccountService.updateProfile(req.body, imageUrl);
      req.user.name = updateUser.name;
      req.user.avatar = updateUser.avatar;
      // Trả về URL của tệp tin đã tải lên
      res.status(200).send(imageUrl);
    } else {
      const updateUser = await AccountService.updateProfile(req.body, null);
      req.user.name = updateUser.name;
      res.status(200).send(updateUser);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading file.");
  }
};
