import { ToDo } from "./Modules/Todo.js";

// #region Functions
// ---------------------------------------
const createForm = () => {
  /* --- Show create new todo form --- */
  let formHtml = ` 
    <form>
      <label for="cardTitle">Title:</label><br />
      <input type="text" id="cardTitle" name="cardTitle"/><br />
      <label for="description">Description:</label><br />
      <input type="text" id="description" name="description"/><br />
      <label for="person">Person:</label><br />
      <input type="text" id="person" name="person"/><br />
      <label for="deadline">Deadline:</label><br />
      <input type="date" id="deadline" name="deadline" /><br />
    </form>
    <button id="submitBtn">Add item</button>
    `;
  document.querySelector("#todoExtra").innerHTML = formHtml;
  console.log("Showed Form");
};
const submitForm = () => {
  /* --- Add eventlistener and callback to creation --- */
  document.querySelector("#submitBtn").addEventListener("click", () => {
    let correctInput = true;
    let title, description, person, deadline;

    document.querySelector("#cardTitle").value ? (title = document.querySelector("#cardTitle").value) : (correctInput = false);
    document.querySelector("#description").value ? (description = document.querySelector("#description").value) : (correctInput = false);
    document.querySelector("#person").value ? (person = document.querySelector("#person").value) : (correctInput = false);
    document.querySelector("#deadline").value ? (deadline = document.querySelector("#deadline").value) : (correctInput = false);

    if (correctInput) {
      let todo = new ToDo(title, description, person, deadline);
      let res = todo.AddItem(todo);
      document.querySelector("#todoExtra").innerHTML = "";
      console.log("Item added");
    } else {
      alert("All fields must be filled in");
    }
  });
};

const addNewToDoListener = () => {
  document.querySelector("#addItemBtn").addEventListener("click", () => {
    console.log("Create todo clicked");
    createForm();
    submitForm();
  });
};

const getStartData = () => {};

const updateHtml = () => {};
const addEventListeners = () => {};

// ---------------------------------------
// #endregion

addNewToDoListener();
// getStartData();
