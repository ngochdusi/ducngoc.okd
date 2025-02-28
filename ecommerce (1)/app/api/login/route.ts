import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Giả lập database (Thay thế bằng DB thực tế nếu cần)
const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "password123"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Kiểm tra thông tin đăng nhập
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Set session cookie
      cookies().set("user", username, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 tuần
        path: "/",
      })

      return NextResponse.json({ success: true, message: "Đăng nhập thành công" })
    } else {
      return NextResponse.json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Lỗi server" }, { status: 500 })
  }
}
