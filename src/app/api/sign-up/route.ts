import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/user.model';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await req.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    // if user is already verified
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: 'username is already taken',
        },
        { status: 400 }
      );
    }
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // if user exist by email, there will be two case, if not exist then create a user and save it, and send email
    // if user exist, then check if it is verified, then return that user already exist with this email
    // else, if not verified, maybe it is updating details
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: 'user is already exist with this email',
          },
          { status: 500 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword; // updating the password
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      // if user is not verified, that mean its first time the user is registering
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date(); // its a object, thats why we can change it even though is constant
      expiryDate.setHours(expiryDate.getHours() + 1); // current time + next 1 hour

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    // send verification email
    const emailResponse = await sendVerificationEmail({
      email,
      username,
      verifyCode,
    });
    console.log("response", emailResponse);

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: 'User registered succesfully!!!,please verify your email',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('error registering message', error);
    return Response.json(
      {
        success: false,
        message: 'Error while registering user',
      },
      { status: 500 }
    );
  }
}
