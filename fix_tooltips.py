import os
import re

files = [
    "src/components/TaskDashboard/TaskChart.jsx",
    "src/pages/SystemOverview.jsx",
    "src/pages/EmployeeTasks.jsx",
    "src/pages/EmployeeSalary.jsx",
    "src/pages/Settings.jsx"
]

dark_tooltip = """<Tooltip
  contentStyle={{
    background: '#1A1A26',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: '8px',
    color: '#F0F0FA',
    fontSize: '12px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.5)'
  }}
  itemStyle={{ color: '#F0F0FA' }}
  labelStyle={{ color: '#9090AA', marginBottom: '4px' }}
  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
/>"""

for file in files:
    filepath = os.path.join('/Users/riishabhjain/Desktop/DBMS_PROJECT/frontend', file)
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        changed = False
        if '<Tooltip />' in content:
            content = content.replace('<Tooltip />', dark_tooltip)
            changed = True
            print(f"Fixed tooltips in {file}")
            
        if 'shadow-sm' in content:
            # We must be careful because shadow-sm might be used safely? No, the rule said replace with border border-white/10 OR remove entirely. Let's just remove entirely or replace with nothing. Actually replaced with empty string.
            content = re.sub(r'\bshadow-sm\b', '', content)
            changed = True
            print(f"Removed shadow-sm in {file}")

        if changed:
            with open(filepath, 'w') as f:
                f.write(content)
