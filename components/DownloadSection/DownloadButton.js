import Image from "next/image";

export default function DownloadButton({ title, href, thumb }) {
  return (
    <div className="download-button">
      <a href={href} target="_blank" rel="noopener noreferrer">
        <Image width={160} height={52} src={thumb} alt={title} />
      </a>
    </div>
  );
}
