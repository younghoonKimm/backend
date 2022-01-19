import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DashBoardService } from "./dashboard.service";
import { AuthGuard } from "src/middlewares/auth.middleware";

@Controller("dashboard")
@ApiTags("dashboard")
export class DashboardController {
  constructor(private dashboardService: DashBoardService) {}

  @UseGuards(AuthGuard)
  @Get("")
  async getEndInfoData() {
    return this.dashboardService.getEndInfoData();
  }
}