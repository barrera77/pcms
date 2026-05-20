import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MockMetadata, ModuleMocker } from 'jest-mock';
import { Types } from 'mongoose';
import { DepartmentService } from 'src/department/department.service';
import { Employee } from 'src/employee/employee.entity';
import { EmployeeService } from 'src/employee/employee.service';

const moduleMocker = new ModuleMocker(global);

describe('EmployeeService #', () => {
  let service: EmployeeService;
  let departmentService: DepartmentService;
  let mockEmployeeModel: {
    create: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    findById: jest.Mock;
    findByIdAndUpdate: jest.Mock;
  };
  let mockEmployee: any;
  let mockDepartment: any;

  beforeEach(async () => {
    mockDepartment = {
      _id: new Types.ObjectId(),
      name: 'Test Department',
    };

    mockEmployee = {
      _id: new Types.ObjectId(),
      name: 'Test Employee',
      email: 'employee@hotmail.com',
      phone: '1234567890',
      departmentId: mockDepartment._id.toString(),
      role: 'TECHNICAIN',
      userId: null,
    };

    mockEmployeeModel = {
      create: jest.fn().mockResolvedValue(mockEmployee),
      find: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockEmployee]),
        }),
        exec: jest.fn().mockResolvedValue([mockEmployee]),
      }),

      findOne: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockEmployee),
        }),
      }),

      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockEmployee),
      }),

      findByIdAndUpdate: jest.fn().mockResolvedValue(mockEmployee),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        { provide: getModelToken(Employee.name), useValue: mockEmployeeModel },
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

    service = module.get<EmployeeService>(EmployeeService);
    departmentService = module.get<DepartmentService>(DepartmentService);

    jest
      .spyOn(departmentService, 'findById')
      .mockResolvedValue(mockDepartment as any);
  });

  describe('create() #', () => {
    const dto = {
      name: 'Test Employee',
      email: 'employee@hotmail.com',
      phone: '1234567890',
      departmentId: 'pest-control-department',
      role: 'TECHNICIAN',
    };

    describe('sad-path #', () => {
      it('should throw NotFoundException  when the department does not exist', async () => {
        jest
          .spyOn(departmentService, 'findById')
          .mockResolvedValue(null as any);

        await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      });
    });

    describe('happy-path #', () => {
      it('should create and return the new employee', async () => {
        const result = await service.create(dto);

        expect(mockEmployeeModel.create).toHaveBeenCalledWith(
          expect.objectContaining({ departmentId: dto.departmentId }),
        );
        expect(result).toEqual(mockEmployee);
      });
    });
  });

  describe('findAll() #', () => {
    describe('happy-path #', () => {
      it('should rreturn an array of employees', async () => {
        const result = await service.findAll();

        expect(result).toEqual([mockEmployee]);
      });
    });
  });

  describe('findByName() #', () => {
    describe('happy-path #', () => {
      it('should return the employee when a match is found', async () => {
        const result = await service.findByName('Test Employee');

        expect(mockEmployeeModel.findOne).toHaveBeenCalledWith({
          name: 'Test Employee',
        });
        expect(result).toEqual(mockEmployee);
      });

      it('should return null when no employee matches the name', async () => {
        mockEmployeeModel.findOne.mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
          }),
        });

        const result = await service.findByName('John Doe');

        expect(result).toBeNull();
      });
    });
  });

  describe('findByEmail() #', () => {
    describe('happy-path #', () => {
      it('should return the employee when a match is found #', async () => {
        const result = await service.findByEmail('employee@hotmail.com');

        expect(mockEmployeeModel.findOne).toHaveBeenCalledWith({
          email: 'employee@hotmail.com',
        });
        expect(result).toEqual(mockEmployee);
      });

      it('it should return null when no employee matches the email', async () => {
        mockEmployeeModel.findOne.mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
          }),
        });

        const result = await service.findByEmail('johndoe@hotmail.com');

        expect(result).toBeNull();
      });
    });
  });

  describe('findById() #', () => {
    describe('sad-path #', () => {
      it('should return NotFoundException when employee is not found', async () => {
        mockEmployeeModel.findById.mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        });

        await expect(service.findById('some-id')).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('happy-path #', () => {
      it('should return the employee when found', async () => {
        const result = await service.findById(mockEmployee._id.toString());

        expect(result).toEqual(mockEmployee);
      });
    });
  });

  describe('findByIds() #', () => {
    describe('happy-path #', () => {
      it('should return an array of employees matching the given IDs', async () => {
        const ids = [mockEmployee._id.toString()];

        const result = await service.findByIds(ids);

        expect(mockEmployeeModel.find).toHaveBeenCalledWith({
          _id: { $in: ids },
        });
        expect(result).toEqual([mockEmployee]);
      });
    });
  });

  describe('findByRole() #', () => {
    describe('happy-path #', () => {
      it('should return an array of employees with the given role', async () => {
        const result = await service.findByRole('TECHNICIAN');

        expect(mockEmployeeModel.find).toHaveBeenCalledWith({
          role: 'TECHNICIAN',
        });
        expect(result).toEqual([mockEmployee]);
      });
    });
  });

  describe('update() #', () => {
    const dto = { name: 'Test Employee' };

    describe('sad-path #', () => {
      it('should throw NotFoundException when employee is not found', async () => {
        mockEmployeeModel.findByIdAndUpdate.mockResolvedValue(null);

        await expect(service.update('some-id', dto)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('happy-path #', () => {
      it('should return the updated employee', async () => {
        const result = await service.update(mockEmployee._id.toString(), dto);

        expect(mockEmployeeModel.findByIdAndUpdate).toHaveBeenCalledWith(
          mockEmployee._id.toString(),
          dto,
          { new: true },
        );
        expect(result).toEqual(mockEmployee);
      });
    });
  });

  describe('remove() #', () => {
    describe('sad-path #', () => {
      it('should throw NotFoundException when the employee is not found or already inactive', async () => {
        mockEmployeeModel.findByIdAndUpdate.mockResolvedValue(null);

        await expect(service.remove('some-id')).rejects.toThrow(
          NotFoundException,
        );
      });
    });
    describe('happy-path #', () => {
      it('should soft-delete the employee and return the updated document', async () => {
        const result = await service.remove(mockEmployee._id.toString());

        expect(mockEmployeeModel.findByIdAndUpdate).toHaveBeenCalledWith(
          { _id: mockEmployee._id.toString(), isInactive: false },
          { isInactive: true, inactiveAt: expect.any(Date) },
          { new: true },
        );
        expect(result).toEqual(mockEmployee);
      });
    });
  });
});
