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
  ];
  const products = await service.GetAllCards();
  res.render("admin/card", {
    layout: "admin/layouts/layout",
    title: "Cards",
    scripts: scripts,
    styles: styles,
    products: products,
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
  const sets = await setService.GetAllSets(id);
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
  });
};

exports.CardAddPage = function (req, res, next) {
  const styles = [];
  const scripts = ["/adminExtra/scripts/image-drop.js"];
  res.render("admin/card-add", {
    layout: "admin/layouts/layout",
    title: "Add",
    scripts: scripts,
    styles: styles,
  });
};

exports.CardUpload = async function (req, res, next) {
  try {
    if (req.file) {
      const file = req.file;
      console.log(req.body);
      // Sử dụng await để nhận URL trả về từ hàm uploadCard
      const imageUrl = await cardService.uploadCard(file);
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
      let fileIndex=0
      // Duyệt qua từng thuộc tính trong imgStatus để kiểm tra và xử lý tương ứng
      for (let i = 1; i <= Object.keys(imgStatus).length; i++) {
        const key = `image${i}`;
        console.log(`${key}: ${imgStatus[key]}`);

        if (imgStatus[key] === true) {
          const file = files[fileIndex++]; // Vị trí file tương ứng với key trong imgStatus
          const imageUrl = await cardService.uploadCard(file,req.body.id);
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
