import { z } from 'zod'

// Matches https://github.com/<owner>/<repo>[/tree/branch][/pull/n][etc.]
const GITHUB_REPO_PATTERN = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(\/.*)?$/i

export const githubUrlSchema = z
  .string()
  .trim()
  .min(1, 'GitHub repository URL is required')
  .regex(GITHUB_REPO_PATTERN, 'Enter a valid GitHub repository URL, e.g. https://github.com/user/repo')

export const optionalGithubUrlSchema = z
  .string()
  .trim()
  .regex(GITHUB_REPO_PATTERN, 'Enter a valid GitHub repository URL, e.g. https://github.com/user/repo')
  .optional()
  .or(z.literal(''))

export const ideas2itEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Email is required')
  .email('Enter a valid email address')
  .refine((value) => value.endsWith('@ideas2it.com'), {
    message: 'Use your Ideas2IT email address (name@ideas2it.com)',
  })
