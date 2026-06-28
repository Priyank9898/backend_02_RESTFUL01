import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/common/config/db.js";

const start = async () => {
  //* connect to database
  await connectDB();

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(
      `Server is running on port ${port} in ${process.env.NODE_ENV} mode`,
    );
  });
};

start().catch((err) => {
  console.log(err, "Failed to start the service");
  process.exit(1);
});
