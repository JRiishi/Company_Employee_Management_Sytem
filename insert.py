import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os

load_dotenv("backend/.env")

try:
    db=mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASS", "123456789"),
        database=os.getenv("DB_NAME", "DBMS_PROJECT"),
        auth_plugin='mysql_native_password'
    )
    if db.is_connected():
        print("Connection Successful!")
        cursor=db.cursor()
        print("Using DBMS_PROJECT TABLE:")
        cursor.execute('use DBMS_PROJECT;')
        #Creating emplouyee table
        cursor.execute('create table employee(emp_id int primary key,name varchar(100) not null,email varchar(100) not null,joing_date date not null,salary float not null,status varchar(20) not null);')
        print("Employee table created successfully!")
        
        import random
        from datetime import datetime, timedelta
        
        first_names = ["Aarav", "Vihaan", "Vivaan", "Ananya", "Diya", "Advik", "Kavya", "Aryan", "Sai", "Isha", "Rohan", "Riya", "Aarush", "Fatima", "Arjun", "Zara", "Aaliyah", "Kabir", "Aisha", "Omar", "Rahul", "Priya", "Amit", "Neha", "Vikram", "Sneha", "Karan", "Pooja", "Siddharth", "Ritu"]
        last_names = ["Sharma", "Patel", "Singh", "Kumar", "Das", "Kaur", "Khan", "Iyer", "Chauhan", "Gupta", "Desai", "Jain", "Mehta", "Bose", "Verma", "Yadav", "Chakraborty", "Reddy", "Nair", "Rao", "Mishra", "Pandey"]
        
        print("Inserting 100 dummy employee records...")
        for i in range(1, 101):
            emp_id = i
            first_name = random.choice(first_names)
            last_name = random.choice(last_names)
            name = f"{first_name} {last_name}"
            email = f"{first_name.lower()}.{last_name.lower()}{i}@example.com"
            # Random date within last 5 years
            start_date = datetime.now() - timedelta(days=5*365)
            joining_date = (start_date + timedelta(days=random.randint(0, 5*365))).strftime('%Y-%m-%d')
            salary = round(random.uniform(30000, 150000), 2)
            status = random.choice(["active", "active", "active", "inactive"])
            
            cursor.execute(f"insert into employee values({emp_id},'{name}','{email}','{joining_date}',{salary},'{status}');")
            
        db.commit()
        print("Employee records inserted successfully!")
        print("MAKING DEPARTMENT TABLE:")
        cursor.execute('create table department(dept_id int primary key,dept_name varchar(100),manager_id int);')
        print("Department table created successfully!")
        
        dept_names = ["HR", "Engineering", "Sales", "Marketing", "Finance", "Legal"]
        for dept_id, dept_name in enumerate(dept_names, start=1):
            manager_id = random.randint(1, 100) # Random manager from employees
            cursor.execute(f"insert into department values({dept_id},'{dept_name}',{manager_id});")
        db.commit()
        print("Department records inserted successfully!")

        print("Making table TASK:")
        cursor.execute('create table task(task_id int primary key,assign_to int references employee(emp_id),Title varchar(255),due_date date,status varchar(20));')
        print("Task table created successfully!")
        
        task_titles = ["Code Review", "Database Migration", "Update Documentation", "Bug Fixing", "Client Meeting", "Security Audit"]
        for task_id in range(1, 101):
            assign_to = random.randint(1, 100)
            title = random.choice(task_titles)
            start_date = datetime.now()
            due_date = (start_date + timedelta(days=random.randint(1, 30))).strftime('%Y-%m-%d')
            status = random.choice(["pending", "completed", "in_progress"])
            cursor.execute(f"insert into task values({task_id},{assign_to},'{title}','{due_date}','{status}');")
        db.commit()
        print("Task records inserted successfully!")
        print("Creating table Performance:")
        cursor.execute('create table performance(perf_id int primary key,emp_id int references employee(emp_id),score float,strength varchar(100),weakness varchar(100),date date,reviewer_notes varchar(2500));')
        print("Performance table created successfully!")
        
        for perf_id in range(1, 101):
            emp_id = perf_id
            score = round(random.uniform(50, 100), 2)
            strength = random.choice(["Leadership", "Problem Solving", "Communication", "Technical Skills"])
            weakness = random.choice(["Time Management", "Public Speaking", "Delegation", "Patience"])
            review_date = datetime.now().strftime('%Y-%m-%d')
            notes = "Good performance overall."
            cursor.execute(f"insert into performance values({perf_id},{emp_id},{score},'{strength}','{weakness}','{review_date}','{notes}');")
        db.commit()

        print('Creating table leaves:')
        cursor.execute('create table leaves(leave_id int primary key,emp_id int references employee(emp_id),leave_type varchar(100),start_date date,end_date date,status varchar(20));')
        print("Leaves table created successfully!")
        
        for leave_id in range(1, 101):
            emp_id = random.randint(1, 100)
            leave_type = random.choice(["Sick", "Casual", "Earned", "Maternity"])
            start_date = datetime.now()
            end_date = start_date + timedelta(days=random.randint(1, 5))
            status = random.choice(["Approved", "Pending", "Rejected"])
            cursor.execute(f"insert into leaves values({leave_id},{emp_id},'{leave_type}','{start_date.strftime('%Y-%m-%d')}','{end_date.strftime('%Y-%m-%d')}','{status}');")
        db.commit()

        print('Creating table payroll:')
        cursor.execute('create table payroll(payroll_id int primary key,emp_id int references employee(emp_id),month varchar(20),year int,gross_salary float,leaves_taken float,deductions float,net_salary float);')
        print("Payroll table created successfully!")
        
        for payroll_id in range(1, 101):
            emp_id = random.randint(1, 100)
            month = random.choice(["January", "February", "March", "April"])
            year = 2026
            gross_salary = round(random.uniform(30000, 150000), 2)
            leaves_taken = random.randint(0, 5)
            deductions = leaves_taken * (gross_salary / 30) # Assuming deduction per day
            net_salary = round(gross_salary - deductions, 2)
            cursor.execute(f"insert into payroll values({payroll_id},{emp_id},'{month}',{year},{gross_salary},{leaves_taken},{deductions},{net_salary});")
        db.commit()

        print("creating table appraisals:")
        cursor.execute('create table appraisals(appraisal_id int primary key,emp_id int references employee(emp_id),action varchar(255),reason varchar(255),agent_explanation varchar(2500),action_date date,deducted_by varchar(100));')
        print('Appraisals table created successfully')

        for appraisal_id in range(1, 101):
            emp_id = random.randint(1, 100)
            action = random.choice(["Bonus", "Promotion", "Warning", "Salary Hike"])
            reason = "Annual review outcomes"
            agent_explanation = "Based on aggregate yearly performance."
            action_date = datetime.now().strftime('%Y-%m-%d')
            deducted_by = "HR Department"
            cursor.execute(f"insert into appraisals values({appraisal_id},{emp_id},'{action}','{reason}','{agent_explanation}','{action_date}','{deducted_by}');")
        db.commit()


    else:
        print("Connection Failed!")
except Error as err:
    if err.errno == 1045:
        print("Error: Wrong username or password")
