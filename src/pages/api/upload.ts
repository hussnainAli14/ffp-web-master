import { NextApiRequest, NextApiResponse } from 'next';

import { generateUploadUrl } from '@ffp-web/lib/s3/data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileType } = req.body;

    if (!fileType) {
      return res.status(400).json({ error: 'Missing fileType' });
    }

    const uploadUrl = await generateUploadUrl(fileType);
    res.status(200).json({ uploadUrl });
  } catch {
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
}
