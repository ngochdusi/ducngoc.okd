import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Gửi request đăng ký
    const registerResponse = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    const registerData = await registerResponse.json()

    if (!registerData.success) {
      return NextResponse.json(registerData, { status: 400 }) // Trả về lỗi nếu đăng ký thất bại
    }

    // Sau khi đăng ký thành công, tự động đăng nhập
    const loginResponse = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    const loginData = await loginResponse.json()

    if (loginData.success) {
      // Đặt cookie đăng nhập
      cookies().set("user", username, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 tuần
        path: "/",
      })

      // Chuyển hướng đến trang chủ hoặc dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.json({ success: false, description: "Lỗi khi đăng nhập" }, { status: 500 })
  } catch (error) {
    return NextResponse.json({ success: false, description: "Lỗi máy chủ" }, { status: 500 })
  }
}
