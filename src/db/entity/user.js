//连接到本地开启的mongodb，mongodb默认监听27017端口
import mongoose from 'mongoose';

const { Schema } = mongoose;

const users = {
  userId: { type: Number, required: true },
  name: { type: String, default: '佚名' },
  desc: { type: String, default: '描述' }
};

const objSchema = new Schema(users);

export default mongoose.model('Users', objSchema);
