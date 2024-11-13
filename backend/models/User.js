import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	name: { type: String },
	bio: { type: String },
	avatarUrl: { type: String, default: '' }, // Adicionando o campo avatarUrl
	// Outros campos podem ser adicionados conforme necessário
});

UserSchema.methods.validPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

export default mongoose.model('User', UserSchema);
