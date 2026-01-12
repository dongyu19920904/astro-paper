import re

file_path = r'D:\GitHub\CloudFlare-BioAI-Daily\src\handlers\scheduledBlog.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 找到并替换 buildAstroPaperFrontMatter 函数
old_fn = '''function buildAstroPaperFrontMatter(title, description, dateStr, tags) {
    // 生成北京时间 09:00 的 ISO 时间戳
    const pubDatetime = `${dateStr}T01:00:00.000Z`; // UTC 01:00 = 北京 09:00

    return `---
title: "${title}"
pubDatetime: ${pubDatetime}
modDatetime: ${pubDatetime}
description: "${description}"
tags:
${tags.map(tag => `  - ${tag}`).join('\\n')}
draft: false
---

`;
}'''

new_fn = '''function buildAstroPaperFrontMatter(title, description, dateStr, tags) {
    // 生成北京时间 09:00 的 ISO 时间戳
    const pubDatetime = `${dateStr}T01:00:00.000Z`; // UTC 01:00 = 北京 09:00
    
    // 转义 title 和 description 中的双引号，避免 YAML 解析错误
    const safeTitle = title.replace(/"/g, '\\\\"');
    const safeDescription = description.replace(/"/g, "'").replace(/\\n/g, ' ');

    return `---
title: "${safeTitle}"
pubDatetime: ${pubDatetime}
modDatetime: ${pubDatetime}
description: "${safeDescription}"
tags:
${tags.map(tag => `  - ${tag}`).join('\\n')}
draft: false
---

`;
}'''

if old_fn in content:
    content = content.replace(old_fn, new_fn)
    print('找到并替换了原始函数')
else:
    # 尝试用正则替换
    pattern = r'function buildAstroPaperFrontMatter\(title, description, dateStr, tags\) \{[^}]+return `---[^`]+`;\s*\}'
    if re.search(pattern, content, re.DOTALL):
        content = re.sub(pattern, new_fn, content, flags=re.DOTALL)
        print('用正则替换了函数')
    else:
        print('未找到匹配，尝试手动替换...')
        # 手动定位并替换
        start_marker = 'function buildAstroPaperFrontMatter(title, description, dateStr, tags) {'
        end_marker = '/**\n * 调用 AI 改写日报为博客风格'
        
        start_idx = content.find(start_marker)
        end_idx = content.find(end_marker)
        
        if start_idx != -1 and end_idx != -1:
            content = content[:start_idx] + new_fn + '\n\n' + content[end_idx:]
            print('手动定位替换成功')
        else:
            print(f'定位失败: start={start_idx}, end={end_idx}')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('修复完成！')
