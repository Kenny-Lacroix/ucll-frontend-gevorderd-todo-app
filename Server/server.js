// #region EXPRESS SETUP
// ---------------------------------------
const X = require("express");
const PATH = require("path");
const APP = X();
const PORT = 2021;

const todoItems = ["test"];

// ---------------------------------------
// #endregion

// #region EXPRESS CODE
// ---------------------------------------

/* ---ACTIVATE MIDDLEWARE--- */
APP.use("/todo", X.static(PATH.join(__dirname, "../Client/Public/Todo")));
APP.use(X.json());

/* ---ENDPOINTS--- */

/* ---START SERVER--- */
APP.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
});

// ---------------------------------------
// #endregion

// #region REGION DESCRIPTOR
// ---------------------------------------
// CODE
// ---------------------------------------
// #endregion
