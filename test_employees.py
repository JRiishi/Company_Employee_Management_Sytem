import requests

res = requests.post("http://localhost:8000/api/auth/login", json={"email": "admin@nexushr.com", "password": "password123"})
token = res.json()["data"]["token"]

res2 = requests.get("http://localhost:8000/api/admin/employees", headers={"Authorization": f"Bearer {token}"})
data = res2.json()
print("Success:", data["success"])
print("Number of employees:", len(data["data"]))
if len(data["data"]) > 0:
    print("First employee:", data["data"][0])
