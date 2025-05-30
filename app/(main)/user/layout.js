import AppSidebar from "@/app/components/sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import{redirect} from "next/navigation";
export default async function RootLayout({children}){
    const session = await getServerSession(authOptions);
    const role = session?.user?.role
    if(!(role=== "user")||!session){
        console.log("unauthorised")
        redirect("/login");

    }
    return(
        <div className="flex h-screen">
        <AppSidebar />
        <div className="w-full h-screen overflow-y-auto " >
            {children}
          </div> 
          </div>
    );
} 