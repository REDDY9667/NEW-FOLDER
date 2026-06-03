import { Routes } from '@angular/router';

// NOTE: Feature routes are added incrementally by:
//   PATCH-13 → auth/login, auth/register
//   PATCH-20 → sources
//   PATCH-21 → sources/new, sources/:id
//   PATCH-43 → concepts
//   PATCH-44 → concepts/new, concepts/:id/edit
//   PATCH-45 → concepts/:id
//   PATCH-53 → dashboard
//   PATCH-57 → decay-alerts
//   PATCH-61 → study-plan
//   PATCH-65 → challenges/:conceptId
export const routes: Routes = [
