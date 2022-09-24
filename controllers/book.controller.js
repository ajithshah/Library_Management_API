const Books = require("../model/book");

exports.allBooks = async (req, res) => {
  if (req.role === "user" || req.role === "librarian" || req.role === "admin") {
    try {
      const book = await Books.find();
      res.status(200).json(book);
    } catch (err) {
      res.status(500).send("Error " + err);
    }
  } else res.send("Access denied");
};

exports.getBook = async (req, res) => {
  if (req.role === "user" || req.role === "librarian" || req.role === "admin") {
    try {
      const book = await Books.findById(req.params.id);
      res.status(200).json(book);
    } catch (err) {
      res.status(500).send("Error " + err);
    }
  } else res.send("Access denied");
};

exports.categoryBooks = async (req, res) => {
  if (req.role === "user" || req.role === "librarian" || req.role === "admin") {
    try {
      const book = await Books.find({ category: req.query.category });
      res.status(200).json(book);
    } catch (err) {
      res.status(500).send("Error " + err);
    }
  } else res.send("Access denied");
};

exports.addBook = async (req, res) => {
  if (req.role === "librarian" || req.role === "admin") {
    const book = new Books(req.body);

    try {
      const b1 = await book.save();
      res.status(200).json(b1);
    } catch (err) {
      res.status(500).send("Error" + err);
    }
  } else res.send("Access denied");
};

exports.updateBook = async (req, res) => {
  if (req.role === "librarian" || req.role === "admin") {
    try {
      const book = await Books.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).json(book);
    } catch (err) {
      res.status(500).send("Error" + err);
    }
  } else res.send("Access denied");
};

exports.deleteBook = async (req, res) => {
  if (req.role === "librarian" || req.role === "admin") {
    try {
      const book = await Books.findById(req.params.id);
      const b1 = await book.remove();
      res.status(200).json(b1);
    } catch (err) {
      res.status(500).send("Error" + err);
    }
  } else res.send("Access denied");
};
