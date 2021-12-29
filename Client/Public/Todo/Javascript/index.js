import { ToDo } from "./Modules/Todo.js";

// #region Functions
// ---------------------------------------

/* --- Show Edit/Create Form --- */
const createForm = (existingItem) => {
  /* --- Show create/update new todo form --- */
  let formHtml = "";
  if (existingItem) {
    formHtml = /*html*/ ` 
    <form>
      <label for="cardTitle">Title:</label><br />
      <input type="text" id="cardTitle" name="cardTitle" value="${existingItem._Title}"/><br />
      <label for="description">Description:</label><br />
      <input type="text" id="description" name="description" value="${existingItem._Description}"/><br />
      <label for="person">Person:</label><br />
      <input type="text" id="person" name="person" value="${existingItem._AssignedPerson}"/><br />
      <label for="deadline">Deadline:</label><br />
      <input type="date" id="deadline" name="deadline" value="${existingItem._Deadline}"/><br />
    </form>
    <button id="submitBtn">Update</button>
    `;
  } else {
    formHtml = /*html*/ ` 
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
    <button id="submitBtn">Create</button>
    `;
  }

  document.querySelector("#todoExtra").innerHTML = formHtml;
  console.log("Created Form");
};
/* --- Handle form submit (Edit/Create) --- */
const submitForm = (type, id) => {
  /* --- Add eventlistener --- */
  document.querySelector("#submitBtn").addEventListener("click", async () => {
    let correctInput = true;
    let title, description, person, deadline;

    /* --- Read and validate input (if else shorthand) --- */
    document.querySelector("#cardTitle").value ? (title = document.querySelector("#cardTitle").value) : (correctInput = false);
    document.querySelector("#description").value ? (description = document.querySelector("#description").value) : (correctInput = false);
    document.querySelector("#person").value ? (person = document.querySelector("#person").value) : (correctInput = false);
    document.querySelector("#deadline").value ? (deadline = document.querySelector("#deadline").value) : (correctInput = false);
    console.log("Read Data");

    if (correctInput) {
      console.log("Data validated");
      let todo = new ToDo(title, description, person, deadline);

      switch (type) {
        case "post":
          let res = await todo.AddItem(todo);
          if (res === "OK") {
            console.log("POST DATA Succesful");
            document.querySelector("#todoExtra").innerHTML = "";
            console.log("Hide Form");
            loadData();
          }
          break;

        case "update":
          let result = await todo.EditItem(id, todo);
          if (result === "OK") {
            console.log(`UPDATE item ${id} Succesful`);
            loadData();
          }
          break;
      }
    } else {
      alert("All fields must be filled in!");
    }
  });
};
/* --- Delete ToDo --- */
const createTrashListener = async (todo, i) => {
  let res = await todo.DeleteItem(i);
  if (res === "OK") {
    console.log(`DELETE item ${i} Succesful`);
    loadData();
  }
};
/* --- Edit ToDo --- */
const createEditListener = async (todo, i) => {
  createForm(todo);
  submitForm("update", i);
};
/* --- Update ToDo Status --- */
const createStatusListener = async (todo, i) => {
  todo._Status === "Ongoing" ? (todo._Status = "Done") : (todo._Status = "Ongoing");
  let result = await todo.EditItem(i, todo);
  if (result === "OK") {
    console.log(`UPDATE item Status ${i} Succesful`);
    loadData();
  }
};
// ---------------------------------------
// #endregion

// #region Main Functions
// ---------------------------------------
const addNewToDoListener = () => {
  document.querySelector("#addItemBtn").addEventListener("click", () => {
    console.log("Create todo clicked");
    createForm();
    submitForm("post");
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
    let cssClass = "";
    todo._Status === "Ongoing" ? (cssClass = "bi bi-square") : (cssClass = "bi bi-check-square-fill");
    htmlString += /*html */ `
      <div class="card">
        <div>
          <h4 class="cardTitle">${todo._Title}</h4>
          <p class="cardPerson">${todo._AssignedPerson}</p>
          <p class="cardStatus">Status: ${todo._Status}</p>
          <p class="cardDate">Deadline: ${todo._Deadline}</p>
        </div>
        <div class="tools">
        <!--<i class="bi bi-check-square-fill"></i>-->
        <i id="status${i}" class="${cssClass}"></i>
        <i id="trash${i}" class="bi bi-trash-fill"></i>
        <i id="edit${i}" class="bi bi-wrench"></i>
        </div>
      </div>
    `;
  });
  document.querySelector("#todoList").innerHTML = htmlString;
  console.log("HTML Cards Created");
  addEventListeners(todoList);
};

const addEventListeners = (todoList) => {
  todoList.map((x, i) => {
    let todo = new ToDo(x._Title, x._Description, x._AssignedPerson, x._Deadline, x._Status);
    document.querySelector(`#trash${i}`).addEventListener("click", async () => {
      createTrashListener(todo, i);
    });
    document.querySelector(`#edit${i}`).addEventListener("click", async () => {
      createEditListener(todo, i);
    });
    document.querySelector(`#status${i}`).addEventListener("click", async () => {
      createStatusListener(todo, i);
    });
  });
};

// ---------------------------------------
// #endregion

loadData();
addNewToDoListener();
