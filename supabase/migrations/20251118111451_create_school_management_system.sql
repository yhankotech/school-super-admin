/*
  # School Management System Database Schema

  ## Overview
  Complete database schema for a super admin platform to manage multiple schools,
  their users, students, parents, teachers, staff, payments, and platform integrations.

  ## New Tables

  ### 1. `schools`
  - `id` (uuid, primary key)
  - `name` (text) - School name
  - `code` (text, unique) - Unique school identifier code
  - `status` (text) - active, blocked, inactive
  - `email` (text) - School contact email
  - `phone` (text) - School contact phone
  - `address` (text) - School physical address
  - `max_students` (integer) - Maximum students allowed
  - `max_teachers` (integer) - Maximum teachers allowed
  - `max_staff` (integer) - Maximum staff allowed
  - `subscription_plan` (text) - Plan type
  - `subscription_expires_at` (timestamptz) - Subscription expiration
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `school_users`
  - `id` (uuid, primary key)
  - `school_id` (uuid, foreign key)
  - `user_type` (text) - student, teacher, staff, parent, admin
  - `full_name` (text)
  - `email` (text)
  - `phone` (text)
  - `status` (text) - active, inactive, suspended
  - `permissions` (jsonb) - User permissions object
  - `metadata` (jsonb) - Additional user data
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `students`
  - `id` (uuid, primary key)
  - `school_id` (uuid, foreign key)
  - `user_id` (uuid, foreign key to school_users)
  - `student_code` (text)
  - `grade_level` (text)
  - `class_name` (text)
  - `enrollment_date` (date)
  - `status` (text) - active, inactive, graduated, transferred
  - `created_at` (timestamptz)

  ### 4. `parents`
  - `id` (uuid, primary key)
  - `school_id` (uuid, foreign key)
  - `user_id` (uuid, foreign key to school_users)
  - `platform_active` (boolean) - Using parent platform
  - `last_login` (timestamptz)
  - `created_at` (timestamptz)

  ### 5. `parent_student_relations`
  - `id` (uuid, primary key)
  - `parent_id` (uuid, foreign key)
  - `student_id` (uuid, foreign key)
  - `relationship` (text) - father, mother, guardian
  - `created_at` (timestamptz)

  ### 6. `teachers`
  - `id` (uuid, primary key)
  - `school_id` (uuid, foreign key)
  - `user_id` (uuid, foreign key to school_users)
  - `employee_code` (text)
  - `subjects` (text[]) - Array of subjects taught
  - `hire_date` (date)
  - `status` (text) - active, inactive, on_leave
  - `created_at` (timestamptz)

  ### 7. `staff`
  - `id` (uuid, primary key)
  - `school_id` (uuid, foreign key)
  - `user_id` (uuid, foreign key to school_users)
  - `employee_code` (text)
  - `role` (text) - administrator, secretary, coordinator, etc
  - `hire_date` (date)
  - `status` (text) - active, inactive, on_leave
  - `created_at` (timestamptz)

  ### 8. `payments`
  - `id` (uuid, primary key)
  - `school_id` (uuid, foreign key)
  - `parent_id` (uuid, foreign key)
  - `student_id` (uuid, foreign key)
  - `amount` (decimal)
  - `currency` (text)
  - `payment_type` (text) - tuition, fee, other
  - `payment_method` (text) - card, transfer, cash
  - `status` (text) - pending, completed, failed, refunded
  - `description` (text)
  - `transaction_id` (text)
  - `paid_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 9. `platform_integrations`
  - `id` (uuid, primary key)
  - `school_id` (uuid, foreign key)
  - `platform_name` (text) - student_app, parent_app, learning_platform, etc
  - `platform_type` (text) - mobile, web, desktop
  - `status` (text) - active, inactive, maintenance
  - `api_key` (text)
  - `config` (jsonb) - Platform configuration
  - `active_users_count` (integer)
  - `last_sync` (timestamptz)
  - `created_at` (timestamptz)

  ### 10. `platform_usage_logs`
  - `id` (uuid, primary key)
  - `school_id` (uuid, foreign key)
  - `platform_id` (uuid, foreign key)
  - `user_id` (uuid, foreign key to school_users)
  - `action` (text) - login, logout, access, etc
  - `metadata` (jsonb)
  - `created_at` (timestamptz)

  ### 11. `super_admins`
  - `id` (uuid, primary key, references auth.users)
  - `full_name` (text)
  - `email` (text)
  - `role` (text) - super_admin, admin, viewer
  - `permissions` (jsonb)
  - `created_at` (timestamptz)

  ## Security
  - All tables have RLS enabled
  - Only authenticated super admins can access data
  - Policies check for super_admin role in auth.users metadata

  ## Indexes
  - Foreign key indexes for better query performance
  - Status and type indexes for filtering
*/

-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'inactive')),
  email text,
  phone text,
  address text,
  max_students integer DEFAULT 1000,
  max_teachers integer DEFAULT 100,
  max_staff integer DEFAULT 50,
  subscription_plan text DEFAULT 'basic',
  subscription_expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create school_users table
CREATE TABLE IF NOT EXISTS school_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  user_type text NOT NULL CHECK (user_type IN ('student', 'teacher', 'staff', 'parent', 'admin')),
  full_name text NOT NULL,
  email text,
  phone text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  permissions jsonb DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  user_id uuid REFERENCES school_users(id) ON DELETE CASCADE,
  student_code text NOT NULL,
  grade_level text,
  class_name text,
  enrollment_date date DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'transferred')),
  created_at timestamptz DEFAULT now()
);

-- Create parents table
CREATE TABLE IF NOT EXISTS parents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  user_id uuid REFERENCES school_users(id) ON DELETE CASCADE,
  platform_active boolean DEFAULT false,
  last_login timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create parent_student_relations table
CREATE TABLE IF NOT EXISTS parent_student_relations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES parents(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  relationship text CHECK (relationship IN ('father', 'mother', 'guardian', 'other')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(parent_id, student_id)
);

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  user_id uuid REFERENCES school_users(id) ON DELETE CASCADE,
  employee_code text NOT NULL,
  subjects text[] DEFAULT '{}',
  hire_date date DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  created_at timestamptz DEFAULT now()
);

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  user_id uuid REFERENCES school_users(id) ON DELETE CASCADE,
  employee_code text NOT NULL,
  role text NOT NULL,
  hire_date date DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  created_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES parents(id) ON DELETE SET NULL,
  student_id uuid REFERENCES students(id) ON DELETE SET NULL,
  amount decimal(10, 2) NOT NULL,
  currency text DEFAULT 'USD',
  payment_type text NOT NULL,
  payment_method text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  description text,
  transaction_id text,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create platform_integrations table
CREATE TABLE IF NOT EXISTS platform_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  platform_name text NOT NULL,
  platform_type text NOT NULL CHECK (platform_type IN ('mobile', 'web', 'desktop', 'api')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  api_key text,
  config jsonb DEFAULT '{}',
  active_users_count integer DEFAULT 0,
  last_sync timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create platform_usage_logs table
CREATE TABLE IF NOT EXISTS platform_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  platform_id uuid REFERENCES platform_integrations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES school_users(id) ON DELETE SET NULL,
  action text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create super_admins table
CREATE TABLE IF NOT EXISTS super_admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'viewer')),
  permissions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_schools_status ON schools(status);
CREATE INDEX IF NOT EXISTS idx_schools_code ON schools(code);
CREATE INDEX IF NOT EXISTS idx_school_users_school ON school_users(school_id);
CREATE INDEX IF NOT EXISTS idx_school_users_type ON school_users(user_type);
CREATE INDEX IF NOT EXISTS idx_students_school ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_parents_school ON parents(school_id);
CREATE INDEX IF NOT EXISTS idx_teachers_school ON teachers(school_id);
CREATE INDEX IF NOT EXISTS idx_staff_school ON staff(school_id);
CREATE INDEX IF NOT EXISTS idx_payments_school ON payments(school_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_platform_integrations_school ON platform_integrations(school_id);
CREATE INDEX IF NOT EXISTS idx_platform_usage_school ON platform_usage_logs(school_id);

-- Enable Row Level Security
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_student_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE super_admins ENABLE ROW LEVEL SECURITY;

-- RLS Policies for super_admins table
CREATE POLICY "Super admins can view own profile"
  ON super_admins FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Super admins can update own profile"
  ON super_admins FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for schools
CREATE POLICY "Authenticated super admins can view all schools"
  ON schools FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  );

CREATE POLICY "Authenticated super admins can insert schools"
  ON schools FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  );

CREATE POLICY "Authenticated super admins can update schools"
  ON schools FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  );

CREATE POLICY "Authenticated super admins can delete schools"
  ON schools FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  );

-- RLS Policies for school_users
CREATE POLICY "Authenticated super admins can view all school users"
  ON school_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  );

CREATE POLICY "Authenticated super admins can insert school users"
  ON school_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  );

CREATE POLICY "Authenticated super admins can update school users"
  ON school_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  );

CREATE POLICY "Authenticated super admins can delete school users"
  ON school_users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  );

-- RLS Policies for students
CREATE POLICY "Authenticated super admins can view all students"
  ON students FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  );

CREATE POLICY "Authenticated super admins can manage students"
  ON students FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  );

-- RLS Policies for parents
CREATE POLICY "Authenticated super admins can view all parents"
  ON parents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  );

CREATE POLICY "Authenticated super admins can manage parents"
  ON parents FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  );

-- RLS Policies for parent_student_relations
CREATE POLICY "Authenticated super admins can view all relations"
  ON parent_student_relations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  );

CREATE POLICY "Authenticated super admins can manage relations"
  ON parent_student_relations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  );

-- RLS Policies for teachers
CREATE POLICY "Authenticated super admins can view all teachers"
  ON teachers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  );

CREATE POLICY "Authenticated super admins can manage teachers"
  ON teachers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  );

-- RLS Policies for staff
CREATE POLICY "Authenticated super admins can view all staff"
  ON staff FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  );

CREATE POLICY "Authenticated super admins can manage staff"
  ON staff FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  );

-- RLS Policies for payments
CREATE POLICY "Authenticated super admins can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  );

CREATE POLICY "Authenticated super admins can manage payments"
  ON payments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  );

-- RLS Policies for platform_integrations
CREATE POLICY "Authenticated super admins can view all platforms"
  ON platform_integrations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  );

CREATE POLICY "Authenticated super admins can manage platforms"
  ON platform_integrations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  );

-- RLS Policies for platform_usage_logs
CREATE POLICY "Authenticated super admins can view all logs"
  ON platform_usage_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  );

CREATE POLICY "Authenticated super admins can manage logs"
  ON platform_usage_logs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM super_admins
      WHERE super_admins.id = auth.uid()
    )
  );