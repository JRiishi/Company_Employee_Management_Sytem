# HR System: Tasks Page Design System Guidelines

This document outlines the expanded atomic design guidelines and component extensions introduced to support the **highly interactive Task Page layout**. No visual breaks or new palettes were created—everything builds organically from the existing core infrastructure.

---

## 1. Table Extension (`/components/Table/Table.jsx`)
The universal table component has been scaled to support **action columns** and **sortable headers**.
* **Column Sorting UI**: Added optional `sortable: true` headers. When hovered, the header subtle illuminates (`hover:bg-gray-100/50`) and exposes tiny (12px) `lucide-react` sorting arrows gracefully bound to the `duration-200` smoothing engine. Clicking toggles standard desc/asc API callbacks.
* **Row Click Intervention**: The table now parses events. If an inline `button` (like a secondary ghost action button) is clicked inside a table cell, `onRowClick` logic natively intercepts and cancels to prevent routing clashes.
* **Row Actions**: Add an `{ accessor: 'actions' }` into the column array rendering `Button` components mapped to ghosts to execute quick edits without leaving the data view.

## 2. Dynamic Badge Extension (`/components/Badge/Badge.jsx`)
Strict task states natively parsed using standard CSS tailwind borders to assure consistency:
* **Completed**: `emerald-50 text-emerald-700 ring-emerald-600/20`
* **In Progress**: `blue-50 text-blue-700 ring-blue-600/20` (Leveraging primary token to create "active ownership" visibility vs passive warnings).
* **Pending/Block**: `gray-50 text-gray-600 ring-gray-900/10` (or `red` for blocked/danger states).
* *Rule*: ZERO transitions or scale animations on badges. They are immediate data anchors.

## 3. Button Component Structure (`/components/Button/Button.jsx`)
Extracted scattered `<button>` utilities into a strict universal renderer protecting corner radii (`rounded-lg`) and exact transition timings (`duration-200`).
* **Primary**: `bg-blue-600 hover:bg-blue-700 text-white shadow-sm`. Designed exclusively for "Create Task" or destructive saves.
* **Secondary**: `bg-white hover:bg-gray-50 text-gray-700 border-gray-200`. The default utility standard.
* **Ghost**: `transparent hover:bg-gray-100 text-gray-500`. Built precisely for floating table actions without compounding visual weight.
* *Parameters*: Locked explicitly to `px-4 py-2` and `text-[13px] font-medium` to perfectly align with Navbar inputs.

## 4. Filter Input Fields (`/components/Input/Input.jsx`)
Abstracted the Navbar search mechanics to a global standard input hook handling data dense sorting layouts without clutter:
* Minimal lightweight styling: `border-gray-200 text-[13px] placeholder-gray-400`.
* Focus mechanics exactly map the global theme: `focus:ring-blue-500/20 focus:border-blue-500`.
* Zero heavy drop shadows.

## 5. Interaction Laws
* **Hover Rules**: Max bounding changes limited to `-translate-y-[2px]` (Cards). No scale adjustments on icons.
* **Speed Limits**: Transitions strictly locked 150ms to 200ms depending on width impact.
* **Load Constraints**: Do not load massive full-screen spinners. Use `h-[420px]` (or matching vertical containers) coupled to `animate-pulse` `bg-gray-100`/`bg-gray-50` layered blocks mimicking table spaces 1-to-1 to stop layout jumping on `Promise.all` sweeps.
