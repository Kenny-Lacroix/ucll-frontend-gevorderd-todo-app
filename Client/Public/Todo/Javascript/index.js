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
      <textarea id="description" cols="21" rows="5"  name="description">${existingItem._Description}</textarea><br />
      <label for="person">Person:</label><br />
      <input type="text" id="person" name="person" value="${existingItem._AssignedPerson}"/><br />
      <label for="deadline">Deadline:</label><br />
      <input type="date" id="deadline" name="deadline" value="${existingItem._Deadline}"/><br />
    </form>
    <button id="submitBtn">Update</button>
    <button id="closeBtn">Cancel</button>
    `;
  } else {
    formHtml = /*html*/ ` 
    <form>
      <label for="cardTitle">Title:</label><br />
      <input type="text" id="cardTitle" name="cardTitle"/><br />
      <label for="description">Description:</label><br />
      <textarea  type="text" id="description" cols="21" rows="5"  name="description" ></textarea><br />
      <label for="person">Person:</label><br />
      <input type="text" id="person" name="person"/><br />
      <label for="deadline">Deadline:</label><br />
      <input type="date" id="deadline" name="deadline" /><br />
    </form>
    <button id="submitBtn">Create</button>
    <button id="closeBtn">Cancel</button>
    `;
  }

  document.querySelector("#todoExtra").innerHTML = formHtml;
  console.log("Created Form");
};
/* --- Handle form submit (Edit/Create) --- */
const submitForm = (type, id) => {
  /* --- Add eventlisteners --- */
  document.querySelector("#closeBtn").addEventListener("click", () => {
    document.querySelector("#todoExtra").innerHTML = "";
    console.log("Hide Form");
  });

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
            document.querySelector("#todoExtra").innerHTML = "";
            console.log("Hide Form");
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
/* --- Show Detail Modal --- */
const createDetailListener = (todo, todoList) => {
  let modalString = /* html */ `
    <div id="cardDetails" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <span id="closeModal" class="close">&times;</span>
          <h2>${todo._Title}</h2>
        </div>
      <div class="modal-body">
      <label>Description:</label>
      <p>${todo._Description}</p>
      <label>Person:</label>
      <p>${todo._AssignedPerson}</p>
      <label>Status:</label>
      <p>${todo._Status}</p>
      <label>Deadline:</label>
        <p>${todo._Deadline}</p>
      </div>
    </div>
  </div>
  `;
  document.querySelector("main").innerHTML += modalString;

  let modal = document.querySelector("#cardDetails");
  let closeBtn = document.querySelector("#closeModal");
  modal.style.display = "block";

  closeBtn.onclick = () => {
    modal.parentNode.removeChild(modal);
  };
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.parentNode.removeChild(modal);
    }
  };
  addEventListeners(todoList);
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
        <i id="status${i}" class="${cssClass}"></i>
        <i id="edit${i}" class="bi bi-wrench"></i>
        <i id="detail${i}"class="bi bi-search"></i>
        <i id="trash${i}" class="bi bi-trash-fill"></i>
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
    document.querySelector(`#detail${i}`).addEventListener("click", () => {
      createDetailListener(todo, todoList);
    });
  });
};

// ---------------------------------------
// #endregion

loadData();
addNewToDoListener();
