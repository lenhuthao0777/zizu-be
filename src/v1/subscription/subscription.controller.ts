import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('/v1/subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() queries: any) {
    return this.subscriptionService.findAll(queries);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':name')
  findOne(@Param('name') name: string, @Query() queries: any) {
    return this.subscriptionService.findOne(name, queries);
  }

  @UseGuards(JwtAuthGuard)
  @Get('count/:name')
  count(@Param('name') name: string) {
    return this.subscriptionService.count(name);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionService.update(+id, updateSubscriptionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  unsubscribe(@Query() queries: { subredditId: string; userId: string }) {
    return this.subscriptionService.unsubscribed(queries);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionService.remove(+id);
  }
}
