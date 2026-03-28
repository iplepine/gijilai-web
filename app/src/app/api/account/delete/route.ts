import { NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabaseServer';

function getSupabaseAdmin() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function DELETE() {
  try {
    // 현재 로그인한 사용자 확인
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: '인증되지 않은 요청입니다.' }, { status: 401 });
    }

    // service_role로 auth.users 삭제 → CASCADE로 profiles 및 모든 하위 데이터 자동 삭제
    const admin = getSupabaseAdmin();
    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error('Failed to delete auth user:', deleteError.message);
      return NextResponse.json({ error: '회원 탈퇴 처리 중 오류가 발생했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
