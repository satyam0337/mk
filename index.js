const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://test:test@cluster0.mlcnreq.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true });

const bmiSchema = new mongoose.Schema({
  email: { type: String, required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  bmi: { type: Number, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});


const BMIModel = mongoose.model("BMI", bmiSchema);


const calculateBMI = (weight, height) => {
  const bmi = (weight / (height * height)) * 703;
  let status = "";
  if (bmi < 18.5) {
    status = "Underweight";
  } else if (bmi >= 18.5 && bmi < 25) {
    status = "Normal weight";
  } else if (bmi >= 25 && bmi < 30) {
    status = "Overweight";
  } else {
    status = "Obesity";
  }
  return { bmi: bmi.toFixed(2), status };
};

app.post("/bmi", async (req, res) => {
  try {
    const { weight, height, email } = req.body;
    if (!weight || !height || !email) {
      return res.status(400).json({ message: "Weight, height, and email are required" });
    }
    const { bmi, status } = calculateBMI(weight, height);

    
    const bmiData = new BMIModel({
      weight,
      height,
      email,
      bmi,
      status,
    });
    await bmiData.save();

    res.status(200).json({ bmi: bmi, status: status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get("/bmi", async (req, res) => {
  try {
    const bmiData = await BMIModel.find();
    res.status(200).json(bmiData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


require("dotenv").config()


const cors = require("cors");
const connect = require("./config/db");

const userRouter = require("./routes/user/user.router");


const PORT = process.env.PORT || 8080;


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


app.use("/user", userRouter);

app.get("/", async (req, res) => {
    res.status(200).send("BASE PAGE");
});
  
app.listen(PORT, async () => {
  await connect();
  console.log("listen on 8080");
});
  


