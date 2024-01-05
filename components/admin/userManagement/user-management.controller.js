const service = require("./user-management.service");
const AccountService = require("../../user/account/account.service");

exports.UserManagementPage = async function (req, res, next) {
  const styles = [
    "/admin/vendor/datatables/dataTables.bootstrap4.min.css",
    "/adminExtra/styles/card-list.css",
  ];
  const scripts = [
    "/admin/js/datatables/table-card.js",
    "/admin/vendor/datatables/jquery.dataTables.min.js",
    "/admin/vendor/datatables/dataTables.bootstrap4.min.js",
    "/adminExtra/scripts/user-list.js",
  ];
  var users = await service.GetAllUsers();
  if (req.user) {
    const currentUser = await service.GetUser(req.user.id);
    users = users.filter((user) => user.id !== currentUser.id);
  }

  res.render("admin/user-list", {
    layout: "admin/layouts/layout",
    title: "User Management",
    scripts: scripts,
    styles: styles,
    users: users,
  });
};

exports.UserManagementEditPage = async function (req, res, next) {
  var id = req.params.id;
  const styles = ["/adminExtra/styles/card-edit.css"];
  const scripts = [
    "/adminExtra/scripts/image-drop-single.js",
    "/adminExtra/scripts/user-form-edit-submit.js",
  ];
  const user = await service.GetUser(id);
  console.log(user);
  res.render("admin/user-edit", {
    layout: "admin/layouts/layout",
    title: "User detail",
    scripts: scripts,
    styles: styles,
    user: user,
  });
};

exports.UpdateUser = async (req, res, next) => {
  var id = req.params.id;
  console.log(req.body);
  try {
    if (req.file) {
      const file = req.file;
      console.log(req.body);
      // Sử dụng await để nhận URL trả về từ hàm uploadCard
      const imageUrl = await AccountService.uploadAvatar(file);
      const updateCard = await service.UpdateUser(id, req.body, imageUrl);
      // Trả về URL của tệp tin đã tải lên
      console.log(updateCard);
      res.status(200).send(imageUrl);
    } else {
      const updateCard = await service.UpdateUser(id, req.body, null);
      res.status(200).send(updateCard);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading file.");
  }
};

exports.BanUser = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const updatedUser = await service.BanUser(userId);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error banning user:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.UnbanUser = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const updatedUser = await service.UnbanUser(userId);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error unbanning user:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.DeleteUser = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const deletedUser = await service.DeleteUser(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    console.error("Error in user deletion API:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
