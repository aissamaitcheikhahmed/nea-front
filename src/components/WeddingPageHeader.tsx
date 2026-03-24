type Props = { bg: string; tag: string; title: string; titleEm: string };

export default function WeddingPageHeader({ bg, tag, title, titleEm }: Props) {
  return (
    <div className="page-header">
      <div className="page-header-bg" style={{ backgroundImage: `url(${bg})` }} />
      <div className="page-header-overlay" />
      <div className="page-header-content">
        <div className="page-header-tag">{tag}</div>
        <h1 className="page-header-h">
          {title} <em>{titleEm}</em>
        </h1>
      </div>
    </div>
  );
}
