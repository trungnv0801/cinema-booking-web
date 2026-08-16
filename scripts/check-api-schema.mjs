#!/usr/bin/env node
/**
 * Fails when the committed `src/shared/api/schema.d.ts` no longer matches what
 * the backend actually serves.
 *
 * Hand-written request/response types drift silently: the backend renames a
 * field, the frontend keeps compiling, and the bug shows up as an undefined at
 * runtime weeks later. Regenerating in CI and diffing turns that into a red
 * build on the PR that caused it.
 *
 * Skips when OPENAPI_URL is unset, so the check can land before the backend
 * is reachable. Set the variable in CI to switch it on.
 */
import { execFile } from 'node:child_process'
import { readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'

const run = promisify(execFile)

const COMMITTED = 'src/shared/api/schema.d.ts'
const url = process.env.OPENAPI_URL

if (!url) {
  console.log('OPENAPI_URL is not set — skipping the API schema drift check.')
  process.exit(0)
}

const generated = path.join(tmpdir(), `schema.${process.pid}.d.ts`)

try {
  await run('npx', ['openapi-typescript', url, '-o', generated])
} catch (error) {
  console.error(`Could not read the OpenAPI document at ${url}`)
  console.error(error.stderr || error.message)
  process.exit(1)
}

const [fresh, committed] = await Promise.all([
  readFile(generated, 'utf8'),
  readFile(COMMITTED, 'utf8').catch(() => ''),
])
await rm(generated, { force: true })

if (fresh.trim() !== committed.trim()) {
  console.error(`${COMMITTED} is out of date with ${url}.`)
  console.error('Run `npm run generate:api` and commit the result.')
  process.exit(1)
}

console.log(`${COMMITTED} matches ${url}.`)
