import re
import os

files = [
    "src/components/TaskDashboard/TaskChart.jsx",
    "src/pages/SystemOverview.jsx",
]

for file in files:
    filepath = os.path.join('/Users/riishabhjain/Desktop/DBMS_PROJECT/frontend', file)
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()

        # Fix CartesianGrid
        content = re.sub(
            r'<CartesianGrid[^>]*stroke=["\']#e5e7eb["\'][^>]*/>',
            r'<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />',
            content
        )
        content = re.sub(
            r'<CartesianGrid\s+strokeDasharray="3 3"\s+vertical={false}\s+stroke="#e5e7eb"\s*/>',
            r'<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />',
            content
        )

        # Fix XAxis/YAxis ticks
        content = re.sub(r'tick={{ fill: ["\']#6b7280["\'] }}', r"tick={{ fill: '#9090AA' }}", content)
        content = re.sub(r'tick={{ fill: ["\']#374151["\'] }}', r"tick={{ fill: '#9090AA' }}", content)
        content = re.sub(r'tickLine={false}\s+axisLine={false}\s+tick={{ fill: ["\']#9ca3af["\'], fontSize: 12 }}', r"tickLine={false} axisLine={false} tick={{ fill: '#9090AA', fontSize: 12 }}", content)

        # Fix Tooltip blocks with hardcoded light styles
        bad_tooltip1 = r'<Tooltip\s+contentStyle={{\s+backgroundColor: "[^"]+",\s+border: "[^"]+",\s+}}\s+/>'
        content = re.sub(bad_tooltip1, r"""<Tooltip
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
/>""", content)

        # Fix CartesianGrid generic
        content = re.sub(r'stroke="#f3f4f6"', r'stroke="rgba(255,255,255,0.06)"', content)
        content = re.sub(r'stroke="#e5e7eb"', r'stroke="rgba(255,255,255,0.06)"', content)
        content = re.sub(r'fill="#374151"', r'fill="#9090AA"', content)

        with open(filepath, 'w') as f:
            f.write(content)
