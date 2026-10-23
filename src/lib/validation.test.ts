import { describe, expect, it } from 'vitest'
import { githubUrlSchema, ideas2itEmailSchema, optionalGithubUrlSchema } from './validation'

describe('githubUrlSchema', () => {
  it('accepts a plain repo URL', () => {
    expect(githubUrlSchema.safeParse('https://github.com/octocat/hello-world').success).toBe(true)
  })

  it('accepts a repo URL with a deeper path (branch/PR/commit)', () => {
    expect(githubUrlSchema.safeParse('https://github.com/octocat/hello-world/pull/12').success).toBe(true)
  })

  it('rejects non-GitHub URLs', () => {
    expect(githubUrlSchema.safeParse('https://gitlab.com/octocat/hello-world').success).toBe(false)
  })

  it('rejects a bare github.com URL with no repo', () => {
    expect(githubUrlSchema.safeParse('https://github.com/').success).toBe(false)
  })

  it('rejects an empty string', () => {
    expect(githubUrlSchema.safeParse('').success).toBe(false)
  })
})

describe('optionalGithubUrlSchema', () => {
  it('allows an empty string', () => {
    expect(optionalGithubUrlSchema.safeParse('').success).toBe(true)
  })

  it('still validates a non-empty value', () => {
    expect(optionalGithubUrlSchema.safeParse('not-a-url').success).toBe(false)
  })
})

describe('ideas2itEmailSchema', () => {
  it('accepts an ideas2it.com address', () => {
    expect(ideas2itEmailSchema.safeParse('trainee01@ideas2it.com').success).toBe(true)
  })

  it('rejects a non-ideas2it domain', () => {
    expect(ideas2itEmailSchema.safeParse('trainee01@gmail.com').success).toBe(false)
  })

  it('rejects a malformed email', () => {
    expect(ideas2itEmailSchema.safeParse('not-an-email').success).toBe(false)
  })
})
