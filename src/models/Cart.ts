import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICartItem {
  _id?: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  variant?: {
    name?: string;
    unit?: string;
    sellingPrice?: number;
  };
  quantity: number;
}

export interface ICart extends Document {
  customer: mongoose.Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  variant: {
    name: String,
    unit: String,
    sellingPrice: Number
  },
  quantity: { type: Number, required: true, min: 1 }
});

const CartSchema = new Schema<ICart>({
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true },
  items: [CartItemSchema]
}, { timestamps: true });

const Cart: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

export default Cart;
