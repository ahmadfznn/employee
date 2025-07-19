require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 4000;

app.server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
