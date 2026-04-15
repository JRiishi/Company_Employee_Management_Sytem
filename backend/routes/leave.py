from fastapi import APIRouter, HTTPException, Depends, Query
from datetime import datetime, timedelta
import random
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

LEAVE_TYPES = ["Sick Leave", "Casual Leave", "Vacation Leave", "Paid Time Off (PTO)"]

@router.get("/employee/{emp_id}")
def get_employee_leaves(emp_id: int, filter: str = Query("month", regex="^(week|month|year)$")):
    """
    Get all leave records for a specific employee with time-based filtering.

    Query params:
    - filter: week, month, or year (default: month)
    """

    # Calculate date range based on filter
    now = datetime.now()
    if filter == "week":
        start_date = now - timedelta(days=7)
    elif filter == "month":
        start_date = now - timedelta(days=30)
    elif filter == "year":
        start_date = now - timedelta(days=365)
    else:
        start_date = now - timedelta(days=30)

    # Generate employee-specific leave data
    def get_mock_leaves():
        random.seed(emp_id * 54321)  # Multiply by larger number for more variance

        # Reason templates per leave type
        leave_reasons = {
            "Sick Leave": [
                "Medical appointment",
                "Health recovery",
                "Illness",
                "Doctor visit",
                "Medical emergency",
                "Health check-up",
                "Fever and flu"
            ],
            "Casual Leave": [
                "Personal reasons",
                "Family time",
                "Personal work",
                "Rest and relax",
                "Personal errands",
                "Day off",
                "Personal commitment"
            ],
            "Vacation Leave": [
                "Vacation",
                "Travel",
                "Holiday trip",
                "Family vacation",
                "Rest and recovery",
                "Holiday break",
                "Trip planning"
            ],
            "Paid Time Off (PTO)": [
                "Personal time",
                "Personal matters",
                "Time off",
                "Rest day",
                "Personal time off",
                "Flexible time",
                "Work-life balance"
            ]
        }

        all_leaves = []

        # Generate 20-25 leave records across the year for more diversity
        for i in range(25):
            leave_type = LEAVE_TYPES[i % len(LEAVE_TYPES)]

            # Distribute leaves across various time periods with more variance
            if i < 3:  # Week leaves
                days_ago = random.randint(0, 7)
            elif i < 12:  # Month leaves
                days_ago = random.randint(8, 30)
            else:  # Year leaves
                days_ago = random.randint(31, 365)

            start = now - timedelta(days=days_ago)
            duration = random.randint(1, 5)  # Leave duration 1-5 days
            end = start + timedelta(days=duration - 1)

            # Select reason based on leave type
            reason = random.choice(leave_reasons.get(leave_type, ["Personal reason"]))

            leave_record = {
                "leave_id": emp_id * 1000 + i + 1,
                "employee_id": emp_id,
                "leave_type": leave_type,
                "start_date": start.strftime("%Y-%m-%d"),
                "end_date": end.strftime("%Y-%m-%d"),
                "duration": duration,
                "status": random.choice(["Approved", "Pending", "Rejected"]) if days_ago < 30 else "Approved",
                "reason": reason
            }
            all_leaves.append(leave_record)

        # Filter leaves based on date range
        filtered_leaves = []
        for leave in all_leaves:
            leave_start = datetime.strptime(leave["start_date"], "%Y-%m-%d")
            if leave_start >= start_date:
                filtered_leaves.append(leave)

        return filtered_leaves if filtered_leaves else all_leaves[:3]

    def calculate_stats(leaves):
        total_days = sum([leave["duration"] for leave in leaves])
        leave_counts = {}
        for leave_type in LEAVE_TYPES:
            count = len([l for l in leaves if l["leave_type"] == leave_type])
            leave_counts[leave_type] = count

        approved = len([l for l in leaves if l["status"] == "Approved"])
        pending = len([l for l in leaves if l["status"] == "Pending"])
        rejected = len([l for l in leaves if l["status"] == "Rejected"])

        return {
            "total_leaves": len(leaves),
            "total_days": total_days,
            "leave_breakdown": leave_counts,
            "status_breakdown": {
                "approved": approved,
                "pending": pending,
                "rejected": rejected
            }
        }

    try:
        mock_leaves = get_mock_leaves()
        stats = calculate_stats(mock_leaves)

        return {
            "success": True,
            "message": "Leave records retrieved",
            "data": {
                **stats,
                "leaves": mock_leaves,
            }
        }
    except Exception as e:
        logger.error(f"Error fetching leaves: {e}")
        return {
            "success": False,
            "message": f"Error fetching leave records: {e}",
            "data": {}
        }


@router.get("/summary")
def get_all_employees_leave_summary(filter: str = Query("month", regex="^(week|month|year)$")):
    """
    Get leave summary for all employees.
    Returns leave data for employees 1-10.
    """

    now = datetime.now()
    if filter == "week":
        start_date = now - timedelta(days=7)
    elif filter == "month":
        start_date = now - timedelta(days=30)
    elif filter == "year":
        start_date = now - timedelta(days=365)
    else:
        start_date = now - timedelta(days=30)

    employees_summary = []

    # Generate data for 10 employees
    for emp_id in range(1, 11):
        random.seed(emp_id)

        # Generate employee name
        first_names = ["Rajesh", "Priya", "Arjun", "Sneha", "Vikram", "Ananya", "Rohan", "Divya", "Amit", "Neha"]
        last_names = ["Kumar", "Singh", "Patel", "Sharma", "Verma", "Gupta", "Reddy", "Rao", "Kulkarni", "Nair"]

        emp_name = f"{first_names[emp_id - 1]} {last_names[emp_id - 1]}"

        # Generate role based on emp_id
        roles = ["Software Engineer", "Product Manager", "Sales Manager", "Marketing Head", "HR Manager",
                 "Senior Developer", "Business Analyst", "UI/UX Designer", "DevOps Engineer", "QA Lead"]
        role = roles[emp_id - 1]

        # Generate leave records for this employee
        all_leaves = []
        for i in range(15):
            leave_type = LEAVE_TYPES[i % len(LEAVE_TYPES)]

            if i < 2:
                days_ago = random.randint(0, 7)
            elif i < 6:
                days_ago = random.randint(8, 30)
            else:
                days_ago = random.randint(31, 365)

            start = now - timedelta(days=days_ago)
            duration = random.randint(1, 5)
            end = start + timedelta(days=duration - 1)

            leave_record = {
                "leave_id": emp_id * 1000 + i + 1,
                "leave_type": leave_type,
                "start_date": start.strftime("%Y-%m-%d"),
                "end_date": end.strftime("%Y-%m-%d"),
                "duration": duration,
                "status": random.choice(["Approved", "Pending", "Rejected"]) if days_ago < 30 else "Approved",
            }
            all_leaves.append(leave_record)

        # Filter by date
        filtered_leaves = [l for l in all_leaves if datetime.strptime(l["start_date"], "%Y-%m-%d") >= start_date]

        # Calculate stats
        total_days = sum([l["duration"] for l in filtered_leaves])
        leave_counts = {}
        for lt in LEAVE_TYPES:
            leave_counts[lt] = len([l for l in filtered_leaves if l["leave_type"] == lt])

        employees_summary.append({
            "employee_id": emp_id,
            "name": emp_name,
            "role": role,
            "total_leaves": len(filtered_leaves),
            "total_days": total_days,
            "leave_breakdown": leave_counts,
            "leaves": filtered_leaves[:5]  # Show first 5 leaves only
        })

    return {
        "success": True,
        "message": "Employee leave summary retrieved",
        "data": {
            "filter": filter,
            "employees": employees_summary
        }
    }
