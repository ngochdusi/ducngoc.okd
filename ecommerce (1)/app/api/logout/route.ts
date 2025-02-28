import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Clear session cookie
    ;(await cookies()).delete("user")

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, description: "Lỗi khi đăng xuất" }, { status: 500 })
  }
}

