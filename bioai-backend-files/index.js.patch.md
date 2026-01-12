// ============================================================
// index.js 修改说明
// ============================================================
// 需要在 CloudFlare-BioAI-Daily/src/index.js 中添加以下代码
// 这些修改不会影响现有的 BioAI 日报功能

// ============================================================
// 修改 1: 在文件顶部添加 import（约第 13 行，在其他 import 后面）
// ============================================================
// 添加这一行:
import { handleScheduledBlog } from './handlers/scheduledBlog.js';


// ============================================================
// 修改 2: 修改 scheduled 函数（约第 15-18 行）
// ============================================================
// 原代码:
/*
    async scheduled(event, env, ctx) {
        // 每日任务 - 生成日报
        await handleScheduled(event, env, ctx);
    },
*/

// 改为:
/*
    async scheduled(event, env, ctx) {
        // 根据 cron 表达式判断执行哪个任务
        if (event.cron === '0 1 * * *') {
            // UTC 01:00 (北京 09:00) - 博客生成任务
            console.log('[Scheduled] Running blog generation task...');
            await handleScheduledBlog(event, env, ctx);
        } else {
            // 默认任务 (0 23 * * *) - BioAI 日报生成
            console.log('[Scheduled] Running BioAI daily task...');
            await handleScheduled(event, env, ctx);
        }
    },
*/


// ============================================================
// 修改 3: 添加手动触发博客的路由（在 /testTriggerScheduled 附近，约第 87 行后）
// ============================================================
// 在 else if (path === '/testTriggerScheduled' ...) 代码块之后添加:
/*
        } else if (path === '/testTriggerBlog' && request.method === 'GET') {
            // 手动触发博客生成任务（用于测试）
            // 用法: /testTriggerBlog?key=xxx&date=2026-01-10
            const secretKey = url.searchParams.get('key');
            const expectedKey = env.TEST_TRIGGER_SECRET || 'test-secret-key-change-me';
            if (secretKey !== expectedKey) {
                return new Response(JSON.stringify({ 
                    error: 'Unauthorized. Please provide correct secret key.' 
                }), { 
                    status: 401, 
                    headers: { 'Content-Type': 'application/json; charset=utf-8' } 
                });
            }
            const dateParam = url.searchParams.get('date');
            const specifiedDate = dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? dateParam : null;
            const fakeEvent = { scheduledTime: Date.now(), cron: '0 1 * * *' };
            const fakeCtx = { waitUntil: (promise) => promise };
            try {
                const result = await handleScheduledBlog(fakeEvent, env, fakeCtx, specifiedDate);
                return new Response(JSON.stringify({ 
                    success: true, 
                    message: `Blog generation completed${specifiedDate ? ` for date: ${specifiedDate}` : ' for yesterday'}`,
                    ...result
                }), { 
                    status: 200, 
                    headers: { 'Content-Type': 'application/json; charset=utf-8' } 
                });
            } catch (error) {
                return new Response(JSON.stringify({ 
                    success: false, 
                    error: error.message
                }), { 
                    status: 500, 
                    headers: { 'Content-Type': 'application/json; charset=utf-8' } 
                });
            }
*/
