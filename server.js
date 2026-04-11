const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.get("/", (req, res) => {
  res.send("Blood Care Backend Running");
});
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/bloodcare")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Donor Schema
const donorSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    blood: String,
    state: String,
    city: String
});

const Donor = mongoose.model("Donor", donorSchema);

// Register Donor API
app.post("/api/donor", async (req, res) => {
    const donor = new Donor(req.body);
    await donor.save();
    res.json({ message: "Donor Registered Successfully" });
});

// Search Donor API
app.get("/api/donor/search", async (req, res) => {
    const { blood, state, city } = req.query;

    let filter = {};

    if (blood) filter.blood = blood;
    if (state) filter.state = state;
    if (city) filter.city = city;

    const donors = await Donor.find(filter);

    res.json(donors);
});

// Get All Donors
app.get("/api/donors", async (req, res) => {
    const donors = await Donor.find();
    res.json(donors);
});

app.listen(5000, () => console.log("Server running on port 5000"));
// Delete Donor API
app.delete("/api/donor/:id", async (req, res) => {
    try {
        const deletedDonor = await Donor.findByIdAndDelete(req.params.id);

        if (!deletedDonor) {
            return res.json({ message: "Donor not found" });
        }

        res.json({ message: "Donor deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});