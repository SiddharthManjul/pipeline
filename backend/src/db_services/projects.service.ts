import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service.js';
import { Project, Prisma } from '../../generated/prisma/client.js';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async project(
    projectWhereUniqueInput: Prisma.ProjectWhereUniqueInput,
  ): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: projectWhereUniqueInput,
    });
  }

  async projects(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProjectWhereUniqueInput;
    where?: Prisma.ProjectWhereInput;
    orderBy?: Prisma.ProjectOrderByWithRelationInput;
  }): Promise<Project[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.project.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createProject(data: Prisma.ProjectCreateInput): Promise<Project> {
    return this.prisma.project.create({
      data,
    });
  }

  async updateProject(params: {
    where: Prisma.ProjectWhereUniqueInput;
    data: Prisma.ProjectUpdateInput;
  }): Promise<Project> {
    const { where, data } = params;
    return this.prisma.project.update({
      data,
      where,
    });
  }

  async deleteProject(where: Prisma.ProjectWhereUniqueInput): Promise<Project> {
    return this.prisma.project.delete({
      where,
    });
  }

  async getProjectWithDeveloper(projectId: string) {
    return this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        developer: {
          select: {
            id: true,
            username: true,
            fullName: true,
            tier: true,
          },
        },
      },
    });
  }

  async searchProjects(params: {
    technologies?: string[];
    isVerified?: boolean;
    skip?: number;
    take?: number;
  }) {
    const { technologies, isVerified, skip, take } = params;

    return this.prisma.project.findMany({
      where: {
        ...(technologies && {
          technologies: {
            hasSome: technologies,
          },
        }),
        ...(isVerified !== undefined && { isVerified }),
      },
      include: {
        developer: {
          select: {
            username: true,
            tier: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: take || 20,
    });
  }

  async countProjects(where?: Prisma.ProjectWhereInput): Promise<number> {
    return this.prisma.project.count({ where });
  }

  // Helper methods for profile controller
  async findProjectById(projectId: string): Promise<Project | null> {
    return this.project({ id: projectId });
  }

  async findProjectsByDeveloper(developerId: string): Promise<Project[]> {
    return this.projects({
      where: { developerId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
