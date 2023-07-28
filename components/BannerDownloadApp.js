import Container from "@material-ui/core/Container";
import Image from "next/image";
import DownloadSection from "./DownloadSection";

export default function BannerDownloadApp() {
  return (
    <div className="banner-download-app">
      <Container>
        <div className="content-d-app">
          <div className="content-row">
            <h2 className="title">
              <span className="first">アプリ版も好評配信中</span>
              <span className="second">
                今すぐダウンロードして
                <br />
                Nailieを始めましょう!
              </span>
            </h2>
            <DownloadSection />
          </div>
          <div className="content-row">
            <ul className="progress-sec">
              <li>
                <span className="icon icon-n" />
                <span className="text">Nailieでネイリストを検索</span>
              </li>
              <li>
                <span className="icon icon-progress-find-nailist" />
                <span className="text">
                  お気に入りのネイリストがみつかったら…
                </span>
              </li>
              <li>
                <span className="icon icon-progress-make-appointment" />
                <span className="text">
                  そのまま簡単に予約が
                  <br />
                  出来ます
                </span>
              </li>
              <li>
                <span className="icon icon-progress-find-yours" />
                <span className="text">
                  あなただけのネイルで、
                  <br />
                  日常を彩りましょう
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="img-d-app">
          <Image
            alt="screenshot-mobile"
            src="/assets/images/banner-download.webp"
            height={505}
            width={296}
          />
        </div>
      </Container>
    </div>
  );
}
