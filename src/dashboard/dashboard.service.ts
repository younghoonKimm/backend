import { Injectable } from "@nestjs/common";
import { Repository, Connection } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { InfoEntity, StatusStep } from "src/common/entities/info.entity";
import { toISODate } from "src/utils/date";
import {
  getSearchDataSelected,
  getInfoDataSelected,
  getReviewInfoData,
} from "./dashboard.config";
import { ReviewEntity } from "src/info/entities/review.entitiy";
import { EndInfoOutput, AllSearchOutputData } from "./dto/info-end.dto";
import { AllReviewOutput } from "./dto/review-dto";

@Injectable()
export class DashBoardService {
  constructor(
    private connection: Connection,
    @InjectRepository(InfoEntity) private readonly info: Repository<InfoEntity>,
    @InjectRepository(ReviewEntity)
    private readonly reviewEntity: Repository<ReviewEntity>,
  ) {}

  async getEndInfoData(): Promise<EndInfoOutput> {
    const queryRunner = this.connection.createQueryRunner();
    try {
      const endInfoDatas = await this.info
        .createQueryBuilder("info_entity")
        .leftJoin(`info_entity.baseInfo`, "baseInfo")
        .leftJoin(`info_entity.detailInfo`, "detailInfo")
        .where("info_entity.status = :status", {
          status: `${StatusStep.end}`,
        })
        .select([...getInfoDataSelected])
        .getMany();

      const projectStatus = await queryRunner.query(`
          SELECT count(id), UNNEST("projectStatus") as element
          FROM "base_info_entity"
          GROUP BY element
      `);

      const projectDispatch = await queryRunner.query(`
          SELECT count(id), "projectDispatch" as element
          FROM "detail_info_entity"
          GROUP BY element
      `);

      const projectSelection = await queryRunner.query(`
        SELECT count(id), "projectSelection" as element
        FROM "detail_info_entity"
        GROUP BY element
      `);

      const recentInfoDatas = await this.info
        .createQueryBuilder("info_entity")
        .leftJoin(`info_entity.clientInfo`, "clientInfo")
        .select([...getSearchDataSelected])
        .take(5)
        .getMany();

      return {
        allData: endInfoDatas,
        count: { projectStatus, projectDispatch, projectSelection },
        infoData: recentInfoDatas,
      };
    } catch (error) {
      return { error };
    }
  }

  async allReviewData(page: number): Promise<AllReviewOutput> {
    try {
      const reviewData = await this.reviewEntity
        .createQueryBuilder("review_entity")
        .select(["review_entity.record"])
        .getMany();

      const [endReviewDatas, endReviewDatasTotal] = await this.info
        .createQueryBuilder("info_entity")
        .leftJoin(`info_entity.clientInfo`, "clientInfo")
        .leftJoin(`info_entity.review`, "review")
        .select([...getReviewInfoData])
        .skip((page - 1) * 5)
        .take(5)
        .getManyAndCount();

      return {
        reviewData,
        infoData: endReviewDatas,
        totalPages: Math.ceil(endReviewDatasTotal / 10),
      };
    } catch (error) {
      return { error };
    }
  }

  async getSearchata(
    page: number,
    searchData: any,
  ): Promise<AllSearchOutputData> {
    const { status, isConfidential, startDate, endDate } = searchData;
    const endEnum = StatusStep.end;

    const isConfidentialQuery = isConfidential
      ? "AND info_entity.isConfidential = :isConfidential"
      : "";

    const isStatusQuery = status
      ? status === endEnum
        ? "AND info_entity.status = :status "
        : "AND info_entity.status != :status"
      : "";

    try {
      const [endReviewDatas, endReviewDatasTotal] = await this.info
        .createQueryBuilder("info_entity")
        .leftJoin(`info_entity.clientInfo`, "clientInfo")
        .select([...getSearchDataSelected])
        .where(
          `info_entity.updateAt >= :startDate
            AND info_entity.updateAt <= :endDate
          ${isStatusQuery}
          ${isConfidentialQuery}
          `,
          {
            status: `${endEnum}`,
            ...(isConfidential && { isConfidential: `${isConfidential}` }),
            startDate: toISODate(startDate, "2022-01-01"),
            endDate: toISODate(
              endDate,
              new Date().setDate(new Date().getDate() + 1),
            ),
          },
        )
        .skip((page - 1) * 10)
        .take(10)
        .getManyAndCount();

      if (endReviewDatas) {
        return {
          infoData: endReviewDatas,
          totalPages: Math.ceil(endReviewDatasTotal / 10),
        };
      }
    } catch (error) {
      return { error };
    }
  }
}
