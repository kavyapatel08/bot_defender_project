import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hejebfcojxomnisetfri.supabase.co';
const supabaseAnonKey = 'sb_publishable_k0UiSL4QM9i4uSRgtJoQWg_2pMij8PQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);