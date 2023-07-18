import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Controller('/v1/subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Get()
  findAll(@Query() queries: any) {
    return this.subscriptionService.findAll(queries);
  }

  @Get(':name')
  findOne(@Param('name') name: string, @Query() queries: any) {
    return this.subscriptionService.findOne(name, queries);
  }

  @Get('count/:name')
  count(@Param('name') name: string) {
    return this.subscriptionService.count(name);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionService.update(+id, updateSubscriptionDto);
  }

  @Delete()
  unsubscribe(@Query() queries: { subredditId: string; userId: string }) {
    return this.subscriptionService.unsubscribed(queries);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionService.remove(+id);
  }
}
