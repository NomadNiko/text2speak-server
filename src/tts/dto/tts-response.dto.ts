import { ApiProperty } from '@nestjs/swagger';

export class TtsResponseDto {
  @ApiProperty({
    description: 'Indicates if the operation was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'S3 URL to the generated audio file',
    example:
      'https://example-bucket.s3.amazonaws.com/tts-outputs/output_p234_normal_20240413-123456.wav',
  })
  url: string;

  @ApiProperty({
    description: 'Filename of the generated audio',
    example: 'output_p234_normal_20240413-123456.wav',
  })
  filename: string;

  @ApiProperty({
    description: 'Speaker used for generation',
    example: 'p234',
  })
  speaker: string;

  @ApiProperty({
    description: 'Speed used for generation',
    example: 'normal',
  })
  speed: string;
}
