const cardService = require("./card.service");
const service = require("./card.service");
const subTypeService = require("../../category/subtypes/subtypes.service");
const typeService = require("../../category/types/types.service");
const rarityService = require("../../category/rarities/rarities.service");
const setService = require("../../category/sets/sets.service");

exports.CardPage = async function (req, res, next) {
  const styles = [
    "/admin/vendor/datatables/dataTables.bootstrap4.min.css",
    "/adminExtra/styles/card-list.css",
  ];
  const scripts = [
    "/admin/js/datatables/table-card.js",
    "/admin/vendor/datatables/jquery.dataTables.min.js",
    "/admin/vendor/datatables/dataTables.bootstrap4.min.js",
    "/adminExtra/scripts/card-list.js",
  ];
  const products = await service.GetAllCards();

  res.render("admin/card", {
    layout: "admin/layouts/layout",
    title: "Cards",
    scripts: scripts,
    styles: styles,
    products: products,
    currentUser: req.user,
  });
};

exports.CardEditPage = async function (req, res, next) {
  const id = req.params.id;

  const styles = ["/adminExtra/styles/card-edit.css"];
  const scripts = [
    "/adminExtra/scripts/image-drop.js",
    "/adminExtra/scripts/card-submit.js",
    "/adminExtra/scripts/card-form.js",
  ];
  const subtypes = await subTypeService.GetAllSubtypes();
  const types = await typeService.GetAllTypes();
  const rarities = await rarityService.GetAllRarities();
  const sets = await setService.GetAllSets();
  const card = await service.GetCard(id);
  res.render("admin/card-edit", {
    layout: "admin/layouts/layout",
    title: "Edit",
    scripts: scripts,
    styles: styles,
    card: card,
    subtypes: subtypes,
    types: types,
    sets: sets,
    rarities: rarities,
    currentUser: req.user,
  });
};

exports.CardAddPage = async function (req, res, next) {
  const styles = ["/adminExtra/styles/card-edit.css"];
  const scripts = [
    "/adminExtra/scripts/image-drop.js",
    "/adminExtra/scripts/card-add-submit.js",
    "/adminExtra/scripts/card-form.js",
  ];
  const subtypes = await subTypeService.GetAllSubtypes();
  const types = await typeService.GetAllTypes();
  const rarities = await rarityService.GetAllRarities();
  const sets = await setService.GetAllSets();
  res.render("admin/card-add", {
    layout: "admin/layouts/layout",
    title: "Add",
    scripts: scripts,
    styles: styles,
    subtypes: subtypes,
    types: types,
    sets: sets,
    rarities: rarities,
    currentUser: req.user,
  });
};

exports.CardUpload = async function (req, res, next) {
  try {
    if (req.file) {
      const file = req.file;
      // Sử dụng await để nhận URL trả về từ hàm uploadCard
      const imageUrl = await cardService.uploadCard(file, req.body.id);
      const updateCard = await cardService.updateCard(req.body, imageUrl);
      // Trả về URL của tệp tin đã tải lên
      console.log(updateCard);
      res.status(200).send(imageUrl);
    } else {
      const updateCard = await cardService.updateCard(req.body, null);
      res.status(200).send(updateCard);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading file.");
  }
};
exports.ListCardUpdate = async function (req, res, next) {
  console.log(req.body);
  try {
    if (req.files && req.files.length > 0) {
      const files = req.files;
      console.log(files);
      const listImageUrl = [];
      console.log(req.body.imgStatus);
      // Duyệt qua từng file để tải lên và lưu URL vào listImageUrl
      const imgStatus = JSON.parse(req.body.imgStatus); // Chuỗi JSON chuyển đoreq.body.imgStatus;
      let fileIndex = 0;
      // Duyệt qua từng thuộc tính trong imgStatus để kiểm tra và xử lý tương ứng
      for (let i = 1; i <= Object.keys(imgStatus).length; i++) {
        const key = `image${i}`;
        console.log(`${key}: ${imgStatus[key]}`);

        if (imgStatus[key] === true) {
          const file = files[fileIndex++]; // Vị trí file tương ứng với key trong imgStatus
          const imageUrl = await cardService.uploadCard(file, req.body.id);
          listImageUrl.push(imageUrl);
        } else {
          listImageUrl.push(null);
        }
      }
      // Ở đây, listImageUrl chứa các URL của các file đã được tải lên
      const updateCard = await cardService.updateListCard(
        req.body.id,
        listImageUrl
      );
      res.status(200).send("Files uploaded successfully");
    } else {
      res.status(400).send("No files uploaded");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading files.");
  }
};

exports.DisableCard = async (req, res, next) => {
  const { cardId } = req.params;

  try {
    const updatedCard = await service.DisableCard(cardId);
    res.status(200).json(updatedCard);
  } catch (error) {
    console.error("Error disabling card:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.EnableCard = async (req, res, next) => {
  const { cardId } = req.params;

  try {
    const updatedCard = await service.EnableCard(cardId);
    res.status(200).json(updatedCard);
  } catch (error) {
    console.error("Error enabling card:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.DeleteCard = async function (req, res, next) {
  const { cardId } = req.params;

  try {
    const deletedCard = await service.DeleteCard(cardId);

    if (!deletedCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json({ message: "Card deleted successfully", deletedCard });
  } catch (error) {
    console.error("Error in card deletion API:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.GetCard = async function (req, res, next) {
  const cardId = req.params.id;

  try {
    const card = await cardService.GetCard(cardId);

    if (card) {
      // If card is found, send it as JSON response
      res.status(200).json(card);
    } else {
      // If card is not found, send a 404 response
      res.status(404).json({ error: "Card not found" });
    }
  } catch (error) {
    console.error("Error in GetCard controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
