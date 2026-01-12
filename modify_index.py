import os

file_path = r'D:\GitHub\CloudFlare-BioAI-Daily\src\index.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
old_import = "import { handleScheduled } from './handlers/scheduled.js';"
new_import = old_import + "\nimport { handleScheduledBlog } from './handlers/scheduledBlog.js';"
content = content.replace(old_import, new_import)

# 2. Replace scheduled function
old_fn = """    async scheduled(event, env, ctx) {
        // 每日任务 - 生成日报
        await handleScheduled(event, env, ctx);
    },"""

new_fn = """    async scheduled(event, env, ctx) {
        // 根据不同的 cron 执行不同的任务
        if (event.cron === '0 16 * * *') {
            // 博客生成任务 - UTC 16:00 (北京时间 00:00)
            await handleScheduledBlog(event, env, ctx);
        } else {
            // 每日日报任务 - UTC 14:00 (北京时间 22:00)
            await handleScheduled(event, env, ctx);
        }
    },"""

content = content.replace(old_fn, new_fn)

# 3. Add testTriggerBlog route
test_route = """        } else if (path === '/testTriggerBlog' && request.method === 'GET') {
            // Test endpoint for triggering blog generation task
            const secretKey = url.searchParams.get('key');
            const expectedKey = env.TEST_TRIGGER_SECRET || 'test-secret-key-change-me';
            if (secretKey !== expectedKey) {
                return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
            }
            const dateParam = url.searchParams.get('date');
            const specifiedDate = dateParam && /^\\d{4}-\\d{2}-\\d{2}$/.test(dateParam) ? dateParam : null;
            const fakeEvent = { scheduledTime: Date.now(), cron: '0 16 * * *' };
            const fakeCtx = { waitUntil: (p) => p };
            try {
                await handleScheduledBlog(fakeEvent, env, fakeCtx, specifiedDate);
                return new Response(JSON.stringify({ success: true, message: 'Blog task done', date: specifiedDate || 'today' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            } catch (error) {
                return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
            }
        }

        // Authentication check for all other paths"""

content = content.replace('        }\n\n        // Authentication check for all other paths', test_route)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('index.js modification completed!')
print('Checking results...')

# Verify
with open(file_path, 'r', encoding='utf-8') as f:
    new_content = f.read()

checks = [
    ('Import handleScheduledBlog', 'handleScheduledBlog' in new_content and 'import' in new_content),
    ('Cron check in scheduled()', "event.cron === '0 16 * * *'" in new_content),
    ('/testTriggerBlog route', '/testTriggerBlog' in new_content),
]

for name, passed in checks:
    status = '✓' if passed else '✗'
    print(f'  {status} {name}')
