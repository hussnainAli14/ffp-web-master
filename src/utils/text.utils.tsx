export const formatTextToIncludeHyperLink = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      const trailingRegex = /[\s.,;!?)]*$/;
      const trailingPart = trailingRegex.exec(part);
      const cleanedUrl = part.replace(/[\s.,;!?)]*$/, '');

      return (
        <span key={(part[0] ?? '*') + index}>
          <a
            href={cleanedUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='text-primary-btn hover:underline'
          >
            {cleanedUrl}
          </a>
          <span>{trailingPart}</span>
        </span>
      );
    } else {
      return <span key={(part[0] ?? '*') + index}>{part}</span>;
    }
  });
};

export const formatTextWithBreakLine = (text: string) => {
  return (
    <div>
      {text.split('\n').map((item, index) => (
        <div key={(item[0] ?? '*') + index}>
          {formatTextToIncludeHyperLink(item)}
          <br />
        </div>
      ))}
    </div>
  );
};

export function capitalizeFirstLetter(word: string): string {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
