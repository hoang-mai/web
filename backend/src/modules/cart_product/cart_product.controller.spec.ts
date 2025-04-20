import { Test, TestingModule } from '@nestjs/testing';
import { CartProductController } from './cart_product.controller';
import { CartProductService } from './cart_product.service';

describe('CartProductController', () => {
  let controller: CartProductController;
  let service: CartProductService;

  const mockCartProductService = {
    addToCart: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateCartItem: jest.fn(),
    removeFromCart: jest.fn(),
    clearCart: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartProductController],
      providers: [
        {
          provide: CartProductService,
          useValue: mockCartProductService,
        },
      ],
    }).compile();

    controller = module.get<CartProductController>(CartProductController);
    service = module.get<CartProductService>(CartProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call addToCart when create is called', async () => {
    const dto = { cartId: 1, productId: 2, quantity: 3 };
    await controller.create(dto);
    expect(service.addToCart).toHaveBeenCalledWith(dto);
  });

  it('should call findAll when findAll is called', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call findOne when findOne is called', async () => {
    const id = '1';
    await controller.findOne(id);
    expect(service.findOne).toHaveBeenCalledWith(+id);
  });

  it('should call updateCartItem when update is called', async () => {
    const id = '1';
    const dto = { quantity: 5 };
    await controller.update(id, dto);
    expect(service.updateCartItem).toHaveBeenCalledWith(+id, dto);
  });

  it('should call removeFromCart when remove is called', async () => {
    const id = '1';
    await controller.remove(id);
    expect(service.removeFromCart).toHaveBeenCalledWith(+id);
  });

  it('should call clearCart when clearCart is called', async () => {
    const cartId = '1';
    await controller.clearCart(cartId);
    expect(service.clearCart).toHaveBeenCalledWith(+cartId);
  });
});