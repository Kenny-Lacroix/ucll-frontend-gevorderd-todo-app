// #region EXPRESS SETUP
// ---------------------------------------
const X = require("express");
const PATH = require("path");
const APP = X();
const PORT = 2021;

const todoItems = [];

// ---------------------------------------
// #endregion

// #region EXPRESS CODE
// ---------------------------------------

/* ---ACTIVATE MIDDLEWARE--- */
APP.use("/todo", X.static(PATH.join(__dirname, "../Client/Public/Todo")));
APP.use(X.json());

/* ---ENDPOINTS--- */
APP.get("/todo/get", (req, res) => {
  res.send(JSON.stringify(todoItems));
});

APP.post("/todo/create", (req, res) => {
  let response = {};
  try {
    const { data } = req.body;
    todoItems.push(data);
    response = { status: "OK" };
  } catch (error) {
    response = { status: "NOK" };
  }

  return res.send(JSON.stringify(response));
});

APP.put("/todo/update", (req, res) => {
  let response = {};
  try {
    todoItems[req.body.arrayId] = req.body.data;
    response = { status: "OK" };
  } catch (error) {
    response = { status: "NOK" };
  }
  return res.send(JSON.stringify(response));
});

APP.delete("/todo/delete", (req, res) => {
  let response = {};
  try {
    const { data } = req.body;
    todoItems.splice(data, 1);
    response = { status: "OK" };
  } catch (error) {
    response = { status: "NOK" };
  }
  return res.send(JSON.stringify(response));
});

/* ---START SERVER--- */
APP.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
});

// ---------------------------------------
// #endregion
