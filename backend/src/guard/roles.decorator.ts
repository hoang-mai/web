import { Reflector } from '@nestjs/core';
import { Role } from 'src/entities/role.enum';

export const Roles = Reflector.createDecorator<Role[]>();
