import re

with open('src/pages/SystemOverview.jsx', 'r') as f:
    content = f.read()

# Risk Panel
content = content.replace('Card className="border-red-200 bg-red-50"', 'Card className="border-red-500/20 bg-red-500/10"')
content = content.replace('className="text-red-600 flex-shrink-0"', 'className="text-red-400 flex-shrink-0 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]"')
content = content.replace('text-xl font-bold text-red-900', 'text-xl font-bold text-red-100')
content = content.replace('text-sm text-red-700', 'text-sm text-red-200/70')
content = content.replace('className=" rounded-lg p-3 border border-red-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)] transition-shadow"', 'className="rounded-lg p-3 border border-red-500/20 bg-black/20 hover:border-red-500/40 hover:shadow-[0_4px_24px_rgba(248,113,113,0.15)] transition-all"')
content = content.replace('bg-red-100 text-red-800', 'bg-red-500/20 text-red-300 border border-red-500/30')

# Top Performers
content = content.replace('Card className="border-green-200 bg-green-50"', 'Card className="border-green-500/20 bg-green-500/10"')
content = content.replace('className="text-green-600 flex-shrink-0"', 'className="text-green-400 flex-shrink-0 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]"')
content = content.replace('text-xl font-bold text-green-900', 'text-xl font-bold text-green-100')
content = content.replace('text-sm text-green-700', 'text-sm text-green-200/70')
content = content.replace('className=" rounded-lg p-3 border border-green-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)] transition-shadow"', 'className="rounded-lg p-3 border border-green-500/20 bg-black/20 hover:border-green-500/40 hover:shadow-[0_4px_24px_rgba(74,222,128,0.15)] transition-all"')
content = content.replace('text-sm font-bold text-green-700', 'text-sm font-bold text-green-400')

# System Status
content = content.replace('Card className="border-blue-200 bg-blue-50"', 'Card className="border-blue-500/20 bg-blue-500/10"')
content = content.replace('text-xl font-bold text-blue-900 mb-4', 'text-xl font-bold text-blue-100 mb-4 flex items-center gap-2')
content = content.replace('className=" rounded-lg p-3 border border-blue-200"', 'className="rounded-lg p-3 border border-blue-500/20 bg-black/20"')
content = content.replace('bg-blue-200 rounded-full overflow-hidden', 'bg-blue-950/50 rounded-full overflow-hidden border border-blue-500/20')
content = content.replace('className="h-full bg-green-500"', 'className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"')
content = content.replace('text-xs font-semibold text-text-primary', 'text-xs font-semibold text-blue-300')

with open('src/pages/SystemOverview.jsx', 'w') as f:
    f.write(content)
