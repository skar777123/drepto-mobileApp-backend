import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthorizedService } from './authorized.service';
import { CreateAuthorizedDto, LoginAuthorizedDto } from '../dto/authorized.dto';
import { Public } from '../auth/public.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('authorized')
export class AuthorizedController {
  constructor(private readonly authorizedService: AuthorizedService) { }

  @Public()
  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async register(@Body() createAuthorizedDto: CreateAuthorizedDto) {
    return this.authorizedService.register(createAuthorizedDto);
  }

  @Public()
  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async login(@Body() loginAuthorizedDto: LoginAuthorizedDto) {
    return this.authorizedService.login(loginAuthorizedDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.authorizedService.getAllAuthorized();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorizedService.getAuthorized(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAuthorizedDto: Partial<CreateAuthorizedDto>,
  ) {
    return this.authorizedService.updateAuthorized(id, updateAuthorizedDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorizedService.deleteAuthorized(id);
  }
}
