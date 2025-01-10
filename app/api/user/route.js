import { NextResponse } from "next/server";
import { connectMongoDB } from "@/libs/connectDb";
import User from "@/models/user";


export async function POST(req) {
    try {
        await connectMongoDB();
        const data = await req.json();
        const { name, email, phone, gender, password } = data;
        console.log(data);
        const newUser = new User({
            name,
            email,
            phone,
            gender,
            password
        });
        await newUser.save();
        console.log("User Registered Successfully!", newUser);
        return NextResponse.json({ message: "User Registered Successfully", user: newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Failed to Register" }); // Corrected this line
    }
}
export async function PUT(req) {
    try{
        await connectMongoDB();
        const data = await req.json();
        console.log(data);
        const {name, email, phone, gender, password} = data;
         const existingUser = await User.findByIdAndUpdate({_id: name},{
            email,
            phone,
            gender,
            password
         },{new: true}
         );
         console.log(existingUser);
         if(!existingUser){
            return NextResponse.json({error: "User not found"});
         }
         console.log("User Updated Syccessfully", existingUser);
         return NextResponse.json({message: "User Updated Successfully", department:existingUser});
    }catch(error){
        console.error("Error updating User:", error);
        return NextResponse.json({error:"Failed to Update"});
    }
    
}
// export async function GET() {
//     try{
//         await connectMongoDB();
//         const users = await User.find();

//         console.log("Fetched Data Successfully", users);
//         return NextResponse.json(users);
//     }
//     catch(error){
//         console.error("Error Fetching users:", error);
//         return NextResponse.json({error: "Failed to fetch Users"});
//     }
    
// }

// In your API route file
export async function GET(req) {
    try {
        await connectMongoDB();
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        let users;
        if (email) {
            // If email is provided, find specific user
            users = await User.findOne({ email });
            if (!users) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }
        } else {
            // If no email, return all users
            users = await User.find();
        }

        console.log("Fetched Data Successfully", users);
        return NextResponse.json(users);
    }
    catch (error) {
        console.error("Error Fetching users:", error);
        return NextResponse.json({ error: "Failed to fetch Users" }, { status: 500 });
    }
}
export async function DELETE(req) {
try{
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("_id");
    const deletedDepartment = await User.findByIdAndDelete(_id);
if(!deletedUser){
    return NextResponse.json({error: "User not found"});

}
console.log("User Deleted Sucessfully" , deletedUser);
return NextResponse.json({message: "User Deleted Successfully"});
}    catch(error){
    console.error("Error deleting department :", error);
    return NextResponse.json({error: "Failed to Delete"});
}
}
