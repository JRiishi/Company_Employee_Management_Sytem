import re

with open('src/pages/AdminSettings.jsx', 'r') as f:
    content = f.read()

# Replace inputs that have the generic white styling
# e.g., className="w-full px-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
# -> className="w-full bg-[#1A1A26] px-4 py-2 border border-white/10 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"

content = content.replace(
    'className="w-full px-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"',
    'className="w-full bg-[#1A1A26] px-4 py-2 border border-white/10 rounded-lg text-text-primary focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"'
)

with open('src/pages/AdminSettings.jsx', 'w') as f:
    f.write(content)
