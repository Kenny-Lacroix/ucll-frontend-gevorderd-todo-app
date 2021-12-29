import { ToDo } from "./Modules/Todo.js";

// #region Functions
// ---------------------------------------

/* --- Create New Item --- */
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
  console.log("Created Form");
};
const submitForm = () => {
  /* --- Add eventlistener and callback to creation --- */
  document.querySelector("#submitBtn").addEventListener("click", async () => {
    let correctInput = true;
    let title, description, person, deadline;

    /* --- Read and validate input (if else shorthand) --- */
    document.querySelector("#cardTitle").value ? (title = document.querySelector("#cardTitle").value) : (correctInput = false);
    document.querySelector("#description").value ? (description = document.querySelector("#description").value) : (correctInput = false);
    document.querySelector("#person").value ? (person = document.querySelector("#person").value) : (correctInput = false);
    document.querySelector("#deadline").value ? (deadline = document.querySelector("#deadline").value) : (correctInput = false);
    console.log("Read Data");

    /* --- Create ToDo and POST and Call loadData --- */
    if (correctInput) {
      console.log("Data validated");
      let todo = new ToDo(title, description, person, deadline);
      let res = await todo.AddItem(todo);
      if (res === "OK") {
        console.log("POST DATA Succesful");
        document.querySelector("#todoExtra").innerHTML = "";
        console.log("Hide Form");
        loadData();
      }
    } else {
      alert("All fields must be filled in!");
    }
  });
};

/* --- Main Functions --- */
const addNewToDoListener = () => {
  document.querySelector("#addItemBtn").addEventListener("click", () => {
    console.log("Create todo clicked");
    createForm();
    submitForm();
  });
};

const loadData = async () => {
  let res = await fetch("http://localhost:2021/todo/get");
  let data = await res.json();
  console.log("GET data: ", data);
  updateHtml(data);
  return data;
};

const updateHtml = (todoList) => {
  let htmlString = "";
  todoList.map((todo, i) => {
    htmlString += /*html */ `
      <div class="card">
        <h4 class="cardTitle">${todo._Title}</h4>
        <p class="cardPerson">${todo._AssignedPerson}</p>
        <p class="cardStatus">Status: ${todo._Status}</p>
        <p class="cardDate">Deadline: ${todo._Deadline}</p>
      </div>
    `;
  });
  document.querySelector("#todoList").innerHTML = htmlString;
  console.log("HTML Cards Created");
};

const addEventListeners = () => {};

// ---------------------------------------
// #endregion

loadData();
addNewToDoListener();
