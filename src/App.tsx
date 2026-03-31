import './App.css'

function App() {
  return (
    <main className="todo-landing">
      <header className="todo-header">
        <h1>Todo</h1>
        <p>Capture tasks, stay focused, and get more done.</p>
      </header>

      <section className="todo-cta">
        <div className="todo-input-placeholder">
          <span className="checkbox"></span>
          <span className="placeholder-text">Add a new task...</span>
        </div>
        <button className="primary-button">Get Started</button>
      </section>

      <section className="todo-preview">
        <h2>Today&apos;s tasks</h2>
        <ul>
          <li className="completed">
            <span className="checkbox checked"></span>
            <span>Review today&apos;s priorities</span>
          </li>
          <li>
            <span className="checkbox"></span>
            <span>Add your first real todo</span>
          </li>
          <li>
            <span className="checkbox"></span>
            <span>Organize tasks into categories</span>
          </li>
        </ul>
      </section>
    </main>
  )
}

export default App
