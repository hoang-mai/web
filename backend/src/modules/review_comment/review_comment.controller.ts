import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { ReviewCommentService } from './review_comment.service';
import { CreateReviewCommentDto } from './dto/create-review_comment.dto';
import { UpdateReviewCommentDto } from './dto/update-review_comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Role } from 'src/entities/role.enum';
import { Roles } from 'src/guard/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('review-comment')
export class ReviewCommentController {
  constructor(private readonly commentService: ReviewCommentService) {}

  @Get('/:reviewId')
  getByReview(@Param('reviewId') reviewId: number) {
    return this.commentService.getCommentsByReview(reviewId);
  }
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @Post()
  create(@Req() req, @Body() dto: CreateReviewCommentDto) {
    return this.commentService.createComment(req.user.id, dto);
  }

  @Patch('edit/:reviewId')
  edit(
    @Param('reviewId') id: number,
    @Req() req,
    @Body() dto: UpdateReviewCommentDto,
  ) {
    return this.commentService.editComment(+id, req.user.id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number, @Req() req) {
    return this.commentService.deleteComment(+id, req.user.id);
  }
}
