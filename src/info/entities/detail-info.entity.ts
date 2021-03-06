import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsString, Length, IsNumber, Min, Max } from "class-validator";
import { InfoEntity } from "src/common/entities/info.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class DetailInfoEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @IsString()
  @Length(0, 100)
  @ApiProperty({
    example: "projName",
  })
  projectName: string;

  @Column({ nullable: true })
  @IsString()
  @Length(0, 600)
  projectProgress: string;

  @Column({ nullable: true })
  @IsNumber()
  @Min(0)
  @Max(4)
  @ApiProperty({
    example: 0,
  })
  projectSelection: number;

  @Column({ nullable: true })
  @IsNumber()
  @Min(0)
  @Max(2)
  @ApiProperty({
    example: 0,
  })
  projectDispatch: number;

  @OneToOne(() => InfoEntity, (infoEntity) => infoEntity.detailInfo, {
    onDelete: "CASCADE",
  })
  info: InfoEntity;
}
