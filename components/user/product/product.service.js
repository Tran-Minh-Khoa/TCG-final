const Card = require("../../../models/Card");
exports.getProductsByFilter = async (
  filterString,
  page = 1,
  perPage = 24,
  sortString,
  priceString
) => {
  try {
    const filters = JSON.parse(filterString || "{}");
    // console.log(filters)
    const sortSelect = JSON.parse(
      sortString || '{"name":"Date, new to old","updateAt":-1}'
    );
    const price = JSON.parse(priceString || '{"min":0,"max":100}');
    // console.log(price)

    filters["marketPrices"] = {
      $gte: price.min,
      $lte: price.max,
    };
    filters["isActive"] = true;
    const { name: sortName, ...sortMethod } = sortSelect;
    const { min, max } = price;
    // console.log(sortSelect)
    const allFilteredProducts = await Card.find(filters).sort(sortMethod);
    // console.log(allFilteredProducts.length)
    const allCard = await Card.find();
    const skip = (page - 1) * perPage;
    const filteredProducts = allFilteredProducts.slice(skip, skip + perPage);
    // console.log(filteredProducts)
    // Tính số lượng thẻ bài theo từng loại "rarity"
    const rarityCounts = [];
    allCard.forEach((card) => {
      const rarity = card.rarity;
      const existingRarity = rarityCounts.find((item) => item.name === rarity);

      if (rarity) {
        if (!existingRarity) {
          if (filters?.rarity && filters.rarity.includes(rarity)) {
            rarityCounts.push({ name: rarity, count: 1, checked: true });
          } else {
            rarityCounts.push({ name: rarity, count: 1, checked: false });
          }
        } else {
          existingRarity.count++;
        }
      }
    });

    const totalProducts = allFilteredProducts.length;
    const totalPages = Math.ceil(totalProducts / perPage);
    // console.log(filteredProducts);
    // console.log(rarityCounts);
    // console.log(totalPages);
    return {
      products: filteredProducts,
      rarityCounts: rarityCounts,
      totalPages: totalPages,
      sortName: sortName,
      price: price,
    };
  } catch (error) {
    throw new Error(
      "Error fetching filtered products from database: " + error.message
    );
  }
};
exports.getProducts = async (
  filterString,
  page = 1,
  perPage = 24,
  sortString,
  priceString
) => {
  try {
    const filters = JSON.parse(filterString || "{}");
    for (const key in filters) {
      if (Array.isArray(filters[key])) {
        filters[key] = { $in: filters[key] };
      }
    }
    // console.log(filters)
    const sortSelect = JSON.parse(
      sortString || '{"name":"Date, new to old","updateAt":-1}'
    );
    const price = JSON.parse(priceString || '{"min":0,"max":100}');
    // console.log(price)

    filters["marketPrices"] = {
      $gte: price.min,
      $lte: price.max,
    };
    filters["isActive"] = true;

    const { name: sortName, ...sortMethod } = sortSelect;
    // console.log(filters)
    const allFilteredProducts = await Card.find(filters).sort(sortMethod);
    // console.log(allFilteredProducts.length)
    // console.log(page)
    const skip = (page - 1) * perPage;
    const filteredProducts = allFilteredProducts.slice(skip, skip + perPage);
    // console.log(filteredProducts)
    // Tính số lượng thẻ bài theo từng loại "rarity"
    // console.log(filteredProducts)

    const totalProducts = allFilteredProducts.length;
    const totalPages = Math.ceil(totalProducts / perPage);
    // console.log(allFilteredProducts)
    // console.log(filteredProducts);
    // console.log(rarityCounts);
    // console.log(totalPages);
    return {
      products: filteredProducts,
      totalPages: totalPages,
      sortName: sortName,
      price: price,
    };
  } catch (error) {
    throw new Error(
      "Error fetching filtered products from database: " + error.message
    );
  }
};

exports.getProductsByName = async (keyword) => {
  const foundProducts = await Card.find({
    name: { $regex: keyword, $options: "i" },
    isActive: true,
  }).limit(5);
  return foundProducts;
};
exports.getProductsDetail = async (id) => {
  const card = await Card.findOne({ id: id });
  const relatedCard = await Card.find({ subtypes: card.subtypes[0] }).limit(8);
  return {
    cardInfo: card,
    relatedCard: relatedCard,
  };
};
exports.postReview = async (id, review) => {
  try {
    const card = await Card.findOne({ id: id });
    console.log(card);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }
    // console.log(review)
    card.reviews.push(review);
    const updatedCard = await card.save();
    console.log("Updated card thanh cong");
    return updatedCard;
  } catch (error) {
    throw new Error(
      "Error fetching filtered products from database: " + error.message
    );
  }
};
exports.getReviews = async (id, page, perPage = 5) => {
  try {
    const card = await Card.findOne({ id: id });
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }
    const allReviews = card.reviews;
    const skip = (page - 1) * perPage;
    const filteredReviews = allReviews.slice(skip, skip + perPage);

    const totalReviews = allReviews.length;
    const totalPages = Math.ceil(totalReviews / perPage);

    return {
      reviews: filteredReviews,
      totalPages: totalPages,
    };
  } catch (error) {
    throw new Error(
      "Error fetching filtered products from database: " + error.message
    );
  }
};
exports.getFilterBar = async (filterString, priceString, category) => {
  const price = JSON.parse(priceString || '{"min":0,"max":100}');
  const filters = JSON.parse(filterString || "{}");
  const queryfilters = {};
  for (const key in filters) {
    if (Array.isArray(filters[key])) {
      queryfilters[key] = { $in: filters[key] };
    }
  }
  queryfilters["marketPrices"] = {
    $gte: price.min,
    $lte: price.max,
  };
  const allCard = await Card.find(queryfilters);
  const rarityCounts = [];
  allCard.forEach((card) => {
    let categoryValue = card[category]; // Giá trị của category trong card
    if (categoryValue) {
      if (Array.isArray(categoryValue)) {
        if (categoryValue.length == 1) {
          processRarityCounts(categoryValue[0]);
        } else {
          categoryValue.forEach((value) => {
            processRarityCounts(value);
          });
        }
      } else {
        processRarityCounts(categoryValue);
      }
    }
  });

  function processRarityCounts(categoryName) {
    const existingRarity = rarityCounts.find(
      (item) => item.name === categoryName
    );
    if (!existingRarity) {
      if (
        filters.hasOwnProperty(category) &&
        filters[category].includes(categoryName)
      ) {
        rarityCounts.push({ name: categoryName, count: 1, checked: true });
      } else {
        rarityCounts.push({ name: categoryName, count: 1, checked: false });
      }
    } else {
      existingRarity.count++;
    }
  }

  return rarityCounts;
};
