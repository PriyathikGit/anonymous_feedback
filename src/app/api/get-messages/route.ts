import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(request: Request) {
    await dbConnect();

    // session of login user
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "not authenticated"
        }, { status: 401 })
    }

    // we had convert the user id to string
    // while writing aggrigation pipeline, it dont automatically convert user id to object it, 
    // we have to do it manually, in built methods do it automatically
    const userId = new mongoose.Types.ObjectId(user?._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } }, // match the id with current user id
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])
        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "user not found"
            }, { status: 401 })
        }
        return Response.json({
            success: true,
            messages: user[0].messages
        }, { status: 200 })
    } catch (error) {
        console.log("Error in getting user message: ", error)
        return Response.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 })
    }
}