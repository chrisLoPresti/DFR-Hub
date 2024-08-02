import dbConnect from "@/libs/mongodb";
import MapMarker from "@/models/MapMarker";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    await dbConnect();
    const { position, name, color } = await request.json();

    const marker = new MapMarker({
      position,
      name,
      color,
    });

    const savedMarker = await marker.save();

    return NextResponse.json(
      {
        ...savedMarker._doc,
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

export async function GET() {
  try {
    await dbConnect();

    const markers = await MapMarker.find();

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
