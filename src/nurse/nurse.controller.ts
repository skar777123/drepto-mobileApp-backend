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
import { NurseService } from './nurse.service';
import { Nurse } from '../schemas/nurse.schema';
import { CreateNurseDto, UpdateNurseDto, LoginNurseDto } from '../dto/nurse.dto';
import { Public } from '../auth/public.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('nurse')
export class NurseController {
  constructor(private readonly nurseService: NurseService) { }

  @Public()
  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async register(@Body() createNurseDto: CreateNurseDto) {
    return this.nurseService.register(createNurseDto);
  }

  @Public()
  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async login(@Body() loginNurseDto: LoginNurseDto) {
    return this.nurseService.login(loginNurseDto);
  }

  // @Post()
  // @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  // create(@Body() createNurseDto: CreateNurseDto) {
  //   return this.nurseService.create(createNurseDto);
  // }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.nurseService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nurseService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(@Param('id') id: string, @Body() updateNurseDto: UpdateNurseDto) {
    return this.nurseService.update(id, updateNurseDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nurseService.remove(id);
  }
}
