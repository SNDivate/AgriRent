// import NextAuth from 'next-auth';
// import CredentialsProvider from "next-auth/providers/credentials";
// import { connectMongoDB } from '@/libs/connectDb';
// import User from '@/models/user';
// import Admin from '@/models/admin';
// export const authOptions = ({
//     providers: [
//         CredentialsProvider({
//             name: 'Credentials',
//             credentials: {},
//             async authorize(credentials){
//                 try{
//                     await connectMongoDB();
//                     const email = credentials.email;
//                     const password = credentials.password;
//                    let userRole;
//                    let id;
                   
//         console.log(credentials);
//         const user = await User.findOne({email: email});
//         const admin = await Admin.findOne({email: email});
//         console.log(user);
//         if(user){
//             userRole = "user";
//             id = user._id;
//         }else if(admin){
//             userRole = "admin";
//             id = admin.admin._id;
//         }else{
//             return null;
//         }
//         const isVerified = (user && user.password === password) || (admin && admin.password === password);
//     if(isVerified){
//         const userWithRole = {
//             ...user ?.toObject(),
            
//             role: userRole,
//             id: _id
//         };
//         return Promise.resolve(userWithRole);
//     }    
//     else{
//         return null;
//     }       
//     }catch(error){
//         console.error('Error during authorization:', error);
//         return null;
//     }
//             },
//         }),
//     ],
//     session:{
//         sessionCallback: async(session, user) =>{
//             session.user = {...user, role: user.role, id:user._id};
//             return Promise.resolve(session);
//         },
//     },
//     callbacks:{
//         async jwt({token, account, user}){
//             if(account){
//                 token.accessToken = account.access_token;
//                 token.role = user.role;
//                 token.id =user._id;
//             }
//             return token;
//         },
//         async session({session ,token}){
//             session.user.accessToken = token.accessToken;
//             session.user.role = token.role;
//             session.user._id = token._id;

//             return session;
//         }

//     },
//     secret: process.env.NEXTAUTH_SECRET,
//     Pages: {
//         signIn: "/",
//     },
// });
// const handler = NextAuth(authOptions);
// export {handler as GET, handler as POST};



import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from '@/libs/connectDb';
import User from '@/models/user';
import Admin from '@/models/admin';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials) {
        try {
          await connectMongoDB();
          
          const { email, password } = credentials;
          
          // Find user or admin
          const user = await User.findOne({ email });
          const admin = await Admin.findOne({ email });

          if (!user && !admin) {
            return null;
          }

          // Determine if it's a user or admin and verify password
          if (user && user.password === password) {
            return {
              id: user._id.toString(), // Convert ObjectId to string
              email: user.email,
              name: user.name,
              role: 'user',
              // Include any other user fields you need
            };
          }

          if (admin && admin.password === password) {
            return {
              id: admin._id.toString(), // Convert ObjectId to string
              email: admin.email,
              name: admin.fullname,
              role: 'admin',
              // Include any other admin fields you need
            };
          }

          return null;

        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Add user information to the JWT token
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user information to the session
      session.user = {
        id: token.id,
        role: token.role,
        email: token.email,
        name: token.name,
      };
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };