import express from "express";
import sql from "mssql";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  user: "vamshi",
  password: "sql@2017",
  server: "vamdata.database.windows.net", // Update the server name
  database: "test",
  options: {
    encrypt: true, // Enable encryption for Azure SQL
  },
};

const pool = new sql.ConnectionPool(dbConfig);

pool.connect().then(() => {
  console.log("Connected to MSSQL database.");
});

app.get("/", (req, res) => {
  res.json("hello");
});

app.get("/books", async (req, res) => {
  try {
    const request = pool.request();
    const result = await request.query("SELECT * FROM books");
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.post("/books", async (req, res) => {
  const { title, desc, price, cover } = req.body;
  try {
    const request = pool.request();
    const result = await request.query(
      "INSERT INTO books (title, desc, price, cover) VALUES (@title, @desc, @price, @cover)",
      {
        title,
        desc,
        price,
        cover,
      }
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});


app.delete("/books/:id", async (req, res) => {
  const bookId = req.params.id;
  try {
    const request = pool.request();
    const result = await request.query("DELETE FROM books WHERE id = @bookId", {
      bookId: { type: sql.Int, value: bookId },
    });

    console.log("Rows affected:", result.rowsAffected);

    if (result.rowsAffected[0] === 0) {
      console.log("Book not found:", bookId);
      return res.status(404).json({ message: "Book not found" });
    }

    console.log("Book deleted:", bookId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


app.put("/books/:id", async (req, res) => {
  const bookId = req.params.id;
  const { title, desc, price, cover } = req.body;
  try {
    const request = pool.request();
    const result = await request.query(
      "UPDATE books SET title = @title, desc = @desc, price = @price, cover = @cover WHERE id = @bookId",
      {
        bookId,
        title,
        desc,
        price,
        cover,
      }
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.listen(8800, () => {
  console.log("Connected to backend.");
});
