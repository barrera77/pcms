import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MockMetadata, ModuleMocker } from 'jest-mock';
import { Types } from 'mongoose';
import { Department } from 'src/department/department.entity';
import { DepartmentService } from 'src/department/department.service';

const moduleMocker = new ModuleMocker(global);

describe('DepartmentService #', () => {
  let service: DepartmentService;
  let mockDepartmentModel: {
    create: jest.Mock;
    find: jest.Mock;
    findById: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    findOneAndUpdate: jest.Mock;
  };
  let mockDepartment: any;

  beforeEach(async () => {
    mockDepartment = {
      _id: new Types.ObjectId(),
      name: 'Pest Control',
      description: 'Handles pest control operations',
      isInactive: false,
      inactiveAt: null,
    };

    mockDepartmentModel = {
      create: jest.fn().mockResolvedValue(mockDepartment),
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockDepartment]),
      }),
      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDepartment),
      }),
      findByIdAndUpdate: jest.fn().mockResolvedValue(mockDepartment),
      findOneAndUpdate: jest.fn().mockResolvedValue(mockDepartment),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentService,
        {
          provide: getModelToken(Department.name),
          useValue: mockDepartmentModel,
        },
      ],
    })
      .useMocker((token) => {
        if (typeof token === 'function') {
          const mockMetaData = moduleMocker.getMetadata(token) as MockMetadata<
            any,
            any
          >;
          const Mock = moduleMocker.generateFromMetadata(mockMetaData);
          return new Mock();
        }
      })
      .compile();

    service = module.get<DepartmentService>(DepartmentService);
  });

  describe('create() #', () => {
    const dto = {
      name: 'Pest Control',
      description: 'Handles pest control operations',
    };

    describe('happy-path #', () => {
      it('should create and return the new department ', async () => {
        const result = await service.create(dto);

        expect(mockDepartmentModel.create).toHaveBeenCalledWith(dto);
        expect(result).toEqual(mockDepartment);
      });
    });
  });

  describe('findAll() #', () => {
    describe('happy-path #', () => {
      it('should return all departments', async () => {
        const result = await service.findAll();

        expect(mockDepartmentModel.find).toHaveBeenCalled();
        expect(result).toEqual([mockDepartment]);
      });
    });
  });

  describe('findById() #', () => {
    const id = new Types.ObjectId().toHexString();

    describe('sad-path #', () => {
      it('should throw NotFoundException when department is not found', async () => {
        mockDepartmentModel.findById.mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        });

        await expect(service.findById(id)).rejects.toThrow(
          new NotFoundException('Department not found'),
        );
      });
    });

    describe('happy-path #', () => {
      it('sahould return the department by Id', async () => {
        const result = await service.findById(id);

        expect(mockDepartmentModel.findById).toHaveBeenCalledWith(id);
        expect(result).toEqual(mockDepartment);
      });
    });
  });

  describe('update() #', () => {
    const id = new Types.ObjectId().toHexString();
    const dto = {
      name: 'Updated Pest Control',
      description: 'Updated Description',
    };

    describe('sad-path #', () => {
      it('should throw NotFoundException  when department is not found', async () => {
        mockDepartmentModel.findByIdAndUpdate.mockResolvedValue(null);

        await expect(service.update(id, dto)).rejects.toThrow(
          new NotFoundException('Department not found or already inactive'),
        );
      });
    });

    describe('happy-path #', () => {
      it('should return the updated department', async () => {
        const result = await service.update(id, dto);

        expect(mockDepartmentModel.findByIdAndUpdate).toHaveBeenCalledWith(
          id,
          dto,
          { new: true },
        );
        expect(result).toEqual(mockDepartment);
      });
    });
  });

  describe('remove() #', () => {
    const id = new Types.ObjectId().toHexString();

    describe('sad-path #', () => {
      it('should throw NotFoundException when department is not found or already inactive', async () => {
        mockDepartmentModel.findOneAndUpdate.mockResolvedValue(null);

        await expect(service.remove(id)).rejects.toThrow(
          new NotFoundException('Department not found or already innactive'),
        );
      });
    });

    describe('happy-path #', () => {
      it('should soft delete and return the department', async () => {
        const result = await service.remove(id);

        expect(mockDepartmentModel.findOneAndUpdate).toHaveBeenCalledWith(
          { _id: id, isInactive: false },
          { isInactive: true, inactiveAt: expect.any(Date) },
          { new: true },
        );
        expect(result).toEqual(mockDepartment);
      });
    });
  });
});
