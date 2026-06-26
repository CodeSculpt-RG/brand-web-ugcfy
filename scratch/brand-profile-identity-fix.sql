-- 1. Check duplicate brand profiles by user_id
select user_id, count(*)
from public.brand_profiles
where user_id is not null
group by user_id
having count(*) > 1;

-- 2. Check duplicate brand profiles by contact_email
select lower(contact_email) as email, count(*)
from public.brand_profiles
where contact_email is not null
group by lower(contact_email)
having count(*) > 1;

-- 3. Inspect profiles without auth link
select id, user_id, contact_email, company_name, approval_status
from public.brand_profiles
where user_id is null
limit 50;

-- 4. Safe indexes (Apply ONLY if the above queries show NO duplicates)
create unique index if not exists idx_brand_profiles_user_id_unique
on public.brand_profiles(user_id)
where user_id is not null;

create unique index if not exists idx_brand_profiles_email_unique
on public.brand_profiles(lower(contact_email))
where contact_email is not null;
