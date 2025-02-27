'use server';

import AWS from 'aws-sdk';

import { QueryData } from '@ffp-web/app/index.types';
import { unpackError } from '@ffp-web/utils/error.utils';

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  endpoint: process.env.S3_ENDPOINT,
  s3ForcePathStyle: true,
});

export async function generateUploadUrl(fileType: string): Promise<QueryData<string>> {
  try {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileType.split('/')[1]}`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Expires: 3155760000,
      ContentType: fileType,
      ACL: 'public-read',
    };

    const res = await s3.getSignedUrlPromise('putObject', params);

    return { data: res };
  } catch (err) {
    return { message: unpackError(err) };
  }
}

export async function uploadImage(uploadUrl: string, file: File, fileType: string): Promise<QueryData<string>> {
  try {
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': fileType,
      },
      body: file,
    });

    if (uploadResponse.ok) {
      return { data: 'Successfully upload image' };
    } else {
      const errorDetails = await uploadResponse?.text(); // Try to get a detailed error response
      throw new Error(`Upload failed with status ${uploadResponse?.status}: ${errorDetails}`);
    }
  } catch (err) {
    return { message: unpackError(err) };
  }
}

export async function getUploadUrl(fileType: string): Promise<QueryData<string>> {
  try {
    const { data, message } = await generateUploadUrl(fileType);

    if (data) {
      return { data };
    } else {
      throw new Error(message);
    }
  } catch (err) {
    return { message: unpackError(err) };
  }
}
