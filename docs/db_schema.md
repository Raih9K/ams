# Academy Management System – Database Schema Documentation

> [!NOTE]
> This document provides a high‑level overview of the relational schema defined in `prisma/schema.prisma`. It is intended for developers, DBAs, and reviewers.

## ER Diagram

![AMS ER Diagram](file:///C:/Users/Raihan%20Khan/.gemini/antigravity/brain/ab89f1b0-1e43-4d3f-aca6-41a46d4c5ca5/ams_erd_1768212449420.png)

## Tables Overview

| Table            | Primary Key | Key Columns                  | Description                                                                            |
| ---------------- | ----------- | ---------------------------- | -------------------------------------------------------------------------------------- |
| `User`           | `id`        | `email` (unique)             | Authentication credentials and activation status.                                      |
| `Profile`        | `id`        | `userId` (unique)            | Dynamic profile linked to a single user.                                               |
| `Permission`     | `id`        | `name` (unique)              | Defines a permission, its scope (unlimited or time‑based) and optional validity dates. |
| `UserPermission` | `id`        | `userId`, `permissionId`     | Junction table assigning permissions to users with timestamps.                         |
| `Student`        | `id`        | –                            | Student personal data and guardian info.                                               |
| `Instructor`     | `id`        | –                            | Instructor personal data and bio.                                                      |
| `Course`         | `id`        | –                            | Course definition, fee structure, and optional instructor.                             |
| `Batch`          | `id`        | –                            | Batch schedule, capacity and optional instructor.                                      |
| `CourseBatch`    | `id`        | `courseId`, `batchId`        | Junction linking a course to a batch.                                                  |
| `Enrollment`     | `id`        | `studentId`, `courseBatchId` | Student enrollment in a specific course‑batch.                                         |
| `Attendance`     | `id`        | –                            | Daily attendance records for students or instructors, linked to a batch.               |
| `Exam`           | `id`        | –                            | Exam definition linked to a course.                                                    |
| `ExamResult`     | `id`        | `examId`, `studentId`        | Marks and grade for a student’s exam.                                                  |
| `Fee`            | `id`        | –                            | Fee amount, due date and payment status per student.                                   |
| `Payment`        | `id`        | `feeId`                      | Payment transaction details.                                                           |
| `Notice`         | `id`        | –                            | Global or batch‑specific notices with optional expiry.                                 |
| `AuditLog`       | `id`        | –                            | Auditable actions across the system (login, permission changes, payments, etc.).       |

## Relationships (summary)

- **One‑to‑One**: `User` ↔ `Profile` (each user has exactly one profile).
- **One‑to‑Many**: `User` → `UserPermission`; `Profile` → `Permission` (via junction tables).
- **Many‑to‑Many** (via junction tables): `User` ↔ `Permission` (`UserPermission`), `Course` ↔ `Batch` (`CourseBatch`).
- **Enrollments** link `Student` to a specific `CourseBatch`.
- **Attendance** can reference either a `Student` or an `Instructor` and optionally a `Batch`.
- **ExamResult** links `Exam` and `Student`.
- **Fee** ↔ `Payment` (one‑to‑many).
- **Notice** may be scoped globally or to a specific `Batch`.
- **AuditLog** records actions performed by a `User`.

## Important Constraints

- `User.email` is unique.
- `Profile.userId` is unique (enforces one‑to‑one).
- `Permission.name` is unique.
- `UserPermission.revokedAt` is nullable; a null value means the permission is still active.
- Time‑based permissions must have both `startDate` and `endDate` defined; validation is enforced at the application layer.
- Foreign key cascades are set to `ON DELETE RESTRICT` to preserve auditability.

---

_Generated from the Prisma schema (`prisma/schema.prisma`)._
