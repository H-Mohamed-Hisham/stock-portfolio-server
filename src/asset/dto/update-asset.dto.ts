import { PartialType } from '@nestjs/swagger';

// Asset
import { CreateAssetDto } from './create-asset.dto';

export class UpdateAssetDto extends PartialType(CreateAssetDto) {}
