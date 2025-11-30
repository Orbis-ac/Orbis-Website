import {ConfigService} from "@nestjs/config";
import {Injectable} from "@nestjs/common";
import {Storage} from "@google-cloud/storage";
import {v4 as uuidv4} from "uuid";

@Injectable()
export class StorageService {
    private storage: Storage;
    private readonly publicBucket: string;
    private readonly privateBucket: string;

    constructor(private configService: ConfigService) {
        const serviceAccountBase64 = this.configService.get('GCS_SERVICE_ACCOUNT_BASE64');
        const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
        const credentials = JSON.parse(serviceAccountJson);

        this.storage = new Storage({
            credentials: credentials,
            projectId: credentials.project_id,
        });

        this.publicBucket = this.configService.get('GCS_MEDIA_BUCKET_NAME');
        this.privateBucket = this.configService.get('GCS_PREMIUM_BUCKET_NAME');
    }

    async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
        const extension = file.originalname.split('.').pop();
        const filename = `${folder}/${uuidv4()}.${extension}`;

        const bucket = this.storage.bucket(this.publicBucket);
        const blob = bucket.file(filename);

        const stream = blob.createWriteStream({
            resumable: false,
            metadata: {
                contentType: file.mimetype,
                cacheControl: 'public, max-age=31536000',
            },
        });

        return new Promise((resolve, reject) => {
            stream.on('error', (error) => reject(error));
            stream.on('finish', () => {
                const publicUrl = `https://media.orbis.place/${filename}`;
                resolve(publicUrl);
            });
            stream.end(file.buffer);
        });
    }

    async deleteFile(fileUrl: string): Promise<void> {
        const filename = fileUrl.split(`${this.publicBucket}/`)[1];
        if (!filename) return;

        const bucket = this.storage.bucket(this.publicBucket);
        await bucket.file(filename).delete();
    }
}