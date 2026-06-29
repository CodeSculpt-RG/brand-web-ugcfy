-- P1 Brand Profile + Onboarding + KYC Integration

-- 1. Extend brand_profiles table
alter table public.brand_profiles
add column if not exists brand_name text;

alter table public.brand_profiles
add column if not exists company_name text;

alter table public.brand_profiles
add column if not exists business_type text;

alter table public.brand_profiles
add column if not exists website text;

alter table public.brand_profiles
add column if not exists gst_number text;

alter table public.brand_profiles
add column if not exists contact_name text;

alter table public.brand_profiles
add column if not exists contact_phone text;

alter table public.brand_profiles
add column if not exists logo_url text;

alter table public.brand_profiles
add column if not exists approval_status text not null default 'profile_incomplete';

alter table public.brand_profiles
add column if not exists onboarding_completed_at timestamptz;

alter table public.brand_profiles
add column if not exists verification_submitted_at timestamptz;

alter table public.brand_profiles
add column if not exists rejection_reason text;

alter table public.brand_profiles
add column if not exists updated_at timestamptz default now();

create index if not exists idx_brand_profiles_user_id
on public.brand_profiles(user_id);

create index if not exists idx_brand_profiles_email
on public.brand_profiles(email);

create index if not exists idx_brand_profiles_approval_status
on public.brand_profiles(approval_status);

-- 2. Create brand_kyc_documents table
create table if not exists public.brand_kyc_documents (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brand_profiles(id) on delete cascade,
  document_type text not null,
  bucket text not null,
  path text not null,
  original_filename text,
  mime_type text,
  size_bytes bigint,
  status text not null default 'submitted',
  uploaded_at timestamptz not null default now()
);

create index if not exists idx_brand_kyc_documents_brand_id
on public.brand_kyc_documents(brand_id);

create index if not exists idx_brand_kyc_documents_status
on public.brand_kyc_documents(status);

-- 3. Storage bucket setup (for manual run or migration tool)
-- Note: Create a private bucket named 'brand-kyc-documents'
-- insert into storage.buckets (id, name, public) values ('brand-kyc-documents', 'brand-kyc-documents', false);

-- Storage policies for brand-kyc-documents (Allow brands to upload their own files)
-- create policy "Brands can upload their own KYC docs"
-- on storage.objects for insert
-- to authenticated
-- with check ( bucket_id = 'brand-kyc-documents' and auth.uid()::text = (string_to_array(name, '/'))[1] );

-- create policy "Brands can read their own KYC docs"
-- on storage.objects for select
-- to authenticated
-- using ( bucket_id = 'brand-kyc-documents' and auth.uid()::text = (string_to_array(name, '/'))[1] );
