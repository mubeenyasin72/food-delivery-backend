import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { AdminRoute, VandorRoute } from "./routes";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//Routes
app.use("/api/v1/admin", AdminRoute);
app.use("/api/v1/vandor", VandorRoute);

app.listen(port, () => {
  console.clear()
  console.log(`Food Delivery Server is running on port ${port}`);
});