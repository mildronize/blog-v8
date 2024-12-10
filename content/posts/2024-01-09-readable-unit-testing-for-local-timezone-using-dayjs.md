+++
title = "Readable unit testing for local timezone using dayjs"
date = "2024-01-09"

[taxonomies]
categories = [ "TypeScript" ]
tags = [ "TypeScript", "dayjs", "date", "timezone" ]

[extra]
id = "yyqq6jk"
+++

Unit testing is a crucial aspect of software development, and when it comes to testing functionality dependent on time and timezones, having readable and effective tests is essential. 

In this blog post, we'll explore how to perform unit testing for local timezones using TypeScript and `Dayjs`. We'll walk through a practical example involving a function to identify the state of a resource based on its environment and the current time. Additionally, we'll introduce a `Dayjs` timezone helper to facilitate seamless testing across different timezones.

## Example Code
Let's start by examining the core function responsible for identifying the state of a resource:

```typescript
/**
 * Identify the state of the resource
 * @param resource
 * @param date - Passing date for testing purpose
 * @returns
 */

export function identifyResourceState(
    resource: { env: string }, 
    date: Date = new Date()
): 'scaled_up' | 'scaled_down' {
  /**
   * If the resource is not `dev`, the state is scaled up.
   */
  if (resource.env !== 'dev') {
    return 'scaled_up';
  }

  /**
   * Time between 8:00 UTC+7 to 19:00 UTC+7, the state is scaled up.
   * Otherwise, the state is scaled down.
   */
  const hour = date.getUTCHours();
  if (hour >= 1 && hour <= 12) {
    return 'scaled_up';
  }
  return 'scaled_down';
}
```

## Dayjs Timezone helper

To enhance the testing process, we introduce a Dayjs helper to handle timezones effectively:

```typescript
// Dayjs helper
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc)
dayjs.extend(timezone)

export function createDateFromTimezone(date?: dayjs.ConfigType, timezone?: string) {
  return (date?: dayjs.ConfigType) => dayjsFromTimezone(date, timezone).toDate();
}

export function dayjsFromTimezone(date?: dayjs.ConfigType, timezone?: string) {
  return dayjs.tz(date, timezone).utc();
}
```

## Implementation
Now, let's look at how we can effectively test the `identifyResourceState` function using our Dayjs timezone helpe

```typescript
import { expect, test } from 'vitest';
import { createDateFromTimezone } from './dayjs';
import { identifyResourceState } from './identify-resource-state';

const createBangkokDate = createDateFromTimezone('Asia/Bangkok');
const dateString = '2023-12-15';

test('identifyResourceState for dev', () => {
  expect(identifyResourceState({ env: 'dev' }, createBangkokDate(`${dateString} 06:00`))).toBe('scaled_down');
  expect(identifyResourceState({ env: 'dev' }, createBangkokDate(`${dateString} 09:00`))).toBe('scaled_up');
  expect(identifyResourceState({ env: 'dev' }, createBangkokDate(`${dateString} 12:00`))).toBe('scaled_up');
  expect(identifyResourceState({ env: 'dev' }, createBangkokDate(`${dateString} 20:00`))).toBe('scaled_down');
});

test('identifyResourceState for prod', () => {
  expect(identifyResourceState({ env: 'prod' }, createBangkokDate(`${dateString} 06:00`))).toBe('scaled_up');
  expect(identifyResourceState({ env: 'prod' }, createBangkokDate(`${dateString} 09:00`))).toBe('scaled_up');
  expect(identifyResourceState({ env: 'prod' }, createBangkokDate(`${dateString} 12:00`))).toBe('scaled_up');
  expect(identifyResourceState({ env: 'prod' }, createBangkokDate(`${dateString} 20:00`))).toBe('scaled_up');
});
```

In this example, we've provided a clear introduction, added comments, and organized the content for better readability. Feel free to adapt this to suit your preferences and context!
