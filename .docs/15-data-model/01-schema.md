# Database Schema (Supabase/PostgreSQL)

## 1. Users & Profiles
Supabase Auth handles user authentication. We use a `profiles` table to store additional user information.

### `profiles`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, References `auth.users.id` |
| `email` | `text` | User email |
| `full_name` | `text` | User's full name |
| `role` | `text` | Role: 'user', 'admin' (default: 'user') |
| `created_at` | `timestamptz` | Creation timestamp |

## 2. Children
Stores information about the user's children.

### `children`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `gen_random_uuid()` |
| `parent_id` | `uuid` | References `profiles.id` |
| `name` | `text` | Child's name |
| `gender` | `text` | 'male' or 'female' |
| `birth_date` | `date` | Birth date |
| `birth_time` | `time` | Birth time (optional, for Saju) |
| `created_at` | `timestamptz` | Creation timestamp |

## 3. Surveys
Stores raw survey responses and calculated scores.

### `surveys`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `gen_random_uuid()` |
| `user_id` | `uuid` | References `profiles.id` (Parent) |
| `child_id` | `uuid` | References `children.id` (Optional if parent self-report) |
| `type` | `text` | 'PARENT', 'CHILD', 'PARENTING_STYLE' |
| `answers` | `jsonb` | Raw answers `{ "q_id": score }` |
| `scores` | `jsonb` | Calculated scores `{ "NS": 50, ... }` |
| `step` | `integer` | Current survey step (for incomplete surveys) |
| `status` | `text` | 'IN_PROGRESS', 'COMPLETED' |
| `created_at` | `timestamptz` | Creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

## 4. Reports
Stores the generated LLM reports.

### `reports`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `gen_random_uuid()` |
| `survey_id` | `uuid` | References `surveys.id` |
| `user_id` | `uuid` | References `profiles.id` |
| `child_id` | `uuid` | References `children.id` |
| `type` | `text` | 'PARENT', 'CHILD' |
| `content` | `text` | Markdown content of the report |
| `analysis_json` | `jsonb` | Structured analysis data (optional) |
| `model_used` | `text` | AI Model used (e.g., 'gpt-4o') |
| `created_at` | `timestamptz` | Creation timestamp |
