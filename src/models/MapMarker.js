import { Schema, model, models } from "mongoose";

const MapMarkerSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  position: {
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
    elevation: {
      type: Number,
    },
  },
  color: {
    type: String,
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const MapMarker = models.MapMarker || model("MapMarker", MapMarkerSchema);
export default MapMarker;
