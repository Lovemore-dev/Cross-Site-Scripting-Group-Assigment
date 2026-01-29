const express = require("express");
const mongoose = require("mongoose");

// --- UNCOMMENT THESE THREE LINES TO ENABLE SECURITY LIBRARIES ---
// const helmet = require("helmet"); // Sets secure HTTP headers
// const createDomPurify = require("dompurify"); // Sanitizes HTML to prevent XSS
// const { JSDOM } = require("jsdom"); // Required for DOMPurify on the server
// -------------------------------------------------------------

const app = express();

// --- UNCOMMENT THE LINE BELOW TO ENABLE HEADER PROTECTION ---
// app.use(helmet()); // Protects against clickjacking and other header-based attacks

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// MongoDB (local)
mongoose
  .connect("mongodb://127.0.0.1:27017/karibu_insecure")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const ReviewSchema = new mongoose.Schema({
  productId: String,
  text: String,
});

const Review = mongoose.model("Review", ReviewSchema);

// STORED XSS VULNERABLE ENDPOINT
app.post("/api/reviews", async (req, res) => {
  const { productId, reviewText } = req.body;

  let finalContent = reviewText;

  // --- UNCOMMENT THE FOUR LINES BELOW TO ENABLE XSS PROTECTION ---
  // const window = new JSDOM("").window;
  // const DOMPurify = createDomPurify(window);
  // // This strips <script> tags before they are saved to the database
  // finalContent = DOMPurify.sanitize(reviewText); 

  await Review.create({
    productId,
    text: finalContent, // Now uses sanitized content if uncommented
  });

  res.json({ success: true });
});

// RETURNS CONTENT (Vulnerable if index.html uses .innerHTML)
app.get("/api/reviews/:productId", async (req, res) => {
  const reviews = await Review.find({ productId: req.params.productId });
  res.json(reviews);
});

// CSRF VULNERABLE ENDPOINT
app.post("/api/checkout", (req, res) => {
  
  // --- UNCOMMENT THE BLOCK BELOW TO ENABLE CSRF PROTECTION ---
  /*
  const origin = req.get('origin');
  if (origin !== 'http://localhost:3000') {
      // Rejects requests from malicious pages like your csrf.html
      return res.status(403).json({ error: "CSRF Blocked: Unauthorized Origin" });
  }
  */

  res.json({
    success: true,
    chargedAmount: req.body.totalPrice,
  });
});

app.listen(3000, () => {
  console.log("App running at http://localhost:3000");
});