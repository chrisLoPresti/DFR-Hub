import dbConnect from "@/libs/mongodb";
import MapMarker from "@/models/MapMarker";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";

export async function POST(request) {
  try {
    await dbConnect();
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET ?? "",
    });

    const { position, name, color } = await request.json();
    const marker = new MapMarker({
      position,
      name,
      color,
      created_by: token.id,
    });

    const savedMarker = await marker.save();

    return NextResponse.json(
      {
        ...savedMarker._doc,
        created_by: {
          name: token.name,
          email: token.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    } else {
      console.error("Error during signup:", error);
      return NextResponse.error();
    }
  }
}

export async function PUT(request) {
  try {
    await dbConnect();

    const { created_by, _id, ...marker } = await request.json();

    const updatedMarker = await MapMarker.findOneAndUpdate(
      { _id },
      { ...marker, updated_at: new Date() },
      { returnDocument: "after" }
    );

    return NextResponse.json(
      {
        ...updatedMarker._doc,
        created_by,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    } else {
      console.error("Error during signup:", error);
      return NextResponse.error();
    }
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { marker } = await request.json();

    const deletedMarker = await MapMarker.findByIdAndDelete(marker._id);

    return NextResponse.json(deletedMarker, { status: 200 });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    } else {
      console.error("Error during delete marker:", error);
      return NextResponse.error();
    }
  }
}

export async function GET() {
  try {
    await dbConnect();

    const markers = await MapMarker.find().populate({
      path: "created_by",
      model: "User",
      select: { name: 1, email: 1 },
    });

    return NextResponse.json(markers, { status: 200 });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    } else {
      console.error("Error during signup:", error);
      return NextResponse.error();
    }
  }
}
