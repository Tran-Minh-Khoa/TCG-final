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
  await Promise.all(users.map(formatAndReplaceOrderDate));
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
    currentUser: req.user,
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
    currentUser: req.user,
  });
};

exports.UpdateUser = async (req, res, next) => {
  var id = req.params.id;
  try {
    if (req.file) {
      const file = req.file;
      console.log(req.body);
      const imageUrl = await AccountService.uploadAvatar(file);
      const updateUser = await service.UpdateUser(id, req.body, imageUrl);
      //O lord have mercy for this hack
      if (updateUser.id == req.user.id) {
        req.user.name = updateUser.name;
        req.user.avatar = updateUser.avatar;
      }
      res.status(200).send(imageUrl);
    } else {
      const updateUser = await service.UpdateUser(id, req.body, null);
      if (updateUser.id == req.user.id) {
        req.user.name = updateUser.name;
      }
      res.status(200).send(updateUser);
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

async function formatAndReplaceOrderDate(order) {
  const date = new Date(order.created_at);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  // Replace the orderDate property with the formatted date
  order.formatedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
}
