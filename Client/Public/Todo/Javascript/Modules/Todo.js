export class ToDo {
  constructor(title, description, assignedPeople, deadline) {
    this._Title = title;
    this._Description = description;
    this._AssignedPerson = assignedPerson;
    this._Deadline = deadline;
    this._status = "Ongoing";
  }

  async AddItem() {}

  async EditItem() {}

  async DeleteItem() {}
}
