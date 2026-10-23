// Every function file registers its routes with the Azure Functions host as a side
// effect of being imported — this file's only job is to import all of them once.
import './functions/auth'
import './functions/me'
import './functions/course'
import './functions/courseAdmin'
import './functions/progress'
import './functions/activity'
import './functions/quiz'
import './functions/submissions'
import './functions/notifications'
import './functions/admin'
import './functions/search'
