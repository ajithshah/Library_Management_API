const IssueBooks = require("../model/issuebook");
const Books = require("../model/book");

exports.userBooks = (req, res) => {
  console.log(req.role);
  if (req.role === "user" || req.role === "librarian" || req.role === "admin") {
    res.status(200).json(res.paginatedResult);
  } else res.send("Access denied");
};

exports.page = function paginatedData(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;

    const results = {};

    try {
      results.result = await model
        .find({ user_id: req.member._id })
        .limit(limit)
        .skip(startIndex)
        .exec();
      res.paginatedResult = results;
      next();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
};

exports.bookcount = async (req, res) => {
  if (req.role === "user" || req.role === "librarian" || req.role === "admin") {
    const bookcount = await IssueBooks.find({
      book_id: req.params.id,
      status: "Pending",
    });

    const book = await Books.findById(req.params.id);

    let availablecount = Math.abs(bookcount.length - book.available_books);
    await Books.findByIdAndUpdate(req.params.id, {
      available_books: availablecount,
    });
    res.status(200).json({ available_books: availablecount });
  } else res.send("Access denied");
};
