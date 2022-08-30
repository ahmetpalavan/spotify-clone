import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server"; //sonraki yanıt//
export async function middleWare(req) {
    //kullanıcı oturum açtıysa belirteç var olacak//
    const token = await getToken ({req, secret:process.env.JWT_SECRET});
    const {pathname}= req.nextUrl;
    //  aşağıdakiler doğruysa isteğe izin ver//
    //  1) sonraki yetkilendirme oturumu ve sağlayıcının getirilmesi için bir istektir//
    //  2) the token exist//
    if(pathname.includes('/api/auth') || token){
        return NextResponse.next();
    }
    //jetonları yoksa VE korumalı bir rota istiyorlarsa, onları oturum açmaya yönlendirin //
    if(!token && pathname !== '/login'){
        return NextResponse.redirect('/login')
    }
    
}