/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { test, expect } from './playwright-test-fixtures';

test('should lead in uncaughtException when page.route raises', async ({ runInlineTest, server }) => {
  const result = await runInlineTest({
    'a.test.ts': `
      const { test } = pwt;
      test('fail', async ({ page }) => {
        test.fail();
        await page.route('**/empty.html', route => {
          throw new Error('foobar');
        });
        await page.goto('${server.EMPTY_PAGE}');
      });
    `,
  }, { workers: 1 });
  expect(result.interrupted).toBe(1);
  expect(result.output).toContain('foobar');
});

test('should lead in unhandledRejection when page.route raises', async ({ runInlineTest, server }) => {
  const result = await runInlineTest({
    'a.test.ts': `
      const { test } = pwt;
      test('fail', async ({ page }) => {
        test.fail();
        await page.route('**/empty.html', async route => {
          throw new Error('foobar');
        });
        await page.goto('${server.EMPTY_PAGE}');
      });
    `,
  }, { workers: 1 });
  expect(result.interrupted).toBe(1);
  expect(result.output).toContain('foobar');
});

test('should lead in uncaughtException when context.route raises', async ({ runInlineTest, server }) => {
  const result = await runInlineTest({
    'a.test.ts': `
      const { test } = pwt;
      test('fail', async ({ context, page }) => {
        test.fail();
        await context.route('**/empty.html', route => {
          throw new Error('foobar');
        });
        await page.goto('${server.EMPTY_PAGE}');
      });
    `,
  }, { workers: 1 });
  expect(result.interrupted).toBe(1);
  expect(result.output).toContain('foobar');
});

test('should lead in unhandledRejection when context.route raises', async ({ runInlineTest, server }) => {
  const result = await runInlineTest({
    'a.test.ts': `
      const { test } = pwt;
      test('fail', async ({ context, page }) => {
        test.fail();
        await context.route('**/empty.html', async route => {
          throw new Error('foobar');
        });
        await page.goto('${server.EMPTY_PAGE}');
      });
    `,
  }, { workers: 1 });
  expect(result.interrupted).toBe(1);
  expect(result.output).toContain('foobar');
});
