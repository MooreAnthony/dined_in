/*
  # Profile Table Diagnostics

  1. Queries
    - Check specific profile record
    - Verify duplicate records
    - Validate data integrity
    - Inspect table structure and constraints
    
  2. Purpose
    - Identify potential authentication issues
    - Verify data consistency
    - Check for malformed values
*/

-- Check specific profile record with all columns
SELECT 
  p.*,
  CASE 
    WHEN p.created_at IS NULL THEN 'Missing timestamp'
    ELSE to_char(p.created_at, 'YYYY-MM-DD HH24:MI:SS')
  END as formatted_created_at,
  EXISTS (
    SELECT 1 FROM auth.users u WHERE u.id = p.id
  ) as has_auth_user
FROM profiles p
WHERE p.id = '5bc28593-d537-4c03-b338-ae925b6863e3';

-- Check for duplicate records
SELECT id, COUNT(*) as duplicate_count
FROM profiles
WHERE id = '5bc28593-d537-4c03-b338-ae925b6863e3'
GROUP BY id
HAVING COUNT(*) > 1;

-- Check for null or malformed values in critical fields
SELECT 
  id,
  CASE WHEN first_name IS NULL THEN 'Missing first name' END as first_name_issue,
  CASE WHEN last_name IS NULL THEN 'Missing last name' END as last_name_issue,
  CASE WHEN mobile IS NULL THEN 'Missing mobile' END as mobile_issue,
  CASE WHEN email IS NULL THEN 'Missing email' END as email_issue,
  CASE 
    WHEN email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' 
    THEN 'Invalid email format'
  END as email_format_issue
FROM profiles
WHERE id = '5bc28593-d537-4c03-b338-ae925b6863e3';

-- Check table structure and constraints
SELECT 
  c.column_name,
  c.data_type,
  c.is_nullable,
  c.column_default,
  tc.constraint_type,
  tc.constraint_name
FROM information_schema.columns c
LEFT JOIN information_schema.constraint_column_usage ccu 
  ON c.column_name = ccu.column_name 
  AND c.table_name = ccu.table_name
LEFT JOIN information_schema.table_constraints tc 
  ON ccu.constraint_name = tc.constraint_name
WHERE c.table_name = 'profiles';

-- Check indexes on profiles table
SELECT 
  i.indexname,
  i.indexdef
FROM pg_indexes i
WHERE i.tablename = 'profiles';

-- Check for orphaned profile records (no corresponding auth.users record)
SELECT p.id, p.email
FROM profiles p
LEFT JOIN auth.users u ON u.id = p.id
WHERE u.id IS NULL;

-- Check for auth.users records without profiles
SELECT u.id, u.email
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- Check active triggers on profiles table
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'profiles';

-- Check foreign key relationships
SELECT
  tc.table_schema, 
  tc.constraint_name, 
  tc.table_name, 
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND (tc.table_name = 'profiles' 
    OR ccu.table_name = 'profiles');