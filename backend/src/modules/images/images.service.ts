import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ImagesService {
  constructor(private config: ConfigService) {}

  async signUrl(folder: string): Promise<{ url: string; key: string }> {
    const accountId = this.config.get<string>('CLOUDFLARE_ACCOUNT_ID');
    const accessKey = this.config.get<string>('CLOUDFLARE_ACCESS_KEY_ID');
    const secret = this.config.get<string>('CLOUDFLARE_SECRET_ACCESS_KEY');
    const bucket = this.config.get<string>('BUCKET_NAME');

    if (!accessKey || !secret || !bucket) {
      throw new InternalServerErrorException('Missing S3 storage configuration');
    }

    const endpoint = this.config.get<string>('S3_ENDPOINT')
      ?? `https://${accountId}.r2.cloudflarestorage.com`;

    const client = new S3Client({
      region: this.config.get<string>('S3_REGION') ?? 'auto',
      endpoint,
      credentials: { accessKeyId: accessKey, secretAccessKey: secret },
      forcePathStyle: true,
    });

    const key = `${folder}/${uuidv4()}`;
    const command = new PutObjectCommand({ Bucket: bucket, Key: key });
    const url = await getSignedUrl(client, command, { expiresIn: 900 });

    return { url, key };
  }
}
