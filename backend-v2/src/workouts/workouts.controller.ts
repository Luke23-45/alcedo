import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUserSub } from '../common/decorators/current-user.decorator';
import { CreateWorkoutDto, ListWorkoutsQuery, UpdateWorkoutDto } from './dto/workout.dto';
import { WorkoutsService } from './workouts.service';

@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  /**
   * Cursor-paginated list of the caller's own workouts, newest first.
   * Tombstones are excluded unless `includeDeleted=true`.
   */
  @Get()
  list(@CurrentUserSub() googleSub: string, @Query() query: ListWorkoutsQuery) {
    return this.workoutsService.list(googleSub, {
      cursor: query.cursor,
      includeDeleted: query.includeDeleted,
      limit: query.limit,
    });
  }

  /** Direct fetch by clientId; bulk movement goes through the sync protocol. */
  @Get(':id')
  getOne(@CurrentUserSub() googleSub: string, @Param('id') id: string) {
    return this.workoutsService.getOne(googleSub, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUserSub() googleSub: string, @Body() dto: CreateWorkoutDto) {
    return this.workoutsService.create(googleSub, dto);
  }

  @Patch(':id')
  update(
    @CurrentUserSub() googleSub: string,
    @Param('id') id: string,
    @Body() dto: UpdateWorkoutDto,
  ) {
    return this.workoutsService.update(googleSub, id, dto);
  }

  /** Soft delete: marks the tombstone (which syncs to clients), never hard-deletes. */
  @Delete(':id')
  remove(@CurrentUserSub() googleSub: string, @Param('id') id: string) {
    return this.workoutsService.remove(googleSub, id);
  }
}
