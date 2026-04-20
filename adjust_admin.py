import re

with open("frontend/src/pages/AdminDashboard.jsx", "r") as f:
    content = f.read()

# Replace global colors
content = content.replace('bg-white', 'bg-bg-surface')
content = content.replace('text-gray-900', 'text-text-primary')
content = content.replace('text-gray-600', 'text-text-secondary')
content = content.replace('text-gray-500', 'text-text-muted')
content = content.replace('text-gray-700', 'text-text-secondary')

content = content.replace('border-gray-200', 'border-border-default')
content = content.replace('border-gray-300', 'border-border-strong')

content = content.replace('bg-gray-50', 'bg-bg-elevated')
content = content.replace('bg-gray-200', 'bg-bg-elevated')

# Modals
content = content.replace('bg-black/50', 'bg-black/70')

# Specific card overrides
content = content.replace('border hover:', 'border border-border-default hover:')

# Some basic structural changes
content = content.replace('p-4 md:p-10 lg:p-12 font-inter w-full space-y-8 md:space-y-10', 'w-full flex flex-col gap-6')
content = content.replace('<div className="flex flex-col md:flex-row justify-between md:items-end gap-4">', '<div className="flex flex-col md:flex-row justify-between md:items-end gap-4 pt-6 px-6">')

with open("frontend/src/pages/AdminDashboard.jsx", "w") as f:
    f.write(content)

