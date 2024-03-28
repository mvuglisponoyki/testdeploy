const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// const URI = "mongodb://localhost:27017/Mybooks";
const URI =
  "mongodb+srv://bartmoran:izQDf7Q7BHORfjNN@cluster0.u9q3tab.mongodb.net/Mybooks";
mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB server");
    app.listen(port, () => {
      console.log("Server is running on port " + port);
    });
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB " + error);
  });

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  pages: { type: Number, required: true },
  fiction: { type: Boolean, required: true },
});

const Book = mongoose.model("Book", bookSchema);

const router = express.Router();

app.use("/api", router);

//Get '/'

router.route("/").get((req, res) => {
  Book.find()
    .then((books) => res.json(books))
    .catch((err) => res.status(404).json("Error Happened"));
  console.log("Check");
});

//Get '/:id'
router.route("/:id").get((req, res) => {
  Book.findById(req.params.id)
    .then((book) => res.json(book))
    .catch((err) => res.status(400).json("Error: " + err));
});

// POST '/add'
router.route("/add").post((req, res) => {
  const title = req.body.title;
  const author = req.body.author;
  const pages = req.body.pages;
  const fiction = req.body.fiction;

  //create a new object based on schema
  const newBook = new Book({
    title,
    author,
    pages,
    fiction,
  });

  newBook
    .save()
    .then(() => res.json("Book Added"))
    .catch((err) => res.status(400).json("error : " + err));
});
//PUT '/update/:id'

router.route("/update/:id").put((req, res) => {
  Book.findById(req.params.id).then((book) => {
    book.title = req.body.title;
    book.author = req.body.author;
    book.pages = req.body.pages;
    book.fiction = req.body.fiction;

    book.save().then(() => res.json("Book updated"));
  });
});

// DELETE '/delete'
router.route("/delete/:id").delete((req, res) => {
  Book.findByIdAndDelete(req.params.id)
    .then(() => res.json("Book Deleted"))
    .catch((err) => res.status(400).json("error : " + err));
});

router.route("/random").get((req, res) => {
  numOfCollections = Book.countDocuments(); //need to use asinc await
  var random = Math.floor(Math.random() * numOfCollections);

  Book.find().skip(random).limit(1);
});
