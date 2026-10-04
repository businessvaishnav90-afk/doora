-- Doora Initial Schema

CREATE TYPE user_role AS ENUM ('customer', 'worker', 'admin', 'staff');
CREATE TYPE language_pref AS ENUM ('en', 'ml');
CREATE TYPE account_state AS ENUM ('active', 'suspended', 'pending_deletion');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role user_role NOT NULL,
    full_name TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    email TEXT,
    language_preference language_pref DEFAULT 'ml',
    account_status account_state DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE kyc_state AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE worker_profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    kyc_status kyc_state DEFAULT 'pending',
    id_proof_url TEXT,
    skill_certificates_urls TEXT[],
    is_online BOOLEAN DEFAULT false,
    current_latitude NUMERIC,
    current_longitude NUMERIC,
    overall_rating DECIMAL DEFAULT 5.0,
    total_jobs_completed INTEGER DEFAULT 0,
    wallet_balance DECIMAL DEFAULT 0.00
);

CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon_url TEXT,
    base_visiting_fee DECIMAL NOT NULL,
    is_active BOOLEAN DEFAULT true
);

CREATE TYPE job_mode AS ENUM ('quick_dispatch', 'direct_selection');
CREATE TYPE job_state AS ENUM ('pending', 'dispatched', 'accepted', 'arrived', 'in_progress', 'completed', 'cancelled');

CREATE TABLE job_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES users(id),
    worker_id UUID REFERENCES users(id),
    service_category_id UUID NOT NULL REFERENCES service_categories(id),
    booking_mode job_mode NOT NULL,
    problem_description TEXT,
    media_urls TEXT[],
    job_status job_state DEFAULT 'pending',
    start_otp VARCHAR(4),
    cancellation_reason TEXT,
    scheduled_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE pay_mode AS ENUM ('cash', 'upi', 'wallet');
CREATE TYPE pay_state AS ENUM ('pending', 'paid', 'refunded');

CREATE TABLE job_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES job_requests(id) ON DELETE CASCADE,
    service_fee DECIMAL NOT NULL,
    material_fee DECIMAL NOT NULL DEFAULT 0.00,
    platform_commission DECIMAL NOT NULL,
    total_amount DECIMAL NOT NULL,
    payment_mode pay_mode NOT NULL,
    payment_status pay_state DEFAULT 'pending'
);

CREATE TYPE dispute_state AS ENUM ('open', 'under_review', 'resolved');

CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES job_requests(id),
    raised_by_id UUID NOT NULL REFERENCES users(id),
    reason TEXT NOT NULL,
    status dispute_state DEFAULT 'open',
    resolution_notes TEXT
);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- Basic RLS for Users
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Worker Profiles RLS
CREATE POLICY "Anyone can view active worker profiles" ON worker_profiles
  FOR SELECT USING (kyc_status = 'approved');
CREATE POLICY "Workers can manage their own profile" ON worker_profiles
  FOR ALL USING (auth.uid() = id);

-- Service Categories (Public read)
CREATE POLICY "Anyone can view active categories" ON service_categories
  FOR SELECT USING (is_active = true);

-- Job Requests
CREATE POLICY "Customers can view their own requests" ON job_requests
  FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Workers can view assigned requests" ON job_requests
  FOR SELECT USING (auth.uid() = worker_id);
CREATE POLICY "Customers can create requests" ON job_requests
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Job Invoices
CREATE POLICY "Invoices visible to customer and worker of the job" ON job_invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM job_requests jr 
      WHERE jr.id = job_invoices.job_id 
      AND (jr.customer_id = auth.uid() OR jr.worker_id = auth.uid())
    )
  );

-- Disputes
CREATE POLICY "Disputes visible to involved parties" ON disputes
  FOR SELECT USING (
    auth.uid() = raised_by_id OR 
    EXISTS (
      SELECT 1 FROM job_requests jr 
      WHERE jr.id = disputes.job_id AND jr.worker_id = auth.uid()
    )
  );
CREATE POLICY "Users can raise disputes" ON disputes
  FOR INSERT WITH CHECK (auth.uid() = raised_by_id);
