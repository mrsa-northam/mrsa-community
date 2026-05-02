-- Update player contact metadata from the MRSA Tennis Player Meta Data CSV.
-- Matches existing tennis players by normalized full name; this does not create
-- new player rows. Claimed profiles keep user-entered values unless blank.
-- Duplicate source note: Abdeali Yamani appears twice in the CSV; the first
-- row is used because it appears first in the source export.
-- Phone numbers are normalized before storing:
-- - US/Canada numbers are saved as plain 10 digits.
-- - Leading country code 1 is stripped from 11 digit NANP numbers.
-- - Other international numbers are kept as digits only so they can still be
--   converted to E.164 by the app without corrupting the country code.

create or replace function public.normalize_player_phone(raw_phone text)
returns text
language sql
immutable
as $$
  with cleaned as (
    select regexp_replace(coalesce(raw_phone, ''), '\D', '', 'g') as digits
  )
  select nullif(
    case
      when length(digits) = 11 and left(digits, 1) = '1' then right(digits, 10)
      when length(digits) = 10 then digits
      else digits
    end,
    ''
  )
  from cleaned;
$$;

with player_contact_metadata_seed (source_order, email, full_name, jamaat_city, phone) as (
values
  (1, 'cutlerywalaabbas9@gmail.com', 'Abbas Cutlerywala', 'Chicago', '630-201-0263'),
  (2, 'myamani@gmail.com', 'Abdeali Yamani', 'The Woodlands', '832-654-4833'),
  (3, 'nacl.hny@gmail.com', 'Abdeali Yamani', 'The Woodlands', '832-741-0490'),
  (4, 'adnanbohri@gmail.com', 'Adnan Bohri', 'Chicago', '630-930-4058'),
  (5, 'adnandohad@gmail.com', 'Adnan Dohadwala', 'Plano', '469-500-4839'),
  (6, 'adnanz@gmail.com', 'Adnan Zafar', 'Philadelphia', '774-420-6576'),
  (7, 'ahussain2297@gmail.com', 'Ahmed Hussain', 'Detroit', '248-631-8671'),
  (8, 'asihorwala@gmail.com', 'Ahmed Sihorwala', 'Austin', '512-676-9872'),
  (9, 'alibohra@hotmail.com', 'Ali Bohra', 'Irvine', '818-251-6161'),
  (10, 'ayaandoriwala1@gmail.com', 'Aliasger Doriwala', 'Chicago', '224-425-9684'),
  (11, 'a_lukmanji@hotmail.com', 'Aliasger Lukmanji', 'Chicago', '312-307-4634'),
  (12, 'ammarh786@gmail.com', 'Ammar Hussain', 'Detroit', '248-989-6521'),
  (13, 'ammammar.lukmanji@gmail.com', 'Ammar Lukmanji', 'Chicago', '630-720-9785'),
  (14, 'azizbhetasi@gmail.com', 'Aziz Bhetasiwala', 'Pittsburgh', '+91-998-773-2200'),
  (15, 'shabbirmoosa@gmail.com', 'Burhanuddin Moosabhoy', 'Chicago', '708-717-4844'),
  (16, 'aquilar110@gmail.com', 'Daniyaal Rasheed', 'Chicago', '219-252-0310'),
  (17, 'sa786110@yahoo.com', 'Fida Husain Abadin', 'Chicago', '312-860-0714'),
  (18, 'hamzahussain1010@gmail.com', 'Hamza Hussain', 'Detroit', '734-751-1269'),
  (19, 'hamza9616@gmail.com', 'Hamza Kagalwala', 'Chicago', '832-613-2930'),
  (20, 'hashimhussain5253@gmail.com', 'Hashim Hussain', 'Detroit', '734-725-8640'),
  (21, 'hatim.burhani36@icloud.com', 'Hatim Burhani', 'Atlanta', '678-898-5318'),
  (22, 'hatim.jafferji@gmail.com', 'Hatim Jafferji', 'Chicago', '630-776-0783'),
  (23, 'hussain.ezzisigns@gmail.com', 'Hussain Shakir', 'Houston', '713-820-3441'),
  (24, 'hboxwalla@gmail.com', 'Hussain Boxwalla', 'Chicago', '708-860-7866'),
  (25, 'hussain.dalal@gmail.com', 'Hussain Dalal', 'Minneapolis', '612-707-1283'),
  (26, 'hussainalik@icloud.com', 'Hussain Kanchwala', 'Houston', '346-546-6546'),
  (27, 'hmalbari@gmail.com', 'Hussain Malbari', 'Austin', '512-696-7268'),
  (28, 'hussain.morbi@gmail.com', 'Hussain Morbiwala', 'Chicago', '847-219-4586'),
  (29, 'huzabb@gmail.com', 'Huzaifa Doctor', 'Chicago', '614-327-0082'),
  (30, 'huzefa52@gmail.com', 'Huzefa Gulamhusein', 'Chicago', '309-361-5026'),
  (31, 'hraja1@hotmail.com', 'Huzefa Raja', 'Chicago', '630-337-7860'),
  (32, 'ibrahim.m.gandhi.10@gmail.com', 'Ibrahim Gandhi', 'Houston', '346-332-7918'),
  (33, '', 'Ibrahim Tayeb', 'Chicago', '510-298-7759'),
  (34, 'idrisghulam52@gmail.com', 'Idris Ghulam', 'Houston', '832-941-2930'),
  (35, 'melammaster@gmail.com', 'Melam Master', 'Atlanta', '678-699-6699'),
  (36, 'wakingsage@gmail.com', 'MM Bashir', 'Chicago', '630-492-7692'),
  (37, 'mohamedluk0416@gmail.com', 'Mohamed Lukmanji', 'Chicago', '630-596-6352'),
  (38, 'madanish5324@gmail.com', 'Mohammed Danish', 'Chicago', '908-907-4547'),
  (39, 'mohammadhalai321@gmail.com', 'Mohammed Halai', 'Mississauga', '908-913-4101'),
  (40, 'aquilar110@gmail.com', 'Moiz Rasheed', 'Chicago', '219-252-0310'),
  (41, 'moizbroachwala@gmail.com', 'Moiz Broachwala', 'Chicago', '312-874-9178'),
  (42, 'coolmasterdoc@gmail.com', 'Moiz Master', 'Atlanta', '706-299-0001'),
  (43, 'mgheewal@andrew.cmu.edu', 'Mufaddal Gheewala', 'Pittsburgh', '814-826-8538'),
  (44, 'hussainmd@hotmail.com', 'Murtaza Hussain', 'Detroit', '248-470-7035'),
  (45, 'mustafasn2019@gmail.com', 'Mustafa Kanchwala', 'Chicago', '+91-844-660-8861'),
  (46, 'mq.kakajiwala@gmail.com', 'Mustafa Qutbuddin', 'Vancouver', '778-444-0066'),
  (47, 'murtuzaraja@gmail.com', 'Mustafa Raja', 'Vancouver', '604-603-5152'),
  (48, 'mustafa.zirapury@gmail.com', 'Mustafa Zirapury', 'Detroit', '734-725-1599'),
  (49, 'qhussain@webvisionsinc.net', 'Qasim Hussain', 'Detroit', '734-578-7057'),
  (50, 'qusai.luk2027@gmail.com', 'Qusai Lukmanji', 'Chicago', '630-290-0550'),
  (51, 'shabbirhalai226@gmail.com', 'Shabbir Halai', 'Mississauga', '437-388-6370'),
  (52, 'tsalim786@gmail.com', 'Taha Salim', 'New Jersey', '201-982-0330'),
  (53, 'taha.zirapury@gmail.com', 'Taha Zirapury', 'Detroit', '734-788-0895'),
  (54, 'adnanbohri@gmail.com', 'Taher Bohri', 'Chicago', '630-930-4058'),
  (55, 'taher007saeed@gmail.com', 'Taher Saeed', 'Philadelphia', '484-684-9555'),
  (56, 'tayzoon@hotmail.ca', 'Tayzoon Ismail', 'Mississauga', '647-227-1805'),
  (57, 'usuf.husain@gmail.com', 'Usuf Husain', 'Chicago', '908-337-8294'),
  (58, 'z.salehbhai@gmail.com', 'Zoeb Salehbhai', 'Chicago', '224-456-5331'),
  (59, 'raj5251@hotmail.com', 'Zohair Bharoochwala', 'Chicago', '847-924-7027'),
  (60, 'zulfiimani@gmail.com', 'Zulfi Imani', 'Chicago', '732-692-7990')
),

normalized_seed as (
  select
    source_order,
    nullif(trim(lower(email)), '') as email,
    trim(full_name) as full_name,
    lower(regexp_replace(trim(full_name), '\s+', ' ', 'g')) as normalized_name,
    nullif(trim(jamaat_city), '') as jamaat_city,
    public.normalize_player_phone(phone) as phone
  from player_contact_metadata_seed
),
deduped_seed as (
  select distinct on (normalized_name)
    email,
    full_name,
    normalized_name,
    jamaat_city,
    phone
  from normalized_seed
  order by normalized_name, source_order
)
update public.players p
set
  email = case
    when (p.auth_user_id is null or p.claim_status <> 'claimed' or nullif(trim(p.email::text), '') is null)
      then coalesce(d.email::citext, p.email)
    else p.email
  end,
  phone = case
    when (p.auth_user_id is null or p.claim_status <> 'claimed' or nullif(trim(p.phone), '') is null)
      then coalesce(d.phone, p.phone)
    else p.phone
  end,
  jamaat_city = case
    when (p.auth_user_id is null or p.claim_status <> 'claimed' or nullif(trim(p.jamaat_city), '') is null)
      then coalesce(d.jamaat_city, p.jamaat_city)
    else p.jamaat_city
  end
from deduped_seed d, public.sports s
where s.id = p.sport_id
  and s.slug = 'tennis'
  and p.normalized_name = d.normalized_name;

-- Normalize any existing player phone values too, including test profiles and
-- already-imported historical rows.
update public.players
set phone = public.normalize_player_phone(phone)
where nullif(trim(phone), '') is not null;
