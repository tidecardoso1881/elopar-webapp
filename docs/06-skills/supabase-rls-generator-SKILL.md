---
name: supabase-rls-generator
description: "Generate and manage Supabase Row Level Security (RLS) policies for PostgreSQL. ALWAYS use this skill when: creating tables in Supabase, setting up RLS policies, managing data access control, implementing multi-tenant security, configuring auth-based access, writing PostgreSQL security policies, or any time someone mentions RLS, row-level security, access control, or data isolation in a Supabase context."
---

# Supabase RLS Generator

## Overview

Row Level Security (RLS) is PostgreSQL's row-level access control mechanism. It enforces data access restrictions at the database level, ensuring users can only query rows they're authorized to see.

**Why it matters:**
- Security: Data isolation happens in the database, not the application
- Compliance: Multi-tenant applications need strong tenant isolation
- Performance: RLS policies are checked for every query
- Trust: Users cannot bypass RLS by modifying client code

**When to use RLS:**
- Multi-tenant SaaS applications
- User-specific data (notes, medical records, private messages)
- Team-based access control
- Public + private data in the same table
- Admin override access patterns

## Core Concepts

### RLS Basics

```sql
-- Enable RLS on a table
ALTER TABLE public.table_name ENABLE ROW LEVEL SECURITY;

-- By default, with RLS enabled and NO policies, all access is denied
-- Create policies explicitly for each operation type
```

**Key principle:** Enable RLS, then add policies. Deny by default, allow explicitly.

### Policy Types

Each policy controls one operation type:
- **SELECT**: Which rows users can read
- **INSERT**: Which rows users can create (WITH CHECK clause)
- **UPDATE**: Which rows users can modify (USING + WITH CHECK)
- **DELETE**: Which rows users can remove

### USING vs WITH CHECK

- **USING clause**: Filters which existing rows are visible/modifiable
- **WITH CHECK clause**: Validates new rows being inserted/updated

For UPDATE: USING checks current row, WITH CHECK validates new values

### Auth Context in Supabase

```sql
auth.uid()              -- Current user's UUID
auth.jwt()              -- Full JWT claims as JSON
auth.jwt() ->> 'role'   -- User's role ('authenticated' or 'anon')
current_setting('request.jwt.claims')  -- Alternative to auth.jwt()
```

### Service Role Bypass

The service_role API key (used in backend/Edge Functions) **bypasses all RLS policies**. Use sparingly.

## Common Patterns

### Pattern 1: Authenticated Read-Only

All authenticated users can read all rows.

```sql
CREATE POLICY "authenticated_read" ON public.table_name
  FOR SELECT TO authenticated
  USING (true);
```

### Pattern 2: Owner-Based Access

Users can only access their own data.

```sql
CREATE POLICY "owner_select" ON public.table_name
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "owner_insert" ON public.table_name
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "owner_update" ON public.table_name
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "owner_delete" ON public.table_name
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());
```

### Pattern 3: Role-Based Access (RBAC)

Users with specific roles get elevated access.

```sql
CREATE POLICY "admin_full_access" ON public.table_name
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "user_own_data" ON public.table_name
  FOR ALL TO authenticated
  USING (user_id = auth.uid());
```

### Pattern 4: Team/Organization Based

Users in the same organization can access shared data.

```sql
CREATE POLICY "org_access" ON public.table_name
  FOR SELECT TO authenticated
  USING (
    org_id IN (
      SELECT org_id FROM public.org_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "org_insert" ON public.table_name
  FOR INSERT TO authenticated
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.org_members
      WHERE user_id = auth.uid()
    )
  );
```

### Pattern 5: Public Read, Authenticated Write

Public read access, only authenticated users can write.

```sql
CREATE POLICY "public_read" ON public.table_name
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "auth_insert" ON public.table_name
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "auth_update" ON public.table_name
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);
```

### Pattern 6: Hierarchical Access

Users see their own data + records they manage.

```sql
CREATE POLICY "hierarchical_read" ON public.professionals
  FOR SELECT TO authenticated
  USING (
    id = auth.uid()                          -- See own profile
    OR manager_id = auth.uid()               -- Manager sees team
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'  -- Admin sees all
    )
  );
```

## Generator Workflow

To create RLS policies for a table:

1. **Identify tables** needing RLS (any table with sensitive data)
2. **Enable RLS** on the table
3. **Map access patterns**
   - Who should read? (auth users, public, specific roles)
   - Who should write? (owner only, admins, team members)
   - Any special conditions? (date ranges, status fields)
4. **Generate policies** for SELECT, INSERT, UPDATE, DELETE
5. **Test policies** with different user contexts
6. **Document** why each policy exists

## Policy Generator Template

Given these inputs, generate complete SQL migration:

```
Table: orders
Operations: SELECT, INSERT, UPDATE
Access: Owner can see/modify own orders, admins see all
Conditions: Only active orders visible
```

Output:

```sql
-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Authenticated users see only their own orders
CREATE POLICY "user_see_own_orders" ON public.orders
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND status = 'active');

-- Admins see all orders
CREATE POLICY "admin_see_all_orders" ON public.orders
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can only insert their own orders
CREATE POLICY "user_insert_own_order" ON public.orders
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own orders
CREATE POLICY "user_update_own_order" ON public.orders
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

## Testing RLS Policies

```sql
-- Test as authenticated user
SET request.jwt.claims = '{"sub": "user-uuid-here", "role": "authenticated"}';
SET role = 'authenticated';
SELECT * FROM table_name;
RESET ALL;

-- Test as anon
SET role = 'anon';
SELECT * FROM table_name;
RESET ALL;

-- Test as admin
SET request.jwt.claims = '{"sub": "admin-uuid-here", "role": "authenticated"}';
SET role = 'authenticated';
SELECT * FROM table_name;
RESET ALL;
```

## Performance Considerations

- **Index policy columns**: If a policy filters by `org_id`, create an index on `org_id`
- **Avoid expensive subqueries**: Use EXISTS instead of IN subqueries
- **Security Definer functions**: For complex RLS logic, use PostgreSQL functions with SECURITY DEFINER
- **Materialized views**: Cache frequently-accessed role/team lookups

Example optimization:

```sql
-- Instead of this (expensive):
CREATE POLICY "org_members" ON public.projects
  FOR SELECT TO authenticated
  USING (
    org_id IN (
      SELECT org_id FROM public.org_members
      WHERE user_id = auth.uid()
    )
  );

-- Consider a function with index caching:
CREATE OR REPLACE FUNCTION public.user_org_ids()
RETURNS TABLE(org_id uuid) AS $$
  SELECT DISTINCT org_id FROM public.org_members
  WHERE user_id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE POLICY "org_members_opt" ON public.projects
  FOR SELECT TO authenticated
  USING (org_id = ANY(SELECT org_id FROM public.user_org_ids()));
```

## Anti-Patterns to Avoid

1. **Forgetting to enable RLS** - Table allows all authenticated users by default
2. **Using auth.uid() without user reference** - Policies fail silently on anon users
3. **Complex JOINs in USING** - Severe performance impact
4. **Not testing with anon role** - May accidentally expose data to unauthenticated users
5. **Forgetting WITH CHECK on INSERT/UPDATE** - Users can create/modify unauthorized rows
6. **Hardcoding user IDs in policies** - Use auth.uid() instead for dynamic access
7. **RLS on views** - RLS applies to underlying tables; views need different approach
8. **Assuming service_role is secure** - It bypasses RLS; use only in trusted backend code

## Supabase-Specific Tips

- **service_role key**: Bypasses all RLS. Use in backend/Edge Functions only
- **Supabase client SDK**: Automatically includes user JWT, respects RLS
- **Server-side with service_role**: Treat as trusted admin operations only
- **Edge Functions**: Use service_role by default; consider switching to authenticated context
- **Realtime subscriptions**: Respect RLS policies
- **Dashboard queries**: Bypass RLS; use service_role protection in UI

## Migration Template

Complete migration for production:

```sql
-- Enable Row Level Security
ALTER TABLE public.table_name ENABLE ROW LEVEL SECURITY;

-- Policy 1: SELECT - Authenticated users
CREATE POLICY "policy_select_auth" ON public.table_name
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Policy 2: INSERT - Authenticated users
CREATE POLICY "policy_insert_auth" ON public.table_name
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy 3: UPDATE - Authenticated users
CREATE POLICY "policy_update_auth" ON public.table_name
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy 4: DELETE - Authenticated users
CREATE POLICY "policy_delete_auth" ON public.table_name
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Index for performance
CREATE INDEX idx_table_name_user_id ON public.table_name(user_id);
```

## Next Steps

- Review `/references/policy-patterns.md` for 15+ additional patterns
- Use `/references/migration-template.sql` as a starter for your tables
- Test policies in Supabase SQL editor before deploying
- Document your RLS strategy in your project README
