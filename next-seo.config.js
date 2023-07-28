export default {
  title: 'ネイリー（Nailie）',
  description: 'Nailie（ネイリー）は、あなたとネイリストをつなぐアプリケーション。サロンを予約するだけでなくネイリスト本人とつながれる。さあ、アプリ上からあなたにピッタリのネイリストを見つけよう。',
  canonical: process.env.DOMAIN_NAME,
  keywords: 'ネイルサロン,ネイリスト,ネイル,ネイルデザイン,予約,ネイリー,Nailie',
  openGraph: {
    url: process.env.DOMAIN_NAME,
    type: 'website',
    title: 'ネイリー（Nailie）',
    description: 'Nailie（ネイリー）は、あなたとネイリストをつなぐアプリケーション。サロンを予約するだけでなくネイリスト本人とつながれる。さあ、アプリ上からあなたにピッタリのネイリストを見つけよう。',
    images: [
    {
      url: `${process.env.DOMAIN_NAME}/assets/images/ogp_600x315.png`,
      height: 315,
      width: 600,
    }],
    site_name: 'ネイリー（Nailie）',
  },
  twitter: {
    cardType: 'summary_large_image',
    site: '@nailiejp',
  },
  facebook: {
    appId: '274492646738365',
  }
};

// 'twitter:image': `${domainName}/${THUMB_LOGO}`
// image: `${domainName}/${THUMB_LOGO}`
