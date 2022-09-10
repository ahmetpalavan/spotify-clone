import NextAuth from "next-auth"
import SpotifyProvider from 'next-auth/providers/spotify'
import  spotifyApi,{ LOGIN_URL } from "../../../lib/Spotify"

async function refreshAccessToken(token){
try {
    spotifyApi.setAccessToken(token.accessToken)
    spotifyApi.setRefresToken(token.refreshToken)
    const {body: refreshedToken}= await spotifyApi.refreshAccessToken();
    // console.log('REFRESHED IS TOKEN', refreshedToken);
    return {
    ...token,
    accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now + refreshedToken.expires_in * 1000, // = 1 saat 3600 spotify api//
    refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    }
} catch (error) {
    console.error(error)
}
return {
    ...token,
    error:"refreshAccessTokenError",
};
}

export default NextAuth({
  // Configure one or more authentication providers
    providers: [
        SpotifyProvider({
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
        clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
        authorization:LOGIN_URL,
    }),
    // ...add more providers here
    ],
    secret: process.env.JWT_SECRET,
    pages:{
    signIn:'/login'
    },
    callbacks:{
    async jwt({token,user,account}){
        //initial sign in
        if(account && user){
        return{
            ...token,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            username: account.providerAccountId,
            accessTokenExpires: account.expires_at * 1000,
        }
        }
        //erişim belirtecinin süresi henüz dolmadıysa, önceki belirteci döndür//
        if(Date.now() < token.accessTokenExpires){
        console.log('mevcut erişim belirteci geçerlidir');
        return token
        }
        //erişim belirtecinin süresi doldu, bu yüzden onu yenilememiz gerekiyor//
        console.log("erişim belirtecinin süresi doldu, yenileniyor");
        return await refreshAccessToken(token);
    },
    async session (
        {session, token}
    ) {
        session.user.accessToken=token.accessToken;
        session.user.refreshToken=token.refreshToken;
        session.user.username=token.username;
    return session;
    }, 
    },
})