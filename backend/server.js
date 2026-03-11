const app= require("./src/app");
require("dotenv").config();

// const prisma= require("../backend/src/config/prisma")

const port= process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`servidor arriba en puerto ${port}`);
});