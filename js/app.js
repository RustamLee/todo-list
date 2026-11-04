// DOM elements
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-title");
const dueDateInput = document.getElementById("task-due-date");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("task-search");
const addTaskButton = taskForm.querySelector(".add-task-btn");
const filterButtons = document.querySelectorAll(".filter-btn");
const editDialog = document.getElementById("edit-dialog");
const editForm = document.getElementById("edit-form");
const editTaskTitle = document.getElementById("edit-task-title");
const editDueDate = document.getElementById("edit-due-date");
const cancelEditButton = document.getElementById("cancel-edit");
const deleteDialog = document.getElementById("delete-dialog");
const cancelDeleteButton = document.getElementById("cancel-delete");
const confirmDeleteButton = document.getElementById("confirm-delete");
const taskError = document.getElementById("task-error");

const MAX_TITLE_LENGTH = 100;
let limitHit = false;

let deletingTaskId = null;

let editingTaskId = null;

// Application state

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
function showTaskError(message, field, { blockSubmit = true } = {}) {
  taskError.textContent = message;
  field.setAttribute("aria-invalid", "true");
  addTaskButton.disabled = blockSubmit;
  field.focus();
}

function clearTaskError() {
  taskError.textContent = "";
  taskInput.removeAttribute("aria-invalid");
  dueDateInput.removeAttribute("aria-invalid");
  addTaskButton.disabled = false;
}

function showLimitError() {
  showTaskError(
    `Task name cannot exceed ${MAX_TITLE_LENGTH} characters.`,
    taskInput,
    { blockSubmit: false },
  );
}

let tasks = [];
let currentFilter = "all";
let searchQuery = "";

// Load tasks from localStorage
function loadTasks() {
  try {
    const savedTasks = localStorage.getItem("tasks");
    tasks = savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    console.error("Failed to load tasks:", error);
    tasks = [];
  }
}

const today = getTodayDate();

dueDateInput.min = today;
editDueDate.min = today;

// Save tasks to localStorage
function saveTasks() {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save tasks:", error);
  }
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "active" && !task.completed) ||
      (currentFilter === "completed" && task.completed);

    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  emptyState.hidden = filteredTasks.length > 0;

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.className = "task-checkbox";

    checkbox.addEventListener("change", function () {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const title = document.createElement("span");
    title.textContent = task.title;

    if (task.completed) {
      title.classList.add("task-item__title--completed");
    }

    li.appendChild(checkbox);
    li.appendChild(title);

    const dueDate = document.createElement("button");
    dueDate.type = "button";
    dueDate.className = "task-due-date";

    const dueDateLabel = document.createElement("span");
    const dueDateValue = document.createElement("span");

    if (task.dueDate) {
      dueDateLabel.textContent = "Due:";
      dueDateValue.textContent = task.dueDate;
    } else {
      dueDateLabel.textContent = "Due date";

      dueDateValue.innerHTML = `
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
    `;
    }

    dueDate.append(dueDateLabel, dueDateValue);

    dueDate.addEventListener("click", function () {
      editingTaskId = task.id;
      editTaskTitle.value = task.title;
      editDueDate.value = task.dueDate || "";
      editDialog.showModal();
    });

    const actions = document.createElement("div");
    actions.className = "task-item__actions";
    actions.appendChild(dueDate);

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "task-action-btn";
    editButton.addEventListener("click", function () {
      editingTaskId = task.id;

      editTaskTitle.value = task.title;
      editDueDate.value = task.dueDate || "";

      editDialog.showModal();
    });
    editButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="18" height="18" viewBox="0 0 24 24"
         fill="none" stroke="currentColor"
         stroke-width="1.7" stroke-linecap="round"
         stroke-linejoin="round">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/>
    </svg>
`;
    editButton.setAttribute("aria-label", "Edit task");

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "task-action-btn task-action-btn--delete";
    deleteButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="18" height="18" viewBox="0 0 24 24"
         fill="none" stroke="currentColor"
         stroke-width="1.7" stroke-linecap="round"
         stroke-linejoin="round">
        <path d="M3 6h18"/>
        <path d="M8 6V4h8v2"/>
        <path d="m19 6-1 14H6L5 6"/>
        <path d="M10 11v6"/>
        <path d="M14 11v6"/>
    </svg>
`;
    deleteButton.setAttribute("aria-label", "Delete task");

    deleteButton.addEventListener("click", function () {
      deletingTaskId = task.id;
      deleteDialog.showModal();
    });

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    li.appendChild(actions);

    taskList.appendChild(li);
  });
}

// Add a new task
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  clearTaskError();

  const title = taskInput.value.trim();

  if (title === "") {
    showTaskError("Please enter a task name.", taskInput);
    return;
  }

  if (title.length < 3) {
    showTaskError("Task name must contain at least 3 characters.", taskInput);
    return;
  }

  if (dueDateInput.value && dueDateInput.value < getTodayDate()) {
    showTaskError("Due date cannot be in the past.", dueDateInput);
    return;
  }

  const newTask = {
    id: crypto.randomUUID(),
    title: title,
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: dueDateInput.value || null,
  };

  tasks.unshift(newTask);

  saveTasks();
  renderTasks();

  taskForm.reset();
});

// Warn when the user tries to type or paste beyond the limit
taskInput.addEventListener("beforeinput", function (event) {
  limitHit = false;

  if (!event.inputType.startsWith("insert")) return;

  const selectedLength = taskInput.selectionEnd - taskInput.selectionStart;
  const incoming = event.data ?? event.dataTransfer?.getData("text") ?? "";
  const newLength = taskInput.value.length - selectedLength + incoming.length;

  if (newLength > MAX_TITLE_LENGTH) {
    limitHit = true;
    showLimitError();
  }
});

// Hide the error as soon as the user starts fixing it
taskInput.addEventListener("input", function () {
  const keepLimitError = limitHit;
  limitHit = false;

  clearTaskError();

  // A paste cut off by maxlength still fires "input",
  // so restore the message that clearTaskError just removed
  if (keepLimitError) {
    showLimitError();
  }
});

dueDateInput.addEventListener("input", clearTaskError);

// Save edited task
editForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const task = tasks.find((item) => item.id === editingTaskId);

  if (!task) return;

  const title = editTaskTitle.value.trim();

  if (title.length < 3) {
    editTaskTitle.setCustomValidity(
      "Task name must contain at least 3 characters.",
    );
    editTaskTitle.reportValidity();
    return;
  }

  editTaskTitle.setCustomValidity("");
  task.title = title;

  task.dueDate = editDueDate.value || null;

  saveTasks();
  renderTasks();

  editDialog.close();
  editingTaskId = null;
});

editTaskTitle.addEventListener("input", function () {
  editTaskTitle.setCustomValidity("");
  editTaskTitle.reportValidity();
});

// Cancel editing
cancelEditButton.addEventListener("click", function () {
  editDialog.close();
  editingTaskId = null;
});
editDialog.addEventListener("close", function () {
  editingTaskId = null;
});

// Cancel deletion
cancelDeleteButton.addEventListener("click", function () {
  deleteDialog.close();
  deletingTaskId = null;
});

// Confirm deletion
confirmDeleteButton.addEventListener("click", function () {
  tasks = tasks.filter((item) => item.id !== deletingTaskId);

  saveTasks();
  renderTasks();

  deleteDialog.close();
  deletingTaskId = null;
});

// Reset ID when dialog is closed with Esc
deleteDialog.addEventListener("close", function () {
  deletingTaskId = null;
});

// Close dialogs when clicking outside
editDialog.addEventListener("click", function (event) {
  if (event.target === editDialog) {
    editDialog.close();
  }
});

deleteDialog.addEventListener("click", function (event) {
  if (event.target === deleteDialog) {
    deleteDialog.close();
  }
});

// Initialize application
loadTasks();
renderTasks();
