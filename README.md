# Task Tracker

A simple, responsive task management web application built with HTML, CSS, and Vanilla JavaScript.

The project is developed as a practical web development assignment, focusing on core functionality, clean UI, form validation, responsive design, and browser-based data persistence.

## Features

### Task Management
- Add, edit, and delete tasks
- Mark tasks as completed
- Optional due date for each task, editable at any time
- Overdue tasks are highlighted in red
- Delete confirmation dialog

### Filtering & Search
- Filter tasks: All / Active / Completed
- Live task counters on each filter button
- Case-insensitive search by title
- Search works together with the selected filter

### Validation
Native browser validation is disabled (`novalidate`) and replaced with custom inline error messages:
- Task name cannot be empty
- Task name must contain at least 3 characters (whitespace is trimmed)
- Task name cannot exceed 100 characters; typing or pasting beyond the limit shows a warning
- Due date cannot be in the past (when editing, this is checked only if the date was changed, so old tasks can still be renamed)
- Invalid fields are highlighted and the submit button is disabled until the user fixes the input
- The same rules apply to the create form and the edit dialog

### Data Persistence
- Tasks are saved automatically to LocalStorage
- Tasks are restored when the application is reopened

### Responsive Design & Accessibility
- Desktop, tablet, and mobile layouts (tested down to 320px)
- Sticky header
- Semantic HTML, ARIA attributes for errors and dialogs, visible focus states
- Keyboard-friendly controls

## Tech Stack

- HTML5
- CSS3 (Flexbox, custom properties, media queries)
- Vanilla JavaScript (ES6+)
- Browser LocalStorage
- Git & GitHub

## Project Structure

```
todo-list/
│
├── index.html
├── README.md
│
├── css/
│   └── style.css
│
└── js/
    └── app.js
```

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/RustamLee/todo-list
   ```

2. Open the project folder.
3. Run `index.html` using Live Server or open it directly in your browser.

No additional dependencies or build tools are required.

## Limitations

- Tasks are stored locally in the browser using LocalStorage
- Data is not synchronized between devices or browsers
- Clearing browser storage removes all saved tasks
- No user authentication, backend, or remote database
- Deleted tasks cannot be restored
- Tasks are not sorted: new tasks always appear at the top
- Dates are displayed in `YYYY-MM-DD` format
- No automated tests

## Future Improvements

- Sorting by due date and creation date
- "Clear completed" action with confirmation or undo
- Localized date format
- Task categories, priorities, and reminders
- Drag and drop reordering
- Dark theme
- Export and import of tasks
- Unit tests for core logic
- Backend integration, user authentication, and cloud synchronization

## License

This project is developed for educational and portfolio purposes.