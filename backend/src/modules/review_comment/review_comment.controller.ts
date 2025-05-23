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

@Controller('review-comment')
export class ReviewCommentController {
  constructor(private readonly commentService: ReviewCommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() dto: CreateReviewCommentDto) {
    return this.commentService.createComment(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('like/:id')
  like(@Param('id') id: number) {
    return this.commentService.likeComment(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('report/:id')
  report(@Param('id') id: number) {
    return this.commentService.reportComment(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('edit/:id')
  edit(
    @Param('id') id: number,
    @Req() req,
    @Body() dto: UpdateReviewCommentDto,
  ) {
    return this.commentService.editComment(+id, req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number, @Req() req) {
    return this.commentService.deleteComment(+id, req.user.id);
  }

  @Get('review/:reviewId')
  getByReview(@Param('reviewId') reviewId: number) {
    return this.commentService.getCommentsByReview(reviewId);
  }
}
