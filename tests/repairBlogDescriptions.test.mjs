import assert from "node:assert/strict";
import test from "node:test";

import {
  deriveDescription,
  repairDescription,
} from "../scripts/repair-blog-descriptions.mjs";

test("description repair takes the first substantive paragraph", () => {
  const source = `---
title: '示例'
description: 'Table of contents'
---

## Table of contents

### 小标题

这是一个足够具体的正文段落，说明文章讨论的主题、观察范围和需要核验的事实来源。
`;

  const repaired = repairDescription(source);
  assert.match(repaired ?? "", /description: '这是一个足够具体的正文段落/);
  assert.equal((repaired?.match(/^description:/gm) ?? []).length, 1);
});

test("description repair preserves markdown link text and removes its URL", () => {
  assert.equal(
    deriveDescription(
      "这是一段包含[原始研究](https://example.com/paper)链接的完整说明，用来帮助读者理解文章讨论的范围。"
    ).includes("https://example.com"),
    false
  );
});

test("non-placeholder descriptions are left untouched", () => {
  assert.equal(
    repairDescription("---\ndescription: '已经写好'\n---\n\n正文内容足够长。"),
    null
  );
});
