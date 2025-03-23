import { Test, TestingModule } from '@nestjs/testing';
import { CartProductController } from './cart_product.controller';

describe('CartProductController', () => {
  let controller: CartProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartProductController],
    }).compile();

    controller = module.get<CartProductController>(CartProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
