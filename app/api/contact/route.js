import { connectMongoDB } from "@/libs/connectDb";
import { NextResponse } from "next/server";
import Message from "@/models/contact";
 import { sendContactUsReply } from "../nodemailer/route";


// POST method for saving a new contact message and sending a reply
export async function POST(req) {
    try {
        await connectMongoDB();
        const data = await req.json();
        const newMessage = new Message(data);
        await newMessage.save();
        await sendContactUsReply(data);
        console.log("Request sent successfully");
        return NextResponse.json({ message: "Request sent" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to send request" });
    }
}

export async function GET(req) {
    try {
      await connectMongoDB();
      const contactMessages = await Message.find(); // Fetch all contact messages
      return NextResponse.json(contactMessages);
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: "Failed to fetch contact messages" }, { status: 500 });
    }
  }