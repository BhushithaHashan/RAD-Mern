import app from "./app.js";
import "dotenv/config";
import { connectMongo } from "./config/db/mongo.js";

const PORT = process.env.PORT || 3000;
console.log(process.env.JWT_SECRET)

await connectMongo();

app.listen(PORT, () => {
  console.log(`🚀 SwiftLink server running on port ${PORT}`);
});
