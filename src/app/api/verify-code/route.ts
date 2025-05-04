import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, code } = await request.json();

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUsername })

        if (!user) {
            return Response.json({
                success: false,
                message: "user not found"
            }, { status: 500 })
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date() // expiration time should be greater in database

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()
            return Response.json({
                success: true,
                message: "account verified successfully"
            }, { status: 200 })
        } else if (!isCodeNotExpired) { // if code expired
            return Response.json({
                success: false,
                message: "verification code is expired, please sign up again"
            }, { status: 400 })
        } else {
            return Response.json({
                success: false,
                message: "Incorrect verification code"
            }, { status: 400 })
        }

    } catch (error) {
        console.error("error checking verifying user", error)
        return Response.json({
            success: false,
            message: "Error Verifying user"
        }, { status: 500 })
    }
}