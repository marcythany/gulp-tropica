import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	name: { type: String },
	bio: { type: String },
	// Adicione outros campos que desejar
});

UserSchema.methods.validPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

export default mongoose.model('User', UserSchema);
