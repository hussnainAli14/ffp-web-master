const convertGDriveLinkToSrc = (googleDriveLink?: string): string => {
  // Regex to match the Google Drive shared link and extract the file ID
  const regex = /\/d\/([a-zA-Z0-9_-]+)\/?/;
  const match = RegExp(regex).exec(googleDriveLink ?? '');

  if (match?.[1]) {
    // Extracted file ID
    const fileId = match[1];
    // Construct and return the direct image link
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  } else {
    // Return null if the input link is invalid
    // return 'https://drive.google.com/uc?export=view&id=1Wr_KUv_m3bULZmBy5ezZAJQaG1EKC8tG';
    return googleDriveLink ?? '';
  }
};

const formatYoutubeLinkToEmbed = (shareLink?: string): string => {
  try {
    const url = new URL(shareLink ?? '');

    // Handle full YouTube links
    if (url.hostname === 'www.youtube.com' && url.searchParams.has('v')) {
      const videoId = url.searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Handle shortened YouTube share links
    if (url.hostname === 'youtu.be') {
      const videoId = url.pathname.slice(1); // Remove the leading slash
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return '';
  } catch {
    return '';
  }
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildSearchParams = (params: Record<string, any>): string => {
  const urlSearchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value != null) {
      urlSearchParams.append(key, String(value));
    }
  }

  return urlSearchParams.toString();
};


export {
  convertGDriveLinkToSrc,
  formatYoutubeLinkToEmbed,
  buildSearchParams,
};
