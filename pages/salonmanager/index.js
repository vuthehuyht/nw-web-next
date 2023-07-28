import { useState } from "react";
import "animate.css/animate.min.css";
import ScrollAnimation from "react-animate-on-scroll";
import Container from "@material-ui/core/Container";
import ContactForm from "containers/salon/contactForm";
import { postQuestionSupportSalonTicket } from "@providers/policy-actions";
import Modal from "@components/Modal";

import ThankYouBlock from "components/Thankyou";

const SalonLandingPage = () => {
  const [successContact, setSuccessContact] = useState(null);

  const onSubmit = (values) => {
    postQuestionSupportSalonTicket(values)
      .then((result) => {
        if (result.status && result.status === "error") {
          return;
        }
        setSuccessContact(result);
      })
      .catch((e) => {
        console.log("error: ", e);
      });
  };

  const onClose = () => {
    setSuccessContact(null);
  };

  return (
    <div className="salon-landing-page">
      {/* <!-- section | ヘッダー部分 --> */}
      <header className="header">
        <div className="header__inner">
          <img
            className="header-image"
            src="/assets/images/salon/bg_top.png"
            alt="6ヶ月間無料お試しキャンペーン"
          />
        </div>
      </header>

      {/* <!-- section | Nailie サロンマネージャー --> */}
      <section className="salon-manage">
        <ScrollAnimation animateIn="fadeInUp" animateOnce>
          <div className="salon-manage__content text-block">
            <img
              className="title_image"
              src="/assets/images/salon/logo-pink.svg"
              alt="Nailie"
            />
            <h2 className="title_txt">サロンマネージャー</h2>
            <h3 className="sub-title">サロンでネイリーを活用しませんか？</h3>
            <p>
              各ネイリストをPCで一括管理できる
              <br />
              ツールができました！
            </p>
            <a className="btn-link" href="#contact-form">
              お問い合わせはこちら
            </a>
          </div>
        </ScrollAnimation>
      </section>

      {/* <!-- section | サロンマネージャーの3つのポイント --> */}
      <section className="points">
        <ScrollAnimation animateIn="fadeInUp" animateOnce>
          <h2 className="title_txt">
            <span className="small_txt">サロンマネージャーの</span>
            <br />
            <span className="highlight">3</span>つのポイント
          </h2>
        </ScrollAnimation>
        <div className="point__list">
          <ScrollAnimation animateIn="fadeInUp" delay={250} animateOnce>
            <div className="point__item">
              <h3 className="txt block01">予約・売上の一元管理</h3>
              <p className="non-break-line-md">
                各ネイリストアカウントの
                <br />
                予約/売上/振り込み情報をPCで一括管理！
                <br />
                業務の効率化ができます。
              </p>
              <div className="photo">
                <img
                  src="/assets/images/salon/point1.png"
                  alt="予約の一元管理"
                />
              </div>
            </div>
          </ScrollAnimation>
          <ScrollAnimation animateIn="fadeInUp" delay={500} animateOnce>
            <div className="point__item">
              <h3 className="txt block02">外部予約システムとの連携</h3>
              <p className="non-break-line-md">
                外部予約システムとのスケジュール自動連携！
                <br />
                予約のバッティングを防ぎ、集客の最大化ができます。
              </p>
              <div className="photo">
                <img
                  src="/assets/images/salon/point2.png"
                  alt="外部予約システムとの連携"
                />
              </div>
            </div>
          </ScrollAnimation>
          <ScrollAnimation animateIn="fadeInUp" delay={750} animateOnce>
            <div className="point__item">
              <h3 className="txt block03">予約手数料がよりお得に</h3>
              <p>
                ネイリーから来店したことのあるお客様が
                <br /> 次回同じサロンのどのネイリストに予約をしても、
                <br />
                リピーター（予約手数料０％)としてカウントされます。
              </p>
              <div className="photo">
                <img
                  src="/assets/images/salon/point3.png"
                  alt="業界初のキャンセル料保証"
                />
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* <!-- section | ご利用開始までの流れ --> */}
      <section className="guide">
        <div className="scroll-block pink-block">
          <ScrollAnimation animateIn="fadeInUp" animateOnce>
            <h2 className="title_txt">ご利用開始までの流れ</h2>
          </ScrollAnimation>
          <ScrollAnimation animateIn="fadeInUp" animateOnce>
            <img
              src="/assets/images/salon/flow.svg"
              alt="WEB申込,掲載内容の作成,利用開始"
            />
          </ScrollAnimation>
        </div>
      </section>

      {/* <!-- section | お問い合わせ --> */}
      <div className="scroll-block contact-wrapper">
        <Container>
          <ScrollAnimation animateIn="fadeInUp" animateOnce>
            <h2 className="title_txt">お問い合わせ</h2>
            <p className="sub_txt">
              下記に必要事項をご記入の上お問い合わせください。
              <br />
              返信までお時間を頂くことがあります。
            </p>
          </ScrollAnimation>
          <ScrollAnimation animateIn="fadeInUp" animateOnce>
            <div id="contact-form">
              <ContactForm onSubmit={onSubmit} />
            </div>
          </ScrollAnimation>
        </Container>
      </div>

      {successContact && (
        <Modal
          className="thanks-dialog modal"
          title="お問い合わせありがとうございます"
          maxWidth="sm"
          open={successContact}
          handleClose={onClose}
        >
          <ThankYouBlock japaneseTitle=" " className="thank-you--salon" />
        </Modal>
      )}
    </div>
  );
};

export default SalonLandingPage;
