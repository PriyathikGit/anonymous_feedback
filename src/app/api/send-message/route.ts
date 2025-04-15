import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { Message } from "@/model/user.model";

export async function POST(request: Request) {
    await dbConnect()

    const { username, content } = await request.json();
    console.log(username, content)
    try {
        const user = await UserModel.findOne({ username })
        console.log(user)
        if (!user) {
            return Response.json({
                success: false,
                message: "user not found"
            }, { status: 404 })
        }

        // is user accepting the message
        if (!user.isAcceptingMessages) {
            return Response.json({
                success: false,
                message: "user is not accepting the message"
            }, { status: 403 })
        }

        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json({
            success: true,
            message: "message sent succesfully"
        }, { status: 200 })
    } catch (error) {
        console.log("Error in sending message: ", error)
        return Response.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 })
    }
}

