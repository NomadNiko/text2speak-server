import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum SpeedEnum {
  SLOW = 'slow',
  NORMAL = 'normal',
  FAST = 'fast',
}

export class TtsGenerateDto {
  @ApiProperty({
    description: 'Text to be converted to speech',
    example: 'Hello, this is a test of the text to speech API',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiPropertyOptional({
    description: 'Speaker ID to use for generation',
    example: 'p234',
    default: 'p234',
  })
  @IsString()
  @IsOptional()
  speaker?: string;

  @ApiPropertyOptional({
    description: 'Speech speed',
    enum: SpeedEnum,
    default: SpeedEnum.NORMAL,
  })
  @IsEnum(SpeedEnum)
  @IsOptional()
  speed?: SpeedEnum;

  @ApiPropertyOptional({
    description: 'TTS model to use',
    example: 'tts_models/en/vctk/vits',
  })
  @IsString()
  @IsOptional()
  model?: string;
}
