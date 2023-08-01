import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SubredditService } from './subreddit.service';
import { CreateSubredditDto } from './dto/create-subreddit.dto';
import { UpdateSubredditDto } from './dto/update-subreddit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('/v1/subreddit')
export class SubredditController {
  constructor(private readonly subredditService: SubredditService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSubredditDto: CreateSubredditDto) {
    return this.subredditService.create(createSubredditDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.subredditService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.subredditService.findOne(name);
  }

  @Get('get-by-name/:name')
  findByName(@Param('name') name: string) {
    return this.subredditService.findOne(name);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubredditDto: UpdateSubredditDto,
  ) {
    return this.subredditService.update(id, updateSubredditDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subredditService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('vote')
  vote(@Body() params: any) {
    return this.subredditService.vote(params);
  }
}
