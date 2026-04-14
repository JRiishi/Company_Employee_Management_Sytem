# 📐 Task Dashboard - Component Architecture

## File Structure

```
frontend/src/
├── pages/
│   └── EmployeeDetails.jsx          ← Main page with tabs
│       ├── renders: Overview Tab
│       └── renders: Tasks Tab
│           └── <TaskDashboard />
│
├── components/
│   └── TaskDashboard/
│       ├── TaskDashboard.jsx         ← Main stats & table
│       │   Displays:
│       │   - Time filters
│       │   - 4 stat cards
│       │   - Progress bar
│       │   - Sort options
│       │   - Task table
│       │
│       └── TaskChart.jsx             ← Charts component
│           Displays:
│           - Bar chart (left)
│           - Pie chart (right)
│
└── services/
    └── api.js                        ← API calls
        GET /tasks/employee/{id}?filter=week|month|year
```

---

## Component Hierarchy

```
EmployeeDetails
│
├─ Tab NavBar
│  ├─ [Overview] (active)
│  └─ [Tasks]
│
└─ TabContent
   │
   ├─ Overview Tab Content (imperf section)
   │  ├─ Header + Status Badge
   │  ├─ Info Cards Grid
   │  ├─ Performance Stats
   │  ├─ Tasks Section (old)
   │  └─ Additional Info
   │
   └─ Tasks Tab Content (NEW)
      │
      └─ TaskDashboard
         │
         ├─ Header
         │  ├─ Title
         │  └─ Refresh Button
         │
         ├─ Filters
         │  ├─ [Week Button]
         │  ├─ [Month Button]
         │  └─ [Year Button]
         │
         ├─ Error Alert (if error)
         │
         ├─ Stat Cards Grid
         │  ├─ Total Card
         │  ├─ Completed Card
         │  ├─ Ongoing Card
         │  └─ Pending Card
         │
         ├─ Progress Bar
         │  └─ Animated fill based on percentage
         │
         ├─ TaskChart
         │  ├─ Bar Chart (left column)
         │  └─ Pie Chart (right column)
         │
         ├─ Sort Buttons
         │  ├─ [Sort by Date]
         │  └─ [Sort by Status]
         │
         └─ Task Table
            ├─ Table Header
            └─ Table Rows (animated)
                └─ Each Row:
                   ├─ Task Title
                   ├─ Status Badge
                   ├─ Created Date
                   ├─ Due Date
                   └─ Completed Date
```

---

## Data Flow Diagram

```
┌─────────────────┐
│  User clicks    │
│  employee row   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  EmployeeDetails page       │
│  loads employee details     │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  User clicks "Tasks" tab    │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  TaskDashboard mounts       │
│  triggers: useEffect()      │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  fetchTasks() called        │
│  (filter = "month" default) │
└────────┬────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  API: GET /tasks/employee/{empId}   │
│         ?filter=month               │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Backend Response:                   │
│  {                                   │
│    total: 6,                         │
│    completed: 2,                     │
│    pending: 2,                       │
│    ongoing: 2,                       │
│    completionRate: 33.3,             │
│    tasks: [...]                      │
│  }                                   │
└────────┬─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Update React State:        │
│  setStats(statsData)        │
│  setTasks(tasksArray)       │
└────────┬────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Re-render TaskDashboard with data   │
│  • Stat cards show numbers           │
│  • Progress bar animates to %        │
│  • Charts render with data           │
│  • Table rows populate               │
└──────────────────────────────────────┘
```

---

## User Interaction Flow

```
┌─────────────────────────────────────────┐
│         User Actions                    │
└──────────────┬──────────────────────────┘
               │
        ┌──────┼──────┐
        │      │      │
        ▼      ▼      ▼
    [Week] [Month] [Year]
        │      │      │
        └──────┼──────┘
               │
               ▼
    ┌─────────────────────────┐
    │  Filter Tasks by Date   │
    │  Refetch Data from API  │
    │  Update Chart/Table     │
    └─────────────────────────┘
               │
        ┌──────┼──────┐
        │      │      │
        ▼      ▼      ▼
   [Sort by] [Sort by] [Refresh]
    Date     Status
        │      │      │
        └──────┼──────┘
               │
               ▼
    ┌──────────────────────────┐
    │  Re-sort Task List       │
    │  Re-render Table         │
    └──────────────────────────┘
```

---

## State Management

```
TaskDashboard State:

┌──────────────────────────────────────┐
│  timeFilter: "month"                 │
│  (Changes: week, month, year)        │
└──────────────────────────────────────┘
                 │
                 ▼ Triggers fetchTasks()

┌──────────────────────────────────────┐
│  tasks: [                            │
│    { id, title, status, dates... },  │
│    ...                               │
│  ]                                   │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  stats: {                            │
│    total: 6,                         │
│    completed: 2,                     │
│    pending: 2,                       │
│    ongoing: 2,                       │
│    completionRate: 33.3              │
│  }                                   │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  loading: boolean                    │
│  (Show spinner when true)            │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  error: string                       │
│  (Show error alert if not empty)     │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  sortBy: "date" | "status"           │
│  (Sort task list on change)          │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  refreshing: boolean                 │
│  (Show spinner on refresh button)    │
└──────────────────────────────────────┘
```

---

## API Response Format

```json
{
  "success": true,
  "message": "Tasks retrieved",
  "data": {
    "total": 6,
    "completed": 2,
    "pending": 2,
    "ongoing": 2,
    "completionRate": 33.3,
    "tasks": [
      {
        "task_id": 1,
        "Title": "Complete Project Documentation",
        "status": "completed",
        "created_at": "2026-03-30",
        "due_date": "2026-04-04",
        "completed_at": "2026-04-06"
      },
      {
        "task_id": 2,
        "Title": "Code Review - Authentication Module",
        "status": "in_progress",
        "created_at": "2026-04-09",
        "due_date": "2026-04-17",
        "completed_at": null
      },
      {
        "task_id": 3,
        "Title": "API Integration with Payment Gateway",
        "status": "pending",
        "created_at": "2026-04-14",
        "due_date": "2026-04-21",
        "completed_at": null
      }
    ]
  }
}
```

---

## CSS Classes Used

### Cards & Containers

```
- border-{color}-200         ← Subtle border
- bg-{color}-50              ← Light background
- hover:shadow-lg            ← Hover effect
- rounded-lg                 ← Rounded corners
- transition-{property}      ← Smooth animation
```

### Status Badges

```
Completed:  bg-green-100 text-green-800
In Progress: bg-blue-100 text-blue-800
Pending:    bg-yellow-100 text-yellow-800
```

### Animations

```
- animate-spin               ← Spinner on load
- animate-fade-in            ← Fade entrance
- motion.div                 ← Framer Motion
- whileHover                 ← Hover animation
- whileTap                   ← Click animation
```

---

## Responsive Grid Breakpoints

```
Mobile (< 768px):
4 Cards → Layout as 1 column
Charts → Stack vertically
Table → Horizontal scroll

Tablet (768px - 1024px):
4 Cards → Layout as 2x2 grid
Charts → Side by side
Table → Visible with scroll

Desktop (> 1024px):
4 Cards → Layout as 1x4 grid
Charts → Full width side by side
Table → Full width visible
```

---

## Key Features Implementation

### Time Filtering

```javascript
// User clicks "Month" button
onClick={() => setTimeFilter("month")}

// Triggers useEffect
useEffect(() => {
  fetchTasks()
}, [timeFilter])

// API adds date range
const start_date = now - timedelta(days=30)
```

### Sorting

```javascript
// User clicks "Sort by Status"
onClick={() => setSortBy("status")}

// Re-sort tasks array
const sortedTasks = [...tasks].sort((a, b) => {
  const statusOrder = { completed: 3, in_progress: 2, pending: 1 }
  return (statusOrder[b.status] || 0) - (statusOrder[a.status] || 0)
})
```

### Stats Calculation

```javascript
// Backend calculates
stats = {
  total: tasks.length,
  completed: tasks.filter((t) => t.status === "completed").length,
  pending: tasks.filter((t) => t.status === "pending").length,
  ongoing: tasks.filter((t) => t.status === "in_progress").length,
  completionRate: (completed / total) * 100,
};
```

---

## Error Handling

```
Try to fetch tasks
├─ Success: Display data
├─ Network Error: Show "Failed to load tasks: [error]"
├─ Invalid Response: Show error message
├─ Database Down: Show mock data
└─ No tasks: Show "No tasks found for this period"

User can:
- Click Refresh button to retry
- Change time filter to reload
- View error details in alert box
```

---

## Performance Optimizations

1. **Memoization**: Tasks are sorted on every render but only when data changes
2. **Lazy Loading**: Charts only render if data exists
3. **Error Fallback**: Mock data prevents blank screens
4. **Efficient Filtering**: Backend filters before sending to frontend
5. **Debounced Refresh**: Prevents rapid API calls

---

## Accessibility Features

- ✅ Semantic HTML (nav, table, etc.)
- ✅ ARIA labels on buttons
- ✅ Color contrast for readability
- ✅ Keyboard navigation (tab through buttons)
- ✅ Focus states on interactive elements
- ✅ Loading state messages
- ✅ Error messages with context
