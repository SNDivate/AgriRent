import { connectMongoDB } from "@/libs/connectDb";
import { NextResponse } from "next/server";
import Admin from "@/models/admin";

// CREATE ADMIN
export async function POST(req) {
    try {
        await connectMongoDB();
        const data = await req.json();
        const { fullname, phone, email, password } = data;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return NextResponse.json(
                { error: "Admin with this email already exists" },
                { status: 409 }
            );
        }

        const newAdmin = new Admin({
            fullname,
            phone,
            email,
            password // Note: Should be hashed in production
        });

        await newAdmin.save();

        // Remove password from response
        const adminResponse = newAdmin.toObject();
        delete adminResponse.password;

        console.log("Admin registered successfully");
        return NextResponse.json(
            { message: "Admin registered successfully", admin: adminResponse },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error Creating Admin:", error);
        return NextResponse.json(
            { error: "Failed to Register Admin" },
            { status: 500 }
        );
    }
}

// GET ADMIN
export async function GET(req) {
    try {
        await connectMongoDB();
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");
        const id = searchParams.get("id");

        let admin;
        if (email) {
            admin = await Admin.findOne({ email }).select("-password");
        } else if (id) {
            admin = await Admin.findById(id).select("-password");
        } else {
            admin = await Admin.find().select("-password");
        }

        if (!admin) {
            return NextResponse.json(
                { error: "Admin not found" },
                { status: 404 }
            );
        }

        console.log("Admin data fetched successfully");
        return NextResponse.json(admin, { status: 200 });
    } catch (error) {
        console.error("Error Fetching Admin:", error);
        return NextResponse.json(
            { error: "Failed to fetch Admin" },
            { status: 500 }
        );
    }
}

// UPDATE ADMIN
export async function PUT(req) {
    try {
        await connectMongoDB();
        const data = await req.json();
        const { id, updates } = data;

        if (!id) {
            return NextResponse.json(
                { error: "Admin ID is required" },
                { status: 400 }
            );
        }

        const existingAdmin = await Admin.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        ).select("-password");

        if (!existingAdmin) {
            return NextResponse.json(
                { error: "Admin not found" },
                { status: 404 }
            );
        }

        console.log("Admin Updated Successfully", existingAdmin);
        return NextResponse.json(
            { message: "Admin updated successfully", admin: existingAdmin },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating admin:", error);
        return NextResponse.json(
            { error: "Failed to Update Admin" },
            { status: 500 }
        );
    }
}