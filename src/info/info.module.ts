import { Module } from "@nestjs/common";
import { InfoController } from "./info.controller";
import { InfoService } from "./info.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InfoEntity } from "src/common/entities/info.entity";
import { ClientInfoEntity } from "./entities/client-info.entity";
import { BaseInfoEntity } from "./entities/base-info.entity";
import { DetailInfoEntity } from "./entities/detail-info.entity";
import { ManageMentCategoryEntites } from "src/management/entities/category.entity";
import { ScheduleInfoEntity } from "./entities/schedule-Info.entity";
import { ReviewEntity } from "./entities/review.entitiy";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InfoEntity,
      ClientInfoEntity,
      BaseInfoEntity,
      DetailInfoEntity,
      ScheduleInfoEntity,
      ManageMentCategoryEntites,
      ReviewEntity,
    ]),
  ],
  controllers: [InfoController],
  providers: [InfoService],
  exports: [InfoService],
})
export class InfoModule {}
