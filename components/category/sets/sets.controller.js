const service = require("./sets.service");

exports.SetPage = async function (req, res, next) {
  const styles = [
    "/admin/vendor/datatables/dataTables.bootstrap4.min.css",
    "/adminExtra/styles/card-list.css",
  ];
  const scripts = [
    "/admin/js/datatables/table-card.js",
    "/admin/vendor/datatables/jquery.dataTables.min.js",
    "/admin/vendor/datatables/dataTables.bootstrap4.min.js",
    "/adminExtra/scripts/set-list.js",
  ];
  const sets = await service.GetAllSets();
  res.render("admin/set", {
    layout: "admin/layouts/layout",
    title: "Sets",
    scripts: scripts,
    styles: styles,
    sets: sets,
    currentUser: req.user,
  });
};

exports.SetEditPage = async function (req, res, next) {
  const id = req.params.id;

  const styles = [];
  const scripts = ["/adminExtra/scripts/set-edit-submit.js"];
  const set = await service.GetSet(id);
  res.render("admin/set-edit", {
    layout: "admin/layouts/layout",
    title: "Set Edit",
    scripts: scripts,
    styles: styles,
    set: set,
    currentUser: req.user,
  });
};

exports.SetAddPage = async function (req, res, next) {
  const styles = [];
  const scripts = ["/adminExtra/scripts/set-add-submit.js"];
  res.render("admin/set-add", {
    layout: "admin/layouts/layout",
    title: "Set Edit",
    scripts: scripts,
    styles: styles,
    currentUser: req.user,
  });
};

exports.UpdateSet = async function (req, res, next) {
  const updatedSet = req.body; // Assuming the updated set data is sent in the request body
  const { setId } = req.params;

  try {
    const editedSet = await service.UpdateSet(setId, updatedSet);
    res.status(200).json(editedSet);
  } catch (error) {
    console.error("Error in set edit API:", error);
    res.status(500).send(error.message);
  }
};

exports.CreateSet = async function (req, res, next) {
  const newSet = req.body; // Assuming the new set data is sent in the request body

  try {
    const createdSet = await service.CreateSet(newSet);
    return res.status(201).json(createdSet); // 201 Created status for successful creation
  } catch (error) {
    console.error("Error in set creation API:", error);
    if (error.message.includes("already exists")) {
      return res.status(400).send("Set with the provided ID already exists.");
    } else {
      return res.status(500).send(error.message);
    }
  }
};

exports.DisableSet = async (req, res, next) => {
  const { setId } = req.params;

  try {
    const updatedSet = await service.DisableSet(setId);
    res.status(200).json(updatedSet);
  } catch (error) {
    console.error("Error disabling set:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.EnableSet = async (req, res, next) => {
  const { setId } = req.params;

  try {
    const updatedSet = await service.EnableSet(setId);
    res.status(200).json(updatedSet);
  } catch (error) {
    console.error("Error enabling set:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.DeleteSet = async function (req, res, next) {
  const { setId } = req.params;

  try {
    const deletedSet = await service.DeleteSet(setId);

    if (!deletedSet) {
      return res.status(404).json({ message: "Set not found" });
    }

    res.status(200).json({ message: "Set deleted successfully", deletedSet });
  } catch (error) {
    console.error("Error in set deletion API:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
