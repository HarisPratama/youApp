import { configService } from 'nest-shared';

export const PORT = configService.getPort() || 3000;
