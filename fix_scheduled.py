import re

file_path = r'D:\GitHub\CloudFlare-BioAI-Daily\src\index.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 替换 scheduled 函数 - 匹配从 "async scheduled" 到下一个 "}," 的内容
old_pattern = r'(async scheduled\(event, env, ctx\) \{)[^}]+(?:if \(event\.cron[^}]+\}[^}]+\})[^}]+(\},)'

new_fn = r'''async scheduled(event, env, ctx) {
        // 每日定时任务 - UTC 14:00 (北京时间 22:00)
        // 1. 先生成 BioAI 日报
        await handleScheduled(event, env, ctx);
        // 2. 然后生成博客文章（基于昨天的日报内容）
        try {
            await handleScheduledBlog(event, env, ctx);
        } catch (error) {
            console.error('Blog generation failed:', error);
        }
    },'''

# 简单的字符串替换方法
lines = content.split('\n')
new_lines = []
in_scheduled = False
skip_until_close = False
brace_count = 0

i = 0
while i < len(lines):
    line = lines[i]
    
    if 'async scheduled(event, env, ctx)' in line:
        # 找到 scheduled 函数，插入新内容
        new_lines.append('    async scheduled(event, env, ctx) {')
        new_lines.append('        // 每日定时任务 - UTC 14:00 (北京时间 22:00)')
        new_lines.append('        // 1. 先生成 BioAI 日报')
        new_lines.append('        await handleScheduled(event, env, ctx);')
        new_lines.append('        // 2. 然后生成博客文章（基于昨天的日报内容）')
        new_lines.append('        try {')
        new_lines.append('            await handleScheduledBlog(event, env, ctx);')
        new_lines.append('        } catch (error) {')
        new_lines.append("            console.error('Blog generation failed:', error);")
        new_lines.append('        }')
        new_lines.append('    },')
        
        # 跳过旧的 scheduled 函数体
        brace_count = 1
        i += 1
        while i < len(lines) and brace_count > 0:
            for c in lines[i]:
                if c == '{':
                    brace_count += 1
                elif c == '}':
                    brace_count -= 1
            i += 1
        continue
    else:
        new_lines.append(line)
    i += 1

with open(file_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))

print('scheduled 函数已修改为同时执行两个任务')
