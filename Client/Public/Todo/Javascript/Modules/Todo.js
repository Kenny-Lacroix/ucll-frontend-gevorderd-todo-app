export class ToDo {
  constructor(title, description, assignedPerson, deadline) {
    this._Title = title;
    this._Description = description;
    this._AssignedPerson = assignedPerson;
    this._Deadline = deadline;
    this._Status = "Ongoing";
  }

  async AddItem(todo) {
    let obj = { data: todo };
    let res = await fetch("http://localhost:2021/todo/create", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    let responseMessage = await res.json();
    if (responseMessage.status === "OK") {
      return responseMessage.status;
    }
  }

  async EditItem() {}

  async DeleteItem() {}
}
