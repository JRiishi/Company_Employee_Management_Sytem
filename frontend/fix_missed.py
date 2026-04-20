import re

def manual_replace(file, rules):
    with open(file, 'r') as f:
        c = f.read()
        
    orig = c
    for o, n in rules:
        c = c.replace(o, n)
        
    if orig != c:
        with open(file, 'w') as f:
            f.write(c)

# Fix charts in EmployeePerformance, PerformanceChart, TaskChart etc
chart_rules = [
    ("background: 'white'", "background: '#1A1A26'"),
    ("backgroundColor: 'white'", "backgroundColor: '#1A1A26'"),
    ("border: '1px solid #ccc'", "border: '1px solid rgba(255,255,255,0.1)'"),
    ('<CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3"/>', '<CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />'),
    ('<CartesianGrid strokeDasharray="3 3" />', '<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />'),
    ('<CartesianGrid strokeDasharray="3 3"/>', '<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />')
]

manual_replace("src/pages/EmployeePerformance.jsx", chart_rules)
manual_replace("src/pages/SystemOverview.jsx", chart_rules)

