//连接到本地开启的mongodb，mongodb默认监听27017端口
import mongoose from 'mongoose';

const { Schema } = mongoose;

const obj = {
  userId: { type: Number, required: true },
  writeTime: { type: Date, default: Date.now() }
};

const objSchema = new Schema(obj);
export default mongoose.model('Orders', objSchema);
