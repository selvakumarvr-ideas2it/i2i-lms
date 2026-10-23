/**
 * One-time migration: uploads the course content already authored in
 * ../../src/data/seed/*.ts (course/days/study materials/exercises/quizzes/
 * assignments/capstones) into the `course-content` Blob container as JSON documents.
 * Run with `npm run seed:course` from api/. Safe to re-run — it overwrites the blobs
 * with the current seed data every time.
 */
import { CONTAINER_NAMES } from '../src/repositories/blobClientFactory'
import { writeJson } from '../src/repositories/blob/jsonBlobStore'
import { COURSE, MODULES, DAYS, STUDY_MATERIALS, EXERCISES, ASSIGNMENTS } from '../../src/data/seed/course.seed'
import { QUIZZES } from '../../src/data/seed/quiz.seed'
import { CAPSTONES } from '../../src/data/seed/capstones.seed'

async function main() {
  const container = CONTAINER_NAMES.courseContent

  await writeJson(container, 'course.json', COURSE)
  await writeJson(container, 'modules.json', MODULES)
  await writeJson(container, 'days.json', DAYS)
  await writeJson(container, 'study-materials.json', STUDY_MATERIALS)
  await writeJson(container, 'exercises.json', EXERCISES)
  await writeJson(container, 'assignments.json', ASSIGNMENTS)
  await writeJson(container, 'quizzes.json', QUIZZES)
  await writeJson(container, 'capstones.json', CAPSTONES)

  console.log(`Seeded course content into the "${container}" container:`)
  console.log(`  ${DAYS.length} days, ${STUDY_MATERIALS.length} study materials, ${EXERCISES.length} exercises,`)
  console.log(`  ${ASSIGNMENTS.length} assignments, ${QUIZZES.length} quizzes, ${CAPSTONES.length} capstones.`)
}

main().catch((err) => {
  console.error('Seeding course content failed:', err)
  process.exitCode = 1
})
