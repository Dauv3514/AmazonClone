import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDocument } from './product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {}
  async create(
    name: string,
    price: number,
    description?: string,
  ): Promise<ProductDocument> {
    const newProduct = new this.productModel({ name, price, description });
    return newProduct.save();
  }
  async findAll(): Promise<ProductDocument[]> {
    return this.productModel.find().exec();
  }
  async find(id: string): Promise<ProductDocument | null> {
    return this.productModel.findById(id).exec();
  }
  async update(
    id: string,
    newName: string,
    newPrice: number,
    newDescription?: string,
  ): Promise<ProductDocument | null> {
    const existingProduct = await this.find(id);
    if (!existingProduct) return null;
    existingProduct.name = newName ?? existingProduct.name;
    existingProduct.price = newPrice ?? existingProduct.price;
    existingProduct.description = newDescription ?? existingProduct.description;
    return existingProduct.save();
  }
  async delete(id: string) {
    return this.productModel.deleteOne({ _id: id }).exec();
  }
}
