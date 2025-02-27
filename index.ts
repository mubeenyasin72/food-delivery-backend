import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});


app.listen(port, () => {
  console.log(`Food Delivery Server is running on port ${port}`);
});