---
name: daily-task-planner
description: Plan daily schedules and manage tasks using Notion. Handles task prioritization (Eisenhower Matrix), daily plan creation, and local caching for efficient API usage.
---

# Daily Task Planner

Manage tasks and create daily plans via Notion. Depends on the `notion` skill for API setup and authentication.

## Notion Databases

### Task Database

- **Database ID:** `<YOUR_TASK_DATABASE_ID>`

**Fields:**

| Field    | Type        | Description                          |
|----------|-------------|--------------------------------------|
| Name     | title       | Task name                            |
| Due Date | date        | Due date of the task                 |
| Status   | select      | `Not started`, `In progress`, `Done` |
| Priority | select      | `P0`, `P1`, `P2`, `P3`              |
| Domain   | select      | e.g. `Personal`, `Work`, `Side Project` |

**Priority (Eisenhower Matrix):**

- **P0** — Urgent & Important → Do first
- **P1** — Not Urgent & Important → Schedule
- **P2** — Urgent & Not Important → Delegate or do quickly
- **P3** — Not Urgent & Not Important → Eliminate or defer

### Daily Plan Database

- **Database ID:** `<YOUR_DAILY_PLAN_DATABASE_ID>`
- **Data Source ID:** `<YOUR_DATA_SOURCE_ID>`

**Fields:**

| Field | Type  | Description                                    |
|-------|-------|------------------------------------------------|
| Name  | title | Date label in `MMM DD, YYYY` format (e.g. `Mar 14, 2026`) |
| Date  | date  | The date of the plan                           |

**Page Content:** The plan body is written as blocks (paragraphs) inside the page. Each line contains a time and a description or task name:

```
08:00 Morning exercise
09:00 Check messages
10:00 Work on P0 tasks
```

## Data Fetching & Caching Strategy

Minimize Notion API calls by using local cache files in the workspace.

### Task Cache

- **Cache file:** `~/.picoclaw/workspace/tasks_cache.csv`
- **Columns:** Same fields as the Task database + `Cache At` (ISO 8601 timestamp)
- **TTL:** 1 hour — if the cache is older than 1 hour, re-fetch from Notion
- **Exclusion:** Do NOT cache tasks with Status = `Done`
- **Flow:**
  1. Check if `tasks_cache.csv` exists and `Cache At` is within 1 hour
  2. If valid → read tasks from local CSV
  3. If expired or missing → query the Task database from Notion, write to CSV with current timestamp, then use local data

### Daily Plan Read/Write

- **Draft file:** `~/.picoclaw/workspace/daily_plan_draft.md`
- **Flow:**
  1. **Read** the existing Daily Plan page for the target date from Notion (if any)
  2. **Write draft** locally in Markdown — compose and edit the plan in `daily_plan_draft.md`
  3. **Finalize:** When the plan is ready, create a new page in the Daily Plan database with the full content
  4. **Cleanup:** Archive (set to trash) the old Daily Plan page for the same date to avoid duplicates
  5. **Delete** the local draft file

This approach avoids multiple read/write roundtrips to the Notion API.

## User Routine

Use this context when generating or suggesting a daily plan. Customize the schedule below to match your own routine.

### Work Schedule

- **Work hours:** 09:00–18:00 (adjust to your schedule)
- **Wake up / Sleep:** set your own times
- During work hours → all domains allowed
- Outside work hours → Personal domain only

### Recurring Meetings

Add your own recurring meetings here:

| Time          | Meeting             | Days           |
|---------------|---------------------|----------------|
| 09:00 – 09:30 | Team standup        | Every weekday  |
| ...           | ...                 | ...            |

### Planning Guidelines

1. Always place recurring meetings first when generating a plan
2. Fill open slots with tasks sorted by Priority (P0 first → P3 last)
3. Respect domain rules: no work tasks outside work hours
4. Leave buffer time (~15 min) between meetings and deep work blocks
5. Group tasks by domain when possible to reduce context switching
6. Flag overdue tasks (Due Date < today, Status ≠ Done) at the top of the plan

## Common Workflows

### Show Today's Tasks

1. Load tasks from cache (or refresh if expired)
2. Filter: `Due Date` = today AND `Status` ≠ `Done`
3. Sort by Priority ascending (P0 → P3)
4. Display grouped by Domain

### Create Daily Plan

1. Determine the day of week (affects which meetings apply)
2. Load tasks from cache
3. Read existing Daily Plan page for today from Notion (if any)
4. Draft the plan locally in Markdown:
   - Start with recurring meetings for that day
   - Insert open tasks by priority into available slots
   - Add personal tasks outside work hours if applicable
5. Present draft to user for review
6. On confirmation → write to Notion, archive old page, delete draft

### Add a New Task

Create a page in the Task database with the provided fields:
- Name (required)
- Priority (default: `P1`)
- Status (default: `Not started`)
- Domain (default: `Personal`)
- Due Date (optional)

After creating, invalidate the local task cache.

### Complete a Task

1. Update the task's Status to `Done` in Notion
2. Remove it from the local cache file (done tasks are not cached)

### Show Overdue Tasks

1. Load tasks from cache
2. Filter: `Due Date` < today AND `Status` ≠ `Done`
3. Sort by Priority ascending, then by Due Date ascending
