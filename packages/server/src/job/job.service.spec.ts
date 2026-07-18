import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { Job, JobDocument, JobStatus } from 'src/job/job.entity';
import { JobService } from 'src/job/job.service';

describe('JobService #', () => {
  let service: JobService;
  let mockJobModel: {
    create: jest.Mock;
    find: jest.Mock;
    findById: jest.Mock;
  };
  let mockJob: any;

  beforeEach(async () => {
    mockJob = {
      _id: new Types.ObjectId(),
      workOrder: 'WO-001',
      techId: new Types.ObjectId(),
      cityId: new Types.ObjectId(),
      buildingId: new Types.ObjectId(),
      unit: '23',
      jobStatus: JobStatus.SCHEDULED,
      clockIn: jest.fn(),
      clockOut: jest.fn(),
      setStatus: jest.fn(),
    };

    mockJobModel = {
      create: jest.fn().mockResolvedValue(mockJob),
      find: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockJob]),
      }),
      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockJob),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobService,
        {
          provide: getModelToken(Job.name),
          useValue: mockJobModel,
        },
      ],
    }).compile();
    service = module.get<JobService>(JobService);
  });

  describe('create() #', () => {
    const dto = {
      workOrder: 'WO-001',
      techId: new Types.ObjectId().toHexString(),
      cityId: new Types.ObjectId().toHexString(),
      buildingId: new Types.ObjectId().toHexString(),
      unit: '1A',
      jobStatus: JobStatus.SCHEDULED,
      date: '2026-05-27',
    };

    describe('happy-path #', () => {
      it('should create and return the new job', async () => {
        const result = await service.create(dto);

        expect(mockJobModel.create).toHaveBeenCalledWith({
          workOrder: dto.workOrder,
          techId: expect.any(Types.ObjectId),
          cityId: expect.any(Types.ObjectId),
          buildingId: expect.any(Types.ObjectId),
          uniut: dto.unit,
          jobStatus: dto.jobStatus,
        });
        expect(result).toEqual(mockJob);
      });
    });
  });

  describe('listJobsPerTech() #', () => {
    const techId = new Types.ObjectId().toHexString();

    describe('happy-path #', () => {
      it('should return all jobs for the given technician', async () => {
        const result = await service.listJobsPerTech(techId);

        expect(mockJobModel.find).toHaveBeenCalledWith({
          techId: expect.any(Types.ObjectId),
        });
        expect(result).toEqual([mockJob]);
      });
    });
  });

  describe('findById() #', () => {
    const id = new Types.ObjectId().toHexString();

    describe('sad-path #', () => {
      it('should throw NotFoundException when job is not found', async () => {
        mockJobModel.findById.mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        });

        await expect(service.findById(id)).rejects.toThrow(
          new NotFoundException('Job not found'),
        );
      });
    });

    describe('happy-path #', () => {
      it('should return the job by id', async () => {
        const result = await service.findById(id);

        expect(mockJobModel.findById).toHaveBeenCalledWith(id);
        expect(result).toEqual(mockJob);
      });
    });
  });

  describe('findAll() #', () => {
    describe('happy-path #', () => {
      it('should return all jobs with populated fields', async () => {
        const result = await service.findAll();

        expect(mockJobModel.find).toHaveBeenCalledWith();
        expect(result).toEqual([mockJob]);
      });
    });
  });

  describe('clockIn() #', () => {
    describe('happy-path #', () => {
      it('should call clockIn() in the job document', async () => {
        await service.clockIn(mockJob as JobDocument);

        expect(mockJob.clockIn).toHaveBeenCalledWith();
      });
    });
  });
});
