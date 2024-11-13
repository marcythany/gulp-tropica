import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
	videoId: { type: String, required: true },
	title: { type: String, required: true },
	thumbnail: { type: String },
	channelTitle: { type: String },
	description: { type: String },
});

export const Video = mongoose.model('Video', videoSchema);
