// import { getServerSession } from "next-auth";
// import { authOptions } from "../../auth/[...nextauth]/options";
// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/user.model";
// import { User } from "next-auth";
// import { NextResponse } from "next/server";

// export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
//     const messageId = params.messageid;
//     await dbConnect();

//     // session of login user
//     const session = await getServerSession(authOptions)
//     const user: User = session?.user as User

//     if (!session || !session.user) {
//         return Response.json({
//             success: false,
//             message: "not authenticated"
//         }, { status: 401 })
//     }

//     try {
//         const updateResult = await UserModel.updateOne(
//             { _id: user._id }, // find the current login user in db
//             { $pull: { messages: { _id: messageId } } } // pull a document(remove), message array, find the document with message id 
//         )
//         if (updateResult.modifiedCount === 0) {
//             return Response.json({
//                 success: false,
//                 message: "Message not found or already deleted"
//             }, { status: 404 })
//         }
//         return NextResponse.json({
//             success: true,
//             message: "Message deleted"
//         }, { status: 200 })
//     } catch (error) {
//         console.log("eror in delete message route", error)
//         return Response.json({
//             success: false,
//             message: "Cannot delete the message"
//         }, { status: 500 })
//     }
// }

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    const messageId = params.messageid;
    await dbConnect();

    // session of login user
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "not authenticated"
        }, { status: 401 });
    }

    try {
        const updateResult = await UserModel.updateOne(
            { _id: user._id }, // find the current login user in db
            { $pull: { messages: { _id: messageId } } } // pull a document(remove), message array, find the document with message id 
        );
        if (updateResult.modifiedCount === 0) {
            return NextResponse.json({
                success: false,
                message: "Message not found or already deleted"
            }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            message: "Message deleted"
        }, { status: 200 });
    } catch (error) {
        console.log("Error in delete message route", error);
        return NextResponse.json({
            success: false,
            message: "Cannot delete the message"
        }, { status: 500 });
    }
}