import app from "./app.js";
import "dotenv/config";
const PORT = process.env.PORT || 3000;
console.log(process.env.JWT_SECRET)
app.listen(PORT, () => {
  console.log(`🚀 SwiftLink server running on port ${PORT}`);
});
