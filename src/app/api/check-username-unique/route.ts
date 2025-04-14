import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod"


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {

    await dbConnect()

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username') // extracting username from request params
        }
        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)

        // console.log("email checking",result)
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters'
            }, { status: 400 })
        }
        const { username } = result.data

        const existingVerifieduser = await UserModel.findOne({ username, isVerified: true })
        // if user is already is verified, then we cannot take the username
        if (existingVerifieduser) {
            return Response.json({
                success: false,
                message: "username is already taken"
            }, { status: 400 })
        }

        return Response.json({
            success: true,
            message: "username is unique"
        }, { status: 400 })

    } catch (error) {
        console.error("error checking username", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        }, { status: 500 })
    }
}

