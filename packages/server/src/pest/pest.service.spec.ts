import { PestCatalog } from '@pcms/pcms-common';
import { Types } from 'mongoose';
import { PestService } from 'src/pest/pest.service';

describe('PestService #', () => {
  let service: PestService;
  let mockPestModel: {
    create: jest.Mock;
    find: jest.Mock;
    findById: jest.Mock;
  };
  let mockPest: any;

  beforeEach(async () => {
    mockPest = {
      _id: new Types.ObjectId(),
      ...PestCatalog.YELLOW_JACKET,
    };
  });
});
